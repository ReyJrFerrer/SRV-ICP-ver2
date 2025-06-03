import { Category } from './types/category/category';

import { SERVICES } from './services';

export const CATEGORIES: Category[] = [
    {
        id: "cat-001",
        name: "Home Services",
        description: "Professional home maintenance and improvement services",
        icon: "home",
        isActive: true,
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
        imageUrl: require('../assets/images/HomeServices-CoverImage.jpg'),
        slug: "home-services",
        services: SERVICES.filter(service => 
            !service.category.parentId && 
            service.category.slug.startsWith('home-')
        )
    },
    {
        id: "cat-001-01",
        name: "Cleaning Services",
        description: "Professional cleaning and housekeeping services",
        icon: "broom",
        parentId: "cat-001",
        isActive: true,
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
        imageUrl: require('../assets/images/CleaningServices-CoverImage.jpeg'),
        slug: "home-cleaning",
        services: SERVICES.filter(service => 
            service.category.slug === 'home-cleaning'
        )
    },
    {
        id: "cat-002",
        name: "Automobile Repairs",
        description: "Professional automobile maintenance and repair services",
        icon: "car",
        isActive: true,
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
        imageUrl: require('../assets/images/AutomobileRepairs-CoverImage.jpg'),
        slug: "auto-repairs",
        services: SERVICES.filter(service => 
            service.category.slug === 'auto-repairs'
        )
    },
    {
        id: "cat-003",
        name: "Gadget Technicians",
        description: "Professional repair and support for electronic devices",
        icon: "laptop",
        isActive: true,
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
        imageUrl: require('../assets/images/GadgetTechnician-CoverImage1.jpg'),
        slug: "gadget-tech",
        services: SERVICES.filter(service => 
            service.category.slug === 'gadget-tech'
        )
    },
    {
        id: "cat-004",
        name: "Beauty Services",
        description: "Professional beauty and grooming services",
        icon: "cut",
        isActive: true,
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
        imageUrl: require('../assets/images/BeautyServices-CoverImage.jpg'),
        slug: "beauty-services",
        services: SERVICES.filter(service => 
            service.category.slug === 'beauty-services'
        )
    },
    {
        id: "cat-005",
        name: "Delivery and Errands",
        description: "Professional delivery and errand running services",
        icon: "shipping-fast",
        isActive: true,
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
        imageUrl: require('../assets/images/Delivery-CoverImage.jpg'),
        slug: "delivery-errands",
        services: SERVICES.filter(service => 
            service.category.slug === 'delivery-errands'
        )
    },
    {
        id: "cat-006",
        name: "Beauty and Wellness",
        description: "Professional wellness and spa services",
        icon: "spa",
        isActive: true,
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
        imageUrl: require('../assets/images/Beauty&Wellness-CoverImage.jpg'),
        slug: "beauty-wellness",
        services: SERVICES.filter(service => 
            service.category.slug === 'beauty-wellness'
        )
    },
    {
        id: "cat-007",
        name: "Tutoring",
        description: "Professional educational tutoring services",
        icon: "chalkboard-teacher",
        isActive: true,
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
        imageUrl: require('../assets/images/Tutoring-CoverImage.jpg'),
        slug: "tutoring",
        services: SERVICES.filter(service => 
            service.category.slug === 'tutoring'
        )
    },
    {
        id: "cat-008",
        name: "Photographer",
        description: "Professional photography services",
        icon: "camera",
        isActive: true,
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
        imageUrl: require('../assets/images/Photographer-CoverImage.jpg'),
        slug: "photographer",
        services: SERVICES.filter(service => 
            service.category.slug === 'photographer'
        )
    }
];
