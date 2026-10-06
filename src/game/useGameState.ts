import { useState, useEffect, useCallback, useRef } from 'react';
import type { GameState, Achievement, LogEntry, Location, Sighting } from './types';
import { ALL_ACHIEVEMENTS, expForLevel } from './types';

const STORAGE_KEY = 'solar_quest_overcharge_save';

function defaultState(): GameState {
  return {
    level: 0,
    exp: 0,
    totalUVHarvested: 0,
    vitaminD: 0,
    dayStreak: 0,
    totalSecondsOutside: 0,
    plantGrowth: 0,
    lastSessionDate: null,
    sessionsCompleted: 0,
    achievements: ALL_ACHIEVEMENTS.map((a) => ({ ...a, unlocked: false })),
    logs: [],
  };
}

function loadState(): GameState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw) as GameState;
    const base = defaultState();
    // Merge to handle new achievements added in updates
    const mergedAchievements = base.achievements.map((a) => {
      const existing = parsed.achievements?.find((e) => e.id === a.id);
      return existing ? { ...a, unlocked: existing.unlocked, unlockedAt: existing.unlockedAt } : a;
    });
    return { ...base, ...parsed, achievements: mergedAchievements };
  } catch {
    return defaultState();
  }
}

function saveState(state: GameState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

function todayStr(): string {
  return new Date().toDateString();
}

function checkAchievements(state: GameState): { state: GameState; newlyUnlocked: Achievement[] } {
  const newlyUnlocked: Achievement[] = [];
  const achievements = state.achievements.map((a) => {
    if (a.unlocked) return a;
    let shouldUnlock = false;
    switch (a.id) {
      case 'solar_flare': shouldUnlock = state.sessionsCompleted >= 1; break;
      case 'photosynthesis_king': shouldUnlock = state.totalUVHarvested >= 10000; break;
      case 'light_speed_wanderer': shouldUnlock = state.sessionsCompleted >= 5; break;
      case 'cosmic_overlord': shouldUnlock = state.level >= 9; break;
      case 'streak_master': shouldUnlock = state.dayStreak >= 3; break;
    }
    if (shouldUnlock) {
      const unlocked = { ...a, unlocked: true, unlockedAt: Date.now() };
      newlyUnlocked.push(unlocked);
      return unlocked;
    }
    return a;
  });
  return { state: { ...state, achievements }, newlyUnlocked };
}

export function useGameState() {
  const [state, setState] = useState<GameState>(() => loadState());
  const [newlyUnlocked, setNewlyUnlocked] = useState<Achievement[]>([]);
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    saveState(state);
  }, [state]);

  const completeSession = useCallback(
    (secondsElapsed: number, photons: number, location: Location, sighting: Sighting) => {
      setState((prev) => {
        const today = todayStr();
        let dayStreak = prev.dayStreak;
        if (prev.lastSessionDate !== today) {
          const yesterday = new Date(Date.now() - 86400000).toDateString();
          if (prev.lastSessionDate === yesterday) {
            dayStreak = prev.dayStreak + 1;
          } else {
            dayStreak = 1;
          }
        } else if (prev.dayStreak === 0) {
          dayStreak = 1;
        }

        const vitaminGain = Math.floor(photons / 100);
        const expGain = Math.floor(photons / 50);
        let level = prev.level;
        let exp = prev.exp + expGain;
        while (exp >= expForLevel(level)) {
          exp -= expForLevel(level);
          level++;
        }

        const plantGrowth = Math.min(100, prev.plantGrowth + Math.floor(secondsElapsed / 30));

        const log: LogEntry = {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          timestamp: Date.now(),
          text: generateLore(photons, location, sighting),
          photons,
          location,
          sighting,
        };

        let nextState: GameState = {
          ...prev,
          level,
          exp,
          totalUVHarvested: prev.totalUVHarvested + photons,
          vitaminD: prev.vitaminD + vitaminGain,
          dayStreak,
          totalSecondsOutside: prev.totalSecondsOutside + secondsElapsed,
          plantGrowth,
          lastSessionDate: today,
          sessionsCompleted: prev.sessionsCompleted + 1,
          logs: [log, ...prev.logs].slice(0, 20),
        };

        // Location/sighting based achievements
        const ach = nextState.achievements.map((a) => {
          if (a.unlocked) return a;
          let unlock = false;
          if (a.id === 'cloud_witness' && sighting === 'Celestial Clouds') unlock = true;
          if (a.id === 'forest_recon' && location === 'Cyber Forest') unlock = true;
          if (a.id === 'overcharge' && secondsElapsed >= 3600) unlock = true;
          return unlock ? { ...a, unlocked: true, unlockedAt: Date.now() } : a;
        });
        nextState = { ...nextState, achievements: ach };

        const result = checkAchievements(nextState);
        if (result.newlyUnlocked.length > 0) {
          setNewlyUnlocked((prev) => [...prev, ...result.newlyUnlocked]);
        }
        return result.state;
      });
    },
    []
  );

  const clearNewlyUnlocked = useCallback(() => setNewlyUnlocked([]), []);

  const resetGame = useCallback(() => {
    const fresh = defaultState();
    setState(fresh);
  }, []);

  return { state, completeSession, resetGame, newlyUnlocked, clearNewlyUnlocked };
}

function generateLore(photons: number, location: Location, sighting: Sighting): string {
  const events = [
    `You returned with +${photons} Photons from the ${location}. Your Cyber-Plant mutation has accelerated!`,
    `Sensors detected ${sighting} during your ${location} expedition. Data uploaded to the grid.`,
    `Reactor vented ${photons} photons of pure solar energy. ${location} signature confirmed.`,
    `Overcharge event! ${photons} photons harvested. ${sighting} encoded in photo-memory.`,
    `The ${location} yielded ${photons} UV units. Cyber-Plant resonance at critical levels!`,
    `WARP SUCCESS: ${photons} photons absorbed. ${sighting} logged in the Stellar Archive.`,
  ];
  return events[Math.floor(Math.random() * events.length)];
}
