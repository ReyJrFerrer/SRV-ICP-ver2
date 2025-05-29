import React from 'react';
import { MapPinIcon, BellIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';
import { ServiceProvider } from '../../../assets/types/provider/service-provider';

interface SPHeaderProps {
  provider: ServiceProvider;
  notificationCount?: number;
  className?: string;
}

const SPHeaderNextjs: React.FC<SPHeaderProps> = ({ 
  provider, 
  notificationCount = 0,
  className = '' 
}) => {
  const { firstName } = provider;
  
  return (
    <header className={`provider-header ${className}`}>
      {/* Location & Notifications */}
      <div className="flex justify-between items-center">
        <button className="location-badge">
          <MapPinIcon className="h-5 w-5 text-teal-600 mr-1" />
          <span className="text-sm font-medium truncate max-w-[200px]">
            Ellis Street, San Francisco, California
          </span>
        </button>
        
        <div className="relative">
          <BellIcon className="h-6 w-6 text-gray-700" />
          {notificationCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {notificationCount > 9 ? '9+' : notificationCount}
            </span>
          )}
        </div>
      </div>
      
      {/* Welcome message */}
      <div className="welcome-section">
        <h1 className="text-2xl font-bold text-gray-800">Welcome, {firstName}!</h1>
        <p className="text-gray-600">Manage your services and bookings</p>
      </div>
    </header>
  );
};

export default SPHeaderNextjs;
