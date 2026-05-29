// src/pages/Dashboard.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Play, Cpu, TrendingUp, MousePointer2, BarChart3 } from 'lucide-react';
import RecommendationCard from '../components/RecommendationCard';
import LeaderboardTable   from '../components/LeaderboardTable';
import { SmallMouseIcon } from '../components/MouseIcon';
import { formatScore }    from '../utils/topsisEngine';

export default function Dashboard({ alternatives, rankings, top3 }) {
  const navigate = useNavigate();

  const stats = [
    { label: 'Total Alternatif', value: alternatives.length, icon: MousePointer2, color: '#22d3ee' },
    { label: 'Kriteria',         value: 8,                   icon: BarChart3,     color: '#a78bfa' },
    { label: 'Top Score',        value: top3[0] ? `${formatScore(top3[0].topsis_score)}%` : '—', icon: TrendingUp, color: '#f59e0b' },
    { label: 'Metode',           value: 'TOPSIS',            icon: Cpu,           color: '#34d399' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>

      {/* ── Hero Section ──────────────────────────────── */}
      <div
        className="glass"
        style={{
          borderRadius: '18px',
          padding: '0',
          overflow: 'hidden',
          position: 'relative',
          minHeight: '200px',
          border: '1px solid var(--border-light)',
        }}
      >
        {/* BG gradient */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(135deg, rgba(34,211,238,0.07) 0%, rgba(167,139,250,0.05) 60%, transparent 100%)',
        }} />
        {/* Grid overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          opacity: 0.25,
        }} />

        {/* Mouse silhouette bg */}
        <div style={{
          position: 'absolute', right: '30px', bottom: '-10px',
          opacity: 0.07, transform: 'rotate(-15deg)',
          pointerEvents: 'none',
        }}>
          <SmallMouseIcon color="#22d3ee" size={200} />
        </div>

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 1, padding: '32px 36px' }}>
          <div style={{ maxWidth: '600px' }}>
            {/* Badge */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              padding: '4px 12px', borderRadius: '999px',
              background: 'rgba(34,211,238,0.12)', border: '1px solid rgba(34,211,238,0.25)',
              color: 'var(--accent-cyan)', fontSize: '0.72rem', fontWeight: 700,
              letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '16px',
            }}>
              <Cpu size={11} /> Decision Support System
            </div>

            <h1 style={{
              fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 800,
              color: 'var(--text-primary)', lineHeight: 1.25, marginBottom: '10px',
            }}>
              Gaming Mouse{' '}
              <span className="gradient-text">Decision Support System</span>
            </h1>

            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: '22px', maxWidth: '480px' }}>
              Sistem rekomendasi mouse gaming berbasis metode <strong style={{ color: 'var(--accent-cyan)' }}>TOPSIS</strong>{' '}
              (Technique for Order Preference by Similarity to Ideal Solution) dengan analisis multi-kriteria.
            </p>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button className="btn-primary" onClick={() => navigate('/alternatives')}>
                <Plus size={15} />
                Tambah Alternatif
              </button>
              <button className="btn-secondary" onClick={() => navigate('/calculation/matrix')}>
                <Play size={15} />
                Lihat Perhitungan
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Stat Cards ────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '14px' }}>
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="glass animate-fade-in-up" style={{
              borderRadius: '14px', padding: '18px',
              animationDelay: `${i * 0.07}s`,
              border: '1px solid var(--border)',
              transition: 'transform 0.2s',
            }}
              onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                    {s.label}
                  </div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    {s.value}
                  </div>
                </div>
                <div style={{
                  width: 36, height: 36, borderRadius: '10px',
                  background: `${s.color}18`, border: `1px solid ${s.color}30`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon size={17} color={s.color} strokeWidth={2} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Top 3 Recommendations ─────────────────────── */}
      <section>
        <SectionHeader title="Top 3 Recommendation" subtitle="Mouse gaming terbaik berdasarkan perhitungan TOPSIS" />
        {top3.length > 0 ? (
          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
            {top3.map((item, i) => (
              <RecommendationCard key={item.alternative_id} item={item} rank={i + 1} />
            ))}
          </div>
        ) : (
          <EmptyState message="Tambahkan minimal 2 alternatif untuk melihat rekomendasi." />
        )}
      </section>

      {/* ── Leaderboard ───────────────────────────────── */}
      <section>
        <SectionHeader
          title="Leaderboard"
          subtitle="Ranking lengkap semua alternatif mouse gaming"
          action={
            <button className="btn-secondary" onClick={() => navigate('/alternatives')} style={{ fontSize: '0.78rem', padding: '6px 14px' }}>
              <MousePointer2 size={13} /> Kelola Alternatif
            </button>
          }
        />
        <div className="glass" style={{ borderRadius: '14px', overflow: 'hidden', border: '1px solid var(--border)' }}>
          <LeaderboardTable rankings={rankings} alternatives={alternatives} />
        </div>
      </section>

      {/* ── Alternative Cards (quick view) ─────────────── */}
      <section>
        <SectionHeader
          title="Alternative Management"
          subtitle="Kelola data alternatif mouse gaming"
          action={
            <button className="btn-primary" onClick={() => navigate('/alternatives')} style={{ fontSize: '0.78rem', padding: '6px 14px' }}>
              <Plus size={13} /> Tambah Mouse
            </button>
          }
        />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: '12px' }}>
          {alternatives.slice(0, 6).map((alt, i) => {
            const rank = rankings.find(r => r.alternative_id === alt.id);
            return (
              <div key={alt.id} className="glass animate-fade-in-up"
                style={{
                  borderRadius: '12px', padding: '14px', border: '1px solid var(--border)',
                  display: 'flex', flexDirection: 'column', gap: '8px',
                  animationDelay: `${i * 0.06}s`,
                  transition: 'transform 0.2s, border-color 0.2s',
                }}
                onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = 'var(--border-light)'; }}
                onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <SmallMouseIcon color="#22d3ee" size={24} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {alt.name}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{alt.brand}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  <span>Rp {Number(alt.price).toLocaleString('id-ID')}</span>
                  <span>{alt.weight_g}g</span>
                </div>
                {rank && (
                  <div style={{ fontSize: '0.72rem', color: 'var(--accent-cyan)', fontWeight: 600 }}>
                    Rank #{rank.rank_position} · {formatScore(rank.topsis_score)}%
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function SectionHeader({ title, subtitle, action }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
      <div>
        <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '3px' }}>{title}</h2>
        {subtitle && <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

function EmptyState({ message }) {
  return (
    <div className="glass" style={{
      borderRadius: '14px', padding: '40px', textAlign: 'center',
      border: '1px solid var(--border)',
    }}>
      <MousePointer2 size={36} color="var(--text-muted)" style={{ margin: '0 auto 12px' }} />
      <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>{message}</p>
    </div>
  );
}
