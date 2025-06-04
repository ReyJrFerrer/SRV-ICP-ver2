// ICP Client Utility for Authentication
import { HttpAgent, Identity } from '@dfinity/agent';

// Global variables to store the current authentication state
let currentIdentity: Identity | null = null;
let httpAgent: HttpAgent | null = null;

/**
 * Set the current identity from the ICP Connect context
 * This should be called from the AuthWrapper when authentication state changes
 */
export const setCurrentIdentity = (identity: Identity | null) => {
  currentIdentity = identity;
  // Reset agent when identity changes
  httpAgent = null;
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
  if (!httpAgent) {
    // Check if we're in development or production
    const isDevelopment = process.env.NODE_ENV === 'development' || 
                         process.env.NEXT_PUBLIC_IC_HOST?.includes('localhost');
    
    // Create agent with current identity if available
    const agentOptions: any = {
      host: isDevelopment 
        ? 'http://localhost:4943' 
        : 'https://ic0.app',
    };

    // Add identity if authenticated
    if (currentIdentity) {
      agentOptions.identity = currentIdentity;
      console.log('Creating HTTP agent with authenticated identity:', currentIdentity.getPrincipal().toString());
    } else {
      console.log('Creating HTTP agent with anonymous identity');
    }

    httpAgent = new HttpAgent(agentOptions);

    // Fetch root key for local development
    if (isDevelopment) {
      try {
        await httpAgent.fetchRootKey();
        console.log('Root key fetched successfully for development');
      } catch (error) {
        console.warn('Failed to fetch root key:', error);
        throw new Error('Failed to initialize HTTP agent for local development');
      }
    }
  }
  
  if (!httpAgent) {
    throw new Error('HTTP agent initialization failed');
  }
  
  return httpAgent;
};

/**
 * Create HTTP agent for admin operations (without identity requirement)
 * Use this only for initial setup operations
 */
export const getAdminHttpAgent = async (): Promise<HttpAgent> => {
  const isDevelopment = process.env.NODE_ENV === 'development' || 
                       process.env.NEXT_PUBLIC_IC_HOST?.includes('localhost');
  
  const adminAgent = new HttpAgent({
    host: isDevelopment 
      ? 'http://localhost:4943' 
      : 'https://ic0.app',
  });

  // Fetch root key for local development
  if (isDevelopment) {
    try {
      await adminAgent.fetchRootKey();
    } catch (error) {
      console.warn('Failed to fetch root key for admin agent:', error);
      throw new Error('Failed to initialize admin HTTP agent for local development');
    }
  }
  
  return adminAgent;
};

/**
 * Reset the agent (useful when identity changes)
 */
export const resetAgent = () => {
  httpAgent = null;
};

/**
 * Check if user is currently authenticated
 */
export const isAuthenticated = (): boolean => {
  return currentIdentity !== null;
};
