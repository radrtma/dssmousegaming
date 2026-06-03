<?php
// ============================================================
// models/Kriteria.php
// ============================================================

require_once __DIR__ . '/../config/db.php';

class Kriteria {

    private PDO $db;

    public function __construct() {
        $this->db = getConnection();
    }

    public function getAll(): array {
        $stmt = $this->db->query("SELECT * FROM kriteria ORDER BY id_kriteria ASC");
        return $stmt->fetchAll();
    }

    public function updateWeight(int $id, float $weight): bool {
        $stmt = $this->db->prepare("UPDATE kriteria SET bobot = ? WHERE id_kriteria = ?");
        $stmt->execute([$weight, $id]);
        return $stmt->rowCount() > 0;
    }
}
