import React, { useEffect } from 'react';
import { useAuth } from "@bundly/ares-react";
import { useRouter } from 'next/router';
import Header from '@app/components/header';
import Footer from '@app/components/shared/Footer';

export default function ProviderPage() {
  const { isAuthenticated, currentIdentity } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to the provider home page
    if (isAuthenticated) {
      router.push('/provider/home');
    }
  }, [isAuthenticated, router]);

  return (
    <>
      <Header />
      <main className="min-h-screen py-16 px-6">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-8">
          <h1 className="text-3xl font-bold text-center mb-8">Service Provider Dashboard</h1>
          
          {isAuthenticated ? (
            <div className="text-center">
              <p className="text-xl mb-4">Redirecting to your provider dashboard...</p>
              <div className="mt-4 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-xl text-red-600">Please log in to access your provider dashboard.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
