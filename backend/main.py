from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
import time

from database import supabase
from models import (
    PredictionRequest, LogisticRequest, FnBRequest, ArtistRequest,
    SundriesRequest, SessionCreate, SessionUpdate, LabelCreate
)
from ml_inference import predict_cost

app = FastAPI(title="WeddingBudget.ai API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/ping")
async def ping():
    return {"status": "ok", "timestamp": time.time()}

@app.post("/predict")
async def predict_image_cost(req: PredictionRequest):
    try:
        result = await predict_cost(req.image_url)
        return {"status": "success", "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/logistics")
async def calculate_logistics(req: LogisticRequest):
    # Fetch logistics rules
    try:
        res = supabase.table("logistics_rules").select("*").limit(1).execute()
        rules = res.data[0] if res.data else {}
    except Exception:
        rules = {}
        
    guests_per_innova = rules.get("guests_per_innova") or 3
    innova_cost_per_km_min = rules.get("innova_cost_per_km_min") or 15.0
    innova_cost_per_km_max = rules.get("innova_cost_per_km_max") or 25.0
    driver_allowance_per_day = rules.get("driver_allowance_per_day") or 500.0
    
    outstation_count = int(req.guests_count * (req.outstation_percentage / 100))
    fleet_size = (outstation_count + guests_per_innova - 1) // guests_per_innova
    
    trip_distance = req.distance_km * 2  # round trip
    cost_low = fleet_size * trip_distance * innova_cost_per_km_min + (fleet_size * driver_allowance_per_day)
    cost_high = fleet_size * trip_distance * innova_cost_per_km_max + (fleet_size * driver_allowance_per_day)
    
    return {
        "status": "success",
        "data": {
            "fleet_size": fleet_size,
            "cost_low": cost_low,
            "cost_high": cost_high
        }
    }

@app.post("/fnb")
async def calculate_fnb(req: FnBRequest):
    try:
        res = supabase.table("fnb_rates").select("*").eq("meal_type", req.meal_type).eq("venue_tier", req.venue_tier).execute()
        if res.data:
            rate = res.data[0]
            return {
                "status": "success",
                "data": {
                    "cost_low": req.guest_count * rate["cost_per_head_low"],
                    "cost_high": req.guest_count * rate["cost_per_head_high"]
                }
            }
    except Exception:
        pass
    
    # Fallback default values
    return {
        "status": "success",
        "data": {
            "cost_low": req.guest_count * 1500,
            "cost_high": req.guest_count * 3000
        }
    }

@app.post("/artists")
async def calculate_artists(req: ArtistRequest):
    try:
        query = supabase.table("artists").select("*").eq("category", req.category).eq("is_active", True)
        if req.tier:
            query = query.eq("tier", req.tier)
        if req.name:
            query = query.eq("name", req.name)
            
        res = query.execute()
        if res.data:
            artist = res.data[0]
            return {
                "status": "success",
                "data": {
                    "fee_low": artist["fee_low"],
                    "fee_high": artist["fee_high"]
                }
            }
    except Exception:
        pass
        
    return {
        "status": "success",
        "data": {
            "fee_low": 250000,
            "fee_high": 750000
        }
    }

@app.post("/sundries")
async def calculate_sundries(req: SundriesRequest):
    try:
        query = supabase.table("sundries_config").select("*")
        if req.hotel_tier:
            query = query.eq("hotel_tier", req.hotel_tier)
        
        res = query.execute()
        return {"status": "success", "data": res.data}
    except Exception:
        return {"status": "success", "data": []}

@app.get("/images")
async def get_images(query: str | None = None, limit: int = 100, offset: int = 0):
    try:
        db_query = supabase.table("images").select("*")
        if query:
            db_query = db_query.ilike("search_query", f"%{query}%")
            
        res = db_query.limit(limit).offset(offset).order("created_at", desc=True).execute()
        return {"status": "success", "data": res.data}
    except Exception as e:
        return {"status": "error", "detail": str(e)}

@app.post("/session")
async def create_session(req: SessionCreate):
    import uuid
    payload = req.model_dump()
    payload["session_token"] = str(uuid.uuid4())
    res = supabase.table("budget_sessions").insert(payload).execute()
    return {"status": "success", "data": res.data[0] if res.data else None}

@app.get("/session/{token}")
async def get_session(token: str):
    res = supabase.table("budget_sessions").select("*").eq("session_token", token).execute()
    if res.data:
        return {"status": "success", "data": res.data[0]}
    raise HTTPException(status_code=404, detail="Session not found")

@app.get("/sessions")
async def get_all_sessions(limit: int = 50):
    try:
        res = supabase.table("budget_sessions").select("*").order("created_at", desc=True).limit(limit).execute()
        return {"status": "success", "data": res.data}
    except Exception as e:
        return {"status": "error", "detail": str(e)}

@app.patch("/session/{token}")
async def update_session(token: str, req: SessionUpdate):
    update_data = {k: v for k, v in req.model_dump().items() if v is not None}
    res = supabase.table("budget_sessions").update(update_data).eq("session_token", token).execute()
    if res.data:
        return {"status": "success", "data": res.data[0]}
    raise HTTPException(status_code=404, detail="Session not found")

@app.get("/admin/images/unlabeled")
async def get_unlabeled_images():
    res = supabase.table("images").select("*, labels(id)").execute()
    unlabeled = [img for img in res.data if not img.get("labels")]
    return {"status": "success", "data": unlabeled[:20]}

@app.post("/admin/labels")
async def create_label(req: LabelCreate):
    res = supabase.table("labels").insert(req.model_dump()).execute()
    return {"status": "success", "data": res.data[0] if res.data else None}

@app.get("/admin/artists")
async def list_artists():
    res = supabase.table("artists").select("*").order("tier").execute()
    return {"status": "success", "data": res.data}

@app.post("/admin/artists")
async def add_artist(req: ArtistRequest):
    res = supabase.table("artists").insert(req.model_dump()).execute()
    return {"status": "success", "data": res.data[0] if res.data else None}

@app.get("/admin/rates")
async def list_rates():
    fnb = supabase.table("fnb_rates").select("*").execute()
    bar = supabase.table("bar_rates").select("*").execute()
    logistics = supabase.table("logistics_rules").select("*").execute()
    return {
        "status": "success", 
        "data": {
            "fnb": fnb.data,
            "bar": bar.data,
            "logistics": logistics.data
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
