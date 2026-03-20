from pydantic import BaseModel, ConfigDict, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from uuid import UUID

class PredictionRequest(BaseModel):
    image_url: str

class LogisticRequest(BaseModel):
    guests_count: int
    outstation_percentage: float
    distance_km: float

class FnBRequest(BaseModel):
    meal_type: str
    venue_tier: str
    guest_count: int

class ArtistRequest(BaseModel):
    category: str
    tier: Optional[int] = None
    name: Optional[str] = None

class SundriesRequest(BaseModel):
    hotel_tier: Optional[str] = None

class SessionCreate(BaseModel):
    input_params: Dict[str, Any]
    selected_images: Optional[Dict[str, Any]] = None
    budget_output: Optional[Dict[str, Any]] = None

class SessionUpdate(BaseModel):
    input_params: Optional[Dict[str, Any]] = None
    selected_images: Optional[Dict[str, Any]] = None
    budget_output: Optional[Dict[str, Any]] = None
    actuals: Optional[Dict[str, Any]] = None

class LabelCreate(BaseModel):
    image_id: str
    function_type: str
    style: str
    complexity_tier: int = Field(ge=1, le=5)
    cost_seed_low: float
    cost_seed_mid: float
    cost_seed_high: float
    confidence: Optional[float] = 1.0
    notes: Optional[str] = None
