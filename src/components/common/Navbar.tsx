import React from 'react';
import { UserProfile, SupportedLanguage } from '../../types/game';
import { Flame, Sparkles, Backpack, LogOut, ShieldCheck, Trophy, Database } from 'lucide-react';

interface NavbarProps {
  user: UserProfile | null;
  activeView: 'landing' | 'home' | 'studio' | 'admin' | 'schema' | 'briefing' | 'auth';
  onNavigate: (view: 'landing' | 'home' | 'studio' | 'admin' | 'schema' | 'briefing' | 'auth') => void;
  onOpenInventory: () => void;
  onOpenAchievements?: () => void;
  onLogout: () => void;
  onOpenAuth: () => void;
  onOpenRegister?: () => void;
  selectedLanguage: SupportedLanguage;
  onToggleLanguage: (lang: SupportedLanguage) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  activeView,
  onNavigate,
  onOpenInventory,
  onOpenAchievements,
  onLogout,
  onOpenAuth,
  onOpenRegister,
  selectedLanguage,
  onToggleLanguage
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#080b12]/90 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => onNavigate('landing')}
          className="text-xl font-black tracking-tight text-white font-fantasy hover:text-amber-400 transition-colors shrink-0 flex items-center gap-2"
        >
          <span className="text-amber-400 text-2xl">⚔️</span>
          <span>CodeQuest</span>
        </button>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <button
            onClick={() => onNavigate('landing')}
            className={`transition-colors hover:text-white ${activeView === 'landing' ? 'text-amber-400 font-semibold' : ''}`}
          >
            Tentang Kursus
          </button>
          <button
            onClick={() => onNavigate('home')}
            className={`transition-colors hover:text-white ${activeView === 'home' ? 'text-amber-400 font-semibold' : ''}`}
          >
            Quest Map
          </button>
          <button
            onClick={() => onNavigate('studio')}
            className={`transition-colors hover:text-white ${activeView === 'studio' ? 'text-amber-400 font-semibold' : ''}`}
          >
            Studio IDE
          </button>
          {user?.role === 'admin' && (
            <button
              onClick={() => onNavigate('schema')}
              className={`transition-colors hover:text-white flex items-center gap-1.5 ${activeView === 'schema' ? 'text-amber-400 font-semibold' : 'text-slate-300'}`}
            >
              <Database className="w-3.5 h-3.5 text-amber-400" />
              <span>Curriculum DB</span>
            </button>
          )}
          {user?.role === 'admin' && (
            <button
              onClick={() => onNavigate('admin')}
              className={`transition-colors hover:text-cyan-400 flex items-center gap-1.5 ${activeView === 'admin' ? 'text-cyan-400 font-semibold' : 'text-slate-300'}`}
            >
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>Admin Portal</span>
            </button>
          )}
        </nav>

        {/* Zone 3: 1-2 primary actions & User HUD */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Language Switcher pill toggle */}
          <div className="flex items-center p-1 bg-slate-900 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => onToggleLanguage('python')}
              className={`px-2.5 py-1 rounded font-code transition-colors ${
                selectedLanguage === 'python'
                  ? 'bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Python
            </button>
            <button
              onClick={() => onToggleLanguage('javascript')}
              className={`px-2.5 py-1 rounded font-code transition-colors ${
                selectedLanguage === 'javascript'
                  ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              JavaScript
            </button>
          </div>

          {user ? (
            <div className="flex items-center gap-3">
              {/* Trial or Pending Status indicators */}
              {user.status === 'trial' && onOpenRegister && (
                <button
                  onClick={onOpenRegister}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold font-fantasy text-xs transition-colors shadow-sm"
                >
                  <span>Daftar Siswa</span>
                </button>
              )}
              {user.status === 'pending' && (
                <span className="hidden sm:inline-block px-2.5 py-1 rounded bg-amber-950/60 border border-amber-500/50 text-[10px] font-bold text-amber-300 font-code">
                  ⏳ Menunggu Approval
                </span>
              )}

              {/* Gamification Counters */}
              <div className="hidden sm:flex items-center gap-3 text-xs font-code">
                <div className="flex items-center gap-1 text-amber-400 bg-amber-950/30 px-2 py-1 rounded border border-amber-900/40">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span className="font-semibold tabular-nums">{user.gems}</span>
                </div>
                <div className="flex items-center gap-1 text-orange-400 bg-orange-950/30 px-2 py-1 rounded border border-orange-900/40">
                  <Flame className="w-3.5 h-3.5 text-orange-400" />
                  <span className="font-semibold tabular-nums">{user.streakDays}d</span>
                </div>
              </div>

              {/* Inventory Button */}
              <button
                onClick={onOpenInventory}
                className="p-2 text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 rounded-lg border border-slate-800 transition-colors"
                title="Buka Inventori Ksatria"
                aria-label="Buka Inventori Ksatria"
              >
                <Backpack className="w-4 h-4 text-amber-400" />
              </button>

              {/* Achievements Vault Button */}
              {onOpenAchievements && (
                <button
                  onClick={onOpenAchievements}
                  className="p-2 text-slate-300 hover:text-amber-400 bg-slate-900/80 hover:bg-slate-800 rounded-lg border border-slate-800 transition-colors relative"
                  title="Buka Lemari Prestasi & Pencapaian Ksatria"
                  aria-label="Buka Lemari Prestasi & Pencapaian Ksatria"
                >
                  <Trophy className="w-4 h-4 text-amber-400" />
                  {user.achievements && Object.values(user.achievements).some((a) => !a.claimed) && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full animate-ping" />
                  )}
                </button>
              )}

              {/* User Avatar & Logout */}
              <div className="flex items-center gap-2 pl-1 border-l border-slate-800">
                <div 
                  onClick={() => user.role === 'admin' ? onNavigate('admin') : onNavigate('home')}
                  className="cursor-pointer flex items-center gap-2"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-amber-600 flex items-center justify-center text-sm font-bold text-white shadow-sm">
                    {user.avatar || '⚔️'}
                  </div>
                  <div className="hidden lg:block text-left text-xs">
                    <div className="font-semibold text-slate-200 truncate max-w-[100px]">{user.displayName}</div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider">{user.role}</div>
                  </div>
                </div>

                <button
                  onClick={onLogout}
                  className="p-2 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-rose-950/30 transition-colors"
                  title="Sign Out"
                  aria-label="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenAuth}
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 rounded-lg border border-slate-700/80 transition-colors whitespace-nowrap font-code"
              >
                Masuk
              </button>
              {onOpenRegister && (
                <button
                  onClick={onOpenRegister}
                  className="px-3.5 py-1.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors whitespace-nowrap shadow-md shadow-amber-500/20 font-fantasy"
                >
                  Daftar
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
