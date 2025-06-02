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
      <div className={`service-card ${inCategories ? 'w-full' : 'w-80 md:w-96'} bg-white rounded-lg shadow-md overflow-hidden`}>
        <div className="relative">
          <div className="aspect-video w-full">
            <Image 
              src={service.heroImage}
              alt={service.title || service.name}
              className="service-image object-cover"
              width={400}
              height={240}
              priority
            />
          </div>
          {service.category && (
            <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs font-medium px-2 py-1 rounded">
              {service.category.name}
            </div>
          )}
        </div>
        
        <div className="service-content p-4">
          <div className="flex justify-between items-center mb-1">
            <h3 className="text-lg font-bold text-gray-800">{service.name}</h3>
            <div className="flex items-center text-gray-700">
              <StarIcon className="h-4 w-4 text-yellow-500 mr-1" />
              <span>{service.rating.average.toFixed(1)} ({service.rating.count})</span>
            </div>
          </div>
          
          {/* Provider info */}
          {service.providerName && (
            <div className="flex items-center text-sm text-gray-600 mb-2">
              {service.providerAvatar ? (
                <Image 
                  src={service.providerAvatar} 
                  alt={service.providerName}
                  width={20}
                  height={20}
                  className="rounded-full mr-1"
                />
              ) : (
                <UserCircleIcon className="h-5 w-5 mr-1 text-gray-500" />
              )}
              <span>{service.providerName}</span>
            </div>
          )}
          
          {/* Location */}
          {service.location && (service.location.city || service.location.address) && (
            <div className="flex items-center text-sm text-gray-600 mb-2">
              <MapPinIcon className="h-4 w-4 mr-1 text-gray-500" />
              <span>
                {service.location.city || service.location.address}
                {service.location.state ? `, ${service.location.state}` : ''}
              </span>
            </div>
          )}
          
          <div className="flex justify-between items-center mt-auto pt-2 border-t border-gray-100">
            <p className="text-xl font-bold text-green-600">
              {service.price.display || `$${service.price.amount.toFixed(2)}/${service.price.unit}`}
            </p>
            <div className="flex items-center text-sm text-gray-600">
              <MapPinIcon className="h-4 w-4 mr-1" />
              <span>{service.location.serviceRadius} {service.location.serviceRadiusUnit}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ServiceListItem;
