import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { StarIcon, MapPinIcon } from '@heroicons/react/24/solid';

interface ServiceListItemProps {
  service: {
    id: string;
    slug: string;
    name: string;
    title?: string;
    heroImage: any; // Can be string or StaticImageData
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
    // Ensure availability is part of the service prop type
    availability: {
      isAvailableNow: boolean;
      // include other availability fields if needed by this component, though not used here
      schedule: string[]; 
      timeSlots: string[];
    };
  };
  inCategories?: boolean;
  isGridItem?: boolean;
}

const ServiceListItem: React.FC<ServiceListItemProps> = ({ service, inCategories = false, isGridItem = false }) => {
  const itemWidthClass = isGridItem || inCategories ? 'w-full' : 'w-80 md:w-96';

  return (
    <Link href={`/client/service/${service.slug}`} legacyBehavior>
      <a className={`service-card block ${itemWidthClass} group overflow-hidden`}> {/* Added group and overflow-hidden */}
        <div className="relative">
          <div className="aspect-video w-full">
            <Image 
              src={service.heroImage}
              alt={service.title || service.name}
              className="service-image group-hover:scale-105 transition-transform duration-300" // Added hover effect
              layout="fill"
              objectFit="cover"
              priority
            />
          </div>
          {/* Availability Indicator Badge */}
          <div 
            className={`absolute top-2 right-2 px-2 py-1 text-xs font-semibold text-white rounded-full shadow
                        ${service.availability.isAvailableNow ? 'bg-green-500' : 'bg-red-500'}`}
          >
            {service.availability.isAvailableNow ? 'Available' : 'Busy'}
          </div>
        </div>
        
        <div className="service-content p-3">
          <div className="flex justify-between items-start mb-1">
            <h3 className="text-md font-bold text-blue-800 leading-tight group-hover:text-green-600 transition-colors"> {/* Added hover effect */}
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