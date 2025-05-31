// SRV-ICP-1/ui/components/client/bookings/BookingItemCard.tsx
import React from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { Booking } from '../../../../public/data/bookings'; // Adjust path
import styles from 'frontend/ui/components/client/bookings/BookingItemCard.module.css'; 

interface BookingItemCardProps {
  booking: Booking;
}

const BookingItemCard: React.FC<BookingItemCardProps> = ({ booking }) => {
  const router = useRouter();

  const handleViewBooking = () => {
    router.push({
      pathname: `/client/bookings/${booking.id}`, // Navigate to the dynamic page
      query: { data: JSON.stringify(booking) }, // Pass the whole booking object
    });
  };

  const handleBookAgain = () => {
    router.push(`/client/book/${booking.serviceSlug}`);
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
          View Details {/* Changed from View Booking for clarity */}
        </button>
        {(booking.status === 'Completed' || booking.status === 'Cancelled') && // Only show for completed/cancelled
            <button onClick={handleBookAgain} className={styles.bookAgainButton}>
             Book Again
            </button>
        }
      </div>
    </div>
  );
};

export default BookingItemCard;