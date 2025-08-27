'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { 
  Home, 
  Users, 
  Package,
  LogOut
} from 'lucide-react';

import ProtectedRoute from '@/components/ProtectedRoute';

export default function OwnerLayout({ children }) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await logout();
    router.push('/auth/login');
  };

  const handleNavigation = (path) => {
    router.push(path);
  };

  return (
    <ProtectedRoute requiredRole="owner">
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        {/* Sidebar */}
        <Sidebar className="border-r">
          <SidebarContent>
            {/* Logo */}
            <div className="p-4 border-b">
              <h1 className="text-2xl font-bold text-primary">quadeo</h1>
              <p className="text-sm text-muted-foreground">Owner Panel</p>
            </div>

            {/* Navigation */}
            <SidebarGroup>
              <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      onClick={() => handleNavigation('/owner/dashboard')}
                      isActive={pathname === '/owner/dashboard'}
                    >
                      <Home className="w-4 h-4" />
                      <span>Overview</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>Content Management</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      onClick={() => handleNavigation('/owner/activities')}
                      isActive={pathname === '/owner/activities'}
                    >
                      <Users className="w-4 h-4" />
                      <span>My Activities</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>Booking Management</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      onClick={() => handleNavigation('/owner/bookings')}
                      isActive={pathname.includes('/owner/bookings')}
                    >
                      <Package className="w-4 h-4" />
                      <span>All Bookings</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* User Profile & Logout */}
            <div className="mt-auto p-4 border-t">
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      onClick={handleLogout} className="text-red-600"
                    >
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            </div>
          </SidebarContent>
        </Sidebar>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
    </ProtectedRoute>
  );
}