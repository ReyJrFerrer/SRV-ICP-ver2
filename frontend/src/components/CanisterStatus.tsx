// components/CanisterStatus.tsx
import React from 'react';
import { useCanisterInitialization } from '../utils/useCanisterInitialization';

interface CanisterStatusProps {
  showInProduction?: boolean;
}

/**
 * Debug component to show canister initialization status
 * Only shows in development by default
 */
export const CanisterStatus: React.FC<CanisterStatusProps> = ({ 
  showInProduction = false 
}) => {
  const { isInitialized, isInitializing, error, initializeManually, resetAndRetry } = useCanisterInitialization();

  // Don't show in production unless explicitly requested
  if (process.env.NODE_ENV === 'production' && !showInProduction) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white border rounded-lg shadow-lg p-4 max-w-sm z-50">
      <h3 className="font-semibold text-sm mb-2">Canister Status</h3>
      
      <div className="space-y-2 text-xs">
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${
            isInitialized ? 'bg-green-500' : 
            isInitializing ? 'bg-yellow-500' : 
            'bg-red-500'
          }`} />
          <span>
            {isInitialized ? 'Initialized' : 
             isInitializing ? 'Initializing...' : 
             'Not Initialized'}
          </span>
        </div>
        
        {error && (
          <div className="text-red-600 bg-red-50 p-2 rounded text-xs">
            {error}
          </div>
        )}
        
        <div className="flex space-x-2 mt-3">
          <button
            onClick={initializeManually}
            disabled={isInitializing}
            className="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {isInitializing ? 'Initializing...' : 'Retry Init'}
          </button>
          
          <button
            onClick={resetAndRetry}
            disabled={isInitializing}
            className="px-2 py-1 bg-gray-500 text-white text-xs rounded hover:bg-gray-600 disabled:opacity-50"
          >
            Reset & Retry
          </button>
        </div>
      </div>
    </div>
  );
};

export default CanisterStatus;
