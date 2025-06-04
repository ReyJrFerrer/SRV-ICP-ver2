// ICP Client Utility for Authentication
import { HttpAgent, Identity } from '@dfinity/agent';

// Global variables to store the current authentication state
let currentIdentity: Identity | null = null;
let currentAgent: HttpAgent | null = null;

/**
 * Set the current identity from the ICP Connect context
 * This should be called from the AuthWrapper when authentication state changes
 */
export const setCurrentIdentity = (identity: Identity | null) => {
  currentIdentity = identity;
  // Reset agent when identity changes
  currentAgent = null;
};

/**
 * Get the current authenticated identity
 */
export const getCurrentIdentity = (): Identity | null => {
  return currentIdentity;
};

/**
 * Create or get the HTTP agent with the current identity
 */
export const getHttpAgent = async (): Promise<HttpAgent> => {
  if (!currentAgent) {
    const agentConfig: any = {
      host: process.env.NEXT_PUBLIC_IC_HOST_URL || 'http://localhost:4943',
    };

    // Add identity if available
    if (currentIdentity) {
      agentConfig.identity = currentIdentity;
      console.log('Using authenticated identity:', currentIdentity.getPrincipal().toString());
    } else {
      console.log('Using anonymous identity');
    }

    currentAgent = new HttpAgent(agentConfig);

    // Fetch root key for certificate validation during development
    if (process.env.NODE_ENV === 'development') {
      try {
        await currentAgent.fetchRootKey();
      } catch (err) {
        console.warn('Unable to fetch root key. Check to ensure that your local replica is running');
        console.error(err);
      }
    }
  }

  return currentAgent;
};

/**
 * Reset the agent (useful when identity changes)
 */
export const resetAgent = () => {
  currentAgent = null;
};

/**
 * Check if user is currently authenticated
 */
export const isAuthenticated = (): boolean => {
  return currentIdentity !== null;
};
