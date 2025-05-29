import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Service, SERVICES } from '../../../public/data/services'; // Adjust path
import BookingPageComponent from 'frontend/ui/components/client/ClientBookingPageComponent'; // We'll create this
import styles from 'frontend/ui/components/client/ClientBookingPageComponent.module.css'; // We'll create this

export async function getStaticPaths() {
  const paths = SERVICES.map((service) => ({
    params: { serviceSlug: service.slug },
  }));
  return { paths, fallback: false };
}

export async function getStaticProps({ params }: { params: { serviceSlug: string } }) {
  const serviceData = SERVICES.find((s) => s.slug === params.serviceSlug);
  if (!serviceData) {
    return { notFound: true };
  }
  // Serialize dates
  const service = {
    ...serviceData,
    createdAt: serviceData.createdAt.toISOString(),
    updatedAt: serviceData.updatedAt.toISOString(),
  };
  return { props: { service } };
}

interface ClientBookPageProps {
  service: Omit<Service, 'createdAt' | 'updatedAt'> & {
    createdAt: string;
    updatedAt: string;
  };
}

const ClientBookPage: React.FC<ClientBookPageProps> = ({ service }) => {
  const router = useRouter();

  return (
    <div className={styles.pageContainer}>
      <Head>
        <title>Book: {service.title} - SRV Client</title>
        <meta name="description" content={`Book a service for ${service.title}`} />
      </Head>

      <header className={styles.pageHeader}>
        <button onClick={() => router.back()} className={styles.backButton}>
          &larr;
        </button>
        <h1 className={styles.mainTitle}>Book '{service.title}'</h1>
        <div className={styles.headerSpacer}></div> {/* Optional: Use if you need to balance a right-side element or ensure centering with grid */}
      </header>
      
      <main className={styles.mainContent}>
        <BookingPageComponent service={service} />
      </main>
    </div>
  );
};

export default ClientBookPage;