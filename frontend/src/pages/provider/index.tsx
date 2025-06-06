// frontend/src/pages/provider/index.tsx
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth, useClient } from "@bundly/ares-react";
import Head from 'next/head';
import Link from 'next/link';
import { FingerPrintIcon } from '@heroicons/react/24/solid';

export default function ProviderIndexPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const client = useClient();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [statusMessage, setStatusMessage] = useState('Please log in to access the provider portal.');

  useEffect(() => {
    if (isAuthenticated) {
      setStatusMessage('Login successful! Redirecting to your dashboard...');
      setIsLoading(true); 
      router.push('/provider/home');
    } else {
      setStatusMessage('Please log in to access the provider portal.');
      setIsLoading(false);
    }
  }, [isAuthenticated, router]);

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
      if (error) setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>SRV Provider Portal</title>
        <meta name="description" content="Access your provider portal or log in." />
      </Head>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full mx-auto bg-white rounded-xl shadow-2xl p-8 text-center border-t-4 border-yellow-300">
          <h2 className="text-2xl font-bold text-blue-600 mb-4">
            Provider Portal
          </h2>
          
          <div className="min-h-[4rem] flex items-center justify-center mb-6">
            {error ? (
              <p className="text-red-600 text-sm">{error}</p>
            ) : (
              <p className="text-slate-600">{statusMessage}</p>
            )}
          </div>

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