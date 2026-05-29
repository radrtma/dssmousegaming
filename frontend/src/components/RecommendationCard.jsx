// src/components/RecommendationCard.jsx
import { Medal } from 'lucide-react';
import { formatScore } from '../utils/topsisEngine';
import MouseIcon from './MouseIcon';

const RANK_STYLES = {
  1: {
    gradient: 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(245,158,11,0.05))',
    border: '1px solid rgba(245,158,11,0.35)',
    badge: 'linear-gradient(135deg, #f59e0b, #d97706)',
    label: '1st',
    glow: '0 0 24px rgba(245,158,11,0.2)',
    tagBg: 'rgba(245,158,11,0.15)',
    tagColor: '#f59e0b',
  },
  2: {
    gradient: 'linear-gradient(135deg, rgba(148,163,184,0.12), rgba(148,163,184,0.04))',
    border: '1px solid rgba(148,163,184,0.3)',
    badge: 'linear-gradient(135deg, #94a3b8, #64748b)',
    label: '2nd',
    glow: '0 0 20px rgba(148,163,184,0.12)',
    tagBg: 'rgba(148,163,184,0.15)',
    tagColor: '#94a3b8',
  },
  3: {
    gradient: 'linear-gradient(135deg, rgba(205,124,47,0.12), rgba(205,124,47,0.04))',
    border: '1px solid rgba(205,124,47,0.3)',
    badge: 'linear-gradient(135deg, #cd7c2f, #a16207)',
    label: '3rd',
    glow: '0 0 20px rgba(205,124,47,0.12)',
    tagBg: 'rgba(205,124,47,0.15)',
    tagColor: '#cd7c2f',
  },
};

const AUTO_TAGS = {
  1: ['Lightweight', 'Best Sensor'],
  2: ['Best Ergonomics'],
  3: ['Budget Friendly'],
};

export default function RecommendationCard({ item, rank }) {
  const style = RANK_STYLES[rank] || RANK_STYLES[3];
  const tags  = item.tags?.length ? item.tags : (AUTO_TAGS[rank] || []);

  return (
    <div
      className="animate-fade-in-up"
      style={{
        flex: 1,
        minWidth: '180px',
        borderRadius: '14px',
        background: style.gradient,
        border: style.border,
        boxShadow: style.glow,
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        transition: 'transform 0.2s, box-shadow 0.2s',
        animationDelay: `${(rank - 1) * 0.1}s`,
        cursor: 'default',
      }}
      onMouseOver={e => {
        e.currentTarget.style.transform = 'translateY(-3px)';
        e.currentTarget.style.boxShadow = style.glow.replace('0.2)', '0.4)');
      }}
      onMouseOut={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = style.glow;
      }}
    >
      {/* Rank badge */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '5px',
          padding: '3px 10px', borderRadius: '999px',
          background: style.badge,
          fontSize: '0.7rem', fontWeight: 800,
          color: rank === 1 ? '#0a0c14' : '#fff',
          letterSpacing: '0.05em',
        }}>
          <Medal size={11} strokeWidth={3} />
          {style.label}
        </div>
      </div>

      {/* Mouse icon */}
      <div style={{
        height: '80px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        opacity: 0.85,
      }}>
        <MouseIcon rank={rank} size={72} />
      </div>

      {/* Name */}
      <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.3 }}>
        {item.alternative_name}
      </div>

      {/* Score */}
      <div>
        <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginBottom: '3px' }}>
          Preference Score
        </div>
        <div style={{ fontSize: '1.3rem', fontWeight: 800, color: style.tagColor }}>
          {formatScore(item.topsis_score)}
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginLeft: 2 }}>/ 100</span>
        </div>

        {/* Score bar */}
        <div className="score-bar-track" style={{ marginTop: '6px' }}>
          <div
            className="score-bar-fill"
            style={{
              width: `${formatScore(item.topsis_score)}%`,
              background: rank === 1
                ? 'linear-gradient(90deg,#f59e0b,#d97706)'
                : rank === 2
                  ? 'linear-gradient(90deg,#94a3b8,#64748b)'
                  : 'linear-gradient(90deg,#cd7c2f,#a16207)',
            }}
          />
        </div>
      </div>

      {/* Tags */}
      {tags.length > 0 && (
        <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
          {tags.map(tag => (
            <span
              key={tag}
              className="tag-pill"
              style={{ background: style.tagBg, color: style.tagColor, border: `1px solid ${style.tagColor}44` }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
