import React, { useEffect, useRef, useState } from 'react';
import { CharacterRole } from '../types';
import { sound } from '../utils/audio';
import { CHARACTERS } from '../utils/storage';
import { CharacterSprite, ROMANTIC_TREE_BG } from './CharacterSprite';

interface Level1BeginningProps {
  playerRole: CharacterRole;
  collectedHeartIds: string[];
  onCollectHeart: (heartId: string) => void;
  onCompleteLevel: () => void;
}

interface HiddenHeart {
  id: string;
  name: string;
  x: number; // percentage along path (15 to 85)
  title: string;
  message: string;
  partnerReaction: string;
}

export const Level1Beginning: React.FC<Level1BeginningProps> = ({
  playerRole,
  collectedHeartIds,
  onCollectHeart,
  onCompleteLevel,
}) => {
  // Player moves strictly horizontally along the grassy path baseline
  const [playerX, setPlayerX] = useState(20);
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const [isWalking, setIsWalking] = useState(false);
  const [activeMemory, setActiveMemory] = useState<HiddenHeart | null>(null);

  // Character interactive dialogue bubbles & reactions
  const [leaderBubble, setLeaderBubble] = useState<string | null>(null);
  const [partnerBubble, setPartnerBubble] = useState<string | null>(null);
  const [partnerNearSpark, setPartnerNearSpark] = useState(false);
  const lastProximityDialogueRef = useRef<number>(0);

  const activeChar = CHARACTERS[playerRole];
  const partnerRole: CharacterRole = playerRole === 'billo' ? 'pillu' : 'billo';
  const partnerChar = CHARACTERS[partnerRole];

  // 5 Hidden Hearts placed along the horizontal walking path (at consistent elevation)
  const hiddenHearts: HiddenHeart[] = [
    {
      id: 'h1_sea',
      name: 'The Flower by the Sea',
      x: 16,
      title: '7 November 2025 — By the Sea',
      message: 'The evening Pillu asked Billo to be his girlfriend by the sea. She asked him to give her a flower first. Our story officially began.',
      partnerReaction: `${partnerChar.name}: "Remember the flower by the sea? That was the moment everything started."`,
    },
    {
      id: 'h2_picnic',
      name: 'The Forest Picnic',
      x: 32,
      title: '8 November 2025 — Sanjay Gandhi National Park',
      message: 'Our first adventure picnic! Cycling through the greenery to Kanheri Caves, and Pillu made herb rice with peri-peri gravy just for us.',
      partnerReaction: `${activeChar.name}: "You made herb rice just for our picnic. That was so Pillu."`,
    },
    {
      id: 'h3_bus',
      name: 'The Last Seat',
      x: 50,
      title: 'The AC Bus to Thane',
      message: 'On our way back from the picnic, a fully air-conditioned bus towards Thane. The last seat, just us, and our second kiss.',
      partnerReaction: `${partnerChar.name}: "The last seat of the AC bus will always be special."`,
    },
    {
      id: 'h4_holi',
      name: 'Colours of Holi',
      x: 68,
      title: 'Our First Holi Together',
      message: 'Pillu took a bus and surprised Billo at her society. Colours, rain-dance, laughter, and meeting her childhood friends. Pure chaos, pure joy.',
      partnerReaction: `${activeChar.name}: "Our first Holi was pure chaos — the best kind of chaos."`,
    },
    {
      id: 'h5_year',
      name: 'One Favourite Person',
      x: 84,
      title: '365 Days Later',
      message: 'One year later, and you are still my favourite person. From the flower by the sea to every little memory, it all brought us here.',
      partnerReaction: `${partnerChar.name}: "Through happy days and difficult days, we were there for each other."`,
    },
  ];

  const isHeartCollected = (id: string) => collectedHeartIds.includes(id);
  const allFound = hiddenHearts.every((h) => isHeartCollected(h.id));

  // Check nearest heart
  const nearbyHeart = hiddenHearts.find((h) => Math.abs(h.x - playerX) < 8);

  // Follower character horizontal position (walking behind leader on the same baseline)
  const followerX = direction === 'right' ? Math.max(6, playerX - 7) : Math.min(94, playerX + 7);

  // Trigger romantic partner banter when walking side-by-side
  const checkProximityBanter = () => {
    const now = Date.now();
    if (now - lastProximityDialogueRef.current > 7000) {
      lastProximityDialogueRef.current = now;
      setPartnerNearSpark(true);

      const quotes = playerRole === 'billo'
        ? [
            { lead: "Remember the flower by the sea? 🌸", partner: "I'd give you a thousand more, Billo! 💕" },
            { lead: "Our herb rice picnic was the best! 🚲", partner: "Anything for you, Meri Jaan! 💖" },
            { lead: "365 days and you're still my favourite! 🥹", partner: "One year later, still my whole world! 💖" },
          ]
        : [
            { lead: "The last seat of that bus, huh? 😎", partner: "Always special, always us, Pillu! 💙" },
            { lead: "Our first Holi was pure chaos! 🎨", partner: "The best kind of chaos with you! 💕" },
            { lead: "Bangkok after dark, remember? 🌃", partner: "Seven Eleven and our little adventure! 💖" },
          ];

      const choice = quotes[Math.floor(Math.random() * quotes.length)];
      setLeaderBubble(choice.lead);
      setTimeout(() => setPartnerBubble(choice.partner), 600);

      setTimeout(() => {
        setLeaderBubble(null);
        setPartnerBubble(null);
        setPartnerNearSpark(false);
      }, 4000);
    }
  };

  // Smooth horizontal walking without jumping or floating
  const move = (dx: number) => {
    setIsWalking(true);
    setPlayerX((prev) => {
      const next = Math.max(8, Math.min(92, prev + dx));
      if (dx > 0) setDirection('right');
      if (dx < 0) setDirection('left');
      return next;
    });
    sound.playBlip();

    // Occasional proximity banter
    if (Math.random() < 0.25) {
      checkProximityBanter();
    }

    setTimeout(() => setIsWalking(false), 200);
  };

  const handleHeartInteract = (heart: HiddenHeart) => {
    const isNew = !isHeartCollected(heart.id);
    if (isNew) {
      sound.playHeartPickup();
      onCollectHeart(heart.id);

      if (playerRole === 'billo') {
        setLeaderBubble('A sweet memory! ✨');
        setTimeout(() => setPartnerBubble("Aww, I remember that! 💖"), 400);
      } else {
        setLeaderBubble('Look what I found! 😎');
        setTimeout(() => setPartnerBubble('You found our memory! 💕'), 400);
      }

      setTimeout(() => {
        setLeaderBubble(null);
        setPartnerBubble(null);
      }, 3500);
    } else {
      sound.playJump();
    }
    setActiveMemory(heart);
  };

  // Keyboard navigation: WASD, Arrows, E, Space, Enter
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeMemory) {
        if (e.key === ' ' || e.key === 'Enter' || e.key === 'e' || e.key === 'E') {
          e.preventDefault();
          sound.playJump();
          setActiveMemory(null);
        }
        return;
      }

      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        move(-5);
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        move(5);
      } else if (e.key === ' ' || e.key === 'Enter' || e.key === 'e' || e.key === 'E') {
        e.preventDefault();
        if (nearbyHeart) {
          handleHeartInteract(nearbyHeart);
        } else {
          // If not near heart, trigger sweet partner dialogue
          checkProximityBanter();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [playerX, activeMemory, nearbyHeart]);

  return (
    <div className="relative w-full h-full flex flex-col justify-between overflow-hidden select-none font-pixel">
      {/* Background Landscape with Grounded Baseline */}
      <div
        className="absolute inset-0 bg-cover bg-center cursor-pointer"
        style={{ backgroundImage: `url(${ROMANTIC_TREE_BG})` }}
        onClick={(e) => {
          if (activeMemory) return;
          const rect = e.currentTarget.getBoundingClientRect();
          const clickXPercent = ((e.clientX - rect.left) / rect.width) * 100;
          setIsWalking(true);
          if (clickXPercent > playerX) setDirection('right');
          else setDirection('left');
          setPlayerX(Math.max(8, Math.min(92, clickXPercent)));
          sound.playBlip();

          // Check if clicking close to a heart to interact
          const clickedNear = hiddenHearts.find((h) => Math.abs(h.x - clickXPercent) < 7);
          if (clickedNear) {
            setTimeout(() => handleHeartInteract(clickedNear), 150);
          } else if (Math.random() < 0.3) {
            checkProximityBanter();
          }

          setTimeout(() => setIsWalking(false), 250);
        }}
      >
        {/* Soft atmospheric gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-pink-900/10 pointer-events-none" />

        {/* Level Goal Bar (Pinned top left) */}
        <div className="absolute top-2.5 left-2.5 bg-[#130620]/90 text-pink-200 px-3 py-1 pixel-corners border border-pink-500/70 pointer-events-none shadow-md flex items-center gap-3 text-[9px] z-20">
          <span className="text-yellow-300 font-bold">LEVEL 1: OUR STORY BEGINS</span>
          <span className="text-pink-300">
            Memories: <strong className="text-yellow-300">{collectedHeartIds.length}/{hiddenHearts.length}</strong>
          </span>
        </div>

        {/* Complete Level 1 Button when all 5 found */}
        {allFound && !activeMemory && (
          <div className="absolute top-2.5 right-2.5 z-30 animate-pulse">
            <button
              onClick={() => {
                sound.playFanfare();
                onCompleteLevel();
              }}
              className="px-3 py-1.5 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-black font-bold uppercase pixel-corners text-[9px] sm:text-[10px] shadow-lg flex items-center gap-1.5 cursor-pointer"
            >
              <span>🎉 Level 1 Complete! Go to Level 2 →</span>
            </button>
          </div>
        )}

        {/* 5 Hidden Memory Hearts Placed Along Grassy Ground Path */}
        {hiddenHearts.map((heart) => {
          const collected = isHeartCollected(heart.id);
          const isNearby = Math.abs(heart.x - playerX) < 8;

          return (
            <div
              key={heart.id}
              onClick={(e) => {
                e.stopPropagation();
                handleHeartInteract(heart);
              }}
              className="absolute -translate-x-1/2 cursor-pointer z-10 group"
              style={{
                left: `${heart.x}%`,
                bottom: '14%', // Grounded right above the grassy path
              }}
            >
              <div
                className={`text-2xl sm:text-3xl transition-transform ${
                  collected
                    ? 'opacity-85 scale-90'
                    : 'animate-float-heart drop-shadow-[0_0_12px_rgba(255,112,166,0.9)] scale-110'
                } group-hover:scale-125`}
              >
                {collected ? '💖' : '✨'}
              </div>

              {/* Interaction Callout Prompt */}
              <div
                className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-0.5 text-[8px] bg-black/95 text-yellow-300 whitespace-nowrap pixel-corners border border-yellow-400 transition-opacity ${
                  isNearby || collected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                }`}
              >
                {isNearby ? '[E / Space] Inspect' : heart.name}
              </div>
            </div>
          );
        })}

        {/* Romantic Heart Bond when characters are close together */}
        {partnerNearSpark && (
          <div
            className="absolute z-20 pointer-events-none transition-all duration-300"
            style={{
              left: `${(playerX + followerX) / 2}%`,
              bottom: '24%',
            }}
          >
            <span className="text-xl sm:text-2xl text-rose-500 animate-float-heart drop-shadow-[0_0_12px_rgba(255,0,80,0.9)]">
              ❤️
            </span>
          </div>
        )}

        {/* Characters Firmly Grounded on the Exact Same Baseline */}
        {/* Follower Character (partner walks along the same bottom baseline) */}
        <div
          className="absolute -translate-x-1/2 z-10 transition-all duration-300 ease-out cursor-pointer"
          style={{
            left: `${followerX}%`,
            bottom: '10%', // Ground baseline
          }}
          onClick={(e) => {
            e.stopPropagation();
            checkProximityBanter();
          }}
          title={`Click to talk with ${partnerChar.name}`}
        >
          <CharacterSprite
            role={partnerRole}
            size={74}
            direction={direction}
            animation={isWalking ? 'walking' : 'idle'}
            dialogueBubble={partnerBubble}
            showNameTag={true}
          />
        </div>

        {/* Active Character (leader walks on the exact same bottom baseline) */}
        <div
          className="absolute -translate-x-1/2 z-20 transition-all duration-150 ease-out cursor-pointer"
          style={{
            left: `${playerX}%`,
            bottom: '10%', // Exact same ground baseline
          }}
          onClick={(e) => {
            e.stopPropagation();
            checkProximityBanter();
          }}
        >
          <CharacterSprite
            role={playerRole}
            size={78}
            direction={direction}
            animation={isWalking ? 'walking' : 'idle'}
            dialogueBubble={leaderBubble}
            showHeart={allFound}
            showNameTag={true}
          />
        </div>
      </div>

      {/* Docked Bottom Controls & Interaction Prompts */}
      <div className="relative z-20 w-full bg-[#12051d]/95 border-t border-pink-500/70 px-3 py-1.5 flex items-center justify-between text-[8px] sm:text-[9px] text-pink-200">
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="text-yellow-300 font-bold">🎮 [A/D or ◀/▶] Walk</span>
          <span className="text-pink-400">·</span>
          <span>[E / Space] Interact</span>
          <span className="hidden sm:inline text-pink-400">·</span>
          <span className="hidden sm:inline text-pink-300">Tap path or characters to interact</span>
        </div>

        {/* Quick Interaction & Movement Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => move(-7)}
            className="px-2.5 py-1 bg-pink-950 hover:bg-pink-900 border border-pink-400 text-pink-200 font-bold active:scale-95 pixel-corners cursor-pointer"
          >
            ◀ Left
          </button>
          <button
            onClick={() => {
              if (nearbyHeart) {
                handleHeartInteract(nearbyHeart);
              } else {
                checkProximityBanter();
              }
            }}
            className={`px-2.5 py-1 pixel-corners border font-bold text-[8px] cursor-pointer ${
              nearbyHeart
                ? 'bg-yellow-400 text-black border-yellow-200 animate-pulse'
                : 'bg-pink-900/80 text-yellow-300 border-pink-500'
            }`}
          >
            {nearbyHeart ? 'Inspect 💖' : 'Talk 💕'}
          </button>
          <button
            onClick={() => move(7)}
            className="px-2.5 py-1 bg-pink-950 hover:bg-pink-900 border border-pink-400 text-pink-200 font-bold active:scale-95 pixel-corners cursor-pointer"
          >
            Right ▶
          </button>
        </div>
      </div>

      {/* Docked Bottom Dialogue Box for Unlocked Memories (Not covering characters) */}
      {activeMemory && (
        <div className="absolute bottom-12 inset-x-3 z-30 bg-[#190726]/95 pixel-border border-yellow-400 p-3.5 shadow-2xl animate-fade-in flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-pink-800 pb-1 mb-1.5">
            <span className="text-yellow-300 font-bold text-xs flex items-center gap-2">
              <span>💖</span>
              <span>{activeMemory.title}</span>
            </span>
            <span className="text-[8px] bg-pink-700 text-white px-2 py-0.5 pixel-corners">
              Memory Found
            </span>
          </div>

          <div className="my-1">
            <p className="font-retro text-xl sm:text-2xl text-pink-100 leading-snug">
              "{activeMemory.message}"
            </p>
            <p className="font-retro text-lg sm:text-xl text-yellow-300 mt-1 italic">
              {activeMemory.partnerReaction}
            </p>
          </div>

          <div className="mt-1.5 flex items-center justify-between text-[8px] sm:text-[9px] text-pink-300">
            <span>Press [E / Space / Enter] to continue</span>
            <button
              onClick={() => {
                sound.playJump();
                setActiveMemory(null);
              }}
              className="px-3 py-1 bg-yellow-500 hover:bg-yellow-400 text-black font-bold uppercase pixel-corners cursor-pointer"
            >
              Continue Exploring →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
