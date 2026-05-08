/* ─────────────────────────────────────────────
   PREMIUM UI SOUND EFFECTS
   Uses Web Audio API to generate subtle,
   satisfying micro-interaction sounds.
   ───────────────────────────────────────────── */

let audioCtx = null;

function getCtx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioCtx;
}

/** Subtle high-pitch tick on hover */
export function playHoverSound() {
  try {
    const ctx = getCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(2400, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1800, ctx.currentTime + 0.05);

    gain.gain.setValueAtTime(0.025, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.05);
  } catch (_) { /* silent fail */ }
}

/** Satisfying click sound — dual oscillator for richness */
export function playClickSound() {
  try {
    const ctx = getCtx();

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(1100, ctx.currentTime);
    osc1.frequency.exponentialRampToValueAtTime(550, ctx.currentTime + 0.08);

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(2200, ctx.currentTime);
    osc2.frequency.exponentialRampToValueAtTime(1100, ctx.currentTime + 0.05);

    gain.gain.setValueAtTime(0.05, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

    osc1.start(ctx.currentTime);
    osc2.start(ctx.currentTime);
    osc1.stop(ctx.currentTime + 0.12);
    osc2.stop(ctx.currentTime + 0.12);
  } catch (_) { /* silent fail */ }
}
