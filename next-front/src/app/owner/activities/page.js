"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  PlusCircle,
  Eye,
  Edit,
  Trash2,
  Package,
  MapPin,
  Tag,
  DollarSign,
  Users,
} from "lucide-react";
import api from "@/lib/axios";
import { toast } from "react-toastify";

export default function ActivitiesPage() {
  const router = useRouter();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const response = await api.get("/activities");
      setActivities(response.data);
    } catch (error) {
      console.error("Error fetching activities:", error);
      toast.error("Failed to load activities");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this activity?")) return;

    try {
      await api.delete(`/activities/${id}`);
      toast.success("Activity deleted successfully");
      fetchActivities();
    } catch (error) {
      console.error("Error deleting activity:", error);
      toast.error("Failed to delete activity");
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
    <div className="space-y-6 max-w-full overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">My Activities</h1>
          <p className="text-muted-foreground">Manage your activity listings</p>
        </div>
        <Button
          onClick={() => router.push("/owner/activities/new")}
          className="w-full sm:w-auto"
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          New Activity
        </Button>
      </div>

      {activities.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 px-4">
            <Package className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2 text-center">
              No activities yet
            </h3>
            <p className="text-muted-foreground text-center mb-4">
              You haven't created any activities yet. Start by creating your
              first activity to attract customers.
            </p>
            <Button
              onClick={() => router.push("/owner/activities/new")}
              className="w-full sm:w-auto"
            >
              Create Your First Activity
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader className="px-4 sm:px-6">
            <CardTitle>Your Activity Listings</CardTitle>
            <CardDescription>All activities you've created</CardDescription>
          </CardHeader>
          <CardContent className="px-0 sm:px-6">
            {/* Mobile card layout */}
            <div className="block lg:hidden space-y-4">
              {activities.map((activity) => (
                <div key={activity.id} className="bg-gray-50 rounded-lg p-4">
                  <div className="space-y-3">
                    <div>
                      <div className="font-medium">{activity.title}</div>
                      <div className="text-sm text-muted-foreground">
                        {activity.category?.name}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center">
                        <DollarSign className="w-3 h-3 mr-1 text-muted-foreground" />
                        <span>{activity.price} DH</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-3 h-3 mr-1 text-muted-foreground" />
                        <span className="truncate">{activity.location}</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="w-3 h-3 mr-1 text-muted-foreground" />
                        <span>{activity.bookings_count || 0} bookings</span>
                      </div>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          router.push(`/activities/${activity.id}`)
                        }
                        className="flex-1"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          router.push(`/owner/activities/${activity.id}/edit`)
                        }
                        className="flex-1"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(activity.id)}
                        className="flex-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
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
                      <TableCell className="font-medium">
                        {activity.title}
                      </TableCell>
                      <TableCell>{activity.category?.name}</TableCell>
                      <TableCell>{activity.price} DH</TableCell>
                      <TableCell className="max-w-[150px] truncate">
                        {activity.location}
                      </TableCell>
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
                            onClick={() =>
                              router.push(`/activities/${activity.id}`)
                            }
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              router.push(
                                `/owner/activities/${activity.id}/edit`
                              )
                            }
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
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
