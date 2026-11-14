# Firebase Authentication with Terraform

This configuration enables Email/Password sign-in for `kaixqtopup21`. Google
sign-in is optional and disabled by default.

## Prerequisites

- Terraform 1.5 or later.
- Google Cloud credentials authorized to manage Identity Platform and enable
  Google Cloud APIs in the target project. For local development, authenticate
  with Application Default Credentials using `gcloud auth application-default
  login`.
- If enabling Google sign-in, a Google OAuth 2.0 web client ID and client
  secret. Configure the OAuth consent screen and add
  `https://kaixqtopup21.firebaseapp.com/__/auth/handler` as an authorized
  redirect URI for the OAuth client.

## Enable Email/Password

From this directory, initialize and review the plan before applying:

```powershell
terraform init
terraform plan
terraform apply
```

## Also enable Google sign-in

Provide the OAuth values through environment variables so the client secret
does not need to be written in a `.tfvars` file:

```powershell
$env:TF_VAR_enable_google_sign_in = "true"
$env:TF_VAR_google_oauth_client_id = "your-web-client-id"
$env:TF_VAR_google_oauth_client_secret = "your-web-client-secret"
terraform plan
terraform apply
```

Review the plan before applying. Terraform state contains the Google OAuth
client secret; use encrypted, access-controlled state storage and never commit
state files or credentials.
