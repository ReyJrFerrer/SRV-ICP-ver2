import React, { useState } from 'react';
import { useRouter } from 'next/router'; 
import { ProviderEnhancedBooking, useProviderBookingManagement } from '../../hooks/useProviderBookingManagement';
import { 
    MapPinIcon, CalendarIcon, ClockIcon, UserIcon, 
    CurrencyDollarIcon, PhoneIcon, InformationCircleIcon 
} from '@heroicons/react/24/outline';

const calculateDuration = (start: string | Date, end: string | Date): string => {
  const startTime = new Date(start); const endTime = new Date(end);
  const durationMs = endTime.getTime() - startTime.getTime();
  if (isNaN(durationMs) || durationMs < 0) return 'N/A';
  const hours = Math.floor(durationMs / (1000 * 60 * 60));
  const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
  let durationStr = '';
  if (hours > 0) durationStr += `${hours} hr${hours > 1 ? 's' : ''} `;
  if (minutes > 0) durationStr += `${minutes} min${minutes > 1 ? 's' : ''}`;
  return durationStr.trim() || (hours === 0 && minutes === 0 ? "Short duration" : "N/A");
};

interface ProviderBookingItemCardProps {
  booking: ProviderEnhancedBooking;
}

const ProviderBookingItemCard: React.FC<ProviderBookingItemCardProps> = ({ booking }) => {
  const [showDetails, setShowDetails] = useState(false);
  const router = useRouter();
  const { 
    acceptBookingById, 
    declineBookingById, 
    startBookingById, 
    completeBookingById,
    isBookingActionInProgress,
    getStatusColor,
    formatBookingDate,
    formatBookingTime,
    refreshBookings // Add this if it exists in your hook
  } = useProviderBookingManagement();

  // Extract booking data with proper property names for ProviderEnhancedBooking
  const clientName = booking.clientName || 'Unknown Client';
  const clientContact = booking.clientPhone || booking.clientProfile?.phone || 'Contact not available';
  const serviceTitle = booking.serviceName || 'Service'; // TODO: Add serviceTitle to the interface when service data is available
  const scheduledDate = booking.scheduledDate ? new Date(booking.scheduledDate) : null;
  const duration = booking.serviceDuration || 'N/A';
  const price = booking.price;
  const priceLabel = "Service Price";
  const locationAddress = booking.formattedLocation || "Location not specified";
  const status = booking.status;

  // Action handlers using the hook's functions
  const handleAccept = async () => {
    const success = await acceptBookingById(booking.id);
    if (success) {
      console.log(`✅ Booking ${booking.id} accepted successfully`);
      // Force refresh the bookings list
        await refreshBookings();
      
    } else {
      console.error(`❌ Failed to accept booking ${booking.id}`);
    }
  };

  const handleReject = async () => {
    const success = await declineBookingById(booking.id, 'Declined by provider');
    if (success) {
      console.log(`✅ Booking ${booking.id} declined successfully`);
      // Force refresh the bookings list
        await refreshBookings();
      
    } else {
      console.error(`❌ Failed to decline booking ${booking.id}`);
    }
  };

  const handleContactClient = () => {
    if (clientContact && clientContact !== 'Contact not available') {
      // Open phone/messaging app
      window.location.href = `tel:${clientContact}`;
    } else {
      alert('Contact information not available');
    }
  };

  const handleMarkAsCompleted = async () => {
    const success = await completeBookingById(booking.id);
    if (success) {
      console.log(`✅ Booking ${booking.id} marked as completed`);
    } else {
      console.error(`❌ Failed to complete booking ${booking.id}`);
    }
  };

  const handleStartService = async () => {
    const success = await startBookingById(booking.id);
    if (success) {
      console.log(`✅ Service started for booking ${booking.id}`);
      const actualStartTime = new Date().toISOString();
      router.push(`/provider/active-service/${booking.id}?startTime=${actualStartTime}`);
    } else {
      console.error(`❌ Failed to start service for booking ${booking.id}`);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow flex flex-col h-full min-h-[260px]">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-base font-semibold text-blue-700 group-hover:text-blue-800 transition-colors pr-2 flex-grow break-words">
            {serviceTitle}
        </h3>
        <span 
          className={`text-xs font-semibold px-2 py-1 rounded-full whitespace-nowrap flex-shrink-0 ${getStatusColor(status)}`}
        >
          {status === 'InProgress' ? 'In Progress' : status}
        </span>
      </div>

      {/* Always visible info */}
      <div className="space-y-2 text-xs text-gray-700 flex-grow">
        <div className="flex items-center">
          <UserIcon className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
          <span>Client: <span className="font-medium">{clientName}</span></span>
        </div>
        {clientContact && (
          <div className="flex items-center">
            <PhoneIcon className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
            <span>Contact: <span className="font-medium">{clientContact}</span></span>
          </div>
        )}
        {price !== undefined && (
          <div className="flex items-center">
            <CurrencyDollarIcon className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
            <span>{priceLabel}: <span className="font-medium text-green-600">₱{price.toFixed(2)}</span></span>
          </div>
        )}
        <div className="flex items-start">
          <MapPinIcon className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0 mt-0.5" />
          <span className="break-words">Location: <span className="font-medium">{locationAddress}</span></span>
        </div>
      </div>

      {/* Toggle link */}
      <span
        className="mt-2 inline-flex items-center cursor-pointer text-blue-600 text-xs font-medium select-none hover:underline"
        onClick={() => setShowDetails(prev => !prev)}
      >
        {showDetails ? (
          <>Hide Details <span className="ml-1">▲</span></>
        ) : (
          <>View More Details <span className="ml-1">▼</span></>
        )}
      </span>

      <div
        className={`transition-all duration-300 overflow-hidden`}
        style={{
          maxHeight: showDetails ? 200 : 0,
          opacity: showDetails ? 1 : 0,
          marginTop: showDetails ? 8 : 0
        }}
      >
        <div className="space-y-2 text-xs text-gray-700">
          <div className="flex items-center">
            <CalendarIcon className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
            <span>Date: <span className="font-medium">
              {booking.scheduledDate ? formatBookingDate(booking.scheduledDate) : booking.bookingDate}
            </span></span>
          </div>
          <div className="flex items-center">
            <ClockIcon className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
            <span>Time: <span className="font-medium">
              {booking.scheduledDate ? formatBookingTime(booking.scheduledDate) : booking.bookingTime}
            </span></span>
          </div>
          {duration !== 'N/A' && (
            <div className="flex items-center">
              <ClockIcon className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
              <span>Duration: <span className="font-medium">{duration}</span></span>
            </div>
          )}
          {/* Note: booking.notes property doesn't exist in the interface - removed for now */}
        </div>
      </div>

      <div className="mt-auto pt-3 border-t border-gray-200 flex flex-wrap gap-2 justify-end">
        {/* Show accept/reject buttons for pending bookings */}
        {booking.canAccept && booking.canDecline && (
          <>
            <button 
              onClick={handleReject} 
              disabled={isBookingActionInProgress(booking.id, 'decline')}
              className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-colors"
            >
              {isBookingActionInProgress(booking.id, 'decline') ? 'Declining...' : 'Reject'}
            </button>
            <button 
              onClick={handleAccept} 
              disabled={isBookingActionInProgress(booking.id, 'accept')}
              className="px-3 py-1.5 text-xs font-medium text-white bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-colors"
            >
              {isBookingActionInProgress(booking.id, 'accept') ? 'Accepting...' : 'Accept'}
            </button>
          </>
        )}
        {/* Show contact and start service buttons for accepted bookings */}
        {booking.canStart && (
          <>
            <button 
              onClick={handleContactClient} 
              className="px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
            >
              Contact Client
            </button>
            <button 
              onClick={handleStartService} 
              disabled={isBookingActionInProgress(booking.id, 'start')}
              className="px-3 py-1.5 text-xs font-medium text-white bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-colors"
            >
              {isBookingActionInProgress(booking.id, 'start') ? 'Starting...' : 'Start Service'}
            </button>
          </>
        )}
        {/* Show contact and complete buttons for in-progress bookings */}
        {booking.canComplete && (
          <>
            <button 
              onClick={handleContactClient} 
              className="px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
            >
              Contact Client
            </button>
            <button 
              onClick={handleMarkAsCompleted} 
              disabled={isBookingActionInProgress(booking.id, 'complete')}
              className="px-3 py-1.5 text-xs font-medium text-white bg-teal-500 hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-colors"
            >
              {isBookingActionInProgress(booking.id, 'complete') ? 'Completing...' : 'Mark Completed'}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ProviderBookingItemCard;