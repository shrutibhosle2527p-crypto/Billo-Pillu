import React, { useState } from 'react';
import { BattleAction, BattleOpponent, CharacterRole } from '../types';
import { sound } from '../utils/audio';
import { CHARACTERS } from '../utils/storage';
import { PixelCharacter } from './PixelCharacter';

interface BattleViewProps {
  playerRole: CharacterRole;
  opponent: BattleOpponent;
  onVictory: () => void;
  onEscape: () => void;
}

export const BattleView: React.FC<BattleViewProps> = ({
  playerRole,
  opponent,
  onVictory,
  onEscape,
}) => {
  const [playerHp, setPlayerHp] = useState(100);
  const [monsterHp, setMonsterHp] = useState(opponent.hp);
  const [dialogueText, setDialogueText] = useState(opponent.dialogues.start);
  const [isActing, setIsActing] = useState(false);
  const [battleFinished, setBattleFinished] = useState(false);
  const [floatingDamage, setFloatingDamage] = useState<{ text: string; isOpponent: boolean } | null>(null);

  const character = CHARACTERS[playerRole];

  const actions: BattleAction[] = [
    {
      id: 'hug',
      name: 'Super Warm Hug',
      type: 'hug',
      power: 35,
      description: 'Wraps the target in an affectionate cuddle that melts all stress.',
      dialogue: `${character.name} wraps both arms around ${opponent.name} in the coziest bear hug ever!`,
    },
    {
      id: 'snack',
      name: 'Favorite Boba & Fries',
      type: 'snack',
      power: 45,
      description: 'Feeds delicious sweet treats and snacks.',
      dialogue: `${character.name} shares a warm brown sugar boba and hot french fries! Nom nom nom!`,
    },
    {
      id: 'compliment',
      name: 'Sweet Compliment',
      type: 'love',
      power: 30,
      description: 'Whispers why they are the most special cutie on Earth.',
      dialogue: `${character.name} whispers: "You are the cutest and my whole heart belongs to you!"`,
    },
    {
      id: 'joke',
      name: 'Silly Inside Joke',
      type: 'joke',
      power: 40,
      description: 'Reminds them of that one hilarious moment that made both of you wheeze.',
      dialogue: `${character.name} references the funniest inside joke from Month 3! Irresistible giggles erupt!`,
    },
  ];

  const handleAction = (action: BattleAction) => {
    if (isActing || battleFinished) return;
    setIsActing(true);
    sound.playLoveBurst();

    setDialogueText(action.dialogue);
    setFloatingDamage({ text: `+${action.power} LOVE!`, isOpponent: true });

    setTimeout(() => {
      const nextHp = Math.max(0, monsterHp - action.power);
      setMonsterHp(nextHp);
      setFloatingDamage(null);

      if (nextHp <= 0) {
        // Victory!
        sound.playVictory();
        setBattleFinished(true);
        setDialogueText(opponent.dialogues.soothed);
        setTimeout(() => {
          setDialogueText(opponent.defeatText);
        }, 1800);
      } else {
        // Opponent turn (cute counter)
        setTimeout(() => {
          const randomDialog =
            opponent.dialogues.turns[Math.floor(Math.random() * opponent.dialogues.turns.length)];
          setDialogueText(`${opponent.name}: "${randomDialog}"`);
          sound.playJump();

          const incomingHurt = Math.floor(Math.random() * 12) + 5;
          setPlayerHp((prev) => Math.max(10, prev - incomingHurt));
          setFloatingDamage({ text: `-${incomingHurt} Pout!`, isOpponent: false });

          setTimeout(() => {
            setFloatingDamage(null);
            setIsActing(false);
          }, 1000);
        }, 1200);
      }
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0e071c] flex flex-col items-center justify-between p-4 md:p-8 font-pixel select-none overflow-hidden">
      {/* Top Banner */}
      <div className="w-full max-w-3xl flex items-center justify-between text-xs md:text-sm text-pink-300 pb-2 border-b-2 border-pink-900/50">
        <div className="flex items-center gap-2">
          <span>⚔️</span>
          <span>WHOLSOME RELATIONSHIP ENCOUNTER!</span>
        </div>
        <button
          onClick={onEscape}
          className="text-pink-400 hover:text-white px-2 py-1 bg-pink-950/40 border border-pink-700/50 hover:bg-pink-900/50 text-[10px]"
        >
          Mercy / Exit
        </button>
      </div>

      {/* Main Battle Arena */}
      <div className="w-full max-w-3xl flex-1 flex flex-col justify-around py-4 relative">
        {/* Opponent Row (Top Right) */}
        <div className="flex justify-end items-center gap-6 px-4">
          <div className="bg-[#1b0a2a] p-3 md:p-4 pixel-border border-yellow-400/80 min-w-[200px] md:min-w-[260px] shadow-xl">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-yellow-300 font-bold">{opponent.name}</span>
              <span className="text-[10px] text-pink-300">Cute Obstacle</span>
            </div>
            {/* Monster Love / Calm Meter */}
            <div className="w-full bg-pink-950 h-3 border border-pink-600 relative overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-yellow-500 to-pink-500 transition-all duration-500"
                style={{ width: `${(monsterHp / opponent.maxHp) * 100}%` }}
              />
            </div>
            <div className="text-[10px] text-right mt-1 text-pink-200">
              Calm Meter: {monsterHp} / {opponent.maxHp}
            </div>
          </div>

          {/* Opponent Sprite */}
          <div className="relative text-6xl md:text-8xl animate-bounce">
            <span>{opponent.sprite}</span>
            {floatingDamage?.isOpponent && (
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-sm text-yellow-300 animate-ping whitespace-nowrap bg-black/60 px-2 py-0.5">
                {floatingDamage.text}
              </span>
            )}
          </div>
        </div>

        {/* Player Row (Bottom Left) */}
        <div className="flex justify-start items-center gap-6 px-4">
          {/* Player & Partner Sprites */}
          <div className="relative flex items-end gap-2">
            <PixelCharacter role={playerRole} size={64} isHappy={battleFinished} />
            <PixelCharacter
              role={playerRole === 'billo' ? 'pillu' : 'billo'}
              size={56}
              isHappy={battleFinished}
            />
            {floatingDamage && !floatingDamage.isOpponent && (
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-sm text-pink-400 animate-ping whitespace-nowrap bg-black/60 px-2 py-0.5">
                {floatingDamage.text}
              </span>
            )}
          </div>

          <div className="bg-[#1b0a2a] p-3 md:p-4 pixel-border border-pink-400 min-w-[200px] md:min-w-[260px] shadow-xl">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-pink-300 font-bold">{character.name} & {character.partnerName}</span>
              <span className="text-[10px] text-green-300">Party Lv. 365</span>
            </div>
            {/* Player Happiness Bar */}
            <div className="w-full bg-pink-950 h-3 border border-pink-600 relative overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-pink-500 to-rose-400 transition-all duration-300"
                style={{ width: `${playerHp}%` }}
              />
            </div>
            <div className="text-[10px] text-right mt-1 text-pink-200">
              Heart Energy: {playerHp} / 100
            </div>
          </div>
        </div>
      </div>

      {/* Battle Bottom Console: Dialogue & Action Grid */}
      <div className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-12 gap-3 min-h-[140px]">
        {/* Dialogue / Narrative Box */}
        <div className="md:col-span-7 bg-[#160624] p-4 pixel-border border-pink-500 text-pink-100 flex flex-col justify-between">
          <div className="font-retro text-2xl md:text-3xl leading-tight tracking-wide text-pink-100">
            {dialogueText}
          </div>
          {battleFinished && (
            <button
              onClick={() => {
                sound.playFanfare();
                onVictory();
              }}
              className="mt-2 w-full py-2 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 text-black font-bold text-xs uppercase pixel-corners shadow-lg animate-pulse"
            >
              🎉 Claim Memory Crystal Reward! →
            </button>
          )}
        </div>

        {/* Action Buttons */}
        <div className="md:col-span-5 grid grid-cols-2 gap-2">
          {actions.map((act) => (
            <button
              key={act.id}
              disabled={isActing || battleFinished}
              onClick={() => handleAction(act)}
              className="p-2.5 bg-[#250d38] hover:bg-[#3d135c] active:scale-95 disabled:opacity-50 text-left border-2 border-pink-400/40 hover:border-pink-300 flex flex-col justify-between transition-all"
            >
              <span className="text-[10px] md:text-xs text-yellow-300 leading-tight">
                {act.name}
              </span>
              <span className="text-[9px] text-pink-300/80 mt-1">
                +{act.power} Love
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
