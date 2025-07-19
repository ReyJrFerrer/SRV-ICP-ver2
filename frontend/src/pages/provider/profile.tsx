// frontend/src/components/provider/Profile.tsx

import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import PublicProfileView from '@app/components/provider/PublicProfileView'; // Import the new component

// --- Mock Data Fetching (Replace with your actual API call) ---
// This function simulates fetching a provider's public profile data
const getProviderById = async (providerId: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (providerId === '12345' || providerId === 'silverstor-elliot') {
        resolve({
          name: "Silverstor Elliot",
          bio: "A hardworking, quick-thinking professional known for his expertise in plumbing, dedicated to his craft and always striving to meet every client's needs.",
          profilePicUrl: "/images/silverstor.jpg", // Adjust path
          ratings: 5,
          reviews: 178,
          location: "Baguio City - Burnham Park",
          availability: "Monday - Sunday, Available 24 hours",
          isVerified: true,
          serviceRequirements: ["Discussion of the problem", "Site assessment", "Parking space"],
          servicePhotos: ["/images/photo1.jpg", "/images/photo2.jpg"],
          certifications: ["/images/cert.jpg"],
          stats: { projects: 49, reviews: 178, years: 15 },
          services: [
            {
              title: "Emergency Call-Out",
              price: "₱ 4,000/Hr",
              details: ["Immediate response for urgent plumbing issues.", "Flat diagnostic fee (1 hour)", "Fast response", "Expertise in all types of leaks and blockages."]
            },
            {
              title: "Plumbing General Cleaning",
              price: "₱ 4,000/Hr",
              details: ["Immediate response for urgent plumbing issues.", "Flat diagnostic fee (1 hour)", "Fast response", "Expertise in all types of leaks and blockages."]
            }
          ],
        });
      } else {
        resolve(null); // Return null for a provider not found
      }
    }, 1000);
  });
};

const Profile: React.FC = () => {
  const router = useRouter();
  const { id } = router.query; // This gets the dynamic part of the URL (e.g., "silverstor-elliot")

  const [providerData, setProviderData] = useState<any>(null); // Use a type matching your data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return; // Wait for the ID to be available in the URL

    const loadProviderData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getProviderById(id as string);
        if (!data) {
          setError("Provider not found.");
        }
        setProviderData(data);
      } catch (err) {
        console.error("Failed to fetch provider data:", err);
        setError("An error occurred while loading the profile.");
      } finally {
        setLoading(false);
      }
    };

    loadProviderData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="ml-3 text-gray-700">Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Error</h1>
        <p className="text-gray-600 mb-6">{error}</p>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{providerData?.name || 'Profile'} | SRV-ICP</title>
      </Head>
      <PublicProfileView providerData={providerData} />
    </>
  );
};

export default Profile;