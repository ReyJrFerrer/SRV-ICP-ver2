import React, { useState } from 'react';
import Head from 'next/head';
import styles from '../../ui/styles/Client.module.css';
import ClientHome from '../../ui/components/client/home/ClientHome';
import MyBookingsComponent from 'frontend/ui/components/client/bookings/MyBookingsComponent'; 
type TabType = 'home' | 'bookings'; // Changed 'chat' to 'bookings'

export default function ClientInterface() {
  const [activeTab, setActiveTab] = useState<TabType>('home');

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <ClientHome />;
      case 'bookings': // Changed 'chat' to 'bookings'
        return <MyBookingsComponent />; 
      default:
        return <ClientHome />;
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>SRV Client - Find Services</title>
        <meta name="description" content="Find and book local services" />
        <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className={styles.content}>
          {renderContent()}
        </div>

        <nav className={styles.bottomNav}>
          <button
            className={`${styles.tabButton} ${activeTab === 'home' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('home')}
          >
            <div className={styles.tabIcon}>🏠</div>
            <span className={styles.tabLabel}>Home</span>
          </button>
          
          <button
            className={`${styles.tabButton} ${activeTab === 'bookings' ? styles.activeTab : ''}`} // Changed
            onClick={() => setActiveTab('bookings')} // Changed
          >
            <div className={styles.tabIcon}>📅</div> {/* Changed Icon */}
            <span className={styles.tabLabel}>My Bookings</span> {/* Changed Label */}
          </button>
        </nav>
      </main>
    </div>
  );
}