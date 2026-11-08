import React, { useState } from 'react';
import { CharacterRole } from '../types';
import { sound } from '../utils/audio';
import { SUNSET_BG_URL } from './CharacterSprite';
import { CoupleInteraction } from './CoupleInteraction';

interface FinalRewardScreenProps {
  playerRole: CharacterRole;
  totalHearts: number;
  letterContent: string;
  onSaveLetter: (newText: string) => void;
  onRestartGame: () => void;
}

export const FinalRewardScreen: React.FC<FinalRewardScreenProps> = ({
  playerRole,
  totalHearts,
  letterContent,
  onSaveLetter,
  onRestartGame,
}) => {
  const [showCertificate, setShowCertificate] = useState(false);
  const [isEditingLetter, setIsEditingLetter] = useState(false);
  const [draftLetter, setDraftLetter] = useState(letterContent);

  const handlePrint = () => {
    window.print();
  };

  const handleSave = () => {
    sound.playHeartPickup();
    onSaveLetter(draftLetter);
    setIsEditingLetter(false);
  };

  return (
    <div
      className="relative w-full h-full overflow-y-auto p-3 sm:p-5 flex flex-col justify-between select-none font-pixel animate-fade-in"
      style={{
        backgroundImage: `url(${SUNSET_BG_URL})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-[#0c0417]/80 via-[#1a082b]/70 to-[#0b0314]/85 pointer-events-none" />

      {/* Floating Celebration Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-4 left-8 text-2xl animate-float-heart">🎆</div>
        <div className="absolute top-8 right-12 text-2xl animate-float-heart" style={{ animationDelay: '300ms' }}>🎇</div>
        <div className="absolute top-16 left-1/3 text-xl animate-float-heart" style={{ animationDelay: '150ms' }}>💖</div>
        <div className="absolute top-20 right-1/4 text-xl animate-float-heart" style={{ animationDelay: '500ms' }}>✨</div>
      </div>

      {/* Top Header Bar */}
      <div className="relative z-10 w-full flex items-center justify-between bg-[#1f0b2f]/90 px-3 py-2 pixel-corners border border-yellow-400 shadow-md text-xs">
        <div className="flex items-center gap-2">
          <span className="text-yellow-300 font-bold">🏆 QUEST COMPLETE:</span>
          <span className="text-pink-100 text-[10px] sm:text-xs">ONE YEAR OF ETERNAL LOVE</span>
        </div>

        <div className="flex items-center gap-2 text-[9px] sm:text-[10px]">
          <button
            onClick={() => {
              sound.playJump();
              setShowCertificate(!showCertificate);
            }}
            className="px-2.5 py-1 bg-pink-800 hover:bg-pink-700 text-yellow-300 pixel-corners border border-pink-400 cursor-pointer"
          >
            {showCertificate ? 'View Letter 💌' : 'View Certificate 📜'}
          </button>
          <button
            onClick={() => {
              sound.playFanfare();
              onRestartGame();
            }}
            className="px-2.5 py-1 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-black font-bold uppercase pixel-corners cursor-pointer"
          >
            PLAY AGAIN 🔄
          </button>
        </div>
      </div>

      {/* Certificate View */}
      {showCertificate ? (
        <div className="relative z-10 bg-[#fffdfa] text-gray-900 p-4 sm:p-6 border-4 sm:border-8 border-double border-[#d4af37] shadow-2xl text-center flex flex-col justify-between max-w-xl mx-auto my-auto max-h-[82%] overflow-y-auto">
          <div>
            <div className="text-3xl mb-1">👑</div>
            <h1 className="font-pixel text-sm sm:text-lg text-[#8b5a00] font-black uppercase tracking-widest">
              Certificate of Eternal Love
            </h1>
            <p className="text-[9px] text-gray-500 font-pixel mt-0.5 uppercase">
              Officially Awarded by The Heart Realm
            </p>

            <div className="my-3 sm:my-4 space-y-1 sm:space-y-2">
              <p className="font-retro text-xl sm:text-2xl text-gray-700">
                This certifies that the legendary duo of
              </p>
              <div className="font-pixel text-base sm:text-xl text-[#b5179e] py-1 border-b-2 border-dashed border-amber-300 inline-block px-6">
                Billo 💙 & 🖤 Pillu
              </div>
              <p className="font-retro text-xl sm:text-2xl text-gray-700 pt-1 leading-relaxed">
                Have successfully remembered their story across <strong>365 Days</strong> —
                from the flower by the sea to the last seat of the bus, from the forest picnic to
                Bangkok after dark — collected {totalHearts} Glowing Hearts, and unlocked the
                permanent title:
              </p>
              <div className="font-pixel text-[10px] sm:text-xs text-amber-900 font-bold bg-amber-100 p-2 border-2 border-amber-400 max-w-md mx-auto">
                ✨ "YOU REMEMBERED OUR STORY — YEAR ONE MASTERED" ✨
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-amber-200 flex items-center justify-between text-left font-retro text-lg sm:text-xl">
            <div>
              <div className="text-gray-500 text-xs">Signed with Kisses:</div>
              <div className="font-pixel text-[10px] text-pink-600 mt-0.5">Billo 💙</div>
            </div>
            <div className="text-2xl text-red-500">❤️</div>
            <div className="text-right">
              <div className="text-gray-500 text-xs">Witnessed by Hugs:</div>
              <div className="font-pixel text-[10px] text-blue-600 mt-0.5">Pillu 😎</div>
            </div>
          </div>

          <button
            onClick={handlePrint}
            className="mt-3 px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white text-[9px] font-pixel uppercase shadow-md self-center cursor-pointer"
          >
            🖨️ Print / Save Certificate PDF
          </button>
        </div>
      ) : (
        /* Main Spectacular Victory Screen */
        <div className="relative z-10 flex flex-col items-center justify-between h-full text-center py-1">
          {/* Header Subtitles */}
          <div className="my-1">
            <span className="text-[10px] sm:text-xs text-yellow-300 font-bold uppercase tracking-widest block mb-0.5 animate-pulse">
              QUEST ACCOMPLISHED!
            </span>
            <h2 className="font-pixel text-xs sm:text-sm md:text-base text-pink-200 uppercase tracking-wider">
              365 DAYS. INFINITE MEMORIES. ONE FAVOURITE PERSON.
            </h2>
          </div>

          {/* Billo & Pillu Together — Interactive Couple */}
          <div className="my-1 flex items-end justify-center gap-4 sm:gap-6">
            <div className="h-[90px] sm:h-[110px] flex items-end justify-center">
              <CoupleInteraction
                size={100}
                gap={52}
                showNameTag={true}
                showButtons={true}
                className="scale-90 sm:scale-100"
              />
            </div>
          </div>

          {/* Anniversary Love Letter Box */}
          <div className="w-full max-w-2xl bg-[#fcf8ee] text-amber-950 p-3 sm:p-4 pixel-corners border-2 sm:border-4 border-[#d1be9b] shadow-2xl relative my-1 text-left flex-1 max-h-[46%] flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-amber-300 pb-1 mb-1">
              <span className="font-pixel text-[9px] sm:text-[10px] text-amber-900 font-bold uppercase">
                💌 Anniversary Love Capsule
              </span>
              <button
                onClick={() => setIsEditingLetter(!isEditingLetter)}
                className="text-[8px] sm:text-[9px] bg-amber-200 hover:bg-amber-300 text-amber-950 px-2 py-0.5 border border-amber-600 font-pixel cursor-pointer"
              >
                {isEditingLetter ? 'Cancel' : '✏️ Personalize Letter'}
              </button>
            </div>

            {isEditingLetter ? (
              <div className="space-y-1.5 flex-1 flex flex-col justify-between">
                <textarea
                  rows={4}
                  value={draftLetter}
                  onChange={(e) => setDraftLetter(e.target.value)}
                  className="w-full bg-[#f4edd9] text-amber-950 p-2 font-retro text-xl border border-amber-600 focus:outline-none flex-1 resize-none"
                />
                <div className="text-right">
                  <button
                    onClick={handleSave}
                    className="px-3 py-1 bg-green-700 hover:bg-green-600 text-white font-pixel text-[8px] uppercase cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            ) : (
              <div className="font-retro text-xl sm:text-2xl leading-relaxed whitespace-pre-wrap text-amber-950 overflow-y-auto pr-2 max-h-[160px]">
                {letterContent}
              </div>
            )}
          </div>

          {/* Play Again Button */}
          <div className="mt-1 flex items-center justify-center">
            <button
              onClick={() => {
                sound.playFanfare();
                onRestartGame();
              }}
              className="px-6 py-2 sm:py-2.5 bg-gradient-to-r from-yellow-400 via-pink-500 to-rose-500 hover:from-yellow-300 hover:to-rose-400 text-black font-pixel text-[10px] sm:text-xs font-bold uppercase pixel-corners shadow-xl animate-pulse cursor-pointer"
            >
              PLAY OUR LOVE STORY AGAIN 🔄
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
