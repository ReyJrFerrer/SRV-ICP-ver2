import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Time "mo:base/Time";
import HashMap "mo:base/HashMap";
import Array "mo:base/Array";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Char "mo:base/Char";
import Types "../types/shared";

actor AuthCanister {
    // Type definitions
    type Profile = Types.Profile;
    type UserRole = Types.UserRole;
    type Result<T> = Types.Result<T>;

    // State variables
    private stable var profileEntries : [(Principal, Profile)] = [];
    private var profiles = HashMap.HashMap<Principal, Profile>(10, Principal.equal, Principal.hash);
    private var verifiedUsers = HashMap.HashMap<Principal, Bool>(10, Principal.equal, Principal.hash);

    // Constants
    private let MIN_NAME_LENGTH : Nat = 2;
    private let MAX_NAME_LENGTH : Nat = 50;
    private let MIN_EMAIL_LENGTH : Nat = 5;
    private let MAX_EMAIL_LENGTH : Nat = 100;
    private let MIN_PHONE_LENGTH : Nat = 10;
    private let MAX_PHONE_LENGTH : Nat = 15;

    // Initialization
    system func preupgrade() {
        profileEntries := Iter.toArray(profiles.entries());
    };

    system func postupgrade() {
        profiles := HashMap.fromIter<Principal, Profile>(profileEntries.vals(), 10, Principal.equal, Principal.hash);
        profileEntries := [];
    };

    // Helper functions
    private func validateEmail(email : Text) : Bool {
        if (email.size() < MIN_EMAIL_LENGTH or email.size() > MAX_EMAIL_LENGTH) {
            return false;
        };
        
        let chars = Text.toIter(email);
        var hasAt = false;
        var hasDot = false;
        var hasContentAfterDot = false;
        
        for (c in chars) {
            if (c == '@') {
                if (hasAt) return false;
                hasAt := true;
            } else if (c == '.') {
                if (not hasAt) return false;
                hasDot := true;
            } else if (hasDot) {
                hasContentAfterDot := true;
            };
        };
        
        hasAt and hasDot and hasContentAfterDot
    };

    private func validatePhone(phone : Text) : Bool {
        if (phone.size() < MIN_PHONE_LENGTH or phone.size() > MAX_PHONE_LENGTH) {
            return false;
        };
        
        let chars = Text.toIter(phone);
        var digitCount = 0;
        
        for (c in chars) {
            if (Char.isDigit(c)) {
                digitCount += 1;
            } else if (c != '+' and c != '-' and c != '(' and c != ')' and c != ' ') {
                return false;
            };
        };
        
        digitCount >= 10
    };

    private func validateName(name : Text) : Bool {
        name.size() >= MIN_NAME_LENGTH and name.size() <= MAX_NAME_LENGTH
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
        
        // Validate input
        if (not validateName(name)) {
            return #err("Invalid name length. Must be between " # Nat.toText(MIN_NAME_LENGTH) # " and " # Nat.toText(MAX_NAME_LENGTH) # " characters");
        };
        
        if (not validateEmail(email)) {
            return #err("Invalid email format");
        };
        
        if (not validatePhone(phone)) {
            return #err("Invalid phone format");
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
                verifiedUsers.put(caller, false);
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
                // Validate new values if provided
                switch(name) {
                    case(?n) {
                        if (not validateName(n)) {
                            return #err("Invalid name length. Must be between " # Nat.toText(MIN_NAME_LENGTH) # " and " # Nat.toText(MAX_NAME_LENGTH) # " characters");
                        };
                    };
                    case(null) {};
                };
                
                switch(email) {
                    case(?e) {
                        if (not validateEmail(e)) {
                            return #err("Invalid email format");
                        };
                    };
                    case(null) {};
                };
                
                switch(phone) {
                    case(?p) {
                        if (not validatePhone(p)) {
                            return #err("Invalid phone format");
                        };
                    };
                    case(null) {};
                };
                
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
    
    // Verify a user's identity
    public shared(msg) func verifyUser(userId : Principal) : async Result<Bool> {
        let caller = msg.caller;
        
        if (Principal.isAnonymous(caller)) {
            return #err("Anonymous principal not allowed");
        };
        
        // Only allow self-verification or admin verification
        if (caller != userId) {
            // TODO: Add admin check here when admin functionality is implemented
            return #err("Unauthorized to verify other users");
        };
        
        switch (profiles.get(userId)) {
            case (?profile) {
                if (profile.isVerified) {
                    return #err("User is already verified");
                };
                
                // Update verification status
                let updatedProfile : Profile = {
                    id = profile.id;
                    name = profile.name;
                    email = profile.email;
                    phone = profile.phone;
                    role = profile.role;
                    createdAt = profile.createdAt;
                    updatedAt = Time.now();
                    isVerified = true;
                };
                
                profiles.put(userId, updatedProfile);
                verifiedUsers.put(userId, true);
                return #ok(true);
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