'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Users, 
  UserCheck, 
  UserX, 
  Eye,
  AlertCircle,
  CheckCircle,
  Clock,
  Search,
  RefreshCw
} from 'lucide-react';
import api from '@/lib/axios';
import { toast } from 'react-toastify';

export default function OwnersManagement() {
  const router = useRouter();
  const [owners, setOwners] = useState([]);
  const [filteredOwners, setFilteredOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOwner, setSelectedOwner] = useState(null);
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);

  useEffect(() => {
    fetchOwners();
  }, []);

  useEffect(() => {
    filterOwners();
  }, [owners, searchTerm, statusFilter]);

  const fetchOwners = async () => {
    try {
      const response = await api.get('/admin/all-owners');
      setOwners(response.data);
    } catch (error) {
      console.error('Error fetching owners:', error);
      toast.error('Failed to fetch owners');
    } finally {
      setLoading(false);
    }
  };

  const filterOwners = () => {
    let filtered = owners;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(owner =>
        owner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        owner.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(owner => owner.status === statusFilter);
    }

    setFilteredOwners(filtered);
  };

  const handleApprove = async (ownerId) => {
    try {
      await api.post(`/admin/approve-owner/${ownerId}`);
      toast.success('Owner approved successfully');
      setApproveDialogOpen(false);
      fetchOwners(); // Refresh the list
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
      fetchOwners(); // Refresh the list
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

  const getStatusCounts = () => {
    return {
      all: owners.length,
      pending: owners.filter(o => o.status === 'pending').length,
      approved: owners.filter(o => o.status === 'approved').length,
      rejected: owners.filter(o => o.status === 'rejected').length
    };
  };

  const statusCounts = getStatusCounts();

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
          <h1 className="text-3xl font-bold">Owners Management</h1>
          <p className="text-muted-foreground">Manage activity provider accounts</p>
        </div>
        <Button onClick={fetchOwners} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Owners</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts.all}</div>
            <p className="text-xs text-muted-foreground">All registered owners</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts.pending}</div>
            <p className="text-xs text-muted-foreground">Awaiting review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts.approved}</div>
            <p className="text-xs text-muted-foreground">Active owners</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts.rejected}</div>
            <p className="text-xs text-muted-foreground">Rejected accounts</p>
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
                placeholder="Search owners by name or email..."
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
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Owners Table */}
      <Card>
        <CardHeader>
          <CardTitle>Owners List</CardTitle>
          <CardDescription>
            {filteredOwners.length} owner{filteredOwners.length !== 1 ? 's' : ''} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredOwners.length === 0 ? (
            <div className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No owners found</h3>
              <p className="text-muted-foreground">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filters' 
                  : 'No owners have registered yet'
                }
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Owner</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Registered</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOwners.map((owner) => (
                  <TableRow key={owner.id}>
                    <TableCell>
                      <div className="font-medium">{owner.name}</div>
                      <div className="text-sm text-muted-foreground">ID: {owner.id}</div>
                    </TableCell>
                    <TableCell>
                      <div>{owner.email}</div>
                      {owner.phone && (
                        <div className="text-sm text-muted-foreground">{owner.phone}</div>
                      )}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(owner.status)}
                    </TableCell>
                    <TableCell>
                      {new Date(owner.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {owner.status === 'pending' && (
                          <>
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
                          </>
                        )}
                        {owner.status !== 'pending' && (
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

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