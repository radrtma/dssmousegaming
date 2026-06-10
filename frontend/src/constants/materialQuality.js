// Pilihan Material & Build Quality harus sinkron dengan backend TopsisCalculator.php.
// Backend mengonversi value berikut menjadi skor 1–5.

export const MATERIAL_QUALITY_OPTIONS = [
  { value: 'standar', label: 'Standar', score: 1, description: 'Build quality dasar / standar' },
  { value: 'cukup', label: 'Cukup', score: 2, description: 'Build quality cukup baik' },
  { value: 'baik', label: 'Baik', score: 3, description: 'Build quality baik' },
  { value: 'sangat_baik', label: 'Sangat Baik', score: 4, description: 'Build quality sangat baik' },
  { value: 'premium', label: 'Premium', score: 5, description: 'Build quality premium' },
];

export const MATERIAL_QUALITY_SCORE_MAP = MATERIAL_QUALITY_OPTIONS.reduce((map, item) => {
  map[item.value] = item.score;
  return map;
}, {});

export const MATERIAL_QUALITY_LABEL_MAP = MATERIAL_QUALITY_OPTIONS.reduce((map, item) => {
  map[item.value] = item.label;
  return map;
}, {});

export function normalizeMaterialQualityValue(value) {
  const raw = String(value ?? '').trim();
  const lower = raw.toLowerCase();

  if (MATERIAL_QUALITY_SCORE_MAP[lower]) return lower;

  // Membantu form edit tetap bisa membuka data lama yang masih berupa teks bebas.
  if (/entry-level|basic|standar/.test(lower)) return 'standar';
  if (/cukup/.test(lower)) return 'cukup';
  if (/quickstrike|omron/.test(lower)) return 'baik';
  if (/60m|50m|paracord|mesh|onboard|adjustable|glide/.test(lower)) return 'sangat_baik';
  if (/100m|80m|70m|optical mouse switch|switches gen-3|speedflex|hyperflex|ultraweave|g-skates|ascended/.test(lower)) return 'premium';

  return raw;
}

export function getMaterialQualityLabel(value) {
  const normalized = normalizeMaterialQualityValue(value);
  return MATERIAL_QUALITY_LABEL_MAP[normalized] ?? value ?? '';
}

export function getMaterialQualityScore(value, fallback = 3) {
  const normalized = normalizeMaterialQualityValue(value);
  const score = MATERIAL_QUALITY_SCORE_MAP[normalized];
  return Number.isFinite(score) ? score : fallback;
}
