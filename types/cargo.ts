import type { CurrencyCode } from '~/shared/currency';

export type VehicleType = 'Awning' | 'Flatbed' | 'Refrigerated' | 'Tipper' | 'Tanker';

export type CargoPaymentMethod = 'CASH' | 'TRANSFER' | 'MIXED';

export type CargoStatus =
  | 'DRAFT'
  | 'PENDING_REVIEW'
  | 'PUBLISHED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'REJECTED'
  | 'EXPIRED';

export type GeoPoint = {
  lat: number;
  lng: number;
  address: string;
  city: string;
  region: string;
};

export type CargoOwner = {
  id: string;
  name: string;
  initials: string;
  phone: string;
  rating: number;
  postedCount: number;
  replyMinutes: number;
};

export type CargoImage = {
  url: string;
  alt: string;
};

export type Cargo = {
  id: string;
  title: string;
  description: string;
  cargoType: string;
  weightKg: number;
  volumeM3: number;
  requiredVehicleType: VehicleType;
  price: number;
  currency: CurrencyCode;
  priceNegotiable: boolean;
  paymentMethod: CargoPaymentMethod;
  advanceAmount?: number;
  trucksNeeded: number;
  isAdditionalLoad: boolean;
  readyToLoad: boolean;
  pickupDate: string;
  status: CargoStatus;
  pickup: GeoPoint;
  dropoff: GeoPoint;
  images: CargoImage[];
  owner: CargoOwner;
  publishedAt: string;
  expiresAt: string;
  viewCount: number;
};

export type CargoListResponse = {
  items: Cargo[];
  total: number;
};

export type SessionUser = {
  id: string;
  phone: string;
  fullName: string;
  role: 'CARGO_OWNER' | 'DRIVER';
  initials: string;
};
