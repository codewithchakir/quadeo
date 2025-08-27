// activities/new/page.js
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ImageUpload } from '@/components/ui/image-upload';
import { 
  ArrowLeft,
  PlusCircle,
} from 'lucide-react';
import api from '@/lib/axios';
import { toast } from 'react-toastify';

export default function NewActivityPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState([]);
  const [formData, setFormData] = useState({
    category_id: '',
    title: '',
    description: '',
    price: '',
    duration: '',
    location: ''
  });

  useEffect(() => {
    fetchCategories();
  }, []);

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

  const handleImageChange = (newImages) => {
    setImages(newImages);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.category_id || !formData.title || !formData.description || !formData.price) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      const submitData = new FormData();
      
      // Append form data
      Object.keys(formData).forEach(key => {
        if (formData[key]) {
          submitData.append(key, formData[key]);
        }
      });

      // Append images
      images.forEach(image => {
        submitData.append('images[]', image);
      });

      const response = await api.post('/activities', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      toast.success('Activity created successfully!');
      router.push('/owner/activities');
    } catch (error) {
      console.error('Error creating activity:', error);
      if (error.response?.data?.errors) {
        Object.values(error.response.data.errors).forEach(messages => {
          messages.forEach(message => toast.error(message));
        });
      } else {
        toast.error('Failed to create activity');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Create New Activity</h1>
          <p className="text-muted-foreground">Add a new activity to your listings</p>
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
                    placeholder="e.g., Quad biking Adventure"
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
                  <Label htmlFor="price">Price per person (DH) *</Label>
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
                    placeholder="e.g., Agafay, Marrakech"
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
                  Upload photos that showcase your activity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ImageUpload
                  value={images}
                  onChange={handleImageChange}
                  disabled={loading}
                  maxFiles={5}
                />
              </CardContent>
            </Card>

            {/* Submit Card */}
            <Card>
              <CardHeader>
                <CardTitle>Ready to Publish</CardTitle>
                <CardDescription>
                  Review your information and create the activity
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push('/owner/activities')}
                    className="flex-1"
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading || !formData.category_id || !formData.title || !formData.description || !formData.price}
                    className="flex-1"
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <>
                        <PlusCircle className="w-4 h-4 mr-2" />
                        Create Activity
                      </>
                    )}
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