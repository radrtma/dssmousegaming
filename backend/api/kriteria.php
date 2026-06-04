<?php
// ============================================================
// api/kriteria.php — REST Endpoint for Kriteria
// ============================================================

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../models/Kriteria.php';
require_once __DIR__ . '/../utils/Response.php';

try {
    $model    = new Kriteria();
    $kriteria = $model->getAll();
    Response::success($kriteria, 'Kriteria fetched successfully');
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Server error: ' . $e->getMessage()]);
}
