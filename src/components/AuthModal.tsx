'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { 
  X, 
  Sparkles, 
  Mail, 
  ShieldCheck, 
  ArrowRight, 
  ArrowLeft, 
  KeyRound, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    authModalReason, 
    closeAuthModal, 
    loginWithFlameEmail, 
    sendVerificationCode,
    verifyOtpCode,
    loginAsGuest
  } = useApp();

  // Screen 1: 'email', Screen 2: 'code'
  const [authStep, setAuthStep] = useState<'email' | 'code'>('email');

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [resendSuccess, setResendSuccess] = useState('');
  const [countdown, setCountdown] = useState(30);

  // Reset modal state on open/close
  useEffect(() => {
    if (isAuthModalOpen) {
      setAuthStep('email');
      setErrorMsg('');
      setResendSuccess('');
      setOtpCode('');
    }
  }, [isAuthModalOpen]);

  // Resend countdown timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (authStep === 'code' && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [authStep, countdown]);

  if (!isAuthModalOpen) return null;

  // Step 1: Request 6-digit OTP code to FLAME email
  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setResendSuccess('');

    const trimmed = email.trim().toLowerCase();
    if (!trimmed) {
      setErrorMsg('Please enter your FLAME University email.');
      return;
    }
    if (!trimmed.endsWith('@flame.edu.in')) {
      setErrorMsg('Only official @flame.edu.in email addresses are permitted.');
      return;
    }

    setIsLoading(true);
    const res = await sendVerificationCode(trimmed);
    setIsLoading(false);

    if (res.error) {
      setErrorMsg(res.error);
    }

    if (!res.success && !res.developerBypass) {
      return;
    }

    // Advance to OTP input screen
    setAuthStep('code');
    setCountdown(30);
  };

  // Step 2: Verify the 6-digit code
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!otpCode.trim()) {
      setErrorMsg('Please enter the verification code sent to your email.');
      return;
    }

    setIsLoading(true);
    const res = await verifyOtpCode(email, otpCode, name);
    setIsLoading(false);

    if (!res.success && res.error) {
      setErrorMsg(res.error);
    }
  };

  // Resend OTP code
  const handleResend = async () => {
    if (countdown > 0) return;
    setErrorMsg('');
    setResendSuccess('');
    setIsLoading(true);

    const res = await sendVerificationCode(email);
    setIsLoading(false);

    if (res.success) {
      setResendSuccess('New code sent to your inbox!');
      setCountdown(30);
    } else if (res.error) {
      setErrorMsg(res.error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in select-none">
      <div 
        className="relative w-full max-w-md bg-[#fcfaf2] text-neutral-900 rounded-sm shadow-2xl border-4 border-[#e8dfc9] p-6 sm:p-8"
        style={{
          boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
        }}
      >
        {/* Washi tape header motif */}
        <div 
          className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-36 h-6 bg-[#f3da90]/90 shadow-md backdrop-blur-xs rotate-[-1deg] pointer-events-none"
          style={{ clipPath: 'polygon(3% 0%, 97% 2%, 100% 98%, 0% 96%)' }}
        />

        {/* Close button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 p-2 rounded-full bg-neutral-200/80 hover:bg-neutral-300 text-neutral-700 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Brand Stamp */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-[#c93b2b] text-amber-100 rounded-sm shadow-md mb-2 rotate-[-2deg]">
            <span className="font-editorial text-2xl font-black">F</span>
          </div>
          <h2 className="font-editorial text-2xl font-bold text-neutral-900">
            {authStep === 'email' ? 'FLAME Student Access' : 'Check Your Email'}
          </h2>
          <p className="text-xs text-neutral-600 font-sans-ui mt-1 max-w-xs mx-auto">
            {authStep === 'email' 
              ? (authModalReason || 'Sign in with your FLAME email to save this event and build your plan.')
              : `We sent a magic link to ${email}`}
          </p>
        </div>

        {/* Error message */}
        {errorMsg && (
          <div className="p-3 bg-red-100 border border-red-300 rounded-xs text-xs text-red-800 mb-4 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Resend success notice */}
        {resendSuccess && (
          <div className="p-2.5 bg-emerald-100 border border-emerald-300 rounded-xs text-xs text-emerald-800 mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{resendSuccess}</span>
          </div>
        )}

        {/* SCREEN 1: Input Email & Name */}
        {authStep === 'email' ? (
          <form onSubmit={handleRequestCode} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                Your Name (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Aarav Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-[#d6cbb0] rounded-sm text-sm text-neutral-900 focus:outline-none focus:border-[#c93b2b] focus:ring-1 focus:ring-[#c93b2b]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                FLAME University Email <span className="text-[#c93b2b]">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  placeholder="your.name@flame.edu.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 bg-white border border-[#d6cbb0] rounded-sm text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-[#c93b2b] focus:ring-1 focus:ring-[#c93b2b]"
                  required
                />
              </div>
              <p className="text-[11px] text-neutral-500 mt-1 font-mono">
                Strictly requires official @flame.edu.in domain
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 bg-[#c93b2b] hover:bg-[#b02e20] text-amber-100 text-sm font-bold rounded-sm shadow-md transition-transform active:scale-95 flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {isLoading ? (
                <span>Sending Code...</span>
              ) : (
                <>
                  <span>Send Magic Link</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        ) : (
          /* SCREEN 2: Magic Link Sent OR Bypass */
          <form onSubmit={handleVerifyCode} className="space-y-4">
            {!errorMsg ? (
              <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-sm text-sm text-emerald-900 leading-relaxed text-center shadow-inner">
                <Sparkles className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
                <span className="font-bold text-base block mb-1">✨ Magic Link Sent!</span> 
                We've sent a direct login link to <strong>{email}</strong>.<br/><br/>
                Simply click the link in your email to instantly enter the Campus Planner!
              </div>
            ) : (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-sm text-xs text-amber-900 leading-relaxed text-center">
                <span className="font-bold block mb-1">⚠️ Email Sending Failed</span> 
                We could not send the email because of an SMTP configuration error. You can still log in using the manual bypass code below.
              </div>
            )}

            <div className="mt-6 pt-4 border-t border-neutral-200">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                  Developer Bypass / Manual Code
                </label>
                <button
                  type="button"
                  onClick={() => setAuthStep('email')}
                  className="text-xs text-[#c93b2b] hover:underline flex items-center gap-1"
                >
                  <ArrowLeft className="w-3 h-3" />
                  <span>Change Email</span>
                </button>
              </div>

              <div className="relative opacity-60 hover:opacity-100 transition-opacity focus-within:opacity-100">
                <KeyRound className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  maxLength={6}
                  placeholder="000000"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                  className="w-full pl-9 pr-3.5 py-2 bg-white/50 border border-[#d6cbb0] rounded-sm text-center font-mono tracking-widest text-neutral-900 focus:outline-none focus:border-[#c93b2b] focus:bg-white"
                />
              </div>

              <div className="flex items-center justify-between mt-3 text-xs text-neutral-500">
                <span>Check spam if not in inbox</span>
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={countdown > 0 || isLoading}
                  className="text-[#c93b2b] hover:underline font-semibold disabled:text-neutral-400 disabled:no-underline"
                >
                  {countdown > 0 ? `Resend in ${countdown}s` : 'Resend Link'}
                </button>
              </div>
            </div>

            {/* We only need the submit button for manual/bypass code now */}
            {otpCode.length === 6 && (
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2 bg-neutral-800 hover:bg-black text-white text-xs uppercase tracking-wider font-bold rounded-sm shadow-md transition-transform active:scale-95 flex items-center justify-center gap-2 mt-2"
              >
                {isLoading ? 'Verifying...' : 'Use Manual Code'}
              </button>
            )}
          </form>
        )}

        {/* Continue as guest */}
        <div className="mt-4 text-center">
          <button
            onClick={loginAsGuest}
            className="text-xs text-neutral-600 hover:text-neutral-900 underline font-sans-ui"
          >
            Browse in Guest Mode without saving
          </button>
        </div>

      </div>
    </div>
  );
};
