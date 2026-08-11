import type { GeoLocation, WeatherData, WeatherDaily, WeatherHour } from './types';

const WEATHER_CODE_MAP: Record<number, string> = {
  0: 'Clear sky', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
  45: 'Fog', 48: 'Depositing rime fog', 51: 'Light drizzle', 53: 'Moderate drizzle',
  55: 'Dense drizzle', 56: 'Light freezing drizzle', 57: 'Dense freezing drizzle',
  61: 'Slight rain', 63: 'Moderate rain', 65: 'Heavy rain', 66: 'Light freezing rain',
  67: 'Heavy freezing rain', 71: 'Slight snowfall', 73: 'Moderate snowfall',
  75: 'Heavy snowfall', 77: 'Snow grains', 80: 'Slight rain showers',
  81: 'Moderate rain showers', 82: 'Violent rain showers', 85: 'Slight snow showers',
  86: 'Heavy snow showers', 95: 'Thunderstorm', 96: 'Thunderstorm with slight hail',
  99: 'Thunderstorm with heavy hail',
};

export function weatherCodeDescription(code: number): string {
  return WEATHER_CODE_MAP[code] ?? 'Unknown conditions';
}

export function isRainCode(code: number): boolean {
  return [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82, 95, 96, 99].includes(code);
}

export function isStormCode(code: number): boolean {
  return [95, 96, 99].includes(code);
}

/**
 * Fetch live weather from the Open-Meteo API (free, no key required).
 * Clearly marks data as live. Throws on network failure so the UI can fall back.
 */
export async function fetchLiveWeather(location: GeoLocation): Promise<WeatherData> {
  const params = new URLSearchParams({
    latitude: String(location.latitude),
    longitude: String(location.longitude),
    current: [
      'temperature_2m',
      'apparent_temperature',
      'relative_humidity_2m',
      'precipitation',
      'weather_code',
      'wind_speed_10m',
      'cloud_cover',
      'is_day',
      'soil_temperature_0cm',
      'soil_moisture_0_to_1cm',
    ].join(','),
    hourly: [
      'temperature_2m',
      'precipitation_probability',
      'precipitation',
      'weather_code',
      'wind_speed_10m',
      'relative_humidity_2m',
    ].join(','),
    daily: [
      'weather_code',
      'temperature_2m_max',
      'temperature_2m_min',
      'precipitation_probability_max',
      'precipitation_sum',
      'wind_speed_10m_max',
      'relative_humidity_2m_max',
      'sunrise',
      'sunset',
    ].join(','),
    timezone: 'auto',
    forecast_days: '7',
    wind_speed_unit: 'kmh',
    temperature_unit: 'celsius',
    precipitation_unit: 'mm',
  });

  const url = `https://api.open-meteo.com/v1/forecast?${params.toString()}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Weather API error: ${res.status}`);
  }
  const data = await res.json();

  const current = {
    temperature: Math.round(data.current.temperature_2m ?? 0),
    apparentTemperature: Math.round(data.current.apparent_temperature ?? 0),
    humidity: Math.round(data.current.relative_humidity_2m ?? 0),
    windSpeed: Math.round(data.current.wind_speed_10m ?? 0),
    weatherCode: data.current.weather_code ?? 0,
    weatherDescription: weatherCodeDescription(data.current.weather_code ?? 0),
    isDay: Boolean(data.current.is_day ?? 1),
    precipitation: data.current.precipitation ?? 0,
    cloudCover: Math.round(data.current.cloud_cover ?? 0),
    soilTemperature: data.current.soil_temperature_0cm,
    soilMoisture: data.current.soil_moisture_0_to_1cm,
  };

  // Build hourly for next 48h starting from current hour
  const nowIdx = findCurrentHourIndex(data.hourly.time);
  const hourly: WeatherHour[] = [];
  for (let i = nowIdx; i < Math.min(nowIdx + 48, data.hourly.time.length); i++) {
    hourly.push({
      time: data.hourly.time[i],
      temperature: Math.round(data.hourly.temperature_2m[i] ?? 0),
      precipitationProbability: data.hourly.precipitation_probability?.[i] ?? 0,
      precipitation: data.hourly.precipitation?.[i] ?? 0,
      weatherCode: data.hourly.weather_code?.[i] ?? 0,
      windSpeed: Math.round(data.hourly.wind_speed_10m?.[i] ?? 0),
      humidity: Math.round(data.hourly.relative_humidity_2m?.[i] ?? 0),
    });
  }

  const daily: WeatherDaily[] = data.daily.time.map((date: string, i: number) => ({
    date,
    weatherCode: data.daily.weather_code[i] ?? 0,
    weatherDescription: weatherCodeDescription(data.daily.weather_code[i] ?? 0),
    tempMax: Math.round(data.daily.temperature_2m_max[i] ?? 0),
    tempMin: Math.round(data.daily.temperature_2m_min[i] ?? 0),
    precipitationProbability: data.daily.precipitation_probability_max?.[i] ?? 0,
    precipitation: data.daily.precipitation_sum?.[i] ?? 0,
    windSpeedMax: Math.round(data.daily.wind_speed_10m_max?.[i] ?? 0),
    humidity: Math.round(data.daily.relative_humidity_2m_max?.[i] ?? 0),
    sunrise: data.daily.sunrise?.[i] ?? '',
    sunset: data.daily.sunset?.[i] ?? '',
  }));

  return {
    current,
    hourly,
    daily,
    fetchedAt: new Date().toISOString(),
    isLive: true,
  };
}

function findCurrentHourIndex(times: string[]): number {
  const now = Date.now();
  for (let i = 0; i < times.length; i++) {
    const t = new Date(times[i]).getTime();
    if (t >= now - 30 * 60 * 1000) return i;
  }
  return 0;
}

/**
 * Demo weather used when live fetch fails or no location selected.
 * Clearly labeled as demo data in the UI.
 */
export function demoWeather(): WeatherData {
  const now = new Date();
  const hourly: WeatherHour[] = Array.from({ length: 48 }, (_, i) => {
    const t = new Date(now.getTime() + i * 60 * 60 * 1000);
    const h = t.getHours();
    const baseTemp = 26 + Math.sin(((h - 14) / 24) * Math.PI * 2) * 6;
    const rain = i >= 6 && i <= 9 ? 70 : i >= 10 && i <= 14 ? 20 : 5;
    return {
      time: t.toISOString(),
      temperature: Math.round(baseTemp),
      precipitationProbability: rain,
      precipitation: rain > 50 ? 2.4 : rain > 20 ? 0.6 : 0,
      weatherCode: rain > 50 ? 63 : rain > 20 ? 2 : 0,
      windSpeed: 8 + Math.round(Math.random() * 6),
      humidity: 60 + Math.round(Math.random() * 25),
    };
  });

  const daily: WeatherDaily[] = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now.getTime() + i * 24 * 60 * 60 * 1000);
    const rain = i === 1 || i === 2 ? 75 : i === 5 ? 40 : 15;
    return {
      date: d.toISOString().slice(0, 10),
      weatherCode: rain > 50 ? 63 : rain > 30 ? 2 : 0,
      weatherDescription: weatherCodeDescription(rain > 50 ? 63 : rain > 30 ? 2 : 0),
      tempMax: 30 + Math.round(Math.random() * 4),
      tempMin: 20 + Math.round(Math.random() * 3),
      precipitationProbability: rain,
      precipitation: rain > 50 ? 8.2 : rain > 30 ? 2.1 : 0.2,
      windSpeedMax: 14 + Math.round(Math.random() * 8),
      humidity: 65 + Math.round(Math.random() * 20),
      sunrise: '06:12',
      sunset: '18:45',
    };
  });

  return {
    current: {
      temperature: 27,
      apparentTemperature: 29,
      humidity: 72,
      windSpeed: 10,
      weatherCode: 2,
      weatherDescription: 'Partly cloudy',
      isDay: true,
      precipitation: 0,
      cloudCover: 45,
      soilTemperature: 24,
      soilMoisture: 0.32,
    },
    hourly,
    daily,
    fetchedAt: new Date().toISOString(),
    isLive: false,
  };
}
