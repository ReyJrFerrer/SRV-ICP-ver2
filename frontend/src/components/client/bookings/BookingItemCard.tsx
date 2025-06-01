import React from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { Principal } from '@dfinity/principal';
import { Booking, BookingStatus } from '../../../services/bookingCanisterService';
import { 
  CalendarIcon, 
  ClockIcon, 
  MapPinIcon, 
  CurrencyDollarIcon,
  PhoneIcon,
  ChatBubbleLeftRightIcon,
  XMarkIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

interface BookingItemCardProps {
  booking?: Booking;
  onUpdateBookingStatus?: (bookingId: string, newStatus: BookingStatus) => void;
}
// To Remove
// Placeholder Booking Data
const createPlaceholderBooking = (): Booking => ({
  id: 'placeholder-booking',
  clientId: Principal.fromText('rdmx6-jaaaa-aaaah-qcaiq-cai'),
  providerId: Principal.fromText('rrkah-fqaaa-aaaah-qcaiq-cai'),
  serviceId: 'placeholder-service',
  status: 'Accepted',
  requestedDate: new Date().toISOString(),
  scheduledDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
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
  serviceSlug: 'house-cleaning'
});

const BookingItemCard: React.FC<BookingItemCardProps> = ({ booking, onUpdateBookingStatus }) => {
  const router = useRouter();
  
  // Use placeholder booking if no booking is provided
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
    // In a real app, this would open a chat or show contact details
    alert(`Contact ${displayBooking.providerName} through the app's messaging system.`);
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

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="p-4 flex items-start space-x-3">
        <div className="flex-shrink-0">
          <Image
            src={displayBooking.serviceImage || '/images/default-placeholder.png'}
            alt={displayBooking.serviceName || 'Service'}
            width={60}
            height={60}
            className="rounded-lg object-cover"
          />
        </div>
        <div className="flex-grow min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 truncate">
            {displayBooking.serviceName}
          </h3>
          <p className="text-sm text-gray-600 mb-2">by {displayBooking.providerName}</p>
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
          <div className="flex items-center text-gray-600">
            <MapPinIcon className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="truncate">{displayBooking.location.city}, {displayBooking.location.state}</span>
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
