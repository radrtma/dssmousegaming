<?php
// ============================================================
// controllers/AlternatifController.php — Updated for new db schema (webdss.sql)
// ============================================================

require_once __DIR__ . '/../models/Alternatif.php';
require_once __DIR__ . '/../utils/Response.php';

class AlternatifController {

    private Alternatif $model;

    public function __construct() {
        $this->model = new Alternatif();
    }

    public function index(): void {
        $alternatives = $this->model->getAll();
        Response::success($alternatives, 'Alternatif fetched successfully');
    }

    public function show(int $id): void {
        $alternative = $this->model->getById($id);
        if (!$alternative) {
            Response::notFound("Alternatif with ID $id not found");
        }
        Response::success($alternative);
    }

    public function store(array $data): void {
        $errors = $this->validate($data);
        if (!empty($errors)) {
            Response::error('Validation failed', 422, $errors);
        }

        $id = $this->model->create($data);
        $created = $this->model->getById($id);
        Response::success($created, 'Alternatif created successfully', 201);
    }

    public function update(int $id, array $data): void {
        if (!$this->model->getById($id)) {
            Response::notFound("Alternatif with ID $id not found");
        }

        $errors = $this->validate($data);
        if (!empty($errors)) {
            Response::error('Validation failed', 422, $errors);
        }

        $this->model->update($id, $data);
        $updated = $this->model->getById($id);
        Response::success($updated, 'Alternatif updated successfully');
    }

    public function destroy(int $id): void {
        if (!$this->model->getById($id)) {
            Response::notFound("Alternatif with ID $id not found");
        }

        $this->model->delete($id);
        Response::success(null, 'Alternatif deleted successfully');
    }

    private function validate(array $data): array {
        $errors = [];

        $requiredFields = [
            'nama_alternatif', 'harga_acuan', 'dpi_maks', 'sensor', 
            'tombol_customization', 'ergonomi', 'material', 'berat', 'tampilan'
        ];

        foreach ($requiredFields as $field) {
            if (!isset($data[$field]) || $data[$field] === '') {
                $errors[$field] = "$field is required";
            }
        }

        if (isset($data['harga_acuan']) && (!is_numeric($data['harga_acuan']) || $data['harga_acuan'] < 0)) {
            $errors['harga_acuan'] = 'harga_acuan must be a non-negative number';
        }
        if (isset($data['dpi_maks']) && (!is_numeric($data['dpi_maks']) || $data['dpi_maks'] < 0)) {
            $errors['dpi_maks'] = 'dpi_maks must be a non-negative number';
        }
        if (isset($data['tombol_customization']) && (!is_numeric($data['tombol_customization']) || $data['tombol_customization'] < 0)) {
            $errors['tombol_customization'] = 'tombol_customization must be a non-negative number';
        }
        if (isset($data['berat']) && (!is_numeric($data['berat']) || $data['berat'] <= 0)) {
            $errors['berat'] = 'berat must be a positive number';
        }

        return $errors;
    }
}
