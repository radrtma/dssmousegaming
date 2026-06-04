// ============================================================
// src/utils/topsisEngine.js — TOPSIS Algorithm (JavaScript fallback)
// Sinkron dengan schema database webdss.sql terbaru.
// ============================================================

function materialToScore(textValue = '') {
  const text = String(textValue ?? '').toLowerCase();
  let score = 7;
  if (text.includes('ptfe')) score += 0.6;
  if (text.includes('switch') || text.includes('omron') || text.includes('optical')) score += 0.6;
  if (text.includes('paracord') || text.includes('speedflex') || text.includes('hyperflex') || text.includes('ultraweave') || text.includes('ascended')) score += 0.6;
  if (text.includes('onboard') || text.includes('adjustable')) score += 0.4;
  if (text.includes('entry-level')) score -= 0.5;
  return Math.min(10, Math.max(1, Number(score.toFixed(1))));
}

export function calculateTopsis(alternatives, criteria) {
  if (!alternatives || alternatives.length < 2 || !criteria || criteria.length === 0) {
    return { rankings: [], steps: null };
  }

  const decisionMatrix = {};
  for (const alt of alternatives) {
    decisionMatrix[alt.id] = {};
    for (const criterion of criteria) {
      const code = criterion.code;
      decisionMatrix[alt.id][code] = getCriterionValue(alt, code);
    }
  }

  const sumOfSquares = {};
  for (const criterion of criteria) {
    const code = criterion.code;
    sumOfSquares[code] = Object.values(decisionMatrix).reduce(
      (sum, row) => sum + Math.pow(Number(row[code] ?? 0), 2), 0
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

  const totalRawWeight = criteria.reduce((sum, c) => sum + Number(c.rawWeight ?? c.weight ?? 0), 0) || 1;
  const weightedMatrix = {};
  for (const [altId, row] of Object.entries(normalizedMatrix)) {
    weightedMatrix[altId] = {};
    for (const criterion of criteria) {
      const code = criterion.code;
      const weight = criterion.rawWeight !== undefined ? Number(criterion.rawWeight) / totalRawWeight : Number(criterion.weight ?? 0);
      weightedMatrix[altId][code] = weight * Number(row[code] ?? 0);
    }
  }

  const idealPositive = {};
  const idealNegative = {};

  for (const criterion of criteria) {
    const code = criterion.code;
    const type = criterion.type;
    const values = Object.values(weightedMatrix).map(row => Number(row[code] ?? 0));

    if (type === 'benefit') {
      idealPositive[code] = Math.max(...values);
      idealNegative[code] = Math.min(...values);
    } else {
      idealPositive[code] = Math.min(...values);
      idealNegative[code] = Math.max(...values);
    }
  }

  const separations = {};
  for (const [altId, row] of Object.entries(weightedMatrix)) {
    let dPlus = 0;
    let dMinus = 0;
    for (const criterion of criteria) {
      const code = criterion.code;
      dPlus += Math.pow(Number(row[code] ?? 0) - Number(idealPositive[code] ?? 0), 2);
      dMinus += Math.pow(Number(row[code] ?? 0) - Number(idealNegative[code] ?? 0), 2);
    }
    separations[altId] = {
      d_plus: Math.sqrt(dPlus),
      d_minus: Math.sqrt(dMinus),
    };
  }

  const scores = Object.entries(separations).map(([altId, sep]) => {
    const total = sep.d_plus + sep.d_minus;
    const alt = alternatives.find(a => String(a.id) === String(altId));
    return {
      alternative_id: Number(altId),
      alternative_name: alt?.name ?? `Alternative ${altId}`,
      brand: alt?.brand ?? '',
      d_plus: sep.d_plus,
      d_minus: sep.d_minus,
      topsis_score: total > 0 ? sep.d_minus / total : 0,
      tags: alt?.tags ?? [],
      price: alt?.price,
      dpi_score: alt?.dpi_maks,
      button_score: alt?.button_score,
      material_score: alt?.material_score,
      weight_g: alt?.weight_g,
    };
  });

  scores.sort((a, b) => b.topsis_score - a.topsis_score);
  scores.forEach((item, idx) => { item.rank_position = idx + 1; });

  return {
    rankings: scores,
    steps: {
      decision_matrix: decisionMatrix,
      normalized_matrix: normalizedMatrix,
      weighted_matrix: weightedMatrix,
      ideal_positive: idealPositive,
      ideal_negative: idealNegative,
      separations,
      rankings: scores,
    },
  };
}

function getCriterionValue(alt, code) {
  switch (code) {
    case 'C1': return Number(alt.price ?? alt.harga_acuan ?? 0);
    case 'C2': return Number(alt.dpi_maks ?? alt.dpi_score ?? 0);
    case 'C3': return Number(alt.tombol_customization ?? alt.button_score ?? 0);
    case 'C4': return Number(alt.material_score ?? materialToScore(alt.material ?? ''));
    case 'C5': return Number(alt.weight_g ?? alt.berat ?? 0);
    default: return 0;
  }
}

export function formatScore(score) {
  const n = Number(score);
  return Number.isFinite(n) ? (n * 100).toFixed(2) : '0.00';
}

export function getRankColor(rank) {
  if (rank === 1) return 'gold';
  if (rank === 2) return 'silver';
  if (rank === 3) return 'bronze';
  return 'default';
}
