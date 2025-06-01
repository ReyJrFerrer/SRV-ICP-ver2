// Review and reputation-related types aligned with backend Motoko types
import { BaseEntity } from './common';

export type ReviewStatus = 'Visible' | 'Hidden' | 'Flagged';

export interface Review extends BaseEntity {
  bookingId: string;
  clientId: string;
  providerId: string;
  serviceId: string;
  rating: number; // 1-5 rating
  comment: string;
  status: ReviewStatus;
  qualityScore?: number; // AI-generated quality score
}

export type TrustLevel = 'New' | 'Low' | 'Medium' | 'High' | 'VeryHigh';

export type DetectionFlag = 
  | 'ReviewBomb'
  | 'CompetitiveManipulation'
  | 'FakeEvidence'
  | 'IdentityFraud'
  | 'Other';

export interface ReputationScore {
  userId: string;
  trustScore: number; // 0-100 score
  trustLevel: TrustLevel;
  completedBookings: number;
  averageRating?: number;
  detectionFlags: DetectionFlag[];
  lastUpdated: Date;
}
