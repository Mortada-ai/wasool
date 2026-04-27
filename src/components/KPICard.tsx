import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface Props {
  label: string;
  value: string | number;
  sub?: string;
  icon: ReactNode;
  accent?: 'green' | 'blue' | 'amber' | 'red' | 'muted';
  index?: number;
}

const accentMap = {
  green: { icon: 'text-accent-green', border: 'border-accent-green/20', glow: 'hover:glow-green', badge: 'bg-accent-green/10' },
  blue: { icon: 'text-accent-blue', border: 'border-accent-blue/20', glow: 'hover:glow-blue', badge: 'bg-accent-blue/10' },
  amber: { icon: 'text-accent-amber', border: 'border-accent-amber/20', glow: 'hover:glow-amber', badge: 'bg-accent-amber/10' },
  red: { icon: 'text-accent-red', border: 'border-accent-red/20', glow: 'hover:glow-red', badge: 'bg-accent-red/10' },
  muted: { icon: 'text-text-muted', border: 'border-border', glow: '', badge: 'bg-text-muted/10' },
};

export default function KPICard({ label, value, sub, icon, accent = 'muted', index = 0 }: Props) {
  const a = accentMap[accent];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.07 }}
      className={`bg-bg-surface border ${a.border} rounded-lg p-4 card-hover cursor-default relative overflow-hidden group`}
    >
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${a.glow}`} />
      <div className="flex items-start justify-between mb-3">
        <span className="text-xs text-text-muted font-bold uppercase tracking-widest">{label}</span>
        <div className={`p-1.5 rounded-md ${a.badge}`}>
          <span className={`${a.icon} block`} style={{ width: 16, height: 16 }}>{icon}</span>
        </div>
      </div>
      <div className="font-sans text-3xl font-bold text-text-primary leading-none mb-1">{value}</div>
      {sub && <div className="text-xs text-text-muted font-sans mt-1">{sub}</div>}
    </motion.div>
  );
}
