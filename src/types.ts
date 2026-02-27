export interface Property {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  fullAddress: string;
  description: string;
  amenities: string[];
  photos: string[];
  minRent: number;
  maxRent: number;
  availableUnits: number;
  totalUnits: number;
}

export interface Unit {
  id: string;
  propertyId: string;
  propertyName: string;
  unitNumber: string;
  beds: number;
  baths: number;
  sqft: number;
  rent: number;
  availableDate: string | null;
  availableNow: boolean;
  photos: string[];
  address: string;
}
