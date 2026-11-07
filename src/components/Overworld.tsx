import React, { useEffect, useState } from 'react';
import { BattleOpponent, CharacterRole, GameSaveState, Quest } from '../types';
import { sound } from '../utils/audio';
import { CHARACTERS, QUESTS } from '../utils/storage';
import { PixelCharacter } from './PixelCharacter';

interface OverworldProps {
  gameState: GameSaveState;
  onUpdateState: (updater: (prev: GameSaveState) => GameSaveState) => void;
  onTriggerDialog: (speaker: string, avatar: string, lines: string[]) => void;
  onTriggerBattle: (opponent: BattleOpponent) => void;
  onOpenScrapbook: () => void;
  onOpenMiniGame: () => void;
  onOpenLetter: () => void;
  onSwitchCharacter: () => void;
}

interface TileObject {
  x: number;
  y: number;
  id: string;
  type: 'chest' | 'npc' | 'crystal' | 'portal' | 'fountain' | 'tree' | 'flowers';
  name: string;
  icon: string;
  actionText: string;
}

export const Overworld: React.FC<OverworldProps> = ({
  gameState,
  onUpdateState,
  onTriggerDialog,
  onTriggerBattle,
  onOpenScrapbook,
  onOpenMiniGame,
  onOpenLetter,
  onSwitchCharacter,
}) => {
  const [direction, setDirection] = useState<'up' | 'down' | 'left' | 'right'>('down');
  const [isWalking, setIsWalking] = useState(false);
  const [openedChests, setOpenedChests] = useState<string[]>([]);
  const [starsLit, setStarsLit] = useState<number[]>([]);

  const activeChar = CHARACTERS[gameState.playerRole];
  const partnerRole: CharacterRole = gameState.playerRole === 'billo' ? 'pillu' : 'billo';
  const partnerChar = CHARACTERS[partnerRole];

  // Grid bounds: 12 wide (0-11), 10 high (0-9)
  const MAP_WIDTH = 12;
  const MAP_HEIGHT = 10;

  // Tile interactive landmarks on the map
  const landmarks: TileObject[] = [
    // Center Fountain
    { x: 5, y: 5, id: 'fountain', type: 'fountain', name: 'Fountain of 1 Year', icon: '⛲', actionText: 'Make an Anniversary Wish' },
    { x: 6, y: 5, id: 'anniversary_statue', type: 'fountain', name: 'Statue of Us', icon: '💑', actionText: 'Admire Statue of Billo & Pillu' },

    // Zone 1: East Meadow of Firsts
    { x: 10, y: 3, id: 'first_coffee_chest', type: 'chest', name: 'First Date Coffee Cup', icon: '☕', actionText: 'Inspect First Date Coffee Cup' },
    { x: 9, y: 2, id: 'cupid_npc', type: 'npc', name: 'Cupid of Beginnings', icon: '🧚', actionText: 'Talk to Memory Sprite' },
    { x: 10, y: 5, id: 'rose_field', type: 'flowers', name: 'Blooming Heart Roses', icon: '🌹', actionText: 'Smell Flowers' },

    // Zone 2: West Whisper Caverns
    { x: 1, y: 2, id: 'star_pillar_1', type: 'crystal', name: '3AM Call Star Pillar', icon: '⭐', actionText: 'Light up 3AM Call Star' },
    { x: 2, y: 4, id: 'star_pillar_2', type: 'crystal', name: 'Inside Joke Star Pillar', icon: '🌟', actionText: 'Light up Inside Joke Star' },
    { x: 1, y: 6, id: 'star_pillar_3', type: 'crystal', name: 'Endless Playlist Star', icon: '✨', actionText: 'Light up Playlist Star' },

    // Zone 3: South Foodie Glade
    { x: 5, y: 8, id: 'hangry_monster', type: 'npc', name: 'The Hangry Snack Gremlin', icon: '👾', actionText: 'Soothe the Hangry Gremlin!' },
    { x: 8, y: 8, id: 'boba_stand', type: 'chest', name: 'Secret Boba Cart', icon: '🧋', actionText: 'Grab Free Brown Sugar Boba' },
    { x: 3, y: 8, id: 'pizza_oven', type: 'chest', name: 'Cheesy Pizza Oven', icon: '🍕', actionText: 'Share a Slice of Pizza' },

    // Zone 4: South-West Bridge of Hugs
    { x: 1, y: 8, id: 'storm_cloud', type: 'npc', name: 'Stormy Pout Cloud', icon: '🌧️', actionText: 'Give a Hug to Dispel Storm' },

    // Zone 5: North Castle of Forever
    { x: 5, y: 1, id: 'forever_castle_gate', type: 'portal', name: 'Castle of 1 Year Vault', icon: '🏰', actionText: 'Enter Grand Vault of Forever' },
    { x: 6, y: 1, id: 'golden_heart_lock', type: 'portal', name: '5-Crystal Seal', icon: '💎', actionText: 'Unlock Crystal Gate' },
  ];

  // Movement handler
  const movePlayer = (dx: number, dy: number, newDir: 'up' | 'down' | 'left' | 'right') => {
    setDirection(newDir);
    setIsWalking(true);

    const nextX = Math.max(0, Math.min(MAP_WIDTH - 1, gameState.playerX + dx));
    const nextY = Math.max(0, Math.min(MAP_HEIGHT - 1, gameState.playerY + dy));

    // Collision check for fountain block
    if ((nextX === 5 && nextY === 5) || (nextX === 6 && nextY === 5)) {
      sound.playBlip();
      setTimeout(() => setIsWalking(false), 200);
      return;
    }

    sound.playBlip();
    onUpdateState((prev) => ({
      ...prev,
      playerX: nextX,
      playerY: nextY,
    }));

    setTimeout(() => setIsWalking(false), 200);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if an input is focused
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') {
        return;
      }

      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        e.preventDefault();
        movePlayer(0, -1, 'up');
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        e.preventDefault();
        movePlayer(0, 1, 'down');
      } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        movePlayer(-1, 0, 'left');
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        movePlayer(1, 0, 'right');
      } else if (e.key === ' ' || e.key === 'e' || e.key === 'E' || e.key === 'Enter') {
        e.preventDefault();
        handleInteract();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState.playerX, gameState.playerY, gameState.crystalsCollected, starsLit, openedChests]);

  // Find nearest interactive object (on the same tile or 1 tile away)
  const nearbyObject = landmarks.find(
    (lm) => Math.abs(lm.x - gameState.playerX) <= 1 && Math.abs(lm.y - gameState.playerY) <= 1
  );

  const handleInteract = () => {
    if (!nearbyObject) {
      sound.playJump();
      onTriggerDialog(
        activeChar.name,
        activeChar.avatarIcon,
        [
          `"Holding your hand makes every step feel like home."`,
          `${partnerChar.name}: "Same here, my favorite person in the whole universe! 💖"`,
        ]
      );
      return;
    }

    sound.playJump();

    // Specific Landmark Interactions:
    if (nearbyObject.id === 'fountain' || nearbyObject.id === 'anniversary_statue') {
      sound.playHeartPickup();
      onTriggerDialog(
        'Fountain of 1 Year',
        '⛲',
        [
          'The waters shimmer with 365 golden reflections!',
          'Whisper your anniversary wish together into the fountain...',
          `${activeChar.name}: "I wish for infinite more dates, cozy movie nights, and belly laughs with you!"`,
          `${partnerChar.name}: "Wish granted! Forever locked in! 💕"`,
        ]
      );
    } else if (nearbyObject.id === 'first_coffee_chest') {
      if (!gameState.crystalsCollected[0]) {
        sound.playFanfare();
        onUpdateState((prev) => {
          const nextCrystals = [...prev.crystalsCollected];
          nextCrystals[0] = true;
          return {
            ...prev,
            crystalsCollected: nextCrystals,
            sparkPoints: prev.sparkPoints + 150,
          };
        });
        setOpenedChests((prev) => [...prev, 'first_coffee_chest']);
        onTriggerDialog(
          'First Date Memory Cup',
          '☕',
          [
            'You discovered the Golden First Coffee Cup!',
            `${partnerChar.name}: "I was so nervous when we first met, but talking to you felt so natural."`,
            `${activeChar.name}: "I knew right then and there that you were someone very special."`,
            '✨ Memory Crystal #1 (Golden Spark) has been recovered!',
          ]
        );
      } else {
        onTriggerDialog(
          'First Date Memory Cup',
          '☕',
          ['The memory cup glows warmly with the warmth of Day 1.']
        );
      }
    } else if (nearbyObject.id.startsWith('star_pillar_')) {
      const pillarIndex = parseInt(nearbyObject.id.replace('star_pillar_', ''));
      if (!starsLit.includes(pillarIndex)) {
        sound.playHeartPickup();
        const nextStars = [...starsLit, pillarIndex];
        setStarsLit(nextStars);

        if (nextStars.length >= 3 && !gameState.crystalsCollected[1]) {
          sound.playFanfare();
          onUpdateState((prev) => {
            const nextC = [...prev.crystalsCollected];
            nextC[1] = true;
            return { ...prev, crystalsCollected: nextC, sparkPoints: prev.sparkPoints + 200 };
          });
          onTriggerDialog(
            'Starry Constellation',
            '✨',
            [
              'All 3 Star Pillars of Late-Night Talks are now blazing with light!',
              `${activeChar.name}: "Remember falling asleep on call together while listening to lo-fi beats?"`,
              `${partnerChar.name}: "Every late night with you felt like time stood still."`,
              '✨ Memory Crystal #2 (Midnight Sapphire) has been recovered!',
            ]
          );
        } else {
          onTriggerDialog(
            nearbyObject.name,
            '⭐',
            [
              `You lit the ${nearbyObject.name}! (${nextStars.length}/3 star pillars lit in Whisper Caverns).`,
            ]
          );
        }
      } else {
        onTriggerDialog(
          nearbyObject.name,
          '⭐',
          ['This star pillar is already burning brightly with love.']
        );
      }
    } else if (nearbyObject.id === 'hangry_monster') {
      // Trigger Battle!
      const hangryOpponent: BattleOpponent = {
        id: 'hangry_boss',
        name: 'The Hangry Snack Gremlin',
        hp: 100,
        maxHp: 100,
        sprite: '👾',
        dialogues: {
          start: 'GRRR! Someone forgot to order snacks on time! Pout mode activated!',
          turns: [
            'I demand crispy french fries and warm boba immediately!',
            'Why are you looking so cute while I am trying to be grumpy?!',
            'One more sweet smile and I might forgive you...',
          ],
          soothed: 'Nom nom nom... The food and hugs are too good... Grumpiness completely neutralized!',
        },
        defeatText: 'The Gremlin turns into a cuddly purring kitten and gives you Memory Crystal #3!',
        weakness: 'Boba & Warm Hugs',
        rewards: {
          crystalIndex: 2,
          sparkPoints: 250,
          itemName: 'Heart Macaron',
        },
      };

      onTriggerBattle(hangryOpponent);
    } else if (nearbyObject.id === 'boba_stand' || nearbyObject.id === 'pizza_oven') {
      sound.playHeartPickup();
      onUpdateState((prev) => ({ ...prev, sparkPoints: prev.sparkPoints + 50 }));
      onTriggerDialog(
        nearbyObject.name,
        nearbyObject.icon,
        [
          `You shared a warm ${nearbyObject.name}! (+50 Love Spark Points)`,
          `${partnerChar.name}: "You get the last bite, cutie!"`,
          `${activeChar.name}: "No, you take it! We split it 50/50!"`,
        ]
      );
    } else if (nearbyObject.id === 'storm_cloud') {
      sound.playLoveBurst();
      if (!gameState.crystalsCollected[3]) {
        sound.playFanfare();
        onUpdateState((prev) => {
          const nextC = [...prev.crystalsCollected];
          nextC[3] = true;
          return { ...prev, crystalsCollected: nextC, sparkPoints: prev.sparkPoints + 200 };
        });
        onTriggerDialog(
          'Bridge of Hugs',
          '🌈',
          [
            'You wrapped each other in a warm, patient hug!',
            'The stormy grey clouds dissolve into a vibrant double rainbow over the mountain!',
            `${partnerChar.name}: "I am sorry for being stubborn earlier."`,
            `${activeChar.name}: "I love you no matter what. We always fix things together."`,
            '✨ Memory Crystal #4 (Ruby of Trust) has been recovered!',
          ]
        );
      } else {
        onTriggerDialog(
          'Rainbow Bridge',
          '🌈',
          ['The rainbow bridge shines brightly, reminding you that hugs always conquer storms.']
        );
      }
    } else if (nearbyObject.id === 'forever_castle_gate' || nearbyObject.id === 'golden_heart_lock') {
      const crystalsRecovered = gameState.crystalsCollected.filter(Boolean).length;
      if (crystalsRecovered >= 4) {
        sound.playFanfare();
        if (!gameState.crystalsCollected[4]) {
          onUpdateState((prev) => {
            const nextC = [...prev.crystalsCollected];
            nextC[4] = true;
            return { ...prev, crystalsCollected: nextC, sparkPoints: prev.sparkPoints + 500 };
          });
        }
        onTriggerDialog(
          'Grand Vault of 1 Year',
          '🏰',
          [
            'THE VAULT GATES SWING OPEN IN A BURST OF CONFETTI!',
            '👑 Memory Crystal #5 (The Heart Diamond of Forever) is revealed!',
            'HAPPY ONE YEAR ANNIVERSARY BILLO & PILLU!',
            'Your secret love letter, completion certificate, and celebration scrapbook are now completely unlocked!',
          ]
        );
        setTimeout(() => {
          onOpenLetter();
        }, 1200);
      } else {
        sound.playBlip();
        onTriggerDialog(
          'Castle of Forever Gate',
          '🏰',
          [
            `The grand vault requires all 5 Memory Crystals to open!`,
            `You have recovered ${crystalsRecovered}/5 crystals so far.`,
            'Hint: Explore the Meadow, Caverns, Foodie Glade, and Rainbow Bridge to find them all!',
          ]
        );
      }
    } else {
      sound.playHeartPickup();
      onTriggerDialog(
        nearbyObject.name,
        nearbyObject.icon,
        [`${nearbyObject.name}: Pure love and happiness fills the air!`]
      );
    }
  };

  // Follower position (partner walks 1 tile behind)
  const followerX =
    direction === 'left'
      ? Math.min(MAP_WIDTH - 1, gameState.playerX + 1)
      : direction === 'right'
      ? Math.max(0, gameState.playerX - 1)
      : gameState.playerX;

  const followerY =
    direction === 'up'
      ? Math.min(MAP_HEIGHT - 1, gameState.playerY + 1)
      : direction === 'down'
      ? Math.max(0, gameState.playerY - 1)
      : gameState.playerY;

  return (
    <div className="relative w-full max-w-4xl mx-auto flex flex-col items-center select-none font-pixel">
      {/* Top HUD: Crystals collected, Points, Character Switch, Action Triggers */}
      <div className="w-full bg-[#180a26] p-2 md:p-3 pixel-border border-pink-500/80 mb-3 flex flex-wrap items-center justify-between gap-2 shadow-xl">
        {/* Crystal Slots Bar */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-pink-300 uppercase font-bold">Crystals:</span>
          <div className="flex items-center gap-1.5">
            {['🟡 Spark', '🔵 Whispers', '🟢 Foodie', '🔴 Bridge', '💎 Forever'].map((cName, idx) => {
              const collected = gameState.crystalsCollected[idx];
              return (
                <div
                  key={idx}
                  title={cName}
                  className={`w-6 h-6 md:w-7 md:h-7 flex items-center justify-center text-xs border transition-all ${
                    collected
                      ? 'bg-yellow-500/30 border-yellow-400 shadow-md scale-105'
                      : 'bg-black/40 border-pink-900/60 opacity-40'
                  }`}
                >
                  {collected ? ['✨', '🌙', '🍜', '🌈', '👑'][idx] : '🔒'}
                </div>
              );
            })}
          </div>
        </div>

        {/* Love Spark Points */}
        <div className="flex items-center gap-1 text-xs text-yellow-300">
          <span>💖</span>
          <span className="font-bold">{gameState.sparkPoints} Sparks</span>
        </div>

        {/* Action Buttons Hub */}
        <div className="flex items-center gap-1.5 text-[9px] md:text-[10px]">
          <button
            onClick={onSwitchCharacter}
            className="px-2 py-1 bg-pink-950 hover:bg-pink-900 text-pink-200 border border-pink-400 flex items-center gap-1"
            title="Switch who leads the party"
          >
            <span>🔄</span>
            <span>Lead: {activeChar.name}</span>
          </button>

          <button
            onClick={onOpenScrapbook}
            className="px-2 py-1 bg-[#2b0d3f] hover:bg-[#3d135c] text-yellow-300 border border-yellow-500/60 flex items-center gap-1"
          >
            <span>📖</span>
            <span>Museum</span>
          </button>

          <button
            onClick={onOpenMiniGame}
            className="px-2 py-1 bg-[#3a1c54] hover:bg-[#4d2570] text-pink-200 border border-pink-400/60 flex items-center gap-1"
          >
            <span>🧺</span>
            <span>Catch!</span>
          </button>

          <button
            onClick={onOpenLetter}
            className="px-2 py-1 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-bold border border-yellow-300 flex items-center gap-1"
          >
            <span>💌</span>
            <span>Letter</span>
          </button>
        </div>
      </div>

      {/* Main 2D Overworld Viewport Container */}
      <div className="relative w-full aspect-[12/10] bg-[#1a2d1d] pixel-border border-yellow-500/70 overflow-hidden shadow-2xl">
        {/* Decorative Grid Grass & Pathways */}
        <div
          className="absolute inset-0 grid grid-cols-12 grid-rows-10"
          style={{
            backgroundImage: `
              radial-gradient(circle, #254228 10%, transparent 11%),
              radial-gradient(circle, #223c25 10%, transparent 11%)
            `,
            backgroundSize: '8.333% 10%',
          }}
        >
          {/* North Castle zone backdrop */}
          <div className="col-span-12 row-span-2 bg-[#2a1b38]/70 border-b border-pink-900/50 flex items-center justify-center">
            <span className="text-[10px] text-pink-400/40 uppercase tracking-widest">
              🏰 Castle of Forever (Zone 5)
            </span>
          </div>
          {/* West Whisper Caverns zone backdrop */}
          <div className="col-span-3 row-span-5 col-start-1 row-start-3 bg-[#111c33]/50 border-r border-blue-900/40 p-1">
            <span className="text-[8px] text-blue-300/50 block">🌙 Whisper Caverns</span>
          </div>
          {/* East Meadow zone backdrop */}
          <div className="col-span-3 row-span-5 col-start-10 row-start-3 bg-[#3d2138]/50 border-l border-pink-900/40 p-1 text-right">
            <span className="text-[8px] text-pink-300/50 block">🌹 Meadow of Firsts</span>
          </div>
          {/* South Foodie Glade backdrop */}
          <div className="col-span-12 row-span-3 col-start-1 row-start-8 bg-[#2d1e15]/50 border-t border-amber-900/40 p-1 flex justify-between">
            <span className="text-[8px] text-amber-300/50">🌈 Rainbow Pass</span>
            <span className="text-[8px] text-amber-300/50">🍜 Foodie Glade</span>
          </div>
        </div>

        {/* Interactive Landmarks Sprites on Grid */}
        {landmarks.map((lm) => {
          const isNearby =
            Math.abs(lm.x - gameState.playerX) <= 1 && Math.abs(lm.y - gameState.playerY) <= 1;

          return (
            <div
              key={lm.id}
              onClick={() => {
                if (isNearby) handleInteract();
              }}
              className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center transition-all cursor-pointer"
              style={{
                left: `${((lm.x + 0.5) / MAP_WIDTH) * 100}%`,
                top: `${((lm.y + 0.5) / MAP_HEIGHT) * 100}%`,
              }}
            >
              <div
                className={`text-2xl md:text-3xl transition-transform ${
                  isNearby ? 'scale-125 animate-bounce drop-shadow-[0_0_8px_gold]' : ''
                }`}
              >
                {lm.icon}
              </div>
              {isNearby && (
                <span className="text-[8px] md:text-[9px] bg-black/85 text-yellow-300 px-1.5 py-0.5 border border-yellow-400 whitespace-nowrap mt-1 shadow">
                  [Space / Tap]
                </span>
              )}
            </div>
          );
        })}

        {/* Partner Character Following Behind */}
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-200 pointer-events-none"
          style={{
            left: `${((followerX + 0.5) / MAP_WIDTH) * 100}%`,
            top: `${((followerY + 0.5) / MAP_HEIGHT) * 100}%`,
          }}
        >
          <PixelCharacter
            role={partnerRole}
            size={36}
            direction={direction}
            isWalking={isWalking}
          />
        </div>

        {/* Player Character Leading */}
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-150 pointer-events-none"
          style={{
            left: `${((gameState.playerX + 0.5) / MAP_WIDTH) * 100}%`,
            top: `${((gameState.playerY + 0.5) / MAP_HEIGHT) * 100}%`,
          }}
        >
          <PixelCharacter
            role={gameState.playerRole}
            size={42}
            direction={direction}
            isWalking={isWalking}
            isHappy={gameState.crystalsCollected.every(Boolean)}
          />
          {/* Mini name tag */}
          <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-[7px] text-pink-200 bg-black/60 px-1 rounded-sm whitespace-nowrap">
            {activeChar.name}
          </span>
        </div>

        {/* Glowing Heart Line between Billo and Pillu */}
        <div className="absolute top-2 left-2 text-[8px] text-pink-300 bg-black/60 px-2 py-1 border border-pink-800">
          📍 Zone: {gameState.playerX < 3 ? 'Whisper Caverns' : gameState.playerX > 8 ? 'Meadow of Firsts' : gameState.playerY < 3 ? 'Castle of Forever' : gameState.playerY > 6 ? 'Foodie Glade' : 'Center Plaza'}
        </div>
      </div>

      {/* Bottom Controls Bar: Prompt + Mobile D-Pad */}
      <div className="w-full mt-3 grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        {/* Objective & Action Prompt */}
        <div className="md:col-span-8 bg-[#150724] p-3 pixel-border border-pink-400 text-pink-200 flex flex-col justify-between">
          <div className="text-[10px] text-yellow-300 font-bold mb-1 flex items-center gap-1.5">
            <span>🎯 Current Quest:</span>
            <span>
              {QUESTS.find((q: Quest) => !gameState.crystalsCollected[q.rewardCrystal])?.title ||
                'All 5 Crystals Collected! Enter Castle of Forever!'}
            </span>
          </div>
          <div className="text-[9px] text-pink-300/80">
            {nearbyObject ? (
              <span className="text-green-300 font-bold animate-pulse">
                Press [Space / Tap Action] to: {nearbyObject.actionText}!
              </span>
            ) : (
              <span>
                Use Arrow Keys / WASD or D-Pad below to explore and talk to your partner.
              </span>
            )}
          </div>
        </div>

        {/* Mobile / Touch D-Pad Controls */}
        <div className="md:col-span-4 flex items-center justify-center gap-4">
          {/* D-Pad Buttons */}
          <div className="grid grid-cols-3 gap-1 w-28">
            <div />
            <button
              onClick={() => movePlayer(0, -1, 'up')}
              className="w-9 h-9 bg-pink-900/60 hover:bg-pink-800 active:scale-90 border-2 border-pink-500 text-pink-200 text-xs flex items-center justify-center shadow"
            >
              ▲
            </button>
            <div />
            <button
              onClick={() => movePlayer(-1, 0, 'left')}
              className="w-9 h-9 bg-pink-900/60 hover:bg-pink-800 active:scale-90 border-2 border-pink-500 text-pink-200 text-xs flex items-center justify-center shadow"
            >
              ◀
            </button>
            <button
              onClick={() => movePlayer(0, 1, 'down')}
              className="w-9 h-9 bg-pink-900/60 hover:bg-pink-800 active:scale-90 border-2 border-pink-500 text-pink-200 text-xs flex items-center justify-center shadow"
            >
              ▼
            </button>
            <button
              onClick={() => movePlayer(1, 0, 'right')}
              className="w-9 h-9 bg-pink-900/60 hover:bg-pink-800 active:scale-90 border-2 border-pink-500 text-pink-200 text-xs flex items-center justify-center shadow"
            >
              ▶
            </button>
          </div>

          {/* Action / Space Button */}
          <button
            onClick={handleInteract}
            className="w-16 h-16 bg-gradient-to-br from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 active:scale-90 pixel-border border-yellow-300 text-white font-bold text-[10px] flex flex-col items-center justify-center shadow-lg"
          >
            <span>💖</span>
            <span>ACTION</span>
          </button>
        </div>
      </div>
    </div>
  );
};
