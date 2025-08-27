// activities/[id]/edit/page.js
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ImageUpload } from '@/components/ui/image-upload';
import { 
  ArrowLeft,
  Save,
  Loader2,
  X
} from 'lucide-react';
import api from '@/lib/axios';
import { toast } from 'react-toastify';

export default function EditActivityPage() {
  const router = useRouter();
  const params = useParams();
  const activityId = params.id;
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [categories, setCategories] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [formData, setFormData] = useState({
    category_id: '',
    title: '',
    description: '',
    price: '',
    duration: '',
    location: ''
  });

  useEffect(() => {
    fetchActivityData();
    fetchCategories();
  }, [activityId]);

  const fetchActivityData = async () => {
    try {
      const response = await api.get(`/activities/${activityId}`);
      const activity = response.data;
      
      setFormData({
        category_id: activity.category_id?.toString() || '',
        title: activity.title || '',
        description: activity.description || '',
        price: activity.price || '',
        duration: activity.duration || '',
        location: activity.location || ''
      });

      // Use image_urls instead of parsing the image string
      if (activity.image_urls && Array.isArray(activity.image_urls)) {
        setExistingImages(activity.image_urls);
      }
    } catch (error) {
      console.error('Error fetching activity:', error);
      toast.error('Failed to load activity data');
      router.push('/owner/activities');
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
      toast.error('Failed to load categories');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNewImageChange = (images) => {
    setNewImages(images);
  };

  const removeExistingImage = (imageUrl) => {
    setExistingImages(prev => prev.filter(img => img !== imageUrl));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.category_id || !formData.title || !formData.description || !formData.price) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSubmitting(true);

    try {
      const submitData = new FormData();
      
      // Use PUT method for update
      submitData.append('_method', 'PUT');
      
      // Append form data
      Object.keys(formData).forEach(key => {
        if (formData[key]) {
          submitData.append(key, formData[key]);
        }
      });

      // Append new images
      newImages.forEach(image => {
        submitData.append('images[]', image);
      });

      // Append existing images that haven't been removed (just the path part)
      existingImages.forEach(imageUrl => {
        const imagePath = imageUrl.replace(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/storage/`, '');
        submitData.append('existing_images[]', imagePath);
      });

      const response = await api.post(`/activities/${activityId}`, submitData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      toast.success('Activity updated successfully!');
      router.push('/owner/activities');
    } catch (error) {
      console.error('Error updating activity:', error);
      if (error.response?.data?.errors) {
        Object.values(error.response.data.errors).forEach(messages => {
          messages.forEach(message => toast.error(message));
        });
      } else {
        toast.error('Failed to update activity');
      }
    } finally {
      setSubmitting(false);
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
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.push('/owner/activities')}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Edit Activity</h1>
          <p className="text-muted-foreground">Update your activity details</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 md:grid-cols-2">
          {/* Left Column - Basic Information */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>
                  Essential details about your activity
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Activity Title *</Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="e.g., Sunset Yoga Session"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category_id">Category *</Label>
                  <Select
                    value={formData.category_id}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, category_id: value }))}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Describe your activity in detail..."
                    rows={5}
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pricing & Details</CardTitle>
                <CardDescription>
                  Set your pricing and activity specifics
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price per person ($) *</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">Duration</Label>
                  <Input
                    id="duration"
                    name="duration"
                    placeholder="e.g., 2 hours"
                    value={formData.duration}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    name="location"
                    placeholder="e.g., Central Park, New York"
                    value={formData.location}
                    onChange={handleInputChange}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Images */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Activity Images</CardTitle>
                <CardDescription>
                  Manage your activity photos (Max 5 images total)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Existing Images */}
                {existingImages.length > 0 && (
                  <div className="space-y-4">
                    <Label>Current Images</Label>
                    <div className="grid grid-cols-2 gap-4">
                      {existingImages.map((imageUrl, index) => (
                        <div key={index} className="relative group">
                          <div className="aspect-square overflow-hidden rounded-lg border">
                            <img
                              src={imageUrl}
                              alt={`Existing image ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <Button
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6"
                            onClick={() => removeExistingImage(imageUrl)}
                            type="button"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* New Image Upload */}
                <div className="space-y-2">
                  <Label>Add New Images</Label>
                  <ImageUpload
                    value={newImages}
                    onChange={handleNewImageChange}
                    disabled={submitting}
                    maxFiles={5 - existingImages.length}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Submit Card */}
            <Card>
              <CardHeader>
                <CardTitle>Save Changes</CardTitle>
                <CardDescription>
                  Review your updates and save the changes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push('/owner/activities')}
                    className="flex-1"
                    disabled={submitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={submitting || !formData.category_id || !formData.title || !formData.description || !formData.price}
                    className="flex-1"
                  >
                    {submitting ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4 mr-2" />
                    )}
                    Update Activity
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}