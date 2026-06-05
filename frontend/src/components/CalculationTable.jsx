// src/components/CalculationTable.jsx
// Generic table for displaying TOPSIS calculation matrices

export default function CalculationTable({ headers, rows, highlightCol = null, compact = false }) {
  const cellPad = compact ? '7px 10px' : '10px 14px';
  const fontSize = compact ? '0.78rem' : '0.82rem';

  return (
    <div style={{ overflowX: 'auto' }}>
      <table className="dss-table" style={{ fontSize }}>
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th key={i} style={{
                background: highlightCol === i
                  ? 'rgba(34,211,238,0.1)'
                  : 'rgba(34,211,238,0.04)',
                color: highlightCol === i ? 'var(--accent-cyan)' : 'var(--text-secondary)',
              }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri}>
              {row.map((cell, ci) => (
                <td key={ci} style={{
                  padding: cellPad,
                  background: highlightCol === ci ? 'rgba(34,211,238,0.04)' : undefined,
                  fontWeight: ci === 0 ? 600 : 400,
                  color: ci === 0 ? 'var(--text-primary)' : 'var(--text-secondary)',
                  fontFamily: ci > 0 ? 'monospace' : 'inherit',
                  fontSize: ci > 0 ? '0.8rem' : fontSize,
                }}>
                  {typeof cell === 'number'
                    ? (cell % 1 === 0 ? cell : cell.toFixed(4))
                    : cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Special 2-row table for ideal solutions
export function IdealSolutionTable({ criteria, idealPositive, idealNegative }) {
  if (!idealPositive || !idealNegative) return null;
  return (
    <div style={{ overflowX: 'auto' }}>
      <table className="dss-table" style={{ fontSize: '0.82rem' }}>
        <thead>
          <tr>
            <th>Solusi</th>
            {criteria.map(c => <th key={c.code}>{c.code} ({c.name})</th>)}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ fontWeight: 700, color: '#22d3ee' }}>A⁺ (Ideal Positif)</td>
            {criteria.map(c => (
              <td key={c.code} style={{ fontFamily: 'monospace', color: '#22d3ee' }}>
                {Number(idealPositive[c.code]).toFixed(4)}
              </td>
            ))}
          </tr>
          <tr>
            <td style={{ fontWeight: 700, color: '#a78bfa' }}>A⁻ (Ideal Negatif)</td>
            {criteria.map(c => (
              <td key={c.code} style={{ fontFamily: 'monospace', color: '#a78bfa' }}>
                {Number(idealNegative[c.code]).toFixed(4)}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
