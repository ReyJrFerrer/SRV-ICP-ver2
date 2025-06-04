import React from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import BottomNavigationNextjs from '../../../components/client/BottomNavigationNextjs';
import MyBookingsComponent from '../../../components/client/bookings/MyBookingsComponent';
import { useBookingManagement } from '../../../hooks/bookingManagement';

const MyBookingsPage: NextPage = () => {
  const bookingManagement = useBookingManagement();

  return (
    <>
      <Head>
        <title>My Bookings - SRV</title>
        <meta name="description" content="View and manage your bookings" />
      </Head>
      
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-4 py-4">
            <h1 className="text-xl font-semibold text-gray-900">My Bookings</h1>
            <p className="text-sm text-gray-600 mt-1">View and manage your service bookings</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="pb-20">
          <MyBookingsComponent bookingManagement={bookingManagement} />
        </div>

        {/* Bottom Navigation */}
        <BottomNavigationNextjs />
      </div>
    </>
  );
};

export default MyBookingsPage;
