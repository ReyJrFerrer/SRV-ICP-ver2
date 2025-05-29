// types/dispute.ts
export type DisputeStatus = 'OPEN' | 'UNDER_REVIEW' | 'RESOLVED' | 'ESCALATED';
export type DisputeResolutionOutcome = 'REFUNDED' | 'PAID' | 'PARTIAL_REFUND';

export interface DisputeEvidence {
  type: 'IMAGE' | 'TEXT';
  content: string;
  submittedBy: 'CLIENT' | 'PROVIDER';
  timestamp: Date;
}