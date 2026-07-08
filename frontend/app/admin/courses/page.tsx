'use client';

import { Sidebar } from '@/components/layout/sidebar';
import { useRequireAuth } from '@/lib/useRequireAuth';
import { useState, useEffect } from 'react';
import apiClient from '@/lib/api-client';

interface CourseRecord {
  _id: string;
  code: string;
  name: string;
  description: string;
  instructor: string;
  credits: number;
  semester: number;
  status: string;
  students: number;
  enrolledStudents: string[];
}

export default function AdminCoursesPage() {
  const isChecking = useRequireAuth();
  const [courses, setCourses] = useState<CourseRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    instructor: '',
    credits: '3',
    semester: '1',
    status: 'ACTIVE',
  });

  useEffect(() => {
    if (!isChecking) {
      fetchCourses();
    }
  }, [isChecking]);

  const fetchCourses = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get('/courses');
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setFormData({
      code: '', name: '', description: '', instructor: '',
      credits: '3', semester: '1', status: 'ACTIVE',
    });
    setEditingId(null);
  };

  const handleAddNew = () => {
    resetForm();
    setShowModal(true);
  };

  const handleEdit = (course: CourseRecord) => {
    setFormData({
      code: course.code,
      name: course.name,
      description: course.description || '',
      instructor: course.instructor || '',
      credits: course.credits?.toString() || '3',
      semester: course.semester?.toString() || '1',
      status: course.status || 'ACTIVE',
    });
    setEditingId(course._id);
    setShowModal(true);
  };

  const handleSave = async () => {
    const payload = {
      ...formData,
      credits: parseInt(formData.credits, 10),
      semester: parseInt(formData.semester, 10),
    };

    try {
      if (editingId) {
        await apiClient.put(`/courses/${editingId}`, payload);
      } else {
        await apiClient.post('/courses', payload);
      }
      setShowModal(false);
      resetForm();
      await fetchCourses();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to save course');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this course? Enrolled students will lose access.')) return;
    try {
      await apiClient.delete(`/courses/${id}`);
      await fetchCourses();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to delete course');
    }
  };

  const filteredCourses = courses.filter(c =>
    c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.instructor || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isChecking) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a', color: '#94a3b8' }}>
        Checking authentication...
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
                Manage Courses
              </h1>
              <p style={{ color: '#94a3b8' }}>Add, edit, and manage all courses</p>
            </div>
            <button
              onClick={handleAddNew}
              style={{ padding: '12px 24px', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)', color: 'white', fontWeight: 700, cursor: 'pointer' }}
            >
              + Add New Course
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            <StatBox label="Total Courses" value={courses.length.toString()} />
            <StatBox label="Total Credits" value={courses.reduce((sum, c) => sum + (c.credits || 0), 0).toString()} />
            <StatBox label="Total Enrollments" value={courses.reduce((sum, c) => sum + (c.students || 0), 0).toString()} />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <input
              type="text"
              placeholder="Search by code, name, or instructor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #475569', background: '#1e293b', color: 'white', fontSize: '14px' }}
            />
          </div>

          {isLoading ? (
            <p style={{ color: '#94a3b8' }}>Loading courses...</p>
          ) : (
            <div style={{ background: '#1e293b', borderRadius: '16px', border: '1px solid #475569', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#334155' }}>
                    <th style={thStyle}>Code</th>
                    <th style={thStyle}>Name</th>
                    <th style={thStyle}>Instructor</th>
                    <th style={thStyle}>Credits</th>
                    <th style={thStyle}>Semester</th>
                    <th style={thStyle}>Students</th>
                    <th style={thStyle}>Status</th>
                    <th style={thStyle}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCourses.map((course) => (
                    <tr key={course._id} style={{ borderBottom: '1px solid #334155' }}>
                      <td style={tdStyle}><strong>{course.code}</strong></td>
                      <td style={tdStyle}>{course.name}</td>
                      <td style={tdStyle}>{course.instructor || '—'}</td>
                      <td style={tdStyle}>{course.credits}</td>
                      <td style={tdStyle}>{course.semester}</td>
                      <td style={tdStyle}>{course.students || 0}</td>
                      <td style={tdStyle}>
                        <span style={{
                          padding: '4px 10px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          background: course.status === 'ACTIVE' ? '#166534' : '#7f1d1d',
                          color: course.status === 'ACTIVE' ? '#dcfce7' : '#fca5a5',
                        }}>
                          {course.status}
                        </span>
                      </td>
                      <td style={tdStyle}>
                        <button onClick={() => handleEdit(course)} style={actionBtnStyle('#3b82f6')}>Edit</button>
                        <button onClick={() => handleDelete(course._id)} style={actionBtnStyle('#ef4444')}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredCourses.length === 0 && (
                <p style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>No courses found.</p>
              )}
            </div>
          )}

        </div>
      </main>

      {showModal && (
        <CourseModal
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

function StatBox({ label, value }: any) {
  return (
    <div style={{ background: '#1e293b', borderRadius: '12px', padding: '16px', border: '1px solid #475569' }}>
      <p style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 600, marginBottom: '6px' }}>{label}</p>
      <p style={{ fontSize: '28px', fontWeight: 800, color: '#60a5fa' }}>{value}</p>
    </div>
  );
}

function CourseModal({ formData, handleInputChange, handleSave, handleClose, isEditing }: any) {
  return (
    <div onClick={handleClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: '#1e293b', borderRadius: '16px', padding: '32px', maxWidth: '500px', width: '90%', border: '1px solid #475569', maxHeight: '90vh', overflowY: 'auto' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#f1f5f9', marginBottom: '24px' }}>
          {isEditing ? 'Edit Course' : 'Add New Course'}
        </h2>

        <FormField label="Course Code" name="code" value={formData.code} onChange={handleInputChange} placeholder="e.g., CSC 112" />
        <FormField label="Course Name" name="name" value={formData.name} onChange={handleInputChange} placeholder="e.g., Introduction to Programming" />
        <FormField label="Instructor" name="instructor" value={formData.instructor} onChange={handleInputChange} placeholder="e.g., Dr. James Okafor" />
        <FormField label="Description" name="description" value={formData.description} onChange={handleInputChange} placeholder="Brief course description" />
        <FormField label="Credits" name="credits" type="number" value={formData.credits} onChange={handleInputChange} />
        <FormField label="Semester" name="semester" type="number" value={formData.semester} onChange={handleInputChange} />

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '6px', color: '#cbd5e1', fontSize: '12px', fontWeight: 600 }}>Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #475569', background: '#334155', color: 'white', fontSize: '14px' }}
          >
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>

        <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
          <button onClick={handleSave} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', background: '#3b82f6', color: 'white', fontWeight: 700, cursor: 'pointer' }}>
            {isEditing ? 'Update' : 'Create'} Course
          </button>
          <button onClick={handleClose} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #475569', background: 'transparent', color: '#94a3b8', fontWeight: 700, cursor: 'pointer' }}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function FormField({ label, name, value, onChange, type = 'text', placeholder = '' }: any) {
  return (
    <div style={{ marginBottom: '16px' }}>
      <label style={{ display: 'block', marginBottom: '6px', color: '#cbd5e1', fontSize: '12px', fontWeight: 600 }}>{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #475569', background: '#334155', color: 'white', fontSize: '14px', boxSizing: 'border-box' }}
      />
    </div>
  );
}