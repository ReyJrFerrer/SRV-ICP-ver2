import React from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { Principal } from '@dfinity/principal';
import { Booking, BookingStatus } from '../../../services/bookingCanisterService';
import { EnhancedBooking } from '../../../hooks/bookingManagement';
import { 
  CalendarIcon, 
  ClockIcon, 
  MapPinIcon, 
  CurrencyDollarIcon,
  ChatBubbleLeftRightIcon,
  XMarkIcon,
  ArrowPathIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';

interface BookingItemCardProps {
  booking?: EnhancedBooking;
  onUpdateBookingStatus?: (bookingId: string, newStatus: BookingStatus) => void;
}

// Placeholder for development/testing
const createPlaceholderBooking = (): EnhancedBooking => ({
  id: 'placeholder-booking',
  clientId: Principal.fromText('rdmx6-jaaaa-aaaah-qcaiq-cai'),
  providerId: Principal.fromText('rrkah-fqaaa-aaaah-qcaiq-cai'),
  serviceId: 'placeholder-service',
  status: 'Accepted',
  requestedDate: new Date().toISOString(),
  scheduledDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  price: 150,
  location: {
    latitude: 16.4095,
    longitude: 120.5975,
    address: '123 Session Road',
    city: 'Baguio City',
    state: 'Benguet',
    country: 'Philippines',
    postalCode: '2600'
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  serviceName: 'Professional House Cleaning',
  serviceImage: '/images/CleaningServices-CoverImage.jpeg',
  providerName: 'Clean & Fresh Services',
  bookingDate: 'Tomorrow',
  bookingTime: '2:00 PM',
  duration: '3 hours',
  priceDisplay: '$150',
  serviceSlug: 'house-cleaning',
  formattedLocation: '123 Session Road, Baguio City, Benguet',
  isProviderDataLoaded: true
});

const BookingItemCard: React.FC<BookingItemCardProps> = ({ booking, onUpdateBookingStatus }) => {
  const router = useRouter();
  
  // Use provided booking or placeholder
  const displayBooking = booking || createPlaceholderBooking();

  const handleViewBooking = () => {
    router.push(`/client/booking/${displayBooking.id}`);
  };

  const handleBookAgain = () => {
    router.push(`/client/book/${displayBooking.serviceSlug}`);
  };

  const handleCancelBooking = () => {
    if (window.confirm(`Are you sure you want to cancel this booking for "${displayBooking.serviceName}"?`)) {
      onUpdateBookingStatus?.(displayBooking.id, 'Cancelled');
    }
  };

  const handleContactProvider = () => {
    const providerName = displayBooking.providerProfile?.name || displayBooking.providerName || 'the provider';
    alert(`Contact ${providerName} through the app's messaging system.`);
  };

  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case 'Requested':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Accepted':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'InProgress':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Declined':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'Disputed':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'TBD';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (dateString?: string) => {
    if (!dateString) return 'TBD';
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  // Get provider image source
  const getProviderImageSource = () => {
    if (displayBooking.providerProfile?.profilePicture?.imageUrl) {
      return displayBooking.providerProfile.profilePicture.imageUrl;
    }
    return null;
  };

  const providerImageSrc = getProviderImageSource();
  const providerName = displayBooking.providerProfile?.name || displayBooking.providerName || 'Unknown Provider';
  const locationDisplay = displayBooking.formattedLocation || 'Location not specified';

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="p-4 flex items-start space-x-3">
        {/* Provider Profile Picture */}
        <div className="flex-shrink-0">
          {providerImageSrc ? (
            <Image
              src={providerImageSrc}
              alt={`${providerName} profile`}
              width={64}
              height={64}
              className="rounded-full object-cover border-2 border-gray-200"
              onError={(e) => {
                console.log('Error loading provider image, using fallback');
                e.currentTarget.style.display = 'none';
              }}
            />
          ) : (
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center border-2 border-gray-300">
              <UserCircleIcon className="w-8 h-8 text-gray-400" />
            </div>
          )}
          
          {/* Loading indicator for provider data */}
          {!displayBooking.isProviderDataLoaded && (
            <div className="absolute top-0 right-0 w-4 h-4 bg-blue-500 rounded-full animate-pulse" />
          )}
        </div>
        
        {/* Booking Info */}
        <div className="flex-grow min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 truncate">
            {displayBooking.serviceName}
          </h3>
          <p className="text-sm text-gray-600 mb-2">
            by {providerName}
            {displayBooking.providerProfile?.isVerified && (
              <span className="ml-1 text-blue-500">✓</span>
            )}
          </p>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(displayBooking.status)}`}>
            {displayBooking.status}
          </span>
        </div>
      </div>

      {/* Details */}
      <div className="px-4 pb-4 space-y-3">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center text-gray-600">
            <CalendarIcon className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="truncate">{formatDate(displayBooking.scheduledDate || displayBooking.requestedDate)}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <ClockIcon className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="truncate">{formatTime(displayBooking.scheduledDate || displayBooking.requestedDate)}</span>
          </div>
          <div className="flex items-center text-gray-600 col-span-2">
            <MapPinIcon className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="truncate" title={locationDisplay}>
              {locationDisplay}
            </span>
          </div>
          <div className="flex items-center text-gray-600">
            <CurrencyDollarIcon className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="truncate">${displayBooking.price}</span>
          </div>
        </div>

        {displayBooking.duration && (
          <div className="flex items-center text-sm text-gray-600">
            <ClockIcon className="h-4 w-4 mr-2 flex-shrink-0" />
            <span>Duration: {displayBooking.duration}</span>
          </div>
        )}

        {/* Provider Info Section */}
        {displayBooking.providerProfile && (
          <div className="pt-2 border-t border-gray-100">
            <div className="flex items-center text-sm text-gray-600">
              <span className="font-medium">Provider:</span>
              <span className="ml-2">{displayBooking.providerProfile.name}</span>
              {displayBooking.providerProfile.phone && (
                <span className="ml-2 text-gray-400">• {displayBooking.providerProfile.phone}</span>
              )}
            </div>
            {displayBooking.providerProfile.biography && (
              <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                {displayBooking.providerProfile.biography}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleViewBooking}
            className="flex-1 min-w-0 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
          >
            View Details
          </button>

          {displayBooking.status === 'Completed' && (
            <button
              onClick={handleBookAgain}
              className="flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              <ArrowPathIcon className="h-4 w-4 mr-1" />
              Book Again
            </button>
          )}

          {(displayBooking.status === 'Requested' || displayBooking.status === 'Accepted') && (
            <>
              <button
                onClick={handleContactProvider}
                className="flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                <ChatBubbleLeftRightIcon className="h-4 w-4 mr-1" />
                Contact
              </button>
              <button
                onClick={handleCancelBooking}
                className="flex items-center justify-center px-3 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 bg-white hover:bg-red-50 transition-colors"
              >
                <XMarkIcon className="h-4 w-4 mr-1" />
                Cancel
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingItemCard;
