import React, { useState } from 'react';
import styles from './ListHeader.module.css';
import UserLocationComponent from './UserLocationComponent';
import SearchBarComponent from './SearchBarComponent';
import { CATEGORIES, Category } from '../../../public/data/categories';

export default function ListHeader() {
  const [showAll, setShowAll] = useState(false);

  const getCategoryIcon = (iconName: string) => {
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

  const displayedCategories: Category[] = showAll ? CATEGORIES : CATEGORIES.slice(0, 3);

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
              <span className={styles.badgeText}>3</span>
            </div>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className={styles.searchBarContainer}>
        <SearchBarComponent />
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

          <div
            className={styles.moreButton}
            onClick={() => setShowAll(prev => !prev)}
          >
            <div className={styles.categoryIconContainer}>
              <span className={styles.categoryIcon}>
                {showAll ? '⬆' : '⋯'}
              </span>
            </div>
            <span className={styles.categoryText}>
              {showAll ? 'Less' : 'More'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
