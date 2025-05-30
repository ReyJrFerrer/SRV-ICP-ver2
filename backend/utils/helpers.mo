import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Nat "mo:base/Nat";
import Hash "mo:base/Hash";
import Int "mo:base/Int";
import Array "mo:base/Array";
import Iter "mo:base/Iter";
import Buffer "mo:base/Buffer";
import List "mo:base/List";
import Float "mo:base/Float";
import Debug "mo:base/Debug";

// Import shared types
import Types "../types/shared";
type Location = Types.Location;
type DetectionFlag = Types.DetectionFlag;
type TrustLevel = Types.TrustLevel;

module {
    // Generate a simple ID
    public func generateId() : Text {
        let now = Int.abs(Time.now());
        let random = Int.abs(Time.now()) % 10000;
        return Int.toText(now) # "-" # Int.toText(random);
    };

    // Calculate distance between two locations using Haversine formula
    public func calculateDistance(loc1 : Location, loc2 : Location) : Float {
        // Haversine formula for distance calculation
        let R = 6371.0; // Earth's radius in kilometers
        let dLat = (loc2.latitude - loc1.latitude) * Float.pi / 180.0;
        let dLon = (loc2.longitude - loc1.longitude) * Float.pi / 180.0;
        let a = Float.sin(dLat/2.0) * Float.sin(dLat/2.0) +
                Float.cos(loc1.latitude * Float.pi / 180.0) * Float.cos(loc2.latitude * Float.pi / 180.0) *
                Float.sin(dLon/2.0) * Float.sin(dLon/2.0);
        let c = 2.0 * Float.arctan2(Float.sqrt(a), Float.sqrt(1.0 - a));
        return R * c;
    };

    // Check if a review is within 30 day window
    public func isWithin30DayWindow(bookingCompletionDate : Time.Time) : Bool {
        let thirtyDaysInNanos : Int = 30 * 24 * 60 * 60 * 1_000_000_000;
        return (Time.now() - bookingCompletionDate) <= thirtyDaysInNanos;
    };
    
    // Validate rating (1-5)
    public func isValidRating(rating : Nat) : Bool {
        return rating >= 1 and rating <= 5;
    };
    
    // Calculate reputation score based on various factors
    public func calculateTrustScore(
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
    
    // Determine trust level based on trust score
    public func determineTrustLevel(trustScore : Float) : TrustLevel {
        if (trustScore < 20.0) { return #Low };
        if (trustScore < 50.0) { return #Medium };
        if (trustScore < 80.0) { return #High };
        return #VeryHigh;
    };
};