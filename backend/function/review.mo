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
    };
    type Result<T> = Result.Result<T, Text>;

    // State
    private stable var reviewEntries : [(Text, Review)] = [];
    private var reviews = HashMap.HashMap<Text, Review>(10, Text.equal, Text.hash);
    private var bookingCanisterId : Principal = Principal.fromText("aaaaa-aa");
    private var serviceCanisterId : Principal = Principal.fromText("aaaaa-aa");

    // Initialization
    system func preupgrade() {
        reviewEntries := Iter.toArray(reviews.entries());
    };

    system func postupgrade() {
        reviews := HashMap.fromIter<Text, Review>(reviewEntries.vals(), 10, Text.equal, Text.hash);
        reviewEntries := [];
    };

    // TODO: Why put helper functions here?
    private func generateId() : Text {
        let now = Int.abs(Time.now());
        let random = Int.abs(Time.now()) % 10000;
        return Int.toText(now) # "-" # Int.toText(random);
    };
    
    private func isValidRating(rating : Nat) : Bool {
        return rating >= 1 and rating <= 5;
    };

    // Public functions
    
    // Submit a review for a booking
    public shared(msg) func submitReview(
        bookingId : Text,
        rating : Nat,
        comment : Text
    ) : async Result<Review> {
        let caller = msg.caller;
        
        if (Principal.isAnonymous(caller)) {
            return #err("Anonymous principal not allowed");
        };
        
        // Check if booking exists and is eligible for review
        let bookingCanister = actor(Principal.toText(bookingCanisterId)) : actor {
            isEligibleForReview : (Text, Principal) -> async Result<Bool>;
        };
        
        switch (await bookingCanister.isEligibleForReview(bookingId, caller)) {
            case (#ok(true)) {
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
                
                let newReview : Review = {
                    id = reviewId;
                    bookingId = bookingId;
                    reviewerId = caller;
                    rating = rating;
                    comment = comment;
                    createdAt = Time.now();
                    updatedAt = Time.now();
                };
                
                reviews.put(reviewId, newReview);
                
                // Update service rating
                let serviceCanister = actor(Principal.toText(serviceCanisterId)) : actor {
                    updateServiceRating : (Text, Nat) -> async ();
                };
                await serviceCanister.updateServiceRating(bookingId, rating);
                
                return #ok(newReview);
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
                return review.bookingId == bookingId;
            }
        );
        
        return bookingReviews;
    };

    // Get reviews by a user
    public query func getUserReviews(userId : Principal) : async [Review] {
        let userReviews = Array.filter<Review>(
            Iter.toArray(reviews.vals()),
            func (review : Review) : Bool {
                return review.reviewerId == userId;
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
        
        switch (reviews.get(reviewId)) {
            case (?existingReview) {
                if (existingReview.reviewerId != caller) {
                    return #err("Not authorized to update this review");
                };
                
                let updatedReview : Review = {
                    id = existingReview.id;
                    bookingId = existingReview.bookingId;
                    reviewerId = existingReview.reviewerId;
                    rating = rating;
                    comment = comment;
                    createdAt = existingReview.createdAt;
                    updatedAt = Time.now();
                };
                
                reviews.put(reviewId, updatedReview);
                
                // Update service rating
                let serviceCanister = actor(Principal.toText(serviceCanisterId)) : actor {
                    updateServiceRating : (Text, Nat) -> async ();
                };
                await serviceCanister.updateServiceRating(existingReview.bookingId, rating);
                
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
                
                reviews.delete(reviewId);
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
                return review.reviewerId == providerId;
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
                return review.bookingId == serviceId;
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
        service : Principal
    ) : async Result<Text> {
        // In real implementation, need to check if caller has admin rights
        bookingCanisterId := booking;
        serviceCanisterId := service;
        
        return #ok("Canister references set successfully");
    };

    public query func calculateUserAverageRating(userId : Principal) : async Result<Float> {
        let userReviews = Array.filter<Review>(
            Iter.toArray(reviews.vals()),
            func (review : Review) : Bool {
                return review.reviewerId == userId;
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
}