// ============================================================
// src/hooks/useTopsis.js — TOPSIS Calculation Hook
// ============================================================

import { useState, useMemo } from 'react';
import { calculateTopsis } from '../utils/topsisEngine';
import { CRITERIA } from '../data/mockData';

export function useTopsis(alternatives) {
  const [criteria]  = useState(CRITERIA);

  const result = useMemo(() => {
    if (!alternatives || alternatives.length < 2) {
      return { rankings: [], steps: null };
    }
    return calculateTopsis(alternatives, criteria);
  }, [alternatives, criteria]);

  return {
    rankings:  result.rankings,
    steps:     result.steps,
    criteria,
    top3:      result.rankings.slice(0, 3),
  };
}
