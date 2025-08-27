// Owner Dashboard Page (page.js)
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  DollarSign,
  Calendar,
  Package,
  Users,
  TrendingUp,
  PlusCircle,
  Eye,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';
import api from '@/lib/axios';
import { toast } from 'react-toastify';

export default function OwnerDashboard() {
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get('/owner/dashboard');
        setDashboardData(response.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getStatusBadge = (status) => {
    const variants = {
      pending: 'secondary',
      confirmed: 'default',
      completed: 'success',
      cancelled: 'destructive'
    };
    
    const icons = {
      pending: <Clock className="w-3 h-3 mr-1" />,
      confirmed: <CheckCircle className="w-3 h-3 mr-1" />,
      completed: <CheckCircle className="w-3 h-3 mr-1" />,
      cancelled: <XCircle className="w-3 h-3 mr-1" />
    };

    return (
      <Badge variant={variants[status] || 'secondary'} className="flex items-center">
        {icons[status]}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard Overview</h1>
          <p className="text-muted-foreground">Welcome back! Here's your business overview</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => router.push('/owner/activities/new')}>
            <PlusCircle className="w-4 h-4 mr-2" />
            New Activity
          </Button>
          <Button variant="outline" onClick={() => window.location.reload()}>
            <TrendingUp className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData?.stats?.revenue?.toLocaleString() || '0'} DH
            </div>
            <p className="text-xs text-muted-foreground">
              From all completed bookings
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Activities</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData?.stats?.total_activities?.toLocaleString() || '0'}
            </div>
            <p className="text-xs text-muted-foreground">
              Your listed experiences
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData?.stats?.total_bookings?.toLocaleString() || '0'}
            </div>
            <p className="text-xs text-muted-foreground">
              All-time reservations
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Bookings</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData?.stats?.pending_bookings?.toLocaleString() || '0'}
            </div>
            <p className="text-xs text-muted-foreground">
              Need your confirmation
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Recent Bookings Section */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
            <CardDescription>
              Latest bookings for your activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            {dashboardData?.recent_bookings?.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client</TableHead>
                    <TableHead>Activity</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Guests</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dashboardData.recent_bookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{booking.client_name}</div>
                          <div className="text-sm text-muted-foreground">{booking.client_email}</div>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[150px] truncate">
                        {booking.activity?.title}
                      </TableCell>
                      <TableCell>{new Date(booking.date).toLocaleDateString()}</TableCell>
                      <TableCell>{booking.guests}</TableCell>
                      <TableCell>{(booking.activity?.price * booking.guests).toFixed(2)} DH</TableCell>
                      <TableCell>{getStatusBadge(booking.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8">
                <Calendar className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">No bookings yet</h3>
                <p className="text-muted-foreground">
                  Your bookings will appear here once clients start booking your activities
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions & Recent Activities */}
        <div className="col-span-3 space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Manage your business quickly
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                className="w-full justify-start" 
                onClick={() => router.push('/owner/activities/new')}
              >
                <PlusCircle className="w-4 h-4 mr-2" />
                Create New Activity
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => router.push('/owner/activities')}
              >
                <Package className="w-4 h-4 mr-2" />
                Manage Activities
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => router.push('/owner/bookings')}
              >
                <Calendar className="w-4 h-4 mr-2" />
                View All Bookings
              </Button>
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <Card>
            <CardHeader>
              <CardTitle>Your Activities</CardTitle>
              <CardDescription>
                Recently updated experiences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {dashboardData?.recent_activities?.length > 0 ? (
                dashboardData.recent_activities.slice(0, 3).map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-2 border rounded-md">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{activity.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {activity.bookings_count} bookings • {activity.price} DH
                      </p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => router.push(`/owner/activities/${activity.id}`)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                ))
              ) : (
                <div className="text-center py-4">
                  <Package className="mx-auto h-8 w-8 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mt-2">
                    No activities yet
                  </p>
                </div>
              )}
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => router.push('/owner/activities')}
              >
                View All Activities
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}