import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, X, MapPin, Clock, User, Truck, ChevronRight,
  AlertTriangle, Fuel, Navigation, Activity, Zap, XCircle,
} from 'lucide-react';
import { ambulances, trips, maintenance } from '../data/dummy';
import { Ambulance } from '../data/dummy';
import FleetMap from '../components/FleetMap';
import StatusPill from '../components/StatusPill';

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2 } },
};

function ElapsedTimer({ startTime }: { startTime: string }) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const [h, m] = startTime.split(':').map(Number);
    if (isNaN(h) || isNaN(m)) { setElapsed(0); return; }
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m, 0);
    const init = Math.max(0, Math.floor((now.getTime() - start.getTime()) / 1000));
    setElapsed(init);
    const id = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(id);
  }, [startTime]);

  const mins = Math.floor(elapsed / 60);
  const secs = elapsed % 60;
  const isLong = mins > 25;

  return (
    <span className={`font-mono tabular-nums text-sm font-medium ${isLong ? 'text-accent-amber' : 'text-accent-blue'}`}>
      {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
    </span>
  );
}

function OxygenMini({ level }: { level: number }) {
  const color = level > 50 ? '#00c896' : level > 20 ? '#f59e0b' : '#ef4444';
  const danger = level < 30;
  return (
    <div className="flex items-center gap-2">
      <span className={`text-xs font-mono ${danger ? 'text-accent-red' : 'text-text-muted'}`}>O₂ {level}%</span>
      <div className="w-16 h-1 bg-bg-base rounded-full overflow-hidden border border-border">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${level}%` }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>
      {danger && <AlertTriangle size={11} className="text-accent-red flex-shrink-0" />}
    </div>
  );
}

function UnitDetailPanel({ amb, onClose }: { amb: Ambulance; onClose: () => void }) {
  const ambTrips = trips.filter((t) => t.ambulanceId === amb.id).slice(0, 3);
  const ambMaint = maintenance.filter((m) => m.ambulanceId === amb.id);
  const statusColor = { available: 'accent-green', on_duty: 'accent-blue', maintenance: 'text-muted' };

  return (
    <motion.div
      initial={{ opacity: 0, y: -8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className="bg-bg-base border border-border rounded-xl overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
            amb.status === 'available' ? 'bg-accent-green/10' :
            amb.status === 'on_duty' ? 'bg-accent-blue/10' : 'bg-text-muted/10'
          }`}>
            <Truck size={14} className={
              amb.status === 'available' ? 'text-accent-green' :
              amb.status === 'on_duty' ? 'text-accent-blue' : 'text-text-muted'
            } />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-medium text-text-primary">{amb.id}</span>
              <span className="font-mono text-xs text-text-muted">{amb.plate}</span>
            </div>
            <div className="text-xs text-text-muted">{amb.model}</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <StatusPill status={amb.status} />
          <button onClick={onClose} className="p-1 rounded hover:bg-bg-subtle transition-colors">
            <X size={14} className="text-text-muted" />
          </button>
        </div>
      </div>

      <div className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Driver */}
        <div>
          <div className="text-xs text-text-muted flex items-center gap-1 mb-1.5"><User size={10} /> Driver</div>
          <div className="text-sm text-text-primary font-medium">{amb.driver}</div>
        </div>
        {/* Location */}
        <div>
          <div className="text-xs text-text-muted flex items-center gap-1 mb-1.5"><MapPin size={10} /> Location</div>
          <div className="text-sm text-text-primary">{amb.location}</div>
        </div>
        {/* Mileage */}
        <div>
          <div className="text-xs text-text-muted flex items-center gap-1 mb-1.5"><Fuel size={10} /> Mileage</div>
          <div className="font-mono text-sm text-text-primary">{amb.mileage.toLocaleString()} km</div>
        </div>
        {/* O2 */}
        <div>
          <div className="text-xs text-text-muted mb-1.5">Oxygen</div>
          <OxygenMini level={amb.oxygenLevel} />
        </div>
      </div>

      {/* Recent trips for this unit */}
      {ambTrips.length > 0 && (
        <div className="px-4 pb-4 border-t border-border pt-3">
          <div className="text-xs text-text-muted mb-2">Recent trips</div>
          <div className="flex gap-2 overflow-x-auto">
            {ambTrips.map((t) => (
              <div key={t.id} className="flex-shrink-0 px-3 py-2 rounded-lg bg-bg-surface border border-border text-xs">
                <div className="font-mono text-accent-blue">{t.id}</div>
                <div className="text-text-muted mt-0.5 truncate max-w-[120px]">{t.destination}</div>
                <StatusPill status={t.status} className="mt-1" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Maintenance warning */}
      {ambMaint.some((m) => m.status === 'overdue') && (
        <div className="mx-4 mb-4 flex items-center gap-2 px-3 py-2 bg-accent-red/8 border border-accent-red/20 rounded-lg">
          <XCircle size={12} className="text-accent-red flex-shrink-0" />
          <span className="text-xs text-accent-red">Overdue maintenance — {ambMaint.find(m => m.status === 'overdue')?.description}</span>
        </div>
      )}
      {ambMaint.some((m) => m.status === 'scheduled') && !ambMaint.some((m) => m.status === 'overdue') && (
        <div className="mx-4 mb-4 flex items-center gap-2 px-3 py-2 bg-accent-amber/8 border border-accent-amber/20 rounded-lg">
          <AlertTriangle size={12} className="text-accent-amber flex-shrink-0" />
          <span className="text-xs text-accent-amber">Scheduled: {ambMaint.find(m => m.status === 'scheduled')?.description}</span>
        </div>
      )}
    </motion.div>
  );
}

const PRIORITY_LABELS: Record<string, { label: string; color: string }> = {
  P1: { label: 'P1 — Life Threatening', color: 'text-accent-red border-accent-red/30 bg-accent-red/8' },
  P2: { label: 'P2 — Urgent', color: 'text-accent-amber border-accent-amber/30 bg-accent-amber/8' },
  P3: { label: 'P3 — Routine', color: 'text-accent-blue border-accent-blue/30 bg-accent-blue/8' },
};

export default function Dispatch() {
  const [showPanel, setShowPanel] = useState(false);
  const [selectedAmbId, setSelectedAmbId] = useState<string | null>(null);
  const [form, setForm] = useState({
    pickup: '', destination: '', ambulanceId: '', type: 'emergency', priority: 'P1', patient: '', notes: '',
  });
  const [confirmed, setConfirmed] = useState(false);

  const activeTrips = trips.filter((t) => t.status === 'active');
  const availableAmbs = ambulances.filter((a) => a.status === 'available');
  const maintenanceAmbs = ambulances.filter((a) => a.status === 'maintenance');
  const selectedAmb = ambulances.find((a) => a.id === selectedAmbId) ?? null;

  function handleConfirm() {
    setConfirmed(true);
    setTimeout(() => { setConfirmed(false); setShowPanel(false); setForm({ pickup: '', destination: '', ambulanceId: '', type: 'emergency', priority: 'P1', patient: '', notes: '' }); }, 2000);
  }

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="space-y-5">

      {/* ── Top Status Bar ── */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Active Units', value: activeTrips.length, sub: `${activeTrips.length} dispatches live`, color: 'text-accent-blue', bg: 'bg-accent-blue/8', border: 'border-accent-blue/20', icon: <Activity size={14} /> },
          { label: 'Available', value: availableAmbs.length, sub: 'Ready to dispatch', color: 'text-accent-green', bg: 'bg-accent-green/8', border: 'border-accent-green/20', icon: <Navigation size={14} /> },
          { label: 'In Maintenance', value: maintenanceAmbs.length, sub: 'Units grounded', color: 'text-text-muted', bg: 'bg-text-muted/5', border: 'border-border', icon: <Fuel size={14} /> },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className={`flex items-center gap-4 p-4 rounded-xl border ${stat.bg} ${stat.border}`}
          >
            <div className={`p-2 rounded-lg ${stat.bg} border ${stat.border}`}>
              <span className={stat.color}>{stat.icon}</span>
            </div>
            <div>
              <div className={`font-mono text-2xl font-medium ${stat.color}`}>{stat.value}</div>
              <div className="text-xs text-text-muted mt-0.5">{stat.sub}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-text-primary">Dispatch Control</h2>
          <p className="text-xs text-text-muted mt-0.5">Click a map pin to inspect a unit</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowPanel(true)}
          className="flex items-center gap-2 px-4 py-2 bg-accent-green text-bg-base text-sm font-semibold rounded-lg hover:bg-accent-green/90 transition-colors shadow-lg shadow-accent-green/20"
        >
          <Plus size={15} />
          New Dispatch
        </motion.button>
      </div>

      {/* ── Map + Active Trips ── */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">

        {/* Map column */}
        <div className="xl:col-span-3 space-y-3">
          <div className="bg-bg-surface border border-border rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-border flex items-center justify-between">
              <span className="text-sm font-semibold">Fleet Map</span>
              <span className="flex items-center gap-1.5 text-xs text-accent-green">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-green animate-live-pulse" />
                Real-time tracking
              </span>
            </div>
            <FleetMap
              ambulances={ambulances}
              height={380}
              onSelect={(id) => setSelectedAmbId(selectedAmbId === id ? null : id)}
              selectedId={selectedAmbId ?? undefined}
            />
          </div>

          {/* Unit detail panel — appears on pin click */}
          <AnimatePresence>
            {selectedAmb && (
              <UnitDetailPanel
                amb={selectedAmb}
                onClose={() => setSelectedAmbId(null)}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Active Trips Panel */}
        <div className="xl:col-span-2 space-y-3">
          <div className="bg-bg-surface border border-border rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold">Active Trips</span>
                <span className="flex items-center gap-1 text-xs font-mono px-2 py-0.5 rounded-full bg-accent-blue/10 text-accent-blue border border-accent-blue/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-blue animate-live-pulse" />
                  {activeTrips.length}
                </span>
              </div>
              <span className="text-xs text-text-muted">Elapsed</span>
            </div>
            <div className="p-3 space-y-3">
              {activeTrips.map((trip, i) => {
                const amb = ambulances.find((a) => a.id === trip.ambulanceId);
                const o2Low = amb && amb.oxygenLevel < 30;
                return (
                  <motion.div
                    key={trip.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.09 }}
                    onClick={() => setSelectedAmbId(trip.ambulanceId)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      selectedAmbId === trip.ambulanceId
                        ? 'border-accent-blue/50 bg-accent-blue/5 shadow-sm shadow-accent-blue/10'
                        : 'border-accent-blue/20 bg-bg-base hover:border-accent-blue/40'
                    }`}
                  >
                    {/* Top row */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-accent-blue">{trip.id}</span>
                        <StatusPill status={trip.type} />
                        {o2Low && (
                          <span className="flex items-center gap-0.5 text-xs text-accent-red font-medium">
                            <AlertTriangle size={10} /> O₂ LOW
                          </span>
                        )}
                      </div>
                      <ElapsedTimer startTime={trip.startTime} />
                    </div>

                    {/* Route */}
                    <div className="flex items-center gap-1.5 mb-2.5 text-xs">
                      <div className="flex flex-col items-center gap-0.5 flex-shrink-0">
                        <span className="w-2 h-2 rounded-full bg-accent-red border border-accent-red/50" />
                        <span className="w-px h-3 bg-border" />
                        <span className="w-2 h-2 rounded-full bg-accent-green border border-accent-green/50" />
                      </div>
                      <div className="flex flex-col gap-1 min-w-0">
                        <span className="text-text-muted truncate">{trip.origin}</span>
                        <span className="text-text-primary font-medium truncate">{trip.destination}</span>
                      </div>
                    </div>

                    {/* Meta */}
                    <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs text-text-muted border-t border-border/50 pt-2.5">
                      <div className="flex items-center gap-1.5">
                        <User size={10} className="flex-shrink-0" />
                        <span className="truncate">{trip.driver.split(' ')[0]}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Truck size={10} className="flex-shrink-0" />
                        <span className="font-mono">{trip.ambulanceId}</span>
                        {amb && <span className="text-text-muted/40 font-mono text-xs">{amb.plate}</span>}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Zap size={10} className="flex-shrink-0 text-accent-amber" />
                        <span>Patient: {trip.patientName}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock size={10} className="flex-shrink-0" />
                        <span>Started {trip.startTime}</span>
                      </div>
                    </div>

                    {/* O2 bar */}
                    {amb && amb.oxygenLevel > 0 && (
                      <div className="mt-2.5 pt-2.5 border-t border-border/50">
                        <OxygenMini level={amb.oxygenLevel} />
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ── Available Units ── */}
      <div className="bg-bg-surface border border-border rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <span className="text-sm font-semibold">Available Units</span>
          <span className="text-xs text-text-muted">{availableAmbs.length} ready for dispatch</span>
        </div>
        <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {availableAmbs.map((amb, i) => (
            <motion.div
              key={amb.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              onClick={() => setSelectedAmbId(selectedAmbId === amb.id ? null : amb.id)}
              className={`p-4 rounded-xl border card-hover cursor-pointer transition-all ${
                selectedAmbId === amb.id
                  ? 'border-accent-green/50 bg-accent-green/5 shadow-sm shadow-accent-green/10'
                  : 'border-accent-green/20 bg-bg-base hover:border-accent-green/40'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-accent-green/10 border border-accent-green/25 flex items-center justify-center">
                    <Truck size={15} className="text-accent-green" />
                  </div>
                  <div>
                    <div className="font-mono text-sm font-medium text-text-primary">{amb.id}</div>
                    <div className="text-xs text-text-muted font-mono">{amb.plate}</div>
                  </div>
                </div>
                <StatusPill status="available" />
              </div>

              <div className="space-y-1.5 text-xs text-text-muted mb-3">
                <div className="flex items-center gap-1.5">
                  <User size={10} />
                  <span className="text-text-primary">{amb.driver}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin size={10} />
                  <span className="truncate">{amb.location}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock size={10} />
                  <span>Last trip: {amb.lastTrip}</span>
                  <span className="ml-auto font-mono text-text-muted/60">{amb.model}</span>
                </div>
              </div>

              <OxygenMini level={amb.oxygenLevel} />
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Maintenance Units ── */}
      {maintenanceAmbs.length > 0 && (
        <div className="bg-bg-surface border border-border/60 rounded-xl overflow-hidden opacity-70">
          <div className="px-4 py-3 border-b border-border/60">
            <span className="text-sm font-medium text-text-muted">Unavailable — Maintenance</span>
          </div>
          <div className="p-4 flex gap-3">
            {maintenanceAmbs.map((amb) => (
              <div key={amb.id} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-bg-base border border-border text-xs">
                <Truck size={14} className="text-text-muted" />
                <div>
                  <div className="font-mono text-text-muted">{amb.id} · {amb.plate}</div>
                  <div className="text-text-muted/60 mt-0.5">{amb.location}</div>
                </div>
                <StatusPill status="maintenance" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── New Dispatch Slide-over ── */}
      <AnimatePresence>
        {showPanel && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !confirmed && setShowPanel(false)}
              className="fixed inset-0 bg-black/55 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ x: 440, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 440, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 280, damping: 28 }}
              className="fixed right-0 top-0 h-full w-[420px] bg-bg-surface border-l border-border z-50 flex flex-col"
            >
              {/* Panel Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                <div>
                  <h3 className="text-base font-semibold">New Dispatch</h3>
                  <p className="text-xs text-text-muted mt-0.5">Assign a unit to a call</p>
                </div>
                <button
                  onClick={() => setShowPanel(false)}
                  className="p-1.5 rounded-lg hover:bg-bg-subtle transition-colors"
                >
                  <X size={16} className="text-text-muted" />
                </button>
              </div>

              {confirmed ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex-1 flex flex-col items-center justify-center gap-4 p-8"
                >
                  <div className="w-16 h-16 rounded-full bg-accent-green/15 border border-accent-green/30 flex items-center justify-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 400 }}
                    >
                      <CheckIcon />
                    </motion.div>
                  </div>
                  <div className="text-center">
                    <div className="text-base font-semibold text-accent-green">Dispatch Confirmed</div>
                    <div className="text-xs text-text-muted mt-1">Unit is en route</div>
                  </div>
                </motion.div>
              ) : (
                <>
                  <div className="flex-1 overflow-y-auto p-5 space-y-4">

                    {/* Priority */}
                    <div>
                      <label className="text-xs font-semibold text-text-muted uppercase tracking-widest mb-2 block">Priority</label>
                      <div className="grid grid-cols-3 gap-2">
                        {(['P1', 'P2', 'P3'] as const).map((p) => (
                          <button
                            key={p}
                            onClick={() => setForm((f) => ({ ...f, priority: p }))}
                            className={`py-2 rounded-lg text-xs font-medium border transition-all ${
                              form.priority === p
                                ? PRIORITY_LABELS[p].color
                                : 'bg-bg-base border-border text-text-muted hover:border-border/80'
                            }`}
                          >
                            {p}
                          </button>
                        ))}
                      </div>
                      {form.priority && (
                        <div className="mt-1.5 text-xs text-text-muted">{PRIORITY_LABELS[form.priority]?.label}</div>
                      )}
                    </div>

                    {/* Location fields */}
                    {[
                      { label: 'Pickup Location', key: 'pickup' as const, placeholder: 'King Fahad Rd, Dammam' },
                      { label: 'Destination', key: 'destination' as const, placeholder: 'National Medical Center' },
                      { label: 'Patient Name', key: 'patient' as const, placeholder: 'Full name' },
                    ].map((field) => (
                      <div key={field.key}>
                        <label className="text-xs font-semibold text-text-muted uppercase tracking-widest mb-1.5 block">{field.label}</label>
                        <input
                          type="text"
                          placeholder={field.placeholder}
                          value={form[field.key]}
                          onChange={(e) => setForm((f) => ({ ...f, [field.key]: e.target.value }))}
                          className="w-full bg-bg-base border border-border rounded-lg px-3 py-2.5 text-sm text-text-primary placeholder-text-muted/50 focus:outline-none focus:border-accent-green/40 transition-colors font-sans"
                        />
                      </div>
                    ))}

                    {/* Ambulance */}
                    <div>
                      <label className="text-xs font-semibold text-text-muted uppercase tracking-widest mb-1.5 block">Ambulance Unit</label>
                      <select
                        value={form.ambulanceId}
                        onChange={(e) => setForm((f) => ({ ...f, ambulanceId: e.target.value }))}
                        className="w-full bg-bg-base border border-border rounded-lg px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent-green/40 transition-colors font-sans"
                      >
                        <option value="">Select unit...</option>
                        {availableAmbs.map((a) => (
                          <option key={a.id} value={a.id}>
                            {a.id} — {a.driver} ({a.model})
                          </option>
                        ))}
                      </select>
                      {form.ambulanceId && (() => {
                        const a = ambulances.find((x) => x.id === form.ambulanceId);
                        return a ? (
                          <div className="mt-2 flex items-center gap-2 text-xs text-text-muted">
                            <MapPin size={10} />
                            <span>{a.location}</span>
                            <span className="ml-auto">O₂ {a.oxygenLevel}%</span>
                          </div>
                        ) : null;
                      })()}
                    </div>

                    {/* Call type */}
                    <div>
                      <label className="text-xs font-semibold text-text-muted uppercase tracking-widest mb-1.5 block">Call Type</label>
                      <div className="grid grid-cols-3 gap-2">
                        {['emergency', 'scheduled', 'transfer'].map((type) => (
                          <button
                            key={type}
                            onClick={() => setForm((f) => ({ ...f, type }))}
                            className={`py-2 rounded-lg text-xs font-medium capitalize border transition-all ${
                              form.type === type
                                ? 'bg-accent-green/10 border-accent-green/40 text-accent-green'
                                : 'bg-bg-base border-border text-text-muted hover:text-text-primary'
                            }`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Notes */}
                    <div>
                      <label className="text-xs font-semibold text-text-muted uppercase tracking-widest mb-1.5 block">Notes</label>
                      <textarea
                        placeholder="Additional notes for the crew..."
                        rows={3}
                        value={form.notes}
                        onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                        className="w-full bg-bg-base border border-border rounded-lg px-3 py-2.5 text-sm text-text-primary placeholder-text-muted/50 focus:outline-none focus:border-accent-green/40 transition-colors font-sans resize-none"
                      />
                    </div>

                    {/* Summary card */}
                    <AnimatePresence>
                      {(form.pickup || form.destination || form.patient) && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 4 }}
                          className="p-4 rounded-xl bg-bg-base border border-border space-y-2"
                        >
                          <div className="text-xs font-semibold text-text-muted uppercase tracking-widest mb-2">Dispatch Summary</div>
                          {form.priority && (
                            <div className={`inline-block text-xs px-2 py-0.5 rounded border ${PRIORITY_LABELS[form.priority]?.color ?? ''} mb-1`}>
                              {PRIORITY_LABELS[form.priority]?.label}
                            </div>
                          )}
                          {form.patient && (
                            <div className="flex items-center gap-2 text-xs">
                              <User size={10} className="text-text-muted" />
                              <span className="text-text-muted">Patient:</span>
                              <span className="text-text-primary">{form.patient}</span>
                            </div>
                          )}
                          {form.pickup && (
                            <div className="flex items-center gap-2 text-xs">
                              <MapPin size={10} className="text-accent-red" />
                              <span className="text-text-muted">From:</span>
                              <span className="text-text-primary">{form.pickup}</span>
                            </div>
                          )}
                          {form.destination && (
                            <div className="flex items-center gap-2 text-xs">
                              <MapPin size={10} className="text-accent-green" />
                              <span className="text-text-muted">To:</span>
                              <span className="text-text-primary">{form.destination}</span>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Footer */}
                  <div className="p-5 border-t border-border flex gap-3">
                    <button
                      onClick={() => setShowPanel(false)}
                      className="flex-1 py-2.5 rounded-lg border border-border text-sm text-text-muted hover:bg-bg-subtle transition-colors"
                    >
                      Cancel
                    </button>
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleConfirm}
                      className="flex-1 py-2.5 rounded-lg bg-accent-green text-bg-base text-sm font-semibold hover:bg-accent-green/90 transition-colors shadow-lg shadow-accent-green/25"
                    >
                      Confirm Dispatch
                    </motion.button>
                  </div>
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function CheckIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
      <path d="M5 13l4 4L19 7" stroke="#00c896" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
