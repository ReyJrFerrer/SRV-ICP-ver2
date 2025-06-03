import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { HomeIcon, CalendarIcon, ChatBubbleLeftRightIcon, ClockIcon, Cog6ToothIcon} from '@heroicons/react/24/outline';
import { HomeIcon as HomeIconSolid, CalendarIcon as CalendarIconSolid, ChatBubbleLeftRightIcon as ChatIconSolid, ClockIcon as ClockIconSolid, Cog6ToothIcon as CogToothIconSolid} from '@heroicons/react/24/solid';

const BottomNavigation: React.FC = () => {
  const router = useRouter();
  const currentPath = router.pathname;
  
  const isActive = (path: string) => {
    return currentPath.startsWith(path);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg z-40">
      <div className="flex justify-around items-center h-16">
        <Link href="/client/home" className="flex flex-col items-center justify-center w-full h-full">
          <div className={`flex flex-col items-center ${isActive('/client/home') ? 'text-blue-600' : 'text-gray-500'}`}>
            <div className={`p-2 rounded-full ${isActive('/client/home') ? 'bg-blue-100' : ''}`}>
              {isActive('/client/home') ? (
                <HomeIconSolid className="h-6 w-6" />
              ) : (
                <HomeIcon className="h-6 w-6" />
              )}
            </div>
            <span className="text-xs mt-1">Home</span>
          </div>
        </Link>
        
        <Link href="/client/bookings" className="flex flex-col items-center justify-center w-full h-full">
          <div className={`flex flex-col items-center ${isActive('/client/bookings') ? 'text-blue-600' : 'text-gray-500'}`}>
            <div className={`p-2 rounded-full ${isActive('/client/bookings') ? 'bg-blue-100' : ''}`}>
              {isActive('/client/bookings') ? (
                <CalendarIconSolid className="h-6 w-6" />
              ) : (
                <CalendarIcon className="h-6 w-6" />
              )}
            </div>
            <span className="text-xs mt-1">Bookings</span>
          </div>
        </Link>

        <Link href="/client/chat" className="flex flex-col items-center justify-center w-full h-full">
          <div className={`flex flex-col items-center ${isActive('/client/chat') ? 'text-blue-600' : 'text-gray-500'}`}>
            <div className={`p-2 rounded-full ${isActive('/client/chat') ? 'bg-blue-100' : ''}`}>
              {isActive('/client/chat') ? (
                <ChatIconSolid className="h-6 w-6" />
              ) : (
                <ChatBubbleLeftRightIcon className="h-6 w-6" />
              )}
            </div>
            <span className="text-xs mt-1">Chat</span>
          </div>
        </Link>

        <Link href="/client/history" className="flex flex-col items-center justify-center w-full h-full">
          <div className={`flex flex-col items-center ${isActive('/client/history') ? 'text-blue-600' : 'text-gray-500'}`}>
            <div className={`p-2 rounded-full ${isActive('/client/history') ? 'bg-blue-100' : ''}`}>
              {isActive('/client/history') ? (
                <ClockIconSolid className="h-6 w-6" />
              ) : (
                <ClockIcon className="h-6 w-6" />
              )}
            </div>
            <span className="text-xs mt-1">History</span>
          </div>
        </Link>

        <Link href="/client/settings" className="flex flex-col items-center justify-center w-full h-full">
          <div className={`flex flex-col items-center ${isActive('/client/settings') ? 'text-blue-600' : 'text-gray-500'}`}>
            <div className={`p-2 rounded-full ${isActive('/client/settings') ? 'bg-blue-100' : ''}`}>
              {isActive('/client/settings') ? (
                <CogToothIconSolid className="h-6 w-6" />
              ) : (
                <Cog6ToothIcon className="h-6 w-6" />
              )}
            </div>
            <span className="text-xs mt-1">Settings</span>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default BottomNavigation;