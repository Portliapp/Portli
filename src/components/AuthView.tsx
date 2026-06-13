import React, { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff, ShieldCheck, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import PortliLogo from './PortliLogo';

// Design Tokens defined by the FinTech UI/UX guidelines
const T = {
  bg: '#07090f',
  surface: '#0d1117',
  card: '#111927',
  cardHover: '#152030',
  border: '#1a2332',
  accent: '#00c2ff',
  accent2: '#0066ff',
  green: '#00e5a0',
  red: '#ff3d6b',
  text: '#e2e8f4',
  muted: '#4d6380',
  muted2: '#6b84a0',
};

interface AuthViewProps {
  onAuthSuccess: (user: { name: string; tier: string; token: string }) => void;
}

export default function AuthView({ onAuthSuccess }: AuthViewProps) {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [acceptTerms, setAcceptTerms] = useState<boolean>(false);
  
  // UX Interaction States
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Real-time validation derivations based on user inputs
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isEmailEmpty = email.length === 0;
  const isEmailValid = emailRegex.test(email);

  const isPwdEmpty = password.length === 0;
  const hasMinLength = password.length >= 6;
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumberOrSpec = /[0-9]/.test(password) || /[^A-Za-z0-9]/.test(password);
  
  // Strength score metric (0 to 3)
  const pwdScore = (hasMinLength ? 1 : 0) + (hasUppercase ? 1 : 0) + (hasNumberOrSpec ? 1 : 0);
  
  // Custom interactive borders & glows reflecting validated nodes in Portli
  let emailBorder = T.border;
  let emailGlow = 'none';
  if (focusedField === 'email') {
    if (isEmailEmpty) {
      emailBorder = T.accent;
      emailGlow = `0 0 8px ${T.accent}30`;
    } else {
      emailBorder = isEmailValid ? T.green : T.red;
      emailGlow = isEmailValid ? `0 0 8px ${T.green}25` : `0 0 8px ${T.red}25`;
    }
  } else if (!isEmailEmpty) {
    emailBorder = isEmailValid ? `${T.green}b0` : `${T.red}b0`;
  }

  let pwdBorder = T.border;
  let pwdGlow = 'none';
  if (focusedField === 'password') {
    if (isPwdEmpty) {
      pwdBorder = T.accent;
      pwdGlow = `0 0 8px ${T.accent}30`;
    } else {
      pwdBorder = pwdScore === 3 ? T.green : pwdScore === 2 ? T.accent : T.red;
      pwdGlow = pwdScore === 3 ? `0 0 8px ${T.green}25` : pwdScore === 2 ? `0 0 8px ${T.accent}25` : `0 0 8px ${T.red}25`;
    }
  } else if (!isPwdEmpty) {
    pwdBorder = pwdScore === 3 ? `${T.green}b0` : pwdScore === 2 ? `${T.accent}80` : `${T.red}b0`;
  }

  // Validation
  const handleValidate = () => {
    if (!email) {
      setErrorMessage('L\'indirizzo email è obbligatorio.');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage('Inserisci un indirizzo email valido.');
      return false;
    }
    if (!password) {
      setErrorMessage('La password è obbligatoria.');
      return false;
    }
    if (password.length < 6) {
      setErrorMessage('La password deve contenere almeno 6 caratteri.');
      return false;
    }
    if (!isLogin) {
      if (!username.trim()) {
        setErrorMessage('Il nome utente è richiesto per la registrazione.');
        return false;
      }
      if (!acceptTerms) {
        setErrorMessage('Devi accettare i termini di servizio e il GDPR per continuare.');
        return false;
      }
    }
    setErrorMessage(null);
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    if (!handleValidate()) return;

    setIsLoading(true);
    setErrorMessage(null);

    // Simulate server authentication latency
    setTimeout(() => {
      try {
        const dummyToken = `qevora_jwt_${Math.random().toString(36).substring(2, 12)}`;
        const finalUserName = isLogin 
          ? (email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1)) 
          : username.trim();
        
        // Log client payload credentials summary for local dev testing
        console.log('📌 [Portli Auth System] Submit complete:', {
          mode: isLogin ? 'LOGIN' : 'REGISTRATION',
          email,
          username: finalUserName,
          simulatedToken: dummyToken,
          timestamp: new Date().toISOString()
        });

        // Store secure session mocks in localStorage for dashboard persistence
        localStorage.setItem('qevora_auth_token', dummyToken);
        localStorage.setItem('qevora_username', finalUserName);
        localStorage.setItem('qevora_tier', 'Piano Custom Premium'); // Granting premium demo tier access
        
        setSuccessToast(isLogin ? 'Accesso autorizzato!' : 'Registrazione completata!');
        
        setTimeout(() => {
          onAuthSuccess({
            name: finalUserName,
            tier: 'Piano Custom Premium',
            token: dummyToken
          });
          setIsLoading(false);
        }, 800);

      } catch (err) {
        setErrorMessage('Errore nel caricamento delle credenziali di sessione.');
        setIsLoading(false);
      }
    }, 1200);
  };

  // Simulate Google OAuth
  const handleGoogleLogin = () => {
    if (isLoading) return;
    setIsLoading(true);
    setErrorMessage(null);

    setTimeout(() => {
      const dummyToken = 'qevora_jwt_google_oauth_active';
      const googleUser = 'Davide';
      
      console.log('📌 [Portli Auth System] Google Multi-Agent OAuth auth success');
      
      localStorage.setItem('qevora_auth_token', dummyToken);
      localStorage.setItem('qevora_username', googleUser);
      localStorage.setItem('qevora_tier', 'Piano Custom Premium');
      
      setSuccessToast('Autenticato con successo tramite Google Cloud Secure Sign-In');
      
      setTimeout(() => {
        onAuthSuccess({
          name: googleUser,
          tier: 'Piano Custom Premium',
          token: dummyToken
        });
        setIsLoading(false);
      }, 800);
    }, 1000);
  };

  // Switch between views
  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setErrorMessage(null);
    setSuccessToast(null);
  };

  return (
    <div
      id="qevora-auth-container"
      className="flex items-center justify-center p-4 transition-all duration-500"
      style={{
        minHeight: '100vh',
        width: '100%',
        backgroundColor: T.bg,
        position: 'relative',
        overflow: 'hidden',
        fontFamily: '"Inter", sans-serif'
      }}
    >
      {/* Dynamic Keyframe Animations for Cinematic FinTech Glows */}
      <style>{`
        @keyframes qev-dash {
          to {
            stroke-dashoffset: -100;
          }
        }
        @keyframes qev-pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.3;
            filter: drop-shadow(0 0 2px var(--glow-color, #00c2ff));
          }
          50% {
            transform: scale(1.15);
            opacity: 0.8;
            filter: drop-shadow(0 0 8px var(--glow-color, #00c2ff));
          }
        }
        @keyframes qev-float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-8px) rotate(1deg);
          }
        }
        @keyframes qev-float-reverse {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(6px) rotate(-1.5deg);
          }
        }
        @keyframes qev-glowing-glow {
          0%, 100% { opacity: 0.15; }
          50% { opacity: 0.35; }
        }
        .qev-line-flow {
          stroke-dasharray: 12, 12;
          animation: qev-dash 15s linear infinite;
        }
        .qev-pulse-node {
          transform-origin: center;
          animation: qev-pulse 4s ease-in-out infinite;
        }
        .qev-float-cluster-1 {
          animation: qev-float 8s ease-in-out infinite;
        }
        .qev-float-cluster-2 {
          animation: qev-float-reverse 10s ease-in-out infinite;
        }
      `}</style>

      {/* Embedded High-Fidelity Asset & Network Background Layout (Layered behind main card) */}
      <div 
        id="qevora-geometric-background-network"
        className="absolute inset-0 pointer-events-none select-none transition-opacity duration-700"
        style={{ zIndex: 1, backgroundColor: T.bg }}
      >
        {/* Floating Ambient Glow Particles across the entire screen */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 2 }}>
          {[...Array(6)].map((_, i) => {
            // Distributed positions across the full width and height
            const leftPercent = [15, 80, 20, 75, 45, 85][i];
            const topPercent = [12, 18, 70, 78, 5, 88][i];
            const size = [12, 16, 14, 20, 10, 18][i];
            const color = [T.accent, T.green, '#f59e0b', T.red, '#a78bfa', T.accent][i];
            const duration = [12, 15, 18, 14, 10, 16][i];
            
            return (
              <motion.div
                key={`ambient-particle-${i}`}
                className="absolute rounded-full filter blur-[2px] opacity-20"
                style={{
                  top: `${topPercent}%`,
                  left: `${leftPercent}%`,
                  width: size,
                  height: size,
                  backgroundColor: color,
                  boxShadow: `0 0 10px ${color}`
                }}
                animate={{
                  y: [0, -25, 25, 0],
                  x: [0, 20, -20, 0],
                  opacity: [0.15, 0.4, 0.2, 0.15],
                  scale: [1, 1.2, 0.9, 1]
                }}
                transition={{
                  duration: duration,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            );
          })}
        </div>

        {/* Vector SVG Canvas */}
        <svg 
          width="100%" 
          height="100%" 
          style={{ width: '100vw', height: '100vh', position: 'absolute', top: 0, left: 0 }}
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Rich Palette Gradients */}
            <linearGradient id="gold-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffe4a0" />
              <stop offset="50%" stopColor="#ffd166" />
              <stop offset="100%" stopColor="#b8860b" />
            </linearGradient>
            <linearGradient id="silver-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="50%" stopColor="#cbd5e1" />
              <stop offset="100%" stopColor="#64748b" />
            </linearGradient>
            <linearGradient id="cyan-glow-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00c2ff" />
              <stop offset="100%" stopColor="#0066ff" />
            </linearGradient>
            <linearGradient id="green-glow-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00e5a0" />
              <stop offset="100%" stopColor="#00a875" />
            </linearGradient>
            <linearGradient id="red-glow-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ff3d6b" />
              <stop offset="100%" stopColor="#cc0e3e" />
            </linearGradient>

            {/* Glowing Atmosphere Filters */}
            <filter id="qev-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="qev-heavy-blur" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="25" />
            </filter>
            <filter id="qev-light-blur" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3" />
            </filter>
          </defs>

          {/* BACKGROUND STEP A: Cosmic Glimmer and Color Wash Orbs */}
          <g opacity="0.3" filter="url(#qev-heavy-blur)">
            {/* Cyan core ambient left */}
            <circle cx="15%" cy="25%" r="220" fill="#00c2ff" />
            {/* Deep ocean blue right */}
            <circle cx="85%" cy="70%" r="280" fill="#0066ff" />
            {/* Gold dust top right */}
            <circle cx="90%" cy="15%" r="180" fill="#ffd166" opacity="0.4" />
            {/* Emerald green glow bottom left */}
            <circle cx="10%" cy="85%" r="200" fill="#00e5a0" opacity="0.3" />
          </g>

          {/* BACKGROUND STEP B: Sophisticated Technical Matrix Grids & Crosshairs */}
          <g stroke="#1a2332" strokeWidth="0.5" opacity="0.25">
            {/* Horizontal dividers */}
            <line x1="0%" y1="10%" x2="100%" y2="10%" />
            <line x1="0%" y1="20%" x2="100%" y2="20%" />
            <line x1="0%" y1="30%" x2="100%" y2="30%" />
            <line x1="0%" y1="40%" x2="100%" y2="40%" />
            <line x1="0%" y1="50%" x2="100%" y2="50%" />
            <line x1="0%" y1="60%" x2="100%" y2="60%" />
            <line x1="0%" y1="70%" x2="100%" y2="70%" />
            <line x1="0%" y1="80%" x2="100%" y2="80%" />
            <line x1="0%" y1="90%" x2="100%" y2="90%" />

            {/* Vertical dividers */}
            <line x1="10%" y1="0%" x2="10%" y2="100%" />
            <line x1="20%" y1="0%" x2="20%" y2="100%" />
            <line x1="30%" y1="0%" x2="30%" y2="100%" />
            <line x1="40%" y1="0%" x2="40%" y2="100%" />
            <line x1="50%" y1="0%" x2="50%" y2="100%" />
            <line x1="60%" y1="0%" x2="60%" y2="100%" />
            <line x1="70%" y1="0%" x2="70%" y2="100%" />
            <line x1="80%" y1="0%" x2="80%" y2="100%" />
            <line x1="90%" y1="0%" x2="90%" y2="100%" />
          </g>

          {/* Geometric constellation dots acting as grid locks */}
          <g fill="#4d6380" opacity="0.3" transform="scale(1)">
            <circle cx="10%" cy="10%" r="1.5" />
            <circle cx="30%" cy="10%" r="1.5" />
            <circle cx="70%" cy="10%" r="1.5" />
            <circle cx="90%" cy="10%" r="1.5" />
            <circle cx="20%" cy="30%" r="1.5" />
            <circle cx="80%" cy="30%" r="1.5" />
            <circle cx="10%" cy="50%" r="1.5" />
            <circle cx="90%" cy="50%" r="1.5" />
            <circle cx="30%" cy="70%" r="1.5" />
            <circle cx="70%" cy="70%" r="1.5" />
            <circle cx="20%" cy="90%" r="1.5" />
            <circle cx="80%" cy="90%" r="1.5" />
          </g>

          {/* BACKGROUND STEP C: Intersecting Data Flow and Glowing Constellation Lines */}
          <g fill="none" opacity="0.22">
            {/* Flow line 1 */}
            <path 
              d="M-50,150 L 250,150 L 350,300 L 250,550 L -10,800" 
              className="qev-line-flow" 
              stroke="url(#cyan-glow-grad)" 
              strokeWidth="1.2"
            />
            {/* Flow line 2 */}
            <path 
              d="M1200,80 L 1050,180 L 1150,380 L 980,520 L 1100,850" 
              className="qev-line-flow" 
              stroke="url(#gold-gradient)" 
              strokeWidth="1.2"
            />
            {/* Mesh flow overlaying center to bind clusters */}
            <path 
              d="M 150,220 L 400,100 L 950,250 L 1150,180" 
              stroke="#00c2ff" 
              strokeWidth="0.8" 
              strokeDasharray="4,6"
            />
            <path 
              d="M 120,750 L 320,820 L 780,900 L 1100,750" 
              stroke="#ffd166" 
              strokeWidth="0.8" 
              strokeDasharray="4,6"
            />
          </g>

          {/* BACKGROUND STEP D: Subtle trend lines with blurred candlesticks distributed over percentages */}
          <svg x="15%" y="72%" width="120" height="120" style={{ overflow: 'visible' }}>
            <g opacity="0.25">
              <g transform="translate(0, 0)">
                {/* Bull 1 */}
                <line x1="10" y1="20" x2="10" y2="70" stroke="#00e5a0" strokeWidth="1" />
                <rect x="6" y="30" width="8" height="25" fill="#00e5a0" rx="1" />
                {/* Bull 2 */}
                <line x1="30" y1="5" x2="30" y2="55" stroke="#00e5a0" strokeWidth="1" />
                <rect x="26" y="15" width="8" height="30" fill="#00e5a0" rx="1" />
                {/* Bull 3 */}
                <line x1="50" y1="-10" x2="50" y2="35" stroke="#00e5a0" strokeWidth="1" />
                <rect x="46" y="2" width="8" height="20" fill="#00e5a0" rx="1" />
              </g>
            </g>
          </svg>

          <svg x="82%" y="24%" width="120" height="120" style={{ overflow: 'visible' }}>
            <g opacity="0.25">
              <g transform="translate(0, 0)">
                {/* Bear 1 */}
                <line x1="10" y1="10" x2="10" y2="60" stroke="#ff3d6b" strokeWidth="1" />
                <rect x="6" y="20" width="8" height="30" fill="#ff3d6b" rx="1" />
                {/* Bear 2 */}
                <line x1="30" y1="25" x2="30" y2="75" stroke="#ff3d6b" strokeWidth="1" />
                <rect x="26" y="35" width="8" height="25" fill="#ff3d6b" rx="1" />
              </g>
            </g>
          </svg>


          {/* =======================================================
              CLUSTER 1: CRYPTOCURRENCY DATA NETWORK (TOP RIGHT REGION) - RESPONSIVE PERCENTAGE
             ======================================================= */}
          <svg x="82%" y="10%" width="300" height="300" style={{ overflow: 'visible' }}>
            <g 
              id="qev-cluster-crypto" 
              transform="translate(0, 0)" 
              className="qev-float-cluster-1"
            >
              {/* Core glowing network background */}
              <circle cx="100" cy="110" r="130" fill="#00c2ff" opacity="0.03" filter="url(#qev-heavy-blur)" />
              <path d="M 50,60 L 120,60 L 160,110 L 120,160 L 50,160" fill="none" stroke="#00a875" strokeWidth="0.8" strokeDasharray="3,3" opacity="0.4" />
              <path d="M 120,60 L 190,40 M 160,110 L 220,140 M 120,160 L 180,210" stroke="#1a2332" strokeWidth="1" opacity="0.5" />

              {/* Bitcoin High-Fidelity Circle Coin */}
              <g transform="translate(48, 48)">
                {/* Embossed Outer Rim */}
                <circle cx="20" cy="20" r="18" fill="url(#gold-gradient)" stroke="#ffd166" strokeWidth="1.2" filter="url(#qev-glow)" />
                <circle cx="20" cy="20" r="13" fill="#111927" />
                {/* Bitcoin B Vector */}
                <path 
                  d="M17 10h5a3 3 0 0 1 2 5.5A3 3 0 0 1 21 21 M17 10v11v-11zm0 5h5 M17 15h4 M19 8v2 M21 8v2 M19 21v2 M21 21v2" 
                  stroke="url(#gold-gradient)" 
                  strokeWidth="1.8" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                />
                <circle cx="20" cy="20" r="18" fill="none" stroke="#ffd166" strokeWidth="0.8" className="qev-pulse-node" style={{ '--glow-color': '#ffd166' } as any} />
              </g>
              <text x="50" y="38" fill="#ffd166" fontSize="7" fontWeight="bold" letterSpacing="1" fontFamily="sans-serif">BTC ACTIVE CORE</text>

              {/* Ethereum Glowing Crystalline shape */}
              <g transform="translate(145, 95)" filter="url(#qev-glow)">
                {/* Core shape drawing */}
                <polygon points="18,0 36,25 18,34 0,25" fill="none" stroke="#00c2ff" strokeWidth="1" />
                <polygon points="18,34 36,25 18,48 0,25" fill="none" stroke="#0066ff" strokeWidth="1" />
                <line x1="18" y1="0" x2="18" y2="48" stroke="#00c2ff" strokeWidth="0.8" />
                <line x1="0" y1="25" x2="36" y2="25" stroke="#00c2ff" strokeWidth="0.6" opacity="0.6" />
                {/* Radiant nodes around Ethereum */}
                <circle cx="18" cy="24" r="3" fill="#00e5a0" className="qev-pulse-node" />
              </g>
              <text x="135" y="156" fill="#00c2ff" fontSize="7" fontWeight="bold" letterSpacing="1" fontFamily="sans-serif">ETH SMART NODE</text>

              {/* Decentralized Ledger Nodes and Data Lines */}
              <circle cx="50" cy="180" r="3" fill="#64748b" />
              <circle cx="190" cy="40" r="2.5" fill="#00c2ff" className="qev-pulse-node" />
              <circle cx="220" cy="140" r="2" fill="#00e5a0" />
              <circle cx="180" cy="210" r="3.5" fill="#ffd166" />
            </g>
          </svg>


          {/* =======================================================
              CLUSTER 2: COMMODITIES / MATERIE PRIME (BOTTOM RIGHT REGION) - RESPONSIVE PERCENTAGE
             ======================================================= */}
          <svg x="82%" y="65%" width="300" height="300" style={{ overflow: 'visible' }}>
            <g 
              id="qev-cluster-commodities" 
              transform="translate(0, 0)" 
              className="qev-float-cluster-2"
            >
              {/* Ambient gold-ish copper background cloud */}
              <circle cx="80" cy="100" r="110" fill="#ffd166" opacity="0.02" filter="url(#qev-heavy-blur)" />
              
              {/* Ground grid for coordinates */}
              <path d="M 10,120 L 170,120 M 10,120 L 50,60 M 170,120 L 130,60 M 50,60 L 130,60" stroke="#1a2332" strokeWidth="0.8" opacity="0.4" />

              {/* Gilded stacked Gold Bars representing Commodities */}
              <g transform="translate(30, 60)" filter="url(#qev-glow)">
                {/* Isometric Gold Bar 1 (Bottom Left) */}
                <polygon points="5,25 25,18 40,25 20,32" fill="url(#gold-gradient)" stroke="#ffd166" strokeWidth="0.5" />
                <polygon points="20,32 40,25 40,32 20,39" fill="#8c6200" stroke="#ffd166" strokeWidth="0.5" />
                <polygon points="5,25 20,32 20,39 5,32" fill="#5c4000" stroke="#ffd166" strokeWidth="0.5" />

                {/* Isometric Gold Bar 2 (Bottom Right) */}
                <polygon points="22,21 42,14 57,21 37,28" fill="url(#gold-gradient)" stroke="#ffd166" strokeWidth="0.5" />
                <polygon points="37,28 57,21 57,28 37,35" fill="#8c6200" stroke="#ffd166" strokeWidth="0.5" />
                <polygon points="22,21 37,28 37,35 22,28" fill="#5c4000" stroke="#ffd166" strokeWidth="0.5" />

                {/* Isometric Gold Bar 3 (Top / Stacked) */}
                <polygon points="14,14 34,7 49,14 29,21" fill="url(#gold-gradient)" stroke="#ffe4a0" strokeWidth="0.6" />
                <polygon points="29,21 49,14 49,21 29,28" fill="#baa25e" stroke="#ffe4a0" strokeWidth="0.5" />
                <polygon points="14,14 29,21 29,28 14,21" fill="#7d6832" stroke="#ffe4a0" strokeWidth="0.5" />

                <text x="8" y="-1" fill="#ffd166" fontSize="5.5" fontWeight="bold" letterSpacing="0.5">GOLD 999.9</text>
              </g>

              {/* Stylized Oil Barrel with metallic reflections */}
              <g transform="translate(110, 50)">
                {/* Cylinder top */}
                <ellipse cx="18" cy="10" rx="14" ry="4.5" fill="url(#silver-gradient)" stroke="#94a3b8" strokeWidth="0.8" />
                <ellipse cx="18" cy="10" rx="10" ry="3" fill="#0d1117" />
                {/* Cylinder Body */}
                <rect x="4" y="10" width="28" height="28" fill="url(#silver-gradient)" stroke="#94a3b8" strokeWidth="0.8" />
                {/* Dynamic Ridges */}
                <line x1="4" y1="18" x2="32" y2="18" stroke="#cbd5e1" strokeWidth="1" />
                <line x1="4" y1="28" x2="32" y2="28" stroke="#cbd5e1" strokeWidth="1" />
                <ellipse cx="18" cy="38" rx="14" ry="4.5" fill="#475569" stroke="#94a3b8" strokeWidth="0.8" />
                {/* Oil Drop Indicator Icon */}
                <path d="M18,18 Q22,24 18,27 Q14,24 18,18 Z" fill="#ffd166" opacity="0.8" />
                
                <text x="-4" y="47" fill="#cbd5e1" fontSize="5.5" fontWeight="bold">BRENT OIL</text>
              </g>
              <text x="35" y="142" fill="#ffd166" fontSize="7" fontWeight="bold" letterSpacing="1">COMMODITIES DUST</text>
            </g>
          </svg>


          {/* =======================================================
              CLUSTER 3: ETF - EXCHANGE-TRADED FUNDS (TOP LEFT REGION) - RESPONSIVE PERCENTAGE
             ======================================================= */}
          <svg x="8%" y="10%" width="300" height="300" style={{ overflow: 'visible' }}>
            <g 
              id="qev-cluster-etfs" 
              transform="translate(0, 0)" 
              className="qev-float-cluster-2"
            >
              {/* Ambient Core glow */}
              <circle cx="80" cy="80" r="110" fill="#00e5a0" opacity="0.02" filter="url(#qev-heavy-blur)" />

              {/* Vector Pie Chart Segment Overlay (Compounding ETF) */}
              <g transform="translate(45, 45)" filter="url(#qev-glow)">
                {/* Outer boundary circle tracker */}
                <circle cx="30" cy="30" r="28" fill="none" stroke="#1a2332" strokeWidth="4" />
                {/* Stocks tranche */}
                <circle cx="30" cy="30" r="28" fill="none" stroke="url(#cyan-glow-grad)" strokeWidth="4" strokeDasharray="176" strokeDashoffset="40" />
                {/* Cash tranche */}
                <circle cx="30" cy="30" r="28" fill="none" stroke="url(#green-glow-grad)" strokeWidth="4" strokeDasharray="176" strokeDashoffset="120" />
                {/* Core inner hub */}
                <circle cx="30" cy="30" r="18" fill="#111927" stroke="#1a2332" strokeWidth="1" />
                <text x="30" y="32" textAnchor="middle" fill="#e2e8f4" fontSize="7" fontWeight="bold">ETF</text>
              </g>

              {/* Elegant miniature bar chart showing allocation index */}
              <g transform="translate(125, 48)" strokeWidth="1" fill="none">
                <line x1="0" y1="35" x2="35" y2="35" stroke="#4d6380" />
                <line x1="0" y1="0" x2="0" y2="35" stroke="#4d6380" />
                
                {/* Bar 1 */}
                <rect x="4" y="15" width="4" height="20" fill="url(#cyan-glow-grad)" stroke="none" />
                {/* Bar 2 */}
                <rect x="11" y="8" width="4" height="27" fill="url(#green-glow-grad)" stroke="none" />
                {/* Bar 3 */}
                <rect x="18" y="22" width="4" height="13" fill="url(#silver-gradient)" stroke="none" />
                {/* Bar 4 */}
                <rect x="25" y="2" width="4" height="33" fill="url(#gold-gradient)" stroke="none" />
              </g>

              <line x1="75" y1="105" x2="140" y2="105" stroke="#1a2332" strokeWidth="1" />
              <circle cx="140" cy="105" r="2" fill="#00e5a0" />
              <text x="45" y="120" fill="#00e5a0" fontSize="7" fontWeight="bold" letterSpacing="1">ETF COMPOUND INDEX</text>
            </g>
          </svg>


          {/* =======================================================
              CLUSTER 4: REAL ESTATE / IMMOBILIARE (BOTTOM LEFT REGION) - RESPONSIVE PERCENTAGE
             ======================================================= */}
          <svg x="8%" y="65%" width="300" height="300" style={{ overflow: 'visible' }}>
            <g 
              id="qev-cluster-realestate" 
              transform="translate(0, 0)" 
              className="qev-float-cluster-1"
            >
              {/* Ambient wash */}
              <circle cx="80" cy="110" r="110" fill="#0066ff" opacity="0.03" filter="url(#qev-heavy-blur)" />

              {/* Micro grid alignment */}
              <path d="M 10,130 L 170,130" stroke="#1a2332" strokeWidth="1" />

              {/* Gilded blueprint of Property Structure */}
              <g transform="translate(25, 45)" filter="url(#qev-glow)">
                {/* Structural Building Base */}
                <polygon points="15,45 45,30 75,45 45,60" fill="none" stroke="#00c2ff" strokeWidth="0.8" />
                
                {/* Front left pillar facet */}
                <polygon points="15,45 45,30 45,-10 15,5" fill="#111927" stroke="#1a2332" strokeWidth="0.8" opacity="0.6" />
                {/* Front right pillar facet */}
                <polygon points="45,30 75,45 75,10 45,-10" fill="#0d1117" stroke="#1a2332" strokeWidth="0.8" opacity="0.6" />

                {/* Holographic Glowing wireframe accents */}
                <line x1="15" y1="45" x2="15" y2="5" stroke="#00c2ff" strokeWidth="1" />
                <line x1="45" y1="30" x2="45" y2="-10" stroke="#00e5a0" strokeWidth="1" />
                <line x1="75" y1="45" x2="75" y2="10" stroke="#00c2ff" strokeWidth="1" />
                <line x1="15" y1="5" x2="45" y2="-10" stroke="#00c2ff" strokeWidth="1" />
                <line x1="45" y1="-10" x2="75" y2="10" stroke="#00c2ff" strokeWidth="1" />

                {/* Glowing window arrays */}
                <circle cx="25" cy="15" r="1" fill="#ffd166" className="qev-pulse-node" />
                <circle cx="35" cy="10" r="1" fill="#ffd166" />
                <circle cx="25" cy="27" r="1" fill="#ffd166" />
                <circle cx="35" cy="22" r="1" fill="#ffd166" className="qev-pulse-node" />

                <circle cx="55" cy="18" r="1" fill="#ffd166" />
                <circle cx="65" cy="23" r="1" fill="#ffd166" className="qev-pulse-node" />
                <circle cx="55" cy="30" r="1" fill="#ffd166" />
                <circle cx="65" cy="35" r="1" fill="#ffd166" />

                <text x="14" y="-18" fill="#00c2ff" fontSize="6.2" fontWeight="bold">HQ COMMERCIAL PRO</text>
              </g>

              {/* Residential House Outline Vector */}
              <g transform="translate(115, 75)" filter="url(#qev-glow)">
                <polygon points="15,0 30,12 30,32 0,32 0,12" fill="none" stroke="url(#gold-gradient)" strokeWidth="1" />
                <polygon points="15,0 30,12 0,12" fill="url(#gold-gradient)" opacity="0.15" />
                {/* Door & Window details */}
                <rect x="10" y="20" width="10" height="12" fill="none" stroke="#ffd166" strokeWidth="0.8" />
                <circle cx="22" cy="18" r="2.2" fill="none" stroke="#ffd166" strokeWidth="0.8" />
                <text x="-12" y="42" fill="#ffd166" fontSize="5.5" fontWeight="bold">RESIDENTIAL</text>
              </g>
              <text x="35" y="146" fill="#00c2ff" fontSize="7" fontWeight="bold" letterSpacing="1">IMMOBILIARE HOLOGRID</text>
            </g>
          </svg>


          {/* =======================================================
              CLUSTER 5: CURRENCIES / VALUTE SYMBOLS (AROUND CARD IN CENTER) - RESPONSIVE PERCENTAGE
             ======================================================= */}
          <g id="qev-cluster-global-currencies" opacity="0.25">
            {/* Gilded Dollar Symbol ($) Orbits */}
            <svg x="35%" y="28%" width="40" height="40" style={{ overflow: 'visible' }}>
              <g transform="translate(0,0)" filter="url(#qev-glow)">
                <circle cx="10" cy="10" r="12" fill="none" stroke="#ffe4a0" strokeWidth="0.5" strokeDasharray="2,3" />
                <text x="6" y="14" fill="url(#gold-gradient)" fontSize="12" fontWeight="bold" fontFamily="serif">$</text>
              </g>
            </svg>

            {/* Silvered Euro Symbol (€) Orbits */}
            <svg x="32%" y="68%" width="40" height="40" style={{ overflow: 'visible' }}>
              <g transform="translate(0,0)" filter="url(#qev-glow)">
                <circle cx="10" cy="10" r="12" fill="none" stroke="#cbd5e1" strokeWidth="0.5" strokeDasharray="3,3" />
                <text x="6" y="14" fill="url(#silver-gradient)" fontSize="11" fontWeight="bold" fontFamily="serif">€</text>
              </g>
            </svg>

            {/* Glowing Yen Symbol (¥) */}
            <svg x="65%" y="28%" width="40" height="40" style={{ overflow: 'visible' }}>
              <g transform="translate(0,0)" filter="url(#qev-glow)">
                <circle cx="10" cy="10" r="12" fill="none" stroke="#00c2ff" strokeWidth="0.5" strokeDasharray="2,3" />
                <text x="6" y="13" fill="#00c2ff" fontSize="10" fontWeight="bold" fontFamily="serif">¥</text>
              </g>
            </svg>

            {/* Pound Symbol (£) */}
            <svg x="62%" y="68%" width="40" height="40" style={{ overflow: 'visible' }}>
              <g transform="translate(0,0)" filter="url(#qev-glow)">
                <circle cx="10" cy="10" r="12" fill="none" stroke="#ffe4a0" strokeWidth="0.5" strokeDasharray="2,3" />
                <text x="7" y="13" fill="url(#gold-gradient)" fontSize="11" fontWeight="bold" fontFamily="serif">£</text>
              </g>
            </svg>
          </g>
        </svg>

        {/* Dynamic scanlines for actual computer display console look */}
        <div 
          className="absolute inset-0 pointer-events-none" 
          style={{
            background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%)',
            backgroundSize: '100% 4px',
            opacity: 0.15
          }}
        />
      </div>

      {/* Main card panel wrapper */}
      <AnimatePresence mode="wait">
        <motion.div
          key={isLogin ? "login" : "register"}
          initial={{ x: isLogin ? -60 : 60, opacity: 0, scale: 0.98 }}
          animate={{ x: 0, opacity: 1, scale: 1 }}
          exit={{ x: isLogin ? 60 : -60, opacity: 0, scale: 0.98 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 28,
            mass: 1
          }}
          id="qevora-auth-card"
          className="relative w-full shadow-2xl"
          style={{
            maxWidth: '420px',
            backgroundColor: T.card,
            border: `1px solid ${T.border}`,
            borderRadius: '16px',
            padding: '36px',
            zIndex: 10,
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)'
          }}
        >
        {/* Success Toast Indicator */}
        {successToast && (
          <div
            className="absolute top-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-semibold shadow-lg transition-all duration-300"
            style={{
              backgroundColor: `${T.green}20`,
              border: `1px solid ${T.green}`,
              color: T.green,
              zIndex: 30,
              backdropFilter: 'blur(8px)'
            }}
          >
            <ShieldCheck size={16} />
            <span>{successToast}</span>
          </div>
        )}

        {/* Brand Header */}
        <div className="flex flex-col items-center mb-8">
          {/* Logo container utilizing the requested 'Q' styled visual with high-contrast custom gradients */}
          <div 
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '14px',
              border: `1px solid ${T.border}`,
              backgroundColor: T.surface,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px',
              boxShadow: `0 4px 20px ${T.accent}15`,
              position: 'relative'
            }}
          >
            {/* Holographic inner circle */}
            <div 
              style={{
                position: 'absolute',
                inset: '2px',
                borderRadius: '12px',
                background: `linear-gradient(135deg, ${T.accent}10, ${T.accent2}10)`,
                zIndex: 1
              }}
            />
            {/* Custom stylized vector shape of 'P' (Portli) */}
            <div style={{ zIndex: 2 }}>
              <PortliLogo size={36} />
            </div>
          </div>

          <h2
            className="text-2xl font-bold tracking-tight mb-2 text-center"
            style={{ color: T.text }}
          >
            {isLogin ? 'Bentornato su Portli' : 'Crea il tuo account'}
          </h2>
          <p
            className="text-xs text-center leading-relaxed"
            style={{ color: T.muted2 }}
          >
            {isLogin
              ? 'Accedi per tracciare il tuo portafoglio quantistico'
              : 'Inserisci le credenziali per attivare il tuo ledger cifrato'}
          </p>
        </div>

        {/* Global Error Banner */}
        {errorMessage && (
          <div
            className="mb-5 p-3 rounded-lg text-xs leading-relaxed transition-all duration-300"
            style={{
              backgroundColor: `${T.red}12`,
              border: `1px solid ${T.red}30`,
              color: T.red
            }}
          >
            {errorMessage}
          </div>
        )}

        {/* Social Authentication Container: OAuth Simulation */}
        <button
          id="qevora-social-oauth-btn"
          type="button"
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="w-full flex items-center justify-center space-x-3 py-3 px-4 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer disabled:opacity-50"
          style={{
            backgroundColor: 'transparent',
            border: `1px solid ${T.border}`,
            color: T.text,
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = T.surface;
            e.currentTarget.style.borderColor = T.accent;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.borderColor = T.border;
          }}
        >
          {/* Custom Google Visual G Grid */}
          <svg className="h-4 w-4 mr-1" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M12 5.04c1.62 0 3.08.56 4.22 1.64l3.15-3.15C17.45 1.68 14.9 1 12 1 7.35 1 3.32 3.68 1.41 7.6l3.86 3C6.18 7.36 8.84 5.04 12 5.04z"
            />
            <path
              fill="#4285F4"
              d="M23.49 12.27c0-.81-.07-1.59-.2-2.35H12v4.51h6.44c-.28 1.47-1.11 2.71-2.36 3.55l3.65 2.83c2.13-1.97 3.36-4.87 3.36-8.54z"
            />
            <path
              fill="#FBBC05"
              d="M5.27 14.17A7.16 7.16 0 0 1 4.9 12c0-.76.13-1.49.37-2.17L1.41 6.83A11.94 11.94 0 0 0 0 12c0 1.87.43 3.64 1.2 5.24l4.07-3.07z"
            />
            <path
              fill="#34A853"
              d="M12 23c3.24 0 5.97-1.08 7.96-2.91l-3.65-2.83c-1.01.68-2.31 1.08-4.31 1.08-3.16 0-5.82-2.32-6.77-5.56L1.16 15.8C3.07 19.72 7.1 23 12 23z"
            />
          </svg>
          <span className="font-semibold text-xs tracking-wider uppercase">Continua con Google</span>
        </button>

        {/* Visual Divider using specified design tokens */}
        <div className="flex items-center my-6">
          <div style={{ flex: 1, height: '1px', backgroundColor: T.border }} />
          <span
            className="px-3 text-2xs uppercase tracking-wider font-semibold whitespace-nowrap"
            style={{ color: T.muted }}
          >
            oppure continua con la mail
          </span>
          <div style={{ flex: 1, height: '1px', backgroundColor: T.border }} />
        </div>

        {/* Interactive Credential Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* EXTRA INPUT FIELD: Username for Registrazione Mode */}
          {!isLogin && (
            <div className="space-y-1">
              <label
                className="block text-2xs uppercase tracking-widest font-bold"
                style={{ color: T.muted2 }}
              >
                Nome Utente
              </label>
              <div className="relative">
                <span
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: focusedField === 'username' ? T.accent : T.muted,
                    transition: 'color 0.2s'
                  }}
                >
                  <User size={16} />
                </span>
                <input
                  id="qevora-auth-username"
                  type="text"
                  placeholder="Inserisci il tuo nome"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onFocus={() => setFocusedField('username')}
                  onBlur={() => setFocusedField(null)}
                  required={!isLogin}
                  disabled={isLoading}
                  className="w-full text-xs font-medium py-3 pl-10 pr-4 rounded-xl transition-all duration-200 focus:outline-none"
                  style={{
                    backgroundColor: T.surface,
                    border: `1px solid ${focusedField === 'username' ? T.accent : T.border}`,
                    color: T.text,
                    boxShadow: focusedField === 'username' ? `0 0 8px ${T.accent}30` : 'none'
                  }}
                />
              </div>
            </div>
          )}

          {/* Email input field */}
          <div className="space-y-1">
            <label
              className="block text-2xs uppercase tracking-widest font-bold"
              style={{ color: T.muted2 }}
            >
              Indirizzo Email
            </label>
            <div className="relative">
              <span
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: focusedField === 'email' ? (isEmailEmpty ? T.accent : (isEmailValid ? T.green : T.red)) : (isEmailEmpty ? T.muted : (isEmailValid ? T.green : T.red)),
                  transition: 'color 0.2s'
                }}
              >
                <Mail size={16} />
              </span>
              <input
                id="qevora-auth-email"
                type="email"
                placeholder="nome@esempio.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
                required
                disabled={isLoading}
                className="w-full text-xs font-medium py-3 pl-10 pr-4 rounded-xl transition-all duration-200 focus:outline-none"
                style={{
                  backgroundColor: T.surface,
                  border: `1px solid ${emailBorder}`,
                  color: T.text,
                  boxShadow: emailGlow,
                  transition: 'border-color 0.2s, box-shadow 0.2s'
                }}
              />
            </div>
            {/* Real-time Email Visual Feedback */}
            <div className="mt-1 flex items-center justify-between text-3xs transition-all duration-300 px-1">
              {isEmailEmpty ? (
                <span style={{ color: T.muted2 }}>Esempio: nome@esempio.com</span>
              ) : isEmailValid ? (
                <span className="flex items-center space-x-1" style={{ color: T.green }}>
                  <Check size={10} strokeWidth={3} />
                  <span>Formato email corretto</span>
                </span>
              ) : (
                <span className="flex items-center space-x-1" style={{ color: T.red }}>
                  <span>✗ Inserisci un indirizzo email valido</span>
                </span>
              )}
            </div>
          </div>

          {/* Password input field */}
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label
                className="block text-2xs uppercase tracking-widest font-bold"
                style={{ color: T.muted2 }}
              >
                Password
              </label>
              {isLogin && (
                <button
                  type="button"
                  onClick={() => alert("Funzionalità di recupero password protetta. Contatta l'amministratore.")}
                  className="text-2xs font-bold hover:underline"
                  style={{ color: T.accent }}
                >
                  Dimenticata?
                </button>
              )}
            </div>
            <div className="relative">
              <span
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: focusedField === 'password' ? (isPwdEmpty ? T.accent : (pwdScore === 3 ? T.green : (pwdScore === 2 ? T.accent : T.red))) : (isPwdEmpty ? T.muted : (pwdScore === 3 ? T.green : (pwdScore === 2 ? T.accent : T.red))),
                  transition: 'color 0.2s'
                }}
              >
                <Lock size={16} />
              </span>
              <input
                id="qevora-auth-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
                required
                disabled={isLoading}
                className="w-full text-xs font-medium py-3 pl-10 pr-10 rounded-xl transition-all duration-200 focus:outline-none"
                style={{
                  backgroundColor: T.surface,
                  border: `1px solid ${pwdBorder}`,
                  color: T.text,
                  boxShadow: pwdGlow,
                  transition: 'border-color 0.2s, box-shadow 0.2s'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: T.muted2
                }}
                className="hover:text-white focus:outline-none"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {/* Real-time Password Cryptographic Strength indicators */}
            {!isPwdEmpty && (
              <div className="mt-1.5 space-y-1.5 px-1 pb-1 transition-all">
                {/* Visual Segmented Bars */}
                <div className="flex space-x-1.5">
                  <div 
                    className="h-1 flex-1 rounded-full transition-all duration-300"
                    style={{ 
                      backgroundColor: pwdScore >= 1 ? (pwdScore === 1 ? T.red : (pwdScore === 2 ? T.accent : T.green)) : '#1a2332'
                    }}
                  />
                  <div 
                    className="h-1 flex-1 rounded-full transition-all duration-300"
                    style={{ 
                      backgroundColor: pwdScore >= 2 ? (pwdScore === 2 ? T.accent : T.green) : '#1a2332'
                    }}
                  />
                  <div 
                    className="h-1 flex-1 rounded-full transition-all duration-300"
                    style={{ 
                      backgroundColor: pwdScore >= 3 ? T.green : '#1a2332'
                    }}
                  />
                </div>

                {/* Strength Meter Label */}
                <div className="flex items-center justify-between text-3xs font-semibold uppercase tracking-wider">
                  <span style={{ color: T.muted2 }}>Sicurezza Ledger:</span>
                  <span 
                    className="font-bold"
                    style={{ 
                      color: pwdScore === 3 ? T.green : (pwdScore === 2 ? T.accent : T.red) 
                    }}
                  >
                    {pwdScore === 3 ? 'MASSIMA (Forte)' : (pwdScore === 2 ? 'MEDIA (Accettabile)' : 'MINIMA (Debole)')}
                  </span>
                </div>

                {/* Dynamic Micro-rules requirement highlights */}
                <div className="grid grid-cols-1 gap-1 pt-0.5 text-3xs">
                  <div className="flex items-center space-x-1" style={{ color: hasMinLength ? T.green : T.muted }}>
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: hasMinLength ? T.green : T.muted }} />
                    <span>Minimo 6 caratteri ({password.length}/6)</span>
                  </div>
                  <div className="flex items-center space-x-1" style={{ color: hasUppercase ? T.green : T.muted }}>
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: hasUppercase ? T.green : T.muted }} />
                    <span>Almeno una lettera maiuscola (A-Z)</span>
                  </div>
                  <div className="flex items-center space-x-1" style={{ color: hasNumberOrSpec ? T.green : T.muted }}>
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: hasNumberOrSpec ? T.green : T.muted }} />
                    <span>Almeno un numero o carattere speciale (@, 1, $, ...)</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* EXTRA INPUT FIELD: Terms check for Registration Mode */}
          {!isLogin && (
            <div className="flex items-start pt-2 space-x-2">
              <div className="relative flex items-center h-5">
                <input
                  id="qevora-auth-terms"
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  disabled={isLoading}
                  className="rounded cursor-pointer h-4 w-4 bg-transparent opacity-0 absolute z-10"
                />
                <div
                  className="h-4 w-4 rounded border flex items-center justify-center transition-all duration-150"
                  style={{
                    backgroundColor: acceptTerms ? T.accent : T.surface,
                    borderColor: acceptTerms ? T.accent : T.border,
                  }}
                >
                  {acceptTerms && <Check size={10} className="text-black font-extrabold" />}
                </div>
              </div>
              <div className="text-3xs leading-relaxed" style={{ color: T.muted2 }}>
                Accetto i <span className="underline hover:text-white cursor-pointer">Termini di Servizio</span>, la{' '}
                <span className="underline hover:text-white cursor-pointer">Privacy Policy</span> e l'elaborazione dei dati personali ai fini del{' '}
                <span className="font-semibold text-white">GDPR</span>.
              </div>
            </div>
          )}

          {/* Primary Submit Button */}
          <button
            id="qevora-auth-submit-btn"
            type="submit"
            disabled={isLoading}
            className="w-full relative overflow-hidden py-3 px-4 rounded-xl font-bold text-xs tracking-wider uppercase transition-all duration-300 transform active:scale-95 disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer"
            style={{
              background: `linear-gradient(135deg, ${T.accent}, ${T.accent2})`,
              color: '#000000', // standard, sleek dark-ink contrasts on glowing buttons
              boxShadow: `0 4px 15px ${T.accent2}40`,
            }}
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                {/* Micro-spinner */}
                <svg
                  className="animate-spin h-4 w-4 text-black"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>ELABORAZIONE LEDGER...</span>
              </div>
            ) : (
              <span>{isLogin ? 'ACCEDI AL TERMINALE' : 'CREA LEDGER ACCOUNT'}</span>
            )}
          </button>
        </form>

        {/* Auth Mode Toggle Switcher Link */}
        <div className="mt-8 text-center">
          <button
            id="qevora-auth-toggle-link"
            type="button"
            onClick={toggleAuthMode}
            disabled={isLoading}
            className="text-xs transition-colors focus:outline-none"
            style={{ color: T.muted2 }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
            onMouseLeave={(e) => (e.currentTarget.style.color = T.muted2)}
          >
            {isLogin ? (
              <>
                Non hai ancora un account?{' '}
                <span className="font-bold hover:underline" style={{ color: T.accent }}>
                  Registrati
                </span>
              </>
            ) : (
              <>
                Hai già un account registrato?{' '}
                <span className="font-bold hover:underline" style={{ color: T.accent }}>
                  Accedi
                </span>
              </>
            )}
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  </div>
);
}
