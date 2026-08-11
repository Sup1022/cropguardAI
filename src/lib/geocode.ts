import type { GeoLocation } from './types';

const POPULAR_LOCATIONS: GeoLocation[] = [
  { latitude: 28.6139, longitude: 77.209, name: 'New Delhi', region: 'Delhi', country: 'India' },
  { latitude: 19.076, longitude: 72.8777, name: 'Mumbai', region: 'Maharashtra', country: 'India' },
  { latitude: 13.0827, longitude: 80.2707, name: 'Chennai', region: 'Tamil Nadu', country: 'India' },
  { latitude: 22.5726, longitude: 88.3639, name: 'Kolkata', region: 'West Bengal', country: 'India' },
  { latitude: 17.385, longitude: 78.4867, name: 'Hyderabad', region: 'Telangana', country: 'India' },
  { latitude: 18.5204, longitude: 73.8567, name: 'Pune', region: 'Maharashtra', country: 'India' },
  { latitude: 26.9124, longitude: 75.7873, name: 'Jaipur', region: 'Rajasthan', country: 'India' },
  { latitude: 23.2599, longitude: 77.4126, name: 'Bhopal', region: 'Madhya Pradesh', country: 'India' },
  { latitude: 21.1458, longitude: 79.0882, name: 'Nagpur', region: 'Maharashtra', country: 'India' },
  { latitude: 11.0168, longitude: 76.9558, name: 'Coimbatore', region: 'Tamil Nadu', country: 'India' },
  { latitude: 15.9129, longitude: 79.74, name: 'Guntur', region: 'Andhra Pradesh', country: 'India' },
  { latitude: 30.7333, longitude: 76.7794, name: 'Chandigarh', region: 'Punjab', country: 'India' },
  { latitude: 26.8467, longitude: 80.9462, name: 'Lucknow', region: 'Uttar Pradesh', country: 'India' },
  { latitude: 25.5941, longitude: 85.1376, name: 'Patna', region: 'Bihar', country: 'India' },
  { latitude: 23.0225, longitude: 72.5714, name: 'Ahmedabad', region: 'Gujarat', country: 'India' },
  { latitude: 12.9716, longitude: 77.5946, name: 'Bengaluru', region: 'Karnataka', country: 'India' },
  { latitude: 31.634, longitude: 74.8723, name: 'Amritsar', region: 'Punjab', country: 'India' },
  { latitude: 9.9312, longitude: 76.2673, name: 'Kochi', region: 'Kerala', country: 'India' },
  { latitude: 24.7136, longitude: 46.6753, name: 'Riyadh', region: 'Riyadh', country: 'Saudi Arabia' },
  { latitude: -1.2921, longitude: 36.8219, name: 'Nairobi', region: 'Nairobi', country: 'Kenya' },
  { latitude: 40.7128, longitude: -74.006, name: 'New York', region: 'NY', country: 'USA' },
  { latitude: 51.5074, longitude: -0.1278, name: 'London', region: 'England', country: 'UK' },
];

export function getPopularLocations(): GeoLocation[] {
  return POPULAR_LOCATIONS;
}

/**
 * Search locations using the Open-Meteo geocoding API (free, no key).
 */
export async function searchLocations(query: string): Promise<GeoLocation[]> {
  if (!query.trim()) return [];
  const params = new URLSearchParams({
    name: query.trim(),
    count: '8',
    language: 'en',
    format: 'json',
  });
  try {
    const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?${params}`);
    if (!res.ok) return [];
    const data = await res.json();
    if (!data.results) return [];
    return data.results.map((r: any) => ({
      latitude: r.latitude,
      longitude: r.longitude,
      name: r.name,
      region: r.admin1,
      country: r.country,
    }));
  } catch {
    return [];
  }
}

/**
 * Browser geolocation — returns a promise that resolves with coords.
 */
export function getBrowserLocation(): Promise<{ latitude: number; longitude: number }> {
  return new Promise((resolve, reject) => {
    if (!('geolocation' in navigator)) {
      reject(new Error('Geolocation not supported by this browser.'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
      (err) => reject(new Error(err.message || 'Could not get your location.')),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
    );
  });
}

/**
 * Reverse geocode coordinates to a readable name using Open-Meteo.
 */
export async function reverseGeocode(lat: number, lon: number): Promise<string> {
  try {
    const params = new URLSearchParams({
      latitude: String(lat),
      longitude: String(lon),
      language: 'en',
      format: 'json',
    });
    const res = await fetch(`https://geocoding-api.open-meteo.com/v1/reverse?${params}`);
    if (!res.ok) return `${lat.toFixed(2)}, ${lon.toFixed(2)}`;
    const data = await res.json();
    if (data.results && data.results[0]) {
      const r = data.results[0];
      return [r.name, r.admin1, r.country].filter(Boolean).join(', ');
    }
  } catch {
    // ignore
  }
  return `${lat.toFixed(2)}, ${lon.toFixed(2)}`;
}
