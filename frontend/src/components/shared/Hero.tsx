import React from 'react';
import Link from 'next/link';
import Image from 'next/image'; 
import { UserIcon, WrenchScrewdriverIcon } from '@heroicons/react/24/solid';

export default function Hero() {
  return (
    <section className="bg-blue-600 text-white py-20 lg:py-28">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-12 md:mb-0 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl xl:text-6xl font-bold leading-tight mb-6">
              Here in SRV, <span className="text-yellow-300">Serbisyo, Rito, Valued!</span>
            </h1>
            <p className="text-lg md:text-xl text-blue-100 mb-10">
              Finding reliable help for everyday tasks can be a challenge. SRV is your user-friendly platform to easily discover, compare, and book a wide range of local on-demand service providers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link href="/client" legacyBehavior>
                <a className="flex items-center justify-center bg-yellow-300 text-slate-800 hover:bg-yellow-400 font-bold py-3 px-6 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 text-center text-base">
                  <UserIcon className="h-5 w-5 mr-2" />
                  I Need a Service
                </a>
              </Link>
              <Link href="/provider" legacyBehavior>
                <a className="flex items-center justify-center bg-blue-700 text-yellow-300 hover:bg-blue-800 font-bold py-3 px-6 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg border-2 border-yellow-300 transform hover:scale-105 text-center text-base">
                  <WrenchScrewdriverIcon className="h-5 w-5 mr-2" />
                  I Provide Services
                </a>
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center items-center mt-10 md:mt-0 px-4">
            <div className="w-full max-w-sm md:max-w-md lg:max-w-lg"> 
              <Image
                src="/logo.svg" 
                alt="SRV Platform Logo"
                width={1000}
                height={760} 
                layout="responsive"
                objectFit="contain" 
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}