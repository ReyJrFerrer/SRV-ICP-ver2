import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Time "mo:base/Time";
import HashMap "mo:base/HashMap";
import Array "mo:base/Array";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Int "mo:base/Int";
import Float "mo:base/Float";
import Option "mo:base/Option";
import Bool "mo:base/Bool";
import Result "mo:base/Result";

import Types "../types/shared";

actor ReputationCanister {
    // Type definitions
    type ReputationScore = Types.ReputationScore;
    type TrustLevel = Types.TrustLevel;
    type DetectionFlag = Types.DetectionFlag;
    type Result<T> = Types.Result<T>;
    type Evidence = Types.Evidence;
    type Review = Types.Review;

    // State variables
    private stable var reputationEntries : [(Principal, ReputationScore)] = [];
    private var reputations = HashMap.HashMap<Principal, ReputationScore>(10, Principal.equal, Principal.hash);
    
    // Canister references (to be set in a real implementation)
    private var authCanisterId : ?Principal = null;
    private var bookingCanisterId : ?Principal = null;
    private var reviewCanisterId : Principal = Principal.fromText("aaaaa-aa");
    private var serviceCanisterId : ?Principal = null;

    // Initialization
    system func preupgrade() {
        reputationEntries := Iter.toArray(reputations.entries());
    };

    system func postupgrade() {
        reputations := HashMap.fromIter<Principal, ReputationScore>(reputationEntries.vals(), 10, Principal.equal, Principal.hash);
        reputationEntries := [];
    };

    // Helper functions
    private func calculateTrustScore(
        completedBookings : Nat,
        averageRating : ?Float,
        accountAge : Time.Time,
        flags : [DetectionFlag]
    ) : Float {
        var score : Float = 50.0; // Base score
        
        // Add points for completed bookings (max 20 points)
        let bookingPoints = Float.min(20.0, Float.fromInt(completedBookings));
        score += bookingPoints;
        
        // Add points for average rating (max 20 points)
        switch (averageRating) {
            case (null) {};
            case (?rating) {
                score += (rating - 1.0) * 5.0; // Maps 1-5 to 0-20
            };
        };
        
        // Add points for account age (max 10 points)
        let ageInDays = Float.fromInt(Time.now() - accountAge) / (24.0 * 60.0 * 60.0 * 1_000_000_000.0);
        let agePoints = Float.min(10.0, ageInDays / 36.5); // Max points after ~1 year
        score += agePoints;
        
        // Subtract points for flags (5-15 points each)
        for (flag in flags.vals()) {
            switch (flag) {
                case (#ReviewBomb) { score -= 15.0 };
                case (#CompetitiveManipulation) { score -= 15.0 };
                case (#FakeEvidence) { score -= 10.0 };
                case (#IdentityFraud) { score -= 15.0 };
                case (#Other) { score -= 5.0 };
            };
        };
        
        // Ensure score is between 0 and 100
        return Float.max(0.0, Float.min(100.0, score));
    };
    
    private func determineTrustLevel(trustScore : Float) : TrustLevel {
        if (trustScore < 20.0) { return #Low };
        if (trustScore < 50.0) { return #Medium };
        if (trustScore < 80.0) { return #High };
        return #VeryHigh;
    };
    
    // Analyze a review for potential fraud or manipulation
    private func analyzeReview(review : Review) : [DetectionFlag] {
        // In a real implementation, this would contain complex analysis
        // For now, returning an empty array (no flags)
        return [];
    };
    
    // Evaluate evidence quality
    private func evaluateEvidenceQuality(evidence : Evidence) : Float {
        // In a real implementation, this would analyze the evidence quality
        // For now, returning a default value
        return 0.75; // 75% quality score
    };

    private func calculateReputationScore(reviews : [Review]) : Float {
        if (reviews.size() == 0) {
            return 0.0;
        };
        var totalScore : Float = 0.0;
        for (review in reviews.vals()) {
            totalScore += Float.fromInt(Int.abs(review.rating));
        };
        return totalScore / Float.fromInt(Int.abs(reviews.size()));
    };

    // Public functions
    
    // Initialize reputation for a new user
    public func initializeReputation(userId : Principal, creationTime : Time.Time) : async Result<ReputationScore> {
        // In real implementation, check that caller is auth canister
        
        switch (reputations.get(userId)) {
            case (?_) {
                return #err("Reputation already exists for this user");
            };
            case (null) {
                let newScore : ReputationScore = {
                    userId = userId;
                    trustScore = 50.0; // Default starting score
                    trustLevel = #New;
                    completedBookings = 0;
                    averageRating = null;
                    detectionFlags = [];
                    lastUpdated = Time.now();
                };
                
                reputations.put(userId, newScore);
                return #ok(newScore);
            };
        };
    };
    
    // Get reputation score for a user
    public query func getReputationScore(userId : Principal) : async Result<ReputationScore> {
        switch (reputations.get(userId)) {
            case (?score) {
                return #ok(score);
            };
            case (null) {
                return #err("No reputation score found for this user");
            };
        };
    };
    
    // Analyze a new review and update reputations
    public func processReview(review : Review) : async Result<Review> {
        // In real implementation, check that caller is review canister
        
        // 1. Analyze review for flags
        let flags = analyzeReview(review);
        
        // 2. Calculate quality score (0.0 - 1.0)
        let qualityScore : Float = Float.max(0.0, Float.min(1.0, 1.0 - (Float.fromInt(flags.size()) * 0.25)));
        
        // 3. Determine if review should be hidden
        let shouldHide = qualityScore < 0.3 or flags.size() > 2;
        
        // 4. Update provider reputation
        ignore await updateUserReputation(review.providerId);
        
        // 5. Update client reputation (reviewer)
        ignore await updateUserReputation(review.clientId);
        
        // 6. Return updated review with status and quality score
        let updatedReview : Review = {
            id = review.id;
            bookingId = review.bookingId;
            clientId = review.clientId;
            providerId = review.providerId;
            serviceId = review.serviceId;
            rating = review.rating;
            comment = review.comment;
            status = if (shouldHide) { #Hidden } else if (flags.size() > 0) { #Flagged } else { #Visible };
            qualityScore = ?qualityScore;
            createdAt = review.createdAt;
            updatedAt = Time.now();
        };
        
        // In real implementation, call review canister to update the review status
        return #ok(updatedReview);
    };
    
    // Process evidence submission
    public func processEvidence(evidence : Evidence) : async Result<Evidence> {
        // In real implementation, check that caller is booking canister
        
        // 1. Evaluate evidence quality
        let qualityScore = evaluateEvidenceQuality(evidence);
        
        // 2. Update evidence with quality score
        let updatedEvidence : Evidence = {
            id = evidence.id;
            bookingId = evidence.bookingId;
            submitterId = evidence.submitterId;
            description = evidence.description;
            fileUrls = evidence.fileUrls;
            qualityScore = ?qualityScore;
            createdAt = evidence.createdAt;
        };
        
        // 3. Update submitter reputation
        ignore await updateUserReputation(evidence.submitterId);
        
        return #ok(updatedEvidence);
    };
    
    // Update user reputation based on all activities
    public func updateUserReputation(userId : Principal) : async Result<ReputationScore> {
        switch (reputations.get(userId)) {
            case (null) {
                return #err("User reputation not found");
            };
            case (?existingScore) {
                // In real implementation:
                // 1. Get completed bookings from booking canister
                // 2. Get ratings from review canister
                // 3. Get account age from auth canister
                
                // For now, using placeholder values
                let completedBookings = existingScore.completedBookings;
                let averageRating = existingScore.averageRating;
                let accountAge = existingScore.lastUpdated; // Using last update as a proxy for account age
                let flags = existingScore.detectionFlags;
                
                let newTrustScore = calculateTrustScore(completedBookings, averageRating, accountAge, flags);
                let newTrustLevel = determineTrustLevel(newTrustScore);
                
                let updatedScore : ReputationScore = {
                    userId = existingScore.userId;
                    trustScore = newTrustScore;
                    trustLevel = newTrustLevel;
                    completedBookings = completedBookings;
                    averageRating = averageRating;
                    detectionFlags = flags;
                    lastUpdated = Time.now();
                };
                
                reputations.put(userId, updatedScore);
                return #ok(updatedScore);
            };
        };
    };
    
    // Add detection flag to a user
    public func addDetectionFlag(userId : Principal, flag : DetectionFlag) : async Result<ReputationScore> {
        switch (reputations.get(userId)) {
            case (null) {
                return #err("User reputation not found");
            };
            case (?existingScore) {
                // Add the new flag
                var newFlags = Array.append<DetectionFlag>(existingScore.detectionFlags, [flag]);
                
                // Recalculate trust score
                let newTrustScore = calculateTrustScore(
                    existingScore.completedBookings,
                    existingScore.averageRating,
                    existingScore.lastUpdated,
                    newFlags
                );
                
                let newTrustLevel = determineTrustLevel(newTrustScore);
                
                let updatedScore : ReputationScore = {
                    userId = existingScore.userId;
                    trustScore = newTrustScore;
                    trustLevel = newTrustLevel;
                    completedBookings = existingScore.completedBookings;
                    averageRating = existingScore.averageRating;
                    detectionFlags = newFlags;
                    lastUpdated = Time.now();
                };
                
                reputations.put(userId, updatedScore);
                return #ok(updatedScore);
            };
        };
    };
    
    // Update completed bookings count
    public func updateCompletedBookings(userId : Principal, count : Nat) : async Result<ReputationScore> {
        switch (reputations.get(userId)) {
            case (null) {
                return #err("User reputation not found");
            };
            case (?existingScore) {
                // Recalculate trust score with new booking count
                let newTrustScore = calculateTrustScore(
                    count,
                    existingScore.averageRating,
                    existingScore.lastUpdated,
                    existingScore.detectionFlags
                );
                
                let newTrustLevel = determineTrustLevel(newTrustScore);
                
                let updatedScore : ReputationScore = {
                    userId = existingScore.userId;
                    trustScore = newTrustScore;
                    trustLevel = newTrustLevel;
                    completedBookings = count;
                    averageRating = existingScore.averageRating;
                    detectionFlags = existingScore.detectionFlags;
                    lastUpdated = Time.now();
                };
                
                reputations.put(userId, updatedScore);
                return #ok(updatedScore);
            };
        };
    };
    
    // Update average rating
    public func updateAverageRating(userId : Principal, rating : Float) : async Result<ReputationScore> {
        switch (reputations.get(userId)) {
            case (null) {
                return #err("User reputation not found");
            };
            case (?existingScore) {
                // Recalculate trust score with new rating
                let newTrustScore = calculateTrustScore(
                    existingScore.completedBookings,
                    ?rating,
                    existingScore.lastUpdated,
                    existingScore.detectionFlags
                );
                
                let newTrustLevel = determineTrustLevel(newTrustScore);
                
                let updatedScore : ReputationScore = {
                    userId = existingScore.userId;
                    trustScore = newTrustScore;
                    trustLevel = newTrustLevel;
                    completedBookings = existingScore.completedBookings;
                    averageRating = ?rating;
                    detectionFlags = existingScore.detectionFlags;
                    lastUpdated = Time.now();
                };
                
                reputations.put(userId, updatedScore);
                return #ok(updatedScore);
            };
        };
    };
    
    // Run detection algorithms for review bombing
    public func detectReviewBombing(providerId : Principal) : async Result<Bool> {
        // In real implementation, this would analyze review patterns from review canister
        // For now, return a simple result
        return #ok(false); // No review bombing detected
    };
    
    // Run detection algorithms for competitive manipulation
    public func detectCompetitiveManipulation(providerId : Principal) : async Result<Bool> {
        // In real implementation, this would analyze review patterns and services
        // For now, return a simple result
        return #ok(false); // No competitive manipulation detected
    };
}