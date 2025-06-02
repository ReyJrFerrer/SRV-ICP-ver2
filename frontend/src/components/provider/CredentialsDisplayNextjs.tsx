import React from 'react';
import { 
  PlusIcon, 
  UserIcon, 
  ShieldCheckIcon, 
  CheckBadgeIcon,
  AcademicCapIcon
} from '@heroicons/react/24/solid';
import Link from 'next/link';

// Define local interfaces
interface ProviderCredential {
  id: string;
  title?: string;
  name?: string;
  issuingAuthority?: string;
  issueDate?: Date | string;
  expiryDate?: Date | string;
  verificationStatus?: string;
  isVerified?: boolean;
  dateVerified?: string;
  documentUrl?: string;
}

interface ServiceProvider {
  id: string;
  credentials: ProviderCredential[];
  identityVerified?: boolean;
  backgroundCheckPassed?: boolean;
  verificationStatus?: string;
  // Other properties are not needed for this component
  [key: string]: any;
}

interface CredentialsDisplayProps {
  provider: ServiceProvider;
  className?: string;
}

const CredentialsDisplayNextjs: React.FC<CredentialsDisplayProps> = ({ provider, className = '' }) => {
  // Adapt credentials to expected format
  const adaptedCredentials = provider.credentials.map(cred => ({
    id: cred.id,
    title: cred.title || cred.name || 'Credential',
    issuingAuthority: cred.issuingAuthority || 'Issuing Authority',
    issueDate: cred.issueDate || cred.dateVerified || new Date(),
    expiryDate: cred.expiryDate,
    verificationStatus: cred.verificationStatus || (cred.isVerified ? 'VERIFIED' : 'PENDING')
  }));
  
  const identityVerified = provider.identityVerified === undefined ? true : provider.identityVerified;
  const backgroundCheckPassed = provider.backgroundCheckPassed === undefined ? true : provider.backgroundCheckPassed;
  const verificationStatus = provider.verificationStatus || 'VERIFIED';
  
  // Format date
  const formatDate = (date: Date | string): string => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric'
    }).format(typeof date === 'string' ? new Date(date) : date);
  };

  return (
    <div className={`credentials-section ${className}`}>
      <div className="section-header">
        <h2 className="text-xl font-bold text-gray-800">Credentials & Verification</h2>
        <Link href="/provider/credentials/add">
          <button className="add-button">
            <PlusIcon className="h-5 w-5" />
          </button>
        </Link>
      </div>
      
      <div className="verification-badges">
        {identityVerified && (
          <div className="verification-badge">
            <UserIcon className="h-4 w-4 text-green-600 mr-1" />
            <span className="text-sm text-gray-700">Identity Verified</span>
          </div>
        )}
        
        {backgroundCheckPassed && (
          <div className="verification-badge">
            <ShieldCheckIcon className="h-4 w-4 text-green-600 mr-1" />
            <span className="text-sm text-gray-700">Background Verified</span>
          </div>
        )}
        
        {verificationStatus === 'VERIFIED' && (
          <div className="verification-badge bg-green-100">
            <CheckBadgeIcon className="h-4 w-4 text-green-600 mr-1" />
            <span className="text-sm text-green-700 font-medium">{verificationStatus}</span>
          </div>
        )}
      </div>
      
      {adaptedCredentials.length > 0 ? (
        <div className="space-y-4">
          {adaptedCredentials.map((credential) => (
            <div key={credential.id} className="credential-card">
              <div className="flex items-start justify-between">
                <div className="flex">
                  <AcademicCapIcon className="h-6 w-6 text-teal-600 mr-2 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-800">{credential.title}</h3>
                    <p className="text-sm text-gray-600">Issued by: {credential.issuingAuthority}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Issued: {formatDate(credential.issueDate)}
                      {credential.expiryDate && ` • Expires: ${formatDate(credential.expiryDate)}`}
                    </p>
                  </div>
                </div>
                
                {credential.verificationStatus === 'VERIFIED' && (
                  <CheckBadgeIcon className="h-5 w-5 text-green-600" />
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 p-6 rounded-lg text-center">
          <p className="text-gray-500">You haven't added any credentials yet</p>
          <Link href="/provider/credentials/add">
            <button className="mt-3 bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition-colors">
              Add Credentials
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default CredentialsDisplayNextjs;
