import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { EnhancedBooking, useBookingManagement } from '../../../hooks/bookingManagement';
import ViewBookingDetailsComponent from '../../../components/client/bookings/ViewBookingDetailsComponent';

// Import BookingStatus from the hook's types if it's exported, or define it locally
type BookingStatus = 'Requested' | 'Accepted' | 'Completed' | 'Cancelled' | 'InProgress' | 'Declined' | 'Disputed';

const BookingDetailsPage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [specificBooking, setSpecificBooking] = useState<EnhancedBooking | null>(null);
  const [localLoading, setLocalLoading] = useState(true);
  const [localError, setLocalError] = useState<string | null>(null);

  const bookingManagement = useBookingManagement();
  
  const {
    bookings,
    updateBookingStatus: updateBookingStatusHook,
    loading: hookLoading,
    error: hookError,
    refreshBookings,
    clearError,
    isOperationInProgress
  } = bookingManagement;

  // Find specific booking from the hook's bookings array
  useEffect(() => {
    if (id && typeof id === 'string') {
      setLocalLoading(true);
      setLocalError(null);

      // Wait for bookings to load from the hook
      if (!hookLoading && bookings.length >= 0) {
        const foundBooking = bookings.find(booking => booking.id === id);
        
        if (foundBooking) {
          console.log('✅ Found booking in hook data:', foundBooking);
          setSpecificBooking(foundBooking);
        } else {
          console.log('❌ Booking not found in hook data, ID:', id);
          setLocalError('Booking not found');
        }
        
        setLocalLoading(false);
      }
    }
  }, [id, bookings, hookLoading]);

  // Handle booking status updates using the hook
  const handleUpdateBookingStatus = async (bookingId: string, newStatus: BookingStatus) => {
    try {
      console.log(`🔄 Updating booking ${bookingId} status to ${newStatus}`);
      
      // Use the hook's update function
      await updateBookingStatusHook(bookingId, newStatus);
      
      // The hook will automatically update the bookings array
      // Find the updated booking and update local state
      const updatedBooking = bookings.find(booking => booking.id === bookingId);
      if (updatedBooking) {
        setSpecificBooking(updatedBooking);
        console.log('✅ Local booking state updated');
      }
      
    } catch (error) {
      console.error('❌ Failed to update booking status:', error);
      // Error is already handled by the hook
    }
  };

  // Handle retry functionality
  const handleRetry = async () => {
    setLocalError(null);
    clearError();
    try {
      await refreshBookings();
    } catch (error) {
      console.error('❌ Failed to retry loading bookings:', error);
    }
  };

  // Determine loading state
  const isLoading = hookLoading || localLoading;

  // Determine error state
  const displayError = localError || hookError;

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading booking details...</p>
        </div>
      </div>
    );
  }

  // Error state - show if there's an error and no booking found
  if (displayError && !specificBooking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {localError === 'Booking not found' ? 'Booking Not Found' : 'Error Loading Booking'}
          </h1>
          <p className="text-gray-600 mb-4">
            {displayError}
          </p>
          <div className="space-x-3">
            <button
              onClick={() => router.push('/client/bookings')}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Back to My Bookings
            </button>
            <button
              onClick={handleRetry}
              disabled={isOperationInProgress('refreshBookings')}
              className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-2 rounded-lg transition-colors disabled:opacity-50"
            >
              {isOperationInProgress('refreshBookings') ? 'Retrying...' : 'Retry'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // No booking found (after loading completed)
  if (!specificBooking && !isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Booking Not Found</h1>
          <p className="text-gray-600 mb-4">
            The booking you're looking for doesn't exist or you don't have access to it.
          </p>
          <div className="space-x-3">
            <button
              onClick={() => router.push('/client/bookings')}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Back to My Bookings
            </button>
            <button
              onClick={handleRetry}
              disabled={isOperationInProgress('refreshBookings')}
              className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-2 rounded-lg transition-colors disabled:opacity-50"
            >
              {isOperationInProgress('refreshBookings') ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show booking details
  return (
    <>
      <Head>
        <title>
          {specificBooking?.serviceName ? `${specificBooking.serviceName} - Booking Details` : 'Booking Details'} - SRV
        </title>
        <meta 
          name="description" 
          content={specificBooking?.serviceName ? `Booking details for ${specificBooking.serviceName}` : 'View your booking details'} 
        />
        <meta name="robots" content="noindex" />
      </Head>
      
      <ViewBookingDetailsComponent 
        booking={specificBooking || undefined} 
        onUpdateBookingStatus={handleUpdateBookingStatus}
      />
    </>
  );
};

export default BookingDetailsPage;
