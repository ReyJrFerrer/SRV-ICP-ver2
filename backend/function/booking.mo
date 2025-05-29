import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Time "mo:base/Time";
import HashMap "mo:base/HashMap";
import Array "mo:base/Array";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Option "mo:base/Option";
import Int "mo:base/Int";

import Types "../types/shared";

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
    };
    //TODO: Why put helper functions here?
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

    // Public functions
    
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
                if (existingBooking.providerId != caller) {
                    return #err("Not authorized to accept this booking");
                };
                
                if (existingBooking.status != #Requested) {
                    return #err("Booking cannot be accepted in its current state");
                };
                
                let updatedBooking : Booking = {
                    id = existingBooking.id;
                    clientId = existingBooking.clientId;
                    providerId = existingBooking.providerId;
                    serviceId = existingBooking.serviceId;
                    status = #Accepted;
                    requestedDate = existingBooking.requestedDate;
                    scheduledDate = ?scheduledDate;
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
    
    // Decline a booking request (provider)
    public shared(msg) func declineBooking(bookingId : Text) : async Result<Booking> {
        let caller = msg.caller;
        
        switch (bookings.get(bookingId)) {
            case (?existingBooking) {
                if (existingBooking.providerId != caller) {
                    return #err("Not authorized to decline this booking");
                };
                
                if (existingBooking.status != #Requested) {
                    return #err("Booking cannot be declined in its current state");
                };
                
                let updatedBooking : Booking = {
                    id = existingBooking.id;
                    clientId = existingBooking.clientId;
                    providerId = existingBooking.providerId;
                    serviceId = existingBooking.serviceId;
                    status = #Declined;
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
    
    // Mark booking as in progress (provider)
    public shared(msg) func startBooking(bookingId : Text) : async Result<Booking> {
        let caller = msg.caller;
        
        switch (bookings.get(bookingId)) {
            case (?existingBooking) {
                if (existingBooking.providerId != caller) {
                    return #err("Not authorized to start this booking");
                };
                
                if (existingBooking.status != #Accepted) {
                    return #err("Booking cannot be started in its current state");
                };
                
                let updatedBooking : Booking = {
                    id = existingBooking.id;
                    clientId = existingBooking.clientId;
                    providerId = existingBooking.providerId;
                    serviceId = existingBooking.serviceId;
                    status = #InProgress;
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
    
    // Complete a booking (provider)
    public shared(msg) func completeBooking(bookingId : Text) : async Result<Booking> {
        let caller = msg.caller;
        
        switch (bookings.get(bookingId)) {
            case (?existingBooking) {
                if (existingBooking.providerId != caller) {
                    return #err("Not authorized to complete this booking");
                };
                
                if (existingBooking.status != #InProgress) {
                    return #err("Booking cannot be completed in its current state");
                };
                
                let updatedBooking : Booking = {
                    id = existingBooking.id;
                    clientId = existingBooking.clientId;
                    providerId = existingBooking.providerId;
                    serviceId = existingBooking.serviceId;
                    status = #Completed;
                    requestedDate = existingBooking.requestedDate;
                    scheduledDate = existingBooking.scheduledDate;
                    completedDate = ?Time.now();
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
    
    // Cancel a booking (client)
    public shared(msg) func cancelBooking(bookingId : Text) : async Result<Booking> {
        let caller = msg.caller;
        
        switch (bookings.get(bookingId)) {
            case (?existingBooking) {
                if (existingBooking.clientId != caller) {
                    return #err("Not authorized to cancel this booking");
                };
                
                if (existingBooking.status != #Requested and existingBooking.status != #Accepted) {
                    return #err("Booking cannot be cancelled in its current state");
                };
                
                let updatedBooking : Booking = {
                    id = existingBooking.id;
                    clientId = existingBooking.clientId;
                    providerId = existingBooking.providerId;
                    serviceId = existingBooking.serviceId;
                    status = #Cancelled;
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
}