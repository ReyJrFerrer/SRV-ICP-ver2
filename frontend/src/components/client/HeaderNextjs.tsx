import React, { useState, useRef } from 'react';
import { MapPinIcon, CheckCircleIcon } from '@heroicons/react/24/solid';
import { useRouter } from 'next/router';
import Image from 'next/image'; 
import Link from 'next/link';  

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
      {/* Top Row: Logo, Location */}
      <div className="flex justify-between items-center">
        {/* Logo on the left */}
        <div className="flex-shrink-0">
          <Link href="/client/home" legacyBehavior>
            <a aria-label="Home"> {/* Good for accessibility */}
              <Image 
                src="/logo.svg" // Path from the 'public' directory
                alt="SRV Logo" 
                width={120}    // Adjust width as needed
                height={35}   // Adjust height to maintain aspect ratio
                priority      // If logo is critical LCP element
              />
            </a>
          </Link>
        </div>
        
        <button 
          onClick={handleLocationClick}>
            <p>Login</p>
        </button>
      </div>

      {/* Search Bar */}
      <div className="w-full">
        <SearchBar 
          placeholder="Search for service"
          redirectToSearchResultsPage={true} 
        />
      </div>

      {/* Location Bottom Sheet */}
      <BottomSheet 
        isOpen={locationSheetOpen}
        onClose={() => setLocationSheetOpen(false)}
        title="Where do you like to meet your service provider?"
        height="large"
      >
        <div className="h-96 mb-4"> {/* Ensure map has enough space */}
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