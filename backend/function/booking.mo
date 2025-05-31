import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Time "mo:base/Time";
import HashMap "mo:base/HashMap";
import Array "mo:base/Array";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Option "mo:base/Option";
import Int "mo:base/Int";
import Debug "mo:base/Debug";

import Types "../types/shared";
import StaticData "../utils/staticData";

actor BookingCanister {
    // Type definitions
    type Booking = Types.Booking;
    type BookingStatus = Types.BookingStatus;
    type Evidence = Types.Evidence;
    type Location = Types.Location;
    type Result<T> = Types.Result<T>;

    // State variables
    private stable var bookingEntries : [(Text, Booking)] = [];
    private var bookings = HashMap.HashMap<Text, Booking>(10, Text.equal, Text.hash);
    
    private stable var evidenceEntries : [(Text, Evidence)] = [];
    private var evidences = HashMap.HashMap<Text, Evidence>(10, Text.equal, Text.hash);

    // Canister references
    private var authCanisterId : ?Principal = null;
    private var serviceCanisterId : ?Principal = null;
    private var reviewCanisterId : ?Principal = null;
    private var reputationCanisterId : ?Principal = null;

    // Constants
    private let MIN_PRICE : Nat = 100;
    private let MAX_PRICE : Nat = 1_000_000;
    private let MIN_SCHEDULE_AHEAD : Int = 3600_000_000_000; // 1 hour in nanoseconds
    private let MAX_SCHEDULE_AHEAD : Int = 30 * 24 * 3600_000_000_000; // 30 days in nanoseconds

    // Helper functions
    private func generateId() : Text {
        let now = Int.abs(Time.now());
        let random = Int.abs(Time.now()) % 10000;
        return Int.toText(now) # "-" # Int.toText(random);
    };
    
    private func isBookingEligibleForReview(booking : Booking) : Bool {
        return booking.status == #Completed and 
               Option.isSome(booking.completedDate) and
               (Time.now() - Option.unwrap(booking.completedDate)) <= (30 * 24 * 60 * 60 * 1_000_000_000);
    };

    private func validatePrice(price : Nat) : Bool {
        price >= MIN_PRICE and price <= MAX_PRICE
    };

    private func validateScheduledDate(requestedDate : Time.Time, scheduledDate : Time.Time) : Bool {
        let now = Time.now();
        let timeUntilScheduled = scheduledDate - now;
        timeUntilScheduled >= MIN_SCHEDULE_AHEAD and timeUntilScheduled <= MAX_SCHEDULE_AHEAD
    };

    private func isValidStatusTransition(currentStatus : BookingStatus, newStatus : BookingStatus) : Bool {
        switch (currentStatus, newStatus) {
            case (#Requested, #Accepted) true;
            case (#Requested, #Declined) true;
            case (#Requested, #Cancelled) true;
            case (#Accepted, #InProgress) true;
            case (#Accepted, #Cancelled) true;
            case (#InProgress, #Completed) true;
            case (#InProgress, #Disputed) true;
            case (#Completed, #Disputed) true;
            case (_, #Disputed) true;
            case (_, _) false;
        }
    };

    private func updateBookingStatus(
        existingBooking : Booking,
        newStatus : BookingStatus,
        caller : Principal,
        isProvider : Bool
    ) : Result<Booking> {
        if (not isValidStatusTransition(existingBooking.status, newStatus)) {
            return #err("Invalid status transition from " # debug_show(existingBooking.status) # " to " # debug_show(newStatus));
        };

        if (isProvider and existingBooking.providerId != caller) {
            return #err("Not authorized to update this booking");
        };

        if (not isProvider and existingBooking.clientId != caller) {
            return #err("Not authorized to update this booking");
        };

        let updatedBooking : Booking = {
            id = existingBooking.id;
            clientId = existingBooking.clientId;
            providerId = existingBooking.providerId;
            serviceId = existingBooking.serviceId;
            status = newStatus;
            requestedDate = existingBooking.requestedDate;
            scheduledDate = existingBooking.scheduledDate;
            completedDate = if (newStatus == #Completed) ?Time.now() else existingBooking.completedDate;
            price = existingBooking.price;
            location = existingBooking.location;
            evidence = existingBooking.evidence;
            createdAt = existingBooking.createdAt;
            updatedAt = Time.now();
        };

        #ok(updatedBooking)
    };

    // Static data initialization
    private func initializeStaticData() {
        // Add bookings from shared static data
        for ((id, booking) in StaticData.getSTATIC_BOOKINGS().vals()) {
            bookings.put(id, booking);
        };
    };

    // Initialization
    system func preupgrade() {
        bookingEntries := Iter.toArray(bookings.entries());
        evidenceEntries := Iter.toArray(evidences.entries());
    };

    system func postupgrade() {
        bookings := HashMap.fromIter<Text, Booking>(bookingEntries.vals(), 10, Text.equal, Text.hash);
        bookingEntries := [];
        
        evidences := HashMap.fromIter<Text, Evidence>(evidenceEntries.vals(), 10, Text.equal, Text.hash);
        evidenceEntries := [];

        // Initialize static data if bookings are empty
        if (bookings.size() == 0) {
            initializeStaticData();
        };
    };

    // Set canister references
    public shared(msg) func setCanisterReferences(
        auth : ?Principal,
        service : ?Principal,
        review : ?Principal,
        reputation : ?Principal
    ) : async Result<Text> {
        // In real implementation, need to check if caller has admin rights
        authCanisterId := auth;
        serviceCanisterId := service;
        reviewCanisterId := review;
        reputationCanisterId := reputation;
        return #ok("Canister references set successfully");
    };

    // Helper function to validate provider
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
                            return #err("Provider is not a service provider");
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

    // Helper function to validate provider availability
    private func validateProviderAvailability(providerId : Principal, requestedDateTime : Time.Time) : async Result<Bool> {
        switch (serviceCanisterId) {
            case (?serviceId) {
                let serviceCanister = actor(Principal.toText(serviceId)) : actor {
                    isProviderAvailable : (Principal, Time.Time) -> async Types.Result<Bool>;
                };
                
                switch (await serviceCanister.isProviderAvailable(providerId, requestedDateTime)) {
                    case (#ok(isAvailable)) {
                        if (isAvailable) {
                            return #ok(true);
                        } else {
                            return #err("Provider is not available at the requested date and time");
                        };
                    };
                    case (#err(msg)) {
                        return #err("Availability check failed: " # msg);
                    };
                };
            };
            case (null) {
                return #err("Service canister reference not set");
            };
        };
    };

    // Create a new booking request
    public shared(msg) func createBooking(
        serviceId : Text,
        providerId : Principal,
        price : Nat,
        location : Location,
        requestedDate : Time.Time
    ) : async Result<Booking> {
        let caller = msg.caller;
        
        if (Principal.isAnonymous(caller)) {
            return #err("Anonymous principal not allowed");
        };

        // Validate provider
        switch (await validateProvider(providerId)) {
            case (#err(msg)) {
                return #err(msg);
            };
            case (#ok(_)) {};
        };

        // Validate service ownership
        switch (serviceCanisterId) {
            case (?serviceCanisterId) {
                let serviceCanister = actor(Principal.toText(serviceCanisterId)) : actor {
                    getService : (Text) -> async Types.Result<Types.Service>;
                };
                
                switch (await serviceCanister.getService(serviceId)) {
                    case (#ok(service)) {
                        if (service.providerId != providerId) {
                            return #err("Service does not belong to the specified provider");
                        };
                    };
                    case (#err(msg)) {
                        return #err("Service not found: " # msg);
                    };
                };
            };
            case (null) {
                return #err("Service canister reference not set");
            };
        };

        if (not validatePrice(price)) {
            return #err("Price must be between " # Nat.toText(MIN_PRICE) # " and " # Nat.toText(MAX_PRICE));
        };

        if (not validateScheduledDate(requestedDate, requestedDate)) {
            return #err("Requested date must be between 1 hour and 30 days from now");
        };

        // Validate provider availability
        switch (await validateProviderAvailability(providerId, requestedDate)) {
            case (#err(msg)) {
                return #err(msg);
            };
            case (#ok(_)) {};
        };
        
        let bookingId = generateId();
        
        let newBooking : Booking = {
            id = bookingId;
            clientId = caller;
            providerId = providerId;
            serviceId = serviceId;
            status = #Requested;
            requestedDate = requestedDate;
            scheduledDate = null;
            completedDate = null;
            price = price;
            location = location;
            evidence = null;
            createdAt = Time.now();
            updatedAt = Time.now();
        };
        
        bookings.put(bookingId, newBooking);
        return #ok(newBooking);
    };
    
    // Get booking by ID
    public query func getBooking(bookingId : Text) : async Result<Booking> {
        switch (bookings.get(bookingId)) {
            case (?booking) {
                return #ok(booking);
            };
            case (null) {
                return #err("Booking not found");
            };
        };
    };
    
    // Get bookings for a client
    public query func getClientBookings(clientId : Principal) : async [Booking] {
        let clientBookings = Array.filter<Booking>(
            Iter.toArray(bookings.vals()),
            func (booking : Booking) : Bool {
                return booking.clientId == clientId;
            }
        );
        
        return clientBookings;
    };
    
    // Get bookings for a provider
    public query func getProviderBookings(providerId : Principal) : async [Booking] {
        let providerBookings = Array.filter<Booking>(
            Iter.toArray(bookings.vals()),
            func (booking : Booking) : Bool {
                return booking.providerId == providerId;
            }
        );
        
        return providerBookings;
    };
    
    // Accept a booking request (provider)
    public shared(msg) func acceptBooking(
        bookingId : Text,
        scheduledDate : Time.Time
    ) : async Result<Booking> {
        let caller = msg.caller;
        
        switch (bookings.get(bookingId)) {
            case (?existingBooking) {
                if (not validateScheduledDate(existingBooking.requestedDate, scheduledDate)) {
                    return #err("Scheduled date must be between 1 hour and 30 days from now");
                };

                switch (updateBookingStatus(existingBooking, #Accepted, caller, true)) {
                    case (#ok(updatedBooking)) {
                        let finalBooking : Booking = {
                            id = updatedBooking.id;
                            clientId = updatedBooking.clientId;
                            providerId = updatedBooking.providerId;
                            serviceId = updatedBooking.serviceId;
                            status = updatedBooking.status;
                            requestedDate = updatedBooking.requestedDate;
                            scheduledDate = ?scheduledDate;
                            completedDate = updatedBooking.completedDate;
                            price = updatedBooking.price;
                            location = updatedBooking.location;
                            evidence = updatedBooking.evidence;
                            createdAt = updatedBooking.createdAt;
                            updatedAt = updatedBooking.updatedAt;
                        };
                        
                        bookings.put(bookingId, finalBooking);
                        return #ok(finalBooking);
                    };
                    case (#err(msg)) {
                        return #err(msg);
                    };
                };
            };
            case (null) {
                return #err("Booking not found");
            };
        };
    };
    
    // Decline a booking request (provider)
    public shared(msg) func declineBooking(bookingId : Text) : async Result<Booking> {
        let caller = msg.caller;
        
        switch (bookings.get(bookingId)) {
            case (?existingBooking) {
                switch (updateBookingStatus(existingBooking, #Declined, caller, true)) {
                    case (#ok(updatedBooking)) {
                        bookings.put(bookingId, updatedBooking);
                        return #ok(updatedBooking);
                    };
                    case (#err(msg)) {
                        return #err(msg);
                    };
                };
            };
            case (null) {
                return #err("Booking not found");
            };
        };
    };
    
    // Mark booking as in progress (provider)
    public shared(msg) func startBooking(bookingId : Text) : async Result<Booking> {
        let caller = msg.caller;
        
        switch (bookings.get(bookingId)) {
            case (?existingBooking) {
                switch (updateBookingStatus(existingBooking, #InProgress, caller, true)) {
                    case (#ok(updatedBooking)) {
                        bookings.put(bookingId, updatedBooking);
                        return #ok(updatedBooking);
                    };
                    case (#err(msg)) {
                        return #err(msg);
                    };
                };
            };
            case (null) {
                return #err("Booking not found");
            };
        };
    };
    
    // Complete a booking (provider)
    public shared(msg) func completeBooking(bookingId : Text) : async Result<Booking> {
        let caller = msg.caller;
        
        switch (bookings.get(bookingId)) {
            case (?existingBooking) {
                switch (updateBookingStatus(existingBooking, #Completed, caller, true)) {
                    case (#ok(updatedBooking)) {
                        bookings.put(bookingId, updatedBooking);
                        
                        // Update reputation scores for both provider and client
                        switch (reputationCanisterId) {
                            case (?repId) {
                                let reputationCanister = actor(Principal.toText(repId)) : actor {
                                    updateUserReputation : (Principal) -> async Types.Result<Types.ReputationScore>;
                                };
                                // Update provider reputation
                                ignore await reputationCanister.updateUserReputation(updatedBooking.providerId);
                                // Update client reputation
                                ignore await reputationCanister.updateUserReputation(updatedBooking.clientId);
                            };
                            case (null) {
                                // Reputation canister not set, continue without updating reputation
                            };
                        };
                        
                        return #ok(updatedBooking);
                    };
                    case (#err(msg)) {
                        return #err(msg);
                    };
                };
            };
            case (null) {
                return #err("Booking not found");
            };
        };
    };
    
    // Cancel a booking (client)
    public shared(msg) func cancelBooking(bookingId : Text) : async Result<Booking> {
        let caller = msg.caller;
        
        switch (bookings.get(bookingId)) {
            case (?existingBooking) {
                switch (updateBookingStatus(existingBooking, #Cancelled, caller, false)) {
                    case (#ok(updatedBooking)) {
                        bookings.put(bookingId, updatedBooking);
                        return #ok(updatedBooking);
                    };
                    case (#err(msg)) {
                        return #err(msg);
                    };
                };
            };
            case (null) {
                return #err("Booking not found");
            };
        };
    };
    
    // Submit evidence for a booking
    public shared(msg) func submitEvidence(
        bookingId : Text,
        description : Text,
        fileUrls : [Text]
    ) : async Result<Evidence> {
        let caller = msg.caller;
        
        switch (bookings.get(bookingId)) {
            case (?existingBooking) {
                if (existingBooking.clientId != caller and existingBooking.providerId != caller) {
                    return #err("Not authorized to submit evidence for this booking");
                };
                
                if (existingBooking.status != #InProgress and existingBooking.status != #Completed and existingBooking.status != #Disputed) {
                    return #err("Evidence can only be submitted for in-progress, completed, or disputed bookings");
                };
                
                let evidenceId = generateId();
                
                let newEvidence : Evidence = {
                    id = evidenceId;
                    bookingId = bookingId;
                    submitterId = caller;
                    description = description;
                    fileUrls = fileUrls;
                    qualityScore = null;
                    createdAt = Time.now();
                };
                
                evidences.put(evidenceId, newEvidence);
                
                // Update booking with evidence
                let updatedBooking : Booking = {
                    id = existingBooking.id;
                    clientId = existingBooking.clientId;
                    providerId = existingBooking.providerId;
                    serviceId = existingBooking.serviceId;
                    status = existingBooking.status;
                    requestedDate = existingBooking.requestedDate;
                    scheduledDate = existingBooking.scheduledDate;
                    completedDate = existingBooking.completedDate;
                    price = existingBooking.price;
                    location = existingBooking.location;
                    evidence = ?newEvidence;
                    createdAt = existingBooking.createdAt;
                    updatedAt = Time.now();
                };
                
                bookings.put(bookingId, updatedBooking);
                return #ok(newEvidence);
            };
            case (null) {
                return #err("Booking not found");
            };
        };
    };
    
    // Dispute a booking (client or provider)
    public shared(msg) func disputeBooking(bookingId : Text) : async Result<Booking> {
        let caller = msg.caller;
        
        switch (bookings.get(bookingId)) {
            case (?existingBooking) {
                if (existingBooking.clientId != caller and existingBooking.providerId != caller) {
                    return #err("Not authorized to dispute this booking");
                };
                
                let updatedBooking : Booking = {
                    id = existingBooking.id;
                    clientId = existingBooking.clientId;
                    providerId = existingBooking.providerId;
                    serviceId = existingBooking.serviceId;
                    status = #Disputed;
                    requestedDate = existingBooking.requestedDate;
                    scheduledDate = existingBooking.scheduledDate;
                    completedDate = existingBooking.completedDate;
                    price = existingBooking.price;
                    location = existingBooking.location;
                    evidence = existingBooking.evidence;
                    createdAt = existingBooking.createdAt;
                    updatedAt = Time.now();
                };
                
                bookings.put(bookingId, updatedBooking);
                return #ok(updatedBooking);
            };
            case (null) {
                return #err("Booking not found");
            };
        };
    };
    
    // Check if a booking is eligible for review
    public query func isEligibleForReview(bookingId : Text, reviewerId : Principal) : async Result<Bool> {
        switch (bookings.get(bookingId)) {
            case (?booking) {
                if (booking.clientId != reviewerId) {
                    return #err("Only the client can review this booking");
                };
                
                return #ok(isBookingEligibleForReview(booking));
            };
            case (null) {
                return #err("Booking not found");
            };
        };
    };

    // Get bookings by status
    public query func getBookingsByStatus(status : BookingStatus) : async [Booking] {
        let statusBookings = Array.filter<Booking>(
            Iter.toArray(bookings.vals()),
            func (booking : Booking) : Bool {
                return booking.status == status;
            }
        );
        
        return statusBookings;
    };

    // Get active bookings for a client
    public query func getClientActiveBookings(clientId : Principal) : async [Booking] {
        let activeBookings = Array.filter<Booking>(
            Iter.toArray(bookings.vals()),
            func (booking : Booking) : Bool {
                return booking.clientId == clientId and 
                       (booking.status == #Requested or 
                        booking.status == #Accepted or 
                        booking.status == #InProgress);
            }
        );
        
        return activeBookings;
    };

    // Get active bookings for a provider
    public query func getProviderActiveBookings(providerId : Principal) : async [Booking] {
        let activeBookings = Array.filter<Booking>(
            Iter.toArray(bookings.vals()),
            func (booking : Booking) : Bool {
                return booking.providerId == providerId and 
                       (booking.status == #Requested or 
                        booking.status == #Accepted or 
                        booking.status == #InProgress);
            }
        );
        
        return activeBookings;
    };

    // Get completed bookings for a client
    public query func getClientCompletedBookings(clientId : Principal) : async [Booking] {
        let completedBookings = Array.filter<Booking>(
            Iter.toArray(bookings.vals()),
            func (booking : Booking) : Bool {
                return booking.clientId == clientId and booking.status == #Completed;
            }
        );
        
        return completedBookings;
    };

    // Get completed bookings for a provider
    public query func getProviderCompletedBookings(providerId : Principal) : async [Booking] {
        let completedBookings = Array.filter<Booking>(
            Iter.toArray(bookings.vals()),
            func (booking : Booking) : Bool {
                return booking.providerId == providerId and booking.status == #Completed;
            }
        );
        
        return completedBookings;
    };

    // Get disputed bookings
    public query func getDisputedBookings() : async [Booking] {
        let disputedBookings = Array.filter<Booking>(
            Iter.toArray(bookings.vals()),
            func (booking : Booking) : Bool {
                return booking.status == #Disputed;
            }
        );
        
        return disputedBookings;
    };

    // Get bookings by date range
    public query func getBookingsByDateRange(
        startDate : Time.Time,
        endDate : Time.Time
    ) : async [Booking] {
        let dateRangeBookings = Array.filter<Booking>(
            Iter.toArray(bookings.vals()),
            func (booking : Booking) : Bool {
                return booking.createdAt >= startDate and booking.createdAt <= endDate;
            }
        );
        
        return dateRangeBookings;
    };

    // CLIENT AVAILABILITY QUERY FUNCTIONS

    // Get provider's available time slots for a specific date
    public func getProviderAvailableSlots(
        providerId : Principal,
        date : Time.Time
    ) : async Result<[Types.AvailableSlot]> {
        switch (serviceCanisterId) {
            case (?serviceId) {
                let serviceCanister = actor(Principal.toText(serviceId)) : actor {
                    getAvailableTimeSlots : (Principal, Time.Time) -> async Types.Result<[Types.AvailableSlot]>;
                };
                
                return await serviceCanister.getAvailableTimeSlots(providerId, date);
            };
            case (null) {
                return #err("Service canister reference not set");
            };
        };
    };

    // Get provider's availability settings
    public func getProviderAvailabilitySettings(providerId : Principal) : async Result<Types.ProviderAvailability> {
        switch (serviceCanisterId) {
            case (?serviceId) {
                let serviceCanister = actor(Principal.toText(serviceId)) : actor {
                    getProviderAvailability : (Principal) -> async Types.Result<Types.ProviderAvailability>;
                };
                
                return await serviceCanister.getProviderAvailability(providerId);
            };
            case (null) {
                return #err("Service canister reference not set");
            };
        };
    };

    // Check if provider is available for booking at specific date/time
    public func checkProviderAvailability(
        providerId : Principal,
        requestedDateTime : Time.Time
    ) : async Result<Bool> {
        return await validateProviderAvailability(providerId, requestedDateTime);
    };

    // Get provider's booking conflicts for a date range
    public func getProviderBookingConflicts(
        providerId : Principal,
        startDate : Time.Time,
        endDate : Time.Time
    ) : async [Booking] {
        let providerBookings = Array.filter<Booking>(
            Iter.toArray(bookings.vals()),
            func (booking : Booking) : Bool {
                return booking.providerId == providerId and 
                       (booking.status == #Accepted or booking.status == #InProgress) and
                       (switch (booking.scheduledDate) {
                           case (?scheduled) {
                               scheduled >= startDate and scheduled <= endDate
                           };
                           case (null) {
                               booking.requestedDate >= startDate and booking.requestedDate <= endDate
                           };
                       });
            }
        );
        
        return providerBookings;
    };

    // Get daily booking count for a provider on a specific date
    public query func getDailyBookingCount(
        providerId : Principal,
        date : Time.Time
    ) : async Nat {
        let startOfDay = getStartOfDay(date);
        let endOfDay = startOfDay + (24 * 3600_000_000_000); // Add 24 hours in nanoseconds
        
        let dailyBookings = Array.filter<Booking>(
            Iter.toArray(bookings.vals()),
            func (booking : Booking) : Bool {
                return booking.providerId == providerId and 
                       (booking.status == #Accepted or booking.status == #InProgress) and
                       (switch (booking.scheduledDate) {
                           case (?scheduled) {
                               scheduled >= startOfDay and scheduled < endOfDay
                           };
                           case (null) {
                               booking.requestedDate >= startOfDay and booking.requestedDate < endOfDay
                           };
                       });
            }
        );
        
        return dailyBookings.size();
    };

    // Helper function to get start of day timestamp
    private func getStartOfDay(timestamp : Time.Time) : Time.Time {
        let secondsSinceEpoch = timestamp / 1_000_000_000;
        let daysSinceEpoch = secondsSinceEpoch / 86400;
        let startOfDaySeconds = daysSinceEpoch * 86400;
        startOfDaySeconds * 1_000_000_000
    };

    // TODO: Payment Integration
    // Current implementation tracks price but defers actual payment processing
    // to be implemented in future versions
}