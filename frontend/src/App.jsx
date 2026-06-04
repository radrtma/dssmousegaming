// src/App.jsx — Root component wiring state + router
import { useEffect }      from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes          from './routes/index';
import { useAlternatives } from './hooks/useAlternatives';
import { useTopsis }        from './hooks/useTopsis';

export default function App() {
  const {
    alternatives,
    error: alternativesError,
    addAlternative,
    updateAlternative,
    deleteAlternative,
    loadFromBackend,
  } = useAlternatives();

  useEffect(() => {
    loadFromBackend();
  }, [loadFromBackend]);

  const { rankings, steps, criteria, top3, error: topsisError } = useTopsis(alternatives);

  return (
    <BrowserRouter>
      <AppRoutes
        alternatives={alternatives}
        rankings={rankings}
        top3={top3}
        steps={steps}
        criteria={criteria}
        alternativesError={alternativesError}
        topsisError={topsisError}
        onAdd={addAlternative}
        onUpdate={updateAlternative}
        onDelete={deleteAlternative}
      />
    </BrowserRouter>
  );
}
