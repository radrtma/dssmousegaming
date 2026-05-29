<?php
// ============================================================
// controllers/AlternativeController.php — Updated for 8 criteria
// ============================================================

require_once __DIR__ . '/../models/Alternative.php';
require_once __DIR__ . '/../utils/Response.php';

class AlternativeController {

    private Alternative $model;

    public function __construct() {
        $this->model = new Alternative();
    }

    public function index(): void {
        $alternatives = $this->model->getAll();
        Response::success($alternatives, 'Alternatives fetched successfully');
    }

    public function show(int $id): void {
        $alternative = $this->model->getById($id);
        if (!$alternative) {
            Response::notFound("Alternative with ID $id not found");
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
        Response::success($created, 'Alternative created successfully', 201);
    }

    public function update(int $id, array $data): void {
        if (!$this->model->getById($id)) {
            Response::notFound("Alternative with ID $id not found");
        }

        $errors = $this->validate($data);
        if (!empty($errors)) {
            Response::error('Validation failed', 422, $errors);
        }

        $this->model->update($id, $data);
        $updated = $this->model->getById($id);
        Response::success($updated, 'Alternative updated successfully');
    }

    public function destroy(int $id): void {
        if (!$this->model->getById($id)) {
            Response::notFound("Alternative with ID $id not found");
        }

        $this->model->delete($id);
        Response::success(null, 'Alternative deleted successfully');
    }

    private function validate(array $data): array {
        $errors = [];

        if (empty($data['name'])) {
            $errors['name'] = 'Name is required';
        }
        if (!isset($data['price']) || !is_numeric($data['price']) || $data['price'] < 0) {
            $errors['price'] = 'Price must be a non-negative number';
        }
        if (!isset($data['weight_g']) || !is_numeric($data['weight_g']) || $data['weight_g'] <= 0) {
            $errors['weight_g'] = 'Weight must be a positive number';
        }

        // Score fields (1–10)
        $scoreFields = ['sensor_score', 'dpi_score', 'button_score', 'ergonomic_score',
                        'material_score', 'appearance_score'];
        foreach ($scoreFields as $field) {
            if (!isset($data[$field]) || !is_numeric($data[$field])
                || $data[$field] < 1 || $data[$field] > 10) {
                $errors[$field] = "$field must be between 1 and 10";
            }
        }

        return $errors;
    }
}
