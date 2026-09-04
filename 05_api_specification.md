# 05 — API Specification (REST)

Base URL (dev): `http://localhost:3000/api`
Base URL (AI microservice): `http://localhost:8000`
Auth: Bearer token (Supabase JWT) in `Authorization` header for all endpoints except `/auth/*`.

## Auth
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/auth/register` | body: `{name, phone, role, village, pincode, preferred_language}` → sends OTP | No |
| POST | `/auth/verify-otp` | body: `{phone, otp}` → returns JWT + user object | No |
| GET | `/auth/me` | returns current logged-in user profile | Yes |

## Listings (Farmer)
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/listings` | body: `{crop_name, quantity_kg, harvest_date, price_per_kg?}`. If `price_per_kg` omitted, server calls AI pricing endpoint and returns `ai_suggested_price` for farmer to confirm. | Farmer |
| GET | `/listings` | query: `crop_name?, pincode?, radius_km?, min_price?, max_price?` → paginated list | Public/authenticated |
| GET | `/listings/:id` | listing detail incl. farmer profile (name, village, rating) | Public/authenticated |
| PATCH | `/listings/:id` | update price/status/quantity | Owning Farmer |
| DELETE | `/listings/:id` | soft-delete (`status = removed`) | Owning Farmer |

## Marketplace / Orders
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/orders` | body: `{listing_id, quantity_kg}` → creates order, computes `total_price`, returns Razorpay test-mode checkout payload | Consumer/Bulk Buyer |
| GET | `/orders` | orders for current user (buyer or farmer view) | Yes |
| GET | `/orders/:id` | order detail incl. delivery_status, route info if assigned | Owner or related Farmer |
| PATCH | `/orders/:id/status` | body: `{delivery_status}` — farmer/admin updates status | Farmer/Admin |
| POST | `/orders/:id/confirm-payment` | webhook/callback from Razorpay test mode → sets `payment_status = test_paid` | System |

## Bulk Buyer Demand
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/demand-posts` | body: `{crop_name, quantity_kg, frequency, delivery_address}` | Bulk Buyer |
| GET | `/demand-posts/:id/matches` | returns ranked farmer listings matching this demand (by price, distance) | Bulk Buyer |

## AI — Demand Forecast (proxied to FastAPI microservice)
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/ai/forecast?crop_name=&region=&days=7` | returns `{dates[], predicted_price[], predicted_arrivals[], summary_text}` | Yes |
| GET | `/ai/suggest-price?crop_name=&region=` | returns `{suggested_price, min_price, max_price, source: 'agmarknet', as_of_date}` | Yes (called internally by `/listings` POST too) |

## AI — Route Optimization (proxied to FastAPI microservice)
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/ai/optimize-route` | body: `{order_ids: []}` → geocodes each order's pickup/drop, runs VRP heuristic over OSRM distances, creates a `routes` row, returns ordered `stop_sequence`, `total_distance_km`, `total_time_min` | Admin/Logistics |

## Admin
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/admin/dashboard` | returns `{avg_farmer_price_platform, avg_farmer_price_mandi, avg_consumer_price_platform, avg_consumer_price_retail_estimate, total_orders, active_farmers, active_buyers, total_farmer_savings_rs, total_consumer_savings_rs}` | Admin |
| GET | `/admin/price-comparison?crop_name=` | time-series of platform price vs. mandi price vs. estimated retail price for a crop | Admin |

## Notifications
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/notifications/register-device` | body: `{fcm_token}` — registers device for push | Yes |

## Standard Error Shape (all endpoints)
```json
{
  "error": {
    "code": "LISTING_NOT_FOUND",
    "message": "No listing found with the given ID."
  }
}
```

## Standard Success Shape
```json
{
  "data": { /* resource or array */ },
  "meta": { "page": 1, "page_size": 20, "total": 134 }
}
```
