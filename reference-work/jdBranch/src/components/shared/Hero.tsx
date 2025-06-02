import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Hero() {
  return (
    <section className="hero-gradient text-white py-20">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
              Book Services With Ease
            </h1>
            <p className="text-xl mb-8">
              SRV connects you with trusted service providers for all your needs. 
              Fast, reliable, and secure on the Internet Computer.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/client" as="/client">
                <button className="bg-white text-blue-600 hover:bg-gray-100 font-bold py-3 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg">
                  I Need a Service
                </button>
              </Link>
              <Link href="/provider" as="/provider">
                <button className="bg-indigo-700 hover:bg-indigo-800 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg border border-indigo-400">
                  I Provide Services
                </button>
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="bg-white p-2 rounded-xl shadow-lg">
              <div className="w-full h-64 md:h-80 relative bg-gray-200 rounded-lg overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="w-20 h-20 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
