<?php
// ============================================================
// utils/TopsisCalculator.php — TOPSIS berbasis data database
// Mendukung schema webdss.sql dan perhitungan dari backend.
// ============================================================

class TopsisCalculator {

    private array $alternatives;
    private array $criteria;

    public array $decisionMatrix   = [];
    public array $normalizedMatrix = [];
    public array $weightedMatrix   = [];
    public array $idealPositive    = [];
    public array $idealNegative    = [];
    public array $separations      = [];
    public array $rankings         = [];

    public function __construct(array $alternatives, array $criteria) {
        $this->alternatives = $alternatives;
        $this->criteria = $this->normalizeCriteria($criteria);
    }

    public function calculate(): array {
        if (count($this->alternatives) < 2 || count($this->criteria) === 0) {
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

    private function normalizeCriteria(array $criteria): array {
        $normalized = [];
        foreach ($criteria as $index => $criterion) {
            $normalized[] = [
                'id' => (int)($criterion['id_kriteria'] ?? $criterion['id'] ?? ($index + 1)),
                'code' => $criterion['code'] ?? ('C' . ($index + 1)),
                'name' => $criterion['nama_kriteria'] ?? $criterion['name'] ?? ('Kriteria ' . ($index + 1)),
                'type' => strtolower((string)($criterion['jenis'] ?? $criterion['type'] ?? 'benefit')) === 'cost' ? 'cost' : 'benefit',
                'weight' => (float)($criterion['bobot'] ?? $criterion['weight'] ?? 0),
            ];
        }
        return $normalized;
    }

    private function buildDecisionMatrix(): void {
        foreach ($this->alternatives as $alt) {
            $altId = (int)($alt['id_alternatif'] ?? $alt['id'] ?? 0);
            if ($altId <= 0) {
                continue;
            }

            $this->decisionMatrix[$altId] = [];
            foreach ($this->criteria as $criterion) {
                $code = $criterion['code'];
                $this->decisionMatrix[$altId][$code] = $this->getCriterionValue($alt, $code);
            }
        }
    }

    private function getCriterionValue(array $alt, string $code): float {
        return match ($code) {
            'C1' => $this->num($alt['harga_acuan'] ?? $alt['price'] ?? 0),
            'C2' => isset($alt['sensor_score']) ? $this->num($alt['sensor_score']) : $this->sensorToScore($alt['sensor'] ?? ''),
            'C3' => $this->num($alt['dpi_maks'] ?? $alt['dpi_score'] ?? 0),
            'C4' => $this->num($alt['tombol_customization'] ?? $alt['button_score'] ?? 0),
            'C5' => isset($alt['ergonomic_score']) ? $this->num($alt['ergonomic_score']) : $this->ergonomicsToScore($alt['ergonomi'] ?? ''),
            'C6' => isset($alt['material_score']) ? $this->num($alt['material_score']) : $this->materialToScore($alt['material'] ?? ''),
            'C7' => $this->num($alt['berat'] ?? $alt['weight_g'] ?? 0),
            'C8' => isset($alt['appearance_score']) ? $this->num($alt['appearance_score']) : $this->appearanceToScore($alt['tampilan'] ?? ''),
            default => 0.0,
        };
    }

    private function normalize(): void {
        $sumOfSquares = [];

        foreach ($this->criteria as $criterion) {
            $code = $criterion['code'];
            $sumOfSquares[$code] = 0;
            foreach ($this->decisionMatrix as $row) {
                $sumOfSquares[$code] += pow((float)($row[$code] ?? 0), 2);
            }
        }

        foreach ($this->decisionMatrix as $altId => $row) {
            foreach ($this->criteria as $criterion) {
                $code = $criterion['code'];
                $sqrt = sqrt($sumOfSquares[$code] ?? 0);
                $this->normalizedMatrix[$altId][$code] = $sqrt > 0 ? ((float)$row[$code] / $sqrt) : 0;
            }
        }
    }

    private function weightedNormalize(): void {
        foreach ($this->normalizedMatrix as $altId => $row) {
            foreach ($this->criteria as $criterion) {
                $code = $criterion['code'];
                $weight = (float)$criterion['weight'];
                $this->weightedMatrix[$altId][$code] = $weight * (float)($row[$code] ?? 0);
            }
        }
    }

    private function findIdealSolutions(): void {
        foreach ($this->criteria as $criterion) {
            $code = $criterion['code'];
            $type = $criterion['type'];
            $values = [];

            foreach ($this->weightedMatrix as $row) {
                $values[] = (float)($row[$code] ?? 0);
            }

            if (empty($values)) {
                $this->idealPositive[$code] = 0;
                $this->idealNegative[$code] = 0;
                continue;
            }

            if ($type === 'benefit') {
                $this->idealPositive[$code] = max($values);
                $this->idealNegative[$code] = min($values);
            } else {
                $this->idealPositive[$code] = min($values);
                $this->idealNegative[$code] = max($values);
            }
        }
    }

    private function calculateSeparations(): void {
        foreach ($this->weightedMatrix as $altId => $row) {
            $dPlus = 0;
            $dMinus = 0;

            foreach ($this->criteria as $criterion) {
                $code = $criterion['code'];
                $dPlus += pow((float)($row[$code] ?? 0) - (float)($this->idealPositive[$code] ?? 0), 2);
                $dMinus += pow((float)($row[$code] ?? 0) - (float)($this->idealNegative[$code] ?? 0), 2);
            }

            $this->separations[$altId] = [
                'd_plus' => sqrt($dPlus),
                'd_minus' => sqrt($dMinus),
            ];
        }
    }

    private function rank(): void {
        $scores = [];

        foreach ($this->separations as $altId => $sep) {
            $dPlus = (float)$sep['d_plus'];
            $dMinus = (float)$sep['d_minus'];
            $total = $dPlus + $dMinus;
            $alternative = $this->findAlternativeById((int)$altId);

            $scores[] = [
                'alternative_id' => (int)$altId,
                'alternative_name' => $alternative['nama_alternatif'] ?? $alternative['name'] ?? ('Alternatif ' . $altId),
                'd_plus' => round($dPlus, 8),
                'd_minus' => round($dMinus, 8),
                'topsis_score' => $total > 0 ? round($dMinus / $total, 6) : 0,
            ];
        }

        usort($scores, fn($a, $b) => $b['topsis_score'] <=> $a['topsis_score']);

        foreach ($scores as $index => &$item) {
            $item['rank_position'] = $index + 1;
        }

        $this->rankings = $scores;
    }

    public function getSteps(): array {
        return [
            'decision_matrix' => $this->decisionMatrix,
            'normalized_matrix' => $this->normalizedMatrix,
            'weighted_matrix' => $this->weightedMatrix,
            'ideal_positive' => $this->idealPositive,
            'ideal_negative' => $this->idealNegative,
            'separations' => $this->separations,
            'rankings' => $this->rankings,
        ];
    }

    public function getCriteria(): array {
        return $this->criteria;
    }

    private function findAlternativeById(int $id): array {
        foreach ($this->alternatives as $alt) {
            $altId = (int)($alt['id_alternatif'] ?? $alt['id'] ?? 0);
            if ($altId === $id) {
                return $alt;
            }
        }
        return [];
    }

    private function num($value): float {
        return is_numeric($value) ? (float)$value : 0.0;
    }

    private function sensorToScore(string $value): float {
        $text = strtolower($value);
        if (str_contains($text, 'focus pro') || str_contains($text, '30k')) return 10.0;
        if (str_contains($text, '26k') || str_contains($text, '25k') || str_contains($text, 'hero')) return 9.5;
        if (str_contains($text, 'bamf') || str_contains($text, 'pmw3392')) return 9.0;
        if (str_contains($text, 'pixart') || str_contains($text, 'truemove') || str_contains($text, 'high-precision')) return 8.5;
        if (str_contains($text, 'gaming')) return 7.5;
        return 7.0;
    }

    private function ergonomicsToScore(string $value): float {
        $text = strtolower($value);
        if (str_contains($text, 'ergonomic') && (str_contains($text, 'palm') || str_contains($text, 'right'))) return 9.0;
        if (str_contains($text, 'battle-tested')) return 8.5;
        if (str_contains($text, 'symmetrical') || str_contains($text, 'simetris')) return 8.0;
        if (str_contains($text, 'compact') || str_contains($text, 'claw') || str_contains($text, 'fingertip')) return 7.5;
        return 7.0;
    }

    private function materialToScore(string $value): float {
        $text = strtolower($value);
        $score = 7.0;
        if (str_contains($text, 'ptfe')) $score += 0.6;
        if (str_contains($text, 'switch') || str_contains($text, 'omron')) $score += 0.6;
        if (str_contains($text, 'paracord') || str_contains($text, 'speedflex') || str_contains($text, 'hyperflex') || str_contains($text, 'ultraweave')) $score += 0.6;
        if (str_contains($text, 'onboard') || str_contains($text, 'adjustable')) $score += 0.4;
        if (str_contains($text, 'entry-level')) $score -= 0.5;
        return max(1.0, min(10.0, round($score, 1)));
    }

    private function appearanceToScore(string $value): float {
        $text = strtolower($value);
        if (str_contains($text, 'tidak ada') || str_contains($text, 'no rgb')) return 6.0;
        if (str_contains($text, '16.8') || str_contains($text, '16.7') || str_contains($text, 'chroma') || str_contains($text, 'gradient')) return 9.5;
        if (str_contains($text, '3-zone') || str_contains($text, 'per-led')) return 9.0;
        if (str_contains($text, '2-zone')) return 8.5;
        if (str_contains($text, 'lightsync')) return 8.5;
        if (str_contains($text, 'rgb')) return 8.0;
        return 7.0;
    }
}
