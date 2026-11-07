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
    title: 'The Flower by the Sea',
    locationName: 'The Seaside of Firsts',
    objective: 'Find the flower by the sea!',
    hint: 'Head toward the water where our story began.',
    completed: false,
    rewardCrystal: 0,
    storyDialog: ['Remember the flower by the sea?'],
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
    title: 'Shruti — The Radiant Heart of Our Story',
    color: '#ff70a6',
    accentColor: '#b5179e',
    spriteUrl: BILLO_SPRITE_URL,
    avatarIcon: '💙',
    description: 'Sweet, fiercely loving, and the heart of our 365-day story. From the flower by the sea to Bangkok after dark, every memory shines because of you.',
  },
  pillu: {
    id: 'pillu',
    name: 'Pillu',
    partnerName: 'Billo',
    nickname: 'Pillu Cutie',
    title: 'Prateek — The Devoted Knight of Our Story',
    color: '#4cc9f0',
    accentColor: '#4361ee',
    spriteUrl: PILLU_SPRITE_URL,
    avatarIcon: '😎',
    description: 'Always ready with warm hugs, homemade herb rice, and a surprise up his sleeve. From the last seat of the bus to the dragon ride, always by your side.',
  },
};

export const INITIAL_MILESTONES: MemoryMilestone[] = [
  {
    id: 'm1',
    title: 'The Flower by the Sea',
    dateStr: '7 Nov 2025',
    category: 'first_meet',
    description: 'The evening Pillu asked Billo to be his girlfriend by the sea. She had asked him to give her a flower first. Our story officially began.',
    unlocked: true,
    crystalIndex: 0,
    icon: '🌸',
    specialNote: 'One flower by the sea turned into 365 days of forever.',
  },
  {
    id: 'm2',
    title: 'The Forest Picnic',
    dateStr: '8 Nov 2025',
    category: 'first_date',
    description: 'Our first adventure picnic at Sanjay Gandhi National Park. Cycling to Kanheri Caves, herb rice with peri-peri gravy, and our second kiss on the last seat of the bus home.',
    unlocked: false,
    crystalIndex: 1,
    icon: '🚲',
    specialNote: 'Herb rice, ancient caves, and the last seat of an AC bus to Thane.',
  },
  {
    id: 'm3',
    title: 'Colours of Holi',
    dateStr: 'Spring 2026',
    category: 'trip',
    description: 'Pillu surprised Billo by arriving at her society by bus for their first Holi together. Colours, rain-dance, laughter, and meeting her childhood friends.',
    unlocked: false,
    crystalIndex: 2,
    icon: '🎨',
    specialNote: 'Our first Holi was pure chaos — the best kind.',
  },
  {
    id: 'm4',
    title: 'Pink & White Navratri',
    dateStr: 'Navratri 2025',
    category: 'food',
    description: 'College Navratri night. Billo in pink and white, Pillu in white kurta with a pink chunni. Pillu a Garba pro, Billo a happy disaster. She fell asleep in the cab and missed every call.',
    unlocked: false,
    crystalIndex: 3,
    icon: '💃',
    specialNote: 'Pink and white. Garba. You being a pro and me being a disaster.',
  },
  {
    id: 'm5',
    title: '365 Days of Us: Happy 1st Anniversary!',
    dateStr: '7 Nov 2026',
    category: 'anniversary',
    description: 'One full circle around the sun. From the flower by the sea to Bangkok after dark, from the dragon ride to the last seat of the bus — every little memory brought us here.',
    unlocked: false,
    crystalIndex: 4,
    icon: '👑',
    specialNote: '365 DAYS. INFINITE MEMORIES. ONE FAVOURITE PERSON.',
  },
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  // ROUND 1 — REMEMBER WHEN?
  {
    id: 'q1',
    question: 'On what date did our relationship officially begin?',
    options: [
      '8 November 2025',
      '7 November 2025',
      '27 February 2026',
      '14 February 2026',
    ],
    correctIndex: 1,
    explanation: '7 November 2025 — the evening Pillu asked Billo to be his girlfriend by the sea.',
    partnerReaction: 'Billo smiles: "Our story officially began on 7 November 2025. I remember every second."',
  },
  {
    id: 'q2',
    question: 'Where did Pillu ask Billo to be his girlfriend?',
    options: [
      'At a college fest',
      'At a café',
      'By the sea',
      'At a hotel',
    ],
    correctIndex: 2,
    explanation: 'By the sea — an evening that changed everything.',
    partnerReaction: 'Pillu: "Remember the flower by the sea? That evening was magic."',
  },
  {
    id: 'q3',
    question: 'What did Billo ask Pillu to give her before he asked her to be his girlfriend?',
    options: [
      'A chocolate',
      'A flower',
      'A bracelet',
      'A letter',
    ],
    correctIndex: 1,
    explanation: 'A flower — and he gave her one by the sea before asking the question.',
    partnerReaction: 'Billo: "I asked for a flower, and you gave me forever too."',
  },
  {
    id: 'q4',
    question: 'When was our first adventure picnic date?',
    options: [
      '7 November 2025',
      '8 November 2025',
      '14 November 2025',
      '27 February 2026',
    ],
    correctIndex: 1,
    explanation: 'The very next day, 8 November 2025 — off to the woods we went!',
    partnerReaction: 'Pillu: "The day after we made it official, we were already on an adventure!"',
  },
  // ROUND 2 — THE WOODS KNOW OUR STORY
  {
    id: 'q5',
    question: 'Where did we go for our first adventure picnic date?',
    options: [
      'Aarey Forest',
      'Sanjay Gandhi National Park',
      'Juhu Beach',
      'Marine Drive',
    ],
    correctIndex: 1,
    explanation: 'Sanjay Gandhi National Park — we reached Borivali early in the morning.',
    partnerReaction: 'Billo: "Cycling through the greenery towards Kanheri Caves... best morning ever."',
  },
  {
    id: 'q6',
    question: 'Which caves did we explore during our picnic date?',
    options: [
      'Elephanta Caves',
      'Ajanta Caves',
      'Kanheri Caves',
      'Ellora Caves',
    ],
    correctIndex: 2,
    explanation: 'Kanheri Caves — ancient and beautiful, right in the heart of the national park.',
    partnerReaction: 'Pillu: "Exploring those ancient caves with you felt like our own little adventure movie."',
  },
  {
    id: 'q7',
    question: 'What did Pillu prepare for our picnic?',
    options: [
      'Sandwiches and pizza',
      'Herb rice with peri-peri gravy, drinks, and desserts',
      'Pasta and ice cream',
      'Vada pav and chai',
    ],
    correctIndex: 1,
    explanation: 'Herb rice with peri-peri gravy, drinks, and desserts — homemade with love.',
    partnerReaction: 'Billo: "You made herb rice just for our picnic. That was so Pillu."',
  },
  {
    id: 'q8',
    question: 'Where did we share our second kiss?',
    options: [
      'At Kanheri Caves',
      'On the last seat of an AC bus towards Thane',
      'At the picnic spot',
      'At Borivali station',
    ],
    correctIndex: 1,
    explanation: 'On the last seat of a fully air-conditioned bus heading towards Thane.',
    partnerReaction: 'Pillu: "The last seat of the AC bus will always be special."',
  },
  // ROUND 3 — FESTIVAL CHAOS
  {
    id: 'q9',
    question: 'How did Pillu surprise Billo on their first Holi together?',
    options: [
      'He sent her flowers',
      'He arrived at her society by bus',
      'He booked a hotel',
      'He surprised her at college',
    ],
    correctIndex: 1,
    explanation: 'He travelled by bus and called her while keeping the surprise alive, then showed up at her society.',
    partnerReaction: 'Billo: "Our first Holi was pure chaos. You took a bus just to surprise me!"',
  },
  {
    id: 'q10',
    question: 'What did Billo wear for the college Navratri night?',
    options: [
      'A red saree',
      'A pink and white short kurti with jeans',
      'A blue lehenga',
      'A white dress',
    ],
    correctIndex: 1,
    explanation: 'A pink and white short kurti with jeans — effortlessly adorable.',
    partnerReaction: 'Pillu: "Pink and white. You looked so beautiful that night."',
  },
  {
    id: 'q11',
    question: 'What did Pillu wear to match Billo on Navratri night?',
    options: [
      'A red kurta',
      'A white kurta, jeans, and pink chunni',
      'A pink shirt',
      'A black kurta',
    ],
    correctIndex: 1,
    explanation: 'A white kurta, jeans, and a pink chunni — matching her pink and white perfectly.',
    partnerReaction: 'Billo: "You wore a pink chunni to match me. Coolest date ever."',
  },
  {
    id: 'q12',
    question: 'Who was better at Garba?',
    options: [
      'Billo',
      'Pillu',
      'Both equally',
      'Neither',
    ],
    correctIndex: 1,
    explanation: 'Pillu was the Garba pro. Billo barely knew the steps and danced in her own silly way.',
    partnerReaction: 'Billo laughs: "You being a pro and me being a disaster — our favourite memory!"',
    isTimed: true,
  },
  // ROUND 4 — OUR LITTLE WORLD
  {
    id: 'q13',
    question: 'Where did we go during Shruti\'s birthday getaway?',
    options: [
      'A hotel in Andheri',
      'A resort in Lonavala',
      'A hotel in Thane',
      'A beach resort in Goa',
    ],
    correctIndex: 0,
    explanation: 'A hotel in Andheri — the same hotel from our Aarohan getaway, returned for the birthday.',
    partnerReaction: 'Pillu: "The Andheri hotel became our little world, twice over."',
  },
  {
    id: 'q14',
    question: 'Which beach did we walk along during the birthday getaway?',
    options: [
      'Juhu Beach',
      'Aksa Beach',
      'Silver Beach',
      'Marine Drive',
    ],
    correctIndex: 2,
    explanation: 'Silver Beach — a peaceful walk together by the waves.',
    partnerReaction: 'Billo: "Walking along Silver Beach with you was the calmest, happiest moment."',
  },
  {
    id: 'q15',
    question: 'Which temple did we visit during the birthday getaway?',
    options: [
      'Siddhivinayak Temple',
      'ISKCON Temple',
      'Tembinaka Devi',
      'Chinchpokali Cha Chintamani',
    ],
    correctIndex: 1,
    explanation: 'ISKCON Temple — seeking blessings together on your birthday.',
    partnerReaction: 'Pillu: "ISKCON Temple on your birthday. Bappa and Krishna both blessed us."',
  },
  {
    id: 'q16',
    question: 'What did Pillu set up for Billo at midnight on her birthday?',
    options: [
      'A treasure hunt',
      'A birthday corner',
      'A picnic',
      'A surprise party at college',
    ],
    correctIndex: 1,
    explanation: 'A birthday corner — set up with thoughtfulness and love at midnight.',
    partnerReaction: 'Billo: "Our birthday corner. You made my birthday so special with just your effort."',
  },
  // ROUND 5 — THE LOVE QUEST
  {
    id: 'q17',
    question: 'Where did we go together for our internship?',
    options: [
      'Asian Paints',
      'Aabo',
      'VBS',
      'HubSpot',
    ],
    correctIndex: 1,
    explanation: 'Aabo — both selected, and three months of working and growing together.',
    partnerReaction: 'Pillu: "We did our internships together. We grew together."',
  },
  {
    id: 'q18',
    question: 'What did we make together on Girlfriends\' Day?',
    options: [
      'Scrapbooks',
      'Clay figures',
      'Paintings',
      'Cupcakes',
    ],
    correctIndex: 1,
    explanation: 'Clay figures — a clay figure date where we made little figures together.',
    partnerReaction: 'Billo: "Our clay date. Little figures, big memories."',
  },
  {
    id: 'q19',
    question: 'What did we offer together during our first Ganesh Chaturthi?',
    options: [
      'Flowers',
      'A naral',
      'Sweets',
      'A diya',
    ],
    correctIndex: 1,
    explanation: 'A naral — offered together at Chinchpokali Cha Chintamani, seeking Bappa\'s blessings.',
    partnerReaction: 'Pillu: "Offering a naral together at Chinchpokali Cha Chintamani. Bappa blessed us."',
  },
  {
    id: 'q20',
    question: 'What did Pillu get Billo after their terrifying dragon ride?',
    options: [
      'A teddy bear',
      'Two balloons',
      'Chocolates',
      'A flower',
    ],
    correctIndex: 1,
    explanation: 'Two balloons — a sweet ending to a terrifying ride.',
    partnerReaction: 'Billo: "Two balloons and one unforgettable evening. You even conquered your fear."',
  },
  {
    id: 'q21',
    question: 'Where did we stop during our late-night Bangkok adventure?',
    options: [
      'Starbucks',
      'Seven Eleven',
      'McDonald\'s',
      'A night market',
    ],
    correctIndex: 1,
    explanation: 'Seven Eleven — a late-night snack stop after wandering Bangkok streets.',
    partnerReaction: 'Pillu: "Bangkok, Seven Eleven, and our little late-night adventure."',
    isTimed: true,
  },
  {
    id: 'q22',
    question: 'What was special about our Thailand trip?',
    options: [
      'It was our first domestic trip',
      'It was the first international trip for both of us',
      'It was our honeymoon',
      'It was our anniversary trip together',
    ],
    correctIndex: 1,
    explanation: 'The first international trip for both of us — a milestone in itself.',
    partnerReaction: 'Billo: "Our first international trip together. Bangkok after dark, forever in our hearts."',
  },
];

export const TREASURE_CHESTS: TreasureChestData[] = [
  {
    id: 'c1',
    title: 'The Flower by the Sea',
    locationName: 'The Seaside of Firsts',
    x: 14,
    y: 35,
    memoryTitle: '7 November 2025',
    memoryText: 'The evening Pillu asked Billo to be his girlfriend by the sea. She had asked him to give her a flower first. One flower, one question, and our whole story began.',
    specialNote: 'Remember the flower by the sea? That was the moment everything started.',
    heartsAwarded: 5,
    opened: false,
  },
  {
    id: 'c2',
    title: 'The Forest Picnic',
    locationName: 'Sanjay Gandhi National Park',
    x: 24,
    y: 48,
    memoryTitle: '8 November 2025',
    memoryText: 'Cycling through the greenery towards Kanheri Caves, exploring ancient caves together, and sharing homemade herb rice with peri-peri gravy in the heart of nature.',
    specialNote: 'You made herb rice just for our picnic. That was so Pillu.',
    heartsAwarded: 5,
    opened: false,
  },
  {
    id: 'c3',
    title: 'The Last Seat',
    locationName: 'AC Bus to Thane',
    x: 34,
    y: 30,
    memoryTitle: 'The Ride Home',
    memoryText: 'A fully air-conditioned bus heading towards Thane. The last seat, just us, and our second kiss. The most ordinary bus ride became the most special one.',
    specialNote: 'The last seat of the AC bus will always be special.',
    heartsAwarded: 5,
    opened: false,
  },
  {
    id: 'c4',
    title: 'Colours of Holi',
    locationName: 'Billo\'s Society',
    x: 44,
    y: 55,
    memoryTitle: 'Our First Holi',
    memoryText: 'Pillu took a bus and showed up unannounced at Billo\'s society. Colours, rain-dance, laughter, getting drenched, and meeting her childhood friends. Pillu\'s first Holi with his girlfriend.',
    specialNote: 'Our first Holi was pure chaos — and I wouldn\'t change a single colour-soaked moment.',
    heartsAwarded: 5,
    opened: false,
  },
  {
    id: 'c5',
    title: 'Our Birthday Corner',
    locationName: 'Andheri Hotel & Silver Beach',
    x: 54,
    y: 38,
    memoryTitle: 'Shruti\'s Birthday',
    memoryText: 'The Andheri hotel, a walk along Silver Beach, ISKCON Temple, and a birthday corner Pillu set up at midnight. A night of cuddling, laughing, and deep conversations.',
    specialNote: 'Our birthday corner. You made my birthday special through your effort and thoughtfulness.',
    heartsAwarded: 6,
    opened: false,
  },
  {
    id: 'c6',
    title: 'Pink & White',
    locationName: 'College Navratri Night',
    x: 64,
    y: 50,
    memoryTitle: 'Garba Night',
    memoryText: 'Billo in a pink and white short kurti, Pillu in a white kurta with a pink chunni. Pillu a Garba pro, Billo a happy disaster. She fell asleep in the cab and missed every call.',
    specialNote: 'Pink and white. Garba. You being a pro and me being a disaster.',
    heartsAwarded: 5,
    opened: false,
  },
  {
    id: 'c7',
    title: 'Bangkok After Dark',
    locationName: 'Bangkok Streets',
    x: 74,
    y: 32,
    memoryTitle: 'Thailand — First International Trip',
    memoryText: 'A café night, our first hard liquor drinks, wandering Bangkok streets laughing, and a late-night Seven Eleven stop for chips and snacks. Our first international trip together.',
    specialNote: 'Bangkok, Seven Eleven, and our little late-night adventure.',
    heartsAwarded: 6,
    opened: false,
  },
  {
    id: 'c8',
    title: 'The Dragon Ride',
    locationName: 'Navratri Mela',
    x: 82,
    y: 58,
    memoryTitle: 'The Ride We Regretted',
    memoryText: 'Billo wanted to ride the dragon ride. Pillu was terrified. They went anyway, and both regretted it the moment it began. Billo clung to Pillu and confessed her love. He got her two balloons after.',
    specialNote: 'You were terrified of that dragon ride. Two balloons and one unforgettable evening.',
    heartsAwarded: 6,
    opened: false,
  },
  {
    id: 'c9',
    title: 'The Clay Date',
    locationName: 'Girlfriends\' Day',
    x: 88,
    y: 40,
    memoryTitle: 'Clay Figures',
    memoryText: 'Flowers, singing, and a clay figure date. We made little clay figures together. A day of celebration that Pillu planned as a surprise — sweet, creative, and ours.',
    specialNote: 'Our clay date. Little figures, a big surprise, and a day I\'ll always hold close.',
    heartsAwarded: 5,
    opened: false,
  },
  {
    id: 'c10',
    title: 'The Aabo Chapter',
    locationName: 'Aabo Internship',
    x: 50,
    y: 70,
    memoryTitle: 'Three Months Together',
    memoryText: 'Both selected for an internship at Aabo. Three months of work, learning, jokes, conversations, and professional growth — side by side, through it all.',
    specialNote: 'We did our internships together. We grew together.',
    heartsAwarded: 8,
    opened: false,
  },
];

const STORAGE_KEY = 'billo_pillu_love_quest_v3';

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
    startDate: '2025-11-07',
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
    customLoveLetter: `To my sweetest Pillu,\n\nHappy 1st Anniversary! Can you believe it has been 365 whole days since that evening by the sea? You gave me a flower, asked me to be yours, and my whole world changed.\n\nFrom cycling to Kanheri Caves with your homemade herb rice, to the last seat of that AC bus to Thane. From our first Holi chaos to matching pink and white on Navratri night. From the Andheri hotel and Silver Beach to Bangkok after dark. From the terrifying dragon ride where I confessed my love, to our clay date and three months at Aabo together.\n\nThrough happy days and difficult days, we were there for each other. One year later, and you're still my favourite person.\n\n365 DAYS. INFINITE MEMORIES. ONE FAVOURITE PERSON.\n\nForever & always,\nYour Billo 💖`,
    soundEnabled: true,
    bgmEnabled: false,
    playerX: 6,
    playerY: 6,
    crystalsCollected: [false, false, false, false, false],
    sparkPoints: 0,
  };
}
