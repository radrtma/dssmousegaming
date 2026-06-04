// ============================================================
// src/hooks/useTopsis.js — mengambil hasil TOPSIS dari backend
// Mengambil hasil perhitungan dari backend PHP.
// ============================================================

import { useCallback, useEffect, useMemo, useState } from 'react';
import { rankingsApi } from '../services/api';

export function useTopsis(alternatives) {
  const [criteria, setCriteria] = useState([]);
  const [rankings, setRankings] = useState([]);
  const [steps, setSteps] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const alternativeSignature = useMemo(
    () => JSON.stringify((alternatives ?? []).map(a => ({
      id: a.id,
      name: a.name,
      price: a.price,
      dpi_maks: a.dpi_maks,
      sensor: a.sensor,
      button_score: a.button_score,
      ergonomi: a.ergonomi,
      material: a.material,
      weight_g: a.weight_g,
      tampilan: a.tampilan,
    }))),
    [alternatives]
  );

  const loadTopsis = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await rankingsApi.getSteps();
      const payload = res.data?.data ?? {};
      setCriteria(Array.isArray(payload.criteria) ? payload.criteria : []);
      setRankings(Array.isArray(payload.rankings) ? payload.rankings : []);
      setSteps(payload.steps ?? null);
    } catch (err) {
      setCriteria([]);
      setRankings([]);
      setSteps(null);
      setError(err.response?.data?.message || err.message || 'Gagal mengambil hasil TOPSIS dari backend.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTopsis();
  }, [loadTopsis, alternativeSignature]);

  return {
    rankings,
    steps,
    criteria,
    top3: rankings.slice(0, 3),
    loading,
    error,
    reloadTopsis: loadTopsis,
  };
}
