import Link from 'next/link';

const ActivityCard = ({ activity }) => {
  // Extract the first image from the activity
  const getFirstImage = () => {
    if (!activity) return null;
    
    if (activity.image_urls && activity.image_urls.length > 0) {
      return activity.image_urls[0];
    }
    
    if (activity.image && typeof activity.image === 'string') {
      try {
        const parsedImages = JSON.parse(activity.image);
        if (Array.isArray(parsedImages) && parsedImages.length > 0) {
          return `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/storage/${parsedImages[0]}`;
        }
      } catch (error) {
        return `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/storage/${activity.image}`;
      }
    }
    
    return null;
  };

  const firstImage = getFirstImage();
  const price = parseFloat(activity.price || 0).toFixed(2);

  return (
    <Link href={`/activities/${activity.id}`} className="block group">
      <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 hover:border-gray-200 h-full flex flex-col">
        {/* Image Section */}
        <div className="relative h-64 w-full overflow-hidden">
          {firstImage ? (
            <img
              src={firstImage}
              alt={activity.title}
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
              <svg
                className="w-16 h-16 text-gray-300"
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
          )}
          
          {/* Category Badge */}
          {activity.category && (
            <div className="absolute top-3 left-3">
              <span className="bg-white/90 text-gray-700 text-xs font-medium px-3 py-1.5 rounded-full border border-gray-200 backdrop-blur-sm">
                {activity.category.name}
              </span>
            </div>
          )}

          {/* Duration Badge - Moved to top right */}
          {activity.duration && (
            <div className="absolute top-3 right-3">
              <span className="bg-white/90 text-gray-700 text-xs font-medium px-3 py-1.5 rounded-full border border-gray-200 backdrop-blur-sm flex items-center">
                <svg
                  className="w-3 h-3 mr-1.5 text-gray-500"
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
                {activity.duration}
              </span>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-5 flex-grow flex flex-col">
          {/* Title */}
          <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-primary-600 transition-colors duration-200">
            {activity.title}
          </h3>

          {/* Location - Full width */}
          <div className="flex items-start text-gray-600 mb-4">
            <svg
              className="w-4 h-4 mr-2 text-gray-400 mt-0.5 flex-shrink-0"
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
            <span className="text-sm line-clamp-2 flex-1">{activity.location}</span>
          </div>

          {/* Price and Action Area */}
          <div className="mt-auto pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
              {/* Price */}
              <div className="flex items-center">
                <svg
                  className="w-4 h-4 mr-2 text-primary-600 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <span className="text-lg font-bold text-gray-900">{price} DH</span>
                  <span className="text-xs text-gray-500 ml-1 block">per person</span>
                </div>
              </div>
              
              {/* View Details Hint */}
              <div className="flex items-center text-primary-600">
                <span className="text-sm font-medium mr-1 group-hover:underline">Details</span>
                <svg
                  className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ActivityCard;