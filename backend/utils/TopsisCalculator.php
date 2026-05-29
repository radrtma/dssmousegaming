<?php
// ============================================================
// utils/TopsisCalculator.php — TOPSIS Algorithm Implementation
// ============================================================

class TopsisCalculator {

    private array $alternatives;
    private array $criteria;

    // Intermediate results (exposed for step-by-step display)
    public array $decisionMatrix     = [];
    public array $normalizedMatrix   = [];
    public array $weightedMatrix     = [];
    public array $idealPositive      = [];
    public array $idealNegative      = [];
    public array $separations        = [];
    public array $rankings           = [];

    public function __construct(array $alternatives, array $criteria) {
        $this->alternatives = $alternatives;
        $this->criteria     = $criteria;
    }

    // --------------------------------------------------------
    // Main entry point
    // --------------------------------------------------------
    public function calculate(): array {
        if (count($this->alternatives) === 0) {
            return [];
        }

        $this->buildDecisionMatrix();
        $this->normalize();
        $this->weightedNormalize();
        $this->findIdealSolutions();
        $this->calculateSeparations();
        $this->rank();

        return $this->rankings;
    }

    // --------------------------------------------------------
    // Step 1 — Build Decision Matrix
    // Matrix: rows = alternatives, cols = criteria
    // --------------------------------------------------------
    private function buildDecisionMatrix(): void {
        foreach ($this->alternatives as $alt) {
            $this->decisionMatrix[$alt['id']] = [
                'C1' => (float) $alt['price'],           // Harga    (cost)
                'C2' => (float) $alt['sensor_score'],    // Sensor   (benefit)
                'C3' => (float) $alt['dpi_score'],       // DPI      (benefit)
                'C4' => (float) $alt['button_score'],    // Tombol   (benefit)
                'C5' => (float) $alt['ergonomic_score'], // Ergonomi (benefit)
                'C6' => (float) $alt['material_score'],  // Material (benefit)
                'C7' => (float) $alt['weight_g'],        // Berat    (benefit — makin berat makin baik)
                'C8' => (float) $alt['appearance_score'],// Tampilan (benefit)
            ];
        }
    }

    // --------------------------------------------------------
    // Step 2 — Normalize using Vector Normalization
    // r_ij = x_ij / sqrt(sum(x_ij^2))
    // --------------------------------------------------------
    private function normalize(): void {
        $sumOfSquares = [];

        // Calculate sum of squares per criterion
        foreach ($this->criteria as $criterion) {
            $code = $criterion['code'];
            $sumOfSquares[$code] = 0;
            foreach ($this->decisionMatrix as $row) {
                $sumOfSquares[$code] += pow($row[$code], 2);
            }
        }

        // Normalize
        foreach ($this->decisionMatrix as $altId => $row) {
            foreach ($this->criteria as $criterion) {
                $code = $criterion['code'];
                $sqrt = sqrt($sumOfSquares[$code]);
                $this->normalizedMatrix[$altId][$code] = $sqrt > 0
                    ? $row[$code] / $sqrt
                    : 0;
            }
        }
    }

    // --------------------------------------------------------
    // Step 3 — Weighted Normalization
    // v_ij = w_j * r_ij
    // --------------------------------------------------------
    private function weightedNormalize(): void {
        $weights = [];
        foreach ($this->criteria as $criterion) {
            $weights[$criterion['code']] = (float) $criterion['weight'];
        }

        foreach ($this->normalizedMatrix as $altId => $row) {
            foreach ($row as $code => $value) {
                $this->weightedMatrix[$altId][$code] = $weights[$code] * $value;
            }
        }
    }

    // --------------------------------------------------------
    // Step 4 — Find Ideal Solutions (A+ and A-)
    // --------------------------------------------------------
    private function findIdealSolutions(): void {
        foreach ($this->criteria as $criterion) {
            $code   = $criterion['code'];
            $type   = $criterion['type'];   // 'benefit' or 'cost'
            $values = array_column($this->weightedMatrix, $code);

            if ($type === 'benefit') {
                $this->idealPositive[$code] = max($values);
                $this->idealNegative[$code] = min($values);
            } else {
                // cost: smaller is better → positive = min
                $this->idealPositive[$code] = min($values);
                $this->idealNegative[$code] = max($values);
            }
        }
    }

    // --------------------------------------------------------
    // Step 5 — Separation Measures (D+ and D-)
    // D+_i = sqrt(sum((v_ij - A+_j)^2))
    // D-_i = sqrt(sum((v_ij - A-_j)^2))
    // --------------------------------------------------------
    private function calculateSeparations(): void {
        foreach ($this->weightedMatrix as $altId => $row) {
            $dPlus  = 0;
            $dMinus = 0;

            foreach ($this->criteria as $criterion) {
                $code = $criterion['code'];
                $dPlus  += pow($row[$code] - $this->idealPositive[$code], 2);
                $dMinus += pow($row[$code] - $this->idealNegative[$code], 2);
            }

            $this->separations[$altId] = [
                'd_plus'  => sqrt($dPlus),
                'd_minus' => sqrt($dMinus),
            ];
        }
    }

    // --------------------------------------------------------
    // Step 6 — Preference Value (Ci) & Ranking
    // Ci = D- / (D+ + D-)
    // --------------------------------------------------------
    private function rank(): void {
        $scores = [];

        foreach ($this->separations as $altId => $sep) {
            $dPlus  = $sep['d_plus'];
            $dMinus = $sep['d_minus'];
            $total  = $dPlus + $dMinus;

            $scores[$altId] = [
                'alternative_id' => $altId,
                'd_plus'         => round($dPlus, 8),
                'd_minus'        => round($dMinus, 8),
                'topsis_score'   => $total > 0 ? round($dMinus / $total, 6) : 0,
            ];
        }

        // Sort by score descending
        usort($scores, fn($a, $b) => $b['topsis_score'] <=> $a['topsis_score']);

        // Assign rank
        foreach ($scores as $index => &$item) {
            $item['rank_position'] = $index + 1;
        }

        $this->rankings = $scores;
    }

    // --------------------------------------------------------
    // Helper — Get all intermediate results for display
    // --------------------------------------------------------
    public function getSteps(): array {
        return [
            'decision_matrix'   => $this->decisionMatrix,
            'normalized_matrix' => $this->normalizedMatrix,
            'weighted_matrix'   => $this->weightedMatrix,
            'ideal_positive'    => $this->idealPositive,
            'ideal_negative'    => $this->idealNegative,
            'separations'       => $this->separations,
            'rankings'          => $this->rankings,
        ];
    }
}
