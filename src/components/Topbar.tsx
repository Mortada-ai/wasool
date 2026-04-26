import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Bell, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const titles: Record<string, string> = {
  '/':            'Dashboard',
  '/dispatch':    'Live Dispatch',
  '/fleet':       'Fleet',
  '/trip-logs':   'Trip Logs',
  '/crew':        'Crew',
  '/maintenance': 'Maintenance',
  '/reports':     'Reports',
};

export default function Topbar() {
  const location = useLocation();
  const title = titles[location.pathname] ?? 'Dashboard';
  const [time, setTime] = useState(new Date());
  const { isDark, toggle } = useTheme();

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const fmt = time.toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
  });

  return (
    <header className="fixed top-0 left-[200px] right-0 h-12 bg-bg-surface/90 backdrop-blur-md border-b border-border z-20 flex items-center px-6 transition-theme">
      <motion.h1
        key={title}
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="text-sm font-semibold text-text-primary font-sans flex-1"
      >
        {title}
      </motion.h1>

      <div className="flex items-center gap-3">
        {/* Live indicator */}
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-green opacity-60" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-green" />
          </span>
          <span className="text-xs font-sans text-accent-green font-medium">Live</span>
        </div>

        {/* Clock */}
        <div className="font-mono text-xs text-text-muted tabular-nums">{fmt}</div>

        {/* Theme toggle */}
        <motion.button
          onClick={toggle}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          className="relative p-1.5 rounded-lg hover:bg-bg-subtle transition-colors overflow-hidden"
          title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={isDark ? 'moon' : 'sun'}
              initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
              animate={{ rotate: 0,   opacity: 1, scale: 1 }}
              exit={{   rotate:  90,  opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
            >
              {isDark
                ? <Sun  size={15} className="text-text-muted" />
                : <Moon size={15} className="text-text-muted" />
              }
            </motion.div>
          </AnimatePresence>
        </motion.button>

        {/* Bell */}
        <button className="relative p-1.5 rounded-lg hover:bg-bg-subtle transition-colors">
          <Bell size={15} className="text-text-muted" />
          <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-accent-red rounded-full border-2 border-bg-surface" />
        </button>
      </div>
    </header>
  );
}
