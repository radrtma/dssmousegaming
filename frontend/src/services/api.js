// ============================================================
// src/services/api.js — API Service database MySQL lewat backend PHP
// ============================================================

import axios from 'axios';
import { getMaterialQualityLabel, getMaterialQualityScore } from '../constants/materialQuality';

// Pakai /api agar request masuk ke Vite proxy, lalu proxy meneruskan ke XAMPP.
// Ini menghindari error CORS dan network error dari request langsung lintas port.
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

function materialToScore(textValue = '') {
  // Sinkron dengan backend TopsisCalculator.php:
  // standar=1, cukup=2, baik=3, sangat_baik=4, premium=5.
  // Fallback 3 mengikuti default backend untuk data lama yang belum memakai combobox.
  return getMaterialQualityScore(String(textValue ?? '').trim(), 3);
}

export function normalizeAlternative(raw = {}) {
  const id = toNumber(raw.id_alternatif ?? raw.id);
  const name = normalizeString(raw.nama_alternatif ?? raw.name);
  const price = toNumber(raw.harga_acuan ?? raw.price);
  const dpi = toNumber(raw.dpi_maks ?? raw.dpi_score ?? raw.dpi);
  const buttonCount = toNumber(raw.tombol_customization ?? raw.button_score ?? raw.button_count);
  const material = normalizeString(raw.material ?? raw.material_text);
  const weight = toNumber(raw.berat ?? raw.weight_g);

  return {
    ...raw,
    id,
    id_alternatif: id,
    name,
    nama_alternatif: name,
    brand: normalizeString(raw.brand) || name.split(' ')[0] || '',
    price,
    harga_acuan: price,
    dpi_maks: dpi,
    dpi_score: dpi,
    button_score: buttonCount,
    tombol_customization: buttonCount,
    material,
    material_label: getMaterialQualityLabel(material),
    material_score: toNumber(raw.material_score, materialToScore(material)),
    weight_g: weight,
    berat: weight,
    tags: Array.isArray(raw.tags) ? raw.tags : [],
  };
}

export function normalizeCriteria(rawList = []) {
  if (!Array.isArray(rawList)) return [];
  const totalWeight = rawList.reduce((sum, item) => sum + toNumber(item.bobot ?? item.rawWeight ?? item.weight), 0) || 1;

  return rawList.map((item, index) => {
    const rawWeight = toNumber(item.bobot ?? item.rawWeight ?? item.weight, 0);
    return {
      id: toNumber(item.id_kriteria ?? item.id, index + 1),
      code: item.code ?? `C${index + 1}`,
      name: item.nama_kriteria ?? item.name ?? `Kriteria ${index + 1}`,
      type: String(item.jenis ?? item.type ?? 'Benefit').toLowerCase() === 'cost' ? 'cost' : 'benefit',
      weight: rawWeight / totalWeight,
      rawWeight,
      description: item.description ?? '',
    };
  });
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
    tombol_customization: toNumber(data.tombol_customization ?? data.button_score),
    material: normalizeString(data.material ?? data.material_text),
    berat: toNumber(data.weight_g ?? data.berat),
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

function normalizeTopsisPayload(res) {
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
}

export const rankingsApi = {
  getLatest: async () => normalizeTopsisPayload(await api.get('/rankings.php')),
  calculate: async () => normalizeTopsisPayload(await api.post('/rankings.php')),
  getSteps: async () => normalizeTopsisPayload(await api.get('/rankings.php?steps=1')),
};

export const nilaiPreferensiApi = {
  getAll: async () => {
    const res = await api.get('/nilai_preferensi.php');
    return { ...res, data: { ...res.data, data: (unwrap(res) ?? []).map(normalizeRanking) } };
  },
};

export default api;
