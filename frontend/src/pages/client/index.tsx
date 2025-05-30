import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from "@bundly/ares-react";
import Head from 'next/head';
import { Actor, HttpAgent } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';
import { idlFactory } from '../../declarations/auth/auth.did.js';
import type { Profile } from '../../declarations/auth/auth.did';

type Result<T> = {
  ok?: T;
  err?: string;
};

export default function ClientIndexPage() {
  const router = useRouter();
  const { isAuthenticated, currentIdentity } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const checkProfile = async () => {
      if (!isAuthenticated || !currentIdentity) {
        router.push('/');
        return;
      }

      try {
        // Create agent and actor for auth canister
        const agent = new HttpAgent({ identity: currentIdentity });
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
          // No profile exists, redirect to create profile
          router.push('/client/create-profile');
        } else {
          // Profile exists, redirect to home
          router.push('/client/home');
        }
      } catch (error) {
        console.error('Error checking profile:', error);
        // On error, redirect to create profile as a fallback
        router.push('/client/create-profile');
      } finally {
        setIsLoading(false);
      }
    };

    checkProfile();
  }, [isAuthenticated, currentIdentity, router]);

  return (
    <>
      <Head>
        <title>Service Provider App</title>
        <meta name="description" content="Find the best service providers near you" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">
            {isLoading ? 'Checking your profile...' : 'Redirecting...'}
          </p>
        </div>
      </div>
    </>
  );
}
