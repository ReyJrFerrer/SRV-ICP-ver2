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
  ArrowPathIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

interface ViewBookingDetailsComponentProps {
  booking?: Booking;
  onUpdateBookingStatus?: (bookingId: string, newStatus: BookingStatus) => void;
}

// TO Remove
// Placeholder Booking Data
const createPlaceholderBooking = (): Booking => ({
  id: 'placeholder-booking-details',
  clientId: Principal.fromText('rdmx6-jaaaa-aaaah-qcaiq-cai'),
  providerId: Principal.fromText('rrkah-fqaaa-aaaah-qcaiq-cai'),
  serviceId: 'placeholder-service-details',
  status: 'Accepted',
  requestedDate: new Date().toISOString(),
  scheduledDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
  price: 250,
  location: {
    latitude: 16.4095,
    longitude: 120.5975,
    address: '456 Main Street, Apartment 2B',
    city: 'Baguio City',
    state: 'Benguet',
    country: 'Philippines',
    postalCode: '2600'
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  serviceName: 'Premium Home Deep Cleaning',
  serviceImage: '/images/CleaningServices-CoverImage.jpeg',
  providerName: 'Sparkle Clean Pro',
  bookingDate: 'Tomorrow',
  bookingTime: '10:00 AM',
  duration: '4-5 hours',
  priceDisplay: '$250',
  serviceSlug: 'premium-deep-cleaning'
});

const ViewBookingDetailsComponent: React.FC<ViewBookingDetailsComponentProps> = ({ 
  booking, 
  onUpdateBookingStatus 
}) => {
  const router = useRouter();
  
  // Use placeholder booking if no booking is provided
  const displayBooking = booking || createPlaceholderBooking();

  const handleBack = () => {
    router.back();
  };

  const handleBookAgain = () => {
    router.push(`/client/book/${displayBooking.serviceSlug}`);
  };

  const handleCancelBooking = () => {
    if (window.confirm(`Are you sure you want to cancel this booking for "${displayBooking.serviceName}"?`)) {
      onUpdateBookingStatus?.(displayBooking.id, 'Cancelled');
      router.back();
    }
  };

  const handleContactProvider = () => {
    // In a real app, this would open a chat or show contact details
    alert(`Contact ${displayBooking.providerName} through the app's messaging system.`);
  };

  const getStatusIcon = (status: BookingStatus) => {
    switch (status) {
      case 'Requested':
        return <InformationCircleIcon className="h-5 w-5" />;
      case 'Accepted':
        return <CheckCircleIcon className="h-5 w-5" />;
      case 'Completed':
        return <CheckCircleIcon className="h-5 w-5" />;
      case 'Cancelled':
        return <XMarkIcon className="h-5 w-5" />;
      case 'InProgress':
        return <ClockIcon className="h-5 w-5" />;
      case 'Declined':
        return <XMarkIcon className="h-5 w-5" />;
      case 'Disputed':
        return <ExclamationTriangleIcon className="h-5 w-5" />;
      default:
        return <InformationCircleIcon className="h-5 w-5" />;
    }
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
    if (!dateString) return 'To be determined';
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString?: string) => {
    if (!dateString) return 'To be determined';
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getStatusDescription = (status: BookingStatus) => {
    switch (status) {
      case 'Requested':
        return 'Your booking request has been sent to the service provider. You will be notified once they respond.';
      case 'Accepted':
        return 'Your booking has been confirmed by the service provider. The service is scheduled as shown below.';
      case 'Completed':
        return 'This service has been completed. You can book the same service again or leave a review.';
      case 'Cancelled':
        return 'This booking has been cancelled. You can book the same service again if needed.';
      case 'InProgress':
        return 'Your service is currently in progress. The provider will update the status when completed.';
      case 'Declined':
        return 'Unfortunately, the service provider declined this booking request. You can try booking with another provider.';
      case 'Disputed':
        return 'There is a dispute regarding this booking. Our support team will help resolve this issue.';
      default:
        return 'Booking status information.';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-4 py-4 flex items-center">
          <button 
            onClick={handleBack}
            className="mr-3 p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Booking Details</h1>
            <p className="text-sm text-gray-600">Booking ID: {displayBooking.id}</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Status Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${getStatusColor(displayBooking.status)}`}>
              {getStatusIcon(displayBooking.status)}
            </div>
            <div className="ml-4">
              <h2 className="text-lg font-semibold text-gray-900">Booking {displayBooking.status}</h2>
              <p className="text-sm text-gray-600 mt-1">{getStatusDescription(displayBooking.status)}</p>
            </div>
          </div>
        </div>

        {/* Service Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Information</h3>
          
          <div className="flex items-start space-x-4 mb-4">
            <Image
              src={displayBooking.serviceImage || '/images/default-placeholder.png'}
              alt={displayBooking.serviceName || 'Service'}
              width={80}
              height={80}
              className="rounded-lg object-cover"
            />
            <div className="flex-grow">
              <h4 className="text-xl font-semibold text-gray-900">{displayBooking.serviceName}</h4>
              <p className="text-gray-600 mb-2">by {displayBooking.providerName}</p>
              <div className="flex items-center text-lg font-semibold text-green-600">
                <CurrencyDollarIcon className="h-5 w-5 mr-1" />
                {displayBooking.price}
              </div>
            </div>
          </div>

          {displayBooking.duration && (
            <div className="flex items-center text-gray-600 mb-2">
              <ClockIcon className="h-5 w-5 mr-3" />
              <span>Estimated Duration: {displayBooking.duration}</span>
            </div>
          )}
        </div>

        {/* Schedule Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Schedule</h3>
          
          <div className="space-y-3">
            <div className="flex items-center text-gray-700">
              <CalendarIcon className="h-5 w-5 mr-3 text-gray-400" />
              <div>
                <p className="font-medium">Date</p>
                <p className="text-sm text-gray-600">{formatDate(displayBooking.scheduledDate || displayBooking.requestedDate)}</p>
              </div>
            </div>
            
            <div className="flex items-center text-gray-700">
              <ClockIcon className="h-5 w-5 mr-3 text-gray-400" />
              <div>
                <p className="font-medium">Time</p>
                <p className="text-sm text-gray-600">{formatTime(displayBooking.scheduledDate || displayBooking.requestedDate)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Location Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Location</h3>
          
          <div className="flex items-start">
            <MapPinIcon className="h-5 w-5 mr-3 text-gray-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-gray-900">{displayBooking.location.address}</p>
              <p className="text-sm text-gray-600">
                {displayBooking.location.city}, {displayBooking.location.state} {displayBooking.location.postalCode}
              </p>
              <p className="text-sm text-gray-600">{displayBooking.location.country}</p>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Timeline</h3>
          
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-4"></div>
              <div>
                <p className="font-medium text-gray-900">Booking Requested</p>
                <p className="text-sm text-gray-600">{formatDate(displayBooking.createdAt)} at {formatTime(displayBooking.createdAt)}</p>
              </div>
            </div>
            
            {displayBooking.status !== 'Requested' && (
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-4"></div>
                <div>
                  <p className="font-medium text-gray-900">Status Updated to {displayBooking.status}</p>
                  <p className="text-sm text-gray-600">{formatDate(displayBooking.updatedAt)} at {formatTime(displayBooking.updatedAt)}</p>
                </div>
              </div>
            )}
            
            {displayBooking.completedDate && (
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-4"></div>
                <div>
                  <p className="font-medium text-gray-900">Service Completed</p>
                  <p className="text-sm text-gray-600">{formatDate(displayBooking.completedDate)} at {formatTime(displayBooking.completedDate)}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
          
          <div className="space-y-3">
            {displayBooking.status === 'Completed' && (
              <button
                onClick={handleBookAgain}
                className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                <ArrowPathIcon className="h-5 w-5 mr-2" />
                Book This Service Again
              </button>
            )}

            {(displayBooking.status === 'Requested' || displayBooking.status === 'Accepted') && (
              <>
                <button
                  onClick={handleContactProvider}
                  className="w-full flex items-center justify-center px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  <ChatBubbleLeftRightIcon className="h-5 w-5 mr-2" />
                  Contact Service Provider
                </button>
                
                <button
                  onClick={handleCancelBooking}
                  className="w-full flex items-center justify-center px-4 py-3 border border-red-300 rounded-lg text-sm font-medium text-red-700 bg-white hover:bg-red-50 transition-colors"
                >
                  <XMarkIcon className="h-5 w-5 mr-2" />
                  Cancel Booking
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewBookingDetailsComponent;
