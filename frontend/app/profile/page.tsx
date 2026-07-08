'use client';

import { Sidebar } from '@/components/layout/sidebar';
import { useRequireAuth } from '@/lib/useRequireAuth';
import { useState, useEffect } from 'react';
import apiClient from '@/lib/api-client';

export default function ProfilePage() {
  const isChecking = useRequireAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [studentId, setStudentId] = useState('');

  const [profile, setProfile] = useState({
    name: '',
    email: '',
    studentId: '',
    department: '',
    semester: '',
    phone: '',
    address: '',
    dateOfBirth: '',
    status: '',
  });

  const [formData, setFormData] = useState(profile);

  useEffect(() => {
    if (isChecking) return;
    fetchProfile();
  }, [isChecking]);

  const fetchProfile = async () => {
    try {
      const userData = localStorage.getItem('user');
      if (!userData) return;
      const user = JSON.parse(userData);
      const id = user.id || user._id;
      setStudentId(id);

      const response = await apiClient.get(`/students/${id}`);
      const data = {
        name: response.data.name || '',
        email: response.data.email || '',
        studentId: response.data.studentId || '',
        department: response.data.department || '',
        semester: response.data.semester || '',
        phone: response.data.phone || '',
        address: response.data.address || '',
        dateOfBirth: response.data.dateOfBirth || '',
        status: response.data.status || 'Active',
      };
      setProfile(data);
      setFormData(data);
    } catch (error) {
      console.error('Failed to load profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { email, status, ...editableData } = formData;
      await apiClient.patch(`/students/${studentId}`, editableData);
      setProfile(formData);
      setIsEditing(false);
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(profile);
    setIsEditing(false);
  };

  if (isChecking || isLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a', color: '#94a3b8' }}>
        ⏳ Loading profile...
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}>
      <Sidebar />

      <main style={{ marginLeft: '256px', flex: 1, padding: '48px 40px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
            <div>
              <h1 style={{ fontSize: '36px', fontWeight: 800, color: '#f1f5f9', marginBottom: '8px' }}>
                👤 My Profile
              </h1>
              <p style={{ color: '#94a3b8' }}>View and manage your personal information</p>
            </div>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                style={{ padding: '12px 24px', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)', color: 'white', fontWeight: 700, cursor: 'pointer' }}
              >
                ✏️ Edit Profile
              </button>
            )}
          </div>

          <div style={{ background: '#1e293b', borderRadius: '16px', padding: '32px', border: '1px solid #475569' }}>

            {/* PROFILE HEADER */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '32px', paddingBottom: '32px', borderBottom: '1px solid #334155' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px' }}>
                👨‍🎓
              </div>
              <div>
                <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#f1f5f9', marginBottom: '4px' }}>{profile.name}</h2>
                <p style={{ color: '#94a3b8', fontSize: '14px' }}>{profile.email}</p>
                <span style={{ display: 'inline-block', marginTop: '8px', padding: '4px 12px', borderRadius: '12px', background: '#166534', color: '#dcfce7', fontSize: '12px', fontWeight: 600 }}>
                  {profile.status}
                </span>
              </div>
            </div>

            {isEditing ? (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '24px' }}>
                  <FormField label="Full Name" name="name" value={formData.name} onChange={handleInputChange} />
                  <FormField label="Student ID" name="studentId" value={formData.studentId} onChange={handleInputChange} />
                  <FormField label="Department" name="department" value={formData.department} onChange={handleInputChange} />
                  <FormField label="Semester" name="semester" value={formData.semester} onChange={handleInputChange} />
                  <FormField label="Phone" name="phone" value={formData.phone} onChange={handleInputChange} />
                  <FormField label="Date of Birth" name="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleInputChange} />
                </div>
                <FormField label="Address" name="address" value={formData.address} onChange={handleInputChange} />

                <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                  <button onClick={handleSave} disabled={isSaving} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', background: '#22c55e', color: 'white', fontWeight: 700, cursor: isSaving ? 'not-allowed' : 'pointer', opacity: isSaving ? 0.6 : 1 }}>
                    {isSaving ? '⏳ Saving...' : '💾 Save Changes'}
                  </button>
                  <button onClick={handleCancel} disabled={isSaving} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #475569', background: 'transparent', color: '#94a3b8', fontWeight: 700, cursor: 'pointer' }}>
                    ❌ Cancel
                  </button>
                </div>
              </>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
                <InfoItem label="Student ID" value={profile.studentId || '—'} />
                <InfoItem label="Department" value={profile.department || '—'} />
                <InfoItem label="Semester" value={profile.semester || '—'} />
                <InfoItem label="Phone" value={profile.phone || '—'} />
                <InfoItem label="Date of Birth" value={profile.dateOfBirth || '—'} />
                <InfoItem label="Address" value={profile.address || '—'} />
              </div>
            )}

          </div>
        </div>
      </main>
    </div>
  );
}

function InfoItem({ label, value }: any) {
  return (
    <div>
      <p style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 600, marginBottom: '6px', textTransform: 'uppercase' }}>{label}</p>
      <p style={{ fontSize: '15px', color: '#f1f5f9' }}>{value}</p>
    </div>
  );
}

function FormField({ label, name, value, onChange, type = 'text' }: any) {
  return (
    <div style={{ marginBottom: '16px' }}>
      <label style={{ display: 'block', marginBottom: '6px', color: '#cbd5e1', fontSize: '12px', fontWeight: 600 }}>{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #475569', background: '#334155', color: 'white', fontSize: '14px', boxSizing: 'border-box' }}
      />
    </div>
  );
}