import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { StarIcon, MapPinIcon, UserCircleIcon } from '@heroicons/react/24/solid';

interface ServiceListItemProps {
  service: {
    id: string;
    slug: string;
    name: string;
    title?: string;
    heroImage: string;
    providerName?: string;
    providerAvatar?: any;
    rating: {
      average: number;
      count: number;
    };
    price: {
      amount: number;
      unit: string;
      display?: string;
    };
    location: {
      serviceRadius: number;
      serviceRadiusUnit: string;
      address?: string;
      city?: string;
      state?: string;
    };
    category: {
      name: string;
      id?: string;
      slug?: string;
    };
  };
  inCategories?: boolean;
}

const ServiceListItem: React.FC<ServiceListItemProps> = ({ service, inCategories = false }) => {
  return (
    <Link href={`/client/service/${service.slug}`}>
      <div className={`service-card ${inCategories ? 'w-full' : 'w-80 md:w-96'} bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300`}>
          {/* Provider info - displayed prominently */}  
        <div className="relative">
          <div className="aspect-[4/3] w-full">
            <Image 
              src={service.providerAvatar}
              alt={service.title || service.name}
              className="service-image object-cover"
              width={500}
              height={375}
              priority
            />
          </div>
          {service.category && (
            <div className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-medium px-3 py-1.5 rounded-full shadow-sm">
              {service.category.name}
            </div>
          )}
        </div>
        
        <div className="service-content p-5">
                
          {/* Service Name and Ratings */}
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-bold text-gray-900">{service.name}</h3>
            <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-md">
              <StarIcon className="h-5 w-5 text-yellow-500 mr-1" />
              <span className="font-medium">{service.rating.average.toFixed(1)}</span>
              <span className="text-sm text-gray-500 ml-1">({service.rating.count})</span>
            </div>
          </div>
          
          {/* Service Title as smaller heading */}
          {service.title && (
            <div className="mb-3">
              <h4 className="text-md text-gray-600">{service.title}</h4>
            </div>
          )}
          
          {/* Location */}
          {service.location && (service.location.city || service.location.address) && (
            <div className="flex items-center text-sm text-gray-600 mb-3">
              <MapPinIcon className="h-4 w-4 mr-1 text-gray-500 flex-shrink-0" />
              <span>
                {service.location.city || service.location.address}
                {service.location.state ? `, ${service.location.state}` : ''}
              </span>
            </div>
          )}
          
          {/* Price and Service Radius */}
          <div className="flex justify-between items-center mt-auto pt-3 border-t border-gray-100">
            <p className="text-xl font-bold text-green-600">
              {service.price.display || `$${service.price.amount.toFixed(2)}/${service.price.unit}`}
            </p>
            <div className="flex items-center text-sm bg-gray-50 px-2 py-1 rounded-md">
              <MapPinIcon className="h-4 w-4 mr-1 text-blue-500" />
              <span>{service.location.serviceRadius} {service.location.serviceRadiusUnit}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ServiceListItem;
