import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';

// Components
import SearchBar from '@app/components/client/SearchBarNextjs';
import ServiceListItem from '@app/components/client/ServiceListItemNextjs';
import BottomNavigation from '@app/components/client/BottomNavigationNextjs';

// Types
import { Service } from '../../../../assets/types/service/service';
import { Category } from '../../../../assets/types/category/category';

// Utils
import { adaptServiceData, adaptCategoryData } from '@app/utils/serviceDataAdapter';

interface CategoryState {
  name: string;
  description: string;
  slug?: string;
}

const CategoryPage: React.FC = () => {
  const router = useRouter();
  const { slug } = router.query;
  
  const [category, setCategory] = useState<CategoryState | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    const loadData = async () => {
      try {
        const servicesModule = await import('../../../../assets/services');
        const categoriesModule = await import('../../../../assets/categories');
        
        const adaptedCategories = adaptCategoryData(categoriesModule.CATEGORIES);
        const foundCategory = adaptedCategories.find(cat => cat.slug === slug);
        
        if (foundCategory) {
          setCategory(foundCategory);
          
          // Get services for this category
          const adaptedServices = adaptServiceData(servicesModule.SERVICES)
            .filter(service => service.category?.slug === slug);
          
          setServices(adaptedServices);
        } else if (slug === 'all-service-types') {
          setCategory({
            name: 'All Service Types',
            description: 'Browse all available service types',
            slug: 'all-service-types'
          });
          setServices(adaptServiceData(servicesModule.SERVICES));
        }
      } catch (error) {
        console.error('Failed to load category data:', error);
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

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-red-600 mb-4">Category not found</p>
          <Link href="/client/home" className="text-blue-500 hover:underline">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{category.name} | Service Provider App</title>
        <meta name="description" content={category.description} />
      </Head>

      <div className="min-h-screen bg-gray-50 pb-20">
        {/* Header */}
        <div className="bg-white px-4 py-4 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <button 
              onClick={handleBackClick}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
            </button>
            <h1 className="text-xl font-bold">{category.name}</h1>
          </div>
          
          <SearchBar 
            placeholder={`Search in ${category.name}`}
            className="mb-2"
          />
        </div>

        {/* Services List */}
        <div className="px-4 py-6">
          {services.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500">No services found in this category</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {services.map((service) => (
                <ServiceListItem 
                  key={service.id} 
                  service={service} 
                  inCategories={true} 
                />
              ))}
            </div>
          )}
        </div>

        <BottomNavigation />
      </div>
    </>
  );
};

export default CategoryPage;
