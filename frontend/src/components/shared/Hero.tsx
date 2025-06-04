import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { UserIcon, WrenchScrewdriverIcon, FingerPrintIcon } from '@heroicons/react/24/solid';
import { useAuth } from "@bundly/ares-react"; 

interface HeroProps {
  onLoginClick: () => void;
  isLoginLoading: boolean;
}

export default function Hero({ onLoginClick, isLoginLoading }: HeroProps) {
  const { isAuthenticated } = useAuth();

  return (
    <section className="relative bg-blue-600 text-white py-20 lg:py-28 pt-28 lg:pt-36"> 
      
      <div className="absolute top-1 left-6 z-20">
        <Link href="/" legacyBehavior>
          <a className="block" aria-label="SRV Home">
            <Image
              src="/logo.svg" 
              alt="SRV Logo"
              width={90} 
              height={Math.round(90 * (760 / 1000))} 
              priority
            />
          </a>
        </Link>
      </div>

      {!isAuthenticated && (
        <div className="absolute top-6 right-6 z-20">
          <button
            onClick={onLoginClick}
            disabled={isLoginLoading}
            className={`flex items-center justify-center bg-yellow-300 text-slate-800 hover:bg-yellow-400 
                        font-semibold py-2 px-4 rounded-lg transition-all duration-300 shadow-md 
                        hover:shadow-lg transform hover:scale-105 text-sm
                        ${isLoginLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isLoginLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-slate-800 mr-2"></div>
                Connecting...
              </>
            ) : (
              <>
                <FingerPrintIcon className="h-5 w-5 mr-2" />
                Login with II
              </>
            )}
          </button>
        </div>
      )}

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
            <div className="w-full max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl">
              <Image
                src="/HeroPlacerImage.svg" 
                alt="Laptop and phone showcasing srv"
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