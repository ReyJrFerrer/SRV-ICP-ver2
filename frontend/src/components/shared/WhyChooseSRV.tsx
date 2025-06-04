import React from 'react';
import { ShieldCheckIcon, UsersIcon, MapPinIcon, BuildingStorefrontIcon } from '@heroicons/react/24/outline'; // Added BuildingStorefrontIcon

const reasons = [
  {
    icon: <ShieldCheckIcon className="h-10 w-10 text-yellow-300" />,
    title: "Verified & Reliable",
    description: "Connect with local freelance providers. SRV helps you trust their credibility and competence, moving away from informal channels. [cite: 5, 8]"
  },
  {
    icon: <BuildingStorefrontIcon className="h-10 w-10 text-yellow-300" />,
    title: "Client-Focused Platform",
    description: "Easily discover, compare, and book providers based on your specific needs, location, and authentic user ratings. [cite: 8, 15]"
  },
  {
    icon: <UsersIcon className="h-10 w-10 text-yellow-300" />,
    title: "Empowering Providers",
    description: "Service providers can showcase skills, manage availability, and build a verifiable reputation through genuine client feedback. [cite: 6, 7, 10]"
  }
];

const WhyChooseSRV: React.FC = () => {
  return (
    <section className="py-16 lg:py-24 bg-blue-600">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
          Why Choose SRV?
        </h2>
        <p className="text-blue-100 max-w-2xl mx-auto mb-12 lg:mb-16 text-lg">
          We're building a better way to connect clients with local service professionals in Baguio.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {reasons.map((reason, index) => (
            <div key={index} className="bg-blue-700 p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-1 flex flex-col items-center">
              <div className="mb-6 p-3 rounded-full bg-slate-800">
                {reason.icon}
              </div>
              <h3 className="text-2xl font-semibold text-yellow-300 mb-3">{reason.title}</h3>
              <p className="text-blue-200 text-sm leading-relaxed">{reason.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseSRV;