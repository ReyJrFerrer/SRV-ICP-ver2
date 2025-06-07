import React, { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from "@bundly/ares-react";
import Head from 'next/head';
import { UserIcon, WrenchScrewdriverIcon, UserPlusIcon, EnvelopeIcon, PhoneIcon } from '@heroicons/react/24/outline';
import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory } from '../declarations/auth/auth.did.js';
import type { Profile, Result } from '../declarations/auth/auth.did.js';

export default function CreateProfilePage() {
  const router = useRouter();
  const { isAuthenticated, currentIdentity } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'Client' | 'ServiceProvider' | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });

   useEffect(() => {
    const timer = setTimeout(() => {
        if (!isAuthenticated) {
            console.warn("Not authenticated, redirecting to login...");
            router.push('/client');
        }
    }, 1500);

    return () => clearTimeout(timer);
  }, [isAuthenticated, router]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); 

    if (!selectedRole) {
      setError('Please select a role.');
      return;
    }
    // Required fields check
    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) {
        setError('All fields are required. Please fill out your name, email, and phone number.');
        return;
    }
    // This regex checks for a valid email structure that ends specifically with .com
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.com$/i;
    if (!emailRegex.test(formData.email.trim())) {
      setError('Please enter a valid email address with a domain ending in .com (e.g., example@domain.com).');
      return;
    }

    // Phone number validation
    const phoneRegex = /^09\d{9}$/;
    if (!phoneRegex.test(formData.phone.trim())) {
      setError('Please enter a valid 11-digit phone number starting with 09 (e.g., 09171234567).');
      return;
    }
    // --- END VALIDATION ---

    setIsLoading(true);
    setSuccess(false);

    if (!isAuthenticated || !currentIdentity) {
      setError('Authentication session not found. Please log in again.');
      setIsLoading(false);
      return;
    }

    try {
      const host = process.env.NEXT_PUBLIC_IC_HOST_URL || 'http://localhost:4943';
      const agent = new HttpAgent({ 
        identity: currentIdentity,
        host 
      });
      
      if (process.env.NODE_ENV === 'development') {
        await agent.fetchRootKey();
      }

      const authCanisterId = process.env.NEXT_PUBLIC_AUTH_CANISTER_ID;
      
      if (!authCanisterId) {
        throw new Error('Auth canister ID not found in environment variables.');
      }

      const authActor = Actor.createActor(idlFactory, {
        agent,
        canisterId: authCanisterId,
      });

  
      const result = await authActor.createProfile(
        formData.name.trim(),
        formData.email.trim(),
        formData.phone.trim(),
        selectedRole === 'Client' ? { Client: null } : { ServiceProvider: null }
      ) as Result;

      if ('err' in result) {
        throw new Error(result.err || 'Failed to create profile');
      }
      
      setSuccess(true);
      setTimeout(() => {
        router.push(selectedRole === 'Client' ? '/client/home' : '/provider/home');
      }, 2000);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create profile. Please try again.');
      console.error('Profile creation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated && !router.isReady) {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-slate-700">Waiting for authentication...</p>
        </div>
    );
  }

  return (
    <>
      <Head>
        <title>Create Your SRV Profile</title>
        <meta name="description" content="Complete your sign up by creating your SRV profile." />
      </Head>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-4xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden md:flex">
          <div className="hidden md:flex md:w-1/2 bg-blue-600 p-10 flex-col justify-center items-center text-white text-center">
           <img
              src="/logo.svg"
              alt="SRV Logo"
              style={{ width: '180px', height: 'auto' }}
            />
            <h1 className="text-3xl font-bold mt-4 text-yellow-300">Welcome to SRV!</h1>
            <p className="mt-2 text-blue-100 max-w-xs">
              Just a few more details to get you started on your journey.
            </p>
          </div>

          <div className="w-full md:w-1/2 p-8 lg:p-12">
            {success ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="p-4 bg-green-100 rounded-full mb-4">
                    <UserPlusIcon className="h-12 w-12 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-green-700">Profile Created!</h2>
                  <p className="text-slate-600 mt-2">Redirecting you to your dashboard...</p>
              </div>
            ) : (
              <form onSubmit={handleProfileSubmit} className="space-y-6">
                <div className="text-center md:hidden mb-6">
                    <h1 className="text-3xl font-bold text-blue-600">Create Profile</h1>
                    <p className="mt-2 text-slate-500 text-sm">Let's get you started.</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-slate-800 mb-3">First, choose your role:</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setSelectedRole('Client')}
                      className={`flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${selectedRole === 'Client' ? 'border-blue-600 bg-blue-50 shadow-md' : 'border-gray-200 hover:border-blue-400'}`}
                    >
                      <UserIcon className={`h-8 w-8 mb-2 ${selectedRole === 'Client' ? 'text-blue-600' : 'text-gray-400'}`} />
                      <span className={`font-semibold ${selectedRole === 'Client' ? 'text-blue-700' : 'text-slate-700'}`}>Client</span>
                      <span className="text-xs text-gray-500">I need services</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedRole('ServiceProvider')}
                      className={`flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${selectedRole === 'ServiceProvider' ? 'border-yellow-400 bg-yellow-50 shadow-md' : 'border-gray-200 hover:border-yellow-300'}`}
                    >
                      <WrenchScrewdriverIcon className={`h-8 w-8 mb-2 ${selectedRole === 'ServiceProvider' ? 'text-yellow-600' : 'text-gray-400'}`} />
                      <span className={`font-semibold ${selectedRole === 'ServiceProvider' ? 'text-yellow-700' : 'text-slate-700'}`}>Service Provider</span>
                       <span className="text-xs text-gray-500">I offer services</span>
                    </button>
                  </div>
                </div>

                {selectedRole && (
                    <div className="space-y-4 border-t pt-6">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <UserIcon className="h-5 w-5 text-gray-400" />
                            </div>
                            <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleInputChange} required className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                            </div>
                            <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleInputChange} required className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <PhoneIcon className="h-5 w-5 text-gray-400" />
                            </div>
                            <input type="tel" name="phone" placeholder="Phone Number (e.g., 0917...)" value={formData.phone} onChange={handleInputChange} required className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                    </div>
                )}
                
                {error && <p className="text-sm text-red-600 text-center">{error}</p>}

                {selectedRole && (
                    <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg 
                                transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105
                                disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                    {isLoading ? (
                        <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                        <span>Creating Profile...</span>
                        </>
                    ) : (
                        <>
                        <UserPlusIcon className="h-6 w-6 mr-2" />
                        Create Profile
                        </>
                    )}
                    </button>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
};