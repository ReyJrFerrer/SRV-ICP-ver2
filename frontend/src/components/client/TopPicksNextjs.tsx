import React from 'react';
import Link from 'next/link';
import ServiceListItem from './ServiceListItemNextjs';
import { ArrowRightIcon } from '@heroicons/react/24/solid';

interface Service {
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
}

interface TopPicksProps {
  services: Service[];
  className?: string;
}

const TopPicks: React.FC<TopPicksProps> = ({ services, className = '' }) => {
  return (
    <div className={`${className}`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Top Picks!</h2>
        <Link 
          href="/customer/service/view-all"
          className="text-green-600 flex items-center hover:text-green-700 transition-colors"
        >
          <span className="mr-1">View All</span>
          <ArrowRightIcon className="h-4 w-4" />
        </Link>
      </div>
      
      <div className="relative -mx-4 px-4">
        <div className="flex overflow-x-auto pb-4 -mx-4 px-4 space-x-4 scrollbar-hide">
          {services.map((service) => (
            <div key={service.id} className="flex-shrink-0">
              <ServiceListItem service={service} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopPicks;
