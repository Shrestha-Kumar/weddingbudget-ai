from better_scraper import batch_scrape_and_upload
import asyncio
import os

async def main():
    queries = ["Luxury Indian wedding mandap", "Indian wedding table centerpieces decor"]
    await batch_scrape_and_upload(queries, limit_per_query=30)

if __name__ == "__main__":
    asyncio.run(main())
