import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth, InternetIdentityButton } from "@bundly/ares-react";
import Head from 'next/head';
import Link from 'next/link';
import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory } from '../../declarations/auth/auth.did.js';
import type { Profile } from '../../declarations/auth/auth.did.js';

type Result<T> = {
  ok?: T;
  err?: string;
};

export default function ClientIndexPage() {
  const router = useRouter();
  const { isAuthenticated, currentIdentity } = useAuth();
  const [isLoading, setIsLoading] = useState(true); 
  const [error, setError] = useState('');
  const [statusMessage, setStatusMessage] = useState('Initializing...');

  useEffect(() => {
    const checkProfile = async () => {
      if (isAuthenticated && currentIdentity) {
        setIsLoading(true);
        setStatusMessage('Authenticated. Verifying your profile...');
        setError('');

        try {
          const host = process.env.NEXT_PUBLIC_IC_HOST_URL || 'http://localhost:4943';
          const agent = new HttpAgent({ identity: currentIdentity, host });
          if (process.env.NODE_ENV === 'development') await agent.fetchRootKey();

          const authCanisterId = process.env.NEXT_PUBLIC_AUTH_CANISTER_ID;
          if (!authCanisterId) throw new Error('Auth canister ID not configured');

          const authActor = Actor.createActor(idlFactory, { agent, canisterId: authCanisterId });
          const profileResult = await authActor.getMyProfile() as Result<Profile>;

          if ('ok' in profileResult && profileResult.ok) {
            if ('Client' in profileResult.ok.role) {
              // Case 1: Profile exists and role is correct -> Redirect to home
              setStatusMessage('Profile found. Redirecting...');
              router.push('/client/home');
            } else {
              // Case 2: Profile exists, but wrong role -> Show error
              setError('Access denied. A Client profile is required to access this section.');
              setIsLoading(false);
            }
          } else if ('err' in profileResult && profileResult.err?.includes("Profile not found")) {
            // Case 3: New user (no profile) -> Redirect to create profile
            setStatusMessage('No profile found. Redirecting to sign up...');
            router.push('/create-profile');
          } else {
            // Case 4: Other canister error
            throw new Error(profileResult.err || 'Failed to retrieve profile.');
          }
        } catch (e) {
          setError(e instanceof Error ? e.message : 'Failed to check profile.');
          setIsLoading(false);
        }
      } else {
        // Case 5: Not authenticated -> Show login prompt
        setIsLoading(false);
        setStatusMessage('Please log in to access the client portal.');
      }
    };

    checkProfile();
  }, [isAuthenticated, currentIdentity, router]);

  return (
    <>
      <Head>
        <title>SRV Client Portal</title>
        <meta name="description" content="Access your client portal or log in." />
      </Head>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full mx-auto bg-white rounded-xl shadow-2xl p-8 text-center border-t-4 border-blue-600">
          <h2 className="text-2xl font-bold text-blue-600 mb-4">
            Client Portal
          </h2>
          
          <div className="min-h-[4rem] flex items-center justify-center mb-6">
            {error ? (
              <p className="text-red-600 text-sm font-medium">{error}</p>
            ) : isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-slate-600 mr-2"></div>
                <span className="text-slate-600">{statusMessage}</span>
              </div>
            ) : (
              <p className="text-slate-600">{statusMessage}</p>
            )}
          </div>
         
          <div className="w-full">
            <InternetIdentityButton />
          </div>

          <Link href="/" className="mt-6 block text-sm text-blue-500 hover:underline">
            Back to Homepage
          </Link>
        </div>
      </div>
    </>
  );
}