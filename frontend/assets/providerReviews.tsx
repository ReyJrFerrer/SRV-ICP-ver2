// Provider review interface
export interface ProviderReview {
  id: string;
  providerId: string;
  clientId: string;
  clientName: string;
  clientProfilePicture?: string;
  orderId: string;
  serviceTitle: string;
  rating: number;
  reviewText: string;
  reviewDate: Date;
  providerReply?: {
    text: string;
    replyDate: Date;
  };
  isPublic: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  helpfulCount: number;
  reportCount: number;
  isVerifiedPurchase: boolean;
  serviceType: string;
  serviceDate: Date;
}

// Sample provider reviews
export const PROVIDER_REVIEWS: ProviderReview[] = [
  {
    id: "review-001",
    providerId: "prov-001", // Mary Gold (House maid)
    clientId: "client-001",
    clientName: "John Smith",
    clientProfilePicture: "https://example.com/profiles/john-smith.jpg",
    orderId: "ord-001",
    serviceTitle: "House Cleaning - 4 Hours",
    rating: 5,
    reviewText: "Mary was extremely thorough and efficient. My apartment has never looked so clean! She paid attention to every detail and even organized areas I hadn't thought about. Highly recommend her services.",
    reviewDate: new Date("2025-03-19"),
    isPublic: true,
    isActive: true,
    createdAt: new Date("2025-03-19"),
    updatedAt: new Date("2025-03-19"),
    helpfulCount: 12,
    reportCount: 0,
    isVerifiedPurchase: true,
    serviceType: "Cleaning",
    serviceDate: new Date("2025-03-18"),
  },
  {
    id: "review-002",
    providerId: "prov-001", // Mary Gold (House maid)
    clientId: "client-005",
    clientName: "Emily Richards",
    clientProfilePicture: "https://example.com/profiles/emily-richards.jpg",
    orderId: "ord-005",
    serviceTitle: "Deep Cleaning - 6 Hours",
    rating: 4,
    reviewText: "Mary did a great job cleaning our home. She was on time and worked diligently the entire time. The only reason for 4 stars instead of 5 is that she missed cleaning under the sofa, but everything else was spotless.",
    reviewDate: new Date("2025-02-27"),
    providerReply: {
      text: "Thank you for your review, Emily! I appreciate your feedback and will be sure to double-check under furniture in future cleanings. I look forward to serving you again!",
      replyDate: new Date("2025-02-28")
    },
    isPublic: true,
    isActive: true,
    createdAt: new Date("2025-02-27"),
    updatedAt: new Date("2025-02-28"),
    helpfulCount: 8,
    reportCount: 0,
    isVerifiedPurchase: true,
    serviceType: "Cleaning",
    serviceDate: new Date("2025-02-26"),
  },
  {
    id: "review-003",
    providerId: "prov-002", // Silverston Eliot (Plumber)
    clientId: "client-002",
    clientName: "Alice Johnson",
    clientProfilePicture: "https://example.com/profiles/alice-johnson.jpg",
    orderId: "ord-002",
    serviceTitle: "Emergency Plumbing - Leaky Pipe",
    rating: 5,
    reviewText: "Silverston was a lifesaver! He responded to my emergency call within 20 minutes and fixed the leaking pipe that was causing a small flood in my kitchen. Professional, efficient, and very knowledgeable. Would definitely call him again for any plumbing issues.",
    reviewDate: new Date("2025-04-10"),
    isPublic: true,
    isActive: true,
    createdAt: new Date("2025-04-10"),
    updatedAt: new Date("2025-04-10"),
    helpfulCount: 15,
    reportCount: 0,
    isVerifiedPurchase: true,
    serviceType: "Plumbing",
    serviceDate: new Date("2025-04-09"),
  },
  {
    id: "review-004",
    providerId: "prov-002", // Silverston Eliot (Plumber)
    clientId: "client-006",
    clientName: "Michael Rodriguez",
    clientProfilePicture: "https://example.com/profiles/michael-rodriguez.jpg",
    orderId: "ord-006",
    serviceTitle: "Bathroom Pipe Installation",
    rating: 5,
    reviewText: "Excellent service from start to finish. Silverston handled the installation of new pipes in my bathroom renovation with great skill. He offered valuable advice on the best materials to use and ensured everything was installed correctly. No leaks and perfect water pressure!",
    reviewDate: new Date("2025-03-05"),
    providerReply: {
      text: "Thank you for the great review, Michael! It was a pleasure working on your bathroom renovation. Enjoy your new plumbing system, and don't hesitate to reach out if you need any adjustments or have any questions.",
      replyDate: new Date("2025-03-06")
    },
    isPublic: true,
    isActive: true,
    createdAt: new Date("2025-03-05"),
    updatedAt: new Date("2025-03-06"),
    helpfulCount: 10,
    reportCount: 0,
    isVerifiedPurchase: true,
    serviceType: "Plumbing",
    serviceDate: new Date("2025-03-02"),
  },
  {
    id: "review-005",
    providerId: "prov-003", // Juan Del JoJo (Appliance Technician)
    clientId: "client-003",
    clientName: "Robert Chen",
    clientProfilePicture: "https://example.com/profiles/robert-chen.jpg",
    orderId: "ord-003",
    serviceTitle: "Refrigerator Repair",
    rating: 5,
    reviewText: "Juan fixed our refrigerator that wasn't cooling properly. He diagnosed the problem quickly, explained what was wrong with the compressor, and had it fixed within a couple of hours. He was honest about the parts that needed replacement and didn't try to upsell unnecessary services. Refrigerator is working perfectly now!",
    reviewDate: new Date("2025-04-08"),
    isPublic: true,
    isActive: true,
    createdAt: new Date("2025-04-08"),
    updatedAt: new Date("2025-04-08"),
    helpfulCount: 18,
    reportCount: 0,
    isVerifiedPurchase: true,
    serviceType: "Appliance Repair",
    serviceDate: new Date("2025-04-07"),
  },
  {
    id: "review-006",
    providerId: "prov-003", // Juan Del JoJo (Appliance Technician)
    clientId: "client-007",
    clientName: "Sophia Williams",
    clientProfilePicture: "https://example.com/profiles/sophia-williams.jpg",
    orderId: "ord-007",
    serviceTitle: "Washing Machine Repair",
    rating: 3,
    reviewText: "Juan was polite and tried his best to fix my washing machine. However, the issue came back after two days. He did come back to look at it again without charging extra, but it still isn't working perfectly. I appreciate his effort but wish the repair had been more effective.",
    reviewDate: new Date("2025-02-18"),
    providerReply: {
      text: "I apologize that your washing machine is still having issues, Sophia. Sometimes older models have multiple problems that surface after the initial repair. I'd like to come back one more time to properly diagnose any additional issues and make sure your machine is working correctly. Please message me to schedule a convenient time.",
      replyDate: new Date("2025-02-19")
    },
    isPublic: true,
    isActive: true,
    createdAt: new Date("2025-02-18"),
    updatedAt: new Date("2025-02-19"),
    helpfulCount: 5,
    reportCount: 0,
    isVerifiedPurchase: true,
    serviceType: "Appliance Repair",
    serviceDate: new Date("2025-02-15"),
  },
  {
    id: "review-007",
    providerId: "prov-001", // Mary Gold (House maid)
    clientId: "client-008",
    clientName: "David Thompson",
    clientProfilePicture: "https://example.com/profiles/david-thompson.jpg",
    orderId: "ord-008",
    serviceTitle: "Move-out Cleaning",
    rating: 5,
    reviewText: "Hired Mary for a move-out cleaning and she exceeded all expectations! She tackled years of built-up dirt and grime in the kitchen and bathrooms, and made everything look brand new. Our landlord was impressed and we got our full security deposit back. Worth every penny!",
    reviewDate: new Date("2025-01-30"),
    providerReply: {
      text: "Thank you for the wonderful review, David! I'm thrilled that you got your full deposit back. Move-out cleanings are challenging but very rewarding. Wishing you all the best in your new home!",
      replyDate: new Date("2025-01-31")
    },
    isPublic: true,
    isActive: true,
    createdAt: new Date("2025-01-30"),
    updatedAt: new Date("2025-01-31"),
    helpfulCount: 22,
    reportCount: 0,
    isVerifiedPurchase: true,
    serviceType: "Cleaning",
    serviceDate: new Date("2025-01-28"),
  },
  {
    id: "review-008",
    providerId: "prov-002", // Silverston Eliot (Plumber)
    clientId: "client-009",
    clientName: "Jennifer Parker",
    clientProfilePicture: "https://example.com/profiles/jennifer-parker.jpg",
    orderId: "ord-009",
    serviceTitle: "Water Heater Installation",
    rating: 4,
    reviewText: "Silverston did a good job installing our new water heater. He was knowledgeable and efficient. The installation went smoothly, though he was about 30 minutes late for the appointment. The water heater works great, and he made sure to explain the maintenance requirements before leaving.",
    reviewDate: new Date("2025-03-22"),
    isPublic: true,
    isActive: true,
    createdAt: new Date("2025-03-22"),
    updatedAt: new Date("2025-03-22"),
    helpfulCount: 7,
    reportCount: 0,
    isVerifiedPurchase: true,
    serviceType: "Plumbing",
    serviceDate: new Date("2025-03-20"),
  },
  {
    id: "review-009",
    providerId: "prov-003", // Juan Del JoJo (Appliance Technician)
    clientId: "client-010",
    clientName: "Lisa Garcia",
    clientProfilePicture: "https://example.com/profiles/lisa-garcia.jpg",
    orderId: "ord-010",
    serviceTitle: "Dryer Vent Cleaning",
    rating: 5,
    reviewText: "Juan was amazing! He thoroughly cleaned our dryer vent system which had been clogged for months. He showed us the amount of lint he removed (it was shocking!) and explained how this was a fire hazard. Our dryer now works much more efficiently and clothes dry faster. Great service, reasonable price.",
    reviewDate: new Date("2025-04-05"),
    providerReply: {
      text: "Thank you for your review, Lisa! I'm glad I could help improve your dryer's efficiency and reduce the fire risk. Remember to schedule a cleaning annually to keep your system running safely!",
      replyDate: new Date("2025-04-06")
    },
    isPublic: true,
    isActive: true,
    createdAt: new Date("2025-04-05"),
    updatedAt: new Date("2025-04-06"),
    helpfulCount: 14,
    reportCount: 0,
    isVerifiedPurchase: true,
    serviceType: "Appliance Maintenance",
    serviceDate: new Date("2025-04-04"),
  },
  {
    id: "review-010",
    providerId: "prov-001", // Mary Gold (House maid)
    clientId: "client-011",
    clientName: "Kevin Martinez",
    clientProfilePicture: "https://example.com/profiles/kevin-martinez.jpg",
    orderId: "ord-011",
    serviceTitle: "Weekly Cleaning Service",
    rating: 2,
    reviewText: "Disappointed with the service. Mary seemed rushed and missed several areas that needed cleaning. The bathroom mirror still had streaks, and there was still dust on many surfaces. When I pointed these out, she did address them, but I expected better attention to detail from the start.",
    reviewDate: new Date("2025-02-10"),
    providerReply: {
      text: "I sincerely apologize for not meeting your expectations, Kevin. You're right that I should have been more thorough from the beginning. I would appreciate the opportunity to make it right with a complimentary touch-up cleaning. Please message me if you're interested.",
      replyDate: new Date("2025-02-11")
    },
    isPublic: true,
    isActive: true,
    createdAt: new Date("2025-02-10"),
    updatedAt: new Date("2025-02-11"),
    helpfulCount: 9,
    reportCount: 2,
    isVerifiedPurchase: true,
    serviceType: "Cleaning",
    serviceDate: new Date("2025-02-09"),
  }
];