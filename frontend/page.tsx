'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/auth-store';

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState('');
  const { register, isLoading, error, clearError } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setLocalError('');

    if (password !== confirmPassword) {
      setLocalError('Passwords do not match!');
      return;
    }
    if (password.length < 6) {
      setLocalError('Password must be at least 6 characters!');
      return;
    }

    try {
      await register(fullName, email, password);
      router.push('/dashboard');
    } catch {
      // error already set in store
    }
  };

  const displayError = localError || error;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}>
      <div style={{ width: '100%', maxWidth: '450px', padding: '48px 40px', background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.9) 100%)', borderRadius: '16px', border: '1px solid #475569', boxShadow: '0 20px 50px rgba(0,0,0,0.4)' }}>

        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '50px', height: '50px', background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)', borderRadius: '10px', marginBottom: '16px' }}>
            <span style={{ fontSize: '28px' }}>📚</span>
          </div>
          <h1 style={{ fontSize: '20px', fontWeight: 800, color: '#f1f5f9', margin: '0 0 4px 0' }}>Student Records</h1>
          <p style={{ fontSize: '11px', color: '#94a3b8', margin: 0, letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600 }}>ESTAM University</p>
        </div>

        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#f1f5f9', margin: '0 0 8px 0' }}>Create account</h2>
          <p style={{ fontSize: '14px', color: '#cbd5e1', margin: 0 }}>Get started with Student Records</p>
        </div>

        {displayError && (
          <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #dc2626', borderRadius: '8px', padding: '12px 16px', marginBottom: '24px', color: '#fca5a5', fontSize: '13px', fontWeight: 500 }}>
            ❌ {displayError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1', fontWeight: 600, fontSize: '12px', textTransform: 'uppercase' }}>Full Name</label>
            <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required disabled={isLoading}
              style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #475569', background: '#f1f5f9', color: '#1f2937', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1', fontWeight: 600, fontSize: '12px', textTransform: 'uppercase' }}>Email Address</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={isLoading}
              style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #475569', background: '#f1f5f9', color: '#1f2937', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1', fontWeight: 600, fontSize: '12px', textTransform: 'uppercase' }}>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={isLoading}
              style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #475569', background: '#f1f5f9', color: '#1f2937', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1', fontWeight: 600, fontSize: '12px', textTransform: 'uppercase' }}>Confirm Password</label>
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required disabled={isLoading}
              style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #475569', background: '#f1f5f9', color: '#1f2937', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
          </div>

          <button type="submit" disabled={isLoading}
            style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: 'none', background: isLoading ? '#9ca3af' : 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)', color: '#1f2937', fontWeight: 700, fontSize: '14px', cursor: isLoading ? 'not-allowed' : 'pointer' }}>
            {isLoading ? '⏳ Creating account...' : '✅ Sign Up'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #334155' }}>
          <p style={{ margin: 0, color: '#cbd5e1', fontSize: '13px' }}>
            Already have an account?{' '}
            <Link href="/signin" style={{ color: '#fbbf24', textDecoration: 'none', fontWeight: 600 }}>
              Sign in
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}