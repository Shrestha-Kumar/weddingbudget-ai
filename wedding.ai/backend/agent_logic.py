import os
import json
import requests
from typing import List, Dict, Any
from database import supabase
import google.generativeai as genai

# Configure Gemini
GEMINI_KEY = os.getenv("GEMINI_API_KEY")
if GEMINI_KEY:
    genai.configure(api_key=GEMINI_KEY)

class VenueAgent:
    def __init__(self):
        self.model_name = "gemini-flash-latest"
        self.has_llm = bool(GEMINI_KEY)
        self.unsplash_key = os.getenv("UNSPLASH_ACCESS_KEY")

    async def get_hotel_images(self, hotel_name: str) -> List[str]:
        """Fetch real images from Unsplash if available."""
        if not self.unsplash_key:
            return []
        try:
            url = f"https://api.unsplash.com/search/photos?query={hotel_name}+hotel+wedding&per_page=3&client_id={self.unsplash_key}"
            res = requests.get(url)
            if res.status_code == 200:
                data = res.json()
                return [img["urls"]["regular"] for img in data.get("results", [])]
        except Exception:
            pass
        return []

    async def scout(self, message: str, context: Dict[str, Any]) -> Dict[str, Any]:
        budget = context.get("budget", 0)
        guests = context.get("guests", 0)
        city = context.get("city", "")

        # 1. DB Lookup
        db_venues = []
        try:
            db_query = supabase.table("venues").select("*").eq("is_active", True)
            if city:
                db_query = db_query.ilike("city", f"%{city}%")
            if guests > 0:
                db_query = db_query.gte("capacity", guests)
            
            res = db_query.execute()
            all_venues = res.data or []
            
            if budget > 0:
                db_venues = [v for v in all_venues if float(v["base_price_low"]) <= budget]
            else:
                db_venues = all_venues
        except Exception:
            pass

        # 2. Reasoning & Web Simulation
        if self.has_llm:
            try:
                model = genai.GenerativeModel(self.model_name)
                # We ask the model to reason and potentially suggest "Web Recovered" venues
                prompt = f"""
                You are the WeddingBudget.ai Venue Scout. 
                Message: "{message}"
                Context: Budget=₹{budget}, Guests={guests}, Preferred City={city}
                DB Matches: {json.dumps(db_venues[:2])}
                
                Task: 
                1. If DB matches exist, present them.
                2. If the user asks for a specific location or if DB matches are zero, use your internal knowledge to suggest 5-6 premium hotels in that area.
                3. For each suggested hotel, provide:
                   - name: Full name of the hotel
                   - city: City location
                   - description: A brief USP (Unique Selling Point)
                   - price_per_plate: Estimated per-plate cost for veg food (as a number, e.g., 2500)
                   - visit_url: A plausible link to the venue's official site or a major booking platform.
                
                Return ONLY a JSON object:
                {{
                    "content": "Professional and helpful response summary",
                    "tools_used": ["supabase_venue_lookup", "web_intelligence_recovery"],
                    "suggested_venues": [
                        {{
                            "name": "Hotel Name", 
                            "city": "City", 
                            "description": "Description",
                            "price_per_plate": 2500,
                            "visit_url": "https://..."
                        }}
                    ]
                }}
                """
                response = model.generate_content(prompt)
                
                import re
                json_match = re.search(r'\{.*\}', response.text, re.DOTALL)
                if not json_match:
                    raise ValueError("No JSON block found in model response")
                
                data = json.loads(json_match.group(0))
                
                # Combine DB and Web venues
                final_venues = db_venues[:]
                for sv in data.get("suggested_venues", []):
                    # Dedup if already in DB
                    if any(v["name"].lower() == sv["name"].lower() for v in db_venues):
                        continue
                    
                    imgs = await self.get_hotel_images(sv["name"])
                    final_venues.append({
                        "id": f"web-{sv['name'].replace(' ', '-')}",
                        "name": sv["name"],
                        "city": sv["city"],
                        "hotel_tier": "Web Recovered",
                        "capacity": guests,
                        "base_price_low": budget * 0.7 if budget > 0 else 5000000,
                        "price_per_plate_veg": sv.get("price_per_plate") or (budget / (guests * 2) if (budget and guests) else 2500),
                        "visit_url": sv.get("visit_url") or f"https://www.google.com/search?q={sv['name'].replace(' ', '+')}+hotel+official+site",
                        "description": sv["description"],
                        "images": imgs if imgs else ["https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1000&auto=format&fit=crop"]
                    })
                
                data["venues"] = final_venues
                return data
            except Exception as e:
                print(f"Agent Logic Error: {e}")
                import traceback
                traceback.print_exc()
                pass

        # Fallback
        print(f"Falling back for {city} - DB Matches: {len(db_venues)}")
        return {
            "content": f"Found {len(db_venues)} matches. { 'No properties match your exact constraints in our local index.' if not db_venues else '' }",
            "venues": db_venues,
            "tools_used": ["supabase_venue_lookup"]
        }

agent = VenueAgent()
