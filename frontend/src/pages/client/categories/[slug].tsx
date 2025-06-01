import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link'; 
import { ArrowLeftIcon } from '@heroicons/react/24/solid';

// Components
import SearchBar from '@app/components/client/SearchBarNextjs'; // Adjust path as needed
import ServiceListItem from '@app/components/client/ServiceListItemNextjs'; // Adjust path
import BottomNavigation from '@app/components/client/BottomNavigationNextjs'; // Adjust path

// Types
import { Service } from '../../../../assets/types/service/service';
import { Category as CategoryType } from '../../../../assets/types/category/category'; // Renamed to avoid conflict

// Utils & Data
import { adaptServiceData } from '@app/utils/serviceDataAdapter'; // Adjust path
import { SERVICES } from '../../../../assets/services'; // Mock data
import { CATEGORIES } from '../../../../assets/categories'; // Mock data
import { adaptCategoryData } from '@app/utils/serviceDataAdapter'; 

interface CategoryPageState { 
  name: string;
  description: string;
  slug?: string;
}

const CategoryPage: React.FC = () => {
  const router = useRouter();
  const { slug } = router.query;
  
  const [categoryInfo, setCategoryInfo] = useState<CategoryPageState | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!slug || typeof slug !== 'string') {
      setLoading(false);
      return;
    }

    setLoading(true);
    // Simulate data loading
    const loadData = async () => {
      try {
        // Assuming CATEGORIES is an array of CategoryType
        const allCategories: CategoryType[] = adaptCategoryData(CATEGORIES); 
        const foundCategoryData = allCategories.find(cat => cat.slug === slug);
        
        if (foundCategoryData) {
          setCategoryInfo({
            name: foundCategoryData.name,
            description: foundCategoryData.description,
            slug: foundCategoryData.slug
          });
          
          const allServices = adaptServiceData(SERVICES);
          const categoryServices = allServices.filter(service => service.category?.slug === slug);
          setServices(categoryServices);

        } else if (slug === 'all-service-types') { // Handling for a potential "view all" slug
          setCategoryInfo({
            name: 'All Service Types',
            description: 'Browse all available service types',
            slug: 'all-service-types'
          });
          setServices(adaptServiceData(SERVICES));
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

  const filteredServices = services.filter(service => 
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (service.title && service.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
    service.category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!categoryInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center p-4">
        <p className="text-xl text-red-600 mb-4">Category not found</p>
        <Link href="/client/home" className="text-blue-500 hover:underline">
          Return to Home
        </Link>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{categoryInfo.name} | SRV Client</title>
        <meta name="description" content={categoryInfo.description} />
      </Head>

      <div className="min-h-screen bg-gray-50 pb-20">
        {/* Header */}
        <div className="bg-white px-4 py-4 shadow-sm sticky top-0 z-40">
          <div className="flex items-center gap-3 mb-4">
            <button 
              onClick={handleBackClick}
              className="p-2 rounded-full hover:bg-gray-100"
              aria-label="Go back"
            >
              <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
            </button>
            <h1 className="text-xl font-bold truncate">{categoryInfo.name}</h1>
          </div>
          
          <SearchBar 
            placeholder={`Search in ${categoryInfo.name}`}
            className="mb-2"
            onSearch={(query) => setSearchTerm(query)} 
          />
        </div>

        {/* Services List - MODIFIED GRID */}
        <div className="p-2 sm:p-4">
          {filteredServices.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500">
                {searchTerm ? `No services found for "${searchTerm}" in this category.` : "No services found in this category."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3 md:gap-4">
              {filteredServices.map((service) => (
                <ServiceListItem 
                  key={service.id} 
                  service={service} 
        
                  isGridItem={true} 
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