import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Booking, BookingStatus, bookingCanisterService } from '../../../services/bookingCanisterService';
import ViewBookingDetailsComponent from '../../../components/client/bookings/ViewBookingDetailsComponent';

const BookingDetailsPage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBooking = async () => {
      if (id && typeof id === 'string') {
        try {
          const fetchedBooking = await bookingCanisterService.getBooking(id);
          setBooking(fetchedBooking);
        } catch (error) {
          console.error('Failed to load booking:', error);
          setBooking(null);
        } finally {
          setLoading(false);
        }
      }
    };

    loadBooking();
  }, [id]);

  const handleUpdateBookingStatus = async (bookingId: string, newStatus: BookingStatus) => {
    try {
      let updatedBooking: Booking | null = null;
      
      switch (newStatus) {
        case 'Cancelled':
          updatedBooking = await bookingCanisterService.cancelBooking(bookingId);
          break;
        case 'Accepted':
          // For acceptance, we'd need a scheduled date - this is simplified
          updatedBooking = await bookingCanisterService.acceptBooking(bookingId, new Date());
          break;
        case 'Declined':
          updatedBooking = await bookingCanisterService.declineBooking(bookingId);
          break;
        case 'InProgress':
          updatedBooking = await bookingCanisterService.startBooking(bookingId);
          break;
        case 'Completed':
          updatedBooking = await bookingCanisterService.completeBooking(bookingId);
          break;
        case 'Disputed':
          updatedBooking = await bookingCanisterService.disputeBooking(bookingId);
          break;
        default:
          console.warn('Unsupported status update:', newStatus);
          return;
      }
      
      if (updatedBooking) {
        setBooking(updatedBooking);
      }
    } catch (error) {
      console.error('Failed to update booking status:', error);
      // You might want to show an error message to the user here
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Booking Not Found</h1>
          <p className="text-gray-600 mb-4">The booking you're looking for doesn't exist.</p>
          <button
            onClick={() => router.push('/client/booking')}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
          >
            Back to My Bookings
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{booking.serviceName} - Booking Details - SRV</title>
        <meta name="description" content={`Booking details for ${booking.serviceName}`} />
      </Head>
      
      <ViewBookingDetailsComponent 
        booking={booking} 
        onUpdateBookingStatus={handleUpdateBookingStatus}
      />
    </>
  );
};

export default BookingDetailsPage;
