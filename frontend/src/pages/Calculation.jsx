// src/pages/Calculation.jsx
import { useParams, useNavigate } from 'react-router-dom';
import { Info, ChevronRight } from 'lucide-react';
import CalculationTable, { IdealSolutionTable } from '../components/CalculationTable';
import { formatScore } from '../utils/topsisEngine';

const TABS = [
  { id: 'matrix',      path: '/calculation/matrix',      label: '1. Matriks Keputusan'   },
  { id: 'normalized',  path: '/calculation/normalized',  label: '2. Normalisasi'           },
  { id: 'weighted',    path: '/calculation/weighted',    label: '3. Terbobot'              },
  { id: 'ideal',       path: '/calculation/ideal',       label: '4. Solusi Ideal'             },
  { id: 'distance',    path: '/calculation/distance',    label: '5. Jarak Antar Alternatif' },
  { id: 'preference',  path: '/calculation/preference',  label: '6. Nilai Preferensi'         },
  { id: 'ranking',     path: '/calculation/ranking',     label: '7. Ranking Akhir'            },
];

export default function Calculation({ steps, alternatives, criteria, rankings }) {
  const { tab = 'matrix' } = useParams();
  const navigate = useNavigate();
  const activeTab = tab === 'matriks' ? 'matrix' : tab;

  if (!steps) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
        <Info size={40} style={{ margin: '0 auto 14px' }} />
        <p>Tambahkan minimal 2 alternatif untuk melihat perhitungan TOPSIS.</p>
      </div>
    );
  }

  const { decision_matrix, normalized_matrix, weighted_matrix, ideal_positive, ideal_negative, separations } = steps;
  const altIds = Object.keys(decision_matrix);
  const altName = (id) => alternatives.find(a => String(a.id) === String(id))?.name ?? `Alt-${id}`;

  // Build matrix rows helper
  const buildRows = (matrix) =>
    altIds.map(id => [
      altName(id),
      ...criteria.map(c => Number(matrix[id]?.[c.code] ?? 0)),
    ]);

  const criteriaHeaders = ['Alternatif', ...criteria.map(c => `${c.code} (${c.name})`)];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Page header */}
      <div>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' }}>
          Perhitungan TOPSIS
        </h1>
        <p style={{ fontSize: '0.83rem', color: 'var(--text-muted)' }}>
          Detail langkah-langkah perhitungan metode TOPSIS secara lengkap
        </p>
      </div>

      {/* Tab navigation */}
      <div style={{
        display: 'flex', gap: '4px', padding: '4px',
        background: 'var(--bg-surface)', borderRadius: '12px',
        border: '1px solid var(--border)', overflowX: 'auto',
        flexWrap: 'wrap',
      }}>
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => navigate(t.path)}
            style={{
              padding: '8px 14px', borderRadius: '8px',
              border: 'none', cursor: 'pointer',
              fontSize: '0.78rem', fontWeight: 600,
              fontFamily: 'inherit', whiteSpace: 'nowrap',
              transition: 'all 0.2s',
              background: activeTab === t.id
                ? 'linear-gradient(135deg, var(--accent-cyan), var(--accent-cyan-2))'
                : 'transparent',
              color: activeTab === t.id ? '#0a0c14' : 'var(--text-secondary)',
              boxShadow: activeTab === t.id ? '0 2px 12px rgba(34,211,238,0.25)' : 'none',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="animate-fade-in-up" key={activeTab}>
        {activeTab === 'matrix'     && <MatrixTab      rows={buildRows(decision_matrix)} headers={criteriaHeaders} criteria={criteria} />}
        {activeTab === 'normalized' && <NormalizedTab  rows={buildRows(normalized_matrix)} headers={criteriaHeaders} criteria={criteria} />}
        {activeTab === 'weighted'   && <WeightedTab    rows={buildRows(weighted_matrix)}   headers={criteriaHeaders} criteria={criteria} />}
        {activeTab === 'ideal'      && <IdealTab       criteria={criteria} ip={ideal_positive} in_={ideal_negative} />}
        {activeTab === 'distance'   && <DistanceTab    altIds={altIds} altName={altName} separations={separations} />}
        {activeTab === 'preference' && <PreferenceTab  altIds={altIds} altName={altName} separations={separations} rankings={rankings} />}
        {activeTab === 'ranking'    && <RankingTab     rankings={rankings} alternatives={alternatives} />}
      </div>
    </div>
  );
}

// ── Sub-tab components ──────────────────────────────────────

function TabCard({ title, formula, description, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Info card */}
      <div className="glass" style={{
        borderRadius: '14px', padding: '18px 22px',
        border: '1px solid rgba(34,211,238,0.2)',
        background: 'rgba(34,211,238,0.04)',
      }}>
        <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--accent-cyan)', marginBottom: '6px' }}>
          {title}
        </div>
        {formula && (
          <div style={{
            fontFamily: 'monospace', fontSize: '0.9rem', color: 'var(--text-primary)',
            background: 'var(--bg-base)', padding: '8px 14px', borderRadius: '8px',
            border: '1px solid var(--border)', marginBottom: '8px', display: 'inline-block',
          }}>
            {formula}
          </div>
        )}
        {description && (
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
            {description}
          </p>
        )}
      </div>

      {/* Table */}
      <div className="glass" style={{ borderRadius: '14px', overflow: 'hidden', border: '1px solid var(--border)' }}>
        {children}
      </div>
    </div>
  );
}

function MatrixTab({ rows, headers, criteria }) {
  return (
    <TabCard
      title="Matriks Keputusan (X)"
      formula="X = [ x_ij ] dimana i = alternatif, j = kriteria"
      description="Matriks keputusan menampilkan skor hasil konversi dari backend, bukan data mentah dari tabel alternatif. Backend mengubah harga, DPI, jumlah tombol, material, dan berat ke nilai skala TOPSIS sebelum dinormalisasi."
    >
      <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {criteria.map(c => (
          <span key={c.code} style={{
            padding: '3px 10px', borderRadius: '999px', fontSize: '0.72rem', fontWeight: 600,
            background: c.type === 'benefit' ? 'rgba(34,211,238,0.12)' : 'rgba(239,68,68,0.1)',
            color: c.type === 'benefit' ? 'var(--accent-cyan)' : '#f87171',
            border: `1px solid ${c.type === 'benefit' ? 'rgba(34,211,238,0.25)' : 'rgba(239,68,68,0.25)'}`,
          }}>
            {c.code}: {c.name} ({c.type}) · w={Number(c.weight).toFixed(4)}
          </span>
        ))}
      </div>
      <CalculationTable headers={headers} rows={rows} />
    </TabCard>
  );
}

function NormalizedTab({ rows, headers, criteria }) {
  return (
    <TabCard
      title="Matriks Normalisasi (R)"
      formula="r_ij = x_ij / √(Σ x_ij²)"
      description="Normalisasi dilakukan menggunakan metode vector normalization untuk mengubah nilai ke skala yang sebanding (0–1) antar kriteria yang berbeda satuan."
    >
      <CalculationTable headers={headers} rows={rows} />
    </TabCard>
  );
}

function WeightedTab({ rows, headers, criteria }) {
  return (
    <TabCard
      title="Matriks Normalisasi Terbobot (V)"
      formula="v_ij = w_j × r_ij"
      description="Setiap nilai normalisasi dikalikan dengan bobot kriteria yang telah ditentukan. Bobot w_j di bawah ini adalah bobot ternormalisasi yang benar-benar dipakai dalam perhitungan matriks V."
    >
      <WeightSummary criteria={criteria} />
      <CalculationTable headers={headers} rows={rows} />
    </TabCard>
  );
}

function WeightSummary({ criteria }) {
  const totalRawWeight = criteria.reduce((sum, c) => sum + Number(c.rawWeight ?? 0), 0);
  const rows = criteria.map(c => [
    c.code,
    c.name,
    c.type,
    Number(c.rawWeight ?? 0),
    Number(c.weight ?? 0),
  ]);

  return (
    <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '12px' }}>
        <div>
          <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 3 }}>
            Bobot yang digunakan dalam V
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            w_j = bobot awal / total bobot. Total bobot awal = {totalRawWeight}.
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {criteria.map(c => (
            <span key={c.code} style={{
              padding: '3px 10px', borderRadius: '999px', fontSize: '0.72rem', fontWeight: 700,
              background: 'rgba(34,211,238,0.12)', color: 'var(--accent-cyan)',
              border: '1px solid rgba(34,211,238,0.25)',
            }}>
              {c.code}: w_j={Number(c.weight ?? 0).toFixed(4)}
            </span>
          ))}
        </div>
      </div>
      <CalculationTable
        headers={['Kode', 'Kriteria', 'Jenis', 'Bobot Awal', 'w_j']}
        rows={rows}
        compact
        highlightCol={4}
      />
    </div>
  );
}

function IdealTab({ criteria, ip, in_ }) {
  return (
    <TabCard
      title="Solusi Ideal Positif (A⁺) dan Negatif (A⁻)"
      formula="A⁺ = {max v_ij | benefit, min v_ij | cost} · A⁻ = {min v_ij | benefit, max v_ij | cost}"
      description="Solusi ideal positif adalah alternatif terbaik hipotetis (nilai benefit maksimum, cost minimum). Solusi ideal negatif adalah alternatif terburuk hipotetis."
    >
      <IdealSolutionTable criteria={criteria} idealPositive={ip} idealNegative={in_} />
    </TabCard>
  );
}

function DistanceTab({ altIds, altName, separations }) {
  const rows = altIds.map(id => {
    const sep = separations[id] || {};
    return [
      altName(id),
      sep.d_plus ?? 0,
      sep.d_minus ?? 0,
    ];
  });

  return (
    <TabCard
      title="Jarak Antar Alternatif"
      formula="D⁺ᵢ = √Σ(vᵢⱼ − A⁺ⱼ)²   ·   D⁻ᵢ = √Σ(vᵢⱼ − A⁻ⱼ)²"
      description="Bagian ini menghitung jarak setiap alternatif terhadap solusi ideal positif dan solusi ideal negatif. D⁺ menunjukkan jarak ke kondisi terbaik. D⁻ menunjukkan jarak ke kondisi terburuk."
    >
      <CalculationTable
        headers={['Alternatif', 'D⁺ (Jarak ke A⁺)', 'D⁻ (Jarak ke A⁻)']}
        rows={rows}
      />
    </TabCard>
  );
}

function PreferenceFormulaCard() {
  return (
    <div style={{
      padding: '18px 18px 20px',
      borderBottom: '1px solid var(--border)',
      background: 'rgba(34,211,238,0.03)'
    }}>
      <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '12px', lineHeight: 1.6 }}>
        Nilai preferensi untuk setiap alternatif dihitung menggunakan rumus berikut.
      </p>
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '12px',
        padding: '14px 22px',
        borderRadius: '10px',
        background: 'rgba(34,211,238,0.18)',
        border: '1px solid rgba(34,211,238,0.3)',
        color: 'var(--text-primary)',
        fontFamily: 'Georgia, serif',
        fontSize: '1.5rem',
      }}>
        <span>Vᵢ =</span>
        <span style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', lineHeight: 1.1 }}>
          <span>D⁻ᵢ</span>
          <span style={{ height: 1, width: '100%', background: 'currentColor', margin: '5px 0' }} />
          <span>D⁻ᵢ + D⁺ᵢ</span>
        </span>
      </div>
      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '12px', lineHeight: 1.65 }}>
        Nilai V yang lebih besar menunjukkan alternatif lebih dipilih karena lebih dekat ke solusi ideal positif dan lebih jauh dari solusi ideal negatif.
      </p>
    </div>
  );
}

function PreferenceTab({ altIds, altName, separations, rankings }) {
  const rankMap = {};
  rankings.forEach(r => { rankMap[r.alternative_id] = r; });

  const rows = altIds.map(id => {
    const sep = separations[id] || {};
    const dPlus = Number(sep.d_plus ?? 0);
    const dMinus = Number(sep.d_minus ?? 0);
    const total = dPlus + dMinus;
    const calculatedV = total > 0 ? dMinus / total : 0;
    const rank = rankMap[id];

    return [
      altName(id),
      dMinus,
      dPlus,
      `${dMinus.toFixed(4)} / (${dMinus.toFixed(4)} + ${dPlus.toFixed(4)})`,
      rank?.topsis_score ?? calculatedV,
    ];
  });

  return (
    <TabCard
      title="Nilai Preferensi (V)"
      formula="Vᵢ = D⁻ᵢ / (D⁻ᵢ + D⁺ᵢ)"
      description="Bagian ini menghitung nilai preferensi V untuk setiap alternatif. Nilai V digunakan sebagai dasar penentuan ranking akhir."
    >
      <PreferenceFormulaCard />
      <CalculationTable
        headers={['Alternatif', 'D⁻ᵢ', 'D⁺ᵢ', 'Perhitungan Vᵢ', 'Vᵢ (Nilai Preferensi)']}
        rows={rows}
        highlightCol={4}
      />
    </TabCard>
  );
}

function RankingTab({ rankings, alternatives }) {
  const RANK_COLOR = { 1: '#f59e0b', 2: '#94a3b8', 3: '#cd7c2f' };

  return (
    <TabCard
      title="Ranking Akhir"
      formula="Ranking berdasarkan nilai V dari terbesar ke terkecil"
      description="Alternatif dengan nilai V tertinggi merupakan alternatif terbaik karena paling dekat dengan solusi ideal positif dan paling jauh dari solusi ideal negatif."
    >
      <table className="dss-table">
        <thead>
          <tr>
            <th style={{ width: 60, textAlign: 'center' }}>Rank</th>
            <th>Nama Mouse</th>
            <th>Nilai V</th>
            <th style={{ width: 200 }}>Score Bar</th>
          </tr>
        </thead>
        <tbody>
          {rankings.map(item => {
            const alt   = alternatives.find(a => String(a.id) === String(item.alternative_id));
            const name  = alt?.name ?? item.alternative_name ?? `Alt-${item.alternative_id}`;
            const rank  = item.rank_position;
            const color = RANK_COLOR[rank] || '#22d3ee';
            const pct   = formatScore(item.topsis_score);

            return (
              <tr key={item.alternative_id} className={rank <= 3 ? `rank-${rank}` : ''}>
                <td style={{ textAlign: 'center' }}>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    width: 28, height: 28, borderRadius: '50%',
                    fontWeight: 800, fontSize: '0.78rem',
                    background: rank <= 3
                      ? (rank === 1 ? 'linear-gradient(135deg,#f59e0b,#d97706)'
                        : rank === 2 ? 'linear-gradient(135deg,#94a3b8,#64748b)'
                          : 'linear-gradient(135deg,#cd7c2f,#a16207)')
                      : 'var(--bg-hover)',
                    color: rank === 1 ? '#0a0c14' : '#fff',
                  }}>
                    {rank}
                  </span>
                </td>
                <td style={{ fontWeight: 600 }}>{name}</td>
                <td style={{ fontWeight: 700, color, fontFamily: 'monospace' }}>
                  {Number(item.topsis_score).toFixed(4)}
                  <span style={{ fontFamily: 'inherit', fontWeight: 500, color: 'var(--text-muted)', fontSize: '0.75rem', marginLeft: 4 }}>
                    ({pct}%)
                  </span>
                </td>
                <td>
                  <div className="score-bar-track">
                    <div className="score-bar-fill" style={{
                      width: `${pct}%`,
                      background: rank === 1
                        ? 'linear-gradient(90deg,#f59e0b,#d97706)'
                        : rank === 2
                          ? 'linear-gradient(90deg,#94a3b8,#64748b)'
                          : 'linear-gradient(90deg,var(--accent-cyan),var(--accent-purple))',
                    }} />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </TabCard>
  );
}
