// src/pages/Dashboard.jsx
import { useNavigate } from 'react-router-dom';
import {
  Plus, Play, Cpu, TrendingUp, MousePointer2, BarChart3,
  Users, BookOpen, Target, CheckCircle2
} from 'lucide-react';
import RecommendationCard from '../components/RecommendationCard';
import LeaderboardTable   from '../components/LeaderboardTable';
import { SmallMouseIcon } from '../components/MouseIcon';
import { formatScore }    from '../utils/topsisEngine';
import bestarPhoto         from '../assets/team-bestar.png';
import raffiPhoto         from '../assets/team-raffi.jpeg';
import fajarPhoto     from '../assets/team-fajar.jpeg';
import ridwhanPhoto      from '../assets/team-ridhwan.jpeg';

const teamMembers = [
  {
    name: 'Bestar Khan',
    nim: '2407412006',
    photo: bestarPhoto,
  },
  {
    name: 'Raffi Indra Pratama',
    nim: '2407412007',
    photo: raffiPhoto,
  },
  {
    name: 'Fajar Fathurrachman',
    nim: '2407412020',
    photo: fajarPhoto,
  },
  {
    name: 'Ridhwan',
    nim: 'xxx',
    photo: ridwhanPhoto,
  },
];

const decisionCriteria = [
  'Harga',
  'Sensor',
  'DPI',
  'Jumlah tombol',
  'Ergonomi',
  'Material',
  'Berat',
  'Tampilan',
];

export default function Dashboard({ alternatives, rankings, top3 }) {
  const navigate = useNavigate();

  const stats = [
    { label: 'Total Alternatif', value: alternatives.length, icon: MousePointer2, color: '#22d3ee' },
    { label: 'Kriteria',         value: 8,                   icon: BarChart3,     color: '#a78bfa' },
    { label: 'Top Score',        value: top3[0] ? `${formatScore(top3[0].topsis_score)}%` : '—', icon: TrendingUp, color: '#f59e0b' },
    { label: 'Metode',           value: 'TOPSIS',            icon: Cpu,           color: '#34d399' },
  ];

  return (
    <div className="dashboard-page">

      {/* Hero Section */}
      <div className="glass dashboard-hero">
        <div className="dashboard-hero-bg" />
        <div className="dashboard-hero-grid" />

        <div className="dashboard-hero-mouse">
          <SmallMouseIcon color="#22d3ee" size={200} />
        </div>

        <div className="dashboard-hero-content">
          <div style={{ maxWidth: '690px' }}>
            <div className="hero-badge">
              <Cpu size={11} /> Decision Support System
            </div>

            <h1 className="dashboard-title">
              Pemilihan Mouse Wired Untuk Gamers
            </h1>

            <p className="dashboard-subtitle">
              Sistem ini membantu menentukan mouse wired gaming terbaik menggunakan metode <strong style={{ color: 'var(--accent-cyan)' }}>TOPSIS</strong>. Penilaian dilakukan melalui beberapa kriteria agar hasil rekomendasi lebih terukur, konsisten, dan mudah dibandingkan.
            </p>

            <div className="hero-actions">
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

      {/* Study case and background */}
      <div className="dashboard-context-grid">
        <InfoCard
          icon={Target}
          title="Study Case"
          text="Studi kasus pada sistem ini adalah pemilihan mouse wired untuk gamers. Setiap alternatif mouse dibandingkan berdasarkan harga, sensor, DPI, jumlah tombol, ergonomi, material, berat, dan tampilan. Metode TOPSIS dipakai untuk mencari alternatif yang paling dekat dengan solusi ideal positif dan paling jauh dari solusi ideal negatif."
        />
        <InfoCard
          icon={BookOpen}
          title="Latar Belakang"
          text="Gamers sering menghadapi banyak pilihan mouse wired dengan spesifikasi yang berbeda. Keputusan yang hanya mengandalkan harga atau tampilan dapat menghasilkan pilihan yang kurang sesuai. Sistem pendukung keputusan ini menyusun proses pemilihan secara objektif melalui bobot kriteria dan perhitungan nilai preferensi."
        />
      </div>

      {/* Criteria summary */}
      <section className="glass criteria-card">
        <div className="criteria-card-header">
          <div>
            <h2>Kriteria Penilaian</h2>
            <p>Delapan kriteria utama yang digunakan dalam proses pemilihan mouse wired gaming.</p>
          </div>
          <CheckCircle2 size={24} color="var(--accent-cyan)" />
        </div>
        <div className="criteria-list">
          {decisionCriteria.map(item => (
            <span key={item} className="criteria-pill">{item}</span>
          ))}
        </div>
      </section>

      {/* Team members */}
      <section>
        <SectionHeader
          title="Tim Pengembang"
          subtitle="Kelompok mahasiswa Politeknik Negeri Jakarta yang mengembangkan sistem ini"
        />
        <div className="developer-grid">
          {teamMembers.map((member, i) => (
            <div key={member.nim} className="glass developer-card animate-fade-in-up" style={{ animationDelay: `${i * 0.06}s` }}>
              <img className="developer-photo" src={member.photo} alt={member.name} />
              <div className="developer-info">
                <h3>{member.name}</h3>
                <p>NIM {member.nim}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Stat Cards */}
      <div className="dashboard-stats-grid">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="glass stat-card animate-fade-in-up" style={{ animationDelay: `${i * 0.07}s` }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div>
                  <div className="stat-label">
                    {s.label}
                  </div>
                  <div className="stat-value">
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

      {/* Top 3 Recommendations */}
      <section>
        <SectionHeader title="Top 3 Recommendation" subtitle="Mouse gaming terbaik berdasarkan perhitungan TOPSIS" />
        {top3.length > 0 ? (
          <div className="recommendation-grid">
            {top3.map((item, i) => (
              <RecommendationCard key={item.alternative_id} item={item} rank={i + 1} />
            ))}
          </div>
        ) : (
          <EmptyState message="Tambahkan minimal 2 alternatif untuk melihat rekomendasi." />
        )}
      </section>

      {/* Leaderboard */}
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

      {/* Alternative Cards */}
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
        <div className="dashboard-alt-grid">
          {alternatives.slice(0, 6).map((alt, i) => {
            const rank = rankings.find(r => r.alternative_id === alt.id);
            return (
              <div key={alt.id} className="glass alt-card animate-fade-in-up" style={{ animationDelay: `${i * 0.06}s` }}>
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

function InfoCard({ icon: Icon, title, text }) {
  return (
    <div className="glass info-card">
      <div className="info-icon">
        <Icon size={18} />
      </div>
      <div>
        <h2>{title}</h2>
        <p>{text}</p>
      </div>
    </div>
  );
}

function SectionHeader({ title, subtitle, action }) {
  return (
    <div className="section-header">
      <div>
        <h2>{title}</h2>
        {subtitle && <p>{subtitle}</p>}
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
