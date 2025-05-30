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
import Helpers "../utils/helpers";

actor ServiceCanister {
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

    // Static data initialization
    private func initializeStaticData() {
        // Initialize categories
        let staticCategories : [(Text, ServiceCategory)] = [
            ("cat-001", {
                id = "cat-001";
                name = "Home Services";
                description = "Professional home maintenance and improvement services";
                parentId = null;
                slug = "home-services";
                imageUrl = "https://res.cloudinary.com/your-cloud-name/image/upload/v1/home-services-cover"
            }),
            ("cat-001-01", {
                id = "cat-001-01";
                name = "Cleaning Services";
                description = "Professional cleaning and housekeeping services";
                parentId = ?"cat-001";
                slug = "home-cleaning";
                imageUrl = "https://res.cloudinary.com/your-cloud-name/image/upload/v1/cleaning-services-cover"
            }),
            ("cat-002", {
                id = "cat-002";
                name = "Automobile Repairs";
                description = "Professional automobile maintenance and repair services";
                parentId = null;
                slug = "auto-repairs";
                imageUrl = "https://res.cloudinary.com/your-cloud-name/image/upload/v1/auto-repairs-cover"
            }),
            ("cat-003", {
                id = "cat-003";
                name = "Gadget Technicians";
                description = "Professional repair and support for electronic devices";
                parentId = null;
                slug = "gadget-tech";
                imageUrl = "https://res.cloudinary.com/your-cloud-name/image/upload/v1/gadget-tech-cover"
            })
        ];

        // Initialize sample services
        let sampleLocation : Location = {
            latitude = 16.4145;
            longitude = 120.5960;
            address = "Baguio City - Session Road";
            city = "Baguio City";
            state = "Benguet";
            country = "Philippines";
            postalCode = "2600"
        };

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
                            imageUrl = "https://res.cloudinary.com/demo/image/upload/v1/samples/landscapes/clean-house.jpg"
                        }
                    } 
                };
                price = 5000; // Basic Cleaning Package - 5,000 PHP
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
                description = "Complete car maintenance and repair services. We handle everything from oil changes to major repairs.";
                category = switch(categories.get("cat-002")) { 
                    case(?c) c; 
                    case(null) {
                        {
                            id = "cat-002";
                            name = "Automobile Repairs";
                            description = "Professional automobile maintenance and repair services";
                            parentId = null;
                            slug = "auto-repairs";
                            imageUrl = "https://res.cloudinary.com/demo/image/upload/v1/samples/landscapes/car-repair.jpg"
                        }
                    } 
                };
                price = 6000; // Basic Vehicle Service Package - 6,000 PHP
                location = sampleLocation;
                status = #Available;
                createdAt = Time.now();
                updatedAt = Time.now();
                rating = ?4.9;
                reviewCount = 213
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

    // Initialization
    system func preupgrade() {
        serviceEntries := Iter.toArray(services.entries());
        categoryEntries := Iter.toArray(categories.entries());
    };

    system func postupgrade() {
        services := HashMap.fromIter<Text, Service>(serviceEntries.vals(), 10, Text.equal, Text.hash);
        serviceEntries := [];
        
        categories := HashMap.fromIter<Text, ServiceCategory>(categoryEntries.vals(), 10, Text.equal, Text.hash);
        categoryEntries := [];
        
        // Initialize static data if categories are empty
        if (categories.size() == 0) {
            initializeStaticData();
        };
    };

    // Public functions
    
    // Create a new service listing
    public shared(msg) func createService(
        title : Text,
        description : Text,
        categoryId : Text,
        price : Nat,
        location : Location
    ) : async Result<Service> {
        let caller = msg.caller;
        
        if (Principal.isAnonymous(caller)) {
            return #err("Anonymous principal not allowed");
        };
        
        // Validate category exists
        let category = switch (categories.get(categoryId)) {
            case (?cat) cat;
            case (null) {
                return #err("Category not found");
            };
        };
        
        let serviceId = Helpers.generateId();
        
        let newService : Service = {
            id = serviceId;
            providerId = caller;
            title = title;
            description = description;
            category = category;
            price = price;
            location = location;
            status = #Available;
            createdAt = Time.now();
            updatedAt = Time.now();
            rating = null;
            reviewCount = 0;
        };
        
        services.put(serviceId, newService);
        return #ok(newService);
    };
    
    // Get service by ID
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
    
    // Get services by provider
    public query func getServicesByProvider(providerId : Principal) : async [Service] {
        let providerServices = Array.filter<Service>(
            Iter.toArray(services.vals()),
            func (service : Service) : Bool {
                return service.providerId == providerId;
            }
        );
        
        return providerServices;
    };
    
    // Get services by category
    public query func getServicesByCategory(categoryId : Text) : async Result<[Service]> {
        // Validate category exists
        switch (categories.get(categoryId)) {
            case (null) {
                return #err("Category not found");
            };
            case (?_) {
                let categoryServices = Array.filter<Service>(
                    Iter.toArray(services.vals()),
                    func (service : Service) : Bool {
                        return service.category.id == categoryId and service.status == #Available;
                    }
                );
                
                return #ok(categoryServices);
            };
        };
    };
    
    // Update service status
    public shared(msg) func updateServiceStatus(
        serviceId : Text,
        status : ServiceStatus
    ) : async Result<Service> {
        let caller = msg.caller;
        
        switch (services.get(serviceId)) {
            case (?existingService) {
                if (existingService.providerId != caller) {
                    return #err("Not authorized to update this service");
                };
                
                let updatedService : Service = {
                    id = existingService.id;
                    providerId = existingService.providerId;
                    title = existingService.title;
                    description = existingService.description;
                    category = existingService.category;
                    price = existingService.price;
                    location = existingService.location;
                    status = status;
                    createdAt = existingService.createdAt;
                    updatedAt = Time.now();
                    rating = existingService.rating;
                    reviewCount = existingService.reviewCount;
                };
                
                services.put(serviceId, updatedService);
                return #ok(updatedService);
            };
            case (null) {
                return #err("Service not found");
            };
        };
    };
    
    // Search services by location
    public query func searchServicesByLocation(
        userLocation : Location,
        maxDistance : Float,
        categoryId : ?Text
    ) : async Result<[Service]> {
        let allServices = Iter.toArray(services.vals());
        
        let filteredServices = Array.filter<Service>(
            allServices,
            func (service : Service) : Bool {
                let categoryMatch = switch(categoryId) {
                    case (?id) service.category.id == id;
                    case (null) true;
                };
                
                let distance = Helpers.calculateDistance(userLocation, service.location);
                return service.status == #Available and categoryMatch and distance <= maxDistance;
            }
        );
        
        return #ok(filteredServices);
    };
    
    // Update service rating (called by Review Canister)
    public func updateServiceRating(
        serviceId : Text,
        newRating : Float,
        newReviewCount : Nat
    ) : async Result<Service> {
        switch (services.get(serviceId)) {
            case (?existingService) {
                let updatedService : Service = {
                    id = existingService.id;
                    providerId = existingService.providerId;
                    title = existingService.title;
                    description = existingService.description;
                    category = existingService.category;
                    price = existingService.price;
                    location = existingService.location;
                    status = existingService.status;
                    createdAt = existingService.createdAt;
                    updatedAt = Time.now();
                    rating = ?newRating;
                    reviewCount = newReviewCount;
                };
                
                services.put(serviceId, updatedService);
                return #ok(updatedService);
            };
            case (null) {
                return #err("Service not found");
            };
        };
    };
    
    // Add a new category
    public shared(msg) func addCategory(
        name : Text,
        description : Text,
        parentId : ?Text,
        slug : Text,
        imageUrl : Text
    ) : async Result<ServiceCategory> {
        let caller = msg.caller;
        
        if (Principal.isAnonymous(caller)) {
            return #err("Anonymous principal not allowed");
        };
        
        // Validate parent category if provided
        switch (parentId) {
            case (?pid) {
                switch (categories.get(pid)) {
                    case (null) {
                        return #err("Parent category not found");
                    };
                    case (?_) {};
                };
            };
            case (null) {};
        };
        
        let categoryId = Helpers.generateId();
        
        let newCategory : ServiceCategory = {
            id = categoryId;
            name = name;
            description = description;
            parentId = parentId;
            slug = slug;
            imageUrl = imageUrl;
        };
        
        categories.put(categoryId, newCategory);
        return #ok(newCategory);
    };
    
    // Get all categories
    public query func getAllCategories() : async [ServiceCategory] {
        return Iter.toArray(categories.vals());
    };
}