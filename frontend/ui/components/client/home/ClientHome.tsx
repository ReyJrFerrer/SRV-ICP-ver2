import React, { useState, useEffect } from 'react';
import styles from 'frontend/ui/components/client/home/ClientHome.module.css';
import ListHeader from 'frontend/ui/components/shared/ListHeader';
import ServiceCard from 'frontend/ui/components/client/serviceCard/ServiceCard';
import { Service, SERVICES } from 'frontend/public/data/services'; 
import { CATEGORIES } from 'frontend/public/data/categories'; 

export default function ClientHome() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null); // <<<< NEW STATE for selected category
  const [displayedServices, setDisplayedServices] = useState<Service[]>(SERVICES);
  const [sectionTitle, setSectionTitle] = useState<string>("Top Picks!"); // State for the section title

  useEffect(() => {
    let servicesToFilter = SERVICES;

    // 1. Filter by Category
    if (selectedCategoryId) {
      servicesToFilter = SERVICES.filter(service => service.categoryId === selectedCategoryId);
      const category = CATEGORIES.find(cat => cat.id === selectedCategoryId);
      setSectionTitle(category ? category.name : "Filtered Services");
    } else {
      setSectionTitle("All Services"); // Or "Top Picks!" if search is also empty
    }

    // 2. Filter by Search Query (on top of category filter or all services)
    if (searchQuery.trim() !== '') {
      const lowerCaseQuery = searchQuery.toLowerCase();
      servicesToFilter = servicesToFilter.filter(service => {
        const nameMatch = service.name.toLowerCase().includes(lowerCaseQuery);
        const titleMatch = service.title.toLowerCase().includes(lowerCaseQuery);
        const descriptionMatch = service.description.toLowerCase().includes(lowerCaseQuery);
        const packageMatch = service.packages.some(pkg => 
          pkg.name.toLowerCase().includes(lowerCaseQuery)
        );
        return nameMatch || titleMatch || descriptionMatch || packageMatch;
      });
      // If there's a search query, override section title
      if (!selectedCategoryId) setSectionTitle("Search Results");
      else setSectionTitle(`${CATEGORIES.find(cat => cat.id === selectedCategoryId)?.name || 'Results'} matching "${searchQuery}"`);
    } else {
        // If search query is empty, title is based on category or default
        if (!selectedCategoryId) setSectionTitle("Top Picks!");
    }


    setDisplayedServices(servicesToFilter);
  }, [searchQuery, selectedCategoryId]); // Re-filter when searchQuery OR selectedCategoryId changes

  const handleSearchQueryChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleSelectCategory = (categoryId: string | null) => {
    setSelectedCategoryId(categoryId);
    // Optionally, you might want to clear the search query when a new category is selected
    // setSearchQuery(''); 
  };

  return (
    <div className={styles.container}>
      <ListHeader 
        searchQuery={searchQuery}
        onSearchQueryChange={handleSearchQueryChange}
        selectedCategoryId={selectedCategoryId}
        onSelectCategory={handleSelectCategory} // <<<< Pass new props
      />
      
      <div className={styles.servicesSection}>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>
            {displayedServices.length === 0 && (searchQuery.trim() || selectedCategoryId) ? "No Services Found" : sectionTitle}
          </h3>
        </div>
        
        {displayedServices.length > 0 ? (
          <div className={styles.servicesList}>
            {displayedServices.map((service) => (
              <div key={service.id} className={styles.serviceCardWrapper}>
                <ServiceCard service={service} />
              </div>
            ))}
          </div>
        ) : (
          <p className={styles.noResults}>
            {searchQuery.trim() && !selectedCategoryId ? `No services found matching "${searchQuery}".` : 
             selectedCategoryId && !searchQuery.trim() ? `No services found in this category.` :
             searchQuery.trim() && selectedCategoryId ? `No services found in this category matching "${searchQuery}".` :
             `No services available at the moment.`
            }
          </p>
        )}
      </div>
    </div>
  );
}