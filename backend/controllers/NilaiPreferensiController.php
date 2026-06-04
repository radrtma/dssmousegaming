<?php
// ============================================================
// controllers/NilaiPreferensiController.php
// ============================================================

require_once __DIR__ . '/../models/NilaiPreferensi.php';
require_once __DIR__ . '/../utils/Response.php';

class NilaiPreferensiController {

    private NilaiPreferensi $model;

    public function __construct() {
        $this->model = new NilaiPreferensi();
    }

    public function index(): void {
        $data = $this->model->getAll();
        Response::success($data, 'Nilai Preferensi fetched successfully');
    }

    public function bulkStore(array $dataList): void {
        // 1. Validasi
        if (empty($dataList) || !is_array($dataList)) {
            Response::error('Invalid data format, expected an array of rankings', 422);
            return;
        }

        $errors = [];
        foreach ($dataList as $index => $data) {
            if (!isset($data['id_alternatif']) || !is_numeric($data['id_alternatif']) || $data['id_alternatif'] <= 0) {
                $errors["row_$index"]['id_alternatif'] = 'Valid id_alternatif is required';
            }
            if (!isset($data['nilai_preferensi']) || !is_numeric($data['nilai_preferensi'])) {
                $errors["row_$index"]['nilai_preferensi'] = 'nilai_preferensi must be a number';
            }
            if (!isset($data['peringkat']) || !is_numeric($data['peringkat']) || $data['peringkat'] <= 0) {
                $errors["row_$index"]['peringkat'] = 'Valid peringkat is required';
            }
        }

        if (!empty($errors)) {
            Response::error('Validation failed', 422, $errors);
            return;
        }

        try {
            // 2. Kosongkan tabel lama
            $this->model->truncate();

            // 3. Insert massal
            $this->model->bulkCreate($dataList);

            // 4. Return data terbaru
            $newData = $this->model->getAll();
            Response::success($newData, 'Bulk ranking updated successfully', 201);
        } catch (Exception $e) {
            Response::error('Failed to save rankings: ' . $e->getMessage(), 500);
        }
    }
}
