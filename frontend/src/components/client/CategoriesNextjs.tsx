import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { 
  HomeIcon, 
  BoltIcon, 
  WrenchScrewdriverIcon, 
  EllipsisHorizontalCircleIcon,
  TruckIcon,
  ComputerDesktopIcon,
  SparklesIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@heroicons/react/24/solid';

interface Category {
  id: string;
  name: string;
  icon: string;
  slug: string;
}

interface CategoriesProps {
  categories: Category[];
  className?: string;
  initialItemCount?: number;
}

// Map to standardize category display names
const getCategoryDisplayName = (name: string): string => {
  const lowerName = name.toLowerCase();
  
  if (lowerName.includes('home') || lowerName.includes('house')) return 'Home';
  if (lowerName.includes('clean')) return 'Cleaning';
  if (lowerName.includes('auto') || lowerName.includes('car')) return 'Automobile';
  if (lowerName.includes('gadget') || lowerName.includes('tech') || lowerName.includes('computer')) return 'Gadget';
  if (lowerName.includes('beauty') || lowerName.includes('wellness')) return 'Beauty';
  if (lowerName.includes('delivery')) return 'Delivery';
  if (lowerName.includes('electric')) return 'Electrical';
  if (lowerName.includes('repair') || lowerName.includes('maintenance')) return 'Repair';
  
  return name; // Return original if no match
};

const Categories: React.FC<CategoriesProps> = ({ 
  categories, 
  className = '',
  initialItemCount = 4
}) => {
  const router = useRouter();
  const [showAll, setShowAll] = useState(false);
  
  const categoriesToDisplay = showAll ? categories : categories.slice(0, initialItemCount);
  const shouldShowToggleButton = categories.length > initialItemCount;

  // Function to render the appropriate icon based on category
  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'home':
        return <HomeIcon className="h-5 w-5 sm:h-6 sm:w-6 text-indigo-600" />;
      case 'broom':
        return <SparklesIcon className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />;
      case 'car':
        return <WrenchScrewdriverIcon className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />;
      case 'truck':
        return <TruckIcon className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-600" />;
      case 'computer':
        return <ComputerDesktopIcon className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />;
      case 'bolt':
        return <BoltIcon className="h-5 w-5 sm:h-6 sm:w-6 text-red-600" />;
      case 'wrench':
        return <WrenchScrewdriverIcon className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600" />;
      case 'sparkles':
        return <SparklesIcon className="h-5 w-5 sm:h-6 sm:w-6 text-pink-600" />;
      default:
        return <EllipsisHorizontalCircleIcon className="h-5 w-5 sm:h-6 sm:w-6 text-gray-500" />;
    }
  };

  const handleToggleShowAll = () => {
    setShowAll(prevShowAll => !prevShowAll);
  };

  const handleCategoryClick = (slug: string) => {
    router.push(`/client/categories/${slug}`);
  };

  // Define responsive classes
  const itemBaseClass = "flex flex-col items-center text-center p-1 sm:p-2 rounded-lg hover:bg-gray-100 active:bg-gray-200 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-green-500";
  const iconContainerBaseClass = "mb-1 sm:mb-2 p-2 rounded-full inline-flex justify-center items-center group-hover:bg-green-200 transition-colors";
  const iconContainerSizeClass = "w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16"; // Mobile: 40px, sm: 48px, md: 64px
  const textClass = "text-xs sm:text-sm font-medium text-gray-700";

  return (
    <div className={`${className}`}>
      <div className="flex justify-between items-center mb-3 sm:mb-4">
        <h2 className="text-lg sm:text-xl font-bold">Categories</h2>
      </div>
      
      {/* Grid with responsive gaps */}
      <div className="grid grid-cols-4 gap-x-1 gap-y-2 sm:gap-x-2 sm:gap-y-3 md:gap-4">
        {categoriesToDisplay.map((category) => (
          <button
            key={category.id} 
            onClick={() => handleCategoryClick(category.slug)}
            className={itemBaseClass}
            aria-label={`Category: ${category.name}`}
          >
            <div className={`${iconContainerBaseClass} ${iconContainerSizeClass} bg-green-50 text-green-600`}>
              {renderIcon(category.icon)}
            </div>
            <span className={textClass}>{getCategoryDisplayName(category.name)}</span>
          </button>
        ))}
        
        {shouldShowToggleButton && (
          <button
            onClick={handleToggleShowAll}
            className={itemBaseClass}
            aria-expanded={showAll}
            aria-label={showAll ? "Show fewer categories" : "Show more categories"}
          >
            <div className={`${iconContainerBaseClass} ${iconContainerSizeClass} bg-gray-50 text-gray-500`}>
              {showAll 
                ? <ChevronUpIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                : <ChevronDownIcon className="h-5 w-5 sm:h-6 sm:w-6" />
              }
            </div>
            <span className={textClass}>{showAll ? "Show Less" : "View More"}</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default Categories;
