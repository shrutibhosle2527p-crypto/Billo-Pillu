import React, { useState } from 'react';
import { CharacterRole } from '../types';
import { sound } from '../utils/audio';
import { CHARACTERS } from '../utils/storage';

interface LoveLetterProps {
  playerRole: CharacterRole;
  letterContent: string;
  onSaveLetter: (newContent: string) => void;
  onClose: () => void;
  crystalsCount: number;
}

export const LoveLetter: React.FC<LoveLetterProps> = ({
  playerRole,
  letterContent,
  onSaveLetter,
  onClose,
  crystalsCount,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [draftContent, setDraftContent] = useState(letterContent);
  const [viewCertificate, setViewCertificate] = useState(false);

  const character = CHARACTERS[playerRole];

  const handleOpenEnvelope = () => {
    sound.playHeartPickup();
    setIsOpen(true);
  };

  const handleSave = () => {
    onSaveLetter(draftContent);
    setIsEditing(false);
    sound.playHeartPickup();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-3 md:p-6 font-pixel select-none overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#1b0a2a] pixel-border border-yellow-400 p-5 md:p-8 text-pink-100 flex flex-col justify-between max-h-[92vh] overflow-y-auto shadow-2xl">
        {/* Top bar */}
        <div className="flex items-center justify-between border-b border-pink-800/80 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">💌</span>
            <span className="text-xs md:text-sm text-yellow-300 font-bold uppercase">
              {viewCertificate ? 'Official 1-Year Quest Certificate' : 'The 365-Day Anniversary Letter'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                sound.playJump();
                setViewCertificate(!viewCertificate);
              }}
              className="px-2 py-1 bg-pink-900/60 hover:bg-pink-800 text-[9px] text-pink-200 border border-pink-500"
            >
              {viewCertificate ? 'View Letter' : 'View Certificate 🏆'}
            </button>
            <button
              onClick={onClose}
              className="px-2 py-1 bg-pink-800 hover:bg-pink-700 text-white text-[10px]"
            >
              ✕
            </button>
          </div>
        </div>

        {/* View Mode: Certificate vs Letter */}
        {viewCertificate ? (
          // Certificate of Completion
          <div className="bg-[#fffdfa] text-gray-900 p-6 md:p-8 border-8 border-double border-[#d4af37] shadow-xl text-center flex flex-col justify-between my-2">
            <div>
              <div className="text-3xl mb-1">👑</div>
              <h1 className="font-pixel text-base md:text-lg text-[#8b5a00] font-black uppercase tracking-widest">
                Certificate of Eternal Love
              </h1>
              <p className="text-[10px] text-gray-500 font-pixel mt-1 uppercase">
                Officially Awarded by The Heart Realm
              </p>

              <div className="my-6 space-y-2">
                <p className="font-retro text-2xl text-gray-700">
                  This certifies that the legendary duo of
                </p>
                <div className="font-pixel text-lg md:text-xl text-[#b5179e] py-2 border-b-2 border-dashed border-amber-300 inline-block px-8">
                  Billo 💖 Pillu
                </div>
                <p className="font-retro text-2xl text-gray-700 pt-2 leading-relaxed">
                  Have successfully completed <strong>365 Days</strong> of uninterrupted affection,
                  weathered every silly argument with warm hugs, collected {crystalsCount} Golden Memory Crystals,
                  and unlocked the title of:
                </p>
                <div className="font-pixel text-xs md:text-sm text-amber-700 font-bold bg-amber-100/70 p-2 border border-amber-400 max-w-md mx-auto">
                  ✨ "THE UNBEATABLE CUTIE GUILD: YEAR ONE COMPLETED" ✨
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-amber-200 flex items-center justify-between text-left font-retro text-xl">
              <div>
                <div className="text-gray-500 text-sm">Signed with Kisses:</div>
                <div className="font-pixel text-xs text-pink-600 mt-1">Billo 🐱</div>
              </div>
              <div className="text-3xl text-red-500">❤️</div>
              <div className="text-right">
                <div className="text-gray-500 text-sm">Witnessed by Hugs:</div>
                <div className="font-pixel text-xs text-blue-600 mt-1">Pillu 🐻</div>
              </div>
            </div>

            <button
              onClick={handlePrint}
              className="mt-6 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white text-[10px] font-pixel uppercase shadow-md self-center"
            >
              🖨️ Print / Save as PDF
            </button>
          </div>
        ) : !isOpen ? (
          // Sealed Envelope
          <div className="flex-1 flex flex-col items-center justify-center py-12 text-center">
            <div
              onClick={handleOpenEnvelope}
              className="cursor-pointer group relative w-64 h-44 bg-gradient-to-b from-[#e6c280] to-[#c29b53] border-4 border-[#8c6721] p-4 flex flex-col items-center justify-center shadow-2xl transition-transform hover:scale-105 active:scale-95"
            >
              {/* Wax Seal */}
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-rose-600 to-red-800 border-2 border-yellow-300 shadow-lg flex items-center justify-center text-white text-xl animate-pulse">
                💌
              </div>
              <div className="mt-3 font-pixel text-[10px] text-yellow-950 font-bold uppercase tracking-wider">
                Tap to Break Seal
              </div>
              <div className="text-[9px] text-yellow-900/80 font-retro text-lg mt-0.5">
                For {character.partnerName}'s Eyes Only
              </div>
            </div>
            <p className="text-[10px] text-pink-300/80 mt-4">
              Click the wax seal to unfold the anniversary letter!
            </p>
          </div>
        ) : (
          // Opened Letter Parchment
          <div className="flex-1 flex flex-col justify-between">
            <div className="bg-[#fcf8ed] text-amber-950 p-6 md:p-8 border-4 border-[#d1be9b] shadow-2xl relative rotate-[-0.3deg]">
              <div className="absolute top-3 right-3 flex items-center gap-2">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="text-[9px] bg-amber-200 hover:bg-amber-300 text-amber-950 px-2 py-1 border border-amber-500"
                >
                  {isEditing ? 'Cancel Edit' : '✏️ Personalize Letter'}
                </button>
              </div>

              {isEditing ? (
                <div className="space-y-3 pt-4">
                  <span className="text-[10px] font-bold text-amber-900 block">
                    Edit Your Personalized Anniversary Message:
                  </span>
                  <textarea
                    rows={10}
                    value={draftContent}
                    onChange={(e) => setDraftContent(e.target.value)}
                    className="w-full bg-[#f4edd9] text-amber-950 p-3 font-retro text-2xl border-2 border-amber-600 focus:outline-none leading-relaxed"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={handleSave}
                      className="px-4 py-1.5 bg-green-700 hover:bg-green-600 text-white text-[10px] font-bold"
                    >
                      Save Letter
                    </button>
                  </div>
                </div>
              ) : (
                <div className="font-retro text-2xl md:text-3xl leading-relaxed whitespace-pre-wrap text-amber-950 pt-2">
                  {letterContent}
                </div>
              )}
            </div>

            <div className="mt-4 flex items-center justify-between text-[10px] text-pink-300">
              <span>Made with all the love in the galaxy ✨</span>
              <button
                onClick={() => setViewCertificate(true)}
                className="text-yellow-300 hover:underline"
              >
                View 1-Year Certificate →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
