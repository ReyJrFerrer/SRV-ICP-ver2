import { ProviderOrder, ProviderOrderAction, ExtraCharge, OrderPenalty } from './types/provider/provider-order';
import { Order } from './types/order/order'; // For typing booking.order
import { OrderStatus } from './types/order/order-status';
import { MediaItem } from './types/common/media-item';
import { Location } from './types/common/location';
import { ORDERS } from './orders'; // Assuming ORDERS has at least a few entries

// Helper to create a future date for new bookings
const createFutureDate = (daysToAdd: number, hour: number, minute: number = 0): Date => {
  const date = new Date();
  date.setDate(date.getDate() + daysToAdd);
  date.setHours(hour, minute, 0, 0);
  return date;
};

// Helper to create a past date
const createPastDate = (daysToSubtract: number, hour: number, minute: number = 0): Date => {
  const date = new Date();
  date.setDate(date.getDate() - daysToSubtract);
  date.setHours(hour, minute, 0, 0);
  return date;
};


// Sample provider orders (existing and new)
export const PROVIDER_ORDERS: ProviderOrder[] = [
  // --- Existing Entries (assuming these were already here) ---
  {
    id: "prov-ord-001",
    order: ORDERS.find(o => o.id === "ord-001") || ORDERS[0], // Fallback to ORDERS[0] if not found
    status: 'CONFIRMED' as OrderStatus,
    clientName: "John Smith",
    clientId: "client-001",
    clientContact: "+1234567000",
    serviceTitle: "House Cleaning - 4 Hours",
    scheduledStartTime: createFutureDate(2, 9, 0), // e.g., 2 days from now at 9 AM
    scheduledEndTime: createFutureDate(2, 13, 0), // e.g., 2 days from now at 1 PM
    location: {
      address: "123 Pine Street, Baguio City", city: "Baguio City", country: "Philippines",
      latitude: 16.4178, longitude: 120.5972, postalCode: "2600", state: "Benguet"
    },
    quotedPrice: 100.00,
    paymentReceived: false,
    actions: [{ id: "action-001", type: 'ACCEPTED', timestamp: new Date(), details: "Booking accepted" }],
    extraCharges: [], penalties: [], completionPhotos: [], isActive: true,
    createdAt: new Date(), updatedAt: new Date()
  },
  {
    id: "prov-ord-002",
    order: ORDERS.find(o => o.id === "ord-002") || ORDERS[1],
    status: 'IN_PROGRESS' as OrderStatus,
    clientName: "Alice Johnson",
    clientId: "client-002",
    clientContact: "+1234567001",
    serviceTitle: "Emergency Plumbing - Leaky Pipe",
    scheduledStartTime: new Date(), // Started now
    scheduledEndTime: createFutureDate(0, 2, 0), // Ends in 2 hours
    actualStartTime: new Date(),
    location: {
      address: "45 Outlook Drive, Baguio City", city: "Baguio City", country: "Philippines",
      latitude: 16.4261, longitude: 120.6200, postalCode: "2600", state: "Benguet"
    },
    quotedPrice: 160.00,
    paymentReceived: false,
    actions: [
      { id: "action-002", type: 'ACCEPTED', timestamp: createPastDate(0,1), details: "Booking accepted" },
      { id: "action-003", type: 'STARTED', timestamp: new Date(), details: "Service started" }
    ],
    extraCharges: [], penalties: [], completionPhotos: [], isActive: true,
    createdAt: createPastDate(0,1), updatedAt: new Date()
  },
  {
    id: "prov-ord-003",
    order: ORDERS.find(o => o.id === "ord-003") || ORDERS[2],
    status: 'COMPLETED' as OrderStatus,
    clientName: "Robert Chen",
    clientId: "client-003",
    clientContact: "+1234567002",
    serviceTitle: "Refrigerator Repair",
    scheduledStartTime: createPastDate(2, 10, 0), // Completed 2 days ago
    scheduledEndTime: createPastDate(2, 12, 0),
    actualStartTime: createPastDate(2, 10, 5),
    actualEndTime: createPastDate(2, 12, 15),
    location: {
      address: "78 Leonard Wood Road, Baguio City", city: "Baguio City", country: "Philippines",
      latitude: 16.4067, longitude: 120.5964, postalCode: "2600", state: "Benguet"
    },
    quotedPrice: 120.00, finalPrice: 150.00, priceDifferenceReason: "Additional parts",
    paymentReceived: true, paymentReceivedAmount: 150.00, paymentMethod: "Credit Card",
    actions: [ /* ... actions ... */ ], extraCharges: [ /* ... */ ], penalties: [],
    completionPhotos: [ { type: "IMAGE", url: "/logo.svg", thumbnail: "/logo.svg" } ], // Example image
    completionNotes: "Replaced faulty compressor.", clientRating: 5, clientReview: "Excellent service!",
    isActive: true, createdAt: createPastDate(3,0), updatedAt: createPastDate(2,0)
  },

  // --- New Mock Entries for PROVIDER_ORDERS ---
  {
    id: "prov-ord-004",
    order: ORDERS.find(o => o.id === "ord-004") || ORDERS[3] || ORDERS[0], // Use existing order or fallback
    status: 'CANCELLED' as OrderStatus,
    clientName: "Eliza Cortez",
    clientId: "client-012",
    clientContact: "+639171234570",
    serviceTitle: "Weekend House Cleaning",
    scheduledStartTime: createPastDate(5, 14, 0), // Cancelled 5 days ago
    scheduledEndTime: createPastDate(5, 17, 0),
    location: {
      address: "101 Trancoville, Baguio City", city: "Baguio City", country: "Philippines",
      latitude: 16.4100, longitude: 120.5800, postalCode: "2600", state: "Benguet"
    },
    quotedPrice: 90.00,
    paymentReceived: false,
    actions: [{ id: "action-020", type: 'CANCELLED', timestamp: createPastDate(5,0), details: "Client cancelled" }],
    extraCharges: [], penalties: [], completionPhotos: [], isActive: false, // Usually inactive if cancelled
    createdAt: createPastDate(6,0), updatedAt: createPastDate(5,0)
  },
  {
    id: "prov-ord-005",
    order: ORDERS.find(o => o.id === "ord-001") || ORDERS[0], // Reusing an order for simplicity
    status: 'CONFIRMED' as OrderStatus,
    clientName: "Mark Bautista",
    clientId: "client-013",
    clientContact: "+639229876543",
    serviceTitle: "Deep Cleaning Service",
    scheduledStartTime: createFutureDate(7, 10, 0), // Upcoming next week
    scheduledEndTime: createFutureDate(7, 16, 0),
    location: {
      address: "22B Navy Base, Baguio City", city: "Baguio City", country: "Philippines",
      latitude: 16.3950, longitude: 120.6050, postalCode: "2600", state: "Benguet"
    },
    quotedPrice: 250.00,
    paymentReceived: false,
    actions: [{ id: "action-021", type: 'ACCEPTED', timestamp: new Date(), details: "Booking accepted by provider" }],
    extraCharges: [], penalties: [], completionPhotos: [], isActive: true,
    createdAt: new Date(), updatedAt: new Date()
  },
  {
    id: "prov-ord-006",
    order: ORDERS.find(o => o.id === "ord-002") || ORDERS[1],
    status: 'COMPLETED' as OrderStatus,
    clientName: "Sarah Geronimo",
    clientId: "client-014",
    clientContact: "+639051122334",
    serviceTitle: "Faucet Repair and Sink Check",
    scheduledStartTime: createPastDate(10, 9, 0),
    scheduledEndTime: createPastDate(10, 11, 0),
    actualStartTime: createPastDate(10, 9, 0),
    actualEndTime: createPastDate(10, 10, 45),
    location: {
      address: "Unit 7, The Residences, Camp John Hay", city: "Baguio City", country: "Philippines",
      latitude: 16.3997, longitude: 120.6188, postalCode: "2600", state: "Benguet"
    },
    quotedPrice: 75.00, finalPrice: 75.00,
    paymentReceived: true, paymentReceivedAmount: 75.00, paymentMethod: "GCash",
    actions: [ /* ... actions ... */ ], extraCharges: [], penalties: [],
    completionPhotos: [],
    completionNotes: "Faucet fixed, no leaks found in sink.", clientRating: 4, clientReview: "Good and fast service.",
    isActive: true, createdAt: createPastDate(11,0), updatedAt: createPastDate(10,0)
  }
];

// Sample provider booking requests awaiting acceptance (existing and new)
export const PROVIDER_BOOKING_REQUESTS: ProviderOrder[] = [
  // --- Existing Entries (assuming these were already here, status should be PENDING as per our type fix) ---
  {
    id: "prov-req-001",
    order: ORDERS.find(o => o.id === "ord-004") || ORDERS[3] || ORDERS[0],
    status: 'PENDING' as OrderStatus, // Corrected from 'PENDING_ACCEPTANCE'
    clientName: "Maria Garcia",
    clientId: "client-004",
    clientContact: "+1234567003",
    serviceTitle: "Deep House Cleaning - 5 Hours",
    scheduledStartTime: createFutureDate(3, 10, 0),
    scheduledEndTime: createFutureDate(3, 15, 0),
    location: {
      address: "88 Military Cut-off, Baguio City", city: "Baguio City", country: "Philippines",
      latitude: 16.4150, longitude: 120.5950, postalCode: "2600", state: "Benguet"
    },
    quotedPrice: 125.00, paymentReceived: false, actions: [], extraCharges: [], penalties: [],
    completionPhotos: [], isActive: true, createdAt: new Date(), updatedAt: new Date()
  },
  {
    id: "prov-req-002",
    order: ORDERS.find(o => o.id === "ord-001") || ORDERS[0], // Reusing existing order
    status: 'PENDING' as OrderStatus, // Corrected from 'PENDING_ACCEPTANCE'
    clientName: "David Wong",
    clientId: "client-005",
    clientContact: "+1234567004",
    serviceTitle: "Kitchen Sink Installation",
    scheduledStartTime: createFutureDate(4, 13, 0),
    scheduledEndTime: createFutureDate(4, 15, 0),
    location: {
      address: "156 Legarda Road, Baguio City", city: "Baguio City", country: "Philippines",
      latitude: 16.4110, longitude: 120.5930, postalCode: "2600", state: "Benguet"
    },
    quotedPrice: 145.00, paymentReceived: false, actions: [], extraCharges: [], penalties: [],
    completionPhotos: [], isActive: true, createdAt: new Date(), updatedAt: new Date()
  },

  // --- New Mock Entries for PROVIDER_BOOKING_REQUESTS ---
  {
    id: "prov-req-003",
    order: ORDERS.find(o => o.id === "ord-003") || ORDERS[2] || ORDERS[0],
    status: 'PENDING' as OrderStatus,
    clientName: "Angela Perez",
    clientId: "client-015",
    clientContact: "+639185550101",
    serviceTitle: "Aircon Cleaning (2 units)",
    scheduledStartTime: createFutureDate(1, 14, 0), // Tomorrow 2 PM
    scheduledEndTime: createFutureDate(1, 16, 0),
    location: {
      address: "Upper QM, Baguio City", city: "Baguio City", country: "Philippines",
      latitude: 16.4190, longitude: 120.5990, postalCode: "2600", state: "Benguet"
    },
    quotedPrice: 180.00, paymentReceived: false, actions: [], extraCharges: [], penalties: [],
    completionPhotos: [], isActive: true, createdAt: new Date(), updatedAt: new Date()
  },
  {
    id: "prov-req-004",
    order: ORDERS.find(o => o.id === "ord-002") || ORDERS[1] || ORDERS[0],
    status: 'PENDING' as OrderStatus,
    clientName: "Kevin Tan",
    clientId: "client-016",
    clientContact: "+639067778899",
    serviceTitle: "Garden Weeding and Trim",
    scheduledStartTime: createFutureDate(5, 8, 30), // 5 days from now
    scheduledEndTime: createFutureDate(5, 11, 30),
    location: {
      address: "Outlook Drive Subd, Baguio City", city: "Baguio City", country: "Philippines",
      latitude: 16.4265, longitude: 120.6205, postalCode: "2600", state: "Benguet"
    },
    quotedPrice: 100.00, paymentReceived: false, actions: [], extraCharges: [], penalties: [],
    completionPhotos: [], isActive: true, createdAt: new Date(), updatedAt: new Date()
  }
];