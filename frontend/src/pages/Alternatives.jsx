// src/pages/Alternatives.jsx
import { useState } from 'react';
import { Plus, Pencil, Trash2, Search, MousePointer2, X } from 'lucide-react';
import Modal from '../components/Modal';
import AlternativeForm from '../components/AlternativeForm';
import { SmallMouseIcon } from '../components/MouseIcon';
import { formatScore } from '../utils/topsisEngine';

export default function Alternatives({ alternatives, rankings, apiError, onAdd, onUpdate, onDelete }) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState(null);

  const filtered = alternatives.filter(a =>
    (a.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (a.material || '').toLowerCase().includes(search.toLowerCase())
  );

  const getRank = (id) => rankings.find(r => String(r.alternative_id) === String(id));

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
          { label: 'Hasil Pencarian', value: filtered.length, color: '#34d399' },
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

      <div style={{ position: 'relative', maxWidth: '420px' }}>
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

      {(formError || apiError) && (
        <div className="glass" style={{ borderRadius: 10, padding: '12px 14px', color: '#fca5a5', border: '1px solid rgba(239,68,68,0.35)' }}>
          {formError || apiError}
        </div>
      )}

      <div className="glass" style={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border)' }}>
        {filtered.length === 0 ? (
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
                {filtered.map((alt, i) => {
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
                      <td><TextWithScore text={alt.material} score={alt.material_score} /></td>
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
  const color = v >= 9 ? '#22d3ee' : v >= 7 ? '#a78bfa' : '#64748b';
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
