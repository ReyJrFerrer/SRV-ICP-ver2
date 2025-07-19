import React from 'react';
import Image from "next/image";
import { ShieldCheckIcon, UserGroupIcon, RocketLaunchIcon, ArrowTrendingUpIcon } from '@heroicons/react/24/outline';


const WhyChooseUsSection: React.FC = () => {
  const reasons = [
    {
      icon: <ShieldCheckIcon className="h-10 w-10 text-blue-600 mb-4" />,
      title: "Beripikado at Maaasahan",
      description: "Kumonekta sa mga freelance provider; tinutulungan ka ng SRV na pagkatiwalaan ang kanilang kredibilidad at kakayahan, na lumalayo sa impormal na mga paraan."
    },
    {
      icon: <UserGroupIcon className="h-10 w-10 text-blue-600 mb-4" />,
      title: "Platform na Nakatuon sa Kliyente",
      description: "Madaling tumuklas, maghambing, at humanap ng mga provider batay sa iyong partikular na pangangailangan, lokasyon, at tunay na rating ng user."
    },
    {
      icon: <RocketLaunchIcon className="h-10 w-10 text-blue-600 mb-4" />,
      title: "Nagpapalakas sa mga Provider",
      description: "Maaaring ipakita ng mga service provider ang kanilang mga kasanayan, pamahalaan ang availability, at bumuo ng mapapatunayang reputasyon sa pamamagitan ng tunay na feedback mula sa kliyente."
    }
  ];

  return (
    // Changed overflow-hidden to overflow-visible to allow phone to spill out
    <section className="relative bg-blue-500 min-h-screen flex items-center justify-center overflow-visible py-16 md:py-20 lg:py-28">
      {/* Background shapes - Absolute positioning */}

      {/* Large Yellow Right Arrow */}
      <div className="absolute top-1/4 left-0 transform -translate-y-1/2 -translate-x-1/2 md:translate-x-0 w-24 md:w-32 lg:w-48 h-24 md:h-32 lg:h-48 bg-yellow-300 rotate-45 z-0 flex items-center justify-center">
        <svg className="w-1/2 h-1/2 text-white transform -rotate-45" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M10.293 15.707a1 1 0 010-1.414L14.586 10l-4.293-4.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
          <path fillRule="evenodd" d="M4.293 15.707a1 1 0 010-1.414L8.586 10 4.293 5.707a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
        </svg>
      </div>

      {/* Yellow Triangle Top Right */}
      <div className="absolute top-0 right-0 w-0 h-0 border-t-[100px] border-l-[100px] border-b-[0px] border-r-[0px] border-yellow-300 border-solid rotate-90" style={{
          borderLeftColor: 'transparent',
          borderBottomColor: 'transparent',
          borderRightColor: 'transparent',
      }}></div>


      {/* Main Content Container */}
      <div className="container mx-auto px-4 sm:px-6 relative z-10 w-full max-w-7xl">
        {/* Title Section */}
        <div className="flex justify-center mb-12 lg:mb-16">
          {/* Bakit SRV ang piliin mo? Button - Made more responsive */}
          <div className="inline-block bg-yellow-300 px-6 py-2 sm:px-8 sm:py-3 md:px-10 md:py-4 rounded-full shadow-lg"> {/* Adjusted padding */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-slate-800 whitespace-nowrap"> {/* Adjusted font sizes */}
              Bakit SRV ang piliin mo?
            </h1>
          </div>
        </div>

        {/* Content Area with Phone and White Card */}
        <div className="relative flex flex-col lg:flex-row items-center justify-center mt-8 lg:mt-16 px-4 md:px-0">

          {/* Mobile Phone Image */}
          {/* Adjusted bottom value to allow more overlap with content below the section */}
          <div className="relative w-[200px] sm:w-[250px] md:w-[300px] lg:w-[350px] xl:w-[400px] z-20 -mb-20 lg:mb-0 lg:mr-10 xl:mr-16 lg:absolute lg:bottom-[-250px] lg:left-[-0.5%] lg:-ml-32"> {/* Increased negative bottom value */}
            <Image
              src="/cp.png"
              alt="SRV application on a smartphone"
              width={700} // Set intrinsic width for image optimization
              height={520} // Set intrinsic height
              layout="responsive" // Make image responsive
              objectFit="contain" // Ensure the image fits within its container without cropping
            />
          </div>

          {/* Yellow Lines */}
          {/* <div className="absolute top-[calc(50%)] left-[60%] sm:left-[70%] md:left-[75%] lg:left-[80%] xl:left-[85%] -translate-y-1/2 w-60 md:w-80 lg:w-96 xl:w-[500px] h-2 bg-yellow-300 transform -rotate-12 z-10"></div>
          <div className="absolute top-[calc(50%+80px)] left-[60%] sm:left-[70%] md:left-[75%] lg:left-[80%] xl:left-[85%] -translate-y-1/2 w-60 md:w-80 lg:w-96 xl:w-[500px] h-2 bg-yellow-300 transform rotate-0 z-10"></div>
          <div className="absolute top-[calc(50%+150px)] left-[60%] sm:left-[70%] md:left-[75%] lg:left-[80%] xl:left-[85%] -translate-y-1/2 w-60 md:w-80 lg:w-96 xl:w-[500px] h-2 bg-yellow-300 transform rotate-12 z-10"></div> */}

          {/* White Content Card */}
          <div className="relative w-full bg-white rounded-2xl shadow-2xl py-12 px-6 sm:px-8 md:px-10 lg:pl-48 lg:pr-12 xl:pl-64 xl:pr-16 z-10 min-h-[350px] flex items-center">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 lg:gap-16">
              {reasons.map((reason, index) => (
                <div key={index} className="text-left flex flex-col items-start">
                  {/* Icon */}
                  {reason.icon}
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-800 mb-2">{reason.title}</h3>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{reason.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Large Black Upward Trending Arrow */}
          <div className="absolute bottom-[-200px] right-0 md:right-[-50px] lg:right-[-100px] xl:right-[-150px] w-64 md:w-80 lg:w-[400px] h-64 md:h-80 lg:h-[400px] z-30">
            <ArrowTrendingUpIcon className="w-full h-full text-black transform rotate-12" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUsSection;