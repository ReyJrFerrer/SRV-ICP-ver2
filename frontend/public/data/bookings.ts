import { ServicePackage, SERVICES } 
from './services'; 

export type BookingStatus = 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';

export interface Booking {
  id: string;
  userId: string; 

  serviceId: string;
  serviceSlug: string; 
  serviceName: string;
  providerName: string; 
  serviceImage: string; 

  bookingDate: string; 
  bookingTime: string; 
  
  duration?: string; 
  location: string; 
  priceDisplay?: string; 

  status: BookingStatus;
  selectedPackages: { id: string; name: string }[]; 
  concerns?: string;

  bookingType?: 'sameday' | 'scheduled'; 
  createdAt: string; 
  updatedAt?: string;
}

const getServiceDetailsForBooking = (serviceId: string) => {
  const service = SERVICES.find(s => s.id === serviceId);
  if (!service) {
    return {
        serviceSlug: 'unknown-service',
        serviceName: 'Unknown Service',
        providerName: 'Unknown Provider',
        serviceImage: '/images/default-placeholder.png', 
    };
  }
  return {
    serviceSlug: service.slug,
    serviceName: service.title, 
    providerName: service.name, 
    serviceImage: service.heroImage,
  };
};

export const MOCK_BOOKINGS: Booking[] = [
  {
    id: 'book-001',
    userId: 'user-123',
    serviceId: 'svc-001',
    ...getServiceDetailsForBooking('svc-001'), // Get service-specific details
    bookingDate: 'August 15, 2023', // More display-friendly date
    bookingTime: '09:00 AM',
    duration: '3 hours',
    location: 'Baguio City - Session Road',
    priceDisplay: '₱1050.00 (est.)', // Example price
    status: 'Confirmed',
    selectedPackages: [{ id: 'pkg1-1', name: 'Regular Cleaning (2hrs)' }, { id: 'pkg1-3', name: 'Laundry Service' }],
    concerns: 'Please focus on the living room and kitchen.',
    bookingType: 'scheduled',
    createdAt: new Date('2023-08-10T10:00:00Z').toISOString(),
  },
  {
    id: 'book-002',
    userId: 'user-123',
    serviceId: 'svc-002',
    ...getServiceDetailsForBooking('svc-002'),
    bookingDate: 'August 17, 2023',
    bookingTime: '02:00 PM',
    duration: '2 hours',
    location: 'Baguio City - Mines View Park',
    priceDisplay: '₱1700.00',
    status: 'Pending',
    selectedPackages: [{ id: 'pkg2-3', name: 'Drain Cleaning' }],
    bookingType: 'scheduled',
    createdAt: new Date('2023-08-15T11:30:00Z').toISOString(),
  },
  {
    id: 'book-003',
    userId: 'user-123',
    serviceId: 'svc-005',
    ...getServiceDetailsForBooking('svc-005'),
    bookingDate: 'August 5, 2023',
    bookingTime: '10:00 AM',
    duration: '1.5 hours',
    location: 'My Condo, Pasig',
    priceDisplay: '₱1125.00',
    status: 'Completed',
    selectedPackages: [{ id: 'pkg5-1', name: 'Appliance Repair Assessment' }],
    bookingType: 'scheduled',
    createdAt: new Date('2023-08-01T14:00:00Z').toISOString(),
  },

  {
    id: 'book-004',
    userId: 'user-123',
    serviceId: 'svc-004',
    ...getServiceDetailsForBooking('svc-004'),
    bookingDate: 'Same day', // For same day booking
    bookingTime: 'ASAP',
    duration: 'approx. 1 hour',
    location: 'My Office, Makati',
    priceDisplay: '₱800.00',
    status: 'Pending',
    selectedPackages: [{ id: 'pkg4-1', name: 'Haircut & Blowdry' }],
    bookingType: 'sameday',
    createdAt: new Date().toISOString(),
  },
];