import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Time "mo:base/Time";
import HashMap "mo:base/HashMap";
import Array "mo:base/Array";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Int "mo:base/Int";
import Float "mo:base/Float";
import Bool "mo:base/Bool";
import Result "mo:base/Result";
import Debug "mo:base/Debug";
import Buffer "mo:base/Buffer";

import Types "../types/shared";

actor ReviewCanister {
    // Type definitions
    type Review = Types.Review;
    type ReviewStatus = Types.ReviewStatus;
    type Result<T> = Types.Result<T>;

    // State variables
    private stable var reviewEntries : [(Text, Review)] = [];
    private var reviews = HashMap.HashMap<Text, Review>(10, Text.equal, Text.hash);
    
    // Canister references
    private var bookingCanisterId : ?Principal = null;
    private var serviceCanisterId : ?Principal = null;
    private var reputationCanisterId : ?Principal = null;

    // Constants
    private let REVIEW_WINDOW_DAYS : Nat = 30;
    private let MIN_COMMENT_LENGTH : Nat = 10;
    private let MAX_COMMENT_LENGTH : Nat = 500;
    private let MIN_RATING : Nat = 1;
    private let MAX_RATING : Nat = 5;

    // Helper functions
    private func generateId() : Text {
        let now = Int.abs(Time.now());
        let random = Int.abs(Time.now()) % 10000;
        return Int.toText(now) # "-" # Int.toText(random);
    };

    // Initialize static reviews
    private func initializeStaticReviews() {
        let staticReviews : [(Text, Review)] = [
            ("rev-001", {
                id = "rev-001";
                bookingId = "bk-001";
                clientId = Principal.fromText("ryjl3-tyaaa-aaaaa-aaaba-cai");
                providerId = Principal.fromText("rrkah-fqaaa-aaaaa-aaaaq-cai");
                serviceId = "svc-001";
                rating = 5;
                comment = "Excellent service! The provider was very professional and completed the work on time.";
                createdAt = Time.now() - (2 * 24 * 3600_000_000_000); // 2 days ago
                updatedAt = Time.now() - (2 * 24 * 3600_000_000_000); // 2 days ago
                status = #Visible;
                qualityScore = ?0.9;
            }),
            ("rev-002", {
                id = "rev-002";
                bookingId = "bk-002";
                clientId = Principal.fromText("ryjl3-tyaaa-aaaaa-aaaba-cai");
                providerId = Principal.fromText("rrkah-fqaaa-aaaaa-aaaaq-cai");
                serviceId = "svc-002";
                rating = 4;
                comment = "Good service overall. The provider was knowledgeable but took longer than expected.";
                createdAt = Time.now() - (5 * 24 * 3600_000_000_000); // 5 days ago
                updatedAt = Time.now() - (5 * 24 * 3600_000_000_000); // 5 days ago
                status = #Visible;
                qualityScore = ?0.8;
            }),
            ("rev-003", {
                id = "rev-003";
                bookingId = "bk-003";
                clientId = Principal.fromText("rrkah-fqaaa-aaaaa-aaaaq-cai");
                providerId = Principal.fromText("ryjl3-tyaaa-aaaaa-aaaba-cai");
                serviceId = "svc-003";
                rating = 3;
                comment = "Average service. The provider was late and the quality was not as expected.";
                createdAt = Time.now() - (7 * 24 * 3600_000_000_000); // 7 days ago
                updatedAt = Time.now() - (7 * 24 * 3600_000_000_000); // 7 days ago
                status = #Hidden;
                qualityScore = ?0.6;
            })
        ];
        
        // Add reviews to HashMap
        for ((id, review) in staticReviews.vals()) {
            reviews.put(id, review);
        };
    };

    // Pre-upgrade hook
    system func preupgrade() {
        reviewEntries := Iter.toArray(reviews.entries());
    };

    // Post-upgrade hook
    system func postupgrade() {
        reviews := HashMap.fromIter<Text, Review>(reviewEntries.vals(), 0, Text.equal, Text.hash);
        initializeStaticReviews();
    };

    // Helper functions
    private func isValidRating(rating : Nat) : Bool {
        return rating >= MIN_RATING and rating <= MAX_RATING;
    };

    private func isValidComment(comment : Text) : Bool {
        let length = Text.size(comment);
        return length >= MIN_COMMENT_LENGTH and length <= MAX_COMMENT_LENGTH;
    };

    private func isWithinReviewWindow(createdAt : Time.Time) : Bool {
        let now = Time.now();
        let windowInNanos = REVIEW_WINDOW_DAYS * 24 * 60 * 60 * 1_000_000_000;
        return (now - createdAt) <= windowInNanos;
    };

    private func calculateQualityScore(review : Review) : Float {
        // Basic quality score calculation based on comment length and rating
        let commentLength = Float.fromInt(Text.size(review.comment));
        let maxLength = Float.fromInt(MAX_COMMENT_LENGTH);
        let lengthScore = commentLength / maxLength;
        let ratingScore = Float.fromInt(review.rating) / Float.fromInt(MAX_RATING);
        return (lengthScore + ratingScore) / 2.0;
    };

    // Public functions
    
    // Submit a review for a booking
    public shared(msg) func submitReview(
        bookingId : Text,
        rating : Nat,
        comment : Text
    ) : async Result<Review> {
        let caller = msg.caller;
        
        // Input validation
        if (Principal.isAnonymous(caller)) {
            return #err("Anonymous principal not allowed");
        };
        
        if (not isValidRating(rating)) {
            return #err("Invalid rating. Must be between " # Nat.toText(MIN_RATING) # " and " # Nat.toText(MAX_RATING));
        };
        
        if (not isValidComment(comment)) {
            return #err("Invalid comment length. Must be between " # Nat.toText(MIN_COMMENT_LENGTH) # " and " # Nat.toText(MAX_COMMENT_LENGTH) # " characters");
        };
        
        // Check if booking exists and is eligible for review
        switch (bookingCanisterId) {
            case (?canisterId) {
                let bookingCanister = actor(Principal.toText(canisterId)) : actor {
                    isEligibleForReview : (Text, Principal) -> async Result<Bool>;
                    getBookingCompletionTime : (Text) -> async Result<Time.Time>;
                    getBooking : (Text) -> async Result<Types.Booking>;
                };
                
                switch (await bookingCanister.isEligibleForReview(bookingId, caller)) {
                    case (#ok(true)) {
                        // Get booking details
                        switch (await bookingCanister.getBooking(bookingId)) {
                            case (#ok(booking)) {
                                // Get booking completion time to check review window
                                switch (await bookingCanister.getBookingCompletionTime(bookingId)) {
                                    case (#ok(completionTime)) {
                                        if (not isWithinReviewWindow(completionTime)) {
                                            return #err("Review window has expired. Reviews must be submitted within " # Nat.toText(REVIEW_WINDOW_DAYS) # " days of service completion");
                                        };
                                        
                                        // Check if review already exists
                                        let existingReviews = Array.filter<Review>(
                                            Iter.toArray(reviews.vals()),
                                            func (review : Review) : Bool {
                                                return review.bookingId == bookingId and review.clientId == caller;
                                            }
                                        );
                                        
                                        if (existingReviews.size() > 0) {
                                            return #err("Review already exists for this booking");
                                        };
                                        
                                        let reviewId = generateId();
                                        let now = Time.now();
                                        
                                        let newReview : Review = {
                                            id = reviewId;
                                            bookingId = bookingId;
                                            clientId = caller;
                                            providerId = booking.providerId;
                                            serviceId = booking.serviceId;
                                            rating = rating;
                                            comment = comment;
                                            createdAt = now;
                                            updatedAt = now;
                                            status = #Visible;
                                            qualityScore = ?calculateQualityScore({
                                                id = reviewId;
                                                bookingId = bookingId;
                                                clientId = caller;
                                                providerId = booking.providerId;
                                                serviceId = booking.serviceId;
                                                rating = rating;
                                                comment = comment;
                                                createdAt = now;
                                                updatedAt = now;
                                                status = #Visible;
                                                qualityScore = null;
                                            });
                                        };
                                        
                                        reviews.put(reviewId, newReview);
                                        
                                        // Update service rating
                                        switch (serviceCanisterId) {
                                            case (?serviceId) {
                                                let serviceCanister = actor(Principal.toText(serviceId)) : actor {
                                                    updateServiceRating : (Text, Float, Nat) -> async Result<Types.Service>;
                                                };
                                                switch (await serviceCanister.updateServiceRating(booking.serviceId, Float.fromInt(rating), 1)) {
                                                    case (#ok(_)) {
                                                        Debug.print("Service rating updated successfully");
                                                    };
                                                    case (#err(msg)) {
                                                        Debug.print("Failed to update service rating: " # msg);
                                                    };
                                                };
                                            };
                                            case (null) {};
                                        };
                                        
                                        // Notify reputation canister
                                        switch (reputationCanisterId) {
                                            case (?reputationId) {
                                                let reputationCanister = actor(Principal.toText(reputationId)) : actor {
                                                    analyzeReview : (Review) -> async Result<Text>;
                                                };
                                                switch (await reputationCanister.analyzeReview(newReview)) {
                                                    case (#ok(_)) {
                                                        Debug.print("Review analysis completed successfully");
                                                    };
                                                    case (#err(msg)) {
                                                        Debug.print("Review analysis failed: " # msg);
                                                    };
                                                };
                                            };
                                            case (null) {};
                                        };
                                        
                                        return #ok(newReview);
                                    };
                                    case (#err(msg)) {
                                        return #err("Failed to get booking completion time: " # msg);
                                    };
                                };
                            };
                            case (#err(msg)) {
                                return #err("Failed to get booking details: " # msg);
                            };
                        };
                    };
                    case (#ok(false)) {
                        return #err("Booking is not eligible for review");
                    };
                    case (#err(msg)) {
                        return #err(msg);
                    };
                };
            };
            case (null) {
                return #err("Booking canister reference not set");
            };
        };
    };

    // Get review by ID
    public query func getReview(reviewId : Text) : async Result<Review> {
        switch (reviews.get(reviewId)) {
            case (?review) {
                if (review.status == #Hidden) {
                    return #err("Review has been hidden");
                };
                return #ok(review);
            };
            case (null) {
                return #err("Review not found");
            };
        };
    };

    // Get reviews for a booking
    public query func getBookingReviews(bookingId : Text) : async Result<[Review]> {
        let bookingReviews = Array.filter<Review>(
            Iter.toArray(reviews.vals()),
            func (review : Review) : Bool {
                return review.bookingId == bookingId and review.status == #Visible;
            }
        );
        
        return #ok(bookingReviews);
    };

    // Get reviews by a user
    public query func getUserReviews(userId : Principal) : async [Review] {
        let userReviews = Array.filter<Review>(
            Iter.toArray(reviews.vals()),
            func (review : Review) : Bool {
                return review.clientId == userId and review.status == #Visible;
            }
        );
        
        return userReviews;
    };

    // Update a review
    public shared(msg) func updateReview(
        reviewId : Text,
        rating : Nat,
        comment : Text
    ) : async Result<Review> {
        let caller = msg.caller;
        
        // Input validation
        if (not isValidRating(rating)) {
            return #err("Invalid rating. Must be between " # Nat.toText(MIN_RATING) # " and " # Nat.toText(MAX_RATING));
        };
        
        if (not isValidComment(comment)) {
            return #err("Invalid comment length. Must be between " # Nat.toText(MIN_COMMENT_LENGTH) # " and " # Nat.toText(MAX_COMMENT_LENGTH) # " characters");
        };
        
        switch (reviews.get(reviewId)) {
            case (?existingReview) {
                if (existingReview.clientId != caller) {
                    return #err("Not authorized to update this review");
                };
                
                if (existingReview.status != #Visible) {
                    return #err("Cannot update a " # debug_show(existingReview.status) # " review");
                };
                
                let updatedReview : Review = {
                    id = existingReview.id;
                    bookingId = existingReview.bookingId;
                    clientId = existingReview.clientId;
                    providerId = existingReview.providerId;
                    serviceId = existingReview.serviceId;
                    rating = rating;
                    comment = comment;
                    createdAt = existingReview.createdAt;
                    updatedAt = Time.now();
                    status = #Visible;
                    qualityScore = ?calculateQualityScore({
                        id = existingReview.id;
                        bookingId = existingReview.bookingId;
                        clientId = existingReview.clientId;
                        providerId = existingReview.providerId;
                        serviceId = existingReview.serviceId;
                        rating = rating;
                        comment = comment;
                        createdAt = existingReview.createdAt;
                        updatedAt = Time.now();
                        status = #Visible;
                        qualityScore = null;
                    });
                };
                
                reviews.put(reviewId, updatedReview);
                
                // Update service rating
                switch (serviceCanisterId) {
                    case (?serviceId) {
                        let serviceCanister = actor(Principal.toText(serviceId)) : actor {
                            updateServiceRating : (Text, Float, Nat) -> async Result<Types.Service>;
                        };
                        switch (await serviceCanister.updateServiceRating(existingReview.serviceId, Float.fromInt(rating), 1)) {
                            case (#ok(_)) {
                                Debug.print("Service rating updated successfully");
                            };
                            case (#err(msg)) {
                                Debug.print("Failed to update service rating: " # msg);
                            };
                        };
                    };
                    case (null) {};
                };
                
                // Notify reputation canister
                switch (reputationCanisterId) {
                    case (?reputationId) {
                        let reputationCanister = actor(Principal.toText(reputationId)) : actor {
                            analyzeReview : (Review) -> async Result<Text>;
                        };
                        switch (await reputationCanister.analyzeReview(updatedReview)) {
                            case (#ok(_)) {
                                Debug.print("Review analysis completed successfully");
                            };
                            case (#err(msg)) {
                                Debug.print("Review analysis failed: " # msg);
                            };
                        };
                    };
                    case (null) {};
                };
                
                return #ok(updatedReview);
            };
            case (null) {
                return #err("Review not found");
            };
        };
    };

    // Delete a review
    public shared(msg) func deleteReview(reviewId : Text) : async Result<()> {
        let caller = msg.caller;
        
        switch (reviews.get(reviewId)) {
            case (?existingReview) {
                if (existingReview.clientId != caller) {
                    return #err("Not authorized to delete this review");
                };
                
                if (existingReview.status == #Hidden) {
                    return #err("Review is already hidden");
                };
                
                let updatedReview : Review = {
                    id = existingReview.id;
                    bookingId = existingReview.bookingId;
                    clientId = existingReview.clientId;
                    providerId = existingReview.providerId;
                    serviceId = existingReview.serviceId;
                    rating = existingReview.rating;
                    comment = existingReview.comment;
                    createdAt = existingReview.createdAt;
                    updatedAt = Time.now();
                    status = #Hidden;
                    qualityScore = existingReview.qualityScore;
                };
                
                reviews.put(reviewId, updatedReview);
                return #ok();
            };
            case (null) {
                return #err("Review not found");
            };
        };
    };

    // Calculate average rating for a provider
    public query func calculateProviderRating(providerId : Principal) : async Result<Float> {
        let providerReviews = Array.filter<Review>(
            Iter.toArray(reviews.vals()),
            func (review : Review) : Bool {
                return review.providerId == providerId and review.status == #Visible;
            }
        );
        
        if (providerReviews.size() == 0) {
            return #err("No reviews found for this provider");
        };
        
        var totalRating : Nat = 0;
        for (review in providerReviews.vals()) {
            totalRating += review.rating;
        };
        
        let averageRating = Float.fromInt(Int.abs(totalRating)) / Float.fromInt(providerReviews.size());
        return #ok(averageRating);
    };
    
    // Calculate average rating for a service
    public query func calculateServiceRating(serviceId : Text) : async Result<Float> {
        let serviceReviews = Array.filter<Review>(
            Iter.toArray(reviews.vals()),
            func (review : Review) : Bool {
                return review.serviceId == serviceId and review.status == #Visible;
            }
        );
        
        if (serviceReviews.size() == 0) {
            return #err("No reviews found for this service");
        };
        
        var totalRating : Nat = 0;
        for (review in serviceReviews.vals()) {
            totalRating += review.rating;
        };
        
        let averageRating = Float.fromInt(Int.abs(totalRating)) / Float.fromInt(serviceReviews.size());
        return #ok(averageRating);
    };

    // Calculate user average rating
    public query func calculateUserAverageRating(userId : Principal) : async Result<Float> {
        let userReviews = Array.filter<Review>(
            Iter.toArray(reviews.vals()),
            func (review : Review) : Bool {
                return review.clientId == userId and review.status == #Visible;
            }
        );
        
        if (userReviews.size() == 0) {
            return #err("No reviews found for this user");
        };
        
        var totalRating : Nat = 0;
        for (review in userReviews.vals()) {
            totalRating += review.rating;
        };
        
        let averageRating = Float.fromInt(Int.abs(totalRating)) / Float.fromInt(userReviews.size());
        return #ok(averageRating);
    };

    // Get review statistics
    public query func getReviewStatistics() : async {
        totalReviews : Nat;
        activeReviews : Nat;
        hiddenReviews : Nat;
        flaggedReviews : Nat;
        deletedReviews : Nat;
    } {
        var total : Nat = 0;
        var active : Nat = 0;
        var hidden : Nat = 0;
        var flagged : Nat = 0;
        var deleted : Nat = 0;
        
        for (review in reviews.vals()) {
            total += 1;
            switch (review.status) {
                case (#Visible) { active += 1; };
                case (#Hidden) { hidden += 1; };
                case (#Flagged) { flagged += 1; };
            };
        };
        
        return {
            totalReviews = total;
            activeReviews = active;
            hiddenReviews = hidden;
            flaggedReviews = flagged;
            deletedReviews = 0; // Since we don't have a deleted status anymore
        };
    };

    // Set canister references (admin function)
    public shared(msg) func setCanisterReferences(
        booking : Principal,
        service : Principal,
        reputation : Principal
    ) : async Result<Text> {
        // In real implementation, need to check if caller has admin rights
        bookingCanisterId := ?booking;
        serviceCanisterId := ?service;
        reputationCanisterId := ?reputation;
        
        return #ok("Canister references set successfully");
    };
}