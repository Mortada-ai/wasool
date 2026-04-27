import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Radio, Truck, FileText, Users, Wrench, BarChart3, Building2, Plus
} from 'lucide-react';

const navItems = [
  { section: 'Operations', items: [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/dispatch', label: 'Live Dispatch', icon: Radio, badge: 2 },
    { to: '/fleet', label: 'Fleet', icon: Truck },
    { to: '/trip-logs', label: 'Trip Logs', icon: FileText },
  ]},
  { section: 'Management', items: [
    { to: '/crew', label: 'Crew', icon: Users },
    { to: '/maintenance', label: 'Maintenance', icon: Wrench, badge: 1 },
    { to: '/reports', label: 'Reports', icon: BarChart3 },
  ]},
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 h-full w-[200px] bg-bg-subtle border-r border-border flex flex-col z-30">
      {/* Logo */}
      <div className="px-4 pt-5 pb-4 border-b border-border">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-accent-red rounded-md flex items-center justify-center flex-shrink-0">
            <Plus size={15} className="text-white" strokeWidth={3} />
          </div>
          <div>
            <div className="text-text-primary font-bold text-base leading-none tracking-tight">Wasool</div>
            <div className="text-xs text-text-muted mt-0.5 tracking-wide">Fleet Management</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-5">
        {navItems.map((section) => (
          <div key={section.section}>
            <div className="px-2 mb-2 text-xs font-bold text-text-muted uppercase tracking-widest">
              {section.section}
            </div>
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const isActive = item.to === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(item.to);
                const Icon = item.icon;

                return (
                  <li key={item.to} className="relative">
                    {isActive && (
                      <motion.div
                        layoutId="sidebar-active"
                        className="absolute inset-0 rounded-md bg-accent-red/10 border border-accent-red/20"
                        transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                      />
                    )}
                    {isActive && (
                      <motion.div
                        layoutId="sidebar-bar"
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-accent-red rounded-r-full"
                        transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                      />
                    )}
                    <NavLink
                      to={item.to}
                      className={`relative flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-bold transition-colors duration-150 ${
                        isActive ? 'text-accent-red' : 'text-text-muted hover:text-text-primary'
                      }`}
                    >
                      <Icon size={15} className="flex-shrink-0" />
                      <span className="flex-1">{item.label}</span>
                      {item.badge && (
                        <span className="flex-shrink-0 w-4 h-4 rounded-full bg-accent-red text-white text-xs font-mono flex items-center justify-center leading-none">
                          {item.badge}
                        </span>
                      )}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-border">
        <div className="flex items-center gap-2 mb-1">
          <Building2 size={12} className="text-text-muted" />
          <span className="text-xs text-text-muted">Al Noor Medical Center</span>
        </div>
        <div className="text-xs font-mono text-text-muted/60 pl-4">Dammam — Main</div>
      </div>
    </aside>
  );
}
