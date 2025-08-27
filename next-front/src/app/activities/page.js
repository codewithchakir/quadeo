// src/app/activities/page.js
'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import useSWR from 'swr';
import { swrFetcher } from '@/lib/swrFetcher';
import ActivityCard from '@/components/ActivityCard';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';

export default function ActivitiesPage() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category_id');
  
  const [filters, setFilters] = useState({
    category_id: categoryParam || '',
    min_price: '',
    max_price: ''
  });

  const [currentPage, setCurrentPage] = useState(1);

  // Build query string from filters
  const buildQueryString = () => {
    const params = new URLSearchParams();
    if (filters.category_id) params.append('category_id', filters.category_id);
    if (filters.location) params.append('location', filters.location);
    if (filters.min_price) params.append('min_price', filters.min_price);
    if (filters.max_price) params.append('max_price', filters.max_price);
    if (currentPage > 1) params.append('page', currentPage);
    
    return params.toString();
  };

  const { data: activitiesData, error, isLoading } = useSWR(
    `/public/activities?${buildQueryString()}`,
    swrFetcher
  );

  const { data: categoriesData } = useSWR('/categories', swrFetcher);
  const categories = categoriesData || [];

  // Update filters when URL params change
  useEffect(() => {
    if (categoryParam) {
      setFilters(prev => ({ ...prev, category_id: categoryParam }));
    }
  }, [categoryParam]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const clearFilters = () => {
    setFilters({
      category_id: '',
      location: '',
      min_price: '',
      max_price: ''
    });
    setCurrentPage(1);
  };

  const activities = activitiesData?.data || [];
  const pagination = activitiesData?.meta;

  if (error) return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-foreground mb-4">Error loading activities</h2>
          <p className="text-muted-foreground">Please try again later.</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Activities</h1>
        
        {/* Filters Section */}
        <div className="bg-card border border-border rounded-xl p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Filter Activities</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Category
              </label>
              <select
                value={filters.category_id}
                onChange={(e) => handleFilterChange('category_id', e.target.value)}
                className="w-full p-3 border border-border rounded-lg bg-background"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Location Filter */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Location
              </label>
              <input
                type="text"
                placeholder="Enter location"
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                className="w-full p-3 border border-border rounded-lg bg-background"
              />
            </div>

            {/* Min Price Filter */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Min Price (DH)
              </label>
              <input
                type="number"
                placeholder="Min"
                value={filters.min_price}
                onChange={(e) => handleFilterChange('min_price', e.target.value)}
                className="w-full p-3 border border-border rounded-lg bg-background"
                min="0"
              />
            </div>

            {/* Max Price Filter */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Max Price (DH)
              </label>
              <input
                type="number"
                placeholder="Max"
                value={filters.max_price}
                onChange={(e) => handleFilterChange('max_price', e.target.value)}
                className="w-full p-3 border border-border rounded-lg bg-background"
                min="0"
              />
            </div>
          </div>

          {/* Clear Filters Button */}
          <div className="flex justify-end">
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        </div>

        {/* Results Count */}
        {!isLoading && (
          <div className="mb-6">
            <p className="text-muted-foreground">
              {pagination?.total || 0} activity{activities.length !== 1 ? 'ies' : ''} found
            </p>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        )}

        {/* Activities Grid */}
        {!isLoading && activities.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {activities.map(activity => (
                <ActivityCard key={activity.id} activity={activity} />
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.last_page > 1 && (
              <div className="flex justify-center items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                
                <span className="text-muted-foreground">
                  Page {currentPage} of {pagination.last_page}
                </span>
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.last_page))}
                  disabled={currentPage === pagination.last_page}
                  className="px-4 py-2 border border-border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          /* No Results State */
          !isLoading && (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-muted-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">No activities found</h3>
              <p className="text-muted-foreground">
                Try adjusting your filters or search criteria
              </p>
              <button
                onClick={clearFilters}
                className="mt-4 px-6 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )
        )}
      </div>

      <Footer />
    </div>
  );
}