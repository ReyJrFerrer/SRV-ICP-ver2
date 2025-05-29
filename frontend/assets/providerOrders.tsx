import { ProviderOrder } from './types/provider/provider-order';
import { ORDERS } from './orders';

// Sample provider orders
export const PROVIDER_ORDERS: ProviderOrder[] = [
  {
    id: "prov-ord-001",
    order: ORDERS.find(o => o.id === "ord-001")!,
    status: 'CONFIRMED',
    clientName: "John Smith",
    clientId: "client-001",
    clientContact: "+1234567000",
    serviceTitle: "House Cleaning - 4 Hours",
    scheduledStartTime: new Date("2025-06-18T09:00:00"),
    scheduledEndTime: new Date("2025-06-18T13:00:00"),
    location: {
      address: "123 Pine Street, Baguio City",
      coordinates: {
        latitude: 16.4178,
        longitude: 120.5972
      }
    },
    quotedPrice: 100.00,
    paymentReceived: false,
    actions: [
      {
        id: "action-001",
        type: 'ACCEPTED',
        timestamp: new Date("2025-06-11T14:30:00"),
        details: "Booking accepted"
      }
    ],
    extraCharges: [],
    penalties: [],
    completionPhotos: [],
    isActive: true,
    createdAt: new Date("2025-06-10"),
    updatedAt: new Date("2025-06-11")
  },
  {
    id: "prov-ord-002",
    order: ORDERS.find(o => o.id === "ord-002")!,
    status: 'IN_PROGRESS',
    clientName: "Alice Johnson",
    clientId: "client-002",
    clientContact: "+1234567001",
    serviceTitle: "Emergency Plumbing - Leaky Pipe",
    scheduledStartTime: new Date("2025-06-09T14:30:00"),
    scheduledEndTime: new Date("2025-06-09T16:30:00"),
    actualStartTime: new Date("2025-06-09T14:40:00"),
    location: {
      address: "45 Outlook Drive, Baguio City",
      coordinates: {
        latitude: 16.4261,
        longitude: 120.6200
      }
    },
    quotedPrice: 160.00,
    paymentReceived: false,
    actions: [
      {
        id: "action-002",
        type: 'ACCEPTED',
        timestamp: new Date("2025-06-09T12:15:00"),
        details: "Booking accepted"
      },
      {
        id: "action-003",
        type: 'STARTED',
        timestamp: new Date("2025-06-09T14:40:00"),
        details: "Service started"
      },
      {
        id: "action-004",
        type: 'LOCATION_SHARED',
        timestamp: new Date("2025-06-09T14:30:00"),
        location: {
          coordinates: {
            latitude: 16.4250,
            longitude: 120.6190
          }
        }
      }
    ],
    extraCharges: [],
    penalties: [],
    completionPhotos: [],
    isActive: true,
    createdAt: new Date("2025-06-09"),
    updatedAt: new Date("2025-06-09T14:40:00")
  },
  {
    id: "prov-ord-003",
    order: ORDERS.find(o => o.id === "ord-003")!,
    status: 'COMPLETED',
    clientName: "Robert Chen",
    clientId: "client-003",
    clientContact: "+1234567002",
    serviceTitle: "Refrigerator Repair",
    scheduledStartTime: new Date("2025-06-07T10:00:00"),
    scheduledEndTime: new Date("2025-06-07T12:00:00"),
    actualStartTime: new Date("2025-06-07T10:05:00"),
    actualEndTime: new Date("2025-06-07T12:15:00"),
    location: {
      address: "78 Leonard Wood Road, Baguio City",
      coordinates: {
        latitude: 16.4067,
        longitude: 120.5964
      }
    },
    quotedPrice: 120.00,
    finalPrice: 150.00,
    priceDifferenceReason: "Additional parts needed for compressor replacement",
    paymentReceived: true,
    paymentReceivedAmount: 150.00,
    paymentMethod: "Credit Card",
    actions: [
      {
        id: "action-005",
        type: 'ACCEPTED',
        timestamp: new Date("2025-06-01T15:30:00"),
        details: "Booking accepted"
      },
      {
        id: "action-006",
        type: 'STARTED',
        timestamp: new Date("2025-06-07T10:05:00"),
        details: "Service started"
      },
      {
        id: "action-007",
        type: 'EXTRA_REQUESTED',
        timestamp: new Date("2025-06-07T11:00:00"),
        details: "Additional parts needed for compressor replacement - $30"
      },
      {
        id: "action-008",
        type: 'PHOTO_UPLOADED',
        timestamp: new Date("2025-06-07T12:10:00"),
        media: [
          {
            type: "IMAGE",
            url: "https://example.com/repair-photo1.jpg",
            thumbnail: "https://example.com/repair-photo1-thumb.jpg"
          },
          {
            type: "IMAGE",
            url: "https://example.com/repair-photo2.jpg",
            thumbnail: "https://example.com/repair-photo2-thumb.jpg"
          }
        ]
      },
      {
        id: "action-009",
        type: 'COMPLETED',
        timestamp: new Date("2025-06-07T12:15:00"),
        details: "Service completed"
      },
      {
        id: "action-010",
        type: 'PAYMENT_CONFIRMED',
        timestamp: new Date("2025-06-07T12:20:00"),
        details: "Payment of $150 received via Credit Card"
      }
    ],
    extraCharges: [
      {
        id: "extra-001",
        orderId: "ord-003",
        description: "Replacement compressor parts",
        amount: 30.00,
        reason: "Additional parts needed that weren't in the original quote",
        approvedByClient: true,
        approvedAt: new Date("2025-06-07T11:10:00"),
        isActive: true,
        createdAt: new Date("2025-06-07T11:00:00"),
        updatedAt: new Date("2025-06-07T11:10:00")
      }
    ],
    penalties: [],
    completionPhotos: [
      {
        type: "IMAGE",
        url: "https://example.com/repair-photo1.jpg",
        thumbnail: "https://example.com/repair-photo1-thumb.jpg"
      },
      {
        type: "IMAGE",
        url: "https://example.com/repair-photo2.jpg",
        thumbnail: "https://example.com/repair-photo2-thumb.jpg"
      }
    ],
    completionNotes: "Replaced faulty compressor and recharged refrigerant. Unit is now cooling properly and operating at optimal efficiency.",
    clientRating: 5,
    clientReview: "Excellent service! Fixed my refrigerator quickly and professionally.",
    isActive: true,
    createdAt: new Date("2025-06-01"),
    updatedAt: new Date("2025-06-08")
  }
];

// Sample provider booking requests awaiting acceptance
export const PROVIDER_BOOKING_REQUESTS = [
  {
    id: "prov-req-001",
    order: ORDERS.find(o => o.id === "ord-004")!,
    status: 'PENDING_ACCEPTANCE',
    clientName: "Maria Garcia",
    clientId: "client-004",
    clientContact: "+1234567003",
    serviceTitle: "Deep House Cleaning - 5 Hours",
    scheduledStartTime: new Date("2025-06-20T10:00:00"),
    scheduledEndTime: new Date("2025-06-20T15:00:00"),
    location: {
      address: "88 Military Cut-off, Baguio City",
      coordinates: {
        latitude: 16.4150,
        longitude: 120.5950
      }
    },
    quotedPrice: 125.00,
    paymentReceived: false,
    actions: [],
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
    status: 'PENDING_ACCEPTANCE',
    clientName: "David Wong",
    clientId: "client-005",
    clientContact: "+1234567004",
    serviceTitle: "Kitchen Sink Installation",
    scheduledStartTime: new Date("2025-06-22T13:00:00"),
    scheduledEndTime: new Date("2025-06-22T15:00:00"),
    location: {
      address: "156 Legarda Road, Baguio City",
      coordinates: {
        latitude: 16.4110,
        longitude: 120.5930
      }
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