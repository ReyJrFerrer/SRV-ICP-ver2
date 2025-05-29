import React from 'react';
import Link from 'next/link';
import { HomeIcon, BoltIcon, WrenchScrewdriverIcon, EllipsisHorizontalCircleIcon } from '@heroicons/react/24/solid';

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

const Categories: React.FC<CategoriesProps> = ({ categories, className = '' }) => {
  // Function to render the appropriate icon based on category
  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'home':
        return <HomeIcon className="h-7 w-7" />;
      case 'broom':
        return <BoltIcon className="h-7 w-7" />;
      case 'car':
        return <WrenchScrewdriverIcon className="h-7 w-7" />;
      default:
        return <EllipsisHorizontalCircleIcon className="h-7 w-7" />;
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
            href={`/customer/categories/${category.slug}`}
            className="flex flex-col items-center transition-transform hover:scale-105"
          >
            <div className="category-icon mb-2">
              {renderIcon(category.icon)}
            </div>
            <span className="text-sm font-medium text-center">{category.name}</span>
          </Link>
        ))}
        
        {/* More categories link */}
        <Link 
          href="/customer/categories/all-service-types"
          className="flex flex-col items-center transition-transform hover:scale-105"
        >
          <div className="category-icon mb-2">
            <EllipsisHorizontalCircleIcon className="h-7 w-7" />
          </div>
          <span className="text-sm font-medium text-center">More</span>
        </Link>
      </div>
    </div>
  );
};

export default Categories;
