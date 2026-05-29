<?php
// ============================================================
// controllers/RankingController.php
// ============================================================

require_once __DIR__ . '/../models/Alternative.php';
require_once __DIR__ . '/../models/Ranking.php';
require_once __DIR__ . '/../models/Criteria.php';
require_once __DIR__ . '/../utils/TopsisCalculator.php';
require_once __DIR__ . '/../utils/Response.php';

class RankingController {

    private Alternative $altModel;
    private Ranking     $rankModel;
    private Criteria    $criteriaModel;

    public function __construct() {
        $this->altModel      = new Alternative();
        $this->rankModel     = new Ranking();
        $this->criteriaModel = new Criteria();
    }

    // GET /api/rankings.php — fetch latest rankings
    public function index(): void {
        // Auto-calculate on every fetch to ensure rankings are always up-to-date with alternatives
        $this->runCalculation(false);
        $rankings = $this->rankModel->getLatest();
        Response::success($rankings, 'Rankings fetched successfully');
    }

    // POST /api/rankings.php — trigger calculation
    public function calculate(): void {
        $this->runCalculation(true);
    }

    // GET /api/rankings.php?steps=1 — fetch all TOPSIS steps
    public function getSteps(): void {
        $alternatives = $this->altModel->getAll();
        $criteria     = $this->criteriaModel->getAll();

        if (count($alternatives) < 2) {
            Response::error('Need at least 2 alternatives to calculate', 422);
        }

        $calculator = new TopsisCalculator($alternatives, $criteria);
        $calculator->calculate();

        $steps = $calculator->getSteps();

        // Attach alternative names for readability
        $altNames = [];
        foreach ($alternatives as $alt) {
            $altNames[$alt['id']] = $alt['name'];
        }

        Response::success([
            'alternatives' => $alternatives,
            'criteria'     => $criteria,
            'steps'        => $steps,
            'alt_names'    => $altNames,
        ], 'TOPSIS steps calculated');
    }

    private function runCalculation(bool $respond = true): void {
        $alternatives = $this->altModel->getAll();
        $criteria     = $this->criteriaModel->getAll();

        if (count($alternatives) < 2) {
            if ($respond) Response::error('Need at least 2 alternatives to calculate', 422);
            return;
        }

        $calculator = new TopsisCalculator($alternatives, $criteria);
        $rankings   = $calculator->calculate();

        $this->rankModel->saveResults($rankings);

        if ($respond) {
            Response::success([
                'rankings' => $rankings,
                'count'    => count($rankings),
            ], 'TOPSIS calculation completed');
        }
    }
}
