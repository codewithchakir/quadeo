'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import api from '@/lib/axios';
import { toast } from 'react-toastify';

export default function BookingsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await api.get('/bookings');
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId, status) => {
    try {
      await api.patch(`/bookings/${bookingId}/status`, { status });
      toast.success(`Booking ${status} successfully`);
      fetchBookings();
    } catch (error) {
      console.error('Error updating booking status:', error);
      toast.error('Failed to update booking status');
    }
  };

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
      <Badge variant={variants[status] || 'secondary'} className="flex items-center text-xs">
        {icons[status]}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const filteredBookings = statusFilter === 'all' 
    ? bookings 
    : bookings.filter(booking => booking.status === statusFilter);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-full overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Bookings</h1>
          <p className="text-muted-foreground">Manage all bookings for your activities</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          {/* Mobile filter toggle */}
          <Button 
            variant="outline" 
            className="sm:hidden"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-4 h-4 mr-2" />
            {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
          
          {/* Desktop filter buttons */}
          <div className={`hidden sm:flex gap-2 ${showFilters ? 'flex' : 'hidden'} sm:flex`}>
            <Button 
              variant={statusFilter === 'all' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setStatusFilter('all')}
            >
              All
            </Button>
            <Button 
              variant={statusFilter === 'pending' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setStatusFilter('pending')}
            >
              Pending
            </Button>
            <Button 
              variant={statusFilter === 'confirmed' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setStatusFilter('confirmed')}
            >
              Confirmed
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile filter buttons */}
      {showFilters && (
        <div className="sm:hidden grid grid-cols-2 gap-2">
          <Button 
            variant={statusFilter === 'all' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setStatusFilter('all')}
            className="w-full"
          >
            All
          </Button>
          <Button 
            variant={statusFilter === 'pending' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setStatusFilter('pending')}
            className="w-full"
          >
            Pending
          </Button>
          <Button 
            variant={statusFilter === 'confirmed' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setStatusFilter('confirmed')}
            className="w-full"
          >
            Confirmed
          </Button>
        </div>
      )}

      {filteredBookings.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Calendar className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {statusFilter === 'all' ? 'No bookings yet' : `No ${statusFilter} bookings`}
            </h3>
            <p className="text-muted-foreground text-center">
              {statusFilter === 'all' 
                ? 'You haven\'t received any bookings yet. Promote your activities to attract customers.' 
                : `You don't have any ${statusFilter} bookings at the moment.`}
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader className="px-4 sm:px-6">
            <CardTitle>
              {statusFilter === 'all' ? 'All Bookings' : `${statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)} Bookings`}
            </CardTitle>
            <CardDescription>
              {filteredBookings.length} booking{filteredBookings.length !== 1 ? 's' : ''} found
            </CardDescription>
          </CardHeader>
          <CardContent className="px-0 sm:px-6">
            {/* Mobile card layout */}
            <div className="block lg:hidden space-y-4">
              {filteredBookings.map((booking) => (
                <div key={booking.id} className="bg-gray-50 rounded-lg p-4">
                  <div className="space-y-3">
                    <div>
                      <div className="font-medium">{booking.client_name}</div>
                      <div className="text-sm text-muted-foreground">{booking.client_email}</div>
                      {booking.client_phone && (
                        <div className="text-sm text-muted-foreground">{booking.client_phone}</div>
                      )}
                    </div>
                    <div className="text-sm">
                      <div className="truncate">Activity: {booking.activity?.title}</div>
                      <div>Date: {new Date(booking.date).toLocaleDateString()}</div>
                      <div>Guests: {booking.guests}</div>
                      <div>Amount: {(booking.activity?.price * booking.guests).toFixed(2)} DH</div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>{getStatusBadge(booking.status)}</div>
                      {booking.status === 'pending' && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                          >
                            Confirm
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                          >
                            Reject
                          </Button>
                        </div>
                      )}
                      {booking.status === 'confirmed' && (
                        <Button
                          size="sm"
                          onClick={() => updateBookingStatus(booking.id, 'completed')}
                        >
                          Complete
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop table layout */}
            <div className="hidden lg:block overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client</TableHead>
                    <TableHead>Activity</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Guests</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{booking.client_name}</div>
                          <div className="text-sm text-muted-foreground">{booking.client_email}</div>
                          <div className="text-sm text-muted-foreground">{booking.client_phone}</div>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[150px] truncate">
                        {booking.activity?.title}
                      </TableCell>
                      <TableCell>{new Date(booking.date).toLocaleDateString()}</TableCell>
                      <TableCell>{booking.guests}</TableCell>
                      <TableCell>{(booking.activity?.price * booking.guests).toFixed(2)} DH</TableCell>
                      <TableCell>{getStatusBadge(booking.status)}</TableCell>
                      <TableCell className="text-right">
                        {booking.status === 'pending' && (
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                            >
                              Confirm
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                            >
                              Reject
                            </Button>
                          </div>
                        )}
                        {booking.status === 'confirmed' && (
                          <Button
                            size="sm"
                            onClick={() => updateBookingStatus(booking.id, 'completed')}
                          >
                            Complete
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}