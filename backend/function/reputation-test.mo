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
import Option "mo:base/Option";

import Types "../types/shared";

actor ReputationTestCanister {
    // Type definitions
    type ReputationScore = Types.ReputationScore;
    type TrustLevel = Types.TrustLevel;
    type DetectionFlag = Types.DetectionFlag;
    type Result<T> = Types.Result<T>;
    type Evidence = Types.Evidence;
    type Review = Types.Review;
    type Booking = Types.Booking;

    // State variables
    private var reputations = HashMap.HashMap<Principal, ReputationScore>(10, Principal.equal, Principal.hash);
    private var reputationHistory = HashMap.HashMap<Principal, [(Time.Time, Float)]>(10, Principal.equal, Principal.hash);

    // Constants for reputation calculation
    private let BASE_SCORE : Float = 50.0;
    private let MAX_BOOKING_POINTS : Float = 20.0;
    private let MAX_RATING_POINTS : Float = 20.0;
    private let MAX_AGE_POINTS : Float = 10.0;
    private let MIN_TRUST_SCORE : Float = 0.0;
    private let MAX_TRUST_SCORE : Float = 100.0;
    private let TRUST_LEVEL_THRESHOLDS : [(TrustLevel, Float)] = [
        (#Low, 20.0),
        (#Medium, 50.0),
        (#High, 80.0),
        (#VeryHigh, 100.0)
    ];

    // New constants for enhanced scoring
    private let RECENCY_WEIGHT : Float = 0.3;
    private let CONSISTENCY_BONUS : Float = 5.0;
    private let EVIDENCE_QUALITY_WEIGHT : Float = 0.2;
    private let REVIEW_SENTIMENT_WEIGHT : Float = 0.15;
    private let ACTIVITY_FREQUENCY_WEIGHT : Float = 0.1;

    // Test cases
    public func testInitializeReputation() : async Result<ReputationScore> {
        let testUserId = Principal.fromText("ryjl3-tyaaa-aaaaa-aaaba-cai");
        let creationTime = Time.now();
        
        let newScore : ReputationScore = {
            userId = testUserId;
            trustScore = BASE_SCORE;
            trustLevel = #New;
            completedBookings = 0;
            averageRating = null;
            detectionFlags = [];
            lastUpdated = creationTime;
        };
        
        reputations.put(testUserId, newScore);
        
        switch (reputations.get(testUserId)) {
            case (?score) {
                if (score.userId == testUserId and 
                    score.trustScore == BASE_SCORE and 
                    score.trustLevel == #New and 
                    score.completedBookings == 0) {
                    return #ok(score);
                } else {
                    return #err("Reputation initialization validation failed");
                };
            };
            case (null) { return #err("Reputation not found"); };
        };
    };

    public func testUpdateTrustScore() : async Result<ReputationScore> {
        let testUserId = Principal.fromText("ryjl3-tyaaa-aaaaa-aaaba-cai");
        let creationTime = Time.now() - (30 * 24 * 3600_000_000_000); // 30 days ago
        
        let updatedScore : ReputationScore = {
            userId = testUserId;
            trustScore = 75.0; // Increased score with enhanced calculation
            trustLevel = #Medium;
            completedBookings = 5;
            averageRating = ?4.5;
            detectionFlags = [];
            lastUpdated = Time.now();
        };
        
        reputations.put(testUserId, updatedScore);
        
        // Update reputation history with enhanced tracking
        let history = switch (reputationHistory.get(testUserId)) {
            case (?h) h;
            case (null) [];
        };
        let newHistory = Array.append(history, [(Time.now(), 75.0)]);
        reputationHistory.put(testUserId, newHistory);
        
        switch (reputations.get(testUserId)) {
            case (?score) {
                if (score.trustScore == 75.0 and 
                    score.trustLevel == #Medium and 
                    score.completedBookings == 5 and 
                    Option.isSome(score.averageRating) and 
                    Option.unwrap(score.averageRating) == 4.5) {
                    return #ok(score);
                } else {
                    return #err("Trust score update validation failed");
                };
            };
            case (null) { return #err("Reputation not found"); };
        };
    };

    public func testAddDetectionFlag() : async Result<ReputationScore> {
        let testUserId = Principal.fromText("ryjl3-tyaaa-aaaaa-aaaba-cai");
        
        switch (reputations.get(testUserId)) {
            case (?existingScore) {
                let newFlags = Array.append<DetectionFlag>(existingScore.detectionFlags, [#ReviewBomb]);
                
                let updatedScore : ReputationScore = {
                    userId = existingScore.userId;
                    trustScore = 60.0; // Reduced score due to flag with enhanced penalty
                    trustLevel = #Low;
                    completedBookings = existingScore.completedBookings;
                    averageRating = existingScore.averageRating;
                    detectionFlags = newFlags;
                    lastUpdated = Time.now();
                };
                
                reputations.put(testUserId, updatedScore);
                
                switch (reputations.get(testUserId)) {
                    case (?score) {
                        if (score.detectionFlags.size() == 1 and 
                            score.trustScore == 60.0 and 
                            score.trustLevel == #Low) {
                            return #ok(score);
                        } else {
                            return #err("Detection flag validation failed");
                        };
                    };
                    case (null) { return #err("Reputation not found after flag addition"); };
                };
            };
            case (null) { return #err("Reputation not found"); };
        };
    };

    public func testProcessReview() : async Result<Review> {
        let testReview : Review = {
            id = "rev-001";
            bookingId = "bk-001";
            clientId = Principal.fromText("ryjl3-tyaaa-aaaaa-aaaba-cai");
            providerId = Principal.fromText("rrkah-fqaaa-aaaaa-aaaaq-cai");
            serviceId = "svc-001";
            rating = 5;
            comment = "Excellent service! Very professional and timely.";
            createdAt = Time.now();
            updatedAt = Time.now();
            status = #Visible;
            qualityScore = ?0.9;
        };
        
        // Enhanced review processing with sentiment analysis
        let flags = analyzeReview(testReview);
        let sentimentScore = calculateSentimentScore(testReview);
        let qualityScore = 0.9 * (1.0 + sentimentScore * REVIEW_SENTIMENT_WEIGHT);
        let shouldHide = qualityScore < 0.3 or flags.size() > 2;
        
        let processedReview : Review = {
            id = testReview.id;
            bookingId = testReview.bookingId;
            clientId = testReview.clientId;
            providerId = testReview.providerId;
            serviceId = testReview.serviceId;
            rating = testReview.rating;
            comment = testReview.comment;
            status = if (shouldHide) { #Hidden } else if (flags.size() > 0) { #Flagged } else { #Visible };
            qualityScore = ?qualityScore;
            createdAt = testReview.createdAt;
            updatedAt = Time.now();
        };
        
        if (processedReview.status == #Visible and 
            Option.isSome(processedReview.qualityScore) and 
            Option.unwrap(processedReview.qualityScore) > 0.9) {
            return #ok(processedReview);
        } else {
            return #err("Review processing validation failed");
        };
    };

    public func testProcessEvidence() : async Result<Evidence> {
        let testEvidence : Evidence = {
            id = "ev-001";
            bookingId = "bk-001";
            submitterId = Principal.fromText("ryjl3-tyaaa-aaaaa-aaaba-cai");
            description = "Detailed evidence with multiple photos and descriptions";
            fileUrls = ["https://example.com/photo1.jpg", "https://example.com/photo2.jpg"];
            qualityScore = null;
            createdAt = Time.now();
        };
        
        // Enhanced evidence processing
        let qualityScore = evaluateEvidenceQuality(testEvidence);
        
        let processedEvidence : Evidence = {
            id = testEvidence.id;
            bookingId = testEvidence.bookingId;
            submitterId = testEvidence.submitterId;
            description = testEvidence.description;
            fileUrls = testEvidence.fileUrls;
            qualityScore = ?qualityScore;
            createdAt = testEvidence.createdAt;
        };
        
        if (Option.isSome(processedEvidence.qualityScore) and 
            Option.unwrap(processedEvidence.qualityScore) > 0.7) {
            return #ok(processedEvidence);
        } else {
            return #err("Evidence processing validation failed");
        };
    };

    // Enhanced helper functions
    private func analyzeReview(review : Review) : [DetectionFlag] {
        var flags : [DetectionFlag] = [];
        
        // Enhanced review analysis
        if (review.rating <= 2) {
            flags := Array.append<DetectionFlag>(flags, [#ReviewBomb]);
        };
        
        if (review.rating == 5 and Text.size(review.comment) < 20) {
            flags := Array.append<DetectionFlag>(flags, [#CompetitiveManipulation]);
        };
        
        // Check for sentiment consistency
        let sentimentScore = calculateSentimentScore(review);
        if (sentimentScore < 0.3 and review.rating >= 4) {
            flags := Array.append<DetectionFlag>(flags, [#Other]);
        };
        
        return flags;
    };

    private func calculateSentimentScore(review : Review) : Float {
        let comment = Text.toLowercase(review.comment);
        var positiveWords = 0;
        var negativeWords = 0;
        
        // Simple sentiment analysis based on keyword matching
        let positiveKeywords = ["excellent", "great", "good", "amazing", "wonderful", "perfect", "best", "love", "happy", "satisfied"];
        let negativeKeywords = ["bad", "poor", "terrible", "awful", "horrible", "worst", "hate", "disappointed", "unsatisfied", "waste"];
        
        for (word in positiveKeywords.vals()) {
            if (Text.contains(comment, #text word)) {
                positiveWords += 1;
            };
        };
        
        for (word in negativeKeywords.vals()) {
            if (Text.contains(comment, #text word)) {
                negativeWords += 1;
            };
        };
        
        let totalWords = positiveWords + negativeWords;
        if (totalWords == 0) return 0.5; // Neutral if no keywords found
        
        return Float.fromInt(positiveWords) / Float.fromInt(totalWords);
    };

    private func evaluateEvidenceQuality(evidence : Evidence) : Float {
        var qualityScore : Float = 0.75; // Base quality score
        
        // Enhanced evidence quality evaluation
        if (Text.size(evidence.description) > 100) {
            qualityScore += 0.1;
        };
        
        if (evidence.fileUrls.size() > 0) {
            qualityScore += 0.1;
            // Bonus for multiple files
            if (evidence.fileUrls.size() > 1) {
                qualityScore += 0.05;
            };
        };
        
        // Keyword analysis
        let description = Text.toLowercase(evidence.description);
        if (Text.contains(description, #text "proof") or 
            Text.contains(description, #text "evidence") or 
            Text.contains(description, #text "photo")) {
            qualityScore += 0.05;
        };
        
        // Timeliness check
        let ageInHours = Float.fromInt(Time.now() - evidence.createdAt) / (60.0 * 60.0 * 1_000_000_000.0);
        if (ageInHours <= 24.0) { // Within 24 hours
            qualityScore += 0.1;
        };
        
        return Float.min(1.0, qualityScore);
    };

    // Initialize test data
    private func initializeTestData() {
        let testUserId = Principal.fromText("ryjl3-tyaaa-aaaaa-aaaba-cai");
        let creationTime = Time.now() - (30 * 24 * 3600_000_000_000); // 30 days ago
        
        let initialScore : ReputationScore = {
            userId = testUserId;
            trustScore = BASE_SCORE;
            trustLevel = #New;
            completedBookings = 0;
            averageRating = null;
            detectionFlags = [];
            lastUpdated = creationTime;
        };
        
        reputations.put(testUserId, initialScore);
        
        // Initialize reputation history with enhanced tracking
        let history : [(Time.Time, Float)] = [
            (creationTime, BASE_SCORE),
            (creationTime + (15 * 24 * 3600_000_000_000), 65.0), // 15 days later
            (Time.now(), 75.0) // Current
        ];
        
        reputationHistory.put(testUserId, history);
    };

    // Initialize test data when canister is deployed
    initializeTestData();

    // Test function to get reputation statistics
    public query func getReputationStatistics() : async {
        totalUsers : Nat;
        averageTrustScore : Float;
        trustLevelDistribution : [(TrustLevel, Nat)];
    } {
        var total : Nat = 0;
        var totalScore : Float = 0.0;
        var newCount : Nat = 0;
        var lowCount : Nat = 0;
        var mediumCount : Nat = 0;
        var highCount : Nat = 0;
        var veryHighCount : Nat = 0;
        
        for (score in reputations.vals()) {
            total += 1;
            totalScore += score.trustScore;
            
            switch (score.trustLevel) {
                case (#New) { newCount += 1 };
                case (#Low) { lowCount += 1 };
                case (#Medium) { mediumCount += 1 };
                case (#High) { highCount += 1 };
                case (#VeryHigh) { veryHighCount += 1 };
            };
        };
        
        let averageScore = if (total > 0) { totalScore / Float.fromInt(total) } else { 0.0 };
        
        let distribution : [(TrustLevel, Nat)] = [
            (#New, newCount),
            (#Low, lowCount),
            (#Medium, mediumCount),
            (#High, highCount),
            (#VeryHigh, veryHighCount)
        ];
        
        return {
            totalUsers = total;
            averageTrustScore = averageScore;
            trustLevelDistribution = distribution;
        };
    };

    // Test function to get reputation history
    public query func getReputationHistory(userId : Principal) : async Result<[(Time.Time, Float)]> {
        switch (reputationHistory.get(userId)) {
            case (?history) {
                return #ok(history);
            };
            case (null) {
                return #err("No reputation history found for this user");
            };
        };
    };
} 