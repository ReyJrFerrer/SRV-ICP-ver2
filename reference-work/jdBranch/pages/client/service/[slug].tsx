import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Service, SERVICES } from '../../../public/data/services'; 
import ServiceDetailPageComponent from '../../../ui/components/client/serviceDetails/ServiceDetailPageComponent'; 
import styles from '../../../ui/styles/ClientServicePage.module.css'; 

export async function getStaticPaths() {
  const paths = SERVICES.map((service) => ({
    params: { slug: service.slug },
  }));
  return { paths, fallback: false };
}

export async function getStaticProps({ params }: { params: { slug: string } }) {
  const serviceData = SERVICES.find((s) => s.slug === params.slug);

  if (!serviceData) {
    return {
      notFound: true,
    };
  }


  const service = {
    ...serviceData,
    createdAt: serviceData.createdAt.toISOString(),
    updatedAt: serviceData.updatedAt.toISOString(),
  };

  return { props: { service } };
}

interface ServicePageProps {
  service: Omit<Service, 'createdAt' | 'updatedAt'> & {
    createdAt: string;
    updatedAt: string;
  };
}

const ServicePage: React.FC<ServicePageProps> = ({ service }) => {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.pageContainer}>
      <Head>
        <title>{service.title} - SRV Client</title>
        <meta name="description" content={service.description} />
      </Head>

      <header className={styles.pageHeader}>
        <button onClick={() => router.back()} className={styles.backButton}>
          &larr;
        </button>
        <h1 className={styles.serviceTitleHeader}>{service.title}</h1>
        <div style={{width: '40px'}}></div>
      </header>
      
      <main className={styles.mainContent}>
        <ServiceDetailPageComponent service={service} />
      </main>
    </div>
  );
};

export default ServicePage;