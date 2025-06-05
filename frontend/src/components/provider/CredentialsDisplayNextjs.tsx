import React from 'react';
import { 
  PlusIcon, 
  UserIcon, 
  ShieldCheckIcon, 
  CheckBadgeIcon,
  AcademicCapIcon
} from '@heroicons/react/24/solid';
import Link from 'next/link';
import { ServiceProvider } from '../../../assets/types/provider/service-provider';

interface CredentialsDisplayProps {
  provider: ServiceProvider;
  className?: string;
}

const CredentialsDisplayNextjs: React.FC<CredentialsDisplayProps> = ({ provider, className = '' }) => {
  const { credentials, identityVerified, backgroundCheckPassed, verificationStatus } = provider;
  
  // Format date
  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric'
    }).format(new Date(date));
  };

  return (
    <div className={`credentials-section ${className}`}>
      <div className="section-header flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-blue-700">Credentials & Verification</h2>
        <Link href="/provider/credentials/add">
          <button className="add-button bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2 transition-colors">
            <PlusIcon className="h-5 w-5" />
          </button>
        </Link>
      </div>
      
      <div className="verification-badges flex gap-3 mb-4 flex-wrap">
        {identityVerified && (
          <div className="verification-badge flex items-center bg-blue-600 text-white px-3 py-1 rounded-full">
            <UserIcon className="h-4 w-4 text-white mr-1" />
            <span className="text-sm font-medium">Identity Verified</span>
          </div>
        )}
        
        {backgroundCheckPassed && (
          <div className="verification-badge flex items-center bg-yellow-200 text-black px-3 py-1 rounded-full">
            <ShieldCheckIcon className="h-4 w-4 text-black mr-1" />
            <span className="text-sm font-medium">Background Verified</span>
          </div>
        )}
        
        {verificationStatus === 'VERIFIED' && (
          <div className="verification-badge flex items-center bg-black text-white px-3 py-1 rounded-full">
            <CheckBadgeIcon className="h-4 w-4 text-yellow-400 mr-1" />
            <span className="text-sm font-medium">{verificationStatus}</span>
          </div>
        )}
      </div>
      
      {credentials.length > 0 ? (
        <div className="space-y-4">
          {credentials.map((credential) => (
            <div key={credential.id} className="credential-card bg-white rounded-lg shadow p-4">
              <div className="flex items-start justify-between">
                <div className="flex">
                  <AcademicCapIcon className="h-6 w-6 text-blue-600 mr-2 mt-1" />
                  <div>
                    <h3 className="font-semibold text-black">{credential.title}</h3>
                    <p className="text-sm text-gray-700">Issued by: {credential.issuingAuthority}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Issued: {formatDate(credential.issueDate)}
                      {credential.expiryDate && ` • Expires: ${formatDate(credential.expiryDate)}`}
                    </p>
                  </div>
                </div>
                {credential.verificationStatus === 'VERIFIED' && (
                  <CheckBadgeIcon className="h-5 w-5 text-blue-600" />
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-yellow-50 p-6 rounded-lg text-center">
          <p className="text-black">You haven't added any credentials yet</p>
          <Link href="/provider/credentials/add">
            <button className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Add Credentials
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default CredentialsDisplayNextjs;