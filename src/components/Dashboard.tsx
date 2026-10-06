import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Zap, Flame, Calendar, Clock, Trophy, Leaf } from 'lucide-react';
import type { GameState } from '@/game/types';
import { getTitle, expForLevel, SESSION_TARGETS } from '@/game/types';
import { StatDial, NeonButton, GlitchText, ParticleField } from './Effects';
import { CyberPlant } from './CyberPlant';
import { playBeep } from '@/game/audio';

type DashboardProps = {
  state: GameState;
  selectedTarget: string;
  customMinutes: number;
  onSelectTarget: (id: string) => void;
  onCustomChange: (minutes: number) => void;
  onInitiate: () => void;
  onNavigate: (screen: 'achievements' | 'logs') => void;
};

export function Dashboard({
  state,
  selectedTarget,
  customMinutes,
  onSelectTarget,
  onCustomChange,
  onInitiate,
  onNavigate,
}: DashboardProps) {
  const title = getTitle(state.level);
  const expNeeded = expForLevel(state.level);
  const expPct = (state.exp / expNeeded) * 100;
  const activeTarget = SESSION_TARGETS.find((t) => t.id === selectedTarget);
  const targetMinutes = selectedTarget === 'custom' ? customMinutes : activeTarget?.minutes ?? 15;

  return (
    <div className="bg-radial-solar min-h-screen scanlines grid-bg p-4 sm:p-6 relative overflow-hidden">
      <ParticleField count={20} color="gold" />

      {/* Header */}
      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-6 relative z-10"
      >
        <h1 className="font-arcade text-2xl sm:text-4xl text-solar text-glow-gold leading-tight">
          <GlitchText>SOLAR QUEST</GlitchText>
        </h1>
        <motion.p
          className="font-arcade text-sm sm:text-lg text-laser text-glow-orange mt-2"
          animate={{ opacity: [1, 0.7, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          ⚡ OVERCHARGE ⚡
        </motion.p>
      </motion.div>

      <div className="max-w-5xl mx-auto relative z-10 space-y-4">
        {/* Player Profile */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="cyber-border-orange bg-black/70 p-4 clip-corner"
        >
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <motion.div
                className="w-14 h-14 border-2 border-laser bg-laser/10 flex items-center justify-center clip-corner"
                animate={{ boxShadow: ['0 0 10px #f97316', '0 0 25px #f97316', '0 0 10px #f97316'] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sun className="w-7 h-7 text-laser" />
              </motion.div>
              <div>
                <p className="font-arcade text-[10px] text-solar/60">OPERATIVE</p>
                <p className="font-arcade text-sm text-laser text-glow-orange">{title}</p>
              </div>
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="font-arcade text-[8px] text-neon">LEVEL {state.level}</span>
                <span className="font-mono text-sm text-neon/70">
                  {state.exp}/{expNeeded} EXP
                </span>
              </div>
              <div className="h-3 bg-black border border-neon/30 overflow-hidden relative">
                <motion.div
                  className="h-full bg-gradient-to-r from-neon to-neon-light"
                  style={{ boxShadow: '0 0 10px #10b981' }}
                  initial={{ width: 0 }}
                  animate={{ width: `${expPct}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                />
                <motion.div
                  className="absolute inset-0 bg-white/10"
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <StatDial
            label="TOTAL UV HARVESTED"
            value={state.totalUVHarvested}
            unit="UV"
            color="orange"
            icon={<Sun className="w-3 h-3" />}
          />
          <StatDial
            label="VITAMIN D"
            value={state.vitaminD}
            unit="IU"
            color="gold"
            icon={<Flame className="w-3 h-3" />}
          />
          <StatDial
            label="DAY STREAK"
            value={state.dayStreak}
            unit="days"
            color="green"
            icon={<Calendar className="w-3 h-3" />}
          />
        </div>

        {/* Solar Core Reactor + Cyber Plant */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Session Target Selector */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="cyber-border bg-black/70 p-4 clip-corner"
          >
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-4 h-4 text-solar" />
              <h2 className="font-arcade text-[10px] text-solar text-glow-gold">SOLAR CORE REACTOR</h2>
            </div>

            <p className="font-arcade text-[8px] text-solar/50 mb-2">SELECT ABSORPTION LEVEL</p>

            <div className="space-y-2">
              {SESSION_TARGETS.map((target) => (
                <motion.button
                  key={target.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    onSelectTarget(target.id);
                    playBeep(440, 0.08, 'square', 0.1);
                  }}
                  className={`w-full text-left p-2 border-2 clip-corner transition-colors font-arcade text-[8px] ${
                    selectedTarget === target.id
                      ? 'border-laser bg-laser/15 text-laser box-glow-orange'
                      : 'border-solar/20 text-solar/50 hover:border-solar/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{target.label}</span>
                    <span className="font-mono text-sm">{target.minutes}m</span>
                  </div>
                  <p className="font-mono text-sm text-solar/40 mt-1 normal-case">{target.description}</p>
                </motion.button>
              ))}

              {/* Custom */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  onSelectTarget('custom');
                  playBeep(440, 0.08, 'square', 0.1);
                }}
                className={`w-full text-left p-2 border-2 clip-corner transition-colors font-arcade text-[8px] ${
                  selectedTarget === 'custom'
                    ? 'border-plasma bg-plasma/15 text-plasma box-glow-cyan'
                    : 'border-plasma/20 text-plasma/50 hover:border-plasma/50'
                }`}
              >
                <span>CUSTOM CHARGE</span>
                {selectedTarget === 'custom' && (
                  <div className="flex items-center gap-2 mt-2">
                    <input
                      type="range"
                      min={5}
                      max={120}
                      step={5}
                      value={customMinutes}
                      onChange={(e) => onCustomChange(Number(e.target.value))}
                      className="flex-1 accent-cyan-400"
                    />
                    <span className="font-mono text-sm text-plasma">{customMinutes}m</span>
                  </div>
                )}
              </motion.button>
            </div>

            {/* Massive Action Button */}
            <div className="mt-4">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={onInitiate}
                className="w-full font-arcade text-[10px] sm:text-xs px-4 py-4 border-4 border-double border-laser bg-laser/10 text-laser clip-corner box-glow-orange relative overflow-hidden"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-laser/20 to-transparent"
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                />
                <span className="relative z-10">⚡ INITIATE SOLAR ABSORPTION SEQUENCE ⚡</span>
              </motion.button>
              <p className="text-center font-mono text-sm text-solar/40 mt-2">
                TARGET: {targetMinutes} MINUTES — GO OUTSIDE!
              </p>
            </div>
          </motion.div>

          {/* Cyber-Plant */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="cyber-border-green bg-black/70 p-4 clip-corner grid-bg-green relative overflow-hidden"
          >
            <div className="flex items-center gap-2 mb-3">
              <Leaf className="w-4 h-4 text-neon" />
              <h2 className="font-arcade text-[10px] text-neon text-glow-green">CYBER-PLANT</h2>
            </div>
            <div className="flex flex-col items-center justify-center py-4 relative">
              <CyberPlant growth={state.plantGrowth} size="lg" />
              <div className="mt-4 w-full">
                <div className="flex justify-between mb-1">
                  <span className="font-arcade text-[7px] text-neon/50">GROWTH</span>
                  <span className="font-mono text-sm text-neon">{state.plantGrowth}%</span>
                </div>
                <div className="h-2 bg-black border border-neon/20 overflow-hidden">
                  <motion.div
                    className="h-full bg-neon"
                    style={{ boxShadow: '0 0 6px #10b981' }}
                    initial={{ width: 0 }}
                    animate={{ width: `${state.plantGrowth}%` }}
                    transition={{ duration: 1 }}
                  />
                </div>
              </div>
              <p className="font-mono text-sm text-neon/40 mt-2 text-center">
                {state.plantGrowth < 20 && 'A sprout emerges from digital soil...'}
                {state.plantGrowth >= 20 && state.plantGrowth < 50 && 'Stem strengthening. Leaves unfolding.'}
                {state.plantGrowth >= 50 && state.plantGrowth < 80 && 'Blossoms detected. Energy rising!'}
                {state.plantGrowth >= 80 && 'FULL BLOOM! Photosynthesis at maximum!'}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Bottom row: Battery gauge + quick links */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Nuclear Sunlight Battery */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="cyber-border-cyan bg-black/70 p-4 clip-corner sm:col-span-1"
          >
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-plasma" />
              <h3 className="font-arcade text-[8px] text-plasma text-glow-cyan">NUCLEAR SUNLIGHT BATTERY</h3>
            </div>
            <BatteryGauge totalSeconds={state.totalSecondsOutside} />
          </motion.div>

          {/* Achievements quick */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="cyber-border bg-black/70 p-4 clip-corner flex flex-col items-center justify-center"
          >
            <Trophy className="w-8 h-8 text-solar mb-2" />
            <p className="font-arcade text-[10px] text-solar text-glow-gold">
              {state.achievements.filter((a) => a.unlocked).length}/{state.achievements.length}
            </p>
            <p className="font-arcade text-[7px] text-solar/50 mb-3">ACHIEVEMENTS</p>
            <NeonButton color="gold" onClick={() => onNavigate('achievements')}>
              VIEW BADGES
            </NeonButton>
          </motion.div>

          {/* Logs quick */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="cyber-border-green bg-black/70 p-4 clip-corner flex flex-col items-center justify-center"
          >
            <Clock className="w-8 h-8 text-neon mb-2" />
            <p className="font-arcade text-[10px] text-neon text-glow-green">
              {state.logs.length}
            </p>
            <p className="font-arcade text-[7px] text-neon/50 mb-3">LORE LOGS</p>
            <NeonButton color="green" onClick={() => onNavigate('logs')}>
              VIEW LOGS
            </NeonButton>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function BatteryGauge({ totalSeconds }: { totalSeconds: number }) {
  const hours = totalSeconds / 3600;
  const maxHours = 10;
  const pct = Math.min(100, (hours / maxHours) * 100);
  const bars = 12;
  const filledBars = Math.floor((pct / 100) * bars);

  return (
    <div>
      <div className="flex justify-between mb-2">
        <span className="font-mono text-sm text-plasma/70">{hours.toFixed(2)}h</span>
        <span className="font-mono text-sm text-plasma/50">/ {maxHours}h</span>
      </div>
      <div className="flex gap-1 h-12">
        {Array.from({ length: bars }).map((_, i) => (
          <motion.div
            key={i}
            className="flex-1 border border-plasma/30"
            initial={{ backgroundColor: 'rgba(6,182,212,0.05)' }}
            animate={{
              backgroundColor: i < filledBars ? 'rgba(6,182,212,0.8)' : 'rgba(6,182,212,0.05)',
              boxShadow: i < filledBars ? '0 0 8px #06b6d4' : 'none',
            }}
            transition={{ delay: i * 0.05 }}
          />
        ))}
      </div>
      <p className="font-mono text-sm text-plasma/40 mt-2 text-center">
        {pct < 25 && 'LOW CHARGE'}
        {pct >= 25 && pct < 50 && 'STABLE'}
        {pct >= 50 && pct < 75 && 'OPTIMAL'}
        {pct >= 75 && 'OVERCHARGING!'}
      </p>
    </div>
  );
}
