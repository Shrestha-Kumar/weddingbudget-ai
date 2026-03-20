import os
from supabase import create_client
from dotenv import load_dotenv

load_dotenv(dotenv_path=".env")
supabase = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_KEY"))

bad_words = [
    'tent', 'mountain', 'camp', 'boy', 'children', 'fruit', 'pumpkin', 'toy', 'doll', 
    'code', 'python', 'standard', 'regulation', 'text', 'railway', 'train', 'track', 
    'dummy', 'progress', 'computer', 'laptop', 'ring', 'cupcake', 'banana', 'pelican',
    'bird', 'animal', 'microphone', 'singer', 'stage concert', 'man', 'woman portrait',
    'shoes', 'macro', 'close up nature', 'snake', 'reptile', 'food', 'sweets'
]

deleted_count = 0
for word in bad_words:
    res = supabase.table("images").delete().ilike("alt_text", f"%{word}%").execute()
    if res.data:
        deleted_count += len(res.data)
        
print(f"Purged {deleted_count} highly targeted anomalous images based on alt_text!")

res_remain = supabase.table("images").select("id", count="exact").execute()
if res_remain:
    print(f"Remaining high quality images: {res_remain.count}")
