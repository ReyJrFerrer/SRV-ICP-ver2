# **Project Structure and Functionality**

**srv-ithink/**

**├── backend/                          # Motoko Backend (ICP Canisters)**

**│   ├── service/**

**│   │   ├── auth.mo                  # Authentication & User Management**

**│   │   ├── booking.mo               # Booking System**

**│   │   ├── review.mo                # Review Authenticity System**

**│   │   └── service.mo               # Service Discovery**x	

**│   ├── types/**

**│   │   └── shared.mo                # All type definitions**

**│   └── utils/**

**│       └── helpers.mo               # Common utility functions**

**│  ── ui/                              # Next.js Frontend**

**│   ├── components/**

**│   │   ├── client/                  # Client Module**

**│   │   ├── provider/                # Provider Module**

**│   │   └── shared/                  # Shared Components**

**│**

**│   ├── hooks/                       # Custom React Hooks**

**│   ├── services/                    # API Integration Layer**

**│   ├── contexts/                    # React Contexts**

**│   └── utils/                       # Frontend Utils**

**└── pages/**

	**├── client/                  # Client Module**

**├── provider/            # Provider Module**

**└── auth/                  # Authentication Pages**

# **Week 1: Core Functionality**

## **Module 1: Authentication System**

**File:** backend/cansiters/auth.mo

**Functionalities:**

- Internet Identity integration
- Principal-based user management
- Role assignment (Client/Provider)
- Basic profile creation

### **Core Functions:**

createUserProfile(userType: UserType, name: Text) -> Result<UserProfile, Text>

getUserProfile(principal: Principal) -> ?UserProfile

updateUserRole(principal: Principal, role: UserType) -> Result<(), Text>

### **Frontend Components:**

ui/components/shared/LoginButton.js - Internet Identity login

ui/components/shared/RoleSelector.js - Choose Client/Provider role

ui/pages/auth/login.js - Authentication page

---

## **Module 2: Service Discovery (Provider Side)**

File: backend/canisters/service.mo

### **Functionalities:**

Create service listings

Manage availability status

Location-based service storage

Basic service categorization

### **Core Functions:**

motokocreateService(title: Text, description: Text, category: Text, location: Text) -> Result<Service, Text>

updateAvailability(serviceId: Nat, available: Bool) -> Result<(), Text>

getServicesByLocation(location: Text) -> [Service]

### **Provider Components:**

ui/components/provider/ServiceCreation.js - Create new services

ui/components/provider/ServiceList.js - Manage existing services

ui/components/provider/AvailabilityToggle.js - Toggle availability

ui/pages/provider/dashboard.js - Provider main dashboard

---

## **Module 3: Service Discovery (Client Side)**

File: Same backend/canisters/service.mo

### **Functionalities:**

Search services by location

Filter by category

View service details

Check provider availability

### **Client Components:**

ui/components/client/ServiceSearch.js - Search interface

ui/components/client/ServiceCard.js - Service display card

ui/components/client/ServiceDetails.js - Detailed service view

ui/pages/client/search.js - Main search page

---

## **Module 4: Basic Booking System**

File: backend/canisters/booking.mo

### **Functionalities:**

Create booking requests

Accept/decline bookings (provider)

View booking history

Basic status management

### **Core Functions:**

motokocreateBooking(serviceId: Nat, clientNotes: Text, scheduledTime: Time) -> Result<Booking, Text>

updateBookingStatus(bookingId: Nat, status: BookingStatus) -> Result<(), Text>

getClientBookings(clientId: Principal) -> [Booking]

getProviderBookings(providerId: Principal) -> [Booking]

### **Client Components:**

ui/components/client/BookingForm.js - Create booking requests

ui/components/client/BookingHistory.js - View past bookings

ui/pages/client/bookings.js - Booking management page

### **Provider Components:**

ui/components/provider/BookingRequests.js - Handle incoming requests

ui/components/provider/ActiveBookings.js - Manage active bookings

ui/pages/provider/bookings.js - Booking management page

---

## **Module 5: Basic Messaging**

Files: ??

### **Functionalities:**

Simple chat interface

Booking-specific conversations

Real-time messaging (frontend state)

### **Shared Components:**

ui/components/shared/ChatInterface.js - Basic chat UI

ui/components/shared/MessageList.js - Display messages

ui/pages/shared/chat/[bookingId].js - Chat page

---

# **Week 2: Improvements**

## **Module 6: Review Authenticity System**

File: backend/canisters/review.mo

### **Functionalities:**

Booking-linked review creation

Review verification system

Prevent duplicate reviews

30-day review window enforcement

### **Core Functions:**

motokosubmitReview(bookingId: Nat, rating: Nat, reviewText: ?Text) -> Result<Review, Text>

verifyReviewEligibility(bookingId: Nat, clientId: Principal) -> Result<Bool, Text>

getVerifiedReviews(providerId: Principal) -> [Review]

### **Client Components:**

ui/components/client/ReviewForm.js - Submit reviews

ui/components/client/ReviewEligibility.js - Check review eligibility

### **Shared Components:**

ui/components/shared/ReviewDisplay.js - Display verified reviews

ui/components/shared/RatingStars.js - Star rating component

---

## **Module 7: Quality Control System**

File: Enhancement to backend/canisters/review.mo

### **Functionalities:**

Community flagging system

Basic credibility scoring

Review dispute mechanism

Auto-hide flagged content

### **Core Functions:**

motokoflagReview(reviewId: Nat, reason: FlagReason) -> Result<(), Text>

disputeReview(reviewId: Nat, reason: DisputeReason) -> Result<Nat, Text>

calculateCredibilityScore(userId: Principal) -> Float

Provider Components:

ui/components/provider/ReviewDisputes.js - Dispute management

ui/components/provider/ReviewAnalytics.js - Review insights

### **Shared Components:**

ui/components/shared/FlagReview.js - Flag suspicious reviews

ui/components/shared/CredibilityBadge.js - Show user credibility

---

## **Module 8: Evidence System**

File: Enhancement to backend/canisters/booking.mo

### **Functionalities:**

Photo upload for service completion

GPS location verification

Timestamp evidence

Service completion confirmation

### **Core Functions:**

motokosubmitServiceEvidence(bookingId: Nat, evidenceType: EvidenceType, content: Text) -> Result<(), Text>

confirmServiceCompletion(bookingId: Nat, role: UserType) -> Result<(), Text>

getBookingEvidence(bookingId: Nat) -> [Evidence]

### **Shared Components:**

ui/components/shared/EvidenceUpload.js - Upload evidence

ui/components/shared/ServiceCompletion.js - Confirm completion

ui/components/shared/EvidenceDisplay.js - View evidence

---

## **Module 9: Analytics Dashboard**

Files: Frontend calculations based on existing data

### **Functionalities:**

Provider performance metrics

Booking statistics

Review analytics

Revenue tracking (manual entry)

### **Provider Components:**

ui/components/provider/PerformanceMetrics.js - Key metrics display

ui/components/provider/BookingCharts.js - Visual analytics

ui/components/provider/ReviewInsights.js - Review analytics

ui/pages/provider/analytics.js - Analytics dashboard

---

## **Module 10: PWA Features**

Files: Next.js configuration and service workers

### **Functionalities:**

Offline capability

Push notifications

Install prompts

Mobile-first design

### **Configuration:**

next.config.js - PWA configuration

public/manifest.json - Web app manifest

public/sw.js - Service worker

### **Shared Components:**

ui/components/shared/NotificationManager.js - Handle notifications

ui/components/shared/OfflineIndicator.js - Offline status

# **Architecture Notes**

### **Backend:**

// auth.mo - Handles all user management

// service.mo - Handles service listings and discovery

// booking.mo - Handles booking lifecycle and evidence

// review.mo - Handles review authenticity and moderation

### **Frontend:**

// AuthContext - User authentication state

// BookingContext - Booking management state

// ServiceContext - Service discovery state

// ReviewContext - Review system state

### **API Integration Layer**

// services/auth-service.js - Authentication operations

// services/booking-service.js - Booking CRUD operations

// services/review-service.js - Review operations

// services/service-service.js - Service discovery operations

### **Data Flow**

User Auth → Service Discovery → Booking Creation → Service Completion → Review Submission → Quality Control

### **Verification Flow**

Completed Booking → Evidence Submission → Review Eligibility → Verified Review → Credibility Scoring

### **Client-SP Updates Flow**

Availability Status ↔ Service Discovery ↔ Booking Requests ↔ Status Updates ↔ Notifications