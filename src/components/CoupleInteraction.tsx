import React, { useState, useRef, useCallback, useEffect } from 'react';
import { CharacterSprite } from './CharacterSprite';
import { sound } from '../utils/audio';

export type CouplePose = 'idle' | 'hug' | 'kiss' | 'handhold' | 'cuddle' | 'lean' | 'celebrate';

interface CoupleInteractionProps {
  size?: number;
  /** Initial separation in px between the two characters */
  gap?: number;
  /** Show the interaction button row below the characters */
  showButtons?: boolean;
  /** Show name tags under each character */
  showNameTag?: boolean;
  /** Force a pose (e.g. celebrate on victory screens) */
  forcedPose?: CouplePose;
  /** Called when a pose is triggered by user */
  onPoseTrigger?: (pose: CouplePose) => void;
  /** Optional dialogue bubbles (suppressed during interactions) */
  billoBubble?: string | null;
  pilluBubble?: string | null;
  className?: string;
}

const POSE_LABELS: { pose: Exclude<CouplePose, 'idle' | 'celebrate'>; icon: string; label: string }[] = [
  { pose: 'hug', icon: '🤗', label: 'Hug' },
  { pose: 'kiss', icon: '💋', label: 'Kiss' },
  { pose: 'handhold', icon: '🤝', label: 'Hold Hands' },
  { pose: 'cuddle', icon: '🏡', label: 'Cuddle' },
  { pose: 'lean', icon: '💞', label: 'Lean Together' },
];

const POSE_DURATION: Record<CouplePose, number> = {
  idle: 0,
  hug: 2800,
  kiss: 2200,
  handhold: 3200,
  cuddle: 3200,
  lean: 2800,
  celebrate: 0,
};

const POSE_HEARTS: Record<CouplePose, number> = {
  idle: 0,
  hug: 3,
  kiss: 5,
  handhold: 2,
  cuddle: 2,
  lean: 2,
  celebrate: 4,
};

export const CoupleInteraction: React.FC<CoupleInteractionProps> = ({
  size = 80,
  gap = 48,
  showButtons = true,
  showNameTag = true,
  forcedPose,
  onPoseTrigger,
  billoBubble = null,
  pilluBubble = null,
  className = '',
}) => {
  const [pose, setPose] = useState<CouplePose>('idle');
  const [hearts, setHearts] = useState<{ id: number; x: number; delay: number }[]>([]);
  const lockRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const heartIdRef = useRef(0);

  const triggerPose = useCallback(
    (next: CouplePose) => {
      if (lockRef.current) return;
      if (next === 'idle') return;

      sound.playHeartPickup();
      setPose(next);
      onPoseTrigger?.(next);

      const count = POSE_HEARTS[next] || 0;
      if (count > 0) {
        const newHearts = Array.from({ length: count }, (_, i) => ({
          id: heartIdRef.current++,
          x: (i - (count - 1) / 2) * 28,
          delay: i * 180,
        }));
        setHearts(newHearts);
      }

      lockRef.current = setTimeout(() => {
        setPose('idle');
        setHearts([]);
        lockRef.current = null;
      }, POSE_DURATION[next]);
    },
    []
  );

  useEffect(() => {
    return () => {
      if (lockRef.current) clearTimeout(lockRef.current);
    };
  }, []);

  // Respect forced pose (e.g. celebrate)
  const activePose = forcedPose ?? pose;

  // Compute transforms for each character based on pose
  const getBilloTransform = (): string => {
    switch (activePose) {
      case 'hug':
        return 'translateX(14px) scaleX(-1)';
      case 'kiss':
        return 'translateX(12px) scaleX(-1) rotate(-3deg)';
      case 'handhold':
        return 'translateX(10px) scaleX(-1)';
      case 'cuddle':
        return 'translateX(16px) scaleX(-1)';
      case 'lean':
        return 'translateX(12px) rotate(4deg) scaleX(-1)';
      case 'celebrate':
        return 'translateY(-4px)';
      default:
        return 'translateX(0) scaleX(1)';
    }
  };

  const getPilluTransform = (): string => {
    switch (activePose) {
      case 'hug':
        return 'translateX(-14px)';
      case 'kiss':
        return 'translateX(-12px) rotate(3deg)';
      case 'handhold':
        return 'translateX(-10px)';
      case 'cuddle':
        return 'translateX(-16px)';
      case 'lean':
        return 'translateX(-12px) rotate(-4deg)';
      case 'celebrate':
        return 'translateY(-4px)';
      default:
        return 'translateX(0)';
    }
  };

  const getBilloAnim = () => {
    if (activePose === 'celebrate') return 'celebrate' as const;
    if (activePose === 'idle') return 'idle' as const;
    return 'happy' as const;
  };

  const isInteracting = activePose !== 'idle' && activePose !== 'celebrate';
  const showCenterHeart = activePose === 'kiss' || activePose === 'hug' || activePose === 'celebrate';

  return (
    <div className={`flex flex-col items-center select-none ${className}`}>
      {/* Character pair stage */}
      <div
        className="relative flex items-end justify-center"
        style={{ minHeight: size * 1.6, minWidth: size * 2 + gap }}
      >
        {/* Floating hearts burst during interactions */}
        {hearts.map((h) => (
          <span
            key={h.id}
            className="absolute z-30 text-lg pointer-events-none animate-couple-heart-burst"
            style={{
              left: `calc(50% + ${h.x}px)`,
              bottom: `${size * 0.5}px`,
              animationDelay: `${h.delay}ms`,
            }}
          >
            💖
          </span>
        ))}

        {/* Billo */}
        <div
          className="relative z-10 transition-transform duration-700 ease-in-out"
          style={{ transform: getBilloTransform() }}
        >
          <CharacterSprite
            role="billo"
            size={size}
            animation={getBilloAnim()}
            showHeart={activePose === 'kiss' || activePose === 'celebrate'}
            showNameTag={showNameTag}
            reaction={activePose === 'kiss' || activePose === 'hug' ? 'blush' : null}
            dialogueBubble={isInteracting ? null : billoBubble}
          />
        </div>

        {/* Center heart separator */}
        <div
          className={`flex items-end justify-center pb-4 transition-all duration-500 ${
            showCenterHeart ? 'opacity-100 scale-125' : 'opacity-80 scale-100'
          }`}
          style={{ width: gap }}
        >
          <span className="text-2xl sm:text-3xl text-rose-500 animate-float-heart drop-shadow-[0_0_12px_rgba(255,0,80,0.8)]">
            {activePose === 'kiss' ? '💋' : '❤️'}
          </span>
        </div>

        {/* Pillu */}
        <div
          className="relative z-10 transition-transform duration-700 ease-in-out"
          style={{ transform: getPilluTransform() }}
        >
          <CharacterSprite
            role="pillu"
            size={size}
            animation={getBilloAnim()}
            showHeart={activePose === 'kiss' || activePose === 'celebrate'}
            showNameTag={showNameTag}
            reaction={activePose === 'kiss' || activePose === 'hug' ? 'blush' : null}
            dialogueBubble={isInteracting ? null : pilluBubble}
          />
        </div>

        {/* Soft glow when interacting */}
        {isInteracting && (
          <div className="absolute inset-0 pointer-events-none animate-couple-glow rounded-full"
               style={{
                 background: 'radial-gradient(ellipse at center, rgba(255,180,200,0.15) 0%, transparent 70%)',
               }}
          />
        )}
      </div>

      {/* Interaction buttons */}
      {showButtons && !forcedPose && (
        <div className="flex items-center gap-1.5 sm:gap-2 mt-2">
          {POSE_LABELS.map(({ pose: p, icon, label }) => (
            <button
              key={p}
              type="button"
              disabled={isInteracting}
              onClick={() => triggerPose(p)}
              title={label}
              className={`px-2 py-1 pixel-corners border text-[8px] sm:text-[9px] font-bold transition-all flex items-center gap-1 ${
                isInteracting
                  ? 'opacity-40 cursor-not-allowed bg-black/40 border-gray-700 text-gray-600'
                  : 'bg-pink-950/80 hover:bg-pink-900 border-pink-500/70 text-yellow-200 cursor-pointer hover:scale-105 active:scale-95'
              }`}
            >
              <span className="text-sm">{icon}</span>
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
