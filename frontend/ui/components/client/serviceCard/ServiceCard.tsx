import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './ServiceCard.module.css';
import { Service } from '../../../../public/data/services';

interface ServiceCardProps {
  service: Service;
  inCategories?: boolean;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, inCategories = false }) => {
  return (
    <Link href={`/client/service/${service.slug}`} className={styles.linkWrapper}>
      <div className={inCategories ? styles.itemCategoriesPage : styles.itemHomePage}>
        <div className={styles.itemImageContainer}>
          <Image 
            src={service.heroImage} 
            alt={service.title} 
            fill
            className={styles.serviceImage}
            sizes="(max-width: 768px) 300px, 350px"
          />
          <div className={`${styles.availabilityBadge} ${service.availability.isAvailableNow ? styles.available : styles.unavailable}`}>
            {service.availability.isAvailableNow ? 'Available' : 'Busy'}
          </div>
        </div>
        <div className={styles.serviceTextContainer}>
          <div>
            <div className={styles.topRowContainer}>
              <h3 className={styles.serviceName}>{service.name}</h3>
              <div className={styles.serviceRatings}>
                <span className={styles.star}>⭐</span>
                <span>{service.rating.average} ({service.rating.count})</span>
              </div>
            </div>
            <p className={styles.serviceTitle}>{service.title}</p>
          </div>
          <div className={inCategories ? styles.bottomRowContainer : styles.categoriesRowContainer}>
            <span className={styles.servicePrice}>
              {service.price.currency === 'PHP' ? '₱' : service.price.currency} {service.price.amount.toFixed(2)} {service.price.unit}
            </span>
            <span className={styles.serviceLocationRadius}>
              <span className={styles.locationIcon}>📍</span>
              {service.location.serviceRadius} {service.location.serviceRadiusUnit}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ServiceCard;