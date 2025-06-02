import React, { useState, useEffect, useMemo } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { 
    ArrowLeftIcon, 
    ClockIcon, 
    UserIcon, 
    MapPinIcon, 
    CalendarIcon, 
    CurrencyDollarIcon, 
    CameraIcon, 
    CheckCircleIcon, 
    PaperAirplaneIcon, 
    PhoneIcon 
} from '@heroicons/react/24/solid'; 

import BottomNavigation from '@app/components/provider/BottomNavigationNextjs';
import { PROVIDER_ORDERS } from '../../../../assets/providerOrders'; 
import { ProviderOrder as ProviderOrderType } from '../../../../assets/types/provider/provider-order';
import { Order } from '../../../../assets/types/order/order'; 

const formatDuration = (seconds: number): string => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};

const ActiveServicePage: React.FC = () => {
   const router = useRouter();
  const { bookingId, startTime: startTimeParam } = router.query;
  const [booking, setBooking] = useState<ProviderOrderType | null>(null);
  const [actualStartTime, setActualStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (bookingId && typeof bookingId === 'string') {
      const foundBooking = PROVIDER_ORDERS.find(b => b.id === bookingId);
      if (foundBooking) {
        setBooking(foundBooking);
        if (typeof startTimeParam === 'string' && !foundBooking.actualStartTime) {
          setActualStartTime(new Date(startTimeParam));
        } else if (foundBooking.actualStartTime) {
          setActualStartTime(new Date(foundBooking.actualStartTime));
        } else {
          setActualStartTime(new Date()); 
        }
      }
      setLoading(false);
    }
  }, [bookingId, startTimeParam]);

  useEffect(() => {
    let timerInterval: NodeJS.Timeout;
    if (actualStartTime) {
      timerInterval = setInterval(() => {
        const now = new Date();
        const diffSeconds = Math.floor((now.getTime() - actualStartTime.getTime()) / 1000);
        setElapsedTime(diffSeconds > 0 ? diffSeconds : 0);
      }, 1000);
    }
    return () => clearInterval(timerInterval);
  }, [actualStartTime]);

   const handleMarkCompleted = () => {
    if (!booking) return;
    console.log(`Proceeding to complete and record payment for booking: ${booking.id}`);
    router.push(`/provider/complete-service/${booking.id}`);
  };
 const handleUploadEvidence = () => { alert('Upload evidence functionality to be implemented.'); };
  const handleContactClient = () => { alert(`Contact client: ${booking?.clientContact}`); };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div></div>;
  }
  if (!booking) {
    return <div className="min-h-screen flex items-center justify-center text-red-500 p-4 text-center">Booking not found or an error occurred.</div>;
  }

  const orderDetails: Order | undefined = booking.order;
  const price = booking.finalPrice && booking.finalPrice > 0 ? booking.finalPrice : booking.quotedPrice;
  const priceLabel = booking.finalPrice && booking.finalPrice > 0 && booking.finalPrice !== booking.quotedPrice 
    ? "Final Price" 
    : "Quoted Price";

  return (
    <>
      <Head>
        <title>Active Service: {booking.serviceTitle} | SRV Provider</title>
      </Head>
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <header className="bg-white shadow-sm sticky top-0 z-20 px-4 py-3">
          <div className="container mx-auto flex items-center">
            <button onClick={() => router.back()} className="p-2 rounded-full hover:bg-gray-100 mr-2 transition-colors" aria-label="Go back">
              <ArrowLeftIcon className="h-5 w-5 text-gray-700" />
            </button>
            <h1 className="text-xl font-semibold text-gray-800 truncate">Service In Progress</h1>
          </div>
        </header>

        <main className="flex-grow container mx-auto p-4 sm:p-6 space-y-6 pb-20">
          {/* Timer Section - Prominent at the top */}
          <section className="bg-white p-6 rounded-xl shadow-lg text-center">
            <ClockIcon className="h-12 w-12 sm:h-16 sm:h-16 text-blue-500 mx-auto mb-2" />
            <p className="text-sm text-gray-500">Elapsed Time</p>
            <p className="text-3xl sm:text-4xl font-bold text-gray-800 tabular-nums">{formatDuration(elapsedTime)}</p>
            {actualStartTime && <p className="text-xs text-gray-400 mt-1">Started: {actualStartTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>}
          </section>

          {/* Details and Actions Section - Becomes two-column on wider screens */}
          <div className="md:flex md:gap-6 lg:gap-8">
            {/* Left Column: Booking Details */}
            <section className="bg-white p-4 sm:p-6 rounded-xl shadow-lg md:flex-1 w-full">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-200">
                {booking.serviceTitle}
              </h2>
              <div className="space-y-3 text-sm text-gray-700">
                <div className="flex items-center">
                  <UserIcon className="h-5 w-5 mr-2.5 text-gray-400 flex-shrink-0" />
                  Client: <span className="font-medium text-gray-800 ml-1">{booking.clientName}</span>
                </div>
                {booking.clientContact && (
                  <div className="flex items-center">
                    <PhoneIcon className="h-5 w-5 mr-2.5 text-gray-400 flex-shrink-0" />
                    Contact: <a href={`tel:${booking.clientContact}`} className="font-medium text-blue-600 hover:underline ml-1">{booking.clientContact}</a>
                  </div>
                )}
                <div className="flex items-center">
                  <CalendarIcon className="h-5 w-5 mr-2.5 text-gray-400 flex-shrink-0" />
                  Scheduled: <span className="font-medium text-gray-800 ml-1">{new Date(booking.scheduledStartTime).toLocaleString([], { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div className="flex items-start">
                  <MapPinIcon className="h-5 w-5 mr-2.5 text-gray-400 flex-shrink-0 mt-0.5" />
                  Location: <span className="font-medium text-gray-800 ml-1 break-words">{booking.location.address}</span>
                </div>
                {price !== undefined && (
                  <div className="flex items-center">
                    <CurrencyDollarIcon className="h-5 w-5 mr-2.5 text-gray-400 flex-shrink-0" />
                    {priceLabel}: <span className="font-medium text-green-600 ml-1">₱{price?.toFixed(2)}</span>
                  </div>
                )}
              </div>
            </section>

            {/* Right Column: Actions */}
            <section className="bg-white p-4 sm:p-6 rounded-xl shadow-lg mt-6 md:mt-0 md:w-auto lg:w-1/3 xl:w-1/4 md:max-w-xs"> {/* Max width for action column */}
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={handleUploadEvidence}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  <CameraIcon className="h-5 w-5"/> Upload Evidence
                </button>
                <button
                  onClick={handleContactClient}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  <PaperAirplaneIcon className="h-5 w-5"/> Contact Client
                </button>
                {/* Consider adding "Report Issue" button here if applicable */}
                <button
                  onClick={handleMarkCompleted}
                  className="w-full px-4 py-3 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 mt-2"
                >
                  <CheckCircleIcon className="h-5 w-5"/> Mark as Completed
                </button>
              </div>
            </section>
          </div>
        </main>
        <div className="lg:hidden"> <BottomNavigation /> </div> {/* BottomNav only on smaller screens */}
      </div>
    </>
  );
};

export default ActiveServicePage;