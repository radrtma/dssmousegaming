<?php
// ============================================================
// controllers/AlternatifController.php — CRUD alternatif
// ============================================================

require_once __DIR__ . '/../models/Alternatif.php';
require_once __DIR__ . '/../utils/Response.php';

class AlternatifController {

    private Alternatif $model;

    public function __construct() {
        $this->model = new Alternatif();
    }

    public function index(): void {
        Response::success($this->model->getAll(), 'Alternatif fetched successfully');
    }

    public function show(int $id): void {
        $alternative = $this->model->getById($id);
        if (!$alternative) {
            Response::notFound("Alternatif with ID $id not found");
        }
        Response::success($alternative);
    }

    public function store(array $data): void {
        $data = $this->sanitize($data);
        $errors = $this->validate($data);
        if (!empty($errors)) {
            Response::error('Validation failed', 422, $errors);
        }

        $id = $this->model->create($data);
        Response::success($this->model->getById($id), 'Alternatif created successfully', 201);
    }

    public function update(int $id, array $data): void {
        if (!$this->model->getById($id)) {
            Response::notFound("Alternatif with ID $id not found");
        }

        $data = $this->sanitize($data);
        $errors = $this->validate($data);
        if (!empty($errors)) {
            Response::error('Validation failed', 422, $errors);
        }

        $this->model->update($id, $data);
        Response::success($this->model->getById($id), 'Alternatif updated successfully');
    }

    public function destroy(int $id): void {
        if (!$this->model->getById($id)) {
            Response::notFound("Alternatif with ID $id not found");
        }

        $this->model->delete($id);
        Response::success(null, 'Alternatif deleted successfully');
    }

    private function sanitize(array $data): array {
        return [
            'nama_alternatif'      => trim((string)($data['nama_alternatif'] ?? '')),
            'harga_acuan'          => $data['harga_acuan'] ?? null,
            'dpi_maks'             => $data['dpi_maks'] ?? null,
            'tombol_customization' => $data['tombol_customization'] ?? null,
            'material'             => trim((string)($data['material'] ?? '')),
            'berat'                => $data['berat'] ?? null,
        ];
    }

    private function validate(array $data): array {
        $errors = [];

        if ($data['nama_alternatif'] === '') {
            $errors['nama_alternatif'] = 'nama_alternatif is required';
        }
        if ($data['material'] === '') {
            $errors['material'] = 'material is required';
        }
        if (!is_numeric($data['harga_acuan']) || (float)$data['harga_acuan'] < 0) {
            $errors['harga_acuan'] = 'harga_acuan must be a non-negative number';
        }
        if (!is_numeric($data['dpi_maks']) || (int)$data['dpi_maks'] < 0) {
            $errors['dpi_maks'] = 'dpi_maks must be a non-negative number';
        }
        if (!is_numeric($data['tombol_customization']) || (int)$data['tombol_customization'] < 0) {
            $errors['tombol_customization'] = 'tombol_customization must be a non-negative number';
        }
        if (!is_numeric($data['berat']) || (float)$data['berat'] <= 0) {
            $errors['berat'] = 'berat must be a positive number';
        }

        return $errors;
    }
}
