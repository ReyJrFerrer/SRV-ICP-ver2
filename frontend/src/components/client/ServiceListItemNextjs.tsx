import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { StarIcon, MapPinIcon, UserCircleIcon } from '@heroicons/react/24/solid';
import { EnrichedService } from '@app/hooks/serviceInformation';
import { useServiceReviews } from '@app/hooks/reviewManagement';

interface ServiceListItemProps {
  service: EnrichedService;
  inCategories?: boolean;
  isGridItem?: boolean;
  retainMobileLayout?: boolean;
}

const ServiceListItem: React.FC<ServiceListItemProps> = ({ 
  service, 
  inCategories = false,
  isGridItem = false,
  retainMobileLayout = false
}) => {
  // Use the review management hook for this specific service
  const { 
    reviews, 
    loading: reviewsLoading, 
    calculateServiceRating,
    getAverageRating,
    error: reviewsError 
  } = useServiceReviews(service.id);

  // Local state for service rating data
  const [serviceRating, setServiceRating] = useState<{
    average: number;
    count: number;
    loading: boolean;
  }>({
    average: service.rating?.average || 0,
    count: service.rating?.count || 0,
    loading: false
  });

  // Load service rating when component mounts or service ID changes
  useEffect(() => {
    const loadServiceRating = async () => {
      if (!service.id) return;
      
      setServiceRating(prev => ({ ...prev, loading: true }));
      
      try {
        // Calculate the service rating from reviews
        const calculatedRating = await calculateServiceRating(service.id);
        
        // Use the reviews data to get count and average
        const reviewCount = reviews.filter(review => review.status === 'Visible').length;
        const averageRating = calculatedRating || getAverageRating(reviews) || 0;
        
        setServiceRating({
          average: averageRating,
          count: reviewCount,
          loading: false
        });
      } catch (error) {
        // Fallback to service rating data if available
        setServiceRating({
          average: service.rating?.average || 0,
          count: service.rating?.count || 0,
          loading: false
        });
      }
    };

    loadServiceRating();
  }, [service.id, service.rating, calculateServiceRating, getAverageRating, reviews]);

  // Define layout classes based on props
  const itemWidthClass = isGridItem 
    ? 'w-full' // Full width for grid items
    : 'w-full'; // Default width for list items

  // Determine availability status (simplified since we may not have full availability data)
  const isAvailable = service.availability?.isAvailable ?? false;
  const availabilityText = isAvailable ? 'Available' : 'Not Available';

  // Define responsive classes based on retainMobileLayout
  const nameRatingContainerClass = retainMobileLayout
    ? "flex flex-row justify-between items-start mb-1" // Name and Rating on same line
    : "flex flex-col sm:flex-row sm:justify-between sm:items-start mb-1"; // Default responsive

  const priceLocationContainerClass = retainMobileLayout
    ? "flex flex-row justify-between items-center mt-auto pt-2 border-t border-gray-100" // Price and Location on same line
    : "flex flex-col items-start sm:flex-row sm:justify-between sm:items-center mt-auto pt-2 border-t border-gray-100"; // Default responsive

  const nameMarginClass = !retainMobileLayout ? "mb-0.5 sm:mb-0" : "";
  const ratingMarginClass = !retainMobileLayout ? "mt-0.5 sm:mt-0 sm:ml-2" : "sm:ml-2"; 
  const priceMarginClass = !retainMobileLayout ? "mb-0.5 sm:mb-0" : "";
  const locationMarginClass = !retainMobileLayout ? "mt-0.5 sm:mt-0" : "";

  // Helper function to render rating stars
  const renderRatingStars = (rating: number, size: string = "h-3 w-3") => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex items-center">
        {/* Full stars */}
        {Array.from({ length: fullStars }, (_, i) => (
          <StarIcon key={`full-${i}`} className={`${size} text-yellow-400`} />
        ))}
        
        {/* Half star */}
        {hasHalfStar && (
          <div className="relative">
            <StarIcon className={`${size} text-gray-300`} />
            <div className="absolute inset-0 overflow-hidden w-1/2">
              <StarIcon className={`${size} text-yellow-400`} />
            </div>
          </div>
        )}
        
        {/* Empty stars */}
        {Array.from({ length: emptyStars }, (_, i) => (
          <StarIcon key={`empty-${i}`} className={`${size} text-gray-300`} />
        ))}
      </div>
    );
  };

  return (
    <Link href={`/client/service/${service.id}`} legacyBehavior>
      <a className={`service-card block ${itemWidthClass} group overflow-hidden flex flex-col`}>
        <div className="relative"> {/* Image container */}
          <div className="aspect-video w-full">
            <Image 
              src={service.providerAvatar || "/images/Tutoring-MathTutor1.jpg"}
              alt={service.title}
              className="service-image group-hover:scale-105 transition-transform duration-300"
              style={{ objectFit: 'cover' }}
              fill
              priority
            />
          </div>
          
          {/* Category badge */}
          {/* {service.category && (
            <div className="absolute top-2 left-2 px-2 py-0.5 text-xs font-semibold text-white rounded-full shadow bg-blue-600">
              {service.category.name}
            </div>
          )} */}
          
          {/* Availability badge */}
          <div 
            className={`absolute top-2 right-2 px-2 py-0.5 text-xs font-semibold text-white rounded-full shadow
                      ${isAvailable ? 'bg-green-500' : 'bg-red-500'}`}
          >
            {availabilityText}
          </div>
        </div>
        
        <div className="service-content p-3 flex flex-col flex-grow">
          <div className="flex-grow"> {/* This div helps push price/location to bottom */}
            <div className={nameRatingContainerClass}>
              <h3 className={`text-md font-bold text-blue-800 leading-tight group-hover:text-green-600 transition-colors ${nameMarginClass} truncate`}>
                {service.providerName}
              </h3>
              
              {/* Enhanced rating display */}
              <div className={`flex items-center text-blue-800 text-xs flex-shrink-0 ${ratingMarginClass}`}>
                {serviceRating.loading ? (
                  <div className="flex items-center">
                    <div className="animate-pulse bg-gray-300 h-3 w-12 rounded"></div>
                    <span className="ml-1 text-gray-400">Loading...</span>
                  </div>
                ) : serviceRating.count > 0 ? (
                  <>
                    {renderRatingStars(serviceRating.average)}
                    <span className="ml-1">
                      {serviceRating.average.toFixed(1)} ({serviceRating.count})
                    </span>
                  </>
                ) : (
                  <div className="flex items-center text-gray-400">
                    {renderRatingStars(0)}
                    <span className="ml-1">No reviews</span>
                  </div>
                )}
                
                {/* Show error indicator if reviews failed to load */}
                {reviewsError && (
                  <span className="ml-1 text-red-400 text-xs" title={reviewsError}>
                    ⚠️
                  </span>
                )}
              </div>
            </div>
            
            {/* Display service title */}
            <p className="text-blue-700 text-sm mb-2 leading-snug">{service.title}</p>
            
            {/* Location info - city/address if available */}
            {service.location && (service.location.city || service.location.address) && (
              <div className="flex items-center text-xs text-blue-700 mb-2">
                <MapPinIcon className="h-3 w-3 mr-0.5 flex-shrink-0" />
                <span className="truncate">
                  {service.location.city || service.location.address}
                  {service.location.state ? `, ${service.location.state}` : ''}
                </span>
              </div>
            )}
          </div>
          
          <div className={priceLocationContainerClass}>
            <p className={`text-lg font-bold text-blue-800 ${priceMarginClass}`}>
              {service.price.display || `₱${service.price.amount.toFixed(2)}`}
              <span className="text-xs font-normal">{!service.price.display ? `/${service.price.unit}` : ''}</span>
            </p>
            <div className={`flex items-center text-blue-800 text-xs ${locationMarginClass}`}>
              <MapPinIcon className="h-3 w-3 mr-0.5" />
              <span>{service.location.serviceRadius} {service.location.serviceRadiusUnit}</span>
            </div>
          </div>
        </div>
      </a>
    </Link>
  );
};

export default ServiceListItem;
