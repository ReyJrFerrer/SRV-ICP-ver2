import React, { useState } from "react";
import {
  CalendarDaysIcon,
  CalendarIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/solid";
import Link from "next/link";

interface BookingRequestsProps {
  pendingRequests?: number;
  upcomingJobs?: number;
  className?: string;
}

const BookingRequestsNextjs: React.FC<BookingRequestsProps> = ({
  pendingRequests = 0,
  upcomingJobs = 0,
  className = "",
}) => {
  return (
    <div className={className}>
      <h2 className="pt-4 text-4xl font-extrabold text-black mb-6">Bookings</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Pending Requests Card */}
        <div
          className="flex flex-col rounded-xl bg-white p-6 shadow-md border-t-[16px] border-[#ffdb6f] pt-4
          transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg"
        >
          <div className="flex-1">
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#ffdb6f]">
                <span className="text-3xl font-bold text-white">
                  {pendingRequests}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-black">
                  Pending Requests
                </span>
                <span className="text-sm text-gray-500">
                  Need your response
                </span>
              </div>
            </div>
          </div>
          <Link href="/provider/bookings?tab=pending" legacyBehavior>
            <a className="mt-4 flex items-center justify-between text-base font-semibold text-gray-700 hover:text-yellow-600 border-t border-gray-200 pt-4">
              <span className="text-sm sm:text-base">View Requests</span>
              {/* Assuming ArrowRightIcon is imported */}
              <ArrowRightIcon className="h-4 w-4 sm:h-5 sm:w-5" />
            </a>
          </Link>
        </div>

        {/* Upcoming Jobs Card */}
        <div
          className="flex flex-col rounded-xl bg-white p-6 shadow-md border-t-[16px] border-[#ffdb6f] pt-4
          transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg"
        >
          <div className="flex-1">
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#ffdb6f]">
                <span className="text-3xl font-bold text-white">
                  {upcomingJobs}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-black">
                  Upcoming Jobs
                </span>
                <span className="text-sm text-gray-500">
                  Scheduled services
                </span>
              </div>
            </div>
          </div>
          <Link href="/provider/bookings?tab=upcoming" legacyBehavior>
            <a className="mt-4 flex items-center justify-between text-base font-semibold text-gray-700 hover:text-yellow-600 border-t border-gray-200 pt-4">
              <span className="text-sm sm:text-base">View Schedule</span>
              {/* Assuming ArrowRightIcon is imported */}
              <ArrowRightIcon className="h-4 w-4 sm:h-5 sm:w-5" />
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BookingRequestsNextjs;
