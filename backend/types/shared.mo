import Principal "mo:base/Principal";
import Int "mo:base/Int";
import Time "mo:base/Time";
import List "mo:base/List";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import HashMap "mo:base/HashMap";
import Buffer "mo:base/Buffer";

module {
    // User types
    public type UserRole = {
        #Client;
        #ServiceProvider;
    };

    public type ProfileImage = {
        imageUrl: Text;
        thumbnailUrl: Text;
    };

    public type Profile = {
        id: Principal;
        name: Text;
        email: Text;
        phone: Text;
        role: UserRole;
        createdAt: Time.Time;
        updatedAt: Time.Time;
        isVerified: Bool;
        profilePicture: ?ProfileImage;
        biography: ?Text;
    };

    // Service types
    public type ServiceCategory = {
        id: Text;
        name: Text;
        description: Text;
        parentId: ?Text;
        slug: Text;
        imageUrl: Text;
    };

    public type Location = {
        latitude: Float;
        longitude: Float;
        address: Text;
        city: Text;
        state: Text;
        country: Text;
        postalCode: Text;
    };

    public type ServiceStatus = {
        #Available;
        #Unavailable;
        #Suspended;
    };

    public type Service = {
        id: Text;
        providerId: Principal;
        title: Text;
        description: Text;
        category: ServiceCategory;
        price: Nat;
        location: Location;
        status: ServiceStatus;
        createdAt: Time.Time;
        updatedAt: Time.Time;
        rating: ?Float;
        reviewCount: Nat;
    };

    // Booking types
    public type BookingStatus = {
        #Requested;
        #Accepted;
        #Declined;
        #Cancelled;
        #InProgress;
        #Completed;
        #Disputed;
    };

    public type Evidence = {
        id: Text;
        bookingId: Text;
        submitterId: Principal;
        description: Text;
        fileUrls: [Text];
        qualityScore: ?Float;
        createdAt: Time.Time;
    };

    public type Booking = {
        id: Text;
        clientId: Principal;
        providerId: Principal;
        serviceId: Text;
        status: BookingStatus;
        requestedDate: Time.Time;
        scheduledDate: ?Time.Time;
        completedDate: ?Time.Time;
        price: Nat;
        location: Location;
        evidence: ?Evidence;
        createdAt: Time.Time;
        updatedAt: Time.Time;
    };

    // Review types
    public type ReviewStatus = {
        #Visible;
        #Hidden;
        #Flagged;
    };

    public type Review = {
        id: Text;
        bookingId: Text;
        clientId: Principal;
        providerId: Principal;
        serviceId: Text;
        rating: Nat;
        comment: Text;
        status: ReviewStatus;
        qualityScore: ?Float;
        createdAt: Time.Time;
        updatedAt: Time.Time;
    };

    // Reputation types
    public type TrustLevel = {
        #New;
        #Low;
        #Medium;
        #High;
        #VeryHigh;
    };

    public type DetectionFlag = {
        #ReviewBomb;
        #CompetitiveManipulation;
        #FakeEvidence;
        #IdentityFraud;
        #Other;
    };

    public type ReputationScore = {
        userId: Principal;
        trustScore: Float;
        trustLevel: TrustLevel;
        completedBookings: Nat;
        averageRating: ?Float;
        detectionFlags: [DetectionFlag];
        lastUpdated: Time.Time;
    };

    // API Response
    public type Result<T> = {
        #ok: T;
        #err: Text;
    };
}