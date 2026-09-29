import React, { useState } from 'react';
import { LevelCurriculum, SupportedLanguage, UserProfile, UserStatus } from '../../types/game';
import { REALMS_DATA, DATABASE_SCHEMAS } from '../../data/curriculum';
import {
  ShieldCheck,
  Users,
  BookOpen,
  Database,
  Edit3,
  Copy,
  Check,
  Play,
  Save,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Sparkles,
  BarChart3,
  Code,
  UserCheck,
  UserX,
  Clock,
  Search,
  Filter
} from 'lucide-react';

interface AdminDashboardProps {
  user: UserProfile;
  levels: LevelCurriculum[];
  onUpdateLevel: (updated: LevelCurriculum) => void;
  onTestLevelInStudio: (level: LevelCurriculum) => void;
  studentsList: UserProfile[];
  onApproveStudent: (studentId: string) => void;
  onRejectStudent: (studentId: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  user,
  levels,
  onUpdateLevel,
  onTestLevelInStudio,
  studentsList,
  onApproveStudent,
  onRejectStudent
}) => {
  const [activeTab, setActiveTab] = useState<'approvals' | 'metrics' | 'editor' | 'database'>('approvals');
  const [selectedLevelId, setSelectedLevelId] = useState<string>(levels[0]?.id || 'syntax_level_1');

  // Filter for approvals tab
  const [approvalFilter, setApprovalFilter] = useState<'all' | 'pending' | 'approved'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  // Materi editor state for selected level
  const currentLevel = levels.find((l) => l.id === selectedLevelId) || levels[0];
  const [editTitle, setEditTitle] = useState(currentLevel.title);
  const [editLore, setEditLore] = useState(currentLevel.loreDescription);
  const [editPythonStarter, setEditPythonStarter] = useState(currentLevel.starterCode.python);
  const [editJsStarter, setEditJsStarter] = useState(currentLevel.starterCode.javascript);
  const [editPythonSolution, setEditPythonSolution] = useState(currentLevel.solutionCode.python);
  const [editJsSolution, setEditJsSolution] = useState(currentLevel.solutionCode.javascript);
  const [editObjective, setEditObjective] = useState(currentLevel.victoryConditions.loreObjective);

  const [saveSuccess, setSaveSuccess] = useState(false);
  const [copiedType, setCopiedType] = useState<string | null>(null);

  const pendingCount = studentsList.filter((s) => s.status === 'pending').length;

  const handleApprove = (id: string, name: string) => {
    onApproveStudent(id);
    setActionFeedback(`Siswa ${name} berhasil disetujui! Akses penuh seluruh materi telah aktif.`);
    setTimeout(() => setActionFeedback(null), 3000);
  };

  const handleReject = (id: string, name: string) => {
    onRejectStudent(id);
    setActionFeedback(`Pendaftaran siswa ${name} ditolak.`);
    setTimeout(() => setActionFeedback(null), 3000);
  };

  // Sync editor fields when level selector changes
  const handleSelectLevelChange = (levelId: string) => {
    setSelectedLevelId(levelId);
    const target = levels.find((l) => l.id === levelId);
    if (target) {
      setEditTitle(target.title);
      setEditLore(target.loreDescription);
      setEditPythonStarter(target.starterCode.python);
      setEditJsStarter(target.starterCode.javascript);
      setEditPythonSolution(target.solutionCode.python);
      setEditJsSolution(target.solutionCode.javascript);
      setEditObjective(target.victoryConditions.loreObjective);
      setSaveSuccess(false);
    }
  };

  const handleSaveLevel = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: LevelCurriculum = {
      ...currentLevel,
      title: editTitle,
      loreDescription: editLore,
      starterCode: {
        python: editPythonStarter,
        javascript: editJsStarter
      },
      solutionCode: {
        python: editPythonSolution,
        javascript: editJsSolution
      },
      victoryConditions: {
        ...currentLevel.victoryConditions,
        loreObjective: editObjective
      }
    };

    onUpdateLevel(updated);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleCopyClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const filteredStudents = studentsList.filter((s) => {
    const matchesFilter =
      approvalFilter === 'all' ? true : s.status === approvalFilter;
    const matchesSearch =
      s.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.email && s.email.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      {/* Admin Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#0d1320] border border-cyan-800/40 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-300 shadow-lg shadow-cyan-500/10 text-2xl">
            👑
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-bold tracking-widest text-cyan-400 font-code">
                Portal Guru & Administrator CodeQuest
              </span>
              <span className="text-xs text-slate-500">·</span>
              <span className="text-xs text-emerald-400 font-code font-semibold">Disetujui: Pak GuruAI</span>
            </div>
            <h1 className="text-2xl font-black text-white font-fantasy tracking-wide">
              Manajemen Akademi & Persetujuan Siswa
            </h1>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center p-1.5 bg-slate-900 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('approvals')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-medium transition-all relative ${
              activeTab === 'approvals'
                ? 'bg-cyan-600 text-white font-bold shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Persetujuan Siswa</span>
            {pendingCount > 0 && (
              <span className="ml-1 px-1.5 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-bold">
                {pendingCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('metrics')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'metrics'
                ? 'bg-cyan-600 text-white font-bold shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Metrik Kelas</span>
          </button>
          <button
            onClick={() => setActiveTab('editor')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'editor'
                ? 'bg-cyan-600 text-white font-bold shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Editor Materi</span>
          </button>
          <button
            onClick={() => setActiveTab('database')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'database'
                ? 'bg-cyan-600 text-white font-bold shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>DB Schema</span>
          </button>
        </div>
      </div>

      {actionFeedback && (
        <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-200 text-xs flex items-center gap-2 shadow-lg">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{actionFeedback}</span>
        </div>
      )}

      {/* Tab 1: Persetujuan Siswa Baru (Approval Workflow) */}
      {activeTab === 'approvals' && (
        <div className="space-y-6">
          {/* Summary Banner */}
          <div className="p-5 rounded-2xl bg-[#0c101a] border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white font-fantasy">
                Daftar Permohonan Akses Siswa
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Siswa baru yang mendaftar hanya memiliki akses ke <strong>Level 1 (Trial Mode)</strong> sampai Admin menyetujui akunnya di bawah ini.
              </p>
            </div>

            {/* Filter Tabs & Search */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Cari siswa atau email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="px-3.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-cyan-400 pl-8"
                />
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
              </div>

              <div className="flex items-center p-1 bg-slate-900 rounded-lg border border-slate-800 text-xs">
                <button
                  onClick={() => setApprovalFilter('all')}
                  className={`px-3 py-1 rounded transition-colors ${
                    approvalFilter === 'all' ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400'
                  }`}
                >
                  Semua ({studentsList.length})
                </button>
                <button
                  onClick={() => setApprovalFilter('pending')}
                  className={`px-3 py-1 rounded transition-colors ${
                    approvalFilter === 'pending' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'
                  }`}
                >
                  Pending ({pendingCount})
                </button>
                <button
                  onClick={() => setApprovalFilter('approved')}
                  className={`px-3 py-1 rounded transition-colors ${
                    approvalFilter === 'approved' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400'
                  }`}
                >
                  Approved
                </button>
              </div>
            </div>
          </div>

          {/* Student Table */}
          <div className="bg-[#0c101a] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#080b12] text-slate-400 uppercase tracking-wider font-code text-[11px] border-b border-slate-800">
                  <tr>
                    <th className="px-6 py-3.5">Hero & Siswa</th>
                    <th className="px-6 py-3.5">Email & Username</th>
                    <th className="px-6 py-3.5">Disiplin / Kelas</th>
                    <th className="px-6 py-3.5 text-center">Status Akses</th>
                    <th className="px-6 py-3.5">Tanggal Daftar</th>
                    <th className="px-6 py-3.5 text-right">Tindakan Admin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 font-medium">
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-slate-500 italic">
                        Tidak ada siswa yang sesuai dengan filter.
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map((s) => (
                      <tr key={s.id} className="hover:bg-slate-900/40 transition-colors">
                        <td className="px-6 py-4 flex items-center gap-3">
                          <div className="text-2xl">{s.avatar}</div>
                          <div>
                            <div className="font-bold text-slate-200">{s.displayName}</div>
                            <div className="text-[10px] text-slate-500 font-code">ID: {s.id}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-slate-300 font-code">{s.email || '-'}</div>
                          <div className="text-[11px] text-slate-500 font-code">@{s.username}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 font-code">
                            {s.heroClass}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          {s.status === 'pending' ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-950/60 border border-amber-500/50 text-amber-300 font-code text-[10px] font-bold animate-pulse">
                              <Clock className="w-3 h-3 text-amber-400" />
                              <span>Menunggu Persetujuan</span>
                            </span>
                          ) : s.status === 'approved' ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 font-code text-[10px] font-bold">
                              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                              <span>Disetujui (Akses Penuh)</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-950/60 border border-rose-500/50 text-rose-300 font-code text-[10px] font-bold">
                              <UserX className="w-3 h-3 text-rose-400" />
                              <span>Ditolak</span>
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-slate-400 font-code text-[11px]">
                          {s.registeredAt || '2026-09-28'}
                        </td>
                        <td className="px-6 py-4 text-right">
                          {s.status === 'pending' ? (
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleApprove(s.id, s.displayName)}
                                className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1 transition-colors shadow"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>Setujui</span>
                              </button>
                              <button
                                onClick={() => handleReject(s.id, s.displayName)}
                                className="px-2.5 py-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900 border border-rose-800 text-rose-300 text-xs transition-colors"
                              >
                                Tolak
                              </button>
                            </div>
                          ) : s.status === 'approved' ? (
                            <div className="flex items-center justify-end gap-2">
                              <span className="text-[11px] text-emerald-400 font-code font-semibold">Aktif</span>
                              <button
                                onClick={() => handleReject(s.id, s.displayName)}
                                className="text-[10px] text-slate-500 hover:text-rose-400 underline"
                              >
                                Kunci Kembali
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleApprove(s.id, s.displayName)}
                              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-emerald-600 text-slate-300 hover:text-white text-[11px] transition-colors"
                            >
                              Beri Akses
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Metrik Kelas */}
      {activeTab === 'metrics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#0c101a] border border-slate-800 rounded-2xl p-5">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                <span>Total Siswa Terdaftar</span>
                <Users className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="text-3xl font-black text-white font-fantasy tabular-nums">
                {studentsList.length}
              </div>
              <div className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
                <span>{studentsList.filter((s) => s.status === 'approved').length} Disetujui</span>
              </div>
            </div>

            <div className="bg-[#0c101a] border border-slate-800 rounded-2xl p-5">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                <span>Menunggu Persetujuan</span>
                <Clock className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-3xl font-black text-amber-400 font-fantasy tabular-nums">
                {pendingCount}
              </div>
              <div className="text-xs text-slate-400 mt-1">Perlu ditinjau admin</div>
            </div>

            <div className="bg-[#0c101a] border border-slate-800 rounded-2xl p-5">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                <span>Tingkat Kelulusan</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-3xl font-black text-white font-fantasy tabular-nums">78.4%</div>
              <div className="text-xs text-slate-400 mt-1">Rata-rata 2.2 percobaan/level</div>
            </div>

            <div className="bg-[#0c101a] border border-slate-800 rounded-2xl p-5">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                <span>Kesalahan Paling Sering</span>
                <Code className="w-4 h-4 text-rose-400" />
              </div>
              <div className="text-base font-bold text-rose-300 font-mono truncate">IndentationError</div>
              <div className="text-xs text-slate-400 mt-1">Struktur blok Python</div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Materi & Level Editor */}
      {activeTab === 'editor' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 bg-[#0c101a] border border-slate-800 rounded-2xl p-4 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-2">
              Pilih Quest untuk Diubah
            </div>
            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
              {levels.map((lvl) => (
                <button
                  key={lvl.id}
                  onClick={() => handleSelectLevelChange(lvl.id)}
                  className={`w-full text-left p-3 rounded-xl border transition-all ${
                    lvl.id === selectedLevelId
                      ? 'bg-cyan-950/40 border-cyan-500/60 ring-1 ring-cyan-500/40'
                      : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-code text-cyan-400 font-semibold">Level {lvl.order}</span>
                    <span className="text-[10px] text-slate-500 font-code">{lvl.realmName}</span>
                  </div>
                  <div className="text-xs font-bold text-slate-200">{lvl.title}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-8 bg-[#0c101a] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white font-fantasy">
                  Mengedit: {currentLevel.title}
                </h3>
                <div className="text-xs text-slate-400">Realm: {currentLevel.realmName}</div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onTestLevelInStudio(currentLevel)}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors flex items-center gap-1.5 font-code shadow"
                >
                  <Play className="w-3.5 h-3.5 fill-slate-950" />
                  <span>Uji di Studio IDE</span>
                </button>
              </div>
            </div>

            <form onSubmit={handleSaveLevel} className="space-y-4 text-xs">
              {saveSuccess && (
                <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/40 text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Perubahan materi berhasil disimpan ke memori aktif!</span>
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Judul Level
                </label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#111726] border border-slate-700/80 rounded-xl text-slate-100 font-medium focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Deskripsi Cerita / Lore
                </label>
                <textarea
                  rows={2}
                  value={editLore}
                  onChange={(e) => setEditLore(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#111726] border border-slate-700/80 rounded-xl text-slate-100 font-medium focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Objektif Kemenangan
                </label>
                <input
                  type="text"
                  value={editObjective}
                  onChange={(e) => setEditObjective(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#111726] border border-slate-700/80 rounded-xl text-slate-100 font-medium focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-amber-300 uppercase tracking-wider mb-1 font-code">
                    Starter Code Python
                  </label>
                  <textarea
                    rows={6}
                    value={editPythonStarter}
                    onChange={(e) => setEditPythonStarter(e.target.value)}
                    className="w-full p-3 bg-[#07090f] border border-slate-800 rounded-xl font-code text-[11px] text-slate-200 focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-cyan-300 uppercase tracking-wider mb-1 font-code">
                    Starter Code JavaScript
                  </label>
                  <textarea
                    rows={6}
                    value={editJsStarter}
                    onChange={(e) => setEditJsStarter(e.target.value)}
                    className="w-full p-3 bg-[#07090f] border border-slate-800 rounded-xl font-code text-[11px] text-slate-200 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-amber-300 uppercase tracking-wider mb-1 font-code">
                    Solusi Master Python
                  </label>
                  <textarea
                    rows={6}
                    value={editPythonSolution}
                    onChange={(e) => setEditPythonSolution(e.target.value)}
                    className="w-full p-3 bg-[#07090f] border border-slate-800 rounded-xl font-code text-[11px] text-slate-200 focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-cyan-300 uppercase tracking-wider mb-1 font-code">
                    Solusi Master JavaScript
                  </label>
                  <textarea
                    rows={6}
                    value={editJsSolution}
                    onChange={(e) => setEditJsSolution(e.target.value)}
                    className="w-full p-3 bg-[#07090f] border border-slate-800 rounded-xl font-code text-[11px] text-slate-200 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 rounded-xl transition-all shadow-lg flex items-center gap-2 font-fantasy"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Perubahan Quest</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tab 4: Database Schema */}
      {activeTab === 'database' && (
        <div className="space-y-6">
          <div className="bg-[#0c101a] border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-white font-fantasy flex items-center gap-2">
                  <Database className="w-4 h-4 text-cyan-400" />
                  <span>MongoDB JSON Schema Collection</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Skema koleksi MongoDB untuk struktur data kurikulum.
                </p>
              </div>
              <button
                onClick={() =>
                  handleCopyClipboard(JSON.stringify(DATABASE_SCHEMAS.mongodb, null, 2), 'mongo')
                }
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg transition-colors flex items-center gap-1.5 font-code"
              >
                {copiedType === 'mongo' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedType === 'mongo' ? 'Tersalin!' : 'Salin Skema'}</span>
              </button>
            </div>
            <pre className="bg-[#07090f] p-4 rounded-xl border border-slate-800 font-code text-xs text-cyan-200 overflow-x-auto max-h-72">
              {JSON.stringify(DATABASE_SCHEMAS.mongodb, null, 2)}
            </pre>
          </div>

          <div className="bg-[#0c101a] border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-white font-fantasy flex items-center gap-2">
                  <Database className="w-4 h-4 text-amber-400" />
                  <span>PostgreSQL Relational DDL & Tables</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Tabel relasional PostgreSQL dengan tipe data JSONB.
                </p>
              </div>
              <button
                onClick={() =>
                  handleCopyClipboard(DATABASE_SCHEMAS.postgresql.tables.join('\n\n'), 'postgres')
                }
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg transition-colors flex items-center gap-1.5 font-code"
              >
                {copiedType === 'postgres' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedType === 'postgres' ? 'Tersalin SQL!' : 'Salin DDL'}</span>
              </button>
            </div>
            <pre className="bg-[#07090f] p-4 rounded-xl border border-slate-800 font-code text-xs text-amber-200 overflow-x-auto max-h-72 whitespace-pre">
              {DATABASE_SCHEMAS.postgresql.tables.join('\n\n')}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
