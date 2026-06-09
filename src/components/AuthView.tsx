import React, { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff, ShieldCheck, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import PortliLogo from './PortliLogo';
import ConstellationBackground from './ConstellationBackground';

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    if (!handleValidate()) return;

    setIsLoading(true);
    setErrorMessage(null);

    try {
      // Import the service dynamically or at the top
      const { supabaseService } = await import('../services/supabaseService');

      let sessionData;
      let finalUserName = '';
      
      if (isLogin) {
        // REAL SUPABASE LOGIN
        const res = await supabaseService.signIn(email, password);
        sessionData = res;
        finalUserName = res.user?.user_metadata?.username || email.split('@')[0];
      } else {
        // REAL SUPABASE SIGNUP
        finalUserName = username.trim();
        const res = await supabaseService.signUp(email, password, finalUserName);
        sessionData = res;
      }

      setSuccessToast(isLogin ? 'Accesso autorizzato!' : 'Registrazione completata!');
      
      setTimeout(() => {
        onAuthSuccess({
          name: finalUserName,
          tier: sessionData.user?.user_metadata?.tier || 'Piano Base',
          token: sessionData.session?.access_token || ''
        });
        setIsLoading(false);
      }, 800);

    } catch (err: any) {
      console.error("Auth Error:", err);
      // Traslate common supabase errors
      let msg = 'Errore di autenticazione.';
      if (err.message.includes('Invalid login credentials')) msg = 'Email o password errati.';
      if (err.message.includes('User already registered')) msg = 'Utente già registrato. Fai il login.';
      if (err.message.includes('Password should be at least')) msg = 'La password è troppo debole.';
      
      setErrorMessage(msg);
      setIsLoading(false);
    }
  };

  // Simulate Google OAuth (Leaving simulated for now unless explicitly wired)
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
      {/* BACKGROUND: Animated Constellation Canvas */}
      <ConstellationBackground />

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
            backgroundColor: 'rgba(13, 17, 26, 0.75)',
            border: `1px solid rgba(255, 255, 255, 0.08)`,
            borderRadius: '24px',
            padding: '36px',
            zIndex: 10,
            backdropFilter: 'blur(30px)',
            WebkitBackdropFilter: 'blur(30px)',
            boxShadow: '0 30px 60px -12px rgba(0, 0, 0, 0.95), inset 0 1px 0 rgba(255,255,255,0.1)'
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
