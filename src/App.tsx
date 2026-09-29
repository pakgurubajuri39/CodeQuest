/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  UserProfile,
  LevelCurriculum,
  SupportedLanguage,
  UserRole,
  Achievement,
  UserGameStats
} from './types/game';
import { ALL_LEVELS, DEFAULT_INVENTORY } from './data/curriculum';
import {
  ALL_ACHIEVEMENTS,
  evaluateAchievements,
  INITIAL_USER_STATS
} from './data/achievements';
import { sound } from './utils/audio';
import { Navbar } from './components/common/Navbar';
import { InventoryModal } from './components/common/InventoryModal';
import { AchievementsPanel } from './components/achievements/AchievementsPanel';
import { AchievementToast } from './components/achievements/AchievementToast';
import { LandingPage } from './components/landing/LandingPage';
import { AuthPage } from './components/auth/AuthPage';
import { HomeDashboard } from './components/home/HomeDashboard';
import { PreStudioBriefing } from './components/studio/PreStudioBriefing';
import { Studio } from './components/studio/Studio';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { CurriculumSchemaView } from './components/schema/CurriculumSchemaView';
import {
  testConnection,
  subscribeToStudents,
  saveStudent,
  updateStudentApprovalStatus,
  seedInitialStudentsIfEmpty
} from './firebase/firebase';

const LOCAL_STORAGE_STUDENTS_KEY = 'codequest_students_v3';

// Initial default students roster including approved and pending students
const INITIAL_STUDENTS: UserProfile[] = [
  {
    id: 'stu_alex_default',
    username: 'alex_arcane',
    displayName: 'Alex the Arcane',
    role: 'student',
    status: 'approved',
    email: 'alex@academy.codequest.edu',
    registeredAt: '2026-09-20',
    avatar: '⚔️',
    heroClass: 'Knight',
    xp: 450,
    gems: 120,
    heroLevel: 2,
    streakDays: 4,
    preferredLanguage: 'python',
    completedLevels: {
      syntax_level_1: { stars: 3, highscore: 100, completedAt: '2026-09-27' },
      syntax_level_2: { stars: 2, highscore: 140, completedAt: '2026-09-28' }
    },
    equipped: DEFAULT_INVENTORY,
    inventory: Object.values(DEFAULT_INVENTORY),
    gameStats: {
      totalCommandsRun: 42,
      monstersSlain: 3,
      totalGemsCollected: 120,
      languagesUsed: ['python', 'javascript'],
      briefingsRead: 2,
      perfectLevelsCount: 1,
      fastestCompletionSteps: 12
    },
    achievements: {
      first_streak: { unlockedAt: '2026-09-25T10:00:00Z', claimed: true },
      streak_adept: { unlockedAt: '2026-09-27T10:00:00Z', claimed: false },
      first_spell: { unlockedAt: '2026-09-25T10:15:00Z', claimed: true },
      polyglot_mage: { unlockedAt: '2026-09-28T09:00:00Z', claimed: false }
    }
  },
  {
    id: 'stu_marcus_default',
    username: 'marcus_iron',
    displayName: 'Marcus Ironclad',
    role: 'student',
    status: 'approved',
    email: 'marcus@academy.codequest.edu',
    registeredAt: '2026-09-22',
    avatar: '🛡️',
    heroClass: 'Knight',
    xp: 220,
    gems: 60,
    heroLevel: 1,
    streakDays: 2,
    preferredLanguage: 'python',
    completedLevels: {
      syntax_level_1: { stars: 3, highscore: 100, completedAt: '2026-09-27' }
    },
    equipped: DEFAULT_INVENTORY,
    inventory: Object.values(DEFAULT_INVENTORY),
    gameStats: {
      totalCommandsRun: 18,
      monstersSlain: 1,
      totalGemsCollected: 60,
      languagesUsed: ['python'],
      briefingsRead: 1,
      perfectLevelsCount: 1,
      fastestCompletionSteps: 18
    },
    achievements: {
      first_streak: { unlockedAt: '2026-09-22T10:00:00Z', claimed: true },
      first_spell: { unlockedAt: '2026-09-22T10:30:00Z', claimed: true }
    }
  },
  {
    id: 'stu_kira_pending',
    username: 'kira_blade',
    displayName: 'Kira the Spellblade',
    role: 'student',
    status: 'pending',
    email: 'kira@spellblade.io',
    registeredAt: '2026-09-28',
    avatar: '🔮',
    heroClass: 'Sorcerer',
    xp: 100,
    gems: 25,
    heroLevel: 1,
    streakDays: 1,
    preferredLanguage: 'javascript',
    completedLevels: {},
    equipped: DEFAULT_INVENTORY,
    inventory: Object.values(DEFAULT_INVENTORY),
    gameStats: {
      totalCommandsRun: 0,
      monstersSlain: 0,
      totalGemsCollected: 0,
      languagesUsed: ['javascript'],
      briefingsRead: 0,
      perfectLevelsCount: 0,
      fastestCompletionSteps: 999
    },
    achievements: {
      first_streak: { unlockedAt: '2026-09-28T08:00:00Z', claimed: false }
    }
  },
  {
    id: 'stu_rowan_pending',
    username: 'rowan_swift',
    displayName: 'Rowan Swiftfoot',
    role: 'student',
    status: 'pending',
    email: 'rowan@swiftfoot.net',
    registeredAt: '2026-09-28',
    avatar: '🏹',
    heroClass: 'Ranger',
    xp: 100,
    gems: 25,
    heroLevel: 1,
    streakDays: 1,
    preferredLanguage: 'python',
    completedLevels: {},
    equipped: DEFAULT_INVENTORY,
    inventory: Object.values(DEFAULT_INVENTORY),
    gameStats: {
      totalCommandsRun: 0,
      monstersSlain: 0,
      totalGemsCollected: 0,
      languagesUsed: ['python'],
      briefingsRead: 0,
      perfectLevelsCount: 0,
      fastestCompletionSteps: 999
    },
    achievements: {}
  }
];

// Helper to spawn a guest trial player
const createTrialGuestUser = (): UserProfile => ({
  id: `trial_guest_${Date.now()}`,
  username: 'tamu_petualang',
  displayName: 'Petualang Tamu (Trial)',
  role: 'student',
  status: 'trial',
  email: 'tamu@trial.codequest.edu',
  registeredAt: new Date().toISOString().split('T')[0],
  avatar: '⚔️',
  heroClass: 'Knight',
  xp: 50,
  gems: 10,
  heroLevel: 1,
  streakDays: 1,
  preferredLanguage: 'python',
  completedLevels: {},
  equipped: DEFAULT_INVENTORY,
  inventory: Object.values(DEFAULT_INVENTORY),
  gameStats: {
    totalCommandsRun: 0,
    monstersSlain: 0,
    totalGemsCollected: 0,
    languagesUsed: ['python'],
    briefingsRead: 0,
    perfectLevelsCount: 0,
    fastestCompletionSteps: 999
  },
  achievements: {}
});

export default function App() {
  // Curriculum levels state (allows admin editing to take effect live)
  const [levels, setLevels] = useState<LevelCurriculum[]>(ALL_LEVELS);

  // Active view: 'landing' (default before login) | 'home' | 'briefing' | 'studio' | 'admin' | 'schema' | 'auth'
  const [activeView, setActiveView] = useState<
    'landing' | 'home' | 'briefing' | 'studio' | 'admin' | 'schema' | 'auth'
  >('landing');

  // Currently loaded level in Studio / Briefing
  const [selectedLevel, setSelectedLevel] = useState<LevelCurriculum>(ALL_LEVELS[0]);

  // Selected language across the app: 'python' | 'javascript'
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>('python');

  // Inventory modal open state
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);

  // Dedicated Achievements modal panel state
  const [isAchievementsOpen, setIsAchievementsOpen] = useState(false);

  // Toast notification for newly unlocked achievement
  const [unlockedToastAchievement, setUnlockedToastAchievement] = useState<Achievement | null>(null);

  // Initial tab for auth page: 'login' | 'register' | 'admin'
  const [authTab, setAuthTab] = useState<'login' | 'register' | 'admin'>('login');

  // Student directory & approval list (persisted in localStorage)
  const [studentsList, setStudentsList] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_STUDENTS_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {
        // Fall back to default roster
      }
    }
    return INITIAL_STUDENTS;
  });

  // User session state (strictly null on initial load so visitor enters as guest on landing page)
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  // Connect to Firebase Firestore on application mount
  useEffect(() => {
    testConnection();
    seedInitialStudentsIfEmpty(INITIAL_STUDENTS);

    // Subscribe to real-time changes from Firestore
    const unsubscribe = subscribeToStudents((remoteStudents) => {
      if (remoteStudents.length > 0) {
        setStudentsList(remoteStudents);

        // If active user is in the remote list, sync their status, XP and achievements live
        setCurrentUser((current) => {
          if (!current) return null;
          const match = remoteStudents.find((s) => s.id === current.id || s.username === current.username);
          if (match) {
            return {
              ...current,
              ...match,
              status: match.status
            };
          }
          return current;
        });
      }
    });

    return () => unsubscribe();
  }, []);

  // Sync studentsList with localStorage as fast local cache
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_STUDENTS_KEY, JSON.stringify(studentsList));
    } catch {
      // Storage error safeguard
    }
  }, [studentsList]);

  // Sync active user with localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('codequest_active_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('codequest_active_user');
    }
  }, [currentUser]);

  // Handle successful login from AuthPage
  const handleLoginSuccess = (user: UserProfile, redirectView: 'home' | 'admin') => {
    const evaluated = evaluateAchievements(user);
    const updatedUser = {
      ...user,
      achievements: evaluated.updatedAchievements
    };

    if (evaluated.newlyUnlocked.length > 0) {
      setUnlockedToastAchievement(evaluated.newlyUnlocked[0]);
    }

    setCurrentUser(updatedUser);
    setSelectedLanguage(user.preferredLanguage);
    setActiveView(redirectView);
  };

  // Handle new student registration (Sets status to 'pending' waiting for admin approval)
  const handleRegisterStudent = (newStudent: UserProfile) => {
    const studentWithStats: UserProfile = {
      ...newStudent,
      gameStats: newStudent.gameStats || INITIAL_USER_STATS,
      achievements: newStudent.achievements || {}
    };

    setStudentsList((prev) => {
      const exists = prev.some((s) => s.id === studentWithStats.id || s.username === studentWithStats.username);
      if (exists) {
        return prev.map((s) => (s.username === studentWithStats.username ? studentWithStats : s));
      }
      return [studentWithStats, ...prev];
    });

    // Save to Firebase Firestore database
    saveStudent(studentWithStats);

    setCurrentUser(studentWithStats);
    setSelectedLanguage(studentWithStats.preferredLanguage);
  };

  // Admin approves a student -> unlocks full access (Levels 1-9)
  const handleApproveStudent = (studentId: string) => {
    setStudentsList((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, status: 'approved' } : s))
    );

    // Sync approval to Firestore
    updateStudentApprovalStatus(studentId, 'approved');

    // If currently logged in user is the approved student, update session live
    if (currentUser && currentUser.id === studentId) {
      setCurrentUser((prev) => (prev ? { ...prev, status: 'approved' } : null));
    }
  };

  // Admin rejects a student
  const handleRejectStudent = (studentId: string) => {
    setStudentsList((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, status: 'rejected' } : s))
    );

    // Sync rejection to Firestore
    updateStudentApprovalStatus(studentId, 'rejected');

    if (currentUser && currentUser.id === studentId) {
      setCurrentUser((prev) => (prev ? { ...prev, status: 'rejected' } : null));
    }
  };

  // Start trial mode (Access Level 1 only)
  const handleStartTrial = () => {
    const trialUser = createTrialGuestUser();
    setCurrentUser(trialUser);
    setSelectedLanguage('python');
    setSelectedLevel(levels[0]);
    // Per requirement: display theory/material before entering the Studio IDE!
    setActiveView('briefing');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveView('landing');
  };

  // Update Game Stats and check for new achievements
  const handleUpdateGameStats = (delta: Partial<UserGameStats>) => {
    if (!currentUser) return;

    setCurrentUser((prev) => {
      if (!prev) return null;
      const currentStats = prev.gameStats || INITIAL_USER_STATS;
      const newStats: UserGameStats = {
        ...currentStats,
        ...delta,
        totalCommandsRun: (currentStats.totalCommandsRun || 0) + (delta.totalCommandsRun || 0),
        monstersSlain: (currentStats.monstersSlain || 0) + (delta.monstersSlain || 0),
        totalGemsCollected: (currentStats.totalGemsCollected || 0) + (delta.totalGemsCollected || 0),
        briefingsRead: (currentStats.briefingsRead || 0) + (delta.briefingsRead || 0),
        perfectLevelsCount: (currentStats.perfectLevelsCount || 0) + (delta.perfectLevelsCount || 0),
        fastestCompletionSteps: Math.min(currentStats.fastestCompletionSteps || 999, delta.fastestCompletionSteps || 999),
        languagesUsed: Array.from(new Set([...(currentStats.languagesUsed || []), ...(delta.languagesUsed || [])]))
      };

      const intermediateUser: UserProfile = {
        ...prev,
        gameStats: newStats
      };

      const { newlyUnlocked, updatedAchievements } = evaluateAchievements(intermediateUser);

      if (newlyUnlocked.length > 0) {
        setUnlockedToastAchievement(newlyUnlocked[0]);
      }

      const updatedUser: UserProfile = {
        ...intermediateUser,
        achievements: updatedAchievements
      };

      setStudentsList((list) => list.map((s) => (s.id === updatedUser.id ? updatedUser : s)));
      saveStudent(updatedUser);
      return updatedUser;
    });
  };

  // Claim achievement reward (+XP, +Gems)
  const handleClaimReward = (achievement: Achievement) => {
    if (!currentUser) return;

    setCurrentUser((prev) => {
      if (!prev) return null;
      const currentAchievements = { ...(prev.achievements || {}) };
      currentAchievements[achievement.id] = {
        unlockedAt: currentAchievements[achievement.id]?.unlockedAt || new Date().toISOString(),
        claimed: true
      };

      const newXp = prev.xp + achievement.rewardXp;
      const newGems = prev.gems + achievement.rewardGems;
      const newLevel = Math.floor(newXp / 500) + 1;

      const updatedUser: UserProfile = {
        ...prev,
        xp: newXp,
        gems: newGems,
        heroLevel: Math.max(prev.heroLevel, newLevel),
        achievements: currentAchievements
      };

      setStudentsList((list) => list.map((s) => (s.id === updatedUser.id ? updatedUser : s)));
      saveStudent(updatedUser);
      return updatedUser;
    });
  };

  // Claim all unlocked achievements at once
  const handleClaimAllRewards = (unclaimedList: Achievement[]) => {
    if (!currentUser || unclaimedList.length === 0) return;

    setCurrentUser((prev) => {
      if (!prev) return null;
      const currentAchievements = { ...(prev.achievements || {}) };
      let addedXp = 0;
      let addedGems = 0;

      unclaimedList.forEach((ach) => {
        currentAchievements[ach.id] = {
          unlockedAt: currentAchievements[ach.id]?.unlockedAt || new Date().toISOString(),
          claimed: true
        };
        addedXp += ach.rewardXp;
        addedGems += ach.rewardGems;
      });

      const newXp = prev.xp + addedXp;
      const newGems = prev.gems + addedGems;
      const newLevel = Math.floor(newXp / 500) + 1;

      const updatedUser: UserProfile = {
        ...prev,
        xp: newXp,
        gems: newGems,
        heroLevel: Math.max(prev.heroLevel, newLevel),
        achievements: currentAchievements
      };

      setStudentsList((list) => list.map((s) => (s.id === updatedUser.id ? updatedUser : s)));
      saveStudent(updatedUser);
      return updatedUser;
    });
  };

  // When a student clears a quest in Studio
  const handleCompleteLevel = (levelId: string, stars: number, highscore: number) => {
    if (!currentUser) return;

    const level = levels.find((l) => l.id === levelId);
    const addedXp = level?.rewardXp || 100;
    const addedGems = level?.rewardGems || 25;

    setCurrentUser((prev) => {
      if (!prev) return null;
      const currentProgress = prev.completedLevels[levelId];
      const bestStars = Math.max(currentProgress?.stars || 0, stars);
      const bestScore = Math.max(currentProgress?.highscore || 0, highscore);

      const newXp = prev.xp + (currentProgress ? Math.round(addedXp * 0.3) : addedXp);
      const newLevel = Math.floor(newXp / 500) + 1;

      const intermediateUser: UserProfile = {
        ...prev,
        xp: newXp,
        gems: prev.gems + (currentProgress ? Math.round(addedGems * 0.5) : addedGems),
        heroLevel: Math.max(prev.heroLevel, newLevel),
        completedLevels: {
          ...prev.completedLevels,
          [levelId]: {
            stars: bestStars,
            highscore: bestScore,
            completedAt: new Date().toISOString().split('T')[0]
          }
        }
      };

      // Check achievements on quest completion
      const { newlyUnlocked, updatedAchievements } = evaluateAchievements(intermediateUser);
      if (newlyUnlocked.length > 0) {
        setUnlockedToastAchievement(newlyUnlocked[0]);
      }

      const updatedUser: UserProfile = {
        ...intermediateUser,
        achievements: updatedAchievements
      };

      // Also update in studentsList if registered
      setStudentsList((sList) =>
        sList.map((s) => (s.id === updatedUser.id ? updatedUser : s))
      );

      // Persist quest progression to Firestore
      saveStudent(updatedUser);

      return updatedUser;
    });
  };

  // Admin updates a curriculum level
  const handleUpdateLevel = (updated: LevelCurriculum) => {
    setLevels((prev) => prev.map((lvl) => (lvl.id === updated.id ? updated : lvl)));
    if (selectedLevel.id === updated.id) {
      setSelectedLevel(updated);
    }
  };

  // Admin clicks "Test in Studio"
  const handleTestLevelInStudio = (levelToTest: LevelCurriculum) => {
    setSelectedLevel(levelToTest);
    setActiveView('studio');
  };

  // Navigating to level from Quest Map: ALWAYS SHOW BRIEFING/MATERI FIRST!
  const handleSelectLevel = (levelToPlay: LevelCurriculum) => {
    setSelectedLevel(levelToPlay);
    // Requirement 2: Tambahkan materi sebelum masuk ke praktek/studio ide
    setActiveView('briefing');
  };

  return (
    <div className="min-h-screen bg-[#080a0f] text-[#e2e8f0] flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* Top Navbar */}
      <Navbar
        user={currentUser}
        activeView={activeView === 'auth' ? 'landing' : activeView}
        onNavigate={(view) => {
          if (view === 'studio') {
            // When studio is clicked from navbar, show briefing first if not already in studio
            setActiveView('briefing');
          } else {
            setActiveView(view);
          }
        }}
        onOpenInventory={() => setIsInventoryOpen(true)}
        onOpenAchievements={() => setIsAchievementsOpen(true)}
        onLogout={handleLogout}
        onOpenAuth={() => {
          setAuthTab('login');
          setActiveView('auth');
        }}
        onOpenRegister={() => {
          setAuthTab('register');
          setActiveView('auth');
        }}
        selectedLanguage={selectedLanguage}
        onToggleLanguage={(lang) => setSelectedLanguage(lang)}
      />

      {/* Main View Area */}
      <main className="flex-1">
        {activeView === 'landing' ? (
          <LandingPage
            onStartQuest={() => {
              if (currentUser) {
                setActiveView('home');
              } else {
                handleStartTrial();
              }
            }}
            onOpenDemoStudio={() => {
              if (!currentUser) {
                setCurrentUser(createTrialGuestUser());
              }
              setSelectedLevel(levels[0]);
              // Per requirement: Show materi before practice
              setActiveView('briefing');
            }}
            onOpenAdminLogin={() => {
              setAuthTab('admin');
              setActiveView('auth');
            }}
          />
        ) : activeView === 'auth' || !currentUser ? (
          <AuthPage
            onLoginSuccess={handleLoginSuccess}
            onRegisterStudent={handleRegisterStudent}
            onStartTrial={handleStartTrial}
            initialTab={authTab}
          />
        ) : activeView === 'home' ? (
          <HomeDashboard
            user={currentUser}
            selectedLanguage={selectedLanguage}
            onSelectLanguage={(lang) => setSelectedLanguage(lang)}
            onSelectLevel={handleSelectLevel}
            onOpenInventory={() => setIsInventoryOpen(true)}
            onOpenAchievements={() => setIsAchievementsOpen(true)}
            onOpenAdmin={() => setActiveView('admin')}
            onOpenRegister={() => {
              setAuthTab('register');
              setActiveView('auth');
            }}
          />
        ) : activeView === 'briefing' ? (
          /* Requirement 2: Materi Teori & Briefing Quest sebelum masuk Studio IDE */
          <PreStudioBriefing
            level={selectedLevel}
            user={currentUser}
            selectedLanguage={selectedLanguage}
            onSelectLanguage={(lang) => setSelectedLanguage(lang)}
            onStartCoding={() => {
              handleUpdateGameStats({ briefingsRead: 1 });
              setActiveView('studio');
            }}
            onBackToMap={() => setActiveView('home')}
          />
        ) : activeView === 'studio' ? (
          /* Requirement 1 & 3: Studio IDE and Game simulation */
          <Studio
            level={selectedLevel}
            user={currentUser}
            selectedLanguage={selectedLanguage}
            onSelectLanguage={(lang) => setSelectedLanguage(lang)}
            onCompleteLevel={handleCompleteLevel}
            onSelectLevel={handleSelectLevel}
            onBackToMap={() => setActiveView('home')}
            onOpenTheory={() => setActiveView('briefing')}
            onOpenAchievements={() => setIsAchievementsOpen(true)}
            onUpdateStats={handleUpdateGameStats}
            onOpenRegister={() => {
              setAuthTab('register');
              setActiveView('auth');
            }}
          />
        ) : activeView === 'admin' ? (
          /* Admin Dashboard & Student Approvals */
          <AdminDashboard
            user={currentUser}
            levels={levels}
            onUpdateLevel={handleUpdateLevel}
            onTestLevelInStudio={handleTestLevelInStudio}
            studentsList={studentsList}
            onApproveStudent={handleApproveStudent}
            onRejectStudent={handleRejectStudent}
          />
        ) : (
          <CurriculumSchemaView />
        )}
      </main>

      {/* Inventory & Vault Modal */}
      {currentUser && (
        <InventoryModal
          user={currentUser}
          isOpen={isInventoryOpen}
          onClose={() => setIsInventoryOpen(false)}
        />
      )}

      {/* Dedicated Achievements Vault Panel */}
      {currentUser && (
        <AchievementsPanel
          user={currentUser}
          isOpen={isAchievementsOpen}
          onClose={() => setIsAchievementsOpen(false)}
          onClaimReward={handleClaimReward}
          onClaimAllRewards={handleClaimAllRewards}
        />
      )}

      {/* Achievement Unlocked Pop-up Toast */}
      {currentUser && (
        <AchievementToast
          achievement={unlockedToastAchievement}
          onClose={() => setUnlockedToastAchievement(null)}
          onOpenPanel={() => {
            setUnlockedToastAchievement(null);
            setIsAchievementsOpen(true);
          }}
        />
      )}

      {/* Footer with exact Copyright */}
      <footer className="border-t border-slate-900 bg-[#06080d] py-6 px-4 lg:px-8 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="font-fantasy text-slate-300 font-bold">CodeQuest</span>
            <span aria-hidden="true">·</span>
            <span>Interactive Educational RPG Coding Platform</span>
            <span aria-hidden="true">·</span>
            <span className="text-amber-400 font-bold font-code">@Copyright by. Pak GuruAI</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <button
              onClick={() => setActiveView('landing')}
              className="hover:text-amber-400 transition-colors"
            >
              Tentang Kursus
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setActiveView('schema')}
              className="hover:text-amber-400 transition-colors"
            >
              Curriculum Schemas
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => {
                if (currentUser?.role === 'admin') {
                  setActiveView('admin');
                } else {
                  setAuthTab('admin');
                  setActiveView('auth');
                }
              }}
              className="hover:text-cyan-400 transition-colors"
            >
              Portal Pengajar
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
