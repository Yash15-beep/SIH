import { PrismaClient, Role, ListingStatus, OrderStatus, DemandStatus } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting KisanSetu Prisma PostgreSQL Database Seed...');

  const dataPath = path.join(process.cwd(), 'src', 'data', 'agmarknet_seed_data.json');
  if (!fs.existsSync(dataPath)) {
    console.error('❌ Data file not found:', dataPath);
    return;
  }

  const rawData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

  // 1. Seed Users
  console.log('👤 Seeding Users...');
  for (const user of rawData.demoUsers || []) {
    await prisma.user.upsert({
      where: { phone: user.phone },
      update: {
        name: user.name,
        role: user.role as Role,
        email: user.email,
        location: user.location,
        lat: user.lat || 28.6139,
        lng: user.lng || 77.2090,
        kisanId: user.kisanId,
        rating: user.rating || 4.8,
        verified: user.verified || false,
      },
      create: {
        id: user.id,
        phone: user.phone,
        name: user.name,
        role: user.role as Role,
        email: user.email,
        location: user.location,
        lat: user.lat || 28.6139,
        lng: user.lng || 77.2090,
        kisanId: user.kisanId,
        rating: user.rating || 4.8,
        verified: user.verified || false,
      },
    });
  }
  console.log(`✅ Seeded ${rawData.demoUsers?.length || 0} users.`);

  // 2. Seed Produce Listings
  console.log('🌾 Seeding Produce Listings...');
  for (const listing of rawData.listings || []) {
    await prisma.produceListing.upsert({
      where: { id: listing.id },
      update: {
        crop: listing.crop,
        cropHi: listing.cropHi,
        variety: listing.variety,
        quantityKg: listing.quantityKg,
        minOrderKg: listing.minOrderKg || 1,
        pricePerKg: listing.pricePerKg,
        mandiReferencePrice: listing.mandiReferencePrice,
        estimatedRetailPrice: listing.estimatedRetailPrice,
        qualityGrade: listing.qualityGrade || 'Grade A',
        harvestDate: listing.harvestDate,
        location: listing.location,
        lat: listing.lat || 28.6139,
        lng: listing.lng || 77.2090,
        imageUrl: listing.imageUrl,
        status: (listing.status as ListingStatus) || ListingStatus.ACTIVE,
      },
      create: {
        id: listing.id,
        farmerId: listing.farmerId,
        crop: listing.crop,
        cropHi: listing.cropHi,
        variety: listing.variety,
        quantityKg: listing.quantityKg,
        minOrderKg: listing.minOrderKg || 1,
        pricePerKg: listing.pricePerKg,
        mandiReferencePrice: listing.mandiReferencePrice,
        estimatedRetailPrice: listing.estimatedRetailPrice,
        qualityGrade: listing.qualityGrade || 'Grade A',
        harvestDate: listing.harvestDate,
        location: listing.location,
        lat: listing.lat || 28.6139,
        lng: listing.lng || 77.2090,
        imageUrl: listing.imageUrl,
        status: (listing.status as ListingStatus) || ListingStatus.ACTIVE,
      },
    });
  }
  console.log(`✅ Seeded ${rawData.listings?.length || 0} produce listings.`);

  // 3. Seed Price Benchmarks (batch insert for high speed)
  console.log('📊 Seeding Agmarknet Price Benchmarks...');
  const benchmarks = rawData.priceBenchmarks || [];
  if (benchmarks.length > 0) {
    // Delete existing and re-insert or insertMany
    await prisma.priceBenchmark.deleteMany({});
    const records = benchmarks.map((b: any) => ({
      commodity: b.commodity,
      market: b.market,
      state: b.state,
      minPrice: Number(b.minPrice),
      maxPrice: Number(b.maxPrice),
      modalPrice: Number(b.modalPrice),
      recordedDate: b.recordedDate,
    }));

    await prisma.priceBenchmark.createMany({
      data: records,
      skipDuplicates: true,
    });
    console.log(`✅ Seeded ${records.length} Agmarknet price benchmarks.`);
  }

  // 4. Seed Demand Posts
  console.log('🏢 Seeding B2B Demand Posts...');
  for (const demand of rawData.demandPosts || []) {
    await prisma.demandPost.upsert({
      where: { id: demand.id },
      update: {
        crop: demand.crop,
        targetQuantityKg: demand.targetQuantityKg,
        maxPricePerKg: demand.maxPricePerKg,
        targetDeliveryDate: demand.targetDeliveryDate,
        deliveryLocation: demand.deliveryLocation,
        status: (demand.status as DemandStatus) || DemandStatus.OPEN,
        matchedFarmerCount: demand.matchedFarmerCount || 0,
      },
      create: {
        id: demand.id,
        buyerId: demand.buyerId,
        buyerName: demand.buyerName,
        buyerOrg: demand.buyerOrg,
        crop: demand.crop,
        targetQuantityKg: demand.targetQuantityKg,
        maxPricePerKg: demand.maxPricePerKg,
        targetDeliveryDate: demand.targetDeliveryDate,
        deliveryLocation: demand.deliveryLocation,
        status: (demand.status as DemandStatus) || DemandStatus.OPEN,
        matchedFarmerCount: demand.matchedFarmerCount || 0,
      },
    });
  }
  console.log(`✅ Seeded ${rawData.demandPosts?.length || 0} demand posts.`);

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
