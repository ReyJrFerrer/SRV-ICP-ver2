// Auth Canister Service
import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory } from '../declarations/auth/auth.did.js';
import type { _SERVICE as AuthService, Profile, UserRole } from '../declarations/auth/auth.did';
import { adaptBackendProfile } from '../utils/assetResolver';

// Canister configuration
const AUTH_CANISTER_ID = process.env.NEXT_PUBLIC_AUTH_CANISTER_ID || 'be2us-64aaa-aaaaa-qaabq-cai';

// Create agent and actor
let agent: HttpAgent | null = null;
let authActor: AuthService | null = null;

const initializeAgent = async (): Promise<HttpAgent> => {
  if (!agent) {
    agent = new HttpAgent({
      host: process.env.NEXT_PUBLIC_IC_HOST_URL || 'http://localhost:4943',
    });

    // Fetch root key for certificate validation during development
    if (process.env.NODE_ENV === 'development') {
      try {
        await agent.fetchRootKey();
      } catch (err) {
        console.warn('Unable to fetch root key. Check to ensure that your local replica is running');
        console.error(err);
      }
    }
  }
  return agent;
};

const getAuthActor = async (): Promise<AuthService> => {
  if (!authActor) {
    const agentInstance = await initializeAgent();
    authActor = Actor.createActor(idlFactory, {
      agent: agentInstance,
      canisterId: AUTH_CANISTER_ID,
    }) as AuthService;
  }
  return authActor;
};

// Frontend-compatible Profile interface
export interface FrontendProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'Client' | 'ServiceProvider';
  isVerified: boolean;
  profilePicture?: {
    imageUrl: any; // Frontend require() result
    thumbnailUrl: any; // Frontend require() result
  };
  biography?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Auth Canister Service Functions
export const authCanisterService = {
  /**
   * Get all service providers from the auth canister
   */
  async getAllServiceProviders(): Promise<FrontendProfile[]> {
    try {
      const actor = await getAuthActor();
      const profiles = await actor.getAllServiceProviders();
      
      // Convert backend profiles to frontend-compatible format
      return profiles.map(profile => adaptBackendProfile(profile));
    } catch (error) {
      console.error('Error fetching service providers:', error);
      throw new Error(`Failed to fetch service providers: ${error}`);
    }
  },

  /**
   * Get a specific profile by Principal ID
   */
  async getProfile(userId: string): Promise<FrontendProfile | null> {
    try {
      const actor = await getAuthActor();
      const result = await actor.getProfile(userId as any); // Principal conversion
      
      if ('ok' in result) {
        return adaptBackendProfile(result.ok);
      } else {
        console.error('Error fetching profile:', result.err);
        return null;
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw new Error(`Failed to fetch profile: ${error}`);
    }
  },

  /**
   * Get the current user's profile
   */
  async getMyProfile(): Promise<FrontendProfile | null> {
    try {
      const actor = await getAuthActor();
      const result = await actor.getMyProfile();
      
      if ('ok' in result) {
        return adaptBackendProfile(result.ok);
      } else {
        console.error('Error fetching my profile:', result.err);
        return null;
      }
    } catch (error) {
      console.error('Error fetching my profile:', error);
      throw new Error(`Failed to fetch my profile: ${error}`);
    }
  },

  /**
   * Create a new profile
   */
  async createProfile(
    name: string,
    email: string,
    phone: string,
    role: 'Client' | 'ServiceProvider'
  ): Promise<FrontendProfile | null> {
    try {
      const actor = await getAuthActor();
      const userRole: UserRole = { [role]: null } as UserRole;
      const result = await actor.createProfile(name, email, phone, userRole);
      
      if ('ok' in result) {
        return adaptBackendProfile(result.ok);
      } else {
        console.error('Error creating profile:', result.err);
        throw new Error(result.err);
      }
    } catch (error) {
      console.error('Error creating profile:', error);
      throw new Error(`Failed to create profile: ${error}`);
    }
  },

  /**
   * Update an existing profile
   */
  async updateProfile(
    name?: string,
    email?: string,
    phone?: string
  ): Promise<FrontendProfile | null> {
    try {
      const actor = await getAuthActor();
      const result = await actor.updateProfile(
        name ? [name] : [],
        email ? [email] : [],
        phone ? [phone] : []
      );
      
      if ('ok' in result) {
        return adaptBackendProfile(result.ok);
      } else {
        console.error('Error updating profile:', result.err);
        throw new Error(result.err);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      throw new Error(`Failed to update profile: ${error}`);
    }
  },

  /**
   * Verify a user
   */
  async verifyUser(userId: string): Promise<boolean> {
    try {
      const actor = await getAuthActor();
      const result = await actor.verifyUser(userId as any); // Principal conversion
      
      if ('ok' in result) {
        return result.ok;
      } else {
        console.error('Error verifying user:', result.err);
        throw new Error(result.err);
      }
    } catch (error) {
      console.error('Error verifying user:', error);
      throw new Error(`Failed to verify user: ${error}`);
    }
  }
};

export default authCanisterService;
