import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Time "mo:base/Time";
import HashMap "mo:base/HashMap";
import Array "mo:base/Array";
import Iter "mo:base/Iter";
import Float "mo:base/Float";
import Nat "mo:base/Nat";
import Int "mo:base/Int";
import Debug "mo:base/Debug";

import Types "../types/shared";

actor ServiceTestCanister {
    // Type definitions
    type Service = Types.Service;
    type ServiceCategory = Types.ServiceCategory;
    type ServiceStatus = Types.ServiceStatus;
    type Location = Types.Location;
    type Result<T> = Types.Result<T>;

    // State variables
    private stable var serviceEntries : [(Text, Service)] = [];
    private var services = HashMap.HashMap<Text, Service>(10, Text.equal, Text.hash);
    
    private stable var categoryEntries : [(Text, ServiceCategory)] = [];
    private var categories = HashMap.HashMap<Text, ServiceCategory>(10, Text.equal, Text.hash);

    // Helper functions
    func generateId() : Text {
        let now = Int.abs(Time.now());
        let random = Int.abs(Time.now()) % 10000;
        return Int.toText(now) # "-" # Int.toText(random);
    };

    func calculateDistance(loc1 : Location, loc2 : Location) : Float {
        // Haversine formula for distance calculation
        let R = 6371.0; // Earth's radius in kilometers
        let dLat = (loc2.latitude - loc1.latitude) * Float.pi / 180.0;
        let dLon = (loc2.longitude - loc1.longitude) * Float.pi / 180.0;
        let a = Float.sin(dLat/2.0) * Float.sin(dLat/2.0) +
                Float.cos(loc1.latitude * Float.pi / 180.0) * Float.cos(loc2.latitude * Float.pi / 180.0) *
                Float.sin(dLon/2.0) * Float.sin(dLon/2.0);
        let c = 2.0 * Float.arctan2(Float.sqrt(a), Float.sqrt(1.0 - a));
        return R * c;
    };

    // Test cases
    public func testCreateService() : async Result<Service> {
        let testId = Principal.fromText("rrkah-fqaaa-aaaaa-aaaaq-cai");
        let serviceId = generateId();
        
        let testService : Service = {
            id = serviceId;
            providerId = testId;
            title = "Test Service";
            description = "This is a test service";
            category = {
                id = "cat-001";
                name = "Test Category";
                description = "Test category description";
                parentId = null;
                slug = "test-category";
                imageUrl = "https://example.com/test.jpg";
            };
            price = 1000;
            location = {
                latitude = 16.4145;
                longitude = 120.5960;
                address = "Test Address";
                city = "Test City";
                state = "Test State";
                country = "Test Country";
                postalCode = "1234";
            };
            status = #Available;
            createdAt = Time.now();
            updatedAt = Time.now();
            rating = null;
            reviewCount = 0;
        };
        
        services.put(serviceId, testService);
        
        switch (services.get(serviceId)) {
            case (?service) {
                if (service.title == "Test Service" and 
                    service.description == "This is a test service" and 
                    service.price == 1000) {
                    return #ok(service);
                } else {
                    return #err("Service validation failed");
                };
            };
            case (null) { return #err("Service not found"); };
        };
    };

    public func testGetServiceByProvider() : async Result<[Service]> {
        let testProviderId = Principal.fromText("rrkah-fqaaa-aaaaa-aaaaq-cai");
        let providerServices = Array.filter<Service>(
            Iter.toArray(services.vals()),
            func (service : Service) : Bool {
                return service.providerId == testProviderId;
            }
        );
        
        if (providerServices.size() > 0) {
            return #ok(providerServices);
        } else {
            return #err("No services found for provider");
        };
    };

    public func testUpdateServiceStatus() : async Result<Service> {
        let testServiceId = "svc-001";
        switch (services.get(testServiceId)) {
            case (?service) {
                let updatedService : Service = {
                    id = service.id;
                    providerId = service.providerId;
                    title = service.title;
                    description = service.description;
                    category = service.category;
                    price = service.price;
                    location = service.location;
                    status = #Unavailable;
                    createdAt = service.createdAt;
                    updatedAt = Time.now();
                    rating = service.rating;
                    reviewCount = service.reviewCount
                };
                services.put(testServiceId, updatedService);
                
                switch (services.get(testServiceId)) {
                    case (?finalService) {
                        if (finalService.status == #Unavailable) {
                            return #ok(finalService);
                        } else {
                            return #err("Service status update failed");
                        };
                    };
                    case (null) { return #err("Service not found after update"); };
                };
            };
            case (null) { return #err("Service not found"); };
        };
    };

    public func testSearchServicesByLocation() : async Result<[Service]> {
        let userLocation : Location = {
            latitude = 16.4145;
            longitude = 120.5960;
            address = "User Location";
            city = "Test City";
            state = "Test State";
            country = "Test Country";
            postalCode = "1234";
        };
        
        let allServices = Iter.toArray(services.vals());
        
        let filteredServices = Array.filter<Service>(
            allServices,
            func (service : Service) : Bool {
                let distance = calculateDistance(userLocation, service.location);
                return service.status == #Available and distance <= 10.0;
            }
        );
        
        if (filteredServices.size() > 0) {
            return #ok(filteredServices);
        } else {
            return #err("No services found within range");
        };
    };

    public func testUpdateServiceRating() : async Result<Service> {
        let testServiceId = "svc-001";
        switch (services.get(testServiceId)) {
            case (?service) {
                let updatedService : Service = {
                    id = service.id;
                    providerId = service.providerId;
                    title = service.title;
                    description = service.description;
                    category = service.category;
                    price = service.price;
                    location = service.location;
                    status = service.status;
                    createdAt = service.createdAt;
                    updatedAt = Time.now();
                    rating = ?4.5;
                    reviewCount = 10
                };
                services.put(testServiceId, updatedService);
                
                switch (services.get(testServiceId)) {
                    case (?finalService) {
                        switch (finalService.rating) {
                            case (?rating) {
                                if (rating == 4.5 and finalService.reviewCount == 10) {
                                    return #ok(finalService);
                                } else {
                                    return #err("Rating update validation failed");
                                };
                            };
                            case (null) { return #err("Rating is null after update"); };
                        };
                    };
                    case (null) { return #err("Service not found after rating update"); };
                };
            };
            case (null) { return #err("Service not found"); };
        };
    };

    // Initialize test data
    private func initializeTestData() {
        // Initialize categories
        let staticCategories : [(Text, ServiceCategory)] = [
            ("cat-001", {
                id = "cat-001";
                name = "Home Services";
                description = "Professional home maintenance and improvement services";
                parentId = null;
                slug = "home-services";
                imageUrl = "https://example.com/home-services.jpg"
            }),
            ("cat-001-01", {
                id = "cat-001-01";
                name = "Cleaning Services";
                description = "Professional cleaning and housekeeping services";
                parentId = ?"cat-001";
                slug = "home-cleaning";
                imageUrl = "https://example.com/cleaning.jpg"
            }),
            ("cat-002", {
                id = "cat-002";
                name = "Automobile Repairs";
                description = "Professional automobile maintenance and repair services";
                parentId = null;
                slug = "auto-repairs";
                imageUrl = "https://example.com/auto-repairs.jpg"
            })
        ];

        // Initialize sample location
        let sampleLocation : Location = {
            latitude = 16.4145;
            longitude = 120.5960;
            address = "Baguio City - Session Road";
            city = "Baguio City";
            state = "Benguet";
            country = "Philippines";
            postalCode = "2600"
        };

        // Initialize services
        let staticServices : [(Text, Service)] = [
            ("svc-001", {
                id = "svc-001";
                providerId = Principal.fromText("rrkah-fqaaa-aaaaa-aaaaq-cai");
                title = "Professional Home Cleaning";
                description = "Experienced house maid for cleaning, organizing, and maintaining your home";
                category = switch(categories.get("cat-001-01")) { 
                    case(?c) c; 
                    case(null) {
                        {
                            id = "cat-001-01";
                            name = "Cleaning Services";
                            description = "Professional cleaning and housekeeping services";
                            parentId = ?"cat-001";
                            slug = "home-cleaning";
                            imageUrl = "https://example.com/cleaning.jpg"
                        }
                    } 
                };
                price = 5000;
                location = sampleLocation;
                status = #Available;
                createdAt = Time.now();
                updatedAt = Time.now();
                rating = ?4.8;
                reviewCount = 156
            }),
            ("svc-002", {
                id = "svc-002";
                providerId = Principal.fromText("rrkah-fqaaa-aaaaa-aaaaq-cai");
                title = "Car Maintenance Service";
                description = "Complete car maintenance and repair services";
                category = switch(categories.get("cat-002")) { 
                    case(?c) c; 
                    case(null) {
                        {
                            id = "cat-002";
                            name = "Automobile Repairs";
                            description = "Professional automobile maintenance and repair services";
                            parentId = null;
                            slug = "auto-repairs";
                            imageUrl = "https://example.com/auto-repairs.jpg"
                        }
                    } 
                };
                price = 6000;
                location = sampleLocation;
                status = #Available;
                createdAt = Time.now();
                updatedAt = Time.now();
                rating = ?4.9;
                reviewCount = 213
            }),
            ("svc-003", {
                id = "svc-003";
                providerId = Principal.fromText("ryjl3-tyaaa-aaaaa-aaaba-cai");
                title = "Deep Cleaning Service";
                description = "Specialized deep cleaning for homes and offices";
                category = switch(categories.get("cat-001-01")) { 
                    case(?c) c; 
                    case(null) {
                        {
                            id = "cat-001-01";
                            name = "Cleaning Services";
                            description = "Professional cleaning and housekeeping services";
                            parentId = ?"cat-001";
                            slug = "home-cleaning";
                            imageUrl = "https://example.com/cleaning.jpg"
                        }
                    } 
                };
                price = 8000;
                location = {
                    latitude = 16.4245;
                    longitude = 120.6314;
                    address = "Baguio City - Mines View Park";
                    city = "Baguio City";
                    state = "Benguet";
                    country = "Philippines";
                    postalCode = "2600"
                };
                status = #Available;
                createdAt = Time.now();
                updatedAt = Time.now();
                rating = ?4.7;
                reviewCount = 89
            })
        ];

        // Add categories to HashMap
        for ((id, category) in staticCategories.vals()) {
            categories.put(id, category);
        };

        // Add services to HashMap
        for ((id, service) in staticServices.vals()) {
            services.put(id, service);
        };
    };

    // Initialize test data when canister is deployed
    initializeTestData();

    // Test function to get all services
    public query func getAllServices() : async [Service] {
        return Iter.toArray(services.vals());
    };

    // Test function to get service by ID
    public query func getService(serviceId : Text) : async Result<Service> {
        switch (services.get(serviceId)) {
            case (?service) {
                return #ok(service);
            };
            case (null) {
                return #err("Service not found");
            };
        };
    };

    // Test function to get all categories
    public query func getAllCategories() : async [ServiceCategory] {
        return Iter.toArray(categories.vals());
    };
} 