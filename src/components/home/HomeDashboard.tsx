import React, { useState } from 'react';
import { UserProfile, LevelCurriculum, SupportedLanguage } from '../../types/game';
import { REALMS_DATA, ALL_LEVELS } from '../../data/curriculum';
import { ALL_ACHIEVEMENTS, getAchievementProgress } from '../../data/achievements';
import {
  Play,
  Sparkles,
  Star,
  Lock,
  CheckCircle2,
  ChevronRight,
  BookOpen,
  ShieldCheck,
  Flame,
  AlertCircle,
  Clock,
  UserPlus,
  Compass,
  Trophy,
  Crown,
  X
} from 'lucide-react';
import worldMapImg from '../../assets/images/codequest_world_map_1790602253800.jpg';

interface HomeDashboardProps {
  user: UserProfile;
  selectedLanguage: SupportedLanguage;
  onSelectLanguage: (lang: SupportedLanguage) => void;
  onSelectLevel: (level: LevelCurriculum) => void;
  onOpenInventory: () => void;
  onOpenAchievements?: () => void;
  onOpenAdmin: () => void;
  onOpenRegister: () => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  user,
  selectedLanguage,
  onSelectLanguage,
  onSelectLevel,
  onOpenInventory,
  onOpenAchievements,
  onOpenAdmin,
  onOpenRegister
}) => {
  // Modal for locked trial levels
  const [lockedLevelPrompt, setLockedLevelPrompt] = useState<LevelCurriculum | null>(null);

  const isFullAccess = user.role === 'admin' || user.status === 'approved';

  // Find current active/unlocked level
  const firstIncompleteLevel = ALL_LEVELS.find((l) => !user.completedLevels[l.id]) || ALL_LEVELS[0];

  const totalLevels = ALL_LEVELS.length;
  const completedCount = Object.keys(user.completedLevels).length;
  const progressPercent = Math.min(100, Math.round((completedCount / totalLevels) * 100));

  const handleLevelClick = (level: LevelCurriculum, isUnlocked: boolean) => {
    // If not full access (trial or pending approval), only Level 1 is accessible!
    if (!isFullAccess && level.order > 1) {
      setLockedLevelPrompt(level);
      return;
    }

    if (isUnlocked || user.role === 'admin') {
      onSelectLevel(level);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-10 animate-in fade-in duration-200">
      {/* Trial / Pending Notification Banner */}
      {!isFullAccess && (
        <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-lg">
          <div className="flex items-start sm:items-center gap-3">
            {user.status === 'pending' ? (
              <Clock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5 sm:mt-0 animate-pulse" />
            ) : (
              <Compass className="w-5 h-5 text-amber-400 shrink-0 mt-0.5 sm:mt-0" />
            )}
            <div>
              <div className="font-bold text-amber-200 font-fantasy text-sm">
                {user.status === 'pending'
                  ? 'Status Akun: Menunggu Persetujuan Admin'
                  : 'Mode Uji Coba (Trial Mode) - 1 Materi Terbuka'}
              </div>
              <p className="text-slate-300 mt-0.5">
                {user.status === 'pending'
                  ? 'Pendaftaran Anda sedang ditinjau oleh Admin / Pak GuruAI. Selagi menunggu, Anda dapat mempelajari Level 1 (The Crypt Corridor).'
                  : 'Hanya Level 1 yang terbuka untuk uji coba. Daftarkan akun Anda dan tunggu persetujuan Admin untuk membuka semua 9 materi!'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {user.status !== 'pending' && (
              <button
                onClick={onOpenRegister}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold font-fantasy text-xs transition-colors flex items-center gap-1.5 shadow"
              >
                <UserPlus className="w-4 h-4" />
                <span>Daftar Siswa Baru</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* 1. Gamification Bar */}
      <section className="bg-[#0e1320]/80 backdrop-blur-md border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* User Profile Quick Info */}
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-600 to-indigo-600 p-0.5 shadow-lg shadow-amber-500/10">
              <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center text-2xl">
                {user.avatar}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white font-fantasy">{user.displayName}</h2>
                <span className="text-xs text-amber-400 font-code font-semibold px-2 py-0.5 rounded bg-amber-950/40 border border-amber-900/40">
                  Level {user.heroLevel}
                </span>
                {user.role === 'admin' ? (
                  <span className="text-[10px] uppercase font-bold tracking-wider text-cyan-400 bg-cyan-950/50 px-2 py-0.5 rounded border border-cyan-800/40">
                    Admin
                  </span>
                ) : user.status === 'pending' ? (
                  <span className="text-[10px] uppercase font-bold tracking-wider text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/50">
                    Pending Approval
                  </span>
                ) : user.status === 'approved' ? (
                  <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-300 bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-800/40">
                    Akses Penuh
                  </span>
                ) : (
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-300 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                    Trial Mode
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                <span>{user.heroClass}</span>
                <span aria-hidden="true">·</span>
                <span>{completedCount} of {totalLevels} Quests Cleared ({progressPercent}%)</span>
              </div>
            </div>
          </div>

          {/* Gamification Stats */}
          <div className="flex items-center gap-4 sm:gap-6 font-code text-xs">
            <div className="flex flex-col gap-1 min-w-[120px]">
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>Arcane XP</span>
                <span className="text-cyan-400 font-bold tabular-nums">{user.xp} XP</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (user.xp % 1000) / 10)}%` }}
                />
              </div>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-950/30 border border-amber-800/40 text-amber-300">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="font-bold tabular-nums text-sm">{user.gems}</span>
              <span className="text-[10px] text-amber-400/80 uppercase">Gems</span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-950/30 border border-orange-800/40 text-orange-300">
              <Flame className="w-4 h-4 text-orange-400" />
              <span className="font-bold tabular-nums text-sm">{user.streakDays}</span>
              <span className="text-[10px] text-orange-400/80 uppercase">Streak</span>
            </div>

            {/* Achievements Trophy Button */}
            {onOpenAchievements && (
              <button
                onClick={onOpenAchievements}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-950/30 hover:bg-amber-900/40 border border-amber-800/40 hover:border-amber-500/60 text-amber-300 transition-colors"
                title="Buka Lemari Prestasi & Pencapaian Ksatria"
              >
                <Trophy className="w-4 h-4 text-amber-400" />
                <span className="font-bold tabular-nums text-sm">
                  {Object.keys(user.achievements || {}).length}
                </span>
                <span className="text-[10px] text-amber-400/80 uppercase">Piala</span>
              </button>
            )}

            <button
              onClick={onOpenInventory}
              className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700/80 hover:border-amber-400/60 transition-colors text-slate-200"
            >
              <span className="text-base">{user.equipped.weapon.icon}</span>
              <span className="text-xs font-semibold">{user.equipped.weapon.name}</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. Hero Banner Section */}
      <section className="relative rounded-3xl overflow-hidden border border-slate-800 bg-[#0c101a] shadow-2xl">
        <div className="relative h-72 sm:h-96 w-full overflow-hidden">
          <img
            src={worldMapImg}
            alt="CodeQuest Overworld Map"
            className="w-full h-full object-cover object-center transform scale-105 hover:scale-100 transition-transform duration-1000"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080b12] via-[#080b12]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#080b12] via-[#080b12]/40 to-transparent" />

          <div className="absolute bottom-6 sm:bottom-10 left-6 sm:left-10 right-6 max-w-2xl">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs uppercase font-bold tracking-widest text-amber-400 bg-amber-950/60 border border-amber-800/60 px-2.5 py-1 rounded">
                Dark Fantasy Coding RPG
              </span>
              <span className="text-xs text-slate-300">
                · {isFullAccess ? 'Akses Penuh Aktif' : 'Mode Trial (Level 1 Bebas Akses)'}
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white font-fantasy tracking-tight mb-3 drop-shadow-md">
              Peta Petualangan Kurikulum
            </h1>
            <p className="text-sm sm:text-base text-slate-300 mb-6 leading-relaxed drop-shadow">
              Pilih quest untuk membaca ringkasan materi dan instruksi sebelum masuk ke Studio IDE.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => {
                  const targetLvl = !isFullAccess ? ALL_LEVELS[0] : firstIncompleteLevel;
                  onSelectLevel(targetLvl);
                }}
                className="px-6 py-3 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 hover:brightness-110 shadow-lg shadow-amber-500/25 transition-all flex items-center gap-2 font-fantasy text-sm"
              >
                <Play className="w-4 h-4 fill-slate-950" />
                <span>
                  {!isFullAccess
                    ? 'Mulai Materi 1 (Trial): The Crypt Corridor'
                    : `Lanjutkan Quest: ${firstIncompleteLevel.title}`}
                </span>
              </button>

              <div className="flex items-center gap-1.5 p-1 bg-slate-900/90 backdrop-blur-md rounded-xl border border-slate-700">
                <button
                  onClick={() => onSelectLanguage('python')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg font-code transition-all ${
                    selectedLanguage === 'python'
                      ? 'bg-amber-500 text-slate-950 font-bold shadow'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  🐍 Python 3
                </button>
                <button
                  onClick={() => onSelectLanguage('javascript')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg font-code transition-all ${
                    selectedLanguage === 'javascript'
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  ⚡ JavaScript
                </button>
              </div>

              {user.role === 'admin' && (
                <button
                  onClick={onOpenAdmin}
                  className="px-4 py-3 rounded-xl text-xs font-bold text-cyan-300 bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-800/60 transition-all flex items-center gap-2 font-fantasy"
                >
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  <span>Portal Persetujuan & Admin</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 2.5 Achievements Showcase Section */}
      <section className="bg-[#0b0f1a] border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-5 mb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              <h3 className="text-lg sm:text-xl font-bold text-white font-fantasy">
                Prestasi & Gelar Kehormatan Ksatria
              </h3>
            </div>
            <p className="text-xs text-slate-400">
              Lacak kemajuan melampaui level: streak disiplin harian, efisiensi kode, dan penaklukan dungeon.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-xs font-code text-slate-300">
              <span className="text-amber-400 font-bold">{Object.keys(user.achievements || {}).length}</span> / {ALL_ACHIEVEMENTS.length} Terbuka
            </div>

            {onOpenAchievements && (
              <button
                onClick={onOpenAchievements}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-300 hover:brightness-110 shadow-md shadow-amber-500/20 transition-all flex items-center gap-1.5 font-fantasy"
              >
                <Trophy className="w-3.5 h-3.5" />
                <span>Buka Lemari Piala</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* 4 Featured Achievements Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {ALL_ACHIEVEMENTS.slice(0, 4).map((ach) => {
            const { percentage, isUnlocked } = getAchievementProgress(ach, user);
            return (
              <div
                key={ach.id}
                onClick={onOpenAchievements}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                  isUnlocked
                    ? 'bg-amber-950/20 border-amber-500/40 hover:border-amber-400/70 shadow-sm'
                    : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border text-base ${
                    isUnlocked
                      ? 'bg-amber-950/80 border-amber-600/70 text-amber-300'
                      : 'bg-slate-900 border-slate-800 text-slate-500'
                  }`}
                >
                  {isUnlocked ? '🏆' : '🔒'}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between text-[10px] font-code">
                    <span className={isUnlocked ? 'text-amber-300 font-bold' : 'text-slate-400'}>
                      {ach.title}
                    </span>
                    <span className="text-slate-400">{percentage}%</span>
                  </div>
                  <div className="text-[11px] text-slate-400 truncate mt-0.5">
                    {ach.subtitle}
                  </div>
                  <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800 mt-2">
                    <div
                      className={`h-full rounded-full transition-all ${
                        isUnlocked ? 'bg-amber-400' : 'bg-slate-700'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. World Map Progress Tracker: 3 Core Realms */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white font-fantasy tracking-wide">
              World Map Progress Tracker
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              {!isFullAccess
                ? 'Mode Trial: Hanya Level 1 yang terbuka. Daftarkan akun Anda untuk persetujuan admin membuka Level 2-9.'
                : 'Pilih level untuk membaca briefing materi dan masuk ke Studio IDE.'}
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-code text-slate-400">
            <span className="flex items-center gap-1 text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" /> Selesai
            </span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1 text-amber-400">
              <Star className="w-3.5 h-3.5 fill-amber-400" /> Bintang 3
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {REALMS_DATA.map((realm) => {
            const realmCompletedLevels = realm.levels.filter((l) => user.completedLevels[l.id]);

            return (
              <div
                key={realm.id}
                className="bg-[#0b0e17] border border-slate-800 rounded-2xl overflow-hidden flex flex-col shadow-xl transition-all hover:border-slate-700 group"
              >
                <div className={`p-5 bg-gradient-to-b ${realm.colorScheme} border-b border-slate-800/80`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{realm.icon}</span>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-black/40 text-amber-300 border border-amber-500/20 font-code">
                      {realm.badge}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white font-fantasy tracking-wide">
                    {realm.name}
                  </h3>
                  <div className="text-xs text-slate-300 font-medium">{realm.subtitle}</div>
                  <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                    {realm.description}
                  </p>
                </div>

                <div className="p-5 flex-1 space-y-3 bg-[#0c101a]">
                  {realm.levels.map((level, idx) => {
                    const progress = user.completedLevels[level.id];
                    const isCompleted = Boolean(progress);
                    const isPreviousCompleted = idx === 0 || Boolean(user.completedLevels[realm.levels[idx - 1].id]);

                    // Trial rule: Level 1 is always unlocked for trial. Level 2+ requires isFullAccess!
                    const isTrialLocked = !isFullAccess && level.order > 1;
                    const isUnlocked = !isTrialLocked && (level.order === 1 || isPreviousCompleted || isCompleted);

                    return (
                      <div
                        key={level.id}
                        onClick={() => handleLevelClick(level, isUnlocked)}
                        className={`p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                          isUnlocked || level.order === 1
                            ? 'bg-slate-900/60 border-slate-800 hover:border-amber-500/60 hover:bg-slate-800/60 cursor-pointer group/item'
                            : isTrialLocked
                            ? 'bg-amber-950/20 border-amber-900/40 hover:border-amber-500/50 cursor-pointer'
                            : 'bg-slate-950/40 border-slate-900 opacity-60 cursor-not-allowed'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 ${
                              isCompleted
                                ? 'bg-emerald-950/60 border border-emerald-800 text-emerald-400'
                                : isUnlocked
                                ? 'bg-amber-950/60 border border-amber-800 text-amber-400'
                                : isTrialLocked
                                ? 'bg-amber-950/40 border border-amber-700/60 text-amber-400'
                                : 'bg-slate-800 text-slate-500 border border-slate-700'
                            }`}
                          >
                            {isCompleted ? (
                              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                            ) : isTrialLocked ? (
                              <Lock className="w-4 h-4 text-amber-400" />
                            ) : isUnlocked ? (
                              <span className="font-code">{level.order}</span>
                            ) : (
                              <Lock className="w-4 h-4 text-slate-500" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-semibold text-slate-200 truncate group-hover/item:text-amber-300 transition-colors flex items-center gap-1.5">
                              <span>{level.title}</span>
                              {level.order === 1 && !isFullAccess && (
                                <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                                  Trial
                                </span>
                              )}
                              {isTrialLocked && (
                                <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-950 text-amber-400 border border-amber-800 font-code">
                                  Kunci Siswa
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-400 truncate">
                              {level.victoryConditions.loreObjective}
                            </div>
                          </div>
                        </div>

                        {/* Stars or Status */}
                        <div className="flex items-center gap-1 shrink-0">
                          {isCompleted ? (
                            <div className="flex items-center">
                              {[1, 2, 3].map((s) => (
                                <Star
                                  key={s}
                                  className={`w-3.5 h-3.5 ${
                                    s <= (progress?.stars || 1)
                                      ? 'text-amber-400 fill-amber-400'
                                      : 'text-slate-700'
                                  }`}
                                />
                              ))}
                            </div>
                          ) : isUnlocked || level.order === 1 ? (
                            <button className="px-2.5 py-1 text-[11px] font-bold text-amber-300 bg-amber-950/40 border border-amber-800/50 rounded-lg group-hover/item:bg-amber-500 group-hover/item:text-slate-950 transition-colors font-code flex items-center gap-1">
                              <span>Materi</span>
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          ) : isTrialLocked ? (
                            <span className="text-[10px] text-amber-400 font-code flex items-center gap-1">
                              <Lock className="w-3 h-3" />
                              <span>Terkunci</span>
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-600 font-code uppercase">Locked</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="px-5 py-3 border-t border-slate-800/80 bg-[#090c14] flex items-center justify-between text-xs text-slate-400">
                  <span>Progres: {realmCompletedLevels.length} / {realm.levels.length} Selesai</span>
                  <span className="font-code text-amber-400/90 font-medium">
                    +{realm.levels.reduce((acc, l) => acc + l.rewardXp, 0)} Total XP
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Trial Locked Prompt Modal */}
      {lockedLevelPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-[#0d121e] border-2 border-amber-500/50 rounded-3xl p-6 sm:p-7 shadow-2xl text-center space-y-5 relative overflow-hidden">
            <button
              onClick={() => setLockedLevelPrompt(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/40 mx-auto flex items-center justify-center text-amber-400 text-3xl shadow-lg">
              <Lock className="w-8 h-8" />
            </div>

            <div>
              <span className="text-[11px] font-code uppercase font-bold tracking-wider text-amber-400 bg-amber-950/60 px-2.5 py-1 rounded border border-amber-800/50">
                Materi Terkunci
              </span>
              <h3 className="text-xl font-bold text-white font-fantasy mt-2">
                {lockedLevelPrompt.title}
              </h3>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {user.status === 'pending' ? (
                <>
                  Pendaftaran akunmu atas nama <strong>{user.displayName}</strong> sedang dalam antrean persetujuan oleh <strong>Admin / Pak GuruAI</strong>. Setelah disetujui, semua level akan langsung terbuka!
                </>
              ) : (
                <>
                  Kamu saat ini berada dalam <strong>Mode Uji Coba (Trial Mode)</strong> yang hanya membuka <strong>1 Materi (Level 1)</strong>. Untuk melanjutkan dan membuka 9 materi lengkap, silakan daftar sebagai siswa baru.
                </>
              )}
            </p>

            <div className="space-y-2 pt-2">
              {user.status !== 'pending' ? (
                <button
                  onClick={() => {
                    setLockedLevelPrompt(null);
                    onOpenRegister();
                  }}
                  className="w-full py-3 px-4 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-300 hover:brightness-110 shadow-lg shadow-amber-500/25 transition-all flex items-center justify-center gap-2 font-fantasy text-xs"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Daftar Siswa Baru Sekarang</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    setLockedLevelPrompt(null);
                    onOpenAdmin();
                  }}
                  className="w-full py-3 px-4 rounded-xl font-bold text-white bg-cyan-600 hover:bg-cyan-500 transition-colors flex items-center justify-center gap-2 font-fantasy text-xs shadow-lg"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Cek Antrean di Portal Admin</span>
                </button>
              )}

              <button
                onClick={() => {
                  setLockedLevelPrompt(null);
                  onSelectLevel(ALL_LEVELS[0]);
                }}
                className="w-full py-2.5 text-xs font-semibold text-slate-300 bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors font-code"
              >
                Mainkan Materi 1 (Trial Mode)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
