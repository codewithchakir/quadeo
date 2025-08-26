import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <Link href="/" className="text-2xl font-bold text-primary-600">
            ActivityBooker
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="max-w-lg w-full text-center">
          {/* Illustration/Icon */}
          <div className="mx-auto w-48 h-48 mb-8 relative">
            <div className="absolute inset-0 bg-blue-100 rounded-full flex items-center justify-center">
              <svg
                className="w-24 h-24 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold">
              404
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Page Not Found
          </h1>

          {/* Message */}
          <p className="text-gray-600 mb-8 text-lg">
            Oops! The page you're looking for seems to have wandered off on an adventure.
          </p>

          {/* Search suggestion */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 text-left">
            <h2 className="font-semibold text-blue-800 mb-2">Looking for something specific?</h2>
            <p className="text-sm text-blue-700">
              Try using the search function or browse our popular activities below.
            </p>
          </div>

          {/* Quick Links */}
          <div className="bg-gray-100 rounded-lg p-6 mb-8">
            <h3 className="font-semibold text-gray-800 mb-4">Popular Destinations</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link href="/activities?category=adventure" className="text-sm text-gray-600 hover:text-primary-600 transition-colors">
                Adventure Activities
              </Link>
              <Link href="/activities?category=water-sports" className="text-sm text-gray-600 hover:text-primary-600 transition-colors">
                Water Sports
              </Link>
              <Link href="/activities?category=desert" className="text-sm text-gray-600 hover:text-primary-600 transition-colors">
                Desert Experiences
              </Link>
              <Link href="/owners" className="text-sm text-gray-600 hover:text-primary-600 transition-colors">
                Activity Providers
              </Link>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Link href="/" className="block">
              <Button className="w-full">Go to Homepage</Button>
            </Link>
            
            <Link href="/activities" className="block">
              <Button variant="outline" className="w-full">
                Browse All Activities
              </Button>
            </Link>

            <div className="pt-4 border-t border-gray-200 mt-4">
              <p className="text-sm text-gray-500 mb-2">Still can't find what you're looking for?</p>
              <Link href="/contact">
                <Button variant="link" className="text-primary-600">
                  Contact Support
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="container mx-auto px-6 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} ActivityBooker. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}