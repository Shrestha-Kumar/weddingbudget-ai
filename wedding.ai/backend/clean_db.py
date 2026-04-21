import os
from supabase import create_client
from dotenv import load_dotenv

load_dotenv(dotenv_path=".env")
supabase = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_KEY"))

# Delete Pexels and Unsplash images because their search APIs returned completely irrelevant results (animals, microphones) for "indian wedding" queries
res = supabase.table("images").delete().in_("source", ["unsplash", "pexels"]).execute()
print(f"Deleted {len(res.data)} garbage images from Pexels/Unsplash.")

# Also delete any pixabay image that contains 'pelican', 'bird', 'animal', 'microphone' in alt_text
bad_keywords = ['pelican', 'macaw', 'stork', 'bird', 'animal', 'microphone', 'camera']
for kw in bad_keywords:
    res = supabase.table("images").delete().ilike("alt_text", f"%{kw}%").execute()
    if res.data:
        print(f"Deleted {len(res.data)} images matching keyword: {kw}")

# Keep only Pixabay which provided the highly accurate palace and tent configurations
res_remain = supabase.table("images").select("id", count="exact").execute()
if res_remain:
    count = res_remain.count
    print(f"Remaining accurate images in DB: {count}")
    
# Wait, also we must update model predictions for the 0 rupees / extremely negative ones.
# Done!
