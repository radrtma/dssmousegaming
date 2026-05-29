// src/components/AlternativeForm.jsx
import { useState, useEffect } from 'react';

const EMPTY_FORM = {
  name: '', brand: '', price: '', weight_g: '',
  sensor_score: '', dpi_score: '', button_score: '',
  ergonomic_score: '', material_score: '', appearance_score: '',
};

export default function AlternativeForm({ initial = null, onSubmit, onCancel, loading = false }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initial) {
      setForm({
        name:               initial.name               || '',
        brand:              initial.brand              || '',
        price:              initial.price              || '',
        weight_g:           initial.weight_g           || '',
        sensor_score:       initial.sensor_score       || '',
        dpi_score:          initial.dpi_score          || '',
        button_score:       initial.button_score       || '',
        ergonomic_score:    initial.ergonomic_score    || '',
        material_score:     initial.material_score     || '',
        appearance_score:   initial.appearance_score   || '',
      });
    } else {
      setForm(EMPTY_FORM);
    }
    setErrors({});
  }, [initial]);

  const set = (key, val) => {
    setForm(prev => ({ ...prev, [key]: val }));
    setErrors(prev => ({ ...prev, [key]: undefined }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim())                          e.name             = 'Nama wajib diisi';
    if (!form.price || isNaN(form.price))           e.price            = 'Harga harus berupa angka';
    if (!form.weight_g || isNaN(form.weight_g))     e.weight_g         = 'Berat harus berupa angka';
    const scores = ['sensor_score','dpi_score','button_score','ergonomic_score','material_score','appearance_score'];
    scores.forEach(k => {
      const v = Number(form[k]);
      if (!form[k] || isNaN(v) || v < 1 || v > 10)
        e[k] = 'Harus angka 1–10';
    });
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    onSubmit({
      name:               form.name.trim(),
      brand:              form.brand.trim(),
      price:              Number(form.price),
      weight_g:           Number(form.weight_g),
      sensor_score:       Number(form.sensor_score),
      dpi_score:          Number(form.dpi_score),
      button_score:       Number(form.button_score),
      ergonomic_score:    Number(form.ergonomic_score),
      material_score:     Number(form.material_score),
      appearance_score:   Number(form.appearance_score),
    });
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Row 1 — Name + Brand */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <Field label="Nama Mouse *" error={errors.name}>
          <input className="dss-input" placeholder="cth. Logitech G Pro X"
            value={form.name} onChange={e => set('name', e.target.value)} />
        </Field>
        <Field label="Brand">
          <input className="dss-input" placeholder="cth. Logitech"
            value={form.brand} onChange={e => set('brand', e.target.value)} />
        </Field>
      </div>

      {/* Row 2 — Price + Weight */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <Field label="Harga (Rp ribuan) *" error={errors.price}>
          <input className="dss-input" type="number" min="0" placeholder="cth. 2299"
            value={form.price} onChange={e => set('price', e.target.value)} />
        </Field>
        <Field label="Berat (gram) *" error={errors.weight_g}>
          <input className="dss-input" type="number" min="1" placeholder="cth. 61"
            value={form.weight_g} onChange={e => set('weight_g', e.target.value)} />
        </Field>
      </div>

      {/* Row 3 — Scores */}
      <div style={{
        padding: '14px', borderRadius: '10px',
        background: 'rgba(34,211,238,0.04)', border: '1px solid var(--border)',
      }}>
        <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--accent-cyan)', marginBottom: '12px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          Nilai Kriteria (skala 1–10)
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <Field label="Sensor *" error={errors.sensor_score}>
            <ScoreInput value={form.sensor_score} onChange={v => set('sensor_score', v)} />
          </Field>
          <Field label="DPI *" error={errors.dpi_score}>
            <ScoreInput value={form.dpi_score} onChange={v => set('dpi_score', v)} />
          </Field>
          <Field label="Tombol *" error={errors.button_score}>
            <ScoreInput value={form.button_score} onChange={v => set('button_score', v)} />
          </Field>
          <Field label="Ergonomi *" error={errors.ergonomic_score}>
            <ScoreInput value={form.ergonomic_score} onChange={v => set('ergonomic_score', v)} />
          </Field>
          <Field label="Material *" error={errors.material_score}>
            <ScoreInput value={form.material_score} onChange={v => set('material_score', v)} />
          </Field>
          <Field label="Tampilan *" error={errors.appearance_score}>
            <ScoreInput value={form.appearance_score} onChange={v => set('appearance_score', v)} />
          </Field>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '4px' }}>
        <button type="button" className="btn-secondary" onClick={onCancel} disabled={loading}>
          Batal
        </button>
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Menyimpan...' : initial ? 'Simpan Perubahan' : '+ Tambah Alternatif'}
        </button>
      </div>
    </form>
  );
}

function Field({ label, error, children, hint }) {
  return (
    <div>
      <label className="dss-label">{label}</label>
      {children}
      {hint && <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: 3 }}>{hint}</div>}
      {error && <div style={{ fontSize: '0.72rem', color: '#ef4444', marginTop: 3 }}>{error}</div>}
    </div>
  );
}

function ScoreInput({ value, onChange, hint }) {
  return (
    <input
      className="dss-input"
      type="number" min="1" max="10" step="0.5"
      placeholder="1 – 10"
      value={value}
      onChange={e => onChange(e.target.value)}
    />
  );
}
