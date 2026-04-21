import os
import asyncio
from supabase import create_client, Client
from dotenv import load_dotenv
import cloudinary
import cloudinary.uploader
import json

load_dotenv()

# We will use Cloudinary for the keyframes because it offers blazing fast CDN delivery 
# and image optimization, which is perfectly suited for a 30fps canvas sequence.
cloudinary.config(
    cloud_name=os.getenv('CLOUDINARY_CLOUD_NAME'),
    api_key=os.getenv('CLOUDINARY_API_KEY'),
    api_secret=os.getenv('CLOUDINARY_API_SECRET'),
    secure=True
)

async def upload_file(file_path, cloud_folder, sem):
    async with sem:
        print(f"Uploading {file_path} to {cloud_folder}...")
        try:
            response = await asyncio.to_thread(
                cloudinary.uploader.upload,
                file_path,
                folder=cloud_folder,
                use_filename=True,
                unique_filename=False,
                overwrite=True
            )
            return response.get('secure_url')
        except Exception as e:
            print(f"Failed to upload {file_path}: {e}")
            return None

async def upload_folder(folder_path, cloud_folder):
    if not os.path.exists(folder_path):
        print(f"Directory {folder_path} doesn't exist.")
        return []
        
    sem = asyncio.Semaphore(20) # 20 concurrent uploads
    files = sorted(os.listdir(folder_path))
    tasks = []
    
    for file in files:
        if file.endswith('.jpg') or file.endswith('.png'):
            file_path = os.path.join(folder_path, file)
            tasks.append(upload_file(file_path, cloud_folder, sem))
            
    urls = await asyncio.gather(*tasks)
    return [url for url in urls if url is not None]

async def main():
    print("Starting Cloudinary migration for keyframes...")
    base_dir = '/home/shrestha/google_antigravity'
    
    # Upload Hero frames
    hero_urls = await upload_folder(os.path.join(base_dir, 'wedding_keyframes'), 'landing_hero_frames')
    
    # Upload Wizard frames
    wizard_urls = await upload_folder(os.path.join(base_dir, 'wedding_new_frames'), 'wizard_bg_frames')
    
    # Save the urls to a public JSON file in the frontend so the canvas can map them locally without hitting an API 
    output_path = os.path.join(base_dir, 'frontend/public/keyframes_manifest.json')
    with open(output_path, 'w') as f:
        json.dump({
            "hero_frames": hero_urls,
            "wizard_frames": wizard_urls
        }, f, indent=2)
        
    print(f"Migration complete! Manifest saved to {output_path}")

if __name__ == "__main__":
    asyncio.run(main())
