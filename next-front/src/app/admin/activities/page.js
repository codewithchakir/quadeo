'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Package,
  MapPin,
  Clock,
  DollarSign,
  User,
  Search,
  RefreshCw,
  Eye,
  Calendar,
  Users as UsersIcon,
  Filter,
  Tag
} from 'lucide-react';
import api from '@/lib/axios';
import { toast } from 'react-toastify';
import Image from 'next/image';

export default function ActivitiesManagement() {
  const router = useRouter();
  const [activities, setActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchActivities();
    fetchCategories();
  }, []);

  useEffect(() => {
    filterActivities();
  }, [activities, searchTerm, categoryFilter]);

  const fetchActivities = async () => {
    try {
      const response = await api.get('/activities');
      setActivities(response.data);
    } catch (error) {
      console.error('Error fetching activities:', error);
      toast.error('Failed to fetch activities');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchActivityDetails = async (activityId) => {
    try {
      const response = await api.get(`/activities/${activityId}`);
      setSelectedActivity(response.data);
      setDetailDialogOpen(true);
    } catch (error) {
      console.error('Error fetching activity details:', error);
      toast.error('Failed to fetch activity details');
    }
  };

  const filterActivities = () => {
    let filtered = activities;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(activity =>
        activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.owner.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(activity => activity.category_id.toString() === categoryFilter);
    }

    setFilteredActivities(filtered);
  };

  const getCategoryCounts = () => {
    const counts = {};
    activities.forEach(activity => {
      const categoryName = activity.category.name;
      counts[categoryName] = (counts[categoryName] || 0) + 1;
    });
    return counts;
  };

  const categoryCounts = getCategoryCounts();

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
          <h1 className="text-3xl font-bold">Activities Management</h1>
          <p className="text-muted-foreground">Manage all activities on the platform</p>
        </div>
        <Button onClick={fetchActivities} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Activities</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activities.length}</div>
            <p className="text-xs text-muted-foreground">All platform activities</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories.length}</div>
            <p className="text-xs text-muted-foreground">Activity categories</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Owners</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(activities.map(a => a.owner.id)).size}
            </div>
            <p className="text-xs text-muted-foreground">Owners with activities</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Category</CardTitle>
            <Filter className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Object.keys(categoryCounts).length > 0 
                ? Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0][0] 
                : 'None'
              }
            </div>
            <p className="text-xs text-muted-foreground">Most popular category</p>
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
                placeholder="Search activities by title, location, or owner..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name} ({categoryCounts[category.name] || 0})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Activities Table */}
      <Card>
        <CardHeader>
          <CardTitle>Activities List</CardTitle>
          <CardDescription>
            {filteredActivities.length} activit{filteredActivities.length !== 1 ? 'ies' : 'y'} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredActivities.length === 0 ? (
            <div className="text-center py-12">
              <Package className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No activities found</h3>
              <p className="text-muted-foreground">
                {searchTerm || categoryFilter !== 'all' 
                  ? 'Try adjusting your search or filters' 
                  : 'No activities have been created yet'
                }
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Activity</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredActivities.map((activity) => (
                  <TableRow key={activity.id}>
                    <TableCell>
                      <div className="font-medium">{activity.title}</div>
                      <div className="text-sm text-muted-foreground">
                        {activity.duration}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{activity.category.name}</Badge>
                    </TableCell>
                    <TableCell>
                      <div>{activity.owner.name}</div>
                      <div className="text-sm text-muted-foreground">{activity.owner.email}</div>
                    </TableCell>
                    <TableCell className="max-w-[150px] truncate">
                      {activity.location}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">${activity.price}</div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => fetchActivityDetails(activity.id)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Activity Detail Dialog */}
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="max-w-3xl">
          {selectedActivity && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedActivity.title}</DialogTitle>
                <DialogDescription>
                  Activity details and booking information
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-6 py-4">
                {/* Images */}
                {selectedActivity.image_urls && selectedActivity.image_urls.length > 0 && (
                  <div className="grid grid-cols-2 gap-2">
                    {selectedActivity.image_urls.map((url, index) => (
                      <div key={index} className="relative h-40 rounded-md overflow-hidden">
                        <Image
                          src={url}
                          alt={`${selectedActivity.title} image ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Activity Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center">
                        <Tag className="w-4 h-4 mr-2 text-muted-foreground" />
                        <span>Category: {selectedActivity.category.name}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
                        <span>Location: {selectedActivity.location}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
                        <span>Duration: {selectedActivity.duration}</span>
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="w-4 h-4 mr-2 text-muted-foreground" />
                        <span>Price: ${selectedActivity.price}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Owner Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-2 text-muted-foreground" />
                        <span>Name: {selectedActivity.owner.name}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-4 h-4 mr-2">📧</span>
                        <span>Email: {selectedActivity.owner.email}</span>
                      </div>
                      {selectedActivity.owner.phone && (
                        <div className="flex items-center">
                          <span className="w-4 h-4 mr-2">📞</span>
                          <span>Phone: {selectedActivity.owner.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Description</h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedActivity.description}
                  </p>
                </div>
                
                {/* Bookings */}
                {selectedActivity.bookings && selectedActivity.bookings.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Recent Bookings</h4>
                    <div className="border rounded-md">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Client</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Guests</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selectedActivity.bookings.slice(0, 3).map((booking) => (
                            <TableRow key={booking.id}>
                              <TableCell>
                                <div>{booking.client_name}</div>
                                <div className="text-xs text-muted-foreground">
                                  {booking.client_email}
                                </div>
                              </TableCell>
                              <TableCell>
                                {new Date(booking.date).toLocaleDateString()}
                              </TableCell>
                              <TableCell>
                                {booking.guests}
                              </TableCell>
                              <TableCell>
                                <Badge variant={
                                  booking.status === 'confirmed' ? 'default' : 
                                  booking.status === 'pending' ? 'secondary' : 'destructive'
                                }>
                                  {booking.status}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                )}
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setDetailDialogOpen(false)}>
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