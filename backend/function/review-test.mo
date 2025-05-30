import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Time "mo:base/Time";
import HashMap "mo:base/HashMap";
import Array "mo:base/Array";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Float "mo:base/Float";
import Int "mo:base/Int";
import Debug "mo:base/Debug";

import Types "../types/shared";

actor ReviewTestCanister {
    // Type definitions
    type Review = Types.Review;
    type ReviewStatus = Types.ReviewStatus;
    type Result<T> = Types.Result<T>;

    // State variables
    private var reviews = HashMap.HashMap<Text, Review>(10, Text.equal, Text.hash);

    // Helper functions
    private func generateId() : Text {
        let now = Int.abs(Time.now());
        let random = Int.abs(Time.now()) % 10000;
        return Int.toText(now) # "-" # Int.toText(random);
    };

    // Test cases
    public func testSubmitReview() : async Result<Review> {
        let testBookingId = "bk-001";
        let testClientId = Principal.fromText("ryjl3-tyaaa-aaaaa-aaaba-cai");
        let testProviderId = Principal.fromText("rrkah-fqaaa-aaaaa-aaaaq-cai");
        let testServiceId = "svc-001";
        let reviewId = generateId();
        
        let testReview : Review = {
            id = reviewId;
            bookingId = testBookingId;
            clientId = testClientId;
            providerId = testProviderId;
            serviceId = testServiceId;
            rating = 5;
            comment = "This is a test review with more than 10 characters to meet the minimum length requirement.";
            createdAt = Time.now();
            updatedAt = Time.now();
            status = #Visible;
            qualityScore = ?0.8;
        };
        
        reviews.put(reviewId, testReview);
        
        switch (reviews.get(reviewId)) {
            case (?review) {
                if (review.bookingId == testBookingId and 
                    review.clientId == testClientId and 
                    review.providerId == testProviderId and 
                    review.rating == 5 and 
                    review.status == #Visible) {
                    return #ok(review);
                } else {
                    return #err("Review validation failed");
                };
            };
            case (null) { return #err("Review not found"); };
        };
    };

    public func testInvalidRating() : async Result<Review> {
        let testBookingId = "bk-002";
        let testClientId = Principal.fromText("ryjl3-tyaaa-aaaaa-aaaba-cai");
        let testProviderId = Principal.fromText("rrkah-fqaaa-aaaaa-aaaaq-cai");
        let testServiceId = "svc-002";
        let reviewId = generateId();
        
        let testReview : Review = {
            id = reviewId;
            bookingId = testBookingId;
            clientId = testClientId;
            providerId = testProviderId;
            serviceId = testServiceId;
            rating = 6; // Invalid rating (should be 1-5)
            comment = "This is a test review with more than 10 characters to meet the minimum length requirement.";
            createdAt = Time.now();
            updatedAt = Time.now();
            status = #Visible;
            qualityScore = ?0.8;
        };
        
        reviews.put(reviewId, testReview);
        
        switch (reviews.get(reviewId)) {
            case (?review) {
                if (review.rating > 5) {
                    return #err("Invalid rating validation failed");
                } else {
                    return #ok(review);
                };
            };
            case (null) { return #err("Review not found"); };
        };
    };

    public func testInvalidComment() : async Result<Review> {
        let testBookingId = "bk-003";
        let testClientId = Principal.fromText("ryjl3-tyaaa-aaaaa-aaaba-cai");
        let testProviderId = Principal.fromText("rrkah-fqaaa-aaaaa-aaaaq-cai");
        let testServiceId = "svc-003";
        let reviewId = generateId();
        
        let testReview : Review = {
            id = reviewId;
            bookingId = testBookingId;
            clientId = testClientId;
            providerId = testProviderId;
            serviceId = testServiceId;
            rating = 4;
            comment = "Too short"; // Invalid comment (too short)
            createdAt = Time.now();
            updatedAt = Time.now();
            status = #Visible;
            qualityScore = ?0.8;
        };
        
        reviews.put(reviewId, testReview);
        
        switch (reviews.get(reviewId)) {
            case (?review) {
                if (Text.size(review.comment) < 10) {
                    return #err("Invalid comment length validation failed");
                } else {
                    return #ok(review);
                };
            };
            case (null) { return #err("Review not found"); };
        };
    };

    public func testUpdateReview() : async Result<Review> {
        let testReviewId = "rev-001";
        switch (reviews.get(testReviewId)) {
            case (?review) {
                let updatedReview : Review = {
                    id = review.id;
                    bookingId = review.bookingId;
                    clientId = review.clientId;
                    providerId = review.providerId;
                    serviceId = review.serviceId;
                    rating = 4;
                    comment = "Updated review comment with more than 10 characters to meet the minimum length requirement.";
                    createdAt = review.createdAt;
                    updatedAt = Time.now();
                    status = review.status;
                    qualityScore = ?0.9;
                };
                
                reviews.put(testReviewId, updatedReview);
                
                switch (reviews.get(testReviewId)) {
                    case (?finalReview) {
                        if (finalReview.rating == 4 and 
                            finalReview.updatedAt > review.updatedAt) {
                            return #ok(finalReview);
                        } else {
                            return #err("Review update validation failed");
                        };
                    };
                    case (null) { return #err("Review not found after update"); };
                };
            };
            case (null) { return #err("Review not found"); };
        };
    };

    public func testDeleteReview() : async Result<Review> {
        let testReviewId = "rev-001";
        switch (reviews.get(testReviewId)) {
            case (?review) {
                let deletedReview : Review = {
                    id = review.id;
                    bookingId = review.bookingId;
                    clientId = review.clientId;
                    providerId = review.providerId;
                    serviceId = review.serviceId;
                    rating = review.rating;
                    comment = review.comment;
                    createdAt = review.createdAt;
                    updatedAt = Time.now();
                    status = #Hidden;
                    qualityScore = review.qualityScore;
                };
                
                reviews.put(testReviewId, deletedReview);
                
                switch (reviews.get(testReviewId)) {
                    case (?finalReview) {
                        if (finalReview.status == #Hidden) {
                            return #ok(finalReview);
                        } else {
                            return #err("Review deletion validation failed");
                        };
                    };
                    case (null) { return #err("Review not found after deletion"); };
                };
            };
            case (null) { return #err("Review not found"); };
        };
    };

    public func testGetBookingReviews() : async Result<[Review]> {
        let testBookingId = "bk-001";
        let bookingReviews = Array.filter<Review>(
            Iter.toArray(reviews.vals()),
            func (review : Review) : Bool {
                return review.bookingId == testBookingId and review.status == #Visible;
            }
        );
        
        if (bookingReviews.size() > 0) {
            return #ok(bookingReviews);
        } else {
            return #err("No reviews found for booking");
        };
    };

    public func testGetUserReviews() : async Result<[Review]> {
        let testUserId = Principal.fromText("ryjl3-tyaaa-aaaaa-aaaba-cai");
        let userReviews = Array.filter<Review>(
            Iter.toArray(reviews.vals()),
            func (review : Review) : Bool {
                return review.clientId == testUserId and review.status == #Visible;
            }
        );
        
        if (userReviews.size() > 0) {
            return #ok(userReviews);
        } else {
            return #err("No reviews found for user");
        };
    };

    // Initialize test data
    private func initializeTestData() {
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

    // Initialize test data when canister is deployed
    initializeTestData();

    // Test function to get all reviews
    public query func getAllReviews() : async [Review] {
        return Iter.toArray(reviews.vals());
    };

    // Test function to get review by ID
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

    // Test function to get review statistics
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
} 