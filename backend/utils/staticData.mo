import Principal "mo:base/Principal";
import Types "../types/shared";

module {
    public type Profile = Types.Profile;
    public type Service = Types.Service;
    public type ServiceCategory = Types.ServiceCategory;
    public type Booking = Types.Booking;
    public type Review = Types.Review;
    public type Location = Types.Location;
    public type Evidence = Types.Evidence;
    public type DayOfWeek = Types.DayOfWeek;
    public type DayAvailability = Types.DayAvailability;
    public type TimeSlot = Types.TimeSlot;

    // Static Categories
    public let STATIC_CATEGORIES : [(Text, ServiceCategory)] = [
        ("cat-001", {
            id = "cat-001";
            name = "Home Services";
            description = "Professional home maintenance and improvement services";
            parentId = null;
            slug = "home-services";
            imageUrl = "/images/HomeServices-CoverImage.jpg";
        }),
        ("cat-002", {
            id = "cat-002";
            name = "Cleaning Services";
            description = "Professional cleaning and housekeeping services";
            parentId = ?("cat-001");
            slug = "cleaning-services";
            imageUrl = "/images/CLeaningServices-CoverImage.jpeg";
        }),
        ("cat-003", {
            id = "cat-003";
            name = "Automobile Repairs";
            description = "Professional automobile maintenance and repair services";
            parentId = null;
            slug = "automobile-repairs";
            imageUrl = "/images/AutomobileRepairs-CoverImage.jpg";
        }),
        ("cat-004", {
            id = "cat-004";
            name = "Gadget Technicians";
            description = "Professional repair and support for electronic devices";
            parentId = null;
            slug = "gadget-technicians";
            imageUrl = "/images/GedgetTechnician-CoverImage1.jpg";
        }),
        ("cat-005", {
            id = "cat-005";
            name = "Beauty & Wellness";
            description = "Professional beauty and wellness services";
            parentId = null;
            slug = "beauty-wellness";
            imageUrl = "/images/Beauty&Wellness-CoverImage.jpg";
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

    // Additional Baguio City Locations
    public let BURNHAM_PARK_LOCATION : Location = {
        latitude = 16.4167;
        longitude = 120.5933;
        address = "Burnham Park Area, Baguio City";
        city = "Baguio City";
        state = "Benguet";
        country = "Philippines";
        postalCode = "2600";
    };

    public let UPPER_SESSION_LOCATION : Location = {
        latitude = 16.4088;
        longitude = 120.5968;
        address = "Upper Session Road, Baguio City";
        city = "Baguio City";
        state = "Benguet";
        country = "Philippines";
        postalCode = "2600";
    };

    public let MARCOS_HIGHWAY_LOCATION : Location = {
        latitude = 16.4200;
        longitude = 120.5950;
        address = "Marcos Highway, Baguio City";
        city = "Baguio City";
        state = "Benguet";
        country = "Philippines";
        postalCode = "2600";
    };

    public let MAGSAYSAY_LOCATION : Location = {
        latitude = 16.4110;
        longitude = 120.5980;
        address = "Magsaysay Avenue, Baguio City";
        city = "Baguio City";
        state = "Benguet";
        country = "Philippines";
        postalCode = "2600";
    };

    public let TEACHER_CAMP_LOCATION : Location = {
        latitude = 16.3985;
        longitude = 120.5995;
        address = "Teacher's Camp Road, Baguio City";
        city = "Baguio City";
        state = "Benguet";
        country = "Philippines";
        postalCode = "2600";
    };

    public let BAGUIO_CENTER_MALL_LOCATION : Location = {
        latitude = 16.4160;
        longitude = 120.5925;
        address = "Baguio Center Mall Area, Magsaysay Avenue";
        city = "Baguio City";
        state = "Benguet";
        country = "Philippines";
        postalCode = "2600";
    };

    public let CAMP_JOHN_HAY_LOCATION : Location = {
        latitude = 16.3950;
        longitude = 120.5850;
        address = "Camp John Hay, Baguio City";
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
                    imageUrl = "/images/CleaningServices-HouseMaid1.jpg";
                    thumbnailUrl = "/images/CleaningServices-HouseMaid2.jpg";
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
                    imageUrl = "/images/HomeServices-Plumbing1.jpg";
                    thumbnailUrl = "/images/HomeServices-Plumbing2.jpg";
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
        return [
            ("svc-001", {
                id = "svc-001";
                providerId = Principal.fromText("2vxsx-fae"); // Mary Gold - Cleaning Service
                title = "Professional House Cleaning";
                description = "Comprehensive cleaning service including all rooms, kitchen, bathrooms, and common areas. Experienced in deep cleaning, organizing, and maintaining residential properties.";
                category = {
                    id = "cat-002";
                    name = "Cleaning Services";
                    description = "Professional cleaning and housekeeping services";
                    parentId = ?("cat-001");
                    slug = "cleaning-services";
                    imageUrl = "/images/CleaningServices-CoverImage.jpeg";
                };
                price = 2500;
                location = MAGSAYSAY_LOCATION;
                status = #Available;
                createdAt = 1640995200000000000; // 2022-01-01
                updatedAt = 1640995200000000000;
                rating = ?4.8;
                reviewCount = 23;
                // Availability information
                weeklySchedule = ?[
                    (#Monday, { isAvailable = true; slots = [{ startTime = "08:00"; endTime = "17:00" }] }),
                    (#Tuesday, { isAvailable = true; slots = [{ startTime = "08:00"; endTime = "17:00" }] }),
                    (#Wednesday, { isAvailable = true; slots = [{ startTime = "08:00"; endTime = "17:00" }] }),
                    (#Thursday, { isAvailable = true; slots = [{ startTime = "08:00"; endTime = "17:00" }] }),
                    (#Friday, { isAvailable = true; slots = [{ startTime = "08:00"; endTime = "17:00" }] }),
                    (#Saturday, { isAvailable = true; slots = [{ startTime = "09:00"; endTime = "15:00" }] }),
                    (#Sunday, { isAvailable = false; slots = [] })
                ];
                instantBookingEnabled = ?true;
                bookingNoticeHours = ?24;
                maxBookingsPerDay = ?3;
            }),
            ("svc-002", {
                id = "svc-002";
                providerId = Principal.fromText("rrkah-fqaaa-aaaaa-aaaaq-cai"); // Silverston Eliot - Plumbing
                title = "Emergency Plumbing Services";
                description = "24/7 emergency plumbing services including leak repairs, pipe installations, drain cleaning, and fixture replacements. Fully licensed and insured with over 10 years of experience.";
                category = {
                    id = "cat-001";
                    name = "Home Services";
                    description = "Professional home maintenance and improvement services";
                    parentId = null;
                    slug = "home-services";
                    imageUrl = "/images/HomeServices-CoverImage.jpg";
                };
                price = 3500;
                location = UPPER_SESSION_LOCATION;
                status = #Available;
                createdAt = 1640995200000000000;
                updatedAt = 1640995200000000000;
                rating = ?4.9;
                reviewCount = 31;
                // Availability information - 24/7 emergency service
                weeklySchedule = ?[
                    (#Monday, { isAvailable = true; slots = [{ startTime = "00:00"; endTime = "23:59" }] }),
                    (#Tuesday, { isAvailable = true; slots = [{ startTime = "00:00"; endTime = "23:59" }] }),
                    (#Wednesday, { isAvailable = true; slots = [{ startTime = "00:00"; endTime = "23:59" }] }),
                    (#Thursday, { isAvailable = true; slots = [{ startTime = "00:00"; endTime = "23:59" }] }),
                    (#Friday, { isAvailable = true; slots = [{ startTime = "00:00"; endTime = "23:59" }] }),
                    (#Saturday, { isAvailable = true; slots = [{ startTime = "00:00"; endTime = "23:59" }] }),
                    (#Sunday, { isAvailable = true; slots = [{ startTime = "00:00"; endTime = "23:59" }] })
                ];
                instantBookingEnabled = ?true;
                bookingNoticeHours = ?1; // Emergency service - 1 hour notice
                maxBookingsPerDay = ?6; // Higher capacity for emergency services
            }),
            ("svc-003", {
                id = "svc-003";
                providerId = Principal.fromText("ryjl3-tyaaa-aaaaa-aaaba-cai"); // Juan Del JoJo - Appliance Repair
                title = "Appliance Repair & Maintenance";
                description = "Expert repair services for all major household appliances including refrigerators, washing machines, dryers, dishwashers, and air conditioning units. Quick diagnosis and reliable repairs.";
                category = {
                    id = "cat-004";
                    name = "Gadget Technicians";
                    description = "Professional repair and support for electronic devices";
                    parentId = null;
                    slug = "gadget-technicians";
                    imageUrl = "/images/HomeServices-CoverImage.jpg";
                };
                price = 2800;
                location = TEACHER_CAMP_LOCATION;
                status = #Available;
                createdAt = 1640995200000000000;
                updatedAt = 1640995200000000000;
                rating = ?4.6;
                reviewCount = 18;
                // Availability information
                weeklySchedule = ?[
                    (#Monday, { isAvailable = true; slots = [{ startTime = "09:00"; endTime = "18:00" }] }),
                    (#Tuesday, { isAvailable = true; slots = [{ startTime = "09:00"; endTime = "18:00" }] }),
                    (#Wednesday, { isAvailable = true; slots = [{ startTime = "09:00"; endTime = "18:00" }] }),
                    (#Thursday, { isAvailable = true; slots = [{ startTime = "09:00"; endTime = "18:00" }] }),
                    (#Friday, { isAvailable = true; slots = [{ startTime = "09:00"; endTime = "18:00" }] }),
                    (#Saturday, { isAvailable = true; slots = [{ startTime = "10:00"; endTime = "16:00" }] }),
                    (#Sunday, { isAvailable = false; slots = [] })
                ];
                instantBookingEnabled = ?false; // Requires scheduling advance notice
                bookingNoticeHours = ?48; // 2 days advance notice for appliance repairs
                maxBookingsPerDay = ?4;
            }),
            ("svc-004", {
                id = "svc-004";
                providerId = Principal.fromText("r7inp-6aaaa-aaaaa-aaabq-cai"); // Sophie Chen - Hair Styling
                title = "Professional Hair Styling & Color";
                description = "Complete hair styling services including cuts, colors, highlights, treatments, and special occasion styling. Specializing in all hair types with premium products and techniques.";
                category = {
                    id = "cat-005";
                    name = "Beauty & Wellness";
                    description = "Professional beauty and wellness services";
                    parentId = null;
                    slug = "beauty-wellness";
                    imageUrl = "/images/Beauty&Wellness-CoverImage.jpg";
                };
                price = 1800;
                location = BAGUIO_CENTER_MALL_LOCATION;
                status = #Available;
                createdAt = 1640995200000000000;
                updatedAt = 1640995200000000000;
                rating = ?4.7;
                reviewCount = 27;
                // Availability information - Beauty salon hours
                weeklySchedule = ?[
                    (#Monday, { isAvailable = false; slots = [] }), // Closed Mondays
                    (#Tuesday, { isAvailable = true; slots = [{ startTime = "10:00"; endTime = "19:00" }] }),
                    (#Wednesday, { isAvailable = true; slots = [{ startTime = "10:00"; endTime = "19:00" }] }),
                    (#Thursday, { isAvailable = true; slots = [{ startTime = "10:00"; endTime = "19:00" }] }),
                    (#Friday, { isAvailable = true; slots = [{ startTime = "10:00"; endTime = "20:00" }] }), // Extended Friday hours
                    (#Saturday, { isAvailable = true; slots = [{ startTime = "09:00"; endTime = "18:00" }] }),
                    (#Sunday, { isAvailable = true; slots = [{ startTime = "11:00"; endTime = "17:00" }] })
                ];
                instantBookingEnabled = ?true;
                bookingNoticeHours = ?12; // Half day advance notice
                maxBookingsPerDay = ?8; // Multiple appointments per day
            }),
            ("svc-005", {
                id = "svc-005";
                providerId = Principal.fromText("2vxsx-fae"); // Mary Gold - Deep Cleaning
                title = "Deep Cleaning & Organization";
                description = "Intensive deep cleaning service perfect for spring cleaning, move-in/move-out situations, or periodic maintenance. Includes detailed cleaning of all areas plus organization services.";
                category = {
                    id = "cat-002";
                    name = "Cleaning Services";
                    description = "Professional cleaning and housekeeping services";
                    parentId = ?("cat-001");
                    slug = "cleaning-services";
                    imageUrl = "/images/CLeaningServices-CoverImage.jpeg";
                };
                price = 4500;
                location = CAMP_JOHN_HAY_LOCATION;
                status = #Available;
                createdAt = 1641081600000000000; // 2022-01-02
                updatedAt = 1641081600000000000;
                rating = ?4.9;
                reviewCount = 15;
                // Availability information - Intensive service, limited slots
                weeklySchedule = ?[
                    (#Monday, { isAvailable = true; slots = [{ startTime = "08:00"; endTime = "16:00" }] }),
                    (#Tuesday, { isAvailable = true; slots = [{ startTime = "08:00"; endTime = "16:00" }] }),
                    (#Wednesday, { isAvailable = true; slots = [{ startTime = "08:00"; endTime = "16:00" }] }),
                    (#Thursday, { isAvailable = true; slots = [{ startTime = "08:00"; endTime = "16:00" }] }),
                    (#Friday, { isAvailable = true; slots = [{ startTime = "08:00"; endTime = "16:00" }] }),
                    (#Saturday, { isAvailable = true; slots = [{ startTime = "09:00"; endTime = "14:00" }] }),
                    (#Sunday, { isAvailable = false; slots = [] })
                ];
                instantBookingEnabled = ?false; // Deep cleaning requires advance planning
                bookingNoticeHours = ?72; // 3 days advance notice
                maxBookingsPerDay = ?1; // Only one deep cleaning per day
            })
        ];
    };

    // Static Bookings
    public func getStaticBookings() : [(Text, Booking)] {
        return [ // return empty 
        ];
    };

    // Static Reviews
    public func getStaticReviews() : [(Text, Review)] {
        return [
            ("rev-001", {
                id = "rev-001";
                bookingId = "book-001";
                clientId = Principal.fromText("uxrrr-q7777-77774-qaaaq-cai"); // John Client
                serviceId = "svc-001";
                providerId = Principal.fromText("2vxsx-fae"); // Mary Gold
                rating = 5;
                comment = "Excellent cleaning service! Mary was very thorough and professional. My house has never been cleaner. Highly recommend her services.";
                status = #Visible;
                qualityScore = ?4.8;
                createdAt = 1641168000000000000; // 2022-01-03
                updatedAt = 1641168000000000000;
            }),
            ("rev-002", {
                id = "rev-002";
                bookingId = "book-002";
                clientId = Principal.fromText("uxrrr-q7777-77774-qaaaq-cai"); // John Client
                serviceId = "svc-002";
                providerId = Principal.fromText("rrkah-fqaaa-aaaaa-aaaaq-cai"); // Silverston Eliot
                rating = 5;
                comment = "Amazing emergency plumbing service! Silverston responded quickly to my urgent call and fixed the leak professionally. Great work and fair pricing.";
                status = #Visible;
                qualityScore = ?4.9;
                createdAt = 1641254400000000000; // 2022-01-04
                updatedAt = 1641254400000000000;
            }),
            ("rev-003", {
                id = "rev-003";
                bookingId = "book-003";
                clientId = Principal.fromText("uxrrr-q7777-77774-qaaaq-cai"); // John Client
                serviceId = "svc-003";
                providerId = Principal.fromText("ryjl3-tyaaa-aaaaa-aaaba-cai"); // Juan Del JoJo
                rating = 4;
                comment = "Good appliance repair service. Juan was knowledgeable and fixed my washing machine efficiently. Took a bit longer than expected but quality work.";
                status = #Visible;
                qualityScore = ?4.2;
                createdAt = 1641340800000000000; // 2022-01-05
                updatedAt = 1641340800000000000;
            }),
            ("rev-004", {
                id = "rev-004";
                bookingId = "book-004";
                clientId = Principal.fromText("uxrrr-q7777-77774-qaaaq-cai"); // John Client
                serviceId = "svc-004";
                providerId = Principal.fromText("r7inp-6aaaa-aaaaa-aaabq-cai"); // Sophie Chen
                rating = 5;
                comment = "Fantastic hair styling experience! Sophie is very skilled and gave me exactly the cut and color I wanted. Professional salon-quality service.";
                status = #Visible;
                qualityScore = ?4.7;
                createdAt = 1641427200000000000; // 2022-01-06
                updatedAt = 1641427200000000000;
            }),
            ("rev-005", {
                id = "rev-005";
                bookingId = "book-005";
                clientId = Principal.fromText("uxrrr-q7777-77774-qaaaq-cai"); // John Client
                serviceId = "svc-005";
                providerId = Principal.fromText("2vxsx-fae"); // Mary Gold
                rating = 5;
                comment = "Outstanding deep cleaning service! Mary went above and beyond with the organization. My home looks and feels completely refreshed. Worth every penny.";
                status = #Visible;
                qualityScore = ?4.9;
                createdAt = 1641513600000000000; // 2022-01-07
                updatedAt = 1641513600000000000;
            }),
            // Additional reviews from different perspectives
            ("rev-006", {
                id = "rev-006";
                bookingId = "book-006";
                clientId = Principal.fromText("2vxsx-fae"); // Mary Gold (reviewing as client)
                serviceId = "svc-002";
                providerId = Principal.fromText("rrkah-fqaaa-aaaaa-aaaaq-cai"); // Silverston Eliot
                rating = 5;
                comment = "Silverston helped with emergency plumbing at my own home. Very reliable and professional service. Definitely recommend to other service providers.";
                status = #Visible;
                qualityScore = ?4.6;
                createdAt = 1641600000000000000; // 2022-01-08
                updatedAt = 1641600000000000000;
            }),
            ("rev-007", {
                id = "rev-007";
                bookingId = "book-007";
                clientId = Principal.fromText("rrkah-fqaaa-aaaaa-aaaaq-cai"); // Silverston Eliot
                serviceId = "svc-004";
                providerId = Principal.fromText("r7inp-6aaaa-aaaaa-aaabq-cai"); // Sophie Chen
                rating = 4;
                comment = "Sophie did a great job with my haircut. Professional service and good attention to detail. Scheduling was easy and convenient.";
                status = #Visible;
                qualityScore = ?4.3;
                createdAt = 1641686400000000000; // 2022-01-09
                updatedAt = 1641686400000000000;
            })
        ];
    };

    // Maintain backward compatibility - expose the getter functions directly
    public let getSTATIC_PROFILES = getStaticProfiles;
    public let getSTATIC_SERVICES = getStaticServices;
    public let getSTATIC_BOOKINGS = getStaticBookings;
    public let getSTATIC_REVIEWS = getStaticReviews;
}
