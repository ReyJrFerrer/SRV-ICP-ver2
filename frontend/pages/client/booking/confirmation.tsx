import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styles from 'frontend/ui/components/client/ClientBookingConfirmationPage.module.css'; // We'll create this

interface BookingDetails {
  serviceName: string;
  providerName: string;
  selectedPackages: { id: string; name: string }[];
  concerns: string;
  bookingType: string;
  date: string;
  time: string;
}

const BookingConfirmationPage = () => {
  const router = useRouter();
  const { details } = router.query;

  let bookingDetails: BookingDetails | null = null;

  if (details && typeof details === 'string') {
    try {
      bookingDetails = JSON.parse(details);
    } catch (error) {
      console.error("Failed to parse booking details:", error);
    }
  }

  return (
    <div className={styles.pageContainer}>
      <Head>
        <title>Booking Confirmed - SRV Client</title>
        <meta name="description" content="Your booking request has been sent." />
      </Head>

      {/* Header - Can be simpler for this page or match the app's header style */}
      <header className={styles.pageHeader}>
        <h1 className={styles.mainTitle}>Booking Request Sent!</h1>
      </header>
      
      <main className={styles.mainContent}>
        {bookingDetails ? (
          <div className={styles.confirmationCard}>
            <div className={styles.successIcon}>🎉</div> {/* Or a checkmark icon */}
            <h2>Your request has been sent to {bookingDetails.providerName}!</h2>
            <p className={styles.subMessage}>
              Please wait for a notification regarding the status of your booking.
            </p>

            <div className={styles.detailsSection}>
              <h3>Booking Summary:</h3>
              <p><strong>Service:</strong> {bookingDetails.serviceName}</p>
              {bookingDetails.selectedPackages && bookingDetails.selectedPackages.length > 0 && (
                <div>
                  <strong>Packages:</strong>
                  <ul>
                    {bookingDetails.selectedPackages.map(pkg => <li key={pkg.id}>{pkg.name}</li>)}
                  </ul>
                </div>
              )}
              <p><strong>Concerns:</strong> {bookingDetails.concerns}</p>
              <p><strong>Type:</strong> {bookingDetails.bookingType === 'sameday' ? 'Same Day' : 'Scheduled'}</p>
              <p><strong>Date:</strong> {bookingDetails.date}</p>
              <p><strong>Time:</strong> {bookingDetails.time}</p>
            </div>

            <Link href="/client" legacyBehavior>
              <a className={styles.homeButton}>Back to Home</a>
            </Link>
          </div>
        ) : (
          <div className={styles.confirmationCard}>
            <p>Loading booking details or an error occurred.</p>
            <Link href="/client" legacyBehavior>
              <a className={styles.homeButton}>Back to Home</a>
            </Link>
          </div>
        )}
      </main>
    </div>
  );
};

export default BookingConfirmationPage;