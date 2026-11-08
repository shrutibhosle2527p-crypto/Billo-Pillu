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
}

export const GameHUD: React.FC<GameHUDProps> = ({
  currentLevel,
  unlockedLevels,
  totalHearts,
  playerRole,
  onSwitchCharacter,
  onSelectLevel,
  onOpenLetter,
  onResetGame,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [musicOn, setMusicOn] = useState(sound.bgmEnabled);
  const [sfxOn, setSfxOn] = useState(sound.soundEnabled);

  const milestone = getMilestoneTier(totalHearts);
  const activeChar = CHARACTERS[playerRole];

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const toggleMusic = () => {
    const next = sound.toggleBgm();
    setMusicOn(next);
  };

  const toggleSfx = () => {
    sound.soundEnabled = !sound.soundEnabled;
    setSfxOn(sound.soundEnabled);
    if (sound.soundEnabled) sound.playJump();
  };

  const levelShortNames: Record<GameLevelId, string> = {
    1: '1. Tree',
    2: '2. Quiz',
    3: '3. Rush',
    4: '4. Treasure',
    5: '5. Vows',
  };

  return (
    <header className="w-full h-11 sm:h-12 bg-[#150522]/95 border-b border-pink-500/70 px-2 sm:px-3 flex items-center justify-between gap-1 sm:gap-2 z-30 shrink-0 select-none font-pixel">
      {/* Left: Lead Character Badge & Quick Switch */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        <button
          type="button"
          onClick={onSwitchCharacter}
          title="Click to switch lead character"
          className="flex items-center gap-1 bg-pink-950/80 hover:bg-pink-900 border border-pink-500/80 px-1.5 py-0.5 pixel-corners cursor-pointer transition-colors"
        >
          <div className="w-5 h-6 overflow-hidden flex items-end justify-center">
            <CharacterSprite role={playerRole} size={28} animation="idle" />
          </div>
          <span className="text-[8px] sm:text-[9px] text-yellow-300 font-bold whitespace-nowrap">
            {activeChar.name} 🔄
          </span>
        </button>
      </div>

      {/* Center: Clean Level Progression Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto py-0.5 max-w-[48%] justify-center">
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
              className={`px-1.5 sm:px-2 py-0.5 sm:py-1 text-[8px] pixel-corners border transition-all whitespace-nowrap cursor-pointer ${
                isCurrent
                  ? 'bg-yellow-400 text-black border-yellow-200 font-bold shadow-[0_0_6px_gold]'
                  : isUnlocked
                  ? 'bg-pink-950/70 text-pink-200 border-pink-500/60 hover:bg-pink-900'
                  : 'bg-black/40 text-gray-600 border-gray-800 opacity-50 cursor-not-allowed'
              }`}
            >
              {isUnlocked ? levelShortNames[id] : `🔒 Lvl ${id}`}
            </button>
          );
        })}

        {unlockedLevels.includes(5) && (
          <button
            onClick={() => {
              sound.playFanfare();
              onSelectLevel('FINAL_REWARD');
            }}
            className={`px-2 py-0.5 sm:py-1 text-[8px] pixel-corners border whitespace-nowrap cursor-pointer ${
              currentLevel === 'FINAL_REWARD'
                ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-bold shadow-[0_0_8px_gold]'
                : 'bg-gradient-to-r from-pink-600 to-rose-600 text-white border-yellow-300 animate-pulse'
            }`}
          >
            🏆 Finale
          </button>
        )}
      </div>

      {/* Right: Heart Counter, Letter, Audio & Utility */}
      <div className="flex items-center gap-1 sm:gap-2 shrink-0">
        {/* Heart Counter */}
        <div
          className="flex items-center gap-1 bg-black/60 px-2 py-0.5 pixel-corners border border-pink-500/80"
          title={`Milestone: ${milestone.label}`}
        >
          <span className="text-xs sm:text-sm animate-float-heart">💖</span>
          <span className="text-[10px] sm:text-xs text-yellow-300 font-bold">{totalHearts}</span>
        </div>

        {/* Love Letter Button */}
        <button
          onClick={() => {
            sound.playJump();
            onOpenLetter();
          }}
          title="Open Anniversary Love Letter"
          className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-pink-900/60 hover:bg-pink-800 text-yellow-300 border border-yellow-500/60 text-[8px] sm:text-[9px] pixel-corners flex items-center gap-1 cursor-pointer"
        >
          <span>💌</span>
          <span className="hidden sm:inline">Letter</span>
        </button>

        {/* Music Toggle */}
        <button
          onClick={toggleMusic}
          title={musicOn ? 'Mute Chiptune Music' : 'Play Chiptune Music'}
          aria-label={musicOn ? 'Mute Chiptune Music' : 'Play Chiptune Music'}
          className={`px-1.5 py-0.5 sm:py-1 text-[8px] pixel-corners border cursor-pointer ${
            musicOn
              ? 'bg-yellow-500 text-black border-yellow-300 font-bold'
              : 'bg-black/50 text-pink-300 border-pink-900'
          }`}
        >
          {musicOn ? '🎵' : '🔇'}
        </button>

        {/* SFX Toggle */}
        <button
          onClick={toggleSfx}
          title={sfxOn ? 'Mute SFX' : 'Enable SFX'}
          aria-label={sfxOn ? 'Mute SFX' : 'Enable SFX'}
          className={`px-1.5 py-0.5 sm:py-1 text-[8px] pixel-corners border cursor-pointer ${
            sfxOn
              ? 'bg-pink-800 text-white border-pink-500'
              : 'bg-black/50 text-gray-500 border-gray-800'
          }`}
        >
          {sfxOn ? '🔊' : '🔈'}
        </button>

        {/* Fullscreen Button */}
        <button
          onClick={toggleFullscreen}
          title="Toggle Fullscreen"
          aria-label="Toggle Fullscreen"
          className="px-1.5 py-0.5 sm:py-1 bg-black/50 hover:bg-pink-950 text-pink-300 border border-pink-800 text-[8px] pixel-corners cursor-pointer"
        >
          {isFullscreen ? '⛶' : '⛶'}
        </button>

        {/* Reset / Title button */}
        <button
          onClick={() => {
            if (window.confirm('Restart love quest from Level 1? Your sweet memories and love letter will be kept!')) {
              onResetGame();
            }
          }}
          title="Restart Quest from Level 1"
          aria-label="Restart Quest from Level 1"
          className="text-[8px] text-pink-400/60 hover:text-pink-300 p-0.5 cursor-pointer"
        >
          ↺
        </button>
      </div>
    </header>
  );
};
