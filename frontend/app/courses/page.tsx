'use client';

import { Sidebar } from '@/components/layout/sidebar';
import { useRequireAuth } from '@/lib/useRequireAuth';
import { useState, useEffect } from 'react';
import apiClient from '@/lib/api-client';

interface Course {
  _id: string;
  code: string;
  name: string;
  description: string;
  instructor: string;
  credits: number;
  semester: number;
  students: number;
  enrolledStudents: string[];
}

export default function CoursesPage() {
  const isChecking = useRequireAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [studentId, setStudentId] = useState('');
  const [enrollingId, setEnrollingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (isChecking) return;

    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      setStudentId(user.id || user._id);
    }
    fetchCourses();
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

  const isEnrolled = (course: Course) => {
    return course.enrolledStudents?.includes(studentId);
  };

  const handleToggleEnroll = async (courseId: string, currentlyEnrolled: boolean) => {
    if (!studentId) {
      alert('Please sign in first!');
      return;
    }

    setEnrollingId(courseId);

    try {
      if (currentlyEnrolled) {
        await apiClient.post(`/courses/${courseId}/unenroll`, { studentId });
      } else {
        await apiClient.post(`/courses/${courseId}/enroll`, { studentId });
      }
      await fetchCourses();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Action failed. Please try again.');
    } finally {
      setEnrollingId(null);
    }
  };

  const filteredCourses = courses.filter(course =>
    course.code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const enrolledCount = courses.filter(c => isEnrolled(c)).length;
  const totalCredits = courses
    .filter(c => isEnrolled(c))
    .reduce((sum, c) => sum + (c.credits || 0), 0);

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
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

          <div style={{ marginBottom: '40px' }}>
            <h1 style={{ fontSize: '36px', fontWeight: 800, color: '#f1f5f9', marginBottom: '8px' }}>
              📚 Available Courses
            </h1>
            <p style={{ color: '#94a3b8' }}>Explore and enroll in courses</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
            <StatBox icon="📖" label="Total Courses" value={courses.length.toString()} />
            <StatBox icon="✅" label="Enrolled" value={enrolledCount.toString()} />
            <StatBox icon="⭐" label="Total Credits" value={totalCredits.toString()} />
          </div>

          <div style={{ marginBottom: '32px' }}>
            <input
              type="text"
              placeholder="🔍 Search by code or name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #475569', background: '#1e293b', color: 'white', fontSize: '14px' }}
            />
          </div>

          {isLoading ? (
            <p style={{ color: '#94a3b8' }}>⏳ Loading courses...</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
              {filteredCourses.map((course) => (
                <CourseCard
                  key={course._id}
                  course={course}
                  isEnrolled={isEnrolled(course)}
                  isProcessing={enrollingId === course._id}
                  onToggle={() => handleToggleEnroll(course._id, isEnrolled(course))}
                />
              ))}
            </div>
          )}

          {!isLoading && filteredCourses.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px', background: '#1e293b', borderRadius: '16px' }}>
              <p style={{ color: '#94a3b8' }}>No courses found.</p>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}

function CourseCard({ course, isEnrolled, isProcessing, onToggle }: any) {
  return (
    <div style={{
      background: '#1e293b',
      borderRadius: '16px',
      padding: '24px',
      border: isEnrolled ? '2px solid #3b82f6' : '1px solid #475569',
    }}>
      {isEnrolled && (
        <div style={{ display: 'inline-block', background: '#166534', color: '#dcfce7', padding: '6px 12px', borderRadius: '12px', fontSize: '11px', fontWeight: 700, marginBottom: '12px' }}>
          ✅ ENROLLED
        </div>
      )}

      <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#f1f5f9', marginBottom: '8px' }}>
        {course.code}
      </h3>
      <p style={{ fontSize: '16px', fontWeight: 600, color: '#cbd5e1', marginBottom: '12px' }}>
        {course.name}
      </p>

      <div style={{ borderTop: '1px solid #334155', paddingTop: '16px', marginBottom: '16px' }}>
        <p style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '8px' }}>
          👨‍🏫 <strong>Instructor:</strong> {course.instructor || '—'}
        </p>
        <p style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '8px' }}>
          ⭐ <strong>Credits:</strong> {course.credits}
        </p>
        <p style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '8px' }}>
          👥 <strong>Enrolled:</strong> {course.students || 0} students
        </p>
        <p style={{ fontSize: '13px', color: '#64748b' }}>
          {course.description}
        </p>
      </div>

      <button
        onClick={onToggle}
        disabled={isProcessing}
        style={{
          width: '100%',
          padding: '12px',
          borderRadius: '8px',
          border: 'none',
          background: isEnrolled ? '#7f1d1d' : '#1e40af',
          color: isEnrolled ? '#fca5a5' : '#bfdbfe',
          fontWeight: 700,
          cursor: isProcessing ? 'not-allowed' : 'pointer',
          fontSize: '14px',
          opacity: isProcessing ? 0.6 : 1
        }}
      >
        {isProcessing ? '⏳ Processing...' : (isEnrolled ? '❌ Unenroll' : '✅ Enroll')}
      </button>
    </div>
  );
}

function StatBox({ icon, label, value }: any) {
  return (
    <div style={{ background: '#1e293b', borderRadius: '12px', padding: '16px', textAlign: 'center', border: '1px solid #475569' }}>
      <div style={{ fontSize: '28px', marginBottom: '8px' }}>{icon}</div>
      <p style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 600, marginBottom: '4px' }}>{label}</p>
      <p style={{ fontSize: '24px', fontWeight: 800, color: '#60a5fa' }}>{value}</p>
    </div>
  );
}