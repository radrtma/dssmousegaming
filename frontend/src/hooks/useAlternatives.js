// ============================================================
// src/hooks/useAlternatives.js — CRUD dari backend/database
// Tidak ada fallback ke data lokal.
// ============================================================

import { useState, useCallback } from 'react';
import { alternativesApi } from '../services/api';

export function useAlternatives() {
  const [alternatives, setAlternatives] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadFromBackend = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await alternativesApi.getAll();
      setAlternatives(Array.isArray(res.data?.data) ? res.data.data : []);
    } catch (err) {
      setAlternatives([]);
      setError(err.response?.data?.message || (err.message === 'Network Error' ? 'Network Error: frontend tidak berhasil menghubungi backend. Pastikan Apache XAMPP aktif dan Vite proxy mengarah ke /git/dssmousegaming/backend/api.' : err.message) || 'Gagal mengambil data alternatif dari database.');
    } finally {
      setLoading(false);
    }
  }, []);

  const addAlternative = useCallback(async (data) => {
    setLoading(true);
    setError(null);
    try {
      const res = await alternativesApi.create(data);
      const created = res.data?.data;
      await loadFromBackend();
      return created;
    } catch (err) {
      const message = err.response?.data?.message || (err.message === 'Network Error' ? 'Network Error: endpoint backend tidak bisa diakses. Cek Apache dan path backend.' : err.message) || 'Gagal menambahkan alternatif.';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, [loadFromBackend]);

  const updateAlternative = useCallback(async (id, data) => {
    setLoading(true);
    setError(null);
    try {
      const res = await alternativesApi.update(id, data);
      const updated = res.data?.data;
      await loadFromBackend();
      return updated;
    } catch (err) {
      const message = err.response?.data?.message || (err.message === 'Network Error' ? 'Network Error: endpoint backend tidak bisa diakses. Cek Apache dan path backend.' : err.message) || 'Gagal memperbarui alternatif.';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, [loadFromBackend]);

  const deleteAlternative = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await alternativesApi.delete(id);
      await loadFromBackend();
    } catch (err) {
      const message = err.response?.data?.message || (err.message === 'Network Error' ? 'Network Error: endpoint backend tidak bisa diakses. Cek Apache dan path backend.' : err.message) || 'Gagal menghapus alternatif.';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, [loadFromBackend]);

  return {
    alternatives,
    loading,
    error,
    loadFromBackend,
    addAlternative,
    updateAlternative,
    deleteAlternative,
    setAlternatives,
  };
}
