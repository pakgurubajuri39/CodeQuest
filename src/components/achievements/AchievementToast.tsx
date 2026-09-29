import React, { useEffect, useState } from 'react';
import { Achievement } from '../../types/game';
import { Trophy, Sparkles, X, ChevronRight, Crown, Flame, Zap, Code2, Terminal, Languages, Swords, ShieldAlert, Star, BookOpen } from 'lucide-react';
import { sound } from '../../utils/audio';

interface AchievementToastProps {
  achievement: Achievement | null;
  onClose: () => void;
  onOpenPanel: () => void;
}

export const AchievementToast: React.FC<AchievementToastProps> = ({
  achievement,
  onClose,
  onOpenPanel
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (achievement) {
      setIsVisible(true);
      sound.playAchievement();

      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300);
      }, 6000);

      return () => clearTimeout(timer);
    }
  }, [achievement, onClose]);

  if (!achievement) return null;

  const getTierColors = (tier: string) => {
    switch (tier) {
      case 'mythic':
        return {
          border: 'border-purple-500/70',
          bg: 'bg-gradient-to-r from-[#170a24] to-[#0c0818]',
          glow: 'shadow-purple-500/30',
          text: 'text-purple-300',
          badge: 'bg-purple-950/80 text-purple-300 border-purple-800'
        };
      case 'gold':
        return {
          border: 'border-amber-400/80',
          bg: 'bg-gradient-to-r from-[#211504] to-[#0f0b04]',
          glow: 'shadow-amber-500/30',
          text: 'text-amber-300',
          badge: 'bg-amber-950/80 text-amber-300 border-amber-800'
        };
      case 'silver':
        return {
          border: 'border-cyan-400/70',
          bg: 'bg-gradient-to-r from-[#061824] to-[#060c14]',
          glow: 'shadow-cyan-500/30',
          text: 'text-cyan-300',
          badge: 'bg-cyan-950/80 text-cyan-300 border-cyan-800'
        };
      default:
        return {
          border: 'border-orange-500/60',
          bg: 'bg-gradient-to-r from-[#1c0f08] to-[#0e0906]',
          glow: 'shadow-orange-500/25',
          text: 'text-orange-300',
          badge: 'bg-orange-950/80 text-orange-300 border-orange-800'
        };
    }
  };

  const colors = getTierColors(achievement.tier);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Flame': return <Flame className="w-5 h-5 text-orange-400" />;
      case 'Zap': return <Zap className="w-5 h-5 text-amber-400" />;
      case 'Crown': return <Crown className="w-5 h-5 text-purple-400" />;
      case 'Code2': return <Code2 className="w-5 h-5 text-cyan-400" />;
      case 'Terminal': return <Terminal className="w-5 h-5 text-amber-400" />;
      case 'Languages': return <Languages className="w-5 h-5 text-indigo-400" />;
      case 'Swords': return <Swords className="w-5 h-5 text-red-400" />;
      case 'ShieldAlert': return <ShieldAlert className="w-5 h-5 text-rose-400" />;
      case 'Star': return <Star className="w-5 h-5 text-amber-400" />;
      case 'BookOpen': return <BookOpen className="w-5 h-5 text-emerald-400" />;
      default: return <Trophy className="w-5 h-5 text-amber-400" />;
    }
  };

  return (
    <div
      role="alert"
      className={`fixed bottom-6 right-6 z-50 max-w-sm w-full p-4 rounded-2xl border ${colors.border} ${colors.bg} shadow-2xl ${colors.glow} backdrop-blur-xl transition-all duration-300 transform ${
        isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-4 opacity-0 scale-95 pointer-events-none'
      }`}
    >
      <div className="flex items-start gap-3.5">
        <div className="w-12 h-12 rounded-xl bg-slate-900/90 border border-slate-700/80 flex items-center justify-center shrink-0 shadow-inner">
          {getIcon(achievement.icon)}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider font-code text-amber-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Prestasi Terbuka!</span>
            </span>
            <button
              onClick={() => {
                setIsVisible(false);
                setTimeout(onClose, 300);
              }}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800/60 transition-colors"
              aria-label="Tutup notifikasi prestasi"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <h4 className="text-sm font-bold text-white font-fantasy truncate mt-0.5">
            {achievement.title}
          </h4>
          <p className="text-xs text-slate-300 leading-snug line-clamp-2 mt-0.5">
            {achievement.description}
          </p>

          <div className="flex items-center justify-between pt-2.5 mt-2 border-t border-slate-800/80">
            <div className="flex items-center gap-2 text-xs font-code">
              <span className="text-cyan-300 font-semibold">+{achievement.rewardXp} XP</span>
              <span className="text-slate-600">·</span>
              <span className="text-amber-300 font-semibold">+{achievement.rewardGems} Gems</span>
            </div>

            <button
              onClick={() => {
                setIsVisible(false);
                onOpenPanel();
              }}
              className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 font-fantasy transition-colors"
            >
              <span>Lihat Detail</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
