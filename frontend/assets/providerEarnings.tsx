import { ProviderEarnings, ProviderTransaction, ProviderPayout, ProviderPerformanceMetrics } from './types/provider/provider-earnings';

// Sample provider earnings data
export const PROVIDER_EARNINGS: ProviderEarnings[] = [
  {
    id: "earn-001",
    providerId: "prov-001",
    totalLifetimeEarnings: 15250.00,
    availableBalance: 950.00,
    pendingBalance: 250.00,
    currency: "USD",
    recentTransactions: [
      {
        id: "trans-001",
        providerId: "prov-001",
        type: "EARNING",
        amount: 100.00,
        currency: "USD",
        description: "Payment for cleaning service",
        orderId: "ord-001",
        status: "COMPLETED",
        reference: "E12345",
        isActive: true,
        createdAt: new Date("2025-04-10"),
        updatedAt: new Date("2025-04-10")
      },
      {
        id: "trans-002",
        providerId: "prov-001",
        type: "PAYOUT",
        amount: -500.00,
        currency: "USD",
        description: "Weekly payout",
        status: "COMPLETED",
        reference: "P67890",
        fee: 5.00,
        isActive: true,
        createdAt: new Date("2025-04-05"),
        updatedAt: new Date("2025-04-07")
      }
    ],
    payoutMethods: [
      {
        id: "method-001",
        providerId: "prov-001",
        type: "BANK_TRANSFER",
        isDefault: true,
        nickname: "My Main Bank",
        accountLast4: "4321",
        accountHolderName: "Mary Gold",
        details: {
          bankName: "XYZ Bank",
          routingNumber: "021000021"
        },
        verificationStatus: "VERIFIED",
        isActive: true,
        createdAt: new Date("2024-01-15"),
        updatedAt: new Date("2024-01-15")
      },
      {
        id: "method-002",
        providerId: "prov-001",
        type: "GCASH",
        isDefault: false,
        nickname: "My GCash",
        accountLast4: "6789",
        accountHolderName: "Mary Gold",
        details: {
          phoneNumber: "+1234567890"
        },
        verificationStatus: "VERIFIED",
        isActive: true,
        createdAt: new Date("2024-02-20"),
        updatedAt: new Date("2024-02-20")
      }
    ],
    isActive: true,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2025-04-10")
  },
  {
    id: "earn-002",
    providerId: "prov-002",
    totalLifetimeEarnings: 25600.00,
    availableBalance: 2400.00,
    pendingBalance: 800.00,
    currency: "USD",
    recentTransactions: [
      {
        id: "trans-003",
        providerId: "prov-002",
        type: "EARNING",
        amount: 160.00,
        currency: "USD",
        description: "Payment for emergency plumbing service",
        orderId: "ord-002",
        status: "PENDING",
        isActive: true,
        createdAt: new Date("2025-04-09"),
        updatedAt: new Date("2025-04-09")
      },
      {
        id: "trans-004",
        providerId: "prov-002",
        type: "PAYOUT",
        amount: -1000.00,
        currency: "USD",
        description: "Weekly payout",
        status: "COMPLETED",
        reference: "P12345",
        fee: 10.00,
        isActive: true,
        createdAt: new Date("2025-04-02"),
        updatedAt: new Date("2025-04-04")
      }
    ],
    payoutMethods: [
      {
        id: "method-003",
        providerId: "prov-002",
        type: "PAYPAL",
        isDefault: true,
        nickname: "My PayPal",
        accountLast4: "1234",
        accountHolderName: "Silverston Eliot",
        details: {
          email: "silverstor.eliot@example.com"
        },
        verificationStatus: "VERIFIED",
        isActive: true,
        createdAt: new Date("2024-01-20"),
        updatedAt: new Date("2024-01-20")
      }
    ],
    isActive: true,
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date("2025-04-09")
  }
];