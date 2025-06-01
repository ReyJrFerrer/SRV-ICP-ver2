import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { ArrowLeftIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid';

import ServiceListItem from 'frontend/src/components/client/ServiceListItemNextjs';
import BottomNavigation from 'frontend/src/components/client/BottomNavigationNextjs';
import SearchBar from 'frontend/src/components/client/SearchBarNextjs'; 
import { Service } from '../../../assets/types/service/service';
import { SERVICES } from '../../../assets/services';
import { adaptServiceData } from 'frontend/src/utils/serviceDataAdapter';

const SearchResultsPage: React.FC = () => {
  const router = useRouter();
  const { q } = router.query; // Get the search query from URL

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [results, setResults] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (q && typeof q === 'string') {
      setSearchQuery(q);
      setLoading(true);
      const allServices = adaptServiceData(SERVICES);
      const lowerCaseQuery = q.toLowerCase();
      const filteredResults = allServices.filter(service =>
        service.name.toLowerCase().includes(lowerCaseQuery) ||
        (service.title && service.title.toLowerCase().includes(lowerCaseQuery)) ||
        service.category.name.toLowerCase().includes(lowerCaseQuery) ||
        service.description.toLowerCase().includes(lowerCaseQuery)
      );
      setResults(filteredResults);
      setLoading(false);
    } else {
      setResults([]); // No query, no results
      setLoading(false);
    }
  }, [q]);

  const handleSearchOnPage = (newQuery: string) => {
    router.push(`/client/search-results?q=${encodeURIComponent(newQuery)}`);
  };

   return (
    <>
      <Head>
        <title>{searchQuery ? `Search: ${searchQuery}` : 'Search Results'} | SRV Client</title>
        <meta name="description" content={`Search results for services ${searchQuery ? `related to ${searchQuery}` : ''}`} />
      </Head>

      <div className="min-h-screen bg-gray-50 flex flex-col"> 
        {/* Header */}
        <header className="bg-white px-4 py-3 shadow-sm sticky top-0 z-40">
          <div className="flex items-center gap-3 mb-3">
            <button
              onClick={() => router.back()}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Go back"
            >
              <ArrowLeftIcon className="h-5 w-5 text-gray-700" />
            </button>
            <h1 className="text-lg font-semibold text-gray-800 truncate flex-grow">
              {searchQuery ? `Results for "${searchQuery}"` : 'Search Services'}
            </h1>
          </div>
          <SearchBar
            placeholder="Search for another service..."
            onSearch={handleSearchOnPage} 
            initialQuery={searchQuery}   
            redirectToSearchResultsPage={false} 
          />
        </header>

        {/* Results List */}
        <main className="flex-grow p-2 sm:p-4 overflow-y-auto pb-20"> 
          {loading && (
            <div className="text-center py-10 text-gray-600">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto mb-3"></div>
              Searching...
            </div>
          )}
          {!loading && results.length === 0 && (
            <div className="text-center py-16">
              <MagnifyingGlassIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" /> 
              <p className="text-lg text-gray-500">
                {searchQuery ? `No services found matching "${searchQuery}".` : "Enter a term above to search for services."}
              </p>
              {searchQuery && (
                <p className="text-sm text-gray-400 mt-2">Try a different search term or check your spelling.</p>
              )}
            </div>
          )}
          {!loading && results.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
              {results.map((service) => (
                <ServiceListItem
                  key={service.id}
                  service={service}
                  isGridItem={true}
                  retainMobileLayout={true} 
                />
              ))}
            </div>
          )}
        </main>
        
        <div className="lg:hidden"> {/* Show BottomNavigation only on smaller screens if it's part of mobile layout */}
            <BottomNavigation />
        </div>
      </div>
    </>
  );
};
export default SearchResultsPage;