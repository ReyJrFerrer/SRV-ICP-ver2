// SRV-ICP-1/ui/components/client/bookings/ViewBookingDetailsComponent.tsx
import React from 'react';
import { useRouter } from 'next/router';
import { Booking } from '../../../../public/data/bookings'; // Adjust path
import styles from 'frontend/ui/components/client/bookings/ViewBookingDetails.module.css'; // We'll create this

interface ViewBookingDetailsProps {
  booking: Booking;
}

const ViewBookingDetailsComponent: React.FC<ViewBookingDetailsProps> = ({ booking }) => {
  const router = useRouter();

  const handleBookAgain = () => {
    router.push(`/client/book/${booking.serviceSlug}`);
  };

  // Helper to format createdAt date
  const formatBookingCreationDate = (isoString: string) => {
    if (!isoString) return 'N/A';
    try {
        const date = new Date(isoString);
        return date.toLocaleDateString([], { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch (e) {
        return 'Invalid Date';
    }
  };

  return (
    <div className={styles.detailsCard}>
      <div className={styles.statusHeader}>
        <h2>{booking.serviceName}</h2>
        <span className={`${styles.statusBadge} ${styles[booking.status.toLowerCase()]}`}>
          {booking.status}
        </span>
      </div>
      <p className={styles.providerInfo}>Service by: <strong>{booking.providerName}</strong></p>
      <p className={styles.bookedOnInfo}>Booked on: {formatBookingCreationDate(booking.createdAt)}</p>


      <div className={styles.summarySection}>
        <h3>Booking Summary:</h3>
        <p><strong>Service Date:</strong> {booking.bookingDate}</p>
        <p><strong>Time:</strong> {booking.bookingTime || 'N/A'}</p>
        {booking.duration && <p><strong>Duration:</strong> {booking.duration}</p>}
        <p><strong>Location:</strong> {booking.location}</p>
        
        {booking.selectedPackages && booking.selectedPackages.length > 0 && (
          <div className={styles.packagesSection}>
            <strong>Packages:</strong>
            <ul>
              {booking.selectedPackages.map(pkg => <li key={pkg.id}>{pkg.name}</li>)}
            </ul>
          </div>
        )}
        {booking.concerns && <p><strong>Concerns:</strong> {booking.concerns}</p>}
        {booking.priceDisplay && <p className={styles.priceHighlight}><strong>Total Price:</strong> {booking.priceDisplay}</p>}
      </div>

      {(booking.status === 'Completed' || booking.status === 'Cancelled') &&
        <button onClick={handleBookAgain} className={styles.actionButton}>
          Book This Service Again
        </button>
      }
       {/* You might want a "Cancel Booking" button here if status is Pending/Confirmed */}
       {/* Or a "Contact Provider" button */}
    </div>
  );
};

export default ViewBookingDetailsComponent;