import { Routes, Route } from 'react-router-dom';
import PlayPage from './pages/PlayPage';
import SolverPage from './pages/SolverPage';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<PlayPage />} />
        <Route path="/solver" element={<SolverPage />} />
      </Routes>
    </>
  );
}

export default App;
