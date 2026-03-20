export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function fetchPing() {
  const res = await fetch(`${API_BASE_URL}/ping`);
  if (!res.ok) throw new Error("Failed to ping server");
  return res.json();
}

export async function fetchLogistics(data: { guests_count: number; outstation_percentage: number; distance_km: number }) {
  const res = await fetch(`${API_BASE_URL}/logistics`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to calculate logistics");
  return res.json();
}

export async function fetchFnB(data: { meal_type: string; venue_tier: string; guest_count: number }) {
  const res = await fetch(`${API_BASE_URL}/fnb`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to calculate F&B");
  return res.json();
}

export async function fetchArtists(data: { category: string; tier?: number; name?: string }) {
  const res = await fetch(`${API_BASE_URL}/artists`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to calculate artists");
  return res.json();
}

export async function fetchSundries(data: { hotel_tier?: string }) {
  const res = await fetch(`${API_BASE_URL}/sundries`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to calculate sundries");
  return res.json();
}

export async function predictImageCost(imageUrl: string) {
  const res = await fetch(`${API_BASE_URL}/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ image_url: imageUrl }),
  });
  if (!res.ok) throw new Error("Failed to predict image cost");
  return res.json();
}

export async function createSession(data: any) {
  const res = await fetch(`${API_BASE_URL}/session`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create session");
  return res.json();
}

export async function getSession(token: string) {
  const res = await fetch(`${API_BASE_URL}/session/${token}`);
  if (!res.ok) throw new Error("Failed to get session");
  return res.json();
}

export async function fetchAllSessions() {
  const res = await fetch(`${API_BASE_URL}/sessions`, { cache: 'no-store' });
  if (!res.ok) throw new Error("Failed to fetch sessions");
  return res.json();
}

export async function fetchLibraryImages(query?: string) {
  const url = query ? `${API_BASE_URL}/images?query=${encodeURIComponent(query)}&limit=100` : `${API_BASE_URL}/images?limit=100`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch library images");
  return res.json();
}
