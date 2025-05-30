import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
import { ArrowLeftIcon, StarIcon, MapPinIcon, ClockIcon, CurrencyDollarIcon } from '@heroicons/react/24/solid';

// Components
import ServiceLocationMap from '@app/components/client/ServiceLocationMapNextjs';
import BottomSheet from '@app/components/client/BottomSheetNextjs';
import BottomNavigation from '@app/components/client/BottomNavigationNextjs';

// Types
import { Service } from '../../../../assets/types/service/service';

// Utils
import { adaptServiceData } from '@app/utils/serviceDataAdapter';

const ServiceDetailPage: React.FC = () => {
  const router = useRouter();
  const { slug } = router.query;
  
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [locationSheetOpen, setLocationSheetOpen] = useState(false);
  const [bookingSheetOpen, setBookingSheetOpen] = useState(false);

  useEffect(() => {
    if (!slug) return;

    const loadData = async () => {
      try {
        const servicesModule = await import('../../../../assets/services');
        const adaptedServices = adaptServiceData(servicesModule.SERVICES);
        const foundService = adaptedServices.find(svc => svc.slug === slug);
        
        if (foundService) {
          setService(foundService);
        }
      } catch (error) {
        console.error('Failed to load service data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [slug]);

  const handleBackClick = () => {
    router.back();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Service Not Found</h1>
          <p className="mb-6">The service you're looking for doesn't exist or has been removed.</p>
          <button 
            onClick={() => router.push('/client/home')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{service.name} - {service.title} | Service Provider App</title>
        <meta name="description" content={service.description} />
      </Head>

      <div className="min-h-screen bg-gray-50 pb-24">
        {/* Service Header Image */}
        <div className="relative h-64 w-full">
          <Image 
            src={service.heroImage} 
            alt={service.title || service.name} 
            className="object-cover"
            fill
            priority
          />
          
          {/* Overlay controls */}
          <div className="absolute top-0 left-0 right-0 p-4 flex justify-between">
            <button 
              onClick={handleBackClick}
              className="p-2 bg-white bg-opacity-80 rounded-full shadow-md"
            >
              <ArrowLeftIcon className="h-5 w-5 text-gray-700" />
            </button>
          </div>
        </div>

        {/* Service Details */}
        <div className="bg-white -mt-6 rounded-t-3xl relative z-10 px-4 py-6">
          <div className="mb-6">
            <div className="flex justify-between items-start mb-2">
              <h1 className="text-2xl font-bold text-blue-800">{service.name}</h1>
              <div className="flex items-center px-2 py-1 bg-blue-50 rounded-lg">
                <StarIcon className="h-4 w-4 text-yellow-500 mr-1" />
                <span className="font-medium">{service.rating.average}</span>
                <span className="text-gray-500 text-sm ml-1">({service.rating.count})</span>
              </div>
            </div>
            
            <p className="text-lg text-blue-700 mb-3">{service.title}</p>
            
            <p className="text-gray-600 mb-4">{service.description}</p>
            
            <div className="flex flex-wrap gap-4 mb-4">
              <div className="flex items-center text-gray-700">
                <MapPinIcon className="h-5 w-5 mr-1 text-green-600" />
                <span>
                  {service.location.serviceRadius} {service.location.serviceRadiusUnit} radius
                </span>
              </div>
              
              <div className="flex items-center text-gray-700">
                <CurrencyDollarIcon className="h-5 w-5 mr-1 text-green-600" />
                <span className="font-medium">
                  ₱{service.price.amount.toFixed(2)} {service.price.unit}
                </span>
                {service.price.isNegotiable && (
                  <span className="text-xs ml-1">(Negotiable)</span>
                )}
              </div>
              
              {service.availability?.isAvailableNow && (
                <div className="flex items-center text-gray-700">
                  <ClockIcon className="h-5 w-5 mr-1 text-green-600" />
                  <span className="text-green-600 font-medium">Available Now</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Service Location */}
          <div className="mb-6">
            <h2 className="text-lg font-bold mb-2">Service Location</h2>
            <div 
              className="h-36 cursor-pointer"
              onClick={() => setLocationSheetOpen(true)}
            >
              <ServiceLocationMap />
            </div>
          </div>
          
          {/* Service Availability */}
          <div className="mb-6">
            <h2 className="text-lg font-bold mb-2">Availability</h2>
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="flex flex-wrap gap-2 mb-2">
                {service.availability?.schedule?.map((day, index) => (
                  <div key={index} className="px-3 py-1 bg-white rounded-full text-sm shadow-sm">
                    {day}
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-600">
                Time: {service.availability?.timeSlots?.join(', ')}
              </p>
            </div>
          </div>
        </div>

        {/* Book Service Button */}
        <div className="fixed bottom-16 left-0 right-0 p-4 bg-white border-t border-gray-200 z-40">
          <button 
            onClick={() => setBookingSheetOpen(true)}
            className="w-full py-3 bg-green-600 text-white rounded-lg font-medium"
          >
            Book This Service
          </button>
        </div>

        {/* Location Bottom Sheet */}
        <BottomSheet 
          isOpen={locationSheetOpen}
          onClose={() => setLocationSheetOpen(false)}
          title="Service Location"
          height="large"
        >
          <div className="h-96 mb-4">
            <ServiceLocationMap fullScreen={true} />
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
            <h3 className="font-medium text-gray-800 mb-1">Service Address</h3>
            <p className="text-gray-600">{service.location.address}</p>
          </div>
        </BottomSheet>
        
        {/* Booking Bottom Sheet */}
        <BottomSheet 
          isOpen={bookingSheetOpen}
          onClose={() => setBookingSheetOpen(false)}
          title="Book Service"
          height="large"
        >
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              {service.heroImage && (
                <div className="w-16 h-16 rounded-lg overflow-hidden">
                  <Image 
                    src={service.heroImage} 
                    alt={service.name} 
                    width={64}
                    height={64}
                    className="object-cover"
                  />
                </div>
              )}
              <div>
                <h3 className="font-medium">{service.name}</h3>
                <p className="text-gray-600 text-sm">{service.title}</p>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Select Date & Time</h3>
              <p className="text-gray-500 text-sm mb-3">
                Available: {service.availability?.schedule?.join(', ')}
              </p>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-center text-gray-500">
                  Calendar and time picker would be here
                </p>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Service Location</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600">
                  {service.location.address}
                </p>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Special Instructions (Optional)</h3>
              <textarea 
                className="w-full p-3 border border-gray-300 rounded-lg h-24"
                placeholder="Add any specific requirements or instructions for the service provider..."
              ></textarea>
            </div>
            
            <div className="pt-4">
              <button className="w-full py-3 bg-green-600 text-white rounded-lg font-medium">
                Book Now - ₱{service.price.amount.toFixed(2)}
              </button>
            </div>
          </div>
        </BottomSheet>

        <BottomNavigation />
      </div>
    </>
  );
};

export default ServiceDetailPage;
