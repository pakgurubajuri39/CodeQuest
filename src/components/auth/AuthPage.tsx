import React, { useState } from 'react';
import { UserProfile, SupportedLanguage, UserRole, UserStatus } from '../../types/game';
import { DEFAULT_INVENTORY } from '../../data/curriculum';
import {
  Shield,
  Sparkles,
  User,
  Lock,
  KeyRound,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Clock,
  UserPlus,
  Compass,
  Mail,
  Play
} from 'lucide-react';
import heroAvatarImg from '../../assets/images/hero_knight_avatar_1790602268060.jpg';

interface AuthPageProps {
  onLoginSuccess: (user: UserProfile, redirectView: 'home' | 'admin') => void;
  onRegisterStudent: (user: UserProfile) => void;
  onStartTrial: () => void;
  initialTab?: 'login' | 'register' | 'admin';
}

export const AuthPage: React.FC<AuthPageProps> = ({
  onLoginSuccess,
  onRegisterStudent,
  onStartTrial,
  initialTab = 'login'
}) => {
  const [authTab, setAuthTab] = useState<'login' | 'register' | 'admin'>(initialTab);

  // Registration Form State
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regClass, setRegClass] = useState<'Knight' | 'Sorcerer' | 'Ranger'>('Knight');
  const [regLang, setRegLang] = useState<SupportedLanguage>('python');
  const [registrationSubmitted, setRegistrationSubmitted] = useState<UserProfile | null>(null);

  // Student Login Form State
  const [loginUsername, setLoginUsername] = useState('alex_arcane');
  const [loginError, setLoginError] = useState<string | null>(null);

  // Admin form state
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle New Student Registration
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const heroName = regName.trim() || 'Apprentice Hero';
    const username = (regUsername.trim() || heroName.toLowerCase().replace(/\s+/g, '_')).toLowerCase();

    const newStudent: UserProfile = {
      id: `stu_${Date.now()}`,
      username: username,
      displayName: heroName,
      email: regEmail.trim() || `${username}@student.codequest.edu`,
      role: 'student',
      status: 'pending', // PENDING APPROVAL BY ADMIN!
      registeredAt: new Date().toISOString().split('T')[0],
      avatar: regClass === 'Knight' ? '⚔️' : regClass === 'Sorcerer' ? '🔮' : '🏹',
      heroClass: regClass,
      xp: 100,
      gems: 25,
      heroLevel: 1,
      streakDays: 1,
      preferredLanguage: regLang,
      completedLevels: {},
      equipped: DEFAULT_INVENTORY,
      inventory: Object.values(DEFAULT_INVENTORY)
    };

    onRegisterStudent(newStudent);
    setRegistrationSubmitted(newStudent);
  };

  // Handle Existing Student Login
  const handleStudentLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    // Retrieve approved/pending users from localStorage or mock
    const savedStudentsRaw = localStorage.getItem('codequest_students');
    let studentList: UserProfile[] = [];
    if (savedStudentsRaw) {
      try {
        studentList = JSON.parse(savedStudentsRaw);
      } catch {
        studentList = [];
      }
    }

    const uInput = loginUsername.trim().toLowerCase();
    const matched = studentList.find(
      (s) => s.username.toLowerCase() === uInput || s.displayName.toLowerCase() === uInput
    );

    if (matched) {
      onLoginSuccess(matched, 'home');
      return;
    }

    // Default sample student (approved)
    if (uInput === 'alex_arcane' || uInput === 'alex the arcane' || uInput === 'aria') {
      const alex: UserProfile = {
        id: 'stu_alex_default',
        username: 'alex_arcane',
        displayName: 'Alex the Arcane',
        role: 'student',
        status: 'approved',
        email: 'alex@academy.edu',
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
        inventory: Object.values(DEFAULT_INVENTORY)
      };
      onLoginSuccess(alex, 'home');
      return;
    }

    setLoginError('Username tidak ditemukan. Silakan lakukan pendaftaran baru terlebih dahulu.');
  };

  // Handle Admin Login (hardcoded credentials: admin / bajuri39)
  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError(null);
    setIsSubmitting(true);

    setTimeout(() => {
      if (adminUsername.trim() === 'admin' && adminPassword === 'bajuri39') {
        const adminProfile: UserProfile = {
          id: 'admin_master',
          username: 'admin',
          displayName: 'Headmaster Bajuri (Pak GuruAI)',
          role: 'admin',
          status: 'approved',
          email: 'admin@codequest.edu',
          avatar: '👑',
          heroClass: 'Sorcerer',
          xp: 9999,
          gems: 8888,
          heroLevel: 99,
          streakDays: 365,
          preferredLanguage: 'python',
          completedLevels: {
            syntax_level_1: { stars: 3, highscore: 100, completedAt: '2026-01-01' },
            syntax_level_2: { stars: 3, highscore: 150, completedAt: '2026-01-01' },
            syntax_level_3: { stars: 3, highscore: 200, completedAt: '2026-01-01' },
            loops_level_1: { stars: 3, highscore: 220, completedAt: '2026-01-01' },
            loops_level_2: { stars: 3, highscore: 260, completedAt: '2026-01-01' },
            loops_level_3: { stars: 3, highscore: 300, completedAt: '2026-01-01' },
            var_level_1: { stars: 3, highscore: 350, completedAt: '2026-01-01' },
            var_level_2: { stars: 3, highscore: 400, completedAt: '2026-01-01' },
            var_level_3: { stars: 3, highscore: 500, completedAt: '2026-01-01' }
          },
          equipped: DEFAULT_INVENTORY,
          inventory: Object.values(DEFAULT_INVENTORY)
        };

        setIsSubmitting(false);
        onLoginSuccess(adminProfile, 'admin');
      } else {
        setIsSubmitting(false);
        setAdminError('Username atau password admin salah. Silakan periksa kembali.');
      }
    }, 300);
  };

  return (
    <div className="min-h-[calc(100vh-70px)] flex items-center justify-center p-4 py-12 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-xl relative z-10">
        {/* Trial Mode Top Banner */}
        <div className="mb-4 p-3.5 rounded-2xl bg-amber-950/40 border border-amber-500/40 flex items-center justify-between gap-3 text-xs text-amber-200">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Hanya ingin melihat-lihat? Mainkan <strong>Level 1 (Trial Mode)</strong> secara gratis!</span>
          </div>
          <button
            onClick={onStartTrial}
            className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold font-fantasy text-[11px] whitespace-nowrap transition-colors shadow"
          >
            Mulai Trial
          </button>
        </div>

        {/* Main Card */}
        <div className="bg-[#0c101a]/95 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 overflow-hidden">
          {/* Header Visual */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="relative mb-3">
              <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-amber-500/40 shadow-xl shadow-amber-500/10 p-0.5 bg-gradient-to-b from-amber-500/30 to-transparent">
                <img
                  src={heroAvatarImg}
                  alt="CodeQuest Hero Knight"
                  className="w-full h-full object-cover rounded-xl"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-slate-900 border border-slate-700 rounded-full p-1 text-[10px]">
                ⚔️
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white font-fantasy tracking-wide">
              Gerbang Akademi CodeQuest
            </h1>
            <p className="text-xs text-slate-400 max-w-md mt-1">
              Siswa baru dapat mendaftar untuk disetujui oleh Admin / Pak GuruAI sebelum mendapatkan akses penuh ke semua materi.
            </p>
          </div>

          {/* Toggle Tabs: Login Siswa | Daftar Baru | Portal Admin */}
          <div className="flex items-center p-1.5 bg-slate-900/90 rounded-xl border border-slate-800 mb-6 text-xs">
            <button
              type="button"
              onClick={() => {
                setAuthTab('login');
                setRegistrationSubmitted(null);
                setLoginError(null);
              }}
              className={`flex-1 py-2 px-2 font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                authTab === 'login'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Masuk Siswa</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthTab('register');
                setRegistrationSubmitted(null);
                setLoginError(null);
              }}
              className={`flex-1 py-2 px-2 font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                authTab === 'register'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Daftar Siswa Baru</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthTab('admin');
                setRegistrationSubmitted(null);
                setAdminError(null);
              }}
              className={`flex-1 py-2 px-2 font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                authTab === 'admin'
                  ? 'bg-cyan-600 text-white font-bold shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Portal Admin</span>
            </button>
          </div>

          {/* Registration Submitted Confirmation Screen */}
          {registrationSubmitted ? (
            <div className="p-6 rounded-2xl bg-[#090d16] border border-amber-500/50 text-center space-y-4 animate-in fade-in">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 mx-auto flex items-center justify-center text-3xl">
                ⏳
              </div>
              <div>
                <div className="text-xs uppercase font-bold text-amber-400 font-code tracking-wider">
                  Pendaftaran Berhasil Terkirim
                </div>
                <h3 className="text-xl font-bold text-white font-fantasy mt-1">
                  Menunggu Persetujuan Admin
                </h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Halo, <strong>{registrationSubmitted.displayName}</strong>! Akunmu telah tercatat dan saat ini berstatus <span className="text-amber-400 font-bold">PENDING APPROVAL</span>. Admin / Pak GuruAI akan memeriksa dan mengaktifkan akses penuh kurikulummu.
              </p>
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400 text-left space-y-1 font-code">
                <div>Nama Hero: <span className="text-slate-200 font-semibold">{registrationSubmitted.displayName}</span></div>
                <div>Username: <span className="text-slate-200 font-semibold">{registrationSubmitted.username}</span></div>
                <div>Status: <span className="text-amber-400 font-semibold">Menunggu Persetujuan (Pending)</span></div>
                <div>Hak Akses Saat Ini: <span className="text-emerald-400 font-semibold">Level 1 (Mode Uji Coba / Trial)</span></div>
              </div>
              <div className="pt-2 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => onLoginSuccess(registrationSubmitted, 'home')}
                  className="w-full py-3 rounded-xl font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 transition-colors font-fantasy text-xs flex items-center justify-center gap-2 shadow"
                >
                  <Play className="w-4 h-4 fill-slate-950" />
                  <span>Mainkan Level 1 Trial Sambil Menunggu</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setRegistrationSubmitted(null);
                    setAuthTab('login');
                  }}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  Kembali ke Halaman Masuk
                </button>
              </div>
            </div>
          ) : authTab === 'register' ? (
            /* Registration Form */
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-800/40 text-[11px] text-amber-300 flex items-start gap-2">
                <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Aturan Pendaftaran:</strong> Setelah mendaftar, akun siswa akan diverifikasi dan di-approve oleh Admin sebelum bisa membuka seluruh materi (Level 2-9). Selagi menunggu, siswa dapat memainkan Level 1 secara gratis.
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Nama Lengkap / Panggilan Hero
                </label>
                <input
                  type="text"
                  required
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="Contoh: Arya Bimasena"
                  className="w-full px-3.5 py-2.5 bg-[#111726] border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400 text-xs font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Email Siswa
                  </label>
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="nama@email.com"
                    className="w-full px-3.5 py-2.5 bg-[#111726] border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400 text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Username Login
                  </label>
                  <input
                    type="text"
                    required
                    value={regUsername}
                    onChange={(e) => setRegUsername(e.target.value)}
                    placeholder="Contoh: arya_code"
                    className="w-full px-3.5 py-2.5 bg-[#111726] border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400 text-xs font-medium font-code"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Password Akun
                </label>
                <input
                  type="password"
                  required
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Minimal 6 karakter"
                  className="w-full px-3.5 py-2.5 bg-[#111726] border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400 text-xs font-medium font-code"
                />
              </div>

              {/* Class Discipline Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Pilih Hero Discipline
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(
                    [
                      { id: 'Knight', icon: '⚔️', title: 'Knight' },
                      { id: 'Sorcerer', icon: '🔮', title: 'Sorcerer' },
                      { id: 'Ranger', icon: '🏹', title: 'Ranger' }
                    ] as const
                  ).map((cls) => (
                    <button
                      key={cls.id}
                      type="button"
                      onClick={() => setRegClass(cls.id)}
                      className={`p-2.5 rounded-xl border text-center transition-all ${
                        regClass === cls.id
                          ? 'bg-amber-950/40 border-amber-500/60 ring-1 ring-amber-500/40 text-amber-200'
                          : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="text-lg">{cls.icon}</div>
                      <div className="text-xs font-bold mt-0.5">{cls.title}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-300 hover:brightness-110 shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 font-fantasy tracking-wider text-xs mt-3"
              >
                <span>Daftar & Ajukan Akses ke Admin</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : authTab === 'login' ? (
            /* Student Login Form */
            <form onSubmit={handleStudentLogin} className="space-y-4">
              {loginError && (
                <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-800/50 text-xs text-rose-200 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>{loginError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Username Siswa atau Nama Hero
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                    placeholder="Masukkan username Anda..."
                    className="w-full px-3.5 py-3 bg-[#111726] border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400 text-xs font-medium font-code"
                  />
                  <div className="absolute right-3.5 top-3.5 text-slate-500">
                    <User className="w-4 h-4" />
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 space-y-1">
                <div>Sample siswa terdaftar yang disetujui:</div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setLoginUsername('alex_arcane')}
                    className="text-amber-400 hover:underline font-code"
                  >
                    alex_arcane (Approved)
                  </button>
                  <span aria-hidden="true">·</span>
                  <button
                    type="button"
                    onClick={() => setLoginUsername('aria')}
                    className="text-amber-400 hover:underline font-code"
                  >
                    aria (Approved)
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-300 hover:brightness-110 shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 font-fantasy tracking-wider text-xs mt-2"
              >
                <span>Masuk ke Quest Map</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setAuthTab('register')}
                  className="text-xs text-amber-400 hover:underline"
                >
                  Belum punya akun? Daftar sebagai siswa baru di sini
                </button>
              </div>
            </form>
          ) : (
            /* Admin Login Form */
            <form onSubmit={handleAdminSubmit} className="space-y-4">
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 flex items-center gap-2.5">
                <KeyRound className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Masuk dengan akun Guru / Administrator untuk mengelola kurikulum dan persetujuan siswa.</span>
              </div>

              {adminError && (
                <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-800/50 text-xs text-rose-200 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>{adminError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Username Admin
                </label>
                <input
                  type="text"
                  required
                  value={adminUsername}
                  onChange={(e) => setAdminUsername(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#111726] border border-slate-700/80 rounded-xl text-slate-100 font-code text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Password Admin
                </label>
                <input
                  type="password"
                  required
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#111726] border border-slate-700/80 rounded-xl text-slate-100 font-code text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-6 rounded-xl font-bold text-white bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 shadow-lg shadow-cyan-600/20 transition-all flex items-center justify-center gap-2 font-fantasy tracking-wider text-xs mt-2 disabled:opacity-50"
              >
                <Shield className="w-4 h-4" />
                <span>Masuk ke Dashboard Guru & Approval</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
