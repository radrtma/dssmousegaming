// src/components/MouseIcon.jsx
// SVG mouse silhouette icons with rank-specific color accents

const COLORS = {
  1: { body: '#f59e0b', glow: 'rgba(245,158,11,0.35)', scroll: '#0a0c14' },
  2: { body: '#94a3b8', glow: 'rgba(148,163,184,0.3)',  scroll: '#0a0c14' },
  3: { body: '#cd7c2f', glow: 'rgba(205,124,47,0.3)',   scroll: '#0a0c14' },
};
const DEFAULT_COLOR = { body: '#475569', glow: 'rgba(71,85,105,0.2)', scroll: '#94a3b8' };

export default function MouseIcon({ rank, size = 64, className = '' }) {
  const c = COLORS[rank] || DEFAULT_COLOR;

  return (
    <svg
      width={size}
      height={size * 1.35}
      viewBox="0 0 60 81"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ filter: `drop-shadow(0 0 8px ${c.glow})` }}
    >
      {/* Body */}
      <rect x="6" y="22" width="48" height="52" rx="24" fill="#1a1d27" stroke={c.body} strokeWidth="1.5" />
      {/* Left button */}
      <path d="M6 22 Q6 10 30 10 L30 40 L6 40 Z" fill="#1d2135" stroke={c.body} strokeWidth="1" opacity="0.9" />
      {/* Right button */}
      <path d="M54 22 Q54 10 30 10 L30 40 L54 40 Z" fill="#161928" stroke={c.body} strokeWidth="1" opacity="0.7" />
      {/* Center line */}
      <line x1="30" y1="10" x2="30" y2="40" stroke={c.body} strokeWidth="1" opacity="0.5" />
      {/* Scroll wheel */}
      <rect x="25" y="18" width="10" height="16" rx="5" fill={c.body} opacity="0.9" />
      {/* Scroll lines */}
      <line x1="25" y1="24" x2="35" y2="24" stroke={c.scroll} strokeWidth="1.2" opacity="0.5" />
      <line x1="25" y1="28" x2="35" y2="28" stroke={c.scroll} strokeWidth="1.2" opacity="0.5" />
      {/* Side buttons accent */}
      <rect x="6" y="50" width="6" height="10" rx="3" fill={c.body} opacity="0.6" />
      {/* Bottom light */}
      <ellipse cx="30" cy="70" rx="8" ry="3" fill={c.body} opacity="0.2" />
    </svg>
  );
}

export function SmallMouseIcon({ color = '#22d3ee', size = 28 }) {
  return (
    <svg width={size} height={size * 1.3} viewBox="0 0 40 52" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="14" width="32" height="34" rx="16" fill="#1a1d27" stroke={color} strokeWidth="1.5" />
      <path d="M4 14 Q4 6 20 6 L20 26 L4 26 Z" fill="#1d2135" stroke={color} strokeWidth="1" opacity="0.85" />
      <path d="M36 14 Q36 6 20 6 L20 26 L36 26 Z" fill="#161928" stroke={color} strokeWidth="1" opacity="0.6" />
      <line x1="20" y1="6" x2="20" y2="26" stroke={color} strokeWidth="0.8" opacity="0.4" />
      <rect x="16" y="10" width="8" height="11" rx="4" fill={color} opacity="0.85" />
    </svg>
  );
}
