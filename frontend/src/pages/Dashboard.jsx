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
    name: 'Ridhwan Hilmy',
    nim: '2407412030',
    photo: ridwhanPhoto,
  },
];

export default function Dashboard({ alternatives, rankings, top3, criteria = [] }) {
  const navigate = useNavigate();

  const stats = [
    { label: 'Total Alternatif', value: alternatives.length, icon: MousePointer2, color: '#22d3ee' },
    { label: 'Kriteria',         value: criteria.length || 0, icon: BarChart3,     color: '#a78bfa' },
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
          title="Metode TOPSIS"
          text="TOPSIS (Technique for Order Preference by Similarity to Ideal Solution) adalah metode pengambilan keputusan multikriteria yang digunakan untuk menentukan solusi terbaik dari beberapa alternatif. Konsep utamanya adalah memilih alternatif yang memiliki jarak terdekat dengan Solusi Ideal Positif dan jarak terjauh dari Solusi Ideal Negatif"
        />
        <InfoCard
          icon={BookOpen}
          title="Latar Belakang"
          text="Gamers sering menghadapi banyak pilihan mouse wired dengan spesifikasi yang berbeda. Keputusan yang hanya mengandalkan satu aspek dapat menghasilkan pilihan yang kurang sesuai. Sistem pendukung keputusan ini menyusun proses pemilihan secara objektif melalui bobot kriteria dan perhitungan nilai preferensi."
        />
      </div>

      {/* Langkah-langkah */}
      <section className="glass criteria-card">
        <div className="criteria-card-header">
          <div>
            <h2>Langkah-Langkah Metode TOPSIS</h2>
            <p> 1. Membuat matriks keputusan yang ternormalisasi.</p>
            <p> 2. Membuat matriks keputusan yang ternormalisasi terbobot.</p>
            <p>3. Menentukan matriks solusi ideal positif & matriks solusi ideal negatif.</p>
             <p>4. Menentukan jarak antara nilai setiap alternatif dengan matriks solusi ideal positif & matriks solusi idealnegatif.</p>
             <p>5. Menentukan nilai preferensi untuk setiap alternatif.</p>
          </div>
          <CheckCircle2 size={24} color="var(--accent-cyan)" />
        </div>
      </section>

      {/* Criteria summary */}
      <section className="glass criteria-card">
        <div className="criteria-card-header">
          <div>
            <h2>Kriteria Penilaian</h2>
            <p>Kriteria yang digunakan diambil langsung dari tabel kriteria pada database.</p>
          </div>
          <CheckCircle2 size={24} color="var(--accent-cyan)" />
        </div>
        <div className="criteria-list">
          {(criteria.length > 0 ? criteria : [
            { name: 'Harga', type: 'cost' },
            { name: 'DPI', type: 'benefit' },
            { name: 'Jumlah Tombol / Customization', type: 'benefit' },
            { name: 'Material & Build Quality', type: 'benefit' },
            { name: 'Berat / Bobot Mouse', type: 'cost' },
          ]).map(item => (
            <span key={item.name} className="criteria-pill">
              {item.name} ({item.type})
            </span>
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
            const rank = rankings.find(r => String(r.alternative_id) === String(alt.id));
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
