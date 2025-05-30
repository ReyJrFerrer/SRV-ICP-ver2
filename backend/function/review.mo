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
    type Review = {
        id : Text;
        bookingId : Text;
        reviewerId : Principal;
        rating : Nat;
        comment : Text;
        createdAt : Time.Time;
        updatedAt : Time.Time;
        status : ReviewStatus;
        qualityScore : Float;
    };

    type ReviewStatus = {
        #active;
        #hidden;
        #flagged;
        #deleted;
    };

    type Result<T> = Result.Result<T, Text>;

    // Constants
    private let REVIEW_WINDOW_DAYS : Nat = 30;
    private let MIN_COMMENT_LENGTH : Nat = 10;
    private let MAX_COMMENT_LENGTH : Nat = 500;
    private let MIN_RATING : Nat = 1;
    private let MAX_RATING : Nat = 5;

    // State
    private stable var reviewEntries : [(Text, Review)] = [];
    private var reviews = HashMap.HashMap<Text, Review>(10, Text.equal, Text.hash);
    private var bookingCanisterId : Principal = Principal.fromText("aaaaa-aa");
    private var serviceCanisterId : Principal = Principal.fromText("aaaaa-aa");
    private var reputationCanisterId : Principal = Principal.fromText("aaaaa-aa");
    

    // Initialization
    system func preupgrade() {
        reviewEntries := Iter.toArray(reviews.entries());
    };

    system func postupgrade() {
        reviews := HashMap.fromIter<Text, Review>(reviewEntries.vals(), 10, Text.equal, Text.hash);
        reviewEntries := [];
    };

    // Helper functions
    private func generateId() : Text {
        let now = Int.abs(Time.now());
        let random = Int.abs(Time.now()) % 10000;
        return Int.toText(now) # "-" # Int.toText(random);
    };
    
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
        let bookingCanister = actor(Principal.toText(bookingCanisterId)) : actor {
            isEligibleForReview : (Text, Principal) -> async Result<Bool>;
            getBookingCompletionTime : (Text) -> async Result<Time.Time>;
        };
        
        switch (await bookingCanister.isEligibleForReview(bookingId, caller)) {
            case (#ok(true)) {
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
                                return review.bookingId == bookingId and review.reviewerId == caller;
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
                            reviewerId = caller;
                            rating = rating;
                            comment = comment;
                            createdAt = now;
                            updatedAt = now;
                            status = #active;
                            qualityScore = calculateQualityScore({
                                id = reviewId;
                                bookingId = bookingId;
                                reviewerId = caller;
                                rating = rating;
                                comment = comment;
                                createdAt = now;
                                updatedAt = now;
                                status = #active;
                                qualityScore = 0.0;
                            });
                        };
                        
                        reviews.put(reviewId, newReview);
                        
                        // Update service rating
                        let serviceCanister = actor(Principal.toText(serviceCanisterId)) : actor {
                            updateServiceRating : (Text, Nat) -> async ();
                        };
                        await serviceCanister.updateServiceRating(bookingId, rating);
                        
                        // Notify reputation canister
                        let reputationCanister = actor(Principal.toText(reputationCanisterId)) : actor {
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
                        
                        return #ok(newReview);
                    };
                    case (#err(msg)) {
                        return #err("Failed to get booking completion time: " # msg);
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

    // Get review by ID
    public query func getReview(reviewId : Text) : async Result<Review> {
        switch (reviews.get(reviewId)) {
            case (?review) {
                if (review.status == #deleted) {
                    return #err("Review has been deleted");
                };
                return #ok(review);
            };
            case (null) {
                return #err("Review not found");
            };
        };
    };

    // Get reviews for a booking
    public query func getBookingReviews(bookingId : Text) : async [Review] {
        let bookingReviews = Array.filter<Review>(
            Iter.toArray(reviews.vals()),
            func (review : Review) : Bool {
                return review.bookingId == bookingId and review.status == #active;
            }
        );
        
        return bookingReviews;
    };

    // Get reviews by a user
    public query func getUserReviews(userId : Principal) : async [Review] {
        let userReviews = Array.filter<Review>(
            Iter.toArray(reviews.vals()),
            func (review : Review) : Bool {
                return review.reviewerId == userId and review.status == #active;
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
                if (existingReview.reviewerId != caller) {
                    return #err("Not authorized to update this review");
                };
                
                if (existingReview.status != #active) {
                    return #err("Cannot update a " # debug_show(existingReview.status) # " review");
                };
                
                let updatedReview : Review = {
                    id = existingReview.id;
                    bookingId = existingReview.bookingId;
                    reviewerId = existingReview.reviewerId;
                    rating = rating;
                    comment = comment;
                    createdAt = existingReview.createdAt;
                    updatedAt = Time.now();
                    status = #active;
                    qualityScore = calculateQualityScore({
                        id = existingReview.id;
                        bookingId = existingReview.bookingId;
                        reviewerId = existingReview.reviewerId;
                        rating = rating;
                        comment = comment;
                        createdAt = existingReview.createdAt;
                        updatedAt = Time.now();
                        status = #active;
                        qualityScore = 0.0;
                    });
                };
                
                reviews.put(reviewId, updatedReview);
                
                // Update service rating
                let serviceCanister = actor(Principal.toText(serviceCanisterId)) : actor {
                    updateServiceRating : (Text, Nat) -> async ();
                };
                await serviceCanister.updateServiceRating(existingReview.bookingId, rating);
                
                // Notify reputation canister
                let reputationCanister = actor(Principal.toText(reputationCanisterId)) : actor {
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
                if (existingReview.reviewerId != caller) {
                    return #err("Not authorized to delete this review");
                };
                
                if (existingReview.status == #deleted) {
                    return #err("Review is already deleted");
                };
                
                let updatedReview : Review = {
                    id = existingReview.id;
                    bookingId = existingReview.bookingId;
                    reviewerId = existingReview.reviewerId;
                    rating = existingReview.rating;
                    comment = existingReview.comment;
                    createdAt = existingReview.createdAt;
                    updatedAt = Time.now();
                    status = #deleted;
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
                return review.reviewerId == providerId and review.status == #active;
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
                return review.bookingId == serviceId and review.status == #active;
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

    // Set canister references (admin function)
    public shared(msg) func setCanisterReferences(
        booking : Principal,
        service : Principal,
        reputation : Principal
    ) : async Result<Text> {
        // In real implementation, need to check if caller has admin rights
        bookingCanisterId := booking;
        serviceCanisterId := service;
        reputationCanisterId := reputation;
        
        return #ok("Canister references set successfully");
    };

    // Calculate user average rating
    public query func calculateUserAverageRating(userId : Principal) : async Result<Float> {
        let userReviews = Array.filter<Review>(
            Iter.toArray(reviews.vals()),
            func (review : Review) : Bool {
                return review.reviewerId == userId and review.status == #active;
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
                case (#active) { active += 1; };
                case (#hidden) { hidden += 1; };
                case (#flagged) { flagged += 1; };
                case (#deleted) { deleted += 1; };
            };
        };
        
        return {
            totalReviews = total;
            activeReviews = active;
            hiddenReviews = hidden;
            flaggedReviews = flagged;
            deletedReviews = deleted;
        };
    };
}