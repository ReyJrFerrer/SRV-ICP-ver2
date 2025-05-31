import React from 'react';
import styles from 'frontend/ui/components/shared/userLocation/UserLocationComponent.module.css';

interface UserLocationComponentProps {
  onPress?: () => void;
  showMapMarker?: boolean;
}

export default function UserLocationComponent({ 
  onPress, 
  showMapMarker = true 
}: UserLocationComponentProps) {
  return (
    <div className={styles.container}>
      <div className={styles.avatarContainer}>
        <div className={styles.avatar}>
          <span className={styles.avatarText}>U</span>
        </div>
      </div>
      
      <div className={styles.locationInfo}>
        <p className={styles.greeting}>Good morning!</p>
        <div className={styles.locationContainer}>
          <span className={styles.locationIcon}>📍</span>
          <button 
            className={styles.locationButton}
            onClick={onPress}
          >
            <span className={styles.locationText}>Current Location</span>
            <span className={styles.address}>123 Main St, City</span>
          </button>
          {showMapMarker && (
            <button className={styles.mapButton} onClick={onPress}>
              <span className={styles.mapIcon}>🗺️</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}