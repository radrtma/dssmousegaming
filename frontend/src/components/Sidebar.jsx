// src/components/Sidebar.jsx
import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, MousePointer2, Calculator,
  Table2, BarChart3, Layers, Target, Star, Trophy, Ruler,
  ChevronDown, ChevronRight, Cpu
} from 'lucide-react';

const topsisSubmenu = [
  { to: '/calculation/matrix',      label: 'Matriks Keputusan',      icon: Table2 },
  { to: '/calculation/normalized',  label: 'Normalisasi',            icon: Layers },
  { to: '/calculation/weighted',    label: 'Terbobot',               icon: BarChart3 },
  { to: '/calculation/ideal',       label: 'Solusi Ideal',           icon: Target },
  { to: '/calculation/distance',    label: 'Jarak Antar Alternatif', icon: Ruler },
  { to: '/calculation/preference',  label: 'Nilai Preferensi',       icon: Star },
  { to: '/calculation/ranking',     label: 'Ranking Akhir',          icon: Trophy },
];

export default function Sidebar({ isOpen = true, onNavigate }) {
  const location = useLocation();
  const isCalcActive = location.pathname.startsWith('/calculation');
  const [calcOpen, setCalcOpen] = useState(isCalcActive);

  return (
    <aside className={`sidebar ${isOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      {/* Brand */}
      <div className="sidebar-brand" style={{ padding: '20px 58px 16px 18px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: 34, height: 34, borderRadius: 10,
            background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <Cpu size={17} color="#0a0c14" strokeWidth={2.5} />
          </div>
          <div>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2 }}>
              DSS Gaming
            </div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 500 }}>
              Mouse Recommendation
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ padding: '12px 10px', flex: 1 }}>
        <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', padding: '0 8px 8px' }}>
          Menu
        </div>

        {/* Dashboard */}
        <SidebarLink to="/" icon={LayoutDashboard} label="Dashboard" onNavigate={onNavigate} />

        {/* Alternatif */}
        <SidebarLink to="/alternatives" icon={MousePointer2} label="Alternatif" onNavigate={onNavigate} />

        {/* TOPSIS — collapsible */}
        <div>
          <button
            onClick={() => setCalcOpen(v => !v)}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '9px',
              padding: '9px 10px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              background: calcOpen ? 'rgba(34,211,238,0.08)' : 'transparent',
              color: calcOpen ? 'var(--accent-cyan)' : 'var(--text-secondary)',
              fontSize: '0.83rem',
              fontWeight: 600,
              fontFamily: 'inherit',
              transition: 'all 0.2s',
              marginBottom: '2px',
            }}
          >
            <Calculator size={16} strokeWidth={2} />
            <span style={{ flex: 1, textAlign: 'left' }}>TOPSIS Calc</span>
            {calcOpen
              ? <ChevronDown size={14} />
              : <ChevronRight size={14} />}
          </button>

          {calcOpen && (
            <div style={{ paddingLeft: '12px', marginBottom: '4px' }}>
              <div style={{
                borderLeft: '1px solid var(--border-light)',
                paddingLeft: '10px',
                display: 'flex', flexDirection: 'column', gap: '2px'
              }}>
                {topsisSubmenu.map(item => (
                  <SubLink key={item.to} {...item} onNavigate={onNavigate} />
                ))}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Footer */}
      <div style={{ padding: '12px 18px', borderTop: '1px solid var(--border)' }}>
        <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textAlign: 'center' }}>
          Metode TOPSIS v1.0
        </div>
      </div>
    </aside>
  );
}

function SidebarLink({ to, icon: Icon, label, onNavigate }) {
  return (
    <NavLink
      to={to}
      end
      onClick={onNavigate}
      style={({ isActive }) => ({
        display: 'flex',
        alignItems: 'center',
        gap: '9px',
        padding: '9px 10px',
        borderRadius: '8px',
        textDecoration: 'none',
        fontSize: '0.83rem',
        fontWeight: 600,
        marginBottom: '2px',
        transition: 'all 0.2s',
        background: isActive ? 'rgba(34,211,238,0.1)' : 'transparent',
        color: isActive ? 'var(--accent-cyan)' : 'var(--text-secondary)',
        borderLeft: isActive ? '2px solid var(--accent-cyan)' : '2px solid transparent',
      })}
    >
      <Icon size={16} strokeWidth={2} />
      {label}
    </NavLink>
  );
}

function SubLink({ to, icon: Icon, label, onNavigate }) {
  return (
    <NavLink
      to={to}
      onClick={onNavigate}
      style={({ isActive }) => ({
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '7px 8px',
        borderRadius: '6px',
        textDecoration: 'none',
        fontSize: '0.78rem',
        fontWeight: isActive ? 600 : 500,
        transition: 'all 0.18s',
        background: isActive ? 'rgba(34,211,238,0.08)' : 'transparent',
        color: isActive ? 'var(--accent-cyan)' : 'var(--text-muted)',
      })}
    >
      <Icon size={13} strokeWidth={2} />
      {label}
    </NavLink>
  );
}
