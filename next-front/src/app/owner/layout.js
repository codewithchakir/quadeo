'use client';

import Link from 'next/link';
import { useState } from 'react';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { 
  Home, 
  Users, 
  Package,
  Calendar,
  LogOut,
  Menu,
  X
} from 'lucide-react';

import ProtectedRoute from '@/components/ProtectedRoute';

export default function OwnerLayout({ children }) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push('/auth/login');
  };

  const handleNavigation = (path) => {
    router.push(path);
    setIsSidebarOpen(false);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const isActive = (path) => {
    if (path === '/owner/dashboard') {
      return pathname === path;
    }
    return pathname.includes(path);
  };

  const navigationItems = [
    {
      label: 'Dashboard',
      items: [
        { icon: Home, label: 'Overview', path: '/owner/dashboard' }
      ]
    },
    {
      label: 'Content Management',
      items: [
        { icon: Users, label: 'My Activities', path: '/owner/activities' }
      ]
    },
    {
      label: 'Booking Management',
      items: [
        { icon: Package, label: 'All Bookings', path: '/owner/bookings' }
      ]
    }
  ];

  return (
    <ProtectedRoute requiredRole="owner">
      <div className="min-h-screen flex w-full">
        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div 
          className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="h-full flex flex-col">
            {/* Mobile Close Button */}
            <div className="lg:hidden absolute top-4 right-4 z-10">
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Logo */}
            <div className="p-6 border-b">
              <Link href="/" className="text-2xl font-bold text-primary-600">
                Quadeo
              </Link>
              <p className="text-sm text-gray-600 mt-1">Owner Panel</p>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto py-4">
              {navigationItems.map((section, sectionIndex) => (
                <div key={sectionIndex} className="mb-6">
                  <h3 className="px-6 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    {section.label}
                  </h3>
                  <nav className="mt-2 space-y-1">
                    {section.items.map((item, itemIndex) => {
                      const Icon = item.icon;
                      const active = isActive(item.path);
                      
                      return (
                        <button
                          key={itemIndex}
                          onClick={() => handleNavigation(item.path)}
                          className={`w-full flex items-center px-6 py-3 text-sm font-medium transition-colors duration-200 ${
                            active
                              ? 'bg-blue-50 text-primary-700 border-r-2 border-primary-700'
                              : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                          }`}
                        >
                          <Icon className="w-5 h-5 mr-3 flex-shrink-0" />
                          <span>{item.label}</span>
                        </button>
                      );
                    })}
                  </nav>
                </div>
              ))}
            </div>

            {/* User Profile & Logout */}
            <div className="border-t p-4">
              <button
                onClick={handleLogout}
                className="w-full flex items-center px-4 py-3 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors duration-200"
              >
                <LogOut className="w-5 h-5 mr-3" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 lg:ml-0 min-h-screen">
          {/* Mobile Header */}
          <div className="lg:hidden sticky top-0 z-30 bg-white border-b shadow-sm">
            <div className="flex items-center justify-between p-4">
              <button
                onClick={toggleSidebar}
                className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200"
              >
                <Menu className="w-6 h-6" />
              </button>
              
              <Link href="/" className="text-xl font-bold text-primary-600">
                Quadeo
              </Link>
              
              <div className="w-10"></div> {/* Spacer for balance */}
            </div>
          </div>

          {/* Page Content */}
          <div className="p-4 lg:p-6">
            {children}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}