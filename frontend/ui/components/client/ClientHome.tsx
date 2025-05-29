import React from 'react';
import styles from './ClientHome.module.css';
import ListHeader from './../shared/ListHeader';
import ServiceCard from './ServiceCard';
import { SERVICES } from '../../../public/data/services';

export default function ClientHome() {
  return (
    <div className={styles.container}>
      {/* Header with location, search, and categories */}
      <ListHeader />
      
      {/* Top Picks Section */}
      <div className={styles.servicesSection}>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>Top Picks!</h3>
          <button className={styles.viewAllButton}>View All</button>
        </div>
        
        {/* Horizontal Service List */}
        <div className={styles.servicesList}>
          {SERVICES.map((service) => (
            <div key={service.id} className={styles.serviceCardWrapper}>
              <ServiceCard service={service} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
