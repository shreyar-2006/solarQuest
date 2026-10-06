export type GameScreen = 'dashboard' | 'charging' | 'results';

export type SessionTarget = {
  id: string;
  label: string;
  minutes: number;
  description: string;
};

export type Location = 'Cyber Forest' | 'Urban Rooftop' | 'Nuclear Garden' | 'Sun Drenched Park';
export type Sighting = 'Alien Fauna' | 'Solar Rays' | 'Organic Life' | 'Celestial Clouds';

export type Achievement = {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: number;
};

export type LogEntry = {
  id: string;
  timestamp: number;
  text: string;
  photons: number;
  location?: Location;
  sighting?: Sighting;
};

export type GameState = {
  level: number;
  exp: number;
  totalUVHarvested: number;
  vitaminD: number;
  dayStreak: number;
  totalSecondsOutside: number;
  plantGrowth: number;
  lastSessionDate: string | null;
  achievements: Achievement[];
  logs: LogEntry[];
  sessionsCompleted: number;
};

export const SESSION_TARGETS: SessionTarget[] = [
  { id: 'quick', label: 'Quick Charge', minutes: 15, description: '15m — Rapid solar infusion' },
  { id: 'moderate', label: 'Moderate Irradiation', minutes: 30, description: '30m — Steady photon bath' },
  { id: 'overload', label: 'Cosmic Overload', minutes: 60, description: '1hr — Full spectrum absorption' },
];

export const LOCATIONS: Location[] = ['Cyber Forest', 'Urban Rooftop', 'Nuclear Garden', 'Sun Drenched Park'];
export const SIGHTINGS: Sighting[] = ['Alien Fauna', 'Solar Rays', 'Organic Life', 'Celestial Clouds'];

export const ALL_ACHIEVEMENTS: Omit<Achievement, 'unlocked' | 'unlockedAt'>[] = [
  { id: 'solar_flare', name: 'Solar Flare', description: 'Complete your first absorption session', icon: 'Flame' },
  { id: 'photosynthesis_king', name: 'Photosynthesis King', description: 'Harvest 10,000 total photons', icon: 'Crown' },
  { id: 'light_speed_wanderer', name: 'Light-Speed Wanderer', description: 'Complete 5 solar sessions', icon: 'Rocket' },
  { id: 'cosmic_overlord', name: 'Cosmic Overlord', description: 'Reach level 10', icon: 'Skull' },
  { id: 'streak_master', name: 'Streak Master', description: 'Maintain a 3-day streak', icon: 'Zap' },
  { id: 'cloud_witness', name: 'Cloud Witness', description: 'Spot Celestial Clouds', icon: 'Cloud' },
  { id: 'forest_recon', name: 'Forest Recon', description: 'Explore the Cyber Forest', icon: 'TreePine' },
  { id: 'overcharge', name: 'OVERCHARGE', description: 'Complete a Cosmic Overload session', icon: 'Atom' },
];

export const TITLES: string[] = [
  'SOLAR APPRENTICE',
  'PHOTON INITIATE',
  'UV SCOUT',
  'RADIANCE SEEKER',
  'SOLAR KNIGHT',
  'STELLAR WARDEN',
  'PHOTON COMMANDER',
  'SOLAR ARCHON',
  'STELLAR SOVEREIGN',
  'STELLAR OVERLORD',
];

export function getTitle(level: number): string {
  return TITLES[Math.min(level, TITLES.length - 1)] ?? TITLES[0];
}

export function expForLevel(level: number): number {
  return 100 + level * 50;
}
