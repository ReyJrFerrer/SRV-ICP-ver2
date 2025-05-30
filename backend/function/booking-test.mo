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

actor BookingTestCanister {
    // Type definitions
    type Booking = Types.Booking;
    type BookingStatus = Types.BookingStatus;
    type Evidence = Types.Evidence;
    type Location = Types.Location;
    type Result<T> = Types.Result<T>;

    // State variables
    private var bookings = HashMap.HashMap<Text, Booking>(10, Text.equal, Text.hash);
    private var evidences = HashMap.HashMap<Text, Evidence>(10, Text.equal, Text.hash);

    // Helper functions
    private func generateId() : Text {
        let now = Int.abs(Time.now());
        let random = Int.abs(Time.now()) % 10000;
        return Int.toText(now) # "-" # Int.toText(random);
    };

    // Test cases
    public func testCreateBooking() : async Result<Booking> {
        let testClientId = Principal.fromText("ryjl3-tyaaa-aaaaa-aaaba-cai");
        let testProviderId = Principal.fromText("rrkah-fqaaa-aaaaa-aaaaq-cai");
        let bookingId = generateId();
        
        let testBooking : Booking = {
            id = bookingId;
            clientId = testClientId;
            providerId = testProviderId;
            serviceId = "svc-001";
            status = #Requested;
            requestedDate = Time.now() + (24 * 3600_000_000_000); // 1 day from now
            scheduledDate = null;
            completedDate = null;
            price = 5000;
            location = {
                latitude = 16.4145;
                longitude = 120.5960;
                address = "Baguio City - Session Road";
                city = "Baguio City";
                state = "Benguet";
                country = "Philippines";
                postalCode = "2600"
            };
            evidence = null;
            createdAt = Time.now();
            updatedAt = Time.now();
        };
        
        bookings.put(bookingId, testBooking);
        
        switch (bookings.get(bookingId)) {
            case (?booking) {
                if (booking.clientId == testClientId and 
                    booking.providerId == testProviderId and 
                    booking.serviceId == "svc-001" and 
                    booking.status == #Requested and 
                    booking.price == 5000) {
                    return #ok(booking);
                } else {
                    return #err("Booking validation failed");
                };
            };
            case (null) { return #err("Booking not found"); };
        };
    };

    public func testAcceptBooking() : async Result<Booking> {
        let testBookingId = "bk-001";
        let scheduledDate = Time.now() + (48 * 3600_000_000_000); // 2 days from now
        
        switch (bookings.get(testBookingId)) {
            case (?booking) {
                let updatedBooking : Booking = {
                    id = booking.id;
                    clientId = booking.clientId;
                    providerId = booking.providerId;
                    serviceId = booking.serviceId;
                    status = #Accepted;
                    requestedDate = booking.requestedDate;
                    scheduledDate = ?scheduledDate;
                    completedDate = booking.completedDate;
                    price = booking.price;
                    location = booking.location;
                    evidence = booking.evidence;
                    createdAt = booking.createdAt;
                    updatedAt = Time.now();
                };
                
                bookings.put(testBookingId, updatedBooking);
                
                switch (bookings.get(testBookingId)) {
                    case (?finalBooking) {
                        if (finalBooking.status == #Accepted and 
                            Option.isSome(finalBooking.scheduledDate) and 
                            Option.unwrap(finalBooking.scheduledDate) == scheduledDate) {
                            return #ok(finalBooking);
                        } else {
                            return #err("Booking acceptance validation failed");
                        };
                    };
                    case (null) { return #err("Booking not found after acceptance"); };
                };
            };
            case (null) { return #err("Booking not found"); };
        };
    };

    public func testStartBooking() : async Result<Booking> {
        let testBookingId = "bk-001";
        
        switch (bookings.get(testBookingId)) {
            case (?booking) {
                let updatedBooking : Booking = {
                    id = booking.id;
                    clientId = booking.clientId;
                    providerId = booking.providerId;
                    serviceId = booking.serviceId;
                    status = #InProgress;
                    requestedDate = booking.requestedDate;
                    scheduledDate = booking.scheduledDate;
                    completedDate = booking.completedDate;
                    price = booking.price;
                    location = booking.location;
                    evidence = booking.evidence;
                    createdAt = booking.createdAt;
                    updatedAt = Time.now();
                };
                
                bookings.put(testBookingId, updatedBooking);
                
                switch (bookings.get(testBookingId)) {
                    case (?finalBooking) {
                        if (finalBooking.status == #InProgress) {
                            return #ok(finalBooking);
                        } else {
                            return #err("Booking start validation failed");
                        };
                    };
                    case (null) { return #err("Booking not found after starting"); };
                };
            };
            case (null) { return #err("Booking not found"); };
        };
    };

    public func testCompleteBooking() : async Result<Booking> {
        let testBookingId = "bk-001";
        
        switch (bookings.get(testBookingId)) {
            case (?booking) {
                let updatedBooking : Booking = {
                    id = booking.id;
                    clientId = booking.clientId;
                    providerId = booking.providerId;
                    serviceId = booking.serviceId;
                    status = #Completed;
                    requestedDate = booking.requestedDate;
                    scheduledDate = booking.scheduledDate;
                    completedDate = ?Time.now();
                    price = booking.price;
                    location = booking.location;
                    evidence = booking.evidence;
                    createdAt = booking.createdAt;
                    updatedAt = Time.now();
                };
                
                bookings.put(testBookingId, updatedBooking);
                
                switch (bookings.get(testBookingId)) {
                    case (?finalBooking) {
                        if (finalBooking.status == #Completed and 
                            Option.isSome(finalBooking.completedDate)) {
                            return #ok(finalBooking);
                        } else {
                            return #err("Booking completion validation failed");
                        };
                    };
                    case (null) { return #err("Booking not found after completion"); };
                };
            };
            case (null) { return #err("Booking not found"); };
        };
    };

    public func testSubmitEvidence() : async Result<Evidence> {
        let testBookingId = "bk-001";
        let evidenceId = generateId();
        
        let testEvidence : Evidence = {
            id = evidenceId;
            bookingId = testBookingId;
            submitterId = Principal.fromText("rrkah-fqaaa-aaaaa-aaaaq-cai");
            description = "Test evidence submission";
            fileUrls = ["https://example.com/evidence1.jpg", "https://example.com/evidence2.jpg"];
            qualityScore = null;
            createdAt = Time.now();
        };
        
        evidences.put(evidenceId, testEvidence);
        
        switch (bookings.get(testBookingId)) {
            case (?booking) {
                let updatedBooking : Booking = {
                    id = booking.id;
                    clientId = booking.clientId;
                    providerId = booking.providerId;
                    serviceId = booking.serviceId;
                    status = booking.status;
                    requestedDate = booking.requestedDate;
                    scheduledDate = booking.scheduledDate;
                    completedDate = booking.completedDate;
                    price = booking.price;
                    location = booking.location;
                    evidence = ?testEvidence;
                    createdAt = booking.createdAt;
                    updatedAt = Time.now();
                };
                
                bookings.put(testBookingId, updatedBooking);
                
                switch (evidences.get(evidenceId)) {
                    case (?evidence) {
                        if (evidence.bookingId == testBookingId and 
                            evidence.description == "Test evidence submission" and 
                            evidence.fileUrls.size() == 2) {
                            return #ok(evidence);
                        } else {
                            return #err("Evidence validation failed");
                        };
                    };
                    case (null) { return #err("Evidence not found"); };
                };
            };
            case (null) { return #err("Booking not found"); };
        };
    };

    public func testDisputeBooking() : async Result<Booking> {
        let testBookingId = "bk-001";
        
        switch (bookings.get(testBookingId)) {
            case (?booking) {
                let updatedBooking : Booking = {
                    id = booking.id;
                    clientId = booking.clientId;
                    providerId = booking.providerId;
                    serviceId = booking.serviceId;
                    status = #Disputed;
                    requestedDate = booking.requestedDate;
                    scheduledDate = booking.scheduledDate;
                    completedDate = booking.completedDate;
                    price = booking.price;
                    location = booking.location;
                    evidence = booking.evidence;
                    createdAt = booking.createdAt;
                    updatedAt = Time.now();
                };
                
                bookings.put(testBookingId, updatedBooking);
                
                switch (bookings.get(testBookingId)) {
                    case (?finalBooking) {
                        if (finalBooking.status == #Disputed) {
                            return #ok(finalBooking);
                        } else {
                            return #err("Booking dispute validation failed");
                        };
                    };
                    case (null) { return #err("Booking not found after dispute"); };
                };
            };
            case (null) { return #err("Booking not found"); };
        };
    };

    public func testGetClientBookings() : async Result<[Booking]> {
        let testClientId = Principal.fromText("ryjl3-tyaaa-aaaaa-aaaba-cai");
        let clientBookings = Array.filter<Booking>(
            Iter.toArray(bookings.vals()),
            func (booking : Booking) : Bool {
                return booking.clientId == testClientId;
            }
        );
        
        if (clientBookings.size() > 0) {
            return #ok(clientBookings);
        } else {
            return #err("No bookings found for client");
        };
    };

    public func testGetProviderBookings() : async Result<[Booking]> {
        let testProviderId = Principal.fromText("rrkah-fqaaa-aaaaa-aaaaq-cai");
        let providerBookings = Array.filter<Booking>(
            Iter.toArray(bookings.vals()),
            func (booking : Booking) : Bool {
                return booking.providerId == testProviderId;
            }
        );
        
        if (providerBookings.size() > 0) {
            return #ok(providerBookings);
        } else {
            return #err("No bookings found for provider");
        };
    };

    // Initialize test data
    private func initializeTestData() {
        let sampleLocation : Location = {
            latitude = 16.4145;
            longitude = 120.5960;
            address = "Baguio City - Session Road";
            city = "Baguio City";
            state = "Benguet";
            country = "Philippines";
            postalCode = "2600"
        };

        let staticBookings : [(Text, Booking)] = [
            ("bk-001", {
                id = "bk-001";
                clientId = Principal.fromText("ryjl3-tyaaa-aaaaa-aaaba-cai");
                providerId = Principal.fromText("rrkah-fqaaa-aaaaa-aaaaq-cai");
                serviceId = "svc-001";
                status = #Accepted;
                requestedDate = Time.now() - (2 * 24 * 3600_000_000_000); // 2 days ago
                scheduledDate = ?(Time.now() + (1 * 24 * 3600_000_000_000)); // 1 day from now
                completedDate = null;
                price = 5000;
                location = sampleLocation;
                evidence = null;
                createdAt = Time.now() - (3 * 24 * 3600_000_000_000); // 3 days ago
                updatedAt = Time.now() - (2 * 24 * 3600_000_000_000); // 2 days ago
            }),
            ("bk-002", {
                id = "bk-002";
                clientId = Principal.fromText("ryjl3-tyaaa-aaaaa-aaaba-cai");
                providerId = Principal.fromText("rrkah-fqaaa-aaaaa-aaaaq-cai");
                serviceId = "svc-002";
                status = #Completed;
                requestedDate = Time.now() - (5 * 24 * 3600_000_000_000); // 5 days ago
                scheduledDate = ?(Time.now() - (3 * 24 * 3600_000_000_000)); // 3 days ago
                completedDate = ?(Time.now() - (2 * 24 * 3600_000_000_000)); // 2 days ago
                price = 6000;
                location = sampleLocation;
                evidence = null;
                createdAt = Time.now() - (6 * 24 * 3600_000_000_000); // 6 days ago
                updatedAt = Time.now() - (2 * 24 * 3600_000_000_000); // 2 days ago
            })
        ];

        // Add bookings to HashMap
        for ((id, booking) in staticBookings.vals()) {
            bookings.put(id, booking);
        };
    };

    // Initialize test data when canister is deployed
    initializeTestData();

    // Test function to get all bookings
    public query func getAllBookings() : async [Booking] {
        return Iter.toArray(bookings.vals());
    };

    // Test function to get booking by ID
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

    // Test function to get all evidences
    public query func getAllEvidences() : async [Evidence] {
        return Iter.toArray(evidences.vals());
    };
} 