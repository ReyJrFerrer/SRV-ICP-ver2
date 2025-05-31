import React from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { Booking, BookingStatus } from '../../../../public/data/bookings'; 
import { SERVICES } from '../../../../public/data/services';
import styles from 'frontend/ui/components/client/bookings/BookingItemCard.module.css'; 

interface BookingItemCardProps {
  booking: Booking;
   onUpdateBookingStatus: (bookingId: string, newStatus: BookingStatus) => void; 
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
    if (window.confirm(`Are you sure you want to cancel this booking for "${booking.serviceName}"?`)) {
      onUpdateBookingStatus(booking.id, 'Cancelled'); 
    }
  };

  const handleContactProvider = () => {
    // Find the service details to get contact info
    const service = SERVICES.find(s => s.id === booking.serviceId);

    if (service) {
      let contactMessage = `Contact details for ${booking.providerName}:\n`;
      let hasContactInfo = false;

      if (service.contactEmail) {
        contactMessage += `Email: ${service.contactEmail}\n`;
        hasContactInfo = true;
      }
      if (service.contactPhone) {
        contactMessage += `Phone: ${service.contactPhone}\n`;
        hasContactInfo = true;
      }

      if (!hasContactInfo) {
        contactMessage = `No direct contact information available for ${booking.providerName}. You may try reaching out through general support.`;
      }
      alert(contactMessage); // For a better UX, consider using a modal dialog here.
    } else {
      alert("Could not find service provider details.");
    }
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
              Contact Details
            </button>
            <button onClick={handleBookAgain} className={styles.bookAgainButton}>
             Book Again
            </button>
          </>
        )}

        {(booking.status === 'Pending') && (
          <>
            <button onClick={handleContactProvider} className={styles.contactButton}>
              Contact Details
            </button>
            <button onClick={handleCancelBooking} className={styles.cancelButton}>
             Cancel Booking
            </button>
          </>
        )}

        {(booking.status === 'Confirmed') && (
          <>
            <button onClick={handleContactProvider} className={styles.contactButton}>
              Contact Details
            </button>
          </>
        )}

      </div>
    </div>
  );
};

export default BookingItemCard;