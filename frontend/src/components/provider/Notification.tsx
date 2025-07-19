import React, { useState } from 'react';
import { ChevronLeftIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import {
  ExclamationCircleIcon,
  CheckCircleIcon,
  ClockIcon,
  TruckIcon,
  CalendarDaysIcon,
  BellIcon
} from '@heroicons/react/24/outline';
import Image from 'next/image';

// Defines the structure for a notification object
interface Notification {
  id: string;
  type: 'work_complete' | 'work_started' | 'on_the_way' | 'appointment_confirmed';
  title: string;
  message: string;
  timeAgo: string;
}

// Hardcoded data to populate the notifications list
const notifications: Notification[] = [
  {
    id: '1',
    type: 'work_complete',
    title: 'Work complete',
    message: 'Rate your service provider.',
    timeAgo: '25 mins ago',
  },
  {
    id: '2',
    type: 'work_started',
    title: 'Work has started',
    message: 'Your provider is now working on your request.',
    timeAgo: '2 hours ago',
  },
  {
    id: '3',
    type: 'on_the_way',
    title: 'Your service provider is on the way!',
    message: 'Heads up! Juan, your appliance technician is on the way. Get ready for your scheduled appointment.',
    timeAgo: '2 hours ago',
  },
  {
    id: '4',
    type: 'appointment_confirmed',
    title: 'Appointment confirmed!',
    message: 'Your Appliance Technician service for July 06, 2026 at 3:00 PM has been approved.',
    timeAgo: '2 days ago',
  },
];

const NotificationsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'All' | 'Read' | 'Unread'>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Function to get the correct icon based on notification type
  const getIconForType = (type: Notification['type']) => {
    switch (type) {
      case 'work_complete':
        return <CheckCircleIcon className="w-6 h-6 text-yellow-600" />;
      case 'work_started':
        return <ClockIcon className="w-6 h-6 text-gray-500" />;
      case 'on_the_way':
        return <TruckIcon className="w-6 h-6 text-blue-600" />;
      case 'appointment_confirmed':
        return <CalendarDaysIcon className="w-6 h-6 text-green-600" />;
      default:
        return <ExclamationCircleIcon className="w-6 h-6 text-gray-500" />;
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredNotifications = notifications.filter(notification =>
    notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    notification.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-black text-gray-900 dark:text-white">
      <div className="flex flex-col w-full max-w-md mx-auto bg-white dark:bg-gray-900 shadow-lg">
        {/* Header */}
        <header className="flex items-center justify-between p-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
          <ChevronLeftIcon className="w-6 h-6 text-gray-600 dark:text-gray-400 cursor-pointer" />
          <div className="flex-grow flex justify-center -translate-x-3">
            {/* Using a placeholder for the SRV logo */}
            <div className="relative w-12 h-12">
              <BellIcon className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 space-y-6">
          <h1 className="text-2xl font-bold">Notifications</h1>
          
          {/* Search Bar */}
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search for notification"
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>

          {/* Tabs */}
          <div className="flex items-center p-1 bg-gray-200 dark:bg-gray-800 rounded-full text-sm font-medium">
            <button
              onClick={() => setActiveTab('All')}
              className={`flex-1 py-2 rounded-full transition-all ${
                activeTab === 'All' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveTab('Read')}
              className={`flex-1 py-2 rounded-full transition-all ${
                activeTab === 'Read' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              Read
            </button>
            <button
              onClick={() => setActiveTab('Unread')}
              className={`flex-1 py-2 rounded-full transition-all ${
                activeTab === 'Unread' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              Unread
            </button>
          </div>

          {/* Notifications List */}
          <div className="space-y-4">
            <div className="flex justify-between items-baseline text-sm font-semibold">
              <span className="text-gray-500">Recent</span>
              <button className="text-blue-600 font-medium">Mark all as read</button>
            </div>

            {/* Notification Cards */}
            {filteredNotifications.map((notification) => (
              <div key={notification.id} className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
                    {getIconForType(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <h3 className="text-base font-semibold">{notification.title}</h3>
                      <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                        {notification.timeAgo}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{notification.message}</p>
                    
                    {/* Action buttons based on notification type */}
                    {notification.type === 'work_complete' ? (
                      <div className="flex space-x-2 mt-3">
                        <button className="flex-1 py-2 px-4 text-sm font-medium border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                          View details
                        </button>
                        <button className="flex-1 py-2 px-4 text-sm font-medium bg-yellow-400 text-gray-800 rounded-lg hover:bg-yellow-500 transition-colors">
                          Rate service
                        </button>
                      </div>
                    ) : (
                      <div className="mt-3">
                        <button className="w-full py-2 px-4 text-sm font-medium border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                          View details
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default NotificationsPage;