'use client';

import { useState, useEffect } from 'react';
import apiClient from '@/lib/api-client';
import { useRequireAdmin } from '@/lib/useRequireAdmin';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { PageHeader } from '@/components/ui/PageHeader';

interface Course {
  _id: string;
  code: string;
  name: string;
}

interface RosterEntry {
  studentId: string;
  name: string;
  email: string;
  score: number | null;
  letterGrade: string | null;
  published: boolean;
}

export default function AdminGradesPage() {
  const isChecking = useRequireAdmin();

  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [roster, setRoster] = useState<RosterEntry[]>([]);
  const [isLoadingRoster, setIsLoadingRoster] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (isChecking) return;
    apiClient.get('/courses').then((res) => setCourses(res.data));
  }, [isChecking]);

  useEffect(() => {
    if (!selectedCourse) {
      setRoster([]);
      return;
    }
    setIsLoadingRoster(true);
    apiClient
      .get(`/grades/roster/${selectedCourse}`)
      .then((res) => setRoster(res.data))
      .catch(() => setRoster([]))
      .finally(() => setIsLoadingRoster(false));
  }, [selectedCourse]);

  const updateScore = (studentId: string, value: string) => {
    const score = value === '' ? null : Math.max(0, Math.min(100, Number(value)));
    setRoster((prev) =>
      prev.map((r) => (r.studentId === studentId ? { ...r, score } : r)),
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    setMessage('');
    try {
      const records = roster
        .filter((r) => r.score !== null)
        .map((r) => ({ studentId: r.studentId, score: r.score as number }));

      await apiClient.post('/grades/save', { courseId: selectedCourse, records });
      setMessage('success:Grades saved successfully.');

      const res = await apiClient.get(`/grades/roster/${selectedCourse}`);
      setRoster(res.data);
    } catch (err: any) {
      setMessage(`error:${err.response?.data?.message || 'Failed to save grades.'}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    setMessage('');
    try {
      await apiClient.post(`/grades/publish/${selectedCourse}`);
      setMessage('success:Grades published to students.');
      const res = await apiClient.get(`/grades/roster/${selectedCourse}`);
      setRoster(res.data);
    } catch (err: any) {
      setMessage(`error:${err.response?.data?.message || 'Failed to publish grades.'}`);
    } finally {
      setIsPublishing(false);
    }
  };

  if (isChecking) return null;

  const isSuccess = message.startsWith('success:');
  const messageText = message.split(':').slice(1).join(':');

  return (
    <div className="min-h-screen bg-slate-950 p-8">
      <PageHeader
        title="Manage Grades"
        subtitle="Enter scores and publish grades for a course."
      />

      <Card className="mb-6">
        <label className="block text-slate-300 text-sm mb-2">Course</label>
        <select
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
          className="w-full max-w-md px-4 py-2.5 bg-slate-900/60 border border-slate-600 rounded-lg text-slate-100 outline-none"
        >
          <option value="">Select a course</option>
          {courses.map((c) => (
            <option key={c._id} value={c._id}>
              {c.code} — {c.name}
            </option>
          ))}
        </select>
      </Card>

      {message && (
        <div
          className={`px-4 py-3 rounded-lg mb-6 text-sm ${
            isSuccess ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
          }`}
        >
          {messageText}
        </div>
      )}

      {isLoadingRoster && <p className="text-slate-400">Loading roster...</p>}

      {!isLoadingRoster && selectedCourse && roster.length === 0 && (
        <p className="text-slate-400">No students enrolled in this course.</p>
      )}

      {roster.length > 0 && (
        <Card>
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left p-3 text-slate-400 text-xs font-semibold">Name</th>
                <th className="text-left p-3 text-slate-400 text-xs font-semibold">Email</th>
                <th className="text-left p-3 text-slate-400 text-xs font-semibold">Score</th>
                <th className="text-left p-3 text-slate-400 text-xs font-semibold">Grade</th>
                <th className="text-left p-3 text-slate-400 text-xs font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {roster.map((r) => (
                <tr key={r.studentId} className="border-b border-slate-800">
                  <td className="p-3 text-slate-200 text-sm">{r.name}</td>
                  <td className="p-3 text-slate-400 text-sm">{r.email}</td>
                  <td className="p-3">
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={r.score ?? ''}
                      onChange={(e) => updateScore(r.studentId, e.target.value)}
                      placeholder="0-100"
                      className="w-24 px-3 py-1.5 bg-slate-900/60 border border-slate-600 rounded-md text-slate-100 outline-none text-sm"
                    />
                  </td>
                  <td className="p-3">
                    {r.letterGrade ? (
                      <Badge color={r.letterGrade === 'F' ? 'red' : r.letterGrade === 'A' ? 'green' : 'blue'}>
                        {r.letterGrade}
                      </Badge>
                    ) : (
                      <span className="text-slate-500 text-sm">—</span>
                    )}
                  </td>
                  <td className="p-3">
                    <Badge color={r.published ? 'green' : 'gray'}>
                      {r.published ? 'Published' : 'Draft'}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex gap-3 mt-6">
            <Button onClick={handleSave} disabled={isSaving} variant="primary">
              {isSaving ? 'Saving...' : 'Save Grades'}
            </Button>
            <Button onClick={handlePublish} disabled={isPublishing} variant="secondary">
              {isPublishing ? 'Publishing...' : 'Publish to Students'}
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}