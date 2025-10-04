export type Theme = 'light' | 'dark' | 'warm';

export interface Plot {
  id: string;
  plotNumber: string;
  size: string;
  lpNumber: string;
  status: 'Available' | 'Sold' | 'Registered';
  customer?: string;
  crop?: string;
  layout?: string;
  latitude?: number;
  longitude?: number;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  addressline1: string;
  addressline2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface Layout {
  id: string;
  name: string;
  extent: number;
  addressline1: string;
  addressline2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  latitude?: number;
  longitude?: number;
  numberOfPlots?: number;
  numberOfSoldPlots?: number;
  numberOfAvailablePlots?: number;
  numberOfRegisteredPlots?: number;
}

export interface Price {
  id: string;
  name: string;
  layout: string;
  pricePerAcre: number;
  minSize: number;
  maxSize: number;
  crop: string;
  validFrom: string;
  validTo?: string;
}

export interface Coupon {
  id: string;
  code: string;
  description?: string;
  discountType: 'Percentage' | 'Fixed';
  discountValue: number;
  validFrom: string;
  validTo?: string;
  usageLimit?: number;
  usedCount: number;
}