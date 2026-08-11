/*
# Create advisories table (single-tenant, no auth)

## Purpose
Stores CropGuard AI advisory sessions so farmers can review past diagnoses.
Each row captures the inputs (photo URL, location, weather snapshot) and the
AI-generated advisory output (diagnosis, confidence, treatment, action timing).

## New Tables
- `advisories`
  - `id` (uuid, primary key)
  - `image_url` (text, nullable) - data URL of the uploaded leaf photo
  - `location_name` (text, nullable) - human-readable location label
  - `latitude` (double precision, nullable)
  - `longitude` (double precision, nullable)
  - `weather_summary` (jsonb, nullable) - snapshot of weather at advisory time
  - `crop_guess` (text, nullable) - AI-guessed crop type
  - `diagnosis` (text, nullable) - likely disease/issue name
  - `confidence` (integer, nullable) - confidence percentage 0-100
  - `symptoms` (jsonb, nullable) - array of observed symptoms
  - `treatment` (jsonb, nullable) - treatment steps
  - `act_now` (boolean, nullable) - whether farmer should act immediately
  - `action_window` (text, nullable) - recommended action timing
  - `risk_level` (text, nullable) - weather risk level
  - `disclaimer_acknowledged` (boolean, default false)
  - `created_at` (timestamptz, default now())

## Security
- Enable RLS on `advisories`.
- Allow anon + authenticated full CRUD because the app is intentionally
  shared/public (no sign-in screen). USING (true) is acceptable here because
  all advisory data is intentionally public and shared across the app.

## Notes
1. No user_id / auth coupling — this is a single-tenant demo app.
2. Weather and diagnosis are stored as JSONB for flexibility.
3. image_url stores a data URL (base64) of the uploaded photo so history
   remains viewable without external storage.
*/

CREATE TABLE IF NOT EXISTS advisories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url text,
  location_name text,
  latitude double precision,
  longitude double precision,
  weather_summary jsonb,
  crop_guess text,
  diagnosis text,
  confidence integer,
  symptoms jsonb,
  treatment jsonb,
  act_now boolean,
  action_window text,
  risk_level text,
  disclaimer_acknowledged boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE advisories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_advisories" ON advisories;
CREATE POLICY "anon_select_advisories" ON advisories FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_advisories" ON advisories;
CREATE POLICY "anon_insert_advisories" ON advisories FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_advisories" ON advisories;
CREATE POLICY "anon_update_advisories" ON advisories FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_advisories" ON advisories;
CREATE POLICY "anon_delete_advisories" ON advisories FOR DELETE
  TO anon, authenticated USING (true);
