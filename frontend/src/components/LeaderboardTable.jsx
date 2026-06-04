// src/components/LeaderboardTable.jsx
import { SmallMouseIcon } from './MouseIcon';
import { formatScore } from '../utils/topsisEngine';
import { TrendingUp } from 'lucide-react';

const RANK_BADGE = {
  1: { bg: 'linear-gradient(135deg,#f59e0b,#d97706)', color: '#0a0c14' },
  2: { bg: 'linear-gradient(135deg,#94a3b8,#64748b)', color: '#fff' },
  3: { bg: 'linear-gradient(135deg,#cd7c2f,#a16207)', color: '#fff' },
};

export default function LeaderboardTable({ rankings, alternatives }) {
  if (!rankings || rankings.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
        Belum ada data ranking. Tambahkan minimal 2 alternatif.
      </div>
    );
  }

  // Enrich rankings with full alternative data
  const enriched = rankings.map(r => {
    const alt = alternatives?.find(a => String(a.id) === String(r.alternative_id)) || {};
    return { ...r, ...alt };
  });

  return (
    <div style={{ overflowX: 'auto' }}>
      <table className="dss-table">
        <thead>
          <tr>
            <th style={{ width: 52, textAlign: 'center' }}>Rank</th>
            <th>Nama Mouse</th>
            <th>Harga Acuan</th>
            <th>DPI</th>
            <th>Tombol</th>
            <th>Material</th>
            <th>Berat</th>
            <th>Nilai V</th>
          </tr>
        </thead>
        <tbody>
          {enriched.map((item) => {
            const rank = item.rank_position;
            const badge = RANK_BADGE[rank];
            const rowClass = rank <= 3 ? `rank-${rank}` : '';

            return (
              <tr key={item.alternative_id} className={rowClass}>
                {/* Rank */}
                <td style={{ textAlign: 'center' }}>
                  {badge ? (
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      width: 26, height: 26, borderRadius: '50%',
                      background: badge.bg, color: badge.color,
                      fontSize: '0.72rem', fontWeight: 800,
                    }}>
                      {rank}
                    </span>
                  ) : (
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                      {rank}
                    </span>
                  )}
                </td>

                {/* Name */}
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <SmallMouseIcon
                      color={rank === 1 ? '#f59e0b' : rank === 2 ? '#94a3b8' : rank === 3 ? '#cd7c2f' : '#475569'}
                      size={22}
                    />
                    <span style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                      {item.alternative_name}
                    </span>
                  </div>
                </td>

                {/* Price */}
                <td style={{ fontWeight: 600, fontSize: '0.83rem', color: 'var(--text-primary)' }}>
                  {item.price ? `Rp ${Number(item.price).toLocaleString('id-ID')}` : '—'}
                </td>

                {/* DPI */}
                <td style={{ color: 'var(--text-secondary)', fontSize: '0.83rem' }}>
                  {item.dpi_maks ? Number(item.dpi_maks).toLocaleString('id-ID') : '—'}
                </td>

                {/* Button count */}
                <td style={{ color: 'var(--text-secondary)', fontSize: '0.83rem' }}>
                  {item.button_score ?? item.tombol_customization ?? '—'}
                </td>

                {/* Material */}
                <td style={{ color: 'var(--text-secondary)', fontSize: '0.83rem', maxWidth: 240 }}>
                  <span title={item.material} style={{ display: 'inline-block', maxWidth: 240, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {item.material || '—'}
                  </span>
                </td>

                {/* Weight */}
                <td style={{ color: 'var(--text-secondary)', fontSize: '0.83rem' }}>
                  {item.weight_g ? `${item.weight_g}g` : '—'}
                </td>

                {/* Score */}
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{
                      fontWeight: 700, fontSize: '0.88rem',
                      color: rank === 1 ? '#f59e0b' : rank <= 3 ? 'var(--accent-cyan)' : 'var(--text-primary)',
                    }}>
                      {formatScore(item.topsis_score)}
                    </span>
                    {rank <= 3 && (
                      <TrendingUp size={13} color={rank === 1 ? '#f59e0b' : 'var(--accent-cyan)'} />
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
