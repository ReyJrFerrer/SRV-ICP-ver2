import React from 'react';
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
    <div className={`booking-cards grid grid-cols-1 md:grid-cols-2 gap-4 my-6 ${className}`}>
      {/* Pending Requests Card */}
      <div className="booking-card bg-teal-50 border-t-4 border-teal-500 flex flex-col p-5 rounded-lg shadow-md">
        <div className="booking-card-header flex justify-between items-center mb-3">
          <h3 className="font-bold text-teal-800 text-base sm:text-lg">Pending Requests</h3>
          <CalendarDaysIcon className="h-6 w-6 text-teal-600" />
        </div>
        
        <p className="text-teal-700 text-sm mb-4 flex-grow">
          You have <span className="font-bold text-2xl">{pendingRequests}</span> {pendingRequests === 1 ? 'request' : 'requests'} that need your response.
        </p>
        
        <Link href="/provider/bookings?tab=Pending" legacyBehavior>
          <a className="mt-auto flex justify-between items-center text-teal-600 hover:text-teal-700 font-semibold text-sm">
            <span>View Requests</span>
            <ArrowRightIcon className="h-4 w-4" />
          </a>
        </Link>
      </div>
      
      {/* Upcoming Jobs Card */}
      <div className="booking-card bg-green-50 border-t-4 border-green-500 flex flex-col p-5 rounded-lg shadow-md">
        <div className="booking-card-header flex justify-between items-center mb-3">
          <h3 className="font-bold text-green-800 text-base sm:text-lg">Upcoming Jobs</h3>
          <CalendarIcon className="h-6 w-6 text-green-600" />
        </div>
        
        <p className="text-green-700 text-sm mb-4 flex-grow">
          You have <span className="font-bold text-2xl">{upcomingJobs}</span> {upcomingJobs === 1 ? 'service' : 'services'} scheduled.
        </p>
        
        {/* Ensure query param 'Upcoming' matches tab key in bookings.tsx */}
        <Link href="/provider/bookings?tab=Upcoming" legacyBehavior>
          <a className="mt-auto flex justify-between items-center text-green-600 hover:text-green-700 font-semibold text-sm">
            <span>View Schedule</span>
            <ArrowRightIcon className="h-4 w-4" />
          </a>
        </Link>
      </div>
    </div>
  );
};

export default BookingRequestsNextjs;