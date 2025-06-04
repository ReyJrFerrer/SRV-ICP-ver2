import React from 'react';
import Link from 'next/link';
import { UserIcon, WrenchScrewdriverIcon } from '@heroicons/react/24/solid';

export default function Hero() {
  return (
    <section className="bg-blue-600 text-white py-20 lg:py-28">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-12 md:mb-0 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl xl:text-6xl font-bold leading-tight mb-6">
              Your Local Service Connection <span className="text-yellow-300">in Baguio</span>
            </h1>
            <p className="text-lg md:text-xl text-blue-100 mb-10">
              {/* Content from PDF */}
              Finding reliable help for everyday tasks can be a challenge. [cite: 3] SRV is your user-friendly platform to easily discover, compare, and book a wide range of local freelance service providers. [cite: 8]
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link href="/client" legacyBehavior>
                <a className="flex items-center justify-center bg-yellow-300 text-slate-800 hover:bg-yellow-400 font-bold py-3 px-6 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 text-center text-base">
                  <UserIcon className="h-5 w-5 mr-2" />
                  I Need a Service
                </a>
              </Link>
              <Link href="/provider" legacyBehavior>
                <a className="flex items-center justify-center bg-slate-800 text-yellow-300 hover:bg-slate-700 font-bold py-3 px-6 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg border-2 border-yellow-300 transform hover:scale-105 text-center text-base">
                  <WrenchScrewdriverIcon className="h-5 w-5 mr-2" />
                  I Provide Services
                </a>
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center mt-10 md:mt-0">
            <div className="w-72 h-72 lg:w-80 lg:h-80 bg-yellow-300 p-3 rounded-full shadow-2xl flex items-center justify-center">
              <div className="w-full h-full bg-blue-700 rounded-full flex items-center justify-center border-4 border-slate-800">
                 <span className="text-6xl font-bold text-yellow-300">SRV</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}