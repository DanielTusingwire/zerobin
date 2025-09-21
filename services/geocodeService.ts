// Geocoding service using OpenStreetMap Nominatim API
export interface GeocodeResult {
  display_name: string;
  lat: string;
  lon: string;
}

export async function geocodeSearch(query: string): Promise<GeocodeResult[]> {
  if (!query) return [];
  const apiUrl =
    process.env.GEOCODE_API_URL ||
    'https://nominatim.openstreetmap.org/search?format=json&q=';
  const url = `${apiUrl}${encodeURIComponent(query)}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch geocode results');
  return await response.json();
}
