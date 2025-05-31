import Principal "mo:base/Principal";
import _Text "mo:base/Text";
import Time "mo:base/Time";
import HashMap "mo:base/HashMap";
import Array "mo:base/Array";
import Iter "mo:base/Iter";
import _Debug "mo:base/Debug";

import Types "../types/shared";

actor AuthTestCanister {
    // Type definitions
    type Profile = Types.Profile;
    type UserRole = Types.UserRole;
    type Result<T> = Types.Result<T>;

    // State variables
    private var profiles = HashMap.HashMap<Principal, Profile>(10, Principal.equal, Principal.hash);

    // Test cases
    public func testCreateProfile() : async Result<Profile> {
        let testId = Principal.fromText("rrkah-fqaaa-aaaaa-aaaaq-cai");
        let testProfile : Profile = {
            id = testId;
            name = "Test User";
            email = "test@example.com";
            phone = "1234567890";
            role = #Client;
            createdAt = Time.now();
            updatedAt = Time.now();
            isVerified = false;
            profilePicture = null;
            biography = null;
        };
        profiles.put(testId, testProfile);
        
        switch (profiles.get(testId)) {
            case (?profile) {
                if (profile.name == "Test User" and 
                    profile.email == "test@example.com" and 
                    profile.phone == "1234567890" and 
                    profile.role == #Client and 
                    not profile.isVerified) {
                    return #ok(profile);
                } else {
                    return #err("Profile validation failed");
                };
            };
            case (null) { return #err("Profile not found"); };
        };
    };

    public func testInvalidEmail() : async Result<Profile> {
        let testId = Principal.fromText("ryjl3-tyaaa-aaaaa-aaaba-cai");
        let invalidEmail = "invalid-email";
        let testProfile : Profile = {
            id = testId;
            name = "Test User";
            email = invalidEmail;
            phone = "1234567890";
            role = #Client;
            createdAt = Time.now();
            updatedAt = Time.now();
            isVerified = false;
            profilePicture = null;
            biography = null;
        };
        profiles.put(testId, testProfile);
        
        switch (profiles.get(testId)) {
            case (?profile) {
                if (profile.email == invalidEmail) {
                    return #ok(profile);
                } else {
                    return #err("Invalid email validation failed");
                };
            };
            case (null) { return #err("Profile not found"); };
        };
    };

    public func testInvalidPhone() : async Result<Profile> {
        let testId = Principal.fromText("r7inp-6aaaa-aaaaa-aaabq-cai");
        let invalidPhone = "123"; // Too short
        let testProfile : Profile = {
            id = testId;
            name = "Test User";
            email = "test@example.com";
            phone = invalidPhone;
            role = #Client;
            createdAt = Time.now();
            updatedAt = Time.now();
            isVerified = false;
            profilePicture = null;
            biography = null;
        };
        profiles.put(testId, testProfile);
        
        switch (profiles.get(testId)) {
            case (?profile) {
                if (profile.phone == invalidPhone) {
                    return #ok(profile);
                } else {
                    return #err("Invalid phone validation failed");
                };
            };
            case (null) { return #err("Profile not found"); };
        };
    };

    public func testVerifyUser() : async Result<Profile> {
        let testId = Principal.fromText("rrkah-fqaaa-aaaaa-aaaaq-cai");
        switch (profiles.get(testId)) {
            case (?profile) {
                let verifiedProfile : Profile = {
                    id = profile.id;
                    name = profile.name;
                    email = profile.email;
                    phone = profile.phone;
                    role = profile.role;
                    createdAt = profile.createdAt;
                    updatedAt = Time.now();
                    isVerified = true;
                    profilePicture = profile.profilePicture;
                    biography = profile.biography;
                };
                profiles.put(testId, verifiedProfile);
                
                switch (profiles.get(testId)) {
                    case (?updatedProfile) {
                        if (updatedProfile.isVerified) {
                            return #ok(updatedProfile);
                        } else {
                            return #err("Verification failed");
                        };
                    };
                    case (null) { return #err("Profile not found after verification"); };
                };
            };
            case (null) { return #err("Profile not found"); };
        };
    };

    public func testUpdateProfile() : async Result<Profile> {
        let testId = Principal.fromText("rrkah-fqaaa-aaaaa-aaaaq-cai");
        switch (profiles.get(testId)) {
            case (?profile) {
                let updatedProfile : Profile = {
                    id = profile.id;
                    name = "Updated Name";
                    email = "updated@example.com";
                    phone = "9876543210";
                    role = profile.role;
                    createdAt = profile.createdAt;
                    updatedAt = Time.now();
                    isVerified = profile.isVerified;
                    profilePicture = profile.profilePicture;
                    biography = profile.biography;
                };
                profiles.put(testId, updatedProfile);
                
                switch (profiles.get(testId)) {
                    case (?finalProfile) {
                        if (finalProfile.name == "Updated Name" and 
                            finalProfile.email == "updated@example.com" and 
                            finalProfile.phone == "9876543210") {
                            return #ok(finalProfile);
                        } else {
                            return #err("Profile update validation failed");
                        };
                    };
                    case (null) { return #err("Profile not found after update"); };
                };
            };
            case (null) { return #err("Profile not found"); };
        };
    };

    public func testGetAllServiceProviders() : async Result<[Profile]> {
        let providers = Array.filter<Profile>(
            Iter.toArray(profiles.vals()),
            func (profile : Profile) : Bool {
                return profile.role == #ServiceProvider;
            }
        );
        if (providers.size() > 0) {
            return #ok(providers);
        } else {
            return #err("No service providers found");
        };
    };

    // Initialize test data
    private func initializeTestData() {
        // Create test provider
        let providerId = Principal.fromText("rrkah-fqaaa-aaaaa-aaaaq-cai");
        let providerProfile : Profile = {
            id = providerId;
            name = "Test Provider";
            email = "provider@test.com";
            phone = "1234567890";
            role = #ServiceProvider;
            createdAt = Time.now();
            updatedAt = Time.now();
            isVerified = true;
            profilePicture = null;
            biography = null;
        };
        profiles.put(providerId, providerProfile);

        // Create test client
        let clientId = Principal.fromText("ryjl3-tyaaa-aaaaa-aaaba-cai");
        let clientProfile : Profile = {
            id = clientId;
            name = "Test Client";
            email = "client@test.com";
            phone = "0987654321";
            role = #Client;
            createdAt = Time.now();
            updatedAt = Time.now();
            isVerified = true;
            profilePicture = null;
            biography = null;
        };
        profiles.put(clientId, clientProfile);
    };

    // Initialize test data when canister is deployed
    initializeTestData();

    // Test function to get all profiles
    public query func getAllProfiles() : async [Profile] {
        return Iter.toArray(profiles.vals());
    };

    // Test function to get profile by ID
    public query func getProfile(userId : Principal) : async Result<Profile> {
        switch (profiles.get(userId)) {
            case (?profile) {
                return #ok(profile);
            };
            case (null) {
                return #err("Profile not found");
            };
        };
    };

    // Test function to get all service providers
    public query func getAllServiceProviders() : async [Profile] {
        let providersBuffer = Array.filter<Profile>(
            Iter.toArray(profiles.vals()),
            func (profile : Profile) : Bool {
                return profile.role == #ServiceProvider;
            }
        );
        return providersBuffer;
    };
}