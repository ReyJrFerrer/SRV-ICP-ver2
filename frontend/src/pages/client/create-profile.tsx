import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from "@bundly/ares-react";
import Head from 'next/head';
import { UserIcon, EnvelopeIcon, PhoneIcon } from '@heroicons/react/24/outline';
import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory } from '../../declarations/auth/auth.did.js';
import type { Profile, UserRole } from '../../declarations/auth/auth.did';

type Result<T> = {
  ok?: T;
  err?: string;
};

// Components
import BottomNavigation from '@app/components/client/BottomNavigationNextjs';

const CreateProfilePage: React.FC = () => {
  const router = useRouter();
  const { isAuthenticated, currentIdentity } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Client'
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!isAuthenticated || !currentIdentity) {
      setError('Please log in to create a profile');
      setLoading(false);
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

      // Call createProfile on the auth canister
      const result = await authActor.createProfile(
        formData.name,
        formData.email,
        formData.phone,
        formData.role === 'Client' ? { Client: null } : { ServiceProvider: null }
      ) as Result<Profile>;

      if ('err' in result) {
        throw new Error(result.err || 'Failed to create profile');
      }

      // Redirect to home page after successful profile creation
      router.push('/client/home');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create profile. Please try again.');
      console.error('Profile creation error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Authentication Required</h1>
          <p className="mb-6">Please log in to create your profile.</p>
          <button 
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Create Profile | Service Provider App</title>
        <meta name="description" content="Create your profile to get started" />
      </Head>

      <div className="min-h-screen bg-gray-50 pb-20">
        <div className="max-w-md mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Create Your Profile</h1>
            <p className="text-gray-600">Tell us a bit about yourself to get started</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
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

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                I want to
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, role: 'Client' }))}
                  className={`py-2 px-4 rounded-lg border ${
                    formData.role === 'Client'
                      ? 'bg-green-50 border-green-500 text-green-700'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Find Services
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, role: 'ServiceProvider' }))}
                  className={`py-2 px-4 rounded-lg border ${
                    formData.role === 'ServiceProvider'
                      ? 'bg-green-50 border-green-500 text-green-700'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Provide Services
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="text-red-600 text-sm text-center">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-colors ${
                loading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Creating Profile...
                </div>
              ) : (
                'Create Profile'
              )}
            </button>
          </form>
        </div>

        <BottomNavigation />
      </div>
    </>
  );
};

export default CreateProfilePage; 