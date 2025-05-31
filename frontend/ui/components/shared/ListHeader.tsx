import React, { useState } from 'react';
import styles from 'frontend/ui/components/shared/ListHeader.module.css'; 
import UserLocationComponent from './UserLocationComponent';
import SearchBarComponent from './SearchBarComponent';
import { CATEGORIES, Category } from '../../../public/data/categories';

interface ListHeaderProps {
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
}

export default function ListHeader({ searchQuery, onSearchQueryChange }: ListHeaderProps) {
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

  const initialCategoryDisplayCount = 3; // Number of categories to show 
  
  const displayedCategories: Category[] = showAllCategories 
    ? CATEGORIES 
    : CATEGORIES.slice(0, initialCategoryDisplayCount);

  const needsMoreButton = CATEGORIES.length > initialCategoryDisplayCount;

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

      {/* Categories */}
      <div className={styles.categoriesContainer}>
        <div className={styles.categoriesRow}>
          {displayedCategories.map((category) => (
            <div key={category.id} className={styles.category}>
              <div className={styles.categoryIconContainer}>
                <span className={styles.categoryIcon}>
                  {getCategoryIcon(category.icon)}
                </span>
              </div>
              <span className={styles.categoryText}>{category.name}</span>
            </div>
          ))}

          {/* Conditionally render the More/Less button */}
          {needsMoreButton && (
            <div
              className={styles.moreButton} 
              onClick={() => setShowAllCategories(prev => !prev)}
              role="button" 
              tabIndex={0} 
              onKeyPress={(e) => { if (e.key === 'Enter' || e.key === ' ') setShowAllCategories(prev => !prev);}} // Accessibility
            >
              <div className={styles.categoryIconContainer}>
                <span className={styles.categoryIcon}>
                  {showAllCategories ? '⬆️' : '⋯'} {/* Using a more distinct up arrow emoji */}
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