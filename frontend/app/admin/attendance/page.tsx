'use client';

import { useState, useEffect } from 'react';
import apiClient from '@/lib/api-client';
import { useRequireAdmin } from '@/lib/useRequireAdmin';

interface Course {
  _id: string;
  code: string;
  name: string;
}

interface RosterEntry {
  studentId: string;
  name: string;
  email: string;
  studentIdNumber: string;
  status: string;
}

export default function AdminAttendancePage() {
  const isChecking = useRequireAdmin();

  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [roster, setRoster] = useState<RosterEntry[]>([]);
  const [isLoadingRoster, setIsLoadingRoster] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (isChecking) return;
    apiClient.get('/courses').then((res) => setCourses(res.data));
  }, [isChecking]);

  useEffect(() => {
    if (!selectedCourse || !date) {
      setRoster([]);
      return;
    }
    setIsLoadingRoster(true);
    apiClient
      .get(`/attendance/roster/${selectedCourse}`, { params: { date } })
      .then((res) => setRoster(res.data))
      .catch(() => setRoster([]))
      .finally(() => setIsLoadingRoster(false));
  }, [selectedCourse, date]);

  const updateStatus = (studentId: string, status: string) => {
    setRoster((prev) =>
      prev.map((r) => (r.studentId === studentId ? { ...r, status } : r)),
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    setMessage('');
    try {
      await apiClient.post('/attendance/mark', {
        courseId: selectedCourse,
        date,
        records: roster.map((r) => ({
          studentId: r.studentId,
          status: r.status,
        })),
      });
      setMessage('Attendance saved successfully.');
    } catch (err: any) {
      setMessage(err.response?.data?.message || 'Failed to save attendance.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isChecking) return null;

  return (
    <div style={{ padding: '32px', color: '#f1f5f9', minHeight: '100vh', background: '#0f172a' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>
        Mark Attendance
      </h1>
      <p style={{ color: '#94a3b8', marginBottom: '24px' }}>
        Select a course and date to mark attendance for enrolled students.
      </p>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <div>
          <label style={labelStyle}>Course</label>
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            style={inputStyle}
          >
            <option value="">Select a course</option>
            {courses.map((c) => (
              <option key={c._id} value={c._id}>
                {c.code} — {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label style={labelStyle}>Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={inputStyle}
          />
        </div>
      </div>

      {message && (
        <div
          style={{
            padding: '10px 14px',
            borderRadius: '8px',
            marginBottom: '16px',
            background: message.includes('success')
              ? 'rgba(34,197,94,0.1)'
              : 'rgba(239,68,68,0.1)',
            color: message.includes('success') ? '#4ade80' : '#fca5a5',
            fontSize: '14px',
          }}
        >
          {message}
        </div>
      )}

      {isLoadingRoster && <p style={{ color: '#94a3b8' }}>Loading roster...</p>}

      {!isLoadingRoster && selectedCourse && roster.length === 0 && (
        <p style={{ color: '#94a3b8' }}>No students enrolled in this course.</p>
      )}

      {roster.length > 0 && (
        <>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(148,163,184,0.3)' }}>
                <th style={thStyle}>Student ID</th>
                <th style={thStyle}>Name</th>
                <th style={thStyle}>Email</th>
                <th style={thStyle}>Status</th>
              </tr>
            </thead>
            <tbody>
              {roster.map((r) => (
                <tr key={r.studentId} style={{ borderBottom: '1px solid rgba(148,163,184,0.1)' }}>
                  <td style={tdStyle}>{r.studentIdNumber || '—'}</td>
                  <td style={tdStyle}>{r.name}</td>
                  <td style={tdStyle}>{r.email}</td>
                  <td style={tdStyle}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {['Present', 'Absent', 'Late'].map((status) => (
                        <button
                          key={status}
                          type="button"
                          onClick={() => updateStatus(r.studentId, status)}
                          style={{
                            padding: '6px 12px',
                            borderRadius: '6px',
                            border: '1px solid rgba(148,163,184,0.3)',
                            fontSize: '13px',
                            cursor: 'pointer',
                            background:
                              r.status === status
                                ? statusColor(status)
                                : 'transparent',
                            color: r.status === status ? '#0f172a' : '#cbd5e1',
                            fontWeight: r.status === status ? 700 : 400,
                          }}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            style={{
              padding: '12px 24px',
              background: isSaving ? '#334155' : '#0891b2',
              color: '#f1f5f9',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 600,
              cursor: isSaving ? 'not-allowed' : 'pointer',
            }}
          >
            {isSaving ? 'Saving...' : 'Save Attendance'}
          </button>
        </>
      )}
    </div>
  );
}

function statusColor(status: string) {
  if (status === 'Present') return '#4ade80';
  if (status === 'Absent') return '#f87171';
  return '#facc15';
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  color: '#cbd5e1',
  fontSize: '13px',
  marginBottom: '6px',
};

const inputStyle: React.CSSProperties = {
  padding: '10px 14px',
  background: 'rgba(15,23,42,0.6)',
  border: '1px solid rgba(148,163,184,0.3)',
  borderRadius: '8px',
  color: '#f1f5f9',
  fontSize: '14px',
  outline: 'none',
  minWidth: '220px',
};

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