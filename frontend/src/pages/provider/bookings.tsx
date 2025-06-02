import React, { useState, useMemo } from 'react';
import Head from 'next/head';
import BottomNavigation from '@app/components/provider/BottomNavigationNextjs';
import ProviderBookingItemCard from '@app/components/provider/ProviderBookingItemCard';

import { PROVIDER_ORDERS, PROVIDER_BOOKING_REQUESTS } from '../../../assets/providerOrders';
import { ProviderOrder as ProviderOrderType } from '../../../assets/types/provider/provider-order';

type BookingStatusTab = 'Pending' | 'Upcoming' | 'Completed' | 'Cancelled';


const ProviderBookingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<BookingStatusTab>('Pending');
  
  const categorizedBookings = useMemo(() => {
    const now = new Date();

    const pending = PROVIDER_BOOKING_REQUESTS.map(req => ({ ...req, status: 'PENDING' as const, effectiveStatus: 'Pending' as BookingStatusTab }));
    
    const upcoming = PROVIDER_ORDERS.filter(
      order => order.status === 'CONFIRMED' && new Date(order.scheduledStartTime) >= now
    ).map(order => ({ ...order, effectiveStatus: 'Upcoming' as BookingStatusTab }));
    
    const completed = PROVIDER_ORDERS.filter(
      order => order.status === 'COMPLETED'
    ).map(order => ({ ...order, effectiveStatus: 'Completed' as BookingStatusTab }));

    const cancelled = PROVIDER_ORDERS.filter(
      order => order.status === 'CANCELLED'
    ).map(order => ({ ...order, effectiveStatus: 'Cancelled' as BookingStatusTab }));

    return {
      Pending: pending,
      Upcoming: upcoming,
      Completed: completed,
      Cancelled: cancelled,
    };
  }, []);

  const currentBookings: ProviderOrderType[] = (categorizedBookings[activeTab] || []) as ProviderOrderType[];


  const tabItems: BookingStatusTab[] = ['Pending', 'Upcoming', 'Completed', 'Cancelled']; 

  return (
    <>
      <Head>
        <title>My Bookings | SRV Provider</title>
        <meta name="description" content="Manage your service bookings" />
      </Head>
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <header className="bg-white shadow-sm sticky top-0 z-20 px-4 py-3">
          <h1 className="text-xl font-semibold text-gray-800 text-center">My Bookings</h1>
        </header>

        <div className="bg-white border-b border-gray-200 sticky top-[57px] z-10"> 
          <nav className="flex space-x-1 sm:space-x-2 p-1 sm:p-2 justify-around">
            {tabItems.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-2 text-xs sm:text-sm font-medium rounded-md flex-grow text-center transition-colors
                            ${activeTab === tab 
                                ? 'bg-blue-600 text-white shadow-sm' 
                                : 'text-gray-500 hover:bg-gray-200 hover:text-gray-700'}`}
              >
                {tab} ({categorizedBookings[tab]?.length || 0})
              </button>
            ))}
          </nav>
        </div>

        <main className="flex-grow overflow-y-auto p-3 sm:p-4 pb-20">
          {currentBookings.length > 0 ? (
            // Responsive Grid Layout
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {currentBookings.map(booking => (
                <ProviderBookingItemCard 
                    key={booking.id} 
                    booking={booking}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">No bookings in the "{activeTab}" category.</p>
            </div>
          )}
        </main>
        <BottomNavigation />
      </div>
    </>
  );
};

export default ProviderBookingsPage;