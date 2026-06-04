// ============================================================
// src/services/mappers.js
// Bridge between backend schema (Indonesian DB columns) and
// frontend view model (English UI/calculation fields).
// ============================================================

const SIMPLE_CRITERIA_NAMES = ['Harga', 'Sensor', 'DPI', 'Tombol', 'Ergonomi', 'Material', 'Berat', 'Tampilan'];

const toNumber = (value, fallback = 0) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
};

const clamp = (value, min = 1, max = 10) => Math.min(max, Math.max(min, value));

const isNumericValue = (value) => {
  if (value === null || value === undefined || value === '') return false;
  return Number.isFinite(Number(value));
};

const firstWord = (text = '') => String(text).trim().split(/\s+/)[0] || '';

function scoreDpi(dpi) {
  const value = toNumber(dpi, 0);
  if (value > 0 && value <= 10) return clamp(value);
  if (value >= 30000) return 10;
  if (value >= 26000) return 9.5;
  if (value >= 18000) return 9;
  if (value >= 16000) return 8.5;
  if (value >= 8500) return 8;
  if (value >= 8000) return 7.5;
  if (value >= 4000) return 7;
  return 6.5;
}

function scoreButtons(buttons) {
  const value = toNumber(buttons, 0);
  if (value >= 11) return 10;
  if (value >= 9) return 9;
  if (value >= 7) return 8;
  if (value >= 5) return 7;
  return 6;
}

function scoreSensor(text, dpi) {
  if (isNumericValue(text)) return clamp(toNumber(text));

  const value = String(text || '').toLowerCase();
  if (/focus pro|30k|hero 25k|26k|bamf 2|pmw3392/.test(value)) return 10;
  if (/hero|pixart|truemove|high-precision|optical sensor|razer/.test(value)) return 9;
  if (/gaming-grade|optical/.test(value)) return 8;
  return scoreDpi(dpi) >= 9 ? 8.5 : 7.5;
}

function scoreErgonomy(text) {
  if (isNumericValue(text)) return clamp(toNumber(text));

  const value = String(text || '').toLowerCase();
  if (/right-handed ergonomic|ergonomic palm|palm\/claw|deathadder/.test(value)) return 9.5;
  if (/ergonomic|battle-tested|claw|fingertip/.test(value)) return 8.5;
  if (/symmetrical|symmetric|simetris/.test(value)) return 8;
  return 7.5;
}

function scoreMaterial(text) {
  if (isNumericValue(text)) return clamp(toNumber(text));

  const value = String(text || '').toLowerCase();
  let score = 7;
  if (/100m|80m|70m|60m/.test(value)) score += 1;
  if (/optical mouse switch|switches gen-3|omron/.test(value)) score += 0.8;
  if (/ptfe|g-skates|glide/.test(value)) score += 0.5;
  if (/speedflex|paracord|hyperflex|ultraweave|mesh/.test(value)) score += 0.5;
  if (/adjustable weight|onboard memory/.test(value)) score += 0.4;
  return clamp(Number(score.toFixed(1)));
}

function scoreAppearance(text) {
  if (isNumericValue(text)) return clamp(toNumber(text));

  const value = String(text || '').toLowerCase();
  if (/tidak ada|no rgb|none/.test(value)) return 7;
  if (/chroma|16\.8m|16\.7m|per-led|gradient|3-zone/.test(value)) return 9;
  if (/lightsync|2-zone|rgb/.test(value)) return 8.5;
  if (/1-zone|scroll/.test(value)) return 8;
  return 7.5;
}

function buildTags(row) {
  const tags = [];
  const weight = toNumber(row?.berat ?? row?.weight_g, 0);
  const dpi = toNumber(row?.dpi_maks ?? row?.dpi_score, 0);
  const price = toNumber(row?.harga_acuan ?? row?.price, 0);

  if (price > 0 && price <= 400000) tags.push('Budget');
  if (dpi >= 26000) tags.push('High DPI');
  if (weight > 0 && weight <= 60) tags.push('Lightweight');
  if (scoreAppearance(row?.tampilan ?? row?.appearance_score) >= 8.5) tags.push('RGB');

  return tags;
}

export function normalizeAlternative(row) {
  if (!row) return null;

  // Already normalized frontend object.
  if (row.id !== undefined && row.name !== undefined) {
    return {
      ...row,
      id: toNumber(row.id),
      price: toNumber(row.price),
      weight_g: toNumber(row.weight_g),
      sensor_score: clamp(toNumber(row.sensor_score, 7.5)),
      dpi_score: clamp(toNumber(row.dpi_score, 7.5)),
      button_score: clamp(toNumber(row.button_score, 7)),
      ergonomic_score: clamp(toNumber(row.ergonomic_score, 7.5)),
      material_score: clamp(toNumber(row.material_score, 7)),
      appearance_score: clamp(toNumber(row.appearance_score, 7.5)),
      tags: row.tags ?? buildTags(row),
    };
  }

  const normalized = {
    id: toNumber(row.id_alternatif),
    name: row.nama_alternatif || '',
    brand: row.brand || firstWord(row.nama_alternatif),
    price: toNumber(row.harga_acuan),
    weight_g: toNumber(row.berat),
    sensor_score: scoreSensor(row.sensor, row.dpi_maks),
    dpi_score: scoreDpi(row.dpi_maks),
    button_score: scoreButtons(row.tombol_customization),
    ergonomic_score: scoreErgonomy(row.ergonomi),
    material_score: scoreMaterial(row.material),
    appearance_score: scoreAppearance(row.tampilan),
    tags: buildTags(row),

    // Keep backend fields so edit form can send exact schema back.
    id_alternatif: toNumber(row.id_alternatif),
    nama_alternatif: row.nama_alternatif || '',
    harga_acuan: toNumber(row.harga_acuan),
    dpi_maks: toNumber(row.dpi_maks),
    sensor: row.sensor || '',
    tombol_customization: toNumber(row.tombol_customization),
    ergonomi: row.ergonomi || '',
    material: row.material || '',
    berat: toNumber(row.berat),
    tampilan: row.tampilan || '',
  };

  return normalized;
}

export function normalizeAlternatives(rows = []) {
  return rows.map(normalizeAlternative).filter(Boolean);
}

export function toBackendAlternative(data) {
  const source = data || {};

  if (source.nama_alternatif !== undefined) {
    return {
      nama_alternatif: String(source.nama_alternatif || '').trim(),
      harga_acuan: toNumber(source.harga_acuan),
      dpi_maks: toNumber(source.dpi_maks),
      sensor: String(source.sensor || '').trim(),
      tombol_customization: toNumber(source.tombol_customization),
      ergonomi: String(source.ergonomi || '').trim(),
      material: String(source.material || '').trim(),
      berat: toNumber(source.berat),
      tampilan: String(source.tampilan || '').trim(),
    };
  }

  // Fallback for the older frontend object shape.
  return {
    nama_alternatif: String(source.name || '').trim(),
    harga_acuan: toNumber(source.price),
    dpi_maks: Math.round(toNumber(source.dpi_maks ?? source.dpi_score)),
    sensor: String(source.sensor ?? source.sensor_score ?? '').trim(),
    tombol_customization: Math.round(toNumber(source.tombol_customization ?? source.button_score)),
    ergonomi: String(source.ergonomi ?? source.ergonomic_score ?? '').trim(),
    material: String(source.material ?? source.material_score ?? '').trim(),
    berat: toNumber(source.berat ?? source.weight_g),
    tampilan: String(source.tampilan ?? source.appearance_score ?? '').trim(),
  };
}

export function normalizeCriteriaList(rows = []) {
  if (!Array.isArray(rows) || rows.length === 0) return [];

  const totalWeight = rows.reduce((sum, row) => sum + toNumber(row.bobot ?? row.weight), 0) || 1;

  return rows.map((row, index) => {
    const rawName = row.nama_kriteria || row.name || SIMPLE_CRITERIA_NAMES[index] || `Kriteria ${index + 1}`;
    const simpleName = SIMPLE_CRITERIA_NAMES[index] || rawName;
    const rawType = row.jenis || row.type || 'Benefit';

    return {
      id: toNumber(row.id_kriteria ?? row.id ?? index + 1),
      code: row.code || `C${index + 1}`,
      name: simpleName,
      fullName: rawName,
      type: String(rawType).toLowerCase() === 'cost' ? 'cost' : 'benefit',
      weight: toNumber(row.bobot ?? row.weight) / totalWeight,
      rawWeight: toNumber(row.bobot ?? row.weight),
      description: row.description || `${rawName}. Bobot asli: ${row.bobot ?? row.weight}.`,
    };
  });
}

export function toBackendRankings(rankings = []) {
  return rankings.map(item => ({
    id_alternatif: item.alternative_id,
    nilai_preferensi: Number(item.topsis_score || 0),
    peringkat: Number(item.rank_position || 0),
  }));
}
