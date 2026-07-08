'use client';

import { Sidebar } from '@/components/layout/sidebar';
import { useRequireAuth } from '@/lib/useRequireAuth';
import { useState, useEffect } from 'react';
import apiClient from '@/lib/api-client';

interface StudentRecord {
  _id: string;
  name: string;
  email: string;
  studentId?: string;
  department?: string;
  semester?: string;
  phone?: string;
  address?: string;
  dateOfBirth?: string;
  status: string;
}

export default function AdminStudentsPage() {
  const isChecking = useRequireAuth();
  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    studentId: '',
    department: '',
    semester: '',
    phone: '',
    address: '',
    dateOfBirth: '',
  });

  useEffect(() => {
    if (!isChecking) {
      fetchStudents();
    }
  }, [isChecking]);

  const fetchStudents = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get('/students');
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setFormData({
      name: '', email: '', password: '', studentId: '',
      department: '', semester: '', phone: '', address: '', dateOfBirth: '',
    });
    setEditingId(null);
  };

  const handleAddNew = () => {
    resetForm();
    setShowModal(true);
  };

  const handleEdit = (student: StudentRecord) => {
    setFormData({
      name: student.name,
      email: student.email,
      password: '',
      studentId: student.studentId || '',
      department: student.department || '',
      semester: student.semester || '',
      phone: student.phone || '',
      address: student.address || '',
      dateOfBirth: student.dateOfBirth || '',
    });
    setEditingId(student._id);
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      if (editingId) {
        const { password, ...updateData } = formData;
        await apiClient.patch(`/students/${editingId}`, updateData);
      } else {
        await apiClient.post('/students', formData);
      }
      setShowModal(false);
      resetForm();
      await fetchStudents();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to save student');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this student?')) return;
    try {
      await apiClient.delete(`/students/${id}`);
      await fetchStudents();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to delete student');
    }
  };

  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (s.studentId || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isChecking) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a', color: '#94a3b8' }}>
        ⏳ Checking authentication...
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}>
      <Sidebar />

      <main style={{ marginLeft: '256px', flex: 1, padding: '48px 40px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
            <div>
              <h1 style={{ fontSize: '36px', fontWeight: 800, color: '#f1f5f9', marginBottom: '8px' }}>
                ⚙️ Manage Students
              </h1>
              <p style={{ color: '#94a3b8' }}>Add, edit, and manage student records</p>
            </div>
            <button
              onClick={handleAddNew}
              style={{ padding: '12px 24px', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)', color: 'white', fontWeight: 700, cursor: 'pointer' }}
            >
              + Add New Student
            </button>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <input
              type="text"
              placeholder="🔍 Search by name, email, or student ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #475569', background: '#1e293b', color: 'white', fontSize: '14px' }}
            />
          </div>

          {isLoading ? (
            <p style={{ color: '#94a3b8' }}>⏳ Loading students...</p>
          ) : (
            <div style={{ background: '#1e293b', borderRadius: '16px', border: '1px solid #475569', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#334155' }}>
                    <th style={thStyle}>Name</th>
                    <th style={thStyle}>Email</th>
                    <th style={thStyle}>Student ID</th>
                    <th style={thStyle}>Department</th>
                    <th style={thStyle}>Status</th>
                    <th style={thStyle}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student) => (
                    <tr key={student._id} style={{ borderBottom: '1px solid #334155' }}>
                      <td style={tdStyle}>{student.name}</td>
                      <td style={tdStyle}>{student.email}</td>
                      <td style={tdStyle}>{student.studentId || '—'}</td>
                      <td style={tdStyle}>{student.department || '—'}</td>
                      <td style={tdStyle}>
                        <span style={{ padding: '4px 10px', borderRadius: '6px', background: '#166534', color: '#dcfce7', fontSize: '12px' }}>
                          {student.status}
                        </span>
                      </td>
                      <td style={tdStyle}>
                        <button onClick={() => handleEdit(student)} style={actionBtnStyle('#3b82f6')}>✏️ Edit</button>
                        <button onClick={() => handleDelete(student._id)} style={actionBtnStyle('#ef4444')}>🗑️ Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredStudents.length === 0 && (
                <p style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>No students found.</p>
              )}
            </div>
          )}

        </div>
      </main>

      {showModal && (
        <StudentModal
          formData={formData}
          handleInputChange={handleInputChange}
          handleSave={handleSave}
          handleClose={() => { setShowModal(false); resetForm(); }}
          isEditing={!!editingId}
        />
      )}
    </div>
  );
}

const thStyle: React.CSSProperties = { textAlign: 'left', padding: '16px', color: '#cbd5e1', fontSize: '13px', fontWeight: 700, textTransform: 'uppercase' };
const tdStyle: React.CSSProperties = { padding: '16px', color: '#f1f5f9', fontSize: '14px' };
const actionBtnStyle = (color: string): React.CSSProperties => ({
  padding: '6px 12px', borderRadius: '6px', border: 'none', background: color, color: 'white', fontSize: '12px', fontWeight: 600, cursor: 'pointer', marginRight: '8px'
});

function StudentModal({ formData, handleInputChange, handleSave, handleClose, isEditing }: any) {
  return (
    <div onClick={handleClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: '#1e293b', borderRadius: '16px', padding: '32px', maxWidth: '500px', width: '90%', border: '1px solid #475569', maxHeight: '90vh', overflowY: 'auto' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#f1f5f9', marginBottom: '24px' }}>
          {isEditing ? '✏️ Edit Student' : '➕ Add New Student'}
        </h2>

        <FormField label="Full Name" name="name" value={formData.name} onChange={handleInputChange} />
        <FormField label="Email" name="email" type="email" value={formData.email} onChange={handleInputChange} disabled={isEditing} />
        {!isEditing && (
          <FormField label="Password" name="password" type="password" value={formData.password} onChange={handleInputChange} placeholder="Default: student123" />
        )}
        <FormField label="Student ID" name="studentId" value={formData.studentId} onChange={handleInputChange} placeholder="e.g., EST/2024/001" />
        <FormField label="Department" name="department" value={formData.department} onChange={handleInputChange} />
        <FormField label="Semester" name="semester" value={formData.semester} onChange={handleInputChange} />
        <FormField label="Phone" name="phone" value={formData.phone} onChange={handleInputChange} />
        <FormField label="Address" name="address" value={formData.address} onChange={handleInputChange} />
        <FormField label="Date of Birth" name="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleInputChange} />

        <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
          <button onClick={handleSave} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', background: '#3b82f6', color: 'white', fontWeight: 700, cursor: 'pointer' }}>
            {isEditing ? 'Update' : 'Create'} Student
          </button>
          <button onClick={handleClose} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #475569', background: 'transparent', color: '#94a3b8', fontWeight: 700, cursor: 'pointer' }}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function FormField({ label, name, value, onChange, type = 'text', disabled = false, placeholder = '' }: any) {
  return (
    <div style={{ marginBottom: '16px' }}>
      <label style={{ display: 'block', marginBottom: '6px', color: '#cbd5e1', fontSize: '12px', fontWeight: 600 }}>{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #475569', background: disabled ? '#0f172a' : '#334155', color: 'white', fontSize: '14px', boxSizing: 'border-box' }}
      />
    </div>
  );
}