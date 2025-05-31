// SRV-ICP-1/ui/components/client/MyBookingsComponent.tsx
import React, { useState, useEffect, useCallback } from 'react';
import styles from 'frontend/ui/components/client/bookings/MyBookingsComponent.module.css';
import { Booking, MOCK_BOOKINGS, BookingStatus } from 'frontend/public/data/bookings'; // Adjust path
import BookingItemCard from 'frontend/ui/components/client/bookings/BookingItemCard';

const bookingStatuses: BookingStatus[] = ['Pending', 'Confirmed', 'Completed', 'Cancelled'];

const MyBookingsComponent: React.FC = () => {
  const [activeStatusTab, setActiveStatusTab] = useState<BookingStatus>('Pending');
  
  // State to hold the bookings. Initialize with a copy of MOCK_BOOKINGS.
  const [userBookings, setUserBookings] = useState<Booking[]>(() => {
    // Deep copy MOCK_BOOKINGS to avoid mutating the original import
    return JSON.parse(JSON.stringify(MOCK_BOOKINGS));
  });

  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);

  // Function to update the status of a booking
  const handleUpdateBookingStatus = useCallback((bookingId: string, newStatus: BookingStatus) => {
    setUserBookings(currentBookings =>
      currentBookings.map(booking =>
        booking.id === bookingId ? { ...booking, status: newStatus, updatedAt: new Date().toISOString() } : booking
      )
    );
    // No need to manually set activeStatusTab here, the filter will update the view.
    // If the user is on "Pending" and cancels an item, it will disappear from that list.
    // If they then click "Cancelled", they will see it there.
  }, []);


  useEffect(() => {
    // Filter bookings based on the active tab and the current userBookings state
    setFilteredBookings(userBookings.filter(booking => booking.status === activeStatusTab));
  }, [activeStatusTab, userBookings]); // Re-filter when tab changes OR userBookings state changes

  return (
    <div className={styles.myBookingsContainer}>
      <div className={styles.header}>
        <h2 className={styles.title}>My Bookings</h2>
      </div>

      <div className={styles.tabsContainer}>
        {bookingStatuses.map(status => (
          <button
            key={status}
            className={`${styles.tabButton} ${activeStatusTab === status ? styles.activeTab : ''}`}
            onClick={() => setActiveStatusTab(status)}
          >
            {status}
          </button>
        ))}
      </div>

      <div className={styles.bookingList}>
        {filteredBookings.length > 0 ? (
          filteredBookings.map(booking => (
            <BookingItemCard 
              key={booking.id} 
              booking={booking} 
              onUpdateBookingStatus={handleUpdateBookingStatus} // <<<< Pass the handler down
            />
          ))
        ) : (
          <p className={styles.noBookingsMessage}>
            No bookings found under "{activeStatusTab}" status.
          </p>
        )}
      </div>
    </div>
  );
};

export default MyBookingsComponent;