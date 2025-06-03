import React, { useState, useRef } from 'react';
import { MapPinIcon, CheckCircleIcon } from '@heroicons/react/24/solid';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import SearchBar from './SearchBarNextjs';
import BottomSheet from './BottomSheetNextjs';
import ServiceLocationMap from './ServiceLocationMapNextjs';
// Import the hook
import { useAllServicesWithProviders } from '../../hooks/serviceInformation';

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className = '' }) => {
  const router = useRouter();
  const [locationSheetOpen, setLocationSheetOpen] = useState(false);
  // Use the hook to fetch all services
  const { services, loading, error } = useAllServicesWithProviders();

  const handleLocationClick = () => {
    setLocationSheetOpen(true);
  };

  const handleAddressMapClick = () => {
    setLocationSheetOpen(false);
    router.push('/client/service-maps');
  };

  return (
    <header className={`space-y-4 ${className}`}>
      {/* Top Row: Logo, Location */}
      <div className="flex justify-between items-center">
        {/* Logo on the left */}
        <div className="flex-shrink-0">
          <Link href="/client/home" legacyBehavior>
            <a aria-label="Home">
              <Image 
                src="/logo.svg"
                alt="SRV Logo"
                width={120}
                height={35}
                priority
              />
            </a>
          </Link>
        </div>
        
        <button 
          onClick={handleLocationClick}
          className="location-badge flex items-center text-xs sm:text-sm py-1 px-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <MapPinIcon className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 mr-1 sm:mr-1.5 flex-shrink-0" />
          <div className="flex items-center overflow-hidden">
            <span className="font-medium mr-1 truncate max-w-[120px] xs:max-w-[150px] sm:max-w-[200px]">
              San Vicente, Baguio, Cordillera Administrative Region
            </span>
            <CheckCircleIcon className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 flex-shrink-0" />
          </div>
        </button>
      </div>

      {/* Search Bar */}
      <div className="w-full">
        <SearchBar 
          placeholder="Search for service"
          redirectToSearchResultsPage={true}
          servicesList={services} // Pass the services data here
        />
      </div>

      {/* Location Bottom Sheet */}
      <BottomSheet 
        isOpen={locationSheetOpen}
        onClose={() => setLocationSheetOpen(false)}
        title="Where do you like to meet your service provider?"
        height="large"
      >
        <div className="h-96 mb-4">
          <ServiceLocationMap onClick={handleAddressMapClick} />
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
          <h3 className="font-medium text-gray-800 mb-1">Current Location</h3>
          <p className="text-gray-600">San Vicente, Baguio, Cordillera Administrative Region</p>
        </div>
      </BottomSheet>
    </header>
  );
};

export default Header;
