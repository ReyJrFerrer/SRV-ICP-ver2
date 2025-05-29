import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Time "mo:base/Time";
import HashMap "mo:base/HashMap";
import Array "mo:base/Array";
import Iter "mo:base/Iter";
import Float "mo:base/Float";
import Nat "mo:base/Nat";
import Int "mo:base/Int";

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
        
        // Get category (in real implementation, validate it exists)
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
        let categoryServices = Array.filter<Service>(
            Iter.toArray(services.vals()),
            func (service : Service) : Bool {
                return service.category.id == categoryId and service.status == #Available;
            }
        );
        
        return categoryServices;
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
                return service.status == #Available and categoryMatch;
            }
        );
        
        return filteredServices;
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
    
    // Get all categories
    public query func getAllCategories() : async [ServiceCategory] {
        return Iter.toArray(categories.vals());
    };

    // Helper functions
    private func generateId() : Text {
        let now = Int.abs(Time.now());
        let random = Int.abs(Time.now()) % 10000;
        return Int.toText(now) # "-" # Int.toText(random);
    };
}