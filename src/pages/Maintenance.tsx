import { motion } from 'framer-motion';
import { Wrench, Calendar, DollarSign, Building2, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { ambulances, maintenance } from '../data/dummy';
import StatusPill from '../components/StatusPill';

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, y: -8 },
};

const statusIcon = {
  overdue: <AlertTriangle size={14} className="text-accent-red" />,
  scheduled: <Clock size={14} className="text-accent-amber" />,
  completed: <CheckCircle size={14} className="text-accent-green" />,
};

const borderColor = {
  overdue: 'border-accent-red/30',
  scheduled: 'border-accent-amber/30',
  completed: 'border-border',
};

const headerBg = {
  overdue: 'bg-accent-red/8',
  scheduled: 'bg-accent-amber/8',
  completed: 'bg-bg-subtle',
};

export default function Maintenance() {
  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="space-y-5">
      {/* Summary strip */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Overdue', count: maintenance.filter((m) => m.status === 'overdue').length, color: 'text-accent-red', bg: 'bg-accent-red/10', border: 'border-accent-red/20' },
          { label: 'Scheduled', count: maintenance.filter((m) => m.status === 'scheduled').length, color: 'text-accent-amber', bg: 'bg-accent-amber/10', border: 'border-accent-amber/20' },
          { label: 'Completed', count: maintenance.filter((m) => m.status === 'completed').length, color: 'text-accent-green', bg: 'bg-accent-green/10', border: 'border-accent-green/20' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className={`p-4 rounded-xl border ${stat.bg} ${stat.border}`}
          >
            <div className="text-xs text-text-muted mb-1">{stat.label}</div>
            <div className={`font-mono text-3xl font-medium ${stat.color}`}>{stat.count}</div>
          </motion.div>
        ))}
      </div>

      {/* Per ambulance cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {ambulances.map((amb, ai) => {
          const records = maintenance.filter((m) => m.ambulanceId === amb.id);
          const hasOverdue = records.some((r) => r.status === 'overdue');
          const hasScheduled = records.some((r) => r.status === 'scheduled');
          const overallStatus = hasOverdue ? 'overdue' : hasScheduled ? 'scheduled' : records.length > 0 ? 'completed' : 'completed';

          return (
            <motion.div
              key={amb.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: ai * 0.06 }}
              className={`bg-bg-surface border rounded-xl overflow-hidden ${borderColor[overallStatus]} ${hasOverdue ? 'shake-in' : ''}`}
            >
              {/* Card header */}
              <div className={`px-4 py-3 border-b ${borderColor[overallStatus]} ${headerBg[overallStatus]} flex items-center justify-between`}>
                <div className="flex items-center gap-3">
                  {statusIcon[overallStatus]}
                  <div>
                    <span className="font-mono text-sm font-medium text-text-primary">{amb.id}</span>
                    <span className="text-xs text-text-muted ml-2">{amb.plate}</span>
                  </div>
                </div>
                <StatusPill status={amb.status} />
              </div>

              {/* Timeline */}
              <div className="p-4">
                {records.length === 0 ? (
                  <div className="text-xs text-text-muted text-center py-4">No maintenance records</div>
                ) : (
                  <div className="relative">
                    <div className="absolute left-2.5 top-0 bottom-0 w-px bg-border" />
                    <div className="space-y-4">
                      {records.map((record, ri) => (
                        <motion.div
                          key={record.id}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: ai * 0.06 + ri * 0.07 }}
                          className="relative flex gap-4 pl-8"
                        >
                          {/* Timeline dot */}
                          <div className={`absolute left-0 top-1.5 w-5 h-5 rounded-full border-2 border-bg-surface flex items-center justify-center ${
                            record.status === 'overdue' ? 'bg-accent-red' :
                            record.status === 'scheduled' ? 'bg-accent-amber' : 'bg-accent-green'
                          }`}>
                            <Wrench size={9} className="text-white" />
                          </div>

                          <div className="flex-1 pb-4 border-b border-border/50 last:border-0 last:pb-0">
                            <div className="flex items-start justify-between gap-2 mb-1.5">
                              <span className="text-sm font-medium text-text-primary">{record.description}</span>
                              <StatusPill status={record.status} />
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div className="flex items-center gap-1.5 text-text-muted">
                                <Calendar size={10} />
                                <span>{record.scheduledDate}</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-text-muted">
                                <Building2 size={10} />
                                <span className="truncate">{record.garage}</span>
                              </div>
                              {record.cost > 0 && (
                                <div className="flex items-center gap-1.5 text-text-muted">
                                  <DollarSign size={10} />
                                  <span className="font-mono">SAR {record.cost.toLocaleString()}</span>
                                </div>
                              )}
                              <div className="flex items-center gap-1.5 text-text-muted capitalize">
                                <Wrench size={10} />
                                <span>{record.type}</span>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
