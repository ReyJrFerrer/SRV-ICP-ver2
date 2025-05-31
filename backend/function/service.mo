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
import StaticData "../utils/staticData";

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

    // Canister references
    private var authCanisterId : ?Principal = null;
    private var bookingCanisterId : ?Principal = null;
    private var reviewCanisterId : ?Principal = null;
    private var reputationCanisterId : ?Principal = null;

    // Constants
    private let MIN_TITLE_LENGTH : Nat = 5;
    private let MAX_TITLE_LENGTH : Nat = 100;
    private let MIN_DESCRIPTION_LENGTH : Nat = 20;
    private let MAX_DESCRIPTION_LENGTH : Nat = 1000;
    private let MIN_PRICE : Nat = 100;
    private let MAX_PRICE : Nat = 1_000_000;

    // Set canister references
    public shared(msg) func setCanisterReferences(
        auth : ?Principal,
        booking : ?Principal,
        review : ?Principal,
        reputation : ?Principal
    ) : async Result<Text> {
        // In real implementation, need to check if caller has admin rights
        authCanisterId := auth;
        bookingCanisterId := booking;
        reviewCanisterId := review;
        reputationCanisterId := reputation;
        return #ok("Canister references set successfully");
    };

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

    private func validateTitle(title : Text) : Bool {
        title.size() >= MIN_TITLE_LENGTH and title.size() <= MAX_TITLE_LENGTH
    };

    private func validateDescription(description : Text) : Bool {
        description.size() >= MIN_DESCRIPTION_LENGTH and description.size() <= MAX_DESCRIPTION_LENGTH
    };

    private func validatePrice(price : Nat) : Bool {
        price >= MIN_PRICE and price <= MAX_PRICE
    };

    private func validateLocation(location : Location) : Bool {
        location.latitude >= -90.0 and location.latitude <= 90.0 and
        location.longitude >= -180.0 and location.longitude <= 180.0 and
        location.address.size() > 0 and
        location.city.size() > 0 and
        location.country.size() > 0
    };

    private func validateProvider(providerId : Principal) : async Result<Bool> {
        switch (authCanisterId) {
            case (?authId) {
                let authCanister = actor(Principal.toText(authId)) : actor {
                    getProfile : (Principal) -> async Types.Result<Types.Profile>;
                };
                
                switch (await authCanister.getProfile(providerId)) {
                    case (#ok(profile)) {
                        if (profile.role == #ServiceProvider) {
                            return #ok(true);
                        } else {
                            return #err("User is not a service provider");
                        };
                    };
                    case (#err(msg)) {
                        return #err("Provider not found: " # msg);
                    };
                };
            };
            case (null) {
                return #err("Auth canister reference not set");
            };
        };
    };

    // Static data initialization
    private func initializeStaticData() {
        // Initialize categories from shared static data
        for ((id, category) in StaticData.STATIC_CATEGORIES.vals()) {
            categories.put(id, category);
        };

        // Services initialization temporarily disabled to avoid Principal issues
        // TODO: Re-enable after fixing Principal ID issues
        /*
        // Initialize services from shared static data
        for ((id, service) in StaticData.getSTATIC_SERVICES().vals()) {
            services.put(id, service);
        };
        */
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

        // Validate provider
        switch (await validateProvider(caller)) {
            case (#err(msg)) {
                return #err(msg);
            };
            case (#ok(_)) {};
        };
        
        // Validate input
        if (not validateTitle(title)) {
            return #err("Title must be between " # Nat.toText(MIN_TITLE_LENGTH) # " and " # Nat.toText(MAX_TITLE_LENGTH) # " characters");
        };

        if (not validateDescription(description)) {
            return #err("Description must be between " # Nat.toText(MIN_DESCRIPTION_LENGTH) # " and " # Nat.toText(MAX_DESCRIPTION_LENGTH) # " characters");
        };

        if (not validatePrice(price)) {
            return #err("Price must be between " # Nat.toText(MIN_PRICE) # " and " # Nat.toText(MAX_PRICE));
        };

        if (not validateLocation(location)) {
            return #err("Invalid location data");
        };
        
        // Validate category exists
        let category = switch (categories.get(categoryId)) {
            case (?cat) cat;
            case (null) {
                return #err("Category not found");
            };
        };
        
        let serviceId = generateId();
        
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
    public query func getServicesByCategory(categoryId : Text) : async [Service] {
        // Validate category exists
        switch (categories.get(categoryId)) {
            case (null) {
                return [];
            };
            case (?_) {
                let categoryServices = Array.filter<Service>(
                    Iter.toArray(services.vals()),
                    func (service : Service) : Bool {
                        return service.category.id == categoryId and service.status == #Available;
                    }
                );
                
                return categoryServices;
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
    ) : async [Service] {
        let allServices = Iter.toArray(services.vals());
        
        let filteredServices = Array.filter<Service>(
            allServices,
            func (service : Service) : Bool {
                let categoryMatch = switch(categoryId) {
                    case (?id) service.category.id == id;
                    case (null) true;
                };
                
                let distance = calculateDistance(userLocation, service.location);
                return service.status == #Available and categoryMatch and distance <= maxDistance;
            }
        );
        
        return filteredServices;
    };
    
    // Search services by location with reputation filtering
    public func searchServicesWithReputationFilter(
        userLocation : Location,
        maxDistance : Float,
        categoryId : ?Text,
        minTrustScore : ?Float
    ) : async [Service] {
        let allServices = Iter.toArray(services.vals());
        
        let filteredServices = Array.filter<Service>(
            allServices,
            func (service : Service) : Bool {
                let categoryMatch = switch(categoryId) {
                    case (?id) service.category.id == id;
                    case (null) true;
                };
                
                let distance = calculateDistance(userLocation, service.location);
                return service.status == #Available and categoryMatch and distance <= maxDistance;
            }
        );
        
        // Filter by reputation if reputation canister is available
        switch (reputationCanisterId, minTrustScore) {
            case (?repId, ?minScore) {
                let reputationCanister = actor(Principal.toText(repId)) : actor {
                    getReputationScore : (Principal) -> async Types.Result<Types.ReputationScore>;
                };
                
                // Note: In a real implementation, you'd want to batch these calls
                // or pre-cache reputation scores for better performance
                let servicesWithReputation = Array.filter<Service>(
                    filteredServices,
                    func (service : Service) : Bool {
                        // For demo purposes, we'll assume trust score meets minimum
                        // In real implementation, you'd await the reputation score
                        true
                    }
                );
                
                return servicesWithReputation;
            };
            case (_, _) {
                return filteredServices;
            };
        };
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
        
        let categoryId = generateId();
        
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