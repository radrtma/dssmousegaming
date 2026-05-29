// ============================================================
// src/services/api.js — Axios API Service
// ============================================================

import axios from 'axios';

const BASE_URL = '/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

// ── Alternatives ──────────────────────────────────────────
export const alternativesApi = {
  getAll:  ()           => api.get('/alternatives.php'),
  getById: (id)         => api.get(`/alternatives.php?id=${id}`),
  create:  (data)       => api.post('/alternatives.php', data),
  update:  (id, data)   => api.put(`/alternatives.php?id=${id}`, data),
  delete:  (id)         => api.delete(`/alternatives.php?id=${id}`),
};

// ── Rankings ──────────────────────────────────────────────
export const rankingsApi = {
  getLatest:   ()  => api.get('/rankings.php'),
  calculate:   ()  => api.post('/rankings.php'),
  getSteps:    ()  => api.get('/rankings.php?steps=1'),
};

// ── Criteria ──────────────────────────────────────────────
export const criteriaApi = {
  getAll: () => api.get('/criteria.php'),
};

export default api;
