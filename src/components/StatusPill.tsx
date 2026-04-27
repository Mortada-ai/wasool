import { motion } from 'framer-motion';

type Status = 'available' | 'on_duty' | 'maintenance' | 'on_duty_crew' | 'standby' | 'off' |
  'completed' | 'active' | 'emergency' | 'scheduled' | 'transfer' | 'overdue' | 'danger' | 'warning' | 'info';

/* Brand status color mapping — each colour = one operational state */
const config: Record<Status, { label: string; color: string; dot: string }> = {
  available:    { label: 'Available',   color: 'bg-accent-green/10 text-accent-green border border-accent-green/25', dot: 'bg-accent-green' },
  on_duty:      { label: 'En Route',    color: 'bg-accent-blue/10 text-accent-blue border border-accent-blue/25',   dot: 'bg-accent-blue' },
  maintenance:  { label: 'Offline',     color: 'bg-text-muted/10 text-text-muted border border-text-muted/20',       dot: 'bg-text-muted' },
  on_duty_crew: { label: 'On Duty',     color: 'bg-accent-blue/10 text-accent-blue border border-accent-blue/25',   dot: 'bg-accent-blue' },
  standby:      { label: 'Standby',     color: 'bg-accent-amber/10 text-accent-amber border border-accent-amber/25', dot: 'bg-accent-amber' },
  off:          { label: 'Off Shift',   color: 'bg-text-muted/10 text-text-muted border border-text-muted/20',       dot: 'bg-text-muted' },
  completed:    { label: 'Completed',   color: 'bg-accent-green/10 text-accent-green border border-accent-green/25', dot: 'bg-accent-green' },
  active:       { label: 'Active',      color: 'bg-accent-blue/10 text-accent-blue border border-accent-blue/25',   dot: 'bg-accent-blue animate-live-pulse' },
  emergency:    { label: 'Emergency',   color: 'bg-accent-red/10 text-accent-red border border-accent-red/25',       dot: 'bg-accent-red emergency-flash' },
  scheduled:    { label: 'Scheduled',   color: 'bg-accent-amber/10 text-accent-amber border border-accent-amber/25', dot: 'bg-accent-amber' },
  transfer:     { label: 'Transfer',    color: 'bg-accent-blue/10 text-accent-blue border border-accent-blue/25',   dot: 'bg-accent-blue' },
  overdue:      { label: 'Overdue',     color: 'bg-accent-red/10 text-accent-red border border-accent-red/25',       dot: 'bg-accent-red' },
  danger:       { label: 'Danger',      color: 'bg-accent-red/10 text-accent-red border border-accent-red/25',       dot: 'bg-accent-red' },
  warning:      { label: 'Warning',     color: 'bg-accent-amber/10 text-accent-amber border border-accent-amber/25', dot: 'bg-accent-amber' },
  info:         { label: 'Info',        color: 'bg-accent-blue/10 text-accent-blue border border-accent-blue/25',   dot: 'bg-accent-blue' },
};

interface Props {
  status: string;
  className?: string;
}

export default function StatusPill({ status, className = '' }: Props) {
  const cfg = config[status as Status] ?? { label: status, color: 'bg-text-muted/10 text-text-muted border border-text-muted/20', dot: 'bg-text-muted' };

  return (
    <motion.span
      layout
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-bold ${cfg.color} ${className}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
    >
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${cfg.dot}`} />
      {cfg.label}
    </motion.span>
  );
}
