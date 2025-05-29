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
}

const ServiceListItem: React.FC<ServiceListItemProps> = ({ service, inCategories = false }) => {
  return (
    <Link href={`/customer/service/${service.slug}`}>
      <div className={`service-card ${inCategories ? 'w-full' : 'w-80 md:w-96'}`}>
        <div className="relative">
          <div className="aspect-video w-full">
            <Image 
              src={service.heroImage}
              alt={service.title || service.name}
              className="service-image"
              width={400}
              height={240}
              priority
            />
          </div>
        </div>
        
        <div className="service-content">
          <div className="flex justify-between items-center mb-1">
            <h3 className="text-lg font-bold text-blue-800">{service.name}</h3>
            <div className="flex items-center text-blue-800">
              <StarIcon className="h-4 w-4 text-blue-800 mr-1" />
              <span>{service.rating.average} ({service.rating.count})</span>
            </div>
          </div>
          
          {service.title && (
            <p className="text-blue-700 mb-2">{service.title}</p>
          )}
          
          <div className="flex justify-between items-center mt-auto">
            <p className="text-xl font-bold text-blue-800">
              ₱ {service.price.amount.toFixed(2)} {service.price.unit}
            </p>
            <div className="flex items-center text-blue-800">
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
