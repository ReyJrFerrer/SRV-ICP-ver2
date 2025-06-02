import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from "@bundly/ares-react";
import Head from 'next/head';
import { UserIcon, EnvelopeIcon, PhoneIcon } from '@heroicons/react/24/outline';
import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory } from '../declarations/auth/auth.did.js';
import type { Profile, UserRole } from '../declarations/auth/auth.did';

type Result<T> = {
  ok?: T;
  err?: string;
};

export default function CreateProfilePage() {
  const router = useRouter();
  const { isAuthenticated, currentIdentity } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedRole, setSelectedRole] = useState<'Client' | 'ServiceProvider' | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) {
      setError('Please select a role');
      return;
    }

    setIsLoading(true);
    setError('');

    if (!isAuthenticated || !currentIdentity) {
      setError('Please log in to create a profile');
      setIsLoading(false);
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

      // Call createProfile on the auth canister
      const result = await authActor.createProfile(
        formData.name,
        formData.email,
        formData.phone,
        selectedRole === 'Client' ? { Client: null } : { ServiceProvider: null }
      ) as Result<Profile>;

      if ('err' in result) {
        throw new Error(result.err || 'Failed to create profile');
      }

      // Redirect to appropriate home page after successful profile creation
      router.push(selectedRole === 'Client' ? '/client/home' : '/provider/home');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create profile. Please try again.');
      console.error('Profile creation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    router.push('/');
    return null;
  }

  return (
    <>
      <Head>
        <title>Create Profile | Service Provider App</title>
        <meta name="description" content="Create your profile to get started" />
      </Head>

      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create Your Profile
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Tell us a bit about yourself to get started
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            {!selectedRole ? (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">Choose your role</h3>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setSelectedRole('Client')}
                    className="p-4 border rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <h4 className="font-medium text-gray-900">I Need a Service</h4>
                    <p className="mt-1 text-sm text-gray-500">Find and book services from providers</p>
                  </button>
                  <button
                    onClick={() => setSelectedRole('ServiceProvider')}
                    className="p-4 border rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <h4 className="font-medium text-gray-900">I Provide Services</h4>
                    <p className="mt-1 text-sm text-gray-500">Offer your services to clients</p>
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleProfileSubmit} className="space-y-6">
                {/* Name Input */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <UserIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      minLength={2}
                      maxLength={50}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>

                {/* Email Input */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      minLength={5}
                      maxLength={100}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                {/* Phone Input */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <PhoneIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      minLength={10}
                      maxLength={15}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>

                {/* Role Display */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Selected Role
                  </label>
                  <div className="py-2 px-4 rounded-lg border bg-gray-50 text-gray-700">
                    {selectedRole === 'Client' ? 'Find Services' : 'Provide Services'}
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="text-red-600 text-sm text-center">
                    {error}
                  </div>
                )}

                {/* Submit Button */}
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setSelectedRole(null)}
                    className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                      isLoading 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
                    }`}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Creating Profile...
                      </div>
                    ) : (
                      'Create Profile'
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
} 