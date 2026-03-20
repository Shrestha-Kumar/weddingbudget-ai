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
    supabase.table("images").delete().neq("source", "nothing").execute()
    print("Database purged entirely.")
except Exception as e:
    print("Database purge error:", e)

queries = {
    "mehendi": ["indian wedding henna", "mehendi ceremony india", "indian bridal mehendi"],
    "haldi": ["haldi ceremony india yellow", "indian wedding turmeric ritual", "haldi decor india"],
    "sangeet": ["indian wedding dance stage", "sangeet night decor india", "sangeet performance stage"],
    "baraat": ["indian groom horse baraat procession", "indian wedding groom procession", "baraat entry groom"],
    "pheras": ["indian wedding mandap setup", "hindu wedding fire ritual pheras", "traditional mandap decor"],
    "reception": ["luxury indian wedding reception stage", "indian wedding reception decor", "reception stage lighting india"]
}

def upload_mock(img, search_query):
    try:
        supabase.table("images").insert({
            "source": img["source"], "source_id": img["source_id"],
            "cloudinary_url": img["url"], "thumbnail_url": img["url"],
            "alt_text": img.get("alt_text",""), "search_query": search_query,
        }).execute()
        return True
    except Exception as e:
        return False

total_inserted = 0

for event, q_list in queries.items():
    print(f"\nDeep Scraping {event}...")
    for q in q_list:
        for page in range(1, 3): # 2 pages x 30 results = 60 per query x 3 queries = 180 images per category!
            # Pexels
            r = requests.get("https://api.pexels.com/v1/search",
                headers={"Authorization": PEXELS_KEY},
                params={"query": q, "per_page": 20, "page": page})
            if r.status_code == 200:
                for p in r.json().get("photos", []):
                    if upload_mock({"source": "pexels", "source_id": str(p["id"]), "url": p["src"]["large"], "alt_text": p.get("alt","")}, event):
                        total_inserted += 1
            
            # Unsplash
            r2 = requests.get("https://api.unsplash.com/search/photos",
                params={"query": q, "per_page": 20, "page": page, "client_id": UNSPLASH_KEY})
            if r2.status_code == 200:
                for p in r2.json().get("results", []):
                    if upload_mock({"source": "unsplash", "source_id": p["id"], "url": p["urls"]["regular"], "alt_text": p.get("alt_description","")}, event):
                        total_inserted += 1
            
            time.sleep(0.5)

print(f"Deep Scrape completed! Inserted {total_inserted} high quality images!")
