import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';

// Provider Components
import SPHeaderNextjs from '@app/components/provider/SPHeaderNextjs';
import ProviderStatsNextjs from '@app/components/provider/ProviderStatsNextjs';
import BookingRequestsNextjs from '@app/components/provider/BookingRequestsNextjs';
import ServiceManagementNextjs from '@app/components/provider/ServiceManagementNextjs';
import AvailabilityManagementNextjs from '@app/components/provider/AvailabilityManagementNextjs';
import CredentialsDisplayNextjs from '@app/components/provider/CredentialsDisplayNextjs';
import BottomNavigationNextjs from '@app/components/provider/BottomNavigationNextjs';

// Define local types for service provider data
interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  isActive: boolean;
  rating?: number;
}

interface Availability {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

interface Credential {
  id: string;
  name: string;
  isVerified: boolean;
  dateVerified?: string;
  documentUrl?: string;
}

interface BookingRequest {
  id: string;
  customerName: string;
  customerAvatar?: string;
  serviceId: string;
  serviceName: string;
  date: string;
  time: string;
  status: 'pending' | 'accepted' | 'declined' | 'completed';
  price: number;
}

interface EarningSummary {
  totalEarningsThisMonth: number;
  totalEarningsLastMonth: number;
  pendingPayouts: number;
}

interface ServiceProvider {
  id: string;
  name: string;
  email: string;
  phone: string;
  profileImage: string;
  bio: string;
  address: string;
  joinDate: string;
  rating: number;
  totalReviews: number;
  totalEarnings: number;
  totalJobs: number;
  completionRate: number;
  earningSummary: EarningSummary;
  services: Service[];
  availability: Availability[];
  credentials: Credential[];
  bookingRequests: BookingRequest[];
}

// Define interface for component props
interface ProviderHomePageProps {
  // Props if needed
}

// Create fallback/mock data
const mockProviderData: ServiceProvider = {
  id: 'sp1',
  name: 'Mary Gold',
  email: 'mary.gold@example.com',
  phone: '+1 234 567 8901',
  profileImage: 'https://randomuser.me/api/portraits/women/22.jpg',
  bio: 'Professional service provider with 5+ years of experience in beauty and wellness.',
  address: '123 Main St, Anytown, USA',
  joinDate: '2023-01-15',
  rating: 4.8,
  totalReviews: 127,
  totalEarnings: 12500,
  totalJobs: 142,
  completionRate: 98,
  earningSummary: {
    totalEarningsThisMonth: 1850.00,
    totalEarningsLastMonth: 2100.50,
    pendingPayouts: 925.75
  },
  services: [
    {
      id: 'svc1',
      name: 'Hair Styling',
      description: 'Professional hair styling for all occasions.',
      price: 75,
      category: 'Beauty',
      imageUrl: 'https://example.com/hair-styling.jpg',
      isActive: true,
      rating: 4.9
    },
    {
      id: 'svc2',
      name: 'Makeup Application',
      description: 'Professional makeup for events and photoshoots.',
      price: 90,
      category: 'Beauty',
      imageUrl: 'https://example.com/makeup.jpg',
      isActive: true,
      rating: 4.7
    }
  ],
  availability: [
    {
      id: 'av1',
      day: 'Monday',
      startTime: '09:00',
      endTime: '17:00',
      isAvailable: true
    },
    {
      id: 'av2',
      day: 'Tuesday',
      startTime: '09:00',
      endTime: '17:00',
      isAvailable: true
    },
    {
      id: 'av3',
      day: 'Wednesday',
      startTime: '09:00',
      endTime: '17:00',
      isAvailable: true
    },
    {
      id: 'av4',
      day: 'Thursday',
      startTime: '09:00',
      endTime: '17:00',
      isAvailable: true
    },
    {
      id: 'av5',
      day: 'Friday',
      startTime: '09:00',
      endTime: '17:00',
      isAvailable: true
    }
  ],
  credentials: [
    {
      id: 'cred1',
      name: 'Cosmetology License',
      isVerified: true,
      dateVerified: '2023-02-10',
      documentUrl: 'https://example.com/license.pdf'
    },
    {
      id: 'cred2',
      name: 'Professional Certification',
      isVerified: true,
      dateVerified: '2023-03-15',
      documentUrl: 'https://example.com/certification.pdf'
    }
  ],
  bookingRequests: [
    {
      id: 'br1',
      customerName: 'John Smith',
      customerAvatar: 'https://randomuser.me/api/portraits/men/43.jpg',
      serviceId: 'svc1',
      serviceName: 'Hair Styling',
      date: '2025-06-05',
      time: '10:00',
      status: 'pending',
      price: 75
    },
    {
      id: 'br2',
      customerName: 'Emily Jones',
      customerAvatar: 'https://randomuser.me/api/portraits/women/33.jpg',
      serviceId: 'svc2',
      serviceName: 'Makeup Application',
      date: '2025-06-07',
      time: '14:00',
      status: 'accepted',
      price: 90
    },
    {
      id: 'br3',
      customerName: 'Sarah Williams',
      customerAvatar: 'https://randomuser.me/api/portraits/women/17.jpg',
      serviceId: 'svc1',
      serviceName: 'Hair Styling',
      date: '2025-06-04',
      time: '11:30',
      status: 'completed',
      price: 75
    }
  ]
};

const ProviderHomePage: React.FC<ProviderHomePageProps> = () => {
  const [provider, setProvider] = useState<ServiceProvider | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch with a short timeout
    const timer = setTimeout(() => {
      setProvider(mockProviderData);
      setLoading(false);
    }, 800); // Short delay to simulate loading

    return () => clearTimeout(timer);
  }, []);

  if (loading || !provider) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Service Provider Dashboard | SRV-ICP</title>
        <meta name="description" content="Manage your services, bookings, and earnings" />
      </Head>
      
      <div className="pb-20 bg-gray-50 min-h-screen">
        {/* Header Section */}
        <SPHeaderNextjs provider={provider} notificationCount={3} />
        
        <div className="p-4 max-w-6xl mx-auto">
          {/* Dashboard Statistics */}
          <ProviderStatsNextjs provider={provider} />
          
          {/* Booking Requests & Upcoming Jobs */}
          <BookingRequestsNextjs provider={provider} />
          
          {/* Services Management */}
          <ServiceManagementNextjs provider={provider} />
          
          {/* Availability Management */}
          <AvailabilityManagementNextjs provider={provider} />
          
          {/* Credentials & Verification */}
          <CredentialsDisplayNextjs provider={provider} />
        </div>
        
        {/* Bottom Navigation */}
        <BottomNavigationNextjs />
      </div>
    </>
  );
};

export default ProviderHomePage;
