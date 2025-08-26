'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import useSWR from 'swr';
import { swrFetcher } from '@/lib/swrFetcher';
import api from '@/lib/axios';
import { toast } from 'react-toastify';
import ClientOnly from '@/components/ClientOnly';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';

export default function ActivityDetail() {
  const params = useParams();
  const activityId = params.id;
  
  const { data: activity, error, isLoading } = useSWR(
    `/public/activities/${activityId}`, 
    swrFetcher
  );

  // Fetch other activities by the same owner
  const { data: ownerActivities } = useSWR(
    activity?.owner?.id ? `/public/owners/${activity.owner.id}/activities` : null,
    swrFetcher
  );

  const [bookingData, setBookingData] = useState({
    activity_id: activityId,
    client_name: '',
    client_email: '',
    client_phone: '',
    date: '',
    guests: 1
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    setBookingData({
      ...bookingData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await api.post('/bookings', bookingData);
      toast.success('Booking created successfully!');
      // Reset form
      setBookingData({
        activity_id: activityId,
        client_name: '',
        client_email: '',
        client_phone: '',
        date: '',
        guests: 1
      });
    } catch (error) {
      const message = error.response?.data?.message || 'Booking failed';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-6 py-12">
          <div className="flex justify-center items-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !activity) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-6 py-12">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">Activity not found</h2>
            <p className="text-muted-foreground">The activity you're looking for doesn't exist.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-6 py-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-muted-foreground mb-8">
          <Link href="/" className="hover:text-primary">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/activities" className="hover:text-primary">Activities</Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">{activity.title}</span>
        </nav>

        {/* Image Slider - Shows multiple images on large screens */}
        <ClientOnly>
          <div className="mb-8 rounded-2xl overflow-hidden">
            {activity.image_urls && activity.image_urls.length > 0 ? (
              <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={20}
                slidesPerView={1}
                navigation
                pagination={{ clickable: true }}
                autoplay={{ delay: 4000 }}
                breakpoints={{
                  1024: {
                    slidesPerView: 1.5,
                    spaceBetween: 24,
                  },
                  1280: {
                    slidesPerView: 2,
                    spaceBetween: 28,
                  },
                }}
                className="h-96 w-full"
                centeredSlides={true}
              >
                {activity.image_urls.map((imageUrl, index) => (
                  <SwiperSlide key={index}>
                    <div className="h-full w-full flex items-center justify-center">
                      <img
                        src={imageUrl}
                        alt={`${activity.title} - Image ${index + 1}`}
                        className="w-full h-full object-cover rounded-xl"
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              <div className="h-96 bg-muted rounded-2xl flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <svg
                    className="w-16 h-16 mx-auto mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <p>No images available</p>
                </div>
              </div>
            )}
          </div>
        </ClientOnly>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Activity Details - Left Column (2/3 width) */}
          <div className="lg:col-span-2">
            <div className="bg-card rounded-2xl p-6 border border-border">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-foreground mb-2">
                    {activity.title}
                  </h1>
                  <div className="flex items-center space-x-4 text-muted-foreground">
                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                      {activity.category?.name}
                    </span>
                    <span>•</span>
                    <span>{activity.location}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-foreground">
                    {activity.price} DH
                  </div>
                  <div className="text-sm text-muted-foreground">per person</div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 text-primary mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div>
                    <div className="font-semibold text-foreground">Duration</div>
                    <div className="text-muted-foreground">{activity.duration}</div>
                  </div>
                </div>

                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 text-primary mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <div>
                    <div className="font-semibold text-foreground">Location</div>
                    <div className="text-muted-foreground">{activity.location}</div>
                  </div>
                </div>
              </div>

              {activity.description && (
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-foreground mb-3">Description</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {activity.description}
                  </p>
                </div>
              )}

              {/* Provider Information */}
              {activity.owner && (
                <div className="border-t border-border pt-6">
                  <h3 className="text-xl font-semibold text-foreground mb-4">Activity Provider</h3>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-lg font-semibold text-primary">
                        {activity.owner.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">{activity.owner.name}</div>
                      <div className="text-sm text-muted-foreground">{activity.owner.email}</div>
                      {activity.owner.phone && (
                        <div className="text-sm text-muted-foreground">{activity.owner.phone}</div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Other Activities by the Same Owner */}
            {ownerActivities && ownerActivities.length > 0 && (
              <div className="mt-8">
                <h2 className="text-2xl font-bold text-foreground mb-6">More from this provider</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {ownerActivities
                    .filter(a => a.id !== activity.id)
                    .slice(0, 4) // Show max 4 activities
                    .map(activity => (
                      <Link 
                        key={activity.id} 
                        href={`/activities/${activity.id}`}
                        className="bg-card rounded-2xl border border-border overflow-hidden hover:shadow-lg transition-shadow duration-300"
                      >
                        <div className="h-48 overflow-hidden">
                          <img 
                            src={activity.image_urls?.[0] || '/placeholder-image.jpg'} 
                            alt={activity.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold text-foreground mb-2 line-clamp-1">{activity.title}</h3>
                          <div className="flex justify-between items-center">
                            <span className="text-primary font-bold">{activity.price} DH</span>
                            <span className="text-sm text-muted-foreground">{activity.location}</span>
                          </div>
                        </div>
                      </Link>
                    ))
                  }
                </div>
              </div>
            )}
          </div>

          {/* Booking Form - Right Column (1/3 width) */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-2xl p-6 border border-border sticky top-6">
              <h2 className="text-2xl font-bold text-foreground mb-6">Book This Activity</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="client_name" className="block text-sm font-medium text-foreground mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="client_name"
                    name="client_name"
                    value={bookingData.client_name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label htmlFor="client_email" className="block text-sm font-medium text-foreground mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="client_email"
                    name="client_email"
                    value={bookingData.client_email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label htmlFor="client_phone" className="block text-sm font-medium text-foreground mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="client_phone"
                    name="client_phone"
                    value={bookingData.client_phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Enter your phone number"
                  />
                </div>

                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-foreground mb-2">
                    Date *
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={bookingData.date}
                    onChange={handleInputChange}
                    required
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="guests" className="block text-sm font-medium text-foreground mb-2">
                    Number of Guests *
                  </label>
                  <select
                    id="guests"
                    name="guests"
                    value={bookingData.guests}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                      <option key={num} value={num}>{num} {num === 1 ? 'guest' : 'guests'}</option>
                    ))}
                  </select>
                </div>

                <div className="pt-4 border-t border-border">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-foreground">Total Price:</span>
                    <span className="text-xl font-bold text-foreground">
                      {activity.price * bookingData.guests} DH
                    </span>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-primary-foreground py-3 px-6 rounded-lg font-medium transition-colors duration-200"
                  >
                    {isSubmitting ? 'Booking...' : 'Book Now'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}