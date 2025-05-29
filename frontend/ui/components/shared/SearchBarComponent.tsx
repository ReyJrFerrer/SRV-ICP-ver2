import React, { useState } from 'react';
import styles from './SearchBarComponent.module.css';

interface SearchBarComponentProps {
  onPress?: () => void;
  placeholder?: string;
  mapScreen?: boolean;
}

export default function SearchBarComponent({ 
  onPress, 
  placeholder = 'Search for services', 
  mapScreen = false 
}: SearchBarComponentProps) {
  const [searchText, setSearchText] = useState('');

  const handleInputClick = () => {
    if (!mapScreen && onPress) {
      onPress();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const handleSearch = () => {
    console.log('Searching for:', searchText);
  };

  return (
    <div className={styles.container}>
      <div className={styles.searchBar}>
        <span className={styles.searchIcon}>🔍</span>
        <input
          type="text"
          className={styles.searchInput}
          placeholder={placeholder}
          value={searchText}
          onChange={handleInputChange}
          onClick={handleInputClick}
          readOnly={!mapScreen}
        />
        {searchText && (
          <button className={styles.clearButton} onClick={() => setSearchText('')}>
            <span className={styles.clearIcon}>✕</span>
          </button>
        )}
      </div>
    </div>
  );
}