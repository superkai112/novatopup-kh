require("dotenv").config();

const path = require("node:path");
const express = require("express");
const cors = require("cors");
const { BakongKHQR, khqrData, IndividualInfo } = require("bakong-khqr");
const QRCode = require("qrcode");

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const MERCHANT_NAME = process.env.MERCHANT_NAME || "NexusPay Gaming Hub";
const MERCHANT_CITY = process.env.MERCHANT_CITY || "Phnom Penh";
const ALLOWED_ORIGINS = (process.env.CORS_ORIGIN || `http://localhost:${PORT}`)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({ origin: ALLOWED_ORIGINS }));
app.use(express.json({ limit: "16kb" }));

app.get("/nova-topup-logo.png", (_req, res) => {
  res.sendFile(path.join(__dirname, "nova-topup-logo.png"));
});

app.get("/", (_req, res) => {
  res.sendFile(path.join(__dirname, "nexuspay_game_top_up_store.html"));
});

app.post("/api/generate-khqr", async (req, res) => {
  try {
    const accountId = process.env.BAKONG_ACCOUNT_ID;
    if (!accountId) {
      return res.status(503).json({ error: "BAKONG_ACCOUNT_ID is not configured." });
    }

    if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
      return res.status(400).json({ error: "Request body must be a JSON object." });
    }
    const { amount, currency = "USD", orderId } = req.body;
    const numericAmount = Number(amount);
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({ error: "amount must be a positive number." });
    }
    if (currency !== "USD" && currency !== "KHR") {
      return res.status(400).json({ error: "currency must be USD or KHR." });
    }
    if (currency === "KHR" && !Number.isInteger(numericAmount)) {
      return res.status(400).json({ error: "KHR amount must be a whole number." });
    }
    if (currency === "USD" && Number(numericAmount.toFixed(2)) !== numericAmount) {
      return res.status(400).json({ error: "USD amount cannot have more than two decimal places." });
    }

    const billNumber = orderId || `NXP-${Date.now()}`;
    if (typeof billNumber !== "string" || !/^[A-Za-z0-9-]{1,25}$/.test(billNumber)) {
      return res.status(400).json({ error: "orderId must be 1-25 letters, numbers, or hyphens." });
    }

    const optionalData = {
      currency: currency === "KHR" ? khqrData.currency.khr : khqrData.currency.usd,
      amount: numericAmount,
      billNumber,
      storeLabel: "NexusPay Hub",
      terminalLabel: "WebCheckout",
      expirationTimestamp: Date.now() + 5 * 60 * 1000,
    };
    const individualInfo = new IndividualInfo(
      accountId,
      MERCHANT_NAME,
      MERCHANT_CITY,
      optionalData
    );
    const result = new BakongKHQR().generateIndividual(individualInfo);

    if (result.status.code !== 0) {
      return res.status(400).json({ error: result.status.message });
    }

    const qrImage = await QRCode.toDataURL(result.data.qr, { width: 300, margin: 1 });
    return res.json({
      qrString: result.data.qr,
      md5: result.data.md5,
      qrImage,
      billNumber,
    });
  } catch (error) {
    console.error("Failed to generate KHQR:", error);
    return res.status(500).json({ error: "Unable to generate KHQR." });
  }
});

app.post("/api/check-payment", async (req, res) => {
  try {
    const token = process.env.BAKONG_TOKEN;
    if (!token) {
      return res.status(503).json({ error: "BAKONG_TOKEN is not configured." });
    }

    if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
      return res.status(400).json({ error: "Request body must be a JSON object." });
    }
    const { md5 } = req.body;
    if (typeof md5 !== "string" || !/^[a-f\d]{32}$/i.test(md5)) {
      return res.status(400).json({ error: "md5 must be a 32-character hexadecimal hash." });
    }

    const response = await fetch(
      "https://api-bakong.nbc.gov.kh/v1/check_transaction_by_md5",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ md5 }),
        signal: AbortSignal.timeout(10000),
      }
    );
    const data = await response.json();

    if (!response.ok) {
      console.error("Bakong transaction check failed:", response.status, data);
      return res.status(502).json({
        error: data.responseMessage || "Bakong transaction check failed.",
      });
    }

    return res.json({
      paid: data.responseCode === 0,
      details: data.data || null,
      rawMessage: data.responseMessage || null,
    });
  } catch (error) {
    console.error("Failed to check Bakong payment:", error);
    return res.status(502).json({ error: "Unable to check payment with Bakong." });
  }
});

app.use((error, _req, res, _next) => {
  if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
    return res.status(400).json({ error: "Request body must be valid JSON." });
  }
  console.error("Unhandled request error:", error);
  return res.status(500).json({ error: "Internal server error." });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`NexusPay KHQR API running at http://localhost:${PORT}`);
  });
}

module.exports = app;
