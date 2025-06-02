import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuth, useClient } from "@bundly/ares-react";
import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory } from '../declarations/auth/auth.did.js';
import type { Profile } from '../declarations/auth/auth.did';

import Header from "@app/components/header";
import Hero from "@app/components/shared/Hero";
import Features from "@app/components/shared/Features";
import Footer from "@app/components/shared/Footer";

type Result<T> = {
  ok?: T;
  err?: string;
};

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, currentIdentity } = useAuth();
  const client = useClient();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const checkProfile = async () => {
      if (!isAuthenticated || !currentIdentity) return;

      try {
        setIsLoading(true);
        // Create agent and actor for auth canister
        const host = process.env.NEXT_PUBLIC_IC_HOST_URL || 'http://localhost:4943';
        const agent = new HttpAgent({ 
          identity: currentIdentity,
          host 
        });
        
        // Only fetch root key in development
        if (process.env.NODE_ENV === 'development') {
          await agent.fetchRootKey();
        }

        const authCanisterId = process.env.NEXT_PUBLIC_AUTH_CANISTER_ID;
        
        if (!authCanisterId) {
          throw new Error('Auth canister ID not found');
        }

        const authActor = Actor.createActor(idlFactory, {
          agent,
          canisterId: authCanisterId,
        });

        // Check if user has a profile
        const profileResult = await authActor.getMyProfile() as Result<Profile>;
        
        if ('err' in profileResult) {
          // No profile exists, redirect to profile creation
          router.push('/create-profile');
        } else if (profileResult.ok) {
          // Profile exists, redirect based on role
          const profile = profileResult.ok;
          if ('Client' in profile.role) {
            router.push('/client/home');
          } else {
            router.push('/provider/home');
          }
        }
      } catch (error) {
        console.error('Error checking profile:', error);
        setError('Failed to check profile. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    checkProfile();
  }, [isAuthenticated, currentIdentity, router]);

  const handleIILogin = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      const provider = client.getProvider("internet-identity");
      if (!provider) {
        throw new Error('Internet Identity provider not found');
      }

      // Connect to Internet Identity
      await provider.connect();
    } catch (err) {
      console.error('Login error:', err);
      setError(err instanceof Error ? err.message : 'Failed to connect to Internet Identity');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main>
        <Hero />
        <Features />
        
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">Ready to get started?</h2>
            {error && (
              <div className="mb-4 p-4 text-sm text-red-700 bg-red-100 rounded-lg max-w-md mx-auto">
                {error}
              </div>
            )}
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              {!isAuthenticated ? (
                <button
                  onClick={handleIILogin}
                  disabled={isLoading}
                  className={`btn-primary ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Logging in...
                    </div>
                  ) : (
                    'Login with Internet Identity'
                  )}
                </button>
              ) : (
                <div className="text-center">
                  <p className="text-xl mb-4">Checking your profile...</p>
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <div className="bg-blue-600 text-white rounded-xl p-8 md:p-12 shadow-lg">
              <div className="md:flex items-center justify-between">
                <div className="mb-6 md:mb-0 md:w-2/3">
                  <h2 className="text-2xl md:text-3xl font-bold mb-4">Join the SRV community today</h2>
                  <p className="text-blue-100">
                    Whether you need services or provide them, SRV is your trusted platform built on the Internet Computer.
                  </p>
                </div>
                <div>
                  {isAuthenticated ? (
                    <p className="text-xl">You're already signed in!</p>
                  ) : (
                    <button
                      onClick={handleIILogin}
                      className="bg-white text-blue-600 hover:bg-blue-50 font-bold py-3 px-8 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                      Get Started
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
