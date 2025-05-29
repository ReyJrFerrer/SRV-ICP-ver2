import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface SearchBarProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
  className?: string;
  redirectToSearch?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = 'Search for service',
  className = '',
  redirectToSearch = true
}) => {
  const [query, setQuery] = useState('');
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (query.trim()) {
      if (onSearch) {
        onSearch(query);
      }
      
      if (redirectToSearch) {
        router.push(`/client/service-maps?q=${encodeURIComponent(query)}`);
      }
    }
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className={`search-bar group hover:ring-2 hover:ring-green-200 focus-within:ring-2 focus-within:ring-green-300 transition-all ${className}`}
    >
      <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 mr-3" />
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full py-2 bg-transparent outline-none text-gray-700"
        aria-label="Search"
      />
    </form>
  );
};

export default SearchBar;
