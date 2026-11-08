import React from 'react';
import { CharacterRole } from '../types';
import { sound } from '../utils/audio';
import { CharacterSprite, SUNSET_BG_URL } from './CharacterSprite';

interface OpeningScreenProps {
  playerRole: CharacterRole;
  onSelectRole: (role: CharacterRole) => void;
  onStartGame: () => void;
}

export const OpeningScreen: React.FC<OpeningScreenProps> = ({
  playerRole,
  onSelectRole,
  onStartGame,
}) => {
  return (
    <div
      className="relative w-full h-full flex flex-col justify-between p-4 md:p-6 text-center overflow-hidden select-none font-pixel animate-fade-in"
      style={{
        backgroundImage: `url(${SUNSET_BG_URL})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Soft atmospheric gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#110521]/75 via-[#1a0830]/55 to-[#0d0317]/85 pointer-events-none" />

      {/* Floating Heart Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <span className="absolute top-4 left-8 text-2xl animate-float-heart">💖</span>
        <span className="absolute top-12 right-12 text-3xl animate-float-heart" style={{ animationDelay: '300ms' }}>💕</span>
        <span className="absolute bottom-20 left-16 text-xl animate-float-heart" style={{ animationDelay: '700ms' }}>✨</span>
        <span className="absolute bottom-28 right-24 text-2xl animate-float-heart" style={{ animationDelay: '500ms' }}>💛</span>
      </div>

      {/* Top Banner Tagline */}
      <div className="relative z-10 pt-1">
        <span className="text-[9px] md:text-[10px] text-pink-300 tracking-widest uppercase bg-[#160624]/85 px-4 py-1 pixel-corners border border-pink-500/60 shadow">
          ✨ A 1-Year Anniversary Love Story — Billo & Pillu ✨
        </span>
      </div>

      {/* Center Cinematic Lockup: Title & Authentic Characters */}
      <div className="relative z-10 flex flex-col items-center justify-center my-auto">
        <h1 className="font-pixel text-2xl sm:text-4xl md:text-5xl text-yellow-300 font-black tracking-widest uppercase drop-shadow-[0_4px_16px_rgba(255,215,0,0.6)] mb-1">
          BILLO & PILLU
        </h1>
        <h2 className="font-pixel text-[11px] sm:text-xs md:text-sm text-pink-300 uppercase tracking-widest mb-2 drop-shadow">
          THE 1-YEAR LOVE QUEST
        </h2>

        <p className="font-retro text-xl sm:text-2xl md:text-3xl text-pink-100 max-w-xl leading-relaxed drop-shadow mb-4 px-2">
          "365 DAYS. INFINITE MEMORIES. ONE FAVOURITE PERSON."
        </p>

        {/* Character Selection Cards - Authentic sprites side-by-side on same baseline */}
        <div className="flex items-end justify-center gap-4 sm:gap-8 my-1">
          {/* Billo Card */}
          <button
            type="button"
            onClick={() => {
              sound.playJump();
              onSelectRole('billo');
            }}
            className={`flex flex-col items-center cursor-pointer transition-all duration-150 p-2.5 pixel-corners ${
              playerRole === 'billo'
                ? 'bg-pink-950/85 border-2 border-yellow-300 shadow-[0_0_16px_rgba(255,112,166,0.8)] scale-105'
                : 'bg-black/50 border border-pink-800/60 opacity-80 hover:opacity-100'
            }`}
          >
            <div className="h-[120px] sm:h-[136px] flex items-end justify-center">
              <CharacterSprite
                role="billo"
                size={104}
                animation={playerRole === 'billo' ? 'happy' : 'idle'}
                showHeart={playerRole === 'billo'}
                showNameTag={true}
              />
            </div>
            <span className="text-[8px] text-yellow-200 mt-1.5 font-bold">
              {playerRole === 'billo' ? '👑 Lead Character' : 'Play as Billo'}
            </span>
          </button>

          {/* Glowing Heart Center */}
          <div className="flex flex-col items-center pb-4 px-1">
            <span className="text-2xl sm:text-3xl text-rose-500 animate-float-heart drop-shadow-[0_0_12px_rgba(255,0,80,0.8)]">
              ❤️
            </span>
            <span className="text-[9px] text-pink-300 mt-1 font-retro text-xl sm:text-2xl whitespace-nowrap">
              365 Days
            </span>
          </div>

          {/* Pillu Card */}
          <button
            type="button"
            onClick={() => {
              sound.playJump();
              onSelectRole('pillu');
            }}
            className={`flex flex-col items-center cursor-pointer transition-all duration-150 p-2.5 pixel-corners ${
              playerRole === 'pillu'
                ? 'bg-blue-950/85 border-2 border-yellow-300 shadow-[0_0_16px_rgba(76,201,240,0.8)] scale-105'
                : 'bg-black/50 border border-blue-900/60 opacity-80 hover:opacity-100'
            }`}
          >
            <div className="h-[120px] sm:h-[136px] flex items-end justify-center">
              <CharacterSprite
                role="pillu"
                size={104}
                animation={playerRole === 'pillu' ? 'happy' : 'idle'}
                showHeart={playerRole === 'pillu'}
                showNameTag={true}
              />
            </div>
            <span className="text-[8px] text-yellow-200 mt-1.5 font-bold">
              {playerRole === 'pillu' ? '👑 Lead Character' : 'Play as Pillu'}
            </span>
          </button>
        </div>
      </div>

      {/* Start Button & Controls Hint */}
      <div className="relative z-10 flex flex-col items-center gap-1.5 pb-2">
        <button
          onClick={() => {
            sound.playFanfare();
            sound.toggleBgm(true);
            onStartGame();
          }}
          className="px-8 py-3 bg-gradient-to-r from-yellow-400 via-pink-500 to-rose-500 hover:from-yellow-300 hover:to-rose-400 text-black font-pixel text-xs md:text-sm font-black uppercase pixel-corners shadow-[0_0_24px_rgba(255,215,0,0.6)] animate-pulse transition-transform active:scale-95 cursor-pointer"
        >
          ▶ PRESS START TO BEGIN QUEST!
        </button>

        <span className="text-[8px] text-pink-300/80">
          Arrow Keys / WASD for Movement • Space / Enter / Mouse to Interact
        </span>
      </div>
    </div>
  );
};
