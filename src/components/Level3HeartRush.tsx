import React, { useEffect, useRef, useState } from 'react';
import { CharacterRole } from '../types';
import { sound } from '../utils/audio';
import { CharacterSprite, SUNSET_BG_URL } from './CharacterSprite';

interface Level3HeartRushProps {
  playerRole: CharacterRole;
  highScore: number;
  onAwardHearts: (amount: number) => void;
  onSaveHighScore: (score: number) => void;
  onCompleteLevel: () => void;
}

interface FallingHeartItem {
  id: number;
  x: number; // 5 to 90 %
  y: number; // 0 to 95 %
  speed: number;
  type: 'pink' | 'golden' | 'diamond';
  points: number;
  icon: string;
}

export const Level3HeartRush: React.FC<Level3HeartRushProps> = ({
  playerRole,
  highScore,
  onAwardHearts,
  onSaveHighScore,
  onCompleteLevel,
}) => {
  const [basketX, setBasketX] = useState(50);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [timeLeft, setTimeLeft] = useState(40);
  const [items, setItems] = useState<FallingHeartItem[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [floatingSpark, setFloatingSpark] = useState<{ text: string; x: number } | null>(null);

  const requestRef = useRef<number | null>(null);

  // Mouse move control over arena
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!gameStarted || gameOver) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const xPercent = ((e.clientX - rect.left) / rect.width) * 100;
    setBasketX(Math.max(8, Math.min(92, xPercent)));
  };

  // Keyboard navigation
  useEffect(() => {
    if (!gameStarted || gameOver) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        setBasketX((prev) => Math.max(8, prev - 8));
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        setBasketX((prev) => Math.min(92, prev + 8));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameStarted, gameOver]);

  // Timer countdown
  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setGameOver(true);
          sound.playVictory();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStarted, gameOver]);

  // Spawner & Physics loop
  useEffect(() => {
    if (!gameStarted || gameOver) return;

    let nextId = 1;
    // Increasing spawn rate as time winds down
    const spawnRate = timeLeft > 20 ? 650 : 450;

    const spawnInterval = setInterval(() => {
      const rand = Math.random();
      let type: FallingHeartItem['type'] = 'pink';
      let points = 1;
      let icon = '💖';

      if (rand > 0.85) {
        type = 'diamond';
        points = 15;
        icon = '💎';
      } else if (rand > 0.55) {
        type = 'golden';
        points = 5;
        icon = '💛';
      }

      setItems((prev) => [
        ...prev,
        {
          id: nextId++,
          x: Math.random() * 80 + 10,
          y: 0,
          speed: Math.random() * 0.9 + 0.8 + (40 - timeLeft) * 0.02,
          type,
          points,
          icon,
        },
      ]);
    }, spawnRate);

    const updatePhysics = () => {
      setItems((prevItems) => {
        const nextItems: FallingHeartItem[] = [];
        for (const item of prevItems) {
          const nextY = item.y + item.speed;

          // Catch collision detection at bottom (80% to 92%)
          if (nextY >= 78 && nextY <= 90 && Math.abs(item.x - basketX) < 11) {
            // Caught heart!
            sound.playHeartPickup();
            setCombo((c) => {
              const nextC = c + 1;
              setMaxCombo((mc) => Math.max(mc, nextC));
              const multiplier = nextC >= 10 ? 3 : nextC >= 5 ? 2 : 1;
              const earned = item.points * multiplier;
              setScore((s) => s + earned);
              setFloatingSpark({
                text: `+${earned}${multiplier > 1 ? ` (x${multiplier})` : ''}`,
                x: basketX,
              });
              setTimeout(() => setFloatingSpark(null), 600);
              return nextC;
            });
          } else if (nextY < 95) {
            nextItems.push({ ...item, y: nextY });
          } else {
            // Heart hit ground -> reset combo
            setCombo(0);
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
  }, [gameStarted, gameOver, basketX, timeLeft]);

  const handleFinishLevel = () => {
    // Award 1 heart per 10 points scored
    const bonusHearts = Math.max(5, Math.floor(score / 5));
    onAwardHearts(bonusHearts);
    if (score > highScore) {
      onSaveHighScore(score);
    }
    onCompleteLevel();
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      className="relative w-full h-full overflow-hidden select-none font-pixel flex flex-col justify-between"
      style={{
        backgroundImage: `url(${SUNSET_BG_URL})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-[#0c0417]/40 pointer-events-none" />


        {/* HUD Overlay inside arena */}
        <div className="relative z-10 p-3 flex items-center justify-between text-xs text-pink-200">
          <div className="flex items-center gap-2 bg-black/60 px-3 py-1.5 pixel-corners border border-pink-500/60">
            <span>Score:</span>
            <span className="text-yellow-300 font-bold text-sm">{score}</span>
          </div>

          {combo > 1 && (
            <div className="bg-pink-600/90 text-white px-3 py-1 pixel-corners border border-yellow-300 animate-bounce flex items-center gap-1.5 shadow-lg">
              <span>🔥 COMBO x{combo >= 10 ? '3' : combo >= 5 ? '2' : '1'}!</span>
              <span className="text-[9px]">({combo} Streak)</span>
            </div>
          )}

          <div className="flex items-center gap-2 bg-black/60 px-3 py-1.5 pixel-corners border border-pink-500/60 text-[10px]">
            <span>💖 Pink: 1</span>
            <span>💛 Gold: 5</span>
            <span>💎 Diamond: 15</span>
          </div>
        </div>

        {/* Playfield Area */}
        <div className="relative flex-1 w-full overflow-hidden">
          {/* Falling Heart Items */}
          {items.map((it) => (
            <div
              key={it.id}
              className="absolute text-2xl md:text-3xl -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] pointer-events-none transition-transform"
              style={{ left: `${it.x}%`, top: `${it.y}%` }}
            >
              {it.icon}
            </div>
          ))}

          {/* Floating Spark Text on Catch */}
          {floatingSpark && (
            <div
              className="absolute bottom-28 text-sm md:text-base font-bold text-yellow-300 animate-ping pointer-events-none bg-black/70 px-2 py-0.5 pixel-corners"
              style={{ left: `${floatingSpark.x}%` }}
            >
              {floatingSpark.text}
            </div>
          )}

          {/* Player Catcher Sprites at bottom */}
          <div
            className="absolute bottom-2 -translate-x-1/2 flex flex-col items-center pointer-events-none transition-all duration-75"
            style={{ left: `${basketX}%` }}
          >
            <div className="text-[9px] bg-pink-600/90 text-white px-2 py-0.5 pixel-corners border border-yellow-300 mb-1 shadow-md">
              🧺 Love Basket
            </div>
            <div className="flex items-end gap-2">
              <CharacterSprite
                role="billo"
                size={54}
                animation={combo > 3 ? 'happy' : 'idle'}
                dialogueBubble={combo >= 10 ? 'Unstoppable! 🔥' : combo >= 5 ? 'Nice catch! 💖' : null}
              />
              <CharacterSprite
                role="pillu"
                size={54}
                animation={combo > 3 ? 'happy' : 'idle'}
                dialogueBubble={combo >= 10 ? 'x3 Points! ✨' : combo >= 5 ? 'Keep going! 😎' : null}
              />
            </div>
          </div>
        </div>

        {/* Controls Instructions Strip at bottom */}
        <div className="relative z-10 bg-black/70 p-2 text-center text-[9px] text-pink-300">
          Move your mouse left/right or use [A] / [D] / Arrow keys to catch falling hearts!
        </div>

        {/* Start Game Modal */}
        {!gameStarted && (
          <div className="absolute inset-0 z-30 bg-black/85 flex flex-col items-center justify-center p-6 text-center">
            <span className="text-5xl mb-2 animate-bounce">💖</span>
            <h2 className="text-sm md:text-base text-yellow-300 font-bold uppercase tracking-wider mb-2">
              READY FOR THE HEART RUSH?
            </h2>
            <p className="font-retro text-2xl text-pink-200 mb-6 max-w-md leading-relaxed">
              Catch as many falling hearts, golden treats, and diamonds as you can in 40 seconds!
            </p>

            <button
              onClick={() => {
                sound.playFanfare();
                setGameStarted(true);
              }}
              className="px-8 py-3 bg-gradient-to-r from-pink-500 to-yellow-500 text-black font-bold text-xs uppercase pixel-corners shadow-xl animate-pulse"
            >
              ▶ START HEART RUSH!
            </button>
          </div>
        )}

        {/* Game Over / Results Modal */}
        {gameOver && (
          <div className="absolute inset-0 z-30 bg-black/90 flex flex-col items-center justify-center p-6 text-center">
            <span className="text-5xl mb-2 animate-bounce">🏆</span>
            <h2 className="text-sm md:text-base text-yellow-300 font-bold uppercase tracking-wider mb-2">
              ROUND FINISHED!
            </h2>
            <p className="font-retro text-3xl text-pink-100 mb-1">
              Final Score: <strong className="text-yellow-300">{score} Points</strong>
            </p>
            <p className="font-retro text-2xl text-pink-300 mb-4">
              Max Combo: <strong className="text-rose-400">{maxCombo} Streak</strong> · Awarded{' '}
              <strong className="text-green-300">+{Math.max(5, Math.floor(score / 5))} Hearts!</strong>
            </p>

            <div className="flex items-center gap-4 my-2">
              <CharacterSprite role="billo" size={68} animation="celebrate" showHeart={true} />
              <CharacterSprite role="pillu" size={68} animation="celebrate" showHeart={true} />
            </div>

            <div className="flex items-center gap-3 mt-4">
              <button
                onClick={() => {
                  setScore(0);
                  setCombo(0);
                  setTimeLeft(40);
                  setItems([]);
                  setGameOver(false);
                }}
                className="px-4 py-2 bg-pink-900 hover:bg-pink-800 text-pink-200 text-xs pixel-corners"
              >
                🔄 Play Again
              </button>
              <button
                onClick={handleFinishLevel}
                className="px-6 py-2.5 bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-bold text-xs uppercase pixel-corners shadow-lg"
              >
                Complete Level 3 & Unlock Level 4 (Treasure Hunt) →
              </button>
            </div>
          </div>
        )}
    </div>
  );
};

