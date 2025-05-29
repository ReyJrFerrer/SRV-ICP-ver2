import { useState, useEffect } from 'react';
import { hello } from '../src/declarations/hello';
import Head from 'next/head';
import styles from '../ui/styles/Home.module.css';

interface ProjectInfo {
  name: string;
  version: string;
  description: string;
}

export default function Home() {
  const [greeting, setGreeting] = useState<string>('');
  const [welcomeMessage, setWelcomeMessage] = useState<string>('');
  const [projectInfo, setProjectInfo] = useState<ProjectInfo | null>(null);
  const [name, setName] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    // Load initial data from the canister
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [welcomeMsg, projectData] = await Promise.all([
        hello.getWelcomeMessage(),
        hello.getProjectInfo()
      ]);
      setWelcomeMessage(welcomeMsg);
      setProjectInfo(projectData);
    } catch (error) {
      console.error('Error loading initial data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGreet = async () => {
    if (!name.trim()) return;
    
    try {
      setLoading(true);
      const result = await hello.greet(name);
      setGreeting(result);
    } catch (error) {
      console.error('Error greeting:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>SRV-ICP - iThink Hackathon</title>
        <meta name="description" content="Next.js app with Motoko backend on Internet Computer" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to{' '}
          <span className={styles.highlight}>SRV-ICP</span>
        </h1>

        <div className={styles.card}>
          <h2>🎉 iThink Hackathon Project</h2>
          {loading ? (
            <div className={styles.loading}>Loading...</div>
          ) : (
            <>
              {welcomeMessage && (
                <p className={styles.description}>{welcomeMessage}</p>
              )}
              
              {projectInfo && (
                <div className={styles.projectInfo}>
                  <h3>Project Details</h3>
                  <p><strong>Name:</strong> {projectInfo.name}</p>
                  <p><strong>Version:</strong> {projectInfo.version}</p>
                  <p><strong>Description:</strong> {projectInfo.description}</p>
                </div>
              )}
            </>
          )}
        </div>

        <div className={styles.interactiveSection}>
          <h3>Try the Motoko Canister!</h3>
          <div className={styles.greetForm}>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className={styles.input}
              onKeyPress={(e) => e.key === 'Enter' && handleGreet()}
            />
            <button 
              onClick={handleGreet} 
              disabled={loading || !name.trim()}
              className={styles.button}
            >
              {loading ? 'Greeting...' : 'Say Hello!'}
            </button>
          </div>
          
          {greeting && (
            <div className={styles.greetingResult}>
              <p>{greeting}</p>
            </div>
          )}
        </div>

        <div className={styles.navigationSection}>
          <h3>Choose Your Interface</h3>
          <div className={styles.navigationButtons}>
            <a href="/client" className={styles.navigationButton}>
              <div className={styles.buttonIcon}>👤</div>
              <h4>Client Interface</h4>
              <p>Find and book services</p>
            </a>
            <a href="/service-provider" className={styles.navigationButton}>
              <div className={styles.buttonIcon}>🔧</div>
              <h4>Service Provider</h4>
              <p>Manage your services</p>
            </a>
          </div>
        </div>

        <div className={styles.techStack}>
          <h3>Tech Stack</h3>
          <div className={styles.badges}>
            <span className={styles.badge}>Next.js</span>
            <span className={styles.badge}>TypeScript</span>
            <span className={styles.badge}>Motoko</span>
            <span className={styles.badge}>Internet Computer</span>
            <span className={styles.badge}>DFINITY</span>
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        <p>
          Powered by{' '}
          <a
            href="https://internetcomputer.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Internet Computer
          </a>{' '}
          and{' '}
          <a
            href="https://nextjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Next.js
          </a>
        </p>
      </footer>
    </div>
  );
}
