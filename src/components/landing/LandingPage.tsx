import React from 'react';
import {
  Sparkles,
  Play,
  ShieldCheck,
  CheckCircle2,
  Terminal,
  Zap,
  BookOpen,
  Trophy,
  ArrowRight,
  Flame,
  Star,
  Users,
  Compass
} from 'lucide-react';
import worldMapImg from '../../assets/images/codequest_world_map_1790602253800.jpg';
import heroAvatarImg from '../../assets/images/hero_knight_avatar_1790602268060.jpg';
import ogreImg from '../../assets/images/ogre_guardian_monster_1790602280292.jpg';

interface LandingPageProps {
  onStartQuest: () => void;
  onOpenDemoStudio: () => void;
  onOpenAdminLogin: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartQuest,
  onOpenDemoStudio,
  onOpenAdminLogin
}) => {
  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* 1. Hero Section */}
      <section className="relative pt-6 sm:pt-12 px-4 lg:px-8 max-w-7xl mx-auto">
        <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-[#0c101a] shadow-2xl p-6 sm:p-12 lg:p-16">
          {/* Ambient Glowing Blobs */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-bold tracking-widest text-amber-400 bg-amber-950/60 border border-amber-800/60 px-3 py-1 rounded-full flex items-center gap-1.5 font-code">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Platform Belajar Coding Fantasy RPG</span>
                </span>
                <span className="hidden sm:inline-block text-xs text-slate-400">
                  Python 3 & JavaScript ES6
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white font-fantasy tracking-tight leading-[1.15]">
                Tinggalkan Tutorial Membosankan. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-cyan-400">
                  Kuasai Coding Lewat Game RPG!
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed">
                CodeQuest mengubah baris kode menjadi mantra sihir sungguhan. Kendalikan ksatriamu, pecahkan teka-teki dungeon interaktif, dan taklukkan monster bos dengan logika pemrograman nyata.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={onStartQuest}
                  className="px-7 py-3.5 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 hover:brightness-110 shadow-xl shadow-amber-500/25 transition-all flex items-center gap-2.5 font-fantasy text-sm"
                >
                  <Play className="w-4 h-4 fill-slate-950" />
                  <span>Mulai Petualangan Gratis</span>
                </button>

                <button
                  onClick={onOpenDemoStudio}
                  className="px-6 py-3.5 rounded-xl font-semibold text-slate-200 bg-slate-900/90 hover:bg-slate-800 border border-slate-700 hover:border-amber-400/50 transition-all flex items-center gap-2 text-sm font-code"
                >
                  <Terminal className="w-4 h-4 text-cyan-400" />
                  <span>Coba Demo Studio IDE</span>
                </button>

                <button
                  onClick={onOpenAdminLogin}
                  className="text-xs text-slate-400 hover:text-cyan-400 flex items-center gap-1 transition-colors pl-1 font-medium"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Portal Pengajar & Admin</span>
                </button>
              </div>

              {/* Social Proof Stats */}
              <div className="pt-6 border-t border-slate-800/80 grid grid-cols-3 gap-4">
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-white font-fantasy tabular-nums">1,250+</div>
                  <div className="text-xs text-slate-400 mt-0.5">Siswa Lulus Quest</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-amber-400 font-fantasy tabular-nums">98.4%</div>
                  <div className="text-xs text-slate-400 mt-0.5">Paham Logika Kode</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-cyan-400 font-fantasy tabular-nums">100%</div>
                  <div className="text-xs text-slate-400 mt-0.5">Praktek Tanpa Teori Kering</div>
                </div>
              </div>
            </div>

            {/* Right Visual Art Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden border-2 border-amber-500/30 shadow-2xl bg-slate-950 group">
                <img
                  src={worldMapImg}
                  alt="CodeQuest Overworld Map"
                  className="w-full h-80 sm:h-96 object-cover transform group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c101a] via-transparent to-transparent" />

                {/* Floating In-Game Snippet Badge */}
                <div className="absolute bottom-4 left-4 right-4 p-3.5 rounded-xl bg-slate-950/90 border border-slate-800/90 backdrop-blur-md flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg overflow-hidden border border-amber-500/40 shrink-0">
                    <img src={heroAvatarImg} alt="Hero Avatar" className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-bold text-slate-200">Ksatria Syntax</span>
                      <span className="text-[10px] text-emerald-400 font-code font-semibold">● Live Engine</span>
                    </div>
                    <div className="text-[11px] font-code text-amber-300 truncate">
                      hero.attack() → Ogre defeated!
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Core Value Proposition: Mengapa Belajar di CodeQuest? */}
      <section className="px-4 lg:px-8 max-w-7xl mx-auto space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="text-xs uppercase font-bold tracking-widest text-cyan-400 font-code">
            Metode Pembelajaran Revolusioner
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white font-fantasy tracking-tight">
            Mengapa CodeQuest Berbeda?
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            Metode tradisional menuntut menghafal sintaksis tanpa visualisasi. Di CodeQuest, kamu memecahkan masalah komputasi secara alami melalui aksi di arena game.
          </p>
        </div>

        {/* 4 Feature Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-[#0c101a] border border-slate-800 hover:border-amber-500/50 transition-all flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                ⚔️
              </div>
              <h3 className="text-lg font-bold text-white font-fantasy">
                Learn by Playing
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Setiap baris kode yang kamu ketik langsung menggerakkan ksatriamu di atas kanvas 2D, memungut rubi, dan menyerang musuh dengan animasi pertempuran nyata.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-800/80 text-[11px] font-code text-amber-400 flex items-center gap-1">
              <span>Sintaksis visual langsung</span>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#0c101a] border border-slate-800 hover:border-cyan-500/50 transition-all flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                🐍⚡
              </div>
              <h3 className="text-lg font-bold text-white font-fantasy">
                Dua Bahasa Industri
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Kuasai Python 3 (bahasa utama AI, Machine Learning, dan Data) dan JavaScript (bahasa dasar web interaktif dan game), bebas beralih kapan saja!
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-800/80 text-[11px] font-code text-cyan-400 flex items-center gap-1">
              <span>Python & JavaScript</span>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#0c101a] border border-slate-800 hover:border-purple-500/50 transition-all flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                🔮
              </div>
              <h3 className="text-lg font-bold text-white font-fantasy">
                Pesan Error Ramah Pemula
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Tak perlu takut error! Scribe Penasihat Sihir mendeteksi kesalahan huruf besar/kecil, kurung yang lupa ditutup, dan indentasi dengan petunjuk yang mudah dipahami.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-800/80 text-[11px] font-code text-purple-400 flex items-center gap-1">
              <span>Tips perbaikan otomatis</span>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#0c101a] border border-slate-800 hover:border-emerald-500/50 transition-all flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                💎
              </div>
              <h3 className="text-lg font-bold text-white font-fantasy">
                Gamifikasi Penuh
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Raih bintang 3 untuk kode paling efisien, kumpulkan Soul Gems, buka relik legendaris di Hero Vault, dan pertahankan streak belajar harianmu.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-800/80 text-[11px] font-code text-emerald-400 flex items-center gap-1">
              <span>XP, Gems & Relics</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Curriculum Roadmap: 3 Core Realms */}
      <section className="px-4 lg:px-8 max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="text-xs uppercase font-bold tracking-widest text-amber-400 font-code">
              Peta Pembelajaran Komprehensif
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white font-fantasy tracking-wide mt-1">
              3 Realm Pembelajaran Bertahap
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Dari pemula mutlak tanpa pengalaman koding hingga menguasai algoritma bersyarat dan pertarungan bos.
            </p>
          </div>
          <button
            onClick={onStartQuest}
            className="text-xs font-semibold text-amber-400 hover:text-amber-300 font-code flex items-center gap-1 transition-colors self-start sm:self-auto"
          >
            <span>Jelajahi Semua 9 Quest</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Realm 1 */}
          <div className="p-6 rounded-2xl bg-[#0d121e] border border-cyan-900/40 relative overflow-hidden flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-3xl">🏰</span>
                <span className="text-[10px] font-code uppercase font-bold text-cyan-300 bg-cyan-950/60 px-2.5 py-1 rounded border border-cyan-800/50">
                  Realm 1
                </span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white font-fantasy">Dungeon of Syntax</h3>
                <div className="text-xs text-cyan-400 font-medium">Dasar Pergerakan & Sekuensi</div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Pelajari konsep dasar program komputer: kode dieksekusi baris-per-baris dari atas ke bawah. Kuasai pemanggilan method seperti `hero.moveRight()` dan `hero.attack()`.
              </p>
              <div className="space-y-1.5 pt-2">
                <div className="text-[11px] text-slate-400 flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Level 1: The Crypt Corridor</span>
                </div>
                <div className="text-[11px] text-slate-400 flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Level 2: Chamber of the Ruby</span>
                </div>
                <div className="text-[11px] text-slate-400 flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Level 3: Sentry's Gate</span>
                </div>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] font-code text-cyan-300">
              Konsep: Sequencing · Parameters · Case Sensitivity
            </div>
          </div>

          {/* Realm 2 */}
          <div className="p-6 rounded-2xl bg-[#0d121e] border border-emerald-900/40 relative overflow-hidden flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-3xl">🌲</span>
                <span className="text-[10px] font-code uppercase font-bold text-emerald-300 bg-emerald-950/60 px-2.5 py-1 rounded border border-emerald-800/50">
                  Realm 2
                </span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white font-fantasy">Forest of Loops</h3>
                <div className="text-xs text-emerald-400 font-medium">Perulangan & Otomatisasi DRY</div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Hentikan mengetik kode berulang kali! Gunakan perulangan `for` dan `while` untuk membersihkan jalur dan mengumpulkan deretan permata dengan beberapa baris ringkas.
              </p>
              <div className="space-y-1.5 pt-2">
                <div className="text-[11px] text-slate-400 flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Level 4: Whispering Woods</span>
                </div>
                <div className="text-[11px] text-slate-400 flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Level 5: Grove of Repetition</span>
                </div>
                <div className="text-[11px] text-slate-400 flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Level 6: Treant's Clearing</span>
                </div>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] font-code text-emerald-300">
              Konsep: For Loops · Range() · While Loops · DRY
            </div>
          </div>

          {/* Realm 3 */}
          <div className="p-6 rounded-2xl bg-[#0d121e] border border-amber-900/40 relative overflow-hidden flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-3xl">⛰️</span>
                <span className="text-[10px] font-code uppercase font-bold text-amber-300 bg-amber-950/60 px-2.5 py-1 rounded border border-amber-800/50">
                  Realm 3
                </span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white font-fantasy">Mountain of Variables</h3>
                <div className="text-xs text-amber-400 font-medium">Variabel & Logika If / Else</div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Simpan status di variabel, buat keputusan dinamis dengan percabangan `if/else`, dan gabungkan semua keterampilanmu untuk mengalahkan Mountain Ogre Warlord!
              </p>
              <div className="space-y-1.5 pt-2">
                <div className="text-[11px] text-slate-400 flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>Level 7: Crystal Crags</span>
                </div>
                <div className="text-[11px] text-slate-400 flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>Level 8: Sentinel's Gate</span>
                </div>
                <div className="text-[11px] text-slate-400 flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>Level 9: The Ogre's Summit</span>
                </div>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] font-code text-amber-300">
              Konsep: Variables · If/Else Decisions · Boss Battles
            </div>
          </div>
        </div>
      </section>

      {/* 4. Live Coding Preview: Apa Rasanya Menulis Kode di Studio? */}
      <section className="px-4 lg:px-8 max-w-7xl mx-auto">
        <div className="p-8 sm:p-12 rounded-3xl bg-[#090d16] border border-slate-800 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-5">
              <span className="text-xs font-code font-bold uppercase tracking-wider text-amber-400 bg-amber-950/40 px-3 py-1 rounded border border-amber-800/40">
                Pengalaman Belajar Interaktif
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-white font-fantasy tracking-tight">
                Bukan Sekadar Menulis Teks, Ini Pertarungan Kode.
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Di CodeQuest Studio, kamu memiliki editor kode lengkap dengan pelengkap sintaks otomatis, tombol eksekusi rune mantra, indikator langkah aktif, dan konsol feedback langsung.
              </p>
              <div className="space-y-2 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Syntax highlighting resmi untuk Python dan JavaScript</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Pengatur kecepatan simulasi (1x, 2x, 4x) untuk pengujian cepat</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Bisa diakses dari browser mana saja tanpa instalasi compiler rumit</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={onOpenDemoStudio}
                  className="px-6 py-3 rounded-xl font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 transition-colors flex items-center gap-2 font-fantasy text-xs shadow-lg shadow-amber-500/20"
                >
                  <Play className="w-4 h-4 fill-slate-950" />
                  <span>Buka Studio IDE Sekarang</span>
                </button>
              </div>
            </div>

            {/* Code Box Graphic */}
            <div className="lg:col-span-6 bg-[#06080e] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
              <div className="px-4 py-3 bg-[#0d121e] border-b border-slate-800 flex items-center justify-between text-xs font-code text-slate-400">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="ml-2 text-slate-300 font-semibold">spell_boss_battle.py</span>
                </div>
                <span className="text-amber-400 font-medium">Python 3</span>
              </div>
              <div className="p-4 sm:p-5 font-code text-xs sm:text-sm text-slate-200 leading-relaxed overflow-x-auto">
                <div className="text-slate-500"># Pendekatan dan kalahkan Mountain Ogre</div>
                <div className="text-cyan-300">hero.moveRight(3)</div>
                <br />
                <div className="text-slate-500"># Serang dua kali menggunakan Runic Spellblade</div>
                <div className="text-purple-400">for strike in range(2):</div>
                <div className="text-amber-300 pl-4">hero.attack()</div>
                <br />
                <div className="text-slate-500"># Menuju portal kemenangan</div>
                <div className="text-cyan-300">hero.moveRight(3)</div>
                <div className="text-emerald-400 mt-2 font-semibold"># VICTORY: 3 Stars Earned! ★★★</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Testimonial Siswa & Pendidik */}
      <section className="px-4 lg:px-8 max-w-7xl mx-auto space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <div className="text-xs uppercase font-bold tracking-widest text-amber-400 font-code">
            Kisah Sukses Siswa
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white font-fantasy tracking-tight">
            Apa Kata Mereka yang Sudah Mencoba?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-[#0c101a] border border-slate-800 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex text-amber-400">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed italic">
                "Dulu setiap kali belajar coding di sekolah rasanya pusing dan cepat bosan. Di CodeQuest, rasanya seperti main game puzzle RPG sungguhan. Konsep loop langsung nyangkut di kepala!"
              </p>
            </div>
            <div className="flex items-center gap-3 pt-3 border-t border-slate-800/80">
              <div className="w-9 h-9 rounded-full bg-amber-500/20 flex items-center justify-center text-base">
                🧝‍♀️
              </div>
              <div>
                <div className="text-xs font-bold text-white">Aria Silverleaf</div>
                <div className="text-[10px] text-slate-400">Siswa Kelas 10 · Level 8 Sage</div>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#0c101a] border border-slate-800 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex text-amber-400">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed italic">
                "Sebagai guru informatika, CodeQuest sangat membantu membuat murid antusias. Tidak ada lagi siswa yang mengantuk saat membahas algoritma dan percabangan if/else."
              </p>
            </div>
            <div className="flex items-center gap-3 pt-3 border-t border-slate-800/80">
              <div className="w-9 h-9 rounded-full bg-cyan-500/20 flex items-center justify-center text-base">
                👨‍🏫
              </div>
              <div>
                <div className="text-xs font-bold text-white">Pak Guru Hendra</div>
                <div className="text-[10px] text-slate-400">Guru Informatika & Pembina Coding Club</div>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#0c101a] border border-slate-800 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex text-amber-400">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed italic">
                "Fitur perpindahan antara Python dan JavaScript sangat jenius. Saya bisa membandingkan sintaks kedua bahasa secara instan di setiap level."
              </p>
            </div>
            <div className="flex items-center gap-3 pt-3 border-t border-slate-800/80">
              <div className="w-9 h-9 rounded-full bg-purple-500/20 flex items-center justify-center text-base">
                🧙‍♂️
              </div>
              <div>
                <div className="text-xs font-bold text-white">Kaelen Pratama</div>
                <div className="text-[10px] text-slate-400">Mahasiswa Baru TI · Penakluk Boss Ogre</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Call to Action Lead Conversion Section */}
      <section className="px-4 lg:px-8 max-w-7xl mx-auto">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-amber-950/60 via-slate-900 to-indigo-950/60 border-2 border-amber-500/40 p-8 sm:p-14 text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/40 mx-auto flex items-center justify-center text-3xl shadow-lg shadow-amber-500/20">
            ⚔️
          </div>
          <div className="max-w-xl mx-auto space-y-2">
            <h2 className="text-3xl sm:text-4xl font-black text-white font-fantasy tracking-wide">
              Siap Memulai Petualangan Kodingmu?
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Bergabunglah hari ini. Pilih ksatriamu, selesaikan quest dungeon pertama, dan rasakan serunya belajar coding yang sesungguhnya.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={onStartQuest}
              className="px-8 py-3.5 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-300 hover:brightness-110 shadow-xl shadow-amber-500/25 transition-all font-fantasy text-sm flex items-center gap-2"
            >
              <span>Mulai Belajar Sekarang</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenDemoStudio}
              className="px-6 py-3.5 rounded-xl font-semibold text-slate-300 bg-slate-900/90 hover:bg-slate-800 border border-slate-700 transition-colors text-xs font-code"
            >
              Coba Studio Demo
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
