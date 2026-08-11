export interface GeoLocation {
  latitude: number;
  longitude: number;
  name: string;
  region?: string;
  country?: string;
}

export interface WeatherCurrent {
  temperature: number;
  apparentTemperature: number;
  humidity: number;
  windSpeed: number;
  weatherCode: number;
  weatherDescription: string;
  isDay: boolean;
  precipitation: number;
  cloudCover: number;
  soilTemperature?: number;
  soilMoisture?: number;
}

export interface WeatherHour {
  time: string;
  temperature: number;
  precipitationProbability: number;
  precipitation: number;
  weatherCode: number;
  windSpeed: number;
  humidity: number;
}

export interface WeatherDaily {
  date: string;
  weatherCode: number;
  weatherDescription: string;
  tempMax: number;
  tempMin: number;
  precipitationProbability: number;
  precipitation: number;
  windSpeedMax: number;
  humidity: number;
  sunrise: string;
  sunset: string;
}

export interface WeatherData {
  current: WeatherCurrent;
  hourly: WeatherHour[];
  daily: WeatherDaily[];
  fetchedAt: string;
  isLive: boolean;
}

export interface DiseaseSymptom {
  label: string;
  description: string;
}

export interface TreatmentStep {
  title: string;
  detail: string;
  priority: 'immediate' | 'short-term' | 'preventive';
}

export interface DiagnosisResult {
  diseaseName: string;
  diseaseNameKey: string;
  cropGuess: string;
  cropGuessKey: string;
  confidence: number;
  severity: 'low' | 'moderate' | 'high' | 'severe';
  symptoms: DiseaseSymptom[];
  causes: string[];
  treatment: TreatmentStep[];
  spreadRisk: string;
  funghiFavorable: boolean;
}

export interface ActionTiming {
  canActNow: boolean;
  reason: string;
  recommendation: string;
  nextWindow: string;
  riskLevel: 'low' | 'moderate' | 'high' | 'severe';
  riskFactors: string[];
  safeActions: string[];
  unsafeActions: string[];
}

export interface Advisory {
  id: string;
  image_url: string | null;
  location_name: string | null;
  latitude: number | null;
  longitude: number | null;
  weather_summary: WeatherData | null;
  crop_guess: string | null;
  diagnosis: string | null;
  confidence: number | null;
  symptoms: DiseaseSymptom[] | null;
  treatment: TreatmentStep[] | null;
  act_now: boolean | null;
  action_window: string | null;
  risk_level: string | null;
  created_at: string;
}

export type Language = 'en' | 'hi' | 'es' | 'fr' | 'sw' | 'bn' | 'ta' | 'te';
