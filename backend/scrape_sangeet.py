from better_scraper import batch_scrape_and_upload
import asyncio

async def main():
    queries = [
       "Indian wedding sangeet dance performance",
       "Indian bride sangeet henna ceremony",
       "Indian wedding musicians dhol stage"
    ]
    await batch_scrape_and_upload(queries, limit_per_query=30)

asyncio.run(main())
