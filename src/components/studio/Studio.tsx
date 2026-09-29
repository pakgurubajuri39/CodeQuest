import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  LevelCurriculum,
  SupportedLanguage,
  UserProfile,
  SimulationStep,
  ConsoleMessage,
  GridItem,
  GridEnemy,
  UserGameStats
} from '../../types/game';
import { ALL_LEVELS } from '../../data/curriculum';
import { interpreter } from '../../game/interpreter';
import { canvasRenderer, HeroState, FloatingText } from '../../game/canvasRenderer';
import { sound } from '../../utils/audio';
import {
  Play,
  RotateCcw,
  Sparkles,
  Zap,
  Terminal,
  Code2,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Star,
  ChevronRight,
  ArrowLeft,
  Volume2,
  VolumeX,
  FastForward,
  Eye,
  Trophy
} from 'lucide-react';

interface StudioProps {
  level: LevelCurriculum;
  user: UserProfile;
  selectedLanguage: SupportedLanguage;
  onSelectLanguage: (lang: SupportedLanguage) => void;
  onCompleteLevel: (levelId: string, stars: number, highscore: number) => void;
  onSelectLevel: (level: LevelCurriculum) => void;
  onBackToMap: () => void;
  onOpenTheory?: () => void;
  onOpenRegister?: () => void;
  onOpenAchievements?: () => void;
  onUpdateStats?: (statsDelta: Partial<UserGameStats>) => void;
}

export const Studio: React.FC<StudioProps> = ({
  level,
  user,
  selectedLanguage,
  onSelectLanguage,
  onCompleteLevel,
  onSelectLevel,
  onBackToMap,
  onOpenTheory,
  onOpenRegister,
  onOpenAchievements,
  onUpdateStats
}) => {
  // Code editor state
  const [code, setCode] = useState(level.starterCode[selectedLanguage]);
  const [activeTab, setActiveTab] = useState<'editor' | 'lore' | 'solution'>('editor');
  const [showSolutionModal, setShowSolutionModal] = useState(false);

  // Simulation execution state
  const [isExecuting, setIsExecuting] = useState(false);
  const [executingLine, setExecutingLine] = useState<number | null>(null);
  const [execSpeed, setExecSpeed] = useState<number>(1); // 1x, 2x, 4x
  const [consoleLogs, setConsoleLogs] = useState<ConsoleMessage[]>([]);
  const [isMuted, setIsMuted] = useState(false);

  // Victory modal state
  const [showVictoryModal, setShowVictoryModal] = useState(false);
  const [victoryStats, setVictoryStats] = useState<{ stars: number; xp: number; gems: number; stepsCount: number } | null>(null);

  // Canvas elements state
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const heroRef = useRef<HeroState>({
    x: level.gridMap.heroStart.x,
    y: level.gridMap.heroStart.y,
    renderX: level.gridMap.heroStart.x,
    renderY: level.gridMap.heroStart.y,
    dir: level.gridMap.heroStart.dir,
    hp: 100,
    maxHp: 100,
    isAttacking: false,
    attackProgress: 0,
    slashDir: 'right'
  });

  const gemsRef = useRef<GridItem[]>(level.gridMap.gems.map((g) => ({ ...g, collected: false })));
  const enemiesRef = useRef<GridEnemy[]>(level.gridMap.enemies.map((e) => ({ ...e, isAlive: true })));
  const floatingTextsRef = useRef<FloatingText[]>([]);
  const execAbortRef = useRef(false);

  // Reset or switch level starter code
  useEffect(() => {
    setCode(level.starterCode[selectedLanguage]);
    resetSimulation();
    addConsoleMessage('info', `Entered ${level.title} (${selectedLanguage === 'python' ? 'Python 3' : 'JavaScript'}).`);
    addConsoleMessage('hero', `Hero stationed at coordinates (${level.gridMap.heroStart.x}, ${level.gridMap.heroStart.y}).`);
  }, [level, selectedLanguage]);

  // Audio mute sync
  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    sound.setMuted(nextMuted);
  };

  const addConsoleMessage = (
    type: 'info' | 'success' | 'warn' | 'error' | 'hero',
    text: string,
    line?: number
  ) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setConsoleLogs((prev) => [
      ...prev.slice(-40),
      {
        id: `log_${Date.now()}_${Math.random()}`,
        type,
        text,
        line,
        timestamp: timeStr
      }
    ]);
  };

  // Add floating text on canvas
  const addFloatingText = (text: string, x: number, y: number, color = '#f59e0b') => {
    floatingTextsRef.current.push({
      id: `ft_${Date.now()}_${Math.random()}`,
      text,
      x,
      y,
      color,
      opacity: 1,
      offsetY: 0
    });
  };

  // Reset simulation to initial grid state
  const resetSimulation = useCallback(() => {
    execAbortRef.current = true;
    setIsExecuting(false);
    setExecutingLine(null);

    heroRef.current = {
      x: level.gridMap.heroStart.x,
      y: level.gridMap.heroStart.y,
      renderX: level.gridMap.heroStart.x,
      renderY: level.gridMap.heroStart.y,
      dir: level.gridMap.heroStart.dir,
      hp: 100,
      maxHp: 100,
      isAttacking: false,
      attackProgress: 0,
      slashDir: 'right'
    };

    gemsRef.current = level.gridMap.gems.map((g) => ({ ...g, collected: false }));
    enemiesRef.current = level.gridMap.enemies.map((e) => ({ ...e, hp: e.maxHp, isAlive: true }));
    floatingTextsRef.current = [];
  }, [level]);

  // Continuous Canvas Animation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvasRenderer.init(canvas);

    let animationFrameId: number;

    const renderLoop = () => {
      // Smooth hero interpolation
      const hero = heroRef.current;
      hero.renderX += (hero.x - hero.renderX) * 0.25;
      hero.renderY += (hero.y - hero.renderY) * 0.25;

      // Update floating texts
      floatingTextsRef.current = floatingTextsRef.current
        .map((ft) => ({
          ...ft,
          offsetY: ft.offsetY + 0.6,
          opacity: ft.opacity - 0.02
        }))
        .filter((ft) => ft.opacity > 0);

      canvasRenderer.render(
        level.gridMap,
        hero,
        gemsRef.current,
        enemiesRef.current,
        floatingTextsRef.current,
        isExecuting
      );

      animationFrameId = requestAnimationFrame(renderLoop);
    };

    animationFrameId = requestAnimationFrame(renderLoop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [level, isExecuting]);

  // Execute Code Simulation
  const handleExecuteCode = async () => {
    if (isExecuting) return;

    resetSimulation();
    await new Promise((r) => setTimeout(r, 60)); // flush
    execAbortRef.current = false;
    setIsExecuting(true);

    addConsoleMessage('info', `Compiling and parsing ${selectedLanguage.toUpperCase()} spell runes...`);

    const parseResult = interpreter.parse(code, selectedLanguage);

    if (!parseResult.success) {
      sound.playError();
      setIsExecuting(false);
      addConsoleMessage(
        'error',
        `Line ${parseResult.error?.line || 1}: ${parseResult.error?.message}`,
        parseResult.error?.line
      );
      if (parseResult.error?.suggestion) {
        addConsoleMessage('warn', `Scribe's Tip: ${parseResult.error.suggestion}`);
      }
      return;
    }

    const steps = parseResult.steps;
    addConsoleMessage('info', `Spell compiled successfully into ${steps.length} sequential execution actions.`);

    if (onUpdateStats) {
      onUpdateStats({
        totalCommandsRun: (user.gameStats?.totalCommandsRun || 0) + steps.length,
        languagesUsed: Array.from(new Set([...(user.gameStats?.languagesUsed || []), selectedLanguage]))
      });
    }

    // Delay helper governed by execSpeed
    const stepDelay = () => Math.max(80, 400 / execSpeed);

    let currentX = heroRef.current.x;
    let currentY = heroRef.current.y;
    let gemsCollected = 0;
    let actionsTaken = 0;
    let hasDied = false;

    for (let i = 0; i < steps.length; i++) {
      if (execAbortRef.current) break;

      const step = steps[i];
      actionsTaken++;
      if (step.line) setExecutingLine(step.line);

      // Helper to check and attack enemy in path if blocked
      const attackEnemyAt = (tx: number, ty: number) => {
        const enemy = enemiesRef.current.find((e) => e.x === tx && e.y === ty && e.isAlive);
        if (enemy) {
          heroRef.current.isAttacking = true;
          sound.playAttack();
          const dmg = 25;
          enemy.hp = Math.max(0, enemy.hp - dmg);
          sound.playHit();
          addFloatingText(`-${dmg} HP`, enemy.x, enemy.y, '#ef4444');
          addConsoleMessage('hero', `Hero struck ${enemy.name} for ${dmg} damage! (HP: ${enemy.hp}/${enemy.maxHp})`, step.line);
          if (enemy.hp <= 0) {
            enemy.isAlive = false;
            addFloatingText('DEFEATED!', enemy.x, enemy.y, '#f59e0b');
            addConsoleMessage('success', `${enemy.name} was defeated!`, step.line);
          }
          setTimeout(() => {
            heroRef.current.isAttacking = false;
          }, 150 / execSpeed);
          return true;
        }
        return false;
      };

      if (step.type === 'MOVE_RIGHT') {
        heroRef.current.dir = 'right';
        const targetX = currentX + 1;
        if (canMoveTo(targetX, currentY)) {
          currentX = targetX;
          heroRef.current.x = currentX;
          sound.playMove();
          addConsoleMessage('hero', `Hero moved Right to (${currentX}, ${currentY}).`, step.line);
        } else if (attackEnemyAt(targetX, currentY)) {
          // Attacked blocking enemy
        } else {
          addConsoleMessage('warn', `Hero bumped into a stone wall at (${targetX}, ${currentY})!`, step.line);
        }
      } else if (step.type === 'MOVE_LEFT') {
        heroRef.current.dir = 'left';
        const targetX = currentX - 1;
        if (canMoveTo(targetX, currentY)) {
          currentX = targetX;
          heroRef.current.x = currentX;
          sound.playMove();
          addConsoleMessage('hero', `Hero moved Left to (${currentX}, ${currentY}).`, step.line);
        } else if (attackEnemyAt(targetX, currentY)) {
          // Attacked blocking enemy
        } else {
          addConsoleMessage('warn', `Hero bumped into a stone wall at (${targetX}, ${currentY})!`, step.line);
        }
      } else if (step.type === 'MOVE_UP') {
        heroRef.current.dir = 'up';
        const targetY = currentY - 1;
        if (canMoveTo(currentX, targetY)) {
          currentY = targetY;
          heroRef.current.y = currentY;
          sound.playMove();
          addConsoleMessage('hero', `Hero moved Up to (${currentX}, ${currentY}).`, step.line);
        } else if (attackEnemyAt(currentX, targetY)) {
          // Attacked blocking enemy
        } else {
          addConsoleMessage('warn', `Hero bumped into a stone wall at (${currentX}, ${targetY})!`, step.line);
        }
      } else if (step.type === 'MOVE_DOWN') {
        heroRef.current.dir = 'down';
        const targetY = currentY + 1;
        if (canMoveTo(currentX, targetY)) {
          currentY = targetY;
          heroRef.current.y = currentY;
          sound.playMove();
          addConsoleMessage('hero', `Hero moved Down to (${currentX}, ${currentY}).`, step.line);
        } else if (attackEnemyAt(currentX, targetY)) {
          // Attacked blocking enemy
        } else {
          addConsoleMessage('warn', `Hero bumped into a stone wall at (${currentX}, ${targetY})!`, step.line);
        }
      } else if (step.type === 'ATTACK') {
        // Attack adjacent enemy
        heroRef.current.isAttacking = true;
        heroRef.current.slashDir = heroRef.current.dir;
        sound.playAttack();

        // Check adjacent targets
        const adjacentEnemy = findAdjacentEnemy(currentX, currentY);
        if (adjacentEnemy && adjacentEnemy.isAlive) {
          const dmg = 25;
          adjacentEnemy.hp = Math.max(0, adjacentEnemy.hp - dmg);
          sound.playHit();
          addFloatingText(`-${dmg} HP`, adjacentEnemy.x, adjacentEnemy.y, '#ef4444');
          addConsoleMessage('hero', `Hero slashed ${adjacentEnemy.name} for ${dmg} damage! (HP: ${adjacentEnemy.hp}/${adjacentEnemy.maxHp})`, step.line);

          if (adjacentEnemy.hp <= 0) {
            adjacentEnemy.isAlive = false;
            addFloatingText('DEFEATED!', adjacentEnemy.x, adjacentEnemy.y, '#f59e0b');
            addConsoleMessage('success', `${adjacentEnemy.name} was defeated!`, step.line);
          }
        } else {
          addConsoleMessage('info', 'Hero swung runic spellblade into thin air.', step.line);
        }

        setTimeout(() => {
          heroRef.current.isAttacking = false;
        }, 150 / execSpeed);
      }

      // Check item pickups at new coordinate
      const gemOnTile = gemsRef.current.find((g) => g.x === currentX && g.y === currentY && !g.collected);
      if (gemOnTile) {
        gemOnTile.collected = true;
        gemsCollected++;
        sound.playGem();
        addFloatingText('+1 Ruby!', currentX, currentY, '#f43f5e');
        addConsoleMessage('success', `Soul Ruby collected at (${currentX}, ${currentY})! [${gemsCollected} Gems]`, step.line);
      }

      // Check spikes trap
      const isSpikeTile = level.gridMap.spikes.some((s) => s.x === currentX && s.y === currentY);
      if (isSpikeTile) {
        heroRef.current.hp = Math.max(0, heroRef.current.hp - 35);
        sound.playHit();
        addFloatingText('-35 Trap Damage!', currentX, currentY, '#ef4444');
        addConsoleMessage('error', `Ouch! Stepped on cursed spikes at (${currentX}, ${currentY})! HP: ${heroRef.current.hp}/100`, step.line);

        if (heroRef.current.hp <= 0) {
          hasDied = true;
          sound.playError();
          addConsoleMessage('error', 'Hero collapsed from lethal trap wounds! Quest failed.');
          setIsExecuting(false);
          return;
        }
      }

      await new Promise((r) => setTimeout(r, stepDelay()));
    }

    setExecutingLine(null);
    setIsExecuting(false);

    if (execAbortRef.current || hasDied) return;

    // Victory Condition Evaluation
    evaluateVictory(currentX, currentY, gemsCollected, actionsTaken);
  };

  const canMoveTo = (x: number, y: number): boolean => {
    // Within grid bounds
    if (x < 0 || x >= level.gridMap.width || y < 0 || y >= level.gridMap.height) return false;
    // Not in wall
    if (level.gridMap.walls.some((w) => w.x === x && w.y === y)) return false;
    // Not into living enemy tile
    const livingEnemy = enemiesRef.current.find((e) => e.x === x && e.y === y && e.isAlive);
    if (livingEnemy) return false;

    return true;
  };

  const findAdjacentEnemy = (hx: number, hy: number): GridEnemy | null => {
    return (
      enemiesRef.current.find(
        (e) =>
          e.isAlive &&
          ((Math.abs(e.x - hx) === 1 && e.y === hy) ||
            (Math.abs(e.y - hy) === 1 && e.x === hx))
      ) || null
    );
  };

  // Evaluate victory conditions
  const evaluateVictory = (finalX: number, finalY: number, gemsCollected: number, actionsTaken: number) => {
    const vc = level.victoryConditions;
    let failedReason: string | null = null;

    if (vc.reachExit && (finalX !== level.gridMap.exit.x || finalY !== level.gridMap.exit.y)) {
      failedReason = `Hero finished at (${finalX}, ${finalY}), but the exit portal is at (${level.gridMap.exit.x}, ${level.gridMap.exit.y}).`;
    } else if (vc.requiredGems && gemsCollected < vc.requiredGems) {
      failedReason = `Requires ${vc.requiredGems} gems, but only gathered ${gemsCollected}.`;
    } else if (vc.defeatEnemies && enemiesRef.current.some((e) => e.isAlive)) {
      failedReason = 'All enemies must be defeated before passing through the gate!';
    } else if (vc.avoidTraps && heroRef.current.hp < 100) {
      failedReason = 'Objective requires avoiding all spike traps without taking damage!';
    }

    if (failedReason) {
      sound.playError();
      addConsoleMessage('warn', `Incomplete Victory: ${failedReason}`);
      addFloatingText('TRY AGAIN', finalX, finalY, '#f59e0b');
    } else {
      // VICTORY!
      sound.playVictory();
      addFloatingText('VICTORY!', finalX, finalY, '#10b981');
      addConsoleMessage('success', `★ VICTORY ACCOMPLISHED! ${level.title} Cleared!`);

      // Calculate Stars (3 stars for optimal steps / code)
      let stars = 3;
      const codeLines = code.split('\n').filter((l) => l.trim() && !l.trim().startsWith('#') && !l.trim().startsWith('//')).length;
      if (codeLines > 8) stars = 2;
      if (actionsTaken > 25) stars = Math.min(stars, 2);

      const highscore = level.rewardXp + (stars === 3 ? 100 : 50);
      setVictoryStats({
        stars,
        xp: level.rewardXp,
        gems: level.rewardGems,
        stepsCount: actionsTaken
      });
      setShowVictoryModal(true);

      onCompleteLevel(level.id, stars, highscore);

      if (onUpdateStats) {
        const deadEnemiesCount = enemiesRef.current.filter((e) => !e.isAlive).length;
        onUpdateStats({
          monstersSlain: (user.gameStats?.monstersSlain || 0) + deadEnemiesCount,
          totalGemsCollected: (user.gameStats?.totalGemsCollected || 0) + gemsCollected,
          perfectLevelsCount: (user.gameStats?.perfectLevelsCount || 0) + (stars === 3 ? 1 : 0),
          fastestCompletionSteps: Math.min(user.gameStats?.fastestCompletionSteps || 999, actionsTaken)
        });
      }
    }
  };

  // Quick insert snippet helper
  const handleInsertSnippet = (snippet: string) => {
    setCode((prev) => {
      const trimmed = prev.trimEnd();
      return `${trimmed}\n${snippet}\n`;
    });
  };

  // Auto-indent on Tab key
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const target = e.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const value = target.value;

      setCode(value.substring(0, start) + '    ' + value.substring(end));
      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 4;
      }, 0);
    }
  };

  // Next level navigation
  const nextLevelIndex = ALL_LEVELS.findIndex((l) => l.id === level.id) + 1;
  const nextLevel = ALL_LEVELS[nextLevelIndex] || null;
  const isFullAccess = user?.role === 'admin' || user?.status === 'approved';

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 space-y-4">
      {/* Studio Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#0d121e] border border-slate-800 rounded-2xl p-4 shadow-lg">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToMap}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            title="Return to Quest Map"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-400 font-code uppercase tracking-wider">
                {level.realmName}
              </span>
              <span className="text-xs text-slate-500">·</span>
              <span className="text-xs text-slate-400">Level {level.order}</span>
              {!isFullAccess && level.order === 1 && (
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-code">
                  Trial Mode
                </span>
              )}
            </div>
            <h1 className="text-xl font-bold text-white font-fantasy">{level.title}</h1>
          </div>
        </div>

        {/* Right Action Tools: Materi Briefing, Language, Audio, Solution */}
        <div className="flex items-center gap-3">
          {/* Read Theory / Materi Briefing Button */}
          <button
            onClick={() => {
              if (onOpenTheory) {
                onOpenTheory();
              }
            }}
            className="px-3 py-2 text-xs font-semibold text-amber-300 bg-amber-950/40 hover:bg-amber-900/50 border border-amber-600/50 rounded-xl transition-colors flex items-center gap-1.5 font-code shadow-sm"
            title="Buka Lembar Materi Teori & Konsep"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span>Materi Teori</span>
          </button>

          {/* Language Selector */}
          <div className="flex items-center p-1 bg-slate-900 rounded-xl border border-slate-700/80 text-xs">
            <button
              onClick={() => onSelectLanguage('python')}
              className={`px-3 py-1.5 rounded-lg font-code font-medium transition-colors ${
                selectedLanguage === 'python'
                  ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🐍 Python
            </button>
            <button
              onClick={() => onSelectLanguage('javascript')}
              className={`px-3 py-1.5 rounded-lg font-code font-medium transition-colors ${
                selectedLanguage === 'javascript'
                  ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              ⚡ JavaScript
            </button>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={toggleMute}
            className={`p-2 rounded-xl border transition-colors ${
              isMuted
                ? 'bg-slate-900 border-slate-800 text-slate-500'
                : 'bg-slate-900 border-slate-700 text-amber-400'
            }`}
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Peek Solution Button */}
          <button
            onClick={() => setShowSolutionModal(true)}
            className="px-3 py-2 text-xs font-semibold text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-xl transition-colors flex items-center gap-1.5 font-code"
          >
            <Eye className="w-3.5 h-3.5 text-cyan-400" />
            <span>Peek Solution</span>
          </button>

          {/* Achievements Trophy Button */}
          {onOpenAchievements && (
            <button
              onClick={onOpenAchievements}
              className="p-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-amber-400/60 text-amber-400 transition-colors relative"
              title="Buka Lemari Prestasi & Pencapaian Ksatria"
              aria-label="Buka Lemari Prestasi & Pencapaian Ksatria"
            >
              <Trophy className="w-4 h-4" />
              {user.achievements && Object.values(user.achievements).some((a) => !a.claimed) && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full animate-ping" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Main Split Layout: Left Canvas | Right IDE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Pane: Canvas Game Area (lg:col-span-7) */}
        <div className="lg:col-span-7 flex flex-col gap-3">
          {/* Canvas Box */}
          <div className="relative bg-[#07090f] border-2 border-slate-800 rounded-2xl overflow-hidden shadow-2xl p-2 flex flex-col items-center">
            {/* Simulation Canvas */}
            <canvas
              ref={canvasRef}
              width={640}
              height={440}
              className="w-full max-w-full aspect-[16/11] rounded-xl canvas-crisp bg-[#080b12]"
            />

            {/* Canvas HUD Overlay */}
            <div className="w-full flex items-center justify-between px-3 py-2 mt-1 text-xs font-code bg-slate-900/90 rounded-lg border border-slate-800 text-slate-300">
              <div className="flex items-center gap-4">
                {/* Health Bar */}
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">HP:</span>
                  <div className="w-20 h-2.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all"
                      style={{ width: `${Math.max(0, heroRef.current.hp)}%` }}
                    />
                  </div>
                  <span className="text-emerald-400 tabular-nums font-bold">{heroRef.current.hp}/100</span>
                </div>

                {/* Gems collected */}
                <div className="flex items-center gap-1 text-rose-400">
                  <span>💎</span>
                  <span className="tabular-nums font-bold">
                    {gemsRef.current.filter((g) => g.collected).length} / {level.gridMap.gems.length}
                  </span>
                </div>
              </div>

              {/* Simulation Controls: Speed & Reset */}
              <div className="flex items-center gap-2">
                <div className="flex items-center bg-slate-950 rounded-md p-0.5 border border-slate-800">
                  {[1, 2, 4].map((speed) => (
                    <button
                      key={speed}
                      onClick={() => setExecSpeed(speed)}
                      className={`px-2 py-0.5 text-[11px] rounded transition-colors ${
                        execSpeed === speed
                          ? 'bg-amber-500 text-slate-950 font-bold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {speed}x
                    </button>
                  ))}
                </div>

                <button
                  onClick={resetSimulation}
                  disabled={isExecuting}
                  className="p-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors disabled:opacity-40"
                  title="Reset Arena Position"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Level Objectives Card */}
          <div className="bg-[#0b0e17] border border-slate-800 rounded-xl p-4 shadow-md">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Quest Victory Conditions</span>
            </h3>
            <div className="space-y-1.5 text-xs text-slate-300">
              <div className="flex items-start gap-2">
                <span className="text-amber-400 mt-0.5">●</span>
                <span>{level.victoryConditions.loreObjective}</span>
              </div>
              {level.victoryConditions.requiredGems && (
                <div className="flex items-start gap-2 text-slate-400">
                  <span className="text-rose-400 mt-0.5">●</span>
                  <span>Collect all {level.victoryConditions.requiredGems} scattered rubies.</span>
                </div>
              )}
              {level.victoryConditions.defeatEnemies && (
                <div className="flex items-start gap-2 text-slate-400">
                  <span className="text-red-400 mt-0.5">●</span>
                  <span>Eliminate dungeon sentries using `hero.attack()`.</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Pane: Code Editor & Palette (lg:col-span-5) */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          {/* Editor Container */}
          <div className="bg-[#0b0e18] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
            {/* Editor Header */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-[#101524] border-b border-slate-800 text-xs">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-amber-400" />
                <span className="font-code font-semibold text-slate-200">
                  main.{selectedLanguage === 'python' ? 'py' : 'js'}
                </span>
              </div>
              <button
                onClick={() => setCode(level.starterCode[selectedLanguage])}
                className="text-[11px] text-slate-400 hover:text-amber-400 transition-colors font-code"
              >
                Reset Starter Code
              </button>
            </div>

            {/* Code Input Area with Line Numbers */}
            <div className="relative flex bg-[#07090f] min-h-[300px] max-h-[360px] overflow-hidden font-code text-xs leading-relaxed">
              {/* Line Numbers Bar */}
              <div className="select-none py-3 px-2 bg-[#090c14] border-r border-slate-800/80 text-right text-slate-600 font-mono w-10 shrink-0">
                {Array.from({ length: Math.max(12, code.split('\n').length) }).map((_, idx) => (
                  <div
                    key={idx}
                    className={`leading-relaxed transition-colors ${
                      executingLine === idx + 1
                        ? 'text-amber-300 font-bold bg-amber-500/25 rounded px-1'
                        : ''
                    }`}
                  >
                    {idx + 1}
                  </div>
                ))}
              </div>

              {/* Textarea */}
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                onKeyDown={handleKeyDown}
                spellCheck={false}
                placeholder={`# Write ${selectedLanguage} commands here...`}
                className="w-full h-full min-h-[300px] p-3 bg-transparent text-slate-100 placeholder-slate-600 resize-none focus:outline-none font-code text-xs leading-relaxed selection:bg-amber-500/30"
              />
            </div>

            {/* Spellbook Snippet Palette */}
            <div className="p-3 bg-[#0e1322] border-t border-slate-800">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center justify-between">
                <span>Runic Spellbook (Click to Insert)</span>
                <span className="text-amber-400/80">Tab = 4 Spaces</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {[
                  'hero.moveRight()',
                  'hero.moveLeft()',
                  'hero.moveUp()',
                  'hero.moveDown()',
                  'hero.attack()'
                ].map((snippet) => (
                  <button
                    key={snippet}
                    type="button"
                    onClick={() => handleInsertSnippet(selectedLanguage === 'javascript' ? `${snippet};` : snippet)}
                    className="px-2 py-1 bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-slate-700/80 rounded-md font-code text-[11px] transition-colors"
                  >
                    +{snippet}
                  </button>
                ))}
              </div>
            </div>

            {/* Primary Run / Cast Code Button */}
            <div className="p-3 bg-[#111728] border-t border-slate-800 flex items-center justify-between gap-3">
              <div className="text-[11px] text-slate-400 font-code">
                {isExecuting ? (
                  <span className="text-amber-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 animate-spin" /> Casting Rune Sequence...
                  </span>
                ) : (
                  <span>Ready to execute</span>
                )}
              </div>

              <button
                onClick={handleExecuteCode}
                disabled={isExecuting}
                className="px-6 py-2.5 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 hover:brightness-110 shadow-lg shadow-amber-500/25 transition-all flex items-center gap-2 font-fantasy text-sm disabled:opacity-50"
              >
                <Play className="w-4 h-4 fill-slate-950" />
                <span>{isExecuting ? 'Executing...' : 'Cast Code / Run'}</span>
              </button>
            </div>
          </div>

          {/* Quick Concept Hint Card */}
          <div className="bg-[#0b0e17] border border-slate-800 rounded-xl p-4 shadow-md text-xs text-slate-400 space-y-2">
            <div className="font-semibold text-slate-200 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-cyan-400" />
              <span>Curriculum Insight</span>
            </div>
            <p className="leading-relaxed">
              {level.hints[0] || 'Remember to check syntax and case sensitivity!'}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Console Log Pane */}
      <div className="bg-[#070a12] border border-slate-800 rounded-2xl p-4 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
          <div className="flex items-center gap-2 font-code text-slate-300 font-semibold">
            <Terminal className="w-4 h-4 text-amber-400" />
            <span>Spellcasting Console & Execution Log</span>
          </div>
          <button
            onClick={() => setConsoleLogs([])}
            className="text-[11px] text-slate-500 hover:text-slate-300 transition-colors font-code"
          >
            Clear Log
          </button>
        </div>

        <div className="mt-3 font-code text-xs space-y-1 max-h-40 overflow-y-auto pr-2">
          {consoleLogs.length === 0 ? (
            <div className="text-slate-600 italic">No output logged yet. Click "Cast Code / Run" to execute actions.</div>
          ) : (
            consoleLogs.map((log) => {
              let colorClass = 'text-slate-300';
              let badge = 'LOG';
              if (log.type === 'hero') {
                colorClass = 'text-cyan-300';
                badge = 'HERO';
              } else if (log.type === 'success') {
                colorClass = 'text-emerald-400 font-semibold';
                badge = 'DONE';
              } else if (log.type === 'warn') {
                colorClass = 'text-amber-400';
                badge = 'WARN';
              } else if (log.type === 'error') {
                colorClass = 'text-rose-400 font-semibold';
                badge = 'ERR!';
              }

              return (
                <div key={log.id} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-slate-600 text-[10px] tabular-nums shrink-0">{log.timestamp}</span>
                  <span className="text-[10px] px-1 rounded bg-slate-900 border border-slate-800 text-slate-400 shrink-0">
                    {badge}
                  </span>
                  <span className={`${colorClass} flex-1`}>{log.text}</span>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Peek Solution Modal */}
      {showSolutionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-[#0e1422] border border-slate-700 rounded-2xl shadow-2xl overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white font-fantasy">Solution Spell Scroll</h3>
              <button
                onClick={() => setShowSolutionModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-slate-300">
              Here is the standard master solution for <span className="font-semibold text-amber-300">{level.title}</span> in {selectedLanguage.toUpperCase()}:
            </p>
            <div className="bg-[#07090f] p-4 rounded-xl border border-slate-800 font-code text-xs text-amber-200 overflow-x-auto whitespace-pre">
              {level.solutionCode[selectedLanguage]}
            </div>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  setCode(level.solutionCode[selectedLanguage]);
                  setShowSolutionModal(false);
                  addConsoleMessage('info', 'Master solution code imported into your spellbook.');
                }}
                className="px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors font-code"
              >
                Load Solution into Editor
              </button>
              <button
                onClick={() => setShowSolutionModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Victory Celebration Modal */}
      {showVictoryModal && victoryStats && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-300">
          <div className="w-full max-w-md bg-[#0d1322] border-2 border-amber-500/50 rounded-3xl shadow-2xl p-6 sm:p-8 text-center space-y-5 relative overflow-hidden">
            {/* Ambient golden glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

            <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/40 mx-auto flex items-center justify-center text-3xl shadow-lg shadow-amber-500/20">
              🏆
            </div>

            <div>
              <div className="text-xs uppercase font-bold tracking-widest text-amber-400 font-code">
                Quest Complete
              </div>
              <h2 className="text-2xl font-black text-white font-fantasy tracking-wide mt-1">
                {level.title}
              </h2>
            </div>

            {/* Stars */}
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3].map((star) => (
                <div
                  key={star}
                  className={`transform transition-transform duration-500 ${
                    star <= victoryStats.stars ? 'scale-110 text-amber-400' : 'text-slate-700'
                  }`}
                >
                  <Star className={`w-8 h-8 ${star <= victoryStats.stars ? 'fill-amber-400' : ''}`} />
                </div>
              ))}
            </div>

            {/* Rewards Card */}
            <div className="grid grid-cols-2 gap-3 p-3.5 bg-slate-900/80 rounded-xl border border-slate-800 font-code text-xs">
              <div className="flex flex-col items-center">
                <span className="text-slate-400">Arcane XP</span>
                <span className="text-cyan-400 text-lg font-bold">+{victoryStats.xp}</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-slate-400">Soul Gems</span>
                <span className="text-amber-400 text-lg font-bold">+{victoryStats.gems}</span>
              </div>
            </div>

            <div className="text-xs text-slate-400">
              Completed in {victoryStats.stepsCount} commands with {victoryStats.stars} Stars!
            </div>

            {/* Modal Actions */}
            <div className="space-y-2.5 pt-2">
              {!isFullAccess ? (
                <div className="space-y-2">
                  <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/50 text-xs text-amber-200 text-left">
                    <div className="font-bold text-amber-300 font-fantasy text-sm flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span>Level 1 (Trial) Berhasil Ditaklukkan! 🎉</span>
                    </div>
                    <p className="mt-1 text-slate-300 leading-relaxed">
                      Materi berikutnya (Level 2 s/d 9) terkunci. Daftarkan akun siswa barumu sekarang agar disetujui oleh <strong>Pak GuruAI / Admin</strong> untuk membuka seluruh kurikulum dan realm!
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setShowVictoryModal(false);
                      if (onOpenRegister) {
                        onOpenRegister();
                      } else {
                        onBackToMap();
                      }
                    }}
                    className="w-full py-3.5 px-4 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-300 hover:brightness-110 shadow-lg shadow-amber-500/25 transition-all flex items-center justify-center gap-2 font-fantasy text-sm"
                  >
                    <span>Daftar Siswa Baru Sekarang (Buka Level 2-9)</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              ) : nextLevel ? (
                <button
                  onClick={() => {
                    setShowVictoryModal(false);
                    onSelectLevel(nextLevel);
                  }}
                  className="w-full py-3 px-4 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-300 hover:brightness-110 shadow-lg shadow-amber-500/25 transition-all flex items-center justify-center gap-2 font-fantasy text-sm"
                >
                  <span>Maju ke Materi Berikutnya</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => {
                    setShowVictoryModal(false);
                    onBackToMap();
                  }}
                  className="w-full py-3 px-4 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-300 hover:brightness-110 shadow-lg shadow-amber-500/25 transition-all flex items-center justify-center gap-2 font-fantasy text-sm"
                >
                  <span>Kembali ke Quest Map</span>
                </button>
              )}

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setShowVictoryModal(false);
                    resetSimulation();
                  }}
                  className="flex-1 py-2 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors font-code"
                >
                  Replay Quest
                </button>
                <button
                  onClick={() => {
                    setShowVictoryModal(false);
                    onBackToMap();
                  }}
                  className="flex-1 py-2 text-xs font-semibold text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors font-code"
                >
                  Quest Map
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
