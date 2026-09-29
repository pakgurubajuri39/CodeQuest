import React, { useState, useEffect } from 'react';
import {
  UserProfile,
  Achievement,
  AchievementCategory,
  AchievementTier
} from '../../types/game';
import {
  ALL_ACHIEVEMENTS,
  getAchievementProgress
} from '../../data/achievements';
import { sound } from '../../utils/audio';
import {
  Trophy,
  X,
  Sparkles,
  Flame,
  Zap,
  Crown,
  Code2,
  Terminal,
  Languages,
  Swords,
  ShieldAlert,
  Star,
  BookOpen,
  CheckCircle2,
  Lock,
  Gift,
  Check,
  Filter
} from 'lucide-react';

interface AchievementsPanelProps {
  user: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onClaimReward: (achievement: Achievement) => void;
  onClaimAllRewards: (unclaimed: Achievement[]) => void;
}

export const AchievementsPanel: React.FC<AchievementsPanelProps> = ({
  user,
  isOpen,
  onClose,
  onClaimReward,
  onClaimAllRewards
}) => {
  const [selectedCategory, setSelectedCategory] = useState<AchievementCategory | 'all'>('all');
  const [filterUnlockedOnly, setFilterUnlockedOnly] = useState<'all' | 'unlocked' | 'locked'>('all');

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Calculate overall stats
  const totalAchievements = ALL_ACHIEVEMENTS.length;
  const unlockedAchievements = ALL_ACHIEVEMENTS.filter((ach) => {
    const { isUnlocked } = getAchievementProgress(ach, user);
    return isUnlocked;
  });

  const unclaimedAchievements = unlockedAchievements.filter((ach) => {
    const record = user.achievements?.[ach.id];
    return !record || record.claimed === false;
  });

  const completionPercentage = Math.round((unlockedAchievements.length / totalAchievements) * 100);

  // Filtered achievements list
  const filteredList = ALL_ACHIEVEMENTS.filter((ach) => {
    const matchesCategory = selectedCategory === 'all' || ach.category === selectedCategory;
    const { isUnlocked } = getAchievementProgress(ach, user);

    if (filterUnlockedOnly === 'unlocked') return matchesCategory && isUnlocked;
    if (filterUnlockedOnly === 'locked') return matchesCategory && !isUnlocked;
    return matchesCategory;
  });

  // Render achievement icon
  const renderIcon = (iconName: string, tier: AchievementTier, isUnlocked: boolean) => {
    const iconClass = isUnlocked ? 'w-6 h-6' : 'w-6 h-6 text-slate-500';
    switch (iconName) {
      case 'Flame': return <Flame className={isUnlocked ? 'w-6 h-6 text-orange-400' : iconClass} />;
      case 'Zap': return <Zap className={isUnlocked ? 'w-6 h-6 text-amber-400' : iconClass} />;
      case 'Crown': return <Crown className={isUnlocked ? 'w-6 h-6 text-purple-400' : iconClass} />;
      case 'Code2': return <Code2 className={isUnlocked ? 'w-6 h-6 text-cyan-400' : iconClass} />;
      case 'Terminal': return <Terminal className={isUnlocked ? 'w-6 h-6 text-amber-400' : iconClass} />;
      case 'Languages': return <Languages className={isUnlocked ? 'w-6 h-6 text-indigo-400' : iconClass} />;
      case 'Swords': return <Swords className={isUnlocked ? 'w-6 h-6 text-rose-400' : iconClass} />;
      case 'ShieldAlert': return <ShieldAlert className={isUnlocked ? 'w-6 h-6 text-red-400' : iconClass} />;
      case 'Star': return <Star className={isUnlocked ? 'w-6 h-6 text-amber-400' : iconClass} />;
      case 'BookOpen': return <BookOpen className={isUnlocked ? 'w-6 h-6 text-emerald-400' : iconClass} />;
      default: return <Trophy className={isUnlocked ? 'w-6 h-6 text-amber-400' : iconClass} />;
    }
  };

  const getTierBadge = (tier: AchievementTier) => {
    switch (tier) {
      case 'mythic':
        return <span className="text-[10px] font-bold uppercase tracking-wider font-code text-purple-400">Mythic</span>;
      case 'gold':
        return <span className="text-[10px] font-bold uppercase tracking-wider font-code text-amber-400">Gold</span>;
      case 'silver':
        return <span className="text-[10px] font-bold uppercase tracking-wider font-code text-cyan-400">Silver</span>;
      default:
        return <span className="text-[10px] font-bold uppercase tracking-wider font-code text-orange-400">Bronze</span>;
    }
  };

  const getTierStyles = (tier: AchievementTier, isUnlocked: boolean) => {
    if (!isUnlocked) {
      return {
        cardBg: 'bg-[#0a0e17]/80 border-slate-800/80 hover:border-slate-700/80',
        iconBg: 'bg-slate-900 border-slate-800 text-slate-500',
        progressBar: 'bg-slate-700'
      };
    }

    switch (tier) {
      case 'mythic':
        return {
          cardBg: 'bg-gradient-to-br from-[#180a29]/90 to-[#0e071a]/90 border-purple-500/50 shadow-lg shadow-purple-500/10',
          iconBg: 'bg-purple-950/80 border-purple-600/70',
          progressBar: 'bg-gradient-to-r from-purple-500 to-indigo-500'
        };
      case 'gold':
        return {
          cardBg: 'bg-gradient-to-br from-[#241706]/90 to-[#120c03]/90 border-amber-500/60 shadow-lg shadow-amber-500/10',
          iconBg: 'bg-amber-950/80 border-amber-600/70',
          progressBar: 'bg-gradient-to-r from-amber-500 to-yellow-400'
        };
      case 'silver':
        return {
          cardBg: 'bg-gradient-to-br from-[#071926]/90 to-[#040e17]/90 border-cyan-500/50 shadow-lg shadow-cyan-500/10',
          iconBg: 'bg-cyan-950/80 border-cyan-600/70',
          progressBar: 'bg-gradient-to-r from-cyan-500 to-blue-500'
        };
      default:
        return {
          cardBg: 'bg-gradient-to-br from-[#1e1008]/90 to-[#100904]/90 border-orange-500/50 shadow-lg shadow-orange-500/10',
          iconBg: 'bg-orange-950/80 border-orange-600/70',
          progressBar: 'bg-gradient-to-r from-orange-500 to-amber-500'
        };
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="bg-[#080c14] border border-slate-800 rounded-3xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden relative"
        role="dialog"
        aria-modal="true"
        aria-labelledby="achievements-title"
      >
        {/* Ambient background glows */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Panel Header */}
        <div className="relative z-10 px-6 sm:px-8 pt-6 pb-5 border-b border-slate-800/90 flex flex-col gap-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shadow-inner">
                <Trophy className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <h2 id="achievements-title" className="text-xl sm:text-2xl font-black text-white font-fantasy tracking-tight">
                  Prestasi & Pencapaian Ksatria
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Lacak tonggak petualangan melampaui level: streak harian, penguasaan kode, dan penaklukan dungeon.
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
              aria-label="Tutup panel prestasi"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Master Progress Bar & Claim All Action */}
          <div className="bg-[#0b101c] border border-slate-800/80 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="w-full sm:w-2/3 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-semibold font-fantasy flex items-center gap-2">
                  <span>Tingkat Penyelesaian Galeri Prestasi</span>
                  <span className="text-amber-400 font-bold font-code">{completionPercentage}%</span>
                </span>
                <span className="text-slate-400 font-code text-[11px]">
                  {unlockedAchievements.length} dari {totalAchievements} Piala Terbuka
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-cyan-400 transition-all duration-500 rounded-full shadow-sm"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
            </div>

            {/* Claim all button or total count */}
            <div className="w-full sm:w-auto flex items-center justify-end gap-3 shrink-0">
              {unclaimedAchievements.length > 0 ? (
                <button
                  onClick={() => {
                    sound.playAchievement();
                    onClaimAllRewards(unclaimedAchievements);
                  }}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-300 hover:brightness-110 shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 text-xs font-fantasy"
                >
                  <Gift className="w-4 h-4" />
                  <span>Klaim Semua ({unclaimedAchievements.length})</span>
                </button>
              ) : (
                <div className="text-xs text-slate-400 font-code flex items-center gap-1.5 bg-slate-900/60 px-3 py-2 rounded-xl border border-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Semua Hadiah Terbuka Telah Diklaim</span>
                </div>
              )}
            </div>
          </div>

          {/* Category Tabs & State Filters */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            {/* Interactive Category Segmented Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-900/80 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Semua ({totalAchievements})
              </button>
              <button
                onClick={() => setSelectedCategory('streak')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  selectedCategory === 'streak'
                    ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                🔥 Streak
              </button>
              <button
                onClick={() => setSelectedCategory('mastery')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  selectedCategory === 'mastery'
                    ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                💻 Koding
              </button>
              <button
                onClick={() => setSelectedCategory('combat')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  selectedCategory === 'combat'
                    ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                ⚔️ Tempur
              </button>
              <button
                onClick={() => setSelectedCategory('exploration')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  selectedCategory === 'exploration'
                    ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                💎 Eksplorasi
              </button>
              <button
                onClick={() => setSelectedCategory('perfection')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  selectedCategory === 'perfection'
                    ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                ⭐ Bintang
              </button>
            </div>

            {/* Filter Unlocked vs Locked */}
            <div className="flex items-center gap-1 text-xs">
              <button
                onClick={() => setFilterUnlockedOnly('all')}
                className={`px-2.5 py-1 rounded-lg border transition-colors ${
                  filterUnlockedOnly === 'all'
                    ? 'bg-slate-800 border-slate-700 text-white font-medium'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                Semua
              </button>
              <button
                onClick={() => setFilterUnlockedOnly('unlocked')}
                className={`px-2.5 py-1 rounded-lg border transition-colors ${
                  filterUnlockedOnly === 'unlocked'
                    ? 'bg-emerald-950/60 border-emerald-700/60 text-emerald-300 font-medium'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                Terbuka ({unlockedAchievements.length})
              </button>
              <button
                onClick={() => setFilterUnlockedOnly('locked')}
                className={`px-2.5 py-1 rounded-lg border transition-colors ${
                  filterUnlockedOnly === 'locked'
                    ? 'bg-slate-800 border-slate-700 text-white font-medium'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                Terkunci ({totalAchievements - unlockedAchievements.length})
              </button>
            </div>
          </div>
        </div>

        {/* Achievement Grid Scroll Area */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredList.map((ach) => {
              const { current, max, percentage, isUnlocked } = getAchievementProgress(ach, user);
              const userRecord = user.achievements?.[ach.id];
              const isClaimed = userRecord?.claimed;
              const styles = getTierStyles(ach.tier, isUnlocked);

              return (
                <div
                  key={ach.id}
                  className={`p-5 rounded-2xl border transition-all relative overflow-hidden flex flex-col justify-between gap-4 ${styles.cardBg}`}
                >
                  <div className="flex items-start gap-3.5">
                    {/* Emblem Icon */}
                    <div
                      className={`w-14 h-14 rounded-2xl border flex items-center justify-center shrink-0 shadow-inner relative ${styles.iconBg}`}
                    >
                      {renderIcon(ach.icon, ach.tier, isUnlocked)}
                      {!isUnlocked && (
                        <div className="absolute inset-0 bg-black/60 rounded-2xl flex items-center justify-center">
                          <Lock className="w-4 h-4 text-slate-400" />
                        </div>
                      )}
                    </div>

                    {/* Content Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          {getTierBadge(ach.tier)}
                          <span className="text-slate-600 text-xs">·</span>
                          <span className="text-[10px] text-slate-400 uppercase tracking-wider font-code">
                            {ach.category}
                          </span>
                        </div>

                        {/* Status Label */}
                        {isUnlocked ? (
                          <span className="text-[10px] font-bold text-emerald-400 font-code flex items-center gap-1 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/40">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Terbuka</span>
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-500 font-code flex items-center gap-1">
                            <Lock className="w-3 h-3" />
                            <span>Terkunci</span>
                          </span>
                        )}
                      </div>

                      <h3 className="text-base font-bold text-white font-fantasy mt-0.5 truncate">
                        {ach.title}
                      </h3>
                      <div className="text-xs text-amber-300/80 font-code font-medium">
                        {ach.subtitle}
                      </div>

                      <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                        {ach.description}
                      </p>

                      <p className="text-[11px] text-slate-400/80 italic mt-1.5 font-sans">
                        "{ach.loreQuote}"
                      </p>
                    </div>
                  </div>

                  {/* Bottom: Progress Bar & Claim Button */}
                  <div className="pt-3 border-t border-slate-800/80 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400 font-code text-[11px]">
                        Progres: {current} / {max} {ach.unit}
                      </span>
                      <span className="text-slate-400 font-code font-bold text-[11px]">
                        {percentage}%
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${styles.progressBar}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      {/* Reward Info */}
                      <div className="flex items-center gap-2 text-xs font-code">
                        <span className="text-cyan-400 font-semibold">+{ach.rewardXp} XP</span>
                        <span className="text-slate-600">·</span>
                        <span className="text-amber-400 font-semibold">+{ach.rewardGems} Gems</span>
                      </div>

                      {/* Claim Action */}
                      {isUnlocked && !isClaimed ? (
                        <button
                          onClick={() => {
                            sound.playAchievement();
                            onClaimReward(ach);
                          }}
                          className="px-3.5 py-1.5 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-300 hover:brightness-110 shadow-md shadow-amber-500/20 text-xs font-fantasy transition-all flex items-center gap-1.5 animate-pulse"
                        >
                          <Gift className="w-3.5 h-3.5" />
                          <span>Klaim Hadiah</span>
                        </button>
                      ) : isUnlocked && isClaimed ? (
                        <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-code">
                          <Check className="w-3.5 h-3.5" />
                          <span>Hadiah Terklaim</span>
                        </div>
                      ) : (
                        <div className="text-[11px] text-slate-500 font-code">
                          Selesaikan syarat untuk klaim
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredList.length === 0 && (
            <div className="p-12 text-center text-slate-400 bg-slate-900/30 rounded-2xl border border-slate-800">
              <Trophy className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="text-sm font-medium">Tidak ada prestasi di kategori ini.</p>
            </div>
          )}
        </div>

        {/* Panel Footer */}
        <div className="px-6 sm:px-8 py-4 bg-[#070a12] border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Prestasi disinkronkan secara real-time ke akun ksatria dan Firebase database.</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-colors"
          >
            Tutup Lemari Prestasi
          </button>
        </div>
      </div>
    </div>
  );
};
