import React, { useEffect, useState } from 'react';
import { CharacterRole } from '../types';
import { sound } from '../utils/audio';
import { CHARACTERS } from '../utils/storage';
import { CharacterSprite, SUNSET_BG_URL } from './CharacterSprite';

interface Level5FinalQuestProps {
  playerRole: CharacterRole;
  onAwardHearts: (amount: number) => void;
  onCompleteLevel: () => void;
}

export const Level5FinalQuest: React.FC<Level5FinalQuestProps> = ({
  playerRole,
  onAwardHearts,
  onCompleteLevel,
}) => {
  // Step 1: 3 Vows, Step 2: Harmony Rhythm, Step 3: Heartfelt Dialogue
  const [stage, setStage] = useState<1 | 2 | 3>(1);

  // Stage 1: The 3 Vows
  const [unlockedVows, setUnlockedVows] = useState<number[]>([]);
  const [vowBubble, setVowBubble] = useState<{ billo: string | null; pillu: string | null }>({
    billo: null,
    pillu: null,
  });

  // Stage 2: Harmony Rhythm
  const [heartHarmonyHits, setHeartHarmonyHits] = useState(0);
  const [pulseScale, setPulseScale] = useState(1);

  // Stage 3: Final Dialogue Lines
  const [dialogueIdx, setDialogueIdx] = useState(0);

  const activeChar = CHARACTERS[playerRole];
  const partnerRole: CharacterRole = playerRole === 'billo' ? 'pillu' : 'billo';
  const partnerChar = CHARACTERS[partnerRole];

  const vows = [
    {
      id: 1,
      title: 'Vow of Patience & Warm Hugs',
      desc: 'To always listen, apologize quickly, and hug tighter through every little misunderstanding.',
      icon: '🫂',
      billoSay: 'Always warm hugs! 💕',
      pilluSay: 'And no sleeping angry! 🫂',
    },
    {
      id: 2,
      title: 'Vow of Endless Laughter & Shared Food',
      desc: 'To share every last bite of fries, send silly midnight memes, and laugh until our bellies ache.',
      icon: '🍟',
      billoSay: 'Save me the fries! 🍟',
      pilluSay: 'All the snacks are yours! 😂',
    },
    {
      id: 3,
      title: 'Vow of Choosing You, Every Single Day',
      desc: 'Through 365 days and all the years ahead, you are my one and only favorite person in the entire universe.',
      icon: '👑',
      billoSay: 'Forever my favorite! 💖',
      pilluSay: 'Eternity with you, Meri Jaan! 👑',
    },
  ];

  const finalDialogueLines = [
    { speaker: 'partner', text: `${partnerChar.name}: "Can you believe we have spent 365 days together already?"`, bubble: '365 days already! 🥹' },
    { speaker: 'active', text: `${activeChar.name}: "Every single day with you has felt like the sweetest adventure."`, bubble: 'The sweetest adventure! ✨' },
    { speaker: 'partner', text: `${partnerChar.name}: "Through all the late night calls, silly arguments, and warm hugs... you became my whole world."`, bubble: 'You are my whole world 💕' },
    { speaker: 'active', text: `${activeChar.name}: "You are my safest place, my biggest smile, and my forever player two."`, bubble: 'My forever player two 👑' },
    { speaker: 'both', text: `Together: "Happy 1st Anniversary! Here is to eternity, cutie! 💖"`, bubble: 'Happy Anniversary! 💖' },
  ];

  // Stage 1: Unlock Vow
  const handleUnlockVow = (id: number) => {
    if (!unlockedVows.includes(id)) {
      sound.playHeartPickup();
      const vow = vows.find((v) => v.id === id);
      if (vow) {
        setVowBubble({ billo: vow.billoSay, pillu: vow.pilluSay });
        setTimeout(() => setVowBubble({ billo: null, pillu: null }), 3000);
      }

      const next = [...unlockedVows, id];
      setUnlockedVows(next);
      if (next.length === 3) {
        sound.playFanfare();
        onAwardHearts(10);
        setTimeout(() => setStage(2), 1200);
      }
    }
  };

  // Stage 2: Rhythm Pulse
  const handleHarmonyClick = () => {
    sound.playHeartPickup();
    setPulseScale(1.4);
    setTimeout(() => setPulseScale(1), 200);
    const nextHits = heartHarmonyHits + 1;
    setHeartHarmonyHits(nextHits);

    if (nextHits >= 5) {
      sound.playVictory();
      onAwardHearts(15);
      setTimeout(() => setStage(3), 1000);
    }
  };

  // Stage 3: Dialogue advance
  const handleNextDialogue = () => {
    if (dialogueIdx < finalDialogueLines.length - 1) {
      sound.playJump();
      setDialogueIdx((prev) => prev + 1);
    } else {
      sound.playFanfare();
      onAwardHearts(25);
      onCompleteLevel();
    }
  };

  // Keyboard navigation for dialogue advance
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (stage === 3 && (e.key === ' ' || e.key === 'Enter' || e.key === 'e' || e.key === 'E')) {
        e.preventDefault();
        handleNextDialogue();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [stage, dialogueIdx]);

  const currentDialogue = finalDialogueLines[dialogueIdx];

  return (
    <div
      className="relative w-full h-full p-3 sm:p-5 flex flex-col justify-between overflow-hidden select-none font-pixel animate-fade-in"
      style={{
        backgroundImage: `url(${SUNSET_BG_URL})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-[#0e051c]/70 pointer-events-none" />

      {/* Phase 1: 3 Vows */}
      {stage === 1 && (
        <div className="relative z-10 flex flex-col items-center justify-between h-full">
          <div className="text-center">
            <span className="text-[10px] sm:text-xs text-yellow-300 uppercase tracking-widest font-bold block mb-0.5">
              Challenge 1 of 3: The 3 Golden Vows
            </span>
            <p className="font-retro text-xl sm:text-2xl text-pink-200">
              Unlock all 3 vows of our relationship to forge the Key of Forever!
            </p>
          </div>

          {/* Billo and Pillu reactive Sprites */}
          <div className="flex items-end justify-center gap-6 my-1">
            <CharacterSprite
              role="billo"
              size={64}
              animation={unlockedVows.length === 3 ? 'celebrate' : 'idle'}
              dialogueBubble={vowBubble.billo}
              showHeart={unlockedVows.length > 0}
              showNameTag={true}
            />
            <CharacterSprite
              role="pillu"
              size={64}
              animation={unlockedVows.length === 3 ? 'celebrate' : 'idle'}
              dialogueBubble={vowBubble.pillu}
              showHeart={unlockedVows.length > 0}
              showNameTag={true}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-3 w-full max-w-2xl my-auto">
            {vows.map((vow) => {
              const isUnlocked = unlockedVows.includes(vow.id);
              return (
                <div
                  key={vow.id}
                  onClick={() => handleUnlockVow(vow.id)}
                  className={`p-3 sm:p-4 pixel-corners border-2 cursor-pointer transition-all flex flex-col justify-between ${
                    isUnlocked
                      ? 'bg-gradient-to-b from-pink-900/90 to-rose-950/90 border-yellow-300 shadow-[0_0_12px_gold]'
                      : 'bg-[#210935]/80 border-pink-700/60 hover:bg-[#341152]'
                  }`}
                >
                  <div>
                    <div className="text-2xl sm:text-3xl mb-1">{vow.icon}</div>
                    <h4 className="text-[9px] sm:text-[10px] text-yellow-300 font-bold mb-1 leading-tight">
                      {vow.title}
                    </h4>
                    <p className="font-retro text-lg sm:text-xl text-pink-100 leading-snug">
                      {vow.desc}
                    </p>
                  </div>

                  <div className="mt-2 pt-1.5 border-t border-pink-800/60 text-center">
                    <span className={`text-[8px] sm:text-[9px] uppercase font-bold ${isUnlocked ? 'text-green-300' : 'text-pink-400'}`}>
                      {isUnlocked ? '✓ Vow Sealed' : 'Tap to Seal Vow'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-[8px] sm:text-[9px] text-pink-300/80">
            {unlockedVows.length} of 3 Vows Sealed
          </div>
        </div>
      )}

      {/* Phase 2: Heart Rhythm */}
      {stage === 2 && (
        <div className="relative z-10 flex flex-col items-center justify-between h-full py-2">
          <div className="text-center">
            <span className="text-[10px] sm:text-xs text-yellow-300 uppercase tracking-widest font-bold block mb-0.5">
              Challenge 2 of 3: Heartbeat Harmony
            </span>
            <p className="font-retro text-xl sm:text-2xl text-pink-200">
              Tap the giant beating heart to sync our pulses into eternal rhythm!
            </p>
          </div>

          {/* Big Interactive Beating Heart */}
          <div className="flex flex-col items-center my-auto cursor-pointer" onClick={handleHarmonyClick}>
            <div
              className="text-7xl sm:text-8xl transition-transform duration-100 filter drop-shadow-[0_0_24px_rgba(255,0,80,0.8)] select-none hover:scale-105 active:scale-95"
              style={{ transform: `scale(${pulseScale})` }}
            >
              💖
            </div>
            <div className="mt-2 text-xs sm:text-sm font-bold text-yellow-300 animate-pulse">
              Harmony Synced: {heartHarmonyHits} / 5
            </div>
            <div className="w-56 sm:w-64 bg-pink-950 h-3 border border-pink-500 mt-2 overflow-hidden pixel-corners">
              <div
                className="h-full bg-gradient-to-r from-pink-500 to-yellow-400 transition-all duration-200"
                style={{ width: `${(heartHarmonyHits / 5) * 100}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <CharacterSprite role="billo" size={58} animation="happy" dialogueBubble={heartHarmonyHits > 2 ? 'In sync! 💕' : null} showNameTag={true} />
            <div className="text-2xl text-pink-400">✨</div>
            <CharacterSprite role="pillu" size={58} animation="happy" dialogueBubble={heartHarmonyHits > 2 ? 'One heartbeat! 💖' : null} showNameTag={true} />
          </div>
        </div>
      )}

      {/* Phase 3: Final Emotional Dialogue with Real Speech Bubbles */}
      {stage === 3 && (
        <div className="relative z-10 flex flex-col items-center justify-between h-full">
          <div className="text-center">
            <span className="text-[10px] sm:text-xs text-yellow-300 uppercase tracking-widest font-bold block mb-0.5">
              Challenge 3 of 3: The 365th Sunrise
            </span>
            <p className="font-retro text-xl sm:text-2xl text-pink-200">
              Holding hands at the summit of our 1-year journey.
            </p>
          </div>

          {/* Billo & Pillu with Active Dialogue Bubbles */}
          <div className="my-auto flex items-end justify-center gap-6 pt-6">
            <CharacterSprite
              role="billo"
              size={86}
              animation="celebrate"
              dialogueBubble={
                currentDialogue.speaker === 'both'
                  ? currentDialogue.bubble
                  : (currentDialogue.speaker === 'active' && playerRole === 'billo') ||
                    (currentDialogue.speaker === 'partner' && playerRole === 'pillu')
                  ? currentDialogue.bubble
                  : null
              }
              showHeart={true}
              showNameTag={true}
            />
            <div className="text-3xl sm:text-4xl text-rose-500 animate-float-heart pb-2">❤️</div>
            <CharacterSprite
              role="pillu"
              size={86}
              animation="celebrate"
              dialogueBubble={
                currentDialogue.speaker === 'both'
                  ? currentDialogue.bubble
                  : (currentDialogue.speaker === 'active' && playerRole === 'pillu') ||
                    (currentDialogue.speaker === 'partner' && playerRole === 'billo')
                  ? currentDialogue.bubble
                  : null
              }
              showHeart={true}
              showNameTag={true}
            />
          </div>

          {/* Retro Dialogue Box */}
          <div
            onClick={handleNextDialogue}
            className="w-full bg-[#1c0828]/95 p-3.5 sm:p-4 pixel-border border-yellow-400 cursor-pointer shadow-2xl relative"
          >
            <div className="flex items-center justify-between text-[8px] sm:text-[9px] text-pink-400 mb-1 border-b border-pink-800 pb-1">
              <span className="text-yellow-300 font-bold">Billo & Pillu</span>
              <span>
                Line {dialogueIdx + 1} of {finalDialogueLines.length} · [Space / Enter / Click]
              </span>
            </div>
            <p className="font-retro text-xl sm:text-2xl md:text-3xl text-pink-100 leading-snug">
              {currentDialogue.text}
            </p>
            <div className="text-right mt-1.5 text-[8px] sm:text-[9px] text-yellow-300 animate-pulse">
              {dialogueIdx < finalDialogueLines.length - 1 ? 'Tap to continue ▼' : 'Unlock Anniversary Reward! 🏆'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
