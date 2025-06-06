import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth, useClient } from "@bundly/ares-react";
import Head from 'next/head';
import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory } from '../../declarations/auth/auth.did.js';
import type { Profile } from '../../declarations/auth/auth.did.js';
import Link from 'next/link';
import { ArrowLeftIcon, FingerPrintIcon } from '@heroicons/react/24/solid';

type Result<T> = {
  ok?: T;
  err?: string;
};

export default function ClientIndexPage() {
  const router = useRouter();
  const { isAuthenticated, currentIdentity } = useAuth();
  const client = useClient();
  const [isLoading, setIsLoading] = useState(false); 
  const [error, setError] = useState('');
  const [statusMessage, setStatusMessage] = useState('Please log in to access the client portal.');

  useEffect(() => {
      if (isAuthenticated && currentIdentity) {
      setIsLoading(true); 
      setStatusMessage('Authenticated. Verifying profile...');
      setError('');

      const checkProfile = async () => {
        try {
          const host = process.env.NEXT_PUBLIC_IC_HOST_URL || 'http://localhost:4943';
          const agent = new HttpAgent({ identity: currentIdentity, host });
          if (process.env.NODE_ENV === 'development') await agent.fetchRootKey();

          const authCanisterId = process.env.NEXT_PUBLIC_AUTH_CANISTER_ID;
          if (!authCanisterId) throw new Error('Auth canister ID not configured');

          const authActor = Actor.createActor(idlFactory, { agent, canisterId: authCanisterId });
          const profileResult = await authActor.getMyProfile() as Result<Profile>;

          if (profileResult.ok) {
            if ('Client' in profileResult.ok.role) {
              router.push('/client/home');
            } else {
              setError('Access denied. A Client profile is required.');
            }
          } else if (profileResult.err?.includes("Profile not found")) {
            router.push('/create-profile');
          } else {
            throw new Error(profileResult.err || 'Failed to retrieve profile.');
          }
        } catch (e) {
          setError(e instanceof Error ? e.message : 'Failed to check profile.');
        } finally {
          setIsLoading(false);
        }
      };

      checkProfile();
    } else {
        setIsLoading(false);
      setStatusMessage('Please log in to access the client portal.');
    }
  }, [isAuthenticated, currentIdentity, router]);

  const handleIILogin = async () => {
    try {
      setIsLoading(true);
      setError('');
      setStatusMessage('Connecting to Internet Identity...');
      const provider = client.getProvider("internet-identity");
      if (!provider) throw new Error('Internet Identity provider not found');
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
      <Head>
        <title>SRV Client Portal</title>
        <meta name="description" content="Access your client portal or log in." />
      </Head>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full mx-auto bg-white rounded-xl shadow-2xl p-8 text-center border-t-4 border-blue-600">
          <h2 className="text-2xl font-bold text-blue-600 mb-4">
            Client Portal
          </h2>
          
          {/* Status/Error Message Area */}
          <div className="min-h-[4rem] flex items-center justify-center mb-6">
            {error ? (
              <p className="text-red-600 text-sm">{error}</p>
            ) : (
              <p className="text-slate-600">{statusMessage}</p>
            )}
          </div>

          {/* Styled Login Button - Always Visible */}
          <button
            onClick={handleIILogin}
            disabled={isLoading}
            className={`w-full flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg 
                        transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105
                        ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                <span>Processing...</span>
              </>
            ) : (
              <>
                <FingerPrintIcon className="h-6 w-6 mr-2" />
                Login with Internet Identity
              </>
            )}
          </button>

          <Link href="/" className="mt-6 block text-sm text-blue-500 hover:underline">
            Back to Homepage
          </Link>
        </div>
      </div>
    </>
  );
}