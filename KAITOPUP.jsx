import React, { useState } from 'react';

// Game Data with available packages and currency types
const GAMES_DATA = {
  mlbb: {
    id: 'mlbb',
    name: 'Mobile Legends',
    currency: 'Diamonds',
    accentColor: 'from-cyan-500 to-blue-600',
    borderColor: 'hover:border-cyan-500',
    banner: 'bg-gradient-to-br from-blue-900 via-slate-900 to-slate-950',
    packages: [
      { id: 'm1', amount: '50 + 5 Diamonds', price: '$0.99' },
      { id: 'm2', amount: '250 + 25 Diamonds', price: '$4.99' },
      { id: 'm3', amount: '500 + 65 Diamonds', price: '$9.99' },
      { id: 'm4', amount: '1000 + 150 Diamonds', price: '$18.99' },
      { id: 'm5', amount: '2500 + 400 Diamonds', price: '$44.99' },
      { id: 'm6', amount: '5000 + 900 Diamonds', price: '$89.99' },
    ]
  },
  ff: {
    id: 'ff',
    name: 'Free Fire',
    currency: 'Diamonds',
    accentColor: 'from-orange-500 to-amber-600',
    borderColor: 'hover:border-orange-500',
    banner: 'bg-gradient-to-br from-orange-950 via-slate-900 to-slate-950',
    packages: [
      { id: 'f1', amount: '100 Diamonds', price: '$0.99' },
      { id: 'f2', amount: '310 Diamonds', price: '$2.99' },
      { id: 'f3', amount: '520 Diamonds', price: '$4.99' },
      { id: 'f4', amount: '1060 Diamonds', price: '$9.99' },
      { id: 'f5', amount: '2180 Diamonds', price: '$19.99' },
      { id: 'f6', amount: '5600 Diamonds', price: '$49.99' },
    ]
  },
  roblox: {
    id: 'roblox',
    name: 'Roblox',
    currency: 'Robux',
    accentColor: 'from-red-500 to-rose-700',
    borderColor: 'hover:border-red-500',
    banner: 'bg-gradient-to-br from-red-950 via-slate-900 to-slate-950',
    packages: [
      { id: 'r1', amount: '400 Robux', price: '$4.99' },
      { id: 'r2', amount: '800 Robux', price: '$9.99' },
      { id: 'r3', amount: '1,700 Robux', price: '$19.99' },
      { id: 'r4', amount: '4,500 Robux', price: '$49.99' },
      { id: 'r5', amount: '10,000 Robux', price: '$99.99' },
    ]
  }
};

export default function TopUpStore() {
  const [selectedGameId, setSelectedGameId] = useState('mlbb');
  const [playerId, setPlayerId] = useState('');
  const [zoneId, setZoneId] = useState(''); // Used specifically for games like MLBB
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifiedName, setVerifiedName] = useState(null);
  const [checkoutStep, setCheckoutStep] = useState(1); // 1: Form, 2: Success

  const currentGame = GAMES_DATA[selectedGameId];

  // Simulate Player ID validation via API call
  const handleVerify = (e) => {
    e.preventDefault();
    if (!playerId) return;
    
    setIsVerifying(true);
    setVerifiedName(null);

    setTimeout(() => {
      setIsVerifying(false);
      setVerifiedName("ShadowSlayer_99"); // Mocked player username returned from server
    }, 1000);
  };

  const handleCheckout = () => {
    setCheckoutStep(2);
  };

  const resetModal = () => {
    setSelectedPackage(null);
    setVerifiedName(null);
    setPlayerId('');
    setZoneId('');
    setCheckoutStep(1);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-black">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center font-black text-xl shadow-lg shadow-cyan-500/20">
              N
            </div>
            <span className="text-2xl font-black tracking-wider bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-500 bg-clip-text text-transparent">
              NEXUS.STORE
            </span>
          </div>
          <div className="text-sm font-medium text-slate-400 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Automated API Delivery Live
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-10">
        {/* Section 1: Game Selection */}
        <section className="mb-12">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <span className="text-cyan-400">01.</span> Select Game
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.values(GAMES_DATA).map((game) => {
              const isSelected = selectedGameId === game.id;
              return (
                <div
                  key={game.id}
                  onClick={() => {
                    setSelectedGameId(game.id);
                    setSelectedPackage(null);
                    setVerifiedName(null);
                  }}
                  className={`group relative rounded-2xl p-5 cursor-pointer transition-all duration-300 border ${
                    isSelected 
                      ? 'border-cyan-500 bg-slate-900/90 shadow-xl shadow-cyan-500/10 scale-[1.02]' 
                      : 'border-slate-800 bg-slate-900/40 hover:bg-slate-900/70 hover:border-slate-700'
                  }`}
                >
                  <div className={`h-32 rounded-xl mb-4 ${game.banner} border border-slate-800/80 flex items-center justify-center overflow-hidden relative`}>
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                    <span className="text-lg font-bold tracking-widest text-slate-300 z-10">{game.name}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-bold">{game.name}</h3>
                      <p className="text-xs text-slate-400 mt-0.5">Instant {game.currency} Top-Up</p>
                    </div>
                    <div className={`w-6 h-6 rounded-full border flex items-center justify-center ${isSelected ? 'border-cyan-400 bg-cyan-500/20 text-cyan-400' : 'border-slate-700 text-transparent'}`}>
                      ✓
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Section 2: Enter Player Info & Choose Package Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Player Info Form */}
          <div className="lg:col-span-1 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 h-fit backdrop-blur">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <span className="text-cyan-400">02.</span> Account Details
            </h2>
            <form onSubmit={handleVerify} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Player ID {selectedGameId === 'mlbb' && '/ User ID'}
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder="e.g. 12345678"
                    value={playerId}
                    onChange={(e) => { setPlayerId(e.target.value); setVerifiedName(null); }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                  {selectedGameId === 'mlbb' && (
                    <input
                      type="text"
                      required
                      placeholder="Zone"
                      value={zoneId}
                      onChange={(e) => { setZoneId(e.target.value); setVerifiedName(null); }}
                      className="w-24 bg-slate-950 border border-slate-800 rounded-xl px-3 py-3 text-sm text-center focus:outline-none focus:border-cyan-500 transition-colors"
                    />
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={isVerifying || !playerId}
                className="w-full py-3 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 font-semibold rounded-xl text-sm transition-all border border-slate-700 shadow-sm"
              >
                {isVerifying ? 'Verifying Account...' : 'Verify Player ID'}
              </button>
            </form>

            {/* Verified Username Feedback */}
            {verifiedName && (
              <div className="mt-4 p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2 animate-fadeIn">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>Account found: <strong>{verifiedName}</strong></span>
              </div>
            )}
          </div>

          {/* Right Column: Packages Grid */}
          <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <span className="text-cyan-400">03.</span> Select {currentGame.currency} Package
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {currentGame.packages.map((pkg) => {
                const isSelectedPkg = selectedPackage?.id === pkg.id;
                return (
                  <div
                    key={pkg.id}
                    onClick={() => setSelectedPackage(pkg)}
                    className={`rounded-xl p-4 cursor-pointer transition-all border flex flex-col justify-between ${
                      isSelectedPkg
                        ? 'bg-cyan-950/20 border-cyan-500 shadow-md shadow-cyan-500/10'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <span className="text-xs text-slate-500 font-mono">PKG #{pkg.id}</span>
                      <h4 className="font-bold text-base mt-1 text-slate-200">{pkg.amount}</h4>
                    </div>
                    <div className="mt-6 flex items-center justify-between">
                      <span className="text-cyan-400 font-black">{pkg.price}</span>
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center text-xs ${isSelectedPkg ? 'border-cyan-400 bg-cyan-500 text-black font-bold' : 'border-slate-800'}`}>
                        {isSelectedPkg ? '✓' : ''}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Checkout Trigger Bar */}
            {selectedPackage && (
              <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 animate-fadeIn">
                <div>
                  <p className="text-xs text-slate-400">Selected Item:</p>
                  <p className="text-sm font-bold text-slate-200">
                    {selectedPackage.amount} ({currentGame.name}) — <span className="text-cyan-400">{selectedPackage.price}</span>
                  </p>
                </div>
                <button
                  onClick={handleCheckout}
                  disabled={!verifiedName}
                  className={`w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm tracking-wide shadow-lg transition-all ${
                    verifiedName 
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black shadow-cyan-500/20 cursor-pointer' 
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  {verifiedName ? 'Proceed to Checkout →' : 'Verify ID First'}
                </button>
              </div>
            )}
          </div>

        </div>
      </main>

      {/* Checkout / Success Modal Overlay */}
      {selectedPackage && checkoutStep === 2 && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 relative shadow-2xl animate-scaleUp">
            
            {checkoutStep === 2 && (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                  ✓
                </div>
                <h3 className="text-xl font-bold mb-1">Order Placed Successfully!</h3>
                <p className="text-xs text-slate-400 mb-6">
                  Items are being automatically transferred via API to <strong className="text-slate-200">{verifiedName}</strong>.
                </p>
                
                <div className="bg-slate-950 rounded-xl p-4 text-left text-xs space-y-2 mb-6 border border-slate-800/60 font-mono">
                  <div className="flex justify-between text-slate-400">
                    <span>Game:</span> <span className="text-slate-200">{currentGame.name}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Package:</span> <span className="text-slate-200">{selectedPackage.amount}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Player ID:</span> <span className="text-slate-200">{playerId} {zoneId && `(${zoneId})`}</span>
                  </div>
                  <div className="flex justify-between text-slate-400 border-t border-slate-800 pt-2">
                    <span>Total Paid:</span> <span className="text-cyan-400 font-bold">{selectedPackage.price}</span>
                  </div>
                </div>

                <button
                  onClick={resetModal}
                  className="w-full py-3 bg-slate-800 hover:bg-slate-700 font-semibold rounded-xl text-sm transition-all border border-slate-700"
                >
                  Make Another Order
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}