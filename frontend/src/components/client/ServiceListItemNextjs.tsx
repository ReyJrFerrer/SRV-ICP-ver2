import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { StarIcon, MapPinIcon } from '@heroicons/react/24/solid';
import { ServiceAvailability, DayOfWeek } from '../../../assets/types/service/service-availability'; // Import types

// Helper function to parse "HH:MM-HH:MM" into start and end times
const parseTimeSlot = (timeSlot: string): { start: { hours: number, minutes: number }, end: { hours: number, minutes: number } } | null => {
  const parts = timeSlot.split('-');
  if (parts.length !== 2) return null;
  const [startTime, endTime] = parts;
  const [startHours, startMinutes] = startTime.split(':').map(Number);
  const [endHours, endMinutes] = endTime.split(':').map(Number);

  if (isNaN(startHours) || isNaN(startMinutes) || isNaN(endHours) || isNaN(endMinutes)) {
    return null;
  }
  return {
    start: { hours: startHours, minutes: startMinutes },
    end: { hours: endHours, minutes: endMinutes }
  };
};

// Helper function to check if current time is within provider's scheduled working hours
const isWithinScheduledHours = (
  availability: ServiceAvailability,
  currentDateTime: Date
): boolean => {
  const dayNames: DayOfWeek[] = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const currentDayName = dayNames[currentDateTime.getDay()];

  // Check if the current day is a scheduled working day
  if (!availability.schedule.some(scheduledDay => scheduledDay.toLowerCase() === currentDayName.toLowerCase())) {
    return false; // Not a scheduled working day
  }

  const currentHours = currentDateTime.getHours();
  const currentMinutes = currentDateTime.getMinutes();

  for (const slotStr of availability.timeSlots) {
    const slot = parseTimeSlot(slotStr);
    if (slot) {
      // Check if current time is within the slot
      const isAfterStart = currentHours > slot.start.hours || (currentHours === slot.start.hours && currentMinutes >= slot.start.minutes);
      // For end time, if it's like "09:00-17:00", current time should be *before* 17:00.
      // If a slot is "00:00-23:59", it effectively covers the whole day.
      const isBeforeEnd = currentHours < slot.end.hours || (currentHours === slot.end.hours && currentMinutes < slot.end.minutes);
      
      if (isAfterStart && isBeforeEnd) {
        return true; // Current time is within a working slot
      }
    }
  }

  return false; // Not within any working time slot for the scheduled day
};


interface ServiceListItemProps {
  service: {
    id: string;
    slug: string;
    name: string;
    title?: string;
    heroImage: any;
    rating: {
      average: number;
      count: number;
    };
    price: {
      amount: number;
      unit: string;
    };
    location: {
      serviceRadius: number;
      serviceRadiusUnit: string;
    };
    category: {
      name: string;
    };
    availability: ServiceAvailability; // Use the imported type
  };
  inCategories?: boolean;
  isGridItem?: boolean;
}

const ServiceListItem: React.FC<ServiceListItemProps> = ({ service, inCategories = false, isGridItem = false }) => {
  const itemWidthClass = isGridItem || inCategories ? 'w-full' : 'w-80 md:w-96';

  // Determine effective availability
  const now = new Date(); // Use the actual current date and time

  const scheduledAsWorking = isWithinScheduledHours(service.availability, now);
  const displayAsAvailable = scheduledAsWorking ? service.availability.isAvailableNow : false;

  return (
    <Link href={`/client/service/${service.slug}`} legacyBehavior>
      <a className={`service-card block ${itemWidthClass} group overflow-hidden`}>
        <div className="relative">
          <div className="aspect-video w-full">
            <Image 
              src={service.heroImage}
              alt={service.title || service.name}
              className="service-image group-hover:scale-105 transition-transform duration-300"
              layout="fill"
              objectFit="cover"
              priority
            />
          </div>
          {/* Updated Availability Indicator Badge */}
          <div 
            className={`absolute top-2 right-2 px-2 py-1 text-xs font-semibold text-white rounded-full shadow
                        ${displayAsAvailable ? 'bg-green-500' : 'bg-red-500'}`}
          >
            {displayAsAvailable ? 'Available' : (scheduledAsWorking ? 'Busy' : 'Rest Day')}
          </div>
        </div>
        
        <div className="service-content p-3">
          <div className="flex justify-between items-start mb-1">
            <h3 className="text-md font-bold text-blue-800 leading-tight group-hover:text-green-600 transition-colors">
              {service.name}
            </h3>
            <div className="flex items-center text-blue-800 text-xs flex-shrink-0 ml-2">
              <StarIcon className="h-3 w-3 text-blue-800 mr-0.5" />
              <span>{service.rating.average} ({service.rating.count})</span>
            </div>
          </div>
          
          {service.title && (
            <p className="text-blue-700 text-sm mb-2 leading-snug">{service.title}</p>
          )}
          
          <div className="flex justify-between items-center mt-auto pt-2 border-t border-gray-100">
            <p className="text-lg font-bold text-blue-800">
              ₱ {service.price.amount.toFixed(2)} 
              <span className="text-xs font-normal">{service.price.unit}</span>
            </p>
            <div className="flex items-center text-blue-800 text-xs">
              <MapPinIcon className="h-3 w-3 mr-0.5" />
              <span>{service.location.serviceRadius} {service.location.serviceRadiusUnit}</span>
            </div>
          </div>
        </div>
      </a>
    </Link>
  );
};

export default ServiceListItem;