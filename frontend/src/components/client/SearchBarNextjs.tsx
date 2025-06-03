// import React, { useState, useRef, useEffect, useCallback } from 'react';
// import { useRouter } from 'next/router';
// import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
// import { Service } from '../../../assets/types/service/service'; 
// import { SERVICES } from '../../../assets/services'; // Your mock services data
// import { adaptServiceData } from '@app/utils/serviceDataAdapter'; // Adapt data if needed

// interface SearchBarProps {
//   onSearch?: (query: string) => void; 
//   placeholder?: string;
//   className?: string;
//   redirectToSearchResultsPage?: boolean; 
//   initialQuery?: string;
// }

// const SearchBar: React.FC<SearchBarProps> = ({
//   onSearch,
//   placeholder = 'Search for service',
//   className = '',
//   redirectToSearchResultsPage = true, 
//   initialQuery = '',
// }) => {
//   const [query, setQuery] = useState(initialQuery);
//   const [suggestions, setSuggestions] = useState<Service[]>([]);
//   const [showSuggestions, setShowSuggestions] = useState(false);
//   const router = useRouter();
//   const inputRef = useRef<HTMLInputElement>(null);
//   const searchBarRef = useRef<HTMLDivElement>(null); 

//   const allServices = adaptServiceData(SERVICES); 

//   const fetchSuggestions = useCallback((currentQuery: string) => {
//     if (currentQuery.trim().length > 1) { // Fetch suggestions if query is at least 2 chars
//       const lowerCaseQuery = currentQuery.toLowerCase();
//       const filteredSuggestions = allServices.filter(service =>
//         service.name.toLowerCase().includes(lowerCaseQuery) ||
//         (service.title && service.title.toLowerCase().includes(lowerCaseQuery)) ||
//         service.category.name.toLowerCase().includes(lowerCaseQuery)
//       ).slice(0, 5); // Limit to 5 suggestions
//       setSuggestions(filteredSuggestions);
//       setShowSuggestions(true);
//     } else {
//       setSuggestions([]);
//       setShowSuggestions(false);
//     }
//   }, [allServices]);

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const newQuery = e.target.value;
//     setQuery(newQuery);
//     fetchSuggestions(newQuery);
//   };

//   const handleSubmit = (e?: React.FormEvent, submissionQuery: string = query) => {
//     e?.preventDefault();
//     setShowSuggestions(false);
//     inputRef.current?.blur(); 

//     const finalQuery = submissionQuery.trim();
//     if (finalQuery) {
//       if (onSearch) { // If parent wants to handle search (e.g., map page)
//         onSearch(finalQuery);
//       } else if (redirectToSearchResultsPage) { // Default behavior for header search etc.
//         router.push(`/client/search-results?q=${encodeURIComponent(finalQuery)}`);
//       }
//     }
//   };

//   const handleSuggestionClick = (service: Service) => {
//     const suggestionText = service.title || service.name; 
//     setQuery(suggestionText);
//     setShowSuggestions(false);
//     handleSubmit(undefined, suggestionText); // Submit search with the suggestion
//   };
  
//   const clearSearch = () => {
//     setQuery('');
//     setSuggestions([]);
//     setShowSuggestions(false);
//     inputRef.current?.focus();
//   };

//   // Handle clicks outside to close suggestions
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (searchBarRef.current && !searchBarRef.current.contains(event.target as Node)) {
//         setShowSuggestions(false);
//       }
//     };
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);
  
//   useEffect(() => { // To update query if initialQuery prop changes 
//     setQuery(initialQuery);
//   }, [initialQuery]);

//   return (
//     <div className={`relative ${className}`} ref={searchBarRef}>
//       <form
//         onSubmit={handleSubmit}
//         className="search-bar group hover:ring-2 hover:ring-white-200 focus-within:ring-2 focus-within:ring-blue-300 transition-all flex items-center w-full px-3 sm:px-4 py-2 bg-gray-100 rounded-full shadow-sm"
//       >
//         <MagnifyingGlassIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 mr-2 sm:mr-3" />
//         <input
//           ref={inputRef}
//           type="text"
//           value={query}
//           onChange={handleInputChange}
//           onFocus={() => query.trim().length > 1 && fetchSuggestions(query)} // Show suggestions on focus if query exists
//           placeholder={placeholder}
//           className="w-full py-1 sm:py-2 bg-transparent outline-none text-gray-700 text-sm sm:text-base"
//           aria-label="Search"
//         />
//         {query && (
//           <button type="button" onClick={clearSearch} className="p-1 text-gray-500 hover:text-gray-700">
//             <XMarkIcon className="h-4 w-4 sm:h-5 sm:w-5" />
//           </button>
//         )}
//       </form>

//       {showSuggestions && suggestions.length > 0 && (
//         <ul className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
//           {suggestions.map(service => (
//             <li
//               key={service.id}
//               onClick={() => handleSuggestionClick(service)}
//               className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm text-gray-700"
//             >
//               <span className="font-medium">{service.name}</span> - <span className="text-gray-500">{service.title || service.category.name}</span>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };

// export default SearchBar;

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { MagnifyingGlassIcon, XMarkIcon, MapPinIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { Service } from '../../../assets/types/service/service'; 
import { SERVICES } from '../../../assets/services';
import { adaptServiceData } from '@app/utils/serviceDataAdapter';
import BottomSheet from './BottomSheetNextjs';
import ServiceLocationMap from './ServiceLocationMapNextjs';

interface SearchBarProps {
  onSearch?: (query: string) => void; 
  placeholder?: string;
  className?: string;
  redirectToSearchResultsPage?: boolean; 
  initialQuery?: string;
  showLocationBadge?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = 'Search for service',
  className = '',
  redirectToSearchResultsPage = true, 
  initialQuery = '',
  showLocationBadge = true,
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [suggestions, setSuggestions] = useState<Service[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [locationSheetOpen, setLocationSheetOpen] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const searchBarRef = useRef<HTMLDivElement>(null); 

  const allServices = adaptServiceData(SERVICES); 

  const fetchSuggestions = useCallback((currentQuery: string) => {
    if (currentQuery.trim().length > 1) {
      const lowerCaseQuery = currentQuery.toLowerCase();
      const filteredSuggestions = allServices.filter(service =>
        service.name.toLowerCase().includes(lowerCaseQuery) ||
        (service.title && service.title.toLowerCase().includes(lowerCaseQuery)) ||
        service.category.name.toLowerCase().includes(lowerCaseQuery)
      ).slice(0, 5);
      setSuggestions(filteredSuggestions);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [allServices]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    fetchSuggestions(newQuery);
  };

  const handleSubmit = (e?: React.FormEvent, submissionQuery: string = query) => {
    e?.preventDefault();
    setShowSuggestions(false);
    inputRef.current?.blur(); 

    const finalQuery = submissionQuery.trim();
    if (finalQuery) {
      if (onSearch) {
        onSearch(finalQuery);
      } else if (redirectToSearchResultsPage) {
        router.push(`/client/search-results?q=${encodeURIComponent(finalQuery)}`);
      }
    }
  };

  const handleSuggestionClick = (service: Service) => {
    const suggestionText = service.title || service.name; 
    setQuery(suggestionText);
    setShowSuggestions(false);
    handleSubmit(undefined, suggestionText);
  };
  
  const clearSearch = () => {
    setQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const handleLocationClick = () => {
    setLocationSheetOpen(true);
  };

  const handleAddressMapClick = () => {
    setLocationSheetOpen(false);
    router.push('/client/service-maps'); 
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchBarRef.current && !searchBarRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  return (
    <div className={`space-y-2 ${className}`}>
      {showLocationBadge && (
        <button 
          onClick={handleLocationClick}
          className="location-badge flex items-center text-xs sm:text-sm py-1 px-2 rounded-full hover:bg-gray-100 transition-colors flex-shrink-0"
        >
          <MapPinIcon className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 mr-1 sm:mr-1.5 flex-shrink-0" />
          <div className="flex items-center overflow-hidden"> 
            <span className="font-medium mr-1 truncate max-w-[120px] xs:max-w-[150px] sm:max-w-[200px]">
              San Vicente, Baguio, Cordillera Administrative Region
            </span>
            <CheckCircleIcon className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 flex-shrink-0" />
          </div>
        </button>
      )}

      <div className="relative" ref={searchBarRef}>
        <form
          onSubmit={handleSubmit}
          className="search-bar group hover:ring-2 hover:ring-white-200 focus-within:ring-2 focus-within:ring-blue-300 transition-all flex items-center w-full px-3 sm:px-4 py-2 bg-gray-100 rounded-full shadow-sm"
        >
          <MagnifyingGlassIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 mr-2 sm:mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            onFocus={() => query.trim().length > 1 && fetchSuggestions(query)}
            placeholder={placeholder}
            className="w-full py-1 sm:py-2 bg-transparent outline-none text-gray-700 text-sm sm:text-base"
            aria-label="Search"
          />
          {query && (
            <button type="button" onClick={clearSearch} className="p-1 text-gray-500 hover:text-gray-700">
              <XMarkIcon className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          )}
        </form>

        {showSuggestions && suggestions.length > 0 && (
          <ul className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
            {suggestions.map(service => (
              <li
                key={service.id}
                onClick={() => handleSuggestionClick(service)}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm text-gray-700"
              >
                <span className="font-medium">{service.name}</span> - <span className="text-gray-500">{service.title || service.category.name}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Location Bottom Sheet */}
      <BottomSheet 
        isOpen={locationSheetOpen}
        onClose={() => setLocationSheetOpen(false)}
        title="Where do you like to meet your service provider?"
        height="large"
      >
        <div className="h-96 mb-4">
          <ServiceLocationMap onClick={handleAddressMapClick} />
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
          <h3 className="font-medium text-gray-800 mb-1">Current Location</h3>
          <p className="text-gray-600">San Vicente, Baguio, Cordillera Administrative Region</p>
        </div>
      </BottomSheet>
    </div>
  );
};

export default SearchBar;