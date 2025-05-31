import React from 'react'; 
import styles from 'frontend/ui/components/shared/SearchBarComponent.module.css';

interface SearchBarComponentProps {
    placeholder?: string;
  searchQuery: string; 
  onSearchQueryChange: (query: string) => void; 
}

export default function SearchBarComponent({ 
  placeholder = 'Search for services', 
  searchQuery,
  onSearchQueryChange
}: SearchBarComponentProps) {

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchQueryChange(e.target.value);
  };

  const handleClearSearch = () => {
    onSearchQueryChange('');
  };

  return (
    <div className={styles.container}>
      <div className={styles.searchBar}>
        <span className={styles.searchIcon}>🔍</span>
        <input
          type="text"
          className={styles.searchInput}
          placeholder={placeholder}
          value={searchQuery} 
          onChange={handleInputChange} 
        />
        {searchQuery && (
          <button className={styles.clearButton} onClick={handleClearSearch}>
            <span className={styles.clearIcon}>✕</span>
          </button>
        )}
      </div>
    </div>
  );
}