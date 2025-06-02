import React from 'react';
import { PlusIcon, WrenchScrewdriverIcon } from '@heroicons/react/24/solid';
import { PaintBrushIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { ServiceProvider } from '../../../assets/types/provider/service-provider';

interface ServiceManagementProps {
  provider: ServiceProvider;
  className?: string;
}

const ServiceManagementNextjs: React.FC<ServiceManagementProps> = ({ provider, className = '' }) => {
  const { servicesOffered } = provider;
  
  // Example service status (in production, this would come from your data)
  const servicesWithStatus = servicesOffered.map((service, index) => ({
    ...service,
    isActive: index === 0 // First service is active, others are inactive for demo
  }));

  return (
    <div className={`services-section ${className}`}>
      <div className="section-header">
        <h2 className="text-xl font-bold text-gray-800">My Services</h2>
        <Link href="/provider/services/add">
          <button className="add-button">
            <PlusIcon className="h-5 w-5" />
          </button>
        </Link>
      </div>
      
      {servicesWithStatus.length > 0 ? (
        <div className="space-y-3">
          {servicesWithStatus.map((service) => (
            <div key={service.id} className="service-card">
              <div className="flex justify-between items-start">
                <div className="flex items-center">
                  {service.category.name.toLowerCase().includes('cleaning') ? (
                    <PaintBrushIcon className="h-10 w-10 text-blue-600 mr-3" />
                  ) : (
                    <WrenchScrewdriverIcon className="h-10 w-10 text-blue-600 mr-3" />
                  )}
                  
                  <div>
                    <h3 className="font-semibold text-gray-800">{service.name}</h3>
                    <p className="text-sm text-gray-500">{service.category.name}</p>
                  </div>
                </div>
                
                <div className="service-status">
                  <span className={`status-dot ${service.isActive ? 'bg-green-500' : 'bg-orange-500'}`}></span>
                  <span className={`text-sm ${service.isActive ? 'text-green-600' : 'text-orange-600'}`}>
                    {service.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
              
              <div className="mt-3 flex justify-between">
                <div>
                  <span className="text-lg font-bold text-gray-800">₱{service.price.amount.toFixed(2)}</span>
                  <span className="text-gray-600">/{service.price.unit}</span>
                </div>
                
                <div className="flex items-center">
                  <div className="flex items-center mr-2 text-yellow-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="ml-1 text-sm">{service.rating?.average || 0}</span>
                  </div>
                  <span className="text-sm text-gray-500">({service.rating?.count || 0} reviews)</span>
                </div>
              </div>
              
              <div className="mt-3">
                <Link href={`/provider/services/edit/${service.id}`} className="text-blue-600 text-sm hover:underline">
                  Edit Service
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 p-6 rounded-lg text-center">
          <p className="text-gray-500">You haven't added any services yet</p>
          <Link href="/provider/services/add">
            <button className="mt-3 bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition-colors">
              Add Your First Service
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default ServiceManagementNextjs;
