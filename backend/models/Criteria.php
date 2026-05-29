<?php
// ============================================================
// models/Criteria.php
// ============================================================

require_once __DIR__ . '/../config/db.php';

class Criteria {

    private PDO $db;

    public function __construct() {
        $this->db = getConnection();
    }

    public function getAll(): array {
        $stmt = $this->db->query("SELECT * FROM criteria ORDER BY id ASC");
        return $stmt->fetchAll();
    }

    public function updateWeight(int $id, float $weight): bool {
        $stmt = $this->db->prepare("UPDATE criteria SET weight = ? WHERE id = ?");
        $stmt->execute([$weight, $id]);
        return $stmt->rowCount() > 0;
    }
}
