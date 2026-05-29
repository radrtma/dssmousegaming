// src/components/Tabs.jsx
export default function Tabs({ tabs, activeTab, onChange }) {
  return (
    <div style={{
      display: 'flex',
      gap: '4px',
      padding: '4px',
      background: 'var(--bg-base)',
      borderRadius: '10px',
      border: '1px solid var(--border)',
      overflowX: 'auto',
      flexWrap: 'wrap',
    }}>
      {tabs.map(tab => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            style={{
              padding: '7px 14px',
              borderRadius: '7px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.8rem',
              fontWeight: 600,
              fontFamily: 'inherit',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s',
              background: isActive
                ? 'linear-gradient(135deg, var(--accent-cyan), var(--accent-cyan-2))'
                : 'transparent',
              color: isActive ? '#0a0c14' : 'var(--text-secondary)',
              boxShadow: isActive ? '0 2px 12px rgba(34,211,238,0.25)' : 'none',
            }}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
