import { Achievement, UserProfile, UserGameStats } from '../types/game';

export const INITIAL_USER_STATS: UserGameStats = {
  totalCommandsRun: 0,
  monstersSlain: 0,
  totalGemsCollected: 0,
  languagesUsed: ['python'],
  briefingsRead: 0,
  perfectLevelsCount: 0,
  fastestCompletionSteps: 999
};

export const ALL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_streak',
    title: 'First Streak',
    subtitle: 'Kobaran Api Pertama',
    description: 'Pertahankan aktivitas belajar koding selama 1 hari berturut-turut.',
    category: 'streak',
    tier: 'bronze',
    icon: 'Flame',
    rewardXp: 60,
    rewardGems: 15,
    targetValue: 1,
    unit: 'hari',
    loreQuote: 'Setiap archmage agung memulai petualangan mereka dari satu hari disiplin.'
  },
  {
    id: 'streak_adept',
    title: 'Streak Adept',
    subtitle: 'Konsistensi Magis',
    description: 'Pertahankan komitmen belajar koding selama 3 hari beruntun.',
    category: 'streak',
    tier: 'silver',
    icon: 'Zap',
    rewardXp: 150,
    rewardGems: 40,
    targetValue: 3,
    unit: 'hari',
    loreQuote: 'Apinya terus berkobar menembus dinginnya malam dungeon.'
  },
  {
    id: 'streak_titan',
    title: 'Streak Titan',
    subtitle: 'Kobaran Abadi',
    description: 'Pertahankan streak belajar koding tanpa putus selama 7 hari.',
    category: 'streak',
    tier: 'mythic',
    icon: 'Crown',
    rewardXp: 400,
    rewardGems: 120,
    targetValue: 7,
    unit: 'hari',
    loreQuote: 'Legenda menceritakan tekadmu menerangi aula Academy of Arcane.'
  },
  {
    id: 'first_spell',
    title: 'First Spell',
    subtitle: 'Mantra Perdana',
    description: 'Eksekusi instruksi pergerakan ksatria pertamamu di Studio IDE.',
    category: 'mastery',
    tier: 'bronze',
    icon: 'Code2',
    rewardXp: 50,
    rewardGems: 10,
    targetValue: 1,
    unit: 'eksekusi',
    loreQuote: 'Mantra pertama diucapkan, batu runic pun bercahaya terang.'
  },
  {
    id: 'code_master',
    title: 'Code Master',
    subtitle: 'Sang Arsitek Algoritma',
    description: 'Tulis dan jalankan lebih dari 35 perintah logika di dungeon.',
    category: 'mastery',
    tier: 'gold',
    icon: 'Terminal',
    rewardXp: 280,
    rewardGems: 75,
    targetValue: 35,
    unit: 'perintah',
    loreQuote: 'Logika dan struktur mengalir di nadimu layaknya melodi kuno.'
  },
  {
    id: 'polyglot_mage',
    title: 'Polyglot Mage',
    subtitle: 'Dua Bahasa Mantra',
    description: 'Praktekkan mantra menggunakan bahasa Python dan JavaScript.',
    category: 'mastery',
    tier: 'silver',
    icon: 'Languages',
    rewardXp: 180,
    rewardGems: 50,
    targetValue: 2,
    unit: 'bahasa',
    loreQuote: 'Python untuk presisi analitik, JavaScript untuk kelincahan temporal.'
  },
  {
    id: 'first_blood',
    title: 'Monster Slayer',
    subtitle: 'Penumpas Penjaga',
    description: 'Tumbangkan monster musuh pertama menggunakan mantra hero.attack().',
    category: 'combat',
    tier: 'bronze',
    icon: 'Swords',
    rewardXp: 70,
    rewardGems: 20,
    targetValue: 1,
    unit: 'monster',
    loreQuote: 'Bilah pedang runic bersinar membelah bayangan penjaga dungeon.'
  },
  {
    id: 'beast_cleanser',
    title: 'Beast Cleanser',
    subtitle: 'Pembersih Koridor',
    description: 'Kalahkan total 4 monster penjaga di sepanjang dungeon CodeQuest.',
    category: 'combat',
    tier: 'silver',
    icon: 'ShieldAlert',
    rewardXp: 220,
    rewardGems: 60,
    targetValue: 4,
    unit: 'monster',
    loreQuote: 'Koridor kuno kembali tenang dari ancaman goblin dan ogre buas.'
  },
  {
    id: 'gem_hoarder',
    title: 'Gem Hoarder',
    subtitle: 'Kolektor Soul Ruby',
    description: 'Kumpulkan total akumulasi 50 Soul Gems dari lantai dungeon.',
    category: 'exploration',
    tier: 'silver',
    icon: 'Sparkles',
    rewardXp: 160,
    rewardGems: 45,
    targetValue: 50,
    unit: 'ruby',
    loreQuote: 'Permata merah delima bersinar memancarkan energi magis purba.'
  },
  {
    id: 'scholar_mind',
    title: 'Scholar Mind',
    subtitle: 'Kutu Buku Arcane',
    description: 'Pelajari minimal 2 modul materi teori sebelum memasuki Studio IDE.',
    category: 'exploration',
    tier: 'bronze',
    icon: 'BookOpen',
    rewardXp: 90,
    rewardGems: 25,
    targetValue: 2,
    unit: 'materi',
    loreQuote: 'Pemahaman teori adalah fondasi terkuat sebelum memegang pedang kode.'
  },
  {
    id: 'perfectionist',
    title: 'Perfectionist',
    subtitle: 'Tiga Bintang Sempurna',
    description: 'Raih perolehan 3 Bintang sempurna pada 2 level dungeon berbeda.',
    category: 'perfection',
    tier: 'gold',
    icon: 'Star',
    rewardXp: 260,
    rewardGems: 80,
    targetValue: 2,
    unit: 'level',
    loreQuote: 'Tidak ada celah kesalahan dalam algoritma yang kamu rancang.'
  },
  {
    id: 'grandmaster_syntax',
    title: 'Grandmaster CodeQuest',
    subtitle: 'Legenda Penakluk Realm',
    description: 'Taklukkan dan selesaikan minimal 4 quest dungeon di peta petualangan.',
    category: 'perfection',
    tier: 'mythic',
    icon: 'Trophy',
    rewardXp: 500,
    rewardGems: 150,
    targetValue: 4,
    unit: 'level',
    loreQuote: 'Namamu kini terukir abadi di dinding suci Grand Library of Code.'
  }
];

export function getAchievementProgress(
  achievement: Achievement,
  user: UserProfile
): { current: number; max: number; percentage: number; isUnlocked: boolean } {
  // If explicitly unlocked in user profile
  if (user.achievements?.[achievement.id]) {
    return {
      current: achievement.targetValue,
      max: achievement.targetValue,
      percentage: 100,
      isUnlocked: true
    };
  }

  const stats = user.gameStats || INITIAL_USER_STATS;
  let current = 0;

  switch (achievement.id) {
    case 'first_streak':
    case 'streak_adept':
    case 'streak_titan':
      current = user.streakDays || 0;
      break;

    case 'first_spell':
    case 'code_master':
      current = stats.totalCommandsRun || 0;
      break;

    case 'polyglot_mage':
      current = (stats.languagesUsed || [user.preferredLanguage]).length;
      break;

    case 'first_blood':
    case 'beast_cleanser':
      current = stats.monstersSlain || 0;
      break;

    case 'gem_hoarder':
      current = Math.max(stats.totalGemsCollected || 0, user.gems || 0);
      break;

    case 'scholar_mind':
      current = stats.briefingsRead || 0;
      break;

    case 'perfectionist': {
      const perfectCount = Object.values(user.completedLevels || {}).filter((lvl) => lvl.stars === 3).length;
      current = Math.max(perfectCount, stats.perfectLevelsCount || 0);
      break;
    }

    case 'grandmaster_syntax':
      current = Object.keys(user.completedLevels || {}).length;
      break;

    default:
      current = 0;
  }

  const clampedCurrent = Math.min(current, achievement.targetValue);
  const percentage = Math.min(100, Math.round((clampedCurrent / achievement.targetValue) * 100));
  const isUnlocked = current >= achievement.targetValue;

  return {
    current: clampedCurrent,
    max: achievement.targetValue,
    percentage,
    isUnlocked
  };
}

export function evaluateAchievements(user: UserProfile): {
  newlyUnlocked: Achievement[];
  updatedAchievements: Record<string, { unlockedAt: string; claimed: boolean }>;
} {
  const currentAchievements = { ...(user.achievements || {}) };
  const newlyUnlocked: Achievement[] = [];

  ALL_ACHIEVEMENTS.forEach((ach) => {
    // If not yet unlocked
    if (!currentAchievements[ach.id]) {
      const { isUnlocked } = getAchievementProgress(ach, user);
      if (isUnlocked) {
        currentAchievements[ach.id] = {
          unlockedAt: new Date().toISOString(),
          claimed: false
        };
        newlyUnlocked.push(ach);
      }
    }
  });

  return {
    newlyUnlocked,
    updatedAchievements: currentAchievements
  };
}
