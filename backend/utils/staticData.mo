import Principal "mo:base/Principal";
import Time "mo:base/Time";
import Types "../types/shared";

module {
    public type Profile = Types.Profile;
    public type Service = Types.Service;
    public type ServiceCategory = Types.ServiceCategory;
    public type Booking = Types.Booking;
    public type Review = Types.Review;
    public type Location = Types.Location;
    public type Evidence = Types.Evidence;

    // Static Categories
    public let STATIC_CATEGORIES : [(Text, ServiceCategory)] = [
        ("cat-001", {
            id = "cat-001";
            name = "Home Services";
            description = "Professional home maintenance and improvement services";
            parentId = null;
            slug = "home-services";
            imageUrl = "https://res.cloudinary.com/demo/image/upload/v1/samples/landscapes/home-services.jpg";
        }),
        ("cat-002", {
            id = "cat-002";
            name = "Cleaning Services";
            description = "Professional cleaning and housekeeping services";
            parentId = ?("cat-001");
            slug = "cleaning-services";
            imageUrl = "https://res.cloudinary.com/demo/image/upload/v1/samples/landscapes/cleaning-services.jpg";
        }),
        ("cat-003", {
            id = "cat-003";
            name = "Automobile Repairs";
            description = "Professional automobile maintenance and repair services";
            parentId = null;
            slug = "automobile-repairs";
            imageUrl = "https://res.cloudinary.com/demo/image/upload/v1/samples/landscapes/auto-repair.jpg";
        }),
        ("cat-004", {
            id = "cat-004";
            name = "Gadget Technicians";
            description = "Professional repair and support for electronic devices";
            parentId = null;
            slug = "gadget-technicians";
            imageUrl = "https://res.cloudinary.com/demo/image/upload/v1/samples/landscapes/gadget-repair.jpg";
        }),
        ("cat-005", {
            id = "cat-005";
            name = "Beauty & Wellness";
            description = "Professional beauty and wellness services";
            parentId = null;
            slug = "beauty-wellness";
            imageUrl = "https://res.cloudinary.com/demo/image/upload/v1/samples/landscapes/beauty-wellness.jpg";
        })
    ];

    // Default Location (Baguio City, Philippines)
    public let DEFAULT_LOCATION : Location = {
        latitude = 16.4145;
        longitude = 120.5960;
        address = "Session Road, Baguio City";
        city = "Baguio City";
        state = "Benguet";
        country = "Philippines";
        postalCode = "2600";
    };

    // Static User Profiles - using static principal creation functions
    public func getStaticProfiles() : [(Principal, Profile)] {
        let client1 = Principal.fromText("ryjl3-tyaaa-aaaaa-aaaba-cai");
        let client2 = Principal.fromText("rdmx6-jaaaa-aaaah-qcaiq-cai");
        let provider1 = Principal.fromText("rrkah-fqaaa-aaaaa-aaaaq-cai");
        let provider2 = Principal.fromText("rno2w-sqaaa-aaaah-qcaja-cai");

        [
            (client1, {
                id = client1;
                name = "John Doe";
                email = "john.doe@example.com";
                phone = "+63-917-123-4567";
                role = #Client;
                createdAt = 1730000000000000000; // Fixed timestamp
                updatedAt = 1730000000000000000;
                isVerified = true;
            }),
            (client2, {
                id = client2;
                name = "Maria Santos";
                email = "maria.santos@example.com";
                phone = "+63-917-234-5678";
                role = #Client;
                createdAt = 1730086400000000000; // Fixed timestamp
                updatedAt = 1730086400000000000;
                isVerified = true;
            }),
            (provider1, {
                id = provider1;
                name = "Mike Johnson";
                email = "mike.johnson@example.com";
                phone = "+63-917-345-6789";
                role = #ServiceProvider;
                createdAt = 1730172800000000000; // Fixed timestamp
                updatedAt = 1730172800000000000;
                isVerified = true;
            }),
            (provider2, {
                id = provider2;
                name = "Anna Reyes";
                email = "anna.reyes@example.com";
                phone = "+63-917-456-7890";
                role = #ServiceProvider;
                createdAt = 1730259200000000000; // Fixed timestamp
                updatedAt = 1730259200000000000;
                isVerified = true;
            })
        ]
    };

    // Static Services
    public func getStaticServices() : [(Text, Service)] {
        let provider1 = Principal.fromText("rrkah-fqaaa-aaaaa-aaaaq-cai");
        let provider2 = Principal.fromText("rno2w-sqaaa-aaaah-qcaja-cai");
        
        [
            ("svc-001", {
                id = "svc-001";
                providerId = provider1;
                title = "Professional Home Cleaning";
                description = "Experienced house cleaning for your home. We provide thorough cleaning, organizing, and maintaining your living space with professional equipment and eco-friendly products.";
                category = STATIC_CATEGORIES[1].1;
                price = 5000; // 50.00 in centavos
                location = DEFAULT_LOCATION;
                status = #Available;
                createdAt = 1730000000000000000;
                updatedAt = 1730000000000000000;
                rating = ?4.8;
                reviewCount = 156;
            }),
            ("svc-002", {
                id = "svc-002";
                providerId = provider1;
                title = "Car Maintenance Service";
                description = "Complete car maintenance and repair services. We handle everything from oil changes to major repairs, brake services, and engine diagnostics with certified technicians.";
                category = STATIC_CATEGORIES[2].1;
                price = 8000; // 80.00 in centavos
                location = DEFAULT_LOCATION;
                status = #Available;
                createdAt = 1730086400000000000;
                updatedAt = 1730086400000000000;
                rating = ?4.9;
                reviewCount = 213;
            }),
            ("svc-003", {
                id = "svc-003";
                providerId = provider2;
                title = "Computer & Laptop Repair";
                description = "Expert computer and laptop repair services. We fix hardware issues, software problems, virus removal, data recovery, and performance optimization for all brands.";
                category = STATIC_CATEGORIES[3].1;
                price = 3500; // 35.00 in centavos
                location = DEFAULT_LOCATION;
                status = #Available;
                createdAt = 1730172800000000000;
                updatedAt = 1730172800000000000;
                rating = ?4.5;
                reviewCount = 89;
            }),
            ("svc-004", {
                id = "svc-004";
                providerId = provider2;
                title = "Mobile Phone Repair";
                description = "Professional mobile phone repair services. Screen replacement, battery replacement, charging port repair, and software troubleshooting for all smartphone brands.";
                category = STATIC_CATEGORIES[3].1;
                price = 2500; // 25.00 in centavos
                location = DEFAULT_LOCATION;
                status = #Available;
                createdAt = 1730259200000000000;
                updatedAt = 1730259200000000000;
                rating = ?4.7;
                reviewCount = 124;
            }),
            ("svc-005", {
                id = "svc-005";
                providerId = provider1;
                title = "Hair Styling & Cut";
                description = "Professional hair styling and cutting services. From classic cuts to modern styles, hair coloring, and special occasion styling by experienced hairstylists.";
                category = STATIC_CATEGORIES[4].1;
                price = 1500; // 15.00 in centavos
                location = DEFAULT_LOCATION;
                status = #Available;
                createdAt = 1730345600000000000;
                updatedAt = 1730345600000000000;
                rating = ?4.6;
                reviewCount = 67;
            })
        ]
    };

    // Static Bookings
    public func getStaticBookings() : [(Text, Booking)] {
        let client1 = Principal.fromText("ryjl3-tyaaa-aaaaa-aaaba-cai");
        let client2 = Principal.fromText("rdmx6-jaaaa-aaaah-qcaiq-cai");
        let provider1 = Principal.fromText("rrkah-fqaaa-aaaaa-aaaaq-cai");
        let provider2 = Principal.fromText("rno2w-sqaaa-aaaah-qcaja-cai");
        
        [
            ("bk-001", {
                id = "bk-001";
                clientId = client1;
                providerId = provider1;
                serviceId = "svc-001";
                status = #Completed;
                requestedDate = 1730000000000000000;
                scheduledDate = ?1730086400000000000;
                completedDate = ?1730172800000000000;
                price = 5000;
                location = DEFAULT_LOCATION;
                evidence = ?{
                    id = "ev-001";
                    bookingId = "bk-001";
                    submitterId = provider1;
                    description = "Before and after photos of cleaning service";
                    fileUrls = ["https://example.com/evidence/bk-001-before.jpg", "https://example.com/evidence/bk-001-after.jpg"];
                    qualityScore = ?0.9;
                    createdAt = 1730172800000000000;
                };
                createdAt = 1730000000000000000;
                updatedAt = 1730172800000000000;
            }),
            ("bk-002", {
                id = "bk-002";
                clientId = client1;
                providerId = provider1;
                serviceId = "svc-002";
                status = #Completed;
                requestedDate = 1730259200000000000;
                scheduledDate = ?1730345600000000000;
                completedDate = ?1730432000000000000;
                price = 8000;
                location = DEFAULT_LOCATION;
                evidence = ?{
                    id = "ev-002";
                    bookingId = "bk-002";
                    submitterId = provider1;
                    description = "Car maintenance completion report and photos";
                    fileUrls = ["https://example.com/evidence/bk-002-report.pdf", "https://example.com/evidence/bk-002-photo.jpg"];
                    qualityScore = ?0.95;
                    createdAt = 1730432000000000000;
                };
                createdAt = 1730259200000000000;
                updatedAt = 1730432000000000000;
            }),
            ("bk-003", {
                id = "bk-003";
                clientId = client2;
                providerId = provider2;
                serviceId = "svc-003";
                status = #Completed;
                requestedDate = 1730518400000000000;
                scheduledDate = ?1730604800000000000;
                completedDate = ?1730691200000000000;
                price = 3500;
                location = DEFAULT_LOCATION;
                evidence = ?{
                    id = "ev-003";
                    bookingId = "bk-003";
                    submitterId = provider2;
                    description = "Computer repair diagnostic report and test results";
                    fileUrls = ["https://example.com/evidence/bk-003-diagnostic.pdf"];
                    qualityScore = ?0.8;
                    createdAt = 1730691200000000000;
                };
                createdAt = 1730518400000000000;
                updatedAt = 1730691200000000000;
            }),
            ("bk-004", {
                id = "bk-004";
                clientId = client2;
                providerId = provider2;
                serviceId = "svc-004";
                status = #InProgress;
                requestedDate = 1730777600000000000;
                scheduledDate = ?1730864000000000000;
                completedDate = null;
                price = 2500;
                location = DEFAULT_LOCATION;
                evidence = null;
                createdAt = 1730777600000000000;
                updatedAt = 1730864000000000000;
            }),
            ("bk-005", {
                id = "bk-005";
                clientId = client1;
                providerId = provider1;
                serviceId = "svc-005";
                status = #Requested;
                requestedDate = 1730950400000000000;
                scheduledDate = null;
                completedDate = null;
                price = 1500;
                location = DEFAULT_LOCATION;
                evidence = null;
                createdAt = 1730950400000000000;
                updatedAt = 1730950400000000000;
            })
        ]
    };

    // Static Reviews
    public func getStaticReviews() : [(Text, Review)] {
        let client1 = Principal.fromText("ryjl3-tyaaa-aaaaa-aaaba-cai");
        let client2 = Principal.fromText("rdmx6-jaaaa-aaaah-qcaiq-cai");
        let provider1 = Principal.fromText("rrkah-fqaaa-aaaaa-aaaaq-cai");
        let provider2 = Principal.fromText("rno2w-sqaaa-aaaah-qcaja-cai");
        
        [
            ("rev-001", {
                id = "rev-001";
                bookingId = "bk-001";
                clientId = client1;
                providerId = provider1;
                serviceId = "svc-001";
                rating = 5;
                comment = "Excellent service! The provider was very professional and completed the work on time. The house was spotless after the cleaning service.";
                createdAt = 1730259200000000000; // 2 days after completion
                updatedAt = 1730259200000000000;
                status = #Visible;
                qualityScore = ?0.9;
            }),
            ("rev-002", {
                id = "rev-002";
                bookingId = "bk-002";
                clientId = client1;
                providerId = provider1;
                serviceId = "svc-002";
                rating = 4;
                comment = "Good service overall. The provider was knowledgeable but took longer than expected. Car runs much better now.";
                createdAt = 1730518400000000000; // 1 day after completion
                updatedAt = 1730518400000000000;
                status = #Visible;
                qualityScore = ?0.8;
            }),
            ("rev-003", {
                id = "rev-003";
                bookingId = "bk-003";
                clientId = client2;
                providerId = provider2;
                serviceId = "svc-003";
                rating = 3;
                comment = "Average service. The provider was late and the quality was not as expected. Computer works but still has some issues.";
                createdAt = 1730777600000000000; // 1 day after completion
                updatedAt = 1730777600000000000;
                status = #Visible;
                qualityScore = ?0.6;
            })
        ]
    };

    // Maintain backward compatibility - expose the getter functions directly
    public let getSTATIC_PROFILES = getStaticProfiles;
    public let getSTATIC_SERVICES = getStaticServices;
    public let getSTATIC_BOOKINGS = getStaticBookings;
    public let getSTATIC_REVIEWS = getStaticReviews;
}
