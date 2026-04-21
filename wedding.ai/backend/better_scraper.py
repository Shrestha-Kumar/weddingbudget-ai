import os, requests, time
from supabase import create_client
from dotenv import load_dotenv

load_dotenv(dotenv_path=".env")

PEXELS_KEY = os.getenv("PEXELS_API_KEY")
UNSPLASH_KEY = os.getenv("UNSPLASH_ACCESS_KEY")
supabase = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_KEY"))

# 1. Purge the database of all existing images
print("Purging database...")
try:
    # Delete all records by matching a condition that is always true
    supabase.table("images").delete().neq("source", "nothing").execute()
    print("Database purged entirely.")
except Exception as e:
    print("Database purge error:", e)

queries = {
    "mehendi": ["indian wedding henna hands", "mehendi ceremony india"],
    "haldi": ["haldi ceremony india yellow", "indian wedding turmeric ritual"],
    "sangeet": ["indian wedding dance stage", "sangeet night decor india"],
    "baraat": ["indian groom horse baraat procession", "indian wedding groom procession"],
    "pheras": ["indian wedding mandap setup", "hindu wedding fire ritual pheras"],
    "reception": ["luxury indian wedding reception stage", "indian wedding reception decor"]
}

def upload_mock(img, search_query):
    try:
        supabase.table("images").insert({
            "source": img["source"], "source_id": img["source_id"],
            "cloudinary_url": img["url"], "thumbnail_url": img["url"],
            "alt_text": img.get("alt_text",""), "search_query": search_query,
        }).execute()
        print(f"✓ Inserted {search_query} image: {img['source_id']}")
    except Exception as e:
        print(f"✗ Failed {img['source_id']}: {e}")

for event, q_list in queries.items():
    print(f"\nScraping {event}...")
    for q in q_list:
        # Pexels
        r = requests.get("https://api.pexels.com/v1/search",
            headers={"Authorization": PEXELS_KEY},
            params={"query": q, "per_page": 10})
        if r.status_code == 200:
            for p in r.json().get("photos", []):
                upload_mock({"source": "pexels", "source_id": str(p["id"]), "url": p["src"]["large"], "alt_text": p.get("alt","")}, event)
        
        # Unsplash
        r2 = requests.get("https://api.unsplash.com/search/photos",
            params={"query": q, "per_page": 10, "client_id": UNSPLASH_KEY})
        if r2.status_code == 200:
            for p in r2.json().get("results", []):
                upload_mock({"source": "unsplash", "source_id": p["id"], "url": p["urls"]["regular"], "alt_text": p.get("alt_description","")}, event)

print("Scraping completed!")
