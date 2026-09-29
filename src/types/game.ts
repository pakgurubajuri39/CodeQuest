export type SupportedLanguage = 'python' | 'javascript';

export type UserRole = 'student' | 'admin';

export type UserStatus = 'trial' | 'pending' | 'approved' | 'rejected';

export interface InventoryItem {
  id: string;
  name: string;
  slot: 'weapon' | 'tome' | 'armor' | 'boots' | 'ring';
  icon: string;
  statBonus: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  lore: string;
}

export interface UserGameStats {
  totalCommandsRun: number;
  monstersSlain: number;
  totalGemsCollected: number;
  languagesUsed: SupportedLanguage[];
  briefingsRead: number;
  perfectLevelsCount: number;
  fastestCompletionSteps: number;
}

export type AchievementCategory = 'streak' | 'mastery' | 'combat' | 'exploration' | 'perfection';
export type AchievementTier = 'bronze' | 'silver' | 'gold' | 'mythic';

export interface Achievement {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  category: AchievementCategory;
  tier: AchievementTier;
  icon: string;
  rewardXp: number;
  rewardGems: number;
  targetValue: number;
  unit: string;
  loreQuote: string;
}

export interface UnlockedAchievementRecord {
  unlockedAt: string;
  claimed: boolean;
}

export interface UserProfile {
  id: string;
  username: string;
  displayName: string;
  role: UserRole;
  status: UserStatus;
  email?: string;
  password?: string;
  registeredAt?: string;
  avatar: string;
  heroClass: 'Knight' | 'Sorcerer' | 'Ranger';
  xp: number;
  gems: number;
  heroLevel: number;
  streakDays: number;
  preferredLanguage: SupportedLanguage;
  completedLevels: Record<string, { stars: number; highscore: number; completedAt: string }>;
  equipped: {
    weapon: InventoryItem;
    tome: InventoryItem;
    armor: InventoryItem;
    boots: InventoryItem;
    ring: InventoryItem;
  };
  inventory: InventoryItem[];
  achievements?: Record<string, UnlockedAchievementRecord>;
  gameStats?: UserGameStats;
}

export type TileType = 'floor' | 'wall' | 'spikes' | 'exit' | 'lava' | 'tree' | 'water';

export interface GridItem {
  id: string;
  x: number;
  y: number;
  collected?: boolean;
}

export interface GridEnemy {
  id: string;
  name: string;
  x: number;
  y: number;
  hp: number;
  maxHp: number;
  type: 'goblin' | 'ogre' | 'skeleton' | 'dummy';
  isAlive: boolean;
}

export interface GridMap {
  width: number;
  height: number;
  theme: 'dungeon' | 'forest' | 'mountain';
  heroStart: {
    x: number;
    y: number;
    dir: 'up' | 'down' | 'left' | 'right';
  };
  exit: {
    x: number;
    y: number;
  };
  walls: { x: number; y: number }[];
  spikes: { x: number; y: number }[];
  gems: GridItem[];
  enemies: GridEnemy[];
}

export interface VictoryConditions {
  requiredGems?: number;
  avoidTraps?: boolean;
  defeatEnemies?: boolean;
  reachExit?: boolean;
  maxCodeLines?: number;
  loreObjective: string;
}

export interface LevelCurriculum {
  id: string;
  realmId: 'dungeon_syntax' | 'forest_loops' | 'mountain_variables';
  realmName: string;
  realmOrder: number;
  order: number;
  title: string;
  shortLore: string;
  loreDescription: string;
  learningObjectives: string[];
  conceptExplanation: string;
  starterCode: {
    python: string;
    javascript: string;
  };
  solutionCode: {
    python: string;
    javascript: string;
  };
  victoryConditions: VictoryConditions;
  gridMap: GridMap;
  hints: string[];
  rewardXp: number;
  rewardGems: number;
}

export interface RealmCurriculum {
  id: 'dungeon_syntax' | 'forest_loops' | 'mountain_variables';
  name: string;
  subtitle: string;
  icon: string;
  badge: string;
  realmOrder: number;
  colorScheme: string;
  description: string;
  concepts: string[];
  levels: LevelCurriculum[];
}

export type ActionType = 
  | 'MOVE_RIGHT'
  | 'MOVE_LEFT'
  | 'MOVE_UP'
  | 'MOVE_DOWN'
  | 'ATTACK'
  | 'COLLECT'
  | 'WAIT'
  | 'ERROR';

export interface SimulationStep {
  type: ActionType;
  steps?: number;
  target?: string;
  line?: number;
  comment?: string;
}

export interface ConsoleMessage {
  id: string;
  type: 'info' | 'success' | 'warn' | 'error' | 'hero';
  text: string;
  line?: number;
  timestamp: string;
}

export interface BattleLogEntry {
  id: string;
  turn: number;
  actor: 'hero' | 'enemy' | 'trap' | 'system';
  actorName: string;
  actionType: 'attack' | 'retaliate' | 'move' | 'gem' | 'trap' | 'defeat' | 'victory' | 'fail';
  text: string;
  damage?: number;
  target?: string;
  heroHp: number;
  enemyHp?: number;
  enemyMaxHp?: number;
  line?: number;
  timestamp: string;
}

export interface StudentMetric {
  id: string;
  name: string;
  avatar: string;
  email: string;
  currentRealm: string;
  currentLevelTitle: string;
  completedLevelsCount: number;
  totalXp: number;
  accuracyRate: number;
  averageAttempts: number;
  commonErrors: string[];
  lastActive: string;
  status: 'online' | 'idle' | 'offline';
  approvalStatus: UserStatus;
  registeredAt: string;
}
