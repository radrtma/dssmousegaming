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
        // Gabung dengan tabel alternatif agar frontend mendapatkan nama_alternatif dsb
        $stmt = $this->db->query("
            SELECT np.*, a.nama_alternatif, a.tampilan
            FROM nilai_preferensi np
            JOIN alternatif a ON np.id_alternatif = a.id_alternatif
            ORDER BY np.peringkat ASC
        ");
        return $stmt->fetchAll();
    }

    public function truncate(): bool {
        // Mengosongkan isi tabel
        $stmt = $this->db->prepare("TRUNCATE TABLE nilai_preferensi");
        return $stmt->execute();
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
            $this->db->rollBack();
            throw $e;
        }
    }
}
