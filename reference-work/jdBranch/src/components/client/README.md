# Client Module Components

This directory contains the Next.js implementation of the client module for the service provider application.

## Overview

The client module provides a user interface for customers to browse, search, and book services from service providers. It's built with Next.js and styled with Tailwind CSS.

## Pages Structure

- `/client/index.tsx` - Redirects to the home page
- `/client/home.tsx` - Main dashboard with categories and top picks
- `/client/chat.tsx` - Messaging interface for communicating with service providers
- `/client/service-maps.tsx` - Map view for finding services by location
- `/client/categories/[slug].tsx` - View services by category
- `/client/service/view-all.tsx` - View all available services
- `/client/service/[slug].tsx` - Service detail page with booking functionality

## Components

The components have been adapted from React Native to Next.js:

- `BottomSheetNextjs.tsx` - A bottom sheet component for displaying additional content
- `SearchBarNextjs.tsx` - A search bar component for finding services
- `ServiceListItemNextjs.tsx` - A card component for displaying service information
- `ServiceLocationMapNextjs.tsx` - A map component for showing service locations
- `HeaderNextjs.tsx` - The header component with location information and search
- `CategoriesNextjs.tsx` - A grid of service categories
- `TopPicksNextjs.tsx` - A horizontal carousel of featured services
- `BottomNavigationNextjs.tsx` - Navigation tabs for the bottom of the screen

## Data Handling

The components load data from the `/assets` directory:
- `services.tsx` - Contains service data
- `categories.tsx` - Contains category data

The `serviceDataAdapter.ts` utility adapts the React Native data structure to work with Next.js, particularly for image handling.

## Styling

Styles are defined in:
- `/styles/client-components.css` - Custom styles for client components
- `/styles/globals.css` - Global styles

## Responsive Design

The components are designed to be responsive, adapting to both mobile and desktop views:
- Mobile-first approach with optimized layouts for small screens
- Grid layouts for larger screens
- Proper spacing and typography for all device sizes

## Usage

To use these components, simply navigate to the client pages from your application:

```
/client/home
/client/chat
/client/service-maps
/client/categories/{category-slug}
/client/service/{service-slug}
```
