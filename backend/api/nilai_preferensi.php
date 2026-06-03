<?php
// ============================================================
// api/nilai_preferensi.php — REST Endpoint for Nilai Preferensi
// ============================================================

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../controllers/NilaiPreferensiController.php';

$controller = new NilaiPreferensiController();
$method     = $_SERVER['REQUEST_METHOD'];

try {
    switch ($method) {
        case 'GET':
            $controller->index();
            break;

        case 'POST':
            // Endpoint POST ini digunakan sebagai BULK UPDATE
            $data = json_decode(file_get_contents('php://input'), true);
            if (!is_array($data)) {
                $data = []; // default ke empty array jika null/salah format
            }
            $controller->bulkStore($data);
            break;

        default:
            http_response_code(405);
            echo json_encode(['success' => false, 'message' => 'Method not allowed. Use GET or POST (for bulk update).']);
            break;
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Server error: ' . $e->getMessage()]);
}
