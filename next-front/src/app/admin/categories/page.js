'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Tag,
  Plus,
  Edit,
  Trash2,
  Search,
  RefreshCw,
  AlertCircle,
  Package
} from 'lucide-react';
import api from '@/lib/axios';
import { toast } from 'react-toastify';

export default function CategoriesManagement() {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: ''
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    filterCategories();
  }, [categories, searchTerm]);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  const filterCategories = () => {
    let filtered = categories;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredCategories(filtered);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/admin/categories', formData);
      toast.success('Category created successfully');
      setIsCreateDialogOpen(false);
      setFormData({ name: '' });
      setFormErrors({});
      fetchCategories();
    } catch (error) {
      if (error.response?.data?.errors) {
        setFormErrors(error.response.data.errors);
      } else {
        toast.error('Failed to create category');
      }
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put(`/admin/categories/${selectedCategory.id}`, formData);
      toast.success('Category updated successfully');
      setIsEditDialogOpen(false);
      setSelectedCategory(null);
      setFormData({ name: '' });
      setFormErrors({});
      fetchCategories();
    } catch (error) {
      if (error.response?.data?.errors) {
        setFormErrors(error.response.data.errors);
      } else {
        toast.error('Failed to update category');
      }
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/admin/categories/${selectedCategory.id}`);
      toast.success('Category deleted successfully');
      setIsDeleteDialogOpen(false);
      setSelectedCategory(null);
      fetchCategories();
    } catch (error) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Failed to delete category');
      }
    }
  };

  const openEditDialog = (category) => {
    setSelectedCategory(category);
    setFormData({ name: category.name });
    setFormErrors({});
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (category) => {
    setSelectedCategory(category);
    setIsDeleteDialogOpen(true);
  };

  const getActivityCountBadge = (count) => {
    if (count === 0) {
      return <Badge variant="outline">No activities</Badge>;
    } else if (count === 1) {
      return <Badge variant="secondary">1 activity</Badge>;
    } else {
      return <Badge variant="secondary">{count} activities</Badge>;
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
          <h1 className="text-3xl font-bold">Categories Management</h1>
          <p className="text-muted-foreground">Manage activity categories on the platform</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={fetchCategories} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Category</DialogTitle>
                <DialogDescription>
                  Add a new activity category to the platform
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreate}>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Category Name</Label>
                    <Input
                      id="name"
                      placeholder="Enter category name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className={formErrors.name ? 'border-red-500' : ''}
                    />
                    {formErrors.name && (
                      <p className="text-sm text-red-500">{formErrors.name[0]}</p>
                    )}
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Create Category</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Categories</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories.length}</div>
            <p className="text-xs text-muted-foreground">All platform categories</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Activities</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {categories.reduce((sum, category) => sum + category.activities_count, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Across all categories</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Most Popular</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {categories.length > 0 
                ? categories.reduce((max, category) => 
                    category.activities_count > max.activities_count ? category : max
                  ).name
                : 'None'
              }
            </div>
            <p className="text-xs text-muted-foreground">Category with most activities</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search categories by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </CardContent>
      </Card>

      {/* Categories Table */}
      <Card>
        <CardHeader>
          <CardTitle>Categories List</CardTitle>
          <CardDescription>
            {filteredCategories.length} categor{filteredCategories.length !== 1 ? 'ies' : 'y'} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredCategories.length === 0 ? (
            <div className="text-center py-12">
              <Tag className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No categories found</h3>
              <p className="text-muted-foreground">
                {searchTerm 
                  ? 'Try adjusting your search' 
                  : 'No categories have been created yet'
                }
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Activities</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCategories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">{category.name}</TableCell>
                    <TableCell>
                      {getActivityCountBadge(category.activities_count)}
                    </TableCell>
                    <TableCell>
                      {new Date(category.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openEditDialog(category)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => openDeleteDialog(category)}
                          disabled={category.activities_count > 0}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Edit Category Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>
              Update the category information
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEdit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Category Name</Label>
                <Input
                  id="edit-name"
                  placeholder="Enter category name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={formErrors.name ? 'border-red-500' : ''}
                />
                {formErrors.name && (
                  <p className="text-sm text-red-500">{formErrors.name[0]}</p>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Update Category</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Category</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the category "{selectedCategory?.name}"? 
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {selectedCategory?.activities_count > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-yellow-400 mr-3" />
                <div className="text-yellow-700">
                  <p className="font-medium">Cannot delete category</p>
                  <p className="text-sm">
                    This category has {selectedCategory.activities_count} associated 
                    activit{selectedCategory.activities_count !== 1 ? 'ies' : 'y'} and cannot be deleted.
                  </p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete}
              disabled={selectedCategory?.activities_count > 0}
            >
              Delete Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}