// ============================================================
// src/utils/topsisEngine.js — TOPSIS Algorithm (JavaScript)
// Mirrors the PHP TopsisCalculator.php for client-side use
// ============================================================

/**
 * Run full TOPSIS calculation and return ranked results + all steps
 * @param {Array} alternatives - array of alternative objects
 * @param {Array} criteria     - array of criteria objects {code, weight, type}
 * @returns {Object} { rankings, steps }
 */
export function calculateTopsis(alternatives, criteria) {
  if (!alternatives || alternatives.length < 2) {
    return { rankings: [], steps: null };
  }

  // ── Step 1: Build Decision Matrix ─────────────────────────
  const decisionMatrix = {};
  for (const alt of alternatives) {
    decisionMatrix[alt.id] = {
      C1: Number(alt.price),
      C2: Number(alt.sensor_score),
      C3: Number(alt.dpi_score),
      C4: Number(alt.button_score),
      C5: Number(alt.ergonomic_score),
      C6: Number(alt.material_score),
      C7: Number(alt.weight_g),
      C8: Number(alt.appearance_score),
    };
  }

  // ── Step 2: Vector Normalization ──────────────────────────
  // r_ij = x_ij / sqrt(sum(x_ij^2))
  const sumOfSquares = {};
  for (const criterion of criteria) {
    const code = criterion.code;
    sumOfSquares[code] = Object.values(decisionMatrix).reduce(
      (sum, row) => sum + Math.pow(row[code], 2), 0
    );
  }

  const normalizedMatrix = {};
  for (const [altId, row] of Object.entries(decisionMatrix)) {
    normalizedMatrix[altId] = {};
    for (const criterion of criteria) {
      const code = criterion.code;
      const sqrt = Math.sqrt(sumOfSquares[code]);
      normalizedMatrix[altId][code] = sqrt > 0 ? row[code] / sqrt : 0;
    }
  }

  // ── Step 3: Weighted Normalization ────────────────────────
  // v_ij = w_j * r_ij
  const weights = {};
  for (const criterion of criteria) {
    weights[criterion.code] = Number(criterion.weight);
  }

  const weightedMatrix = {};
  for (const [altId, row] of Object.entries(normalizedMatrix)) {
    weightedMatrix[altId] = {};
    for (const code of Object.keys(row)) {
      weightedMatrix[altId][code] = weights[code] * row[code];
    }
  }

  // ── Step 4: Ideal Solutions ───────────────────────────────
  const idealPositive = {};
  const idealNegative = {};

  for (const criterion of criteria) {
    const code   = criterion.code;
    const type   = criterion.type;
    const values = Object.values(weightedMatrix).map(row => row[code]);

    if (type === 'benefit') {
      idealPositive[code] = Math.max(...values);
      idealNegative[code] = Math.min(...values);
    } else {
      // cost: smaller value is better → positive ideal = min
      idealPositive[code] = Math.min(...values);
      idealNegative[code] = Math.max(...values);
    }
  }

  // ── Step 5: Separation Measures ──────────────────────────
  // D+_i = sqrt(sum((v_ij - A+_j)^2))
  const separations = {};
  for (const [altId, row] of Object.entries(weightedMatrix)) {
    let dPlus  = 0;
    let dMinus = 0;
    for (const criterion of criteria) {
      const code = criterion.code;
      dPlus  += Math.pow(row[code] - idealPositive[code], 2);
      dMinus += Math.pow(row[code] - idealNegative[code], 2);
    }
    separations[altId] = {
      d_plus:  Math.sqrt(dPlus),
      d_minus: Math.sqrt(dMinus),
    };
  }

  // ── Step 6: Preference Value & Ranking ───────────────────
  // V = D- / (D+ + D-)
  const scores = Object.entries(separations).map(([altId, sep]) => {
    const total = sep.d_plus + sep.d_minus;
    const alt   = alternatives.find(a => String(a.id) === String(altId));
    return {
      alternative_id:   Number(altId),
      alternative_name: alt?.name ?? `Alternative ${altId}`,
      brand:            alt?.brand ?? '',
      d_plus:           sep.d_plus,
      d_minus:          sep.d_minus,
      topsis_score:     total > 0 ? sep.d_minus / total : 0,
      tags:             alt?.tags ?? [],
      // raw data for display
      price:            alt?.price,
      sensor_score:     alt?.sensor_score,
      dpi_score:        alt?.dpi_score,
      button_score:     alt?.button_score,
      ergonomic_score:  alt?.ergonomic_score,
      material_score:   alt?.material_score,
      weight_g:         alt?.weight_g,
      appearance_score: alt?.appearance_score,
    };
  });

  scores.sort((a, b) => b.topsis_score - a.topsis_score);
  scores.forEach((item, idx) => { item.rank_position = idx + 1; });

  return {
    rankings: scores,
    steps: {
      decision_matrix:   decisionMatrix,
      normalized_matrix: normalizedMatrix,
      weighted_matrix:   weightedMatrix,
      ideal_positive:    idealPositive,
      ideal_negative:    idealNegative,
      separations,
      rankings:          scores,
    },
  };
}

/**
 * Format a number as percentage score (0-100)
 */
export function formatScore(score) {
  const n = Number(score);
  return Number.isFinite(n) ? (n * 100).toFixed(2) : '0.00';
}

/**
 * Get score badge color class based on rank
 */
export function getRankColor(rank) {
  if (rank === 1) return 'gold';
  if (rank === 2) return 'silver';
  if (rank === 3) return 'bronze';
  return 'default';
}
