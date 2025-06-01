import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from "@bundly/ares-react";
import Head from 'next/head';
import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory } from '../../declarations/auth/auth.did.js';
import type { Profile } from '../../declarations/auth/auth.did';
import Header from '@app/components/header';
import Footer from '@app/components/shared/Footer';

type Result<T> = {
  ok?: T;
  err?: string;
};

export default function ClientIndexPage() {
  const router = useRouter();
  const { isAuthenticated, currentIdentity } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const checkProfile = async () => {
      if (!isAuthenticated || !currentIdentity) {
        router.push('/');
        return;
      }

      try {
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
          // Profile exists, check if it's a client profile
          const profile = profileResult.ok;
          if ('Client' in profile.role) {
            router.push('/client/home');
          } else {
            // If not a client profile, redirect to root
            setError('You need a client profile to access this page');
            setTimeout(() => router.push('/'), 3000);
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

  return (
    <>
      <Head>
        <title>SRV Home Page</title>
        <meta name="description" content="Access your client portal" />
      </Head>
      
      <Header />
      <main className="min-h-screen py-16 px-6">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-8">
          {error ? (
            <div className="text-center">
              <div className="text-red-600 text-xl mb-4">{error}</div>
              <p className="text-gray-600">Redirecting to home page...</p>
            </div>
          ) : (
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto mb-4"></div>
              <p className="text-gray-600">
                {isLoading ? 'Checking your profile...' : 'Redirecting...'}
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
