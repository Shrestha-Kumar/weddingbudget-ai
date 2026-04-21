from better_scraper import batch_scrape_and_upload
import asyncio
import os

async def main():
    queries = [
        "Luxury Indian Baraat procession grand",
        "Indian wedding Pheras fire ritual mandap",
        "Indian wedding Reception stage decor elegant"
    ]
    # Limit per query set to 40 to quickly expand these specific sparse categories
    await batch_scrape_and_upload(queries, limit_per_query=40)

if __name__ == "__main__":
    asyncio.run(main())
