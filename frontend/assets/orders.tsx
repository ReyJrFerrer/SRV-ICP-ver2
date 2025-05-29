import { Order } from './types/order/order';
import { OrderStatus } from './types/order/order-status';
import { OrderSchedule } from './types/order/order-schedule';
import { ServicePayment } from './types/payment/service-payments';
import { ServiceCompletion } from './types/completion/service-completion';
import { Dispute } from './types/dispute/dispute';
import { Rating } from './types/common/rating';
import { PaymentStatus } from './types/payment/payment-details';
import { DisputeStatus } from './types/dispute/dispute-evidence';
import { VerificationStatus } from './types/completion/completion-photo';

export const ORDERS: Order[] = [
    {
        id: "ord-001",
        serviceId: "svc-001",
        clientId: "client-001",
        providerId: "prov-001",
        isActive: true,
        createdAt: new Date("2024-06-10"),
        updatedAt: new Date("2024-06-11"),
        status: 'CONFIRMED' as OrderStatus,
        schedule: {
            startDate: new Date("2024-06-18T09:00:00"),
            endDate: new Date("2024-06-18T13:00:00"),
            actualDuration: 240 // 4 hours in minutes
        } as OrderSchedule,
        location: {
            address: "123 Pine Street, Baguio City",
            coordinates: {
                latitude: 16.4178,
                longitude: 120.5972
            }
        },
        payment: {
            id: "pay-001",
            amount: 100.00,
            currency: "USD",
            status: "PENDING" as PaymentStatus,
            method: "CREDIT_CARD",
            transactionId: "txn-123456",
            createdAt: new Date("2024-06-10"),
            updatedAt: new Date("2024-06-10"),
            advancePaymentPercentage: 20,
            advancePayment: {
                status: "COMPLETED" as PaymentStatus,
                transactionId: "adv-123456"
            },
            remainingPayment: {
                status: "PENDING" as PaymentStatus
            }
        } as ServicePayment,
        completion: {
            photos: [],
            notes: "Not started yet",
            clientVerification: undefined,
            autoCompleted: false
        } as ServiceCompletion
    },
    {
        id: "ord-002",
        serviceId: "svc-002",
        clientId: "client-002",
        providerId: "prov-002",
        isActive: true,
        createdAt: new Date("2024-06-09"),
        updatedAt: new Date("2024-06-09"),
        status: 'IN_PROGRESS' as OrderStatus,
        schedule: {
            startDate: new Date("2024-06-09T14:30:00"),
            endDate: new Date("2024-06-09T16:30:00"),
            actualDuration: 120 // 2 hours in minutes
        } as OrderSchedule,
        location: {
            address: "45 Outlook Drive, Baguio City",
            coordinates: {
                latitude: 16.4261,
                longitude: 120.6200
            }
        },
        payment: {
            id: "pay-002",
            amount: 160.00,
            currency: "USD",
            status: "AUTHORIZED" as PaymentStatus,
            method: "GCASH",
            transactionId: "txn-789012",
            createdAt: new Date("2024-06-09"),
            updatedAt: new Date("2024-06-09"),
            advancePaymentPercentage: 50,
            advancePayment: {
                status: "COMPLETED" as PaymentStatus,
                transactionId: "adv-789012"
            },
            remainingPayment: {
                status: "PENDING" as PaymentStatus
            }
        } as ServicePayment,
        completion: {
            photos: [],
            notes: "Working on replacing leaky pipe",
            autoCompleted: false
        } as ServiceCompletion
    },
    {
        id: "ord-003",
        serviceId: "svc-003",
        clientId: "client-003",
        providerId: "prov-003",
        isActive: true,
        createdAt: new Date("2024-06-01"),
        updatedAt: new Date("2024-06-08"),
        status: 'COMPLETED' as OrderStatus,
        schedule: {
            startDate: new Date("2024-06-07T10:00:00"),
            endDate: new Date("2024-06-07T12:00:00"),
            actualDuration: 130 // Actual duration was 2h 10min
        } as OrderSchedule,
        location: {
            address: "78 Leonard Wood Road, Baguio City",
            coordinates: {
                latitude: 16.4067,
                longitude: 120.5964
            }
        },
        payment: {
            id: "pay-003",
            amount: 120.00,
            currency: "USD",
            status: "COMPLETED" as PaymentStatus,
            method: "CREDIT_CARD",
            transactionId: "txn-345678",
            createdAt: new Date("2024-06-01"),
            updatedAt: new Date("2024-06-07"),
            advancePaymentPercentage: 0, // Cash payment, no advance
            advancePayment: {
                status: "NOT_APPLICABLE" as PaymentStatus
            },
            remainingPayment: {
                status: "COMPLETED" as PaymentStatus,
                transactionId: "txn-345678"
            }
        } as ServicePayment,
        completion: {
            photos: [
                {type: "IMAGE", url: "https://example.com/repair-photo1.jpg"},
                {type: "IMAGE", url: "https://example.com/repair-photo2.jpg"}
            ],
            notes: "Replaced faulty compressor and recharged refrigerant",
            clientVerification: {
                status: "VERIFIED" as VerificationStatus,
                timestamp: new Date("2024-06-07T12:15:00"),
                reason: "Work completed satisfactorily"
            },
            autoCompleted: false
        } as ServiceCompletion,
        rating: {
            score: 5,
            review: "Excellent service! Fixed my refrigerator quickly and professionally.",
            timestamp: new Date("2024-06-08")
        } as Rating
    },
    {
        id: "ord-004",
        serviceId: "svc-001",
        clientId: "client-004",
        providerId: "prov-001",
        isActive: true,
        createdAt: new Date("2024-06-05"),
        updatedAt: new Date("2024-06-06"),
        status: 'CANCELLED' as OrderStatus,
        schedule: {
            startDate: new Date("2024-06-12T13:00:00"),
            endDate: new Date("2024-06-12T17:00:00"),
            actualDuration: 0 // Cancelled, no actual duration
        } as OrderSchedule,
        location: {
            address: "22 Session Road, Baguio City",
            coordinates: {
                latitude: 16.4145,
                longitude: 120.5960
            }
        },
        payment: {
            id: "pay-004",
            amount: 100.00,
            currency: "USD",
            status: "REFUNDED" as PaymentStatus,
            method: "CREDIT_CARD",
            transactionId: "txn-901234",
            createdAt: new Date("2024-06-05"),
            updatedAt: new Date("2024-06-06"),
            advancePaymentPercentage: 25,
            advancePayment: {
                status: "REFUNDED" as PaymentStatus,
                transactionId: "adv-901234"
            },
            remainingPayment: {
                status: "CANCELLED" as PaymentStatus
            }
        } as ServicePayment,
        completion: {
            photos: [],
            notes: "Cancelled by client",
            autoCompleted: false
        } as ServiceCompletion,
        dispute: {
            status: "RESOLVED" as DisputeStatus,
            reason: "Schedule conflict",
            evidence: [
                {
                    type: "TEXT",
                    content: "Need to reschedule due to personal emergency",
                    submittedBy: "client-004",
                    submittedAt: new Date("2024-06-06")
                }
            ],
            resolution: {
                type: "REFUND",
                amount: 100.00,
                currency: "USD",
                resolvedBy: "system",
                resolvedAt: new Date("2024-06-06"),
                notes: "Full refund processed"
            }
        } as Dispute
    }
];
