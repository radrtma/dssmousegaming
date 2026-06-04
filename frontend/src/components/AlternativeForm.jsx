// src/components/AlternativeForm.jsx
import { useEffect, useState } from 'react';

const EMPTY_FORM = {
  name: '',
  price: '',
  dpi_maks: '',
  sensor: '',
  button_score: '',
  ergonomi: '',
  material: '',
  weight_g: '',
  tampilan: '',
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
        sensor: initial.sensor || '',
        button_score: initial.button_score || '',
        ergonomi: initial.ergonomi || '',
        material: initial.material || '',
        weight_g: initial.weight_g || '',
        tampilan: initial.tampilan || '',
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
    if (!form.sensor.trim()) e.sensor = 'Jenis sensor wajib diisi';
    if (!form.button_score || isNaN(form.button_score) || Number(form.button_score) < 0) e.button_score = 'Jumlah tombol harus berupa angka';
    if (!form.ergonomi.trim()) e.ergonomi = 'Ergonomi wajib diisi';
    if (!form.material.trim()) e.material = 'Material wajib diisi';
    if (!form.weight_g || isNaN(form.weight_g) || Number(form.weight_g) <= 0) e.weight_g = 'Berat harus berupa angka positif';
    if (!form.tampilan.trim()) e.tampilan = 'Tampilan wajib diisi';
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
      sensor: form.sensor.trim(),
      button_score: Number(form.button_score),
      ergonomi: form.ergonomi.trim(),
      material: form.material.trim(),
      weight_g: Number(form.weight_g),
      tampilan: form.tampilan.trim(),
    });
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <Field label="Nama Mouse *" error={errors.name}>
          <input
            className="dss-input"
            placeholder="cth. Logitech G102 LIGHTSYNC"
            value={form.name}
            onChange={e => set('name', e.target.value)}
          />
        </Field>
        <Field label="Harga Acuan (Rp) *" error={errors.price}>
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
        <Field label="DPI Maksimum *" error={errors.dpi_maks}>
          <input
            className="dss-input"
            type="number"
            min="0"
            placeholder="cth. 8000"
            value={form.dpi_maks}
            onChange={e => set('dpi_maks', e.target.value)}
          />
        </Field>
        <Field label="Jumlah Tombol / Customization *" error={errors.button_score}>
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

      <Field label="Jenis Sensor *" error={errors.sensor}>
        <input
          className="dss-input"
          placeholder="cth. HERO 25K"
          value={form.sensor}
          onChange={e => set('sensor', e.target.value)}
        />
      </Field>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <Field label="Ergonomi / Bentuk Mouse *" error={errors.ergonomi}>
          <input
            className="dss-input"
            placeholder="cth. Right-handed ergonomic"
            value={form.ergonomi}
            onChange={e => set('ergonomi', e.target.value)}
          />
        </Field>
        <Field label="Berat (gram) *" error={errors.weight_g}>
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
      </div>

      <Field label="Material & Build Quality *" error={errors.material}>
        <textarea
          className="dss-input"
          rows={3}
          placeholder="cth. PTFE feet, paracord cable, optical switch"
          value={form.material}
          onChange={e => set('material', e.target.value)}
          style={{ resize: 'vertical', minHeight: 76 }}
        />
      </Field>

      <Field label="Tampilan / RGB *" error={errors.tampilan}>
        <input
          className="dss-input"
          placeholder="cth. LIGHTSYNC RGB"
          value={form.tampilan}
          onChange={e => set('tampilan', e.target.value)}
        />
      </Field>

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
