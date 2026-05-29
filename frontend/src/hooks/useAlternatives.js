// ============================================================
// src/hooks/useAlternatives.js — CRUD State Management
// Falls back to mock data when backend is unavailable
// ============================================================

import { useState, useCallback } from 'react';
import { INITIAL_ALTERNATIVES } from '../data/mockData';
import { alternativesApi, rankingsApi } from '../services/api';

let nextId = INITIAL_ALTERNATIVES.length + 1;

export function useAlternatives() {
  const [alternatives, setAlternatives] = useState(INITIAL_ALTERNATIVES);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState(null);

  // ── Load from backend (optional) ───────────────────────
  const loadFromBackend = useCallback(async () => {
    setLoading(true);
    try {
      const res = await alternativesApi.getAll();
      if (res.data?.data?.length > 0) {
        setAlternatives(res.data.data);
      }
    } catch {
      // Silently fall back to mock data
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Add ────────────────────────────────────────────────
  const addAlternative = useCallback(async (data) => {
    try {
      const res = await alternativesApi.create(data);
      const created = res.data?.data;
      if (created) {
        setAlternatives(prev => [...prev, created]);
        return created;
      }
    } catch {
      // Offline mode — use local state
      const newItem = { ...data, id: nextId++, tags: [] };
      setAlternatives(prev => [...prev, newItem]);
      return newItem;
    }
  }, []);

  // ── Update ─────────────────────────────────────────────
  const updateAlternative = useCallback(async (id, data) => {
    try {
      const res = await alternativesApi.update(id, data);
      const updated = res.data?.data;
      if (updated) {
        setAlternatives(prev => prev.map(a => a.id === id ? updated : a));
        return updated;
      }
    } catch {
      setAlternatives(prev => prev.map(a => a.id === id ? { ...a, ...data } : a));
    }
  }, []);

  // ── Delete ─────────────────────────────────────────────
  const deleteAlternative = useCallback(async (id) => {
    try {
      await alternativesApi.delete(id);
    } catch {
      // Offline — still remove from local state
    }
    setAlternatives(prev => prev.filter(a => a.id !== id));
  }, []);

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
