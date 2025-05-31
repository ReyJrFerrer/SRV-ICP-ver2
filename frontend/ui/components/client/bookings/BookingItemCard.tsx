import React from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { Booking, BookingStatus } from '../../../../public/data/bookings'; 
import styles from 'frontend/ui/components/client/bookings/BookingItemCard.module.css'; 

interface BookingItemCardProps {
  booking: Booking;
   onUpdateBookingStatus: (bookingId: string, newStatus: BookingStatus) => void; // <<<< NEW PROP
}

const BookingItemCard: React.FC<BookingItemCardProps> = ({ booking,onUpdateBookingStatus }) => {
  const router = useRouter();

  const handleViewBooking = () => {
    router.push({
      pathname: `/client/bookings/${booking.id}`, 
      query: { data: JSON.stringify(booking) }, 
    });
  };

  const handleBookAgain = () => {
    router.push(`/client/book/${booking.serviceSlug}`);
  };

    const handleCancelBooking = () => {
    // Confirm with the user before cancelling
    if (window.confirm(`Are you sure you want to cancel this booking for "${booking.serviceName}"?`)) {
      onUpdateBookingStatus(booking.id, 'Cancelled'); // <<<< CALL THE PROP FUNCTION
    }
  };

   const handleContactProvider = () => {
    alert(`Contact provider: ${booking.providerName}. (Implement contact logic)`);
    console.log("Contacting provider for booking:", booking.id);
  };

  return (
     <div className={styles.card}>
      <div className={styles.cardTopRow}>
        <div className={styles.serviceImageContainer}>
          <Image 
            src={booking.serviceImage || '/images/default-placeholder.png'} 
            alt={booking.serviceName} 
            width={60} 
            height={60} 
            className={styles.serviceImage}
            objectFit="cover"
          />
        </div>
        <div className={styles.serviceInfo}>
          <h3 className={styles.serviceName}>{booking.serviceName}</h3>
          <p className={styles.providerName}>by {booking.providerName}</p>
        </div>
        <span className={`${styles.statusBadge} ${styles[booking.status.toLowerCase()]}`}>
          {booking.status}
        </span>
      </div>

      <div className={styles.detailsGrid}>
        <div className={styles.detailItem}>
          <span className={styles.detailIcon}>📅</span>
          <span>{booking.bookingDate} - {booking.bookingTime}</span>
        </div>
        {booking.duration && (
          <div className={styles.detailItem}>
            <span className={styles.detailIcon}>⏱️</span>
            <span>Duration: {booking.duration}</span>
          </div>
        )}
        <div className={styles.detailItem}>
          <span className={styles.detailIcon}>📍</span>
          <span>{booking.location}</span>
        </div>
        {booking.priceDisplay && (
          <div className={styles.detailItem}>
            <span className={styles.detailIcon}>💰</span>
            <span>{booking.priceDisplay}</span>
          </div>
        )}
      </div>
      
        <div className={styles.actions}>
        <button onClick={handleViewBooking} className={styles.viewButton}>
          View Details
        </button>

        {(booking.status === 'Completed' || booking.status === 'Cancelled') && (
          <>
            <button onClick={handleContactProvider} className={styles.contactButton}>
              Contact Provider
            </button>
            <button onClick={handleBookAgain} className={styles.bookAgainButton}>
             Book Again
            </button>
          </>
        )}

        {(booking.status === 'Pending') && (
          <>
            <button onClick={handleContactProvider} className={styles.contactButton}>
              Contact Provider
            </button>
            <button onClick={handleCancelBooking} className={styles.cancelButton}>
             Cancel Booking
            </button>
          </>
        )}

        {(booking.status === 'Confirmed') && (
          <>
            <button onClick={handleContactProvider} className={styles.contactButton}>
              Contact Provider
            </button>
          </>
        )}

      </div>
    </div>
  );
};

export default BookingItemCard;