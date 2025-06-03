import { ProviderPerformanceMetrics } from './types/provider/provider-earnings';

// Sample provider performance metrics
export const PROVIDER_METRICS: ProviderPerformanceMetrics[] = [
  {
    id: "metrics-001",
    providerId: "prov-001",
    period: "MONTHLY",
    startDate: new Date("2025-03-01"),
    endDate: new Date("2025-03-31"),
    totalEarnings: 1550.00,
    totalJobs: 21,
    completedJobs: 20,
    cancelledJobs: 1,
    completionRate: 95.2,
    averageRating: 4.8,
    onTimeRate: 98.0,
    responseRate: 97.0,
    repeatedClients: 8,
    averageEarningsPerJob: 73.81,
    isActive: true,
    createdAt: new Date("2025-04-01"),
    updatedAt: new Date("2025-04-01")
  },
  {
    id: "metrics-002",
    providerId: "prov-002",
    period: "MONTHLY",
    startDate: new Date("2025-03-01"),
    endDate: new Date("2025-03-31"),
    totalEarnings: 2800.00,
    totalJobs: 32,
    completedJobs: 32,
    cancelledJobs: 0,
    completionRate: 100.0,
    averageRating: 4.9,
    onTimeRate: 99.0,
    responseRate: 100.0,
    repeatedClients: 12,
    averageEarningsPerJob: 87.50,
    isActive: true,
    createdAt: new Date("2025-04-01"),
    updatedAt: new Date("2025-04-01")
  }
];