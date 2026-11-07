import React, { useState } from 'react';
import { sound } from '../utils/audio';

export const AudioControls: React.FC = () => {
  const [bgmActive, setBgmActive] = useState(sound.bgmEnabled);
  const [sfxActive, setSfxActive] = useState(sound.soundEnabled);

  const toggleMusic = () => {
    const newState = sound.toggleBgm();
    setBgmActive(newState);
  };

  const toggleSfx = () => {
    sound.soundEnabled = !sound.soundEnabled;
    setSfxActive(sound.soundEnabled);
    if (sound.soundEnabled) sound.playJump();
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={toggleMusic}
        title={bgmActive ? 'Mute Chiptune Music' : 'Play 8-Bit Chiptune Music'}
        className={`px-2 py-1 text-[10px] border flex items-center gap-1 transition-all ${
          bgmActive
            ? 'bg-yellow-500 text-black border-yellow-300 font-bold animate-pulse'
            : 'bg-black/40 text-pink-300 border-pink-800 hover:bg-pink-900/40'
        }`}
      >
        <span>🎵</span>
        <span>{bgmActive ? 'Music ON' : 'Music OFF'}</span>
      </button>

      <button
        onClick={toggleSfx}
        title={sfxActive ? 'Mute SFX' : 'Enable SFX'}
        className={`px-2 py-1 text-[10px] border flex items-center gap-1 transition-all ${
          sfxActive
            ? 'bg-pink-800 text-white border-pink-400'
            : 'bg-black/40 text-gray-500 border-gray-800'
        }`}
      >
        <span>{sfxActive ? '🔊 SFX' : '🔇 Muted'}</span>
      </button>
    </div>
  );
};
