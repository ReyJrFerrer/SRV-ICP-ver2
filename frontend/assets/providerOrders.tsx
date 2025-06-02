import { ProviderOrder } from './types/provider/provider-order'; // Assuming ProviderOrder includes OrderStatus
import { ORDERS } from './orders';

// Sample provider orders
export const PROVIDER_ORDERS: ProviderOrder[] = [ /* ... your existing confirmed/completed orders ... */ ];

// Sample provider booking requests awaiting acceptance
export const PROVIDER_BOOKING_REQUESTS: ProviderOrder[] = [ // Ensure this data aligns with ProviderOrder type
  {
    id: "prov-req-001",
    order: ORDERS.find(o => o.id === "ord-004")!,
    status: 'PENDING', // CHANGED FROM 'PENDING_ACCEPTANCE'
    clientName: "Maria Garcia",
    clientId: "client-004",
    clientContact: "+1234567003",
    serviceTitle: "Deep House Cleaning - 5 Hours",
    scheduledStartTime: new Date("2025-06-20T10:00:00"),
    scheduledEndTime: new Date("2025-06-20T15:00:00"),
    location: {
      address: "88 Military Cut-off, Baguio City",
      city: "Baguio City",
      country: "Philippines",
      latitude: 16.4150,
      longitude: 120.5950,
      postalCode: "2600",
      state: "Benguet"
    },
    quotedPrice: 125.00,
    paymentReceived: false,
    actions: [], // Ensure all required ProviderOrder fields are present or optional
    extraCharges: [],
    penalties: [],
    completionPhotos: [],
    isActive: true,
    createdAt: new Date("2025-06-15"),
    updatedAt: new Date("2025-06-15")
  },
  {
    id: "prov-req-002",
    order: ORDERS.find(o => o.id === "ord-005")!,
    status: 'PENDING', // CHANGED FROM 'PENDING_ACCEPTANCE'
    clientName: "David Wong",
    clientId: "client-005",
    clientContact: "+1234567004",
    serviceTitle: "Kitchen Sink Installation",
    scheduledStartTime: new Date("2025-06-22T13:00:00"),
    scheduledEndTime: new Date("2025-06-22T15:00:00"),
    location: {
      address: "156 Legarda Road, Baguio City",
      city: "Baguio City",
      country: "Philippines",
      latitude: 16.4110,
      longitude: 120.5930,
      postalCode: "2600",
      state: "Benguet"
    },
    quotedPrice: 145.00,
    paymentReceived: false,
    actions: [],
    extraCharges: [],
    penalties: [],
    completionPhotos: [],
    isActive: true,
    createdAt: new Date("2025-06-16"),
    updatedAt: new Date("2025-06-16")
  }
];