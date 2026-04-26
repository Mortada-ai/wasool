import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Fuel, MapPin, Clock, Wrench } from 'lucide-react';
import { ambulances, trips, maintenance } from '../data/dummy';
import StatusPill from '../components/StatusPill';

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, y: -8 },
};

type FilterType = 'all' | 'available' | 'on_duty' | 'maintenance';

function OxygenBar({ level }: { level: number }) {
  const color = level > 50 ? '#00c896' : level > 20 ? '#f59e0b' : '#ef4444';
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-text-muted">O₂ Level</span>
        <span className="text-xs font-mono" style={{ color }}>{level}%</span>
      </div>
      <div className="h-1.5 bg-bg-base rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${level}%` }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>
    </div>
  );
}

export default function Fleet() {
  const [filter, setFilter] = useState<FilterType>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = filter === 'all' ? ambulances : ambulances.filter((a) => a.status === filter);
  const selected = ambulances.find((a) => a.id === selectedId);
  const ambTrips = trips.filter((t) => t.ambulanceId === selectedId).slice(0, 5);
  const ambMaintenance = maintenance.filter((m) => m.ambulanceId === selectedId);

  const filters: { key: FilterType; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'available', label: 'Available' },
    { key: 'on_duty', label: 'On Duty' },
    { key: 'maintenance', label: 'Maintenance' },
  ];

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      {/* Filter bar */}
      <div className="flex items-center gap-2 mb-5">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filter === f.key
                ? 'bg-accent-green/10 text-accent-green border border-accent-green/30'
                : 'text-text-muted border border-border hover:border-border/80 hover:text-text-primary'
            }`}
          >
            {f.label}
          </button>
        ))}
        <span className="ml-auto text-xs text-text-muted">{filtered.length} units</span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((amb, i) => (
          <motion.div
            key={amb.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.3 }}
            onClick={() => setSelectedId(amb.id)}
            className={`bg-bg-surface border rounded-xl p-4 cursor-pointer card-hover group transition-all ${
              selectedId === amb.id ? 'border-accent-green/40 glow-green' : 'border-border hover:border-border/80'
            }`}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="font-mono text-lg font-medium text-text-primary">{amb.plate}</div>
                <div className="text-xs text-text-muted mt-0.5">{amb.model}</div>
              </div>
              <StatusPill status={amb.status} />
            </div>

            {/* Driver */}
            <div className="flex items-center gap-2 mb-3 text-sm">
              <div className="w-6 h-6 rounded-full bg-bg-subtle border border-border flex items-center justify-center text-xs font-mono text-text-muted">
                {amb.driver === 'Unassigned' ? '—' : amb.driver.charAt(0)}
              </div>
              <span className={`text-sm ${amb.driver === 'Unassigned' ? 'text-text-muted italic' : 'text-text-primary'}`}>
                {amb.driver}
              </span>
            </div>

            {/* O2 Bar */}
            <div className="mb-3">
              <OxygenBar level={amb.oxygenLevel} />
            </div>

            {/* Footer stats */}
            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-border">
              <div>
                <div className="text-xs text-text-muted flex items-center gap-1"><MapPin size={9} /> Base</div>
                <div className="text-xs text-text-primary mt-0.5 truncate">{amb.id}</div>
              </div>
              <div>
                <div className="text-xs text-text-muted flex items-center gap-1"><Fuel size={9} /> km</div>
                <div className="font-mono text-xs text-text-primary mt-0.5">{amb.mileage.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-xs text-text-muted flex items-center gap-1"><Clock size={9} /> Last</div>
                <div className="font-mono text-xs text-text-primary mt-0.5">{amb.lastTrip}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Slide-over */}
      <AnimatePresence>
        {selected && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedId(null)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ x: 480 }}
              animate={{ x: 0 }}
              exit={{ x: 480 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed right-0 top-0 h-full w-[460px] bg-bg-surface border-l border-border z-50 flex flex-col overflow-hidden"
            >
              {/* Header */}
              <div className="px-5 py-4 border-b border-border flex items-start justify-between">
                <div>
                  <div className="font-mono text-xl font-medium text-text-primary">{selected.plate}</div>
                  <div className="text-sm text-text-muted mt-0.5">{selected.model} · {selected.id}</div>
                </div>
                <div className="flex items-center gap-3">
                  <StatusPill status={selected.status} />
                  <button onClick={() => setSelectedId(null)} className="p-1.5 rounded-lg hover:bg-bg-subtle transition-colors">
                    <X size={16} className="text-text-muted" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-5 space-y-5">
                {/* Vehicle Info */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Driver', value: selected.driver },
                    { label: 'Location', value: selected.location },
                    { label: 'Mileage', value: `${selected.mileage.toLocaleString()} km`, mono: true },
                    { label: 'Last Trip', value: selected.lastTrip, mono: true },
                  ].map((row) => (
                    <div key={row.label} className="p-3 bg-bg-base rounded-lg border border-border">
                      <div className="text-xs text-text-muted mb-1">{row.label}</div>
                      <div className={`text-sm text-text-primary ${row.mono ? 'font-mono' : ''}`}>{row.value}</div>
                    </div>
                  ))}
                </div>

                {/* Oxygen */}
                <div className="p-4 bg-bg-base rounded-xl border border-border">
                  <OxygenBar level={selected.oxygenLevel} />
                </div>

                {/* Maintenance History */}
                <div>
                  <h4 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Wrench size={14} className="text-accent-amber" />
                    Maintenance History
                  </h4>
                  {ambMaintenance.length === 0 ? (
                    <div className="text-xs text-text-muted text-center py-4">No records</div>
                  ) : (
                    <div className="space-y-2">
                      {ambMaintenance.map((m) => (
                        <div key={m.id} className="flex items-start gap-3 p-3 bg-bg-base rounded-lg border border-border">
                          <div className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0 ${
                            m.status === 'overdue' ? 'bg-accent-red' : m.status === 'scheduled' ? 'bg-accent-amber' : 'bg-accent-green'
                          }`} />
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-medium text-text-primary">{m.description}</div>
                            <div className="text-xs text-text-muted mt-0.5">{m.scheduledDate} · {m.garage}</div>
                          </div>
                          <div className="text-xs font-mono text-text-muted">{m.cost > 0 ? `SAR ${m.cost}` : '—'}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Trip History */}
                <div>
                  <h4 className="text-sm font-semibold text-text-primary mb-3">Recent Trips</h4>
                  {ambTrips.length === 0 ? (
                    <div className="text-xs text-text-muted text-center py-4">No trips</div>
                  ) : (
                    <div className="space-y-2">
                      {ambTrips.map((t) => (
                        <div key={t.id} className="flex items-center gap-3 p-3 bg-bg-base rounded-lg border border-border">
                          <span className="font-mono text-xs text-accent-blue">{t.id}</span>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs text-text-primary truncate">{t.origin} → {t.destination}</div>
                            <div className="text-xs text-text-muted mt-0.5">{t.startTime}</div>
                          </div>
                          <StatusPill status={t.status} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
