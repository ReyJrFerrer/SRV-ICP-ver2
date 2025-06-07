// frontend/src/components/client/ClientBookingItemCard.tsx
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { EnhancedBooking } from '../../hooks/bookingManagement';
import { CalendarDaysIcon, MapPinIcon, CurrencyDollarIcon, XCircleIcon, ArrowPathIcon, ExclamationTriangleIcon, StarIcon } from '@heroicons/react/24/solid';

interface ClientBookingItemCardProps {
  booking: EnhancedBooking;
  onCancelBooking?: (bookingId: string) => void;
  onUpdateStatus?: (bookingId: string, status: string) => Promise<void>;
}

const ClientBookingItemCard: React.FC<ClientBookingItemCardProps> = ({ 
  booking, 
  onCancelBooking,
  onUpdateStatus 
}) => {
  const router = useRouter();

  // Debug validation
  if (!booking) {
    console.error("CRITICAL: ClientBookingItemCard received an undefined 'booking' prop!");
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl shadow-lg" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> Booking data is missing for this card.</span>
      </div>
    );
  }

  if (!booking.id) {
    console.error("CRITICAL: Booking object is missing 'id'. Booking data:", JSON.stringify(booking, null, 2));
    return (
      <div className="bg-orange-100 border border-orange-400 text-orange-700 px-4 py-3 rounded-xl shadow-lg" role="alert">
        <div className="flex items-center">
          <ExclamationTriangleIcon className="h-5 w-5 mr-2"/>
          <strong className="font-bold">Data Issue!</strong>
        </div>
        <span className="block sm:inline"> This booking card has incomplete data (missing ID).</span>
      </div>
    );
  }

  // Extract booking data with fallbacks
  const serviceTitle = booking.serviceName || 'Service details not found';
  const serviceImage = booking.serviceImage || '/images/default-service.jpg';
  const providerName = booking.providerProfile?.name 
    
  
  const bookingLocation = booking.formattedLocation || 
    (typeof booking.location === 'string' ? booking.location : 'Location not specified');

  // Format date function
  const formatDate = (date: Date | string | number) => {
    try {
      const dateObj = new Date(date);
      return dateObj.toLocaleDateString([], { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } catch {
      return 'Date not available';
    }
  };

  // Status color mapping
  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'REQUESTED':
      case 'PENDING':
        return 'text-yellow-600 bg-yellow-100';
      case 'ACCEPTED':
      case 'CONFIRMED':
        return 'text-green-600 bg-green-100';
      case 'INPROGRESS':
      case 'IN_PROGRESS':
        return 'text-blue-600 bg-blue-100';
      case 'COMPLETED':
        return 'text-indigo-600 bg-indigo-100';
      case 'CANCELLED':
        return 'text-red-600 bg-red-100';
      case 'DECLINED':
        return 'text-gray-600 bg-gray-100';
      case 'DISPUTED':
        return 'text-orange-600 bg-orange-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  // Event handlers
  const handleCancelClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        if (onUpdateStatus) {
          await onUpdateStatus(booking.id, 'Cancelled');
        } else if (onCancelBooking) {
          onCancelBooking(booking.id);
        } else {
          console.warn(`No cancel handler provided for booking ID: ${booking.id}`);
          alert(`Mock: Request Cancel for Booking ID: ${booking.id} (Handler not passed)`);
        }
      } catch (error) {
        console.error('Error cancelling booking:', error);
        alert('Failed to cancel booking. Please try again.');
      }
    }
  };

  const handleBookAgainClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (booking.serviceId) {
      router.push(`/client/book/${booking.serviceId}`);
    } else {
      alert("Service information not available to book again.");
      router.push('/client/home');
    }
  };

  // Check if booking can be cancelled
  const canCancel = ['Requested', 'Pending', 'Accepted', 'Confirmed'].includes(booking.status);
  
  // Check if booking is completed/cancelled for actions
  const isFinished = ['Completed', 'Cancelled'].includes(booking.status);

  return (
    <Link href={`/client/bookings/${booking.id}`} legacyBehavior>
      <a className="block bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-shadow duration-300 cursor-pointer">
        <div className="md:flex">
          {serviceImage && (
            <div className="md:flex-shrink-0">
              <div className="relative h-48 w-full object-cover md:w-48">
                <Image
                  src={serviceImage}
                  alt={serviceTitle}
                  layout="fill"
                  objectFit="cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/default-service.jpg';
                  }}
                />
              </div>
            </div>
          )}
          
          <div className="p-4 sm:p-5 flex flex-col justify-between flex-grow">
            <div>
              <div className="flex justify-between items-start">
                <p className="text-xs text-indigo-500 uppercase tracking-wider font-semibold">
                  {booking.category || 'Service'}
                </p>
                <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                  {booking.status.replace('_', ' ')}
                </span>
              </div>
              
              <h3 className="mt-1 text-lg md:text-xl font-bold text-slate-800 truncate" title={serviceTitle}>
                {serviceTitle}
              </h3>
              
              <p className="mt-1 text-xs text-gray-500">
                Provided by: {providerName}
              </p>
              
              <div className="mt-3 space-y-1.5 text-xs text-gray-600">
                <p className="flex items-center">
                  <CalendarDaysIcon className="h-4 w-4 mr-1.5 text-gray-400" />
                  {formatDate(booking.scheduledDate || booking.createdAt)}
                </p>
                
                <p className="flex items-center">
                  <MapPinIcon className="h-4 w-4 mr-1.5 text-gray-400" />
                  {bookingLocation}
                </p>
                
                {booking.price && (
                  <p className="flex items-center">
                    <CurrencyDollarIcon className="h-4 w-4 mr-1.5 text-gray-400" />
                    ₱{booking.price.toFixed(2)}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-200 flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2 sm:justify-end">
              {canCancel && (
                <button
                  onClick={handleCancelClick}
                  className="flex items-center justify-center text-xs w-full sm:w-auto bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-3 rounded-md transition-colors"
                >
                  <XCircleIcon className="h-4 w-4 mr-1.5" /> Cancel Booking
                </button>
              )}
              
              {isFinished && booking.serviceId && (
                <button
                  onClick={handleBookAgainClick}
                  className="flex items-center justify-center text-xs w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-3 rounded-md transition-colors"
                >
                  <ArrowPathIcon className="h-4 w-4 mr-1.5" /> Book Again
                </button>
              )}
              
              {isFinished && (
                <Link
                  href={{
                    pathname: '/client/bookings-ratings',
                    query: {
                      providerName: providerName,
                      bookingId: booking.id,
                    },
                  }}
                  legacyBehavior
                >
                  <a className="flex items-center justify-center text-xs w-full sm:w-auto bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-3 rounded-md transition-colors">
                    <StarIcon className="h-4 w-4 mr-1.5" /> Rate Provider
                  </a>
                </Link>
              )}
            </div>
          </div>
        </div>
      </a>
    </Link>
  );
};

export default ClientBookingItemCard;