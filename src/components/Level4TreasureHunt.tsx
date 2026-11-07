import React, { useEffect, useRef, useState } from 'react';
import { CharacterRole, TreasureChestData } from '../types';
import { sound } from '../utils/audio';
import { CHARACTERS, TREASURE_CHESTS } from '../utils/storage';
import { CharacterSprite, MEADOW_BG_URL } from './CharacterSprite';

interface Level4TreasureHuntProps {
  playerRole: CharacterRole;
  openedChestIds: string[];
  onOpenChest: (chestId: string, hearts: number) => void;
  onCompleteLevel: () => void;
}

export const Level4TreasureHunt: React.FC<Level4TreasureHuntProps> = ({
  playerRole,
  openedChestIds,
  onOpenChest,
  onCompleteLevel,
}) => {
  // Grounded horizontal movement along grassy meadow
  const [playerX, setPlayerX] = useState(20);
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const [isWalking, setIsWalking] = useState(false);
  const [activeChest, setActiveChest] = useState<TreasureChestData | null>(null);

  // Character interactive dialogue bubbles & reactions
  const [leaderBubble, setLeaderBubble] = useState<string | null>(null);
  const [partnerBubble, setPartnerBubble] = useState<string | null>(null);
  const [partnerNearSpark, setPartnerNearSpark] = useState(false);
  const lastProximityDialogueRef = useRef<number>(0);

  const activeChar = CHARACTERS[playerRole];
  const partnerRole: CharacterRole = playerRole === 'billo' ? 'pillu' : 'billo';
  const partnerChar = CHARACTERS[partnerRole];

  // Distribute the 5 chests along the horizontal walking path
  const chests = TREASURE_CHESTS.map((c, idx) => ({
    ...c,
    x: 14 + idx * 18, // 14%, 32%, 50%, 68%, 86%
  }));

  const allChestsOpened = chests.every((c) => openedChestIds.includes(c.id));
  const nearbyChest = chests.find((c) => Math.abs(c.x - playerX) < 8);

  // Follower character horizontal position (walking along the exact same bottom baseline)
  const followerX = direction === 'right' ? Math.max(6, playerX - 7) : Math.min(94, playerX + 7);

  // Trigger playful banter between Billo and Pillu
  const checkProximityBanter = () => {
    const now = Date.now();
    if (now - lastProximityDialogueRef.current > 7000) {
      lastProximityDialogueRef.current = now;
      setPartnerNearSpark(true);

      const quotes = playerRole === 'billo'
        ? [
            { lead: "Pillu, let's open all the chests! 📦", partner: "I'm right behind you, Billo! 😎" },
            { lead: "Remember our anniversary gifts? 🎁", partner: "Every memory with you is treasure! 💕" },
            { lead: "You're my favorite human! 💖", partner: "And you're my whole world, cutie! 🥰" },
          ]
        : [
            { lead: "Found another chest for us, Billo! 👑", partner: "Yay! Let's open it together, Pillu! 💙" },
            { lead: "Look at all the hearts we collected! 💖", partner: "365 days of love, Meri Jaan! 💕" },
            { lead: "You look so adorable today! 🥰", partner: "Aww stop, Pillu! 😂💖" },
          ];

      const choice = quotes[Math.floor(Math.random() * quotes.length)];
      setLeaderBubble(choice.lead);
      setTimeout(() => setPartnerBubble(choice.partner), 500);

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

    if (Math.random() < 0.25) {
      checkProximityBanter();
    }

    setTimeout(() => setIsWalking(false), 200);
  };

  const handleChestInteract = (chest: TreasureChestData) => {
    const alreadyOpened = openedChestIds.includes(chest.id);
    if (!alreadyOpened) {
      sound.playFanfare();
      onOpenChest(chest.id, chest.heartsAwarded);

      if (playerRole === 'billo') {
        setLeaderBubble(`Unlocked ${chest.title}! ✨`);
        setTimeout(() => setPartnerBubble(`+${chest.heartsAwarded} Hearts! You're amazing! 💖`), 400);
      } else {
        setLeaderBubble(`Chest opened, Billo! 😎`);
        setTimeout(() => setPartnerBubble(`Yay! +${chest.heartsAwarded} Hearts! 💕`), 400);
      }

      setTimeout(() => {
        setLeaderBubble(null);
        setPartnerBubble(null);
      }, 3500);
    } else {
      sound.playJump();
    }
    setActiveChest(chest);
  };

  // Keyboard navigation: WASD, Arrows, E, Space, Enter
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeChest) {
        if (e.key === ' ' || e.key === 'Enter' || e.key === 'e' || e.key === 'E') {
          e.preventDefault();
          sound.playJump();
          setActiveChest(null);
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
        if (nearbyChest) {
          handleChestInteract(nearbyChest);
        } else {
          checkProximityBanter();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [playerX, activeChest, nearbyChest]);

  return (
    <div className="relative w-full h-full flex flex-col justify-between overflow-hidden select-none font-pixel">
      {/* Background Landscape with Grounded Baseline */}
      <div
        className="absolute inset-0 bg-cover bg-center cursor-pointer"
        style={{ backgroundImage: `url(${MEADOW_BG_URL})` }}
        onClick={(e) => {
          if (activeChest) return;
          const rect = e.currentTarget.getBoundingClientRect();
          const clickXPercent = ((e.clientX - rect.left) / rect.width) * 100;
          setIsWalking(true);
          if (clickXPercent > playerX) setDirection('right');
          else setDirection('left');
          setPlayerX(Math.max(8, Math.min(92, clickXPercent)));
          sound.playBlip();

          // Check if clicked close to a chest
          const clickedNear = chests.find((c) => Math.abs(c.x - clickXPercent) < 7);
          if (clickedNear) {
            setTimeout(() => handleChestInteract(clickedNear), 150);
          } else if (Math.random() < 0.3) {
            checkProximityBanter();
          }

          setTimeout(() => setIsWalking(false), 250);
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-pink-900/10 pointer-events-none" />

        {/* Level Goal Bar (Pinned top left) */}
        <div className="absolute top-2.5 left-2.5 bg-[#130620]/90 text-pink-200 px-3 py-1 pixel-corners border border-pink-500/70 pointer-events-none shadow-md flex items-center gap-3 text-[9px] z-20">
          <span className="text-yellow-300 font-bold">LEVEL 4: TREASURE HUNT</span>
          <span className="text-pink-300">
            Chests: <strong className="text-yellow-300">{openedChestIds.length}/{chests.length}</strong>
          </span>
        </div>

        {/* Complete Level 4 Button when all 5 found */}
        {allChestsOpened && !activeChest && (
          <div className="absolute top-2.5 right-2.5 z-30 animate-pulse">
            <button
              onClick={() => {
                sound.playFanfare();
                onCompleteLevel();
              }}
              className="px-3 py-1.5 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-black font-bold uppercase pixel-corners text-[9px] sm:text-[10px] shadow-lg flex items-center gap-1.5 cursor-pointer"
            >
              <span>👑 All Chests Unlocked! Go to Level 5 →</span>
            </button>
          </div>
        )}

        {/* 5 Hidden Chests Placed Along Grassy Ground Path */}
        {chests.map((chest) => {
          const isOpen = openedChestIds.includes(chest.id);
          const isNearby = Math.abs(chest.x - playerX) < 8;

          return (
            <div
              key={chest.id}
              onClick={(e) => {
                e.stopPropagation();
                handleChestInteract(chest);
              }}
              className="absolute -translate-x-1/2 cursor-pointer z-10 group"
              style={{
                left: `${chest.x}%`,
                bottom: '14%', // Grounded right above the grassy path
              }}
            >
              <div
                className={`text-3xl sm:text-4xl transition-transform ${
                  isOpen
                    ? 'scale-100 filter drop-shadow-[0_0_8px_gold]'
                    : 'animate-float-heart drop-shadow-[0_0_12px_rgba(255,215,0,0.8)] scale-110'
                } group-hover:scale-125`}
              >
                {isOpen ? '👑' : '📦'}
              </div>

              {/* Interaction Callout Prompt */}
              <div
                className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-0.5 text-[8px] bg-black/95 text-yellow-300 whitespace-nowrap pixel-corners border border-yellow-400 transition-opacity ${
                  isNearby || isOpen ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                }`}
              >
                {isNearby ? (isOpen ? '[E] View' : '[E / Space] Open') : chest.title}
              </div>
            </div>
          );
        })}

        {/* Romantic Heart Bond when characters are near each other */}
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
            showHeart={allChestsOpened}
            showNameTag={true}
          />
        </div>
      </div>

      {/* Docked Bottom Controls & Interaction Prompts */}
      <div className="relative z-20 w-full bg-[#12051d]/95 border-t border-pink-500/70 px-3 py-1.5 flex items-center justify-between text-[8px] sm:text-[9px] text-pink-200">
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="text-yellow-300 font-bold">🎮 [A/D or ◀/▶] Walk</span>
          <span className="text-pink-400">·</span>
          <span>[E / Space] Open Chest</span>
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
              if (nearbyChest) {
                handleChestInteract(nearbyChest);
              } else {
                checkProximityBanter();
              }
            }}
            className={`px-2.5 py-1 pixel-corners border font-bold text-[8px] cursor-pointer ${
              nearbyChest
                ? 'bg-yellow-400 text-black border-yellow-200 animate-pulse'
                : 'bg-pink-900/80 text-yellow-300 border-pink-500'
            }`}
          >
            {nearbyChest ? 'Open 📦' : 'Talk 💕'}
          </button>
          <button
            onClick={() => move(7)}
            className="px-2.5 py-1 bg-pink-950 hover:bg-pink-900 border border-pink-400 text-pink-200 font-bold active:scale-95 pixel-corners cursor-pointer"
          >
            Right ▶
          </button>
        </div>
      </div>

      {/* Docked Bottom Dialogue Box for Opened Chest Keepsakes */}
      {activeChest && (
        <div className="absolute bottom-12 inset-x-3 z-30 bg-[#1b082c]/95 pixel-border border-yellow-400 p-3.5 shadow-2xl animate-fade-in flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-pink-800 pb-1 mb-1.5">
            <span className="text-yellow-300 font-bold text-xs flex items-center gap-2">
              <span className="text-base">📦</span>
              <span>{activeChest.title} - {activeChest.memoryTitle}</span>
            </span>
            <span className="text-[8px] bg-yellow-400 text-black px-2 py-0.5 pixel-corners font-bold">
              +{activeChest.heartsAwarded} Hearts Earned!
            </span>
          </div>

          <div className="my-1">
            <p className="font-retro text-xl sm:text-2xl text-pink-100 leading-snug">
              "{activeChest.memoryText}"
            </p>
            <p className="font-retro text-lg sm:text-xl text-yellow-300 mt-1 italic">
              {partnerChar.name}: "{activeChest.specialNote}"
            </p>
          </div>

          <div className="mt-1.5 flex items-center justify-between text-[8px] sm:text-[9px] text-pink-300">
            <span>Press [E / Space / Enter] to continue</span>
            <button
              onClick={() => {
                sound.playJump();
                setActiveChest(null);
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
