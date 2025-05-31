import React, { useState, useEffect, useCallback } from 'react';
import styles from 'frontend/ui/components/client/bookings/MyBookingsComponent.module.css';
import { Booking, MOCK_BOOKINGS, BookingStatus } from 'frontend/public/data/bookings'; 
import BookingItemCard from 'frontend/ui/components/client/bookings/BookingItemCard';

const bookingStatuses: BookingStatus[] = ['Pending', 'Confirmed', 'Completed', 'Cancelled'];

const MyBookingsComponent: React.FC = () => {
  const [activeStatusTab, setActiveStatusTab] = useState<BookingStatus>('Pending');
  
  const [userBookings, setUserBookings] = useState<Booking[]>(() => {
    return JSON.parse(JSON.stringify(MOCK_BOOKINGS));
  });

  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);

  const handleUpdateBookingStatus = useCallback((bookingId: string, newStatus: BookingStatus) => {
    setUserBookings(currentBookings =>
      currentBookings.map(booking =>
        booking.id === bookingId ? { ...booking, status: newStatus, updatedAt: new Date().toISOString() } : booking
      )
    );
  }, []);


  useEffect(() => {
    setFilteredBookings(userBookings.filter(booking => booking.status === activeStatusTab));
  }, [activeStatusTab, userBookings]); 

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
              onUpdateBookingStatus={handleUpdateBookingStatus} 
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