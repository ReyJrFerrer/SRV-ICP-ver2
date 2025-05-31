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

    // Static User Profiles with image references
    public func getStaticProfiles() : [(Principal, Profile)] {
        return [
            (Principal.fromText("2vxsx-fae"), {
                id = Principal.fromText("2vxsx-fae");
                name = "Mary Gold";
                email = "mary.gold@example.com";
                phone = "+1234567890";
                role = #ServiceProvider;
                createdAt = 1640995200000000000; // 2022-01-01
                updatedAt = 1640995200000000000;
                isVerified = true;
                profilePicture = ?{
                    imageUrl = "/images/Maid1.jpg";
                    thumbnailUrl = "/images/Maid1.jpg";
                };
                biography = ?"Experienced house maid with over 10 years of experience in residential cleaning and organizing.";
            }),
            (Principal.fromText("rrkah-fqaaa-aaaaa-aaaaq-cai"), {
                id = Principal.fromText("rrkah-fqaaa-aaaaa-aaaaq-cai");
                name = "Silverston Eliot";
                email = "silverston.eliot@example.com";
                phone = "+1987654321";
                role = #ServiceProvider;
                createdAt = 1640995200000000000;
                updatedAt = 1640995200000000000;
                isVerified = true;
                profilePicture = ?{
                    imageUrl = "/images/Plumber1.jpg";
                    thumbnailUrl = "/images/Plumber1.jpg";
                };
                biography = ?"Emergency plumbing specialist with expertise in fixing leaks, clogs, and plumbing installations. Available 24/7 for urgent calls.";
            }),
            (Principal.fromText("ryjl3-tyaaa-aaaaa-aaaba-cai"), {
                id = Principal.fromText("ryjl3-tyaaa-aaaaa-aaaba-cai");
                name = "Juan Del JoJo";
                email = "juan.deljojo@example.com";
                phone = "+1122334455";
                role = #ServiceProvider;
                createdAt = 1640995200000000000;
                updatedAt = 1640995200000000000;
                isVerified = true;
                profilePicture = ?{
                    imageUrl = "/images/Technician1.jpg";
                    thumbnailUrl = "/images/Technician1.jpg";
                };
                biography = ?"Skilled appliance repair technician with experience fixing refrigerators, washing machines, dryers, and other major household appliances.";
            }),
            (Principal.fromText("r7inp-6aaaa-aaaaa-aaabq-cai"), {
                id = Principal.fromText("r7inp-6aaaa-aaaaa-aaabq-cai");
                name = "Sophie Chen";
                email = "sophie.chen@example.com";
                phone = "+1555666777";
                role = #ServiceProvider;
                createdAt = 1640995200000000000;
                updatedAt = 1640995200000000000;
                isVerified = true;
                profilePicture = ?{
                    imageUrl = "/images/BeautyServices-Hairstylist1.jpg";
                    thumbnailUrl = "/images/BeautyServices-Hairstylist1.jpg";
                };
                biography = ?"Professional hairstylist specializing in cuts, colors, and styling for all hair types.";
            }),
            // Sample client accounts
            (Principal.fromText("uxrrr-q7777-77774-qaaaq-cai"), {
                id = Principal.fromText("uxrrr-q7777-77774-qaaaq-cai");
                name = "John Client";
                email = "john.client@example.com";
                phone = "+1999888777";
                role = #Client;
                createdAt = 1640995200000000000;
                updatedAt = 1640995200000000000;
                isVerified = true;
                profilePicture = null;
                biography = null;
            })
        ];
    };

    // Static Services
    public func getStaticServices() : [(Text, Service)] {
        return []; // Empty array for now
    };

    // Static Bookings
    public func getStaticBookings() : [(Text, Booking)] {
        return []; // Empty array for now
    };

    // Static Reviews
    public func getStaticReviews() : [(Text, Review)] {
        return []; // Empty array for now
    };

    // Maintain backward compatibility - expose the getter functions directly
    public let getSTATIC_PROFILES = getStaticProfiles;
    public let getSTATIC_SERVICES = getStaticServices;
    public let getSTATIC_BOOKINGS = getStaticBookings;
    public let getSTATIC_REVIEWS = getStaticReviews;
}
