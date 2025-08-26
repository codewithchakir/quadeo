'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { 
  Home, 
  Users, 
  Activity, 
  Settings, 
  LogOut, 
  Calendar,
  CreditCard,
  ChevronDown,
  Menu
} from 'lucide-react';

export default function AdminLayout({ children }) {
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
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        {/* Sidebar */}
        <Sidebar className="border-r">
          <SidebarContent>
            {/* Logo */}
            <div className="p-4 border-b">
              <h1 className="text-2xl font-bold text-primary">quadeo</h1>
            </div>

            {/* Navigation */}
            <SidebarGroup>
              <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      onClick={() => handleNavigation('/admin/dashboard')}
                      isActive={pathname === '/admin/dashboard'}
                    >
                      <Home className="w-4 h-4" />
                      <span>Overview</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>Management</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      onClick={() => handleNavigation('/admin/owners')}
                      isActive={pathname === '/admin/owners'}
                    >
                      <Users className="w-4 h-4" />
                      <span>Owners</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      onClick={() => handleNavigation('/admin/activities')}
                      isActive={pathname.includes('/admin/activities')}
                    >
                      <Activity className="w-4 h-4" />
                      <span>Activities</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      onClick={() => handleNavigation('/admin/bookings')}
                      isActive={pathname.includes('/admin/bookings')}
                    >
                      <Calendar className="w-4 h-4" />
                      <span>Bookings</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      onClick={() => handleNavigation('/admin/categories')}
                      isActive={pathname.includes('/admin/categories')}
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>Categories</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>System</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      onClick={() => handleNavigation('/admin/settings')}
                      isActive={pathname.includes('/admin/settings')}
                    >
                      <Settings className="w-4 h-4" />
                      <span>Settings</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* User Profile & Logout */}
            <div className="mt-auto p-4 border-t">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="w-full justify-start">
                    <Avatar className="w-6 h-6 mr-2">
                      <AvatarImage src={user?.avatar} />
                      <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="truncate">{user?.name}</span>
                    <ChevronDown className="w-4 h-4 ml-auto" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
  );
}