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
      // Use the logout method from the ares-react client
      await client.logout();
      // Redirect to the home page after logout
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

  // Extract first name from the full name
  const displayName = provider.name.split(' ')[0] || 'Provider';
  const displayLocation = provider.location?.city || 'Location not set';

  return (
    <header className={`provider-header bg-white p-4 ${className}`}>
      <div className="flex justify-between items-center">
        {/* Left side: Logo and Welcome Message */}
        <div className="flex items-center gap-4">
          <Image
            src="/logo.svg"
            alt="Logo"
            width={60}
            height={60}
            className="rounded-full bg-white"
            priority
          />
          <div className="welcome-section">
            <h1 className="text-2xl font-bold text-gray-800">
              Welcome, {displayName}!
            </h1>
            <p className="text-gray-600">
              {provider.isVerified ? '✓ Verified Provider' : 'Manage your services and bookings'}
            </p>
          </div>
        </div>
        
        {/* Right side: Location, Profile, Notifications */}
        <div className="flex items-center space-x-4">
          {/* Location Badge */}
          <button className="location-badge flex items-center bg-yellow-200 px-4 py-2 rounded-full shadow-sm hover:bg-yellow-300 transition-colors">
            <span className="inline-flex items-center justify-center bg-blue-600 rounded-full p-1 mr-2">
              <MapPinIcon className="h-5 w-5 text-white" />
            </span>
            <span className="text-base font-medium truncate max-w-[150px] text-black">
              {displayLocation}
            </span>
          </button>

          {/* Notifications */}
          {notificationCount > 0 && (
            <button className="relative p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
              <BellIcon className="h-6 w-6 text-gray-700" />
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
              className="p-3 flex items-center justify-center bg-gray-100 rounded-full hover:bg-red-100 text-gray-600 hover:text-red-600 transition-colors disabled:opacity-50"
              title="Logout"
            >
              {isLoggingOut ? (
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                ) : (
                  <ArrowRightOnRectangleIcon className="h-8 w-8" />
              )}
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default SPHeaderNextjs;