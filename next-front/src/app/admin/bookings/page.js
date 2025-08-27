'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Calendar,
  DollarSign,
  Users as UsersIcon,
  Search,
  RefreshCw,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Mail,
  Phone
} from 'lucide-react';
import api from '@/lib/axios';
import { toast } from 'react-toastify';

export default function BookingsManagement() {
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    cancelled: 0,
    totalRevenue: 0
  });

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    filterBookings();
    calculateStats();
  }, [bookings, searchTerm, statusFilter]);

  const fetchBookings = async () => {
    try {
      const response = await api.get('/bookings');
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const filterBookings = () => {
    let filtered = bookings;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(booking =>
        booking.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.client_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.activity?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.activity?.owner?.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(booking => booking.status === statusFilter);
    }

    setFilteredBookings(filtered);
  };

  const calculateStats = () => {
    const statsData = {
      total: bookings.length,
      pending: bookings.filter(b => b.status === 'pending').length,
      confirmed: bookings.filter(b => b.status === 'confirmed').length,
      cancelled: bookings.filter(b => b.status === 'cancelled').length,
      completed: bookings.filter(b => b.status === 'completed').length,
      totalRevenue: bookings
        .filter(b => b.status === 'completed')
        .reduce((sum, booking) => sum + (booking.activity?.price * booking.guests || 0), 0)
    };
    setStats(statsData);
  };

  const getStatusBadge = (status) => {
    const variants = {
      pending: 'secondary',
      confirmed: 'default',
      cancelled: 'destructive'
    };
    
    const icons = {
      pending: <Clock className="w-3 h-3 mr-1" />,
      confirmed: <CheckCircle className="w-3 h-3 mr-1" />,
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
          <h1 className="text-3xl font-bold">Bookings Management</h1>
          <p className="text-muted-foreground">View all bookings on the platform</p>
        </div>
        <Button onClick={fetchBookings} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">All platform bookings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">Awaiting confirmation</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Confirmed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.confirmed}</div>
            <p className="text-xs text-muted-foreground">Active bookings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cancelled</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.cancelled}</div>
            <p className="text-xs text-muted-foreground">Cancelled bookings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRevenue.toLocaleString()} DH</div>
            <p className="text-xs text-muted-foreground">From completed bookings</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search bookings by client, activity, or owner..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bookings Table */}
      <Card>
        <CardHeader>
          <CardTitle>Bookings List</CardTitle>
          <CardDescription>
            {filteredBookings.length} booking{filteredBookings.length !== 1 ? 's' : ''} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredBookings.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No bookings found</h3>
              <p className="text-muted-foreground">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filters' 
                  : 'No bookings have been made yet'
                }
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Activity</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Guests</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">View</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell>
                      <div className="font-medium">{booking.client_name}</div>
                      <div className="text-sm text-muted-foreground">{booking.client_email}</div>
                    </TableCell>
                    <TableCell className="max-w-[150px] truncate">
                      {booking.activity?.title}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{booking.activity?.owner?.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {booking.activity?.owner?.email}
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(booking.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {booking.guests}
                    </TableCell>
                    <TableCell>
                      {(booking.activity?.price * booking.guests || 0).toFixed(2)} DH
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(booking.status)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedBooking(booking)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Booking Detail Dialog */}
      <Dialog open={!!selectedBooking} onOpenChange={() => setSelectedBooking(null)}>
        <DialogContent className="max-w-2xl">
          {selectedBooking && (
            <>
              <DialogHeader>
                <DialogTitle>Booking Details</DialogTitle>
                <DialogDescription>
                  Complete information for booking #{selectedBooking.id}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-6 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Client Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center">
                        <span className="font-medium mr-2">Name:</span>
                        <span>{selectedBooking.client_name}</span>
                      </div>
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 mr-2 text-muted-foreground" />
                        <span>{selectedBooking.client_email}</span>
                      </div>
                      {selectedBooking.client_phone && (
                        <div className="flex items-center">
                          <Phone className="w-4 h-4 mr-2 text-muted-foreground" />
                          <span>{selectedBooking.client_phone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Booking Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
                        <span>Date: {new Date(selectedBooking.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center">
                        <UsersIcon className="w-4 h-4 mr-2 text-muted-foreground" />
                        <span>Guests: {selectedBooking.guests}</span>
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="w-4 h-4 mr-2 text-muted-foreground" />
                        <span>Total: {(selectedBooking.activity?.price * selectedBooking.guests || 0).toFixed(2)} DH</span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-medium mr-2">Status:</span>
                        {getStatusBadge(selectedBooking.status)}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Activity Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <span className="font-medium mr-2">Title:</span>
                      <span>{selectedBooking.activity?.title}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium mr-2">Price:</span>
                      <span>{selectedBooking.activity?.price} DH per guest</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium mr-2">Location:</span>
                      <span>{selectedBooking.activity?.location}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium mr-2">Duration:</span>
                      <span>{selectedBooking.activity?.duration}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Owner Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-2 text-muted-foreground" />
                      <span>Name: {selectedBooking.activity?.owner?.name}</span>
                    </div>
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-2 text-muted-foreground" />
                      <span>Email: {selectedBooking.activity?.owner?.email}</span>
                    </div>
                    {selectedBooking.activity?.owner?.phone && (
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 mr-2 text-muted-foreground" />
                        <span>Phone: {selectedBooking.activity?.owner?.phone}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setSelectedBooking(null)}>
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}