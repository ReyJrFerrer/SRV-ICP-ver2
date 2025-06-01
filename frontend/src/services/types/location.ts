// Location-related types aligned with Motoko backend
import { Coordinates } from './common';

// Location interface matching Motoko backend
export interface Location {
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

// Service location interface for frontend usage
export interface ServiceLocation {
  address: string;
  coordinates: Coordinates;
  serviceRadius: number;
  serviceRadiusUnit: string;
}
