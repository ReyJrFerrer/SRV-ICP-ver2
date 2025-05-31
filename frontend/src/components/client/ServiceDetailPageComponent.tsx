import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { Service } from '../../../assets/types/service/service'; // TODO: To apply backend func

interface ServiceDetailPageComponentProps {
  service: Service | null;
}

// Service Hero Image Component
const ServiceHeroImage: React.FC<{ service: Service }> = ({ service }) => (
  <div className="w-full h-48 md:h-64 lg:h-96 overflow-hidden relative">
    <Image 
      src={service.heroImage || '/images/default-service.png'} 
      alt={service.title || service.name} 
      width={1200} 
      height={400} 
      className="w-full h-full object-cover"
      priority
    />
    {/* Gradient overlay for better text readability */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent lg:from-black/20"></div>
    
    {/* Hero content overlay for desktop */}
    <div className="hidden lg:block absolute bottom-6 left-8 text-white">
      <h1 className="text-3xl font-bold mb-2">{service.title || service.name}</h1>
      <p className="text-lg opacity-90">{service.category.name}</p>
    </div>
  </div>
);

// Service Info Section Component
const ServiceInfoSection: React.FC<{ service: Service }> = ({ service }) => (
  <div className="card mb-6">
    {/* Title only shown on mobile/tablet, hidden on desktop due to hero overlay */}
    <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-3 lg:hidden">{service.title || service.name}</h2>
    <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-6">{service.description}</p>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="flex items-start">
        <span className="text-xl mr-3 mt-0.5">💰</span>
        <div>
          <span className="font-medium text-gray-800 block">Price</span>
          <span className="text-lg font-semibold text-green-600">
            {service.price.currency === 'PHP' ? '₱' : service.price.currency}
            {service.price.amount.toFixed(2)} {service.price.unit}
          </span>
          {service.price.isNegotiable && (
            <span className="block text-xs text-gray-500 mt-1">(Negotiable)</span>
          )}
        </div>
      </div>

      <div className="flex items-start">
        <span className="text-xl mr-3 mt-0.5">📍</span>
        <div>
          <span className="font-medium text-gray-800 block">Location</span>
          <span className="text-sm text-gray-600 block">
            {service.location.address}
          </span>
          <span className="text-xs text-gray-500 block mt-1">
            Service Radius: {service.location.serviceRadius}{service.location.serviceRadiusUnit}
          </span>
        </div>
      </div>
    </div>
  </div>
);

// Service Availability Section Component
const ServiceAvailabilitySection: React.FC<{ service: Service }> = ({ service }) => (
  <div className="card mb-6">
    <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-4 flex items-center">
      <span className="text-xl mr-2">📅</span>
      Availability
    </h3>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <span className="font-medium text-gray-800 block mb-2">Schedule</span>
        <div className="flex flex-wrap gap-1">
          {service.availability.schedule.map((day, index) => (
            <span key={index} className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
              {day}
            </span>
          ))}
        </div>
      </div>
      
      <div>
        <span className="font-medium text-gray-800 block mb-2">Hours</span>
        <div className="flex flex-wrap gap-1">
          {service.availability.timeSlots.map((slot, index) => (
            <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
              {slot}
            </span>
          ))}
        </div>
      </div>
    </div>
    
    <div className="mt-4 pt-4 border-t border-gray-100">
      <div className={`flex items-center text-sm font-medium ${service.availability.isAvailableNow ? 'text-green-600' : 'text-red-600'}`}>
        <span className="text-lg mr-2">
          {service.availability.isAvailableNow ? '✅' : '⏰'}
        </span>
        {service.availability.isAvailableNow ? "Available Now" : "Currently Busy"}
      </div>
    </div>
  </div>
);

// Service Rating Section Component
const ServiceRatingSection: React.FC<{ service: Service }> = ({ service }) => (
  <div className="card mb-6">
    <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-4 flex items-center">
      <span className="text-xl mr-2">⭐</span>
      Rating & Reviews
    </h3>
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <span className="text-3xl font-bold text-yellow-500 mr-2">{service.rating.average.toFixed(1)}</span>
        <div>
          <div className="flex text-yellow-400 mb-1">
            {[...Array(5)].map((_, i) => (
              <span key={i} className={i < Math.floor(service.rating.average) ? 'text-yellow-400' : 'text-gray-300'}>
                ★
              </span>
            ))}
          </div>
          <p className="text-sm text-gray-600">{service.rating.count} reviews</p>
        </div>
      </div>
      <button className="btn-secondary text-sm px-4 py-2">
        View Reviews
      </button>
    </div>
  </div>
);

// Service Requirements Section Component
const ServiceRequirementsSection: React.FC<{ service: Service }> = ({ service }) => (
  <div className="card mb-6">
    <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-4 flex items-center">
      <span className="text-xl mr-2">📋</span>
      Requirements
    </h3>
    {service.requirements && service.requirements.length > 0 ? (
      <ul className="space-y-2">
        {service.requirements.map((req, index) => (
          <li key={index} className="flex items-start">
            <span className="text-green-500 mr-2 mt-0.5">•</span>
            <span className="text-sm md:text-base text-gray-600">{req}</span>
          </li>
        ))}
      </ul>
    ) : (
      <ul className="space-y-2">
        <li className="flex items-start">
          <span className="text-green-500 mr-2 mt-0.5">•</span>
          <span className="text-sm md:text-base text-gray-600">Service provider will discuss requirements during booking</span>
        </li>
        <li className="flex items-start">
          <span className="text-green-500 mr-2 mt-0.5">•</span>
          <span className="text-sm md:text-base text-gray-600">Please provide detailed description of your needs</span>
        </li>
        <li className="flex items-start">
          <span className="text-green-500 mr-2 mt-0.5">•</span>
          <span className="text-sm md:text-base text-gray-600">Ensure availability at scheduled time</span>
        </li>
      </ul>
    )}
  </div>
);

// Service Verification Section Component
const ServiceVerificationSection: React.FC<{ isVerified: boolean }> = ({ isVerified }) => (
  <div className="card mb-6 lg:mb-0 lg:p-0 lg:bg-transparent lg:shadow-none lg:border-0">
    <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-4 flex items-center lg:hidden">
      <span className="text-xl mr-2">🛡️</span>
      Verification Status
    </h3>
    <div className={`flex items-center justify-between p-3 rounded-lg ${isVerified ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'} lg:p-2`}>
      <div className="flex items-center">
        <span className={`text-lg mr-3 lg:mr-2 ${isVerified ? 'text-green-600' : 'text-yellow-600'}`}>
          {isVerified ? '✅' : '⚠️'}
        </span>
        <div>
          <span className={`font-medium text-sm lg:text-xs ${isVerified ? 'text-green-800' : 'text-yellow-800'}`}>
            {isVerified ? "Verified Provider" : "Pending Verification"}
          </span>
          <p className={`text-xs lg:text-xs ${isVerified ? 'text-green-600' : 'text-yellow-600'} mt-1 lg:hidden`}>
            {isVerified 
              ? "This provider has been verified by our team" 
              : "Verification process is ongoing"
            }
          </p>
        </div>
      </div>
      {isVerified && (
        <span className="text-green-600 text-xl lg:text-sm">🏆</span>
      )}
    </div>
  </div>
);

// Service Images Section Component
const ServiceImagesSection: React.FC<{ service: Service }> = ({ service }) => (
  <div className="card mb-6">
    <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-4 flex items-center">
      <span className="text-xl mr-2">🖼️</span>
      Service Gallery
    </h3>
    {service.media && service.media.length > 0 ? (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {service.media.map((mediaItem, index) => (
          <div key={index} className="aspect-square rounded-lg overflow-hidden border border-gray-200 hover:shadow-md transition-shadow duration-200 cursor-pointer">
            <Image
              src={mediaItem.url as string}
              alt={`${service.title} gallery image ${index + 1}`}
              width={120}
              height={120}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
            />
          </div>
        ))}
      </div>
    ) : (
      <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
        <span className="text-4xl mb-2 block">📷</span>
        <p className="text-sm">No additional images available.</p>
        <p className="text-xs text-gray-400 mt-1">Images will be added by the service provider</p>
      </div>
    )}
  </div>
);

// Placeholder Service Data
const createPlaceholderService = (): Service => ({
  id: 'placeholder-service',
  providerId: 'placeholder-provider',
  name: 'Service Provider',
  title: 'Professional Service',
  description: 'This service provider offers professional services. Detailed information will be available once connected to the backend.',
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
  price: {
    amount: 1000,
    currency: 'PHP',
    unit: '/ Hour',
    isNegotiable: true
  },
  location: {
    address: 'Baguio City, Philippines',
    coordinates: {
      latitude: 16.4095,
      longitude: 120.5975
    },
    serviceRadius: 10,
    serviceRadiusUnit: 'km'
  },
  availability: {
    schedule: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    timeSlots: ['09:00-17:00'],
    isAvailableNow: true
  },
  rating: {
    average: 4.5,
    count: 15
  },
  media: [],
  requirements: [
    'Please provide service details during booking',
    'Ensure availability at scheduled time',
    'Payment terms will be discussed'
  ],
  isVerified: false,
  slug: 'placeholder-service',
  heroImage: '/images/default-service.png',
  category: {
    id: 'cat-placeholder',
    name: 'General Services',
    description: 'General professional services',
    slug: 'general-services',
    icon: 'service',
    imageUrl: '/images/default-category.png',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
});

// Main Service Detail Component
const ServiceDetailPageComponent: React.FC<ServiceDetailPageComponentProps> = ({ service }) => {
  const router = useRouter();

  // Use placeholder service if no service is provided
  const displayService = service || createPlaceholderService();

  const handleBookingRequest = () => {
    // Navigate to booking page with the service slug (works for both real and placeholder data)
    router.push(`/client/book/${displayService.slug}`);
  };

  return (
    <div className="bg-gray-50">
      <ServiceHeroImage service={displayService} />
      
      {/* Content Layout - Full width like home.tsx */}
      <div className="px-4 pt-4 pb-16 lg:px-8 lg:pt-8">
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <ServiceInfoSection service={displayService} />
            <ServiceRatingSection service={displayService} />
            <ServiceAvailabilitySection service={displayService} />
            <ServiceRequirementsSection service={displayService} />
            <ServiceImagesSection service={displayService} />
          </div>
          
          {/* Sidebar for desktop */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-32 space-y-6">
              {/* Service Provider Info Card */}
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Service Provider</h3>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-semibold text-lg">
                      {displayService.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{displayService.name}</p>
                    <p className="text-sm text-gray-600">{displayService.category.name}</p>
                  </div>
                </div>
                <ServiceVerificationSection isVerified={displayService.isVerified} />
              </div>

              {/* Booking Action Card */}
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Book This Service</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Price</span>
                    <span className="font-semibold text-lg text-green-600">
                      {displayService.price.currency === 'PHP' ? '₱' : displayService.price.currency}
                      {displayService.price.amount.toFixed(2)}
                      <span className="text-sm text-gray-500 ml-1">{displayService.price.unit}</span>
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Availability</span>
                    <span className={`font-medium ${displayService.availability.isAvailableNow ? 'text-green-600' : 'text-red-600'}`}>
                      {displayService.availability.isAvailableNow ? 'Available Now' : 'Currently Busy'}
                    </span>
                  </div>
                  <button 
                    onClick={handleBookingRequest} 
                    className="w-full btn-primary text-center"
                  >
                    Send Booking Request
                  </button>
                  {displayService.price.isNegotiable && (
                    <p className="text-xs text-gray-500 text-center">Price is negotiable</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile booking button - Only visible on mobile */}
      <div className="lg:hidden fixed bottom-16 left-0 right-0 p-4 bg-white border-t border-gray-200 z-50">
        <button 
          onClick={handleBookingRequest} 
          className="w-full btn-primary text-center"
        >
          Send Booking Request
        </button>
      </div>
    </div>
  );
};

export default ServiceDetailPageComponent;
