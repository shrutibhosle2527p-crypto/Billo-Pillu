import React, { useEffect, useRef, useState } from 'react';
import { CharacterRole } from '../types';
import { sound } from '../utils/audio';
import { PixelCharacter } from './PixelCharacter';

interface HeartCatcherProps {
  playerRole: CharacterRole;
  onClose: (earnedPoints: number) => void;
}

interface FallingItem {
  id: number;
  x: number; // percentage 5 - 90
  y: number; // percentage 0 - 95
  speed: number;
  type: 'heart' | 'boba' | 'letter' | 'star';
  points: number;
  icon: string;
}

export const HeartCatcher: React.FC<HeartCatcherProps> = ({ playerRole, onClose }) => {
  const [basketX, setBasketX] = useState(50); // percentage
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(25);
  const [items, setItems] = useState<FallingItem[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const requestRef = useRef<number | null>(null);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        setBasketX((prev) => Math.max(8, prev - 7));
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        setBasketX((prev) => Math.min(92, prev + 7));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Timer
  useEffect(() => {
    if (gameOver) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setGameOver(true);
          sound.playFanfare();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [gameOver]);

  // Spawner & Physics loop
  useEffect(() => {
    if (gameOver) return;

    let nextId = 1;
    const spawnInterval = setInterval(() => {
      const types: { type: FallingItem['type']; points: number; icon: string }[] = [
        { type: 'heart', points: 10, icon: '💖' },
        { type: 'boba', points: 25, icon: '🧋' },
        { type: 'letter', points: 30, icon: '💌' },
        { type: 'star', points: 50, icon: '⭐' },
      ];
      const selected = types[Math.floor(Math.random() * types.length)];
      setItems((prev) => [
        ...prev,
        {
          id: nextId++,
          x: Math.random() * 80 + 10,
          y: 0,
          speed: Math.random() * 0.8 + 0.6,
          type: selected.type,
          points: selected.points,
          icon: selected.icon,
        },
      ]);
    }, 700);

    const updatePhysics = () => {
      setItems((prevItems) => {
        const nextItems: FallingItem[] = [];
        for (const item of prevItems) {
          const nextY = item.y + item.speed;
          // Check collision with basket (bottom at ~85% height)
          if (nextY >= 80 && nextY <= 90 && Math.abs(item.x - basketX) < 12) {
            // Caught!
            sound.playHeartPickup();
            setScore((s) => s + item.points);
          } else if (nextY < 95) {
            nextItems.push({ ...item, y: nextY });
          }
        }
        return nextItems;
      });
      requestRef.current = requestAnimationFrame(updatePhysics);
    };

    requestRef.current = requestAnimationFrame(updatePhysics);

    return () => {
      clearInterval(spawnInterval);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [basketX, gameOver]);

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 font-pixel select-none">
      <div className="relative w-full max-w-lg h-[520px] bg-gradient-to-b from-[#1b0a2a] to-[#090312] pixel-border border-pink-400 p-4 flex flex-col justify-between overflow-hidden">
        {/* Header HUD */}
        <div className="flex items-center justify-between text-xs text-pink-200 border-b border-pink-800 pb-2 z-10">
          <div className="flex items-center gap-1.5 text-yellow-300">
            <span>💖 Score:</span>
            <span className="font-bold">{score}</span>
          </div>
          <div className="flex items-center gap-1.5 text-pink-300">
            <span>⏳ Time:</span>
            <span className="font-bold">{timeLeft}s</span>
          </div>
          <button
            onClick={() => onClose(score)}
            className="text-[10px] text-pink-400 hover:text-white px-2 py-0.5 bg-pink-900/40"
          >
            Quit
          </button>
        </div>

        {/* Game Arena Area */}
        <div className="relative flex-1 w-full overflow-hidden my-2">
          {/* Falling Items */}
          {items.map((it) => (
            <div
              key={it.id}
              className="absolute text-2xl -translate-x-1/2 -translate-y-1/2 drop-shadow-md select-none transition-transform pointer-events-none"
              style={{
                left: `${it.x}%`,
                top: `${it.y}%`,
              }}
            >
              {it.icon}
            </div>
          ))}

          {/* Player Catcher Basket at Bottom */}
          <div
            className="absolute bottom-2 -translate-x-1/2 flex flex-col items-center pointer-events-none transition-all duration-75"
            style={{ left: `${basketX}%` }}
          >
            <div className="text-sm bg-pink-500/80 text-white px-2 py-0.5 rounded-full border border-pink-200 mb-1">
              🧺 Love Basket
            </div>
            <div className="flex items-center gap-1">
              <PixelCharacter role={playerRole} size={42} />
              <PixelCharacter role={playerRole === 'billo' ? 'pillu' : 'billo'} size={38} />
            </div>
          </div>
        </div>

        {/* Mobile / Click Controls */}
        <div className="grid grid-cols-2 gap-2 z-10 mt-2">
          <button
            onClick={() => setBasketX((prev) => Math.max(8, prev - 15))}
            className="py-2.5 bg-pink-900/60 hover:bg-pink-800 border-2 border-pink-500 text-pink-200 text-xs active:scale-95"
          >
            ◀ Move Left
          </button>
          <button
            onClick={() => setBasketX((prev) => Math.min(92, prev + 15))}
            className="py-2.5 bg-pink-900/60 hover:bg-pink-800 border-2 border-pink-500 text-pink-200 text-xs active:scale-95"
          >
            Move Right ▶
          </button>
        </div>

        {/* Game Over Modal */}
        {gameOver && (
          <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center p-6 text-center z-20">
            <span className="text-4xl mb-2">🎉</span>
            <h3 className="text-sm text-yellow-300 font-bold mb-2">
              SWEET CATCH!
            </h3>
            <p className="font-retro text-2xl text-pink-200 mb-4">
              You collected <span className="text-yellow-300 font-bold">{score}</span> Love Spark Points together!
            </p>
            <button
              onClick={() => onClose(score)}
              className="px-6 py-2 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400 text-white text-xs pixel-corners shadow-lg"
            >
              Collect Rewards & Return
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
