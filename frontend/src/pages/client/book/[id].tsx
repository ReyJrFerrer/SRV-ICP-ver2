import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import ClientBookingPageComponent from '../../../components/client/ClientBookingPageComponent';

interface BookingPageProps {
  serviceSlug: string;
}

const BookingPage: React.FC<BookingPageProps> = ({ serviceSlug }) => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Book Service - SRV Client</title>
        <meta name="description" content="Book a service with SRV" />
      </Head>

      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="flex items-center justify-between px-4 py-3">
          <button 
            onClick={() => router.back()} 
            className="text-2xl text-gray-600 hover:text-gray-800"
          >
            ←
          </button>
          <h1 className="text-lg font-medium text-gray-900">Book Service</h1>
          <div className="w-8"></div> {/* Spacer for centering */}
        </div>
      </header>
      
      {/* Main Content */}
      <main className="flex-1">
        <ClientBookingPageComponent serviceSlug={serviceSlug} />
      </main>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const serviceSlug = params?.id as string;
  
  if (!serviceSlug) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      serviceSlug,
    },
  };
};

export default BookingPage;
