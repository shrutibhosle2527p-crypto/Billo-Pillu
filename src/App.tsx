import React, { useEffect, useState } from 'react';
import { FinalRewardScreen } from './components/FinalRewardScreen';
import { GameHUD } from './components/GameHUD';
import { Level1Beginning } from './components/Level1Beginning';
import { Level2Quiz } from './components/Level2Quiz';
import { Level3HeartRush } from './components/Level3HeartRush';
import { Level4TreasureHunt } from './components/Level4TreasureHunt';
import { Level5FinalQuest } from './components/Level5FinalQuest';
import { LoveLetter } from './components/LoveLetter';
import { OpeningScreen } from './components/OpeningScreen';
import { GameLevelId, GameSaveState, HeartMilestoneTier } from './types';
import { sound } from './utils/audio';
import {
  getMilestoneTier,
  loadGameState,
  resetGameState,
  saveGameState,
} from './utils/storage';

export const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameSaveState>(() => loadGameState());
  const [showLetterModal, setShowLetterModal] = useState(false);
  const [milestoneToast, setMilestoneToast] = useState<{ label: string; text: string } | null>(null);

  // Auto-persist state
  useEffect(() => {
    saveGameState(gameState);
  }, [gameState]);

  // Check milestones when hearts increase
  const checkMilestone = (hearts: number, achievedMilestones: HeartMilestoneTier[]) => {
    const tierInfo = getMilestoneTier(hearts);
    if (tierInfo.tier !== 'NONE' && !achievedMilestones.includes(tierInfo.tier)) {
      sound.playFanfare();
      setGameState((prev) => ({
        ...prev,
        achievedMilestones: [...prev.achievedMilestones, tierInfo.tier],
      }));
      setMilestoneToast({
        label: tierInfo.label,
        text: `Milestone Unlocked: You have gathered ${hearts} Glowing Hearts together!`,
      });
      setTimeout(() => setMilestoneToast(null), 4000);
    }
  };

  const handleAddHearts = (amount: number) => {
    setGameState((prev) => {
      const nextHearts = prev.totalHearts + amount;
      checkMilestone(nextHearts, prev.achievedMilestones);
      return {
        ...prev,
        totalHearts: nextHearts,
      };
    });
  };

  const handleSelectLevel = (lvl: GameLevelId | 'FINAL_REWARD') => {
    sound.playJump();
    setGameState((prev) => ({ ...prev, currentLevel: lvl }));
  };

  const handleSwitchCharacter = () => {
    sound.playJump();
    setGameState((prev) => ({
      ...prev,
      playerRole: prev.playerRole === 'billo' ? 'pillu' : 'billo',
    }));
  };

  const handleLevel1CollectHeart = (heartId: string) => {
    setGameState((prev) => {
      if (prev.level1HeartsFound.includes(heartId)) return prev;
      const nextHearts = [...prev.level1HeartsFound, heartId];
      const newTotal = prev.totalHearts + 1;
      checkMilestone(newTotal, prev.achievedMilestones);
      return {
        ...prev,
        level1HeartsFound: nextHearts,
        totalHearts: newTotal,
      };
    });
  };

  const handleLevel1Complete = () => {
    setGameState((prev) => ({
      ...prev,
      unlockedLevels: Array.from(new Set([...prev.unlockedLevels, 2])),
      currentLevel: 2,
    }));
  };

  const handleLevel2Complete = () => {
    setGameState((prev) => ({
      ...prev,
      level2Completed: true,
      unlockedLevels: Array.from(new Set([...prev.unlockedLevels, 3])),
      currentLevel: 3,
    }));
  };

  const handleLevel3Complete = () => {
    setGameState((prev) => ({
      ...prev,
      level3Completed: true,
      unlockedLevels: Array.from(new Set([...prev.unlockedLevels, 4])),
      currentLevel: 4,
    }));
  };

  const handleLevel4OpenChest = (chestId: string, hearts: number) => {
    setGameState((prev) => {
      if (prev.level4ChestsOpened.includes(chestId)) return prev;
      const nextChests = [...prev.level4ChestsOpened, chestId];
      const nextTotal = prev.totalHearts + hearts;
      checkMilestone(nextTotal, prev.achievedMilestones);
      return {
        ...prev,
        level4ChestsOpened: nextChests,
        totalHearts: nextTotal,
      };
    });
  };

  const handleLevel4Complete = () => {
    setGameState((prev) => ({
      ...prev,
      unlockedLevels: Array.from(new Set([...prev.unlockedLevels, 5])),
      currentLevel: 5,
    }));
  };

  const handleLevel5Complete = () => {
    setGameState((prev) => ({
      ...prev,
      level5Completed: true,
      currentLevel: 'FINAL_REWARD',
    }));
  };

  const handleRestartGame = () => {
    const reset = resetGameState();
    setGameState({
      ...reset,
      customLoveLetter: gameState.customLoveLetter, // Keep personalized letter
      currentLevel: 1,
    });
  };

  return (
    <div className="h-screen w-full bg-[#07020c] flex flex-col items-center justify-center p-2 sm:p-4 overflow-hidden select-none font-pixel text-pink-100">
      {/* Top Floating Milestone Toast Notification */}
      {milestoneToast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-gradient-to-r from-pink-600 via-rose-600 to-yellow-500 text-black px-5 py-2.5 pixel-border border-yellow-300 shadow-2xl flex items-center gap-3">
          <span className="text-xl">🎉</span>
          <div>
            <div className="font-bold text-[10px] uppercase">{milestoneToast.label}</div>
            <div className="font-retro text-lg leading-tight text-white drop-shadow">
              {milestoneToast.text}
            </div>
          </div>
        </div>
      )}

      {/* Unified Master Game Console Viewport */}
      <main className="relative w-full max-w-[1040px] aspect-[16/9] max-h-[88vh] min-h-[420px] bg-[#12051d] pixel-border border-pink-500/80 shadow-[0_0_35px_rgba(255,105,180,0.25)] flex flex-col justify-between overflow-hidden rounded-md">
        {gameState.currentLevel === 'TITLE' ? (
          <OpeningScreen
            playerRole={gameState.playerRole}
            onSelectRole={(role) => setGameState((prev) => ({ ...prev, playerRole: role }))}
            onStartGame={() => setGameState((prev) => ({ ...prev, currentLevel: 1 }))}
          />
        ) : (
          <>
            {/* Integrated Sleek Top Bar HUD */}
            <GameHUD
              currentLevel={gameState.currentLevel}
              unlockedLevels={gameState.unlockedLevels}
              totalHearts={gameState.totalHearts}
              playerRole={gameState.playerRole}
              onSwitchCharacter={handleSwitchCharacter}
              onSelectLevel={handleSelectLevel}
              onOpenLetter={() => setShowLetterModal(true)}
              onResetGame={handleRestartGame}
            />

            {/* Active Level Stage Area */}
            <div className="relative w-full flex-1 overflow-hidden">
              {/* Level 1: The Beginning */}
              {gameState.currentLevel === 1 && (
                <Level1Beginning
                  playerRole={gameState.playerRole}
                  collectedHeartIds={gameState.level1HeartsFound}
                  onCollectHeart={handleLevel1CollectHeart}
                  onCompleteLevel={handleLevel1Complete}
                />
              )}

              {/* Level 2: Relationship Quiz */}
              {gameState.currentLevel === 2 && (
                <Level2Quiz
                  playerRole={gameState.playerRole}
                  onAwardHearts={handleAddHearts}
                  onCompleteLevel={handleLevel2Complete}
                />
              )}

              {/* Level 3: The Heart Rush */}
              {gameState.currentLevel === 3 && (
                <Level3HeartRush
                  playerRole={gameState.playerRole}
                  highScore={gameState.level3HighScore}
                  onAwardHearts={handleAddHearts}
                  onSaveHighScore={(score) =>
                    setGameState((prev) => ({ ...prev, level3HighScore: score }))
                  }
                  onCompleteLevel={handleLevel3Complete}
                />
              )}

              {/* Level 4: Memory Treasure Hunt */}
              {gameState.currentLevel === 4 && (
                <Level4TreasureHunt
                  playerRole={gameState.playerRole}
                  openedChestIds={gameState.level4ChestsOpened}
                  onOpenChest={handleLevel4OpenChest}
                  onCompleteLevel={handleLevel4Complete}
                />
              )}

              {/* Level 5: The Final Love Quest */}
              {gameState.currentLevel === 5 && (
                <Level5FinalQuest
                  playerRole={gameState.playerRole}
                  onAwardHearts={handleAddHearts}
                  onCompleteLevel={handleLevel5Complete}
                />
              )}

              {/* Final Celebration & Reward Screen */}
              {gameState.currentLevel === 'FINAL_REWARD' && (
                <FinalRewardScreen
                  playerRole={gameState.playerRole}
                  totalHearts={gameState.totalHearts}
                  letterContent={gameState.customLoveLetter}
                  onSaveLetter={(newLetter) =>
                    setGameState((prev) => ({ ...prev, customLoveLetter: newLetter }))
                  }
                  onRestartGame={handleRestartGame}
                />
              )}
            </div>
          </>
        )}
      </main>

      {/* Love Letter Modal (Available from HUD anytime) */}
      {showLetterModal && (
        <LoveLetter
          playerRole={gameState.playerRole}
          letterContent={gameState.customLoveLetter}
          crystalsCount={gameState.unlockedLevels.length}
          onSaveLetter={(newContent) =>
            setGameState((prev) => ({ ...prev, customLoveLetter: newContent }))
          }
          onClose={() => setShowLetterModal(false)}
        />
      )}

      {/* Discrete Bottom Footer */}
      <footer className="text-center text-[8px] text-pink-400/50 pt-1">
        Billo & Pillu • 1-Year Anniversary Love Quest • Handcrafted with Forever Love 💕
      </footer>
    </div>
  );
};
export default App;
