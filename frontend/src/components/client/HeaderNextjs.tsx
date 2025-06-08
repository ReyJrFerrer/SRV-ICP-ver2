import React, { useState, useRef, useEffect } from 'react';
import { MapPinIcon, CheckCircleIcon, BellIcon, UserCircleIcon } from '@heroicons/react/24/solid';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from "@bundly/ares-react";
import SearchBar from './SearchBarNextjs';
import BottomSheet from './BottomSheetNextjs';
import ServiceLocationMap from './ServiceLocationMapNextjs';
// Import the hook and service
import { useAllServicesWithProviders } from '../../hooks/serviceInformation';
import authCanisterService, { FrontendProfile } from '../../services/authCanisterService';

interface HeaderProps {
  className?: string;
  notificationCount?: number;
}

const Header: React.FC<HeaderProps> = ({ 
  className = '',
  notificationCount = 0 
}) => {
  const router = useRouter();
  const { isAuthenticated, currentIdentity } = useAuth();
  const [profile, setProfile] = useState<FrontendProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState<boolean>(false);
  const [locationSheetOpen, setLocationSheetOpen] = useState(false);
  
  // Use the hook to fetch all services
  const { services, loading, error } = useAllServicesWithProviders();

  // Fetch user profile when authenticated
  useEffect(() => {
    const fetchProfile = async () => {
      if (!isAuthenticated || !currentIdentity) {
        setProfile(null);
        return;
      }

      setProfileLoading(true);
      try {
        console.log('Fetching profile for current user...');
        const userProfile = await authCanisterService.getMyProfile();
        console.log('Fetched user profile:', userProfile);
        setProfile(userProfile);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setProfile(null);
      } finally {
        setProfileLoading(false);
      }
    };

    fetchProfile();
  }, [isAuthenticated, currentIdentity]);

  const handleLocationClick = () => {
    // setLocationSheetOpen(true);
  };

  const handleAddressMapClick = () => {
    // setLocationSheetOpen(false);
    // router.push('/client/service-maps');
  };

  const handleProfileClick = () => {
    // if (isAuthenticated) {
    //   router.push('/client/profile');
    // } else {
    //   router.push('/auth/login');
    // }
  };

  const handleNotificationClick = () => {
    router.push('/client/notifications');
  };

  // Extract first name from profile
  const displayName = profile?.name ? profile.name.split(' ')[0] : 'Guest';
  const isVerified = profile?.isVerified || false;

  return (
    <header className={`bg-white rounded-lg shadow-sm p-4 space-y-4 ${className}`}>
      {/* Top Row: Logo, Location, Profile & Notifications */}
      <div className="flex justify-between items-center">
        {/* Logo on the left */}
        <div className="flex-shrink-0">
          <Link href="/client/home" legacyBehavior>
            <a aria-label="Home">
              <Image 
                src="/logo.svg"
                alt="SRV Logo"
                width={40}
                height={40}
                className="rounded-full bg-white"
                priority
              />
            </a>
          </Link>
        </div>
        
        {/* Right side: Location, Profile, Notifications */}
        <div className="flex items-center space-x-3">
          {/* Location Badge */}
          <button 
            onClick={handleLocationClick}
            className="location-badge flex items-center bg-yellow-200 px-3 py-1 rounded-full shadow-sm hover:bg-yellow-300 transition-colors"
          >
            <span className="inline-flex items-center justify-center bg-blue-600 rounded-full p-1 mr-2">
              <MapPinIcon className="h-4 w-4 text-white" />
            </span>
            <div className="flex items-center overflow-hidden">
              <span className="text-sm font-medium truncate max-w-[120px] text-black">
                San Vicente, Baguio
              </span>
              <CheckCircleIcon className="h-3 w-3 text-green-500 ml-1 flex-shrink-0" />
            </div>
          </button>

          {/* Profile Button */}
          <button 
            onClick={handleProfileClick}
            className="flex items-center space-x-2 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
            disabled={profileLoading}
          >
            {profileLoading ? (
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-gray-400"></div>
            ) : profile?.profilePicture ? (
              <Image
                src={profile.profilePicture.imageUrl}
                alt="Profile"
                width={24}
                height={24}
                className="rounded-full"
              />
            ) : (
              <UserCircleIcon className="h-6 w-6 text-gray-600" />
            )}
          </button>

          {/* Notifications */}
          {isAuthenticated && notificationCount > 0 && (
            <button 
              onClick={handleNotificationClick}
              className="relative p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
            >
              <BellIcon className="h-5 w-5 text-gray-700" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {notificationCount > 99 ? '99+' : notificationCount}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Welcome Message */}
      {isAuthenticated && profile && !profileLoading && (
        <div className="welcome-section">
          <h1 className="font-nordique text-xl sm:text-2xl font-bold text-gray-800">
            Hello, {displayName}!
          </h1>
          <p className="font-nordique text-gray-600 text-sm">
            {isVerified ? '✓ Verified Client' : 'Find the perfect service for you'}
          </p>
        </div>
      )}

      {/* Guest Welcome Message */}
      {!isAuthenticated && (
        <div className="welcome-section">
          <h1 className="font-nordique text-xl sm:text-2xl font-bold text-gray-800">
            Welcome to SRV!
          </h1>
          <p className="font-nordique text-gray-600 text-sm">
            Discover amazing local services
          </p>
        </div>
      )}

      {/* Loading state for profile */}
      {isAuthenticated && profileLoading && (
        <div className="welcome-section">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-48 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-32"></div>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="w-full">
        <SearchBar 
          placeholder="Search for services"
          redirectToSearchResultsPage={true}
          servicesList={services}
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
          <h3 className="font-nordique font-medium text-gray-800 mb-1">Current Location</h3>
          <p className="font-nordique text-gray-600">San Vicente, Baguio, Cordillera Administrative Region</p>
        </div>
      </BottomSheet>
    </header>
  );
};

export default Header;
