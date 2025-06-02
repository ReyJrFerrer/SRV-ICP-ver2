import React from 'react';
import { 
  CalendarDaysIcon, 
  CalendarIcon, 
  ArrowRightIcon 
} from '@heroicons/react/24/solid';
import Link from 'next/link';

// Define local interface
interface ServiceProvider {
  id: string;
  // Other properties not used directly in this component
  [key: string]: any;
}

interface BookingRequestsProps {
  provider: ServiceProvider;
  pendingRequests?: number;
  upcomingJobs?: number;
  className?: string;
}

const BookingRequestsNextjs: React.FC<BookingRequestsProps> = ({ 
  provider,
  pendingRequests = 2,
  upcomingJobs = 1, 
  className = '' 
}) => {
  return (
    <div className={`booking-cards ${className}`}>
      {/* Pending Requests Card */}
      <div className="booking-card bg-teal-50">
        <div className="booking-card-header">
          <h3 className="font-bold text-teal-800">Pending Requests</h3>
          <CalendarDaysIcon className="h-6 w-6 text-teal-600" />
        </div>
        
        <p className="text-teal-700 mb-4">
          You have <span className="font-bold">{pendingRequests}</span> {pendingRequests === 1 ? 'request' : 'requests'} that need your response
        </p>
        
        <Link href="/provider/bookings?tab=pending" className="flex justify-between items-center text-teal-700 font-semibold">
          <span>View Requests</span>
          <ArrowRightIcon className="h-4 w-4" />
        </Link>
      </div>
      
      {/* Upcoming Jobs Card */}
      <div className="booking-card bg-green-50">
        <div className="booking-card-header">
          <h3 className="font-bold text-green-800">Upcoming Jobs</h3>
          <CalendarIcon className="h-6 w-6 text-green-600" />
        </div>
        
        <p className="text-green-700 mb-4">
          You have <span className="font-bold">{upcomingJobs}</span> {upcomingJobs === 1 ? 'service' : 'services'} scheduled
        </p>
        
        <Link href="/provider/bookings?tab=upcoming" className="flex justify-between items-center text-green-700 font-semibold">
          <span>View Schedule</span>
          <ArrowRightIcon className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
};

export default BookingRequestsNextjs;
