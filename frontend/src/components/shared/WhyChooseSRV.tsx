import React from 'react';
import Image from "next/image"; 
import { ShieldCheckIcon, UserGroupIcon, RocketLaunchIcon } from '@heroicons/react/24/outline';


const WhyChooseUsSection: React.FC = () => {
    const reasons = [
      {
        icon: <ShieldCheckIcon className="h-10 w-10 text-blue-600 mb-4" />,
        title: "Verified and Reliable",
        description: "Connect with freelance providers, SRV helps you trust their credibility and competence, moving away from informal channels."
      },
      {
        icon: <UserGroupIcon className="h-10 w-10 text-blue-600 mb-4" />,
        title: "Client-Focused Platform",
        description: "Easily discover, compare, and look providers based on your specific needs, location, and authentic user ratings."
      },
      {
        icon: <RocketLaunchIcon className="h-10 w-10 text-blue-600 mb-4" />,
        title: "Empowering Providers",
        description: "Service providers can showcase skills, manage availability and build a verifiable reputation through genuine client feedbacks."
      }
    ];


    return (
        <section className="relative bg-blue-500 py-20 lg:py-28 overflow-hidden">
          <div className="container mx-auto px-6 relative z-10">
            <div className="flex justify-center mb-12">
                <div className="bg-yellow-400 rounded-full py-3 px-8 shadow-lg">
                    <h2 className="text-3xl lg:text-4xl font-bold text-slate-800">
                        Why Choose SRV?
                    </h2>
                </div>
            </div>
            
            <div className="relative mt-16 flex flex-col items-center">

              <div className="relative w-48 lg:absolute lg:w-64 lg:-top-24 lg:-left-0 z-20 -mb-20 lg:mx-0 lg:-mb-0">
                <Image
                  src="/cp.png" 
                  alt="SRV application on a smartphone"
                  width={700}
                  height={520}
                />
              </div>
              
              <div className="w-full bg-white rounded-2xl shadow-2xl pt-28 pb-12 px-6 lg:pt-8 lg:pl-64 lg:pr-12 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {reasons.map((reason, index) => (
                       <div key={index} className="text-center flex flex-col items-center">
                      <div className="bg-blue-100 p-4 rounded-full mb-4">
                        {reason.icon}
                      </div>
                      <h3 className="text-xl font-bold text-slate-800 mb-3">{reason.title}</h3>
                      <p className="text-sm text-gray-600 leading-relaxed">{reason.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
    );
};

export default WhyChooseUsSection;