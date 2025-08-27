'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!loading && isClient) {
      if (!user) {
        router.push('/auth/login');
      } else if (requiredRole && user.role !== requiredRole) {
        router.push('/unauthorized');
      }
    }
  }, [user, loading, router, requiredRole, isClient]);

  // Show loading state during SSR and initial client render
  if (!isClient || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Don't render content until we're sure about auth state
  if (!user || (requiredRole && user.role !== requiredRole)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;