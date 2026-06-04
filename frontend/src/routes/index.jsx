// src/routes/index.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout   from '../layouts/MainLayout';
import Dashboard    from '../pages/Dashboard';
import Alternatives from '../pages/Alternatives';
import Calculation  from '../pages/Calculation';

export default function AppRoutes({ alternatives, rankings, top3, steps, criteria, onAdd, onUpdate, onDelete }) {
  const calcProps = { steps, alternatives, criteria, rankings };

  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route
          index
          element={<Dashboard alternatives={alternatives} rankings={rankings} top3={top3} criteria={criteria} />}
        />
        <Route
          path="alternatives"
          element={
            <Alternatives
              alternatives={alternatives}
              rankings={rankings}
              onAdd={onAdd}
              onUpdate={onUpdate}
              onDelete={onDelete}
            />
          }
        />
        {/* TOPSIS Calculation routes — tab driven by :tab param */}
        <Route path="calculation"           element={<Navigate to="/calculation/matrix" replace />} />
        <Route path="calculation/:tab"      element={<Calculation {...calcProps} />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
