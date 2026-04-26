import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Award, Calendar, Truck } from 'lucide-react';
import { crew } from '../data/dummy';
import { CrewMember } from '../data/dummy';
import StatusPill from '../components/StatusPill';

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, y: -8 },
};

function certExpiryColor(expiry: string): string {
  const today = new Date('2024-04-26');
  const exp = new Date(expiry);
  const days = Math.floor((exp.getTime() - today.getTime()) / 86400000);
  if (days < 0) return 'text-accent-red';
  if (days < 30) return 'text-accent-amber';
  return 'text-text-muted';
}

function certExpiryLabel(expiry: string): string {
  const today = new Date('2024-04-26');
  const exp = new Date(expiry);
  const days = Math.floor((exp.getTime() - today.getTime()) / 86400000);
  if (days < 0) return `Expired ${Math.abs(days)}d ago`;
  if (days < 30) return `Exp. in ${days}d`;
  return expiry;
}

const WORKED_DAYS = [1, 2, 3, 6, 7, 8, 9, 10, 13, 14, 15, 16, 17, 20, 21, 22, 23, 24];

const certColors: Record<string, string> = {
  BLS: 'bg-accent-green/10 text-accent-green border-accent-green/20',
  ACLS: 'bg-accent-blue/10 text-accent-blue border-accent-blue/20',
  PALS: 'bg-purple-400/10 text-purple-400 border-purple-400/20',
  ITLS: 'bg-accent-amber/10 text-accent-amber border-accent-amber/20',
};

function Avatar({ name, role }: { name: string; role: string }) {
  const initials = name.split(' ').map((p) => p[0]).slice(0, 2).join('');
  const colors = ['bg-accent-green/20 text-accent-green', 'bg-accent-blue/20 text-accent-blue', 'bg-purple-400/20 text-purple-400', 'bg-accent-amber/20 text-accent-amber'];
  const color = colors[name.length % colors.length];
  return (
    <div className={`w-14 h-14 rounded-full flex items-center justify-center text-xl font-mono font-medium border border-border ${color}`}>
      {initials}
    </div>
  );
}

export default function Crew() {
  const [selected, setSelected] = useState<CrewMember | null>(null);

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <div className="bg-bg-surface border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border">
                {['Member', 'Role', 'Certifications', 'Cert Expiry', 'Ambulance', 'Status', 'Trips/Mo'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-text-muted font-sans font-medium whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {crew.map((member, i) => (
                <motion.tr
                  key={member.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => setSelected(member)}
                  className="border-b border-border/50 hover:bg-bg-subtle transition-colors cursor-pointer"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-bg-subtle border border-border flex items-center justify-center text-xs font-mono text-text-muted">
                        {member.name.charAt(0)}
                      </div>
                      <span className="text-text-primary font-medium whitespace-nowrap">{member.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-text-muted">{member.role}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1 flex-wrap">
                      {member.certifications.map((c) => (
                        <span key={c} className={`px-1.5 py-0.5 rounded text-xs font-mono border ${certColors[c] ?? 'bg-bg-subtle text-text-muted border-border'}`}>{c}</span>
                      ))}
                    </div>
                  </td>
                  <td className={`px-4 py-3 font-mono ${certExpiryColor(member.certExpiry)}`}>
                    {certExpiryLabel(member.certExpiry)}
                  </td>
                  <td className="px-4 py-3 font-mono text-text-muted">{member.assignedAmbulance}</td>
                  <td className="px-4 py-3">
                    <StatusPill status={member.status === 'on_duty' ? 'on_duty_crew' : member.status} />
                  </td>
                  <td className="px-4 py-3 font-mono text-text-primary">{member.tripsThisMonth}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slide-over */}
      <AnimatePresence>
        {selected && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelected(null)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ x: 480 }}
              animate={{ x: 0 }}
              exit={{ x: 480 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed right-0 top-0 h-full w-[420px] bg-bg-surface border-l border-border z-50 flex flex-col"
            >
              <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                <span className="text-base font-semibold">Crew Profile</span>
                <button onClick={() => setSelected(null)} className="p-1.5 rounded-lg hover:bg-bg-subtle transition-colors">
                  <X size={16} className="text-text-muted" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-5 space-y-5">
                {/* Profile header */}
                <div className="flex items-center gap-4 p-4 bg-bg-base rounded-xl border border-border">
                  <Avatar name={selected.name} role={selected.role} />
                  <div>
                    <div className="text-base font-semibold text-text-primary">{selected.name}</div>
                    <div className="text-sm text-text-muted mt-0.5">{selected.role}</div>
                    <div className="mt-1.5">
                      <StatusPill status={selected.status === 'on_duty' ? 'on_duty_crew' : selected.status} />
                    </div>
                  </div>
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'ID', value: selected.id, icon: null, mono: true },
                    { label: 'Ambulance', value: selected.assignedAmbulance, icon: <Truck size={11} />, mono: true },
                    { label: 'Shifts / Month', value: selected.shiftsThisMonth, icon: <Calendar size={11} />, mono: true },
                    { label: 'Trips / Month', value: selected.tripsThisMonth, icon: null, mono: true },
                  ].map((row) => (
                    <div key={row.label} className="p-3 bg-bg-base rounded-lg border border-border">
                      <div className="text-xs text-text-muted flex items-center gap-1 mb-1">{row.icon}{row.label}</div>
                      <div className={`text-sm text-text-primary font-medium ${row.mono ? 'font-mono' : ''}`}>{row.value}</div>
                    </div>
                  ))}
                </div>

                {/* Certifications */}
                <div className="p-4 bg-bg-base rounded-xl border border-border">
                  <div className="flex items-center gap-2 mb-3">
                    <Award size={14} className="text-accent-amber" />
                    <span className="text-sm font-semibold">Certifications</span>
                  </div>
                  <div className="flex gap-2 flex-wrap mb-3">
                    {selected.certifications.map((c) => (
                      <span key={c} className={`px-2 py-1 rounded-lg text-xs font-mono border ${certColors[c] ?? 'bg-bg-subtle text-text-muted border-border'}`}>{c}</span>
                    ))}
                  </div>
                  <div className={`text-xs font-mono ${certExpiryColor(selected.certExpiry)}`}>
                    Cert Expiry: {certExpiryLabel(selected.certExpiry)}
                  </div>
                </div>

                {/* Shift calendar */}
                <div className="p-4 bg-bg-base rounded-xl border border-border">
                  <div className="text-sm font-semibold mb-3">April Shift Calendar</div>
                  <div className="grid grid-cols-7 gap-1">
                    {['M','T','W','T','F','S','S'].map((d, i) => (
                      <div key={i} className="text-center text-xs text-text-muted pb-1">{d}</div>
                    ))}
                    {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => {
                      const worked = WORKED_DAYS.slice(0, Math.min(selected.shiftsThisMonth, WORKED_DAYS.length)).includes(day);
                      return (
                        <div
                          key={day}
                          className={`text-center text-xs py-1 rounded ${
                            worked
                              ? 'bg-accent-green/20 text-accent-green font-medium'
                              : 'text-text-muted/40'
                          }`}
                        >
                          {day}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
