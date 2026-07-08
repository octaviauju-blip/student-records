'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/auth-store';

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signin, isLoading, error, clearError } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    try {
      await signin(email, password);
      router.push('/dashboard');
    } catch {
      // error already set in store, UI displays it below
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}>
      <div style={{ width: '100%', maxWidth: '450px', padding: '48px 40px', background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.9) 100%)', borderRadius: '16px', border: '1px solid #475569', boxShadow: '0 20px 50px rgba(0,0,0,0.4)' }}>

        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '50px', height: '50px', background: 'linear-gradient(135deg, #0cc1e5 0%, #1109b0 100%)', borderRadius: '10px', marginBottom: '16px' }}>
            <span style={{ fontSize: '28px' }}>📚</span>
          </div>
          <h1 style={{ fontSize: '20px', fontWeight: 800, color: '#f1f5f9', margin: '0 0 4px 0' }}>Student Records</h1>
          <p style={{ fontSize: '11px', color: '#94a3b8', margin: 0, letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600 }}>ESTAM University</p>
        </div>

        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#f1f5f9', margin: '0 0 8px 0' }}>Sign in</h2>
          <p style={{ fontSize: '14px', color: '#cbd5e1', margin: 0 }}>Enter your credentials to continue</p>
        </div>

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #dc2626', borderRadius: '8px', padding: '12px 16px', marginBottom: '24px', color: '#fca5a5', fontSize: '13px', fontWeight: 500 }}>
            ❌ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1', fontWeight: 600, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              disabled={isLoading}
              style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #475569', background: '#f1f5f9', color: '#1f2937', fontSize: '14px', outline: 'none', boxSizing: 'border-box', opacity: isLoading ? 0.6 : 1 }}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1', fontWeight: 600, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              disabled={isLoading}
              style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #475569', background: '#f1f5f9', color: '#1f2937', fontSize: '14px', outline: 'none', boxSizing: 'border-box', opacity: isLoading ? 0.6 : 1 }}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: 'none', background: isLoading ? '#a09caf' : 'linear-gradient(135deg, #173ccf 0%, #156ac4 100%)', color: '#1f2937', fontWeight: 700, fontSize: '14px', cursor: isLoading ? 'not-allowed' : 'pointer' }}
          >
            {isLoading ? '⏳ Signing in...' : '✅ Sign In'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #334155' }}>
          <p style={{ margin: 0, color: '#cbd5e1', fontSize: '13px' }}>
            No account yet?{' '}
            <Link href="/register" style={{ color: '#f724fb', textDecoration: 'none', fontWeight: 600 }}>
              Create one
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}