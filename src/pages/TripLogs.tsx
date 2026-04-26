import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, ChevronDown, ChevronUp, User, MapPin,
  LayoutList, CalendarDays, Clock,
} from 'lucide-react';
import { trips, ambulances } from '../data/dummy';
import { Trip } from '../data/dummy';
import StatusPill from '../components/StatusPill';
import { useSvgColors } from '../context/ThemeContext';

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, y: -8 },
};

type FilterTab = 'all' | 'active' | 'completed' | 'emergency' | 'scheduled';
type ViewMode = 'table' | 'schedule';

// ── Time helpers ──────────────────────────────────────────────
function parseTimeToMins(t: string): number {
  const match = t.match(/(\d{1,2}):(\d{2})/);
  if (!match) return -1;
  return parseInt(match[1]) * 60 + parseInt(match[2]);
}

function minsToLabel(mins: number): string {
  const h = Math.floor(mins / 60) % 24;
  const m = mins % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

// ── Chart constants ───────────────────────────────────────────
const MINS_PX   = 2.4;     // px per minute
const ROW_H     = 58;      // px per ambulance row
const HEADER_H  = 44;      // time axis height
const BAR_H     = 26;      // trip bar height
const LABEL_W   = 88;      // left label column width
const TOTAL_MINS = 1440;   // 24 hours
const CHART_W   = TOTAL_MINS * MINS_PX;

const TYPE_CONFIG: Record<string, { fill: string; stroke: string; text: string; label: string }> = {
  emergency: { fill: 'rgba(239,68,68,0.12)', stroke: '#ef4444', text: '#ef4444', label: 'Emergency' },
  scheduled: { fill: 'rgba(14,165,233,0.12)', stroke: '#0ea5e9', text: '#0ea5e9', label: 'Scheduled' },
  transfer:  { fill: 'rgba(167,139,250,0.12)', stroke: '#a78bfa', text: '#a78bfa', label: 'Transfer' },
};

// ── Schedule Gantt view ───────────────────────────────────────
interface TooltipState {
  trip: Trip;
  clientX: number;
  clientY: number;
}

function ScheduleView() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const c = useSvgColors();
  const [nowMins, setNowMins] = useState(() => {
    const n = new Date();
    return n.getHours() * 60 + n.getMinutes();
  });

  // Keep clock ticking
  useEffect(() => {
    const id = setInterval(() => {
      const n = new Date();
      setNowMins(n.getHours() * 60 + n.getMinutes());
    }, 60000);
    return () => clearInterval(id);
  }, []);

  // Scroll to 06:30 (start of today's activity) on mount
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = Math.max(0, (390 - 30) * MINS_PX);
    }
  }, []);

  const nowX     = nowMins * MINS_PX;
  const totalH   = HEADER_H + ambulances.length * ROW_H;

  // Hour tick marks
  const hours = Array.from({ length: 25 }, (_, h) => h);

  // Build trip bars with computed positions
  const tripBars = trips
    .map((trip) => {
      const startMins = parseTimeToMins(trip.startTime);
      if (startMins < 0) return null;
      const rawEnd = trip.status === 'active' ? nowMins : parseTimeToMins(trip.endTime);
      const endMins = rawEnd >= 0 && rawEnd >= startMins ? rawEnd : startMins + trip.duration;
      const durMins = Math.max(endMins - startMins, trip.duration, 4);
      const rowIdx = ambulances.findIndex((a) => a.id === trip.ambulanceId);
      if (rowIdx < 0) return null;
      return { trip, startMins, endMins: startMins + durMins, rowIdx };
    })
    .filter(Boolean) as { trip: Trip; startMins: number; endMins: number; rowIdx: number }[];

  return (
    <div className="bg-bg-surface border border-border rounded-xl overflow-hidden">
      <div className="flex select-none" style={{ height: totalH }}>

        {/* ── Sticky label column ── */}
        <div
          className="flex-shrink-0 bg-bg-surface border-r border-border z-10"
          style={{ width: LABEL_W }}
        >
          {/* Corner cell */}
          <div
            className="flex items-end justify-center pb-2.5 border-b border-border"
            style={{ height: HEADER_H }}
          >
            <span className="text-xs text-text-muted font-sans">Unit</span>
          </div>

          {/* Ambulance labels */}
          {ambulances.map((amb, i) => {
            const dotColor =
              amb.status === 'available'   ? '#00c896'
              : amb.status === 'on_duty'   ? '#0ea5e9'
              : '#64748b';
            const dayTrips = tripBars.filter((b) => b.rowIdx === i).length;
            return (
              <div
                key={amb.id}
                style={{
                  height: ROW_H,
                  borderBottom: i < ambulances.length - 1 ? `1px solid ${c.border}` : 'none',
                }}
                className="flex flex-col items-center justify-center gap-1 px-2"
              >
                <div className="flex items-center gap-1.5">
                  <span
                    className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${amb.status === 'on_duty' ? 'animate-live-pulse' : ''}`}
                    style={{ backgroundColor: dotColor }}
                  />
                  <span className="font-mono text-xs font-medium text-text-primary">{amb.id}</span>
                </div>
                <span className="text-center text-text-muted/60 truncate w-full px-1" style={{ fontSize: 9 }}>
                  {amb.driver === 'Unassigned' ? '—' : amb.driver.split(' ')[0]}
                </span>
                <span className="font-mono text-text-muted/40" style={{ fontSize: 8 }}>
                  {dayTrips} trip{dayTrips !== 1 ? 's' : ''}
                </span>
              </div>
            );
          })}
        </div>

        {/* ── Scrollable chart area ── */}
        <div ref={scrollRef} className="flex-1 overflow-x-auto relative">
          <svg
            width={CHART_W}
            height={totalH}
            style={{ display: 'block' }}
            onMouseLeave={() => setTooltip(null)}
          >
            {/* Alternating row backgrounds */}
            {ambulances.map((_, i) => (
              <rect
                key={i}
                x={0} y={HEADER_H + i * ROW_H}
                width={CHART_W} height={ROW_H}
                fill={i % 2 === 0 ? c.rowEven : c.rowOdd}
              />
            ))}

            {/* Hovered row highlight */}
            {hoveredId && (() => {
              const b = tripBars.find(b => b.trip.id === hoveredId);
              if (!b) return null;
              return (
                <rect
                  x={0} y={HEADER_H + b.rowIdx * ROW_H}
                  width={CHART_W} height={ROW_H}
                  fill="rgba(14,165,233,0.04)"
                />
              );
            })()}

            {/* Hour grid lines */}
            {hours.map((h) => {
              const x    = h * 60 * MINS_PX;
              const main = h % 6 === 0;
              const mid  = h % 2 === 0;
              return (
                <g key={h}>
                  <line
                    x1={x} y1={HEADER_H} x2={x} y2={totalH}
                    stroke={main ? c.border : mid ? c.roadMinor : c.borderSubtle}
                    strokeWidth={main ? 1.5 : 0.75}
                  />
                  {/* Header label — show every 2h */}
                  {mid && (
                    <text
                      x={x + 5} y={HEADER_H - 6}
                      fill={main ? c.textMuted : c.textFaint}
                      fontSize={main ? 10 : 8.5}
                      fontFamily="DM Mono"
                      fontWeight={main ? '500' : '400'}
                    >
                      {String(h).padStart(2, '0')}:00
                    </text>
                  )}
                </g>
              );
            })}

            {/* Header border */}
            <line x1={0} y1={HEADER_H} x2={CHART_W} y2={HEADER_H} stroke={c.border} strokeWidth={1} />

            {/* Row separators */}
            {ambulances.map((_, i) => (
              <line
                key={i}
                x1={0} y1={HEADER_H + (i + 1) * ROW_H}
                x2={CHART_W} y2={HEADER_H + (i + 1) * ROW_H}
                stroke={c.border}
                strokeOpacity={0.5}
                strokeWidth={0.75}
              />
            ))}

            {/* ── Trip bars ── */}
            {tripBars.map(({ trip, startMins, endMins, rowIdx }) => {
              const cfg     = TYPE_CONFIG[trip.type] ?? TYPE_CONFIG.scheduled;
              const isActive = trip.status === 'active';
              const isHover  = hoveredId === trip.id;
              const barX    = startMins * MINS_PX;
              const barW    = Math.max((endMins - startMins) * MINS_PX, 18);
              const barY    = HEADER_H + rowIdx * ROW_H + (ROW_H - BAR_H) / 2;

              return (
                <g
                  key={trip.id}
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={(e) => {
                    setHoveredId(trip.id);
                    setTooltip({ trip, clientX: e.clientX, clientY: e.clientY });
                  }}
                  onMouseMove={(e) => {
                    setTooltip((prev) => prev ? { ...prev, clientX: e.clientX, clientY: e.clientY } : null);
                  }}
                  onMouseLeave={() => {
                    setHoveredId(null);
                    setTooltip(null);
                  }}
                >
                  {/* Bar shadow/glow */}
                  {isHover && (
                    <rect
                      x={barX - 1} y={barY - 1}
                      width={barW + 2} height={BAR_H + 2}
                      rx={5}
                      fill="none"
                      stroke={cfg.stroke}
                      strokeWidth={1.5}
                      strokeOpacity={0.4}
                    />
                  )}

                  {/* Main bar */}
                  <rect
                    x={barX} y={barY}
                    width={barW} height={BAR_H}
                    rx={4}
                    fill={cfg.fill}
                    fillOpacity={isHover ? 2.2 : 1}
                    stroke={cfg.stroke}
                    strokeWidth={isActive ? 1.5 : 1}
                    strokeOpacity={isActive ? 0.9 : isHover ? 0.8 : 0.5}
                  />

                  {/* Left type accent strip */}
                  <rect
                    x={barX} y={barY}
                    width={3} height={BAR_H}
                    rx={2}
                    fill={cfg.stroke}
                    opacity={0.7}
                  />

                  {/* Trip ID label (if bar wide enough) */}
                  {barW > 44 && (
                    <text
                      x={barX + 8} y={barY + BAR_H / 2 + 1}
                      fill={cfg.text}
                      fontSize={8}
                      fontFamily="DM Mono"
                      fontWeight="500"
                      dominantBaseline="middle"
                      pointerEvents="none"
                      opacity={0.9}
                    >
                      {trip.id}
                    </text>
                  )}

                  {/* Driver name label (if bar very wide) */}
                  {barW > 110 && (
                    <text
                      x={barX + 8} y={barY + BAR_H / 2 + 10}
                      fill={cfg.text}
                      fontSize={7}
                      fontFamily="Sora, sans-serif"
                      dominantBaseline="middle"
                      pointerEvents="none"
                      opacity={0.5}
                    >
                      {trip.driver.split(' ')[0]}
                    </text>
                  )}

                  {/* Active indicator — pulsing dot at right edge */}
                  {isActive && (
                    <>
                      <circle
                        cx={barX + barW - 6} cy={barY + BAR_H / 2}
                        r={4}
                        fill={cfg.stroke}
                        opacity={0.25}
                      />
                      <circle
                        cx={barX + barW - 6} cy={barY + BAR_H / 2}
                        r={2.5}
                        fill={cfg.stroke}
                        opacity={0.9}
                      />
                    </>
                  )}
                </g>
              );
            })}

            {/* ── Current time line ── */}
            {nowMins > 0 && nowMins < TOTAL_MINS && (
              <g>
                {/* Dashed line */}
                <line
                  x1={nowX} y1={HEADER_H}
                  x2={nowX} y2={totalH}
                  stroke={c.nowLine}
                  strokeWidth={1.5}
                  strokeDasharray="5 3"
                  opacity={0.8}
                />
                {/* NOW badge */}
                <rect
                  x={nowX - 22} y={4}
                  width={44} height={18}
                  rx={4}
                  fill={c.nowBadgeBg}
                />
                <text
                  x={nowX} y={14}
                  fill={c.nowBadgeText}
                  fontSize={9}
                  fontFamily="DM Mono"
                  fontWeight="600"
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  {minsToLabel(nowMins)}
                </text>
              </g>
            )}
          </svg>
        </div>
      </div>

      {/* ── Legend ── */}
      <div className="px-4 py-3 border-t border-border flex items-center gap-5 flex-wrap">
        {Object.entries(TYPE_CONFIG).map(([, cfg]) => (
          <div key={cfg.label} className="flex items-center gap-1.5 text-xs text-text-muted">
            <span
              className="w-6 h-2.5 rounded-sm block"
              style={{ backgroundColor: cfg.stroke, opacity: 0.7 }}
            />
            {cfg.label}
          </div>
        ))}
        <div className="flex items-center gap-1.5 text-xs text-text-muted">
          <svg width="20" height="10" className="flex-shrink-0">
            <line x1="0" y1="5" x2="20" y2="5" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4 3" />
          </svg>
          Current time
        </div>
        <div className="flex items-center gap-1.5 text-xs text-text-muted ml-auto">
          <span className="w-2 h-2 rounded-full bg-accent-blue" />
          Active trip (pulsing dot at end)
        </div>
      </div>

      {/* ── Floating tooltip (fixed position) ── */}
      <AnimatePresence>
        {tooltip && (
          <motion.div
            key="tooltip"
            initial={{ opacity: 0, scale: 0.94, y: 4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94 }}
            transition={{ duration: 0.1 }}
            className="fixed z-[60] pointer-events-none"
            style={{
              left: Math.min(tooltip.clientX + 16, window.innerWidth - 256),
              top: tooltip.clientY - 20,
            }}
          >
            <div className="bg-bg-surface border border-border rounded-xl shadow-2xl p-3.5 w-56">
              <div className="flex items-center justify-between mb-2.5">
                <span className="font-mono text-xs font-medium text-accent-blue">{tooltip.trip.id}</span>
                <StatusPill status={tooltip.trip.type} />
              </div>
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center gap-1.5 text-text-primary font-medium">
                  <User size={9} className="text-text-muted flex-shrink-0" />
                  {tooltip.trip.patientName}
                </div>
                <div className="flex items-center gap-1.5 text-text-muted">
                  <MapPin size={9} className="text-accent-red flex-shrink-0" />
                  <span className="truncate">{tooltip.trip.origin}</span>
                </div>
                <div className="flex items-center gap-1.5 text-text-muted">
                  <MapPin size={9} className="text-accent-green flex-shrink-0" />
                  <span className="truncate">{tooltip.trip.destination}</span>
                </div>
                <div className="flex items-center gap-1.5 text-text-muted">
                  <Clock size={9} className="flex-shrink-0" />
                  <span className="font-mono">
                    {tooltip.trip.startTime}
                    {tooltip.trip.endTime
                      ? ` → ${tooltip.trip.endTime}`
                      : tooltip.trip.status === 'active' ? ' → Live' : ''}
                  </span>
                </div>
                <div className="pt-1.5 mt-1 border-t border-border flex items-center justify-between">
                  <span className="text-text-muted">{tooltip.trip.ambulanceId} · {tooltip.trip.driver.split(' ')[0]}</span>
                  <StatusPill status={tooltip.trip.status} />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Main TripLogs page ────────────────────────────────────────
export default function TripLogs() {
  const [tab, setTab]       = useState<FilterTab>('all');
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [view, setView]     = useState<ViewMode>('table');

  const filtered = trips.filter((t) => {
    if (tab === 'active')    return t.status === 'active';
    if (tab === 'completed') return t.status === 'completed';
    if (tab === 'emergency') return t.type === 'emergency';
    if (tab === 'scheduled') return t.type === 'scheduled';
    return true;
  }).filter((t) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      t.id.toLowerCase().includes(q) ||
      t.driver.toLowerCase().includes(q) ||
      t.origin.toLowerCase().includes(q) ||
      t.destination.toLowerCase().includes(q) ||
      t.patientName.toLowerCase().includes(q)
    );
  });

  const tabs: { key: FilterTab; label: string }[] = [
    { key: 'all',       label: 'All' },
    { key: 'active',    label: 'Active' },
    { key: 'completed', label: 'Completed' },
    { key: 'emergency', label: 'Emergency' },
    { key: 'scheduled', label: 'Scheduled' },
  ];

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">

      {/* ── Toolbar ── */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5 items-start sm:items-center">

        {/* View toggle */}
        <div className="flex p-0.5 bg-bg-surface border border-border rounded-lg">
          {([
            { key: 'table' as ViewMode,    icon: LayoutList,   label: 'Table' },
            { key: 'schedule' as ViewMode, icon: CalendarDays, label: 'Schedule' },
          ]).map(({ key, icon: Icon, label }) => (
            <button
              key={key}
              onClick={() => setView(key)}
              className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                view === key
                  ? 'text-text-primary'
                  : 'text-text-muted hover:text-text-primary'
              }`}
            >
              {view === key && (
                <motion.div
                  layoutId="view-bg"
                  className="absolute inset-0 rounded-md bg-bg-subtle border border-border"
                  transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                />
              )}
              <Icon size={12} className="relative" />
              <span className="relative">{label}</span>
            </button>
          ))}
        </div>

        {/* Filter tabs — hide in schedule view */}
        {view === 'table' && (
          <div className="flex gap-1.5 flex-wrap">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  tab === t.key
                    ? 'bg-accent-blue/10 text-accent-blue border border-accent-blue/30'
                    : 'text-text-muted border border-border hover:text-text-primary'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        )}

        {/* Search — only in table view */}
        {view === 'table' && (
          <div className="relative sm:ml-auto">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              placeholder="Search trips..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-1.5 bg-bg-surface border border-border rounded-lg text-xs text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-blue/40 w-full sm:w-56 font-sans"
            />
          </div>
        )}

        {/* Schedule hint */}
        {view === 'schedule' && (
          <span className="sm:ml-auto text-xs text-text-muted">
            Scroll horizontally · Hover bars for details
          </span>
        )}
      </div>

      {/* ── Schedule view ── */}
      <AnimatePresence mode="wait">
        {view === 'schedule' && (
          <motion.div
            key="schedule"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
          >
            <ScheduleView />
            <div className="mt-3 text-xs text-text-muted">
              {trips.filter(t => parseTimeToMins(t.startTime) >= 0).length} trips displayed · Scroll left for earlier hours
            </div>
          </motion.div>
        )}

        {/* ── Table view ── */}
        {view === 'table' && (
          <motion.div
            key="table"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
          >
            <div className="bg-bg-surface border border-border rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-border">
                      {['Trip ID', 'Ambulance', 'Driver', 'Route', 'Type', 'Duration', 'Status', 'Time'].map((h) => (
                        <th key={h} className="text-left px-4 py-3 text-text-muted font-sans font-medium whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((trip, i) => (
                      <>
                        <motion.tr
                          key={trip.id}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.03 }}
                          onClick={() => setExpanded(expanded === trip.id ? null : trip.id)}
                          className={`border-b border-border/50 hover:bg-bg-subtle transition-colors cursor-pointer group ${
                            trip.status === 'active' ? 'bg-accent-blue/3' : ''
                          }`}
                        >
                          <td className="px-4 py-3 font-mono text-accent-blue whitespace-nowrap">{trip.id}</td>
                          <td className="px-4 py-3 font-mono text-text-muted">{trip.ambulanceId}</td>
                          <td className="px-4 py-3 text-text-primary whitespace-nowrap">
                            {trip.driver.split(' ')[0]} {trip.driver.split(' ').slice(-1)[0]}
                          </td>
                          <td className="px-4 py-3 max-w-[200px]">
                            <div className="text-text-muted truncate">{trip.origin}</div>
                            <div className="text-text-muted/50 truncate">→ {trip.destination}</div>
                          </td>
                          <td className="px-4 py-3"><StatusPill status={trip.type} /></td>
                          <td className="px-4 py-3 font-mono text-text-muted">
                            {trip.status === 'active'
                              ? <span className="text-accent-blue font-medium">Live</span>
                              : `${trip.duration}m`}
                          </td>
                          <td className="px-4 py-3"><StatusPill status={trip.status} /></td>
                          <td className="px-4 py-3 font-mono text-text-muted whitespace-nowrap">
                            <div className="flex items-center gap-1">
                              {trip.startTime}
                              <span className="ml-1 text-text-muted/30 group-hover:text-text-muted transition-colors">
                                {expanded === trip.id ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                              </span>
                            </div>
                          </td>
                        </motion.tr>

                        <AnimatePresence>
                          {expanded === trip.id && (
                            <motion.tr
                              key={`${trip.id}-exp`}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                            >
                              <td colSpan={8} className="px-4 pb-0 pt-0 border-b border-border bg-bg-base/50">
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="overflow-hidden"
                                >
                                  <div className="py-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
                                    <div className="p-3 bg-bg-surface rounded-lg border border-border">
                                      <div className="text-xs text-text-muted flex items-center gap-1 mb-1.5"><User size={10} /> Patient</div>
                                      <div className="text-sm text-text-primary font-medium">{trip.patientName}</div>
                                    </div>
                                    <div className="p-3 bg-bg-surface rounded-lg border border-border">
                                      <div className="text-xs text-text-muted flex items-center gap-1 mb-1.5"><MapPin size={10} className="text-accent-red" /> Pickup</div>
                                      <div className="text-sm text-text-primary">{trip.origin}</div>
                                    </div>
                                    <div className="p-3 bg-bg-surface rounded-lg border border-border">
                                      <div className="text-xs text-text-muted flex items-center gap-1 mb-1.5"><MapPin size={10} className="text-accent-green" /> Destination</div>
                                      <div className="text-sm text-text-primary">{trip.destination}</div>
                                    </div>
                                    <div className="p-3 bg-bg-surface rounded-lg border border-border">
                                      <div className="text-xs text-text-muted mb-1.5">Crew</div>
                                      <div className="text-sm text-text-primary">{trip.driver}</div>
                                      <div className="flex items-center justify-between mt-1">
                                        <span className="text-xs text-text-muted font-mono">{trip.ambulanceId}</span>
                                        <StatusPill status={trip.status} />
                                      </div>
                                    </div>
                                  </div>
                                </motion.div>
                              </td>
                            </motion.tr>
                          )}
                        </AnimatePresence>
                      </>
                    ))}
                  </tbody>
                </table>
              </div>

              {filtered.length === 0 && (
                <div className="py-16 text-center text-text-muted text-sm">No trips match your filter.</div>
              )}
            </div>

            <div className="mt-3 text-xs text-text-muted">{filtered.length} trips shown</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
