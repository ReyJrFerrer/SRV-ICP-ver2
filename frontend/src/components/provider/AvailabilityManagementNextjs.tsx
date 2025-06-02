import React from 'react';
import { PencilIcon, SunIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';

// Define local interfaces for component
interface AvailabilitySlot {
  startTime: string;
  endTime: string;
}

interface DaySchedule {
  isAvailable: boolean;
  slots: AvailabilitySlot[];
}

interface WeeklySchedule {
  [key: string]: DaySchedule;
}

interface Availability {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

interface ServiceProvider {
  id: string;
  name: string;
  availability: Availability[];
  // Other properties are not used in this component
  [key: string]: any;
}

interface AvailabilityManagementProps {
  provider: ServiceProvider;
  className?: string;
}

const AvailabilityManagementNextjs: React.FC<AvailabilityManagementProps> = ({ provider, className = '' }) => {
  const { availability } = provider;
  
  // Format time string (from 24h to 12h format)
  const formatTime = (timeString: string): string => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours, 10);
    const period = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${period}`;
  };
  
  // Convert the availability array to the structure expected by the component
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  // Group availabilities by day
  const availabilityByDay: { [key: string]: Availability[] } = {};
  availability.forEach(slot => {
    if (!availabilityByDay[slot.day]) {
      availabilityByDay[slot.day] = [];
    }
    availabilityByDay[slot.day].push(slot);
  });
  
  // Convert to the format needed for rendering
  const scheduleDays = daysOfWeek.map(day => {
    const daySlots = availabilityByDay[day] || [];
    return {
      day,
      isAvailable: daySlots.some(slot => slot.isAvailable),
      slots: daySlots.filter(slot => slot.isAvailable).map(slot => ({
        startTime: slot.startTime,
        endTime: slot.endTime
      }))
    };
  });

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
