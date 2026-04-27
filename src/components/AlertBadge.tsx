import { motion } from 'framer-motion';
import { AlertTriangle, Info, XCircle } from 'lucide-react';
import { Alert } from '../data/dummy';

interface Props {
  alert: Alert;
  index?: number;
}

const typeConfig = {
  danger: { icon: XCircle, color: 'text-accent-red', bg: 'bg-accent-red/8', border: 'border-accent-red/25' },
  warning: { icon: AlertTriangle, color: 'text-accent-amber', bg: 'bg-accent-amber/8', border: 'border-accent-amber/25' },
  info: { icon: Info, color: 'text-accent-blue', bg: 'bg-accent-blue/8', border: 'border-accent-blue/25' },
};

export default function AlertBadge({ alert, index = 0 }: Props) {
  const cfg = typeConfig[alert.type];
  const Icon = cfg.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.08 }}
      className={`flex gap-3 items-start p-3 rounded-md border ${cfg.bg} ${cfg.border} ${index === 0 ? 'shake-in' : ''}`}
    >
      <Icon size={15} className={`${cfg.color} mt-0.5 flex-shrink-0`} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-0.5">
          <span className={`text-xs font-semibold ${cfg.color}`}>{alert.title}</span>
          <span className="text-xs text-text-muted font-mono flex-shrink-0">{alert.time}</span>
        </div>
        <p className="text-xs text-text-muted leading-relaxed">{alert.description}</p>
        {alert.ambulanceId && (
          <span className="mt-1 inline-block text-xs font-mono text-text-muted">{alert.ambulanceId}</span>
        )}
      </div>
    </motion.div>
  );
}
