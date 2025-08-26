'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import ClientOnly from '@/components/ClientOnly';
import { useAuth } from '@/contexts/AuthContext';

export default function OwnerDashboard() {
  const { user } = useAuth();

  return (
    <ClientOnly
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      }
    >
      <ProtectedRoute requiredRole="owner">
        <div className="container mx-auto p-6">
          <h1 className="text-3xl font-bold mb-6">Owner Dashboard</h1>
          <p>Welcome, {user?.name}!</p>
          {/* Add Owner dashboard content here */}
        </div>
      </ProtectedRoute>
    </ClientOnly>
  );
}