"""
KisanSetu Vehicle Routing Problem (VRP) & Smart Logistics Optimization Engine
Clusters Multi-Farmer Rural Pickups to Urban Distribution Centers, Minimizing
Total Kilometers, Transit Fuel Emissions, and Logistics Cost per Kg.
"""

import math
from typing import List, Dict, Any, Optional

def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """
    Calculates the great circle distance between two points on the earth in km.
    """
    R = 6371.0  # Earth radius in kilometers
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (math.sin(dlat / 2.0) ** 2 +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) *
         math.sin(dlon / 2.0) ** 2)
    c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
    return round(R * c, 2)

class VRPOptimizer:
    def __init__(self):
        self.fuel_efficiency_km_per_liter = 4.5  # Tata Ace / Ashok Leyland Dost mini-truck
        self.diesel_co2_kg_per_liter = 2.68

    def optimize_route(
        self,
        pickups: List[Dict[str, Any]],
        destination: Dict[str, Any],
        vehicle_capacity_kg: float = 2500.0,
        driver_name: str = "Harish Logistics (HR-38-AB-4122)"
    ) -> Dict[str, Any]:
        """
        Solves the pooled multi-stop pickup routing problem.
        """
        if not pickups:
            return {"error": "No pickup points provided"}

        dest_lat = destination.get("lat", 28.6304)
        dest_lng = destination.get("lng", 77.2177)
        dest_name = destination.get("name", "Delhi NCR Central Hub")

        # 1. Start from first farmer or cluster centroid
        unvisited = list(pickups)
        current_loc = unvisited.pop(0)
        ordered_waypoints = [
            {
                "stop_number": 1,
                "type": "PICKUP",
                "farmer_name": current_loc.get("farmer_name", "Farmer Stop"),
                "village": current_loc.get("village", "Farm Location"),
                "crop": current_loc.get("crop", "Produce"),
                "quantity_kg": current_loc.get("quantity_kg", 0),
                "lat": current_loc.get("lat", 28.2055),
                "lng": current_loc.get("lng", 76.7944)
            }
        ]

        total_load_kg = current_loc.get("quantity_kg", 0)
        total_pooled_distance_km = 0.0

        # Nearest-Neighbor sequence
        while unvisited:
            best_idx = 0
            best_dist = float("inf")
            for i, p in enumerate(unvisited):
                d = haversine_distance(
                    ordered_waypoints[-1]["lat"], ordered_waypoints[-1]["lng"],
                    p.get("lat", 28.0), p.get("lng", 76.0)
                )
                if d < best_dist:
                    best_dist = d
                    best_idx = i

            next_stop = unvisited.pop(best_idx)
            total_pooled_distance_km += best_dist
            total_load_kg += next_stop.get("quantity_kg", 0)

            ordered_waypoints.append({
                "stop_number": len(ordered_waypoints) + 1,
                "type": "PICKUP",
                "farmer_name": next_stop.get("farmer_name", "Farmer Stop"),
                "village": next_stop.get("village", "Farm Location"),
                "crop": next_stop.get("crop", "Produce"),
                "quantity_kg": next_stop.get("quantity_kg", 0),
                "lat": next_stop.get("lat", 28.2055),
                "lng": next_stop.get("lng", 76.7944)
            })

        # Final leg to Urban Destination Hub
        final_leg_km = haversine_distance(
            ordered_waypoints[-1]["lat"], ordered_waypoints[-1]["lng"],
            dest_lat, dest_lng
        )
        total_pooled_distance_km += final_leg_km

        ordered_waypoints.append({
            "stop_number": len(ordered_waypoints) + 1,
            "type": "DELIVERY_HUB",
            "hub_name": dest_name,
            "address": destination.get("address", "Connaught Place / Azadpur Distribution Center"),
            "lat": dest_lat,
            "lng": dest_lng
        })

        # 2. Baseline Comparison: Unpooled Separate Trips
        # In traditional models, each farmer's goods are brought in separate small tempos
        unpooled_total_km = 0.0
        for p in pickups:
            dist_to_hub = haversine_distance(p.get("lat", 28.0), p.get("lng", 76.0), dest_lat, dest_lng)
            unpooled_total_km += (dist_to_hub * 2.0)  # round trip

        # Add road curvature factor (actual road network is ~1.25x haversine distance)
        road_factor = 1.25
        pooled_road_km = round(total_pooled_distance_km * road_factor, 1)
        unpooled_road_km = round(unpooled_total_km * road_factor, 1)

        km_saved = max(0.0, round(unpooled_road_km - pooled_road_km, 1))
        fuel_saved_liters = round(km_saved / self.fuel_efficiency_km_per_liter, 1)
        co2_saved_kg = round(fuel_saved_liters * self.diesel_co2_kg_per_liter, 1)
        cost_saved_inr = round(fuel_saved_liters * 90.0, 0)  # ₹90/L diesel

        return {
            "driver_name": driver_name,
            "vehicle_capacity_kg": vehicle_capacity_kg,
            "total_load_kg": total_load_kg,
            "capacity_utilization_pct": round((total_load_kg / vehicle_capacity_kg) * 100, 1),
            "total_stops": len(ordered_waypoints),
            "pooled_distance_km": pooled_road_km,
            "unpooled_baseline_km": unpooled_road_km,
            "distance_saved_km": km_saved,
            "fuel_saved_liters": fuel_saved_liters,
            "co2_emissions_saved_kg": co2_saved_kg,
            "estimated_fuel_cost_savings_inr": cost_saved_inr,
            "waypoints": ordered_waypoints,
            "status": "OPTIMIZED"
        }

vrp_optimizer = VRPOptimizer()
