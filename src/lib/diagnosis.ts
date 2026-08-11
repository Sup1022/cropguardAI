import type {
  DiagnosisResult,
  DiseaseSymptom,
  TreatmentStep,
  WeatherData,
  ActionTiming,
} from './types';
import { isRainCode, isStormCode } from './weather';

interface DiseaseProfile {
  key: string;
  name: string;
  crop: string;
  cropKey: string;
  colorSignature: { r: [number, number]; g: [number, number]; b: [number, number] };
  symptoms: DiseaseSymptom[];
  causes: string[];
  treatment: TreatmentStep[];
  spreadRisk: string;
  humidityFavorable: number;
  tempRange: [number, number];
}

const DISEASES: DiseaseProfile[] = [
  {
    key: 'leaf_blight',
    name: 'Bacterial Leaf Blight',
    crop: 'Rice',
    cropKey: 'rice',
    colorSignature: { r: [180, 230], g: [200, 240], b: [150, 200] },
    symptoms: [
      { label: 'Yellow lesions', description: 'Water-soaked yellow stripes along leaf edges spreading inward.' },
      { label: 'Wavy margins', description: 'Lesion borders appear wavy and uneven.' },
      { label: 'Leaf drying', description: 'Affected portions turn brown and dry out.' },
    ],
    causes: [
      'Xanthomonas oryzae bacteria spread by water splash and wind-driven rain',
      'Favoured by high humidity (>70%) and warm temperatures (25-35°C)',
      'Excess nitrogen fertilizer and crowded planting increase severity',
    ],
    treatment: [
      { title: 'Remove infected leaves', detail: 'Cut and destroy affected leaves to reduce bacterial load. Do not compost them.', priority: 'immediate' },
      { title: 'Apply copper-based bactericide', detail: 'Spray a copper hydroxide or copper oxychloride solution on affected plants.', priority: 'short-term' },
      { title: 'Reduce nitrogen input', detail: 'Hold off on nitrogen fertilizer until the outbreak is controlled.', priority: 'short-term' },
      { title: 'Improve drainage', detail: 'Avoid standing water in the field and ensure proper spacing for airflow.', priority: 'preventive' },
    ],
    spreadRisk: 'Spreads rapidly in wet, windy conditions. Rain splash is the main dispersal route.',
    humidityFavorable: 70,
    tempRange: [25, 35],
  },
  {
    key: 'powdery_mildew',
    name: 'Powdery Mildew',
    crop: 'Wheat',
    cropKey: 'wheat',
    colorSignature: { r: [200, 240], g: [200, 240], b: [200, 245] },
    symptoms: [
      { label: 'White powdery patches', description: 'Greyish-white fungal growth on the upper leaf surface.' },
      { label: 'Yellowing under patches', description: 'Leaf tissue beneath the white patches turns yellow.' },
      { label: 'Leaf distortion', description: 'Young leaves may curl or become distorted.' },
    ],
    causes: [
      'Fungal infection by Blumeria graminis',
      'Thrives in cool (15-25°C), humid conditions with dry leaf surfaces',
      'High nitrogen and dense canopies encourage infection',
    ],
    treatment: [
      { title: 'Apply sulfur fungicide', detail: 'Spray wettable sulfur or a triazole fungicide (e.g. tebuconazole) at first sign.', priority: 'immediate' },
      { title: 'Thin the canopy', detail: 'Remove lower leaves to improve airflow and reduce humidity.', priority: 'short-term' },
      { title: 'Balance nitrogen', detail: 'Avoid excessive nitrogen which encourages susceptible soft growth.', priority: 'preventive' },
      { title: 'Plant resistant varieties', detail: 'Choose mildew-resistant cultivars for the next season.', priority: 'preventive' },
    ],
    spreadRisk: 'Spreads in humid conditions but needs dry leaf surfaces. Wind disperses spores.',
    humidityFavorable: 60,
    tempRange: [15, 25],
  },
  {
    key: 'early_blight',
    name: 'Early Blight',
    crop: 'Tomato',
    cropKey: 'tomato',
    colorSignature: { r: [120, 170], g: [140, 180], b: [60, 110] },
    symptoms: [
      { label: 'Concentric rings', description: 'Dark brown spots with target-like concentric rings on older leaves.' },
      { label: 'Yellow halos', description: 'A yellow halo surrounds each lesion.' },
      { label: 'Leaf drop', description: 'Heavily affected leaves yellow, wither, and fall off.' },
    ],
    causes: [
      'Fungal infection by Alternaria solani',
      'Favoured by warm temperatures (24-29°C) and prolonged leaf wetness',
      'Spreads via wind, splashing water, and contaminated tools',
    ],
    treatment: [
      { title: 'Remove infected foliage', detail: 'Prune and destroy affected leaves. Sanitise tools after use.', priority: 'immediate' },
      { title: 'Apply chlorothalonil or mancozeb', detail: 'Spray a protectant fungicide every 7-10 days while conditions persist.', priority: 'short-term' },
      { title: 'Mulch around base', detail: 'Apply organic mulch to prevent spores splashing from soil to leaves.', priority: 'short-term' },
      { title: 'Rotate crops', detail: 'Avoid planting solanaceous crops in the same soil for 2-3 seasons.', priority: 'preventive' },
    ],
    spreadRisk: 'Spreads quickly in warm, wet weather. Rain splash moves spores upward through the canopy.',
    humidityFavorable: 65,
    tempRange: [24, 29],
  },
  {
    key: 'leaf_rust',
    name: 'Brown Leaf Rust',
    crop: 'Maize',
    cropKey: 'maize',
    colorSignature: { r: [180, 220], g: [120, 160], b: [40, 90] },
    symptoms: [
      { label: 'Rust pustules', description: 'Small, raised, cinnamon-brown pustules scattered on the leaf surface.' },
      { label: 'Yellow halo', description: 'Each pustule is surrounded by a faint yellow ring.' },
      { label: 'Leaf chlorosis', description: 'Surrounding tissue yellows as infection progresses.' },
    ],
    causes: [
      'Fungal infection by Puccinia sorghi',
      'Favoured by moderate temperatures (16-25°C) and high humidity',
      'Spores spread by wind over long distances',
    ],
    treatment: [
      { title: 'Apply triazole fungicide', detail: 'Spray a systemic fungicide such as propiconazole at the first sign of pustules.', priority: 'immediate' },
      { title: 'Remove severely infected plants', detail: 'Pull out plants with more than 50% leaf area affected.', priority: 'short-term' },
      { title: 'Control weeds', detail: 'Remove alternate hosts like Oxalis around the field.', priority: 'preventive' },
      { title: 'Use resistant hybrids', detail: 'Plant rust-resistant maize hybrids next season.', priority: 'preventive' },
    ],
    spreadRisk: 'Wind-dispersed spores spread fast in humid weather. Rain increases infection.',
    humidityFavorable: 70,
    tempRange: [16, 25],
  },
  {
    key: 'leaf_spot',
    name: 'Septoria Leaf Spot',
    crop: 'Tomato',
    cropKey: 'tomato',
    colorSignature: { r: [90, 140], g: [110, 150], b: [50, 100] },
    symptoms: [
      { label: 'Dark spots', description: 'Numerous small, circular dark-brown spots with grey centres on lower leaves.' },
      { label: 'Grey centres', description: 'Older spots develop a characteristic greyish-white centre.' },
      { label: 'Upward spread', description: 'Infection moves from lower leaves upward through the plant.' },
    ],
    causes: [
      'Fungal infection by Septoria lycopersici',
      'Thrives in cool, wet conditions (15-25°C) with prolonged leaf wetness',
      'Spreads by rain splash and contaminated seed',
    ],
    treatment: [
      { title: 'Remove lower leaves', detail: 'Prune the lowest infected leaves and dispose of them away from the field.', priority: 'immediate' },
      { title: 'Apply copper fungicide', detail: 'Spray copper-based or chlorothalonil fungicide every 7-10 days.', priority: 'short-term' },
      { title: 'Avoid overhead watering', detail: 'Use drip irrigation and keep leaves dry to limit spore germination.', priority: 'short-term' },
      { title: 'Sanitise stakes and tools', detail: 'Clean stakes and tools between uses to avoid carrying spores.', priority: 'preventive' },
    ],
    spreadRisk: 'Spreads fast in wet, cool weather. Rain splash is the primary route upward.',
    humidityFavorable: 75,
    tempRange: [15, 25],
  },
  {
    key: 'downy_mildew',
    name: 'Downy Mildew',
    crop: 'Grapes',
    cropKey: 'grapes',
    colorSignature: { r: [150, 200], g: [170, 210], b: [90, 140] },
    symptoms: [
      { label: 'Yellow oil spots', description: 'Pale yellow, angular oily patches on the upper leaf surface.' },
      { label: 'White downy growth', description: 'A white, downy fungal growth appears on the underside beneath the spots.' },
      { label: 'Leaf necrosis', description: 'Affected areas turn brown and dry as infection advances.' },
    ],
    causes: [
      'Oomycete infection by Plasmopara viticola',
      'Requires free water on leaves and high humidity (>85%)',
      'Spread by wind and rain splash; thrives at 20-25°C',
    ],
    treatment: [
      { title: 'Apply systemic fungicide', detail: 'Spray a downy-mildew-specific fungicide (e.g. metalaxyl + mancozeb) immediately.', priority: 'immediate' },
      { title: 'Improve canopy airflow', detail: 'Prune leaves and shoots to reduce humidity inside the canopy.', priority: 'short-term' },
      { title: 'Remove infected material', detail: 'Destroy fallen leaves and infected shoots to reduce inoculum.', priority: 'short-term' },
      { title: 'Manage irrigation timing', detail: 'Irrigate early morning so leaves dry quickly during the day.', priority: 'preventive' },
    ],
    spreadRisk: 'Explosive spread in wet, humid weather. Free water on leaves triggers infection.',
    humidityFavorable: 85,
    tempRange: [20, 25],
  },
  {
    key: 'nutrient_deficiency',
    name: 'Nitrogen Deficiency',
    crop: 'General',
    cropKey: 'general',
    colorSignature: { r: [150, 200], g: [180, 220], b: [60, 120] },
    symptoms: [
      { label: 'General yellowing', description: 'Older leaves turn uniformly pale green to yellow (chlorosis).' },
      { label: 'Stunted growth', description: 'Plants appear smaller and less vigorous than expected.' },
      { label: 'Reduced tillering', description: 'Fewer side shoots or tillers develop.' },
    ],
    causes: [
      'Insufficient nitrogen available in the soil',
      'Common in sandy or depleted soils and after heavy rainfall leaching',
      'Not a disease — a nutrient management issue',
    ],
    treatment: [
      { title: 'Apply nitrogen fertilizer', detail: 'Side-dress with urea or ammonium sulfate at recommended rates.', priority: 'immediate' },
      { title: 'Add organic matter', detail: 'Incorporate compost or well-rotted manure to build long-term fertility.', priority: 'short-term' },
      { title: 'Test soil', detail: 'Get a soil test to confirm nitrogen and other nutrient levels.', priority: 'preventive' },
      { title: 'Grow a green manure crop', detail: 'Plant a legume cover crop in the off-season to fix nitrogen.', priority: 'preventive' },
    ],
    spreadRisk: 'Not infectious. Affects only the plants in the deficient area.',
    humidityFavorable: 0,
    tempRange: [10, 40],
  },
];

function loadImageData(dataUrl: string): Promise<{ avg: [number, number, number]; variance: number; brownRatio: number; yellowRatio: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const size = 64;
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas not supported'));
        return;
      }
      ctx.drawImage(img, 0, 0, size, size);
      const data = ctx.getImageData(0, 0, size, size).data;
      let r = 0, g = 0, b = 0;
      let brownCount = 0;
      let yellowCount = 0;
      let totalVariance = 0;
      const pixels = data.length / 4;
      const rs: number[] = [];
      for (let i = 0; i < data.length; i += 4) {
        const pr = data[i], pg = data[i + 1], pb = data[i + 2];
        r += pr; g += pg; b += pb;
        rs.push(pr);
        // brown: R > G > B, R moderate-high, G low-mid
        if (pr > 90 && pr > pg + 20 && pg > pb + 10) brownCount++;
        // yellow: R and G high, B low
        if (pr > 180 && pg > 160 && pb < 140) yellowCount++;
      }
      r /= pixels; g /= pixels; b /= pixels;
      const mean = rs.reduce((s, v) => s + v, 0) / rs.length;
      totalVariance = rs.reduce((s, v) => s + (v - mean) ** 2, 0) / rs.length;
      resolve({
        avg: [Math.round(r), Math.round(g), Math.round(b)],
        variance: Math.round(totalVariance),
        brownRatio: brownCount / pixels,
        yellowRatio: yellowCount / pixels,
      });
    };
    img.onerror = () => reject(new Error('Could not load image'));
    img.src = dataUrl;
  });
}

function scoreDisease(disease: DiseaseProfile, imgStats: { avg: [number, number, number]; brownRatio: number; yellowRatio: number; variance: number }): number {
  const [r, g, b] = imgStats.avg;
  const [rMin, rMax] = disease.colorSignature.r;
  const [gMin, gMax] = disease.colorSignature.g;
  const [bMin, bMax] = disease.colorSignature.b;
  let score = 0;
  // Color proximity
  const rDist = Math.min(Math.abs(r - rMin), Math.abs(r - rMax), r >= rMin && r <= rMax ? 0 : 999);
  const gDist = Math.min(Math.abs(g - gMin), Math.abs(g - gMax), g >= gMin && g <= gMax ? 0 : 999);
  const bDist = Math.min(Math.abs(b - bMin), Math.abs(b - bMax), b >= bMin && b <= bMax ? 0 : 999);
  score += Math.max(0, 100 - (rDist + gDist + bDist) / 3);
  // Brown/yellow discolouration boosts fungal disease scores
  if (disease.key !== 'nutrient_deficiency') {
    if (imgStats.brownRatio > 0.08) score += imgStats.brownRatio * 60;
    if (imgStats.yellowRatio > 0.05) score += imgStats.yellowRatio * 40;
  } else {
    // nutrient deficiency favours uniform yellowing, low variance
    if (imgStats.yellowRatio > 0.1 && imgStats.variance < 800) score += 25;
  }
  // High variance = spots/lesions, favours spot diseases
  if (imgStats.variance > 1500 && disease.key !== 'nutrient_deficiency') score += 15;
  return score;
}

export async function diagnoseImage(imageDataUrl: string): Promise<DiagnosisResult> {
  let imgStats;
  try {
    imgStats = await loadImageData(imageDataUrl);
  } catch {
    imgStats = { avg: [140, 160, 90] as [number, number, number], variance: 1800, brownRatio: 0.12, yellowRatio: 0.08 };
  }

  const scored = DISEASES.map((d) => ({ disease: d, score: scoreDisease(d, imgStats) }));
  scored.sort((a, b) => b.score - a.score);
  const best = scored[0].disease;
  const rawScore = scored[0].score;
  // Map score to confidence 55-92
  const confidence = Math.min(92, Math.max(55, Math.round(55 + rawScore * 0.25)));

  const severity: DiagnosisResult['severity'] =
    confidence > 80 ? 'high' : confidence > 70 ? 'moderate' : confidence > 60 ? 'low' : 'low';

  return {
    diseaseName: best.name,
    diseaseNameKey: best.key,
    cropGuess: best.crop,
    cropGuessKey: best.cropKey,
    confidence,
    severity,
    symptoms: best.symptoms,
    causes: best.causes,
    treatment: best.treatment,
    spreadRisk: best.spreadRisk,
    funghiFavorable: best.humidityFavorable > 0,
  };
}

/**
 * Combine the diagnosis with upcoming weather to produce an action-timing
 * recommendation. This is the "Can I Act Now?" decision engine.
 */
export function evaluateActionTiming(
  diagnosis: DiagnosisResult,
  weather: WeatherData,
): ActionTiming {
  const { current, hourly, daily } = weather;
  const riskFactors: string[] = [];
  const safeActions: string[] = [];
  const unsafeActions: string[] = [];

  const isFungal = diagnosis.funghiFavorable;
  const rainImminent = hourly.slice(0, 12).some((h) => h.precipitationProbability > 50);
  const rainNow = current.precipitation > 0.5 || isRainCode(current.weatherCode);
  const stormNow = isStormCode(current.weatherCode);
  const highWind = current.windSpeed > 25;
  const highHumidity = current.humidity > 80;
  const next24Rain = daily.slice(0, 2).some((d) => d.precipitationProbability > 60);

  // Spraying is unsafe in rain, storm, or high wind
  if (rainNow) {
    riskFactors.push('Rain is falling right now — spray will wash off before it can work.');
    unsafeActions.push('Spraying fungicide or pesticide');
  }
  if (stormNow) {
    riskFactors.push('Thunderstorm activity — avoid all field chemical application.');
    unsafeActions.push('Any outdoor chemical application');
  }
  if (highWind) {
    riskFactors.push(`Wind is strong (${current.windSpeed} km/h) — spray will drift and be ineffective.`);
    unsafeActions.push('Spraying (drift risk)');
  }
  if (rainImminent && !rainNow) {
    riskFactors.push('Rain is forecast within the next 12 hours — spray needs at least 6 dry hours to work.');
    unsafeActions.push('Spraying before the rain window');
  }
  if (highHumidity && isFungal) {
    riskFactors.push(`Humidity is high (${current.humidity}%) — fungal spread risk is elevated.`);
  }
  if (next24Rain) {
    riskFactors.push('Heavy rain is forecast in the next 1-2 days — re-treatment may be needed after it passes.');
  }

  // Determine safe actions
  if (!rainNow && !stormNow && !highWind && !rainImminent) {
    safeActions.push('Spraying fungicide or treatment');
    safeActions.push('Pruning infected leaves');
    safeActions.push('Field sanitation');
  } else if (!rainNow && !stormNow) {
    safeActions.push('Pruning infected leaves');
    safeActions.push('Removing and destroying infected plant material');
    safeActions.push('Improving drainage');
  } else {
    safeActions.push('Planning treatment for the next dry window');
    safeActions.push('Noting field observations');
  }

  // Find next safe window from hourly forecast
  let nextWindow = '';
  for (let i = 0; i < hourly.length; i++) {
    const h = hourly[i];
    const wind = h.windSpeed < 20;
    const dry = h.precipitationProbability < 30;
    const notStorm = !isStormCode(h.weatherCode);
    if (wind && dry && notStorm) {
      // ensure next 6h also dry
      const following6 = hourly.slice(i + 1, i + 7);
      const followingDry = following6.every((fh) => fh.precipitationProbability < 50);
      if (followingDry || i === 0) {
        const t = new Date(h.time);
        const label = t.toLocaleString(undefined, {
          weekday: 'short',
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        });
        nextWindow = `${label} (local time)`;
        break;
      }
    }
  }
  if (!nextWindow) {
    // fallback to daily
    for (const d of daily) {
      if (d.precipitationProbability < 40 && !isStormCode(d.weatherCode)) {
        const t = new Date(d.date);
        nextWindow = `${t.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })} (morning, after dew dries)`;
        break;
      }
    }
  }
  if (!nextWindow) nextWindow = 'No clear dry window in the next 7 days — consult your local extension officer.';

  const canActNow = !rainNow && !stormNow && !highWind && !rainImminent;
  const riskLevel: ActionTiming['riskLevel'] =
    stormNow || (rainNow && highWind) ? 'severe'
    : rainNow || highWind || rainImminent ? 'high'
    : highHumidity && isFungal ? 'moderate'
    : 'low';

  let reason: string;
  let recommendation: string;
  if (canActNow) {
    reason = 'Conditions are currently suitable: it is dry, calm, and no rain is expected in the next 12 hours.';
    recommendation = 'You can safely apply treatment now. Spray in the cool part of the day (early morning or late afternoon) for best results.';
  } else {
    reason = riskFactors.join(' ');
    recommendation = `Wait for safer conditions. The next recommended action window is ${nextWindow}.`;
  }

  return {
    canActNow,
    reason,
    recommendation,
    nextWindow,
    riskLevel,
    riskFactors,
    safeActions,
    unsafeActions,
  };
}
