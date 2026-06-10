// src/components/AlternativeForm.jsx
import { useEffect, useRef, useState } from 'react';
import { MATERIAL_QUALITY_OPTIONS, normalizeMaterialQualityValue } from '../constants/materialQuality';

const EMPTY_FORM = {
  name: '',
  price: '',
  dpi_maks: '',
  button_score: '',
  material: '',
  weight_g: '',
};

export default function AlternativeForm({ initial = null, onSubmit, onCancel, loading = false }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initial) {
      setForm({
        name: initial.name || '',
        price: initial.price || '',
        dpi_maks: initial.dpi_maks || '',
        button_score: initial.button_score || '',
        material: normalizeMaterialQualityValue(initial.material) || '',
        weight_g: initial.weight_g || '',
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
    if (!form.name.trim()) e.name = 'Nama alternatif wajib diisi';
    if (!form.price || isNaN(form.price) || Number(form.price) < 0) e.price = 'Harga harus berupa angka positif';
    if (!form.dpi_maks || isNaN(form.dpi_maks) || Number(form.dpi_maks) < 0) e.dpi_maks = 'DPI harus berupa angka positif';
    if (!form.button_score || isNaN(form.button_score) || Number(form.button_score) < 0) e.button_score = 'Jumlah tombol harus berupa angka';
    if (!form.material.trim()) e.material = 'Material wajib diisi';
    if (!form.weight_g || isNaN(form.weight_g) || Number(form.weight_g) <= 0) e.weight_g = 'Berat harus berupa angka positif';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    onSubmit({
      name: form.name.trim(),
      price: Number(form.price),
      dpi_maks: Number(form.dpi_maks),
      button_score: Number(form.button_score),
      material: form.material.trim(),
      weight_g: Number(form.weight_g),
    });
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <Field label="Nama Mouse" error={errors.name}>
          <input
            className="dss-input"
            placeholder="cth. Logitech G102 LIGHTSYNC"
            value={form.name}
            onChange={e => set('name', e.target.value)}
          />
        </Field>
        <Field label="Harga Acuan (Rp)" error={errors.price}>
          <input
            className="dss-input"
            type="number"
            min="0"
            placeholder="cth. 255000"
            value={form.price}
            onChange={e => set('price', e.target.value)}
          />
        </Field>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <Field label="DPI Maksimum" error={errors.dpi_maks}>
          <input
            className="dss-input"
            type="number"
            min="0"
            placeholder="cth. 8000"
            value={form.dpi_maks}
            onChange={e => set('dpi_maks', e.target.value)}
          />
        </Field>
        <Field label="Jumlah Tombol" error={errors.button_score}>
          <input
            className="dss-input"
            type="number"
            min="0"
            placeholder="cth. 6"
            value={form.button_score}
            onChange={e => set('button_score', e.target.value)}
          />
        </Field>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <Field label="Berat (gram)" error={errors.weight_g}>
          <input
            className="dss-input"
            type="number"
            min="1"
            step="0.01"
            placeholder="cth. 85"
            value={form.weight_g}
            onChange={e => set('weight_g', e.target.value)}
          />
        </Field>
        <Field
          label="Material & Build Quality"
          error={errors.material}
          hint="Pilihan ini mengikuti konversi backend: Standar=1, Cukup=2, Baik=3, Sangat Baik=4, Premium=5."
        >
          <MaterialQualityCombobox
            value={form.material}
            options={MATERIAL_QUALITY_OPTIONS}
            placeholder="Pilih material & build quality"
            disabled={loading}
            onChange={value => set('material', value)}
          />
        </Field>
      </div>

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

function MaterialQualityCombobox({ value, options, placeholder, onChange, disabled = false }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const selected = options.find(option => option.value === value);

  useEffect(() => {
    if (!open) return undefined;

    const handleClickOutside = (event) => {
      if (rootRef.current && !rootRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  const choose = (nextValue) => {
    onChange(nextValue);
    setOpen(false);
  };

  return (
    <div ref={rootRef} className={`custom-combobox ${open ? 'is-open' : ''}`}>
      <button
        type="button"
        className="custom-combobox-trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        disabled={disabled}
        onClick={() => setOpen(prev => !prev)}
      >
        <span className={selected ? 'custom-combobox-value' : 'custom-combobox-placeholder'}>
          {selected ? `${selected.label} — Skor ${selected.score}` : placeholder}
        </span>
        <span className="custom-combobox-caret" aria-hidden="true">⌄</span>
      </button>

      {open && (
        <div className="custom-combobox-menu" role="listbox">
          <button
            type="button"
            className={`custom-combobox-option ${value === '' ? 'is-active' : ''}`}
            onClick={() => choose('')}
            role="option"
            aria-selected={value === ''}
          >
            <span>{placeholder}</span>
          </button>

          {options.map(option => (
            <button
              key={option.value}
              type="button"
              className={`custom-combobox-option ${value === option.value ? 'is-active' : ''}`}
              onClick={() => choose(option.value)}
              role="option"
              aria-selected={value === option.value}
            >
              <span>{option.label}</span>
              <span className="custom-combobox-score">Skor {option.score}</span>
            </button>
          ))}
        </div>
      )}
    </div>
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
