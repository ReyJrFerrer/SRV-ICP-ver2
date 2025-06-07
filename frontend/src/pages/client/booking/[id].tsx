import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { ArrowLeftIcon, CalendarDaysIcon, MapPinIcon, CurrencyDollarIcon, UserCircleIcon, ChatBubbleLeftEllipsisIcon, XCircleIcon, ArrowPathIcon, ClockIcon, InformationCircleIcon, StarIcon } from '@heroicons/react/24/solid';
import { EnhancedBooking, useBookingManagement } from '../../../hooks/bookingManagement';
import BottomNavigationNextjs from '../../../components/client/BottomNavigationNextjs';

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

  // Event handlers for the new UI
  const handleCancelBooking = async () => {
    if (!specificBooking) return;
    
    const serviceName = specificBooking.serviceName  || 'this service';
    if (window.confirm(`Are you sure you want to cancel your booking for "${serviceName}"?`)) {
      await handleUpdateBookingStatus(specificBooking.id, 'Cancelled');
      alert(`Booking for "${serviceName}" has been cancelled successfully.`);
    }
  };

  const handleContactProvider = () => {
    if (!specificBooking) return;
    const providerName = specificBooking.providerProfile?.name;
    
    // You can integrate actual contact functionality here
    alert(`Mock: Contacting provider ${providerName}. Contact functionality would be implemented here.`);
  };

  // Utility functions
  const formatDate = (date: Date | string | undefined) => {
    if (!date) return 'N/A';
    try {
      return new Date(date).toLocaleString([], { 
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

  const getStatusPillStyle = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'REQUESTED':
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-700';
      case 'ACCEPTED':
      case 'CONFIRMED':
        return 'bg-green-100 text-green-700';
      case 'INPROGRESS':
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-700';
      case 'COMPLETED':
        return 'bg-indigo-100 text-indigo-700';
      case 'CANCELLED':
        return 'bg-red-100 text-red-700';
      case 'DECLINED':
        return 'bg-gray-100 text-gray-700';
      case 'DISPUTED':
        return 'bg-orange-100 text-orange-700';
      default:
        return 'bg-gray-100 text-gray-700';
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
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
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
          <Head><title>Booking Not Found</title></Head>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {localError === 'Booking not found' ? 'Booking Not Found' : 'Error Loading Booking'}
          </h1>
          <p className="text-gray-600 mb-4">{displayError}</p>
          <div className="space-x-3">
            <Link href="/client/booking" legacyBehavior>
              <a className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors">
                Back to My Bookings
              </a>
            </Link>
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
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <Head><title>Booking Not Found</title></Head>
        <h1 className="text-xl font-semibold text-red-600 mb-4">Booking Not Found</h1>
        <Link href="/client/booking" legacyBehavior>
          <a className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Back to My Bookings
          </a>
        </Link>
      </div>
    );
  }

  // Extract booking data
  const serviceName = specificBooking?.serviceName;
  const providerName = specificBooking?.providerProfile?.name;
  const bookingLocation = specificBooking?.formattedLocation || 'Location not specified';

  // Check if booking can be cancelled
  const canCancel = ['Requested', 'Pending', 'Accepted', 'Confirmed'].includes(specificBooking?.status || '');
  
  // Check if booking is completed/cancelled for actions
  const isFinished = ['Completed', 'Cancelled'].includes(specificBooking?.status || '');

  // Show booking details
  return (
    <>
      <Head>
        <title>Booking: {serviceName} | SRV Client</title>
        <meta 
          name="description" 
          content={`Booking details for ${serviceName}`} 
        />
        <meta name="robots" content="noindex" />
      </Head>
      
      <div className="min-h-screen bg-gray-100 pb-20 md:pb-0">
        <header className="bg-white shadow-sm sticky top-0 z-30">
          <div className="container mx-auto px-4 py-3 flex items-center">
            <button onClick={() => router.back()} className="p-2 rounded-full hover:bg-gray-100 mr-2">
              <ArrowLeftIcon className="h-5 w-5 text-gray-700" />
            </button>
            <h1 className="text-lg font-semibold text-slate-800 truncate">Booking Details</h1>
          </div>
        </header>

        <main className="container mx-auto p-4 sm:p-6 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold text-slate-800">{serviceName}</h2>
              <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusPillStyle(specificBooking?.status || '')}`}>
                {specificBooking?.status?.replace('_', ' ') || 'Unknown'}
              </span>
            </div>
            <p className="text-sm text-gray-500 mb-1 flex items-center">
              <UserCircleIcon className="h-4 w-4 mr-1.5 text-gray-400"/>
              Provider: <span className="font-medium text-gray-700 ml-1">{providerName}</span>
            </p>
            <p className="text-sm text-gray-500 mb-4">Booking ID: {specificBooking?.id?.toUpperCase().slice(-8) || 'N/A'}</p>

            <div className="border-t border-gray-200 pt-4 space-y-3 text-sm">
              <div className="flex items-start">
                <CalendarDaysIcon className="h-5 w-5 mr-2 text-blue-500 mt-0.5 flex-shrink-0"/>
                <span><strong className="font-medium text-gray-700">Scheduled:</strong> {formatDate(specificBooking?.requestedDate || specificBooking?.createdAt)}</span>
              </div>
              
              <div className="flex items-start">
                <MapPinIcon className="h-5 w-5 mr-2 text-blue-500 mt-0.5 flex-shrink-0"/>
                <span><strong className="font-medium text-gray-700">Location:</strong> {bookingLocation}</span>
              </div>
              
              {specificBooking?.price && (
                <div className="flex items-start">
                  <CurrencyDollarIcon className="h-5 w-5 mr-2 text-green-500 mt-0.5 flex-shrink-0"/>
                  <span><strong className="font-medium text-gray-700">Payment:</strong> ₱{specificBooking.price.toFixed(2)}</span>
                </div>
              )}
              
              {/* {specificBooking?.notes && (
                <div className="flex items-start">
                  <InformationCircleIcon className="h-5 w-5 mr-2 text-gray-500 mt-0.5 flex-shrink-0"/>
                  <span><strong className="font-medium text-gray-700">Notes:</strong> {specificBooking.notes}</span>
                </div>
              )} */}
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="bg-white p-4 rounded-xl shadow-lg space-y-3 sm:space-y-0 sm:flex sm:space-x-3">
            <button
              onClick={handleContactProvider}
              className="w-full sm:flex-1 flex items-center justify-center bg-slate-600 hover:bg-slate-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors text-sm"
            >
              <ChatBubbleLeftEllipsisIcon className="h-5 w-5 mr-2" /> Contact Provider
            </button>

            {canCancel && (
              <button
                onClick={handleCancelBooking}
                disabled={isOperationInProgress(`update-${specificBooking?.id}`)}
                className="w-full sm:flex-1 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white font-medium py-2.5 px-4 rounded-lg transition-colors text-sm disabled:opacity-50"
              >
                <XCircleIcon className="h-5 w-5 mr-2" /> 
                {isOperationInProgress(`update-${specificBooking?.id}`) ? 'Cancelling...' : 'Cancel Booking'}
              </button>
            )}

            {isFinished && (
              <>
                {specificBooking?.serviceId && (
                  <Link href={`/client/book/${specificBooking.serviceId}`} legacyBehavior>
                    <a className="w-full sm:flex-1 flex items-center justify-center bg-green-500 hover:bg-green-600 text-white font-medium py-2.5 px-4 rounded-lg transition-colors text-sm text-center">
                      <ArrowPathIcon className="h-5 w-5 mr-2" /> Book Again
                    </a>
                  </Link>
                )}

                <Link
                    href={{
                      pathname: `/client/review/${specificBooking?.id}`,  // ✅ Routes to [id].tsx
                      query: {
                        providerName: providerName  
                      },
                    }}
                    legacyBehavior
                  >
                  <a className="w-full sm:flex-1 flex items-center justify-center bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2.5 px-4 rounded-lg transition-colors text-sm text-center">
                    <StarIcon className="h-5 w-5 mr-2" /> Rate Provider
                  </a>
                </Link>
              </>
            )}
          </div>
        </main>
        
        <div className="md:hidden">
          <BottomNavigationNextjs />
        </div>
      </div>
    </>
  );
};

export default BookingDetailsPage;
