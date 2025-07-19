import React from 'react';
import Image from 'next/image';
import { ChevronLeftIcon, CheckCircleIcon, StarIcon } from "@heroicons/react/24/solid"

// --- Data Types (adapted from your existing data) ---
interface ProviderProfile {
  name: string;
  bio: string;
  profilePicUrl: string;
  ratings: number;
  reviews: number;
  location: string;
  availability: string;
  isVerified: boolean;
  serviceRequirements: string[];
  servicePhotos: string[];
  certifications: string[];
  stats: {
    projects: number;
    reviews: number;
    years: number;
  }
}

interface Service {
  title: string;
  price: string;
  details: string[];
}

interface PublicProfileViewProps {
  providerData: ProviderProfile & { services: Service[] };
}

const renderStars = (rating: number) => {
  const stars = [];
  for (let i = 0; i < 5; i++) {
    stars.push(
      <StarIcon key={i} className={`
        ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
      `} />
    );
  }
  return stars;
};

const ServiceCard = ({ service }: { service: Service }) => (
  <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
    <h3 className="font-bold text-lg mb-1">{service.title}</h3>
    <span className="text-blue-500 font-semibold text-lg">{service.price}</span>
    <p className="text-gray-600 text-sm mt-2">{service.details[0]}</p>
    <h4 className="font-semibold text-sm mt-3 mb-1">Includes:</h4>
    <ul className="space-y-1 text-sm">
      {service.details.map((detail, index) => (
        <li key={index} className="flex items-start">
          <CheckCircleIcon className="text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
          <span>{detail}</span>
        </li>
      ))}
    </ul>
  </div>
);

const PublicProfileView: React.FC<PublicProfileViewProps> = ({ providerData }) => {
  const data = providerData; // Use the passed-in prop

  return (
    <div className="font-sans bg-gray-100 min-h-screen">
      <header className="flex justify-between items-center px-4 py-3 bg-white shadow-sm border-b">
        <button aria-label="Go back"><ChevronLeftIcon className="text-gray-600" /></button>
        <span className="text-lg font-bold text-blue-600">SRV</span>
        <div></div>
      </header>
      <main className="container mx-auto px-4 py-6 max-w-xl">
        {/* Profile Card Section */}
        <section className="bg-white rounded-lg shadow-lg">
          <div className="relative">
            <Image
              src={data.profilePicUrl}
              alt={data.name}
              width={500}
              height={300}
              className="w-full h-auto rounded-t-lg object-cover"
            />
            <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
              <div className="flex items-center space-x-2 bg-white/70 px-3 py-1 rounded-full backdrop-blur-sm">
                <h1 className="text-xl font-bold">{data.name}</h1>
                {data.isVerified && <CheckCircleIcon className="text-blue-500 fill-blue-500" />}
              </div>
            </div>
            <div className="absolute bottom-4 right-4 flex space-x-2">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold shadow-md">Message</button>
            </div>
          </div>
          <div className="p-4">
            <p className="text-gray-700 text-sm mb-4">{data.bio}</p>
          </div>
        </section>

        {/* Services Section */}
        <section className="mt-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Services</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {data.services.map((service, index) => (
              <ServiceCard key={index} service={service} />
            ))}
          </div>
        </section>

        {/* Credentials */}

      </main>
    </div>
  );
};



export default PublicProfileView;