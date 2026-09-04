import { PrismaClient, Role, ListingStatus, OrderStatus, DemandStatus } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting KisanSetu Prisma PostgreSQL Database Seed...');

  const dataPath = path.join(process.cwd(), 'src', 'data', 'db_store.json');
  if (!fs.existsSync(dataPath)) {
    console.error('❌ Data file not found:', dataPath);
    return;
  }

  const rawData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

  // 1. Seed Users
  console.log('👤 Seeding Users...');
  const users = rawData.users || [];
  for (const user of users) {
    const roleMapping: Record<string, Role> = {
      farmer: Role.FARMER,
      consumer: Role.CONSUMER,
      bulk_buyer: Role.BULK_BUYER,
      admin: Role.DOCA,
      logistics: Role.LOGISTICS,
    };
    const role = roleMapping[user.role] || Role.FARMER;

    await prisma.user.upsert({
      where: { phone: user.phone },
      update: {
        name: user.name,
        role,
        email: user.email,
        location: user.village || 'Sonipat, Haryana',
        lat: user.lat || 28.6139,
        lng: user.lng || 77.2090,
      },
      create: {
        id: user.id,
        phone: user.phone,
        name: user.name,
        role,
        email: user.email,
        location: user.village || 'Sonipat, Haryana',
        lat: user.lat || 28.6139,
        lng: user.lng || 77.2090,
      },
    });
  }
  console.log(`✅ Seeded ${users.length} users.`);

  // 2. Seed Produce Listings
  console.log('🌾 Seeding Produce Listings...');
  const listings = rawData.listings || [];
  for (const listing of listings) {
    await prisma.produceListing.upsert({
      where: { id: listing.id },
      update: {
        crop: listing.crop_name,
        variety: listing.quality_grade,
        quantityKg: listing.quantity_kg,
        minOrderKg: listing.min_order_kg || 1,
        pricePerKg: listing.price_per_kg,
        mandiReferencePrice: listing.mandi_benchmark_price || listing.price_per_kg,
        estimatedRetailPrice: listing.retail_benchmark_price || listing.price_per_kg * 1.6,
        qualityGrade: listing.quality_grade || 'Grade A',
        harvestDate: listing.harvest_date || '2026-09-01',
        location: listing.farmer_village || 'Haryana',
        lat: listing.farmer_lat || 28.6139,
        lng: listing.farmer_lng || 77.2090,
        imageUrl: listing.image_url,
        status: ListingStatus.ACTIVE,
      },
      create: {
        id: listing.id,
        farmerId: listing.farmer_id,
        crop: listing.crop_name,
        variety: listing.quality_grade,
        quantityKg: listing.quantity_kg,
        minOrderKg: listing.min_order_kg || 1,
        pricePerKg: listing.price_per_kg,
        mandiReferencePrice: listing.mandi_benchmark_price || listing.price_per_kg,
        estimatedRetailPrice: listing.retail_benchmark_price || listing.price_per_kg * 1.6,
        qualityGrade: listing.quality_grade || 'Grade A',
        harvestDate: listing.harvest_date || '2026-09-01',
        location: listing.farmer_village || 'Haryana',
        lat: listing.farmer_lat || 28.6139,
        lng: listing.farmer_lng || 77.2090,
        imageUrl: listing.image_url,
        status: ListingStatus.ACTIVE,
      },
    });
  }
  console.log(`✅ Seeded ${listings.length} produce listings.`);

  // 3. Seed Demand Posts
  console.log('🏢 Seeding B2B Demand Posts...');
  const demandPosts = rawData.demand_posts || [];
  for (const demand of demandPosts) {
    await prisma.demandPost.upsert({
      where: { id: demand.id },
      update: {
        crop: demand.crop_name,
        targetQuantityKg: demand.quantity_kg,
        maxPricePerKg: demand.target_price_per_kg || 35.0,
        targetDeliveryDate: demand.required_by_date || '2026-09-10',
        deliveryLocation: demand.delivery_address || 'Delhi NCR',
        status: DemandStatus.OPEN,
        matchedFarmerCount: 0,
      },
      create: {
        id: demand.id,
        buyerId: demand.buyer_id,
        buyerName: demand.buyer_name,
        buyerOrg: demand.buyer_name,
        crop: demand.crop_name,
        targetQuantityKg: demand.quantity_kg,
        maxPricePerKg: demand.target_price_per_kg || 35.0,
        targetDeliveryDate: demand.required_by_date || '2026-09-10',
        deliveryLocation: demand.delivery_address || 'Delhi NCR',
        status: DemandStatus.OPEN,
        matchedFarmerCount: 0,
      },
    });
  }
  console.log(`✅ Seeded ${demandPosts.length} demand posts.`);

  // 4. Seed Price Benchmarks
  console.log('📊 Seeding Agmarknet Price Benchmarks...');
  const priceCache = rawData.price_cache || [];
  if (priceCache.length > 0) {
    await prisma.priceBenchmark.deleteMany({});
    const records = priceCache.slice(0, 500).map((b: any, idx: number) => ({
      id: b.id || `bench_${idx}`,
      commodity: b.crop_name,
      market: b.mandi_region || 'Rewari Mandi',
      state: 'Haryana',
      minPrice: Number(b.min_price || b.modal_price * 0.9),
      maxPrice: Number(b.max_price || b.modal_price * 1.1),
      modalPrice: Number(b.modal_price),
      recordedDate: b.price_date || '2026-09-04',
    }));

    await prisma.priceBenchmark.createMany({
      data: records,
      skipDuplicates: true,
    });
    console.log(`✅ Seeded ${records.length} Agmarknet price benchmarks.`);
  }

  console.log('✨ Prisma PostgreSQL seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during Prisma seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
