import React from 'react';
import { PlusIcon, CogIcon, CurrencyDollarIcon, StarIcon, PencilIcon, ArrowRightIcon, ScissorsIcon } from '@heroicons/react/24/solid'; // Added ArrowRightIcon
import { PaintBrushIcon, WrenchScrewdriverIcon, ComputerDesktopIcon, CameraIcon, SparklesIcon, AcademicCapIcon, TruckIcon, HomeIcon, EllipsisHorizontalCircleIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { ServiceProvider } from '../../../assets/types/provider/service-provider';
// Assuming servicesOffered items have at least these fields from ServiceProvider type.
// If they are full Service objects, import that type instead for service.
// For this component, we're using the structure within provider.servicesOffered.

const iconMap: { [key: string]: React.ElementType } = {
  home: HomeIcon,
  broom: PaintBrushIcon,
  car: TruckIcon,
  laptop: ComputerDesktopIcon,
  cut: ScissorsIcon, // Make sure ScissorsIcon is imported if used in your actual data
  'shipping-fast': TruckIcon,
  spa: SparklesIcon,
  'chalkboard-teacher': AcademicCapIcon,
  camera: CameraIcon,
  tools: WrenchScrewdriverIcon,
  wrench: WrenchScrewdriverIcon,
  default: EllipsisHorizontalCircleIcon,
};
// Ensure ScissorsIcon is imported if 'cut' is a key in your iconMap and data
// import { ScissorsIcon } from '@heroicons/react/24/outline';


interface ServiceManagementProps {
  provider: ServiceProvider | null;
  className?: string;
  maxItemsToShow?: number; // Optional: to limit items on home page
}

const ServiceManagementNextjs: React.FC<ServiceManagementProps> = ({ 
  provider, 
  className = '',
  maxItemsToShow = 3 // Default to showing a few items on the home page
}) => {
  if (!provider) {
    return (
      <div className={`services-section bg-white p-6 rounded-xl shadow-lg ${className}`}>
        <div className="section-header flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">My Services</h2>
        </div>
        <p className="text-gray-500 text-center py-5">Loading provider services...</p>
      </div>
    );
  }

  const { servicesOffered } = provider;
  
  const servicesWithStatus = servicesOffered?.map((service, index) => ({
    ...service,
    isActive: typeof service.isActive === 'boolean' ? service.isActive : index % 2 === 0, 
  })) || [];

  const displayedServices = servicesWithStatus.slice(0, maxItemsToShow);

  const renderIcon = (iconKey: string | undefined) => {
    if (!iconKey) return <EllipsisHorizontalCircleIcon className="h-8 w-8 text-gray-400" />;
    const IconComponent = iconMap[iconKey.toLowerCase()] || iconMap.default;
    return <IconComponent className="h-8 w-8 text-blue-600" />;
  };

  return (
    <div className={`services-section bg-white p-6 rounded-xl shadow-lg ${className}`}>
      <div className="section-header flex flex-wrap justify-between items-center mb-4 gap-2">
        <h2 className="text-xl font-bold text-gray-800">My Services</h2>
        {/* "View All" button/link added here */}
        {servicesOffered && servicesOffered.length > maxItemsToShow && (
          <Link href="/provider/services" legacyBehavior>
            <a className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center transition-colors">
              View All ({servicesOffered.length})
              <ArrowRightIcon className="h-4 w-4 ml-1" />
            </a>
          </Link>
        )}
        <Link href="/provider/services/add" legacyBehavior>
          <a 
            className="add-button p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors ml-auto sm:ml-0" 
            aria-label="Add new service"
          >
            <PlusIcon className="h-5 w-5" />
          </a>
        </Link>
      </div>

      {displayedServices && displayedServices.length > 0 ? (
        <div className="mt-4 space-y-4">
          {displayedServices.map((service) => (
            <div key={service.id} className="service-card-item bg-gray-50 p-4 rounded-lg shadow-sm flex flex-col sm:flex-row sm:items-start sm:space-x-4 hover:shadow-md transition-shadow">
              <div className="flex-shrink-0 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-3 sm:mb-0">
                {renderIcon(service.category?.icon)}
              </div>
              <div className="flex-grow">
                <div className="flex flex-col sm:flex-row justify-between sm:items-start">
                    <div>
                        <h4 className="font-semibold text-gray-900 text-base sm:text-lg">{service.name}</h4>
                        <p className="text-xs sm:text-sm text-gray-500">{service.category?.name}</p>
                    </div>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full mt-2 sm:mt-0 ${service.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {service.isActive ? 'Active' : 'Inactive'}
                    </span>
                </div>
                
                <div className="flex items-center text-xs sm:text-sm text-gray-600 mt-2 space-x-3">
                  <div className="flex items-center">
                    <CurrencyDollarIcon className="h-4 w-4 text-gray-400 mr-1" />
                    <span>{service.price?.amount ? `₱${service.price.amount.toFixed(2)} ${service.price.unit}` : 'N/A'}</span>
                  </div>
                  <div className="flex items-center">
                    <StarIcon className="h-4 w-4 text-yellow-400 mr-1" />
                    <span>{service.rating?.average || 'N/A'} ({service.rating?.count || 0} reviews)</span>
                  </div>
                </div>
              </div>
              <Link href={`/provider/services/edit/${service.slug || service.id}`} legacyBehavior>
                <a className="mt-3 sm:mt-0 sm:ml-4 flex-shrink-0 text-xs sm:text-sm text-blue-600 hover:text-blue-700 font-medium p-2 rounded-md hover:bg-blue-50 transition-colors self-start sm:self-center">
                  <PencilIcon className="h-4 w-4 inline-block sm:hidden" /> <span className="hidden sm:inline">Edit</span>
                </a>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 text-gray-500">
          <WrenchScrewdriverIcon className="h-12 w-12 text-gray-300 mx-auto mb-3"/>
          <p className="mb-1">You haven't listed any services yet.</p>
          <Link href="/provider/services/add" legacyBehavior>
            <a className="text-sm text-blue-600 hover:text-blue-700 font-semibold">
              Add your first service
            </a>
          </Link>
        </div>
      )}
    </div>
  );
};

export default ServiceManagementNextjs;