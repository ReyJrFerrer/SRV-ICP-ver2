import React from 'react';
import { 
    MagnifyingGlassIcon, 
    CalendarDaysIcon, 
    StarIcon as StarOutlineIcon, 
    ShieldCheckIcon,
    UsersIcon 
} from '@heroicons/react/24/outline'; 

const features = [
  {
    title: 'Service Discovery',
    description: 'Easily browse categories, search for specific services, or view providers on a map to find exactly what you need.',
    icon: <MagnifyingGlassIcon className="w-7 h-7" />
  },
  {
    title: 'Detailed Provider Profiles',
    description: 'View comprehensive profiles of service providers, including their skills, service offerings, and pricing packages.',
    icon: <UsersIcon className="w-7 h-7" /> 
  },
  {
    title: 'Seamless Booking System',
    description: 'Request services, set schedules and locations, and communicate directly with providers via in-platform messaging.',
    icon: <CalendarDaysIcon className="w-7 h-7" />
  },
  {
    title: 'Authentic Ratings & Reviews',
    description: 'Make informed decisions with genuine feedback from clients who have booked and paid for services, building community trust.',
    icon: <StarOutlineIcon className="w-7 h-7" />
  },
];

export default function Features() {
  return (
    <section className="py-16 lg:py-24 bg-gray-50"> {/* Off-white background */}
      <div className="container mx-auto px-6">
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-800 mb-4">How SRV Works</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Our platform simplifies finding, booking, and managing local services, fostering trust and convenience.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1 flex flex-col items-center text-center">
              <div className="rounded-full bg-yellow-300 p-4 w-20 h-20 flex items-center justify-center text-blue-600 mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3 text-slate-700">{feature.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}