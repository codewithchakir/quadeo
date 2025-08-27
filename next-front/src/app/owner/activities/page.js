// Activities Page (activities/page.js)
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  PlusCircle,
  Eye,
  Edit,
  Trash2,
  Package
} from 'lucide-react';
import api from '@/lib/axios';
import { toast } from 'react-toastify';

export default function ActivitiesPage() {
  const router = useRouter();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const response = await api.get('/activities');
      setActivities(response.data);
    } catch (error) {
      console.error('Error fetching activities:', error);
      toast.error('Failed to load activities');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this activity?')) return;
    
    try {
      await api.delete(`/activities/${id}`);
      toast.success('Activity deleted successfully');
      fetchActivities();
    } catch (error) {
      console.error('Error deleting activity:', error);
      toast.error('Failed to delete activity');
    }
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
          <h1 className="text-3xl font-bold">My Activities</h1>
          <p className="text-muted-foreground">Manage your activity listings</p>
        </div>
        <Button onClick={() => router.push('/owner/activities/new')}>
          <PlusCircle className="w-4 h-4 mr-2" />
          New Activity
        </Button>
      </div>

      {activities.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No activities yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              You haven't created any activities yet. Start by creating your first activity to attract customers.
            </p>
            <Button onClick={() => router.push('/owner/activities/new')}>
              Create Your First Activity
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Your Activity Listings</CardTitle>
            <CardDescription>
              All activities you've created
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Bookings</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activities.map((activity) => (
                  <TableRow key={activity.id}>
                    <TableCell className="font-medium">{activity.title}</TableCell>
                    <TableCell>{activity.category?.name}</TableCell>
                    <TableCell>{activity.price} DH</TableCell>
                    <TableCell>{activity.location}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {activity.bookings_count || 0} bookings
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => router.push(`/activities/${activity.id}`)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => router.push(`/owner/activities/${activity.id}/edit`)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(activity.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}