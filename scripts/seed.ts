import { db } from '../src/lib/db';

console.log('🌱 Starting KisanSetu database seeding...');
const data = db.resetToSeed();

console.log(`✅ Seeding complete!`);
console.log(`- Users: ${data.users.length}`);
console.log(`- Active Listings: ${data.listings.length}`);
console.log(`- Sample Orders: ${data.orders.length}`);
console.log(`- Demand Posts: ${data.demand_posts.length}`);
console.log(`- Historical Mandi Price Records: ${data.price_cache.length}`);
