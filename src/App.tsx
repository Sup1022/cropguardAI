import { useState, useCallback, useEffect } from 'react';
import { Sparkles, RotateCcw, AlertCircle } from 'lucide-react';
import type { Language, GeoLocation, WeatherData, DiagnosisResult, ActionTiming, Advisory } from '@/lib/types';
import { t } from '@/lib/i18n';
import { fetchLiveWeather, demoWeather } from '@/lib/weather';
import { diagnoseImage, evaluateActionTiming } from '@/lib/diagnosis';
import { saveAdvisory } from '@/lib/history';

import Header from '@/components/Header';
import Hero from '@/components/Hero';
import QuoteCard from '@/components/QuoteCard';
import UploadArea from '@/components/UploadArea';
import LocationPicker from '@/components/LocationPicker';
import WeatherDashboard from '@/components/WeatherDashboard';
import DiagnosisCard from '@/components/DiagnosisCard';
import TreatmentCard from '@/components/TreatmentCard';
import ActNowCard from '@/components/ActNowCard';
import AnalyzingOverlay from '@/components/AnalyzingOverlay';
import CropCalendar from '@/components/CropCalendar';
import HistoryPanel from '@/components/HistoryPanel';
import About from '@/components/About';
import Disclaimer from '@/components/Disclaimer';
import Footer from '@/components/Footer';

export default function App() {
  const [lang, setLang] = useState<Language>('en');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [location, setLocation] = useState<GeoLocation | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState<string | null>(null);
  const [diagnosis, setDiagnosis] = useState<DiagnosisResult | null>(null);
  const [timing, setTiming] = useState<ActionTiming | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [disclaimerAck, setDisclaimerAck] = useState(false);
  const [historyRefresh, setHistoryRefresh] = useState(0);

  // Fetch weather whenever location changes
  useEffect(() => {
    if (!location) {
      setWeather(null);
      setWeatherError(null);
      return;
    }
    let active = true;
    setWeatherLoading(true);
    setWeatherError(null);
    fetchLiveWeather(location)
      .then((data) => {
        if (active) { setWeather(data); setWeatherLoading(false); }
      })
      .catch((err) => {
        if (!active) return;
        console.warn('Live weather failed, using demo:', err.message);
        setWeather(demoWeather());
        setWeatherError(err.message || 'Weather fetch failed');
        setWeatherLoading(false);
      });
    return () => { active = false; };
  }, [location]);

  const scrollToId = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const handleNav = useCallback((id: string) => {
    if (id === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      scrollToId(id);
    }
  }, [scrollToId]);

  const handleAnalyze = useCallback(async () => {
    if (!imageUrl) {
      setError(t(lang, 'error_image'));
      return;
    }
    setError(null);
    setAnalyzing(true);
    setDiagnosis(null);
    setTiming(null);

    // Ensure we have weather — use demo if no location
    const weatherData = weather ?? demoWeather();

    try {
      // Minimum display time for the animation
      const [result] = await Promise.all([
        diagnoseImage(imageUrl),
        new Promise((r) => setTimeout(r, 2800)),
      ]);

      const actionTiming = evaluateActionTiming(result, weatherData);
      setDiagnosis(result);
      setTiming(actionTiming);
      setAnalyzing(false);

      // Save to history
      saveAdvisory({
        imageUrl,
        location,
        weather: weatherData,
        diagnosis: result,
        timing: actionTiming,
      }).then(() => setHistoryRefresh((p) => p + 1));

      // Scroll to results
      setTimeout(() => scrollToId('results'), 100);
    } catch (err: any) {
      setAnalyzing(false);
      setError(err.message || t(lang, 'error_generic'));
    }
  }, [imageUrl, weather, lang, location, scrollToId]);

  const handleReset = useCallback(() => {
    setImageUrl(null);
    setDiagnosis(null);
    setTiming(null);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleViewHistory = useCallback((advisory: Advisory) => {
    if (advisory.image_url) setImageUrl(advisory.image_url);
    setLocation(advisory.latitude && advisory.longitude ? {
      latitude: advisory.latitude,
      longitude: advisory.longitude,
      name: advisory.location_name ?? 'Unknown',
    } : null);
    setWeather(advisory.weather_summary);
    if (advisory.diagnosis && advisory.symptoms && advisory.treatment) {
      const result: DiagnosisResult = {
        diseaseName: advisory.diagnosis,
        diseaseNameKey: '',
        cropGuess: advisory.crop_guess ?? 'Unknown',
        cropGuessKey: '',
        confidence: advisory.confidence ?? 0,
        severity: 'moderate',
        symptoms: advisory.symptoms,
        causes: [],
        treatment: advisory.treatment,
        spreadRisk: '',
        funghiFavorable: false,
      };
      setDiagnosis(result);
      if (advisory.act_now != null && advisory.action_window && advisory.risk_level) {
        setTiming({
          canActNow: advisory.act_now,
          reason: '',
          recommendation: '',
          nextWindow: advisory.action_window,
          riskLevel: advisory.risk_level as ActionTiming['riskLevel'],
          riskFactors: [],
          safeActions: [],
          unsafeActions: [],
        });
      }
    }
    setTimeout(() => scrollToId('results'), 100);
  }, [scrollToId]);

  const canAnalyze = imageUrl && !analyzing;

  return (
    <div className="min-h-screen bg-neutral-50">
      {!disclaimerAck && <Disclaimer lang={lang} onAck={() => setDisclaimerAck(true)} />}

      <Header lang={lang} setLang={setLang} onNav={handleNav} />

      <main>
        <Hero lang={lang} onStart={() => scrollToId('analyze')} />

        <QuoteCard lang={lang} />

        {/* Analyze section */}
        <section id="analyze" className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-6 scroll-mt-20">
          <div className="text-center mb-2">
            <h2 className="font-display text-2xl sm:text-3xl font-bold mb-2 flex items-center justify-center gap-2" style={{ background: 'linear-gradient(135deg, #15803d 0%, #1d4ed8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              <Sparkles className="w-7 h-7" style={{ color: '#16a34a', WebkitTextFillColor: '#16a34a' }} />
              {t(lang, 'upload_title')}
            </h2>
            <p className="text-sm text-neutral-500">{t(lang, 'upload_subtitle')}</p>
          </div>

          {error && (
            <div className="flex items-start gap-2 p-4 rounded-xl bg-error-50 border border-error-200 text-error-700 text-sm animate-fade-in">
              <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <UploadArea
            lang={lang}
            imageUrl={imageUrl}
            onImage={setImageUrl}
            onClear={() => setImageUrl(null)}
          />

          <LocationPicker
            lang={lang}
            location={location}
            onLocation={setLocation}
          />

          {weather && (
            <WeatherDashboard
              lang={lang}
              weather={weather}
              loading={weatherLoading}
              error={weatherError}
            />
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleAnalyze}
              disabled={!canAnalyze}
              className="btn-primary flex-1 text-base py-4"
            >
              <Sparkles className="w-5 h-5" />
              {t(lang, 'analyze_btn')}
            </button>
            {(diagnosis || imageUrl) && (
              <button onClick={handleReset} className="btn-secondary">
                <RotateCcw className="w-4 h-4" />
                {t(lang, 'reset')}
              </button>
            )}
          </div>
        </section>

        {/* Results section */}
        {diagnosis && timing && (
          <section id="results" className="max-w-4xl mx-auto px-4 sm:px-6 pb-12 space-y-6 scroll-mt-20">
            <div className="border-t border-neutral-200 pt-8">
              <DiagnosisCard lang={lang} diagnosis={diagnosis} />
            </div>
            <TreatmentCard lang={lang} steps={diagnosis.treatment} />
            <ActNowCard lang={lang} timing={timing} />
          </section>
        )}

        <CropCalendar lang={lang} />

        <HistoryPanel lang={lang} refreshKey={historyRefresh} onView={handleViewHistory} />

        <About lang={lang} />
      </main>

      <Footer lang={lang} />

      {analyzing && <AnalyzingOverlay lang={lang} />}
    </div>
  );
}
