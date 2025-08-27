'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  DollarSign,
  Calendar,
  Package,
  Users as UsersIcon,
  UserCheck,
  UserX,
  TrendingUp,
  Package as PackageIcon,
  CreditCard as CreditCardIcon,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';
import api from '@/lib/axios';
import { toast } from 'react-toastify';

export default function AdminDashboard() {
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState(null);
  const [statsData, setStatsData] = useState(null);
  const [pendingOwners, setPendingOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOwner, setSelectedOwner] = useState(null);
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [dashboardResponse, statsResponse, pendingOwnersResponse] = await Promise.all([
          api.get('/admin/dashboard'),
          api.get('/admin/stats'),
          api.get('/admin/pending-owners')
        ]);
        
        setDashboardData(dashboardResponse.data);
        setStatsData(statsResponse.data);
        setPendingOwners(pendingOwnersResponse.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleApprove = async (ownerId) => {
    try {
      await api.post(`/admin/approve-owner/${ownerId}`);
      toast.success('Owner approved successfully');
      setApproveDialogOpen(false);
      // Refresh the pending owners list
      const response = await api.get('/admin/pending-owners');
      setPendingOwners(response.data);
    } catch (error) {
      console.error('Error approving owner:', error);
      toast.error('Failed to approve owner');
    }
  };

  const handleReject = async (ownerId) => {
    try {
      await api.post(`/admin/reject-owner/${ownerId}`);
      toast.success('Owner rejected successfully');
      setRejectDialogOpen(false);
      // Refresh the pending owners list
      const response = await api.get('/admin/pending-owners');
      setPendingOwners(response.data);
    } catch (error) {
      console.error('Error rejecting owner:', error);
      toast.error('Failed to reject owner');
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      pending: 'secondary',
      approved: 'default',
      rejected: 'destructive'
    };
    
    const icons = {
      pending: <Clock className="w-3 h-3 mr-1" />,
      approved: <CheckCircle className="w-3 h-3 mr-1" />,
      rejected: <AlertCircle className="w-3 h-3 mr-1" />
    };

    return (
      <Badge variant={variants[status] || 'secondary'} className="flex items-center">
        {icons[status]}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  // Calculate booking growth percentage
  const calculateBookingGrowth = () => {
    if (!statsData?.monthly_bookings || statsData.monthly_bookings.length < 2) return 0;
    
    const currentMonth = statsData.monthly_bookings[0];
    const previousMonth = statsData.monthly_bookings[1];
    
    if (!previousMonth || previousMonth.count === 0) return 100;
    
    return Math.round(((currentMonth.count - previousMonth.count) / previousMonth.count) * 100);
  };

  const bookingGrowth = calculateBookingGrowth();

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
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's your platform overview</p>
        </div>
        <Button onClick={() => window.location.reload()} variant="outline">
          <TrendingUp className="w-4 h-4 mr-2" />
          Refresh Data
        </Button>
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
              {dashboardData?.stats?.total_revenue?.toLocaleString() || '0'} DH
            </div>
            <p className="text-xs text-muted-foreground">
              From all completed bookings
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsData?.monthly_bookings?.[0]?.count || '0'}
            </div>
            <div className="flex items-center text-xs">
              {bookingGrowth >= 0 ? (
                <span className="text-green-600">+{bookingGrowth}%</span>
              ) : (
                <span className="text-red-600">{bookingGrowth}%</span>
              )}
              <span className="text-muted-foreground ml-1">from last month</span>
            </div>
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
              Across {statsData?.category_stats?.length || '0'} categories
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Owners</CardTitle>
            <UsersIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {pendingOwners.length || '0'}
            </div>
            <p className="text-xs text-muted-foreground">
              Need approval
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Recent Activities Section */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>
              Recently added activities by owners
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Activity</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Location</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dashboardData?.recent_activities?.slice(0, 5).map((activity) => (
                  <TableRow key={activity.id}>
                    <TableCell className="font-medium">{activity.title}</TableCell>
                    <TableCell>{activity.owner?.name}</TableCell>
                    <TableCell>{activity.category?.name}</TableCell>
                    <TableCell>{activity.price} DH</TableCell>
                    <TableCell className="max-w-[120px] truncate">{activity.location}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Right Sidebar */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
            <CardDescription>
              Platform insights at a glance
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Category Distribution */}
            <div>
              <h4 className="text-sm font-medium mb-3">Category Distribution</h4>
              <div className="space-y-3">
                {statsData?.category_stats?.map((category) => (
                  <div key={category.id} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{category.name}</span>
                      <span>{category.activities_count} activities</span>
                    </div>
                    <Progress 
                      value={(category.activities_count / dashboardData?.stats?.total_activities) * 100} 
                      className="h-2" 
                    />
                  </div>
                ))}
              </div>
            </div>
            
            <Separator />
            
            {/* Monthly Booking Trends */}
            <div>
              <h4 className="text-sm font-medium mb-3">Monthly Bookings</h4>
              <div className="space-y-2">
                {statsData?.monthly_bookings?.slice(0, 3).map((monthData, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {new Date(monthData.year, monthData.month - 1).toLocaleString('default', { month: 'short' })} {monthData.year}
                    </span>
                    <span className="font-medium">{monthData.count} bookings</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Pending Owners Section */}
        <Card>
          <CardHeader>
            <CardTitle>Pending Owners</CardTitle>
            <CardDescription>
              Owners waiting for approval
            </CardDescription>
          </CardHeader>
          <CardContent>
            {pendingOwners.length === 0 ? (
              <div className="text-center py-8">
                <UserCheck className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">No pending owners</h3>
                <p className="text-muted-foreground">
                  All owners have been reviewed
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Owner</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Registered</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingOwners.slice(0, 3).map((owner) => (
                    <TableRow key={owner.id}>
                      <TableCell className="font-medium">{owner.name}</TableCell>
                      <TableCell>{owner.email}</TableCell>
                      <TableCell>{new Date(owner.created_at).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => {
                              setSelectedOwner(owner);
                              setApproveDialogOpen(true);
                            }}
                          >
                            <UserCheck className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => {
                              setSelectedOwner(owner);
                              setRejectDialogOpen(true);
                            }}
                          >
                            <UserX className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
            {pendingOwners.length > 3 && (
              <div className="mt-4 text-center">
                <Button variant="outline" onClick={() => router.push('/admin/owners')}>
                  View All Pending Owners
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Bookings Section */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
            <CardDescription>
              Latest bookings made by clients
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Activity</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dashboardData?.recent_bookings?.slice(0, 3).map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell className="font-medium">
                      <div>
                        <div>{booking.client_name}</div>
                        <div className="text-sm text-muted-foreground">{booking.client_email}</div>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[150px] truncate">{booking.activity?.title}</TableCell>
                    <TableCell>{new Date(booking.date).toLocaleDateString()}</TableCell>
                    <TableCell>{(booking.activity?.price * booking.guests).toFixed(2)} DH</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {dashboardData?.recent_bookings?.length > 3 && (
              <div className="mt-4 text-center">
                <Button variant="outline" onClick={() => router.push('/admin/bookings')}>
                  View All Bookings
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Approve Confirmation Dialog */}
      <Dialog open={approveDialogOpen} onOpenChange={setApproveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Owner</DialogTitle>
            <DialogDescription>
              Are you sure you want to approve {selectedOwner?.name}? This will grant them full access to the owner dashboard.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setApproveDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => handleApprove(selectedOwner?.id)}>
              <UserCheck className="w-4 h-4 mr-2" />
              Approve Owner
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Confirmation Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Owner</DialogTitle>
            <DialogDescription>
              Are you sure you want to reject {selectedOwner?.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => handleReject(selectedOwner?.id)}>
              <UserX className="w-4 h-4 mr-2" />
              Reject Owner
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}