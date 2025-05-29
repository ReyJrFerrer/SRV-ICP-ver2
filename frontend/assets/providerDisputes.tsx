import { ProviderDispute } from './types/provider/provider-dispute';

// Sample provider disputes
export const PROVIDER_DISPUTES: ProviderDispute[] = [
  {
    id: "dispute-001",
    orderId: "ord-004",
    clientId: "client-004",
    clientName: "Sarah Thompson",
    serviceTitle: "House Cleaning - 4 Hours",
    serviceDate: new Date("2025-06-12T13:00:00"),
    disputeStatus: "RESOLVED",
    disputeReason: "Schedule conflict",
    clientEvidence: [
      {
        id: "cev-001",
        type: "TEXT",
        content: "Need to reschedule due to personal emergency",
        submittedBy: "CLIENT",
        submittedAt: new Date("2025-06-06T10:15:00")
      }
    ],
    providerEvidence: [],
    submissionDeadline: new Date("2025-06-09T23:59:59"),
    resolution: {
      outcome: "REFUNDED",
      amount: 100.00,
      currency: "USD",
      description: "Full refund processed due to advance notice of cancellation",
      resolvedBy: "ADMIN",
      resolvedAt: new Date("2025-06-07T09:30:00"),
      affectsProviderRating: false,
      clientRefund: 100.00
    },
    isActive: true,
    createdAt: new Date("2025-06-06T10:15:00"),
    updatedAt: new Date("2025-06-07T09:30:00")
  }
];