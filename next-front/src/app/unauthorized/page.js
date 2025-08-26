import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'Unauthorized Access - Activity Booking Platform',
  description: 'You do not have permission to access this page.',
};

export default function UnauthorizedPage() {
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
        <div className="max-w-md w-full text-center">
          {/* Icon */}
          <div className="mx-auto w-24 h-24 mb-6">
            <svg
              className="w-full h-full text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Unauthorized Access
          </h1>

          {/* Message */}
          <p className="text-gray-600 mb-8">
            You don't have permission to access this page. This area is restricted to users with specific roles.
          </p>

          {/* Role Explanation */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 text-left">
            <h2 className="font-semibold text-blue-800 mb-2">Available Roles:</h2>
            <ul className="text-sm text-blue-700 space-y-1">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                <span className="font-medium">Admin:</span> Full system access
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                <span className="font-medium">Owner:</span> Manage activities and bookings
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                <span className="font-medium">Client:</span> Browse and book activities
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Link href="/" className="block">
              <Button className="w-full">Go to Homepage</Button>
            </Link>
            
            <Link href="/activities" className="block">
              <Button variant="outline" className="w-full">
                Browse Activities
              </Button>
            </Link>

            <div className="pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-500 mb-2">Need access to this area?</p>
              <Link href="/auth/register">
                <Button variant="link" className="text-primary-600">
                  Register as an activity provider
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
          <p className="mt-1">
            If you believe this is an error, please{' '}
            <a href="mailto:support@activitybooker.com" className="text-primary-600 hover:underline">
              contact support
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}