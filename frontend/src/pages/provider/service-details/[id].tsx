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

import { useServiceManagement, EnhancedService } from '../../../hooks/serviceManagement';
import BottomNavigation from '@app/components/provider/BottomNavigationNextjs';

const ProviderServiceDetailPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query; 
  
  // Use real hook instead of mock data
  const { 
    getService, 
    deleteService, 
    updateServiceStatus,
    formatServicePrice,
    getStatusColor,
    loading: hookLoading,
    error: hookError 
  } = useServiceManagement();
  
  const [service, setService] = useState<EnhancedService | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  // Fixed: Wait for hook to be ready and retry logic
  useEffect(() => {
    if (id && typeof id === 'string') {
      loadServiceDataWithRetry(id);
    }
  }, [id, hookLoading]); // Added hookLoading dependency

  const loadServiceDataWithRetry = async (serviceId: string, maxRetries = 3) => {
    setLoading(true);
    setError(null);
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        console.log(`Loading service data (attempt ${attempt + 1}/${maxRetries + 1})`);
        
        // Wait a bit longer on retries
        if (attempt > 0) {
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        }
        
        const serviceData = await getService(serviceId);
        
        if (serviceData) {
          console.log('Service loaded successfully:', serviceData);
          setService(serviceData);
          setRetryCount(0);
          setLoading(false);
          return; // Success, exit retry loop
        } else if (attempt === maxRetries) {
          // Only set error on final attempt
          console.log('Service not found after all retries');
          setError('Service not found');
        }
      } catch (err) {
        console.error(`Failed to load service (attempt ${attempt + 1}):`, err);
        if (attempt === maxRetries) {
          setError('Failed to load service data');
        }
      }
    }
    
    setLoading(false);
  };

  const loadServiceData = async (serviceId: string) => {
    setLoading(true);
    setError(null);
    try {
      const serviceData = await getService(serviceId);
      if (serviceData) {
        setService(serviceData);
      } else {
        setError('Service not found');
      }
    } catch (err) {
      console.error('Failed to load service:', err);
      setError('Failed to load service data');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteService = async () => {
    if (!service) return;
    
    const confirmed = window.confirm(
      `Are you sure you want to delete "${service.title}"? This action cannot be undone.`
    );
    
    if (confirmed) {
      setIsDeleting(true);
      try {
        await deleteService(service.id);
        router.push('/provider/services');
      } catch (error) {
        console.error('Failed to delete service:', error);
        alert('Failed to delete service. Please try again.');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleStatusToggle = async () => {
    if (!service) return;
    
    const newStatus = service.status === 'Available' ? 'Unavailable' : 'Available';
    setIsUpdatingStatus(true);
    try {
      await updateServiceStatus(service.id, newStatus);
      await loadServiceData(service.id); // Reload to get updated data
    } catch (error) {
      console.error('Failed to update service status:', error);
      alert('Failed to update service status. Please try again.');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleRetry = () => {
    if (id && typeof id === 'string') {
      setRetryCount(prev => prev + 1);
      loadServiceDataWithRetry(id);
    }
  };

  // Show loading while hook is initializing or we're fetching data
  if (loading || hookLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="ml-3 text-gray-700 mt-4">Loading service details...</p>
        {retryCount > 0 && (
          <p className="text-sm text-gray-500 mt-2">Retry attempt: {retryCount}</p>
        )}
      </div>
    );
  }

  if (error || hookError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <Head>
            <title>Service Not Found | SRV Provider</title>
        </Head>
        <h1 className="text-xl font-semibold text-red-600 mb-4">
          {error || hookError || 'Service Not Found'}
        </h1>
        <p className="text-gray-600 mb-6 text-center">
          {error || hookError || 'The service could not be loaded.'} 
          {!service && ' This might be due to initialization timing.'}
        </p>
        <div className="flex space-x-4">
          <button
            onClick={handleRetry}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry Loading
          </button>
          <Link href="/provider/services" legacyBehavior>
            <a className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
              Back to Services
            </a>
          </Link>
        </div>
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
        <p className="text-gray-600 mb-6">The service could not be loaded.</p>
        <div className="flex space-x-4">
          <button
            onClick={handleRetry}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry Loading
          </button>
          <Link href="/provider/services" legacyBehavior>
            <a className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
              Back to Services
            </a>
          </Link>
        </div>
      </div>
    );
  }

  const heroImageUrl = typeof service.heroImage === 'string' 
    ? service.heroImage 
    : (service.heroImage as any)?.default?.src || (service.heroImage as any)?.src;

  return (
    <>
      <Head>
        <title>Details: {service.title} | SRV Provider</title>
        <meta name="description" content={`Detailed view of service: ${service.title}`} />
      </Head>

      <div className="min-h-screen bg-gray-100 pb-20 md:pb-0">
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
            <div className="w-8"></div>
          </div>
        </header>

        <main className="container mx-auto p-4 sm:p-6 space-y-6">
          {/* Hero Image and Basic Info Card */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {heroImageUrl && (
              <div className="relative w-full aspect-[16/6] bg-gray-200 overflow-hidden">
                <Image
                  src={heroImageUrl}
                  alt={service.title}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
            )}
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1 min-w-0">
                  <h2 className="text-2xl font-bold text-gray-800 truncate" title={service.title}>
                    {service.title}
                  </h2>
                  <p className="text-sm text-gray-500 flex items-center mt-1">
                    <TagIcon className="h-4 w-4 mr-1.5 text-gray-400 flex-shrink-0"/>
                    {service.category.name}
                  </p>
                </div>
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ml-2 flex-shrink-0 bg-${getStatusColor(service.status)}-100 text-${getStatusColor(service.status)}-700`}>
                  {service.status}
                </span>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed mt-1">{service.description}</p>
            </div>
          </div>

          {/* Action Buttons Card */}
           <div className="bg-white rounded-xl shadow-lg p-4 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                <Link href={`/provider/services/edit/${service.id}`} legacyBehavior>
                    <a className="flex-1 flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white font-medium py-2.5 px-4 rounded-lg transition-colors text-sm">
                        <PencilIcon className="h-5 w-5 mr-2" /> Edit Service
                    </a>
                </Link>
                <button
                    onClick={handleStatusToggle}
                    disabled={isUpdatingStatus}
                    className={`flex-1 flex items-center justify-center font-medium py-2.5 px-4 rounded-lg transition-colors text-sm disabled:opacity-50 ${
                      service.status === 'Available' 
                        ? 'bg-yellow-500 hover:bg-yellow-600 text-white' 
                        : 'bg-green-500 hover:bg-green-600 text-white'
                    }`}
                >
                    <CogIcon className="h-5 w-5 mr-2" />
                    {isUpdatingStatus ? 'Updating...' : (service.status === 'Available' ? 'Deactivate' : 'Activate')}
                </button>
                <button
                    onClick={handleDeleteService}
                    disabled={isDeleting}
                    className="flex-1 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white font-medium py-2.5 px-4 rounded-lg transition-colors text-sm disabled:opacity-50"
                >
                    <TrashIcon className="h-5 w-5 mr-2" /> 
                    {isDeleting ? 'Deleting...' : 'Delete Service'}
                </button>
            </div>

          {/* Detailed Information Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6 space-y-3">
              <h3 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-2">Pricing & Rating</h3>
              <p className="flex items-center text-sm">
                <CurrencyDollarIcon className="h-5 w-5 mr-2 text-green-500"/>
                Price: <span className="font-medium ml-1">{service.formattedPrice || formatServicePrice(service.price)}</span>
              </p>
              <p className="flex items-center text-sm">
                <StarSolid className="h-5 w-5 mr-2 text-yellow-400"/>
                Rating: <span className="font-medium ml-1">{service.averageRating?.toFixed(1) || '0.0'} ({service.totalReviews || 0} reviews)</span>
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 space-y-3">
              <h3 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-2">Location & Provider</h3>
              <p className="flex items-start text-sm">
                <MapPinIcon className="h-5 w-5 mr-2 text-blue-500 flex-shrink-0 mt-0.5"/>
                Location: <span className="font-medium ml-1">{service.formattedLocation}</span>
              </p>
              {service.providerProfile && (
                <p className="flex items-center text-sm">
                  Provider: <span className="font-medium ml-1">{service.providerProfile.name}</span>
                </p>
              )}
              {service.availability && (
                <>
                  <p className="flex items-center text-sm">
                    <CalendarDaysIcon className="h-5 w-5 mr-2 text-indigo-500"/>
                    Schedule: <span className="font-medium ml-1">{service.availability.schedule?.join(', ') || 'Not specified'}</span>
                  </p>
                  <p className="flex items-center text-sm">
                    <ClockIcon className="h-5 w-5 mr-2 text-purple-500"/>
                    Time Slots: <span className="font-medium ml-1">{service.availability.timeSlots?.join(' | ') || 'Not specified'}</span>
                  </p>
                </>
              )}
            </div>
          </div>

          {service.packages && service.packages.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                <BriefcaseIcon className="h-5 w-5 mr-2 text-gray-500"/>Service Packages
              </h3>
              <div className="space-y-4">
                {service.packages.map((pkg) => (
                  <div key={pkg.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div className="flex justify-between items-start">
                      <h4 className="font-semibold text-md text-gray-800">{pkg.name}</h4>
                      {pkg.isPopular && (
                        <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded-full ml-2 flex-shrink-0">
                          Popular
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{pkg.description}</p>
                    <p className="text-md font-semibold text-green-600">
                      ₱{pkg.price.toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {service.media && service.media.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
                <CameraSolidIcon className="h-5 w-5 mr-2 text-gray-500"/>Gallery
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {service.media.map((item, index) => (
                  item.type === 'IMAGE' && (
                    <div key={index} className="aspect-square rounded-lg overflow-hidden border border-gray-200 relative">
                      <Image 
                        src={item.url} 
                        alt={`Service gallery image ${index + 1}`} 
                        layout="fill" 
                        objectFit="cover" 
                        className="hover:scale-105 transition-transform"
                      />
                    </div>
                  )
                ))}
              </div>
            </div>
          )}

        </main>
        <div className="md:hidden">
            <BottomNavigation />
        </div>
      </div>
    </>
  );
};

export default ProviderServiceDetailPage;