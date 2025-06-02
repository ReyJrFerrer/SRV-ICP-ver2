import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { 
  HomeIcon, 
  PaintBrushIcon,
  TruckIcon,
  ComputerDesktopIcon,
  ScissorsIcon,
  SparklesIcon,
  AcademicCapIcon,
  CameraIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  EllipsisHorizontalCircleIcon 
} from '@heroicons/react/24/solid';

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
  default: EllipsisHorizontalCircleIcon,
};

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

const Categories: React.FC<CategoriesProps> = ({ 
  categories, 
  className = '', 
  initialItemCount = 3 
}) => {
  const router = useRouter();
  const [showAll, setShowAll] = useState(false);

  const categoriesToDisplay = showAll ? categories : categories.slice(0, initialItemCount);
  const shouldShowToggleButton = categories.length > initialItemCount;

  const renderIcon = (iconKey: string, baseClass: string) => {
    const IconComponent = iconMap[iconKey] || iconMap.default;
    return <IconComponent className={baseClass} />;
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
  const iconSizeClass = "h-5 w-5 sm:h-6 sm:h-6 md:h-7 md:h-7"; // Mobile: 20px, sm: 24px, md: 28px
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
              {renderIcon(category.icon, iconSizeClass)}
            </div>
            <span className={textClass}>{category.name}</span>
          </button>
        ))}
        
        {shouldShowToggleButton && (
          <button
            onClick={handleToggleShowAll}
            className={itemBaseClass}
            aria-expanded={showAll}
            aria-label={showAll ? "Show fewer categories" : "Show more categories"}
          >
            <div className={`${iconContainerBaseClass} ${iconContainerSizeClass} bg-gray-100 text-gray-700`}>
              {showAll ? 
                <ChevronUpIcon className={iconSizeClass} /> : 
                <ChevronDownIcon className={iconSizeClass} />}
            </div>
            <span className={textClass}>
              {showAll ? 'Less' : 'More'}
            </span>
          </button>
        )}
      </div>
    </div>
  );
};

export default Categories;