<?php
// ============================================================
// api/rankings.php — Hitung TOPSIS langsung dari database
// ============================================================

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../models/Alternatif.php';
require_once __DIR__ . '/../models/Kriteria.php';
require_once __DIR__ . '/../models/NilaiPreferensi.php';
require_once __DIR__ . '/../utils/TopsisCalculator.php';
require_once __DIR__ . '/../utils/Response.php';

function saveRankingsToDatabase(array $rankings): void {
    $model = new NilaiPreferensi();
    $model->truncate();

    if (empty($rankings)) {
        return;
    }

    $payload = array_map(fn($item) => [
        'id_alternatif' => $item['alternative_id'],
        'nilai_preferensi' => $item['topsis_score'],
        'peringkat' => $item['rank_position'],
    ], $rankings);

    $model->bulkCreate($payload);
}

try {
    $method = $_SERVER['REQUEST_METHOD'];
    if (!in_array($method, ['GET', 'POST'], true)) {
        Response::error('Method not allowed. Use GET or POST.', 405);
    }

    $alternatifModel = new Alternatif();
    $kriteriaModel = new Kriteria();

    $alternatives = $alternatifModel->getAll();
    $criteria = $kriteriaModel->getAll();

    if (count($alternatives) < 2 || count($criteria) === 0) {
        saveRankingsToDatabase([]);
        Response::success([
            'alternatives_count' => count($alternatives),
            'criteria' => $criteria,
            'rankings' => [],
            'steps' => null,
        ], 'Belum cukup data untuk menghitung TOPSIS. Minimal 2 alternatif dan kriteria harus tersedia.');
    }

    $calculator = new TopsisCalculator($alternatives, $criteria);
    $rankings = $calculator->calculate();
    saveRankingsToDatabase($rankings);

    $payload = [
        'alternatives_count' => count($alternatives),
        'criteria' => $calculator->getCriteria(),
        'rankings' => $rankings,
    ];

    if (isset($_GET['steps']) && $_GET['steps'] == '1') {
        $payload['steps'] = $calculator->getSteps();
    }

    Response::success($payload, 'TOPSIS calculated from database successfully');
} catch (Exception $e) {
    Response::error('Server error: ' . $e->getMessage(), 500);
}
