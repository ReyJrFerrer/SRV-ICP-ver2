import React, { useState, useEffect, useMemo } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router'; 
import BottomNavigation from '@app/components/provider/BottomNavigationNextjs';
import ProviderBookingItemCard from '@app/components/provider/ProviderBookingItemCard';
import { useProviderBookingManagement, ProviderEnhancedBooking } from '../../hooks/useProviderBookingManagement';

type BookingStatusTab = 'Pending' | 'Approved' | 'InProgress' | 'Completed' | 'Canceled';
const TAB_ITEMS: BookingStatusTab[] = ['Pending', 'Approved', 'InProgress', 'Completed', 'Canceled'];

const ProviderBookingsPage: React.FC = () => {
  const router = useRouter();
  const { tab: queryTab } = router.query; 

  const [activeTab, setActiveTab] = useState<BookingStatusTab>('Pending'); 
  
  // Use the provider booking management hook
  const {
    bookings,
    loading,
    error,
    refreshing,
    getPendingBookings,
    getUpcomingBookings,
    getCompletedBookings,
    getBookingsByStatus,
    clearError,
    refreshBookings,
    isProviderAuthenticated
  } = useProviderBookingManagement();

  useEffect(() => {
    if (typeof queryTab === 'string' && TAB_ITEMS.includes(queryTab as BookingStatusTab)) {
      setActiveTab(queryTab as BookingStatusTab);
    } else if (!queryTab) {
        setActiveTab('Pending');
    }
  }, [queryTab]); 

  // Categorize bookings based on the hook's filtering functions
  const categorizedBookings = useMemo(() => {
    const cancelledBookings = getBookingsByStatus('Cancelled');
    const declinedBookings = getBookingsByStatus('Declined');
    const combinedCancelledBookings = [...cancelledBookings, ...declinedBookings];

    return {
      Pending: getPendingBookings(),
      Approved: getUpcomingBookings(), // Assuming Approved is what's used for upcoming in the UI
      Completed: getCompletedBookings(),
      Canceled: combinedCancelledBookings, // Include both cancelled and declined
      InProgress: bookings.filter(booking => booking.status === 'InProgress'),
    };
  }, [getPendingBookings, getUpcomingBookings, getCompletedBookings, getBookingsByStatus, bookings]);

  const currentBookings: ProviderEnhancedBooking[] = categorizedBookings[activeTab] || [];

  const handleRetry = async () => {
    clearError();
    try {
      await refreshBookings();
    } catch (error) {
      console.error('❌ Failed to retry loading bookings:', error);
    }
  };

  // Show authentication error if not authenticated as provider
  if (!isProviderAuthenticated() && !loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Oops!</h1>
          <p className="text-gray-600 mb-4">
            You need to be logged in as service provider to continue.
          </p>
          <button
            onClick={() => router.push('/provider/login')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Bookings...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error && bookings.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Unable to load bookings</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="space-x-3">
            <button
              onClick={() => router.push('/provider/dashboard')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Back to Dashboard
            </button>
            <button
              onClick={handleRetry}
              className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-2 rounded-lg transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>My Bookings | SRV Provider</title>
        <meta name="description" content="Manage your service bookings" />
      </Head>
      <div className="min-h-screen bg-gray-100 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-20 px-4 py-4">
          <div className="flex items-center">
            <button onClick={() => router.back()} className="text-gray-600 hover:text-gray-800 p-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="flex-grow text-center text-lg font-semibold text-gray-800 -ml-10">My Bookings</h1>
          </div>
        </header>

        {/* Tab Navigation */}
        <div className="bg-white border-b border-gray-200 sticky top-[73px] z-10 px-4">
          <nav className="flex space-x-2 py-3 px-1">
            {TAB_ITEMS.map(tab => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                }}
                className={`flex-1 text-center py-2 px-4 text-sm font-medium transition-colors
                           ${activeTab === tab 
                              ? 'bg-blue-600 text-white rounded-full' 
                              : 'text-gray-500 hover:bg-gray-200 hover:text-gray-700 rounded-full'}`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        <main className="flex-grow overflow-y-auto pb-20">
          <h2 className="text-2xl font-bold text-gray-900 mt-6 mb-4 px-4">{activeTab} Jobs</h2>

          {currentBookings.length > 0 ? (
            <div className="space-y-4 px-4">
              {currentBookings.map(booking => (
                <div 
                  key={booking.id}
                  onClick={() => {
                    if (activeTab === 'InProgress' && booking.status === 'InProgress') {
                      router.push(`/provider/active-service/${booking.id}`);
                    }
                  }}
                  className={`w-full ${activeTab === 'InProgress' ? 'cursor-pointer hover:shadow-lg transition-shadow' : ''}`}
                >
                  <ProviderBookingItemCard 
                      booking={booking}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 px-4">
              <div className="mb-4">
                {activeTab === 'Pending' && (
                  <div className="text-6xl mb-4">⏳</div>
                )}
                {activeTab === 'Approved' && (
                  <div className="text-6xl mb-4">📅</div>
                )}
                {activeTab === 'Completed' && (
                  <div className="text-6xl mb-4">✅</div>
                )}
                {activeTab === 'Canceled' && (
                  <div className="text-6xl mb-4">❌</div>
                )}
                {activeTab === 'InProgress' && (
                  <div className="text-6xl mb-4">🔄</div>
                )}
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No {activeTab.toLowerCase()} bookings
              </h3>
              <p className="text-gray-500 mb-6">
                {activeTab === 'Pending' }
                {activeTab === 'Approved' }
                {activeTab === 'Completed' }
                {activeTab === 'Canceled' }
                {activeTab === 'InProgress' }
              </p>
              {activeTab === 'Pending' && (
                <p className="text-sm text-gray-400">
                  Booking requests will appear here.
                </p>
              )}
              {activeTab === 'Canceled' && (
                <p className="text-sm text-gray-400">
                  Booking cancelled by client will appear here. 
                </p>
              )}
            </div>
          )}
        </main>
        <BottomNavigation />
      </div>
    </>
  );
};

export default ProviderBookingsPage;