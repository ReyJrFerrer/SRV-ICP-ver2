// SRV-ICP-ver2-jdMain/frontend/src/components/provider/ServiceManagementNextjs.tsx
import React from 'react';
import { PlusIcon, CurrencyDollarIcon, StarIcon, PencilIcon, ArrowRightIcon, ScissorsIcon } from '@heroicons/react/24/solid';
import { PaintBrushIcon, WrenchScrewdriverIcon, ComputerDesktopIcon, CameraIcon, SparklesIcon, AcademicCapIcon, TruckIcon, HomeIcon, EllipsisHorizontalCircleIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { ServiceProvider } from '../../../assets/types/provider/service-provider';
import { Service } from '../../../assets/types/service/service';

const iconMap: { [key: string]: React.ElementType } = {
  home: HomeIcon,
  broom: PaintBrushIcon,
  car: TruckIcon,
  laptop: ComputerDesktopIcon,
  cut: ScissorsIcon,
  'shipping-fast': TruckIcon,
  spa: SparklesIcon,
  'chalkboard-teacher': AcademicCapIcon,
  camera: CameraIcon,
  tools: WrenchScrewdriverIcon,
  wrench: WrenchScrewdriverIcon,
  default: EllipsisHorizontalCircleIcon,
};

interface ServiceManagementProps {
  provider: ServiceProvider | null;
  className?: string;
  maxItemsToShow?: number;
}

const ServiceManagementNextjs: React.FC<ServiceManagementProps> = ({
  provider,
  className = '',
  maxItemsToShow = 3
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

  const servicesOffered = (provider.servicesOffered || []) as Service[];

  const servicesWithStatus = servicesOffered.map((service, index) => ({
    ...service,
    isActive: typeof service.isActive === 'boolean' ? service.isActive : (index % 2 === 0),
  }));

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
            <div
              key={service.id}
              className="service-card-item bg-gray-50 p-4 rounded-lg shadow-sm flex flex-col md:flex-row md:items-start md:space-x-4 hover:shadow-md transition-shadow relative"
            >
              {/* Edit Icon - Positioned Absolutely with responsive classes */}
              <Link href={`/provider/services/edit/${service.slug || service.id}`} legacyBehavior>
                <a className="absolute top-3 right-3 md:top-auto md:bottom-3 text-blue-500 hover:text-blue-700 p-1 bg-white/60 hover:bg-gray-100 rounded-full z-10 transition-colors" title="Edit Service">
                  <PencilIcon className="h-5 w-5" />
                </a>
              </Link>

              {/* Service Icon */}
              <div className="flex-shrink-0 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-3 md:mb-0">
                {renderIcon(service.category?.icon)}
              </div>

              {/* Service Details */}
              <div className="flex-grow">
                <div className="flex flex-col md:flex-row justify-between md:items-start">
                  {/* Using service.category?.name for the h4 as per your update */}
                  <div className="flex-grow pr-8 md:pr-10"> {/* Increased padding-right on md for bottom-right icon too */}
                    <h4 className="font-semibold text-gray-900 text-base md:text-lg">{service.category?.name}</h4>
                    <p className="text-xs md:text-sm text-gray-500">{service.title}</p> {/* Assuming you might want title here still */}
                  </div>
                  {/* Status Badge */}
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full mt-2 md:mt-0 w-fit ${service.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                  >
                    {service.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>

                {/* Price and Rating (Kept horizontal as per the version you provided) */}
                <div className="flex items-center text-xs md:text-sm text-gray-600 mt-2 space-x-3">
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
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 text-gray-500">
          <WrenchScrewdriverIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
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