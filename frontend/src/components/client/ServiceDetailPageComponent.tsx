import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { Service } from '../../../assets/types/service/service'; // Includes ServiceAvailability
import { DayOfWeek, ServiceAvailability } from '../../../assets/types/service/service-availability'; // Import for clarity and types
import { StarIcon as StarSolid } from '@heroicons/react/24/solid'; // Assuming you use solid stars for display

// --- Helper Functions  ---
const parseTimeSlot = (timeSlot: string): { start: { hours: number, minutes: number }, end: { hours: number, minutes: number } } | null => {
  const parts = timeSlot.split('-');
  if (parts.length !== 2) return null;
  const [startTime, endTime] = parts;
  const [startHours, startMinutes] = startTime.split(':').map(Number);
  const [endHours, endMinutes] = endTime.split(':').map(Number);

  if (isNaN(startHours) || isNaN(startMinutes) || isNaN(endHours) || isNaN(endMinutes)) {
    return null;
  }
  return {
    start: { hours: startHours, minutes: startMinutes },
    end: { hours: endHours, minutes: endMinutes }
  };
};

const isWithinScheduledHours = (
  availability: ServiceAvailability,
  currentDateTime: Date
): boolean => {
  const dayNames: DayOfWeek[] = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const currentDayName = dayNames[currentDateTime.getDay()];

  if (!availability.schedule.some(scheduledDay => scheduledDay.toLowerCase() === currentDayName.toLowerCase())) {
    return false;
  }

  const currentHours = currentDateTime.getHours();
  const currentMinutes = currentDateTime.getMinutes();

  for (const slotStr of availability.timeSlots) {
    const slot = parseTimeSlot(slotStr);
    if (slot) {
      const isAfterStart = currentHours > slot.start.hours || (currentHours === slot.start.hours && currentMinutes >= slot.start.minutes);
      const isBeforeEnd = currentHours < slot.end.hours || (currentHours === slot.end.hours && currentMinutes < slot.end.minutes);
      if (isAfterStart && isBeforeEnd) {
        return true;
      }
    }
  }
  return false;
};
// --- End Helper Functions ---

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
    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent lg:from-black/20"></div>
    <div className="hidden lg:block absolute bottom-6 left-8 text-white">
      <h1 className="text-3xl font-bold mb-2">{service.title || service.name}</h1>
      <p className="text-lg opacity-90">{service.category.name}</p>
    </div>
  </div>
);

// Service Info Section Component
const ServiceInfoSection: React.FC<{ service: Service }> = ({ service }) => (
  <div className="card mb-6">
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

// Service Availability Section Component (Utilizes effective status)
const ServiceAvailabilitySection: React.FC<{ 
  availability: ServiceAvailability, 
  effectiveStatusText: string, 
  isEffectivelyAvailable: boolean 
}> = ({ availability, effectiveStatusText, isEffectivelyAvailable }) => (
  <div className="card mb-6">
    <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-4 flex items-center">
      <span className="text-xl mr-2">📅</span>
      Availability
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <span className="font-medium text-gray-800 block mb-2">Schedule</span>
        <div className="flex flex-wrap gap-1">
          {availability.schedule.map((day, index) => (
            <span key={index} className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
              {day}
            </span>
          ))}
        </div>
      </div>
      <div>
        <span className="font-medium text-gray-800 block mb-2">Hours</span>
        <div className="flex flex-wrap gap-1">
          {availability.timeSlots.map((slot, index) => (
            <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
              {slot}
            </span>
          ))}
        </div>
      </div>
    </div>
    <div className="mt-4 pt-4 border-t border-gray-100">
      <div className={`flex items-center text-sm font-medium ${isEffectivelyAvailable ? 'text-green-600' : 'text-red-600'}`}>
        <span className="text-lg mr-2">
          {isEffectivelyAvailable ? '✅' : (effectiveStatusText === 'Rest Day' ? '😴' : '⏰')}
        </span>
        {effectiveStatusText}
      </div>
    </div>
  </div>
);

// Service Rating Section Component
const ServiceRatingSection: React.FC<{ service: Service; onReviewClick: () => void }> = ({ service, onReviewClick }) => (
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
              <StarSolid
                key={i} 
                className={`h-5 w-5 ${i < Math.floor(service.rating.average) ? 'text-yellow-400' : 'text-gray-300'}`}
              />
            ))}
          </div>
          <p className="text-sm text-gray-600">{service.rating.count} reviews</p>
        </div>
      </div>
      <button 
        onClick={onReviewClick}
        className="btn-secondary text-sm px-4 py-2" 
      >
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
              src={mediaItem.url as string} // Assuming URL is a string path or StaticImageData
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
  name: 'Placeholder Provider',
  title: 'Placeholder Service Title',
  description: 'This is a placeholder service description. Availability checks will apply.',
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
  price: { amount: 100, currency: 'PHP', unit: '/hr', isNegotiable: false },
  location: { address: 'Anytown, Philippines', coordinates: { latitude: 14.0, longitude: 121.0 }, serviceRadius: 5, serviceRadiusUnit: 'km' },
  availability: {
    schedule: ['Monday', 'Wednesday', 'Friday'], // Works Mon, Wed, Fri
    timeSlots: ['09:00-12:00', '14:00-17:00'],  // Morning and Afternoon slots
    isAvailableNow: true // Default toggle
  },
  rating: { average: 0, count: 0 },
  media: [],
  requirements: ['Basic information'],
  isVerified: false,
  slug: 'placeholder-service',
  heroImage: '/images/default-service.png', 
  category: { id: 'cat-placeholder', name: 'Placeholder Category', description: '', slug: 'placeholder', icon: 'cog', imageUrl: '', isActive: true, createdAt: new Date(), updatedAt: new Date() }
});

// Main Service Detail Component
const ServiceDetailPageComponent: React.FC<ServiceDetailPageComponentProps> = ({ service }) => {
  const router = useRouter();
  const displayService = service || createPlaceholderService();
  const now = new Date(); 
  
  let effectiveAvailabilityStatusText = 'Loading...';
  let isEffectivelyAvailable = false;

  if (displayService) {
    const scheduledAsWorking = isWithinScheduledHours(displayService.availability, now);
    if (!scheduledAsWorking) {
      effectiveAvailabilityStatusText = 'Rest Day';
      isEffectivelyAvailable = false;
    } else {
      if (displayService.availability.isAvailableNow) {
        effectiveAvailabilityStatusText = 'Available Now';
        isEffectivelyAvailable = true;
      } else {
        effectiveAvailabilityStatusText = 'Currently Busy';
        isEffectivelyAvailable = false;
      }
    }
  }
  // --- End availability calculation ---

  const handleBookingRequest = () => {
    router.push(`/client/book/${displayService.slug}`);
  };

  const handleViewReviews = () => {
    if (displayService && displayService.slug) {
      router.push(`/client/service/${displayService.slug}/reviews`);
    }
  };

  if (!displayService) {
    return <div className="p-4 text-center">Service details are unavailable.</div>;
  }

  return (
    <div className="bg-gray-50">
      <ServiceHeroImage service={displayService} />
      
      <div className="px-4 pt-4 pb-16 lg:px-8 lg:pt-8">
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <ServiceInfoSection service={displayService} />
            <ServiceRatingSection service={displayService} onReviewClick={handleViewReviews} />
            <ServiceAvailabilitySection 
              availability={displayService.availability} 
              effectiveStatusText={effectiveAvailabilityStatusText}
              isEffectivelyAvailable={isEffectivelyAvailable}
            />
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
                    <span className={`font-medium ${isEffectivelyAvailable ? 'text-green-600' : 'text-red-600'}`}>
                      {effectiveAvailabilityStatusText}
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
      
      {/* Mobile booking button  */}
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