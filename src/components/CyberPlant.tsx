import { motion } from 'framer-motion';
import { useMemo } from 'react';

export function CyberPlant({ growth, size = 'md' }: { growth: number; size?: 'sm' | 'md' | 'lg' }) {
  // growth 0-100 controls plant height and blossoms
  const stemHeight = 30 + (growth / 100) * 60;
  const blossoms = Math.floor(growth / 15);
  const sizeClass = size === 'sm' ? 'w-32 h-32' : size === 'lg' ? 'w-56 h-56' : 'w-40 h-40';

  const blossomPositions = useMemo(
    () =>
      Array.from({ length: 7 }, (_, i) => ({
        x: Math.sin(i * 1.5) * 20,
        y: -i * 12 - 10,
        delay: i * 0.3,
        color: ['#f59e0b', '#f97316', '#10b981', '#06b6d4'][i % 4],
      })),
    []
  );

  return (
    <div className={`relative ${sizeClass} flex items-end justify-center`}>
      {/* Pot */}
      <div className="relative z-10">
        <div className="w-16 h-3 bg-gradient-to-b from-amber-700 to-amber-900 border-2 border-amber-600" />
        <div className="w-20 h-10 bg-gradient-to-b from-amber-800 to-amber-950 border-2 border-amber-600 -mt-0.5 clip-corner" style={{ clipPath: 'polygon(8% 0, 92% 0, 82% 100%, 18% 100%)' }}>
          <div className="flex items-center justify-center h-full pt-2">
            <span className="font-arcade text-[6px] text-amber-500/60">SOIL</span>
          </div>
        </div>
      </div>

      {/* Stem */}
      <motion.div
        className="absolute bottom-12 w-1 bg-neon"
        style={{ boxShadow: '0 0 8px #10b981' }}
        animate={{ height: [stemHeight, stemHeight + 3, stemHeight] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Leaves */}
      {growth > 10 && (
        <>
          <motion.div
            className="absolute bg-neon rounded-full opacity-80"
            style={{ width: 14, height: 8, bottom: stemHeight * 0.4 + 48, left: '45%', boxShadow: '0 0 6px #10b981' }}
            animate={{ rotate: [-30, -25, -30] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <motion.div
            className="absolute bg-neon rounded-full opacity-80"
            style={{ width: 14, height: 8, bottom: stemHeight * 0.4 + 48, right: '45%', boxShadow: '0 0 6px #10b981' }}
            animate={{ rotate: [30, 25, 30] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        </>
      )}

      {/* Blossoms */}
      {Array.from({ length: blossoms }).map((_, i) => {
        const pos = blossomPositions[i];
        if (!pos) return null;
        return (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: 8,
              height: 8,
              bottom: stemHeight + 48,
              left: `calc(50% + ${pos.x}px)`,
              backgroundColor: pos.color,
              boxShadow: `0 0 12px ${pos.color}, 0 0 20px ${pos.color}`,
            }}
            animate={{
              y: [pos.y, pos.y - 5, pos.y],
              opacity: [0.7, 1, 0.7],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 2,
              delay: pos.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        );
      })}

      {/* Glow aura */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(circle, rgba(16,185,129,${0.05 + growth / 500}) 0%, transparent 60%)`,
        }}
        animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
}
