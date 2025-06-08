import React, { useState } from 'react';
import { MapPinIcon, BellIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { FrontendProfile } from '../../services/authCanisterService';
import { useAuth } from '@bundly/ares-react';

interface SPHeaderProps {
  provider: FrontendProfile | null;
  notificationCount?: number;
  className?: string;
}

const SPHeaderNextjs: React.FC<SPHeaderProps> = ({
  provider,
  notificationCount = 0,
  className = ''
}) => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = () => {
    setIsLoggingOut(true);
    // lagay mo dito rey
    router.push('/');
  };

  if (!provider) {
    return (
      <header className={`provider-header bg-white ${className}`}>
        <div className="flex justify-center items-center py-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48"></div>
          </div>
        </div>
      </header>
    );
  }

  // Extract first name from the full name
  const displayName = provider.name.split(' ')[0] || 'Provider';
  // const displayLocation = provider.address || 'Location not set';

  return (
    <header className={`provider-header bg-white p-4 ${className}`}>
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
        
        {/* Location Badge and Notifications */}
        <div className="flex items-center space-x-3">
          {/* Location Badge */}
          <button className="location-badge flex items-center bg-yellow-200 px-3 py-1 rounded-full shadow-sm">
            <span className="inline-flex items-center justify-center bg-blue-600 rounded-full p-1 mr-2">
              <MapPinIcon className="h-4 w-4 text-white" />
            </span>
            <span className="text-sm font-medium truncate max-w-[120px] text-black">
              Baguio City
            </span>
          </button>

          {/* Notifications */}
          {notificationCount > 0 && (
            <button className="relative p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
              <BellIcon className="h-5 w-5 text-gray-700" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {notificationCount > 99 ? '99+' : notificationCount}
              </span>
            </button>
          )}

          {/* Logout Button */}
          {isAuthenticated && (
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="p-2 w-9 h-9 flex items-center justify-center bg-gray-100 rounded-full hover:bg-red-100 text-gray-600 hover:text-red-600 transition-colors disabled:opacity-50"
              title="Logout"
            >
              {isLoggingOut ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
                ) : (
                  <ArrowRightOnRectangleIcon className="h-5 w-5" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Welcome message */}
      <div className="welcome-section">
        <h1 className="text-2xl font-bold text-gray-800">
          Welcome, {displayName}!
        </h1>
        <p className="text-gray-600">
          {provider.isVerified ? '✓ Verified Provider' : 'Manage your services and bookings'}
        </p>
      </div>
    </header>
  );
};

export default SPHeaderNextjs;
