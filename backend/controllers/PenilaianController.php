<?php
// ============================================================
// controllers/PenilaianController.php
// ============================================================

require_once __DIR__ . '/../models/Penilaian.php';
require_once __DIR__ . '/../utils/Response.php';

class PenilaianController {

    private Penilaian $model;

    public function __construct() {
        $this->model = new Penilaian();
    }

    public function index(): void {
        $id_alternatif = isset($_GET['id_alternatif']) ? (int) $_GET['id_alternatif'] : null;

        if ($id_alternatif) {
            $penilaian = $this->model->getByAlternatifId($id_alternatif);
        } else {
            $penilaian = $this->model->getAll();
        }

        Response::success($penilaian, 'Penilaian fetched successfully');
    }

    public function show(int $id): void {
        $penilaian = $this->model->getById($id);
        if (!$penilaian) {
            Response::notFound("Penilaian with ID $id not found");
        }
        Response::success($penilaian);
    }

    public function store(array $data): void {
        $errors = $this->validate($data);
        if (!empty($errors)) {
            Response::error('Validation failed', 422, $errors);
        }

        $id = $this->model->create($data);
        $created = $this->model->getById($id);
        Response::success($created, 'Penilaian created successfully', 201);
    }

    public function update(int $id, array $data): void {
        if (!$this->model->getById($id)) {
            Response::notFound("Penilaian with ID $id not found");
        }

        $errors = $this->validate($data);
        if (!empty($errors)) {
            Response::error('Validation failed', 422, $errors);
        }

        $this->model->update($id, $data);
        $updated = $this->model->getById($id);
        Response::success($updated, 'Penilaian updated successfully');
    }

    public function destroy(int $id): void {
        if (!$this->model->getById($id)) {
            Response::notFound("Penilaian with ID $id not found");
        }

        $this->model->delete($id);
        Response::success(null, 'Penilaian deleted successfully');
    }

    private function validate(array $data): array {
        $errors = [];

        if (!isset($data['id_alternatif']) || !is_numeric($data['id_alternatif']) || $data['id_alternatif'] <= 0) {
            $errors['id_alternatif'] = 'Valid id_alternatif is required';
        }
        if (!isset($data['id_kriteria']) || !is_numeric($data['id_kriteria']) || $data['id_kriteria'] <= 0) {
            $errors['id_kriteria'] = 'Valid id_kriteria is required';
        }
        if (!isset($data['nilai']) || !is_numeric($data['nilai'])) {
            $errors['nilai'] = 'Nilai must be a number';
        }

        return $errors;
    }
}
