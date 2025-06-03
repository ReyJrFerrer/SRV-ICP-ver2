import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import { 
    ArrowLeftIcon, 
    PencilIcon, 
    TrashIcon, 
    StarIcon as StarSolid, 
    CheckCircleIcon, 
    XCircleIcon, 
    CurrencyDollarIcon, 
    MapPinIcon, 
    CalendarDaysIcon, 
    ClockIcon, 
    DocumentTextIcon, 
    TagIcon, 
    BriefcaseIcon, 
    CogIcon,
    CameraIcon as CameraSolidIcon 
} from '@heroicons/react/24/solid';

import { Service } from '../../../../assets/types/service/service';
import { SERVICES as mockServicesData } from '../../../../assets/services';
import { adaptServiceData } from 'frontend/src/utils/serviceDataAdapter';
import BottomNavigation from '@app/components/provider/BottomNavigationNextjs';

const ProviderServiceDetailPage: React.FC = () => {
  const router = useRouter();
  const { slug } = router.query;
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug && typeof slug === 'string') {
      setLoading(true);
      const rawService = mockServicesData.find(s => s.slug === slug || s.id === slug);
      if (rawService) {
        const adapted = adaptServiceData([rawService])[0]; 
        setService(adapted);
      }
      setLoading(false);
    }
  }, [slug]);

  const handleDeleteService = async () => {
    if (!service) return;
    if (window.confirm(`Are you sure you want to delete the service "${service.title || service.name}"? This action cannot be undone.`)) {
      console.log(`Mock Deleting service: ${service.id} - ${service.title || service.name}`);
      alert(`Mock: Service "${service.title || service.name}" would be deleted. In a real app, this would update the backend.`);
    
      router.push('/provider/services'); 
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="ml-3 text-gray-700">Loading service details...</p>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <Head>
            <title>Service Not Found | SRV Provider</title>
        </Head>
        <h1 className="text-xl font-semibold text-red-600 mb-4">Service Not Found</h1>
        <p className="text-gray-600 mb-6">The service you are looking for does not exist or could not be loaded.</p>
        <Link href="/provider/home" legacyBehavior>
          <a className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Back to Dashboard
          </a>
        </Link>
      </div>
    );
  }

  const heroImageUrl = typeof service.heroImage === 'string' 
    ? service.heroImage 
    : (service.heroImage as any)?.default?.src || (service.heroImage as any)?.src;

  return (
    <>
      <Head>
        <title>Details: {service.title || service.name} | SRV Provider</title>
        <meta name="description" content={`Detailed view of service: ${service.title || service.name}`} />
      </Head>

      <div className="min-h-screen bg-gray-100 pb-20 md:pb-0"> {/* Padding for bottom nav on mobile */}
        <header className="bg-white shadow-sm sticky top-0 z-30">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Go back"
            >
              <ArrowLeftIcon className="h-5 w-5 text-gray-700" />
            </button>
            <h1 className="text-lg font-semibold text-gray-800 truncate">
              Service Details
            </h1>
            <div className="w-8"> {/* Spacer */}</div>
          </div>
        </header>

        <main className="container mx-auto p-4 sm:p-6 space-y-6">
          {/* Hero Image and Basic Info Card */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {heroImageUrl && (
              <div className="relative w-full aspect-[16/6] bg-gray-200 overflow-hidden">
                <Image
                  src={heroImageUrl}
                  alt={service.title || service.name}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
            )}
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1 min-w-0"> {/* Allow text to wrap and truncate */}
                  <h2 className="text-2xl font-bold text-gray-800 truncate" title={service.title || service.name}>{service.title || service.name}</h2>
                  <p className="text-sm text-gray-500 flex items-center mt-1">
                    <TagIcon className="h-4 w-4 mr-1.5 text-gray-400 flex-shrink-0"/>
                    {service.category.name}
                  </p>
                </div>
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ml-2 flex-shrink-0 ${service.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {service.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed mt-1">{service.description}</p>
            </div>
          </div>

          {/* Action Buttons Card */}
           <div className="bg-white rounded-xl shadow-lg p-4 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                <Link href={`/provider/services/edit/${service.slug || service.id}`} legacyBehavior>
                    <a className="flex-1 flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white font-medium py-2.5 px-4 rounded-lg transition-colors text-sm">
                        <PencilIcon className="h-5 w-5 mr-2" /> Edit Service
                    </a>
                </Link>
                <button
                    onClick={handleDeleteService}
                    className="flex-1 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white font-medium py-2.5 px-4 rounded-lg transition-colors text-sm"
                >
                    <TrashIcon className="h-5 w-5 mr-2" /> Delete Service
                </button>
            </div>

          {/* Detailed Information Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6 space-y-3">
              <h3 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-2">Pricing & Rating</h3>
              <p className="flex items-center text-sm"><CurrencyDollarIcon className="h-5 w-5 mr-2 text-green-500"/>Price: <span className="font-medium ml-1">₱{service.price.amount.toFixed(2)} {service.price.unit} {service.price.isNegotiable ? '(Negotiable)' : ''}</span></p>
              <p className="flex items-center text-sm"><StarSolid className="h-5 w-5 mr-2 text-yellow-400"/>Rating: <span className="font-medium ml-1">{service.rating.average.toFixed(1)} ({service.rating.count} reviews)</span></p>
              <p className="flex items-center text-sm">{service.isVerified ? <CheckCircleIcon className="h-5 w-5 mr-2 text-green-500"/> : <XCircleIcon className="h-5 w-5 mr-2 text-red-500"/>} {service.isVerified ? 'Verified Service' : 'Not Verified'}</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 space-y-3">
              <h3 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-2">Location & Availability</h3>
              <p className="flex items-start text-sm"><MapPinIcon className="h-5 w-5 mr-2 text-blue-500 flex-shrink-0 mt-0.5"/>Location: <span className="font-medium ml-1">{service.location.address}</span></p>
              <p className="flex items-center text-sm"><CogIcon className="h-5 w-5 mr-2 text-gray-500"/>Radius: <span className="font-medium ml-1">{service.location.serviceRadius}{service.location.serviceRadiusUnit}</span></p>
              <p className="flex items-center text-sm"><CalendarDaysIcon className="h-5 w-5 mr-2 text-indigo-500"/>Schedule: <span className="font-medium ml-1">{service.availability.schedule.join(', ')}</span></p>
              <p className="flex items-center text-sm"><ClockIcon className="h-5 w-5 mr-2 text-purple-500"/>Time Slots: <span className="font-medium ml-1">{service.availability.timeSlots.join(' | ')}</span></p>
              <p className={`flex items-center text-sm font-medium ${service.availability.isAvailableNow ? 'text-green-600' : 'text-red-600'}`}>{service.availability.isAvailableNow ? 'Currently Available' : 'Currently Not Available'}</p>
            </div>
          </div>

          {service.packages && service.packages.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center"><BriefcaseIcon className="h-5 w-5 mr-2 text-gray-500"/>Service Packages</h3>
              <div className="space-y-4">
                {service.packages.map((pkg) => (
                  <div key={pkg.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div className="flex justify-between items-start">
                        <h4 className="font-semibold text-md text-gray-800">{pkg.name}</h4>
                        {pkg.isPopular && <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded-full ml-2 flex-shrink-0">Popular</span>}
                    </div>
                    {pkg.duration && <p className="text-xs text-gray-500 mb-1">Duration: {pkg.duration}</p>}
                    <p className="text-sm text-gray-600 mb-2">{pkg.description}</p>
                    <p className="text-md font-semibold text-green-600 mb-2">₱{pkg.price.toFixed(2)} {pkg.currency}</p>
                    {pkg.features && pkg.features.length > 0 && (
                      <div>
                        <h5 className="text-xs font-medium text-gray-700 mb-1">Features:</h5>
                        <ul className="list-disc list-inside space-y-0.5 text-xs text-gray-600 pl-2">
                          {pkg.features.map((feat, idx) => <li key={idx}>{feat}</li>)}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {service.media && service.media.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center"><CameraSolidIcon className="h-5 w-5 mr-2 text-gray-500"/>Gallery</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {service.media.map((item, index) => {
                        const itemUrl = typeof item.url === 'string' ? item.url : (item.url as any)?.default?.src || (item.url as any)?.src;
                        return itemUrl && item.type === 'IMAGE' ? (
                            <div key={index} className="aspect-square rounded-lg overflow-hidden border border-gray-200 relative">
                                <Image src={itemUrl} alt={`Service gallery image ${index + 1}`} layout="fill" objectFit="cover" className="hover:scale-105 transition-transform"/>
                            </div>
                        ) : null;
                    })}
                </div>
            </div>
          )}

        </main>
        <div className="md:hidden"> {/* Show BottomNavigation only on smaller screens */}
            <BottomNavigation />
        </div>
      </div>
    </>
  );
};

export default ProviderServiceDetailPage;