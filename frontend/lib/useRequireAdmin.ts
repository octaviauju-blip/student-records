'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export function useRequireAdmin() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token) {
      router.push('/signin');
      return;
    }

    try {
      const user = userData ? JSON.parse(userData) : null;
      if (!user || user.role !== 'admin') {
        router.push('/dashboard');
        return;
      }
      setIsChecking(false);
    } catch {
      router.push('/signin');
    }
  }, [router]);

  return isChecking;
}