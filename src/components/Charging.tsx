import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { Sun, AlertTriangle, Zap, X } from 'lucide-react';
import { ParticleField, GlitchText, NeonButton } from './Effects';
import { playAlarm, playPowerUp } from '@/game/audio';

type ChargingProps = {
  targetMinutes: number;
  onComplete: (secondsElapsed: number, photons: number) => void;
  onCancel: () => void;
};

export function Charging({ targetMinutes, onComplete, onCancel }: ChargingProps) {
  const targetSeconds = targetMinutes * 60;
  const [elapsed, setElapsed] = useState(0);
  const [photons, setPhotons] = useState(0);
  const [showWarning, setShowWarning] = useState(true);
  const [completed, setCompleted] = useState(false);
  const startTimeRef = useRef(Date.now());
  const rafRef = useRef<number>(0);

  useEffect(() => {
    startTimeRef.current = Date.now();
    playPowerUp();

    const alarmInterval = setInterval(() => {
      playAlarm();
    }, 8000);
    const warningInterval = setInterval(() => {
      setShowWarning((s) => !s);
    }, 3000);

    const tick = () => {
      const secs = (Date.now() - startTimeRef.current) / 1000;
      setElapsed(secs);
      // Simulate photon harvesting - random rate
      setPhotons((p) => p + Math.floor(20 + Math.random() * 80));

      if (secs >= targetSeconds && !completed) {
        setCompleted(true);
        clearInterval(alarmInterval);
        clearInterval(warningInterval);
        playPowerUp();
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      clearInterval(alarmInterval);
      clearInterval(warningInterval);
      cancelAnimationFrame(rafRef.current);
    };
  }, [targetSeconds]);

  const pct = Math.min(100, (elapsed / targetSeconds) * 100);
  const remaining = Math.max(0, targetSeconds - elapsed);
  const mins = Math.floor(remaining / 60);
  const secs = Math.floor(remaining % 60);
  const totalMins = Math.floor(elapsed / 60);
  const totalSecs = Math.floor(elapsed % 60);

  const handleComplete = () => {
    onComplete(Math.floor(elapsed), photons);
  };

  return (
    <div className="bg-radial-solar min-h-screen scanlines relative overflow-hidden flex flex-col items-center justify-center p-4">
      {/* Falling golden sunlight particles */}
      <ParticleField count={50} color="gold" />
      <ParticleField count={20} color="orange" />

      {/* Warning Banner */}
      <AnimatePresence>
        {showWarning && !completed && (
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-40 border-4 border-double border-laser bg-black/90 px-4 py-2 clip-corner box-glow-orange"
          >
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-laser animate-pulse" />
              <p className="font-arcade text-[8px] sm:text-[10px] text-laser text-glow-orange">
                <GlitchText>ALERT: PHOTO-SENSORY ENGINES ENGAGED. STEP AWAY FROM DEVICE!</GlitchText>
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cancel button */}
      <button
        onClick={onCancel}
        className="fixed top-4 right-4 z-40 text-solar/40 hover:text-solar transition-colors"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Solar Core */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Rotating rings */}
        <div className="relative w-72 h-72 sm:w-96 sm:h-96 flex items-center justify-center mb-6">
          {/* Outer ring */}
          <motion.div
            className="absolute inset-0 border-2 border-laser/30 rounded-full"
            style={{ borderTopColor: '#f97316', borderRightColor: '#f97316' }}
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          />
          {/* Middle ring */}
          <motion.div
            className="absolute inset-8 border-2 border-solar/30 rounded-full"
            style={{ borderBottomColor: '#f59e0b', borderLeftColor: '#f59e0b' }}
            animate={{ rotate: -360 }}
            transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
          />
          {/* Inner ring with segments */}
          <motion.div
            className="absolute inset-16 border-2 border-plasma/30 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          >
            {[0, 90, 180, 270].map((deg) => (
              <div
                key={deg}
                className="absolute w-3 h-3 bg-plasma rounded-full"
                style={{
                  top: '50%',
                  left: '50%',
                  transform: `rotate(${deg}deg) translateY(-50%) translateX(50%)`,
                  boxShadow: '0 0 10px #06b6d4',
                }}
              />
            ))}
          </motion.div>

          {/* Core */}
          <motion.div
            className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full"
            style={{
              background: `radial-gradient(circle, #fbbf24 0%, #f97316 50%, #b45309 100%)`,
              boxShadow: `0 0 ${20 + pct / 2}px #f97316, 0 0 ${40 + pct}px #f59e0b`,
            }}
            animate={{
              scale: completed ? [1, 1.5, 1] : [1, 1.08, 1],
              rotate: completed ? [0, 180, 360] : 0,
            }}
            transition={{
              duration: completed ? 1.5 : 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              >
                <Sun className="w-12 h-12 sm:w-16 sm:h-16 text-white" />
              </motion.div>
            </div>
          </motion.div>

          {/* Energy beams */}
          {!completed &&
            [0, 60, 120, 180, 240, 300].map((deg) => (
              <motion.div
                key={deg}
                className="absolute origin-center"
                style={{
                  width: '50%',
                  height: '2px',
                  top: '50%',
                  left: '50%',
                  background: 'linear-gradient(90deg, transparent, #f97316, transparent)',
                  transform: `rotate(${deg}deg)`,
                  transformOrigin: '0 50%',
                }}
                animate={{ opacity: [0, 1, 0], scaleX: [0.3, 1, 0.3] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: deg / 360,
                }}
              />
            ))}
        </div>

        {/* Charging progress bar */}
        <div className="w-full max-w-md mb-4">
          <div className="flex justify-between mb-2">
            <span className="font-arcade text-[8px] text-solar text-glow-gold">
              <GlitchText>REACTOR CHARGE</GlitchText>
            </span>
            <span className="font-arcade text-[8px] text-solar">{Math.floor(pct)}%</span>
          </div>
          <div className="h-6 bg-black border-2 border-solar/40 overflow-hidden relative">
            <motion.div
              className="h-full bg-gradient-to-r from-solar via-laser to-solar"
              style={{ boxShadow: '0 0 15px #f59e0b' }}
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
            />
            <motion.div
              className="absolute inset-0 bg-white/10"
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
          </div>
        </div>

        {/* Timer + Stats */}
        <div className="grid grid-cols-2 gap-4 w-full max-w-md mb-4">
          <div className="cyber-border bg-black/70 p-3 clip-corner text-center">
            <p className="font-arcade text-[7px] text-solar/50 mb-1">
              {completed ? 'CHARGE COMPLETE' : 'TIME REMAINING'}
            </p>
            <motion.p
              key={completed ? 'done' : `${mins}:${secs}`}
              animate={completed ? { scale: [1, 1.2, 1] } : {}}
              className="font-mono text-3xl text-solar text-glow-gold"
            >
              {completed ? '00:00' : `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`}
            </motion.p>
            <p className="font-mono text-sm text-solar/40">ELAPSED {String(totalMins).padStart(2, '0')}:{String(totalSecs).padStart(2, '0')}</p>
          </div>
          <div className="cyber-border-orange bg-black/70 p-3 clip-corner text-center">
            <p className="font-arcade text-[7px] text-laser/50 mb-1">PHOTONS ABSORBED</p>
            <motion.p
              key={Math.floor(photons / 100)}
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              className="font-mono text-3xl text-laser text-glow-orange"
            >
              +{photons.toLocaleString()}
            </motion.p>
            <p className="font-mono text-sm text-laser/40">PHOTONS/S: {Math.floor(photons / Math.max(1, elapsed))}</p>
          </div>
        </div>

        {/* Rapid ticking stats */}
        <div className="grid grid-cols-3 gap-2 w-full max-w-md mb-6">
          <TickerStat label="UV INTENSITY" color="text-solar" value={Math.floor(50 + Math.random() * 50)} unit="W/m²" />
          <TickerStat label="VITAMIN D" color="text-neon" value={Math.floor(photons / 100)} unit="IU" />
          <TickerStat label="CORE TEMP" color="text-laser" value={Math.floor(2000 + pct * 30)} unit="K" />
        </div>

        {/* Complete button or status */}
        {completed ? (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleComplete}
              className="font-arcade text-[10px] sm:text-sm px-8 py-5 border-4 border-double border-laser bg-laser/15 text-laser clip-corner box-glow-orange relative overflow-hidden"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-laser/30 to-transparent"
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              />
              <span className="relative z-10">💥 MISSION COMPLETE — VENT REACTOR (RETURN) 💥</span>
            </motion.button>
          </motion.div>
        ) : (
          <div className="text-center">
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="font-arcade text-[8px] text-solar/60 mb-3"
            >
              ⏳ CHARGING IN PROGRESS... GO OUTSIDE! ⏳
            </motion.div>
            <NeonButton color="gold" onClick={() => {
              setElapsed(targetSeconds);
              setCompleted(true);
            }}>
              <Zap className="inline w-3 h-3 mr-1" /> SKIP TO VENT
            </NeonButton>
          </div>
        )}
      </div>
    </div>
  );
}

function TickerStat({ label, value, unit, color }: { label: string; value: number; unit: string; color: string }) {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    const interval = setInterval(() => {
      setDisplayValue(value + Math.floor(Math.random() * 10));
    }, 500);
    return () => clearInterval(interval);
  }, [value]);

  return (
    <div className="border border-white/10 bg-black/50 p-2 clip-corner text-center">
      <p className="font-arcade text-[6px] text-white/30 mb-1">{label}</p>
      <motion.p
        key={Math.floor(displayValue / 5)}
        initial={{ opacity: 0.5 }}
        animate={{ opacity: 1 }}
        className={`font-mono text-lg ${color}`}
      >
        {displayValue.toLocaleString()}
      </motion.p>
      <p className="font-mono text-xs text-white/30">{unit}</p>
    </div>
  );
}
