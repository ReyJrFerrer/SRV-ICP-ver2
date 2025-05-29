import React from 'react';
import Image from 'next/image';
import { Service as OriginalServiceType } from 'frontend/public/data/services'; // Adjusted path
import styles from 'frontend/ui/components/client/ServiceDetailPageComponent.module.css';
import { useRouter } from 'next/router'; // Import useRouter

interface ServiceDetailPageComponentProps {
  service: Omit<OriginalServiceType, 'createdAt' | 'updatedAt'> & {
    createdAt: string;
    updatedAt: string;
  };
}

const ServiceHeroImage: React.FC<{ service: ServiceDetailPageComponentProps['service'] }> = ({ service }) => (
  <div className={styles.heroImageContainer}>
    <Image 
      src={service.heroImage || '/images/default-service.png'} 
      alt={service.title} 
      width={500} 
      height={250} 
      className={styles.heroImage}
      objectFit="cover"
    />
  </div>
);

const ServiceInfoSection: React.FC<{ service: ServiceDetailPageComponentProps['service'] }> = ({ service }) => (
  <div className={styles.infoSection}>
    <h2>{service.name}</h2>
    <p className={styles.description}>{service.description}</p>
    
    <div className={styles.detailItem}>
      <span className={styles.detailIcon}>💰</span>
      <strong>Price:</strong> {service.price.currency === 'PHP' ? '₱' : service.price.currency}
      {service.price.amount.toFixed(2)} {service.price.unit} 
      {service.price.isNegotiable && " (Negotiable)"}
    </div>

    <div className={styles.detailItem}>
      <span className={styles.detailIcon}>📍</span>
      <strong>Location:</strong> {service.location.address} (Service Radius: {service.location.serviceRadius}{service.location.serviceRadiusUnit})
    </div>
 
  </div>
);

const ServiceAvailabilitySection: React.FC<{ service: ServiceDetailPageComponentProps['service'] }> = ({ service }) => (
  <div className={styles.availabilitySection}>
    <h3>Availability</h3>
    <div className={styles.detailItem}>
      <span className={styles.detailIcon}>📅</span> 
      <strong>Days:</strong> {service.availability.schedule.join(', ')}
    </div>
    <div className={styles.detailItem}>
      <span className={styles.detailIcon}>⏰</span> 
      <strong>Hours:</strong> {service.availability.timeSlots.join(', ')}
    </div>
    <div className={`${styles.detailItem} ${service.availability.isAvailableNow ? styles.availableNow : styles.notAvailableNow}`}>
      <span className={styles.detailIcon}>✅</span> 
      {service.availability.isAvailableNow ? "Available Now" : "Currently Busy"}
    </div>
  </div>
);

const ServiceRatingSection: React.FC<{ service: ServiceDetailPageComponentProps['service'] }> = ({ service }) => (
  <div className={styles.ratingSection}>
    <h3>Rating</h3>
    <div className={styles.detailItem}>
      <span className={styles.detailIcon}>⭐</span> 
      <strong>{service.rating.average.toFixed(1)}</strong> ({service.rating.count} reviews)
    </div>
  </div>
);

const ServiceRequirementsSection: React.FC = () => (
 <div className={styles.requirementsSection}>
   <h3>Requirements</h3>
   <ul>
     <li>Cleaning supplies provided by client</li>
     <li>Proper ventilation</li>
     <li>Access to water and electricity</li>
   </ul>
 </div>
);

const ServiceVerificationSection: React.FC<{ isVerified: boolean }> = ({ isVerified }) => (
 <div className={styles.verificationSection}>
   <h3>Verification</h3>
   <div className={`${styles.detailItem} ${isVerified ? styles.verified : styles.notVerified}`}>
     <span className={styles.detailIcon}>🛡️</span>
     {isVerified ? "This service provider is verified" : "Not verified"}
   </div>
 </div>
);

const ServiceImagesSection: React.FC = () => (
  <div className={styles.serviceImagesSection}>
    <h3>Service Images</h3>
    <div className={styles.imageGallery}>
      <div className={styles.galleryImagePlaceholder}>Image 1</div>
      <div className={styles.galleryImagePlaceholder}>Image 2</div>
    </div>
  </div>
);


const ServiceDetailPageComponent: React.FC<ServiceDetailPageComponentProps> = ({ service }) => {
  const router = useRouter(); // Initialize router

  const handleBookingRequest = () => {
    // Navigate to the booking page, passing the service slug
    router.push(`/client/book/${service.slug}`);
  };

  return (
    <div className={styles.detailContainer}>
      <ServiceHeroImage service={service} />
      <div className={styles.contentPadding}>
        <ServiceInfoSection service={service} />
        <ServiceAvailabilitySection service={service} />
        <ServiceRatingSection service={service} />
        <ServiceRequirementsSection />
        <ServiceVerificationSection isVerified={true} /> 
        <ServiceImagesSection />
      </div>
      <div className={styles.bookingButtonContainer}>
        <button onClick={handleBookingRequest} className={styles.bookingButton}>
          Send Booking Request
        </button>
      </div>
    </div>
  );
};

export default ServiceDetailPageComponent;