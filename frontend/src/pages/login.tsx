import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth, useClient } from "@bundly/ares-react";
import Head from 'next/head';
import { UserIcon, EnvelopeIcon, PhoneIcon } from '@heroicons/react/24/outline';
import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory } from '../declarations/auth/auth.did.js';
import type { Profile, UserRole } from '../declarations/auth/auth.did';

type Result<T> = {
  ok?: T;
  err?: string;
};

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated, currentIdentity } = useAuth();
  const client = useClient();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'Client' | 'ServiceProvider' | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });

  // Handle role from URL query parameter
  useEffect(() => {
    if (router.query.role === 'Client' || router.query.role === 'ServiceProvider') {
      setSelectedRole(router.query.role);
      if (isAuthenticated) {
        setShowProfileForm(true);
      }
    }
  }, [router.query.role, isAuthenticated]);

  useEffect(() => {
    const checkProfile = async () => {
      if (!isAuthenticated || !currentIdentity) {
        return;
      }

      setIsLoading(true);
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
          // No profile exists, show profile creation form
          setShowProfileForm(true);
        } else if (profileResult.ok) {
          // Profile exists, redirect based on role
          const profile = profileResult.ok;
          if ('Client' in profile.role) {
            router.push('/client/home');
          } else {
            router.push('/provider/home');
          }
        }
      } catch (error) {
        console.error('Error checking profile:', error);
        setError('Failed to check profile. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    checkProfile();
  }, [isAuthenticated, currentIdentity, router]);

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

  const handleRoleSelection = (role: 'Client' | 'ServiceProvider') => {
    setSelectedRole(role);
    setShowProfileForm(true);
  };

  if (!isAuthenticated) {
    return (
      <>
        <Head>
          <title>Login | Service Provider App</title>
          <meta name="description" content="Login to access your account" />
        </Head>

        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Welcome to SRV
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Your trusted platform for booking services on the Internet Computer
            </p>
          </div>

          <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
              {error && (
                <div className="mb-4 p-4 text-sm text-red-700 bg-red-100 rounded-lg">
                  {error}
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <button
                    onClick={() => {
                      const provider = client.getProvider("internet-identity");
                      provider.connect();
                    }}
                    disabled={isLoading}
                    className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                      isLoading
                        ? 'bg-blue-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                    }`}
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Logging in...
                      </div>
                    ) : (
                      'Login with Internet Identity'
                    )}
                  </button>
                </div>

                {!selectedRole && (
                  <>
                    <div className="mt-6">
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-gray-300" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                          <span className="px-2 bg-white text-gray-500">
                            New to SRV?
                          </span>
                        </div>
                      </div>

                      <div className="mt-6 grid grid-cols-2 gap-3">
                        <button
                          onClick={() => handleRoleSelection('Client')}
                          className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                        >
                          I Need a Service
                        </button>
                        <button
                          onClick={() => handleRoleSelection('ServiceProvider')}
                          className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                        >
                          I Provide Services
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (showProfileForm) {
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
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-colors ${
                    isLoading 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-green-600 hover:bg-green-700'
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
              </form>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto mb-4"></div>
        <p className="text-gray-600">
          {isLoading ? 'Checking your profile...' : 'Redirecting...'}
        </p>
      </div>
    </div>
  );
} 