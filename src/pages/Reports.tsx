import { motion } from 'framer-motion';
import { Download, Calendar } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  LineChart, Line, CartesianGrid,
  PieChart, Pie, Legend,
} from 'recharts';
import { dailyTrips, responseTimeTrend, fleetUtilization, kpis } from '../data/dummy';
import { useChartTheme } from '../context/ThemeContext';

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, y: -8 },
};

const tripTypeData = [
  { name: 'Emergency', value: 40, fill: '#ef4444' },
  { name: 'Scheduled', value: 35, fill: '#0ea5e9' },
  { name: 'Transfer',  value: 25, fill: '#a78bfa' },
];

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-bg-surface border border-border rounded-xl overflow-hidden">
      <div className="px-4 py-3 border-b border-border">
        <span className="text-sm font-semibold">{title}</span>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

const tickProps = { fill: '#64748b', fontSize: 9, fontFamily: 'DM Mono' };

export default function Reports() {
  const chart = useChartTheme();
  const recentData = dailyTrips.slice(-14);

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="space-y-5">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 px-3 py-2 bg-bg-surface border border-border rounded-lg text-xs text-text-muted">
          <Calendar size={13} />
          <span>Apr 1 – Apr 26, 2024</span>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 px-4 py-2 bg-bg-surface border border-border rounded-lg text-xs font-medium text-text-muted hover:text-text-primary transition-colors"
        >
          <Download size={13} />
          Export Report
        </motion.button>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Trips',   value: '432',  sub: 'This month'     },
          { label: 'Active Hours',  value: '218h', sub: 'Fleet-wide'     },
          { label: 'Avg Response',  value: '7.4m', sub: 'Min to arrive'  },
          { label: 'Incidents',     value: '0',    sub: 'Zero this month'},
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="p-4 bg-bg-surface border border-border rounded-xl"
          >
            <div className="text-xs text-text-muted mb-1">{stat.label}</div>
            <div className="font-mono text-2xl font-medium text-text-primary">{stat.value}</div>
            <div className="text-xs text-text-muted mt-0.5">{stat.sub}</div>
          </motion.div>
        ))}
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <ChartCard title="Daily Trips — Last 14 Days">
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={recentData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <XAxis dataKey="day" tick={tickProps} axisLine={false} tickLine={false} interval={1} />
                <YAxis tick={tickProps} axisLine={false} tickLine={false} />
                <Tooltip {...chart.tooltip} />
                <Bar dataKey="trips" radius={[3, 3, 0, 0]}>
                  {recentData.map((entry, i) => (
                    <Cell key={i} fill={entry.trips >= 17 ? 'rgb(var(--accent-green))' : chart.barInactive} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Avg Response Time — 4-Week Trend">
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={responseTimeTrend} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={chart.grid} />
                <XAxis dataKey="week" tick={tickProps} axisLine={false} tickLine={false} />
                <YAxis domain={[6, 10]} tick={tickProps} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={chart.tooltip.contentStyle}
                  cursor={chart.tooltip.cursor}
                  formatter={(v) => [`${v} min`, 'Avg Response']}
                />
                <Line
                  type="monotone"
                  dataKey="time"
                  stroke="rgb(var(--accent-blue))"
                  strokeWidth={2}
                  dot={{ fill: 'rgb(var(--accent-blue))', r: 4, strokeWidth: 0 }}
                  activeDot={{ r: 6, fill: 'rgb(var(--accent-blue))' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <ChartCard title="Trip Type Breakdown">
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={tripTypeData}
                  cx="40%" cy="50%"
                  innerRadius={55} outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                  animationBegin={0}
                  animationDuration={800}
                >
                  {tripTypeData.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} opacity={0.85} />
                  ))}
                </Pie>
                <Legend
                  layout="vertical" align="right" verticalAlign="middle"
                  formatter={(value) => (
                    <span style={{ color: 'rgb(var(--text-primary))', fontSize: 11, fontFamily: 'DM Mono' }}>
                      {value}
                    </span>
                  )}
                />
                <Tooltip
                  contentStyle={chart.tooltip.contentStyle}
                  formatter={(v) => [`${v}%`, 'Share']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Fleet Utilization %">
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={fleetUtilization} layout="vertical" margin={{ top: 4, right: 20, left: 0, bottom: 0 }}>
                <XAxis type="number" domain={[0, 100]} tick={tickProps} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="id" tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'DM Mono' }} axisLine={false} tickLine={false} width={52} />
                <Tooltip {...chart.tooltip} formatter={(v) => [`${v}%`, 'Utilization']} />
                <Bar dataKey="utilization" radius={[0, 4, 4, 0]}>
                  {fleetUtilization.map((entry, i) => (
                    <Cell key={i} fill={
                      entry.utilization === 0  ? chart.barInactive :
                      entry.utilization > 80   ? 'rgb(var(--accent-green))' :
                      entry.utilization > 60   ? 'rgb(var(--accent-blue))' :
                      'rgb(var(--accent-amber))'
                    } />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      <div className="h-4" />
    </motion.div>
  );
}
