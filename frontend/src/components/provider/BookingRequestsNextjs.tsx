import React, { useState } from 'react';
import { CalendarDaysIcon, CalendarIcon, ArrowRightIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';

interface BookingRequestsProps {
  pendingRequests?: number;
  upcomingJobs?: number;
  className?: string;
}


const BookingRequestsNextjs: React.FC<BookingRequestsProps> = ({ 
  pendingRequests = 0, 
  upcomingJobs = 0,    
  className = '' 
}) => {
  return (
    <div className="booking-cards grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
  {/* Pending Requests Card */}
      <div className="booking-card bg-yellow-200 border-l-4 border-blue-600 flex flex-col p-5 rounded-lg shadow-md">
        <div className="booking-card-header flex justify-between items-center mb-3">
          <h3 className="font-bold text-black text-base sm:text-lg">Pending Requests</h3>
          <CalendarDaysIcon className="h-6 w-6 text-blue-600" />
        </div>
        <p className="text-black text-sm mb-4 flex-grow">
          You have <span className="font-bold text-2xl">{pendingRequests}</span> {pendingRequests === 1 ? 'request' : 'requests'} that need your response.
        </p>
        <Link href="/provider/bookings?tab=Pending" legacyBehavior>
          <a className="mt-auto flex justify-between items-center text-blue-700 hover:text-blue-900 font-semibold text-sm">
            <span>View Requests</span>
            <ArrowRightIcon className="h-4 w-4" />
          </a>
        </Link>
      </div>
      {/* Upcoming Jobs Card */}
      <div className="booking-card bg-blue-600 border-l-4 border-yellow-400 flex flex-col p-5 rounded-lg shadow-md">
        <div className="booking-card-header flex justify-between items-center mb-3">
          <h3 className="font-bold text-white text-base sm:text-lg">Upcoming Jobs</h3>
          <CalendarIcon className="h-6 w-6 text-yellow-300" />
        </div>
        <p className="text-white text-sm mb-4 flex-grow">
          You have <span className="font-bold text-2xl">{upcomingJobs}</span> {upcomingJobs === 1 ? 'service' : 'services'} scheduled.
        </p>
        <Link href="/provider/bookings?tab=Upcoming" legacyBehavior>
          <a className="mt-auto flex justify-between items-center text-yellow-200 hover:text-yellow-400 font-semibold text-sm">
            <span>View Schedule</span>
            <ArrowRightIcon className="h-4 w-4" />
          </a>
        </Link>
      </div>
    </div>
  );
};

export default BookingRequestsNextjs;