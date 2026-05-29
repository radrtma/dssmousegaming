<?php
// ============================================================
// models/Alternative.php — Updated for 8 criteria
// ============================================================

require_once __DIR__ . '/../config/db.php';

class Alternative {

    private PDO $db;

    public function __construct() {
        $this->db = getConnection();
    }

    public function getAll(): array {
        $stmt = $this->db->query("
            SELECT * FROM alternatives ORDER BY created_at ASC
        ");
        return $stmt->fetchAll();
    }

    public function getById(int $id): ?array {
        $stmt = $this->db->prepare("SELECT * FROM alternatives WHERE id = ?");
        $stmt->execute([$id]);
        $result = $stmt->fetch();
        return $result ?: null;
    }

    public function create(array $data): int {
        $stmt = $this->db->prepare("
            INSERT INTO alternatives
                (name, brand, price, sensor_score, dpi_score, button_score,
                 ergonomic_score, material_score, weight_g, appearance_score)
            VALUES
                (:name, :brand, :price, :sensor_score, :dpi_score, :button_score,
                 :ergonomic_score, :material_score, :weight_g, :appearance_score)
        ");
        $stmt->execute([
            ':name'             => $data['name'],
            ':brand'            => $data['brand'] ?? null,
            ':price'            => $data['price'],
            ':sensor_score'     => $data['sensor_score'],
            ':dpi_score'        => $data['dpi_score'],
            ':button_score'     => $data['button_score'],
            ':ergonomic_score'  => $data['ergonomic_score'],
            ':material_score'   => $data['material_score'],
            ':weight_g'         => $data['weight_g'],
            ':appearance_score' => $data['appearance_score'],
        ]);
        return (int) $this->db->lastInsertId();
    }

    public function update(int $id, array $data): bool {
        $stmt = $this->db->prepare("
            UPDATE alternatives SET
                name             = :name,
                brand            = :brand,
                price            = :price,
                sensor_score     = :sensor_score,
                dpi_score        = :dpi_score,
                button_score     = :button_score,
                ergonomic_score  = :ergonomic_score,
                material_score   = :material_score,
                weight_g         = :weight_g,
                appearance_score = :appearance_score,
                updated_at       = CURRENT_TIMESTAMP
            WHERE id = :id
        ");
        $stmt->execute([
            ':id'               => $id,
            ':name'             => $data['name'],
            ':brand'            => $data['brand'] ?? null,
            ':price'            => $data['price'],
            ':sensor_score'     => $data['sensor_score'],
            ':dpi_score'        => $data['dpi_score'],
            ':button_score'     => $data['button_score'],
            ':ergonomic_score'  => $data['ergonomic_score'],
            ':material_score'   => $data['material_score'],
            ':weight_g'         => $data['weight_g'],
            ':appearance_score' => $data['appearance_score'],
        ]);
        return $stmt->rowCount() > 0;
    }

    public function delete(int $id): bool {
        $stmt = $this->db->prepare("DELETE FROM alternatives WHERE id = ?");
        $stmt->execute([$id]);
        return $stmt->rowCount() > 0;
    }

    public function count(): int {
        return (int) $this->db->query("SELECT COUNT(*) FROM alternatives")->fetchColumn();
    }
}
