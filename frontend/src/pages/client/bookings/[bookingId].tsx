import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeftIcon, CalendarDaysIcon, MapPinIcon, CurrencyDollarIcon, UserCircleIcon, ChatBubbleLeftEllipsisIcon, XCircleIcon, ArrowPathIcon, ClockIcon, InformationCircleIcon } from '@heroicons/react/24/solid';
import { StarIcon } from '@heroicons/react/24/solid';

import { Order, OrderStatus } from 'frontend/assets/types/order/order';
import { SERVICES } from 'frontend/assets/services';
import { SERVICE_PROVIDERS } from 'frontend/assets/serviceProviders';
import { adaptServiceData } from 'frontend/src/utils/serviceDataAdapter';
import BottomNavigation from '@app/components/client/BottomNavigationNextjs';

const ClientBookingDetailPage: React.FC = () => {
  const router = useRouter();
  const { bookingId, data: bookingDataString } = router.query;
  const [booking, setBooking] = useState<Order | null>(null);
  const [serviceName, setServiceName] = useState<string>('Loading...');
  const [providerName, setProviderName] = useState<string>('Loading...');
  const [serviceSlug, setServiceSlug] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let foundBooking: Order | undefined;
    if (bookingDataString && typeof bookingDataString === 'string') {
      try {
        foundBooking = JSON.parse(bookingDataString) as Order;
      } catch (e) {
        console.error("Failed to parse booking data from query", e);
      }
    }
    
    if (!foundBooking && bookingId && typeof bookingId === 'string') {
          const { ORDERS } = require('frontend/assets/orders'); 
      foundBooking = ORDERS.find((o: Order) => o.id === bookingId);
    }

    if (foundBooking) {
      setBooking(foundBooking);
      const service = SERVICES.find(s => s.id === foundBooking?.serviceId);
      const provider = SERVICE_PROVIDERS.find(p => p.id === foundBooking?.providerId);
      setServiceName(service?.title || service?.name || 'Service Unknown');
      setProviderName(provider ? `${provider.firstName} ${provider.lastName}` : 'Provider Unknown');
      setServiceSlug(service?.slug || null);
    }
    setIsLoading(false);
  }, [bookingId, bookingDataString]);

  const handleCancelBooking = () => {
    if (!booking) return;
    if (window.confirm(`Are you sure you want to cancel your booking for "${serviceName}"?`)) {
      console.log(`Mock: Cancelling booking ${booking.id}`);
      alert(`Booking for "${serviceName}" has been requested for cancellation.`);
      setBooking(prev => prev ? {...prev, status: 'CANCELLED' as OrderStatus, updatedAt: new Date()} : null);
    }
  };

  const handleContactProvider = () => {
    if (!booking) return;
        alert(`Mock: Contacting provider ${providerName}. (Phone: ${SERVICE_PROVIDERS.find(p=>p.id === booking.providerId)?.phoneNumber || 'N/A'})`);
  };

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleString([], { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };
  
  const getStatusPillStyle = (status: OrderStatus) => {
        switch (status?.toUpperCase()) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-700';
      case 'CONFIRMED': return 'bg-green-100 text-green-700';
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-700';
      case 'COMPLETED': return 'bg-indigo-100 text-indigo-700';
      case 'CANCELLED': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };


  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
         <Head><title>Booking Not Found</title></Head>
        <h1 className="text-xl font-semibold text-red-600 mb-4">Booking Not Found</h1>
        <Link href="/client/bookings" legacyBehavior>
          <a className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Back to My Bookings
          </a>
        </Link>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Booking: {serviceName} | SRV Client</title>
      </Head>
      <div className="min-h-screen bg-gray-100 pb-20 md:pb-0">
        <header className="bg-white shadow-sm sticky top-0 z-30">
          <div className="container mx-auto px-4 py-3 flex items-center">
            <button onClick={() => router.back()} className="p-2 rounded-full hover:bg-gray-100 mr-2">
              <ArrowLeftIcon className="h-5 w-5 text-gray-700" />
            </button>
            <h1 className="text-lg font-semibold text-slate-800 truncate">Booking Details</h1>
          </div>
        </header>

        <main className="container mx-auto p-4 sm:p-6 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold text-slate-800">{serviceName}</h2>
              <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusPillStyle(booking.status)}`}>
                {booking.status.replace('_', ' ')}
              </span>
            </div>
            <p className="text-sm text-gray-500 mb-1 flex items-center">
              <UserCircleIcon className="h-4 w-4 mr-1.5 text-gray-400"/>
              Provider: <span className="font-medium text-gray-700 ml-1">{providerName}</span>
            </p>
            <p className="text-sm text-gray-500 mb-4">Booking ID: {booking.id.toUpperCase().slice(-8)}</p>

            <div className="border-t border-gray-200 pt-4 space-y-3 text-sm">
              <div className="flex items-start"><CalendarDaysIcon className="h-5 w-5 mr-2 text-blue-500 mt-0.5 flex-shrink-0"/><span><strong className="font-medium text-gray-700">Scheduled:</strong> {formatDate(booking.schedule.startDate)}</span></div>
              {booking.schedule.endDate && <div className="flex items-start"><ClockIcon className="h-5 w-5 mr-2 text-blue-500 mt-0.5 flex-shrink-0"/><span><strong className="font-medium text-gray-700">Est. End:</strong> {formatDate(booking.schedule.endDate)}</span></div>}
              <div className="flex items-start"><MapPinIcon className="h-5 w-5 mr-2 text-blue-500 mt-0.5 flex-shrink-0"/><span><strong className="font-medium text-gray-700">Location:</strong> {booking.location.address}</span></div>
              <div className="flex items-start"><CurrencyDollarIcon className="h-5 w-5 mr-2 text-green-500 mt-0.5 flex-shrink-0"/><span><strong className="font-medium text-gray-700">Payment:</strong> ₱{booking.payment.amount.toFixed(2)} via {booking.payment.method} ({booking.payment.status})</span></div>
              {/* Add more details like packages, concerns if they exist in your Order type and are populated */}
              {booking.completion?.notes && <div className="flex items-start"><InformationCircleIcon className="h-5 w-5 mr-2 text-gray-500 mt-0.5 flex-shrink-0"/><span><strong className="font-medium text-gray-700">Completion Notes:</strong> {booking.completion.notes}</span></div>}

            </div>
          </div>
          
          {/* Action Buttons */}
            <div className="bg-white p-4 rounded-xl shadow-lg space-y-3 sm:space-y-0 sm:flex sm:space-x-3">
              <button
                onClick={handleContactProvider}
                className="w-full sm:flex-1 flex items-center justify-center bg-slate-600 hover:bg-slate-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors text-sm"
              >
                <ChatBubbleLeftEllipsisIcon className="h-5 w-5 mr-2" /> Contact Provider
              </button>

              {(booking.status === 'PENDING' || booking.status === 'CONFIRMED') && (
                <button
                  onClick={handleCancelBooking}
                  className="w-full sm:flex-1 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white font-medium py-2.5 px-4 rounded-lg transition-colors text-sm"
                >
                  <XCircleIcon className="h-5 w-5 mr-2" /> Cancel Booking
                </button>
              )}

              {(booking.status === 'COMPLETED' || booking.status === 'CANCELLED') && (
                <>
                  {serviceSlug && (
                    <Link href={`/client/book/${serviceSlug}`} legacyBehavior>
                      <a className="w-full sm:flex-1 flex items-center justify-center bg-green-500 hover:bg-green-600 text-white font-medium py-2.5 px-4 rounded-lg transition-colors text-sm text-center">
                        <ArrowPathIcon className="h-5 w-5 mr-2" /> Book Again
                      </a>
                    </Link>
                  )}

                  {/* New Rate Provider Button */}
                  <Link
                    href={{
                      pathname: '/client/bookings-ratings',
                      query: {
                        providerName: providerName,
                        bookingId: booking.id
                      },
                    }}
                    legacyBehavior
                  >
                    <a className="w-full sm:flex-1 flex items-center justify-center bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2.5 px-4 rounded-lg transition-colors text-sm text-center">
                      <StarIcon className="h-5 w-5 mr-2" /> Rate Provider
                    </a>
                  </Link>
                </>
              )}
            </div>

        </main>
        <div className="md:hidden"> {/* Show BottomNavigation only on smaller screens */}
            <BottomNavigation />
        </div>
      </div>
    </>
  );
};

export default ClientBookingDetailPage;