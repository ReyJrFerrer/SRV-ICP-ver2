import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Service } from '../../../assets/types/service/service'; // Your main Service type
import { PencilIcon, EyeIcon, EyeSlashIcon, ChartBarIcon, TrashIcon } from '@heroicons/react/24/outline'; // Using outline for actions

interface ProviderServiceListItemProps {
  service: Service;
  onToggleActive: (serviceId: string, currentStatus: boolean) => void; // Callback to toggle active status
  onDeleteService: (serviceId: string) => void; // Callback to delete service
}

const ProviderServiceListItem: React.FC<ProviderServiceListItemProps> = ({ service, onToggleActive, onDeleteService }) => {
  const servicePrice = service.price || (service.packages && service.packages.length > 0 ? service.packages[0].price : 0);
  const priceUnit = service.price?.unit || (service.packages && service.packages.length > 0 ? (service.packages[0].duration || '/pkg') : '/service');
  const currencySymbol = service.price?.currency === 'PHP' ? '₱' : (service.price?.currency || '₱');

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col md:flex-row hover:shadow-xl transition-shadow duration-300">
      {/* Image Section */}
      <div className="md:w-1/3 relative h-48 md:h-auto">
        <Image
          src={service.heroImage || '/images/default-service.png'} // Fallback image
          alt={service.title || service.name}
          layout="fill"
          objectFit="cover"
          className="transition-transform duration-300 group-hover:scale-105"
        />
        <span
          className={`absolute top-2 left-2 px-2 py-0.5 text-xs font-semibold text-white rounded-full
                      ${service.isActive ? 'bg-green-500' : 'bg-gray-500'}`}
        >
          {service.isActive ? 'Active' : 'Inactive'}
        </span>
      </div>

      {/* Details Section */}
      <div className="p-4 md:p-5 flex-1 flex flex-col justify-between">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{service.category.name}</p>
          <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-2 truncate" title={service.title || service.name}>
            {service.title || service.name}
          </h3>
          <p className="text-sm text-gray-600 mb-3 line-clamp-2" title={service.description}>
            {service.description}
          </p>
          <div className="flex items-center text-sm text-gray-700 mb-3">
            <span className="font-semibold text-lg text-green-600">
              {currencySymbol}{(typeof servicePrice === 'number' ? servicePrice : servicePrice.amount || 0).toFixed(2)}
            </span>
            <span className="text-xs text-gray-500 ml-1">{priceUnit}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 pt-4 border-t border-gray-200 flex flex-wrap gap-2 items-center justify-start">
          <Link href={`/provider/services/edit/${service.slug || service.id}`} legacyBehavior>
            <a className="flex items-center text-xs sm:text-sm bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-3 rounded-lg transition-colors">
              <PencilIcon className="h-4 w-4 mr-1.5" /> Edit
            </a>
          </Link>
          <button
            onClick={() => onToggleActive(service.id, service.isActive)}
            className={`flex items-center text-xs sm:text-sm font-medium py-2 px-3 rounded-lg transition-colors
                        ${service.isActive 
                            ? 'bg-yellow-500 hover:bg-yellow-600 text-white' 
                            : 'bg-green-500 hover:bg-green-600 text-white'}`}
          >
            {service.isActive ? <EyeSlashIcon className="h-4 w-4 mr-1.5" /> : <EyeIcon className="h-4 w-4 mr-1.5" />}
            {service.isActive ? 'Set Inactive' : 'Set Active'}
          </button>
          <Link href={`/provider/services/stats/${service.slug || service.id}`} legacyBehavior>
            <a className="flex items-center text-xs sm:text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-3 rounded-lg transition-colors">
              <ChartBarIcon className="h-4 w-4 mr-1.5" /> Stats
            </a>
          </Link>
           <button
            onClick={() => onDeleteService(service.id)}
            className="flex items-center text-xs sm:text-sm bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-3 rounded-lg transition-colors ml-auto md:ml-0" // ml-auto for mobile to push right
          >
            <TrashIcon className="h-4 w-4 mr-1.5" /> Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProviderServiceListItem;