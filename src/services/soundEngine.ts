// Motor de síntesis de audio procedural para DerivLab Empresarial
// Utiliza Web Audio API nativo para sintetizar frecuencias en tiempo real sin archivos .mp3 externos

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isEnabled: boolean = true;
  private lastChordTime: number = 0;
  private lastTickTime: number = 0;
  private slopeOsc: OscillatorNode | null = null;
  private slopeGain: GainNode | null = null;
  private slopeTimeout: number | null = null;

  constructor() {
    // La inicialización del contexto se posterga al primer gesto del usuario
    const saved = localStorage.getItem('derivlab_sound_enabled');
    if (saved !== null) {
      this.isEnabled = saved === 'true';
    }
  }

  private initContext(): AudioContext | null {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public isSoundEnabled(): boolean {
    return this.isEnabled;
  }

  public setSoundEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
    localStorage.setItem('derivlab_sound_enabled', String(enabled));
    if (!enabled && this.slopeGain && this.ctx) {
      this.slopeGain.gain.setValueAtTime(0, this.ctx.currentTime);
    }
  }

  public toggleSound(): boolean {
    this.setSoundEnabled(!this.isEnabled);
    return this.isEnabled;
  }

  /**
   * Modula la frecuencia en Hz proporcionalmente al valor de f'(x)
   * y reproduce un acorde armónico cristalino cuando |f'(x)| < 0.2 (tangente horizontal / óptimo)
   */
  public playSlopeTone(slope: number): void {
    if (!this.isEnabled) return;
    const ctx = this.initContext();
    if (!ctx) return;

    // Detectar tangente horizontal / punto óptimo (|f'(x)| < 0.2)
    if (Math.abs(slope) < 0.2) {
      const now = performance.now();
      if (now - this.lastChordTime > 400) {
        this.lastChordTime = now;
        this.playOptimalBell();
      }
      return;
    }

    // Mapear la pendiente a una frecuencia audible entre 180 Hz y 720 Hz
    // Pendiente positiva -> tonos más agudos; Pendiente negativa -> tonos más graves
    const baseFreq = 440;
    const clampedSlope = Math.max(-15, Math.min(15, slope));
    const targetFreq = baseFreq + clampedSlope * 18;

    try {
      if (!this.slopeOsc || !this.slopeGain) {
        this.slopeOsc = ctx.createOscillator();
        this.slopeGain = ctx.createGain();

        this.slopeOsc.type = 'sine';
        this.slopeOsc.frequency.setValueAtTime(targetFreq, ctx.currentTime);
        this.slopeGain.gain.setValueAtTime(0.001, ctx.currentTime);
        this.slopeGain.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 0.05);

        this.slopeOsc.connect(this.slopeGain);
        this.slopeGain.connect(ctx.destination);
        this.slopeOsc.start();
      } else {
        this.slopeOsc.frequency.setTargetAtTime(targetFreq, ctx.currentTime, 0.04);
        this.slopeGain.gain.setTargetAtTime(0.08, ctx.currentTime, 0.04);
      }

      // Detener suavemente si el usuario suelta el cursor tras 120ms
      if (this.slopeTimeout) {
        window.clearTimeout(this.slopeTimeout);
      }
      this.slopeTimeout = window.setTimeout(() => {
        if (this.slopeGain && this.ctx) {
          this.slopeGain.gain.setTargetAtTime(0.0001, this.ctx.currentTime, 0.05);
        }
      }, 120);
    } catch {
      // Ignorar errores transitorios de audio
    }
  }

  /**
   * Acorde armónico cristalino de campanas cuando |f'(x)| < 0.2 (Óptimo / Tangente Horizontal)
   */
  private playOptimalBell(): void {
    const ctx = this.initContext();
    if (!ctx) return;

    // Tríada cristalina: C6 (1046.5 Hz), E6 (1318.5 Hz), G6 (1567.98 Hz), B6 (1975.5 Hz)
    const notes = [1046.5, 1318.51, 1567.98, 1975.53];
    const now = ctx.currentTime;

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.04);

      gain.gain.setValueAtTime(0.001, now + idx * 0.04);
      gain.gain.exponentialRampToValueAtTime(0.12, now + idx * 0.04 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.04 + 0.6);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.04);
      osc.stop(now + idx * 0.04 + 0.65);
    });
  }

  /**
   * Clicks de trinquete mecánico cuya frecuencia sube conforme Δx -> 0
   */
  public playLimitTick(dx: number): void {
    if (!this.isEnabled) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const absDx = Math.max(0.001, Math.abs(dx));
    const now = performance.now();

    // Mayor proximidad a 0 produce ticks más seguidos
    const minInterval = Math.max(25, absDx * 120);
    if (now - this.lastTickTime < minInterval) return;
    this.lastTickTime = now;

    // Frecuencia del click: más agudo a menor dx
    const clickFreq = Math.min(2600, 1200 + (1 / absDx) * 15);
    const time = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(clickFreq, time);

    gain.gain.setValueAtTime(0.07, time);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.025);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(time);
    osc.stop(time + 0.03);
  }

  /**
   * Acorde triunfal de éxito para el cuaderno algebraico (C5 - E5 - G5 - C6)
   */
  public playSuccessChord(): void {
    if (!this.isEnabled) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const chord = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    const now = ctx.currentTime;

    chord.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + i * 0.06);

      gain.gain.setValueAtTime(0.001, now + i * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.14, now + i * 0.06 + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.06 + 0.7);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + i * 0.06);
      osc.stop(now + i * 0.06 + 0.75);
    });
  }

  /**
   * Golpe grave amortiguado para errores en el cuaderno algebraico
   */
  public playErrorThud(): void {
    if (!this.isEnabled) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(110, now);
    osc.frequency.exponentialRampToValueAtTime(45, now + 0.2);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.26);
  }
}

export const soundEngine = new SoundEngine();
