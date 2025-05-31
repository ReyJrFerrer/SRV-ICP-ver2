# Canister Architecture & Process Flow Summary

## Main Canisters Overview

### 1. **Auth Canister** (`auth.mo`)

**Primary Role:** User authentication and profile management

- **Core Functions:**
    - Internet Identity integration
    - Principal-based user management
    - Role assignment (Client/Provider)
    - Basic profile creation and updates
- **Reputation Integration:**
    - Stores account creation timestamps for age calculations
    - Tracks user roles for reputation context
    - Provides user verification status

### 2. **Service Canister** (`service.mo`)

**Primary Role:** Service discovery and management

- **Core Functions:**
    - Create and manage service listings
    - Location-based service storage
    - Availability status management
    - Service categorization
- **Reputation Integration:**
    - Displays reputation-weighted ratings
    - Filters services by provider trust scores
    - Shows verified review counts

### 3. **Booking Canister** (`booking.mo`)

**Primary Role:** Booking lifecycle management

- **Core Functions:**
    - Create booking requests
    - Accept/decline bookings
    - Track booking status and completion
    - Evidence submission and verification
- **Reputation Integration:**
    - Links bookings to review eligibility
    - Stores service completion confirmations
    - Manages evidence for reputation scoring

### 4. **Review Canister** (`review.mo`)

**Primary Role:** Review submission and basic management

- **Core Functions:**
    - Submit reviews with booking verification
    - Basic review storage and retrieval
    - 30-day review window enforcement
- **Reputation Integration:**
    - Interfaces with reputation canister for analysis
    - Stores reputation flags and quality scores
    - Implements review hiding based on reputation analysis

### 5. **Reputation Canister** (`reputation.mo`)

**Primary Role:** Automated reputation management and fraud detection

- **Core Functions:**
    - Trust score calculation and management
    - Review bomb detection
    - Competitive manipulation detection
    - Evidence quality assessment
    - Automated review hiding/weighting
- **Integration Points:**
    - Receives data from all other canisters
    - Provides reputation scores and recommendations
    - Maintains detection algorithms and thresholds

---

## Process Flow Diagrams

### A. User Onboarding & Trust Building Flow

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   User Joins    │───▶│  Auth Canister  │───▶│ Reputation      │
│   Platform      │    │                 │    │ Canister        │
└─────────────────┘    │ • Create Profile│    │                 │
                       │ • Assign Role   │    │ • Initialize    │
                       │ • Store Timestamp│    │   Trust Score   │
                       └─────────────────┘    │ • Set New User  │
                                              │   Flags         │
                                              └─────────────────┘

```

### B. Service Discovery & Booking Flow

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Client        │───▶│  Service        │───▶│ Booking         │
│   Searches      │    │  Canister       │    │ Canister        │
└─────────────────┘    │                 │    │                 │
                       │ • Filter by     │    │ • Create        │
                       │   Location      │    │   Booking       │
                       │ • Show Rep.     │    │ • Link to       │
                       │   Ratings       │    │   Service       │
                       │ • Trust Badges  │    │ • Track Status  │
                       └─────────────────┘    └─────────────────┘
                              ▲                        │
                              │                        ▼
                       ┌─────────────────┐    ┌─────────────────┐
                       │ Reputation      │◀───│ Service         │
                       │ Canister        │    │ Completion      │
                       │                 │    │                 │
                       │ • Weighted      │    │ • Evidence      │
                       │   Ratings       │    │   Submission    │
                       │ • Trust Scores  │    │ • Mutual        │
                       │ • Verified      │    │   Confirmation  │
                       │   Reviews       │    └─────────────────┘
                       └─────────────────┘

```

### C. Review Submission & Analysis Flow

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ Service         │───▶│ Review          │───▶│ Reputation      │
│ Completed       │    │ Canister        │    │ Canister        │
└─────────────────┘    │                 │    │                 │
                       │ • Check         │    │ • Analyze       │
                       │   Eligibility   │    │   Review        │
                       │ • Basic         │    │ • Calculate     │
                       │   Validation    │    │   Trust Impact  │
                       │ • Store Review  │    │ • Run Detection │
                       └─────────────────┘    │   Algorithms    │
                              ▲                └─────────────────┘
                              │                        │
                              │                        ▼
                       ┌─────────────────┐    ┌─────────────────┐
                       │ Updated Review  │◀───│ Analysis        │
                       │ Status          │    │ Results         │
                       │                 │    │                 │
                       │ • Visibility    │    │ • Hide/Show     │
                       │ • Weight        │    │ • Flag Reason   │
                       │ • Quality Score │    │ • Trust Update  │
                       └─────────────────┘    └─────────────────┘

```

### D. Reputation Management Cycle

```
                    ┌─────────────────────────────────────────┐
                    │           REPUTATION CANISTER           │
                    │                                         │
    ┌───────────────┼─────────────────────────────────────────┼───────────────┐
    │               │                                         │               │
    ▼               │   ┌─────────────────┐                   │               ▼
┌─────────┐         │   │ Trust Score     │                   │         ┌─────────┐
│ Booking │────────────▶│ Calculator      │◀──────────────────────────▶│ Review  │
│ Data    │         │   │                 │                   │       │ Analysis│
└─────────┘         │   │ • Authenticity  │                   │         └─────────┘
    │               │   │ • Patterns      │                   │               │
    │               │   │ • Consistency   │                   │               │
    ▼               │   │ • Evidence      │                   │               ▼
┌─────────┐         │   │ • Network       │                   │         ┌─────────┐
│Evidence │────────────▶│                 │                   │         │Detection│
│Quality  │         │   └─────────────────┘                   │         │Engines  │
└─────────┘         │           │                             │         └─────────┘
    │               │           ▼                             │               │
    │               │   ┌─────────────────┐                   │               │
    │               │   │ Reputation      │                   │               │
    │               │   │ Actions         │                   │               │
    │               │   │                 │                   │               │
    │               │   │ • Hide Reviews  │                   │               │
    │               │   │ • Adjust Weights│                   │               │
    │               │   │ • Flag Users    │                   │               │
    │               │   │ • Update Scores │                   │               │
    │               │   └─────────────────┘                   │               │
    │               │           │                             │               │
    └───────────────┼───────────┼─────────────────────────────┼───────────────┘
                    │           ▼                             │
                    │   ┌─────────────────┐                   │
                    │   │ Service         │                   │
                    │   │ Reputation      │                   │
                    │   │ Updates         │                   │
                    │   └─────────────────┘                   │
                    └─────────────────────────────────────────┘

```

---

## Key Integration Points

### 1. **Cross-Canister Data Flow**

- **Auth → Reputation**: User creation timestamp, role verification
- **Booking → Reputation**: Completion status, evidence, cancellation rates
- **Review → Reputation**: Review content, timing, patterns
- **Service → Reputation**: Service categories, provider relationships
- **Reputation → All**: Trust scores, visibility flags, quality metrics

### 2. **Real-time Triggers**

- **Booking Completion** → Trust score update
- **Review Submission** → Immediate analysis and potential hiding
- **Evidence Upload** → Quality scoring and verification
- **User Activity** → Pattern analysis and fraud detection

### 3. **Feedback Loops**

- Trust scores influence review weights
- Review quality affects future trust calculations
- Service reputation impacts discovery rankings
- User behavior patterns trigger progressive restrictions

### 4. **Data Consistency**

- All canisters maintain Principal-based user references
- Booking IDs link reviews to completed services
- Service IDs connect ratings to providers
- Evidence IDs link proof to specific interactions


setCanister Work
### 5. **Canister Principal IDs**
- Auth
    // Set canister references
    public shared(msg) func setCanisterReferences(
        reputation : ?Principal
    ) : async Result<Text> {
        // In real implementation, need to check if caller has admin rights
        reputationCanisterId := reputation;
        return #ok("Canister references set successfully");
    };

- Booking
    // Set canister references
    public shared(msg) func setCanisterReferences(
        auth : ?Principal,
        service : ?Principal,
        review : ?Principal,
        reputation : ?Principal
    ) : async Result<Text> {
        // In real implementation, need to check if caller has admin rights
        authCanisterId := auth;
        serviceCanisterId := service;
        reviewCanisterId := review;
        reputationCanisterId := reputation;
        return #ok("Canister references set successfully");
    };
- Service 

    // Set canister references
    public shared(msg) func setCanisterReferences(
        auth : ?Principal,
        booking : ?Principal,
        review : ?Principal,
        reputation : ?Principal
    ) : async Result<Text> {
        // In real implementation, need to check if caller has admin rights
        authCanisterId := auth;
        bookingCanisterId := booking;
        reviewCanisterId := review;
        reputationCanisterId := reputation;
        return #ok("Canister references set successfully");
    };



- Review
    // Set canister references (admin function)
    public shared(_msg) func setCanisterReferences(
        booking : Principal,
        service : Principal,
        reputation : Principal,
        auth : Principal
    ) : async Result<Text> {
        // In real implementation, need to check if caller has admin rights
        bookingCanisterId := ?booking;
        serviceCanisterId := ?service;
        reputationCanisterId := ?reputation;
        authCanisterId := ?auth;
        
        return #ok("Canister references set successfully");
    };
    

- Reputation
    // Set canister references (admin function)
    public shared(msg) func setCanisterReferences(
        auth : Principal,
        booking : Principal,
        review : Principal,
        service : Principal
    ) : async Result<Text> {
        // In real implementation, need to check if caller has admin rights
        authCanisterId := ?auth;
        bookingCanisterId := ?booking;
        reviewCanisterId := ?review;
        serviceCanisterId := ?service;
        
        return #ok("Canister references set successfully");
    };






