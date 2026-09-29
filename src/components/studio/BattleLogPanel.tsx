import React, { useState, useEffect, useRef } from 'react';
import { BattleLogEntry } from '../../types/game';
import {
  Swords,
  ShieldAlert,
  Flame,
  Zap,
  Skull,
  Heart,
  Sparkles,
  Trash2,
  ArrowDownCircle,
  Filter,
  Activity,
  AlertTriangle
} from 'lucide-react';

interface BattleLogPanelProps {
  logs: BattleLogEntry[];
  isExecuting: boolean;
  onClear: () => void;
  heroHp: number;
  maxHeroHp?: number;
}

export const BattleLogPanel: React.FC<BattleLogPanelProps> = ({
  logs,
  isExecuting,
  onClear,
  heroHp,
  maxHeroHp = 100
}) => {
  const [filter, setFilter] = useState<'all' | 'combat' | 'damage'>('all');
  const [autoScroll, setAutoScroll] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to bottom as new actions arrive
  useEffect(() => {
    if (autoScroll && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [logs, autoScroll]);

  // Compute live combat stats
  const damageDealt = logs
    .filter((l) => l.actor === 'hero' && l.damage)
    .reduce((sum, l) => sum + (l.damage || 0), 0);

  const damageTaken = logs
    .filter((l) => (l.actor === 'enemy' || l.actor === 'trap') && l.damage)
    .reduce((sum, l) => sum + (l.damage || 0), 0);

  const enemiesDefeated = logs.filter((l) => l.actionType === 'defeat').length;

  // Filter logs based on selection
  const filteredLogs = logs.filter((log) => {
    if (filter === 'combat') {
      return log.actionType === 'attack' || log.actionType === 'retaliate' || log.actionType === 'defeat';
    }
    if (filter === 'damage') {
      return (log.damage && log.damage > 0) || log.actionType === 'trap';
    }
    return true;
  });

  return (
    <div className="bg-[#070a12] border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col">
      {/* Panel Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-[#0a0f1c] border-b border-slate-800 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-rose-500/20 border border-rose-500/40 flex items-center justify-center">
            <Swords className="w-4 h-4 text-rose-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white font-fantasy tracking-wide">
                Real-Time Battle Log
              </span>
              {isExecuting ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-code font-bold bg-rose-950/80 text-rose-400 border border-rose-800/80 animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                  LIVE COMBAT
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-code text-slate-400 bg-slate-900 border border-slate-800">
                  <Activity className="w-3 h-3 text-slate-500" />
                  READY
                </span>
              )}
            </div>
            <p className="text-[10px] text-slate-400">
              Lacak setiap serangan ksatria dan respon balasan monster secara instan.
            </p>
          </div>
        </div>

        {/* Action Controls & Filters */}
        <div className="flex items-center gap-2">
          {/* Filter segment tabs */}
          <div className="flex items-center bg-slate-950 rounded-lg p-0.5 border border-slate-800 text-[11px]">
            <button
              onClick={() => setFilter('all')}
              className={`px-2.5 py-1 rounded transition-colors ${
                filter === 'all'
                  ? 'bg-amber-400 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Semua ({logs.length})
            </button>
            <button
              onClick={() => setFilter('combat')}
              className={`px-2.5 py-1 rounded transition-colors ${
                filter === 'combat'
                  ? 'bg-amber-400 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              ⚔️ Tempur
            </button>
            <button
              onClick={() => setFilter('damage')}
              className={`px-2.5 py-1 rounded transition-colors ${
                filter === 'damage'
                  ? 'bg-amber-400 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              💥 Kerusakan
            </button>
          </div>

          {/* Autoscroll toggle */}
          <button
            onClick={() => setAutoScroll((prev) => !prev)}
            className={`p-1.5 rounded-lg border transition-colors ${
              autoScroll
                ? 'bg-cyan-950/50 border-cyan-800 text-cyan-300'
                : 'bg-slate-900 border-slate-800 text-slate-500'
            }`}
            title={autoScroll ? 'Auto-scroll aktif' : 'Auto-scroll dijeda'}
            aria-label="Toggle Auto-scroll"
          >
            <ArrowDownCircle className="w-3.5 h-3.5" />
          </button>

          {/* Clear Log */}
          <button
            onClick={onClear}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-rose-400 border border-slate-800 transition-colors"
            title="Bersihkan Log Pertempuran"
            aria-label="Bersihkan Log Pertempuran"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Combat Scoreboard Mini-Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 px-3 sm:px-4 py-2 bg-[#090d18] border-b border-slate-800/80 text-[11px] font-code">
        <div className="flex items-center gap-1.5 text-slate-300">
          <Heart className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-slate-400">Hero HP:</span>
          <span className={`font-bold ${heroHp < 40 ? 'text-rose-400' : 'text-emerald-400'}`}>
            {heroHp}/{maxHeroHp}
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-slate-300">
          <Zap className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-slate-400">Dmg Diberikan:</span>
          <span className="text-cyan-300 font-bold tabular-nums">+{damageDealt}</span>
        </div>

        <div className="flex items-center gap-1.5 text-slate-300">
          <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
          <span className="text-slate-400">Dmg Diterima:</span>
          <span className="text-rose-400 font-bold tabular-nums">-{damageTaken}</span>
        </div>

        <div className="flex items-center gap-1.5 text-slate-300">
          <Skull className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-slate-400">Musuh Tumbang:</span>
          <span className="text-amber-400 font-bold tabular-nums">{enemiesDefeated}</span>
        </div>
      </div>

      {/* Scrollable Battle Logs Feed */}
      <div
        ref={scrollContainerRef}
        className="p-3.5 space-y-2 max-h-56 min-h-[140px] overflow-y-auto font-code text-xs select-text scroll-smooth"
      >
        {filteredLogs.length === 0 ? (
          <div className="h-28 flex flex-col items-center justify-center text-slate-500 gap-1.5 text-center">
            <Swords className="w-6 h-6 text-slate-600 animate-pulse" />
            <span className="text-xs">
              Belum ada riwayat pertempuran. Klik <strong>"Cast Code / Run"</strong> untuk memulai eksekusi mantra.
            </span>
          </div>
        ) : (
          filteredLogs.map((log) => {
            const isHero = log.actor === 'hero';
            const isEnemy = log.actor === 'enemy';
            const isTrap = log.actor === 'trap';
            const isDefeat = log.actionType === 'defeat';

            let cardStyles = 'bg-slate-900/60 border-slate-800/80 text-slate-300';
            let actorBadge = 'bg-slate-800 text-slate-300';

            if (isDefeat) {
              cardStyles = 'bg-gradient-to-r from-amber-950/40 to-slate-900/80 border-amber-500/50 text-amber-200';
              actorBadge = 'bg-amber-950 text-amber-300 border border-amber-700/60';
            } else if (isHero && log.actionType === 'attack') {
              cardStyles = 'bg-gradient-to-r from-cyan-950/30 to-slate-900/80 border-cyan-500/40 text-cyan-100';
              actorBadge = 'bg-cyan-950 text-cyan-300 border border-cyan-800/60';
            } else if (isEnemy && log.actionType === 'retaliate') {
              cardStyles = 'bg-gradient-to-r from-rose-950/40 to-slate-900/80 border-rose-500/50 text-rose-200';
              actorBadge = 'bg-rose-950 text-rose-300 border border-rose-800/60';
            } else if (isTrap) {
              cardStyles = 'bg-gradient-to-r from-orange-950/40 to-slate-900/80 border-orange-500/40 text-orange-200';
              actorBadge = 'bg-orange-950 text-orange-300 border border-orange-800/60';
            }

            return (
              <div
                key={log.id}
                className={`p-2.5 rounded-xl border flex items-start justify-between gap-3 transition-all ${cardStyles}`}
              >
                <div className="flex items-start gap-2.5 min-w-0 flex-1">
                  {/* Action Icon / Avatar */}
                  <div className="mt-0.5 shrink-0">
                    {isDefeat ? (
                      <Skull className="w-4 h-4 text-amber-400" />
                    ) : isHero && log.actionType === 'attack' ? (
                      <Swords className="w-4 h-4 text-cyan-400" />
                    ) : isEnemy && log.actionType === 'retaliate' ? (
                      <ShieldAlert className="w-4 h-4 text-rose-400" />
                    ) : isTrap ? (
                      <AlertTriangle className="w-4 h-4 text-orange-400" />
                    ) : log.actionType === 'gem' ? (
                      <Sparkles className="w-4 h-4 text-rose-400" />
                    ) : (
                      <Activity className="w-4 h-4 text-slate-400" />
                    )}
                  </div>

                  {/* Main text and round info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[10px] text-slate-500 font-bold uppercase">
                        Aksi #{log.turn}
                      </span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold uppercase ${actorBadge}`}>
                        {log.actorName}
                      </span>
                      {log.line && (
                        <span className="text-[10px] text-slate-500">
                          Baris {log.line}
                        </span>
                      )}
                    </div>
                    <p className="leading-snug text-xs break-words">{log.text}</p>
                  </div>
                </div>

                {/* Right Badge: Damage or HP Tag */}
                <div className="shrink-0 flex flex-col items-end gap-1">
                  {log.damage !== undefined && log.damage > 0 && (
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded border ${
                        isEnemy || isTrap
                          ? 'bg-rose-950/80 text-rose-300 border-rose-800'
                          : 'bg-cyan-950/80 text-cyan-300 border-cyan-800'
                      }`}
                    >
                      {isEnemy || isTrap ? `-${log.damage} HP Hero` : `-${log.damage} HP Musuh`}
                    </span>
                  )}
                  {log.enemyHp !== undefined && (
                    <span className="text-[10px] text-slate-400">
                      Musuh HP: {Math.max(0, log.enemyHp)}/{log.enemyMaxHp || 100}
                    </span>
                  )}
                  <span className="text-[9px] text-slate-500 tabular-nums">
                    {log.timestamp}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
