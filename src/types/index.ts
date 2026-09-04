export type UserRole = 'farmer' | 'consumer' | 'bulk_buyer' | 'admin';

export interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role: UserRole;
  village?: string;
  pincode?: string;
  lat?: number;
  lng?: number;
  preferred_language: 'en' | 'hi';
  created_at: string;
}

export type ListingStatus = 'active' | 'sold_out' | 'expired' | 'removed';

export interface Listing {
  id: string;
  farmer_id: string;
  farmer_name?: string;
  farmer_village?: string;
  farmer_pincode?: string;
  farmer_lat?: number;
  farmer_lng?: number;
  crop_name: string;
  quantity_kg: number;
  price_per_kg: number;
  ai_suggested_price?: number;
  mandi_benchmark_price?: number;
  harvest_date: string;
  status: ListingStatus;
  created_at: string;
  image_url?: string;
  freshness?: string;
  freshness_confidence?: number;
  shelf_life?: string;
}

export type DemandFrequency = 'one_time' | 'weekly' | 'biweekly' | 'monthly';

export interface DemandPost {
  id: string;
  buyer_id: string;
  buyer_name?: string;
  crop_name: string;
  quantity_kg: number;
  frequency: DemandFrequency;
  delivery_address: string;
  created_at: string;
}

export type PaymentStatus = 'pending' | 'test_paid' | 'failed' | 'refunded';
export type DeliveryStatus = 'placed' | 'confirmed' | 'routed' | 'out_for_delivery' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  listing_id: string;
  buyer_id: string;
  demand_post_id?: string;
  quantity_kg: number;
  total_price: number;
  payment_status: PaymentStatus;
  delivery_status: DeliveryStatus;
  route_id?: string;
  delivery_address?: string;
  buyer_name?: string;
  crop_name?: string;
  farmer_name?: string;
  farmer_village?: string;
  farmer_id?: string;
  created_at: string;
}

export interface RouteStop {
  order_id: string;
  type: 'pickup' | 'drop';
  name: string;
  location_name: string;
  lat: number;
  lng: number;
  crop_name: string;
  quantity_kg: number;
  eta: string;
}

export interface Route {
  id: string;
  stop_sequence: RouteStop[];
  total_distance_km: number;
  total_time_min: number;
  distance_saved_km?: number;
  savings_pct?: number;
  created_at: string;
}

export interface PriceCacheRecord {
  id: string;
  crop_name: string;
  mandi_region: string;
  price_date: string;
  modal_price: number;
  min_price: number;
  max_price: number;
  arrivals_qty: number;
}
