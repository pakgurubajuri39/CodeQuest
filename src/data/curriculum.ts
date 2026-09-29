import { LevelCurriculum, RealmCurriculum, StudentMetric } from '../types/game';

export const REALMS_DATA: RealmCurriculum[] = [
  {
    id: 'dungeon_syntax',
    name: 'Dungeon of Syntax',
    subtitle: 'Realm 1 · Basic Movement & Command Sequencing',
    icon: '🏰',
    badge: 'Beginner Arcane',
    realmOrder: 1,
    colorScheme: 'from-cyan-950 via-slate-900 to-indigo-950',
    description: 'Descend into the ancient stone crypts where mechanical spell runes await. Learn the foundational grammar of code: statements, case sensitivity, invocation, and sequence execution.',
    concepts: ['Statement Sequencing', 'Method Invocation', 'Directional Vectors', 'String Arguments', 'Debugging Call Stacks'],
    levels: [
      {
        id: 'syntax_level_1',
        realmId: 'dungeon_syntax',
        realmName: 'Dungeon of Syntax',
        realmOrder: 1,
        order: 1,
        title: 'Level 1: The Crypt Corridor',
        shortLore: 'Awaken within the stone chambers of Syntax and take your first programmed strides toward freedom.',
        loreDescription: 'Deep within the Obsidian Tombs, an ancient gatekeeper seals the passage. Your runic boots respond solely to command invocations. Direct your hero along the safe corridor to reach the mystic portal.',
        learningObjectives: [
          'Understand that code executes from top to bottom, one command at a time.',
          'Invoke hero movement methods using exact casing: `hero.moveRight()` and `hero.moveDown()`.',
          'Learn to debug mismatched parentheses or spelling errors.'
        ],
        conceptExplanation: `### The Power of Method Invocation
In both Python and JavaScript, we command our hero using **methods** attached to the \`hero\` object.
Each command represents a physical movement action in the dungeon grid.

#### Python Syntax
\`\`\`python
hero.moveRight()
hero.moveDown()
hero.moveRight()
\`\`\`

#### JavaScript Syntax
\`\`\`javascript
hero.moveRight();
hero.moveDown();
hero.moveRight();
\`\`\`

> **Scribe's Warning:** Programming languages are strictly case-sensitive! Typing \`hero.moveright()\` will cause a spell misfire. Always capitalize the 'R' in \`moveRight\`!`,
        starterCode: {
          python: `# Realm 1: Dungeon of Syntax - Level 1
# Guide your hero to the exit portal on the right.
# Use hero.moveRight() and hero.moveDown() to navigate.

hero.moveRight()
# Write the next moves below:
`,
          javascript: `// Realm 1: Dungeon of Syntax - Level 1
// Guide your hero to the exit portal on the right.
// Use hero.moveRight() and hero.moveDown() to navigate.

hero.moveRight();
// Write the next moves below:
`
        },
        solutionCode: {
          python: `hero.moveRight(2)
hero.moveDown(2)
hero.moveRight(3)`,
          javascript: `hero.moveRight(2);
hero.moveDown(2);
hero.moveRight(3);`
        },
        victoryConditions: {
          reachExit: true,
          avoidTraps: true,
          loreObjective: 'Navigate through the corridor and step onto the blue exit portal.'
        },
        rewardXp: 100,
        rewardGems: 25,
        hints: [
          'Look at the grid: The hero starts at (1, 1). The portal is at (6, 3).',
          'You can call hero.moveRight(2) to move two steps in one line!',
          'Watch out for the stone walls—moving into a wall wastes turn mana.'
        ],
        gridMap: {
          width: 8,
          height: 6,
          theme: 'dungeon',
          heroStart: { x: 1, y: 1, dir: 'right' },
          exit: { x: 6, y: 3 },
          walls: [
            { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }, { x: 4, y: 0 }, { x: 5, y: 0 }, { x: 6, y: 0 }, { x: 7, y: 0 },
            { x: 0, y: 1 }, { x: 4, y: 1 }, { x: 5, y: 1 }, { x: 6, y: 1 }, { x: 7, y: 1 },
            { x: 0, y: 2 }, { x: 1, y: 2 }, { x: 2, y: 2 }, { x: 4, y: 2 }, { x: 5, y: 2 }, { x: 6, y: 2 }, { x: 7, y: 2 },
            { x: 0, y: 3 }, { x: 1, y: 3 }, { x: 2, y: 3 }, { x: 7, y: 3 },
            { x: 0, y: 4 }, { x: 1, y: 4 }, { x: 2, y: 4 }, { x: 3, y: 4 }, { x: 4, y: 4 }, { x: 5, y: 4 }, { x: 6, y: 4 }, { x: 7, y: 4 },
            { x: 0, y: 5 }, { x: 1, y: 5 }, { x: 2, y: 5 }, { x: 3, y: 5 }, { x: 4, y: 5 }, { x: 5, y: 5 }, { x: 6, y: 5 }, { x: 7, y: 5 }
          ],
          spikes: [],
          gems: [
            { id: 'g1', x: 2, y: 1 },
            { id: 'g2', x: 4, y: 3 }
          ],
          enemies: []
        }
      },
      {
        id: 'syntax_level_2',
        realmId: 'dungeon_syntax',
        realmName: 'Dungeon of Syntax',
        realmOrder: 1,
        order: 2,
        title: 'Level 2: Chamber of the Ruby',
        shortLore: 'Gather scattered soul rubies while stepping around ancient spike pressure plates.',
        loreDescription: 'The chamber floor is rigged with cursed spike traps. The ancient scribes left behind sparkling rubies containing spell charges. Gather every ruby to unseal the gate.',
        learningObjectives: [
          'Pass numerical arguments to movement functions: `hero.moveUp(steps)`.',
          'Calculate coordinates to avoid danger tiles (spikes).',
          'Collect items while navigating complex pathways.'
        ],
        conceptExplanation: `### Numeric Arguments & Multi-Step Movement
Instead of typing \`hero.moveRight()\` five separate times, you can pass an integer parameter to tell the hero how many steps to travel.

\`\`\`python
# Moves 3 tiles in a single line
hero.moveRight(3)
hero.moveUp(2)
\`\`\`

\`\`\`javascript
// JavaScript equivalent
hero.moveRight(3);
hero.moveUp(2);
\`\`\`

Gems are automatically collected when your hero steps into their coordinate tile!`,
        starterCode: {
          python: `# Level 2: Chamber of the Ruby
# Collect both rubies and avoid stepping on the rusty floor spikes!

hero.moveRight(2)
# Collect the rubies and reach the portal at (6, 4)
`,
          javascript: `// Level 2: Chamber of the Ruby
// Collect both rubies and avoid stepping on the rusty floor spikes!

hero.moveRight(2);
// Collect the rubies and reach the portal at (6, 4)
`
        },
        solutionCode: {
          python: `hero.moveRight(2)
hero.moveDown(2)
hero.moveRight(2)
hero.moveDown(1)
hero.moveRight(1)`,
          javascript: `hero.moveRight(2);
hero.moveDown(2);
hero.moveRight(2);
hero.moveDown(1);
hero.moveRight(1);`
        },
        victoryConditions: {
          reachExit: true,
          avoidTraps: true,
          requiredGems: 2,
          loreObjective: 'Collect all 2 rubies, avoid spike traps, and reach the sanctuary.'
        },
        rewardXp: 150,
        rewardGems: 40,
        hints: [
          'The floor spikes at (2, 2) and (4, 2) deal fatal damage.',
          'Safe path: moveRight(2) to get gem 1, moveDown(2), moveRight(2) to get gem 2, moveDown(1), moveRight(1).',
          'Each gem gives you bonus score and restores stamina!'
        ],
        gridMap: {
          width: 8,
          height: 6,
          theme: 'dungeon',
          heroStart: { x: 1, y: 1, dir: 'right' },
          exit: { x: 6, y: 4 },
          walls: [
            { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }, { x: 4, y: 0 }, { x: 5, y: 0 }, { x: 6, y: 0 }, { x: 7, y: 0 },
            { x: 0, y: 1 }, { x: 7, y: 1 },
            { x: 0, y: 2 }, { x: 7, y: 2 },
            { x: 0, y: 3 }, { x: 7, y: 3 },
            { x: 0, y: 4 }, { x: 7, y: 4 },
            { x: 0, y: 5 }, { x: 1, y: 5 }, { x: 2, y: 5 }, { x: 3, y: 5 }, { x: 4, y: 5 }, { x: 5, y: 5 }, { x: 6, y: 5 }, { x: 7, y: 5 }
          ],
          spikes: [
            { x: 2, y: 2 },
            { x: 4, y: 2 },
            { x: 3, y: 4 },
            { x: 4, y: 4 }
          ],
          gems: [
            { id: 'g1', x: 3, y: 1 },
            { id: 'g2', x: 5, y: 3 }
          ],
          enemies: []
        }
      },
      {
        id: 'syntax_level_3',
        realmId: 'dungeon_syntax',
        realmName: 'Dungeon of Syntax',
        realmOrder: 1,
        order: 3,
        title: "Level 3: Sentry's Gate",
        shortLore: 'A dungeon goblin guards the heavy iron portcullis. Draw your blade and strike!',
        loreDescription: 'To escape Realm 1, you must confront the dungeon sentry. Approach the goblin guardian and execute `hero.attack()` to clear the exit path.',
        learningObjectives: [
          'Execute the `hero.attack()` combat method.',
          'Coordinate positioning so your hero is adjacent to the target before striking.',
          'Combine movement and combat actions in seamless sequence.'
        ],
        conceptExplanation: `### Invoking Combat Methods
Your hero has an equipped Runic Spellblade. When you stand next to an enemy, invoking \`hero.attack()\` will strike them for heavy damage.

\`\`\`python
# Move next to the enemy
hero.moveRight(2)
# Strike the monster
hero.attack()
hero.attack()
# Proceed to portal
hero.moveRight(2)
\`\`\`

\`\`\`javascript
// In JavaScript
hero.moveRight(2);
hero.attack();
hero.attack();
hero.moveRight(2);
\`\`\`

Enemies have HP (Health Points). Stronger enemies may require two strikes to fall!`,
        starterCode: {
          python: `# Level 3: Sentry's Gate
# Approach the goblin sentry, defeat it with hero.attack(), and escape!

hero.moveRight(2)
# Attack the goblin, then walk through the gate
`,
          javascript: `// Level 3: Sentry's Gate
// Approach the goblin sentry, defeat it with hero.attack(), and escape!

hero.moveRight(2);
// Attack the goblin, then walk through the gate
`
        },
        solutionCode: {
          python: `hero.moveRight(2)
hero.attack()
hero.moveRight(3)`,
          javascript: `hero.moveRight(2);
hero.attack();
hero.moveRight(3);`
        },
        victoryConditions: {
          reachExit: true,
          defeatEnemies: true,
          loreObjective: 'Vanquish the goblin sentry and step across the threshold to Realm 2.'
        },
        rewardXp: 200,
        rewardGems: 50,
        hints: [
          'Walk up to coordinate (3, 2) where the goblin is located.',
          'Invoke hero.attack() to deal lethal weapon damage.',
          'Once the goblin is eliminated, continue right to the portal.'
        ],
        gridMap: {
          width: 8,
          height: 5,
          theme: 'dungeon',
          heroStart: { x: 1, y: 2, dir: 'right' },
          exit: { x: 6, y: 2 },
          walls: [
            { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }, { x: 4, y: 0 }, { x: 5, y: 0 }, { x: 6, y: 0 }, { x: 7, y: 0 },
            { x: 0, y: 1 }, { x: 7, y: 1 },
            { x: 0, y: 2 }, { x: 7, y: 2 },
            { x: 0, y: 3 }, { x: 7, y: 3 },
            { x: 0, y: 4 }, { x: 1, y: 4 }, { x: 2, y: 4 }, { x: 3, y: 4 }, { x: 4, y: 4 }, { x: 5, y: 4 }, { x: 6, y: 4 }, { x: 7, y: 4 }
          ],
          spikes: [],
          gems: [
            { id: 'g1', x: 2, y: 2 }
          ],
          enemies: [
            { id: 'e1', name: 'Goblin Sentry', x: 4, y: 2, hp: 20, maxHp: 20, type: 'goblin', isAlive: true }
          ]
        }
      }
    ]
  },
  {
    id: 'forest_loops',
    name: 'Forest of Loops',
    subtitle: 'Realm 2 · Iteration, While-Loops & For-Loops',
    icon: '🌲',
    badge: 'Loop Weaver',
    realmOrder: 2,
    colorScheme: 'from-emerald-950 via-slate-900 to-teal-950',
    description: 'Enter the bioluminescent woods where ancient roots wrap around spiral corridors. Harness the eternal power of loops to repeat actions without duplicate code.',
    concepts: ['While-True Game Loops', 'Bounded For-Loops', 'Loop Counters', 'DRY (Don’t Repeat Yourself)', 'Safe Exit Conditions'],
    levels: [
      {
        id: 'loops_level_1',
        realmId: 'forest_loops',
        realmName: 'Forest of Loops',
        realmOrder: 2,
        order: 4,
        title: 'Level 4: Whispering Woods',
        shortLore: 'The forest trail twists in an identical repetitive pattern. Use a loop to traverse it effortlessly.',
        loreDescription: 'Writing repetitive code makes mages tired and prone to errors. The sacred rule of programming is DRY: Don\'t Repeat Yourself. Use a loop to repeat a step pattern until reaching the sacred grove.',
        learningObjectives: [
          'Understand how `while` and `for` loops eliminate redundant statements.',
          'Identify repetitive patterns in spatial movement (e.g., right then down).',
          'Write a clean 4-iteration loop to traverse long distances.'
        ],
        conceptExplanation: `### The Essence of Loops
Suppose you need to walk up and right 4 times. Instead of repeating 8 lines of code:

\`\`\`python
# Python for-loop with range
for i in range(4):
    hero.moveRight()
    hero.moveDown()
\`\`\`

\`\`\`javascript
// JavaScript standard for-loop
for (let i = 0; i < 4; i++) {
    hero.moveRight();
    hero.moveDown();
}
\`\`\`

Every turn through the loop is called an **iteration**. The block of code inside the loop executes repeatedly!`,
        starterCode: {
          python: `# Realm 2: Forest of Loops - Level 4
# Notice the stair-step pattern: Right, then Down!
# Repeat the movement 4 times using a for loop.

for i in range(4):
    hero.moveRight()
    # What comes next in the stair step?
`,
          javascript: `// Realm 2: Forest of Loops - Level 4
// Notice the stair-step pattern: Right, then Down!
// Repeat the movement 4 times using a for loop.

for (let i = 0; i < 4; i++) {
    hero.moveRight();
    // What comes next in the stair step?
}
`
        },
        solutionCode: {
          python: `for i in range(4):
    hero.moveRight()
    hero.moveDown()`,
          javascript: `for (let i = 0; i < 4; i++) {
    hero.moveRight();
    hero.moveDown();
}`
        },
        victoryConditions: {
          reachExit: true,
          avoidTraps: true,
          loreObjective: 'Traverse the staircase of roots using a concise loop.'
        },
        rewardXp: 220,
        rewardGems: 60,
        hints: [
          'The stairs go Right, Down, Right, Down, Right, Down, Right, Down.',
          'Put hero.moveRight() and hero.moveDown() inside the loop body.',
          'Notice how 4 lines of loop code do the work of 8 lines!'
        ],
        gridMap: {
          width: 8,
          height: 7,
          theme: 'forest',
          heroStart: { x: 1, y: 1, dir: 'right' },
          exit: { x: 5, y: 5 },
          walls: [
            { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }, { x: 4, y: 0 }, { x: 5, y: 0 }, { x: 6, y: 0 }, { x: 7, y: 0 },
            { x: 0, y: 1 }, { x: 3, y: 1 }, { x: 4, y: 1 }, { x: 5, y: 1 }, { x: 6, y: 1 }, { x: 7, y: 1 },
            { x: 0, y: 2 }, { x: 1, y: 2 }, { x: 4, y: 2 }, { x: 5, y: 2 }, { x: 6, y: 2 }, { x: 7, y: 2 },
            { x: 0, y: 3 }, { x: 1, y: 3 }, { x: 2, y: 3 }, { x: 5, y: 3 }, { x: 6, y: 3 }, { x: 7, y: 3 },
            { x: 0, y: 4 }, { x: 1, y: 4 }, { x: 2, y: 4 }, { x: 3, y: 4 }, { x: 6, y: 4 }, { x: 7, y: 4 },
            { x: 0, y: 5 }, { x: 1, y: 5 }, { x: 2, y: 5 }, { x: 3, y: 5 }, { x: 4, y: 5 }, { x: 7, y: 5 },
            { x: 0, y: 6 }, { x: 1, y: 6 }, { x: 2, y: 6 }, { x: 3, y: 6 }, { x: 4, y: 6 }, { x: 5, y: 6 }, { x: 6, y: 6 }, { x: 7, y: 6 }
          ],
          spikes: [],
          gems: [
            { id: 'g1', x: 2, y: 2 },
            { id: 'g2', x: 3, y: 3 },
            { id: 'g3', x: 4, y: 4 }
          ],
          enemies: []
        }
      },
      {
        id: 'loops_level_2',
        realmId: 'forest_loops',
        realmName: 'Forest of Loops',
        realmOrder: 2,
        order: 5,
        title: 'Level 5: Grove of Repetition',
        shortLore: 'A ring of enchanted emeralds rests inside an ancient fairy circle.',
        loreDescription: 'To harvest the emeralds, you must walk around the perimeter of the grove. By grouping your turns inside a loop that runs 4 times, you can patrol the square perimeter with pristine code elegance.',
        learningObjectives: [
          'Recognize square symmetry in movement sequences.',
          'Use a loop with length 4 to trace all four sides of a square clearing.',
          'Collect 4 emeralds in a single automated patrol.'
        ],
        conceptExplanation: `### Looping Over Geometrical Patterns
A square has 4 equal sides. Each side requires moving forward and then turning 90 degrees.
With a loop, you only code one side!

\`\`\`python
# Move along all 4 edges of the clearing
for side in range(4):
    hero.moveRight(2)
    # Turn and move next direction...
\`\`\`

Notice how each iteration handles one edge of the forest glade!`,
        starterCode: {
          python: `# Level 5: Grove of Repetition
# Collect the 4 emeralds arranged in a square ring!
# Write a loop to patrol all 4 directions.

hero.moveRight(3)
hero.moveDown(3)
hero.moveLeft(3)
hero.moveUp(2)
`,
          javascript: `// Level 5: Grove of Repetition
// Collect the 4 emeralds arranged in a square ring!
// Write a loop to patrol all 4 directions.

hero.moveRight(3);
hero.moveDown(3);
hero.moveLeft(3);
hero.moveUp(2);
`
        },
        solutionCode: {
          python: `hero.moveRight(3)
hero.moveDown(3)
hero.moveLeft(3)
hero.moveUp(2)`,
          javascript: `hero.moveRight(3);
hero.moveDown(3);
hero.moveLeft(3);
hero.moveUp(2);`
        },
        victoryConditions: {
          reachExit: true,
          requiredGems: 4,
          loreObjective: 'Gather all 4 emeralds and step onto the sacred root portal.'
        },
        rewardXp: 260,
        rewardGems: 75,
        hints: [
          'Trace the outer edge: 3 steps Right, 3 steps Down, 3 steps Left, 2 steps Up.',
          'Every corner has an emerald waiting to be harvested.',
          'The exit portal opens at (1, 2) when all gems are claimed.'
        ],
        gridMap: {
          width: 7,
          height: 6,
          theme: 'forest',
          heroStart: { x: 1, y: 1, dir: 'right' },
          exit: { x: 1, y: 2 },
          walls: [
            { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }, { x: 4, y: 0 }, { x: 5, y: 0 }, { x: 6, y: 0 },
            { x: 0, y: 1 }, { x: 6, y: 1 },
            { x: 0, y: 2 }, { x: 2, y: 2 }, { x: 3, y: 2 }, { x: 6, y: 2 },
            { x: 0, y: 3 }, { x: 2, y: 3 }, { x: 3, y: 3 }, { x: 6, y: 3 },
            { x: 0, y: 4 }, { x: 6, y: 4 },
            { x: 0, y: 5 }, { x: 1, y: 5 }, { x: 2, y: 5 }, { x: 3, y: 5 }, { x: 4, y: 5 }, { x: 5, y: 5 }, { x: 6, y: 5 }
          ],
          spikes: [],
          gems: [
            { id: 'g1', x: 4, y: 1 },
            { id: 'g2', x: 4, y: 4 },
            { id: 'g3', x: 1, y: 4 },
            { id: 'g4', x: 1, y: 3 }
          ],
          enemies: []
        }
      },
      {
        id: 'loops_level_3',
        realmId: 'forest_loops',
        realmName: 'Forest of Loops',
        realmOrder: 2,
        order: 6,
        title: "Level 6: Treant's Clearing",
        shortLore: 'A line of corrupt forest sprites blocks the sacred trail.',
        loreDescription: 'Corrupt wood sprites appear along the forest lane at regular intervals. Use a loop to advance, strike each sprite, and advance again!',
        learningObjectives: [
          'Combine combat actions inside iterative loops.',
          'Optimize code structure to handle repeating enemy encounters.',
          'Defeat multiple foes with concise program logic.'
        ],
        conceptExplanation: `### Combat Inside Loops
When enemies are spaced at equal intervals, your hero can perform an **advance-and-strike sequence** on repeat!

\`\`\`python
for i in range(3):
    hero.moveRight(1)
    hero.attack()
hero.moveRight(1)
\`\`\`

\`\`\`javascript
for (let i = 0; i < 3; i++) {
    hero.moveRight(1);
    hero.attack();
}
hero.moveRight(1);
\`\`\`

Notice how repeating the attack command inside the loop cleans up repetitive code!`,
        starterCode: {
          python: `# Level 6: Treant's Clearing
# Three forest sprites stand between you and the ancient archway.
# Slay the sprite in front, then advance!

for i in range(3):
    hero.attack()
    hero.moveRight(1)
hero.moveRight(2)
`,
          javascript: `// Level 6: Treant's Clearing
// Three forest sprites stand between you and the ancient archway.
// Slay the sprite in front, then advance!

for (let i = 0; i < 3; i++) {
    hero.attack();
    hero.moveRight(1);
}
hero.moveRight(2);
`
        },
        solutionCode: {
          python: `for i in range(3):
    hero.attack()
    hero.moveRight(1)
hero.moveRight(2)`,
          javascript: `for (let i = 0; i < 3; i++) {
    hero.attack();
    hero.moveRight(1);
}
hero.moveRight(2);`
        },
        victoryConditions: {
          reachExit: true,
          defeatEnemies: true,
          loreObjective: 'Vanquish the corrupt sprites and clear the forest glade.'
        },
        rewardXp: 300,
        rewardGems: 90,
        hints: [
          'There are 3 sprites waiting along the line.',
          'Each iteration: move 1 tile right, then hero.attack().',
          'After the loop ends, make 1 final move right into the exit portal.'
        ],
        gridMap: {
          width: 8,
          height: 5,
          theme: 'forest',
          heroStart: { x: 1, y: 2, dir: 'right' },
          exit: { x: 6, y: 2 },
          walls: [
            { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }, { x: 4, y: 0 }, { x: 5, y: 0 }, { x: 6, y: 0 }, { x: 7, y: 0 },
            { x: 0, y: 1 }, { x: 7, y: 1 },
            { x: 0, y: 2 }, { x: 7, y: 2 },
            { x: 0, y: 3 }, { x: 7, y: 3 },
            { x: 0, y: 4 }, { x: 1, y: 4 }, { x: 2, y: 4 }, { x: 3, y: 4 }, { x: 4, y: 4 }, { x: 5, y: 4 }, { x: 6, y: 4 }, { x: 7, y: 4 }
          ],
          spikes: [],
          gems: [],
          enemies: [
            { id: 'e1', name: 'Wood Sprite', x: 2, y: 2, hp: 15, maxHp: 15, type: 'dummy', isAlive: true },
            { id: 'e2', name: 'Wood Sprite', x: 3, y: 2, hp: 15, maxHp: 15, type: 'dummy', isAlive: true },
            { id: 'e3', name: 'Wood Sprite', x: 4, y: 2, hp: 15, maxHp: 15, type: 'dummy', isAlive: true }
          ]
        }
      }
    ]
  },
  {
    id: 'mountain_variables',
    name: 'Mountain of Variables',
    subtitle: 'Realm 3 · Variables, Dynamic States & If/Else Logic',
    icon: '⛰️',
    badge: 'Archmage of Logic',
    realmOrder: 3,
    colorScheme: 'from-amber-950 via-slate-900 to-red-950',
    description: 'Ascend the jagged volcanic peaks where lava flows and mountain sentinels test your decision making. Store information in variables and cast conditional spells with if/else branches.',
    concepts: ['Variables & Assignment', 'Integer Counters & Distance', 'Boolean Logic & Comparison Operators', 'If / Else Branching', 'Adaptive Decision Making'],
    levels: [
      {
        id: 'var_level_1',
        realmId: 'mountain_variables',
        realmName: 'Mountain of Variables',
        realmOrder: 3,
        order: 7,
        title: 'Level 7: Crystal Crags',
        shortLore: 'Store coordinates and step counts in memory runes to dynamically guide your hero.',
        loreDescription: 'On the volatile mountain ledges, distance fluctuates with magma shifts. Store step counts inside named variables so you can modify path parameters effortlessly.',
        learningObjectives: [
          'Declare and assign values to variables.',
          'Pass variable references into hero functions: `hero.moveRight(steps)`.',
          'Perform basic arithmetic on variables (`steps = steps + 1`).'
        ],
        conceptExplanation: `### Variables: Memory Containers
A variable is a labeled container that stores a value for later use in your code.

\`\`\`python
# Store an integer in a variable
distance = 3
hero.moveRight(distance)
hero.moveDown(2)
hero.moveRight(distance)
\`\`\`

\`\`\`javascript
// In JavaScript
let distance = 3;
hero.moveRight(distance);
hero.moveDown(2);
hero.moveRight(distance);
\`\`\`

Variables make your code readable, adaptable, and easy to maintain!`,
        starterCode: {
          python: `# Realm 3: Mountain of Variables - Level 7
# Store step distances in variables to reach the upper and lower crystal ledges.

steps = 3
hero.moveRight(steps)
hero.moveDown(2)
# Use the steps variable again to reach the portal:
`,
          javascript: `// Realm 3: Mountain of Variables - Level 7
// Store step distances in variables to reach the upper and lower crystal ledges.

let steps = 3;
hero.moveRight(steps);
hero.moveDown(2);
// Use the steps variable again to reach the portal:
`
        },
        solutionCode: {
          python: `steps = 3
hero.moveRight(steps)
hero.moveDown(2)
hero.moveRight(steps)`,
          javascript: `let steps = 3;
hero.moveRight(steps);
hero.moveDown(2);
hero.moveRight(steps);`
        },
        victoryConditions: {
          reachExit: true,
          avoidTraps: true,
          loreObjective: 'Traverse the crags using variable-directed movement.'
        },
        rewardXp: 350,
        rewardGems: 100,
        hints: [
          'Variable `steps` holds the value 3.',
          'Call hero.moveRight(steps) to travel 3 tiles across the bridge.',
          'Descend 2 tiles, then call hero.moveRight(steps) again.'
        ],
        gridMap: {
          width: 8,
          height: 6,
          theme: 'mountain',
          heroStart: { x: 1, y: 1, dir: 'right' },
          exit: { x: 7, y: 3 },
          walls: [
            { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }, { x: 4, y: 0 }, { x: 5, y: 0 }, { x: 6, y: 0 }, { x: 7, y: 0 },
            { x: 0, y: 1 }, { x: 5, y: 1 }, { x: 6, y: 1 },
            { x: 0, y: 2 }, { x: 1, y: 2 }, { x: 2, y: 2 }, { x: 3, y: 2 }, { x: 5, y: 2 }, { x: 6, y: 2 },
            { x: 0, y: 3 }, { x: 1, y: 3 }, { x: 2, y: 3 }, { x: 3, y: 3 },
            { x: 0, y: 4 }, { x: 1, y: 4 }, { x: 2, y: 4 }, { x: 3, y: 4 }, { x: 4, y: 4 }, { x: 5, y: 4 }, { x: 6, y: 4 }, { x: 7, y: 4 },
            { x: 0, y: 5 }, { x: 1, y: 5 }, { x: 2, y: 5 }, { x: 3, y: 5 }, { x: 4, y: 5 }, { x: 5, y: 5 }, { x: 6, y: 5 }, { x: 7, y: 5 }
          ],
          spikes: [],
          gems: [
            { id: 'g1', x: 4, y: 1 },
            { id: 'g2', x: 5, y: 3 }
          ],
          enemies: []
        }
      },
      {
        id: 'var_level_2',
        realmId: 'mountain_variables',
        realmName: 'Mountain of Variables',
        realmOrder: 3,
        order: 8,
        title: "Level 8: Sentinel's Gate",
        shortLore: 'Cursed traps trigger based on conditions. Make the right choice using if/else logic.',
        loreDescription: 'The mountain pass divides into two branches: one path is guarded by an active flame trap, while the other is safe. Inspect conditions and branch your movement using if/else statements.',
        learningObjectives: [
          'Understand `if` conditions and `else` fallbacks.',
          'Evaluate boolean conditions: checking danger vs safety.',
          'Execute different code blocks based on environmental conditions.'
        ],
        conceptExplanation: `### Conditional Decisions with If / Else
In programming, \`if/else\` lets your code make decisions:

\`\`\`python
# Check danger flag
trap_active = True

if trap_active:
    hero.moveRight(2)
    hero.moveDown(2)
else:
    hero.moveRight(4)
\`\`\`

\`\`\`javascript
// In JavaScript
let trapActive = true;

if (trapActive) {
    hero.moveRight(2);
    hero.moveDown(2);
} else {
    hero.moveRight(4);
}
\`\`\`

If the condition is true, the first block runs; otherwise, the code under \`else\` executes!`,
        starterCode: {
          python: `# Level 8: Sentinel's Gate
# Inspect the danger flag and route around the active lava spikes!

trap_active = True

if trap_active:
    hero.moveRight(1)
    hero.moveDown(2)
    hero.moveRight(4)
    hero.moveUp(2)
    hero.moveRight(1)
`,
          javascript: `// Level 8: Sentinel's Gate
// Inspect the danger flag and route around the active lava spikes!

let trapActive = true;

if (trapActive) {
    hero.moveRight(1);
    hero.moveDown(2);
    hero.moveRight(4);
    hero.moveUp(2);
    hero.moveRight(1);
}
`
        },
        solutionCode: {
          python: `trap_active = True

if trap_active:
    hero.moveRight(1)
    hero.moveDown(2)
    hero.moveRight(4)
    hero.moveUp(2)
    hero.moveRight(1)`,
          javascript: `let trapActive = true;

if (trapActive) {
    hero.moveRight(1);
    hero.moveDown(2);
    hero.moveRight(4);
    hero.moveUp(2);
    hero.moveRight(1);
}`
        },
        victoryConditions: {
          reachExit: true,
          avoidTraps: true,
          loreObjective: 'Evade the lethal lava trap by conditional bypass.'
        },
        rewardXp: 400,
        rewardGems: 120,
        hints: [
          'The lava spikes sit directly ahead at (3, 1) and (4, 1).',
          'Because trap_active is True, detour down around the stone pillar.',
          'Re-enter the main path once past the trap zone.'
        ],
        gridMap: {
          width: 8,
          height: 6,
          theme: 'mountain',
          heroStart: { x: 1, y: 1, dir: 'right' },
          exit: { x: 7, y: 1 },
          walls: [
            { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }, { x: 4, y: 0 }, { x: 5, y: 0 }, { x: 6, y: 0 }, { x: 7, y: 0 },
            { x: 0, y: 1 }, { x: 3, y: 2 }, { x: 4, y: 2 },
            { x: 0, y: 2 },
            { x: 0, y: 3 },
            { x: 0, y: 4 }, { x: 1, y: 4 }, { x: 2, y: 4 }, { x: 3, y: 4 }, { x: 4, y: 4 }, { x: 5, y: 4 }, { x: 6, y: 4 }, { x: 7, y: 4 }
          ],
          spikes: [
            { x: 3, y: 1 },
            { x: 4, y: 1 }
          ],
          gems: [
            { id: 'g1', x: 4, y: 3 }
          ],
          enemies: []
        }
      },
      {
        id: 'var_level_3',
        realmId: 'mountain_variables',
        realmName: 'Mountain of Variables',
        realmOrder: 3,
        order: 9,
        title: "Level 9: The Ogre's Summit",
        shortLore: 'Face the mountain warlord atop the volcanic pinnacle in the ultimate test of code.',
        loreDescription: 'The Great Mountain Ogre guards the crown of CodeQuest. His heavy armor requires multiple strategic strikes. Strike down the beast and step into the Hall of Archmages!',
        learningObjectives: [
          'Synthesize loops, combat strikes, and directional movement into a master program.',
          'Execute sequential combat combos against high-HP boss encounters.',
          'Complete the final graduation quest of CodeQuest!'
        ],
        conceptExplanation: `### The Grand Boss Battle
Boss encounters require combining everything you've mastered:
1. **Movement Sequencing** to advance through the arena.
2. **Combat Execution** with \`hero.attack()\` to deplete the boss's HP bar.
3. **Looping Optimization** to deliver relentless combo strikes.

\`\`\`python
# Approach the boss
hero.moveRight(3)
# Deliver 2 strikes to defeat the Ogre
hero.attack()
hero.attack()
# Claim victory!
hero.moveRight(2)
\`\`\`

\`\`\`javascript
// In JavaScript
hero.moveRight(3);
hero.attack();
hero.attack();
hero.moveRight(2);
\`\`\`

Prepare your blade, apprentice. The realm depends on your code!`,
        starterCode: {
          python: `# Realm 3: Final Boss - The Ogre's Summit
# Advance towards the Mountain Ogre, deliver two heavy strikes, and reach the exit!

hero.moveRight(3)
# Strike twice:
hero.attack()

# Advance to the Archmage Portal:
`,
          javascript: `// Realm 3: Final Boss - The Ogre's Summit
// Advance towards the Mountain Ogre, deliver two heavy strikes, and reach the exit!

hero.moveRight(3);
// Strike twice:
hero.attack();

// Advance to the Archmage Portal:
`
        },
        solutionCode: {
          python: `hero.moveRight(3)
hero.attack()
hero.attack()
hero.moveRight(3)`,
          javascript: `hero.moveRight(3);
hero.attack();
hero.attack();
hero.moveRight(3);`
        },
        victoryConditions: {
          reachExit: true,
          defeatEnemies: true,
          loreObjective: 'Slay the Mountain Ogre and ascend as a Master of CodeQuest.'
        },
        rewardXp: 500,
        rewardGems: 200,
        hints: [
          'The Ogre has 40 HP. Each strike deals 25 damage, so 2 hits will defeat it.',
          'Approach coordinate (4, 2), attack twice, then walk right to the victory portal.',
          'Congratulations on reaching the final summit!'
        ],
        gridMap: {
          width: 8,
          height: 5,
          theme: 'mountain',
          heroStart: { x: 1, y: 2, dir: 'right' },
          exit: { x: 7, y: 2 },
          walls: [
            { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }, { x: 4, y: 0 }, { x: 5, y: 0 }, { x: 6, y: 0 }, { x: 7, y: 0 },
            { x: 0, y: 1 }, { x: 7, y: 1 },
            { x: 0, y: 2 },
            { x: 0, y: 3 }, { x: 7, y: 3 },
            { x: 0, y: 4 }, { x: 1, y: 4 }, { x: 2, y: 4 }, { x: 3, y: 4 }, { x: 4, y: 4 }, { x: 5, y: 4 }, { x: 6, y: 4 }, { x: 7, y: 4 }
          ],
          spikes: [],
          gems: [
            { id: 'g1', x: 2, y: 2 },
            { id: 'g2', x: 6, y: 2 }
          ],
          enemies: [
            { id: 'boss_ogre', name: 'Mountain Ogre Warlord', x: 4, y: 2, hp: 40, maxHp: 40, type: 'ogre', isAlive: true }
          ]
        }
      }
    ]
  }
];

// Helper to get flat level list
export const ALL_LEVELS: LevelCurriculum[] = REALMS_DATA.flatMap((r) => r.levels);

export const DEFAULT_INVENTORY = {
  weapon: {
    id: 'wpn_1',
    name: 'Runic Spellblade',
    slot: 'weapon' as const,
    icon: '🗡️',
    statBonus: '+25 ATK Damage',
    rarity: 'rare' as const,
    lore: 'Forged in the obsidian fires of Syntax, responds to strict camelCase invocations.'
  },
  tome: {
    id: 'tom_1',
    name: 'Codex of Loops',
    slot: 'tome' as const,
    icon: '📖',
    statBonus: '-20% Loop Mana Cost',
    rarity: 'epic' as const,
    lore: 'An ancient scroll illuminating the secrets of eternal while-loops and bounded for-loops.'
  },
  armor: {
    id: 'arm_1',
    name: 'Obsidian Robes',
    slot: 'armor' as const,
    icon: '🛡️',
    statBonus: '+100 Max Health',
    rarity: 'common' as const,
    lore: 'Reinforced weaves enchanted to resist stray syntax error backlash.'
  },
  boots: {
    id: 'bts_1',
    name: 'Hermes Gliders',
    slot: 'boots' as const,
    icon: '👢',
    statBonus: '+25% Grid Step Speed',
    rarity: 'rare' as const,
    lore: 'Instantly teleports the hero across stone tiles upon execution.'
  },
  ring: {
    id: 'rng_1',
    name: 'Ring of Variables',
    slot: 'ring' as const,
    icon: '💍',
    statBonus: '+50% Gem Yield',
    rarity: 'legendary' as const,
    lore: 'Stores pointers to treasure coordinates in crystal memory.'
  }
};

/**
 * MongoDB and PostgreSQL Schema Definitions for database seeding & export
 */
export const DATABASE_SCHEMAS = {
  mongodb: {
    collection: "curriculum_realms",
    schema: {
      $jsonSchema: {
        bsonType: "object",
        required: ["id", "name", "realmOrder", "levels"],
        properties: {
          _id: { bsonType: "objectId" },
          id: { bsonType: "string" },
          name: { bsonType: "string" },
          subtitle: { bsonType: "string" },
          icon: { bsonType: "string" },
          badge: { bsonType: "string" },
          description: { bsonType: "string" },
          concepts: { bsonType: "array", items: { bsonType: "string" } },
          levels: {
            bsonType: "array",
            items: {
              bsonType: "object",
              required: ["id", "title", "starterCode", "solutionCode", "victoryConditions", "gridMap"],
              properties: {
                id: { bsonType: "string" },
                order: { bsonType: "int" },
                title: { bsonType: "string" },
                loreDescription: { bsonType: "string" },
                learningObjectives: { bsonType: "array", items: { bsonType: "string" } },
                conceptExplanation: { bsonType: "string" },
                starterCode: {
                  bsonType: "object",
                  properties: {
                    python: { bsonType: "string" },
                    javascript: { bsonType: "string" }
                  }
                },
                solutionCode: {
                  bsonType: "object",
                  properties: {
                    python: { bsonType: "string" },
                    javascript: { bsonType: "string" }
                  }
                },
                victoryConditions: { bsonType: "object" },
                rewardXp: { bsonType: "int" },
                rewardGems: { bsonType: "int" },
                gridMap: { bsonType: "object" }
              }
            }
          }
        }
      }
    }
  },
  postgresql: {
    tables: [
      `CREATE TABLE realms (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    subtitle VARCHAR(256),
    icon VARCHAR(16),
    badge VARCHAR(64),
    description TEXT,
    realm_order INT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);`,
      `CREATE TABLE levels (
    id VARCHAR(64) PRIMARY KEY,
    realm_id VARCHAR(64) REFERENCES realms(id) ON DELETE CASCADE,
    title VARCHAR(128) NOT NULL,
    order_num INT NOT NULL,
    short_lore VARCHAR(256),
    lore_description TEXT,
    concept_explanation TEXT,
    learning_objectives JSONB,
    starter_code JSONB NOT NULL,
    solution_code JSONB NOT NULL,
    victory_conditions JSONB NOT NULL,
    grid_map JSONB NOT NULL,
    reward_xp INT DEFAULT 100,
    reward_gems INT DEFAULT 25,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);`,
      `CREATE TABLE user_progress (
    user_id VARCHAR(64) NOT NULL,
    level_id VARCHAR(64) REFERENCES levels(id) ON DELETE CASCADE,
    stars INT DEFAULT 0,
    best_code TEXT,
    language VARCHAR(16) DEFAULT 'python',
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (user_id, level_id)
);`
    ]
  }
};

export const MOCK_STUDENT_METRICS: StudentMetric[] = [
  {
    id: 'stu_1',
    name: 'Aria Silverleaf',
    avatar: '🧝‍♀️',
    email: 'aria.silverleaf@academy.edu',
    currentRealm: 'Realm 3: Mountain of Variables',
    currentLevelTitle: 'Level 8: Sentinel\'s Gate',
    completedLevelsCount: 7,
    totalXp: 1850,
    accuracyRate: 94,
    averageAttempts: 1.4,
    commonErrors: ['IndentationError', 'MissingColon'],
    lastActive: '3 mins ago',
    status: 'online',
    approvalStatus: 'approved',
    registeredAt: '2026-09-20'
  },
  {
    id: 'stu_2',
    name: 'Kaelen Shadowbane',
    avatar: '🧙‍♂️',
    email: 'kaelen.s@academy.edu',
    currentRealm: 'Realm 2: Forest of Loops',
    currentLevelTitle: 'Level 6: Treant\'s Clearing',
    completedLevelsCount: 5,
    totalXp: 1220,
    accuracyRate: 88,
    averageAttempts: 2.1,
    commonErrors: ['OffByOneLoop', 'CaseSensitivity'],
    lastActive: '12 mins ago',
    status: 'online',
    approvalStatus: 'approved',
    registeredAt: '2026-09-22'
  },
  {
    id: 'stu_3',
    name: 'Thorin Stonehelm',
    avatar: '🧔',
    email: 'thorin.stone@academy.edu',
    currentRealm: 'Realm 1: Dungeon of Syntax',
    currentLevelTitle: 'Level 1: The Crypt Corridor',
    completedLevelsCount: 1,
    totalXp: 100,
    accuracyRate: 75,
    averageAttempts: 2.8,
    commonErrors: ['UnmatchedParens', 'UnknownCommand'],
    lastActive: '1 hour ago',
    status: 'idle',
    approvalStatus: 'pending',
    registeredAt: '2026-09-28'
  },
  {
    id: 'stu_4',
    name: 'Lyra Dawnchaser',
    avatar: '🏹',
    email: 'lyra.dawn@academy.edu',
    currentRealm: 'Realm 3: Mountain of Variables',
    currentLevelTitle: 'Level 9: The Ogre\'s Summit',
    completedLevelsCount: 8,
    totalXp: 2400,
    accuracyRate: 98,
    averageAttempts: 1.2,
    commonErrors: ['SyntaxError'],
    lastActive: 'Just now',
    status: 'online',
    approvalStatus: 'approved',
    registeredAt: '2026-09-18'
  },
  {
    id: 'stu_5',
    name: 'Boran Ironhide',
    avatar: '🛡️',
    email: 'boran.iron@academy.edu',
    currentRealm: 'Realm 1: Dungeon of Syntax',
    currentLevelTitle: 'Level 1: The Crypt Corridor',
    completedLevelsCount: 1,
    totalXp: 100,
    accuracyRate: 70,
    averageAttempts: 3.4,
    commonErrors: ['InfiniteLoop', 'MisspelledHero'],
    lastActive: '3 hours ago',
    status: 'offline',
    approvalStatus: 'pending',
    registeredAt: '2026-09-28'
  }
];
