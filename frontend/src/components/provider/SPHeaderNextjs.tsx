import React from "react";
import {
  MapPinIcon,
  BellIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/solid";
import Image from "next/image";
import { useRouter } from "next/router";
import { FrontendProfile } from "../../services/authCanisterService";
import { useAuth } from "@bundly/ares-react";
import { useLogout } from "../../hooks/logout";

interface SPHeaderProps {
  provider: FrontendProfile | null;
  notificationCount?: number;
  className?: string;
}

const SPHeaderNextjs: React.FC<SPHeaderProps> = ({
  provider,
  notificationCount = 0,
  className = "",
}) => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { logout, isLoggingOut } = useLogout(); // Use the hook

  const handleLogout = () => {
    logout();
  };

  if (!provider) {
    return (
      <header className={`provider-header bg-yellow-280 ${className}`}>
        <div className="flex justify-center items-center py-4">
          <div className="animate-pulse">
            <div className="h-8 bg-yellow-200 rounded w-48"></div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className={`provider-header bg-white p-4 ${className} space-y-4`}>
      {/* Top Row: Welcome Info & Actions */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Image
            src="/logo.svg"
            alt="Logo"
            width={100}
            height={100}
            className="rounded-full bg-white flex-shrink-0"
            priority
          />
        </div>

        <div className="flex items-center space-x-4">
          {/* Notifications Button (on the left) */}
          <button className="relative p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
            <BellIcon className="h-6 w-6 text-gray-700" />
            {notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {notificationCount > 99 ? "99+" : notificationCount}
              </span>
            )}
          </button>

          {/* Logout Button (on the right) */}
          {isAuthenticated && (
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="p-3 flex items-center justify-center bg-gray-100 rounded-full hover:bg-red-100 text-gray-600 hover:text-red-600 transition-colors disabled:opacity-50"
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

      {/* Bottom Row: Expanded Location Bar */}
    </header>
  );
};

export default SPHeaderNextjs;
