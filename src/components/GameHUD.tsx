import React, { useState } from 'react';
import { CharacterRole, GameLevelId } from '../types';
import { sound } from '../utils/audio';
import { CHARACTERS, getMilestoneTier } from '../utils/storage';
import { CharacterSprite } from './CharacterSprite';

interface GameHUDProps {
  currentLevel: GameLevelId | 'TITLE' | 'FINAL_REWARD';
  unlockedLevels: number[];
  totalHearts: number;
  playerRole: CharacterRole;
  onSwitchCharacter: () => void;
  onSelectLevel: (lvl: GameLevelId | 'FINAL_REWARD') => void;
  onOpenLetter: () => void;
  onResetGame: () => void;
  onHome: () => void;
}

const LEVEL_NAMES: Record<GameLevelId, string> = {
  1: 'Our Story Begins',
  2: 'Relationship Quiz',
  3: 'The Heart Rush',
  4: 'Treasure Hunt',
  5: 'The Final Quest',
};

export const GameHUD: React.FC<GameHUDProps> = ({
  currentLevel,
  unlockedLevels,
  totalHearts,
  playerRole,
  onSwitchCharacter,
  onSelectLevel,
  onOpenLetter,
  onResetGame,
  onHome,
}) => {
  const [musicOn, setMusicOn] = useState(sound.bgmEnabled);
  const [sfxOn, setSfxOn] = useState(sound.soundEnabled);

  const milestone = getMilestoneTier(totalHearts);
  const activeChar = CHARACTERS[playerRole];

  const toggleMusic = () => {
    const next = sound.toggleBgm();
    setMusicOn(next);
  };

  const toggleSfx = () => {
    sound.soundEnabled = !sound.soundEnabled;
    setSfxOn(sound.soundEnabled);
    if (sound.soundEnabled) sound.playJump();
  };

  const currentLevelName =
    currentLevel === 'FINAL_REWARD'
      ? 'Anniversary Reward'
      : currentLevel === 'TITLE'
      ? 'Title'
      : `Ch. ${currentLevel}: ${LEVEL_NAMES[currentLevel]}`;

  return (
    <header className="w-full h-11 sm:h-12 bg-[#150522]/95 border-b border-pink-500/70 px-2 sm:px-3 flex items-center justify-between gap-1.5 sm:gap-2 z-30 shrink-0 select-none font-pixel">
      {/* Left: Home button + Chapter name */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        <button
          type="button"
          onClick={() => { sound.playJump(); onHome(); }}
          title="Open Main Menu"
          aria-label="Open Main Menu"
          className="flex items-center gap-1 bg-pink-950/80 hover:bg-pink-900 border border-yellow-400/80 px-2 py-1 pixel-corners cursor-pointer transition-colors"
        >
          <span className="text-sm">🏠</span>
          <span className="text-[8px] sm:text-[9px] text-yellow-300 font-bold">Home</span>
        </button>

        <div className="hidden sm:flex items-center gap-1 bg-black/40 px-2 py-0.5 pixel-corners border border-pink-800/60">
          <span className="text-[8px] text-pink-300">📍</span>
          <span className="text-[8px] text-yellow-200 font-bold whitespace-nowrap max-w-[120px] truncate">
            {currentLevelName}
          </span>
        </div>
      </div>

      {/* Center: Level progression tabs */}
      <div className="flex items-center gap-0.5 sm:gap-1 overflow-x-auto py-0.5 justify-center">
        {[1, 2, 3, 4, 5].map((lvlNum) => {
          const id = lvlNum as GameLevelId;
          const isUnlocked = unlockedLevels.includes(id);
          const isCurrent = currentLevel === id;

          return (
            <button
              key={id}
              disabled={!isUnlocked}
              onClick={() => {
                sound.playJump();
                onSelectLevel(id);
              }}
              aria-label={`Go to Chapter ${id}`}
              className={`w-6 h-6 sm:w-7 sm:h-7 text-[8px] pixel-corners border transition-all flex items-center justify-center cursor-pointer ${
                isCurrent
                  ? 'bg-yellow-400 text-black border-yellow-200 font-bold shadow-[0_0_6px_gold]'
                  : isUnlocked
                  ? 'bg-pink-950/70 text-pink-200 border-pink-500/60 hover:bg-pink-900'
                  : 'bg-black/40 text-gray-600 border-gray-800 opacity-50 cursor-not-allowed'
              }`}
            >
              {isUnlocked ? lvlNum : '🔒'}
            </button>
          );
        })}
      </div>

      {/* Right: Hearts, Character, Audio */}
      <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
        {/* Heart Counter */}
        <div
          className="flex items-center gap-1 bg-black/60 px-2 py-0.5 pixel-corners border border-pink-500/80"
          title={`Milestone: ${milestone.label}`}
        >
          <span className="text-xs animate-float-heart">💖</span>
          <span className="text-[10px] sm:text-xs text-yellow-300 font-bold">{totalHearts}</span>
        </div>

        {/* Character switch */}
        <button
          type="button"
          onClick={onSwitchCharacter}
          title="Click to switch lead character"
          aria-label="Switch lead character"
          className="flex items-center gap-1 bg-pink-950/80 hover:bg-pink-900 border border-pink-500/80 px-1 py-0.5 pixel-corners cursor-pointer transition-colors"
        >
          <div className="w-5 h-6 overflow-hidden flex items-end justify-center">
            <CharacterSprite role={playerRole} size={28} animation="idle" />
          </div>
          <span className="text-[7px] sm:text-[8px] text-yellow-300 font-bold whitespace-nowrap">
            {activeChar.name} 🔄
          </span>
        </button>

        {/* Letter */}
        <button
          onClick={() => { sound.playJump(); onOpenLetter(); }}
          title="Open Anniversary Love Letter"
          aria-label="Open Love Letter"
          className="px-1.5 py-0.5 bg-pink-900/60 hover:bg-pink-800 text-yellow-300 border border-yellow-500/60 text-[8px] pixel-corners cursor-pointer"
        >
          💌
        </button>

        {/* Music */}
        <button
          onClick={toggleMusic}
          title={musicOn ? 'Mute Music' : 'Play Music'}
          aria-label={musicOn ? 'Mute Music' : 'Play Music'}
          className={`px-1.5 py-0.5 text-[8px] pixel-corners border cursor-pointer ${
            musicOn
              ? 'bg-yellow-500 text-black border-yellow-300 font-bold'
              : 'bg-black/50 text-pink-300 border-pink-900'
          }`}
        >
          {musicOn ? '🎵' : '🔇'}
        </button>

        {/* SFX */}
        <button
          onClick={toggleSfx}
          title={sfxOn ? 'Mute SFX' : 'Enable SFX'}
          aria-label={sfxOn ? 'Mute SFX' : 'Enable SFX'}
          className={`px-1.5 py-0.5 text-[8px] pixel-corners border cursor-pointer ${
            sfxOn
              ? 'bg-pink-800 text-white border-pink-500'
              : 'bg-black/50 text-gray-500 border-gray-800'
          }`}
        >
          {sfxOn ? '🔊' : '🔈'}
        </button>
      </div>
    </header>
  );
};
