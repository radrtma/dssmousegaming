<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

try {
    require_once __DIR__ . '/../config/db.php';
    $pdo = getConnection();
    $dbOk = (bool) $pdo->query('SELECT 1')->fetchColumn();
    $tables = [];
    foreach (['alternatif', 'kriteria', 'nilai_preferensi', 'penilaian'] as $table) {
        try {
            $stmt = $pdo->query("SELECT COUNT(*) AS total FROM `$table`");
            $tables[$table] = (int) $stmt->fetchColumn();
        } catch (Throwable $e) {
            $tables[$table] = 'not_found';
        }
    }

    echo json_encode([
        'success' => true,
        'message' => 'Backend API reachable and database connection OK',
        'data' => [
            'database' => $dbOk ? 'connected' : 'not_connected',
            'db_name' => DB_NAME,
            'api_path' => __DIR__,
            'tables' => $tables,
        ],
    ], JSON_PRETTY_PRINT);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Backend reached, but database check failed: ' . $e->getMessage(),
    ], JSON_PRETTY_PRINT);
}
