import React, { useState } from 'react';
import { CharacterRole, GameLevelId } from '../types';
import { sound } from '../utils/audio';
import { CHARACTERS, getMilestoneTier } from '../utils/storage';
import { CharacterSprite } from './CharacterSprite';

interface HomeMenuProps {
  isOpen: boolean;
  onClose: () => void;
  playerRole: CharacterRole;
  totalHearts: number;
  unlockedLevels: number[];
  currentLevel: GameLevelId | 'TITLE' | 'FINAL_REWARD';
  level1HeartsFound: string[];
  level4ChestsOpened: string[];
  level2Completed: boolean;
  level3Completed: boolean;
  level5Completed: boolean;
  customLoveLetter: string;
  onSelectLevel: (lvl: GameLevelId | 'FINAL_REWARD' | 'TITLE') => void;
  onPlayFromStart: () => void;
  onContinue: () => void;
  onOpenLetter: () => void;
  onResetGame: () => void;
}

const LEVEL_INFO: Record<GameLevelId, { name: string; icon: string; desc: string }> = {
  1: { name: 'Our Story Begins', icon: '🌸', desc: 'Walk the path and find 5 memory hearts' },
  2: { name: 'Relationship Quiz', icon: '❓', desc: 'Test how well you know each other' },
  3: { name: 'The Heart Rush', icon: '💖', desc: 'Catch falling hearts in 40 seconds' },
  4: { name: 'Treasure Hunt', icon: '📦', desc: 'Open 10 memory chests together' },
  5: { name: 'The Final Quest', icon: '👑', desc: 'Seal 3 vows and sync your hearts' },
};

export const HomeMenu: React.FC<HomeMenuProps> = ({
  isOpen,
  onClose,
  playerRole,
  totalHearts,
  unlockedLevels,
  currentLevel,
  level1HeartsFound,
  level4ChestsOpened,
  level2Completed,
  level3Completed,
  level5Completed,
  customLoveLetter,
  onSelectLevel,
  onPlayFromStart,
  onContinue,
  onOpenLetter,
  onResetGame,
}) => {
  const [activePanel, setActivePanel] = useState<'main' | 'chapters' | 'memories' | 'hearts' | 'settings'>('main');
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  if (!isOpen) return null;

  const milestone = getMilestoneTier(totalHearts);

  const handleBack = () => {
    sound.playJump();
    setActivePanel('main');
  };

  const renderMain = () => (
    <div className="flex flex-col items-center gap-3 p-4">
      {/* Character pair */}
      <div className="flex items-end justify-center gap-6 mb-1">
        <CharacterSprite role="billo" size={72} animation="idle" showNameTag={true} />
        <span className="text-2xl animate-float-heart pb-6">❤️</span>
        <CharacterSprite role="pillu" size={72} animation="idle" showNameTag={true} />
      </div>

      <h2 className="font-pixel text-sm text-yellow-300 uppercase tracking-wider">Main Menu</h2>

      {/* Menu buttons */}
      <div className="flex flex-col gap-2 w-full max-w-xs">
        <button
          onClick={() => { sound.playFanfare(); onPlayFromStart(); }}
          className="px-4 py-2.5 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400 text-white font-bold text-[10px] uppercase pixel-corners border border-yellow-300 shadow-lg transition-all hover:scale-[1.02] active:scale-95 cursor-pointer flex items-center gap-2"
        >
          <span>▶</span> Play Game
        </button>

        <button
          onClick={() => { sound.playJump(); onContinue(); }}
          className="px-4 py-2.5 bg-pink-950/90 hover:bg-pink-900 text-yellow-200 font-bold text-[10px] uppercase pixel-corners border border-pink-500/70 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer flex items-center gap-2"
        >
          <span>📖</span> Continue Journey
        </button>

        <button
          onClick={() => { sound.playJump(); setActivePanel('chapters'); }}
          className="px-4 py-2.5 bg-pink-950/90 hover:bg-pink-900 text-yellow-200 font-bold text-[10px] uppercase pixel-corners border border-pink-500/70 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer flex items-center gap-2"
        >
          <span>🗺️</span> Chapter Selection
        </button>

        <button
          onClick={() => { sound.playJump(); setActivePanel('memories'); }}
          className="px-4 py-2.5 bg-pink-950/90 hover:bg-pink-900 text-yellow-200 font-bold text-[10px] uppercase pixel-corners border border-pink-500/70 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer flex items-center gap-2"
        >
          <span>📸</span> Our Memories
        </button>

        <button
          onClick={() => { sound.playJump(); setActivePanel('hearts'); }}
          className="px-4 py-2.5 bg-pink-950/90 hover:bg-pink-900 text-yellow-200 font-bold text-[10px] uppercase pixel-corners border border-pink-500/70 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer flex items-center gap-2"
        >
          <span>💖</span> Heart Collection
        </button>

        <button
          onClick={() => { sound.playJump(); setActivePanel('settings'); }}
          className="px-4 py-2.5 bg-pink-950/90 hover:bg-pink-900 text-yellow-200 font-bold text-[10px] uppercase pixel-corners border border-pink-500/70 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer flex items-center gap-2"
        >
          <span>⚙️</span> Settings
        </button>
      </div>

      {/* Close button */}
      <button
        onClick={onClose}
        className="mt-1 px-4 py-1.5 bg-black/60 hover:bg-pink-950 text-pink-300 text-[9px] pixel-corners border border-pink-800 cursor-pointer"
      >
        ← Back to Game
      </button>
    </div>
  );

  const renderChapters = () => (
    <div className="flex flex-col gap-2 p-4">
      <div className="flex items-center justify-between mb-1">
        <h2 className="font-pixel text-xs text-yellow-300 uppercase tracking-wider">Chapter Selection</h2>
        <button onClick={handleBack} className="text-[9px] text-pink-300 hover:text-yellow-300 cursor-pointer">← Back</button>
      </div>

      <div className="flex flex-col gap-1.5 max-h-[340px] overflow-y-auto pr-1">
        {([1, 2, 3, 4, 5] as GameLevelId[]).map((lvl) => {
          const info = LEVEL_INFO[lvl];
          const isUnlocked = unlockedLevels.includes(lvl);
          const isCurrent = currentLevel === lvl;

          return (
            <button
              key={lvl}
              disabled={!isUnlocked}
              onClick={() => {
                sound.playJump();
                onSelectLevel(lvl);
              }}
              className={`flex items-center gap-3 px-3 py-2 pixel-corners border text-left transition-all ${
                !isUnlocked
                  ? 'bg-black/40 border-gray-800 opacity-50 cursor-not-allowed'
                  : isCurrent
                  ? 'bg-yellow-400/90 text-black border-yellow-200 cursor-pointer'
                  : 'bg-pink-950/80 border-pink-500/60 text-pink-100 hover:bg-pink-900 cursor-pointer'
              }`}
            >
              <span className="text-2xl">{isUnlocked ? info.icon : '🔒'}</span>
              <div className="flex-1 min-w-0">
                <div className="text-[10px] font-bold whitespace-nowrap">Chapter {lvl}: {info.name}</div>
                <div className={`text-[8px] ${isCurrent ? 'text-black/70' : 'text-pink-400'}`}>{info.desc}</div>
              </div>
              {isCurrent && <span className="text-[8px] font-bold">▶ NOW</span>}
            </button>
          );
        })}

        {level5Completed && (
          <button
            onClick={() => { sound.playFanfare(); onSelectLevel('FINAL_REWARD'); }}
            className={`flex items-center gap-3 px-3 py-2 pixel-corners border text-left transition-all ${
              currentLevel === 'FINAL_REWARD'
                ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-black border-yellow-200'
                : 'bg-gradient-to-r from-pink-600 to-rose-600 text-white border-yellow-300 hover:scale-[1.01] cursor-pointer'
            }`}
          >
            <span className="text-2xl">🏆</span>
            <div className="flex-1">
              <div className="text-[10px] font-bold">Finale: Anniversary Reward</div>
              <div className="text-[8px] opacity-80">View certificate & love letter</div>
            </div>
          </button>
        )}
      </div>
    </div>
  );

  const renderMemories = () => {
    const allMemories = [
      { level: 1, title: 'The Flower by the Sea', date: '7 Nov 2025', icon: '🌸', found: level1HeartsFound.includes('h1_sea') },
      { level: 1, title: 'The Forest Picnic', date: '8 Nov 2025', icon: '🚲', found: level1HeartsFound.includes('h2_picnic') },
      { level: 1, title: 'The Last Seat (AC Bus)', date: 'Nov 2025', icon: '🚌', found: level1HeartsFound.includes('h3_bus') },
      { level: 1, title: 'Colours of Holi', date: 'Mar 2026', icon: '🎨', found: level1HeartsFound.includes('h4_holi') },
      { level: 1, title: 'One Favourite Person', date: '365 Days', icon: '💖', found: level1HeartsFound.includes('h5_year') },
    ];

    return (
      <div className="flex flex-col gap-2 p-4">
        <div className="flex items-center justify-between mb-1">
          <h2 className="font-pixel text-xs text-yellow-300 uppercase tracking-wider">Our Memories</h2>
          <button onClick={handleBack} className="text-[9px] text-pink-300 hover:text-yellow-300 cursor-pointer">← Back</button>
        </div>

        <p className="text-[9px] text-pink-300 mb-1">Memories discovered: {level1HeartsFound.length} / 5</p>

        <div className="flex flex-col gap-1.5 max-h-[340px] overflow-y-auto pr-1">
          {allMemories.map((mem, idx) => (
            <div
              key={idx}
              className={`flex items-center gap-3 px-3 py-2 pixel-corners border ${
                mem.found
                  ? 'bg-pink-950/80 border-pink-500/60 text-pink-100'
                  : 'bg-black/40 border-gray-800 text-gray-500'
              }`}
            >
              <span className="text-2xl">{mem.found ? mem.icon : '🔒'}</span>
              <div className="flex-1">
                <div className="text-[10px] font-bold">{mem.found ? mem.title : '???'}</div>
                <div className="text-[8px] text-pink-400">{mem.found ? mem.date : 'Not yet discovered'}</div>
              </div>
              <span className="text-xs">{mem.found ? '💖' : '🔒'}</span>
            </div>
          ))}
        </div>

        <div className="mt-2">
          <button
            onClick={() => { sound.playJump(); onOpenLetter(); }}
            className="px-3 py-1.5 bg-pink-900 hover:bg-pink-800 text-yellow-200 text-[9px] pixel-corners border border-yellow-500/60 cursor-pointer"
          >
            💌 Open Love Letter
          </button>
        </div>
      </div>
    );
  };

  const renderHearts = () => (
    <div className="flex flex-col items-center gap-3 p-4">
      <div className="flex items-center justify-between w-full mb-1">
        <h2 className="font-pixel text-xs text-yellow-300 uppercase tracking-wider">Heart Collection</h2>
        <button onClick={handleBack} className="text-[9px] text-pink-300 hover:text-yellow-300 cursor-pointer">← Back</button>
      </div>

      <div className="text-center">
        <div className="text-5xl animate-float-heart mb-1">💖</div>
        <div className="font-pixel text-2xl text-yellow-300">{totalHearts}</div>
        <div className="text-[9px] text-pink-300 mt-0.5">Total Glowing Hearts</div>
      </div>

      <div className="w-full max-w-xs bg-pink-950/60 pixel-corners border border-pink-500/60 p-3 text-center">
        <div className="text-[9px] text-yellow-300 font-bold uppercase mb-1">Current Milestone</div>
        <div className="text-xs text-pink-100">{milestone.label}</div>
        <div className="text-[8px] text-pink-400 mt-1">
          {milestone.tier === 'FOREVER_ALWAYS' ? 'Maximum tier reached!' : 'Keep collecting to unlock more!'}
        </div>
      </div>

      <div className="w-full max-w-xs space-y-1">
        <div className="flex items-center justify-between text-[9px] text-pink-300">
          <span>Chapter 1 Hearts</span>
          <span className="text-yellow-300 font-bold">{level1HeartsFound.length} / 5</span>
        </div>
        <div className="flex items-center justify-between text-[9px] text-pink-300">
          <span>Chapter 4 Chests</span>
          <span className="text-yellow-300 font-bold">{level4ChestsOpened.length} / 10</span>
        </div>
        <div className="flex items-center justify-between text-[9px] text-pink-300">
          <span>Chapters Completed</span>
          <span className="text-yellow-300 font-bold">
            {[level2Completed, level3Completed, level5Completed].filter(Boolean).length + (level1HeartsFound.length === 5 ? 1 : 0)} / 5
          </span>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="flex flex-col gap-3 p-4">
      <div className="flex items-center justify-between mb-1">
        <h2 className="font-pixel text-xs text-yellow-300 uppercase tracking-wider">Settings</h2>
        <button onClick={handleBack} className="text-[9px] text-pink-300 hover:text-yellow-300 cursor-pointer">← Back</button>
      </div>

      <div className="flex flex-col gap-2 max-w-xs mx-auto w-full">
        <button
          onClick={() => { sound.playJump(); onOpenLetter(); }}
          className="px-3 py-2 bg-pink-950/90 hover:bg-pink-900 text-yellow-200 text-[10px] pixel-corners border border-pink-500/70 cursor-pointer flex items-center gap-2"
        >
          <span>💌</span> Open Love Letter
        </button>

        <button
          onClick={() => {
            if (!document.fullscreenElement) {
              document.documentElement.requestFullscreen().catch(() => {});
            } else {
              document.exitFullscreen().catch(() => {});
            }
          }}
          className="px-3 py-2 bg-pink-950/90 hover:bg-pink-900 text-yellow-200 text-[10px] pixel-corners border border-pink-500/70 cursor-pointer flex items-center gap-2"
        >
          <span>⛶</span> Toggle Fullscreen
        </button>

        <div className="mt-2 pt-2 border-t border-pink-800/50">
          <button
            onClick={() => setShowResetConfirm(true)}
            className="px-3 py-2 bg-rose-950/90 hover:bg-rose-900 text-rose-200 text-[10px] pixel-corners border border-rose-600/70 cursor-pointer flex items-center gap-2 w-full"
          >
            <span>↺</span> Restart Game from Beginning
          </button>
          <p className="text-[8px] text-pink-400/70 mt-1.5 text-center">
            Your love letter will be preserved.
          </p>
        </div>
      </div>

      {showResetConfirm && (
        <div className="fixed inset-0 z-[60] bg-black/80 flex items-center justify-center p-6">
          <div className="bg-[#1a0828] pixel-border border-rose-500 p-4 max-w-sm text-center">
            <div className="text-3xl mb-2">⚠️</div>
            <h3 className="text-[10px] text-rose-300 font-bold uppercase mb-2">Restart Love Quest?</h3>
            <p className="font-retro text-lg text-pink-200 mb-3 leading-snug">
              This will reset all chapter progress, hearts, and memories. Your love letter will be kept safe.
            </p>
            <div className="flex gap-2 justify-center">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-1.5 bg-pink-900 hover:bg-pink-800 text-pink-200 text-[9px] pixel-corners cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  sound.playFanfare();
                  setShowResetConfirm(false);
                  onResetGame();
                }}
                className="px-4 py-1.5 bg-rose-700 hover:bg-rose-600 text-white text-[9px] font-bold pixel-corners cursor-pointer"
              >
                Yes, Restart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 z-[55] bg-[#0a0414]/95 backdrop-blur-sm flex items-center justify-center animate-fade-in">
      <div className="relative w-full max-w-md max-h-[92vh] overflow-y-auto bg-[#140824] pixel-border border-pink-500/80 shadow-2xl rounded-md">
        {/* Decorative floating hearts */}
        <div className="absolute top-2 left-3 text-sm animate-float-heart pointer-events-none opacity-50">💖</div>
        <div className="absolute top-3 right-4 text-sm animate-float-heart pointer-events-none opacity-50" style={{ animationDelay: '400ms' }}>💕</div>

        {activePanel === 'main' && renderMain()}
        {activePanel === 'chapters' && renderChapters()}
        {activePanel === 'memories' && renderMemories()}
        {activePanel === 'hearts' && renderHearts()}
        {activePanel === 'settings' && renderSettings()}
      </div>
    </div>
  );
};
