import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Dashboard from './pages/Dashboard';
import Dispatch from './pages/Dispatch';
import Fleet from './pages/Fleet';
import TripLogs from './pages/TripLogs';
import Crew from './pages/Crew';
import Maintenance from './pages/Maintenance';
import Reports from './pages/Reports';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dispatch" element={<Dispatch />} />
        <Route path="/fleet" element={<Fleet />} />
        <Route path="/trip-logs" element={<TripLogs />} />
        <Route path="/crew" element={<Crew />} />
        <Route path="/maintenance" element={<Maintenance />} />
        <Route path="/reports" element={<Reports />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-bg-base text-text-primary font-sans">
        <Sidebar />
        <Topbar />
        <main className="ml-[200px] pt-12 min-h-screen">
          <div className="p-6">
            <AnimatedRoutes />
          </div>
        </main>
      </div>
    </BrowserRouter>
  );
}
