import { Ambulance } from '../data/dummy';
import { useTheme } from '../context/ThemeContext';

const statusColor: Record<string, string> = {
  available:   '#00c896',
  on_duty:     '#0ea5e9',
  maintenance: '#64748b',
};

const DARK_MAP = {
  bg:          '#0a0f1a',
  gridLine:    'rgba(30,45,69,0.7)',
  roadMajor:   '#1e3a5f',
  roadMinor:   '#162d4a',
  textFaint:   '#334e68',
  legendBg:    'rgba(17,24,39,0.9)',
  legendBorder:'#1e2d45',
  legendText:  '#94a3b8',
};

const LIGHT_MAP = {
  bg:          '#eef2f7',
  gridLine:    'rgba(148,163,184,0.25)',
  roadMajor:   '#94a3b8',
  roadMinor:   '#cbd5e1',
  textFaint:   '#94a3b8',
  legendBg:    'rgba(255,255,255,0.92)',
  legendBorder:'#e2e8f0',
  legendText:  '#64748b',
};

const LAT_MIN = 26.38, LAT_MAX = 26.46;
const LNG_MIN = 50.05, LNG_MAX = 50.16;

function toSVG(lat: number, lng: number, w: number, h: number) {
  const x = ((lng - LNG_MIN) / (LNG_MAX - LNG_MIN)) * w;
  const y = h - ((lat - LAT_MIN) / (LAT_MAX - LAT_MIN)) * h;
  return { x, y };
}

interface Props {
  ambulances: Ambulance[];
  height?: number;
  onSelect?: (id: string) => void;
  selectedId?: string;
}

const roads = [
  [{ lat: 26.42, lng: 50.05 }, { lat: 26.42, lng: 50.16 }],
  [{ lat: 26.44, lng: 50.05 }, { lat: 26.44, lng: 50.16 }],
  [{ lat: 26.40, lng: 50.05 }, { lat: 26.40, lng: 50.16 }],
  [{ lat: 26.38, lng: 50.05 }, { lat: 26.38, lng: 50.16 }],
  [{ lat: 26.46, lng: 50.05 }, { lat: 26.46, lng: 50.16 }],
  [{ lat: 26.38, lng: 50.07 }, { lat: 26.46, lng: 50.07 }],
  [{ lat: 26.38, lng: 50.09 }, { lat: 26.46, lng: 50.09 }],
  [{ lat: 26.38, lng: 50.11 }, { lat: 26.46, lng: 50.11 }],
  [{ lat: 26.38, lng: 50.13 }, { lat: 26.46, lng: 50.13 }],
  [{ lat: 26.38, lng: 50.15 }, { lat: 26.46, lng: 50.15 }],
  [{ lat: 26.40, lng: 50.08 }, { lat: 26.43, lng: 50.12 }],
  [{ lat: 26.41, lng: 50.06 }, { lat: 26.44, lng: 50.10 }],
];

const districts = [
  { label: 'King Fahad Rd', lat: 26.42, lng: 50.075 },
  { label: 'Safa District',  lat: 26.405, lng: 50.09 },
  { label: 'Al-Hamra',       lat: 26.443, lng: 50.135 },
  { label: 'Al Noor Base',   lat: 26.408, lng: 50.105 },
];

export default function FleetMap({ ambulances, height = 280, onSelect, selectedId }: Props) {
  const W = 560;
  const H = height;
  const { isDark } = useTheme();
  const m = isDark ? DARK_MAP : LIGHT_MAP;

  return (
    <div
      className="relative w-full overflow-hidden rounded-xl border border-border transition-theme"
      style={{ height, backgroundColor: m.bg, transition: 'background-color 0.2s ease' }}
    >
      {/* Grid background */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(${m.gridLine} 1px, transparent 1px), linear-gradient(90deg, ${m.gridLine} 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      <svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet">
        {/* Roads */}
        {roads.map((road, i) => {
          const p1 = toSVG(road[0].lat, road[0].lng, W, H);
          const p2 = toSVG(road[1].lat, road[1].lng, W, H);
          return (
            <line
              key={i}
              x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
              stroke={i < 5 ? m.roadMajor : m.roadMinor}
              strokeWidth={i < 5 ? 3 : 2}
              strokeLinecap="round"
            />
          );
        })}

        {/* District labels */}
        {districts.map((d, i) => {
          const p = toSVG(d.lat, d.lng, W, H);
          return (
            <text
              key={i}
              x={p.x} y={p.y}
              fill={m.textFaint}
              fontSize="9"
              fontFamily="DM Mono"
              textAnchor="middle"
            >
              {d.label}
            </text>
          );
        })}

        {/* Ambulance pins */}
        {ambulances.map((amb) => {
          const { x, y } = toSVG(amb.lat, amb.lng, W, H);
          const color      = statusColor[amb.status] ?? '#64748b';
          const isActive   = amb.status === 'on_duty';
          const isSelected = amb.id === selectedId;

          return (
            <g
              key={amb.id}
              onClick={() => onSelect?.(amb.id)}
              style={{ cursor: onSelect ? 'pointer' : 'default' }}
              className={amb.status !== 'maintenance' ? 'amb-pin-anim' : ''}
            >
              {isActive && (
                <>
                  <circle cx={x} cy={y} r={14} fill="none" stroke={color} strokeWidth={1.5} opacity={0.35} className="ping-ring" />
                  <circle cx={x} cy={y} r={10} fill="none" stroke={color} strokeWidth={1}   opacity={0.2}  style={{ animation: 'pingRing 1.8s ease-out 0.6s infinite', transformBox: 'fill-box', transformOrigin: 'center' }} />
                </>
              )}

              {isSelected && (
                <circle cx={x} cy={y} r={13} fill="none" stroke={isDark ? '#ffffff' : '#0f172a'} strokeWidth={1.5} opacity={0.4} />
              )}

              <circle
                cx={x} cy={y}
                r={isSelected ? 9 : 7}
                fill={color}
                fillOpacity={amb.status === 'maintenance' ? 0.4 : 0.9}
                stroke={isSelected ? (isDark ? '#ffffff' : '#0f172a') : color}
                strokeWidth={isSelected ? 2 : 1.5}
                strokeOpacity={0.5}
              />

              <text
                x={x} y={y + 1}
                fill="white"
                fontSize="7"
                fontFamily="sans-serif"
                textAnchor="middle"
                dominantBaseline="middle"
                fontWeight="bold"
              >
                +
              </text>

              <text
                x={x} y={y + 16}
                fill={color}
                fontSize="8"
                fontFamily="DM Mono"
                textAnchor="middle"
                fontWeight="500"
              >
                {amb.id}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div
        className="absolute bottom-3 right-3 flex flex-col gap-1.5 rounded-lg p-2.5 border"
        style={{ backgroundColor: m.legendBg, borderColor: m.legendBorder, transition: 'background-color 0.2s ease' }}
      >
        {[
          { color: '#00c896', label: 'Available'   },
          { color: '#0ea5e9', label: 'On Duty'     },
          { color: '#64748b', label: 'Maintenance' },
        ].map((l) => (
          <div key={l.label} className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: l.color }} />
            <span className="text-xs font-sans" style={{ color: m.legendText }}>{l.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
