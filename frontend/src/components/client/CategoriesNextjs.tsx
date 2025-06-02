import React from 'react';
import Link from 'next/link';
import { 
  HomeIcon, 
  BoltIcon, 
  WrenchScrewdriverIcon, 
  EllipsisHorizontalCircleIcon,
  TruckIcon,
  ComputerDesktopIcon,
  SparklesIcon
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

const Categories: React.FC<CategoriesProps> = ({ categories, className = '' }) => {
  // Function to render the appropriate icon based on category
  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'home':
        return <HomeIcon className="h-7 w-7 text-indigo-600" />;
      case 'broom':
        return <SparklesIcon className="h-7 w-7 text-green-600" />;
      case 'car':
        return <WrenchScrewdriverIcon className="h-7 w-7 text-blue-600" />;
      case 'truck':
        return <TruckIcon className="h-7 w-7 text-yellow-600" />;
      case 'computer':
        return <ComputerDesktopIcon className="h-7 w-7 text-purple-600" />;
      case 'bolt':
        return <BoltIcon className="h-7 w-7 text-red-600" />;
      case 'wrench':
        return <WrenchScrewdriverIcon className="h-7 w-7 text-gray-600" />;
      case 'sparkles':
        return <SparklesIcon className="h-7 w-7 text-pink-600" />;
      default:
        return <EllipsisHorizontalCircleIcon className="h-7 w-7 text-gray-500" />;
    }
  };

  return (
    <div className={`${className}`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Categories</h2>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {categories.slice(0, 3).map((category) => (
          <Link 
            key={category.id} 
            href={`/client/categories/${category.slug}`}
            className="flex flex-col items-center transition-transform hover:scale-105"
          >
            <div className="category-icon mb-2 bg-gray-100 p-3 rounded-full">
              {renderIcon(category.icon)}
            </div>
            <span className="text-sm font-medium text-center">
              {getCategoryDisplayName(category.name)}
            </span>
          </Link>
        ))}
        
        {/* More categories link */}
        <Link 
          href="/client/categories/all-service-types"
          className="flex flex-col items-center transition-transform hover:scale-105"
        >
          <div className="category-icon mb-2 bg-gray-100 p-3 rounded-full">
            <EllipsisHorizontalCircleIcon className="h-7 w-7 text-gray-500" />
          </div>
          <span className="text-sm font-medium text-center">More</span>
        </Link>
      </div>
    </div>
  );
};

export default Categories;
