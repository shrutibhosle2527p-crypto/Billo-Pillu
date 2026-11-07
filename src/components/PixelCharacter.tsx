import React from 'react';
import { CharacterRole } from '../types';

interface PixelCharacterProps {
  role: CharacterRole;
  size?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  isWalking?: boolean;
  isHappy?: boolean;
  holdingHands?: boolean;
}

export const PixelCharacter: React.FC<PixelCharacterProps> = ({
  role,
  size = 48,
  direction = 'down',
  isWalking = false,
  isHappy = false,
}) => {
  const isBillo = role === 'billo';

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none transition-transform ${
        isWalking ? 'animate-bounce' : ''
      } ${isHappy ? 'scale-110' : ''}`}
      style={{
        width: size,
        height: size,
      }}
    >
      {/* SVG Pixel Sprite */}
      <svg
        viewBox="0 0 16 16"
        className="w-full h-full drop-shadow-md"
        style={{
          transform: direction === 'left' ? 'scaleX(-1)' : 'none',
          imageRendering: 'pixelated',
        }}
      >
        {isBillo ? (
          // Billo: Cute Pink Cat-Eared Adventurer
          <>
            {/* Cat Ears */}
            <rect x="3" y="1" width="3" height="3" fill="#ff70a6" />
            <rect x="4" y="2" width="1" height="1" fill="#ffe5ec" />
            <rect x="10" y="1" width="3" height="3" fill="#ff70a6" />
            <rect x="11" y="2" width="1" height="1" fill="#ffe5ec" />

            {/* Hair / Head */}
            <rect x="3" y="3" width="10" height="7" fill="#ff70a6" />
            <rect x="4" y="4" width="8" height="6" fill="#ffe5ec" />

            {/* Hair bangs / ribbon */}
            <rect x="7" y="2" width="2" height="2" fill="#ff0054" />
            <rect x="6" y="2" width="1" height="1" fill="#ff5400" />
            <rect x="9" y="2" width="1" height="1" fill="#ff5400" />

            {/* Eyes */}
            {direction === 'up' ? (
              // Looking up (back of head)
              <rect x="4" y="4" width="8" height="4" fill="#ff70a6" />
            ) : (
              <>
                <rect x="5" y="6" width="2" height="2" fill="#2b0938" />
                <rect x="5" y="6" width="1" height="1" fill="#ffffff" />
                <rect x="9" y="6" width="2" height="2" fill="#2b0938" />
                <rect x="9" y="6" width="1" height="1" fill="#ffffff" />

                {/* Blush */}
                <rect x="4" y="8" width="1" height="1" fill="#ff4d6d" />
                <rect x="11" y="8" width="1" height="1" fill="#ff4d6d" />

                {/* Smile */}
                <rect x="7" y="8" width="2" height="1" fill="#d90429" />
              </>
            )}

            {/* Dress / Body */}
            <rect x="4" y="10" width="8" height="4" fill="#b5179e" />
            <rect x="6" y="10" width="4" height="3" fill="#f72585" />
            <rect x="7" y="11" width="2" height="2" fill="#ffffff" />

            {/* Feet */}
            <rect x="5" y="14" width="2" height="2" fill="#4a0e4e" />
            <rect x="9" y="14" width="2" height="2" fill="#4a0e4e" />
          </>
        ) : (
          // Pillu: Cute Teal Hoodie Bear Adventurer
          <>
            {/* Bear Ears */}
            <rect x="3" y="1" width="3" height="3" fill="#3a86ff" />
            <rect x="4" y="2" width="1" height="1" fill="#caf0f8" />
            <rect x="10" y="1" width="3" height="3" fill="#3a86ff" />
            <rect x="11" y="2" width="1" height="1" fill="#caf0f8" />

            {/* Hoodie Head */}
            <rect x="3" y="3" width="10" height="7" fill="#4cc9f0" />
            <rect x="4" y="4" width="8" height="6" fill="#ffe5d9" />

            {/* Hoodie Strings */}
            <rect x="5" y="10" width="1" height="2" fill="#ffffff" />
            <rect x="10" y="10" width="1" height="2" fill="#ffffff" />

            {/* Eyes */}
            {direction === 'up' ? (
              <rect x="4" y="4" width="8" height="4" fill="#4cc9f0" />
            ) : (
              <>
                <rect x="5" y="6" width="2" height="2" fill="#03045e" />
                <rect x="5" y="6" width="1" height="1" fill="#ffffff" />
                <rect x="9" y="6" width="2" height="2" fill="#03045e" />
                <rect x="9" y="6" width="1" height="1" fill="#ffffff" />

                {/* Cute Boyish Smile / Blush */}
                <rect x="4" y="8" width="1" height="1" fill="#ffb4a2" />
                <rect x="11" y="8" width="1" height="1" fill="#ffb4a2" />
                <rect x="7" y="8" width="2" height="1" fill="#03045e" />
              </>
            )}

            {/* Hoodie Body */}
            <rect x="4" y="10" width="8" height="4" fill="#4361ee" />
            <rect x="6" y="11" width="4" height="2" fill="#3f37c9" />

            {/* Sneakers */}
            <rect x="5" y="14" width="2" height="2" fill="#03045e" />
            <rect x="9" y="14" width="2" height="2" fill="#03045e" />
          </>
        )}
      </svg>

      {/* Floating heart when happy */}
      {isHappy && (
        <span className="absolute -top-3 text-xs animate-ping select-none pointer-events-none">
          💖
        </span>
      )}
    </div>
  );
};
