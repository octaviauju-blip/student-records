'use client';

import { useState, useEffect } from 'react';
import apiClient from '@/lib/api-client';
import { useRequireAuth } from '@/lib/useRequireAuth';
import { useAuthStore } from '@/store/auth-store';

interface AttendanceRecord {
  _id: string;
  date: string;
  status: string;
  course: { code: string; name: string };
}

interface Stats {
  total: number;
  present: number;
  absent: number;
  late: number;
  percentage: number;
}

export default function AttendanceHistoryPage() {
  const { isChecking } = useRequireAuth();
  const user = useAuthStore((state) => state.user);
  const studentId = (user as any)?.id || (user as any)?._id;

  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!studentId) return;

    Promise.all([
      apiClient.get(`/attendance/student/${studentId}`),
      apiClient.get(`/attendance/student/${studentId}/stats`),
    ])
      .then(([recordsRes, statsRes]) => {
        setRecords(recordsRes.data);
        setStats(statsRes.data);
      })
      .finally(() => setIsLoading(false));
  }, [studentId]);

  if (isChecking || isLoading) return null;

  return (
    <div style={{ padding: '32px', color: '#f1f5f9', minHeight: '100vh', background: '#0f172a' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>
        My Attendance
      </h1>
      <p style={{ color: '#94a3b8', marginBottom: '24px' }}>
        Your attendance history across all enrolled courses.
      </p>

      {stats && (
        <div style={{ display: 'flex', gap: '16px', marginBottom: '32px', flexWrap: 'wrap' }}>
          <StatCard label="Attendance Rate" value={`${stats.percentage}%`} color="#0891b2" />
          <StatCard label="Present" value={stats.present} color="#4ade80" />
          <StatCard label="Absent" value={stats.absent} color="#f87171" />
          <StatCard label="Late" value={stats.late} color="#facc15" />
        </div>
      )}

      {records.length === 0 ? (
        <p style={{ color: '#94a3b8' }}>No attendance records yet.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(148,163,184,0.3)' }}>
              <th style={thStyle}>Date</th>
              <th style={thStyle}>Course</th>
              <th style={thStyle}>Status</th>
            </tr>
          </thead>
          <tbody>
            {records.map((r) => (
              <tr key={r._id} style={{ borderBottom: '1px solid rgba(148,163,184,0.1)' }}>
                <td style={tdStyle}>{new Date(r.date).toLocaleDateString()}</td>
                <td style={tdStyle}>
                  {r.course?.code} — {r.course?.name}
                </td>
                <td style={tdStyle}>
                  <span
                    style={{
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '13px',
                      fontWeight: 600,
                      background:
                        r.status === 'Present'
                          ? 'rgba(74,222,128,0.15)'
                          : r.status === 'Absent'
                          ? 'rgba(248,113,113,0.15)'
                          : 'rgba(250,204,21,0.15)',
                      color:
                        r.status === 'Present'
                          ? '#4ade80'
                          : r.status === 'Absent'
                          ? '#f87171'
                          : '#facc15',
                    }}
                  >
                    {r.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: string | number; color: string }) {
  return (
    <div
      style={{
        background: 'rgba(30,41,59,0.6)',
        border: '1px solid rgba(148,163,184,0.2)',
        borderRadius: '12px',
        padding: '20px 24px',
        minWidth: '140px',
      }}
    >
      <p style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '6px' }}>{label}</p>
      <p style={{ fontSize: '28px', fontWeight: 700, color }}>{value}</p>
    </div>
  );
}

const thStyle: React.CSSProperties = {
  textAlign: 'left',
  padding: '10px',
  color: '#94a3b8',
  fontSize: '13px',
  fontWeight: 600,
};

const tdStyle: React.CSSProperties = {
  padding: '10px',
  fontSize: '14px',
};