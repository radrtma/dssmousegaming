<?php
// ============================================================
// models/Ranking.php
// ============================================================

require_once __DIR__ . '/../config/db.php';

class Ranking {

    private PDO $db;

    public function __construct() {
        $this->db = getConnection();
    }

    public function getLatest(): array {
        $stmt = $this->db->query("
            SELECT
                r.id,
                r.alternative_id,
                r.topsis_score,
                r.rank_position,
                r.d_plus,
                r.d_minus,
                r.calculated_at,
                a.name   AS alternative_name,
                a.brand,
                a.price,
                a.sensor_score,
                a.dpi_score,
                a.button_score,
                a.ergonomic_score,
                a.material_score,
                a.weight_g,
                a.appearance_score
            FROM rankings r
            JOIN alternatives a ON r.alternative_id = a.id
            WHERE r.calculated_at = (SELECT MAX(calculated_at) FROM rankings)
            ORDER BY r.rank_position ASC
        ");
        return $stmt->fetchAll();
    }

    public function saveResults(array $rankings): void {
        // Clear previous rankings
        $this->db->exec("DELETE FROM rankings");

        $stmt = $this->db->prepare("
            INSERT INTO rankings
                (alternative_id, topsis_score, rank_position, d_plus, d_minus)
            VALUES
                (:alternative_id, :topsis_score, :rank_position, :d_plus, :d_minus)
        ");

        foreach ($rankings as $item) {
            $stmt->execute([
                ':alternative_id' => $item['alternative_id'],
                ':topsis_score'   => $item['topsis_score'],
                ':rank_position'  => $item['rank_position'],
                ':d_plus'         => $item['d_plus'],
                ':d_minus'        => $item['d_minus'],
            ]);
        }
    }
}
