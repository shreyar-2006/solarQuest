import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import * as LucideIcons from 'lucide-react';
import type { Achievement, LogEntry } from '@/game/types';
import { ParticleField, NeonButton, GlitchText } from './Effects';
import { playExplosion, playBeep } from '@/game/audio';

type AchievementsPanelProps = {
  achievements: Achievement[];
  onBack: () => void;
};

export function AchievementsPanel({ achievements, onBack }: AchievementsPanelProps) {
  const [explodedId, setExplodedId] = useState<string | null>(null);

  const handleBadgeClick = (achievement: Achievement) => {
    if (!achievement.unlocked) {
      playBeep(150, 0.1, 'sawtooth', 0.05);
      return;
    }
    setExplodedId(achievement.id);
    playExplosion();
    setTimeout(() => setExplodedId(null), 800);
  };

  return (
    <div className="bg-radial-plasma min-h-screen scanlines grid-bg relative overflow-hidden p-4 sm:p-6">
      <ParticleField count={15} color="cyan" />

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="flex items-center justify-between mb-6">
          <motion.h1
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="font-arcade text-lg sm:text-2xl text-plasma text-glow-cyan"
          >
            <GlitchText>ACHIEVEMENT MATRIX</GlitchText>
          </motion.h1>
          <NeonButton color="cyan" onClick={onBack}>BACK TO HQ</NeonButton>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {achievements.map((achievement, i) => {
            const Icon = (LucideIcons as any)[achievement.icon] ?? LucideIcons.Award;
            const unlocked = achievement.unlocked;

            return (
              <motion.div
                key={achievement.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.06, type: 'spring', stiffness: 150 }}
                whileHover={{ scale: 1.05 }}
                onClick={() => handleBadgeClick(achievement)}
                className={`relative p-4 border-2 clip-corner cursor-pointer overflow-hidden ${
                  unlocked
                    ? 'border-solar bg-solar/10 box-glow-gold'
                    : 'border-white/10 bg-black/60'
                }`}
              >
                {/* Explosion effect */}
                <AnimatePresence>
                  {explodedId === achievement.id && (
                    <>
                      {Array.from({ length: 12 }).map((_, j) => (
                        <motion.div
                          key={j}
                          className="absolute w-2 h-2 rounded-full"
                          style={{
                            backgroundColor: '#f59e0b',
                            top: '50%',
                            left: '50%',
                            boxShadow: '0 0 8px #f59e0b',
                          }}
                          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                          animate={{
                            x: Math.cos((j / 12) * Math.PI * 2) * 60,
                            y: Math.sin((j / 12) * Math.PI * 2) * 60,
                            opacity: 0,
                            scale: 0,
                          }}
                          transition={{ duration: 0.6, ease: 'easeOut' }}
                        />
                      ))}
                      <motion.div
                        className="absolute inset-0 rounded-full bg-solar/30"
                        initial={{ scale: 0 }}
                        animate={{ scale: 3, opacity: 0 }}
                        transition={{ duration: 0.5 }}
                      />
                    </>
                  )}
                </AnimatePresence>

                <div className="relative z-10 text-center">
                  <motion.div
                    animate={unlocked ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }}
                    className={`mb-2 ${unlocked ? 'text-solar' : 'text-white/20'}`}
                    style={unlocked ? { filter: 'drop-shadow(0 0 8px #f59e0b)' } : {}}
                  >
                    <Icon className="w-10 h-10 mx-auto" />
                  </motion.div>
                  <p className={`font-arcade text-[7px] mb-2 ${unlocked ? 'text-solar text-glow-gold' : 'text-white/20'}`}>
                    {achievement.name}
                  </p>
                  <p className={`font-mono text-sm ${unlocked ? 'text-solar/60' : 'text-white/15'}`}>
                    {unlocked ? achievement.description : '??? LOCKED ???'}
                  </p>
                  {unlocked && achievement.unlockedAt && (
                    <p className="font-mono text-xs text-solar/30 mt-2">
                      {new Date(achievement.unlockedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>

                {!unlocked && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                    <LucideIcons.Lock className="w-6 h-6 text-white/15" />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        <div className="mt-6 text-center">
          <p className="font-arcade text-[8px] text-plasma/50">
            {achievements.filter((a) => a.unlocked).length} / {achievements.length} UNLOCKED — CLICK BADGES FOR AUDIO BURSTS
          </p>
        </div>
      </div>
    </div>
  );
}

type LogsPanelProps = {
  logs: LogEntry[];
  onBack: () => void;
};

export function LogsPanel({ logs, onBack }: LogsPanelProps) {
  return (
    <div className="bg-radial-cyber min-h-screen scanlines grid-bg-green relative overflow-hidden p-4 sm:p-6">
      <ParticleField count={15} color="green" />

      <div className="max-w-3xl mx-auto relative z-10">
        <div className="flex items-center justify-between mb-6">
          <motion.h1
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="font-arcade text-lg sm:text-2xl text-neon text-glow-green"
          >
            <GlitchText>LORE ARCHIVE</GlitchText>
          </motion.h1>
          <NeonButton color="green" onClick={onBack}>BACK TO HQ</NeonButton>
        </div>

        {logs.length === 0 ? (
          <div className="cyber-border-green bg-black/70 p-8 clip-corner text-center">
            <p className="font-arcade text-[10px] text-neon/40">NO LORE LOGS YET</p>
            <p className="font-mono text-sm text-neon/30 mt-2">Complete a solar session to generate lore!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {logs.map((log, i) => (
              <motion.div
                key={log.id}
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: i * 0.08 }}
                className="cyber-border-green bg-black/70 p-4 clip-corner"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-arcade text-[7px] text-neon/50">
                    LOG #{String(logs.length - i).padStart(3, '0')}
                  </span>
                  <span className="font-mono text-sm text-neon/40">
                    {new Date(log.timestamp).toLocaleDateString()} {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <p className="font-mono text-base text-neon/90 leading-relaxed">{log.text}</p>
                <div className="flex gap-2 mt-2">
                  {log.location && (
                    <span className="font-mono text-sm text-laser/60 border border-laser/20 px-2 py-0.5">
                      {log.location}
                    </span>
                  )}
                  {log.sighting && (
                    <span className="font-mono text-sm text-plasma/60 border border-plasma/20 px-2 py-0.5">
                      {log.sighting}
                    </span>
                  )}
                  <span className="font-mono text-sm text-solar/60 border border-solar/20 px-2 py-0.5">
                    +{log.photons} photons
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
