import React, { useState, useEffect } from 'react';
import styles from 'frontend/ui/components/client/home/ClientHome.module.css';
import ListHeader from 'frontend/ui/components/shared/ListHeader';
import ServiceCard from 'frontend/ui/components/client/serviceCard/ServiceCard';
import { Service, SERVICES } from 'frontend/public/data/services'; 

export default function ClientHome() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [displayedServices, setDisplayedServices] = useState<Service[]>(SERVICES);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setDisplayedServices(SERVICES); 
      return;
    }

    const lowerCaseQuery = searchQuery.toLowerCase();
    const filtered = SERVICES.filter(service => {
      const nameMatch = service.name.toLowerCase().includes(lowerCaseQuery);
      const titleMatch = service.title.toLowerCase().includes(lowerCaseQuery);
      const descriptionMatch = service.description.toLowerCase().includes(lowerCaseQuery);
      
      const packageMatch = service.packages.some(pkg => 
        pkg.name.toLowerCase().includes(lowerCaseQuery)
      );

      return nameMatch || titleMatch || descriptionMatch || packageMatch;
    });

    setDisplayedServices(filtered);
  }, [searchQuery]); 
  const handleSearchQueryChange = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className={styles.container}>
      {/* Header with location, search, and categories */}
      <ListHeader 
        searchQuery={searchQuery}
        onSearchQueryChange={handleSearchQueryChange}
      />
      
      {/* Top Picks Section - Now displays filtered services */}
      <div className={styles.servicesSection}>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>
            {searchQuery.trim() ? "Search Results" : "Top Picks!"}
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
            No services found matching "{searchQuery}". Try a different search term.
          </p>
        )}
      </div>
    </div>
  );
}