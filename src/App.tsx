import { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useGameState } from '@/game/useGameState';
import { Dashboard } from '@/components/Dashboard';
import { Charging } from '@/components/Charging';
import { Results } from '@/components/Results';
import { AchievementsPanel, LogsPanel } from '@/components/Panels';
import { Scanlines } from '@/components/Effects';
import { SESSION_TARGETS, type Location, type Sighting } from '@/game/types';
import { playPowerUp } from '@/game/audio';

type Screen = 'dashboard' | 'charging' | 'results' | 'achievements' | 'logs';

function App() {
  const { state, completeSession, newlyUnlocked, clearNewlyUnlocked } = useGameState();
  const [screen, setScreen] = useState<Screen>('dashboard');
  const [selectedTarget, setSelectedTarget] = useState('quick');
  const [customMinutes, setCustomMinutes] = useState(20);
  const [sessionData, setSessionData] = useState({ seconds: 0, photons: 0 });

  const activeTarget = SESSION_TARGETS.find((t) => t.id === selectedTarget);
  const targetMinutes = selectedTarget === 'custom' ? customMinutes : activeTarget?.minutes ?? 15;

  const handleInitiate = useCallback(() => {
    playPowerUp();
    setScreen('charging');
  }, []);

  const handleChargingComplete = useCallback(
    (secondsElapsed: number, photons: number) => {
      setSessionData({ seconds: secondsElapsed, photons });
      setScreen('results');
    },
    []
  );

  const handleResultsComplete = useCallback(
    (location: Location, sighting: Sighting) => {
      completeSession(sessionData.seconds, sessionData.photons, location, sighting);
      setScreen('dashboard');
    },
    [completeSession, sessionData]
  );

  return (
    <>
      <Scanlines />

      {/* Achievement unlock notifications */}
      <AnimatePresence>
        {newlyUnlocked.length > 0 && (
          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            className="fixed top-4 right-4 z-[70] space-y-2"
          >
            {newlyUnlocked.map((ach) => (
              <motion.div
                key={ach.id}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="cyber-border-orange bg-black/90 p-3 clip-corner box-glow-orange max-w-xs"
              >
                <p className="font-arcade text-[8px] text-laser text-glow-orange mb-1">ACHIEVEMENT UNLOCKED!</p>
                <p className="font-arcade text-[10px] text-solar text-glow-gold">{ach.name}</p>
                <p className="font-mono text-sm text-solar/50 mt-1">{ach.description}</p>
              </motion.div>
            ))}
            <button
              onClick={clearNewlyUnlocked}
              className="block w-full text-center font-mono text-sm text-white/40 hover:text-white/70 transition-colors"
            >
              DISMISS
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {screen === 'dashboard' && (
          <motion.div key="dashboard" exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.3 }}>
            <Dashboard
              state={state}
              selectedTarget={selectedTarget}
              customMinutes={customMinutes}
              onSelectTarget={setSelectedTarget}
              onCustomChange={setCustomMinutes}
              onInitiate={handleInitiate}
              onNavigate={(s) => setScreen(s)}
            />
          </motion.div>
        )}

        {screen === 'charging' && (
          <motion.div key="charging" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <Charging
              targetMinutes={targetMinutes}
              onComplete={handleChargingComplete}
              onCancel={() => setScreen('dashboard')}
            />
          </motion.div>
        )}

        {screen === 'results' && (
          <motion.div key="results" initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <Results
              photons={sessionData.photons}
              secondsElapsed={sessionData.seconds}
              onComplete={handleResultsComplete}
              onReturnHome={() => setScreen('dashboard')}
            />
          </motion.div>
        )}

        {screen === 'achievements' && (
          <motion.div key="achievements" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50 }} transition={{ duration: 0.3 }}>
            <AchievementsPanel achievements={state.achievements} onBack={() => setScreen('dashboard')} />
          </motion.div>
        )}

        {screen === 'logs' && (
          <motion.div key="logs" initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.3 }}>
            <LogsPanel logs={state.logs} onBack={() => setScreen('dashboard')} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default App;
