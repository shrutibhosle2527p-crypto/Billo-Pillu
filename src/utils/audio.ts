// Web Audio API Retro 8-bit Chiptune Sound & Music Synthesizer

class RetroAudioEngine {
  private ctx: AudioContext | null = null;
  private isBgmPlaying = false;
  private bgmTimeout: number | null = null;
  public soundEnabled = true;
  public bgmEnabled = false;

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  // Play a simple tone
  public playTone(freq: number, type: OscillatorType, duration: number, gainValue = 0.1) {
    if (!this.soundEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(gainValue, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch {
      // Audio autoplay blocked or unsupported
    }
  }

  // SFX: Heart / Coin Pickup
  public playHeartPickup() {
    if (!this.soundEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.setValueAtTime(880.00, now + 0.08); // A5
      osc.frequency.setValueAtTime(1174.66, now + 0.16); // D6

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.35);
    } catch {
      // Ignore
    }
  }

  // SFX: Jump / Interact
  public playJump() {
    if (!this.soundEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(600, now + 0.15);

      gain.gain.setValueAtTime(0.1, now);
      gain.gain.linearRampToValueAtTime(0.001, now + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.15);
    } catch {
      // Ignore
    }
  }

  // SFX: Crystal Found Fanfare
  public playFanfare() {
    if (!this.soundEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const notes = [440, 554.37, 659.25, 880]; // A4, C#5, E5, A5
      notes.forEach((freq, idx) => {
        setTimeout(() => {
          this.playTone(freq, 'triangle', 0.25, 0.2);
        }, idx * 120);
      });
    } catch {
      // Ignore
    }
  }

  // SFX: Victory
  public playVictory() {
    this.playFanfare();
  }


  // SFX: Attack / Hug
  public playLoveBurst() {
    if (!this.soundEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(900, now + 0.2);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.25);
    } catch {
      // Ignore
    }
  }

  // SFX: Dialog typewriter click
  public playBlip() {
    if (!this.soundEnabled) return;
    this.playTone(700 + Math.random() * 150, 'square', 0.03, 0.03);
  }

  // Romantic 8-bit chiptune loop
  public toggleBgm(forceState?: boolean) {
    if (forceState !== undefined) {
      this.bgmEnabled = forceState;
    } else {
      this.bgmEnabled = !this.bgmEnabled;
    }

    if (this.bgmEnabled) {
      this.startBgmLoop();
    } else {
      this.stopBgm();
    }
    return this.bgmEnabled;
  }

  private startBgmLoop() {
    if (this.isBgmPlaying) return;
    this.isBgmPlaying = true;
    this.initCtx();

    // Sweet romantic retro melody notes: C4, E4, G4, B4, C5, A4, F4, G4...
    const melody = [
      { f: 261.63, d: 250 }, // C4
      { f: 329.63, d: 250 }, // E4
      { f: 392.00, d: 250 }, // G4
      { f: 493.88, d: 250 }, // B4
      { f: 523.25, d: 400 }, // C5
      { f: 440.00, d: 250 }, // A4
      { f: 349.23, d: 250 }, // F4
      { f: 392.00, d: 500 }, // G4
      { f: 329.63, d: 250 }, // E4
      { f: 261.63, d: 250 }, // C4
      { f: 293.66, d: 250 }, // D4
      { f: 392.00, d: 400 }, // G4
      { f: 440.00, d: 250 }, // A4
      { f: 493.88, d: 250 }, // B4
      { f: 523.25, d: 600 }, // C5
    ];

    let noteIndex = 0;

    const playNext = () => {
      if (!this.bgmEnabled || !this.isBgmPlaying) {
        this.isBgmPlaying = false;
        return;
      }
      const note = melody[noteIndex];
      this.playTone(note.f, 'triangle', note.d / 1000 * 0.9, 0.05);

      // Add gentle bass root tone occasionally
      if (noteIndex % 3 === 0) {
        this.playTone(note.f / 2, 'sine', 0.4, 0.04);
      }

      noteIndex = (noteIndex + 1) % melody.length;
      this.bgmTimeout = window.setTimeout(playNext, note.d);
    };

    playNext();
  }

  public stopBgm() {
    this.isBgmPlaying = false;
    if (this.bgmTimeout) {
      clearTimeout(this.bgmTimeout);
      this.bgmTimeout = null;
    }
  }
}

export const sound = new RetroAudioEngine();
