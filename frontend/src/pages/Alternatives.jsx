// src/pages/Alternatives.jsx
import { useMemo, useState } from 'react';
import { Plus, Pencil, Trash2, Search, MousePointer2, X } from 'lucide-react';
import Modal from '../components/Modal';
import AlternativeForm from '../components/AlternativeForm';
import { SmallMouseIcon } from '../components/MouseIcon';

const SORT_OPTIONS = [
  { value: 'none', label: 'Default' },
  { value: 'name', label: 'Nama Mouse' },
  { value: 'price', label: 'Harga Acuan' },
  { value: 'dpi_maks', label: 'DPI Maks' },
  { value: 'button_score', label: 'Skor Tombol' },
  { value: 'material', label: 'Material' },
  { value: 'material_score', label: 'Skor Material' },
  { value: 'weight_g', label: 'Berat' },
  { value: 'rank_position', label: 'Ranking' },
  { value: 'topsis_score', label: 'Nilai TOPSIS' },
];

export default function Alternatives({ alternatives, rankings, apiError, onAdd, onUpdate, onDelete }) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState('none');
  const [sortDirection, setSortDirection] = useState('asc');
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState(null);

  const rankMap = useMemo(() => {
    const map = new Map();
    rankings.forEach(rank => {
      map.set(String(rank.alternative_id), rank);
    });
    return map;
  }, [rankings]);

  const getRank = (id) => rankMap.get(String(id));

  const filtered = useMemo(() => {
    const keyword = search.toLowerCase();

    return alternatives.filter(a =>
      (a.name || '').toLowerCase().includes(keyword) ||
      (a.material || '').toLowerCase().includes(keyword) ||
      (a.material_label || '').toLowerCase().includes(keyword)
    );
  }, [alternatives, search]);

  const sortedFiltered = useMemo(() => {
    if (sortField === 'none') return filtered;

    const getSortValue = (alt) => {
      const rank = rankMap.get(String(alt.id));

      switch (sortField) {
        case 'name':
          return (alt.name || '').toLowerCase();
        case 'price':
          return Number(alt.price);
        case 'dpi_maks':
          return Number(alt.dpi_maks);
        case 'button_score':
          return Number(alt.button_score);
        case 'material':
          return (alt.material || '').toLowerCase();
        case 'material_score':
          return Number(alt.material_score);
        case 'weight_g':
          return Number(alt.weight_g);
        case 'rank_position':
          return rank ? Number(rank.rank_position) : null;
        case 'topsis_score':
          return rank ? Number(rank.topsis_score) : null;
        default:
          return null;
      }
    };

    const isMissing = (value) => (
      value === null ||
      value === undefined ||
      value === '' ||
      (typeof value === 'number' && !Number.isFinite(value))
    );

    return [...filtered].sort((a, b) => {
      const valueA = getSortValue(a);
      const valueB = getSortValue(b);

      const missingA = isMissing(valueA);
      const missingB = isMissing(valueB);

      if (missingA && missingB) return 0;
      if (missingA) return 1;
      if (missingB) return -1;

      let result;

      if (typeof valueA === 'string' || typeof valueB === 'string') {
        result = String(valueA).localeCompare(String(valueB), 'id', {
          numeric: true,
          sensitivity: 'base',
        });
      } else {
        result = valueA - valueB;
      }

      return sortDirection === 'asc' ? result : -result;
    });
  }, [filtered, rankMap, sortField, sortDirection]);

  const resetFilter = () => {
    setSortField('none');
    setSortDirection('asc');
  };

  const handleAdd = async (data) => {
    setLoading(true);
    setFormError(null);
    try {
      await onAdd(data);
      setIsAddOpen(false);
    } catch (err) {
      setFormError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (data) => {
    setLoading(true);
    setFormError(null);
    try {
      await onUpdate(editItem.id, data);
      setEditItem(null);
    } catch (err) {
      setFormError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    setFormError(null);
    try {
      await onDelete(deleteItem.id);
      setDeleteItem(null);
    } catch (err) {
      setFormError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' }}>
            Alternatif Mouse Gaming
          </h1>
          <p style={{ fontSize: '0.83rem', color: 'var(--text-muted)' }}>
            Data pada halaman ini diambil langsung dari tabel alternatif di database.
          </p>
        </div>
        <button className="btn-primary" onClick={() => { setFormError(null); setIsAddOpen(true); }}>
          <Plus size={15} /> Tambah Alternatif
        </button>
      </div>

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        {[
          { label: 'Total Alternatif', value: alternatives.length, color: '#22d3ee' },
          { label: 'Sudah Diranking', value: rankings.length, color: '#a78bfa' },
          { label: 'Hasil Pencarian', value: sortedFiltered.length, color: '#34d399' },
        ].map((s, i) => (
          <div key={i} className="glass" style={{
            borderRadius: '10px', padding: '10px 18px',
            border: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', gap: '10px',
          }}>
            <span style={{ fontSize: '1.3rem', fontWeight: 800, color: s.color }}>{s.value}</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>{s.label}</span>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', width: '100%', maxWidth: '420px' }}>
          <Search size={15} color="var(--text-muted)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
          <input
            className="dss-input"
            placeholder="Cari nama atau material..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ paddingLeft: '36px', paddingRight: search ? '36px' : '13px' }}
          />
          {search && (
            <button onClick={() => setSearch('')} style={{
              position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
              background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)',
              display: 'flex', alignItems: 'center',
            }}>
              <X size={14} />
            </button>
          )}
        </div>

        <select
          className="dss-input"
          value={sortField}
          onChange={e => setSortField(e.target.value)}
          style={{ width: '180px', cursor: 'pointer' }}
          aria-label="Pilih kriteria pengurutan"
        >
          {SORT_OPTIONS.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <select
          className="dss-input"
          value={sortDirection}
          onChange={e => setSortDirection(e.target.value)}
          disabled={sortField === 'none'}
          style={{
            width: '150px',
            cursor: sortField === 'none' ? 'not-allowed' : 'pointer',
            opacity: sortField === 'none' ? 0.65 : 1,
          }}
          aria-label="Pilih arah pengurutan"
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>

        {sortField !== 'none' && (
          <button className="btn-secondary" onClick={resetFilter} style={{ padding: '9px 14px', fontSize: '0.82rem' }}>
            Reset Filter
          </button>
        )}
      </div>

      {(formError || apiError) && (
        <div className="glass" style={{ borderRadius: 10, padding: '12px 14px', color: '#fca5a5', border: '1px solid rgba(239,68,68,0.35)' }}>
          {formError || apiError}
        </div>
      )}

      <div className="glass" style={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border)' }}>
        {sortedFiltered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>
            <MousePointer2 size={36} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
            <p style={{ fontSize: '0.9rem' }}>
              {search ? 'Tidak ada hasil pencarian.' : 'Database alternatif masih kosong.'}
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="dss-table">
              <thead>
                <tr>
                  <th style={{ width: 42, textAlign: 'center' }}>#</th>
                  <th>Nama Mouse</th>
                  <th>Harga Acuan</th>
                  <th>DPI Maks</th>
                  <th>Tombol</th>
                  <th>Material</th>
                  <th>Berat</th>
                  <th>Rank / V</th>
                  <th style={{ textAlign: 'center' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {sortedFiltered.map((alt, i) => {
                  const rank = getRank(alt.id);
                  return (
                    <tr key={alt.id} className={rank?.rank_position <= 3 ? `rank-${rank.rank_position}` : ''}>
                      <td style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.78rem' }}>{i + 1}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                          <SmallMouseIcon color="#22d3ee" size={20} />
                          <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{alt.name}</span>
                        </div>
                      </td>
                      <td style={{ fontWeight: 600, fontSize: '0.83rem' }}>Rp {Number(alt.price).toLocaleString('id-ID')}</td>
                      <td style={{ color: 'var(--text-secondary)', fontSize: '0.83rem' }}>{Number(alt.dpi_maks).toLocaleString('id-ID')}</td>
                      <td><ScoreBadge value={alt.button_score} /></td>
                      <td><TextWithScore text={alt.material_label || alt.material} score={alt.material_score} /></td>
                      <td style={{ color: 'var(--text-secondary)', fontSize: '0.83rem' }}>{alt.weight_g}g</td>
                      <td>
                        {rank ? (
                          <div>
                            <span style={{ fontWeight: 700, color: rank.rank_position <= 3 ? 'var(--accent-cyan)' : 'var(--text-primary)', fontSize: '0.83rem' }}>
                              #{rank.rank_position}
                            </span>
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginLeft: 5 }}>
                              V={Number(rank.topsis_score).toFixed(4)}
                            </span>
                          </div>
                        ) : <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>—</span>}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                          <button className="btn-edit" onClick={() => { setFormError(null); setEditItem(alt); }}>
                            <Pencil size={12} />
                          </button>
                          <button className="btn-danger" onClick={() => { setFormError(null); setDeleteItem(alt); }}>
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Tambah Alternatif Mouse">
        <AlternativeForm onSubmit={handleAdd} onCancel={() => setIsAddOpen(false)} loading={loading} />
      </Modal>

      <Modal isOpen={!!editItem} onClose={() => setEditItem(null)} title="Edit Alternatif">
        <AlternativeForm initial={editItem} onSubmit={handleUpdate} onCancel={() => setEditItem(null)} loading={loading} />
      </Modal>

      <Modal isOpen={!!deleteItem} onClose={() => setDeleteItem(null)} title="Hapus Alternatif" width="400px">
        <div style={{ textAlign: 'center', padding: '8px 0' }}>
          <div style={{
            width: 52, height: 52, borderRadius: '50%',
            background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
          }}>
            <Trash2 size={22} color="#ef4444" />
          </div>
          <p style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
            Hapus "{deleteItem?.name}"?
          </p>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '24px' }}>
            Data ini akan dihapus dari database dan ranking akan dihitung ulang.
          </p>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <button className="btn-secondary" onClick={() => setDeleteItem(null)}>Batal</button>
            <button className="btn-danger" onClick={handleDelete} disabled={loading} style={{ padding: '9px 18px', fontSize: '0.85rem' }}>
              {loading ? 'Menghapus...' : 'Ya, Hapus'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function ScoreBadge({ value }) {
  const v = Number(value);
  const color = v >= 9 ? '#22d3ee' : v >= 5 ? '#a78bfa' : '#64748b';
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      minWidth: '32px', padding: '2px 8px', borderRadius: '6px',
      fontSize: '0.78rem', fontWeight: 700,
      background: `${color}18`, color, border: `1px solid ${color}30`,
    }}>
      {Number.isFinite(v) ? v : '—'}
    </span>
  );
}

function TextWithScore({ text, score }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 170 }}>
      <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', maxWidth: 210, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={text}>
        {text || '—'}
      </span>
      <ScoreBadge value={score} />
    </div>
  );
}
