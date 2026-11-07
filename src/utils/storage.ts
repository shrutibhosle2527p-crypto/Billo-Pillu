import {
  CharacterConfig,
  CharacterRole,
  GameSaveState,
  HeartMilestoneTier,
  MemoryMilestone,
  Quest,
  QuizQuestion,
  TreasureChestData,
} from '../types';

export const QUESTS: Quest[] = [
  {
    id: 'q1',
    chapter: 1,
    title: 'Spark of the First Date',
    locationName: 'Meadow of Firsts',
    objective: 'Explore the flowery meadow!',
    hint: 'Head east toward the flowers.',
    completed: false,
    rewardCrystal: 0,
    storyDialog: ['Do you remember our first day?'],
  },
];


export const BILLO_SPRITE_URL = '/assets/aistudio/Gemini_Generated_Image_h5v0okh5v0okh5v0_167d589b.png';
export const PILLU_SPRITE_URL = '/assets/aistudio/Gemini_Generated_Image_88zpy88zpy88zpy8_536514b5.png';

export const CHARACTERS: Record<CharacterRole, CharacterConfig> = {
  billo: {
    id: 'billo',
    name: 'Billo',
    partnerName: 'Pillu',
    nickname: 'Billo Queen',
    title: 'The Radiant & Sassy Heart Adventurer',
    color: '#ff70a6',
    accentColor: '#b5179e',
    spriteUrl: BILLO_SPRITE_URL,
    avatarIcon: '💙',
    description: 'Sweet, fiercely loving, effortlessly stunning in her blue dress, and the radiant heart of our 365-day story.',
  },
  pillu: {
    id: 'pillu',
    name: 'Pillu',
    partnerName: 'Billo',
    nickname: 'Pillu Cutie',
    title: 'The Cool & Devoted White-Shirt Knight',
    color: '#4cc9f0',
    accentColor: '#4361ee',
    spriteUrl: PILLU_SPRITE_URL,
    avatarIcon: '😎',
    description: 'Always rocking cool sunglasses and a crisp white shirt, ready with warm hugs, midnight snacks, and unconditional love.',
  },
};

export const INITIAL_MILESTONES: MemoryMilestone[] = [
  {
    id: 'm1',
    title: 'The Very First Spark',
    dateStr: 'Day 1',
    category: 'first_meet',
    description: 'The unforgettable day our paths crossed. A shy smile, an awkward yet magical hello, and an instant feeling that our lives had changed forever.',
    unlocked: true,
    crystalIndex: 0,
    icon: '✨',
    specialNote: 'One innocent "Hi" turned into 365 days of holding hands.',
  },
  {
    id: 'm2',
    title: 'Midnight Whispers & 3AM Calls',
    dateStr: 'Month 2',
    category: 'calls',
    description: 'Talking about our childhoods, sharing playlists, trading secrets, and falling asleep on the phone while neither of us wanted to hang up first.',
    unlocked: false,
    crystalIndex: 1,
    icon: '🌙',
    specialNote: '"Just 5 more minutes" that reliably turned into 2 more hours.',
  },
  {
    id: 'm3',
    title: 'Foodie Adventures & Stolen Fries',
    dateStr: 'Month 5',
    category: 'food',
    description: 'Craving pizza, competing for the last piece of dessert, sharing boba with extra pearls, and debating who loves the other person more.',
    unlocked: false,
    crystalIndex: 2,
    icon: '🍜',
    specialNote: 'The secret to our bond: Good food + Silly laughs + Billo & Pillu.',
  },
  {
    id: 'm4',
    title: 'Through Silly Fights & Rainbow Hugs',
    dateStr: 'Month 8',
    category: 'trip',
    description: 'The little disagreements that taught us how to listen, forgive, and hug tighter. Overcoming storms made our bond unbreakable.',
    unlocked: false,
    crystalIndex: 3,
    icon: '🌈',
    specialNote: 'Every fight only proved we will always choose each other, every single day.',
  },
  {
    id: 'm5',
    title: '365 Days of Us: Happy 1st Anniversary!',
    dateStr: 'Day 365 (Today!)',
    category: 'anniversary',
    description: 'One full circle around the sun! 12 months, 52 weeks, 8,760 hours of genuine joy, mutual support, and growing together.',
    unlocked: false,
    crystalIndex: 4,
    icon: '👑',
    specialNote: 'Chapter 1 of forever is complete. Ready for Chapter 2?',
  },
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    question: 'How did our very first conversation begin?',
    options: [
      'A super smooth pickup line',
      'A shy, cute, and slightly nervous "Hey!"',
      'An accidental phone dial',
      'Debating about our favorite pizza toppings',
    ],
    correctIndex: 1,
    explanation: 'It all started with that sweet, shy "Hey!" that gave both of us butterflies!',
    partnerReaction: 'Pillu smiles: "I remember my heart racing the moment I saw your message!"',
  },
  {
    id: 'q2',
    question: 'Who reliably takes longer to get ready before our dates?',
    options: [
      'Billo (Perfection takes time!)',
      'Pillu (Gotta style that hair and sunglasses!)',
      'Both take exactly 3 hours',
      'We are both miraculously ready in 5 minutes',
    ],
    correctIndex: 0,
    explanation: 'Billo looking that gorgeous in her blue dress requires artistry and time!',
    partnerReaction: 'Billo laughs: "Hey! You cannot rush looking this cute for you!"',
  },
  {
    id: 'q3',
    question: 'What is the number one cause of sudden pout attacks?',
    options: [
      'The weather was too cloudy',
      'Being HANGRY after 3 hours without snacks!',
      'Losing a game of rock-paper-scissors',
      'Running out of phone battery',
    ],
    correctIndex: 1,
    explanation: 'Feed the cutie boba or fries immediately to neutralize all pouts!',
    partnerReaction: 'Pillu: "I always keep emergency snack reserves just in case!"',
  },
  {
    id: 'q4',
    question: 'What happens during our late-night phone calls?',
    options: [
      'We say goodbye within 10 minutes',
      'We talk about random universe theories and fall asleep on call',
      'Complete silence while studying',
      'We forget what we were saying every 2 minutes',
    ],
    correctIndex: 1,
    explanation: '"Just 5 more minutes" always turned into 3 AM bedtime!',
    partnerReaction: 'Billo: "Falling asleep listening to your breathing is the coziest feeling."',
  },
  {
    id: 'q5',
    question: 'Who is more likely to steal food from the other person’s plate?',
    options: [
      'Billo: "I said I wasn’t hungry, but your fries look tasty!"',
      'Pillu: Sneakily snatching the last dumpling',
      'Neither, we divide everything with a ruler',
      'The waiter',
    ],
    correctIndex: 0,
    explanation: 'The classic girlfriend tax: "I don\'t want fries" followed by eating 70% of his fries!',
    partnerReaction: 'Pillu grinning: "What\'s mine is yours anyway, my queen!"',
  },
  {
    id: 'q6',
    question: 'What is our magical cure for when we have a silly disagreement?',
    options: [
      'Ignoring each other for 3 days',
      'A long, tight, patient hug and honest apologies',
      'Sending an angry meme',
      'Arm wrestling competition',
    ],
    correctIndex: 1,
    explanation: 'A warm hug and looking into each other’s eyes instantly melts all stubbornness away.',
    partnerReaction: 'Billo: "Our hugs make everything right again."',
  },
  {
    id: 'q7',
    question: 'What makes Pillu look so effortlessly cool?',
    options: [
      'His stylish sunglasses, rolled-up white shirt & charming smile',
      'His gaming high scores',
      'His secret superhero identity',
      'His ability to nap anywhere',
    ],
    correctIndex: 0,
    explanation: 'That classic white shirt and cool sunglasses combo stole Billo\'s heart!',
    partnerReaction: 'Pillu adjusts sunglasses: "Only dressing sharp to match your beauty!"',
  },
  {
    id: 'q8',
    question: 'How many days of love, laughter, and milestones are we celebrating today?',
    options: [
      '100 Days',
      '180 Days',
      '365 Whole Beautiful Days (1 Year!)',
      '1,000,000 Days',
    ],
    correctIndex: 2,
    explanation: 'Exactly 365 days of being each other’s favorite adventure!',
    partnerReaction: 'Both: "ONE WHOLE YEAR DOWN, FOREVER TO GO! 🎉"',
  },
  {
    id: 'q9',
    question: '⚡ SPEED ROUND: Who loves the other person more?!',
    options: [
      'Billo loves Pillu to infinity!',
      'Pillu loves Billo to infinity plus one!',
      'Impossible to measure — our love is equal & infinite!',
      'Pillu by a fraction of a percent!',
    ],
    correctIndex: 2,
    explanation: 'Trick question: Both love each other infinitely with all their hearts!',
    partnerReaction: '💖 Both: "We are an unbeatable duo! Forever & always!"',
    isTimed: true,
  },
];

export const TREASURE_CHESTS: TreasureChestData[] = [
  {
    id: 'c1',
    title: 'Chest of the First Meeting',
    locationName: 'The Sunlit Oak Meadow',
    x: 18,
    y: 35,
    memoryTitle: 'Day 1: Where the Magic Started',
    memoryText: 'Do you remember the butterflies? That first conversation where seconds felt like heartbeats. In a world full of strangers, you instantly felt like home.',
    specialNote: 'You smiled, and my whole universe shifted into color.',
    heartsAwarded: 5,
    opened: false,
  },
  {
    id: 'c2',
    title: 'Chest of 3 AM Whispers',
    locationName: 'The Starry Midnight Grove',
    x: 75,
    y: 28,
    memoryTitle: 'Month 2: The Night Owl Confessions',
    memoryText: 'Whispering into our phones past midnight, laughing softly so no one would hear, sharing our deepest childhood dreams and vulnerabilities.',
    specialNote: 'Sleep was good, but talking to you was so much better.',
    heartsAwarded: 5,
    opened: false,
  },
  {
    id: 'c3',
    title: 'Chest of Stolen Treats & Boba',
    locationName: 'The Cozy Foodie Corner',
    x: 82,
    y: 72,
    memoryTitle: 'Month 5: Delicious Belly Laughs',
    memoryText: 'Food tastes a thousand times better when shared with you. From warm boba runs to stealing fries, every meal with you is our favorite feast.',
    specialNote: 'I will gladly give you the last bite of dessert for the rest of my life.',
    heartsAwarded: 5,
    opened: false,
  },
  {
    id: 'c4',
    title: 'Chest of the Rainbow Hug',
    locationName: 'The Bridge of Understanding',
    x: 25,
    y: 75,
    memoryTitle: 'Month 8: Growing Stronger Together',
    memoryText: 'Every little bump on the road only showed us that our love is resilient. When we hold hands and apologize, sunshine always breaks through the clouds.',
    specialNote: 'We don’t just love each other on easy days; we love each other through everything.',
    heartsAwarded: 5,
    opened: false,
  },
  {
    id: 'c5',
    title: 'Chest of 365 Days of Forever',
    locationName: 'The Anniversary Hilltop',
    x: 50,
    y: 48,
    memoryTitle: 'Month 12: One Year of Us',
    memoryText: '365 days. 8,760 hours. 525,600 minutes. Looking back at our year, every single moment has been a blessing. You are my favorite story.',
    specialNote: 'Happy 1st Anniversary, my love. Here is to a lifetime more.',
    heartsAwarded: 10,
    opened: false,
  },
];

const STORAGE_KEY = 'billo_pillu_love_quest_v2';

export function loadGameState(): GameSaveState {
  if (typeof window === 'undefined') return getDefaultGameState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        ...getDefaultGameState(),
        ...parsed,
      };
    }
  } catch {
    // Return default
  }
  return getDefaultGameState();
}

export function saveGameState(state: GameSaveState) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore error
  }
}

export function resetGameState(): GameSaveState {
  const fresh = getDefaultGameState();
  saveGameState(fresh);
  return fresh;
}

export function getMilestoneTier(hearts: number): {
  tier: HeartMilestoneTier;
  label: string;
  nextThreshold: number;
} {
  if (hearts >= 100) {
    return { tier: 'FOREVER_ALWAYS', label: 'Forever & Always 👑', nextThreshold: 100 };
  }
  if (hearts >= 50) {
    return { tier: 'SOULMATE', label: 'Soulmate Level 💕', nextThreshold: 100 };
  }
  if (hearts >= 25) {
    return { tier: 'HEART_COLLECTOR', label: 'Heart Collector 💖', nextThreshold: 50 };
  }
  if (hearts >= 10) {
    return { tier: 'LITTLE_LOVE', label: 'Little Love ✨', nextThreshold: 25 };
  }
  return { tier: 'NONE', label: 'Adventurer 🌟', nextThreshold: 10 };
}

export function getDefaultGameState(): GameSaveState {
  return {
    playerRole: 'billo',
    startDate: '2025-02-14',
    currentLevel: 'TITLE',
    unlockedLevels: [1],
    totalHearts: 0,
    level1HeartsFound: [],
    level2QuizScore: 0,
    level2Completed: false,
    level3HighScore: 0,
    level3Completed: false,
    level4ChestsOpened: [],
    level5Completed: false,
    achievedMilestones: [],
    customLoveLetter: `To my sweetest Pillu,\n\nHappy 1st Anniversary! Can you believe it has been 365 whole days since we began this adventure together? Every smile you give me, every late night phone call, and every silly laugh we have shared has made this the happiest year of my life.\n\nThank you for always being my biggest cheerleader, my safe space, and my favorite person to annoy. Through every silly fight, every plate of food we've stolen from each other, and every quiet moment holding hands, you've shown me what unconditional love feels like.\n\nHere is to our 1st year, and to a hundred more chapters of Billo & Pillu.\n\nForever & always,\nYour Billo 💖`,
    soundEnabled: true,
    bgmEnabled: false,
    playerX: 6,
    playerY: 6,
    crystalsCollected: [false, false, false, false, false],
    sparkPoints: 0,
  };
}
