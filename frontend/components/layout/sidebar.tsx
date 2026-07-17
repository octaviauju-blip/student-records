'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';

export function Sidebar() {
  const router = useRouter();
  const { logout, user } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push('/signin');
  };

  const menuItems = [
    { href: '/dashboard', label: 'Dashboard', icon: '📊' },
    { href: '/courses', label: 'Courses', icon: '📚' },
    { href: '/attendance', label: 'Attendance', icon: '🗓️' },
    { href: '/profile', label: 'Profile', icon: '👤' },
  ];

  // Show admin link only if user role is admin
  const adminItems = user?.role === 'admin'
  ? [
      { href: '/admin/students', label: 'Manage Students', icon: '⚙️' },
      { href: '/admin/courses', label: 'Manage Courses', icon: '📖' },
      { href: '/admin/attendance', label: 'Mark Attendance', icon: '✅' },
    ]
  : [];

  return (
    <aside className="hidden lg:block fixed left-0 top-0 w-64 h-screen bg-slate-900 text-white p-6 overflow-y-auto">
      <h1 className="text-2xl font-bold mb-8 text-white">Student Records</h1>
      <nav className="space-y-2">
        {[...menuItems, ...adminItems].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="block px-4 py-3 rounded-lg hover:bg-slate-800 transition-colors text-sm font-medium"
          >
            <span className="mr-3">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>
      <button
        onClick={handleLogout}
        className="mt-8 w-full px-4 py-3 bg-red-600 rounded-lg hover:bg-red-700 transition-colors font-medium"
      >
        🚪 Logout
      </button>
    </aside>
  );
}