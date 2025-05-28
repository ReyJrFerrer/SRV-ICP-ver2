import React from 'react';
import { useAuth } from "@bundly/ares-react";
import Header from '@app/components/header';
import Footer from '@app/components/shared/Footer';

export default function ProviderPage() {
  const { isAuthenticated, currentIdentity } = useAuth();

  return (
    <>
      <Header />
      <main className="min-h-screen py-16 px-6">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-8">
          <h1 className="text-3xl font-bold text-center mb-8">Service Provider Dashboard</h1>
          
          {isAuthenticated ? (
            <div className="text-center">
              <p className="text-xl mb-4">Welcome to your service provider dashboard!</p>
              <p className="text-gray-600 mb-8">
                This is where you can manage your services and bookings.
              </p>
              <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200 text-indigo-700">
                <p>You are logged in as a service provider.</p>
                <p className="text-sm mt-2">Principal ID: {currentIdentity.getPrincipal().toString()}</p>
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
