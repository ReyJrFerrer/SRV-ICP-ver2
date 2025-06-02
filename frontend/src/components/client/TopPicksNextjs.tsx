import React from 'react';
import Link from 'next/link';
import ServiceListItem from './ServiceListItemNextjs';
import { ArrowRightIcon } from '@heroicons/react/24/solid';
import { EnrichedService, getCategoryImage } from '@app/utils/serviceHelpers';

interface TopPicksProps {
  services: EnrichedService[];
  className?: string;
}

const TopPicks: React.FC<TopPicksProps> = ({ services, className = '' }) => {
  // Adapter function to convert EnrichedService to ServiceListItem format
  const adaptServiceForUI = (service: EnrichedService) => ({
    id: service.id,
    slug: service.id, // Using id as slug since slug is not in serviceCanister Service
    name: service.providerName, // Use provider name as the main name
    title: service.title, // Service title as the secondary title
    heroImage: getCategoryImage(service.category.name), // Temporary fallback image
    providerName: service.providerName,
    providerAvatar: service.providerAvatar || '/images/default-avatar.jpg', // Use provider avatar or default
    rating: {
      average: service.rating || 0,
      count: service.reviewCount || 0,
    },
    price: {
      amount: service.price,
      unit: 'hour',
      display: service.priceDisplay,
    },
    location: {
      serviceRadius: 10, // Default radius - could be calculated based on service area
      serviceRadiusUnit: 'km',
      // Additional location data from service.mo
      address: service.location.address,
      city: service.location.city,
      state: service.location.state,
      country: service.location.country,
      postalCode: service.location.postalCode,
      latitude: service.location.latitude,
      longitude: service.location.longitude,
    },
    category: {
      name: service.category.name,
      id: service.category.id,
      slug: service.category.slug,
    },
  });

  return (
    <div className={`${className}`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg sm:text-xl font-bold">Top Picks!</h2>
        <Link 
          href="/client/service/view-all"
          className="text-green-600 flex items-center hover:text-green-700 transition-colors"
        >
          <span className="mr-1">View All</span>
          <ArrowRightIcon className="h-4 w-4" />
        </Link>
      </div>
      
      {services.length === 0 ? (
        // Empty state
        <div className="text-center py-12">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </div>
            <p className="text-gray-500">No services available at the moment</p>
          </div>
        </div>
      ) : (
        // Service grid with responsive sizing
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {services.map((service) => (
            <div key={service.id}>
              <ServiceListItem 
                service={adaptServiceForUI(service)} 
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TopPicks;
