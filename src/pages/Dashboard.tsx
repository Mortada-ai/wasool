import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Truck, CheckCircle, Clock, AlertTriangle, TrendingUp, ChevronRight, Activity,
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ambulances, trips, crew, alerts, kpis } from '../data/dummy';
import { useChartTheme } from '../context/ThemeContext';
import KPICard from '../components/KPICard';
import AlertBadge from '../components/AlertBadge';
import StatusPill from '../components/StatusPill';
import FleetMap from '../components/FleetMap';

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2 } },
};

const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const chartData = kpis.weeklyTrips.map((v, i) => ({ day: weekDays[i], trips: v }));

function LiveDuration({ startTime }: { startTime: string }) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const [h, m] = startTime.split(':').map(Number);
    if (isNaN(h) || isNaN(m)) return;
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m, 0);
    const init = Math.max(0, Math.floor((now.getTime() - start.getTime()) / 1000));
    setElapsed(init);
    const id = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(id);
  }, [startTime]);

  const mins = Math.floor(elapsed / 60);
  const secs = elapsed % 60;
  return (
    <span className="font-mono text-accent-blue tabular-nums">
      {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
    </span>
  );
}

const statusStyle = {
  available: { bg: 'bg-accent-green/10', border: 'border-accent-green/25', dot: 'bg-accent-green', text: 'text-accent-green', pulse: true },
  on_duty: { bg: 'bg-accent-blue/10', border: 'border-accent-blue/25', dot: 'bg-accent-blue', text: 'text-accent-blue', pulse: true },
  maintenance: { bg: 'bg-text-muted/5', border: 'border-border', dot: 'bg-text-muted', text: 'text-text-muted', pulse: false },
};

export default function Dashboard() {
  const chart = useChartTheme();
  const recentTrips = trips.slice(0, 7);
  const onDutyCrew = crew.filter((c) => c.status === 'on_duty');
  const activeTrips = trips.filter((t) => t.status === 'active');
  const ambTripMap = new Map(activeTrips.map((t) => [t.ambulanceId, t]));

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="space-y-5">

      {/* ── KPI Strip ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard label="Available" value={kpis.available} sub="3 of 6 units ready" icon={<Truck size={16} />} accent="green" index={0} />
        <KPICard label="On Duty" value={kpis.onDuty} sub="2 active dispatches" icon={<CheckCircle size={16} />} accent="blue" index={1} />
        <KPICard label="Avg Response" value={`${kpis.avgResponseTime}m`} sub="↓ 0.8m vs last week" icon={<Clock size={16} />} accent="amber" index={2} />
        <KPICard label="Open Alerts" value={kpis.openAlerts} sub="2 critical · 1 warning" icon={<AlertTriangle size={16} />} accent="red" index={3} />
      </div>

      {/* ── Fleet Status Bar ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.28 }}
        className="bg-bg-surface border border-border rounded-xl p-4"
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-text-muted uppercase tracking-widest flex items-center gap-2">
            <Activity size={12} className="text-accent-green" />
            Fleet Status — All Units
          </span>
          <span className="font-mono text-xs text-text-muted">
            {new Date().toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' })}
          </span>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {ambulances.map((amb, i) => {
            const activeTrip = ambTripMap.get(amb.id);
            const s = statusStyle[amb.status];
            return (
              <motion.div
                key={amb.id}
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + i * 0.05 }}
                className={`rounded-xl border p-3 relative overflow-hidden ${s.bg} ${s.border}`}
              >
                <div className="flex items-center gap-1.5 mb-2">
                  <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${s.dot} ${s.pulse ? 'animate-live-pulse' : ''}`} />
                  <span className={`font-mono text-xs font-medium ${s.text}`}>{amb.id}</span>
                </div>
                <div className="text-xs text-text-muted leading-tight truncate">
                  {amb.driver === 'Unassigned'
                    ? <span className="italic opacity-60">No driver</span>
                    : amb.driver.split(' ')[0]}
                </div>
                {activeTrip
                  ? <div className="text-xs text-accent-blue mt-1 truncate">{activeTrip.destination.split(' ').slice(0, 2).join(' ')}</div>
                  : <div className={`text-xs mt-1 truncate ${s.text} opacity-70`}>{amb.status === 'maintenance' ? 'Garage' : amb.location.split(',')[0]}</div>
                }
                {amb.oxygenLevel > 0 && (
                  <div className="mt-2 h-0.5 bg-black/20 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${amb.oxygenLevel}%` }}
                      transition={{ duration: 0.9, delay: 0.4 + i * 0.05 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: amb.oxygenLevel > 50 ? '#00c896' : amb.oxygenLevel > 20 ? '#f59e0b' : '#ef4444' }}
                    />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* ── Main content grid: Map + Trips (left) / Sidebar (right) ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

        {/* Map */}
        <div className="xl:col-span-2 bg-bg-surface border border-border rounded-xl overflow-hidden self-start">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <div className="flex items-center gap-2.5">
              <span className="text-sm font-semibold">Fleet Map — Dammam</span>
              <span className="flex items-center gap-1 text-xs text-accent-green font-sans">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-green animate-live-pulse" />
                Live
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-text-muted">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-accent-green inline-block" />
                {kpis.available} avail
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-accent-blue inline-block" />
                {kpis.onDuty} active
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-text-muted inline-block" />
                1 maint
              </span>
            </div>
          </div>
          <FleetMap ambulances={ambulances} height={320} />
        </div>

        {/* Right sidebar — spans both map row and trips row */}
        <div className="flex flex-col gap-4 xl:row-span-2">

          {/* Alerts */}
          <div className="bg-bg-surface border border-border rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <span className="text-sm font-semibold">Active Alerts</span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-accent-red/10 text-accent-red border border-accent-red/20">
                  {alerts.filter((a) => a.type === 'danger').length} critical
                </span>
              </div>
            </div>
            <div className="p-3 space-y-2">
              {alerts.slice(0, 3).map((alert, i) => (
                <AlertBadge key={alert.id} alert={alert} index={i} />
              ))}
              {alerts.length > 3 && (
                <div className="text-xs text-text-muted text-center pt-1">
                  +{alerts.length - 3} more alerts
                </div>
              )}
            </div>
          </div>

          {/* On-Duty Crew */}
          <div className="bg-bg-surface border border-border rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <span className="text-sm font-semibold">On-Duty Crew</span>
              <span className="text-xs text-text-muted">{onDutyCrew.length} on shift</span>
            </div>
            <div className="p-3 space-y-1">
              {onDutyCrew.map((member, i) => {
                const activeTrip = ambTripMap.get(member.assignedAmbulance);
                return (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.35 + i * 0.07 }}
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-bg-subtle transition-colors cursor-default"
                  >
                    <div className="relative flex-shrink-0">
                      <div className="w-8 h-8 rounded-full bg-accent-blue/12 border border-accent-blue/25 flex items-center justify-center font-mono text-xs font-medium text-accent-blue">
                        {member.name.charAt(0)}
                      </div>
                      {activeTrip && (
                        <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-accent-blue border-2 border-bg-surface animate-live-pulse" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-text-primary truncate">{member.name}</div>
                      <div className="text-xs text-text-muted flex items-center gap-1 mt-0.5 truncate">
                        <span>{member.role}</span>
                        {activeTrip && (
                          <>
                            <span className="text-border">·</span>
                            <span className="text-accent-blue truncate">{activeTrip.destination}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <span className="font-mono text-xs text-text-muted/50 flex-shrink-0">{member.assignedAmbulance}</span>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Weekly Summary */}
          <div className="bg-bg-surface border border-border rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-border flex items-center justify-between">
              <span className="text-sm font-semibold">Weekly Trips</span>
              <span className="flex items-center gap-1 text-xs font-mono text-accent-green">
                <TrendingUp size={11} />
                +20.7%
              </span>
            </div>
            <div className="p-4">
              <div className="h-36">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 4, right: 0, left: -20, bottom: 0 }}>
                    <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 9, fontFamily: 'DM Mono' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#64748b', fontSize: 9, fontFamily: 'DM Mono' }} axisLine={false} tickLine={false} />
                    <Tooltip {...chart.tooltip} />
                    <Bar dataKey="trips" radius={[4, 4, 0, 0]}>
                      {chartData.map((_, i) => (
                        <Cell key={i} fill={i === chartData.length - 1 ? 'rgb(var(--accent-green))' : chart.barInactive} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2.5">
                {[
                  { label: 'Trips Today', value: kpis.tripsToday },
                  { label: 'Avg Duration', value: `${kpis.avgDuration}m` },
                  { label: 'Utilization', value: `${kpis.utilization}%` },
                  { label: 'Incidents', value: kpis.incidents },
                ].map((stat) => (
                  <div key={stat.label} className="p-2.5 bg-bg-base rounded-lg border border-border">
                    <div className="text-xs text-text-muted mb-1">{stat.label}</div>
                    <div className="font-mono text-sm font-medium text-text-primary">{stat.value}</div>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-border space-y-2">
                <div className="text-xs text-text-muted mb-2">Today by type</div>
                {[
                  { label: 'Emergency', count: trips.filter(t => t.type === 'emergency').length, color: '#ef4444', pct: 40 },
                  { label: 'Scheduled', count: trips.filter(t => t.type === 'scheduled').length, color: '#0ea5e9', pct: 35 },
                  { label: 'Transfer',  count: trips.filter(t => t.type === 'transfer').length,  color: '#a78bfa', pct: 25 },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2">
                    <span className="text-xs text-text-muted w-16">{item.label}</span>
                    <div className="flex-1 h-1.5 bg-bg-base rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${item.pct}%` }}
                        transition={{ duration: 0.9, delay: 0.5 }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                    </div>
                    <span className="font-mono text-xs text-text-muted w-4 text-right">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Trips — fills below the map */}
        <div className="xl:col-span-2 bg-bg-surface border border-border rounded-xl overflow-hidden self-start">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold">Recent Trips</span>
              {activeTrips.length > 0 && (
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent-blue/10 border border-accent-blue/20 text-xs text-accent-blue font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-blue animate-live-pulse" />
                  {activeTrips.length} live
                </span>
              )}
            </div>
            <span className="font-mono text-xs text-text-muted">{kpis.tripsToday} trips today</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border">
                  {['ID', 'Unit', 'Driver', 'Route', 'Type', 'Duration', 'Status'].map((h) => (
                    <th key={h} className="text-left px-4 py-2.5 text-text-muted font-sans font-medium whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentTrips.map((trip, i) => (
                  <motion.tr
                    key={trip.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.35 + i * 0.04 }}
                    className={`border-b border-border/40 hover:bg-bg-subtle transition-colors ${
                      trip.status === 'active' ? 'bg-accent-blue/3' : ''
                    }`}
                  >
                    <td className="px-4 py-3 font-mono text-accent-blue whitespace-nowrap">{trip.id}</td>
                    <td className="px-4 py-3 font-mono text-text-muted">{trip.ambulanceId}</td>
                    <td className="px-4 py-3 text-text-primary whitespace-nowrap">{trip.driver.split(' ')[0]}</td>
                    <td className="px-4 py-3 max-w-[200px]">
                      <div className="text-text-muted truncate">{trip.origin}</div>
                      <div className="flex items-center gap-0.5 text-text-muted/50 truncate">
                        <ChevronRight size={9} className="flex-shrink-0" />
                        <span className="truncate">{trip.destination}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3"><StatusPill status={trip.type} /></td>
                    <td className="px-4 py-3">
                      {trip.status === 'active'
                        ? <LiveDuration startTime={trip.startTime} />
                        : <span className="font-mono text-text-muted">{trip.duration}m</span>}
                    </td>
                    <td className="px-4 py-3"><StatusPill status={trip.status} /></td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
