import React, { useState, useEffect } from 'react';
import { MapPinIcon } from '@heroicons/react/24/solid';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from "@bundly/ares-react";
import SearchBar from './SearchBarNextjs';
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
  
  const { services } = useAllServicesWithProviders();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!isAuthenticated || !currentIdentity) {
        setProfile(null);
        return;
      }

      setProfileLoading(true);
      try {
        const userProfile = await authCanisterService.getMyProfile();
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

  const displayName = profile?.name ? profile.name.split(' ')[0] : 'Guest';
  const isVerified = profile?.isVerified || false;

  return (
    <header className={`bg-white rounded-lg shadow-sm p-4 space-y-4 ${className}`}>
      {/* Top Row: Logo + Home | Logout*/}
      <div className="flex justify-between items-center">
        <Link href="/client/home" legacyBehavior>
          <a aria-label="Home" className="flex items-center">
            <Image 
              src="/logo.svg"
              alt="SRV Logo"
              width={100}
              height={40}
              className="object-contain"
            />
          </a>
        </Link>
        <Link href="/logout" className="text-gray-700">Logout</Link>
      </div>

      {/* Location Section */}
      <div className="bg-yellow-200 p-4 rounded-lg">
        <p className="text-sm font-medium text-gray-800">My Location</p>
        <div className="flex items-center">
          <MapPinIcon className="h-5 w-5 text-gray-700 mr-2" />
          <span className="text-gray-800">
            San Vicente, Baguio, Cordillera Administrative Region
          </span>
        </div>

        {/* Search Bar with padding above */}
        <div className="w-full mt-4">
          <SearchBar 
            placeholder="Search for service"
            redirectToSearchResultsPage={true}
            servicesList={services}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
