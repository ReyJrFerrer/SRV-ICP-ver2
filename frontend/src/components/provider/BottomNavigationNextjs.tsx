import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { 
  HomeIcon, 
  ChatBubbleLeftRightIcon, 
  WrenchScrewdriverIcon 
} from '@heroicons/react/24/solid';

interface BottomNavigationProps {
  className?: string;
}

const BottomNavigationNextjs: React.FC<BottomNavigationProps> = ({ className = '' }) => {
  const router = useRouter();
  
  // Navigation items
  const navItems = [
    {
      label: 'Dashboard',
      icon: <HomeIcon className="h-6 w-6" />,
      href: '/provider/home'
    },
    {
      label: 'Chat',
      icon: <ChatBubbleLeftRightIcon className="h-6 w-6" />,
      href: '/provider/chat'
    },
    {
      label: 'Services',
      icon: <WrenchScrewdriverIcon className="h-6 w-6" />,
      href: '/provider/services'
    }
  ];
  
  return (
    <nav className={`bottom-nav ${className}`}>
      {navItems.map((item) => {
        const isActive = router.pathname === item.href;
        
        return (
          <Link key={item.href} href={item.href}>
            <div className={`nav-item ${isActive ? 'active' : ''}`}>
              {item.icon}
              <span className="text-xs mt-1">{item.label}</span>
            </div>
          </Link>
        );
      })}
    </nav>
  );
};

export default BottomNavigationNextjs;
