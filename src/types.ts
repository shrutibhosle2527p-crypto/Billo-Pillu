export type CharacterRole = 'billo' | 'pillu';

export type GameLevelId = 1 | 2 | 3 | 4 | 5;

export interface CharacterConfig {
  id: CharacterRole;
  name: string;
  partnerName: string;
  nickname: string;
  title: string;
  color: string;
  accentColor: string;
  spriteUrl: string;
  avatarIcon: string;
  description: string;
}

export interface MemoryMilestone {
  id: string;
  title: string;
  dateStr: string;
  category: 'first_meet' | 'first_date' | 'calls' | 'food' | 'trip' | 'anniversary';
  description: string;
  unlocked: boolean;
  crystalIndex: number;
  icon: string;
  photoUrl?: string;
  specialNote?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  partnerReaction: string;
  isTimed?: boolean;
}

export interface TreasureChestData {
  id: string;
  title: string;
  locationName: string;
  x: number;
  y: number;
  memoryTitle: string;
  memoryText: string;
  specialNote: string;
  bgUrl?: string;
  heartsAwarded: number;
  opened: boolean;
}

export type HeartMilestoneTier = 'NONE' | 'LITTLE_LOVE' | 'HEART_COLLECTOR' | 'SOULMATE' | 'FOREVER_ALWAYS';

export interface Quest {
  id: string;
  chapter: number;
  title: string;
  locationName: string;
  objective: string;
  hint: string;
  completed: boolean;
  rewardCrystal: number;
  storyDialog: string[];
}

export interface BattleAction {
  id: string;
  name: string;
  type: 'love' | 'hug' | 'snack' | 'joke' | 'special';
  power: number;
  description: string;
  dialogue: string;
}

export interface BattleOpponent {
  id: string;
  name: string;
  hp: number;
  maxHp: number;
  sprite: string;
  dialogues: {
    start: string;
    turns: string[];
    soothed: string;
  };
  defeatText: string;
  weakness: string;
  rewards: {
    crystalIndex: number;
    sparkPoints: number;
    itemName: string;
  };
}

export interface GameSaveState {
  playerRole: CharacterRole;
  startDate: string; // YYYY-MM-DD
  currentLevel: GameLevelId | 'TITLE' | 'FINAL_REWARD';
  unlockedLevels: number[]; // e.g. [1, 2, 3, 4, 5]
  totalHearts: number;
  level1HeartsFound: string[]; // ids of found hearts
  level2QuizScore: number;
  level2Completed: boolean;
  level3HighScore: number;
  level3Completed: boolean;
  level4ChestsOpened: string[]; // ids of opened chests
  level5Completed: boolean;
  achievedMilestones: HeartMilestoneTier[];
  customLoveLetter: string;
  soundEnabled: boolean;
  bgmEnabled: boolean;

  // Backward compatible fields
  playerX: number;
  playerY: number;
  crystalsCollected: boolean[];
  sparkPoints: number;
}


