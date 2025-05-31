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

    // Static User Profiles - temporarily returning empty to avoid Principal issues
    public func getStaticProfiles() : [(Principal, Profile)] {
        return []; // Empty array for now
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
