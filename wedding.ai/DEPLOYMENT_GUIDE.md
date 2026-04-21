# WeddingBudget.ai Deployment Guide

This guide ensures a seamless deployment of the consolidated WeddingBudget.ai platform.

## 1. Directory Structure
The production-ready code is located in the `wedding.ai/` directory:
- `wedding.ai/frontend`: Next.js 14 application (deploy to **Vercel**).
- `wedding.ai/backend`: FastAPI application (deploy to **Hugging Face Spaces** or any Python host).

## 2. Environment Variables
You must configure the following secrets in your deployment dashboards:

### Backend (Hugging Face / Python Host)
| Key | Description |
| :--- | :--- |
| `GEMINI_API_KEY` | Your Google AI Studio API Key. |
| `UNSPLASH_ACCESS_KEY` | Access key for hotel image recovery. |
| `SUPABASE_URL` | Your Supabase project URL. |
| `SUPABASE_KEY` | Your Supabase service role or anon key. |

### Frontend (Vercel)
| Key | Description |
| :--- | :--- |
| `NEXT_PUBLIC_API_URL` | The URL of your deployed backend (e.g., `https://user-space.hf.space`). |

## 3. Deployment Steps

### Frontend (Vercel)
1. Link your GitHub repository to Vercel.
2. Set the **Root Directory** to `wedding.ai/frontend`.
3. Add the `NEXT_PUBLIC_API_URL` environment variable.
4. Deploy!

### Backend (Hugging Face Spaces)
1. Create a new **Docker** or **Python** Space.
2. If using Python, the directory should be `wedding.ai/backend`. Configure your runner to execute `main.py`.
3. Add the required Environment Variables in the "Settings" tab.

## 4. Stability Improvements
- **Checklist & Vendors**: Now persistently stored via `localStorage` with a race-condition-safe hydration pattern.
- **Venue Scouting**: Results are cached in `localStorage` to persist across page navigations.
- **AI Agent**: Upgraded to 6+ recommendations with live per-plate pricing and URLs.
