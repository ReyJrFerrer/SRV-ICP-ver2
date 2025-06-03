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
      url: require("./images/Maid1.jpg"),
      thumbnail: require("./images/Maid1.jpg")
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
    // This filter correctly picks services for the original "prov-001" from SERVICES.tsx
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
    // Corrected to filter by this provider's ID
    servicesOffered: SERVICES.filter(s => s.providerId === "prov-002"),
    languages: ["English", "Filipino", "Spanish"],
    isActive: true,
    createdAt: new Date("2023-04-20"),
    updatedAt: new Date("2024-01-15"),
    availability: {
      weeklySchedule: {
        "Monday": { isAvailable: true, slots: [{ startTime: "00:00", endTime: "23:59" }] },
        "Tuesday": { isAvailable: true, slots: [{ startTime: "00:00", endTime: "23:59" }] },
        "Wednesday": { isAvailable: true, slots: [{ startTime: "00:00", endTime: "23:59" }] },
        "Thursday": { isAvailable: true, slots: [{ startTime: "00:00", endTime: "23:59" }] },
        "Friday": { isAvailable: true, slots: [{ startTime: "00:00", endTime: "23:59" }] },
        "Saturday": { isAvailable: true, slots: [{ startTime: "00:00", endTime: "23:59" }] },
        "Sunday": { isAvailable: true, slots: [{ startTime: "00:00", endTime: "23:59" }] }
      },
      vacationDates: [],
      instantBookingEnabled: true,
      bookingNoticeHours: 1, // Emergency service
      maxBookingsPerDay: 5
    },
    earningSummary: {
      totalEarnings: 25600.00,
      totalEarningsThisMonth: 3200.00,
      totalEarningsLastMonth: 2800.00,
      pendingPayouts: 800.00,
      completionRate: 99.2,
      cancellationRate: 0.8,
      avgRating: 4.9
    },
    credentials: [
      {
        id: "cred-002",
        type: "LICENSE",
        title: "Master Plumber License",
        issuingAuthority: "Baguio City Public Works Department",
        issueDate: new Date("2018-06-10"),
        expiryDate: new Date("2028-06-10"),
        verificationStatus: "VERIFIED" as ProviderVerificationStatus,
        documentUrl: "https://example.com/licenses/plumber-license.pdf"
      }
    ],
    taxInformation: {
      taxIdNumber: "987-65-4321",
      businessName: "Eliot's Emergency Plumbing",
      businessType: "LLC",
      taxDocumentsSubmitted: true,
      vatRegistered: true,
      vatNumber: "VAT123456789"
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
    // Corrected to filter by this provider's ID
    servicesOffered: SERVICES.filter(s => s.providerId === "prov-003"),
    languages: ["English", "Filipino"],
    isActive: true,
    createdAt: new Date("2023-05-10"),
    updatedAt: new Date("2024-01-05"),
    availability: {
      weeklySchedule: {
        "Monday": { isAvailable: true, slots: [{ startTime: "09:00", endTime: "18:00" }] },
        "Tuesday": { isAvailable: true, slots: [{ startTime: "09:00", endTime: "18:00" }] },
        "Wednesday": { isAvailable: true, slots: [{ startTime: "09:00", endTime: "18:00" }] },
        "Thursday": { isAvailable: true, slots: [{ startTime: "09:00", endTime: "18:00" }] },
        "Friday": { isAvailable: true, slots: [{ startTime: "09:00", endTime: "18:00" }] },
        "Saturday": { isAvailable: true, slots: [{ startTime: "10:00", endTime: "16:00" }] },
        "Sunday": { isAvailable: false, slots: [] }
      },
      vacationDates: [],
      instantBookingEnabled: false,
      bookingNoticeHours: 12,
      maxBookingsPerDay: 3
    },
    earningSummary: {
      totalEarnings: 18900.00,
      totalEarningsThisMonth: 1650.00,
      totalEarningsLastMonth: 1800.00,
      pendingPayouts: 450.00,
      completionRate: 97.8,
      cancellationRate: 2.2,
      avgRating: 4.7
    },
    credentials: [
      {
        id: "cred-003",
        type: "CERTIFICATION",
        title: "Certified Appliance Technician",
        issuingAuthority: "Appliance Service Association",
        issueDate: new Date("2019-04-22"),
        expiryDate: undefined,
        verificationStatus: "VERIFIED" as ProviderVerificationStatus,
        documentUrl: "https://example.com/certificates/appliance-cert.pdf"
      }
    ],
    taxInformation: {
      taxIdNumber: "AZN-777-112",
      businessType: "SOLE_PROPRIETOR",
      taxDocumentsSubmitted: true,
      vatRegistered: false,
    },
    userId: ''
  }
];