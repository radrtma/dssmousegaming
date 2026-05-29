<?php
// ============================================================
// api/rankings.php — REST Endpoint for Rankings & TOPSIS
// ============================================================

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../controllers/RankingController.php';

$controller = new RankingController();
$method     = $_SERVER['REQUEST_METHOD'];
$action     = $_GET['action'] ?? null;
$steps      = isset($_GET['steps']);

try {
    switch ($method) {
        case 'GET':
            if ($steps) {
                $controller->getSteps();
            } else {
                $controller->index();
            }
            break;

        case 'POST':
            $controller->calculate();
            break;

        default:
            http_response_code(405);
            echo json_encode(['success' => false, 'message' => 'Method not allowed']);
            break;
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Server error: ' . $e->getMessage()]);
}
