import React from 'react';
import { PencilIcon, SunIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import { ServiceProvider } from '../../../assets/types/provider/service-provider';

interface AvailabilityManagementProps {
  provider: ServiceProvider;
  className?: string;
}

const AvailabilityManagementNextjs: React.FC<AvailabilityManagementProps> = ({ provider, className = '' }) => {
  const { availability } = provider;
  const { weeklySchedule } = availability;
  
  // Format time string (from 24h to 12h format)
  const formatTime = (timeString: string): string => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours, 10);
    const period = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${period}`;
  };
  
  // Convert the weeklySchedule object to an array for easier mapping
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const scheduleDays = daysOfWeek.map(day => ({
    day,
    ...weeklySchedule[day]
  }));

  return (
    <div className={`availability-section ${className}`}>
      <div className="section-header">
        <h2 className="text-xl font-bold text-gray-800">My Availability</h2>
        <Link href="/provider/availability/edit">
          <button className="add-button">
            <PencilIcon className="h-5 w-5" />
          </button>
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {scheduleDays.map((scheduleDay) => (
          <div key={scheduleDay.day} className="day-item">
            <div className="day-status">
              <span 
                className={`status-dot ${scheduleDay.isAvailable ? 'bg-green-500' : 'bg-gray-400'}`}
              ></span>
              <span className="font-medium text-gray-800">{scheduleDay.day}</span>
            </div>
            
            {scheduleDay.isAvailable ? (
              <div>
                {scheduleDay.slots.map((slot, index) => (
                  <span key={index} className="text-sm text-gray-600">
                    {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                  </span>
                ))}
              </div>
            ) : (
              <span className="text-sm text-gray-500">Unavailable</span>
            )}
          </div>
        ))}
      </div>
      
      <Link href="/provider/availability/vacation">
        <button className="vacation-button">
          <SunIcon className="h-5 w-5 mr-2" />
          <span>Set Vacation Dates</span>
        </button>
      </Link>
    </div>
  );
};

export default AvailabilityManagementNextjs;
