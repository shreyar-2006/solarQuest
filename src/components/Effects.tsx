import { motion } from 'framer-motion';
import { useMemo } from 'react';

type ParticleFieldProps = {
  count?: number;
  color?: 'gold' | 'orange' | 'green' | 'cyan';
  className?: string;
};

const colorMap: Record<string, string> = {
  gold: '#f59e0b',
  orange: '#f97316',
  green: '#10b981',
  cyan: '#06b6d4',
};

export function ParticleField({ count = 30, color = 'gold', className = '' }: ParticleFieldProps) {
  const particles = useMemo(
    () =>
      Array.from({ length: count }, () => ({
        id: Math.random(),
        x: Math.random() * 100,
        delay: Math.random() * 5,
        duration: 3 + Math.random() * 4,
        size: 2 + Math.random() * 4,
        opacity: 0.3 + Math.random() * 0.5,
      })),
    [count]
  );

  const c = colorMap[color];

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            bottom: '-10px',
            width: p.size,
            height: p.size,
            backgroundColor: c,
            boxShadow: `0 0 ${p.size * 2}px ${c}`,
            opacity: p.opacity,
          }}
          animate={{
            y: [0, -window.innerHeight - 100],
            opacity: [0, p.opacity, p.opacity, 0],
            x: [0, Math.random() * 60 - 30, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  );
}

export function Scanlines() {
  return (
    <div className="pointer-events-none fixed inset-0 z-[60]">
      <div
        className="absolute inset-0"
        style={{
          background:
            'repeating-linear-gradient(0deg, rgba(0,0,0,0.12) 0px, rgba(0,0,0,0.12) 1px, transparent 1px, transparent 3px)',
        }}
      />
      <motion.div
        className="absolute left-0 right-0 h-1 bg-gradient-to-b from-transparent via-amber-500/10 to-transparent"
        animate={{ y: ['-5vh', '105vh'] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  );
}

export function GlitchText({ children, className = '' }: { children: string; className?: string }) {
  return (
    <span className={`glitch-text ${className}`}>
      {children}
    </span>
  );
}

export function NeonButton({
  children,
  onClick,
  color = 'orange',
  className = '',
  disabled = false,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  color?: 'orange' | 'green' | 'gold' | 'cyan';
  className?: string;
  disabled?: boolean;
}) {
  const colors: Record<string, string> = {
    orange: 'border-laser text-laser hover:bg-laser/10 box-glow-orange',
    green: 'border-neon text-neon hover:bg-neon/10 box-glow-green',
    gold: 'border-solar text-solar hover:bg-solar/10 box-glow-gold',
    cyan: 'border-plasma text-plasma hover:bg-plasma/10 box-glow-cyan',
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.03 }}
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      onClick={onClick}
      disabled={disabled}
      className={`relative font-arcade text-[10px] sm:text-xs px-4 py-3 border-2 clip-corner transition-colors ${colors[color]} ${
        disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'
      } ${className}`}
    >
      {children}
    </motion.button>
  );
}

export function StatDial({
  label,
  value,
  max,
  unit,
  color = 'gold',
  icon,
}: {
  label: string;
  value: number;
  max?: number;
  unit?: string;
  color?: 'gold' | 'orange' | 'green' | 'cyan';
  icon?: React.ReactNode;
}) {
  const colorMap: Record<string, { text: string; border: string; bar: string; glow: string }> = {
    gold: { text: 'text-solar text-glow-gold', border: 'border-solar/40', bar: 'bg-solar', glow: 'box-glow-gold' },
    orange: { text: 'text-laser text-glow-orange', border: 'border-laser/40', bar: 'bg-laser', glow: 'box-glow-orange' },
    green: { text: 'text-neon text-glow-green', border: 'border-neon/40', bar: 'bg-neon', glow: 'box-glow-green' },
    cyan: { text: 'text-plasma text-glow-cyan', border: 'border-plasma/40', bar: 'bg-plasma', glow: 'box-glow-cyan' },
  };
  const c = colorMap[color];
  const pct = max ? Math.min(100, (value / max) * 100) : 100;

  return (
    <div className={`border-2 ${c.border} ${c.glow} clip-corner bg-black/60 p-3`}>
      <div className="flex items-center gap-2 mb-2">
        {icon && <span className={c.text}>{icon}</span>}
        <span className={`font-arcade text-[8px] ${c.text} leading-tight`}>{label}</span>
      </div>
      <div className="flex items-baseline gap-1">
        <motion.span
          key={value}
          initial={{ scale: 1.2, opacity: 0.5 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`font-mono text-2xl ${c.text}`}
        >
          {value.toLocaleString()}
        </motion.span>
        {unit && <span className={`font-mono text-sm ${c.text} opacity-70`}>{unit}</span>}
      </div>
      {max && (
        <div className="mt-2 h-2 bg-white/5 border border-white/10 overflow-hidden">
          <motion.div
            className={`h-full ${c.bar}`}
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
      )}
    </div>
  );
}
