"""
KisanSetu AI Microservice (FastAPI)
Production AI Engine for SIH 2026 Problem Statement 26033:
- Agmarknet Method 1 Live Data Ingestion
- Adaptive AI Fair Pricing & DoCA Margin Breakdown
- 7-Day Time-Series Demand & Volatility Forecaster
- Vehicle Routing Problem (VRP) Logistics Clustering
"""

from fastapi import FastAPI, Query, Body, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

from agmarknet_client import agmarknet_client
from price_model import price_model
from forecasting_model import forecast_model
from vrp_optimizer import vrp_optimizer

app = FastAPI(
    title="KisanSetu AI Microservice",
    description="Adaptive AI Fair Pricing, Agmarknet Ingestion, Time-Series Forecasting & VRP Logistics Engine",
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request Models
class PricePredictionRequest(BaseModel):
    crop: str = Field(..., example="Tomato")
    quantity_kg: float = Field(100.0, example=500.0)
    quality_grade: str = Field("Grade A", example="Grade A")
    harvest_date: Optional[str] = Field(None, example="2026-09-04")
    location: str = Field("Haryana", example="Dharuhera, Rewari")
    farmer_lat: float = Field(28.2055, example=28.2055)
    farmer_lng: float = Field(76.7944, example=76.7944)

class VRPOptimizationRequest(BaseModel):
    pickups: List[Dict[str, Any]]
    destination: Dict[str, Any]
    vehicle_capacity_kg: Optional[float] = 2500.0
    driver_name: Optional[str] = "Harish Logistics (HR-38-AB-4122)"

class AgmarknetSyncRequest(BaseModel):
    commodity: Optional[str] = None
    state: Optional[str] = None
    limit: Optional[int] = 100

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "KisanSetu-AI-Microservice",
        "version": "2.0.0",
        "models": ["AdaptivePriceModel", "DemandForecastModel", "VRPOptimizer", "AgmarknetClient"]
    }

# 1. Agmarknet Live Sync Endpoint (Method 1: data.gov.in)
@app.post("/api/v1/sync/agmarknet")
def sync_agmarknet(req: Optional[AgmarknetSyncRequest] = None):
    commodity = req.commodity if req else None
    state = req.state if req else None
    limit = req.limit if req else 100
    records = agmarknet_client.fetch_live_prices(commodity=commodity, state=state, limit=limit)
    return {
        "status": "success",
        "records_count": len(records),
        "data": records
    }

# 2. Adaptive AI Fair Pricing Endpoint
@app.post("/api/v1/price/predict")
def predict_fair_price(req: PricePredictionRequest):
    result = price_model.predict_fair_price(
        crop=req.crop,
        quantity_kg=req.quantity_kg,
        quality_grade=req.quality_grade,
        harvest_date=req.harvest_date,
        location=req.location,
        farmer_lat=req.farmer_lat,
        farmer_lng=req.farmer_lng
    )
    return {"status": "success", "data": result}

# Legacy GET endpoint support for quick checks
@app.get("/ai/suggest-price")
def get_suggested_price(
    crop_name: str = Query("Tomato", description="Commodity crop name"),
    grade: str = Query("Grade A", description="Produce Quality Grade"),
    region: str = Query("Rewari", description="Location")
):
    result = price_model.predict_fair_price(crop=crop_name, quality_grade=grade, location=region)
    return {"data": result}

# 3. 7-Day Time-Series Demand Forecast
@app.get("/api/v1/forecast/demand")
def get_demand_forecast(
    crop: str = Query("Tomato", description="Commodity crop name"),
    region: str = Query("Delhi NCR", description="Target consumption region")
):
    result = forecast_model.generate_7day_forecast(crop=crop, region=region)
    return {"status": "success", "data": result}

@app.get("/ai/forecast")
def get_forecast_legacy(
    crop_name: str = Query("Tomato"),
    region: str = Query("Delhi NCR")
):
    result = forecast_model.generate_7day_forecast(crop=crop_name, region=region)
    return {"data": result}

# 4. VRP Logistics Route Optimizer
@app.post("/api/v1/logistics/optimize")
def optimize_logistics(req: VRPOptimizationRequest):
    result = vrp_optimizer.optimize_route(
        pickups=req.pickups,
        destination=req.destination,
        vehicle_capacity_kg=req.vehicle_capacity_kg or 2500.0,
        driver_name=req.driver_name or "Harish Logistics"
    )
    return {"status": "success", "data": result}

@app.post("/ai/optimize-route")
def optimize_route_legacy(request: Dict[str, Any] = Body(...)):
    stops = request.get("stops", [])
    pickups = stops[:-1] if len(stops) > 1 else stops
    destination = stops[-1] if len(stops) > 1 else {"name": "Central Hub", "lat": 28.6304, "lng": 77.2177}
    result = vrp_optimizer.optimize_route(pickups=pickups, destination=destination)
    return {"data": result}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
