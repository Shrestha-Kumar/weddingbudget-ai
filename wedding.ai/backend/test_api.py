import requests
import json
from database import supabase

print("Testing /session...")
req = {
    "input_params": {"city": "Jaipur"},
    "selected_images": {"Haldi": []},
    "budget_output": {"decor": {"low": 0}}
}
try:
    res = requests.post("http://localhost:8000/session", json=req)
    print("API Response:", res.status_code, res.text)
except Exception as e:
    print("API Connection Error:", e)

print("\nDeduplicating Database Images...")
res = supabase.table("images").select("id, cloudinary_url").execute()
seen = set()
duplicates = []
for row in res.data:
    if row["cloudinary_url"] in seen:
        duplicates.append(row["id"])
    else:
        seen.add(row["cloudinary_url"])

print(f"Found {len(duplicates)} duplicate image entries based on URL. Executing mass deletion...")
# Batch delete in chunks of 100 to avoid URL length issues
chunk_size = 100
for i in range(0, len(duplicates), chunk_size):
    chunk = duplicates[i:i+chunk_size]
    supabase.table("images").delete().in_("id", chunk).execute()

print("\nPurging corrupt/generic Sangeet representations...")
# Delete all current "sangeet" search results as they were polluted with western concerts
res = supabase.table("images").delete().or_("search_query.ilike.%sangeet%,event_type.eq.sangeet,alt_text.ilike.%concert%,alt_text.ilike.%guitar%").execute()
print(f"Purged {len(res.data) if hasattr(res, 'data') else 'multiple'} irrelevant Sangeet records.")

