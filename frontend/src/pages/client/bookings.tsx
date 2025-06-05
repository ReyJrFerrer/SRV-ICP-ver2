import React, { useState, useMemo, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import BottomNavigation from '@app/components/client/BottomNavigationNextjs';
import ClientBookingItemCard from '@app/components/client/ClientBookingItemCard';
import { Order, OrderStatus } from '../../../assets/types/order/order';
import { ORDERS as mockClientOrders } from '../../../assets/orders';
import { ArrowLeftIcon, ClipboardDocumentListIcon } from '@heroicons/react/24/solid';

type BookingStatusTab = 'ALL' | 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
const TAB_ITEMS: BookingStatusTab[] = ['ALL', 'PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];

const ClientBookingsPage: React.FC = () => {
  const router = useRouter();
  const { tab: queryTab } = router.query;

  const [activeTab, setActiveTab] = useState<BookingStatusTab>('ALL');
  const [clientBookings, setClientBookings] = useState<Order[]>([]);

  useEffect(() => {
    const validInitialBookings = (mockClientOrders || []).filter(
      b => b && typeof b.id !== 'undefined' && typeof b.status !== 'undefined' && typeof b.serviceId !== 'undefined'
    ) as Order[];
    setClientBookings(JSON.parse(JSON.stringify(validInitialBookings)));
  }, []);
  
  useEffect(() => {
    let targetTab: BookingStatusTab = 'ALL';
    let shouldRedirect = false;
    let redirectTabQuery = 'all';

    if (queryTab) {
      let singleQueryTab: string | undefined = undefined;
      if (typeof queryTab === 'string') {
        singleQueryTab = queryTab;
      } else if (Array.isArray(queryTab) && queryTab.length > 0) {
        singleQueryTab = queryTab[0];
      }

      if (singleQueryTab) {
        const upperCaseQueryTab = singleQueryTab.toUpperCase() as BookingStatusTab;
        if (TAB_ITEMS.includes(upperCaseQueryTab)) {
          targetTab = upperCaseQueryTab;
        } else {
          shouldRedirect = true;
        }
      } else {
        if (queryTab !== undefined) shouldRedirect = true;
      }
    }

    if (activeTab !== targetTab) {
      setActiveTab(targetTab);
    }

    if (shouldRedirect && (typeof queryTab !== 'string' || queryTab.toLowerCase() !== redirectTabQuery)) {
      router.push({ pathname: '/client/bookings', query: { tab: redirectTabQuery } }, undefined, { shallow: true });
    }
  }, [queryTab, router, activeTab]);

  const filteredBookings = useMemo(() => {
    if (!Array.isArray(clientBookings)) {
        console.error("clientBookings is not an array!", clientBookings);
        return [];
    }

    const validClientBookings = clientBookings.filter(booking => {
        if (!booking) {
            console.warn("Undefined/null booking object found in clientBookings and removed before tab filtering.");
            return false;
        }
        if (typeof booking.status !== 'string') {
            console.warn("Booking object missing or has invalid status, removed before tab filtering:", booking);
            return false;
        }
              return true;
    });

    if (activeTab === 'ALL') {
      return validClientBookings;
    }
    return validClientBookings.filter(booking => booking.status.toUpperCase() === activeTab);
  }, [activeTab, clientBookings]);

  const handleCancelBookingOnListPage = (bookingId: string) => {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      setClientBookings(prevBookings =>
        prevBookings.map(b =>
          b.id === bookingId ? { ...b, status: 'CANCELLED' as OrderStatus, updatedAt: new Date() } : b
        ).filter(Boolean) as Order[] 
      );
      alert(`Mock: Booking ${bookingId} has been marked as CANCELLED.`);
    }
  };

  return (
    <>
      <Head>
        <title>My Bookings | SRV Client</title>
        <meta name="description" content="View and manage your service bookings." />
      </Head>
      <div className="min-h-screen bg-gray-100 flex flex-col">
        {/* Header remains the same */}
        <header className="bg-white shadow-sm sticky top-0 z-20 px-4 py-3">
          <div className="container mx-auto flex items-center">
             <button 
                onClick={() => router.push('/client/home')}
                className="p-2 rounded-full hover:bg-gray-100 mr-2 transition-colors md:hidden"
                aria-label="Back to Home"
            >
                <ArrowLeftIcon className="h-5 w-5 text-gray-700" />
            </button>
            <h1 className="text-xl font-semibold text-slate-800 text-center flex-grow md:text-left">My Bookings</h1>
          </div>
        </header>

        {/* Tabs remain the same */}
        <div className="bg-white border-b border-gray-200 sticky top-[57px] z-10 overflow-x-auto whitespace-nowrap hide-scrollbar">
          <nav className="flex space-x-1 p-1.5 sm:p-2 justify-start sm:justify-around">
            {TAB_ITEMS.map(tab => (
              <button
                key={tab}
                onClick={() => {
                  router.push({ pathname: '/client/bookings', query: { tab: tab.toLowerCase() } }, undefined, { shallow: true });
                }}
                className={`px-3 py-2 text-xs sm:text-sm font-medium rounded-md flex-shrink-0 transition-colors duration-150
                            ${activeTab === tab 
                                ? 'bg-blue-600 text-white shadow-sm' 
                                : 'text-gray-500 hover:bg-gray-200 hover:text-slate-700'}`}
              >
                {tab.replace('_', ' ')} ({tab === 'ALL' ? clientBookings.filter(Boolean).length : clientBookings.filter(b => b && b.status && b.status.toUpperCase() === tab).length})
              </button>
            ))}
          </nav>
        </div>

        <main className="flex-grow container mx-auto p-3 sm:p-4 pb-20">
          {filteredBookings.length > 0 ? (
            <div className="space-y-4 md:space-y-6">
              {filteredBookings.map(booking => (
                // The booking object passed here should now be guaranteed to be valid
                <ClientBookingItemCard 
                    key={booking.id} // This assumes booking.id is always present
                    booking={booking}
                    onCancelBooking={handleCancelBookingOnListPage}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-lg shadow mt-4">
              <ClipboardDocumentListIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No bookings found in the "{activeTab.replace('_', ' ')}" category.</p>
            </div>
          )}
        </main>
        <BottomNavigation />
      </div>
      {/* ... style jsx global ... */}
      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
      `}</style>
    </>
  );
};

export default ClientBookingsPage;