import React from 'react';
import Link from 'next/link';
import ServiceListItem from './ServiceListItemNextjs'; 
import { ArrowRightIcon } from '@heroicons/react/24/solid';

interface Service {
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
          href="/client/service/view-all" 
          className="text-green-600 flex items-center hover:text-green-700 transition-colors"
        >
          <span className="mr-1">View All</span>
          <ArrowRightIcon className="h-4 w-4" />
        </Link>
      </div>
      
      {/* Changed from horizontal flex scroll to a vertical grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5">
        {services.map((service) => (
          <ServiceListItem key={service.id} service={service} isGridItem={true} />
        ))}
      </div>
    </div>
  );
};

export default TopPicks;