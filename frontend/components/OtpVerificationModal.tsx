'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store/auth-store';

interface Props {
  email: string;
  onVerified: () => void;
}

export default function OtpVerificationModal({ email, onVerified }: Props) {
  const { verifyOtp, resendOtp, error, clearError } = useAuthStore();
  const [otp, setOtp] = useState('');
  const [resendMessage, setResendMessage] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setResendMessage('');
    setIsVerifying(true);
    try {
      await verifyOtp(email, otp);
      onVerified();
    } catch (err) {
      console.error('Verify error:', err);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    console.log('Resend button clicked for:', email);
    clearError();
    setResendMessage('');
    setIsResending(true);
    try {
      await resendOtp(email);
      setResendMessage('✅ A new code has been sent to your email.');
    } catch (err) {
      console.error('Resend error:', err);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
      <div style={{ width: '100%', maxWidth: '420px', padding: '40px', background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', borderRadius: '16px', border: '1px solid #475569', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>

        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>🔑</div>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#f1f5f9', marginBottom: '8px' }}>Verify Your Account</h2>
          <p style={{ fontSize: '14px', color: '#94a3b8' }}>
            We sent a 6-digit code to<br />
            <strong style={{ color: '#cbd5e1' }}>{email}</strong>
          </p>
        </div>

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #dc2626', borderRadius: '8px', padding: '12px 16px', marginBottom: '20px', color: '#fca5a5', fontSize: '13px' }}>
            ❌ {error}
          </div>
        )}

        {resendMessage && (
          <div style={{ background: 'rgba(34, 197, 94, 0.15)', border: '1px solid #16a34a', borderRadius: '8px', padding: '12px 16px', marginBottom: '20px', color: '#86efac', fontSize: '13px' }}>
            {resendMessage}
          </div>
        )}

        <form onSubmit={handleVerify}>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="Enter 6-digit code"
            maxLength={6}
            required
            disabled={isVerifying}
            style={{
              width: '100%',
              padding: '16px',
              borderRadius: '10px',
              border: '1px solid #475569',
              background: '#f1f5f9',
              color: '#1f2937',
              fontSize: '24px',
              textAlign: 'center',
              letterSpacing: '10px',
              outline: 'none',
              boxSizing: 'border-box',
              marginBottom: '20px',
              fontWeight: 700,
            }}
          />

          <button
            type="submit"
            disabled={isVerifying || otp.length !== 6}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '8px',
              border: 'none',
              background: isVerifying || otp.length !== 6 ? '#9ca3af' : 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
              color: '#1f2937',
              fontWeight: 700,
              fontSize: '14px',
              cursor: isVerifying || otp.length !== 6 ? 'not-allowed' : 'pointer',
              marginBottom: '16px',
            }}
          >
            {isVerifying ? '⏳ Verifying...' : '✅ Verify Account'}
          </button>
        </form>

        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '8px' }}>Didn't receive the code?</p>
          <button
            type="button"
            onClick={handleResend}
            disabled={isResending}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#fbbf24',
              fontWeight: 600,
              fontSize: '13px',
              cursor: isResending ? 'not-allowed' : 'pointer',
              padding: '8px 16px',
              opacity: isResending ? 0.6 : 1,
            }}
          >
            {isResending ? '⏳ Sending...' : '🔄 Resend Code'}
          </button>
        </div>

      </div>
    </div>
  );
}