import React, { useState } from 'react';
import { UserProfile, SupportedLanguage } from '../../types/game';
import {
  Flame,
  Sparkles,
  Backpack,
  LogOut,
  ShieldCheck,
  Trophy,
  Database,
  Menu,
  X,
  Compass,
  Map,
  Terminal,
  BookOpen
} from 'lucide-react';

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (view: 'landing' | 'home' | 'studio' | 'admin' | 'schema' | 'briefing' | 'auth') => {
    onNavigate(view);
    setMobileMenuOpen(false);
  };

  const hasUnclaimed = user?.achievements && Object.values(user.achievements).some((a) => !a.claimed);

  return (
    <header className="sticky top-0 z-50 w-full bg-[#080b12]/95 backdrop-blur-md border-b border-slate-800/80 px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4 lg:gap-8">
        
        {/* Zone 1: Brand Wordmark (Proportional on PC, Laptop, Tablet, and Mobile) */}
        <button
          onClick={() => handleNavClick('landing')}
          className="flex items-center gap-2 group transition-transform active:scale-95 shrink-0 select-none text-left"
          title="CodeQuest Home"
        >
          <span className="text-xl sm:text-2xl drop-shadow transition-transform group-hover:scale-110">
            ⚔️
          </span>
          <span className="text-base sm:text-lg lg:text-xl font-black tracking-wider text-white font-fantasy group-hover:text-amber-400 transition-colors uppercase">
            CODEQUEST
          </span>
        </button>

        {/* Zone 2: Navigation Links (Desktop, Laptop, Large Tablet - Centered & Proportional) */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2 text-xs sm:text-sm font-medium text-slate-300">
          <button
            onClick={() => handleNavClick('landing')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeView === 'landing'
                ? 'text-amber-400 font-bold bg-amber-400/10 border border-amber-400/20 shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-900/60'
            }`}
          >
            Tentang Kursus
          </button>

          <button
            onClick={() => handleNavClick('home')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeView === 'home'
                ? 'text-amber-400 font-bold bg-amber-400/10 border border-amber-400/20 shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-900/60'
            }`}
          >
            Quest Map
          </button>

          <button
            onClick={() => handleNavClick('studio')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeView === 'studio'
                ? 'text-amber-400 font-bold bg-amber-400/10 border border-amber-400/20 shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-900/60'
            }`}
          >
            Studio IDE
          </button>

          {/* Admin-only links */}
          {user?.role === 'admin' && (
            <button
              onClick={() => handleNavClick('schema')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeView === 'schema'
                  ? 'text-amber-400 font-bold bg-amber-400/10 border border-amber-400/20 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900/60'
              }`}
            >
              <Database className="w-3.5 h-3.5 text-amber-400" />
              <span>Curriculum DB</span>
            </button>
          )}

          {user?.role === 'admin' && (
            <button
              onClick={() => handleNavClick('admin')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeView === 'admin'
                  ? 'text-cyan-400 font-bold bg-cyan-400/10 border border-cyan-400/30 shadow-sm'
                  : 'text-slate-300 hover:text-cyan-400 hover:bg-slate-900/60'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>Admin Portal</span>
            </button>
          )}
        </nav>

        {/* Zone 3: Actions, Language Switcher & HUD (Scales on all screens) */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          
          {/* Language Switcher pill toggle (visible on tablet and desktop, compact on mobile) */}
          <div className="flex items-center p-0.5 sm:p-1 bg-slate-900/90 rounded-lg border border-slate-800 text-[11px] sm:text-xs">
            <button
              onClick={() => onToggleLanguage('python')}
              className={`px-2 sm:px-2.5 py-1 rounded font-code transition-all ${
                selectedLanguage === 'python'
                  ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Ganti bahasa pemrograman ke Python"
            >
              <span className="hidden sm:inline">Python</span>
              <span className="sm:hidden">Py</span>
            </button>
            <button
              onClick={() => onToggleLanguage('javascript')}
              className={`px-2 sm:px-2.5 py-1 rounded font-code transition-all ${
                selectedLanguage === 'javascript'
                  ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Ganti bahasa pemrograman ke JavaScript"
            >
              <span className="hidden sm:inline">JavaScript</span>
              <span className="sm:hidden">JS</span>
            </button>
          </div>

          {user ? (
            /* Logged-in User HUD */
            <div className="flex items-center gap-1.5 sm:gap-2.5">
              {/* Gamification Counters (gems & streak) - hidden on narrow phones, shown on tablet/PC */}
              <div className="hidden sm:flex items-center gap-2 text-xs font-code">
                <div className="flex items-center gap-1 text-amber-400 bg-amber-950/30 px-2 py-1 rounded border border-amber-900/40" title="Gems">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span className="font-bold tabular-nums">{user.gems}</span>
                </div>
                <div className="hidden lg:flex items-center gap-1 text-orange-400 bg-orange-950/30 px-2 py-1 rounded border border-orange-900/40" title="Streak Hari">
                  <Flame className="w-3.5 h-3.5 text-orange-400" />
                  <span className="font-bold tabular-nums">{user.streakDays}d</span>
                </div>
              </div>

              {/* Inventory Button */}
              <button
                onClick={onOpenInventory}
                className="p-1.5 sm:p-2 text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 rounded-lg border border-slate-800 transition-colors"
                title="Buka Inventori Ksatria"
                aria-label="Buka Inventori Ksatria"
              >
                <Backpack className="w-4 h-4 text-amber-400" />
              </button>

              {/* Achievements Vault Button */}
              {onOpenAchievements && (
                <button
                  onClick={onOpenAchievements}
                  className="p-1.5 sm:p-2 text-slate-300 hover:text-amber-400 bg-slate-900/80 hover:bg-slate-800 rounded-lg border border-slate-800 transition-colors relative"
                  title="Buka Lemari Prestasi & Pencapaian"
                  aria-label="Buka Lemari Prestasi & Pencapaian"
                >
                  <Trophy className="w-4 h-4 text-amber-400" />
                  {hasUnclaimed && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full animate-ping" />
                  )}
                </button>
              )}

              {/* User Avatar & Logout */}
              <div className="flex items-center gap-1.5 sm:gap-2 pl-1 sm:pl-2 border-l border-slate-800">
                <div 
                  onClick={() => user.role === 'admin' ? handleNavClick('admin') : handleNavClick('home')}
                  className="cursor-pointer flex items-center gap-2"
                  title={user.displayName}
                >
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-amber-600 flex items-center justify-center text-xs sm:text-sm font-bold text-white shadow-sm">
                    {user.avatar || '⚔️'}
                  </div>
                  <div className="hidden xl:block text-left text-xs">
                    <div className="font-semibold text-slate-200 truncate max-w-[90px]">{user.displayName}</div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider">{user.role}</div>
                  </div>
                </div>

                <button
                  onClick={onLogout}
                  className="p-1.5 sm:p-2 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-rose-950/30 transition-colors"
                  title="Sign Out"
                  aria-label="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            /* Logged-out Visitor Actions: Proportional Masuk & DAFTAR */
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                onClick={onOpenAuth}
                className="px-2.5 sm:px-3.5 py-1.5 text-xs font-semibold text-slate-200 hover:text-white bg-slate-900/90 hover:bg-slate-800 rounded-lg border border-slate-700/80 transition-all whitespace-nowrap font-code shadow-sm"
              >
                Masuk
              </button>
              {onOpenRegister && (
                <button
                  onClick={onOpenRegister}
                  className="px-3 sm:px-4 py-1.5 text-xs font-black text-slate-950 bg-gradient-to-r from-amber-400 to-amber-300 hover:brightness-110 rounded-lg transition-all whitespace-nowrap shadow-md shadow-amber-500/20 font-fantasy uppercase tracking-wider"
                >
                  DAFTAR
                </button>
              )}
            </div>
          )}

          {/* Mobile & Small Tablet Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="md:hidden p-2 text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 rounded-lg border border-slate-800 transition-colors focus:outline-none focus:ring-1 focus:ring-amber-400"
            aria-label="Buka Menu Navigasi"
            title="Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-amber-400" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile & Small Tablet Slide-Down Drawer (Smooth, User-Friendly on HP & Tablet) */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 pt-3 pb-2 border-t border-slate-800/80 space-y-2 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="grid grid-cols-1 gap-1 text-sm font-medium">
            <button
              onClick={() => handleNavClick('landing')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-left transition-colors ${
                activeView === 'landing'
                  ? 'bg-amber-400/10 text-amber-400 font-bold border border-amber-400/20'
                  : 'text-slate-300 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>Tentang Kursus</span>
            </button>

            <button
              onClick={() => handleNavClick('home')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-left transition-colors ${
                activeView === 'home'
                  ? 'bg-amber-400/10 text-amber-400 font-bold border border-amber-400/20'
                  : 'text-slate-300 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <Map className="w-4 h-4 text-amber-400" />
              <span>Quest Map</span>
            </button>

            <button
              onClick={() => handleNavClick('studio')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-left transition-colors ${
                activeView === 'studio'
                  ? 'bg-amber-400/10 text-amber-400 font-bold border border-amber-400/20'
                  : 'text-slate-300 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <Terminal className="w-4 h-4 text-cyan-400" />
              <span>Studio IDE</span>
            </button>

            {user?.role === 'admin' && (
              <button
                onClick={() => handleNavClick('schema')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-left transition-colors ${
                  activeView === 'schema'
                    ? 'bg-amber-400/10 text-amber-400 font-bold border border-amber-400/20'
                    : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                }`}
              >
                <Database className="w-4 h-4 text-amber-400" />
                <span>Curriculum DB</span>
              </button>
            )}

            {user?.role === 'admin' && (
              <button
                onClick={() => handleNavClick('admin')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-left transition-colors ${
                  activeView === 'admin'
                    ? 'bg-cyan-400/10 text-cyan-400 font-bold border border-cyan-400/30'
                    : 'text-slate-300 hover:bg-slate-900 hover:text-cyan-400'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span>Admin Portal</span>
              </button>
            )}
          </div>

          {/* Mobile Profile & Gamification Stats summary if logged in */}
          {user && (
            <div className="pt-2 mt-2 border-t border-slate-800/80 flex items-center justify-between text-xs font-code px-2">
              <div className="flex items-center gap-2">
                <span className="text-amber-400 font-bold">💎 {user.gems} Gems</span>
                <span className="text-slate-600">·</span>
                <span className="text-orange-400 font-bold">🔥 {user.streakDays}d Streak</span>
              </div>
              <div className="text-slate-400 truncate max-w-[120px]">
                {user.displayName}
              </div>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

