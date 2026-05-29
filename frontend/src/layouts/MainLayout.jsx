// src/layouts/MainLayout.jsx
import Sidebar from '../components/Sidebar';
import { Outlet } from 'react-router-dom';

export default function MainLayout() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-base)' }}>
      <Sidebar />
      <main
        style={{
          marginLeft: '230px',
          flex: 1,
          minHeight: '100vh',
          overflowX: 'hidden',
          padding: '28px 32px',
          maxWidth: '100%',
        }}
      >
        <Outlet />
      </main>
    </div>
  );
}
