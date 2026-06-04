<?php
// ============================================================
// models/Alternatif.php — Updated for new db schema (webdss.sql)
// ============================================================

require_once __DIR__ . '/../config/db.php';

class Alternatif {

    private PDO $db;

    public function __construct() {
        $this->db = getConnection();
    }

    public function getAll(): array {
        $stmt = $this->db->query("
            SELECT * FROM alternatif ORDER BY id_alternatif ASC
        ");
        return $stmt->fetchAll();
    }

    public function getById(int $id): ?array {
        $stmt = $this->db->prepare("SELECT * FROM alternatif WHERE id_alternatif = ?");
        $stmt->execute([$id]);
        $result = $stmt->fetch();
        return $result ?: null;
    }

    public function create(array $data): int {
        $stmt = $this->db->prepare("
            INSERT INTO alternatif
                (nama_alternatif, harga_acuan, dpi_maks, sensor, tombol_customization,
                 ergonomi, material, berat, tampilan)
            VALUES
                (:nama_alternatif, :harga_acuan, :dpi_maks, :sensor, :tombol_customization,
                 :ergonomi, :material, :berat, :tampilan)
        ");
        $stmt->execute([
            ':nama_alternatif'      => $data['nama_alternatif'],
            ':harga_acuan'          => $data['harga_acuan'],
            ':dpi_maks'             => $data['dpi_maks'],
            ':sensor'               => $data['sensor'],
            ':tombol_customization' => $data['tombol_customization'],
            ':ergonomi'             => $data['ergonomi'],
            ':material'             => $data['material'],
            ':berat'                => $data['berat'],
            ':tampilan'             => $data['tampilan'],
        ]);
        return (int) $this->db->lastInsertId();
    }

    public function update(int $id, array $data): bool {
        $stmt = $this->db->prepare("
            UPDATE alternatif SET
                nama_alternatif      = :nama_alternatif,
                harga_acuan          = :harga_acuan,
                dpi_maks             = :dpi_maks,
                sensor               = :sensor,
                tombol_customization = :tombol_customization,
                ergonomi             = :ergonomi,
                material             = :material,
                berat                = :berat,
                tampilan             = :tampilan
            WHERE id_alternatif = :id
        ");
        $stmt->execute([
            ':id'                   => $id,
            ':nama_alternatif'      => $data['nama_alternatif'],
            ':harga_acuan'          => $data['harga_acuan'],
            ':dpi_maks'             => $data['dpi_maks'],
            ':sensor'               => $data['sensor'],
            ':tombol_customization' => $data['tombol_customization'],
            ':ergonomi'             => $data['ergonomi'],
            ':material'             => $data['material'],
            ':berat'                => $data['berat'],
            ':tampilan'             => $data['tampilan'],
        ]);
        return $stmt->rowCount() > 0;
    }

    public function delete(int $id): bool {
        $stmt = $this->db->prepare("DELETE FROM alternatif WHERE id_alternatif = ?");
        $stmt->execute([$id]);
        return $stmt->rowCount() > 0;
    }

    public function count(): int {
        return (int) $this->db->query("SELECT COUNT(*) FROM alternatif")->fetchColumn();
    }
}
