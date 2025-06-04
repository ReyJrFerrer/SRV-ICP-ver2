import React, { useEffect } from 'react';
import { useAuth } from "@bundly/ares-react";
import { resetBookingActor } from '@app/services/bookingCanisterService';
import { resetServiceActor } from '@app/services/serviceCanisterService';
import { resetAuthActor } from '@app/services/authCanisterService'; // Add this import
import { setCurrentIdentity, resetAgent } from '@app/utils/icpClient';

interface AuthWrapperProps {
  children: React.ReactNode;
}

export const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
  const { isAuthenticated, currentIdentity } = useAuth();

  useEffect(() => {
    // Set the current identity in our utility
    setCurrentIdentity(isAuthenticated ? currentIdentity : null);
    
    // Reset actors when authentication state changes
    resetAgent();
    resetBookingActor();
    resetServiceActor();
    resetAuthActor(); // Add this line
    
    if (isAuthenticated && currentIdentity) {
      console.log('User authenticated, actors will be recreated with identity:', currentIdentity.getPrincipal().toString());
    } else {
      console.log('User not authenticated, actors will use anonymous identity');
    }
  }, [isAuthenticated, currentIdentity]);

  return <>{children}</>;
};
