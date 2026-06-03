// src/layouts/MainLayout.jsx
import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Sidebar from '../components/Sidebar';

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof window === 'undefined') return true;
    return window.innerWidth >= 900;
  });

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1180) setSidebarOpen(true);
      if (window.innerWidth < 760) setSidebarOpen(false);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const closeSidebarOnMobile = () => {
    if (typeof window !== 'undefined' && window.innerWidth < 900) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="app-shell">
      <button
        type="button"
        className={`sidebar-toggle ${sidebarOpen ? 'is-open' : ''}`}
        onClick={() => setSidebarOpen(value => !value)}
        aria-label={sidebarOpen ? 'Tutup sidebar' : 'Buka sidebar'}
      >
        {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
      </button>

      <Sidebar isOpen={sidebarOpen} onNavigate={closeSidebarOnMobile} />

      <button
        type="button"
        className={`sidebar-overlay ${sidebarOpen ? 'active' : ''}`}
        aria-label="Tutup sidebar"
        onClick={() => setSidebarOpen(false)}
      />

      <main className={`main-content ${sidebarOpen ? 'sidebar-is-open' : 'sidebar-is-closed'}`}>
        <Outlet />
      </main>
    </div>
  );
}
