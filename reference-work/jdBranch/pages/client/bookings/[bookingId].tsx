import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link'; // For a back button if needed
import { Booking } from '../../../public/data/bookings'; // Adjust path
import ViewBookingDetailsComponent from 'frontend/ui/components/client/bookings/ViewBookingDetailsComponent'; // We'll create this
import styles from '../../../ui/styles/ClientBookingDetailPage.module.css'; 


const ViewBookingPage: React.FC = () => {
  const router = useRouter();
  const { bookingId, data } = router.query; 

  let booking: Booking | null = null;

  if (data && typeof data === 'string') {
    try {
      booking = JSON.parse(data);
    } catch (error) {
      console.error("Failed to parse booking data from query:", error);
    }
  } else if (bookingId) {
    console.log("Booking data not found in query, bookingId:", bookingId);
  }

  return (
    <div className={styles.pageContainer}>
      <Head>
        <title>Booking Details - SRV Client</title>
        {booking && <meta name="description" content={`Details for your booking of ${booking.serviceName}`} />}
      </Head>

      <header className={styles.pageHeader}>
        <button onClick={() => router.back()} className={styles.backButton}>
          &larr;
        </button>
        <h1 className={styles.mainTitle}>Booking Details</h1>
        <div style={{width: '40px'}}></div> {/* Spacer */}
      </header>
      
      <main className={styles.mainContent}>
        {booking ? (
          <ViewBookingDetailsComponent booking={booking} />
        ) : (
          <div className={styles.loadingCard}>
            <p>Loading booking details or booking not found...</p>
            <Link href="/client/my-bookings" legacyBehavior> {/* Assuming MyBookingsComponent is at /client/bookings */}
              <a className={styles.actionButton}>Back to My Bookings</a>
            </Link>
          </div>
        )}
      </main>
    </div>
  );
};

export default ViewBookingPage;