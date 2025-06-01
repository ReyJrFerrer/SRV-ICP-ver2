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
    heroImage: string; 
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
  };
  inCategories?: boolean;
  isGridItem?: boolean; 
}

const ServiceListItem: React.FC<ServiceListItemProps> = ({ service, inCategories = false, isGridItem = false }) => {

  const itemWidthClass = isGridItem || inCategories ? 'w-full' : 'w-80 md:w-96';

  return (
    <Link href={`/client/service/${service.slug}`} legacyBehavior>
      <a className={`service-card block ${itemWidthClass}`}> {/* Added block display for the anchor if needed */}
        <div className="relative">
          <div className="aspect-video w-full"> {/* Ensure aspect ratio is maintained */}
            <Image 
              src={service.heroImage} 
              alt={service.title || service.name}
              className="service-image" 
              layout="fill"
              objectFit="cover"
              priority 
            />
          </div>
        </div>
        
        <div className="service-content p-3"> {/* Adjusted padding for potentially smaller cards */}
          <div className="flex justify-between items-start mb-1"> {/* Changed items-center to items-start */}
            <h3 className="text-md font-bold text-blue-800 leading-tight"> {/* Adjusted text size and leading */}
              {service.name}
            </h3>
            <div className="flex items-center text-blue-800 text-xs flex-shrink-0 ml-2"> {/* Adjusted text size and spacing */}
              <StarIcon className="h-3 w-3 text-blue-800 mr-0.5" /> {/* Adjusted icon size */}
              <span>{service.rating.average} ({service.rating.count})</span>
            </div>
          </div>
          
          {service.title && (
            <p className="text-blue-700 text-sm mb-2 leading-snug">{service.title}</p>
          )}
          
          <div className="flex justify-between items-center mt-auto pt-2 border-t border-gray-100"> {/* Added top border */}
            <p className="text-lg font-bold text-blue-800"> {/* Adjusted text size */}
              ₱ {service.price.amount.toFixed(2)} 
              <span className="text-xs font-normal">{service.price.unit}</span>
            </p>
            <div className="flex items-center text-blue-800 text-xs"> {/* Adjusted text size */}
              <MapPinIcon className="h-3 w-3 mr-0.5" /> {/* Adjusted icon size */}
              <span>{service.location.serviceRadius} {service.location.serviceRadiusUnit}</span>
            </div>
          </div>
        </div>
      </a>
    </Link>
  );
};

export default ServiceListItem;