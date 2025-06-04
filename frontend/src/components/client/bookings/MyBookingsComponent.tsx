import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { Booking, BookingStatus } from '../../../services/bookingCanisterService';
import BookingItemCard from './BookingItemCard';
import { useBookingManagement } from '../../../hooks/bookingManagement';

// Define the props interface for the component
interface MyBookingsComponentProps {
  bookingManagement?: ReturnType<typeof useBookingManagement>;
}

const bookingStatuses: BookingStatus[] = ['Requested', 'Accepted', 'Completed', 'Cancelled'];

// Empty State Component
interface EmptyBookingStateProps {
  status: BookingStatus;
  onBrowseServices: () => void;
}

const EmptyBookingState: React.FC<EmptyBookingStateProps> = ({ status, onBrowseServices }) => {
  const getEmptyStateConfig = (status: BookingStatus) => {
    switch (status) {
      case 'Requested':
        return {
          icon: '⏳',
          title: 'No pending requests',
          description: "You don't have any booking requests waiting for provider response.",
          showButton: true,
          buttonText: 'Browse Services'
        };
      case 'Accepted':
        return {
          icon: '📅',
          title: 'No confirmed bookings',
          description: "You don't have any confirmed bookings scheduled.",
          showButton: true,
          buttonText: 'Find Services'
        };
      case 'Completed':
        return {
          icon: '✅',
          title: 'No completed bookings',
          description: "You haven't completed any service bookings yet.",
          showButton: true,
          buttonText: 'Book Your First Service'
        };
      case 'Cancelled':
        return {
          icon: '❌',
          title: 'No cancelled bookings',
          description: "You don't have any cancelled bookings.",
          showButton: false,
          buttonText: ''
        };
      default:
        return {
          icon: '📋',
          title: 'No bookings',
          description: "You don't have any bookings in this category.",
          showButton: true,
          buttonText: 'Browse Services'
        };
    }
  };

  const config = getEmptyStateConfig(status);

  return (
    <div className="text-center py-16">
      <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
        <span className="text-4xl">{config.icon}</span>
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-3">{config.title}</h3>
      <p className="text-gray-500 mb-8 max-w-md mx-auto leading-relaxed">
        {config.description}
      </p>
      {config.showButton && (
        <button 
          className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-medium transition-colors shadow-sm hover:shadow-md"
          onClick={onBrowseServices}
        >
          {config.buttonText}
        </button>
      )}
      
      {/* Additional helpful content */}
      <div className="mt-12 pt-8 border-t border-gray-100">
        <h4 className="text-sm font-medium text-gray-700 mb-4">How to get started:</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto text-left">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-green-600 text-sm font-semibold">1</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Browse Services</p>
              <p className="text-xs text-gray-500 mt-1">Explore available services in your area</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-green-600 text-sm font-semibold">2</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Book Service</p>
              <p className="text-xs text-gray-500 mt-1">Choose your preferred time and date</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-green-600 text-sm font-semibold">3</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Track Progress</p>
              <p className="text-xs text-gray-500 mt-1">Monitor your booking status here</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MyBookingsComponent: React.FC<MyBookingsComponentProps> = ({ bookingManagement }) => {
  const [activeStatusTab, setActiveStatusTab] = useState<BookingStatus>('Accepted');
  
  // Use the booking management hook or fallback to internal hook
  const internalBookingManagement = useBookingManagement();
  const {
    bookings,
    loading,
    error,
    refreshing,
    bookingsByStatus,
    updateBookingStatus,
    getBookingCount,
    getStatusColor,
    clearError
  } = bookingManagement || internalBookingManagement;

  // Get filtered bookings for the active tab
  const filteredBookings = bookingsByStatus(activeStatusTab);

  return (
    <div className="w-full">
      {/* Error Display */}
      {error && (
        <div className="mx-4 mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-red-600 text-sm">{error}</span>
            </div>
            <button
              onClick={clearError}
              className="text-red-600 hover:text-red-800 text-sm font-medium"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Refresh indicator */}
      {refreshing && (
        <div className="mx-4 mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-3"></div>
            <span className="text-blue-600 text-sm">Refreshing bookings...</span>
          </div>
        </div>
      )}

      {/* Status Tabs */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-4 py-3">
          <div className="flex space-x-1 overflow-x-auto scrollbar-hide">
            {bookingStatuses.map(status => (
              <button
                key={status}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeStatusTab === status
                    ? getStatusColor(status)
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                onClick={() => setActiveStatusTab(status)}
              >
                {status}
                {getBookingCount(status) > 0 && (
                  <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                    activeStatusTab === status 
                      ? 'bg-white bg-opacity-70' 
                      : 'bg-white'
                  }`}>
                    {getBookingCount(status)}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Booking List */}
      <div className="px-4 py-4 space-y-4">
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-start space-x-3 animate-pulse">
                  <div className="w-15 h-15 bg-gray-200 rounded-lg"></div>
                  <div className="flex-grow space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredBookings.length > 0 ? (
          filteredBookings.map(booking => (
            <BookingItemCard
              key={booking.id}
              booking={booking}
              onUpdateBookingStatus={updateBookingStatus}
            />
          ))
        ) : (
          <EmptyBookingState 
            status={activeStatusTab}
            onBrowseServices={() => window.location.href = '/client/home'}
          />
        )}
      </div>
    </div>
  );
};

export default MyBookingsComponent;
