import { Service } from './types/service/service';
import { ServicePrice } from './types/service/service-price';
import { ServiceLocation } from './types/service/service-location';
import { ServiceAvailability } from './types/service/service-availability';
import { ServiceRating } from './types/service/service-rating';
import { MediaItem } from './types/common/media-item';
import { Package } from './types/service/service-package';
import { Terms } from './types/service/service-terms';


export const SERVICES: Service[] = [
    {
        id: "svc-001",
        providerId: "prov-001",
        name: "Mary Gold", 
        title: "House Maid",
        description: "Experienced house maid for cleaning, organizing, and maintaining your home",
        isActive: true,
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
        price: {
            amount: 1250,
            currency: "PHP",
            unit: "/ Hr",
            isNegotiable: true
        } as ServicePrice,
        location: {
            address: "Baguio City - Session Road",
            coordinates: {
                latitude: 16.4145,
                longitude: 120.5960
            },
            serviceRadius: 10,
            serviceRadiusUnit: "km"
        } as ServiceLocation,
        availability: {
            schedule: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            timeSlots: ["08:00-17:00"],
            isAvailableNow: true
        } as ServiceAvailability,
        rating: {
            average: 4.8,
            count: 156
        } as ServiceRating,
        media: [
            {
                type: "IMAGE",
                url: require("../assets/images/CleaningServices-HouseMaid3.jpg"),
                thumbnail: require("../assets/images/CleaningServices-HouseMaid3.jpg")
            }, 
            {
                type: "IMAGE",
                url: require("../assets/images/CleaningServices-HouseMaid2.jpg"),
                thumbnail: require("../assets/images/CleaningServices-HouseMaid2.jpg")
            }, 

        ] as MediaItem[],
        requirements: [
            "Cleaning supplies provided by client",
            "Proper ventilation",
            "Access to water and electricity"
        ],
        isVerified: true,
        slug: "professional-house-maid",
        heroImage: require('../assets/images/CleaningServices-HouseMaid1.jpg'),
        category: {
            id: "cat-001-01",
            name: "Cleaning Services",
            description: "Professional cleaning and housekeeping services",
            slug: "home-cleaning",
            icon: "broom",
            imageUrl: "https://images.pexels.com/photos/cleaning-services.jpg",
            parentId: "cat-001",
            isActive: true,
            createdAt: new Date("2024-01-01"),
            updatedAt: new Date("2024-01-01")
        },
        packages: [
            {
                id: "pkg-001-1",
                name: "Basic Cleaning",
                description: "Standard cleaning service for apartments and small homes",
                price: 5000,
                currency: "PHP",
                duration: "4 hours",
                features: [
                    "Dusting and wiping all surfaces",
                    "Vacuuming and mopping floors",
                    "Bathroom cleaning",
                    "Kitchen cleaning"
                ],
                isActive: true,
                createdAt: new Date("2024-01-01"),
                updatedAt: new Date("2024-01-01")
            },
            {
                id: "pkg-001-2",
                name: "Deep Cleaning",
                description: "Thorough cleaning service for homes that need extra attention",
                price: 9000,
                currency: "PHP",
                duration: "6 hours",
                features: [
                    "All Basic Cleaning services",
                    "Inside cabinet cleaning",
                    "Appliance cleaning",
                    "Window washing",
                    "Baseboards and vent cleaning"
                ],
                isPopular: true,
                isActive: true,
                createdAt: new Date("2024-01-01"),
                updatedAt: new Date("2024-01-01")
            },
            {
                id: "pkg-001-3",
                name: "Move-In/Out Cleaning",
                description: "Complete cleaning service for moving situations",
                price: 12500,
                currency: "PHP",
                duration: "8 hours",
                features: [
                    "All Deep Cleaning services",
                    "Wall washing",
                    "Inside oven and refrigerator cleaning",
                    "Cabinet and drawer detailing",
                    "Light fixture cleaning"
                ],
                isActive: true,
                createdAt: new Date("2024-01-01"),
                updatedAt: new Date("2024-01-01")
            }
        ] ,
        terms: {
            id: "terms-001",
            title: "House Cleaning Service Terms & Conditions",
            content: `
1. SERVICE AGREEMENT
This agreement is between the client and Mary Gold ('Provider') for house cleaning services.

2. SCHEDULING AND CANCELLATION
- Appointments must be scheduled at least 24 hours in advance.
- Cancellations with less than 24 hours notice may incur a 50% cancellation fee.
- Provider reserves the right to reschedule in case of emergencies or illness.

3. CLIENT RESPONSIBILITIES
- Client must provide clear access to areas to be cleaned.
- Client is responsible for securing valuables.
- Client must inform of any special instructions or areas to avoid.

4. PAYMENT TERMS
- Payment is due upon completion of service.
- Additional services requested during appointment will be charged at hourly rate.

5. SATISFACTION GUARANTEE
Provider guarantees client satisfaction. If any area is not properly cleaned, Provider will re-clean the area at no additional charge if notified within 24 hours of service completion.

6. LIABILITY
Provider maintains insurance for damage caused directly by cleaning actions. Pre-existing damage or conditions are not covered.

7. PRIVACY
Provider respects client privacy and will not share client information with third parties.
            `,
            lastUpdated: new Date("2024-01-01"),
            version: "1.0",
            acceptanceRequired: true,
            isActive: true,
            createdAt: new Date("2024-01-01"),
            updatedAt: new Date("2024-01-01")
        } 
    },
    {
        id: "svc-002",
        providerId: "prov-001",
        name: "Mary Gold",
        title: "Emergency Plumbing Service",
        description: "24/7 emergency plumbing repairs and maintenance",
        isActive: false,
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
        price: {
            amount: 4000,
            currency: "PHP",
            unit: "/ Hr",
            isNegotiable: false
        } as ServicePrice,
        location: {
            address: "Baguio City - Mines View Park",
            coordinates: {
                latitude: 16.4245,
                longitude: 120.6314
            },
            serviceRadius: 15,
            serviceRadiusUnit: "km"
        } as ServiceLocation,
        availability: {
            schedule: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
            timeSlots: ["00:00-23:59"],
            isAvailableNow: true
        } as ServiceAvailability,
        rating: {
            average: 4.9,
            count: 203
        } as ServiceRating,
        media: [
            {
                type: "IMAGE",
                url: require("../assets/images/HomeServices-Plumbing3.jpg"),
                thumbnail: require("../assets/images/HomeServices-Plumbing3.jpg")
            }, 
            {
                type: "IMAGE",
                url: require("../assets/images/HomeServices-Plumbing2.jpg"),
                thumbnail: require("../assets/images/HomeServices-Plumbing2.jpg")
            }, 

        ] as MediaItem[],
        requirements: [
            "Description of the problem",
            "Access to water main",
            "Parking space"
        ],
        isVerified: true,
        slug: "emergency-plumbing",
        heroImage: require('../assets/images/HomeServices-Plumbing1.jpg'),
        category: {
            id: "cat-002-01",
            name: "Home Services",
            description: "24/7 emergency plumbing repairs and maintenance",
            slug: "home-services",
            icon: "wrench",
            imageUrl: "/images/Technician3.jpg",
            parentId: "cat-002",
            isActive: true,
            createdAt: new Date("2024-01-01"),
            updatedAt: new Date("2024-01-01")
        },
        packages: [
            {
                id: "pkg-002-1",
                name: "Emergency Call-Out",
                description: "Immediate response for urgent plumbing issues",
                price: 7500,
                currency: "PHP",
                duration: "First hour",
                features: [
                    "24/7 availability",
                    "Rapid response within 1 hour",
                    "Initial diagnosis",
                    "Temporary fixes if needed"
                ],
                isActive: true,
                createdAt: new Date("2024-01-01"),
                updatedAt: new Date("2024-01-01")
            },
            {
                id: "pkg-002-2",
                name: "Standard Repair",
                description: "Complete repair service for common plumbing issues",
                price: 11000,
                currency: "PHP",
                duration: "Up to 3 hours",
                features: [
                    "Leak repairs",
                    "Pipe replacements (up to 3 feet)",
                    "Unclogging drains",
                    "Fixing running toilets",
                    "30-day workmanship guarantee"
                ],
                isPopular: true,
                isActive: true,
                createdAt: new Date("2024-01-01"),
                updatedAt: new Date("2024-01-01")
            },
            {
                id: "pkg-002-3",
                name: "Major Plumbing Overhaul",
                description: "Comprehensive repair for significant plumbing problems",
                price: 22500,
                currency: "PHP",
                duration: "Full day service",
                features: [
                    "Water heater repair/replacement",
                    "Main line repairs",
                    "Sewer line cleaning",
                    "Multiple fixture repairs",
                    "1-year workmanship guarantee"
                ],
                isActive: true,
                createdAt: new Date("2024-01-01"),
                updatedAt: new Date("2024-01-01")
            }
        ],
        terms: {
            id: "terms-002",
            title: "Emergency Plumbing Service Terms & Conditions",
            content: `
1. SERVICE AGREEMENT
This agreement is between the client and Silverstor Eliot ('Provider') for emergency plumbing services.

2. EMERGENCY RESPONSE
- Provider aims to respond to emergency calls within 1 hour, subject to availability and location.
- Additional fee may apply for service calls between 10:00 PM and 6:00 AM.

3. DIAGNOSIS AND QUOTES
- Initial diagnosis fee is included in the emergency call-out package.
- Detailed quotes will be provided before any work commences.
- Client approval is required before proceeding with repairs.

4. PAYMENT TERMS
- Payment for emergency call-out is due immediately upon arrival.
- Payment for repairs is due upon completion of service.
- For major repairs, a 50% deposit may be required before work begins.

5. GUARANTEES AND WARRANTIES
- All workmanship is guaranteed according to the package selected.
- Parts and materials carry manufacturer's warranty.
- Guarantee is void if client or third party tampers with completed work.

6. LIABILITY
- Provider maintains liability insurance for damage directly caused by plumbing work.
- Provider is not responsible for pre-existing conditions or damage caused by plumbing issues before arrival.

7. CANCELLATION
- Emergency call-outs cannot be cancelled once technician is en route.
- Scheduled non-emergency appointments require 4-hour cancellation notice.
            `,
            lastUpdated: new Date("2024-01-01"),
            version: "1.0",
            acceptanceRequired: true,
            isActive: true,
            createdAt: new Date("2024-01-01"),
            updatedAt: new Date("2024-01-01")
        }
    },
    {
        id: "svc-003",
        providerId: "prov-003",
        name: "Juan Del JoJo",
        title: "Appliance Repair Technician",
        description: "Expert repair service for all major household appliances",
        isActive: true,
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
        price: {
            amount: 3000,
            currency: "PHP",
            unit: "/ Hr",
            isNegotiable: true
        } as ServicePrice,
        location: {
            address: "Baguio City - Burnham Park",
            coordinates: {
                latitude: 16.4108,
                longitude: 120.5950
            },
            serviceRadius: 20,
            serviceRadiusUnit: "km"
        } as ServiceLocation,
        availability: {
            schedule: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            timeSlots: ["09:00-18:00"],
            isAvailableNow: true
        } as ServiceAvailability,
        rating: {
            average: 4.7,
            count: 178
        } as ServiceRating,
        media: [
            {
                type: "IMAGE",
                url: require("../assets/images/HomeServices-RepairTechnician3.jpg"),
                thumbnail: require("../assets/images/HomeServices-RepairTechnician3.jpg")
            },
            {
                type: "IMAGE",
                url: require("../assets/images/HomeServices-RepairTechnician2.jpg"),
                thumbnail: require("../assets/images/HomeServices-RepairTechnician2.jpg")
            }
        ] as MediaItem[],
        requirements: [
            "Appliance make and model",
            "Description of the problem",
            "Warranty information if applicable"
        ],
        isVerified: true,
        slug: "appliance-repair",
        heroImage: require('../assets/images/HomeServices-RepairTechnician1.jpg'),
        category: {
            id: "cat-002-02",
            name: "Home Services",
            description: "Expert repair service for all major household appliances",
            slug: "home-services",
            icon: "tools",
            imageUrl: "/images/Technician3.jpg",
            parentId: "cat-002",
            isActive: true,
            createdAt: new Date("2024-01-01"),
            updatedAt: new Date("2024-01-01")
        },
        packages: [
            {
                id: "pkg-003-1",
                name: "Diagnostic Service",
                description: "Professional diagnosis of appliance issues",
                price: 3750,
                currency: "PHP",
                duration: "1 hour",
                features: [
                    "Complete system inspection",
                    "Problem identification",
                    "Repair cost estimate",
                    "Minor adjustments included"
                ],
                isActive: true,
                createdAt: new Date("2024-01-01"),
                updatedAt: new Date("2024-01-01")
            },
            {
                id: "pkg-003-2",
                name: "Standard Repair",
                description: "Common repairs for household appliances",
                price: 7500,
                currency: "PHP",
                duration: "2-3 hours",
                features: [
                    "Parts replacement (parts cost extra)",
                    "System calibration",
                    "Performance testing",
                    "90-day repair warranty"
                ],
                isPopular: true,
                isActive: true,
                createdAt: new Date("2024-01-01"),
                updatedAt: new Date("2024-01-01")
            },
            {
                id: "pkg-003-3",
                name: "Appliance Maintenance",
                description: "Preventative maintenance for appliance longevity",
                price: 6000,
                currency: "PHP",
                duration: "2 hours",
                features: [
                    "Deep cleaning of components",
                    "Lubrication of moving parts",
                    "Safety checks",
                    "Performance optimization",
                    "Maintenance recommendations"
                ],
                isActive: true,
                createdAt: new Date("2024-01-01"),
                updatedAt: new Date("2024-01-01")
            }
        ],
        terms: {
            id: "terms-003",
            title: "Appliance Repair Service Terms & Conditions",
            content: `
1. SERVICE AGREEMENT
This agreement is between the client and Juan Del JoJo ('Provider') for appliance repair services.

2. DIAGNOSIS AND QUOTES
- Diagnosis fee is applied regardless of whether repairs are performed.
- Written estimates will be provided before any repairs are made.
- Client approval is required before proceeding with repairs.

3. PARTS AND MATERIALS
- Parts costs are separate from service fees.
- Used parts will be left with the client unless otherwise specified.
- Provider may use OEM or quality aftermarket parts as appropriate.

4. PAYMENT TERMS
- Payment for diagnostic service is due upon completion.
- Payment for repairs is due upon completion of service.
- For major repairs, a deposit may be required for ordering parts.

5. WARRANTY
- All workmanship is guaranteed for 90 days.
- Parts carry manufacturer's warranty.
- Warranty is void if client or third party tampers with completed work.

6. CANCELLATION POLICY
- Appointments canceled with less than 24 hours notice may incur a fee.
- No charge for reschedules with at least 24 hours notice.

7. LIABILITY
- Provider is not responsible for pre-existing conditions or damage.
- Provider is not liable for unavoidable damage that may occur during necessary repairs.
            `,
            lastUpdated: new Date("2024-01-01"),
            version: "1.0",
            acceptanceRequired: true,
            isActive: true,
            createdAt: new Date("2024-01-01"),
            updatedAt: new Date("2024-01-01")
        }
    },
    {
        id: "svc-004",
        providerId: "prov-004",
        name: "Carlos Rodriguez",
        title: "Auto Mechanic",
        description: "Professional automobile repairs and maintenance with 15 years experience",
        isActive: true,
        createdAt: new Date("2024-01-12"),
        updatedAt: new Date("2024-01-12"),
        price: {
            amount: 2500,
            currency: "PHP",
            unit: "/ Hr",
            isNegotiable: true
        } as ServicePrice,
        location: {
            address: "Baguio City - Military Cut-off Road",
            coordinates: {
                latitude: 16.4023,
                longitude: 120.5960
            },
            serviceRadius: 25,
            serviceRadiusUnit: "km"
        } as ServiceLocation,
        availability: {
            schedule: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            timeSlots: ["08:00-18:00"],
            isAvailableNow: true
        } as ServiceAvailability,
        rating: {
            average: 4.9,
            count: 213
        } as ServiceRating,
        media: [
            {
                type: "IMAGE",
                url: require("../assets/images/Automobile Repairs-AutoMechanic2.jpg"),
                thumbnail: require("../assets/images/Automobile Repairs-AutoMechanic2.jpg")
            },
            {
                type: "IMAGE",
                url: require("../assets/images/Automobile Repairs-AutoMechanic3.jpg"),
                thumbnail: require("../assets/images/Automobile Repairs-AutoMechanic3.jpg")
            }
        ] as MediaItem[],
        requirements: [
            "Vehicle details (make, model, year)",
            "Description of the problem",
            "Vehicle must be brought to the garage unless mobile service requested"
        ],
        isVerified: true,
        slug: "auto-mechanic-services",
        heroImage: require('../assets/images/Automobile Repairs-AutoMechanic2.jpg'),
        category: {
            id: "cat-002",
            name: "Automobile Repairs",
            description: "Professional automobile maintenance and repair services",
            slug: "auto-repairs",
            icon: "car",
            imageUrl: "/images/Technician1.jpg",
            isActive: true,
            createdAt: new Date("2024-01-01"),
            updatedAt: new Date("2024-01-01")
        },
        packages: [
            {
                id: "pkg-004-1",
                name: "Basic Vehicle Service",
                description: "Essential maintenance for your vehicle",
                price: 6000,
                currency: "PHP",
                duration: "1-2 hours",
                features: [
                    "Oil and filter change",
                    "Fluid level check and top-up",
                    "Tire pressure check",
                    "Battery test",
                    "Visual safety inspection"
                ],
                isActive: true,
                createdAt: new Date("2024-01-12"),
                updatedAt: new Date("2024-01-12")
            },
            {
                id: "pkg-004-2",
                name: "Comprehensive Service",
                description: "Complete vehicle maintenance package",
                price: 12500,
                currency: "PHP",
                duration: "3-4 hours",
                features: [
                    "All Basic Service features",
                    "Brake inspection and adjustment",
                    "Engine diagnostic scan",
                    "Air filter replacement",
                    "Spark plug inspection",
                    "Wheel alignment check"
                ],
                isPopular: true,
                isActive: true,
                createdAt: new Date("2024-01-12"),
                updatedAt: new Date("2024-01-12")
            },
            {
                id: "pkg-004-3",
                name: "Major Repair Service",
                description: "Intensive repairs for significant mechanical issues",
                price: 25000,
                currency: "PHP",
                duration: "1-2 days",
                features: [
                    "Engine or transmission repair",
                    "Cooling system service",
                    "Suspension work",
                    "Electrical system diagnosis and repair",
                    "Parts replacement (parts cost extra)",
                    "6-month workmanship warranty"
                ],
                isActive: true,
                createdAt: new Date("2024-01-12"),
                updatedAt: new Date("2024-01-12")
            }
        ],
        terms: {
            id: "terms-004",
            title: "Auto Mechanic Service Terms & Conditions",
            content: `
1. SERVICE AGREEMENT
This agreement is between the client and Carlos Rodriguez ('Provider') for automotive repair services.

2. DIAGNOSIS AND ESTIMATES
- Initial diagnosis service is charged separately.
- Written estimates will be provided before any repairs are made.
- Client approval is required before proceeding with repairs.
- Final costs may vary up to 10% from estimates based on unforeseen issues.

3. PARTS AND MATERIALS
- OEM or quality aftermarket parts may be used as appropriate.
- Replaced parts will be returned to client upon request.
- Parts prices are subject to market conditions and availability.

4. PAYMENT TERMS
- 50% deposit may be required for major repairs or special order parts.
- Balance payment is due upon completion of service and before vehicle release.
- Payment methods accepted: cash, credit/debit cards, and bank transfers.

5. WARRANTY
- All workmanship is guaranteed for 6 months or 10,000 kilometers, whichever comes first.
- Parts carry manufacturer's warranty.
- Warranty is void if vehicle is serviced elsewhere or modifications are made.

6. VEHICLE STORAGE
- Vehicles left over 5 days after service completion may incur storage fees.
- Provider is not responsible for personal items left in the vehicle.

7. LIABILITY
- Provider maintains insurance for damage caused directly by service work.
- Provider is not responsible for pre-existing conditions or normal wear and tear.
            `,
            lastUpdated: new Date("2024-01-12"),
            version: "1.0",
            acceptanceRequired: true,
            isActive: true,
            createdAt: new Date("2024-01-12"),
            updatedAt: new Date("2024-01-12")
        }
    },
    {
        id: "svc-005",
        providerId: "prov-005",
        name: "Michael Chen",
        title: "Smartphone Repair Specialist",
        description: "Expert repairs for all smartphone brands including screen replacement and battery service",
        isActive: true,
        createdAt: new Date("2024-01-15"),
        updatedAt: new Date("2024-01-15"),
        price: {
            amount: 2000,
            currency: "PHP",
            unit: "/ Service",
            isNegotiable: false
        } as ServicePrice,
        location: {
            address: "Baguio City - SM Mall",
            coordinates: {
                latitude: 16.4080,
                longitude: 120.5969
            },
            serviceRadius: 5,
            serviceRadiusUnit: "km"
        } as ServiceLocation,
        availability: {
            schedule: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
            timeSlots: ["10:00-20:00"],
            isAvailableNow: true
        } as ServiceAvailability,
        rating: {
            average: 4.7,
            count: 189
        } as ServiceRating,
        media: [
            {
                type: "IMAGE",
                url: require("../assets/images/GadgetTechnicians-SmartphoneRepair3.jpg"),
                thumbnail: require("../assets/images/GadgetTechnicians-SmartphoneRepair3.jpg")
            },
            {
                type: "IMAGE",
                url: require("../assets/images/GadgetTechnicians-SmartphoneRepair2.jpg"),
                thumbnail: require("../assets/images/GadgetTechnicians-SmartphoneRepair2.jpg")
            }
        ] as MediaItem[],
        requirements: [
            "Phone model details",
            "Description of the issue",
            "Phone passcode (for testing)"
        ],
        isVerified: true,
        slug: "smartphone-repair",
        heroImage: require('../assets/images/GadgetTechnicians-SmartphoneRepair1.jpg'),
        category: {
            id: "cat-003",
            name: "Gadget Technicians",
            description: "Professional repair and support for electronic devices",
            slug: "gadget-tech",
            icon: "laptop",
            imageUrl: "/images/Technician2.jpg",
            isActive: true,
            createdAt: new Date("2024-01-01"),
            updatedAt: new Date("2024-01-01")
        },
        packages: [
            {
                id: "pkg-005-1",
                name: "Screen Replacement",
                description: "Professional screen replacement for smartphones",
                price: 4000,
                currency: "PHP",
                duration: "1-2 hours",
                features: [
                    "OEM or high-quality screen replacement",
                    "Installation and testing",
                    "90-day warranty on parts and labor",
                    "Tempered glass screen protector included"
                ],
                isPopular: true,
                isActive: true,
                createdAt: new Date("2024-01-15"),
                updatedAt: new Date("2024-01-15")
            },
            {
                id: "pkg-005-2",
                name: "Battery Replacement",
                description: "Battery replacement service for better performance and longer life",
                price: 3000,
                currency: "PHP",
                duration: "1 hour",
                features: [
                    "Genuine or high-quality battery",
                    "Safe installation",
                    "Battery calibration",
                    "6-month battery warranty"
                ],
                isActive: true,
                createdAt: new Date("2024-01-15"),
                updatedAt: new Date("2024-01-15")
            },
            {
                id: "pkg-005-3",
                name: "Phone Diagnostic Service",
                description: "Comprehensive diagnosis of smartphone issues",
                price: 2000,
                currency: "PHP",
                duration: "30-45 minutes",
                features: [
                    "Full hardware diagnostics",
                    "Software issue identification",
                    "Repair recommendations",
                    "Cost estimate for necessary repairs",
                    "Fee waived if repairs done with us"
                ],
                isActive: true,
                createdAt: new Date("2024-01-15"),
                updatedAt: new Date("2024-01-15")
            }
        ],
        terms: {
            id: "terms-005",
            title: "Smartphone Repair Service Terms & Conditions",
            content: `
1. SERVICE AGREEMENT
This agreement is between the client and Michael Chen ('Provider') for smartphone repair services.

2. DIAGNOSIS AND QUOTES
- Diagnostic fee is waived if repair is performed by Provider.
- Written cost estimates will be provided before any repairs.
- Client approval is required before proceeding with repairs.

3. PARTS AND MATERIALS
- Provider may use OEM or high-quality aftermarket parts.
- All replaced parts become the property of Provider unless requested otherwise.
- Part availability may affect repair times.

4. REPAIR TIMELINE
- Most repairs are completed within 1-2 hours.
- Complex repairs may require additional time.
- Client will be notified of any delays.

5. DATA PROTECTION
- Provider is not responsible for data loss during repair.
- Client is advised to back up data before service.
- Provider will not access personal data without permission.

6. WARRANTY
- Screen repairs carry a 90-day warranty.
- Battery replacements have a 6-month warranty.
- Water damage repairs are not guaranteed.
- Warranty is void if device is tampered with by client or third parties.

7. PAYMENT TERMS
- Full payment is required upon completion of service.
- Accepted payment methods: cash, cards, and mobile payments.
            `,
            lastUpdated: new Date("2024-01-15"),
            version: "1.0",
            acceptanceRequired: true,
            isActive: true,
            createdAt: new Date("2024-01-15"),
            updatedAt: new Date("2024-01-15")
        }
    },
    {
        id: "svc-006",
        providerId: "prov-006",
        name: "Sarah Johnson",
        title: "Professional Hairstylist",
        description: "Experienced stylist offering haircuts, coloring, and styling for all occasions",
        isActive: true,
        createdAt: new Date("2024-01-20"),
        updatedAt: new Date("2024-01-20"),
        price: {
            amount: 1750,
            currency: "PHP",
            unit: "/ Service",
            isNegotiable: true
        } as ServicePrice,
        location: {
            address: "Baguio City - Leonard Wood Road",
            coordinates: {
                latitude: 16.4118,
                longitude: 120.6000
            },
            serviceRadius: 10,
            serviceRadiusUnit: "km"
        } as ServiceLocation,
        availability: {
            schedule: ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            timeSlots: ["09:00-19:00"],
            isAvailableNow: false
        } as ServiceAvailability,
        rating: {
            average: 4.8,
            count: 167
        } as ServiceRating,
        media: [
            {
                type: "IMAGE",
                url: require("../assets/images/BeautyServices-Hairstylist3.jpg"),
                thumbnail: require("../assets/images/BeautyServices-Hairstylist3.jpg")
            },
            {
                type: "IMAGE",
                url: require("../assets/images/BeautyServices-Hairstylist2.jpg"),
                thumbnail: require("../assets/images/BeautyServices-Hairstylist2.jpg")
            }
        ] as MediaItem[],
        requirements: [
            "Reference images (if any)",
            "Hair history (previous treatments)",
            "Allergies to hair products (if any)"
        ],
        isVerified: true,
        slug: "professional-hairstylist",
        heroImage: require('../assets/images/BeautyServices-Hairstylist1.jpg'),
        category: {
            id: "cat-004",
            name: "Beauty Services",
            description: "Professional beauty and grooming services",
            slug: "beauty-services",
            icon: "cut",
            imageUrl: "/images/maid2.jpg",
            isActive: true,
            createdAt: new Date("2024-01-01"),
            updatedAt: new Date("2024-01-01")
        },
        packages: [
            {
                id: "pkg-006-1",
                name: "Basic Cut & Style",
                description: "Professional haircut and styling service",
                price: 2250,
                currency: "PHP",
                duration: "45 minutes",
                features: [
                    "Consultation",
                    "Shampoo and conditioning",
                    "Precision haircut",
                    "Blow dry and style",
                    "Styling recommendations"
                ],
                isActive: true,
                createdAt: new Date("2024-01-20"),
                updatedAt: new Date("2024-01-20")
            },
            {
                id: "pkg-006-2",
                name: "Color & Style Package",
                description: "Complete hair coloring and styling service",
                price: 6000,
                currency: "PHP",
                duration: "2-3 hours",
                features: [
                    "Color consultation",
                    "Professional hair coloring",
                    "Deep conditioning treatment",
                    "Haircut (optional)",
                    "Blow dry and style",
                    "Aftercare advice"
                ],
                isPopular: true,
                isActive: true,
                createdAt: new Date("2024-01-20"),
                updatedAt: new Date("2024-01-20")
            },
            {
                id: "pkg-006-3",
                name: "Special Occasion Styling",
                description: "Formal and event hair styling",
                price: 4250,
                currency: "PHP",
                duration: "1 hour",
                features: [
                    "Consultation and planning",
                    "Shampoo and prep",
                    "Updo or formal styling",
                    "Long-lasting finish",
                    "Accessories integration (if provided)",
                    "Complimentary touch-up kit"
                ],
                isActive: true,
                createdAt: new Date("2024-01-20"),
                updatedAt: new Date("2024-01-20")
            }
        ],
        terms: {
            id: "terms-006",
            title: "Hairstylist Service Terms & Conditions",
            content: `
1. SERVICE AGREEMENT
This agreement is between the client and Sarah Johnson ('Provider') for hairstyling services.

2. APPOINTMENTS AND CANCELLATIONS
- Appointments must be booked at least 24 hours in advance.
- Cancellations with less than 24 hours notice will incur a 50% fee.
- No-shows will be charged the full service fee.
- Late arrivals may result in shortened service time.

3. CONSULTATIONS
- A brief consultation is included with each service.
- For major changes, a separate consultation appointment is recommended.
- Final results may vary based on hair condition and type.

4. PRICING AND ADDITIONAL CHARGES
- Prices listed are starting prices and may increase based on hair length, thickness, or complexity.
- Additional services requested during appointment will incur extra charges.
- Products used during service are not included for take-home unless specified.

5. SATISFACTION GUARANTEE
- Provider will make reasonable adjustments within 7 days if client is not satisfied.
- Refunds are not provided for completed services.

6. HEALTH AND SAFETY
- Client must disclose any allergies or scalp conditions before service.
- Provider reserves the right to refuse service if signs of contagious conditions are present.

7. PHOTO RELEASE
- Provider may photograph work for portfolio use unless client explicitly opts out.
            `,
            lastUpdated: new Date("2024-01-20"),
            version: "1.0",
            acceptanceRequired: true,
            isActive: true,
            createdAt: new Date("2024-01-20"),
            updatedAt: new Date("2024-01-20")
        }
    },
    {
        id: "svc-007",
        providerId: "prov-007",
        name: "Mark Rivera",
        title: "Express Courier",
        description: "Fast and reliable package delivery and errand services within Baguio City",
        isActive: true,
        createdAt: new Date("2024-01-25"),
        updatedAt: new Date("2024-01-25"),
        price: {
            amount: 750,
            currency: "PHP",
            unit: "/ Delivery",
            isNegotiable: true
        } as ServicePrice,
        location: {
            address: "Baguio City - City Market",
            coordinates: {
                latitude: 16.4130,
                longitude: 120.5960
            },
            serviceRadius: 30,
            serviceRadiusUnit: "km"
        } as ServiceLocation,
        availability: {
            schedule: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            timeSlots: ["08:00-20:00"],
            isAvailableNow: true
        } as ServiceAvailability,
        rating: {
            average: 4.6,
            count: 245
        } as ServiceRating,
        media: [
            {
                type: "IMAGE",
                url: require("../assets/images/Delivery-Courier3.jpg"),
                thumbnail: require("../assets/images/Delivery-Courier3.jpg")
            },
            {
                type: "IMAGE",
                url: require("../assets/images/Delivery-Courier2.jpg"),
                thumbnail: require("../assets/images/Delivery-Courier2.jpg")
            }
        ] as MediaItem[],
        requirements: [
            "Package details (size, weight)",
            "Delivery address",
            "Contact information of recipient"
        ],
        isVerified: true,
        slug: "express-courier",
        heroImage: require('../assets/images/Delivery-Courier1.jpg'),
        category: {
            id: "cat-005",
            name: "Delivery and Errands",
            description: "Professional delivery and errand running services",
            slug: "delivery-errands",
            icon: "shipping-fast",
            imageUrl: "/images/Plumber1.jpg",
            isActive: true,
            createdAt: new Date("2024-01-01"),
            updatedAt: new Date("2024-01-01")
        },
        packages: [
            {
                id: "pkg-007-1",
                name: "Standard Delivery",
                description: "Same-day package delivery within Baguio City",
                price: 750,
                currency: "PHP",
                duration: "2-4 hours",
                features: [
                    "Same-day delivery",
                    "Package tracking",
                    "Confirmation upon delivery",
                    "Packages up to 5kg"
                ],
                isActive: true,
                createdAt: new Date("2024-01-25"),
                updatedAt: new Date("2024-01-25")
            },
            {
                id: "pkg-007-2",
                name: "Express Delivery",
                description: "Rush delivery service for urgent packages",
                price: 1250,
                currency: "PHP",
                duration: "1-2 hours",
                features: [
                    "Priority handling",
                    "Guaranteed delivery within timeframe",
                    "Real-time tracking",
                    "Packages up to 5kg",
                    "Delivery confirmation"
                ],
                isPopular: true,
                isActive: true,
                createdAt: new Date("2024-01-25"),
                updatedAt: new Date("2024-01-25")
            },
            {
                id: "pkg-007-3",
                name: "Errand Service",
                description: "Personal shopping and errand running service",
                price: 1000,
                currency: "PHP",
                duration: "1-3 hours",
                features: [
                    "Grocery shopping",
                    "Prescription pickup",
                    "Bill payments",
                    "Queue service",
                    "Purchase verification"
                ],
                isActive: true,
                createdAt: new Date("2024-01-25"),
                updatedAt: new Date("2024-01-25")
            }
        ],
        terms: {
            id: "terms-007",
            title: "Express Courier Service Terms & Conditions",
            content: `
1. SERVICE AGREEMENT
This agreement is between the client and Mark Rivera ('Provider') for delivery and errand services.

2. DELIVERY TIMEFRAMES
- Standard delivery is guaranteed same-day if ordered before 2:00 PM.
- Express delivery timeframe is counted from confirmation of order.
- Delivery times may be affected by weather, traffic, or other factors beyond control.

3. PACKAGE RESTRICTIONS
- Maximum package weight is 5kg unless otherwise arranged.
- Prohibited items include: illegal goods, dangerous materials, perishables (unless specifically agreed).
- Provider reserves the right to refuse delivery of any package.

4. LIABILITY AND INSURANCE
- Basic insurance covers packages up to $100 in value.
- Additional insurance is available for higher-value items at extra cost.
- Proof of value may be required for claims.

5. PAYMENT TERMS
- Payment is required at time of booking.
- Additional charges may apply for extra weight, distance, or waiting time.
- Accepted payment methods: cash, cards, mobile payments.

6. CANCELLATION POLICY
- Free cancellation if more than 1 hour before scheduled pickup.
- 50% fee for cancellations less than 1 hour before scheduled pickup.
- No refund once courier has picked up package.

7. PROOF OF DELIVERY
- Delivery confirmation will be provided via SMS or app notification.
- Photo proof of delivery available upon request.
            `,
            lastUpdated: new Date("2024-01-25"),
            version: "1.0",
            acceptanceRequired: true,
            isActive: true,
            createdAt: new Date("2024-01-25"),
            updatedAt: new Date("2024-01-25")
        }
    },
    {
        id: "svc-008",
        providerId: "prov-008",
        name: "Emma Santos",
        title: "Wellness Massage Therapist",
        description: "Certified massage therapist specializing in relaxation, deep tissue, and therapeutic massage",
        isActive: true,
        createdAt: new Date("2024-01-30"),
        updatedAt: new Date("2024-01-30"),
        price: {
            amount: 2250,
            currency: "PHP",
            unit: "/ Hr",
            isNegotiable: false
        } as ServicePrice,
        location: {
            address: "Baguio City - Camp John Hay",
            coordinates: {
                latitude: 16.3997,
                longitude: 120.6188
            },
            serviceRadius: 15,
            serviceRadiusUnit: "km"
        } as ServiceLocation,
        availability: {
            schedule: ["Monday", "Wednesday", "Friday", "Saturday", "Sunday"],
            timeSlots: ["10:00-20:00"],
            isAvailableNow: true
        } as ServiceAvailability,
        rating: {
            average: 4.9,
            count: 128
        } as ServiceRating,
        media: [
            {
                type: "IMAGE",
                url: require("../assets/images/Beauty&Wellness-Massage3.jpg"),
                thumbnail: require("../assets/images/Beauty&Wellness-Massage3.jpg")
            },
            {
                type: "IMAGE",
                url: require("../assets/images/Beauty&Wellness-Massage2.jpg"),
                thumbnail: require("../assets/images/Beauty&Wellness-Massage2.jpg")
            }
        ] as MediaItem[],
        requirements: [
            "Health conditions information",
            "Clean and quiet space",
            "Shower before session recommended"
        ],
        isVerified: true,
        slug: "wellness-massage",
        heroImage: require('../assets/images/Beauty&Wellness-Massage1.jpg'),
        category: {
            id: "cat-006",
            name: "Beauty and Wellness",
            description: "Professional wellness and spa services",
            slug: "beauty-wellness",
            icon: "spa",
            imageUrl: "/images/maid3.jpg",
            isActive: true,
            createdAt: new Date("2024-01-01"),
            updatedAt: new Date("2024-01-01")
        },
        packages: [
            {
                id: "pkg-008-1",
                name: "Relaxation Massage",
                description: "Gentle massage focused on relaxation and stress relief",
                price: 3250,
                currency: "PHP",
                duration: "60 minutes",
                features: [
                    "Full body massage",
                    "Aromatherapy options",
                    "Gentle to medium pressure",
                    "Stress and tension relief",
                    "Relaxing atmosphere"
                ],
                isPopular: true,
                isActive: true,
                createdAt: new Date("2024-01-30"),
                updatedAt: new Date("2024-01-30")
            },
            {
                id: "pkg-008-2",
                name: "Deep Tissue Massage",
                description: "Therapeutic massage targeting deep muscle tension",
                price: 4250,
                currency: "PHP",
                duration: "75 minutes",
                features: [
                    "Focused deep pressure technique",
                    "Muscle knot release",
                    "Chronic tension relief",
                    "Posture improvement",
                    "Post-massage stretching recommendations"
                ],
                isActive: true,
                createdAt: new Date("2024-01-30"),
                updatedAt: new Date("2024-01-30")
            },
            {
                id: "pkg-008-3",
                name: "Sports Recovery Massage",
                description: "Specialized massage for athletes and active individuals",
                price: 4500,
                currency: "PHP",
                duration: "90 minutes",
                features: [
                    "Pre and post-workout techniques",
                    "Injury prevention focus",
                    "Muscle recovery enhancement",
                    "Range of motion improvement",
                    "Targeted problem areas",
                    "Hot/cold therapy options"
                ],
                isActive: true,
                createdAt: new Date("2024-01-30"),
                updatedAt: new Date("2024-01-30")
            }
        ],
        terms: {
            id: "terms-008",
            title: "Massage Therapy Service Terms & Conditions",
            content: `
1. SERVICE AGREEMENT
This agreement is between the client and Emma Santos ('Provider') for massage therapy services.

2. HEALTH AND SAFETY
- Client must complete a health intake form before first session.
- Client agrees to disclose all medical conditions and medications.
- Provider reserves the right to refuse service if treatment is contraindicated.
- Client must maintain personal hygiene for all appointments.

3. APPOINTMENTS AND CANCELLATIONS
- 24-hour cancellation notice is required.
- Late cancellations (less than 24 hours) will be charged 50% of service fee.
- No-shows will be charged full service fee.
- Arriving late will result in shortened session time.

4. SESSION CONDUCT
- Professional draping techniques will be used at all times.
- Client may refuse any massage technique or treatment at any time.
- Inappropriate behavior or requests will result in immediate termination of service.
- Communication about pressure and comfort is encouraged throughout session.

5. PAYMENT TERMS
- Payment is due at the time of service.
- Tips are appreciated but not required.
- Package purchases are non-refundable but transferable with approval.

6. CONFIDENTIALITY
- All client information will be kept confidential.
- Treatment notes will be maintained as required by law.

7. COVID-19 PRECAUTIONS
- Enhanced sanitation procedures are in place.
- Masks may be required based on current health guidelines.
- Client agrees to reschedule if experiencing any illness symptoms.
            `,
            lastUpdated: new Date("2024-01-30"),
            version: "1.0",
            acceptanceRequired: true,
            isActive: true,
            createdAt: new Date("2024-01-30"),
            updatedAt: new Date("2024-01-30")
        }
    },
    {
        id: "svc-009",
        providerId: "prov-009",
        name: "David Lee",
        title: "Mathematics Tutor",
        description: "Experienced mathematics tutor for high school and college students",
        isActive: true,
        createdAt: new Date("2024-02-05"),
        updatedAt: new Date("2024-02-05"),
        price: {
            amount: 1500,
            currency: "PHP",
            unit: "/ Hr",
            isNegotiable: true
        } as ServicePrice,
        location: {
            address: "Baguio City - University Belt",
            coordinates: {
                latitude: 16.4098,
                longitude: 120.5960
            },
            serviceRadius: 20,
            serviceRadiusUnit: "km"
        } as ServiceLocation,
        availability: {
            schedule: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            timeSlots: ["14:00-20:00"],
            isAvailableNow: false
        } as ServiceAvailability,
        rating: {
            average: 4.8,
            count: 97
        } as ServiceRating,
        media: [
            {
                type: "IMAGE",
                url: require("../assets/images/Tutoring-MathTutor3.jpg"),
                thumbnail: require("../assets/images/Tutoring-MathTutor3.jpg")
            },
            {
                type: "IMAGE",
                url: require("../assets/images/Tutoring-MathTutor2.jpg"),
                thumbnail: require("../assets/images/Tutoring-MathTutor2.jpg")
            }
        ] as MediaItem[],
        requirements: [
            "Current study materials",
            "List of topics to cover",
            "Previous exam papers (if available)"
        ],
        isVerified: true,
        slug: "math-tutoring",
        heroImage: require('../assets/images/Tutoring-MathTutor1.jpg'),
        category: {
            id: "cat-007",
            name: "Tutoring",
            description: "Professional educational tutoring services",
            slug: "tutoring",
            icon: "chalkboard-teacher",
            imageUrl: "/images/Technician1.jpg",
            isActive: true,
            createdAt: new Date("2024-01-01"),
            updatedAt: new Date("2024-01-01")
        },
        packages: [
            {
                id: "pkg-009-1",
                name: "Homework Help Session",
                description: "One-on-one assistance with math homework and assignments",
                price: 1500,
                currency: "PHP",
                duration: "1 hour",
                features: [
                    "Personalized help with current homework",
                    "Problem-solving techniques",
                    "Conceptual explanations",
                    "Test preparation tips",
                    "Progress tracking"
                ],
                isActive: true,
                createdAt: new Date("2024-02-05"),
                updatedAt: new Date("2024-02-05")
            },
            {
                id: "pkg-009-2",
                name: "Topic-Focused Learning",
                description: "Targeted sessions on specific math topics or concepts",
                price: 2000,
                currency: "PHP",
                duration: "1.5 hours",
                features: [
                    "In-depth focus on challenging topics",
                    "Customized learning materials",
                    "Practice problems and solutions",
                    "Visual learning aids",
                    "Skills assessment"
                ],
                isPopular: true,
                isActive: true,
                createdAt: new Date("2024-02-05"),
                updatedAt: new Date("2024-02-05")
            },
            {
                id: "pkg-009-3",
                name: "Exam Preparation Package",
                description: "Comprehensive preparation for upcoming math exams",
                price: 7500,
                currency: "PHP",
                duration: "5 sessions (1 hour each)",
                features: [
                    "Review of all exam topics",
                    "Practice tests with feedback",
                    "Exam-taking strategies",
                    "Common mistake prevention",
                    "Stress management techniques",
                    "Final review session before exam"
                ],
                isActive: true,
                createdAt: new Date("2024-02-05"),
                updatedAt: new Date("2024-02-05")
            }
        ],
        terms: {
            id: "terms-009",
            title: "Mathematics Tutoring Service Terms & Conditions",
            content: `
1. SERVICE AGREEMENT
This agreement is between the client and David Lee ('Provider') for mathematics tutoring services.

2. SESSION SCHEDULING
- Sessions must be scheduled at least 24 hours in advance.
- Recurring sessions can be arranged at a mutually convenient time.
- Sessions start and end at scheduled times regardless of student's arrival time.

3. CANCELLATION POLICY
- 24-hour cancellation notice is required.
- Late cancellations (less than 24 hours) will be charged 50% of the session fee.
- No-shows will be charged the full session fee.
- Provider may reschedule in case of emergency with as much advance notice as possible.

4. PAYMENT TERMS
- Payment is due at the beginning of each session or in advance for packages.
- Package sessions must be used within 3 months of purchase.
- No refunds for unused package sessions after purchase.

5. STUDENT RESPONSIBILITIES
- Student must come prepared with necessary materials.
- Homework or assignments requiring assistance should be identified in advance.
- Practice problems should be attempted before the session when possible.

6. TUTOR RESPONSIBILITIES
- Provider will prepare tailored materials for each session.
- Progress reports will be provided monthly for regular students.
- Provider will maintain confidentiality of student's academic information.

7. ONLINE SESSIONS
- Technical requirements must be met for online sessions.
- Internet connectivity issues on student's side will not qualify for refunds.
- Screen sharing and digital whiteboard will be used for effective communication.
            `,
            lastUpdated: new Date("2024-02-05"),
            version: "1.0",
            acceptanceRequired: true,
            isActive: true,
            createdAt: new Date("2024-02-05"),
            updatedAt: new Date("2024-02-05")
        }
    },
    {
        id: "svc-010",
        providerId: "prov-010",
        name: "Alexandra Cruz",
        title: "Professional Photographer",
        description: "Experienced photographer for events, portraits, and commercial photography",
        isActive: true,
        createdAt: new Date("2024-02-10"),
        updatedAt: new Date("2024-02-10"),
        price: {
            amount: 3750,
            currency: "PHP",
            unit: "/ Hr",
            isNegotiable: true
        } as ServicePrice,
        location: {
            address: "Baguio City - Wright Park",
            coordinates: {
                latitude: 16.4050,
                longitude: 120.6291
            },
            serviceRadius: 40,
            serviceRadiusUnit: "km"
        } as ServiceLocation,
        availability: {
            schedule: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
            timeSlots: ["09:00-19:00"],
            isAvailableNow: true
        } as ServiceAvailability,
        rating: {
            average: 4.9,
            count: 142
        } as ServiceRating,
        media: [
            {
                type: "IMAGE",
                url: require("../assets/images/Photographer-ProPhotographer3.jpg"),
                thumbnail: require("../assets/images/Photographer-ProPhotographer3.jpg")
            },
            {
                type: "IMAGE",
                url: require("../assets/images/Photographer-ProPhotographer2.jpg"),
                thumbnail: require("../assets/images/Photographer-ProPhotographer2.jpg")
            }
        ] as MediaItem[],
        requirements: [
            "Event details (date, time, location)",
            "Style preferences",
            "Special requests"
        ],
        isVerified: true,
        slug: "professional-photographer",
        heroImage: require('../assets/images/Photographer-ProPhotographer.jpg'),
        category: {
            id: "cat-008",
            name: "Photographer",
            description: "Professional photography services",
            slug: "photographer",
            icon: "camera",
            imageUrl: "/images/Plumber3.jpg",
            isActive: true,
            createdAt: new Date("2024-01-01"),
            updatedAt: new Date("2024-01-01")
        },
        packages: [
            {
                id: "pkg-010-1",
                name: "Portrait Session",
                description: "Professional portrait photography for individuals or small groups",
                price: 7500,
                currency: "PHP",
                duration: "1 hour",
                features: [
                    "1-hour photoshoot at location of choice",
                    "Professional lighting setup",
                    "2 outfit changes",
                    "10 professionally edited digital images",
                    "Online gallery for viewing and downloading"
                ],
                isActive: true,
                createdAt: new Date("2024-02-10"),
                updatedAt: new Date("2024-02-10")
            },
            {
                id: "pkg-010-2",
                name: "Event Photography",
                description: "Comprehensive photography coverage for special events",
                price: 22500,
                currency: "PHP",
                duration: "4 hours",
                features: [
                    "4 hours of continuous event coverage",
                    "Multiple shooting locations within venue",
                    "Candid and group photos",
                    "At least 100 professionally edited images",
                    "Private online gallery",
                    "High-resolution digital downloads"
                ],
                isPopular: true,
                isActive: true,
                createdAt: new Date("2024-02-10"),
                updatedAt: new Date("2024-02-10")
            },
            {
                id: "pkg-010-3",
                name: "Commercial Photography",
                description: "Professional photography for business and commercial use",
                price: 17500,
                currency: "PHP",
                duration: "2 hours",
                features: [
                    "Product or service photography",
                    "Professional lighting and background setup",
                    "Detailed post-processing",
                    "Commercial usage rights",
                    "Quick turnaround (48-72 hours)",
                    "15 high-resolution images"
                ],
                isActive: true,
                createdAt: new Date("2024-02-10"),
                updatedAt: new Date("2024-02-10")
            }
        ],
        terms: {
            id: "terms-010",
            title: "Photography Service Terms & Conditions",
            content: `
1. SERVICE AGREEMENT
This agreement is between the client and Alexandra Cruz ('Provider') for professional photography services.

2. BOOKING AND PAYMENT
- A 50% non-refundable deposit is required to secure a booking date.
- Final payment is due on or before the day of service.
- For events, full payment is required 7 days before the event date.

3. COPYRIGHT AND USAGE
- Provider retains copyright of all images produced.
- Commercial package includes commercial usage rights as specified.
- Images may not be edited, filtered, or altered by client without permission.
- Provider may use images for portfolio, advertising, or contest entries unless client opts out in writing.

4. IMAGE DELIVERY
- Preview images will be available within 1 week of session date.
- Final edited images will be delivered within 2-3 weeks.
- Rush delivery (72 hours) available for additional fee.
- Images are delivered via online gallery unless otherwise arranged.

5. CANCELLATION POLICY
- Cancellations with more than 14 days notice: deposit may be transferred to new date.
- Cancellations with 7-14 days notice: deposit is forfeited.
- Cancellations with less than 7 days notice: client is responsible for full payment.
- Weather-related rescheduling is at Provider's discretion with no additional fee.

6. CREATIVE LICENSE
- Provider will use professional judgment for lighting, poses, and locations.
- Provider will make every effort to accommodate specific requests but cannot guarantee specific shots.

7. LIABILITY
- Provider is not responsible for uncooperative subjects or missed photo opportunities.
- Client is responsible for securing permission to use private property for photo sessions.
            `,
            lastUpdated: new Date("2024-02-10"),
            version: "1.0",
            acceptanceRequired: true,
            isActive: true,
            createdAt: new Date("2024-02-10"),
            updatedAt: new Date("2024-02-10")
        }
    },
    {
        id: "svc-011",
        providerId: "prov-011",
        name: "James Wilson",
        title: "Computer Repair Specialist",
        description: "Expert computer repair, virus removal, and system optimization services",
        isActive: true,
        createdAt: new Date("2024-02-15"),
        updatedAt: new Date("2024-02-15"),
        price: {
            amount: 2250,
            currency: "PHP",
            unit: "/ Hr",
            isNegotiable: false
        } as ServicePrice,
        location: {
            address: "Baguio City - Outlook Drive",
            coordinates: {
                latitude: 16.4177,
                longitude: 120.6199
            },
            serviceRadius: 15,
            serviceRadiusUnit: "km"
        } as ServiceLocation,
        availability: {
            schedule: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            timeSlots: ["09:00-17:00"],
            isAvailableNow: true
        } as ServiceAvailability,
        rating: {
            average: 4.7,
            count: 118
        } as ServiceRating,
        media: [
            {
                type: "IMAGE",
                url: require("../assets/images/GadgetTechnicians-ComputerRepair3.jpg"),
                thumbnail: require("../assets/images/GadgetTechnicians-ComputerRepair3.jpg")
            },
            {
                type: "IMAGE",
                url: require("../assets/images/GadgetTechnicians-ComputerRepair2.jpg"),
                thumbnail: require("../assets/images/GadgetTechnicians-ComputerRepair2.jpg")
            }
        ] as MediaItem[],
        requirements: [
            "Computer specifications",
            "Description of the issue",
            "Software/data backup status"
        ],
        isVerified: true,
        slug: "computer-repair",
        heroImage: require('../assets/images/GadgetTechnicians-ComputerRepair1.jpg'),
        category: {
            id: "cat-003",
            name: "Gadget Technicians",
            description: "Professional repair and support for electronic devices",
            slug: "gadget-tech",
            icon: "laptop",
            imageUrl: "/images/Technician3.jpg",
            isActive: true,
            createdAt: new Date("2024-01-01"),
            updatedAt: new Date("2024-01-01")
        },
        packages: [
            {
                id: "pkg-011-1",
                name: "Computer Diagnostic",
                description: "Complete system inspection and issue diagnosis",
                price: 2750,
                currency: "PHP",
                duration: "1 hour",
                features: [
                    "Hardware diagnostics",
                    "Software diagnostics",
                    "Performance assessment",
                    "Issue identification",
                    "Repair recommendations and cost estimate"
                ],
                isActive: true,
                createdAt: new Date("2024-02-15"),
                updatedAt: new Date("2024-02-15")
            },
            {
                id: "pkg-011-2",
                name: "System Optimization",
                description: "Comprehensive tune-up to improve computer performance",
                price: 4750,
                currency: "PHP",
                duration: "2 hours",
                features: [
                    "Disk cleanup and optimization",
                    "Software updates and patches",
                    "Startup optimization",
                    "Memory management",
                    "System cooling check",
                    "Performance benchmarking"
                ],
                isPopular: true,
                isActive: true,
                createdAt: new Date("2024-02-15"),
                updatedAt: new Date("2024-02-15")
            },
            {
                id: "pkg-011-3",
                name: "Virus Removal & Security",
                description: "Complete malware removal and security enhancement",
                price: 6000,
                currency: "PHP",
                duration: "2-3 hours",
                features: [
                    "Comprehensive virus/malware scan and removal",
                    "Security software installation",
                    "Browser security setup",
                    "Safe browsing education",
                    "Data recovery (if possible)",
                    "30-day security guarantee"
                ],
                isActive: true,
                createdAt: new Date("2024-02-15"),
                updatedAt: new Date("2024-02-15")
            }
        ],
        terms: {
            id: "terms-011",
            title: "Computer Repair Service Terms & Conditions",
            content: `
1. SERVICE AGREEMENT
This agreement is between the client and James Wilson ('Provider') for computer repair services.

2. DIAGNOSIS AND ESTIMATES
- Diagnostic fee will be charged regardless of whether repairs are performed.
- Written cost estimates will be provided before any repairs.
- Client approval is required before proceeding with additional work.

3. DATA PROTECTION
- Provider is not responsible for data loss during repair.
- Client is strongly advised to back up all data before service.
- Data recovery services are not guaranteed and results may vary.

4. PARTS AND MATERIALS
- Parts costs are separate from service fees.
- Provider may use OEM or quality aftermarket parts as appropriate.
- Replaced parts will be returned to client upon request.

5. WARRANTY
- Labor is guaranteed for 30 days from service date.
- Parts carry manufacturer's warranty only.
- Warranty is void if client or third party tampers with completed work.

6. PAYMENT TERMS
- Payment for diagnostic services is due upon completion.
- Payment for all other services is due upon completion of work.
- Provider accepts cash, credit cards, and mobile payment methods.

7. PRIVACY AND CONFIDENTIALITY
- Provider will not access personal files except when necessary for repair.
- All client information will be kept confidential.
            `,
            lastUpdated: new Date("2024-02-15"),
            version: "1.0",
            acceptanceRequired: true,
            isActive: true,
            createdAt: new Date("2024-02-15"),
            updatedAt: new Date("2024-02-15")
        }
    },
    {
        id: "svc-012",
        providerId: "prov-012",
        name: "Sofia Garcia",
        title: "Nail Technician",
        description: "Professional manicure, pedicure, and nail art services",
        isActive: true,
        createdAt: new Date("2024-02-20"),
        updatedAt: new Date("2024-02-20"),
        price: {
            amount: 1250,
            currency: "PHP",
            unit: "/ Service",
            isNegotiable: false
        } as ServicePrice,
        location: {
            address: "Baguio City - Legarda Road",
            coordinates: {
                latitude: 16.4123,
                longitude: 120.5964
            },
            serviceRadius: 10,
            serviceRadiusUnit: "km"
        } as ServiceLocation,
        availability: {
            schedule: ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
            timeSlots: ["10:00-19:00"],
            isAvailableNow: false
        } as ServiceAvailability,
        rating: {
            average: 4.8,
            count: 165
        } as ServiceRating,
        media: [
            {
                type: "IMAGE",
                url: require("../assets/images/Beauty&Wellness-NailTechnician3.jpg"),
                thumbnail: require("../assets/images/Beauty&Wellness-NailTechnician3.jpg")
            },
            {
                type: "IMAGE",
                url: require("../assets/images/Beauty&Wellness-NailTechnician2.jpg"),
                thumbnail: require("../assets/images/Beauty&Wellness-NailTechnician2.jpg")
            }
        ] as MediaItem[],
        requirements: [
            "Reference images (if any)",
            "Current nail condition",
            "Any allergies to nail products"
        ],
        isVerified: true,
        slug: "nail-tech",
        heroImage: require('../assets/images/Beauty&Wellness-NailTechnician1.jpg'),
        category: {
            id: "cat-006",
            name: "Beauty and Wellness",
            description: "Professional wellness and spa services",
            slug: "beauty-wellness",
            icon: "spa",
            imageUrl: "/images/maid1.jpg",
            isActive: true,
            createdAt: new Date("2024-01-01"),
            updatedAt: new Date("2024-01-01")
        },
        packages: [
            {
                id: "pkg-012-1",
                name: "Basic Manicure",
                description: "Essential nail care and polish for beautiful hands",
                price: 1500,
                currency: "PHP",
                duration: "45 minutes",
                features: [
                    "Nail shaping",
                    "Cuticle treatment",
                    "Hand massage",
                    "Regular polish application",
                    "Quick-dry top coat"
                ],
                isActive: true,
                createdAt: new Date("2024-02-20"),
                updatedAt: new Date("2024-02-20")
            },
            {
                id: "pkg-012-2",
                name: "Deluxe Pedicure",
                description: "Comprehensive foot care and polish treatment",
                price: 2250,
                currency: "PHP",
                duration: "60 minutes",
                features: [
                    "Foot soak in aromatic bath",
                    "Callus removal",
                    "Nail shaping and cuticle care",
                    "Sugar scrub exfoliation",
                    "Foot and calf massage",
                    "Polish application"
                ],
                isPopular: true,
                isActive: true,
                createdAt: new Date("2024-02-20"),
                updatedAt: new Date("2024-02-20")
            },
            {
                id: "pkg-012-3",
                name: "Nail Art Special",
                description: "Custom nail art and design service",
                price: 2500,
                currency: "PHP",
                duration: "75 minutes",
                features: [
                    "Basic manicure preparation",
                    "Custom nail art on up to 10 nails",
                    "Specialty polishes and embellishments",
                    "Gel top coat for longevity",
                    "Nail care recommendations",
                    "Complimentary touch-up within 5 days"
                ],
                isActive: true,
                createdAt: new Date("2024-02-20"),
                updatedAt: new Date("2024-02-20")
            }
        ],
        terms: {
            id: "terms-012",
            title: "Nail Technician Service Terms & Conditions",
            content: `
1. SERVICE AGREEMENT
This agreement is between the client and Sofia Garcia ('Provider') for nail care services.

2. APPOINTMENTS AND CANCELLATIONS
- Appointments must be scheduled at least 24 hours in advance.
- Cancellations with less than 24 hours notice will incur a 50% fee.
- No-shows will be charged the full service fee.
- Please arrive 5-10 minutes early to prepare for your service.

3. HEALTH AND SAFETY
- Client must disclose any skin conditions, infections, or allergies before service.
- Provider reserves the right to refuse service for health and safety reasons.
- All tools are properly sanitized between clients following industry standards.
- Clients with contagious conditions will be rescheduled without penalty.

4. SERVICE GUARANTEES
- Provider guarantees polish will remain chip-free for 3 days (regular polish) or 7 days (gel).
- Free fixes are available within 48 hours of service for any issues.
- No refunds will be provided after services are completed.

5. PAYMENT TERMS
- Payment is due upon completion of service.
- We accept cash, credit cards, and mobile payment methods.
- Tips are appreciated but never expected.

6. SERVICE TIMELINESS
- Appointment durations are estimates and may vary based on nail condition and services requested.
- Late arrivals may result in shortened service time to avoid impacting other appointments.

7. CHILDREN AND GUESTS
- Children must be supervised at all times.
- Please limit additional guests to ensure comfortable service environment.
            `,
            lastUpdated: new Date("2024-02-20"),
            version: "1.0",
            acceptanceRequired: true,
            isActive: true,
            createdAt: new Date("2024-02-20"),
            updatedAt: new Date("2024-02-20")
        }
    },
    {
        id: "svc-013",
        providerId: "prov-013",
        name: "Lucas Reyes",
        title: "Language Tutor",
        description: "Spanish and English language tutor for all levels and ages",
        isActive: true,
        createdAt: new Date("2024-02-25"),
        updatedAt: new Date("2024-02-25"),
        price: {
            amount: 1400,
            currency: "PHP",
            unit: "/ Hr",
            isNegotiable: true
        } as ServicePrice,
        location: {
            address: "Baguio City - Teachers Camp",
            coordinates: {
                latitude: 16.4227,
                longitude: 120.6117
            },
            serviceRadius: 25,
            serviceRadiusUnit: "km"
        } as ServiceLocation,
        availability: {
            schedule: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            timeSlots: ["10:00-18:00"],
            isAvailableNow: true
        } as ServiceAvailability,
        rating: {
            average: 4.9,
            count: 87
        } as ServiceRating,
        media: [
            {
                type: "IMAGE",
                url: require("../assets/images/Tutoring-LanguageTutor3.jpg"),
                thumbnail: require("../assets/images/Tutoring-LanguageTutor3.jpg")
            },
            {
                type: "IMAGE",
                url: require("../assets/images/Tutoring-LanguageTutor2.jpg"),
                thumbnail: require("../assets/images/Tutoring-LanguageTutor2.jpg")
            }
        ] as MediaItem[],
        requirements: [
            "Current language level",
            "Learning goals",
            "Preferred learning style"
        ],
        isVerified: true,
        slug: "language-tutor",
        heroImage: require('../assets/images/Tutoring-LanguageTutor1.jpg'),
        category: {
            id: "cat-007",
            name: "Tutoring",
            description: "Professional educational tutoring services",
            slug: "tutoring",
            icon: "chalkboard-teacher",
            imageUrl: "/images/Technician2.jpg",
            isActive: true,
            createdAt: new Date("2024-01-01"),
            updatedAt: new Date("2024-01-01")
        },
        packages: [
            {
                id: "pkg-013-1",
                name: "Conversation Practice",
                description: "Focused language conversation sessions for improved fluency",
                price: 1750,
                currency: "PHP",
                duration: "1 hour",
                features: [
                    "Real-world conversation scenarios",
                    "Pronunciation correction",
                    "Vocabulary expansion",
                    "Cultural context discussions",
                    "Confidence building"
                ],
                isActive: true,
                createdAt: new Date("2024-02-25"),
                updatedAt: new Date("2024-02-25")
            },
            {
                id: "pkg-013-2",
                name: "Comprehensive Language Course",
                description: "Structured language learning program for steady progress",
                price: 12500,
                currency: "PHP",
                duration: "10 sessions (1 hour each)",
                features: [
                    "Personalized curriculum",
                    "Grammar and vocabulary focus",
                    "Speaking, reading, writing, and listening practice",
                    "Weekly homework assignments",
                    "Progress assessments",
                    "Learning materials included"
                ],
                isPopular: true,
                isActive: true,
                createdAt: new Date("2024-02-25"),
                updatedAt: new Date("2024-02-25")
            },
            {
                id: "pkg-013-3",
                name: "Travel Preparation",
                description: "Quick language preparation for upcoming travel",
                price: 6000,
                currency: "PHP",
                duration: "4 sessions (1 hour each)",
                features: [
                    "Essential travel phrases",
                    "Emergency vocabulary",
                    "Cultural etiquette guidance",
                    "Restaurant and shopping terminology",
                    "Navigation and transportation vocabulary",
                    "Digital phrase book for your trip"
                ],
                isActive: true,
                createdAt: new Date("2024-02-25"),
                updatedAt: new Date("2024-02-25")
            }
        ],
        terms: {
            id: "terms-013",
            title: "Language Tutoring Service Terms & Conditions",
            content: `
1. SERVICE AGREEMENT
This agreement is between the client and Lucas Reyes ('Provider') for language tutoring services.

2. TUTORING SESSIONS
- Sessions are scheduled for the agreed duration.
- Materials may be provided by the Provider or requested from the client.
- Sessions will be conducted in the target language and English as appropriate for level.
- Remote sessions are available via approved video conferencing platforms.

3. SCHEDULING AND CANCELLATION
- Sessions must be scheduled at least 24 hours in advance.
- Cancellations with less than 24 hours notice will incur a 50% fee.
- No-shows will be charged the full session fee.
- Package sessions must be used within 4 months of purchase.

4. PAYMENT TERMS
- Payment for single sessions is due at the time of booking.
- Package payments are due in full at time of purchase.
- Payment plans may be arranged for certain packages upon request.
- No refunds for unused sessions in a package.

5. PROGRESS AND EXPECTATIONS
- Provider cannot guarantee specific language proficiency within a set timeframe.
- Progress depends on client's study habits, practice, and natural aptitude.
- Regular participation and homework completion are essential for progress.
- Provider will offer honest assessment of progress and recommendations.

6. MATERIALS AND COPYRIGHT
- Any materials provided by the Provider are for client's personal use only.
- Materials may not be shared, copied, or distributed without permission.
- Client is responsible for purchasing required textbooks if specified.

7. COMMUNICATION
- Between-session questions are welcomed but should be reasonable in frequency.
- Provider will respond to messages within 24 business hours.
- Extended tutoring outside of sessions may incur additional charges.
            `,
            lastUpdated: new Date("2024-02-25"),
            version: "1.0",
            acceptanceRequired: true,
            isActive: true,
            createdAt: new Date("2024-02-25"),
            updatedAt: new Date("2024-02-25")
        }
    }
];
