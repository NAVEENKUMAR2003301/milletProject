// Web Audio API sound engine — no audio files needed.
// Usage: const { play } = useSound(); play('pop');

let ctx = null;

function getCtx() {
  if (typeof window === 'undefined') return null;
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

function tone({
  freq = 440,
  type = 'sine',
  duration = 0.15,
  gain = 0.15,
  delay = 0,
  sweep = null,
}) {
  const ac = getCtx();
  if (!ac) return;
  const osc = ac.createOscillator();
  const g = ac.createGain();
  osc.type = type;
  const now = ac.currentTime + delay;
  osc.frequency.setValueAtTime(freq, now);
  if (sweep) osc.frequency.exponentialRampToValueAtTime(sweep.to, now + duration);
  g.gain.setValueAtTime(0.0001, now);
  g.gain.exponentialRampToValueAtTime(gain, now + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  osc.connect(g);
  g.connect(ac.destination);
  osc.start(now);
  osc.stop(now + duration + 0.02);
}

const sounds = {
  // UI feedback
  pop: () => {
    tone({ freq: 660, type: 'sine', duration: 0.12, gain: 0.18, sweep: { to: 990 } });
  },
  whoosh: () => {
    tone({ freq: 200, type: 'sawtooth', duration: 0.25, gain: 0.08, sweep: { to: 800 } });
  },
  tick: () => {
    tone({ freq: 900, type: 'square', duration: 0.06, gain: 0.1 });
  },
  click: () => {
    tone({ freq: 500, type: 'triangle', duration: 0.05, gain: 0.12 });
  },
  buzz: () => {
    tone({ freq: 120, type: 'sawtooth', duration: 0.3, gain: 0.15 });
  },

  // Celebration
  magic: () => {
    // Arpeggio chime — magical confirmation
    const notes = [523.25, 659.25, 783.99, 1046.5, 1318.5];
    notes.forEach((f, i) => {
      tone({ freq: f, type: 'sine', duration: 0.35, gain: 0.16, delay: i * 0.08 });
      tone({ freq: f * 2, type: 'triangle', duration: 0.25, gain: 0.05, delay: i * 0.08 });
    });
  },
  sparkle: () => {
    // Quick ascending twinkles
    const notes = [1046.5, 1318.5, 1568, 2093];
    notes.forEach((f, i) => {
      tone({ freq: f, type: 'sine', duration: 0.14, gain: 0.11, delay: i * 0.05 });
    });
  },
  success: () => {
    // Two-note confirmation: C5 → G5
    tone({ freq: 523.25, type: 'sine', duration: 0.18, gain: 0.16, delay: 0 });
    tone({ freq: 783.99, type: 'sine', duration: 0.35, gain: 0.16, delay: 0.16 });
    tone({ freq: 1567.98, type: 'triangle', duration: 0.4, gain: 0.06, delay: 0.16 });
  },
};

export function useSound() {
  const play = (name) => {
    const fn = sounds[name];
    if (fn) {
      try {
        fn();
      } catch {
        // silent fail — audio not critical
      }
    }
  };
  return { play };
}