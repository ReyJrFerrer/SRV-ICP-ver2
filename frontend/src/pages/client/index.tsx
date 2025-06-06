// frontend/src/pages/client/index.tsx
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth, useClient } from "@bundly/ares-react";
import Head from 'next/head';
import Link from 'next/link';
import { FingerPrintIcon } from '@heroicons/react/24/solid';

export default function ClientIndexPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const client = useClient();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [statusMessage, setStatusMessage] = useState('Please log in to access the client portal.');

  useEffect(() => {
    // If the user is authenticated, immediately redirect them to their home page.
    if (isAuthenticated) {
      setStatusMessage('Login successful! Redirecting to your dashboard...');
      setIsLoading(true); // Show a loading state while redirecting
      router.push('/client/home');
    } else {
      // If not authenticated, ensure the page is ready to accept a login.
      setStatusMessage('Please log in to access the client portal.');
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
      // On successful connection, the useEffect above will trigger the redirect.
    } catch (err) {
      console.error('Login error:', err);
      setError(err instanceof Error ? err.message : 'Failed to connect to Internet Identity');
    } finally {
      // Don't set isLoading to false here, as the useEffect will take over
      // and keep it true during the redirect. If login fails, it will be set.
      if (error) setIsLoading(false);
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