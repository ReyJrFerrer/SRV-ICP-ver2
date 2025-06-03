// File: SRV-ICP-ver2-jdMain/frontend/assets/serviceProviders.tsx
import { ServiceProvider, ProviderVerificationStatus, ProviderAccountStatus } from './types/provider/service-provider';
import { SERVICES } from './services'; // Ensure SERVICES is imported

export const SERVICE_PROVIDERS: ServiceProvider[] = [
  {
    id: "dwcsw-j323f-hatuo-mpx42-rofyn-c5ns6-larek-xneku-t47x2-22jpf-xqe", // MODIFIED ID to match your AUTH-DERIVED providerId
    firstName: "Mary",
    lastName: "Gold",
    email: "mary.gold@example.com",
    phoneNumber: "+1234567890",
    profilePicture: {
      type: "IMAGE",
      url: require("./images/Maid1.jpg"), // Make sure this path is correct relative to serviceProviders.tsx or adjust as needed by your bundler
      thumbnail: require("./images/Maid1.jpg") // Same here
    },
    biography: "Experienced house maid with over 10 years of experience in residential cleaning and organizing.",
    location: {
      address: "Baguio City - Session Road",
      city: "Baguio City",
      country: "Philippines",
      latitude: 16.4145,
      longitude: 120.5960,
      postalCode: "2600",
      state: "Benguet"
    },
    verificationStatus: 'VERIFIED' as ProviderVerificationStatus,
    accountStatus: 'ACTIVE' as ProviderAccountStatus,
    averageRating: 4.8,
    totalReviews: 156,
    totalCompletedJobs: 203,
    identityVerified: true,
    backgroundCheckPassed: true,
    // This filter correctly picks services for "prov-001" from SERVICES.tsx
    // If you changed the `providerId` in SERVICES.tsx for Mary's services to match the new long ID,
    // you would update "prov-001" here too. But keeping it as "prov-001" works if services
    // in SERVICES.tsx are still linked to "prov-001".
    servicesOffered: SERVICES.filter(s => s.providerId === "prov-001"),
    languages: ["English", "Filipino"],
    isActive: true,
    createdAt: new Date("2023-06-15"),
    updatedAt: new Date("2024-01-10"),
    availability: {
      weeklySchedule: {
        "Monday": { isAvailable: true, slots: [{ startTime: "08:00", endTime: "17:00" }] },
        "Tuesday": { isAvailable: true, slots: [{ startTime: "08:00", endTime: "17:00" }] },
        "Wednesday": { isAvailable: true, slots: [{ startTime: "08:00", endTime: "17:00" }] },
        "Thursday": { isAvailable: true, slots: [{ startTime: "08:00", endTime: "17:00" }] },
        "Friday": { isAvailable: true, slots: [{ startTime: "08:00", endTime: "17:00" }] },
        "Saturday": { isAvailable: false, slots: [] },
        "Sunday": { isAvailable: false, slots: [] }
      },
      vacationDates: [
        {
          startDate: new Date("2025-05-01"),
          endDate: new Date("2025-05-15"),
          reason: "Annual vacation"
        }
      ],
      instantBookingEnabled: true,
      bookingNoticeHours: 24,
      maxBookingsPerDay: 2
    },
    earningSummary: {
      totalEarnings: 15250.00,
      totalEarningsThisMonth: 1200.00,
      totalEarningsLastMonth: 1550.00,
      pendingPayouts: 300.00,
      completionRate: 98.5,
      cancellationRate: 1.5,
      avgRating: 4.8
    },
    credentials: [
      {
        id: "cred-001",
        type: "CERTIFICATION",
        title: "Professional Cleaning Certification",
        issuingAuthority: "Cleaning Professionals Association",
        issueDate: new Date("2020-03-15"),
        expiryDate: new Date("2025-03-15"),
        verificationStatus: "VERIFIED" as ProviderVerificationStatus,
        documentUrl: "https://example.com/certificates/cleaning-cert.pdf"
      }
    ],
    taxInformation: {
      taxIdNumber: "123-45-6789",
      businessName: "Mary's Cleaning Services",
      businessType: "SOLE_PROPRIETOR",
      taxDocumentsSubmitted: true,
      vatRegistered: false
    },
    userId: '' // This field was empty and not primarily used for matching based on your logs
  },
  {
    id: "prov-002",
    firstName: "Silverston",
    lastName: "Eliot",
    email: "silverstor.eliot@example.com",
    phoneNumber: "+1987654321",
    profilePicture: {
      type: "IMAGE",
      url: require("./images/Plumber1.jpg"),
      thumbnail: require("./images/Plumber1.jpg")
    },
    biography: "Emergency plumbing specialist with expertise in fixing leaks, clogs, and plumbing installations. Available 24/7 for urgent calls.",
    location: {
      address: "Baguio City - Mines View Park",
      city: "Baguio City",
      country: "Philippines",
      latitude: 16.4245,
      longitude: 120.6314,
      postalCode: "2600",
      state: "Benguet"
    },
    verificationStatus: 'VERIFIED' as ProviderVerificationStatus,
    accountStatus: 'ACTIVE' as ProviderAccountStatus,
    averageRating: 4.9,
    totalReviews: 203,
    totalCompletedJobs: 245,
    identityVerified: true,
    backgroundCheckPassed: true,
    // For consistency and correctness, this should filter by providerId "prov-002"
    // servicesOffered: SERVICES.filter(s => s.providerId === "prov-002"),
    // Corrected based on previous observation, but ensure svc-003 is indeed by prov-002 or fix svc-003 providerId
    servicesOffered: SERVICES.filter(s => s.id === "svc-003"), // This was the original, review if svc-003 should be by prov-002
    languages: ["English", "Filipino", "Spanish"],
    isActive: true,
    createdAt: new Date("2023-04-20"),
    updatedAt: new Date("2024-01-15"),
    availability: {
      weeklySchedule: {},
      vacationDates: [],
      instantBookingEnabled: false,
      bookingNoticeHours: 0,
      maxBookingsPerDay: 0
    },
    earningSummary: {
      totalEarnings: 0,
      totalEarningsThisMonth: 0,
      totalEarningsLastMonth: 0,
      pendingPayouts: 0,
      completionRate: 0,
      cancellationRate: 0,
      avgRating: 0
    },
    credentials: [ /* ... credentials data ... */ ],
    taxInformation: {
      taxIdNumber: '',
      taxDocumentsSubmitted: false,
      vatRegistered: false
    },
    userId: ''
  },
  {
    id: "prov-003",
    firstName: "Juan",
    lastName: "Del JoJo",
    email: "juan.deljojo@example.com",
    phoneNumber: "+1122334455",
    profilePicture: {
      type: "IMAGE",
      url: require("./images/Technician1.jpg"),
      thumbnail: require("./images/Technician1.jpg")
    },
    biography: "Skilled appliance repair technician with experience fixing refrigerators, washing machines, dryers, and other major household appliances.",
    location: {
      address: "Baguio City - Burnham Park",
      city: "Baguio City",
      country: "Philippines",
      latitude: 16.4108,
      longitude: 120.5950,
      postalCode: "2600",
      state: "Benguet"
    },
    verificationStatus: 'VERIFIED' as ProviderVerificationStatus,
    accountStatus: 'ACTIVE' as ProviderAccountStatus,
    averageRating: 4.7,
    totalReviews: 178,
    totalCompletedJobs: 195,
    identityVerified: true,
    backgroundCheckPassed: true,
    // For consistency, this should filter by providerId "prov-003"
    // servicesOffered: SERVICES.filter(s => s.providerId === "prov-003"),
    // Corrected based on previous observation, but ensure svc-004 is indeed by prov-003 or fix svc-004 providerId
    servicesOffered: SERVICES.filter(s => s.id === "svc-004"), // This was the original, review if svc-004 should be by prov-003
    languages: ["English", "Filipino"],
    isActive: true,
    createdAt: new Date("2023-05-10"),
    updatedAt: new Date("2024-01-05"),
    availability: {
      weeklySchedule: {},
      vacationDates: [],
      instantBookingEnabled: false,
      bookingNoticeHours: 0,
      maxBookingsPerDay: 0
    },
    earningSummary: {
      totalEarnings: 0,
      totalEarningsThisMonth: 0,
      totalEarningsLastMonth: 0,
      pendingPayouts: 0,
      completionRate: 0,
      cancellationRate: 0,
      avgRating: 0
    },
    credentials: [ /* ... credentials data ... */ ],
    taxInformation: {
      taxIdNumber: '',
      taxDocumentsSubmitted: false,
      vatRegistered: false
    },
    userId: ''
  }
];