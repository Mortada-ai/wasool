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
        backgroundColor: isDark ? '#181818' : '#ffffff',
        border: `1px solid ${isDark ? '#2a2a2a' : '#e8e8e8'}`,
        borderRadius: 4,
        fontSize: 11,
        fontFamily: 'DM Mono',
        color: isDark ? '#f7f7f7' : '#0d0d0d',
      },
      cursor: { fill: isDark ? 'rgba(46,46,46,0.5)' : 'rgba(232,232,232,0.5)' },
    },
    grid:        isDark ? '#2a2a2a' : '#e8e8e8',
    tick:        isDark ? '#767676' : '#767676',
    barInactive: isDark ? '#2a2a2a' : '#e8e8e8',
  };
}

/** Returns theme-aware hex color strings for SVG attributes + inline styles */
export function useSvgColors() {
  const { isDark } = useTheme();
  return {
    bgBase:       isDark ? '#0d0d0d'  : '#f7f7f7',
    bgSurface:    isDark ? '#181818'  : '#ffffff',
    border:       isDark ? '#2a2a2a'  : '#e8e8e8',
    borderSubtle: isDark ? '#222222'  : '#fef5f6',
    textMuted:    isDark ? '#767676'  : '#767676',
    textFaint:    isDark ? '#3a3a3a'  : '#d4d4d4',
    roadMajor:    isDark ? '#2a2a2a'  : '#d4d4d4',
    roadMinor:    isDark ? '#1e1e1e'  : '#e8e8e8',
    gridLine:     isDark ? 'rgba(42,42,42,0.4)' : 'rgba(232,232,232,0.6)',
    rowEven:      isDark ? 'rgba(13,13,13,0.5)'  : 'rgba(247,247,247,0.7)',
    rowOdd:       isDark ? 'rgba(24,24,24,0.3)'  : 'rgba(254,245,246,0.4)',
    nowLine:      isDark ? '#f59e0b'  : '#f59e0b',
    nowBadgeBg:   isDark ? '#f59e0b'  : '#f59e0b',
    nowBadgeText: isDark ? '#0d0d0d'  : '#ffffff',
  };
}
