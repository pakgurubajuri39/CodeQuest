import React, { useState } from 'react';
import { LevelCurriculum, SupportedLanguage, UserProfile } from '../../types/game';
import {
  BookOpen,
  Play,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Compass,
  Code2,
  Shield,
  Layers,
  HelpCircle,
  Terminal,
  Cpu,
  BookmarkCheck,
  ChevronRight
} from 'lucide-react';

interface PreStudioBriefingProps {
  level: LevelCurriculum;
  user: UserProfile | null;
  selectedLanguage: SupportedLanguage;
  onSelectLanguage: (lang: SupportedLanguage) => void;
  onStartCoding: () => void;
  onBackToMap: () => void;
}

export const PreStudioBriefing: React.FC<PreStudioBriefingProps> = ({
  level,
  user,
  selectedLanguage,
  onSelectLanguage,
  onStartCoding,
  onBackToMap
}) => {
  const [activeCodeTab, setActiveCodeTab] = useState<SupportedLanguage>(selectedLanguage);
  const [activeSection, setActiveSection] = useState<'teori' | 'sintaks' | 'misi'>('teori');

  // Helper to format markdown headers and code blocks in conceptExplanation
  const renderFormattedExplanation = (text: string) => {
    const lines = text.split('\n');
    const elements: React.ReactNode[] = [];
    let inCodeBlock = false;
    let codeBuffer: string[] = [];
    let codeLang = '';

    lines.forEach((line, index) => {
      if (line.startsWith('```')) {
        if (inCodeBlock) {
          elements.push(
            <div
              key={`code-${index}`}
              className="bg-[#07090f] p-4 rounded-xl border border-slate-800 font-code text-xs text-amber-200 whitespace-pre overflow-x-auto my-3 leading-relaxed shadow-inner"
            >
              {codeBuffer.join('\n')}
            </div>
          );
          codeBuffer = [];
          inCodeBlock = false;
        } else {
          inCodeBlock = true;
          codeLang = line.replace('```', '').trim();
        }
      } else if (inCodeBlock) {
        codeBuffer.push(line);
      } else if (line.startsWith('### ')) {
        elements.push(
          <h3
            key={`h3-${index}`}
            className="text-lg font-bold text-amber-300 font-fantasy mt-4 mb-2 flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>{line.replace('### ', '')}</span>
          </h3>
        );
      } else if (line.startsWith('## ')) {
        elements.push(
          <h2
            key={`h2-${index}`}
            className="text-xl font-black text-white font-fantasy mt-5 mb-2"
          >
            {line.replace('## ', '')}
          </h2>
        );
      } else if (line.startsWith('- ')) {
        elements.push(
          <li key={`li-${index}`} className="flex items-start gap-2 text-slate-300 my-1">
            <span className="text-amber-400 font-bold">▸</span>
            <span>{line.replace('- ', '')}</span>
          </li>
        );
      } else if (line.trim().length > 0) {
        elements.push(
          <p key={`p-${index}`} className="text-slate-300 leading-relaxed my-2 text-xs sm:text-sm">
            {line}
          </p>
        );
      }
    });

    if (inCodeBlock && codeBuffer.length > 0) {
      elements.push(
        <div
          key="code-last"
          className="bg-[#07090f] p-4 rounded-xl border border-slate-800 font-code text-xs text-amber-200 whitespace-pre overflow-x-auto my-3 leading-relaxed"
        >
          {codeBuffer.join('\n')}
        </div>
      );
    }

    return elements;
  };

  return (
    <div className="max-w-5xl mx-auto px-4 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Top Navigation & Breadcrumbs */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={onBackToMap}
          className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors bg-slate-900/80 hover:bg-slate-800 px-3.5 py-2 rounded-xl border border-slate-800"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Quest Map</span>
        </button>

        <div className="flex items-center gap-2 text-xs font-code">
          <span className="text-amber-400 uppercase font-bold">{level.realmName}</span>
          <span className="text-slate-600">/</span>
          <span className="text-slate-300 font-semibold">{level.title}</span>
        </div>
      </div>

      {/* Hero Mission Briefing Card */}
      <div className="bg-[#0c101a] border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs uppercase font-bold tracking-widest text-amber-400 bg-amber-950/60 border border-amber-800/60 px-3.5 py-1.5 rounded-full flex items-center gap-1.5 font-code shadow-sm">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Modul Materi Teori & Panduan Praktek</span>
            </span>

            {/* Language Switcher */}
            <div className="flex items-center p-1 bg-slate-900 rounded-xl border border-slate-700/80 text-xs">
              <button
                onClick={() => {
                  setActiveCodeTab('python');
                  onSelectLanguage('python');
                }}
                className={`px-3 py-1.5 rounded-lg font-code transition-colors ${
                  activeCodeTab === 'python'
                    ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                🐍 Python 3
              </button>
              <button
                onClick={() => {
                  setActiveCodeTab('javascript');
                  onSelectLanguage('javascript');
                }}
                className={`px-3 py-1.5 rounded-lg font-code transition-colors ${
                  activeCodeTab === 'javascript'
                    ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                ⚡ JavaScript
              </button>
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold text-amber-400/90 uppercase tracking-widest font-code">
              Materi Pembelajaran #{level.order}
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white font-fantasy tracking-tight mt-1">
              {level.title}
            </h1>
            <p className="text-sm sm:text-base text-slate-300 mt-2 leading-relaxed max-w-3xl">
              {level.loreDescription}
            </p>
          </div>

          {/* Quick Stats & Objective summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-[#070a12] border border-slate-800/80 space-y-1">
              <div className="text-[11px] uppercase tracking-wider text-amber-400 font-code font-bold flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5" />
                <span>Target Utama</span>
              </div>
              <p className="text-xs text-slate-200 font-medium leading-relaxed">
                {level.victoryConditions.loreObjective}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#070a12] border border-slate-800/80 space-y-1">
              <div className="text-[11px] uppercase tracking-wider text-cyan-400 font-code font-bold flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5" />
                <span>Konsep Algoritma</span>
              </div>
              <p className="text-xs text-slate-200 font-medium leading-relaxed">
                {level.learningObjectives[0] || 'Perintah Sekuensial & Logika Eksekusi'}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#070a12] border border-slate-800/80 space-y-1">
              <div className="text-[11px] uppercase tracking-wider text-emerald-400 font-code font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Hadiah Selesai</span>
              </div>
              <p className="text-xs text-slate-200 font-medium leading-relaxed">
                +{level.rewardXp} XP Arcane · +{level.rewardGems} Soul Rubies · Max 3 Bintang
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs: Teori Konsep | Buku Mantra (Cheat Sheet) | Target & Misi */}
      <div className="flex items-center p-1.5 bg-[#0c101a] border border-slate-800 rounded-2xl text-xs sm:text-sm font-semibold">
        <button
          onClick={() => setActiveSection('teori')}
          className={`flex-1 py-3 rounded-xl transition-all flex items-center justify-center gap-2 ${
            activeSection === 'teori'
              ? 'bg-amber-500 text-slate-950 font-bold shadow-lg'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>1. Teori & Penjelasan Konsep</span>
        </button>
        <button
          onClick={() => setActiveSection('sintaks')}
          className={`flex-1 py-3 rounded-xl transition-all flex items-center justify-center gap-2 ${
            activeSection === 'sintaks'
              ? 'bg-amber-500 text-slate-950 font-bold shadow-lg'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Code2 className="w-4 h-4" />
          <span>2. Mantra Sintaks ({activeCodeTab.toUpperCase()})</span>
        </button>
        <button
          onClick={() => setActiveSection('misi')}
          className={`flex-1 py-3 rounded-xl transition-all flex items-center justify-center gap-2 ${
            activeSection === 'misi'
              ? 'bg-amber-500 text-slate-950 font-bold shadow-lg'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>3. Target Misi & Tips Scribe</span>
        </button>
      </div>

      {/* Section 1: Teori & Penjelasan Konsep */}
      {activeSection === 'teori' && (
        <div className="bg-[#0c101a] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-4">
            <Layers className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl font-bold text-white font-fantasy">
              Penjelasan Konsep & Logika Pemrograman
            </h2>
          </div>

          {/* Formatted curriculum concept explanation */}
          <div className="space-y-3">
            {renderFormattedExplanation(level.conceptExplanation)}
          </div>

          {/* Why this matters card */}
          <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-800/40 text-xs text-cyan-200 space-y-1">
            <div className="font-bold text-cyan-300 text-sm flex items-center gap-1.5">
              <Cpu className="w-4 h-4" />
              <span>Penerapan di Dunia Nyata (Real-World Application)</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Konsep perulangan dan sekuensial ini digunakan setiap hari oleh engineer di Google, Netflix, dan NASA untuk memproses jutaan instruksi secara otomatis tanpa mengetik perintah berulang-ulang secara manual.
            </p>
          </div>
        </div>
      )}

      {/* Section 2: Mantra Sintaks (Cheat Sheet & Starter Preview) */}
      {activeSection === 'sintaks' && (
        <div className="bg-[#0c101a] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-xl font-bold text-white font-fantasy flex items-center gap-2">
                <Code2 className="w-5 h-5 text-amber-400" />
                <span>Buku Mantra Sintaks ({activeCodeTab === 'python' ? 'Python 3' : 'JavaScript ES6'})</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Kuasai mantra dasar berikut untuk mengendalikan ksatria di Studio IDE
              </p>
            </div>

            <div className="text-xs font-code px-3 py-1 rounded bg-slate-900 border border-slate-800 text-amber-300">
              Bahasa Aktif: {activeCodeTab.toUpperCase()}
            </div>
          </div>

          {/* Spell Reference Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="font-code font-bold text-amber-300 text-xs">
                {activeCodeTab === 'python' ? 'hero.moveRight(steps)' : 'hero.moveRight(steps);'}
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Menggerakkan hero ke kanan sejumlah langkah yang ditentukan. Bisa juga <code>hero.moveLeft()</code>, <code>hero.moveUp()</code>, atau <code>hero.moveDown()</code>.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="font-code font-bold text-rose-300 text-xs">
                {activeCodeTab === 'python' ? 'hero.attack()' : 'hero.attack();'}
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Mengayunkan pedang runic untuk menyerang musuh (Goblin / Ogre) yang berada tepat di petak samping ksatria.
              </p>
            </div>

            {level.realmId === 'forest_loops' && (
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2 md:col-span-2">
                <div className="font-code font-bold text-emerald-300 text-xs">
                  {activeCodeTab === 'python' ? 'for i in range(4):' : 'for (let i = 0; i < 4; i++) {'}
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Menjalankan blok kode di dalamnya berulang kali sebanyak angka parameter tanpa mengulang penulisan baris perintah.
                </p>
              </div>
            )}

            {level.realmId === 'mountain_variables' && (
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2 md:col-span-2">
                <div className="font-code font-bold text-cyan-300 text-xs">
                  {activeCodeTab === 'python' ? 'if hero.hp < 50:' : 'if (hero.hp < 50) {'}
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Struktur percabangan keputusan: ksatria hanya akan mengeksekusi aksi jika kondisi kesehatan atau koin memenuhi syarat.
                </p>
              </div>
            )}
          </div>

          {/* Starter Code Preview Box */}
          <div className="space-y-3 pt-2">
            <div className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5 font-code">
              <Terminal className="w-4 h-4 text-cyan-400" />
              <span>Kode Starter Awal yang Akan Muncul di Editor:</span>
            </div>

            <div className="bg-[#07090f] p-4 rounded-xl border border-slate-800 font-code text-xs text-amber-200 whitespace-pre overflow-x-auto leading-relaxed shadow-inner">
              {level.starterCode[activeCodeTab]}
            </div>

            <div className="text-xs text-slate-400 italic">
              Kamu akan melengkapi atau mengedit kode ini di Studio IDE pada langkah berikutnya.
            </div>
          </div>
        </div>
      )}

      {/* Section 3: Target Misi & Tips Scribe */}
      {activeSection === 'misi' && (
        <div className="bg-[#0c101a] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-4">
            <Compass className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl font-bold text-white font-fantasy">
              Target Misi & Checklist Keberhasilan
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-white font-code uppercase tracking-wider flex items-center gap-2">
                <BookmarkCheck className="w-4 h-4 text-emerald-400" />
                <span>Kriteria Kemenangan (Victory Conditions)</span>
              </h3>
              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-2.5 text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{level.victoryConditions.loreObjective}</span>
                </div>
                {level.victoryConditions.requiredGems && (
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-2.5 text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <span>Kumpulkan semua {level.victoryConditions.requiredGems} Soul Rubies di dungeon.</span>
                  </div>
                )}
                {level.victoryConditions.defeatEnemies && (
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-2.5 text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <span>Tumpas monster penjaga dengan <code>hero.attack()</code>.</span>
                  </div>
                )}
                {level.victoryConditions.avoidTraps && (
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-2.5 text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>Hindari menginjak ubin perangkap duri (spikes).</span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-bold text-white font-code uppercase tracking-wider flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>Tips Penting Scribe Penasihat</span>
              </h3>
              <div className="space-y-2">
                {level.hints.map((hint, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-amber-950/20 border border-amber-800/40 text-xs text-amber-200 flex items-start gap-2.5"
                  >
                    <span className="font-bold font-code text-amber-400 mt-0.5">{idx + 1}.</span>
                    <span className="text-slate-300 leading-relaxed">{hint}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Decision Bottom Bar */}
      <div className="bg-[#0d121e] border-2 border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="text-lg font-bold text-white font-fantasy flex items-center gap-2">
            <span>Sudah Paham Teorinya? Saatnya Menulis Kode!</span>
          </div>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Buka Studio IDE untuk mengontrol ksatria, menguji logika algoritmamu secara visual, dan raih 3 bintang penuh!
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto shrink-0">
          <button
            onClick={onBackToMap}
            className="flex-1 sm:flex-initial px-5 py-3 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            Pilih Level Lain
          </button>
          <button
            onClick={onStartCoding}
            className="flex-1 sm:flex-initial px-8 py-3.5 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-300 hover:brightness-110 shadow-xl shadow-amber-500/25 transition-all flex items-center justify-center gap-2 font-fantasy text-sm"
          >
            <Play className="w-4 h-4 fill-slate-950" />
            <span>Masuk ke Studio IDE & Praktek</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
