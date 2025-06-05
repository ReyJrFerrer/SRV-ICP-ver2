import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { HomeIcon, ClipboardDocumentListIcon } from '@heroicons/react/24/outline'; 
import { HomeIcon as HomeIconSolid, ClipboardDocumentListIcon as ClipboardDocumentListIconSolid } from '@heroicons/react/24/solid'; // Changed Chat icon to ClipboardDocumentListIconSolid

const BottomNavigation: React.FC = () => {
  const router = useRouter();
  const currentPath = router.pathname;
  
  const isActive = (path: string) => {
    return currentPath === path || currentPath.startsWith(path + '/');
  };

  const navItems = [
    {
      label: 'Home',
      href: '/client/home',
      icon: HomeIcon,
      iconSolid: HomeIconSolid,
      activeCheckPath: '/client/home', 
    },
    {
      label: 'My Bookings', 
      href: '/client/bookings',  
      icon: ClipboardDocumentListIcon, 
      iconSolid: ClipboardDocumentListIconSolid, 
      activeCheckPath: '/client/bookings', 
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-top-md z-40"> {/* Added shadow-top-md for better visibility */}
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const active = isActive(item.activeCheckPath);
          const IconComponent = active ? item.iconSolid : item.icon;
          return (
            <Link key={item.label} href={item.href} legacyBehavior>
              <a className={`flex flex-col items-center justify-center w-full h-full pt-1 pb-0.5 transition-colors duration-200 ease-in-out group ${active ? 'text-blue-600' : 'text-gray-500 hover:text-blue-500'}`}>
                <IconComponent className="h-6 w-6 mb-0.5" />
                <span className={`text-xs ${active ? 'font-semibold' : 'font-normal'}`}>{item.label}</span>
              </a>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;