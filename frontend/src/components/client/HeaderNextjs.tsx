import React, { useState, useRef } from 'react';
import { MapPinIcon, CheckCircleIcon } from '@heroicons/react/24/solid';
import { useRouter } from 'next/router';
import SearchBar from './SearchBarNextjs';
import BottomSheet from './BottomSheetNextjs';
import ServiceLocationMap from './ServiceLocationMapNextjs';

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className = '' }) => {
  const router = useRouter();
  const [locationSheetOpen, setLocationSheetOpen] = useState(false);

  const handleLocationClick = () => {
    setLocationSheetOpen(true);
  };

  const handleAddressMapClick = () => {
    setLocationSheetOpen(false);
    router.push('/client/service-maps');
  };

  return (
    <header className={`space-y-4 ${className}`}>
      {/* Location & User Info */}
      <div className="flex justify-between items-center">
        <button 
          onClick={handleLocationClick}
          className="location-badge flex items-center"
        >
          <MapPinIcon className="h-5 w-5 text-green-600 mr-1" />
          <div className="flex items-center">
            <span className="text-sm font-medium mr-1 truncate max-w-[200px]">
              San Vicente, Baguio, Cordillera Administrative Region
            </span>
            <CheckCircleIcon className="h-4 w-4 text-green-500" />
          </div>
        </button>
      </div>

      {/* Search Bar */}
      <div className="w-full">
        <SearchBar 
          placeholder="Search for service"
          redirectToSearch={true}
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
