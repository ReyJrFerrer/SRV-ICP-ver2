import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from "@bundly/ares-react";
import Head from 'next/head';

export default function ClientIndexPage() {
  const router = useRouter();
  const { isAuthenticated, currentIdentity } = useAuth();
  
  useEffect(() => {
    // Redirect to client home page
    router.push('/client/home');
  }, [router]);

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
          <p className="text-gray-600">Redirecting to home page...</p>
        </div>
      </div>
    </>
  );
}
