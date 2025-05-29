import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Time "mo:base/Time";
import HashMap "mo:base/HashMap";
import Error "mo:base/Error";
import Array "mo:base/Array";
import Iter "mo:base/Iter";
import Debug "mo:base/Debug";

import Types "../types/shared";
import Helpers "../utils/helpers";

actor AuthCanister {
    // Type definitions
    type Profile = Types.Profile;
    type UserRole = Types.UserRole;
    type Result<T> = Types.Result<T>;

    // State variables
    private stable var profileEntries : [(Principal, Profile)] = [];
    private var profiles = HashMap.HashMap<Principal, Profile>(10, Principal.equal, Principal.hash);

    // Initialization
    system func preupgrade() {
        profileEntries := Iter.toArray(profiles.entries());
    };

    system func postupgrade() {
        profiles := HashMap.fromIter<Principal, Profile>(profileEntries.vals(), 10, Principal.equal, Principal.hash);
        profileEntries := [];
    };

    // Public functions
    
    // Create a new user profile
    public shared(msg) func createProfile(
        name : Text,
        email : Text,
        phone : Text,
        role : UserRole
    ) : async Result<Profile> {
        let caller = msg.caller;
        
        if (Principal.isAnonymous(caller)) {
            return #err("Anonymous principal not allowed");
        };
        
        switch (profiles.get(caller)) {
            case (?existingProfile) {
                return #err("Profile already exists");
            };
            case (null) {
                let newProfile : Profile = {
                    id = caller;
                    name = name;
                    email = email;
                    phone = phone;
                    role = role;
                    createdAt = Time.now();
                    updatedAt = Time.now();
                    isVerified = false;
                };
                
                profiles.put(caller, newProfile);
                return #ok(newProfile);
            };
        };
    };
    
    // Get profile by principal
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
    
    // Get caller's profile
    public shared query(msg) func getMyProfile() : async Result<Profile> {
        let caller = msg.caller;
        
        if (Principal.isAnonymous(caller)) {
            return #err("Anonymous principal not allowed");
        };
        
        switch (profiles.get(caller)) {
            case (?profile) {
                return #ok(profile);
            };
            case (null) {
                return #err("Profile not found");
            };
        };
    };
    
    // Update user profile
    public shared(msg) func updateProfile(
        name : ?Text,
        email : ?Text,
        phone : ?Text
    ) : async Result<Profile> {
        let caller = msg.caller;
        
        if (Principal.isAnonymous(caller)) {
            return #err("Anonymous principal not allowed");
        };
        
        switch (profiles.get(caller)) {
            case (?existingProfile) {
                let updatedProfile : Profile = {
                    id = existingProfile.id;
                    name = switch(name) { case(?n) n; case(null) existingProfile.name };
                    email = switch(email) { case(?e) e; case(null) existingProfile.email };
                    phone = switch(phone) { case(?p) p; case(null) existingProfile.phone };
                    role = existingProfile.role;
                    createdAt = existingProfile.createdAt;
                    updatedAt = Time.now();
                    isVerified = existingProfile.isVerified;
                };
                
                profiles.put(caller, updatedProfile);
                return #ok(updatedProfile);
            };
            case (null) {
                return #err("Profile not found");
            };
        };
    };
    
    
    // Get all service providers (for discovery)
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