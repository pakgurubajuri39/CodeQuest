import React from 'react';
import { X, Shield, Zap, Sparkles } from 'lucide-react';
import { UserProfile } from '../../types/game';

interface InventoryModalProps {
  user: UserProfile;
  isOpen: boolean;
  onClose: () => void;
}

export const InventoryModal: React.FC<InventoryModalProps> = ({ user, isOpen, onClose }) => {
  if (!isOpen) return null;

  const equipped = Object.values(user.equipped);

  const getRarityBadge = (rarity: string) => {
    switch (rarity) {
      case 'legendary':
        return 'text-amber-300 border-amber-500/40 bg-amber-950/40';
      case 'epic':
        return 'text-purple-300 border-purple-500/40 bg-purple-950/40';
      case 'rare':
        return 'text-cyan-300 border-cyan-500/40 bg-cyan-950/40';
      default:
        return 'text-slate-300 border-slate-700 bg-slate-800/40';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl bg-[#0d121d] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#121927]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-xl">
              🎒
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-fantasy tracking-wide">Hero Vault & Relics</h2>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span>{user.displayName}</span>
                <span aria-hidden="true">·</span>
                <span>Level {user.heroLevel} {user.heroClass}</span>
                <span aria-hidden="true">·</span>
                <span className="text-amber-400 font-code">{user.gems} Gems</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/60 transition-colors"
            aria-label="Close inventory modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Active Set Summary */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <div>
                <div className="text-sm font-semibold text-slate-200">Runic Synergy Active</div>
                <div className="text-xs text-slate-400">5/5 Ancient Relics Bound · +15% Code Execution Haste</div>
              </div>
            </div>
            <div className="flex items-center gap-2 font-code text-xs text-emerald-400 bg-emerald-950/30 px-3 py-1.5 rounded-lg border border-emerald-900/40">
              <Zap className="w-3.5 h-3.5" />
              <span>Full Attunement</span>
            </div>
          </div>

          {/* Equipped Grid */}
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-cyan-400" />
              <span>Currently Equipped Relics</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {equipped.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl bg-[#090d16] border border-slate-800/80 hover:border-slate-700 transition-all flex items-start gap-3 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-2xl shrink-0 group-hover:scale-105 transition-transform">
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-sm font-semibold text-slate-200 truncate">{item.name}</span>
                      <span className={`text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded border ${getRarityBadge(item.rarity)}`}>
                        {item.rarity}
                      </span>
                    </div>
                    <div className="text-xs text-cyan-400 font-code font-medium mb-1">{item.statBonus}</div>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{item.lore}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-[#121927] flex items-center justify-between text-xs text-slate-400">
          <span>Earn more relic upgrades by solving levels with 3-star ratings!</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
          >
            Close Vault
          </button>
        </div>
      </div>
    </div>
  );
};
