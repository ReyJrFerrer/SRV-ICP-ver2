import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { ArrowLeftIcon, StarIcon as StarSolid, UserIcon } from '@heroicons/react/24/solid';

import { Service } from '../../../../../assets/types/service/service';
import { ProviderReview } from '../../../../../assets/providerReviews'; // Assuming type is exported
import { ServiceProvider } from '../../../../../assets/types/provider/service-provider'; // Import ServiceProvider type
import { SERVICES } from '../../../../../assets/services';
import { PROVIDER_REVIEWS } from '../../../../../assets/providerReviews';
import { SERVICE_PROVIDERS } from '../../../../../assets/serviceProviders'; // Import mock provider data
import { adaptServiceData } from '../../../../utils/serviceDataAdapter'; // If needed for service

const StarRatingDisplay: React.FC<{ rating: number; maxStars?: number }> = ({ rating, maxStars = 5 }) => {
  return (
    <div className="flex items-center">
      {[...Array(maxStars)].map((_, index) => {
        const starValue = index + 1;
        return (
          <StarSolid
            key={index}
            className={`h-5 w-5 ${starValue <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
          />
        );
      })}
    </div>
  );
};

const ServiceReviewsPage: React.FC = () => {
  const router = useRouter();
  const { slug } = router.query;

  const [service, setService] = useState<Service | null>(null);
  const [serviceProvider, setServiceProvider] = useState<ServiceProvider | null>(null); // State for provider data
  const [reviews, setReviews] = useState<ProviderReview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug && typeof slug === 'string') {
      const allServices = adaptServiceData(SERVICES); 
      const foundService = allServices.find(s => s.slug === slug);
      
      if (foundService) {
        setService(foundService);

        const foundProvider = SERVICE_PROVIDERS.find(p => p.id === foundService.providerId);
        setServiceProvider(foundProvider || null);
        
        const providerSpecificReviews = PROVIDER_REVIEWS.filter(
          review => review.providerId === foundService.providerId
        );
        setReviews(providerSpecificReviews);
      }
      setLoading(false);
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="ml-4 text-gray-700">Loading reviews...</p>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Service Not Found</h1>
        <p className="text-gray-600 mb-6">We couldn't find the service you were looking for.</p>
        <button
          onClick={() => router.push('/client/home')}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Back to Home
        </button>
      </div>
    );
  }
  
  const providerName = serviceProvider ? `${serviceProvider.firstName} ${serviceProvider.lastName}` : service.name;
  const providerImage = serviceProvider?.profilePicture?.url || service.heroImage;

  return (
    <>
      <Head>
        <title>Reviews for {service.title} by {providerName} | SRV Client</title>
        <meta name="description" content={`Read reviews for ${service.title} offered by ${providerName}`} />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header for navigation */}
        <header className="bg-white shadow-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-3 flex items-center">
            <button
              onClick={() => router.back()}
              className="p-2 rounded-full hover:bg-gray-100 mr-3"
            >
              <ArrowLeftIcon className="h-6 w-6 text-gray-700" />
            </button>
            <h1 className="text-lg font-semibold text-gray-800 truncate">
              Reviews for {service.title}
            </h1>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto p-4">
          <div className="bg-white p-4 md:p-6 rounded-lg shadow-md mb-6 flex items-center space-x-4"> 
            <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden flex-shrink-0 border border-gray-200">
              <Image
                src={providerImage} 
                alt={providerName}
                layout="fill"
                objectFit="cover"
              />
            </div>

            {/* Right: Details */}
            <div className="flex-grow">
              <h2 className="text-xl md:text-2xl font-bold text-gray-800">{providerName}</h2>
              <p className="text-sm md:text-md text-gray-600 mb-1">{service.title}</p>
              <div className="flex items-center space-x-1 text-xs md:text-sm text-gray-700">
                <StarRatingDisplay rating={service.rating.average} />
                <span className="font-semibold">{service.rating.average.toFixed(1)}</span>
                <span>({service.rating.count} reviews)</span>
              </div>
            </div>
          </div>

          {/* Reviews List */}
          {reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="bg-white p-4 rounded-lg shadow">
                  <div className="flex items-start mb-3"> 
                    <div className="relative w-10 h-10 rounded-full overflow-hidden mr-3 flex-shrink-0 border border-gray-100 bg-gray-200 flex items-center justify-center">
                      {review.clientProfilePicture ? (
                        <Image
                          src={review.clientProfilePicture} 
                          alt={review.clientName}
                          layout="fill"
                          objectFit="cover"
                          onError={(e) => {
                            console.error("Failed to load client image:", review.clientProfilePicture);
                            (e.target as HTMLImageElement).style.display = 'none'; 
                          }}
                        />
                      ) : (
                        <UserIcon className="h-6 w-6 text-gray-500" />
                      )}
                    </div>
                    <div className="flex-grow">
                      <h4 className="font-semibold text-gray-800">{review.clientName}</h4>
                      <p className="text-xs text-gray-500">
                        {new Date(review.reviewDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="mb-2">
                    <StarRatingDisplay rating={review.rating} />
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">{review.reviewText}</p>
                  {review.providerReply && (
                    <div className="mt-3 pt-3 border-t border-gray-200 bg-gray-50 p-3 rounded">
                      <h5 className="text-xs font-semibold text-gray-600 mb-1">Provider's Reply:</h5>
                      <p className="text-xs text-gray-600 leading-relaxed">{review.providerReply.text}</p>
                      <p className="text-xs text-gray-400 mt-1 text-right">
                        {new Date(review.providerReply.replyDate).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-white rounded-lg shadow">
              <p className="text-gray-600">No reviews yet for this provider.</p>
            </div>
          )}
        </main>
      </div>
    </>
  );
};


export default ServiceReviewsPage;