'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import ActivityCard from '@/components/ActivityCard';
import ClientOnly from '@/components/ClientOnly';
import Footer from '@/components/Layout/Footer';
import Header from '@/components/Layout/Header';
import { swrFetcher } from '@/lib/swrFetcher';
import useSWR from 'swr';

export default function Home() {
  const { data: homeData, error, isLoading } = useSWR('/home-data', swrFetcher);
  
  const featuredActivities = homeData?.featured_activities || [];
  const categories = homeData?.categories || [];
  const stats = homeData?.stats || {
    total_activities: 0,
    total_owners: 0,
    total_categories: 0
  };

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if window is available (client-side)
    if (typeof window !== 'undefined') {
      const checkIsMobile = () => {
        setIsMobile(window.innerWidth < 768); 
      };
      
      // Initial check
      checkIsMobile();
      
      // Add event listener for window resize
      window.addEventListener('resize', checkIsMobile);
      
      // Cleanup
      return () => window.removeEventListener('resize', checkIsMobile);
    }
  }, []);

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

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-6 py-12">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">Error loading data</h2>
            <p className="text-muted-foreground">Please try again later.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header />

      <main>
        {/* Hero Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Left Column - Text */}
              <div className="text-center md:text-left">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
                  Book Your Next Adventure, Seamlessly.
                </h1>
                <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
                  Find the best tours and activities with just a click. From quad biking to camel rides, discover unforgettable experiences.
                </p>
                <Link 
                  href="/activities"
                  className="inline-block bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-2xl text-lg font-medium transition-colors duration-200"
                >
                  Explore Activities
                </Link>
              </div>

              {/* Right Column - Slider (Hidden on mobile) */}
              {!isMobile && (
                <div className="relative hidden md:block">
                  <ClientOnly>
                    <Swiper
                      modules={[Autoplay, Navigation, Pagination]}
                      spaceBetween={20}
                      slidesPerView={1}
                      autoplay={{ delay: 4000 }}
                      navigation
                      pagination={{ clickable: true }}
                      className="hero-slider rounded-2xl overflow-hidden"
                    >
                      {featuredActivities.map((activity) => (
                        <SwiperSlide key={activity.id}>
                          <div className="relative h-96 md:h-112 rounded-2xl overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                            {activity.image_urls && activity.image_urls.length > 0 ? (
                              <img
                                src={activity.image_urls[0]}
                                alt={activity.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
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
                                  <p className="text-sm">No image available</p>
                                </div>
                              </div>
                            )}
                            <div className="absolute bottom-6 left-6 right-6 text-white">
                              <h3 className="text-xl font-semibold mb-2">{activity.title}</h3>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                  <span className="text-lg font-bold">{activity.price} DH</span>
                                  <span className="text-sm">• {activity.duration}</span>
                                </div>
                                <span className="text-sm">{activity.location}</span>
                              </div>
                            </div>
                          </div>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </ClientOnly>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section id="categories" className="py-16 bg-muted">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Browse by Category</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Discover activities based on your interests and preferences
              </p>
            </div>

            <ClientOnly>
              <Swiper
                modules={[Navigation]}
                spaceBetween={20}
                slidesPerView={2.2}
                navigation
                breakpoints={{
                  640: { slidesPerView: 3.2 },
                  768: { slidesPerView: 4.2 },
                  1024: { slidesPerView: 5.2 },
                  1280: { slidesPerView: 6.2 }
                }}
                className="categories-slider"
              >
                {categories.map((category) => (
                  <SwiperSlide key={category.id}>
                    <Link 
                      href={`/activities?category_id=${category.id}`}
                      className="block group"
                    >
                      <div className="bg-card border border-border rounded-xl p-6 text-center hover:border-primary transition-colors duration-200">
                        
                        <h3 className="font-semibold text-foreground mb-2">{category.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {category.activities_count} activity{category.activities_count !== 1 ? 'ies' : ''}
                        </p>
                      </div>
                    </Link>
                  </SwiperSlide>
                ))}
              </Swiper>
            </ClientOnly>
          </div>
        </section>

        {/* Featured Activities Section */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Popular Right Now</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Discover the most booked activities this season
              </p>
            </div>

            {featuredActivities.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {featuredActivities.map((activity) => (
                    <ActivityCard key={activity.id} activity={activity} />
                  ))}
                </div>

                <div className="text-center mt-12">
                  <Link 
                    href="/activities"
                    className="inline-block bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-2xl font-medium transition-colors duration-200"
                  >
                    View All Activities
                  </Link>
                </div>
              </>
            ) : (
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
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">No activities yet</h3>
                <p className="text-muted-foreground">Check back later for exciting activities!</p>
              </div>
            )}
          </div>
        </section>

        {/* About Us Section */}
        <section className="py-16 bg-muted">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Left Column - Image Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl overflow-hidden h-64 bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                  <img src="quad.jpg" alt="About Us" className="w-full h-full object-cover" />
                </div>
                <div className="rounded-2xl overflow-hidden h-48 bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center mt-8">
                  <img src="agafay-camel.jpg" alt="About Us" className="w-full h-full object-cover" />
                </div>
                <div className="rounded-2xl overflow-hidden h-48 bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
                  <img src="parap-marrakech.jpg" alt="About Us" className="w-full h-full object-cover" />
                </div>
                <div className="rounded-2xl overflow-hidden h-64 bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center mt-8">
                <img src="agafay-quad.jpg" alt="About Us" className="w-full h-full object-cover" />
                </div>
              </div>
              {/* Right Column - Text and Stats */}
              <div className="text-center md:text-left">
                <h2 className="text-3xl font-bold text-foreground mb-6">About AdventureHub</h2>
                <p className="text-muted-foreground mb-8">
                  We're passionate about connecting adventure seekers with unforgettable experiences. Our platform brings together the best activity providers across Morocco, offering everything from desert excursions to coastal adventures.
                </p>
                <p className="text-muted-foreground mb-10">
                  With a commitment to quality, safety, and authentic experiences, we've built a trusted community of adventurers and providers who share our love for exploration.
                </p>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">{stats.total_activities}</div>
                    <div className="text-sm text-muted-foreground">Activities</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">{stats.total_owners}</div>
                    <div className="text-sm text-muted-foreground">Partners</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">{stats.total_categories}</div>
                    <div className="text-sm text-muted-foreground">Categories</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Owner CTA Section - Updated with Image */}
        <section className="py-16 bg-primary/10">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Left Column - Content */}
              <div className="text-center md:text-left">
                <h2 className="text-3xl font-bold text-foreground mb-4">Are You an Activity Provider?</h2>
                <p className="text-muted-foreground mb-6">
                  Register now and start listing your activities to reach more customers. Grow your business with our platform and join our community of trusted adventure providers.
                </p>
                <p className="text-muted-foreground mb-8">
                  We handle the bookings, payments, and marketing so you can focus on delivering amazing experiences to your customers.
                </p>
                <Link 
                  href="/auth/register?type=owner"
                  className="inline-block bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-2xl font-medium transition-colors duration-200"
                >
                  Become a Partner
                </Link>
              </div>

              {/* Right Column - Image */}
              <div className="hidden md:block">
                <div className="rounded-2xl overflow-hidden h-80 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                  <img src="login-bg.jpeg" alt="Owner CTA" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}