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

  const handleRoleSelectionAndLogin = (role: 'Client' | 'ServiceProvider') => {
    // Store the intended role in the browser's session storage
    // This state will persist until the browser tab is closed
    sessionStorage.setItem('signupRole', role);
    
    // Trigger the login flow passed as a prop from the parent page
    onLoginClick();
  };

  return (
    <section className="relative bg-white text-slate-800 py-20 pt-36"> 
      
      <div className="absolute top-6 left-6 z-20">
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
        <div className="absolute top-9 right-6 z-20">
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
                Login 
              </>
            )}
          </button>
        </div>
      )}

      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center text-center">
        
          <div className="w-full max-w-3xl lg:max-w-4xl xl:max-w-5xl mb-8">
            <Image
              src="/heroImage.png"
              alt="Ang serbisyo rito ay always valued!"
              width={1000}
              height={500}
              layout="responsive"
              objectFit="contain"
              priority
            />
          </div>

          <p className="text-lg text-gray-600 max-w-4xl mx-auto">
            Finding reliable help for everyday tasks can be a challenge. SRV is your user-friendly platform to easily discover, compare, and book a wide range of local on-demand service providers.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => handleRoleSelectionAndLogin('Client')}
              className="flex items-center justify-center bg-yellow-400 text-slate-800 hover:bg-yellow-500 font-bold py-3 px-6 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1 text-center text-base"
            >
              <UserIcon className="h-5 w-5 mr-2" />
              I Need a Service
            </button>
            <button 
              onClick={() => handleRoleSelectionAndLogin('ServiceProvider')}
              className="flex items-center justify-center bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-50 font-bold py-3 px-6 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1 text-center text-base"
            >
              <WrenchScrewdriverIcon className="h-5 w-5 mr-2" />
              I Provide Services
            </button>
          </div>
        
        </div>
      </div>
    </section>
  );
}