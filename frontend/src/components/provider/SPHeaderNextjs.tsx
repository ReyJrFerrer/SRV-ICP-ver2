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
    <header className={`provider-header bg-white ${className}`}>
      {/* Top Row: Logo, Location, Notifications */}
      <div className="flex justify-between items-center mb-2">
        {/* Logo */}
        <div className="flex items-center">
          <Image
            src="/logo.svg"
            alt="Logo"
            width={40}
            height={40}
            className="rounded-full mr-3 bg-white"
            priority
          />
        </div>
        {/* Location Badge on the right */}
        <button className="location-badge flex items-center bg-yellow-200 px-3 py-1 rounded-full shadow-sm ml-auto">
          <span className="inline-flex items-center justify-center bg-blue-600 rounded-full p-1 mr-2">
            <MapPinIcon className="h-5 w-5 text-white" />
          </span>
          <span className="text-sm font-medium truncate max-w-[140px] text-black">
            Ellis Street, San Francisco, California
          </span>
        </button>
      </div>

      {/* Welcome message */}
      <div className="welcome-section">
        <h1 className="text-2xl font-bold text-black-700">Welcome, {firstName}!</h1>
        <p className="text-black">Manage your services and bookings</p>
      </div>
    </header>
  );
};

export default SPHeaderNextjs;