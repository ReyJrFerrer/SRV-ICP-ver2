import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { StarIcon, MapPinIcon } from '@heroicons/react/24/solid';
import { ServiceAvailability, DayOfWeek } from '../../../assets/types/service/service-availability';

// --- Helper Functions (parseTimeSlot, isWithinScheduledHours) ---
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

const isWithinScheduledHours = (
  availability: ServiceAvailability,
  currentDateTime: Date
): boolean => {
  const dayNames: DayOfWeek[] = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const currentDayName = dayNames[currentDateTime.getDay()];

  if (!availability.schedule.some(scheduledDay => scheduledDay.toLowerCase() === currentDayName.toLowerCase())) {
    return false;
  }
  const currentHours = currentDateTime.getHours();
  const currentMinutes = currentDateTime.getMinutes();
  for (const slotStr of availability.timeSlots) {
    const slot = parseTimeSlot(slotStr);
    if (slot) {
      const isAfterStart = currentHours > slot.start.hours || (currentHours === slot.start.hours && currentMinutes >= slot.start.minutes);
      const isBeforeEnd = currentHours < slot.end.hours || (currentHours === slot.end.hours && currentMinutes < slot.end.minutes);
      if (isAfterStart && isBeforeEnd) {
        return true;
      }
    }
  }
  return false;
};
// --- End Helper Functions ---

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
    availability: ServiceAvailability;
  };
  isGridItem?: boolean;
  retainMobileLayout?: boolean; 
}

const ServiceListItem: React.FC<ServiceListItemProps> = ({ 
  service, 
  isGridItem = false, 
  retainMobileLayout = false 
}) => {
  const itemWidthClass = isGridItem ? 'w-full' : 'w-80 md:w-96';

  const now = new Date();
  const scheduledAsWorking = isWithinScheduledHours(service.availability, now);
  const displayAsAvailable = scheduledAsWorking ? service.availability.isAvailableNow : false;
  const availabilityText = displayAsAvailable ? 'Available' : (scheduledAsWorking ? 'Busy' : 'Not Available');

  // Define layout classes based on retainMobileLayout
  const nameRatingContainerClass = retainMobileLayout
    ? "flex flex-row justify-between items-start mb-1" // Name and Rating on same line
    : "flex flex-col sm:flex-row sm:justify-between sm:items-start mb-1"; // Default responsive

  const priceLocationContainerClass = retainMobileLayout
    ? "flex flex-row justify-between items-center mt-auto pt-2 border-t border-gray-100" // Price and Location on same line
    : "flex flex-col items-start sm:flex-row sm:justify-between sm:items-center mt-auto pt-2 border-t border-gray-100"; // Default responsive

  const nameMarginClass = !retainMobileLayout ? "mb-0.5 sm:mb-0" : "";
  const ratingMarginClass = !retainMobileLayout ? "mt-0.5 sm:mt-0 sm:ml-2" : "sm:ml-2"; 
  const priceMarginClass = !retainMobileLayout ? "mb-0.5 sm:mb-0" : "";
  const locationMarginClass = !retainMobileLayout ? "mt-0.5 sm:mt-0" : "";

  return (
    <Link href={`/client/service/${service.slug}`} legacyBehavior>
      <a className={`service-card block ${itemWidthClass} group overflow-hidden flex flex-col`}>
        <div className="relative"> {/* Image container */}
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
          <div 
            className={`absolute top-2 right-2 px-2 py-0.5 text-xs font-semibold text-white rounded-full shadow
                        ${displayAsAvailable ? 'bg-green-500' : 'bg-red-500'}`}
          >
            {availabilityText}
          </div>
        </div>
        
        <div className="service-content p-3 flex flex-col flex-grow">
          <div className="flex-grow"> {/* This div helps push price/location to bottom */}
            <div className={nameRatingContainerClass}>
              <h3 className={`text-md font-bold text-blue-800 leading-tight group-hover:text-green-600 transition-colors ${nameMarginClass}`}>
                {service.name}
              </h3>
              <div className={`flex items-center text-blue-800 text-xs flex-shrink-0 ${ratingMarginClass}`}>
                <StarIcon className="h-3 w-3 text-blue-800 mr-0.5" />
                <span>{service.rating.average} ({service.rating.count})</span>
              </div>
            </div>
            
            {service.title && (
              <p className="text-blue-700 text-sm mb-2 leading-snug">{service.title}</p>
            )}
          </div>
          
          <div className={priceLocationContainerClass}>
            <p className={`text-lg font-bold text-blue-800 ${priceMarginClass}`}>
              ₱ {service.price.amount.toFixed(2)} 
              <span className="text-xs font-normal">{service.price.unit}</span>
            </p>
            <div className={`flex items-center text-blue-800 text-xs ${locationMarginClass}`}>
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