import Link from 'next/link';
import ServiceListItem from './ServiceListItemNextjs';
import { ArrowRightIcon } from '@heroicons/react/24/solid';
import { Service } from '../../../assets/types/service/service';

interface TopPicksProps {
  services: Service[]; 
  className?: string;
}

const TopPicks: React.FC<TopPicksProps> = ({ services, className = '' }) => {
  return (
    <div className={`${className}`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-slate-800">Top Picks!</h2>
        <Link
          href="/client/service/view-all" 
          className="text-blue-600 hover:text-blue-700 flex items-center transition-colors text-sm font-medium"
        >
          <span className="mr-1">View All</span>
          <ArrowRightIcon className="h-4 w-4" />
        </Link>
      </div>

      {services && services.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {services.map((service) => (
            <ServiceListItem key={service.id} service={service} isGridItem={true} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center py-4">No top picks available at the moment.</p>
      )}
    </div>
  );
};

export default TopPicks;