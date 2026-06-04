// ============================================================
// src/services/api.js — API Service berbasis backend/database
// Semua data diambil dari backend PHP dan database MySQL.
// ============================================================

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

const unwrap = (res) => res?.data?.data ?? res?.data ?? null;
const toNumber = (value, fallback = 0) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
};

const normalizeString = (value) => String(value ?? '').trim();

// Nilai numerik ini dibuat dari isi database yang bertipe teks agar TOPSIS tetap bisa menghitung kriteria kualitatif.
function sensorToScore(sensorText = '') {
  const text = sensorText.toLowerCase();
  if (text.includes('focus pro') || text.includes('30k')) return 10;
  if (text.includes('26k') || text.includes('25k') || text.includes('hero')) return 9.5;
  if (text.includes('bamf') || text.includes('pmw3392')) return 9;
  if (text.includes('pixart') || text.includes('truemove') || text.includes('high-precision')) return 8.5;
  if (text.includes('gaming')) return 7.5;
  return 7;
}

function ergonomicsToScore(textValue = '') {
  const text = textValue.toLowerCase();
  if (text.includes('ergonomic') && (text.includes('palm') || text.includes('right'))) return 9;
  if (text.includes('battle-tested')) return 8.5;
  if (text.includes('symmetrical') || text.includes('simetris')) return 8;
  if (text.includes('compact') || text.includes('claw') || text.includes('fingertip')) return 7.5;
  return 7;
}

function materialToScore(textValue = '') {
  const text = textValue.toLowerCase();
  let score = 7;
  if (text.includes('ptfe')) score += 0.6;
  if (text.includes('switch') || text.includes('omron')) score += 0.6;
  if (text.includes('paracord') || text.includes('speedflex') || text.includes('hyperflex') || text.includes('ultraweave')) score += 0.6;
  if (text.includes('onboard') || text.includes('adjustable')) score += 0.4;
  if (text.includes('entry-level')) score -= 0.5;
  return Math.min(10, Math.max(1, Number(score.toFixed(1))));
}

function appearanceToScore(textValue = '') {
  const text = textValue.toLowerCase();
  if (text.includes('tidak ada') || text.includes('no rgb')) return 6;
  if (text.includes('16.8') || text.includes('16.7') || text.includes('chroma') || text.includes('gradient')) return 9.5;
  if (text.includes('3-zone') || text.includes('per-led')) return 9;
  if (text.includes('2-zone')) return 8.5;
  if (text.includes('lightsync')) return 8.5;
  if (text.includes('rgb')) return 8;
  return 7;
}

export function normalizeAlternative(raw = {}) {
  const id = toNumber(raw.id_alternatif ?? raw.id);
  const name = normalizeString(raw.nama_alternatif ?? raw.name);
  const price = toNumber(raw.harga_acuan ?? raw.price);
  const dpi = toNumber(raw.dpi_maks ?? raw.dpi_score ?? raw.dpi);
  const buttonCount = toNumber(raw.tombol_customization ?? raw.button_score ?? raw.button_count);
  const weight = toNumber(raw.berat ?? raw.weight_g);
  const sensor = normalizeString(raw.sensor);
  const ergonomi = normalizeString(raw.ergonomi ?? raw.ergonomic_text);
  const material = normalizeString(raw.material ?? raw.material_text);
  const tampilan = normalizeString(raw.tampilan ?? raw.appearance_text);

  return {
    ...raw,
    id,
    name,
    brand: normalizeString(raw.brand),
    price,
    harga_acuan: price,
    dpi_maks: dpi,
    dpi_score: dpi,
    sensor,
    sensor_score: toNumber(raw.sensor_score, sensorToScore(sensor)),
    button_score: buttonCount,
    tombol_customization: buttonCount,
    ergonomi,
    ergonomic_score: toNumber(raw.ergonomic_score, ergonomicsToScore(ergonomi)),
    material,
    material_score: toNumber(raw.material_score, materialToScore(material)),
    weight_g: weight,
    berat: weight,
    tampilan,
    appearance_score: toNumber(raw.appearance_score, appearanceToScore(tampilan)),
    tags: Array.isArray(raw.tags) ? raw.tags : [],
  };
}

export function normalizeCriteria(rawList = []) {
  return rawList.map((item, index) => ({
    id: toNumber(item.id_kriteria ?? item.id, index + 1),
    code: item.code ?? `C${index + 1}`,
    name: item.nama_kriteria ?? item.name ?? `Kriteria ${index + 1}`,
    type: String(item.jenis ?? item.type ?? 'Benefit').toLowerCase() === 'cost' ? 'cost' : 'benefit',
    weight: toNumber(item.bobot ?? item.weight, 0),
    rawWeight: toNumber(item.bobot ?? item.weight, 0),
    description: item.description ?? '',
  }));
}

export function normalizeRanking(raw = {}) {
  const alternativeId = toNumber(raw.id_alternatif ?? raw.alternative_id);
  return {
    ...raw,
    alternative_id: alternativeId,
    alternative_name: raw.nama_alternatif ?? raw.alternative_name ?? `Alternatif ${alternativeId}`,
    d_plus: toNumber(raw.d_plus),
    d_minus: toNumber(raw.d_minus),
    topsis_score: toNumber(raw.nilai_preferensi ?? raw.topsis_score),
    rank_position: toNumber(raw.peringkat ?? raw.rank_position),
  };
}

function toBackendAlternative(data = {}) {
  return {
    nama_alternatif: normalizeString(data.name ?? data.nama_alternatif),
    harga_acuan: toNumber(data.price ?? data.harga_acuan),
    dpi_maks: toNumber(data.dpi_maks ?? data.dpi_score),
    sensor: normalizeString(data.sensor),
    tombol_customization: toNumber(data.tombol_customization ?? data.button_score),
    ergonomi: normalizeString(data.ergonomi ?? data.ergonomic_text),
    material: normalizeString(data.material ?? data.material_text),
    berat: toNumber(data.weight_g ?? data.berat),
    tampilan: normalizeString(data.tampilan ?? data.appearance_text),
  };
}

function normalizeAlternativeResponse(res) {
  const payload = unwrap(res);
  const data = Array.isArray(payload)
    ? payload.map(normalizeAlternative)
    : normalizeAlternative(payload);
  return { ...res, data: { ...res.data, data } };
}

export const alternativesApi = {
  getAll: async () => normalizeAlternativeResponse(await api.get('/alternatives.php')),
  getById: async (id) => normalizeAlternativeResponse(await api.get(`/alternatives.php?id=${id}`)),
  create: async (data) => normalizeAlternativeResponse(await api.post('/alternatives.php', toBackendAlternative(data))),
  update: async (id, data) => normalizeAlternativeResponse(await api.put(`/alternatives.php?id=${id}`, toBackendAlternative(data))),
  delete: (id) => api.delete(`/alternatives.php?id=${id}`),
};

export const criteriaApi = {
  getAll: async () => {
    const res = await api.get('/kriteria.php');
    return { ...res, data: { ...res.data, data: normalizeCriteria(unwrap(res) ?? []) } };
  },
};

export const rankingsApi = {
  getLatest: async () => {
    const res = await api.get('/rankings.php');
    const payload = unwrap(res) ?? {};
    return {
      ...res,
      data: {
        ...res.data,
        data: {
          ...payload,
          rankings: (payload.rankings ?? []).map(normalizeRanking),
          criteria: normalizeCriteria(payload.criteria ?? []),
        },
      },
    };
  },
  calculate: async () => {
    const res = await api.post('/rankings.php');
    const payload = unwrap(res) ?? {};
    return {
      ...res,
      data: {
        ...res.data,
        data: {
          ...payload,
          rankings: (payload.rankings ?? []).map(normalizeRanking),
          criteria: normalizeCriteria(payload.criteria ?? []),
        },
      },
    };
  },
  getSteps: async () => {
    const res = await api.get('/rankings.php?steps=1');
    const payload = unwrap(res) ?? {};
    return {
      ...res,
      data: {
        ...res.data,
        data: {
          ...payload,
          rankings: (payload.rankings ?? []).map(normalizeRanking),
          criteria: normalizeCriteria(payload.criteria ?? []),
          steps: payload.steps ?? null,
        },
      },
    };
  },
};

export const nilaiPreferensiApi = {
  getAll: async () => {
    const res = await api.get('/nilai_preferensi.php');
    return { ...res, data: { ...res.data, data: (unwrap(res) ?? []).map(normalizeRanking) } };
  },
};

export default api;
