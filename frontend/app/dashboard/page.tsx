'use client';

import { Sidebar } from '@/components/layout/sidebar';
import { useAuthStore } from '@/store/auth-store';
import { useRequireAuth } from '@/lib/useRequireAuth';
import { useEffect, useState } from 'react';
import apiClient from '@/lib/api-client';
import OtpVerificationModal from '@/components/OtpVerificationModal';

export default function DashboardPage() {
  const isChecking = useRequireAuth();
  const { user, loadUserFromStorage } = useAuthStore();
  const [stats, setStats] = useState({ enrolledCoursesCount: 0, totalCredits: 0, attendanceRate: 0 });
  const [loading, setLoading] = useState(true);
  const [showOtpModal, setShowOtpModal] = useState(false);

  useEffect(() => {
    loadUserFromStorage();
  }, [loadUserFromStorage]);

  useEffect(() => {
    if (user && user.isVerified === false) {
      setShowOtpModal(true);
    }
  }, [user]);

  useEffect(() => {
    if (isChecking) return;

    const fetchStats = async () => {
      try {
        const userData = localStorage.getItem('user');
        if (!userData) return;
        const parsedUser = JSON.parse(userData);
        const id = parsedUser.id || parsedUser._id;

        const [dashboardRes, attendanceRes] = await Promise.all([
          apiClient.get(`/students/${id}/dashboard-stats`),
          apiClient.get(`/attendance/student/${id}/stats`).catch(() => ({ data: { percentage: 0 } })),
        ]);

        setStats({
          ...dashboardRes.data,
          attendanceRate: attendanceRes.data.percentage,
        });
      } catch (error) {
        console.error('Failed to load dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [isChecking]);

  if (isChecking) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a', color: '#94a3b8' }}>
        ⏳ Checking authentication...
      </div>
    );
  }

  const displayName = user?.name || 'Student';

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)' }}>
      <Sidebar />

      <main style={{ marginLeft: '256px', flex: 1, padding: '48px 40px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

          {/* WELCOME */}
          <div style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%)', borderRadius: '16px', padding: '40px', marginBottom: '40px', color: 'white', boxShadow: '0 20px 50px rgba(59, 130, 246, 0.3)' }}>
            <h1 style={{ fontSize: '36px', fontWeight: 800, marginBottom: '8px' }}>Welcome Back, {displayName}! 👋</h1>
            <p style={{ fontSize: '16px', opacity: 0.95 }}>Here's what's happening with your studies.</p>
          </div>

          {/* STATS */}
          {loading ? (
            <p style={{ color: '#94a3b8' }}>⏳ Loading your stats...</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '40px' }}>
              <StatCard icon="📚" title="Enrolled Courses" value={stats.enrolledCoursesCount.toString()} />
              <StatCard icon="⭐" title="Total Credits" value={stats.totalCredits.toString()} />
              <StatCard icon="🗓️" title="Attendance Rate" value={`${stats.attendanceRate}%`} />
            </div>
          )}

        </div>
      </main>

      {showOtpModal && user?.email && (
        <OtpVerificationModal
          email={user.email}
          onVerified={() => setShowOtpModal(false)}
        />
      )}
    </div>
  );
}

function StatCard({ icon, title, value }: any) {
  return (
    <div style={{ background: 'rgba(59, 130, 246, 0.1)', borderRadius: '12px', padding: '24px', border: '1px solid #475569' }}>
      <div style={{ fontSize: '32px', marginBottom: '12px' }}>{icon}</div>
      <p style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '8px' }}>{title}</p>
      <p style={{ fontSize: '32px', fontWeight: 800, color: '#60a5fa' }}>{value}</p>
    </div>
  );
}