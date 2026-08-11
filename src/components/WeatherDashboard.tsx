import { useState } from 'react';
import {
  Cloud, CloudRain, Sun, Wind, Droplets, Thermometer, Loader2,
  AlertTriangle, Calendar, Clock, CloudSun,
} from 'lucide-react';
import type { Language, WeatherData } from '@/lib/types';
import { t } from '@/lib/i18n';
import { isRainCode, isStormCode } from '@/lib/weather';

interface WeatherDashboardProps {
  lang: Language;
  weather: WeatherData | null;
  loading: boolean;
  error: string | null;
}

function weatherIcon(code: number, isDay = true) {
  if (isStormCode(code)) return CloudRain;
  if (isRainCode(code)) return CloudRain;
  if (code === 0 || code === 1) return isDay ? Sun : Cloud;
  if (code === 2 || code === 3) return CloudSun;
  if (code === 45 || code === 48) return Cloud;
  return Cloud;
}

export default function WeatherDashboard({ lang, weather, loading, error }: WeatherDashboardProps) {
  const [tab, setTab] = useState<'daily' | 'hourly'>('daily');

  if (loading) {
    return (
      <div className="card p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-4">
          <Loader2 className="w-5 h-5 text-primary-500 animate-spin" />
          <span className="text-sm text-neutral-500">{t(lang, 'weather_fetching')}</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton h-20" />)}
        </div>
      </div>
    );
  }

  if (!weather) return null;

  const { current, daily, hourly, isLive } = weather;
  const TempIcon = weatherIcon(current.weatherCode, current.isDay);

  return (
    <div className="card p-6 sm:p-8">
      <div className="flex items-start justify-between mb-5 flex-wrap gap-2">
        <div>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-neutral-900 mb-1">
            {t(lang, 'weather_title')}
          </h2>
          <p className="text-sm text-neutral-500">{t(lang, 'weather_subtitle')}</p>
        </div>
        <span className={`badge ${isLive ? 'bg-success-100 text-success-700' : 'bg-neutral-100 text-neutral-500'}`}>
          <span className={`w-2 h-2 rounded-full ${isLive ? 'bg-success-500 animate-pulse' : 'bg-neutral-400'}`} />
          {isLive ? t(lang, 'weather_live') : t(lang, 'weather_demo')}
        </span>
      </div>

      {error && (
        <div className="mb-4 flex items-start gap-2 p-3 rounded-lg bg-warning-50 border border-warning-200 text-warning-700 text-sm">
          <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{t(lang, 'weather_failed')}</span>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        <div className="rounded-xl bg-gradient-to-br from-primary-50 to-primary-100 border border-primary-200 p-3 col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-medium text-primary-600 mb-0.5">{t(lang, 'weather_temp')}</div>
              <div className="text-2xl font-bold text-neutral-900">{current.temperature}°C</div>
            </div>
            <TempIcon className="w-8 h-8 text-primary-600" />
          </div>
          <div className="text-xs text-neutral-500 mt-1">{current.weatherDescription}</div>
        </div>

        <StatCard icon={Thermometer} label={t(lang, 'weather_feels')} value={`${current.apparentTemperature}°C`} />
        <StatCard icon={Droplets} label={t(lang, 'weather_humidity')} value={`${current.humidity}%`} />
        <StatCard icon={Wind} label={t(lang, 'weather_wind')} value={`${current.windSpeed} km/h`} />
        <StatCard icon={CloudRain} label={t(lang, 'weather_rain')} value={`${current.precipitation} mm`} />
        {current.soilTemperature != null && (
          <StatCard icon={Sun} label={t(lang, 'weather_soil')} value={`${Math.round(current.soilTemperature)}°C`} />
        )}
      </div>

      <div className="flex gap-1 mb-4 p-1 bg-neutral-100 rounded-lg">
        <button
          onClick={() => setTab('daily')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md text-sm font-medium transition-all
            ${tab === 'daily' ? 'bg-white text-primary-700 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'}`}
        >
          <Calendar className="w-4 h-4" />
          {t(lang, 'weather_forecast')}
        </button>
        <button
          onClick={() => setTab('hourly')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md text-sm font-medium transition-all
            ${tab === 'hourly' ? 'bg-white text-primary-700 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'}`}
        >
          <Clock className="w-4 h-4" />
          {t(lang, 'weather_next48')}
        </button>
      </div>

      {tab === 'daily' ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {daily.map((d, i) => {
            const DIcon = weatherIcon(d.weatherCode, true);
            const dt = new Date(d.date);
            return (
              <div key={i} className="rounded-lg border border-neutral-200 p-3 text-center hover:border-primary-300 transition-colors">
                <div className="text-xs font-semibold text-neutral-500 mb-1">
                  {i === 0 ? 'Today' : dt.toLocaleDateString(undefined, { weekday: 'short' })}
                </div>
                <DIcon className="w-7 h-7 mx-auto text-primary-500 mb-1.5" />
                <div className="text-xs text-neutral-400 mb-1.5">{d.weatherDescription}</div>
                <div className="flex items-center justify-center gap-1 text-sm font-semibold text-neutral-700">
                  <span className="text-error-500">{d.tempMax}°</span>
                  <span className="text-neutral-300">/</span>
                  <span className="text-accent-500">{d.tempMin}°</span>
                </div>
                <div className="flex items-center justify-center gap-1 mt-1.5 text-xs text-accent-500 font-medium">
                  <Droplets className="w-3 h-3" />
                  {d.precipitationProbability}%
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex gap-2 pb-1 min-w-max">
            {hourly.slice(0, 24).map((h, i) => {
              const HIcon = weatherIcon(h.weatherCode, true);
              const dt = new Date(h.time);
              return (
                <div key={i} className="rounded-lg border border-neutral-200 p-2.5 text-center w-16 shrink-0 hover:border-primary-300 transition-colors">
                  <div className="text-[10px] font-semibold text-neutral-400 mb-1">
                    {i === 0 ? 'Now' : dt.toLocaleTimeString(undefined, { hour: 'numeric', hour12: true })}
                  </div>
                  <HIcon className="w-5 h-5 mx-auto text-primary-500 mb-1" />
                  <div className="text-sm font-bold text-neutral-700">{h.temperature}°</div>
                  <div className="flex items-center justify-center gap-0.5 mt-1 text-[10px] text-accent-500 font-medium">
                    <Droplets className="w-2.5 h-2.5" />
                    {h.precipitationProbability}%
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="rounded-xl bg-neutral-50 border border-neutral-200 p-3">
      <div className="flex items-center gap-1.5 mb-1">
        <Icon className="w-3.5 h-3.5 text-neutral-400" />
        <span className="text-xs font-medium text-neutral-500">{label}</span>
      </div>
      <div className="text-lg font-bold text-neutral-900">{value}</div>
    </div>
  );
}
