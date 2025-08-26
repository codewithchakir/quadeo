'use client';

import useSWR from 'swr';
import { swrFetcher } from '@/lib/swrFetcher';

import ActivityCard from '@/components/ActivityCard';

export default function ActivitiesPage() {
  const { data: activities, error, isLoading } = useSWR('/public/activities', swrFetcher);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading activities</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Activities</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activities?.data?.map(activity => (
          <div key={activity.id}>
            <ActivityCard activity={activity} />
          </div>
        ))}
      </div>
    </div>
  );
}