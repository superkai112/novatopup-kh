import React, { useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from '@firebase/auth';
import { auth } from './firebase';

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

function GameLogo({ gameId }) {
  if (gameId === 'mlbb') {
    return (
      <svg
        role="img"
        aria-label="Mobile Legends logo-style emblem"
        viewBox="0 0 240 110"
        className="relative z-10 h-24 w-56 drop-shadow-lg"
      >
        <defs>
          <linearGradient id="ml-emblem" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stopColor="#38bdf8" />
            <stop offset="1" stopColor="#1e3a8a" />
          </linearGradient>
        </defs>
        <path d="M25 55 42 21h49l29 18 29-18h49l17 34-17 34h-49l-29-18-29 18H42L25 55Z" fill="#fbbf24" opacity=".92" />
        <path d="m33 55 14-27h40l33 19 33-19h40l14 27-14 27h-40l-33-19-33 19H47L33 55Z" fill="url(#ml-emblem)" stroke="#dbeafe" strokeWidth="2" />
        <text x="120" y="65" fill="white" fontFamily="Arial, sans-serif" fontSize="39" fontWeight="900" textAnchor="middle" letterSpacing="2">ML</text>
        <text x="120" y="102" fill="#e2e8f0" fontFamily="Arial, sans-serif" fontSize="11" fontWeight="700" textAnchor="middle" letterSpacing="3">MOBILE LEGENDS</text>
      </svg>
    );
  }

  if (gameId === 'ff') {
    return (
      <svg
        role="img"
        aria-label="Free Fire logo-style emblem"
        viewBox="0 0 240 110"
        className="relative z-10 h-24 w-56 drop-shadow-lg"
      >
        <path d="M55 20c-4 18-21 25-16 46 4 16 17 23 30 19-9-8-8-16-2-24 0 10 7 14 12 20 9-9 12-18 7-30 17 15 15 33 5 43h-48c-19-14-19-40-2-57 6-6 11-11 14-17Z" fill="#fb923c" />
        <path d="M63 51c-8 12-4 21 4 29 7-7 10-16 5-24-2 5-5 7-9 9 2-5 2-9 0-14Z" fill="#fde047" />
        <text x="144" y="64" fill="white" fontFamily="Arial, sans-serif" fontSize="29" fontWeight="900" textAnchor="middle" letterSpacing="1">FREE</text>
        <text x="144" y="88" fill="#fdba74" fontFamily="Arial, sans-serif" fontSize="21" fontWeight="900" textAnchor="middle" letterSpacing="4">FIRE</text>
      </svg>
    );
  }

  return (
    <svg
      role="img"
      aria-label="Roblox logo-style emblem"
      viewBox="0 0 240 110"
      className="relative z-10 h-24 w-56 drop-shadow-lg"
    >
      <g transform="rotate(45 63 55)">
        <rect x="34" y="26" width="58" height="58" rx="4" fill="white" />
        <rect x="53" y="45" width="20" height="20" fill="#991b1b" />
      </g>
      <text x="156" y="64" fill="white" fontFamily="Arial, sans-serif" fontSize="25" fontWeight="900" textAnchor="middle" letterSpacing="1">ROBLOX</text>
      <text x="156" y="84" fill="#fca5a5" fontFamily="Arial, sans-serif" fontSize="10" fontWeight="700" textAnchor="middle" letterSpacing="3">GAMING</text>
    </svg>
  );
}

export default function TopUpStore() {
  const [activeStep, setActiveStep] = useState(1);
  const [selectedGameId, setSelectedGameId] = useState('mlbb');
  const [playerId, setPlayerId] = useState('');
  const [zoneId, setZoneId] = useState(''); // Used specifically for games like MLBB
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifiedName, setVerifiedName] = useState(null);
  const [checkoutStep, setCheckoutStep] = useState(1); // 1: Form, 2: Success
  const [user, setUser] = useState(null);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [authError, setAuthError] = useState('');
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState('signup');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const currentGame = GAMES_DATA[selectedGameId];

  useEffect(() => {
    if (!auth) return undefined;

    return onAuthStateChanged(
      auth,
      (currentUser) => {
        setUser(currentUser);
        setAuthError('');
      },
      (error) => {
        setAuthError(`Could not check sign-in status: ${error.message}`);
      },
    );
  }, []);

  const handleAuthSubmit = async (event) => {
    event.preventDefault();
    if (!auth) return;

    setIsSigningIn(true);
    setAuthError('');

    try {
      if (authMode === 'signup') {
        const credential = await createUserWithEmailAndPassword(
          auth,
          email.trim(),
          password,
        );
        await updateProfile(credential.user, { displayName: username.trim() });
        setUser(credential.user);
      } else {
        await signInWithEmailAndPassword(auth, email.trim(), password);
      }

      setIsAuthOpen(false);
      setPassword('');
    } catch (error) {
      if (error.code === 'auth/operation-not-allowed') {
        setAuthError('Email/password accounts are disabled. Enable Email/Password in Firebase Console → Authentication → Sign-in method.');
      } else if (error.code === 'auth/email-already-in-use') {
        setAuthError('That email already has an account. Switch to Log in instead.');
      } else if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        setAuthError('Email or password is incorrect.');
      } else if (error.code === 'auth/weak-password') {
        setAuthError('Choose a password with at least 6 characters.');
      } else if (error.code === 'auth/invalid-email') {
        setAuthError('Enter a valid email address.');
      } else if (error.code === 'auth/configuration-not-found') {
        setAuthError('Firebase Authentication is not set up for this project. Enable Email/Password under Firebase Console → Authentication → Sign-in method.');
      } else {
        setAuthError(`Account ${authMode === 'signup' ? 'creation' : 'login'} failed: ${error.message}`);
      }
    } finally {
      setIsSigningIn(false);
    }
  };

  const openAuth = () => {
    setAuthError('');
    setIsAuthOpen(true);
  };

  const handleLogout = async () => {
    if (!auth) return;

    setAuthError('');
    try {
      await signOut(auth);
    } catch (error) {
      setAuthError(`Could not sign out: ${error.message}`);
    }
  };

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
    setActiveStep(1);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#070b14] font-sans text-slate-100 selection:bg-cyan-400 selection:text-slate-950">
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-48 top-32 h-96 w-96 rounded-full bg-cyan-500/10 blur-[120px]" />
        <div className="absolute -right-48 top-[28rem] h-96 w-96 rounded-full bg-violet-600/10 blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.025)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />
      </div>
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-white/[0.07] bg-[#080c16]/85 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 min-h-20 py-3 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-300 via-cyan-500 to-blue-700 text-xl font-black text-slate-950 shadow-lg shadow-cyan-500/20">
              K
            </div>
            <span className="bg-gradient-to-r from-white via-cyan-100 to-cyan-400 bg-clip-text text-2xl font-black tracking-[0.12em] text-transparent">
              KAIXQ STORE
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <div className="hidden items-center gap-2 text-xs font-medium text-slate-400 sm:flex">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]"></span>
              INSTANT DELIVERY
            </div>
            {user ? (
              <div className="flex items-center gap-3">
                <span className="max-w-40 truncate text-sm text-slate-300">
                  {user.displayName || user.email}
                </span>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:border-white/20 hover:bg-white/[0.08]"
                >
                  Log out
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-start gap-1">
                <button
                  type="button"
                  onClick={openAuth}
                  disabled={!auth}
                  className="rounded-xl bg-gradient-to-r from-cyan-300 to-sky-400 px-4 py-2.5 text-sm font-extrabold text-slate-950 shadow-lg shadow-cyan-950/30 transition hover:from-cyan-200 hover:to-sky-300 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Create account / Log in
                </button>
                {!auth && (
                  <span className="text-xs text-amber-300">
                    Add Firebase settings in .env.local to enable accounts.
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </header>
      {authError && !isAuthOpen && (
        <p role="alert" className="relative mx-auto mt-4 max-w-6xl rounded-xl border border-red-400/20 bg-red-950/40 px-4 py-3 text-sm text-red-300">
          {authError}
        </p>
      )}
      {isAuthOpen && !user && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md">
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="account-dialog-title"
            className="max-h-[calc(100vh-2rem)] w-full max-w-md overflow-y-auto rounded-3xl border border-white/10 bg-[#0b1220] p-6 shadow-2xl shadow-black/50 sm:p-8"
          >
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.22em] text-cyan-300/80">
                  KAIXQ STORE ACCOUNT
                </p>
                <h2 id="account-dialog-title" className="text-2xl font-black text-white">
                  {authMode === 'signup' ? 'Create your account' : 'Welcome back'}
                </h2>
                <p className="mt-2 text-sm text-slate-400">
                  Use your Gmail address or another email.
                </p>
              </div>
              <button
                type="button"
                aria-label="Close account form"
                onClick={() => {
                  setIsAuthOpen(false);
                  setAuthError('');
                }}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 text-slate-400 transition hover:bg-white/[0.06] hover:text-white"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {authMode === 'signup' && (
                <div>
                  <label htmlFor="account-username" className="mb-2 block text-xs font-semibold text-slate-300">
                    Username
                  </label>
                  <input
                    id="account-username"
                    type="text"
                    autoComplete="username"
                    required
                    minLength={2}
                    maxLength={40}
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    placeholder="Choose a username"
                    className="w-full rounded-xl border border-white/10 bg-[#080c16] px-4 py-3.5 text-sm text-white placeholder:text-slate-600 focus:border-cyan-400/70 focus:outline-none focus:ring-4 focus:ring-cyan-400/10"
                  />
                </div>
              )}
              <div>
                <label htmlFor="account-email" className="mb-2 block text-xs font-semibold text-slate-300">
                  Gmail or email
                </label>
                <input
                  id="account-email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@gmail.com"
                  className="w-full rounded-xl border border-white/10 bg-[#080c16] px-4 py-3.5 text-sm text-white placeholder:text-slate-600 focus:border-cyan-400/70 focus:outline-none focus:ring-4 focus:ring-cyan-400/10"
                />
              </div>
              <div>
                <label htmlFor="account-password" className="mb-2 block text-xs font-semibold text-slate-300">
                  Password
                </label>
                <input
                  id="account-password"
                  type="password"
                  autoComplete={authMode === 'signup' ? 'new-password' : 'current-password'}
                  required
                  minLength={6}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full rounded-xl border border-white/10 bg-[#080c16] px-4 py-3.5 text-sm text-white placeholder:text-slate-600 focus:border-cyan-400/70 focus:outline-none focus:ring-4 focus:ring-cyan-400/10"
                />
              </div>
              {authError && (
                <p role="alert" className="rounded-xl border border-red-400/20 bg-red-950/40 px-4 py-3 text-sm text-red-300">
                  {authError}
                </p>
              )}
              <button
                type="submit"
                disabled={isSigningIn || !auth}
                className="w-full rounded-xl bg-gradient-to-r from-cyan-300 to-sky-400 px-5 py-3.5 text-sm font-extrabold text-slate-950 transition hover:from-cyan-200 hover:to-sky-300 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSigningIn
                  ? 'Please wait...'
                  : authMode === 'signup'
                    ? 'Create account'
                    : 'Log in'}
              </button>
            </form>

            <p className="mt-5 text-center text-sm text-slate-400">
              {authMode === 'signup' ? 'Already have an account?' : 'New to KAIXQ STORE?'}{' '}
              <button
                type="button"
                onClick={() => {
                  setAuthMode(authMode === 'signup' ? 'login' : 'signup');
                  setAuthError('');
                }}
                className="font-bold text-cyan-300 hover:text-cyan-200"
              >
                {authMode === 'signup' ? 'Log in' : 'Create account'}
              </button>
            </p>
          </section>
        </div>
      )}

      {/* Main Content */}
      <main className="relative mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-12">
        <section className="relative mb-12 overflow-hidden rounded-[2rem] border border-white/[0.09] bg-slate-900/50 px-6 py-10 shadow-2xl shadow-black/20 backdrop-blur sm:px-10 sm:py-14 lg:px-14">
          <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_at_78%_48%,rgba(34,211,238,0.15),transparent_38%),linear-gradient(115deg,rgba(15,23,42,0.2),rgba(8,145,178,0.06),rgba(15,23,42,0.2))]" />
          <div aria-hidden="true" className="absolute -right-16 -top-32 h-80 w-80 rounded-full border border-cyan-300/10 sm:right-12 sm:top-1/2 sm:-translate-y-1/2">
            <div className="absolute inset-8 rounded-full border border-cyan-300/10" />
            <div className="absolute inset-16 rounded-full border border-cyan-300/10" />
          </div>
          <div className="relative max-w-2xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/[0.07] px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-cyan-200">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" />
              The next level starts here
            </div>
            <h1 className="max-w-xl text-4xl font-black leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
              Power up.
              <span className="block bg-gradient-to-r from-cyan-300 via-sky-400 to-violet-400 bg-clip-text text-transparent">Play without limits.</span>
            </h1>
            <p className="mt-5 max-w-lg text-sm leading-6 text-slate-400 sm:text-base">
              Your favorite games, topped up in seconds. Choose a title, pick your pack, and get back in the game.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 text-xs font-semibold text-slate-300">
              <span className="rounded-full border border-white/10 bg-black/20 px-4 py-2">⚡ Easy checkout</span>
              <span className="rounded-full border border-white/10 bg-black/20 px-4 py-2">💎 Clear pricing</span>
              <span className="rounded-full border border-white/10 bg-black/20 px-4 py-2">🎮 Multiple games</span>
            </div>
          </div>
          <div className="relative mt-8 flex items-center gap-3 border-t border-white/[0.08] pt-5 text-xs text-slate-400 md:absolute md:bottom-8 md:right-10 md:mt-0 md:border-0 md:pt-0 lg:right-14">
            <span className="flex -space-x-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-slate-900 bg-cyan-400 text-xs font-black text-slate-950">M</span>
              <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-slate-900 bg-orange-400 text-xs font-black text-slate-950">F</span>
              <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-slate-900 bg-rose-400 text-xs font-black text-slate-950">R</span>
            </span>
            <span><strong className="text-white">3 games</strong><br />ready to top up</span>
          </div>
        </section>

        <nav aria-label="Top-up progress" className="mb-10 rounded-2xl border border-white/[0.08] bg-slate-900/50 p-4 sm:p-5">
          <ol className="grid grid-cols-3 gap-2">
            {['Choose game', 'Player details', 'Select package'].map((step, index) => {
              const stepNumber = index + 1;
              const isComplete = stepNumber < activeStep;
              const isCurrent = stepNumber === activeStep;

              return (
                <li
                  key={step}
                  aria-current={isCurrent ? 'step' : undefined}
                  className={`flex items-center gap-2 rounded-xl px-2 py-2 sm:gap-3 sm:px-4 ${
                    isCurrent ? 'bg-cyan-300/[0.08]' : ''
                  }`}
                >
                  <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-bold ${
                    isComplete
                      ? 'border-cyan-300 bg-cyan-300 text-slate-950'
                      : isCurrent
                        ? 'border-cyan-300 text-cyan-200'
                        : 'border-white/10 text-slate-500'
                  }`}>
                    {isComplete ? '✓' : `0${stepNumber}`}
                  </span>
                  <span className={`text-[10px] font-bold leading-tight sm:text-xs ${
                    isCurrent ? 'text-white' : isComplete ? 'text-cyan-100' : 'text-slate-500'
                  }`}>
                    {step}
                  </span>
                </li>
              );
            })}
          </ol>
        </nav>

        {/* Section 1: Game Selection */}
        {activeStep === 1 && <section className="mb-12">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.24em] text-cyan-300/80">01 / Choose your game</p>
              <h2 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">Pick your world</h2>
            </div>
            <span className="text-xs text-slate-500">Select a game to see available top-ups</span>
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {Object.values(GAMES_DATA).map((game) => {
              const isSelected = selectedGameId === game.id;
              return (
                <button
                  type="button"
                  key={game.id}
                  aria-pressed={isSelected}
                  onClick={() => {
                    setSelectedGameId(game.id);
                    setSelectedPackage(null);
                    setVerifiedName(null);
                    setPlayerId('');
                    setZoneId('');
                  }}
                  className={`group relative w-full overflow-hidden rounded-3xl border p-4 text-left transition duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 ${
                    isSelected
                      ? 'border-cyan-300/70 bg-slate-900 shadow-xl shadow-cyan-950/40'
                      : 'border-white/[0.08] bg-slate-900/50 hover:-translate-y-1 hover:border-white/20 hover:bg-slate-900/80'
                  }`}
                >
                  {isSelected && <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300 to-transparent" />}
                  <div className={`relative mb-4 flex h-40 items-center justify-center overflow-hidden rounded-2xl border border-white/[0.06] ${game.banner}`}>
                    <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.09),transparent_65%)] transition-transform duration-500 group-hover:scale-125" />
                    <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/30 to-transparent" />
                    <GameLogo gameId={game.id} />
                    {isSelected && <span className="absolute right-3 top-3 rounded-full border border-cyan-200/20 bg-cyan-300/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.16em] text-cyan-200">Selected</span>}
                  </div>
                  <div className="flex items-center justify-between px-1 pb-1">
                    <div>
                      <h3 className="text-base font-extrabold text-white sm:text-lg">{game.name}</h3>
                      <p className="mt-1 text-xs text-slate-400">Instant {game.currency} top-up</p>
                    </div>
                    <span className={`flex h-8 w-8 items-center justify-center rounded-full border text-sm transition ${isSelected ? 'border-cyan-300/50 bg-cyan-300 text-slate-950' : 'border-white/10 text-transparent group-hover:border-white/25'}`}>✓</span>
                  </div>
                </button>
              );
            })}
          </div>
          <div className="mt-7 flex justify-end">
            <button
              type="button"
              onClick={() => setActiveStep(2)}
              className="w-full rounded-xl bg-gradient-to-r from-cyan-300 to-sky-400 px-7 py-3.5 text-sm font-extrabold text-slate-950 shadow-lg shadow-cyan-950/30 transition hover:from-cyan-200 hover:to-sky-300 sm:w-auto"
            >
              Continue to account details <span aria-hidden="true">→</span>
            </button>
          </div>
        </section>}

        {/* Section 2: Enter Player Info & Choose Package Grid */}
        {activeStep === 2 && <div className="mx-auto max-w-2xl">
          
          {/* Left Column: Player Info Form */}
          <div className="h-fit rounded-3xl border border-white/[0.08] bg-slate-900/60 p-6 shadow-xl shadow-black/10 backdrop-blur-xl sm:p-8">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.22em] text-cyan-300/80">02 / Player info</p>
            <h2 className="mb-2 text-xl font-extrabold tracking-tight text-white">Account details</h2>
            <p className="mb-6 text-xs leading-5 text-slate-500">Enter your in-game ID so we can find the right account.</p>
            <form onSubmit={handleVerify} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  {selectedGameId === 'roblox'
                    ? 'Roblox Username'
                    : `Player ID${selectedGameId === 'mlbb' ? ' / User ID' : ''}`}
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder={selectedGameId === 'roblox' ? 'e.g. Builderman' : 'e.g. 12345678'}
                    value={playerId}
                    onChange={(e) => { setPlayerId(e.target.value); setVerifiedName(null); }}
                    className="w-full rounded-xl border border-white/10 bg-[#080c16] px-4 py-3.5 text-sm text-white placeholder:text-slate-600 transition focus:border-cyan-400/70 focus:outline-none focus:ring-4 focus:ring-cyan-400/10"
                  />
                  {selectedGameId === 'mlbb' && (
                    <input
                      type="text"
                      required
                      placeholder="Zone"
                      value={zoneId}
                      onChange={(e) => { setZoneId(e.target.value); setVerifiedName(null); }}
                      className="w-24 rounded-xl border border-white/10 bg-[#080c16] px-3 py-3.5 text-center text-sm text-white placeholder:text-slate-600 transition focus:border-cyan-400/70 focus:outline-none focus:ring-4 focus:ring-cyan-400/10"
                    />
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={isVerifying || !playerId}
                className="w-full rounded-xl border border-white/10 bg-white/[0.06] py-3.5 text-sm font-bold text-slate-200 shadow-sm transition hover:border-cyan-300/30 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
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
            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
              <button
                type="button"
                onClick={() => setActiveStep(1)}
                className="rounded-xl border border-white/10 px-6 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/[0.06]"
              >
                Back
              </button>
              <button
                type="button"
                disabled={!verifiedName}
                onClick={() => setActiveStep(3)}
                className="rounded-xl bg-gradient-to-r from-cyan-300 to-sky-400 px-6 py-3 text-sm font-extrabold text-slate-950 transition hover:from-cyan-200 hover:to-sky-300 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Continue to packages <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>
        </div>}

        {activeStep === 3 && <div className="mx-auto max-w-5xl">
          {/* Package selection */}
          <div className="rounded-3xl border border-white/[0.08] bg-slate-900/60 p-6 shadow-xl shadow-black/10 backdrop-blur-xl sm:p-7">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.22em] text-cyan-300/80">03 / Choose your pack</p>
                <h2 className="text-xl font-extrabold tracking-tight text-white">Select {currentGame.currency}</h2>
              </div>
              <span className="rounded-full border border-white/[0.08] bg-black/20 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">{currentGame.name}</span>
            </div>
            
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {currentGame.packages.map((pkg) => {
                const isSelectedPkg = selectedPackage?.id === pkg.id;
                return (
                  <button
                    type="button"
                    key={pkg.id}
                    aria-pressed={isSelectedPkg}
                    onClick={() => setSelectedPackage(pkg)}
                    className={`group relative flex min-h-28 w-full flex-col justify-between overflow-hidden rounded-2xl border p-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 ${
                      isSelectedPkg
                        ? 'border-cyan-300/60 bg-cyan-400/[0.08] shadow-lg shadow-cyan-950/30'
                        : 'border-white/[0.07] bg-[#080c16]/70 hover:border-white/20 hover:bg-white/[0.04]'
                    }`}
                  >
                    {isSelectedPkg && <span className="absolute right-0 top-0 h-16 w-16 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.18),transparent_70%)]" />}
                    <div>
                      <span className="font-mono text-[10px] uppercase tracking-widest text-slate-500">Pack / {pkg.id}</span>
                      <h4 className="mt-2 text-sm font-bold text-slate-100">{pkg.amount}</h4>
                    </div>
                    <div className="mt-6 flex items-center justify-between">
                      <span className="text-lg font-black tracking-tight text-cyan-300">{pkg.price}</span>
                      <span className={`flex h-5 w-5 items-center justify-center rounded-full border text-[10px] ${isSelectedPkg ? 'border-cyan-300 bg-cyan-300 font-bold text-slate-950' : 'border-white/10 text-transparent'}`}>
                        {isSelectedPkg ? '✓' : ''}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Checkout Trigger Bar */}
            <div className="mt-6 flex flex-col items-start justify-between gap-4 rounded-2xl border border-white/[0.08] bg-black/20 p-4 sm:flex-row sm:items-center sm:p-5">
                <div>
                  {selectedPackage ? (
                    <>
                      <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">Selected item</p>
                      <p className="text-sm font-bold text-slate-200">
                        {selectedPackage.amount} ({currentGame.name}) — <span className="text-cyan-300">{selectedPackage.price}</span>
                      </p>
                    </>
                  ) : (
                    <p className="text-sm text-slate-400">Choose a package to continue.</p>
                  )}
                </div>
                <button
                  onClick={handleCheckout}
                  disabled={!selectedPackage || !verifiedName}
                  className={`w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm tracking-wide shadow-lg transition-all ${
                    selectedPackage && verifiedName
                      ? 'cursor-pointer bg-gradient-to-r from-cyan-300 to-sky-400 text-slate-950 shadow-cyan-500/20 hover:from-cyan-200 hover:to-sky-300' 
                      : 'cursor-not-allowed border border-white/[0.06] bg-white/[0.04] text-slate-500'
                  }`}
                >
                  Proceed to Checkout <span aria-hidden="true">→</span>
                </button>
              </div>
            <div className="mt-4">
              <button
                type="button"
                onClick={() => setActiveStep(2)}
                className="rounded-xl border border-white/10 px-6 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/[0.06]"
              >
                <span aria-hidden="true">←</span> Back to account details
              </button>
            </div>
          </div>

        </div>}
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