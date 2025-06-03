import React, { useState, useEffect } from 'react';
import { useAuth } from "@bundly/ares-react";
import Head from 'next/head';
import Image from 'next/image';

// Components
import Header from '@app/components/client/HeaderNextjs';
import Categories from '@app/components/client/CategoriesNextjs';
import TopPicks from '@app/components/client/TopPicksNextjs';
import BottomNavigation from '@app/components/client/BottomNavigationNextjs';

// Services
import serviceCanisterService, { ServiceCategory } from '@app/services/serviceCanisterService';

// Utilities
import { getCategoryIcon } from '@app/utils/serviceHelpers';

// Define the adapted category type that matches the Categories component requirements
interface AdaptedCategory {
  id: string;
  name: string;
  icon: string;
  slug: string;
}

const ClientHomePage: React.FC = () => {
  const { isAuthenticated, currentIdentity } = useAuth();
  const [categories, setCategories] = useState<AdaptedCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setError(null);
        
        // Load categories from service canister
        try {
          console.log('Fetching categories from service canister...');
          const canisterCategories = await serviceCanisterService.getAllCategories();
          console.log('Fetched categories from canister:', canisterCategories);
          
          if (canisterCategories && canisterCategories.length > 0) {
            // Convert ServiceCategory to AdaptedCategory format
            const adaptedCategories: AdaptedCategory[] = canisterCategories.map(category => ({
              id: category.id,
              name: category.name,
              icon: getCategoryIcon(category.name), // Map category name to Heroicon
              slug: category.slug
            }));
            setCategories(adaptedCategories);
            console.log('Successfully loaded categories from service canister');
          } else {
            console.warn('No categories found in service canister');
            setCategories([]);
          }
        } catch (canisterError) {
          console.error('Failed to load categories from service canister:', canisterError);
          setCategories([]);
        }
        
      } catch (error) {
        console.error('Failed to load data:', error);
        setError('Failed to load category data');
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>SRV | Find Local Service Providers</title>
        <meta name="description" content="Find the best service providers near you" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gray-50 pb-20">
        {error && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mx-4 mt-4">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <div className="px-4 pt-4 pb-16">
          <Header className="mb-6" />

          <Categories 
            categories={categories} 
            className="mb-8"
            initialItemCount={4}
          />

          <TopPicks 
            className="mb-8" 
          />
        </div>

        <BottomNavigation />
      </div>
    </>
  );
};

export default ClientHomePage;
