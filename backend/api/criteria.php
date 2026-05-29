<?php
// ============================================================
// api/criteria.php — REST Endpoint for Criteria
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
require_once __DIR__ . '/../models/Criteria.php';
require_once __DIR__ . '/../utils/Response.php';

try {
    $model    = new Criteria();
    $criteria = $model->getAll();
    Response::success($criteria, 'Criteria fetched successfully');
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Server error: ' . $e->getMessage()]);
}
