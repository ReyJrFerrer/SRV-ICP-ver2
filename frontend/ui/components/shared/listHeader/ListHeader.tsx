import React, { useState } from 'react';
import styles from 'frontend/ui/components/shared//listHeader/ListHeader.module.css'; 
import UserLocationComponent from '../userLocation/UserLocationComponent';
import SearchBarComponent from '../searchBar/SearchBarComponent';
import { CATEGORIES, Category } from '../../../../public/data/categories';

interface ListHeaderProps {
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  selectedCategoryId: string | null; 
  onSelectCategory: (categoryId: string | null) => void; 
}

export default function ListHeader({ 
  searchQuery, 
  onSearchQueryChange,
  selectedCategoryId,
  onSelectCategory
}: ListHeaderProps) {
  const [showAllCategories, setShowAllCategories] = useState(false);

  const getCategoryIcon = (iconName: string): string => {
    const icons: { [key: string]: string } = {
      'home': '🏠',
      'broom': '🧹',
      'spa': '💆',
      'car': '🚗',
      'shipping-fast': '🚚',
      'mobile-alt': '📱',
      'camera': '📸',
      'graduation-cap': '🎓'
    };
    return icons[iconName] || '🔧'; 
  };

 const initialCategoryDisplayCount = 3;
  const displayedCategories: Category[] = showAllCategories 
    ? CATEGORIES 
    : CATEGORIES.slice(0, initialCategoryDisplayCount);
  const needsMoreButton = CATEGORIES.length > initialCategoryDisplayCount;

  const handleCategoryClick = (categoryId: string) => {
    // If the clicked category is already selected, deselect it (show all)
    // Otherwise, select the new category.
    onSelectCategory(selectedCategoryId === categoryId ? null : categoryId);
  };

  return (
    <div className={styles.headerContainer}>
      {/* Top Header with Location and Bookings */}
      <div className={styles.headerTop}>
        <div className={styles.headerLeft}>
          <UserLocationComponent />
        </div>
        <div className={styles.headerRight}>
          <button className={styles.bookingsButton}>
            <span className={styles.bookingIcon}>📅</span>
            <div className={styles.badgeContainer}>
              <span className={styles.badgeText}>3</span> {/* This is static, make dynamic if needed */}
            </div>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className={styles.searchBarContainer}>
        <SearchBarComponent 
          searchQuery={searchQuery}
          onSearchQueryChange={onSearchQueryChange}
        />
      </div>

      {/* Container */}
      <div className={styles.categoriesContainer}>
        <div className={styles.categoriesRow}>
          {displayedCategories.map((category) => (
            <div 
              key={category.id} 
              className={`${styles.category} ${selectedCategoryId === category.id ? styles.categoryActive : ''}`} // <<<< Apply active style
              onClick={() => handleCategoryClick(category.id)} // <<<< Handle click
              role="button"
              tabIndex={0}
              onKeyPress={(e) => { if (e.key === 'Enter' || e.key === ' ') handleCategoryClick(category.id);}}
            >
              <div className={styles.categoryIconContainer}>
                <span className={styles.categoryIcon}>
                  {getCategoryIcon(category.icon)}
                </span>
              </div>
              <span className={styles.categoryText}>{category.name}</span>
            </div>
          ))}

          {needsMoreButton && (
            <div
              className={`${styles.moreButton} ${showAllCategories ? styles.categoryActive : ''}`} // Optional: highlight "More/Less" if active in a sense
              onClick={() => setShowAllCategories(prev => !prev)}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => { if (e.key === 'Enter' || e.key === ' ') setShowAllCategories(prev => !prev);}}
            >
              <div className={styles.categoryIconContainer}>
                <span className={styles.categoryIcon}>
                  {showAllCategories ? '⬆️' : '⋯'}
                </span>
              </div>
              <span className={styles.categoryText}>
                {showAllCategories ? 'Less' : 'More'}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}