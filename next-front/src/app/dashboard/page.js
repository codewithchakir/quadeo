'use client';

import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function DashboardRedirect() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      switch (user.role) {
        case 'admin':
          router.push('/admin/dashboard');
          break;
        case 'owner':
          router.push('/owner/dashboard');
          break;
        default:
          router.push('/activities');
      }
    }
  }, [user, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>
  );
}