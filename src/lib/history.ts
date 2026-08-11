import { supabase, supabaseConfigured } from './supabase';
import type { Advisory, DiagnosisResult, WeatherData, ActionTiming, GeoLocation } from './types';

export interface SavePayload {
  imageUrl: string;
  location: GeoLocation | null;
  weather: WeatherData | null;
  diagnosis: DiagnosisResult;
  timing: ActionTiming;
}

export async function saveAdvisory(payload: SavePayload): Promise<void> {
  if (!supabaseConfigured) return;
  const { error } = await supabase.from('advisories').insert({
    image_url: payload.imageUrl,
    location_name: payload.location?.name ?? null,
    latitude: payload.location?.latitude ?? null,
    longitude: payload.location?.longitude ?? null,
    weather_summary: payload.weather as any,
    crop_guess: payload.diagnosis.cropGuess,
    diagnosis: payload.diagnosis.diseaseName,
    confidence: payload.diagnosis.confidence,
    symptoms: payload.diagnosis.symptoms as any,
    treatment: payload.diagnosis.treatment as any,
    act_now: payload.timing.canActNow,
    action_window: payload.timing.nextWindow,
    risk_level: payload.timing.riskLevel,
  });
  if (error) {
    // eslint-disable-next-line no-console
    console.warn('Could not save advisory:', error.message);
  }
}

export async function loadAdvisories(): Promise<Advisory[]> {
  if (!supabaseConfigured) return [];
  const { data, error } = await supabase
    .from('advisories')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(20);
  if (error) {
    // eslint-disable-next-line no-console
    console.warn('Could not load advisories:', error.message);
    return [];
  }
  return (data as Advisory[]) ?? [];
}

export async function deleteAdvisory(id: string): Promise<void> {
  if (!supabaseConfigured) return;
  const { error } = await supabase.from('advisories').delete().eq('id', id);
  if (error) {
    // eslint-disable-next-line no-console
    console.warn('Could not delete advisory:', error.message);
  }
}
