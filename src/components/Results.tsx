import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Sun, MapPin, Eye, ScanLine, Sparkles, Check, ChevronRight } from 'lucide-react';
import { LOCATIONS, SIGHTINGS, type Location, type Sighting } from '@/game/types';
import { ParticleField, GlitchText, NeonButton } from './Effects';
import { playScan, playPowerUp, playBeep } from '@/game/audio';

type ResultsProps = {
  photons: number;
  secondsElapsed: number;
  onComplete: (location: Location, sighting: Sighting) => void;
  onReturnHome: () => void;
};

export function Results({ photons, secondsElapsed, onComplete, onReturnHome }: ResultsProps) {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [selectedSighting, setSelectedSighting] = useState<Sighting | null>(null);
  const [scanning, setScanning] = useState(false);
  const [decoded, setDecoded] = useState(false);
  const [lore, setLore] = useState<string | null>(null);

  const canDecode = selectedLocation && selectedSighting;

  const handleDecode = () => {
    if (!canDecode) return;
    setScanning(true);
    playScan();
    setTimeout(() => {
      setScanning(false);
      setDecoded(true);
      playPowerUp();
      const generatedLore = generateLoreText(photons, selectedLocation!, selectedSighting!);
      setLore(generatedLore);
    }, 2500);
  };

  const handleConfirm = () => {
    if (selectedLocation && selectedSighting) {
      onComplete(selectedLocation, selectedSighting);
    }
  };

  const mins = Math.floor(secondsElapsed / 60);
  const secs = Math.floor(secondsElapsed % 60);

  return (
    <div className="bg-radial-cyber min-h-screen scanlines grid-bg relative overflow-hidden p-4 sm:p-6">
      <ParticleField count={25} color="green" />

      {/* Scan overlay */}
      <AnimatePresence>
        {scanning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center"
          >
            <div className="relative w-80 h-80 border-2 border-plasma overflow-hidden">
              {/* Matrix-style glitch */}
              {Array.from({ length: 30 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute font-mono text-sm text-plasma/60"
                  style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
                  animate={{ opacity: [0, 1, 0], y: [0, 20, 0] }}
                  transition={{ duration: 0.3, delay: Math.random() * 0.5, repeat: Infinity }}
                >
                  {Math.random() > 0.5 ? '1' : '0'}
                </motion.div>
              ))}
              {/* Scanning line */}
              <motion.div
                className="absolute left-0 right-0 h-1 bg-plasma"
                style={{ boxShadow: '0 0 20px #06b6d4, 0 0 40px #06b6d4' }}
                animate={{ top: ['0%', '100%', '0%'] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <ScanLine className="w-16 h-16 text-plasma animate-pulse" />
              </div>
              <p className="absolute bottom-4 left-0 right-0 text-center font-arcade text-[8px] text-plasma text-glow-cyan">
                <GlitchText>DECODING PHOTO-DATA...</GlitchText>
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-6"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 0.5 }}
            className="inline-block mb-2"
          >
            <Sun className="w-12 h-12 text-solar text-glow-gold mx-auto" />
          </motion.div>
          <h1 className="font-arcade text-xl sm:text-2xl text-solar text-glow-gold">
            <GlitchText>SOLAR RETURN — SECTOR ANALYSIS</GlitchText>
          </h1>
        </motion.div>

        {/* Session stats summary */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-3 mb-6"
        >
          <ResultStat label="PHOTONS" value={`+${photons.toLocaleString()}`} color="orange" icon={<Sun className="w-4 h-4" />} />
          <ResultStat label="DURATION" value={`${mins}m ${secs}s`} color="gold" icon={<ScanLine className="w-4 h-4" />} />
          <ResultStat label="VITAMIN D" value={`+${Math.floor(photons / 100)} IU`} color="green" icon={<Sparkles className="w-4 h-4" />} />
        </motion.div>

        {!decoded ? (
          <>
            {/* Location selection */}
            <motion.div
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="cyber-border-orange bg-black/70 p-4 clip-corner mb-4"
            >
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="w-4 h-4 text-laser" />
                <h2 className="font-arcade text-[10px] text-laser text-glow-orange">WHERE DID YOU RETURN FROM?</h2>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {LOCATIONS.map((loc) => (
                  <motion.button
                    key={loc}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      setSelectedLocation(loc);
                      playBeep(523, 0.1, 'square', 0.1);
                    }}
                    className={`p-3 border-2 clip-corner font-arcade text-[8px] transition-colors ${
                      selectedLocation === loc
                        ? 'border-laser bg-laser/15 text-laser box-glow-orange'
                        : 'border-laser/20 text-laser/40 hover:border-laser/50'
                    }`}
                  >
                    {loc}
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Sighting selection */}
            <motion.div
              initial={{ x: 30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="cyber-border-green bg-black/70 p-4 clip-corner mb-4"
            >
              <div className="flex items-center gap-2 mb-3">
                <Eye className="w-4 h-4 text-neon" />
                <h2 className="font-arcade text-[10px] text-neon text-glow-green">WHAT DID YOU SIGHT?</h2>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {SIGHTINGS.map((sight) => (
                  <motion.button
                    key={sight}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      setSelectedSighting(sight);
                      playBeep(659, 0.1, 'square', 0.1);
                    }}
                    className={`p-3 border-2 clip-corner font-arcade text-[8px] transition-colors ${
                      selectedSighting === sight
                        ? 'border-neon bg-neon/15 text-neon box-glow-green'
                        : 'border-neon/20 text-neon/40 hover:border-neon/50'
                    }`}
                  >
                    {sight}
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Decode button */}
            <div className="text-center">
              <motion.button
                whileHover={canDecode ? { scale: 1.05 } : {}}
                whileTap={canDecode ? { scale: 0.95 } : {}}
                onClick={handleDecode}
                disabled={!canDecode}
                className={`font-arcade text-[10px] sm:text-sm px-8 py-4 border-4 border-double clip-corner relative overflow-hidden ${
                  canDecode
                    ? 'border-plasma bg-plasma/10 text-plasma box-glow-cyan cursor-pointer'
                    : 'border-white/10 text-white/20 cursor-not-allowed'
                }`}
              >
                {canDecode && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-plasma/20 to-transparent"
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2 justify-center">
                  <ScanLine className="w-4 h-4" />
                  DECODE PHOTO-DATA
                </span>
              </motion.button>
              {!canDecode && (
                <p className="font-mono text-sm text-white/30 mt-2">SELECT LOCATION AND SIGHTING TO DECODE</p>
              )}
            </div>
          </>
        ) : (
          /* Decoded results */
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="space-y-4"
          >
            {/* Lore log */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="cyber-border bg-black/70 p-4 clip-corner"
            >
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-solar" />
                <h2 className="font-arcade text-[10px] text-solar text-glow-gold">LORE LOG GENERATED</h2>
              </div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="font-mono text-lg text-solar/90 leading-relaxed border-l-2 border-solar/40 pl-4"
              >
                {lore}
              </motion.p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Badge text={`LOCATION: ${selectedLocation}`} color="orange" />
                <Badge text={`SIGHTING: ${selectedSighting}`} color="green" />
              </div>
            </motion.div>

            {/* Unlocked power-up badges */}
            <UnlockedBadges photons={photons} location={selectedLocation!} sighting={selectedSighting!} />

            {/* Confirm button */}
            <div className="text-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleConfirm}
                className="font-arcade text-[10px] sm:text-sm px-8 py-4 border-4 border-double border-neon bg-neon/10 text-neon clip-corner box-glow-green"
              >
                <Check className="inline w-4 h-4 mr-2" />
                CONFIRM & RETURN TO HQ
                <ChevronRight className="inline w-4 h-4 ml-2" />
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Return home link */}
        <div className="text-center mt-6">
          <button
            onClick={onReturnHome}
            className="font-mono text-sm text-white/30 hover:text-white/60 transition-colors underline"
          >
            ABANDON SESSION & RETURN TO HQ
          </button>
        </div>
      </div>
    </div>
  );
}

function ResultStat({ label, value, color, icon }: { label: string; value: string; color: 'orange' | 'gold' | 'green'; icon: React.ReactNode }) {
  const colors = {
    orange: 'border-laser/40 text-laser text-glow-orange box-glow-orange',
    gold: 'border-solar/40 text-solar text-glow-gold box-glow-gold',
    green: 'border-neon/40 text-neon text-glow-green box-glow-green',
  };
  return (
    <div className={`border-2 ${colors[color]} bg-black/70 p-3 clip-corner text-center`}>
      <div className="flex justify-center mb-1">{icon}</div>
      <p className="font-arcade text-[6px] opacity-50 mb-1">{label}</p>
      <p className="font-mono text-xl">{value}</p>
    </div>
  );
}

function Badge({ text, color }: { text: string; color: 'orange' | 'green' }) {
  const colors = {
    orange: 'border-laser/40 text-laser bg-laser/5',
    green: 'border-neon/40 text-neon bg-neon/5',
  };
  return (
    <span className={`px-2 py-1 border font-mono text-sm ${colors[color]} clip-corner`}>{text}</span>
  );
}

const POWER_UP_BADGES = [
  { id: 'solar_flare', name: 'Solar Flare', icon: '🔥', desc: 'First photon burst detected' },
  { id: 'photo_king', name: 'Photosynthesis King', icon: '👑', desc: 'Massive UV absorption' },
  { id: 'light_speed', name: 'Light-Speed Wanderer', icon: '🚀', desc: 'Instant solar traversal' },
  { id: 'cloud_witness', name: 'Cloud Witness', icon: '☁️', desc: 'Celestial clouds scanned' },
  { id: 'forest_recon', name: 'Forest Recon', icon: '🌲', desc: 'Cyber forest mapped' },
  { id: 'overcharge', name: 'OVERCHARGE', icon: '⚛️', desc: 'Cosmic overload achieved' },
];

function UnlockedBadges({ photons, location, sighting }: { photons: number; location: Location; sighting: Sighting }) {
  const unlocked = POWER_UP_BADGES.filter((b) => {
    if (b.id === 'solar_flare' && photons > 500) return true;
    if (b.id === 'photo_king' && photons > 2000) return true;
    if (b.id === 'light_speed') return true;
    if (b.id === 'cloud_witness' && sighting === 'Celestial Clouds') return true;
    if (b.id === 'forest_recon' && location === 'Cyber Forest') return true;
    return false;
  });

  if (unlocked.length === 0) return null;

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="cyber-border-orange bg-black/70 p-4 clip-corner"
    >
      <h2 className="font-arcade text-[10px] text-laser text-glow-orange mb-3">⚡ POWER-UP BADGES UNLOCKED ⚡</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {unlocked.map((badge, i) => (
          <motion.div
            key={badge.id}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.4 + i * 0.15, type: 'spring', stiffness: 200 }}
            className="border-2 border-solar/40 bg-solar/5 p-3 clip-corner text-center box-glow-gold"
          >
            <motion.div
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
              className="text-3xl mb-2"
            >
              {badge.icon}
            </motion.div>
            <p className="font-arcade text-[7px] text-solar text-glow-gold mb-1">{badge.name}</p>
            <p className="font-mono text-sm text-solar/50">{badge.desc}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function generateLoreText(photons: number, location: Location, sighting: Sighting): string {
  const templates = [
    `You returned with +${photons} Photons. Your Cyber-Plant mutation has accelerated! The ${location} yielded unprecedented solar data. ${sighting} signature encoded in the Stellar Archive.`,
    `REACTOR LOG: Absorption event at ${location} confirmed. ${photons} photons integrated. ${sighting} detected on photo-sensors — classification: BEYOND CLASSIFIED. Overcharge levels nominal.`,
    `WARP COMPLETE. ${location} expedition resulted in ${photons} photon units. ${sighting} observed through solar visor — data suggests extraplanetary origin. Cyber-Plant growth surge detected.`,
    `SOLAR CORE VENTED: ${photons} photons of pure ${location} energy. ${sighting} pattern matches no known spectrum. Vitamin D synthesis at critical levels. The Overcharge protocol is working.`,
    `INCREDIBLE HARVEST: ${photons} photons from the ${location}! ${sighting} manifestation logged. Your operative status has been updated. The Cyber-Plant resonates with new solar frequencies.`,
  ];
  return templates[Math.floor(Math.random() * templates.length)];
}
