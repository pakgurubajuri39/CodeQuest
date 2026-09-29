import { ActionType, SimulationStep, SupportedLanguage } from '../types/game';

export interface ParseResult {
  success: boolean;
  steps: SimulationStep[];
  error?: {
    line: number;
    message: string;
    suggestion?: string;
  };
}

export class CodeQuestInterpreter {
  /**
   * Parse user code into executable hero action steps.
   */
  public parse(code: string, language: SupportedLanguage): ParseResult {
    const trimmed = code.trim();
    if (!trimmed) {
      return {
        success: false,
        steps: [],
        error: {
          line: 1,
          message: 'The arcane spellbook is empty! Write commands for your hero.',
          suggestion: 'Try writing: hero.moveRight()'
        }
      };
    }

    try {
      if (language === 'python') {
        return this.parsePython(code);
      } else {
        return this.parseJavaScript(code);
      }
    } catch (err: unknown) {
      const error = err as Error;
      return {
        success: false,
        steps: [],
        error: {
          line: 1,
          message: error.message || 'Spellcasting misfire: Syntax error in command formulation.',
          suggestion: 'Check your spelling, matching parentheses, and line syntax.'
        }
      };
    }
  }

  /**
   * Safe Python parser that handles commands, loops, and variables
   */
  private parsePython(code: string): ParseResult {
    const lines = code.split('\n');
    const steps: SimulationStep[] = [];
    const variables: Record<string, number | boolean | string> = {};

    let i = 0;
    const MAX_STEPS = 120; // safe bounded guard against infinite loops

    while (i < lines.length) {
      if (steps.length >= MAX_STEPS) break;
      const rawLine = lines[i];
      const trimmed = rawLine.trim();
      const lineNum = i + 1;

      // Skip empty lines and comments
      if (!trimmed || trimmed.startsWith('#')) {
        i++;
        continue;
      }

      // Check common typos
      const typoCheck = this.checkCommonTypos(trimmed, lineNum);
      if (typoCheck) return typoCheck;

      // Variable assignment: e.g. steps = 3 or trap_active = True
      const varAssignMatch = trimmed.match(/^([a-zA-Z_]\w*)\s*=\s*(.+)$/);
      if (varAssignMatch && !trimmed.startsWith('if') && !trimmed.startsWith('for') && !trimmed.startsWith('while')) {
        const varName = varAssignMatch[1];
        const rawVal = varAssignMatch[2].trim();
        if (rawVal === 'True') variables[varName] = true;
        else if (rawVal === 'False') variables[varName] = false;
        else if (!isNaN(Number(rawVal))) variables[varName] = Number(rawVal);
        else variables[varName] = rawVal.replace(/['"]/g, '');
        i++;
        continue;
      }

      // For loop: for i in range(N):
      const forMatch = trimmed.match(/^for\s+([a-zA-Z_]\w*)\s+in\s+range\(\s*(\w+)\s*\)\s*:$/);
      if (forMatch) {
        let count = Number(forMatch[2]);
        if (isNaN(count) && forMatch[2] in variables) {
          count = Number(variables[forMatch[2]]);
        }
        if (isNaN(count) || count < 0) count = 0;
        count = Math.min(count, 30); // bound

        // Collect block body (lines indented more than for line)
        const baseIndent = rawLine.search(/\S/);
        const loopBodyLines: { line: string; lineNum: number }[] = [];
        let j = i + 1;
        while (j < lines.length) {
          const bodyLine = lines[j];
          const bodyTrim = bodyLine.trim();
          if (!bodyTrim || bodyTrim.startsWith('#')) {
            j++;
            continue;
          }
          const bodyIndent = bodyLine.search(/\S/);
          if (bodyIndent > baseIndent) {
            loopBodyLines.push({ line: bodyTrim, lineNum: j + 1 });
            j++;
          } else {
            break;
          }
        }

        if (loopBodyLines.length === 0) {
          return {
            success: false,
            steps: [],
            error: {
              line: lineNum,
              message: 'IndentationError: Expected an indented block after for loop statement.',
              suggestion: 'Indent the actions inside the loop with 4 spaces (e.g., hero.moveRight()).'
            }
          };
        }

        // Execute loop body count times
        for (let iter = 0; iter < count; iter++) {
          for (const item of loopBodyLines) {
            if (steps.length >= MAX_STEPS) break;
            const res = this.parseSingleCommand(item.line, item.lineNum, variables);
            if (!res.success) return res;
            if (res.steps.length > 0) steps.push(...res.steps);
          }
        }
        i = j;
        continue;
      }

      // If condition: if condition:
      const ifMatch = trimmed.match(/^if\s+([a-zA-Z_]\w*)\s*:$/);
      if (ifMatch) {
        const condVar = ifMatch[1];
        const isTrue = Boolean(variables[condVar]);

        const baseIndent = rawLine.search(/\S/);
        const ifBodyLines: { line: string; lineNum: number }[] = [];
        const elseBodyLines: { line: string; lineNum: number }[] = [];

        let j = i + 1;
        let inElse = false;

        while (j < lines.length) {
          const bodyLine = lines[j];
          const bodyTrim = bodyLine.trim();
          if (!bodyTrim || bodyTrim.startsWith('#')) {
            j++;
            continue;
          }
          const bodyIndent = bodyLine.search(/\S/);
          if (bodyTrim === 'else:') {
            inElse = true;
            j++;
            continue;
          }
          if (bodyIndent > baseIndent) {
            if (inElse) {
              elseBodyLines.push({ line: bodyTrim, lineNum: j + 1 });
            } else {
              ifBodyLines.push({ line: bodyTrim, lineNum: j + 1 });
            }
            j++;
          } else {
            break;
          }
        }

        const linesToRun = isTrue ? ifBodyLines : elseBodyLines;
        for (const item of linesToRun) {
          if (steps.length >= MAX_STEPS) break;
          const res = this.parseSingleCommand(item.line, item.lineNum, variables);
          if (!res.success) return res;
          if (res.steps.length > 0) steps.push(...res.steps);
        }
        i = j;
        continue;
      }

      // While loop: while True:
      const whileMatch = trimmed.match(/^while\s+(.+)\s*:$/);
      if (whileMatch) {
        // Collect block body
        const baseIndent = rawLine.search(/\S/);
        const loopBodyLines: { line: string; lineNum: number }[] = [];
        let j = i + 1;
        while (j < lines.length) {
          const bodyLine = lines[j];
          const bodyTrim = bodyLine.trim();
          if (!bodyTrim || bodyTrim.startsWith('#')) {
            j++;
            continue;
          }
          const bodyIndent = bodyLine.search(/\S/);
          if (bodyIndent > baseIndent) {
            loopBodyLines.push({ line: bodyTrim, lineNum: j + 1 });
            j++;
          } else {
            break;
          }
        }

        // Bounded while loop (max 10 iterations to prevent freeze)
        const iterations = 8;
        for (let iter = 0; iter < iterations; iter++) {
          for (const item of loopBodyLines) {
            if (steps.length >= MAX_STEPS) break;
            const res = this.parseSingleCommand(item.line, item.lineNum, variables);
            if (!res.success) return res;
            if (res.steps.length > 0) steps.push(...res.steps);
          }
        }
        i = j;
        continue;
      }

      // Single line command
      const singleRes = this.parseSingleCommand(trimmed, lineNum, variables);
      if (!singleRes.success) return singleRes;
      if (singleRes.steps.length > 0) steps.push(...singleRes.steps);

      i++;
    }

    return { success: true, steps };
  }

  /**
   * JavaScript Parser
   */
  private parseJavaScript(code: string): ParseResult {
    const lines = code.split('\n');
    const steps: SimulationStep[] = [];
    const variables: Record<string, number | boolean | string> = {};
    const MAX_STEPS = 120;

    let i = 0;
    while (i < lines.length) {
      if (steps.length >= MAX_STEPS) break;
      const rawLine = lines[i];
      const trimmed = rawLine.trim().replace(/;$/, '');
      const lineNum = i + 1;

      if (!trimmed || trimmed.startsWith('//')) {
        i++;
        continue;
      }

      // Typo check
      const typo = this.checkCommonTypos(trimmed, lineNum);
      if (typo) return typo;

      // Variable declaration: let x = 3; const y = true;
      const varMatch = trimmed.match(/^(?:let|const|var)\s+([a-zA-Z_]\w*)\s*=\s*(.+)$/);
      if (varMatch) {
        const varName = varMatch[1];
        const val = varMatch[2].trim().replace(/;$/, '');
        if (val === 'true') variables[varName] = true;
        else if (val === 'false') variables[varName] = false;
        else if (!isNaN(Number(val))) variables[varName] = Number(val);
        else variables[varName] = val.replace(/['"]/g, '');
        i++;
        continue;
      }

      // For loop: for (let i = 0; i < N; i++) {
      const forMatch = trimmed.match(/^for\s*\(\s*(?:let|var)?\s*\w+\s*=\s*\d+\s*;\s*\w+\s*<\s*(\w+)\s*;\s*\w+\+\+\s*\)\s*\{?$/);
      if (forMatch) {
        let count = Number(forMatch[1]);
        if (isNaN(count) && forMatch[1] in variables) {
          count = Number(variables[forMatch[1]]);
        }
        if (isNaN(count)) count = 3;
        count = Math.min(count, 30);

        // Gather lines inside braces or block
        const bodyLines: { line: string; lineNum: number }[] = [];
        let j = i + 1;
        while (j < lines.length) {
          const bLine = lines[j].trim();
          if (bLine === '}') {
            j++;
            break;
          }
          if (bLine && !bLine.startsWith('//')) {
            bodyLines.push({ line: bLine.replace(/;$/, ''), lineNum: j + 1 });
          }
          j++;
        }

        for (let iter = 0; iter < count; iter++) {
          for (const item of bodyLines) {
            if (steps.length >= MAX_STEPS) break;
            const res = this.parseSingleCommand(item.line, item.lineNum, variables);
            if (!res.success) return res;
            if (res.steps.length > 0) steps.push(...res.steps);
          }
        }
        i = j;
        continue;
      }

      // If condition: if (trapActive) {
      const ifMatch = trimmed.match(/^if\s*\(\s*([a-zA-Z_]\w*)\s*\)\s*\{?$/);
      if (ifMatch) {
        const condName = ifMatch[1];
        const isTrue = Boolean(variables[condName]);

        const ifBody: { line: string; lineNum: number }[] = [];
        const elseBody: { line: string; lineNum: number }[] = [];
        let inElse = false;
        let j = i + 1;

        while (j < lines.length) {
          const bLine = lines[j].trim();
          if (bLine.startsWith('} else') || bLine === 'else {') {
            inElse = true;
            j++;
            continue;
          }
          if (bLine === '}') {
            j++;
            break;
          }
          if (bLine && !bLine.startsWith('//')) {
            if (inElse) elseBody.push({ line: bLine.replace(/;$/, ''), lineNum: j + 1 });
            else ifBody.push({ line: bLine.replace(/;$/, ''), lineNum: j + 1 });
          }
          j++;
        }

        const linesToRun = isTrue ? ifBody : elseBody;
        for (const item of linesToRun) {
          if (steps.length >= MAX_STEPS) break;
          const res = this.parseSingleCommand(item.line, item.lineNum, variables);
          if (!res.success) return res;
          if (res.steps.length > 0) steps.push(...res.steps);
        }
        i = j;
        continue;
      }

      // Single line command
      const singleRes = this.parseSingleCommand(trimmed, lineNum, variables);
      if (!singleRes.success) return singleRes;
      if (singleRes.steps.length > 0) steps.push(...singleRes.steps);

      i++;
    }

    return { success: true, steps };
  }

  /**
   * Parse a single method call: hero.moveRight(3), hero.attack(), etc.
   */
  private parseSingleCommand(
    rawCmd: string,
    lineNum: number,
    variables: Record<string, number | boolean | string>
  ): ParseResult {
    const cmd = rawCmd.replace(/;$/, '').trim();
    if (!cmd) return { success: true, steps: [] };

    // Matches hero.<method>(<arg>)
    const match = cmd.match(/^hero\.([a-zA-Z_]\w*)\s*\((.*)\)$/);
    if (!match) {
      if (cmd.startsWith('hero.')) {
        return {
          success: false,
          steps: [],
          error: {
            line: lineNum,
            message: `SyntaxError: Missing parentheses on method invocation: "${cmd}"`,
            suggestion: `Add parentheses: "${cmd}()"`
          }
        };
      }
      return {
        success: false,
        steps: [],
        error: {
          line: lineNum,
          message: `Unknown command or expression: "${cmd}"`,
          suggestion: 'Available commands: hero.moveRight(), hero.moveLeft(), hero.moveUp(), hero.moveDown(), hero.attack()'
        }
      };
    }

    const method = match[1];
    const rawArg = match[2].trim();
    let stepCount = 1;

    if (rawArg) {
      if (!isNaN(Number(rawArg))) {
        stepCount = Number(rawArg);
      } else if (rawArg in variables) {
        const val = Number(variables[rawArg]);
        if (!isNaN(val)) stepCount = val;
      }
    }
    stepCount = Math.max(1, Math.min(stepCount, 15)); // constrain

    const steps: SimulationStep[] = [];

    switch (method) {
      case 'moveRight':
        for (let s = 0; s < stepCount; s++) {
          steps.push({ type: 'MOVE_RIGHT', steps: 1, line: lineNum, comment: `hero.moveRight()` });
        }
        break;
      case 'moveLeft':
        for (let s = 0; s < stepCount; s++) {
          steps.push({ type: 'MOVE_LEFT', steps: 1, line: lineNum, comment: `hero.moveLeft()` });
        }
        break;
      case 'moveUp':
        for (let s = 0; s < stepCount; s++) {
          steps.push({ type: 'MOVE_UP', steps: 1, line: lineNum, comment: `hero.moveUp()` });
        }
        break;
      case 'moveDown':
        for (let s = 0; s < stepCount; s++) {
          steps.push({ type: 'MOVE_DOWN', steps: 1, line: lineNum, comment: `hero.moveDown()` });
        }
        break;
      case 'attack':
        steps.push({ type: 'ATTACK', line: lineNum, comment: 'hero.attack()' });
        break;
      case 'collect':
        steps.push({ type: 'COLLECT', line: lineNum, comment: 'hero.collect()' });
        break;
      case 'wait':
        steps.push({ type: 'WAIT', line: lineNum, comment: 'hero.wait()' });
        break;
      default:
        return {
          success: false,
          steps: [],
          error: {
            line: lineNum,
            message: `AttributeError: 'hero' object has no attribute '${method}'`,
            suggestion: `Did you mean: ${this.suggestMethod(method)}?`
          }
        };
    }

    return { success: true, steps };
  }

  /**
   * Catch common beginner typos with intelligent suggestions
   */
  private checkCommonTypos(line: string, lineNum: number): ParseResult | null {
    const lower = line.toLowerCase();
    if (lower.startsWith('hero.moveright') && !line.includes('moveRight')) {
      return {
        success: false,
        steps: [],
        error: {
          line: lineNum,
          message: 'Case Sensitivity Error: "moveright" must be camelCase "moveRight".',
          suggestion: 'Change to hero.moveRight()'
        }
      };
    }
    if (lower.startsWith('hero.moveleft') && !line.includes('moveLeft')) {
      return {
        success: false,
        steps: [],
        error: {
          line: lineNum,
          message: 'Case Sensitivity Error: "moveleft" must be camelCase "moveLeft".',
          suggestion: 'Change to hero.moveLeft()'
        }
      };
    }
    if (lower.startsWith('hero.movedown') && !line.includes('moveDown')) {
      return {
        success: false,
        steps: [],
        error: {
          line: lineNum,
          message: 'Case Sensitivity Error: "movedown" must be camelCase "moveDown".',
          suggestion: 'Change to hero.moveDown()'
        }
      };
    }
    if (lower.startsWith('hero.moveup') && !line.includes('moveUp')) {
      return {
        success: false,
        steps: [],
        error: {
          line: lineNum,
          message: 'Case Sensitivity Error: "moveup" must be camelCase "moveUp".',
          suggestion: 'Change to hero.moveUp()'
        }
      };
    }
    return null;
  }

  private suggestMethod(m: string): string {
    const target = m.toLowerCase();
    if (target.includes('right')) return 'hero.moveRight()';
    if (target.includes('left')) return 'hero.moveLeft()';
    if (target.includes('up')) return 'hero.moveUp()';
    if (target.includes('down')) return 'hero.moveDown()';
    if (target.includes('att') || target.includes('hit') || target.includes('slash')) return 'hero.attack()';
    return 'hero.moveRight()';
  }
}

export const interpreter = new CodeQuestInterpreter();
