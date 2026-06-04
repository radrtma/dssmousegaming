<?php
// ============================================================
// models/NilaiPreferensi.php
// ============================================================

require_once __DIR__ . '/../config/db.php';

class NilaiPreferensi {

    private PDO $db;

    public function __construct() {
        $this->db = getConnection();
    }

    public function getAll(): array {
        $stmt = $this->db->query("
            SELECT np.*, a.nama_alternatif, a.harga_acuan, a.dpi_maks,
                   a.tombol_customization, a.material, a.berat
            FROM nilai_preferensi np
            JOIN alternatif a ON np.id_alternatif = a.id_alternatif
            ORDER BY np.peringkat ASC
        ");
        return $stmt->fetchAll();
    }

    public function truncate(): bool {
        $this->db->exec("DELETE FROM nilai_preferensi");
        $this->db->exec("ALTER TABLE nilai_preferensi AUTO_INCREMENT = 1");
        return true;
    }

    public function bulkCreate(array $dataList): bool {
        try {
            $this->db->beginTransaction();

            $stmt = $this->db->prepare("
                INSERT INTO nilai_preferensi (id_alternatif, nilai_preferensi, peringkat)
                VALUES (:id_alternatif, :nilai_preferensi, :peringkat)
            ");

            foreach ($dataList as $data) {
                $stmt->execute([
                    ':id_alternatif'    => $data['id_alternatif'],
                    ':nilai_preferensi' => $data['nilai_preferensi'],
                    ':peringkat'        => $data['peringkat'],
                ]);
            }

            $this->db->commit();
            return true;
        } catch (Exception $e) {
            if ($this->db->inTransaction()) {
                $this->db->rollBack();
            }
            throw $e;
        }
    }
}
