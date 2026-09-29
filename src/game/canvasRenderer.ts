import { GridEnemy, GridItem, GridMap } from '../types/game';

export interface FloatingText {
  id: string;
  text: string;
  x: number;
  y: number;
  color: string;
  opacity: number;
  offsetY: number;
}

export interface HeroState {
  x: number;
  y: number;
  renderX: number;
  renderY: number;
  dir: 'up' | 'down' | 'left' | 'right';
  hp: number;
  maxHp: number;
  isAttacking: boolean;
  attackProgress: number; // 0 to 1
  slashDir: 'up' | 'down' | 'left' | 'right';
}

export class CodeQuestCanvasRenderer {
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private animFrameId: number | null = null;
  private tick: number = 0;

  public init(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
  }

  public render(
    map: GridMap,
    hero: HeroState,
    gems: GridItem[],
    enemies: GridEnemy[],
    floatingTexts: FloatingText[],
    isExecuting: boolean
  ) {
    if (!this.canvas || !this.ctx) return;
    const ctx = this.ctx;
    const width = this.canvas.width;
    const height = this.canvas.height;

    this.tick += 0.05;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    const tileSizeX = width / map.width;
    const tileSizeY = height / map.height;
    const tileSize = Math.min(tileSizeX, tileSizeY);
    const offsetX = (width - map.width * tileSize) / 2;
    const offsetY = (height - map.height * tileSize) / 2;

    // 1. Draw Background & Floor Tiles
    for (let r = 0; r < map.height; r++) {
      for (let c = 0; c < map.width; c++) {
        const x = offsetX + c * tileSize;
        const y = offsetY + r * tileSize;
        this.drawFloorTile(ctx, x, y, tileSize, c, r, map.theme);
      }
    }

    // 2. Draw Walls
    for (const wall of map.walls) {
      const x = offsetX + wall.x * tileSize;
      const y = offsetY + wall.y * tileSize;
      this.drawWallTile(ctx, x, y, tileSize, map.theme);
    }

    // 3. Draw Spike Traps
    for (const spike of map.spikes) {
      const x = offsetX + spike.x * tileSize;
      const y = offsetY + spike.y * tileSize;
      this.drawSpikeTile(ctx, x, y, tileSize);
    }

    // 4. Draw Exit Portal
    const exitX = offsetX + map.exit.x * tileSize;
    const exitY = offsetY + map.exit.y * tileSize;
    this.drawPortal(ctx, exitX, exitY, tileSize, map.theme);

    // 5. Draw Gems
    for (const gem of gems) {
      if (!gem.collected) {
        const x = offsetX + gem.x * tileSize;
        const y = offsetY + gem.y * tileSize;
        this.drawGem(ctx, x, y, tileSize, gem.id);
      }
    }

    // 6. Draw Enemies
    for (const enemy of enemies) {
      const x = offsetX + enemy.x * tileSize;
      const y = offsetY + enemy.y * tileSize;
      this.drawEnemy(ctx, x, y, tileSize, enemy);
    }

    // 7. Draw Hero
    const heroScreenX = offsetX + hero.renderX * tileSize;
    const heroScreenY = offsetY + hero.renderY * tileSize;
    this.drawHero(ctx, heroScreenX, heroScreenY, tileSize, hero);

    // 8. Draw Attack Slash Effect
    if (hero.isAttacking) {
      this.drawAttackSlash(ctx, heroScreenX, heroScreenY, tileSize, hero);
    }

    // 9. Draw Floating Combat Text
    for (const ft of floatingTexts) {
      const ftX = offsetX + ft.x * tileSize + tileSize / 2;
      const ftY = offsetY + ft.y * tileSize - ft.offsetY;
      ctx.save();
      ctx.globalAlpha = Math.max(0, ft.opacity);
      ctx.font = 'bold 13px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillStyle = '#05070a';
      ctx.fillText(ft.text, ftX + 1, ftY + 1); // Shadow
      ctx.fillStyle = ft.color;
      ctx.fillText(ft.text, ftX, ftY);
      ctx.restore();
    }

    // Grid Coordinates Subtle Legend (Bottom Corner)
    ctx.save();
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.textAlign = 'right';
    ctx.fillText(`HERO POS: (${hero.x}, ${hero.y})`, width - 12, height - 10);
    ctx.restore();
  }

  private drawFloorTile(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    size: number,
    c: number,
    r: number,
    theme: string
  ) {
    const isAlt = (c + r) % 2 === 0;

    if (theme === 'dungeon') {
      ctx.fillStyle = isAlt ? '#141a29' : '#111522';
      ctx.fillRect(x, y, size, size);
      // Subtle stone border
      ctx.strokeStyle = '#1b2336';
      ctx.lineWidth = 1;
      ctx.strokeRect(x + 0.5, y + 0.5, size - 1, size - 1);
      // Small cobblestone speckles
      if ((c * 3 + r * 7) % 5 === 0) {
        ctx.fillStyle = '#1c263c';
        ctx.fillRect(x + size * 0.3, y + size * 0.4, size * 0.15, size * 0.1);
      }
    } else if (theme === 'forest') {
      ctx.fillStyle = isAlt ? '#0c221b' : '#081a14';
      ctx.fillRect(x, y, size, size);
      ctx.strokeStyle = '#113329';
      ctx.lineWidth = 1;
      ctx.strokeRect(x + 0.5, y + 0.5, size - 1, size - 1);
      // Grass tufts
      if ((c * 4 + r) % 3 === 0) {
        ctx.fillStyle = '#104938';
        ctx.fillRect(x + size * 0.6, y + size * 0.5, 3, 5);
        ctx.fillRect(x + size * 0.65, y + size * 0.45, 3, 6);
      }
    } else {
      // Mountain / Magma
      ctx.fillStyle = isAlt ? '#221415' : '#1a0e10';
      ctx.fillRect(x, y, size, size);
      ctx.strokeStyle = '#381c1c';
      ctx.lineWidth = 1;
      ctx.strokeRect(x + 0.5, y + 0.5, size - 1, size - 1);
      // Magma vein
      if ((c + r * 2) % 4 === 0) {
        ctx.fillStyle = 'rgba(239, 68, 68, 0.2)';
        ctx.fillRect(x + size * 0.2, y + size * 0.7, size * 0.5, 2);
      }
    }
  }

  private drawWallTile(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, theme: string) {
    if (theme === 'dungeon') {
      ctx.fillStyle = '#0a0d14';
      ctx.fillRect(x, y, size, size);
      // Top wall bevel
      ctx.fillStyle = '#1f293d';
      ctx.fillRect(x + 2, y + 2, size - 4, size * 0.4);
      // Front wall face
      ctx.fillStyle = '#151c2b';
      ctx.fillRect(x + 2, y + size * 0.4, size - 4, size * 0.6 - 2);
      // Brick seams
      ctx.strokeStyle = '#090c12';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(x + 2, y + 2, size - 4, size - 4);
    } else if (theme === 'forest') {
      ctx.fillStyle = '#05110d';
      ctx.fillRect(x, y, size, size);
      // Dense foliage / ancient tree trunk
      ctx.fillStyle = '#0d3829';
      ctx.beginPath();
      ctx.arc(x + size / 2, y + size / 2, size * 0.45, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#10523b';
      ctx.beginPath();
      ctx.arc(x + size / 2, y + size / 2, size * 0.35, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Mountain Crags
      ctx.fillStyle = '#15090b';
      ctx.fillRect(x, y, size, size);
      ctx.fillStyle = '#2f1519';
      ctx.beginPath();
      ctx.moveTo(x + size / 2, y + 3);
      ctx.lineTo(x + size - 3, y + size - 3);
      ctx.lineTo(x + 3, y + size - 3);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#4a2025';
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }

  private drawSpikeTile(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
    ctx.save();
    // Metal base plate
    ctx.fillStyle = '#2d181e';
    ctx.fillRect(x + size * 0.15, y + size * 0.15, size * 0.7, size * 0.7);

    // Spikes points
    const points = [
      { px: x + size * 0.3, py: y + size * 0.3 },
      { px: x + size * 0.7, py: y + size * 0.3 },
      { px: x + size * 0.3, py: y + size * 0.7 },
      { px: x + size * 0.7, py: y + size * 0.7 },
      { px: x + size * 0.5, py: y + size * 0.5 }
    ];

    for (const pt of points) {
      ctx.fillStyle = '#94a3b8';
      ctx.beginPath();
      ctx.moveTo(pt.px, pt.py - size * 0.12);
      ctx.lineTo(pt.px + size * 0.08, pt.py + size * 0.08);
      ctx.lineTo(pt.px - size * 0.08, pt.py + size * 0.08);
      ctx.closePath();
      ctx.fill();
      // Red tip
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(pt.px, pt.py - size * 0.12, 2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  private drawPortal(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, theme: string) {
    ctx.save();
    const cx = x + size / 2;
    const cy = y + size / 2;
    const radius = size * 0.38;

    // Glowing base
    let coreColor = '#38bdf8';
    let outerGlow = 'rgba(56, 189, 248, 0.25)';
    if (theme === 'forest') {
      coreColor = '#34d399';
      outerGlow = 'rgba(52, 211, 153, 0.25)';
    } else if (theme === 'mountain') {
      coreColor = '#f59e0b';
      outerGlow = 'rgba(245, 158, 11, 0.25)';
    }

    // Outer aura
    const gradient = ctx.createRadialGradient(cx, cy, radius * 0.2, cx, cy, radius * 1.3);
    gradient.addColorStop(0, coreColor);
    gradient.addColorStop(0.7, outerGlow);
    gradient.addColorStop(1, 'transparent');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 1.3, 0, Math.PI * 2);
    ctx.fill();

    // Swirling runes / ring
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(this.tick * 1.2);
    ctx.strokeStyle = coreColor;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 1.5);
    ctx.stroke();

    // Inner rune
    ctx.rotate(-this.tick * 2.5);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.5, 0, Math.PI);
    ctx.stroke();
    ctx.restore();

    ctx.restore();
  }

  private drawGem(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, id: string) {
    ctx.save();
    const cx = x + size / 2;
    const floatOffset = Math.sin(this.tick * 3 + (id.charCodeAt(0) || 0)) * 4;
    const cy = y + size / 2 + floatOffset;
    const gemSize = size * 0.25;

    // Glow aura
    ctx.fillStyle = 'rgba(244, 63, 94, 0.25)';
    ctx.beginPath();
    ctx.arc(cx, cy, gemSize * 1.6, 0, Math.PI * 2);
    ctx.fill();

    // Diamond polygon
    ctx.fillStyle = '#f43f5e';
    ctx.beginPath();
    ctx.moveTo(cx, cy - gemSize);
    ctx.lineTo(cx + gemSize * 0.8, cy);
    ctx.lineTo(cx, cy + gemSize);
    ctx.lineTo(cx - gemSize * 0.8, cy);
    ctx.closePath();
    ctx.fill();

    // Facet reflection
    ctx.fillStyle = '#fda4af';
    ctx.beginPath();
    ctx.moveTo(cx, cy - gemSize);
    ctx.lineTo(cx + gemSize * 0.3, cy);
    ctx.lineTo(cx, cy);
    ctx.closePath();
    ctx.fill();

    // Twinkle star
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(cx - 1, cy - gemSize * 0.4, 2, 2);
    ctx.restore();
  }

  private drawEnemy(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, enemy: GridEnemy) {
    if (!enemy.isAlive) {
      // Draw defeat skull / smoke marker
      ctx.save();
      const cx = x + size / 2;
      const cy = y + size / 2;
      ctx.font = '16px serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('💀', cx, cy);
      ctx.restore();
      return;
    }

    ctx.save();
    const cx = x + size / 2;
    const cy = y + size / 2;
    const enemyScale = enemy.type === 'ogre' ? 0.42 : 0.32;
    const radius = size * enemyScale;

    // Body
    if (enemy.type === 'ogre') {
      // Ogre body (broad stone armor, horns)
      ctx.fillStyle = '#78350f';
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();
      // Horns
      ctx.fillStyle = '#d97706';
      ctx.beginPath();
      ctx.moveTo(cx - radius * 0.8, cy - radius * 0.6);
      ctx.lineTo(cx - radius * 1.2, cy - radius * 1.1);
      ctx.lineTo(cx - radius * 0.4, cy - radius * 0.8);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(cx + radius * 0.8, cy - radius * 0.6);
      ctx.lineTo(cx + radius * 1.2, cy - radius * 1.1);
      ctx.lineTo(cx + radius * 0.4, cy - radius * 0.8);
      ctx.fill();
      // Glowing red eyes
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(cx - radius * 0.35, cy - radius * 0.2, 3.5, 0, Math.PI * 2);
      ctx.arc(cx + radius * 0.35, cy - radius * 0.2, 3.5, 0, Math.PI * 2);
      ctx.fill();
    } else if (enemy.type === 'goblin') {
      // Goblin (green, sharp ears)
      ctx.fillStyle = '#15803d';
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();
      // Ears
      ctx.fillStyle = '#166534';
      ctx.beginPath();
      ctx.moveTo(cx - radius, cy);
      ctx.lineTo(cx - radius * 1.4, cy - radius * 0.5);
      ctx.lineTo(cx - radius * 0.6, cy - radius * 0.5);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(cx + radius, cy);
      ctx.lineTo(cx + radius * 1.4, cy - radius * 0.5);
      ctx.lineTo(cx + radius * 0.6, cy - radius * 0.5);
      ctx.fill();
      // Yellow eyes
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(cx - radius * 0.3, cy - radius * 0.1, 2.5, 0, Math.PI * 2);
      ctx.arc(cx + radius * 0.3, cy - radius * 0.1, 2.5, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Wood sprite
      ctx.fillStyle = '#14b8a6';
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 0.8, 0, Math.PI * 2);
      ctx.fill();
      // Wings
      ctx.fillStyle = 'rgba(204, 251, 241, 0.6)';
      ctx.beginPath();
      ctx.ellipse(cx - radius, cy - radius * 0.4, radius * 0.5, radius * 0.3, -Math.PI / 4, 0, Math.PI * 2);
      ctx.ellipse(cx + radius, cy - radius * 0.4, radius * 0.5, radius * 0.3, Math.PI / 4, 0, Math.PI * 2);
      ctx.fill();
    }

    // Health Bar above enemy head
    const barWidth = size * 0.8;
    const barHeight = 4;
    const barX = cx - barWidth / 2;
    const barY = cy - radius - 10;
    const hpRatio = Math.max(0, enemy.hp / enemy.maxHp);

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(barX, barY, barWidth, barHeight);
    ctx.fillStyle = hpRatio > 0.4 ? '#ef4444' : '#b91c1c';
    ctx.fillRect(barX, barY, barWidth * hpRatio, barHeight);
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 0.5;
    ctx.strokeRect(barX, barY, barWidth, barHeight);

    // Enemy Name Tag
    ctx.font = '8px "JetBrains Mono", monospace';
    ctx.fillStyle = '#e2e8f0';
    ctx.textAlign = 'center';
    ctx.fillText(`${enemy.name} (${enemy.hp})`, cx, barY - 3);

    ctx.restore();
  }

  private drawHero(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, hero: HeroState) {
    ctx.save();
    const cx = x + size / 2;
    const cy = y + size / 2;
    const radius = size * 0.32;

    // Hero aura shadow
    ctx.fillStyle = 'rgba(14, 165, 233, 0.2)';
    ctx.beginPath();
    ctx.ellipse(cx, cy + radius * 0.8, radius * 0.9, radius * 0.4, 0, 0, Math.PI * 2);
    ctx.fill();

    // Cape
    ctx.fillStyle = '#1e3a8a';
    ctx.beginPath();
    ctx.arc(cx, cy + 2, radius * 1.05, Math.PI * 0.2, Math.PI * 0.8);
    ctx.fill();

    // Armor Body (Dark Runic Obsidian)
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Knight Visor (glowing blue eye slit)
    ctx.fillStyle = '#38bdf8';
    let visorX = cx - radius * 0.4;
    let visorY = cy - radius * 0.2;
    let visorW = radius * 0.8;
    let visorH = 3;

    if (hero.dir === 'right') {
      visorX += 3;
    } else if (hero.dir === 'left') {
      visorX -= 3;
    } else if (hero.dir === 'up') {
      visorY -= 3;
      visorH = 2;
    } else if (hero.dir === 'down') {
      visorY += 3;
    }

    ctx.fillRect(visorX, visorY, visorW, visorH);

    // Held Runic Blade
    ctx.save();
    let swordX = cx + radius * 0.8;
    let swordY = cy;
    let swordAngle = Math.PI / 4;

    if (hero.dir === 'left') {
      swordX = cx - radius * 0.8;
      swordAngle = -Math.PI / 4;
    } else if (hero.dir === 'up') {
      swordY = cy - radius * 0.8;
      swordAngle = 0;
    }

    ctx.translate(swordX, swordY);
    ctx.rotate(swordAngle);
    // Blade
    ctx.fillStyle = '#e0f2fe';
    ctx.fillRect(-2, -12, 4, 14);
    // Crossguard
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(-6, 2, 12, 3);
    // Hilt
    ctx.fillStyle = '#475569';
    ctx.fillRect(-1.5, 5, 3, 5);
    ctx.restore();

    // Hero Health Bar
    const barWidth = size * 0.75;
    const barHeight = 4;
    const barX = cx - barWidth / 2;
    const barY = cy - radius - 10;
    const hpRatio = Math.max(0, hero.hp / hero.maxHp);

    ctx.fillStyle = '#090d16';
    ctx.fillRect(barX, barY, barWidth, barHeight);
    ctx.fillStyle = '#10b981';
    ctx.fillRect(barX, barY, barWidth * hpRatio, barHeight);
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 0.5;
    ctx.strokeRect(barX, barY, barWidth, barHeight);

    ctx.restore();
  }

  private drawAttackSlash(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, hero: HeroState) {
    ctx.save();
    const cx = x + size / 2;
    const cy = y + size / 2;

    let targetX = cx + size * 0.7;
    let targetY = cy;
    let startAngle = -Math.PI / 3;
    let endAngle = Math.PI / 3;

    if (hero.dir === 'left') {
      targetX = cx - size * 0.7;
      startAngle = Math.PI * 0.7;
      endAngle = Math.PI * 1.3;
    } else if (hero.dir === 'up') {
      targetX = cx;
      targetY = cy - size * 0.7;
      startAngle = -Math.PI * 0.8;
      endAngle = -Math.PI * 0.2;
    } else if (hero.dir === 'down') {
      targetX = cx;
      targetY = cy + size * 0.7;
      startAngle = Math.PI * 0.2;
      endAngle = Math.PI * 0.8;
    }

    // Glowing arc slash
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 3.5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(cx, cy, size * 0.55, startAngle, endAngle);
    ctx.stroke();

    // Bright core
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Slash spark
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(targetX, targetY, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}

export const canvasRenderer = new CodeQuestCanvasRenderer();
