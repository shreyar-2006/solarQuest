let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    try {
      audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch {
      return null;
    }
  }
  return audioCtx;
}

export function playBeep(freq: number, duration: number, type: OscillatorType = 'square', volume = 0.15) {
  const ctx = getCtx();
  if (!ctx) return;
  if (ctx.state === 'suspended') ctx.resume();

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, ctx.currentTime);
  gain.gain.setValueAtTime(volume, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + duration);
}

export function playChord(freqs: number[], duration: number, type: OscillatorType = 'square') {
  freqs.forEach((f) => playBeep(f, duration, type, 0.08));
}

export function playExplosion() {
  const ctx = getCtx();
  if (!ctx) return;
  if (ctx.state === 'suspended') ctx.resume();

  const noise = ctx.createBufferSource();
  const buffer = ctx.createBuffer(1, ctx.sampleRate * 0.3, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
  }
  noise.buffer = buffer;

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.3, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);

  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(1000, ctx.currentTime);
  filter.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.3);

  noise.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  noise.start(ctx.currentTime);
  noise.stop(ctx.currentTime + 0.3);
}

export function playPowerUp() {
  const notes = [261.63, 329.63, 392.0, 523.25];
  notes.forEach((n, i) => {
    setTimeout(() => playBeep(n, 0.15, 'square', 0.12), i * 80);
  });
}

export function playAlarm() {
  playBeep(880, 0.1, 'sawtooth', 0.1);
  setTimeout(() => playBeep(660, 0.1, 'sawtooth', 0.1), 120);
  setTimeout(() => playBeep(880, 0.1, 'sawtooth', 0.1), 240);
}

export function playScan() {
  for (let i = 0; i < 8; i++) {
    setTimeout(() => playBeep(200 + i * 100, 0.05, 'sine', 0.08), i * 60);
  }
}
