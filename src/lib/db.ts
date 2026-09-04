import fs from 'fs';
import path from 'path';
import { User, Listing, Order, DemandPost, Route, PriceCacheRecord } from '@/types';
import seedData from '@/data/agmarknet_seed_data.json';

interface DatabaseSchema {
  users: User[];
  listings: Listing[];
  orders: Order[];
  demand_posts: DemandPost[];
  routes: Route[];
  price_cache: PriceCacheRecord[];
}

const DB_FILE = path.join(process.cwd(), 'src', 'data', 'db_store.json');

// Initial seed users
const INITIAL_USERS: User[] = [
  {
    id: 'usr_farmer_ramesh',
    name: 'Ramesh Kumar (रामेश)',
    phone: '9876543210',
    email: 'ramesh@farms.in',
    role: 'farmer',
    village: 'Dharuhera, Rewari',
    pincode: '123106',
    lat: 28.2055,
    lng: 76.7944,
    preferred_language: 'hi',
    created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
  },
  {
    id: 'usr_farmer_suresh',
    name: 'Suresh Yadav (सुरेश)',
    phone: '9876543211',
    email: 'suresh@karnalfarms.org',
    role: 'farmer',
    village: 'Taraori, Karnal',
    pincode: '132116',
    lat: 29.8020,
    lng: 76.9290,
    preferred_language: 'hi',
    created_at: new Date(Date.now() - 25 * 86400000).toISOString(),
  },
  {
    id: 'usr_farmer_baljit',
    name: 'Baljit Singh (बलजीत)',
    phone: '9876543212',
    email: 'baljit@rohtakfpo.in',
    role: 'farmer',
    village: 'Sampla, Rohtak',
    pincode: '124501',
    lat: 28.7758,
    lng: 76.7725,
    preferred_language: 'hi',
    created_at: new Date(Date.now() - 20 * 86400000).toISOString(),
  },
  {
    id: 'usr_consumer_priya',
    name: 'Priya Sharma (प्रिया)',
    phone: '9812345670',
    email: 'priya.sharma@gmail.com',
    role: 'consumer',
    village: 'Sector 56, Gurugram',
    pincode: '122011',
    lat: 28.4320,
    lng: 77.1025,
    preferred_language: 'en',
    created_at: new Date(Date.now() - 15 * 86400000).toISOString(),
  },
  {
    id: 'usr_consumer_ankit',
    name: 'Ankit Verma (अंकित)',
    phone: '9812345671',
    email: 'ankit.v@outlook.com',
    role: 'consumer',
    village: 'Dwarka Sector 12, New Delhi',
    pincode: '110075',
    lat: 28.5921,
    lng: 77.0460,
    preferred_language: 'en',
    created_at: new Date(Date.now() - 10 * 86400000).toISOString(),
  },
  {
    id: 'usr_bulk_sanjay',
    name: 'Sanjay Mehra (Grand Imperial Hotels)',
    phone: '9811122233',
    email: 'procurement@grandimperial.com',
    role: 'bulk_buyer',
    village: 'Connaught Place, Central Delhi',
    pincode: '110001',
    lat: 28.6304,
    lng: 77.2177,
    preferred_language: 'en',
    created_at: new Date(Date.now() - 28 * 86400000).toISOString(),
  },
  {
    id: 'usr_admin_doca',
    name: 'DoCA Inspector / Jury Evaluator',
    phone: '9999900000',
    email: 'evaluator@doca.gov.in',
    role: 'admin',
    village: 'Krishi Bhawan, New Delhi',
    pincode: '110001',
    lat: 28.6200,
    lng: 77.2100,
    preferred_language: 'en',
    created_at: new Date(Date.now() - 60 * 86400000).toISOString(),
  }
];

// Helper to generate realistic price_cache entries
function generatePriceCache(): PriceCacheRecord[] {
  const records: PriceCacheRecord[] = [];
  const now = Date.now();
  const dayMs = 86400000;

  seedData.crops.forEach(crop => {
    seedData.mandis.forEach(mandi => {
      // 30 days of historical data
      for (let i = 30; i >= 0; i--) {
        const date = new Date(now - i * dayMs).toISOString().split('T')[0];
        // small sinusoidal trend + noise
        const dayVariance = Math.sin(i / 4) * 2 + (Math.sin(i * 1.5) * 1.2);
        const modal = Math.max(10, Math.round(crop.typical_mandi_modal + dayVariance));
        const min = Math.round(modal * 0.88);
        const max = Math.round(modal * 1.15);
        const arrivals = Math.round(150 + Math.sin(i / 3) * 40 + (i % 5) * 10);

        records.push({
          id: `pc_${crop.name.toLowerCase()}_${mandi.name.replace(/\s+/g, '').toLowerCase()}_${date}`,
          crop_name: crop.name,
          mandi_region: mandi.name,
          price_date: date,
          modal_price: modal,
          min_price: min,
          max_price: max,
          arrivals_qty: arrivals
        });
      }
    });
  });

  return records;
}

// Helper to generate initial listings
function generateInitialListings(): Listing[] {
  const listings: Listing[] = [
    {
      id: 'lst_tomato_01',
      farmer_id: 'usr_farmer_ramesh',
      farmer_name: 'Ramesh Kumar (रामेश)',
      farmer_village: 'Dharuhera, Rewari',
      farmer_pincode: '123106',
      farmer_lat: 28.2055,
      farmer_lng: 76.7944,
      crop_name: 'Tomato',
      quantity_kg: 850,
      price_per_kg: 22,
      ai_suggested_price: 23,
      mandi_benchmark_price: 24,
      harvest_date: new Date(Date.now() - 1 * 86400000).toISOString().split('T')[0],
      status: 'active',
      created_at: new Date(Date.now() - 1 * 86400000).toISOString(),
      image_url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&auto=format&fit=crop&q=80',
    },
    {
      id: 'lst_onion_01',
      farmer_id: 'usr_farmer_ramesh',
      farmer_name: 'Ramesh Kumar (रामेश)',
      farmer_village: 'Dharuhera, Rewari',
      farmer_pincode: '123106',
      farmer_lat: 28.2055,
      farmer_lng: 76.7944,
      crop_name: 'Onion',
      quantity_kg: 1400,
      price_per_kg: 26,
      ai_suggested_price: 27,
      mandi_benchmark_price: 28,
      harvest_date: new Date(Date.now() - 3 * 86400000).toISOString().split('T')[0],
      status: 'active',
      created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
      image_url: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=500&auto=format&fit=crop&q=80',
    },
    {
      id: 'lst_potato_01',
      farmer_id: 'usr_farmer_suresh',
      farmer_name: 'Suresh Yadav (सुरेश)',
      farmer_village: 'Taraori, Karnal',
      farmer_pincode: '132116',
      farmer_lat: 29.8020,
      farmer_lng: 76.9290,
      crop_name: 'Potato',
      quantity_kg: 2500,
      price_per_kg: 16,
      ai_suggested_price: 17,
      mandi_benchmark_price: 18,
      harvest_date: new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0],
      status: 'active',
      created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
      image_url: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=500&auto=format&fit=crop&q=80',
    },
    {
      id: 'lst_mustard_01',
      farmer_id: 'usr_farmer_suresh',
      farmer_name: 'Suresh Yadav (सुरेश)',
      farmer_village: 'Taraori, Karnal',
      farmer_pincode: '132116',
      farmer_lat: 29.8020,
      farmer_lng: 76.9290,
      crop_name: 'Mustard',
      quantity_kg: 1200,
      price_per_kg: 52,
      ai_suggested_price: 53,
      mandi_benchmark_price: 55,
      harvest_date: new Date(Date.now() - 4 * 86400000).toISOString().split('T')[0],
      status: 'active',
      created_at: new Date(Date.now() - 4 * 86400000).toISOString(),
      image_url: 'https://images.unsplash.com/photo-1508747703725-719777637510?w=500&auto=format&fit=crop&q=80',
    },
    {
      id: 'lst_wheat_01',
      farmer_id: 'usr_farmer_baljit',
      farmer_name: 'Baljit Singh (बलजीत)',
      farmer_village: 'Sampla, Rohtak',
      farmer_pincode: '124501',
      farmer_lat: 28.7758,
      farmer_lng: 76.7725,
      crop_name: 'Wheat',
      quantity_kg: 4000,
      price_per_kg: 24.5,
      ai_suggested_price: 25,
      mandi_benchmark_price: 26,
      harvest_date: new Date(Date.now() - 5 * 86400000).toISOString().split('T')[0],
      status: 'active',
      created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
      image_url: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500&auto=format&fit=crop&q=80',
    },
    {
      id: 'lst_cauliflower_01',
      farmer_id: 'usr_farmer_baljit',
      farmer_name: 'Baljit Singh (बलजीत)',
      farmer_village: 'Sampla, Rohtak',
      farmer_pincode: '124501',
      farmer_lat: 28.7758,
      farmer_lng: 76.7725,
      crop_name: 'Cauliflower',
      quantity_kg: 600,
      price_per_kg: 20,
      ai_suggested_price: 21,
      mandi_benchmark_price: 22,
      harvest_date: new Date(Date.now() - 1 * 86400000).toISOString().split('T')[0],
      status: 'active',
      created_at: new Date(Date.now() - 1 * 86400000).toISOString(),
      image_url: 'https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?w=500&auto=format&fit=crop&q=80',
    }
  ];
  return listings;
}

// Initial demo orders
function generateInitialOrders(): Order[] {
  return [
    {
      id: 'ord_demo_01',
      listing_id: 'lst_tomato_01',
      buyer_id: 'usr_consumer_priya',
      buyer_name: 'Priya Sharma',
      crop_name: 'Tomato',
      farmer_id: 'usr_farmer_ramesh',
      farmer_name: 'Ramesh Kumar',
      farmer_village: 'Dharuhera, Rewari',
      quantity_kg: 10,
      total_price: 220,
      payment_status: 'test_paid',
      delivery_status: 'out_for_delivery',
      delivery_address: 'Flat 402, Oakwood Apts, Sector 56, Gurugram',
      created_at: new Date(Date.now() - 4 * 3600000).toISOString()
    },
    {
      id: 'ord_demo_02',
      listing_id: 'lst_onion_01',
      buyer_id: 'usr_consumer_ankit',
      buyer_name: 'Ankit Verma',
      crop_name: 'Onion',
      farmer_id: 'usr_farmer_ramesh',
      farmer_name: 'Ramesh Kumar',
      farmer_village: 'Dharuhera, Rewari',
      quantity_kg: 25,
      total_price: 650,
      payment_status: 'test_paid',
      delivery_status: 'confirmed',
      delivery_address: 'B-12, Sector 12 Pocket 4, Dwarka, New Delhi',
      created_at: new Date(Date.now() - 8 * 3600000).toISOString()
    },
    {
      id: 'ord_demo_03',
      listing_id: 'lst_potato_01',
      buyer_id: 'usr_bulk_sanjay',
      buyer_name: 'Sanjay Mehra (Grand Imperial Hotels)',
      crop_name: 'Potato',
      farmer_id: 'usr_farmer_suresh',
      farmer_name: 'Suresh Yadav',
      farmer_village: 'Taraori, Karnal',
      quantity_kg: 400,
      total_price: 6400,
      payment_status: 'test_paid',
      delivery_status: 'routed',
      delivery_address: 'Grand Imperial Hotel Kitchen Sourcing Dock, CP, New Delhi',
      created_at: new Date(Date.now() - 14 * 3600000).toISOString()
    }
  ];
}

class ResilientDatabase {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.load();
  }

  private load(): DatabaseSchema {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (e) {
      console.warn('Could not read db_store.json, creating initial in-memory state');
    }

    const initial: DatabaseSchema = {
      users: INITIAL_USERS,
      listings: generateInitialListings(),
      orders: generateInitialOrders(),
      demand_posts: [
        {
          id: 'dmd_onion_01',
          buyer_id: 'usr_bulk_sanjay',
          buyer_name: 'Sanjay Mehra (Grand Imperial Hotels)',
          crop_name: 'Onion',
          quantity_kg: 350,
          frequency: 'weekly',
          delivery_address: 'Central Kitchen Loading Dock 2, Connaught Place, New Delhi',
          created_at: new Date(Date.now() - 2 * 86400000).toISOString()
        }
      ],
      routes: [],
      price_cache: generatePriceCache()
    };

    this.save(initial);
    return initial;
  }

  private save(data: DatabaseSchema) {
    try {
      const dir = path.dirname(DB_FILE);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (e) {
      console.warn('Could not persist to db_store.json');
    }
  }

  public resetToSeed(): DatabaseSchema {
    const initial: DatabaseSchema = {
      users: INITIAL_USERS,
      listings: generateInitialListings(),
      orders: generateInitialOrders(),
      demand_posts: [
        {
          id: 'dmd_onion_01',
          buyer_id: 'usr_bulk_sanjay',
          buyer_name: 'Sanjay Mehra (Grand Imperial Hotels)',
          crop_name: 'Onion',
          quantity_kg: 350,
          frequency: 'weekly',
          delivery_address: 'Central Kitchen Loading Dock 2, Connaught Place, New Delhi',
          created_at: new Date(Date.now() - 2 * 86400000).toISOString()
        }
      ],
      routes: [],
      price_cache: generatePriceCache()
    };
    this.data = initial;
    this.save(initial);
    return this.data;
  }

  // Users
  public getUsers(): User[] {
    return this.data.users;
  }

  public getUserById(id: string): User | undefined {
    return this.data.users.find(u => u.id === id);
  }

  public getUserByPhone(phone: string): User | undefined {
    return this.data.users.find(u => u.phone === phone);
  }

  public createUser(user: Omit<User, 'id' | 'created_at'>): User {
    const newUser: User = {
      ...user,
      id: `usr_${Date.now()}`,
      created_at: new Date().toISOString()
    };
    this.data.users.push(newUser);
    this.save(this.data);
    return newUser;
  }

  // Listings
  public getListings(filters?: { crop_name?: string; status?: string; farmer_id?: string }): Listing[] {
    return this.data.listings.filter(item => {
      if (filters?.crop_name && item.crop_name.toLowerCase() !== filters.crop_name.toLowerCase()) return false;
      if (filters?.status && item.status !== filters.status) return false;
      if (filters?.farmer_id && item.farmer_id !== filters.farmer_id) return false;
      return true;
    });
  }

  public getListingById(id: string): Listing | undefined {
    return this.data.listings.find(l => l.id === id);
  }

  public createListing(listing: Omit<Listing, 'id' | 'created_at' | 'status'>): Listing {
    const newListing: Listing = {
      ...listing,
      id: `lst_${Date.now()}`,
      status: 'active',
      created_at: new Date().toISOString()
    };
    this.data.listings.unshift(newListing);
    this.save(this.data);
    return newListing;
  }

  public updateListing(id: string, updates: Partial<Listing>): Listing | undefined {
    const idx = this.data.listings.findIndex(l => l.id === id);
    if (idx === -1) return undefined;
    this.data.listings[idx] = { ...this.data.listings[idx], ...updates };
    this.save(this.data);
    return this.data.listings[idx];
  }

  // Orders
  public getOrders(filters?: { buyer_id?: string; farmer_id?: string }): Order[] {
    return this.data.orders.filter(ord => {
      if (filters?.buyer_id && ord.buyer_id !== filters.buyer_id) return false;
      if (filters?.farmer_id && ord.farmer_id !== filters.farmer_id) return false;
      return true;
    });
  }

  public getOrderById(id: string): Order | undefined {
    return this.data.orders.find(o => o.id === id);
  }

  public createOrder(order: Omit<Order, 'id' | 'created_at'>): Order {
    const newOrder: Order = {
      ...order,
      id: `ord_${Date.now()}`,
      created_at: new Date().toISOString()
    };
    this.data.orders.unshift(newOrder);

    // deduct quantity from listing
    const listing = this.data.listings.find(l => l.id === order.listing_id);
    if (listing) {
      const remaining = Math.max(0, listing.quantity_kg - order.quantity_kg);
      listing.quantity_kg = remaining;
      if (remaining === 0) {
        listing.status = 'sold_out';
      }
    }

    this.save(this.data);
    return newOrder;
  }

  public updateOrderStatus(id: string, delivery_status: Order['delivery_status'], payment_status?: Order['payment_status']): Order | undefined {
    const idx = this.data.orders.findIndex(o => o.id === id);
    if (idx === -1) return undefined;
    this.data.orders[idx].delivery_status = delivery_status;
    if (payment_status) {
      this.data.orders[idx].payment_status = payment_status;
    }
    this.save(this.data);
    return this.data.orders[idx];
  }

  // Demand Posts
  public getDemandPosts(): DemandPost[] {
    return this.data.demand_posts;
  }

  public createDemandPost(post: Omit<DemandPost, 'id' | 'created_at'>): DemandPost {
    const newPost: DemandPost = {
      ...post,
      id: `dmd_${Date.now()}`,
      created_at: new Date().toISOString()
    };
    this.data.demand_posts.unshift(newPost);
    this.save(this.data);
    return newPost;
  }

  // Price Cache
  public getPriceCache(cropName?: string, region?: string): PriceCacheRecord[] {
    return this.data.price_cache.filter(pc => {
      if (cropName && pc.crop_name.toLowerCase() !== cropName.toLowerCase()) return false;
      if (region && !pc.mandi_region.toLowerCase().includes(region.toLowerCase())) return false;
      return true;
    });
  }

  public getLatestPrice(cropName: string, region?: string): PriceCacheRecord | undefined {
    const records = this.getPriceCache(cropName, region);
    if (records.length === 0) return undefined;
    return records.sort((a, b) => new Date(b.price_date).getTime() - new Date(a.price_date).getTime())[0];
  }

  // Routes
  public getRoutes(): Route[] {
    return this.data.routes;
  }

  public createRoute(route: Omit<Route, 'id' | 'created_at'>): Route {
    const newRoute: Route = {
      ...route,
      id: `rt_${Date.now()}`,
      created_at: new Date().toISOString()
    };
    this.data.routes.unshift(newRoute);
    this.save(this.data);
    return newRoute;
  }
}

export const db = new ResilientDatabase();
