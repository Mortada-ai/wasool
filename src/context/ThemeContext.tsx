import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export type Theme = 'dark' | 'light';

interface ThemeCtx {
  theme: Theme;
  isDark: boolean;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeCtx>({ theme: 'dark', isDark: true, toggle: () => {} });

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('wasool-theme') as Theme | null;
    return saved ?? 'dark';
  });

  // Keep <html> class and localStorage in sync with state
  useEffect(() => {
    const html = document.documentElement;
    if (theme === 'dark') {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
    localStorage.setItem('wasool-theme', theme);
  }, [theme]);

  function toggle() {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }

  return (
    <ThemeContext.Provider value={{ theme, isDark: theme === 'dark', toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

/** Returns Recharts-compatible tooltip + cursor styles for current theme */
export function useChartTheme() {
  const { isDark } = useTheme();
  return {
    tooltip: {
      contentStyle: {
        backgroundColor: isDark ? '#111827' : '#ffffff',
        border: `1px solid ${isDark ? '#1e2d45' : '#e2e8f0'}`,
        borderRadius: 8,
        fontSize: 11,
        fontFamily: 'DM Mono',
        color: isDark ? '#e2e8f0' : '#0f172a',
      },
      cursor: { fill: isDark ? 'rgba(30,45,69,0.4)' : 'rgba(226,232,240,0.5)' },
    },
    grid:      isDark ? '#1e2d45' : '#e2e8f0',
    tick:      isDark ? '#64748b' : '#94a3b8',
    barInactive: isDark ? '#1e2d45' : '#e2e8f0',
  };
}

/** Returns theme-aware hex color strings for SVG attributes + inline styles */
export function useSvgColors() {
  const { isDark } = useTheme();
  return {
    bgBase:      isDark ? '#0a0f1a'  : '#f1f5f9',
    bgSurface:   isDark ? '#111827'  : '#ffffff',
    border:      isDark ? '#1e2d45'  : '#e2e8f0',
    borderSubtle:isDark ? '#172032'  : '#f1f5f9',
    textMuted:   isDark ? '#64748b'  : '#94a3b8',
    textFaint:   isDark ? '#2a3f5f'  : '#cbd5e1',
    roadMajor:   isDark ? '#1e2d45'  : '#cbd5e1',
    roadMinor:   isDark ? '#172032'  : '#e2e8f0',
    gridLine:    isDark ? 'rgba(30,45,69,0.3)' : 'rgba(203,213,225,0.5)',
    rowEven:     isDark ? 'rgba(10,15,26,0.5)' : 'rgba(241,245,249,0.7)',
    rowOdd:      isDark ? 'rgba(17,24,39,0.3)' : 'rgba(248,250,252,0.4)',
    nowLine:     isDark ? '#f59e0b'  : '#d97706',
    nowBadgeBg:  isDark ? '#f59e0b'  : '#d97706',
    nowBadgeText:isDark ? '#0a0f1a'  : '#ffffff',
  };
}
