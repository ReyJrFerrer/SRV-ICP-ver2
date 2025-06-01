// Category-related types aligned with Motoko backend
import { BaseEntity, MediaItem } from './common';

// ServiceCategory interface matching Motoko backend
export interface Category extends BaseEntity {
  name: string;
  description: string;
  parentId?: string;
  slug: string;
  imageUrl: string;
  icon?: string;
  services?: any[]; // Avoid circular dependency, use generic array
}

// Simplified category for UI components
export interface CategoryUI {
  id: string;
  name: string;
  description: string;
  slug: string;
  imageUrl: string;
  icon?: string;
}
