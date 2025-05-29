import React, { useState } from 'react';
import Head from 'next/head';
import styles from '../../ui/styles/Client.module.css';
import ClientHome from '../../ui/components/client/ClientHome';
import ClientChat from '../../ui/components/client/ClientChat';

type TabType = 'home' | 'chat';

export default function ClientInterface() {
  const [activeTab, setActiveTab] = useState<TabType>('home');

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <ClientHome />;
      case 'chat':
        return <ClientChat />;
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
        {/* Content Area */}
        <div className={styles.content}>
          {renderContent()}
        </div>

        {/* Bottom Tab Navigation */}
        <nav className={styles.bottomNav}>
          <button
            className={`${styles.tabButton} ${activeTab === 'home' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('home')}
          >
            <div className={styles.tabIcon}>🏠</div>
            <span className={styles.tabLabel}>Home</span>
          </button>
          
          <button
            className={`${styles.tabButton} ${activeTab === 'chat' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('chat')}
          >
            <div className={styles.tabIcon}>💬</div>
            <span className={styles.tabLabel}>Chat</span>
          </button>
        </nav>
      </main>
    </div>
  );
}