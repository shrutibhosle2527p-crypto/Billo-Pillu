import React from 'react';
import { CharacterRole } from '../types';

// Transparent character sprite PNGs with zero white background boxes
export const BILLO_SPRITE_URL = '/assets/aistudio/billo_transparent.png';
export const PILLU_SPRITE_URL = '/assets/aistudio/pillu_transparent.png';

// Fallback / original paths (also synchronized with transparent assets)
export const BILLO_ORIGINAL_URL = '/assets/aistudio/Gemini_Generated_Image_h5v0okh5v0okh5v0_167d589b.png';
export const PILLU_ORIGINAL_URL = '/assets/aistudio/Gemini_Generated_Image_88zpy88zpy88zpy8_536514b5.png';

export const ROMANTIC_TREE_BG = '/assets/aistudio/1020839440603042677_58873fbc.jpeg';
export const SUNSET_BG_URL = '/src/assets/images/pixel_romantic_sunset_hills_1794072810744.jpg';
export const NIGHT_BG_URL = '/src/assets/images/pixel_starry_midnight_forest_1794072810882.jpg';
export const MEADOW_BG_URL = '/src/assets/images/pixel_romantic_picnic_meadow_1794072811763.jpg';

interface CharacterSpriteProps {
  role: CharacterRole;
  size?: number;
  direction?: 'left' | 'right';
  animation?: 'idle' | 'walking' | 'happy' | 'celebrate';
  showHeart?: boolean;
  showNameTag?: boolean;
  dialogueBubble?: string | null;
  reaction?: 'blush' | 'heart' | 'sparkle' | 'exclamation' | null;
  className?: string;
  onClick?: () => void;
}

export const CharacterSprite: React.FC<CharacterSpriteProps> = ({
  role,
  size = 96,
  direction = 'right',
  animation = 'idle',
  showHeart = false,
  showNameTag = false,
  dialogueBubble = null,
  reaction = null,
  className = '',
  onClick,
}) => {
  const isBillo = role === 'billo';
  const spriteSrc = isBillo ? BILLO_SPRITE_URL : PILLU_SPRITE_URL;
  const name = isBillo ? 'Billo' : 'Pillu';
  const roleColor = isBillo ? '#ff70a6' : '#4cc9f0';

  const getAnimationClass = () => {
    switch (animation) {
      case 'walking':
        return 'animate-character-walk';
      case 'celebrate':
        return 'animate-celebrate';
      case 'happy':
        return 'animate-character-idle';
      case 'idle':
      default:
        return 'animate-character-idle';
    }
  };

  return (
    <div
      onClick={onClick}
      className={`relative inline-flex flex-col items-center justify-end select-none ${className} ${
        onClick ? 'cursor-pointer' : ''
      }`}
      style={{ width: size, height: size * 1.5 }}
    >
      {/* Dynamic Dialogue Speech Bubble Above Character */}
      {dialogueBubble && (
        <div className="absolute -top-12 z-40 bg-[#fffdf5] text-gray-950 border-2 border-[#b5179e] px-2 py-0.5 pixel-corners shadow-[0_4px_12px_rgba(0,0,0,0.6)] text-[8px] sm:text-[9px] whitespace-nowrap max-w-[200px] text-center animate-fade-in pointer-events-none">
          <span className="font-bold text-[#8f107b]">{dialogueBubble}</span>
          {/* Retro triangle pointer tail */}
          <div className="absolute left-1/2 -bottom-1.5 -translate-x-1/2 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] border-t-[#b5179e]" />
        </div>
      )}

      {/* Character Reaction Emoji */}
      {reaction && !dialogueBubble && (
        <span className="absolute -top-7 text-lg sm:text-xl animate-bounce z-20 pointer-events-none drop-shadow">
          {reaction === 'heart'
            ? '💖'
            : reaction === 'sparkle'
            ? '✨'
            : reaction === 'blush'
            ? '🥰'
            : '❗'}
        </span>
      )}

      {/* Floating Love Heart on Top */}
      {showHeart && !reaction && !dialogueBubble && (
        <span className="absolute -top-5 text-xl animate-float-heart z-10 filter drop-shadow">
          💖
        </span>
      )}

      {/* Main Pixel Character Sprite Image with True Transparency */}
      <div
        className={`w-full h-full flex items-end justify-center transition-transform ${getAnimationClass()}`}
        style={{
          transform: direction === 'left' ? 'scaleX(-1)' : 'scaleX(1)',
        }}
      >
        <img
          src={spriteSrc}
          alt={name}
          className="w-full h-full object-contain pixel-art drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]"
          style={{ imageRendering: 'pixelated' }}
          referrerPolicy="no-referrer"
          loading="eager"
        />
      </div>

      {/* Character Name Tag */}
      {showNameTag && (
        <span
          className="mt-1 px-2 py-0.5 text-[8px] md:text-[9px] font-pixel text-white pixel-corners shadow-md uppercase tracking-wider"
          style={{ backgroundColor: roleColor }}
        >
          {name}
        </span>
      )}
    </div>
  );
};
