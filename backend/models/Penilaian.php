<?php
// ============================================================
// models/Penilaian.php
// ============================================================

require_once __DIR__ . '/../config/db.php';

class Penilaian {

    private PDO $db;

    public function __construct() {
        $this->db = getConnection();
    }

    public function getAll(): array {
        $stmt = $this->db->query("
            SELECT * FROM penilaian ORDER BY id_penilaian ASC
        ");
        return $stmt->fetchAll();
    }

    public function getById(int $id): ?array {
        $stmt = $this->db->prepare("SELECT * FROM penilaian WHERE id_penilaian = ?");
        $stmt->execute([$id]);
        $result = $stmt->fetch();
        return $result ?: null;
    }

    public function getByAlternatifId(int $id_alternatif): array {
        $stmt = $this->db->prepare("SELECT * FROM penilaian WHERE id_alternatif = ? ORDER BY id_kriteria ASC");
        $stmt->execute([$id_alternatif]);
        return $stmt->fetchAll();
    }

    public function create(array $data): int {
        $stmt = $this->db->prepare("
            INSERT INTO penilaian (id_alternatif, id_kriteria, nilai)
            VALUES (:id_alternatif, :id_kriteria, :nilai)
        ");
        $stmt->execute([
            ':id_alternatif' => $data['id_alternatif'],
            ':id_kriteria'   => $data['id_kriteria'],
            ':nilai'         => $data['nilai'],
        ]);
        return (int) $this->db->lastInsertId();
    }

    public function update(int $id, array $data): bool {
        $stmt = $this->db->prepare("
            UPDATE penilaian 
            SET id_alternatif = :id_alternatif, 
                id_kriteria   = :id_kriteria, 
                nilai         = :nilai
            WHERE id_penilaian = :id
        ");
        $stmt->execute([
            ':id'            => $id,
            ':id_alternatif' => $data['id_alternatif'],
            ':id_kriteria'   => $data['id_kriteria'],
            ':nilai'         => $data['nilai'],
        ]);
        return $stmt->rowCount() > 0;
    }

    public function delete(int $id): bool {
        $stmt = $this->db->prepare("DELETE FROM penilaian WHERE id_penilaian = ?");
        $stmt->execute([$id]);
        return $stmt->rowCount() > 0;
    }
}
