// SRV-ICP-ver2-jdNewMain/frontend/src/components/provider/SPHeaderNextjs.tsx
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
  const { isAuthenticated, client } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await client.logout();
      router.push('/'); 
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (!provider) {
    return (
      <header className={`provider-header bg-white p-4 ${className}`}>
        <div className="flex justify-center items-center py-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48"></div>
          </div>
        </div>
      </header>
    );
  }

  const displayName = provider.name.split(' ')[0] || 'Provider';
  const displayLocation = provider.location?.city || 'Location not set';

  return (
    <header className={`provider-header bg-white p-4 ${className} space-y-4`}>
      {/* Top Row: Welcome Info & Actions */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Image
            src="/logo.svg"
            alt="Logo"
            width={60}
            height={60}
            className="rounded-full bg-white flex-shrink-0"
            priority
          />
          <div className="welcome-section">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
              Welcome, {displayName}!
            </h1>
            <p className="text-sm text-gray-600">
              {provider.isVerified ? '✓ Verified Provider' : 'Manage your services and bookings'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-4">
          {notificationCount > 0 && (
            <button className="relative p-2 sm:p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
              <BellIcon className="h-5 sm:h-6 w-5 sm:w-6 text-gray-700" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {notificationCount > 99 ? '99+' : notificationCount}
              </span>
            </button>
          )}

          {isAuthenticated && (
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="p-2 sm:p-3 flex items-center justify-center bg-gray-100 rounded-full hover:bg-red-100 text-gray-600 hover:text-red-600 transition-colors disabled:opacity-50"
              title="Logout"
            >
              {isLoggingOut ? (
                  <div className="animate-spin rounded-full h-6 sm:h-8 w-6 sm:h-8 border-b-2 border-gray-900"></div>
                ) : (
                  <ArrowRightOnRectangleIcon className="h-6 sm:h-8 w-6 sm:h-8" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Bottom Row: Expanded Location Bar */}
      <div>
        <button className="location-badge w-full flex items-center justify-center bg-yellow-200 px-4 py-3 rounded-lg shadow-sm hover:bg-yellow-300 transition-colors">
            <span className="inline-flex items-center justify-center bg-blue-600 rounded-full p-1 mr-3">
              <MapPinIcon className="h-5 w-5 text-white" />
            </span>
            <span className="text-base font-medium text-black">
              Current Location: <span className="font-bold">{displayLocation}</span>
            </span>
        </button>
      </div>
    </header>
  );
};

export default SPHeaderNextjs;