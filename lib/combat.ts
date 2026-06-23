// Combat system types and logic
export interface CombatState {
  characterHealth: number
  characterMana: number
  enemyHealth: number
  enemyMana: number
  turn: 'character' | 'enemy'
  battleLog: string[]
  isOver: boolean
  winner: 'character' | 'enemy' | null
}

export interface Action {
  type: 'attack' | 'spell' | 'defend'
  spellId?: number
  spellName?: string
  manaCost?: number
  power?: number
  element?: string
}

export interface CharacterStats {
  health: number
  maxHealth: number
  mana: number
  maxMana: number
  attack: number
  defense: number
  speed: number
  critChance: number
}

export interface EnemyStats {
  health: number
  maxHealth: number
  mana: number
  maxMana: number
  attack: number
  defense: number
  speed: number
  spellIds: number[]
}

export interface Spell {
  id: number
  name: string
  type: 'attack' | 'heal' | 'buff' | 'debuff'
  manaCost: number
  power: number
  element: string
}

// Utility functions
function calculateDamage(
  attacker: CharacterStats | EnemyStats,
  defender: CharacterStats | EnemyStats,
  basePower: number,
  isCrit: boolean
): number {
  let damage = basePower + attacker.attack - defender.defense / 2
  if (isCrit) {
    damage = Math.floor(damage * 1.5)
  }
  return Math.max(1, Math.floor(damage))
}

function checkCritical(critChance: number): boolean {
  return Math.random() * 100 < critChance
}

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// Main combat functions
export function initiateCombat(
  character: CharacterStats,
  enemy: EnemyStats
): CombatState {
  const characterSpeed = character.speed + getRandomInt(-2, 2)
  const enemySpeed = enemy.speed + getRandomInt(-2, 2)

  return {
    characterHealth: character.health,
    characterMana: character.mana,
    enemyHealth: enemy.health,
    enemyMana: enemy.mana,
    turn: characterSpeed >= enemySpeed ? 'character' : 'enemy',
    battleLog: [
      `Battle started! ${characterSpeed >= enemySpeed ? 'Character' : 'Enemy'} goes first.`,
    ],
    isOver: false,
    winner: null,
  }
}

export function executeCharacterAction(
  state: CombatState,
  character: CharacterStats,
  enemy: EnemyStats,
  action: Action
): CombatState {
  const newState = { ...state }

  if (state.turn !== 'character' || state.isOver) {
    return newState
  }

  if (action.type === 'attack') {
    const isCrit = checkCritical(character.critChance)
    const damage = calculateDamage(character, enemy, 10, isCrit)
    newState.enemyHealth -= damage

    newState.battleLog.push(
      `${isCrit ? '⚡ CRITICAL HIT! ' : ''}Character attacks for ${damage} damage!`
    )
  } else if (action.type === 'spell' && action.manaCost && action.power) {
    if (newState.characterMana < action.manaCost) {
      newState.battleLog.push('Not enough mana!')
      return newState
    }

    newState.characterMana -= action.manaCost

    if (action.spellName?.toLowerCase().includes('heal')) {
      const healing = action.power
      const actualHeal = Math.min(healing, character.maxHealth - newState.characterHealth)
      newState.characterHealth += actualHeal
      newState.battleLog.push(`${action.spellName} restored ${actualHeal} health!`)
    } else {
      const isCrit = checkCritical(character.critChance)
      const damage = calculateDamage(character, enemy, action.power, isCrit)
      newState.enemyHealth -= damage
      newState.battleLog.push(
        `${isCrit ? '⚡ CRITICAL! ' : ''}${action.spellName} dealt ${damage} damage!`
      )
    }
  } else if (action.type === 'defend') {
    newState.battleLog.push('Character takes a defensive stance!')
  }

  // Check if battle is over
  if (newState.enemyHealth <= 0) {
    newState.isOver = true
    newState.winner = 'character'
    newState.battleLog.push('Victory! Enemy has been defeated!')
    return newState
  }

  // Enemy turn
  newState.turn = 'enemy'
  return executeEnemyAction(newState, character, enemy)
}

export function executeEnemyAction(
  state: CombatState,
  character: CharacterStats,
  enemy: EnemyStats
): CombatState {
  const newState = { ...state }

  // Simple AI: Attack if healthy, heal if low on health
  const healthPercentage = newState.enemyHealth / enemy.maxHealth
  const shouldHeal = healthPercentage < 0.3 && newState.enemyMana >= 15

  if (shouldHeal) {
    newState.enemyMana -= 15
    const healing = 25
    const actualHeal = Math.min(healing, enemy.maxHealth - newState.enemyHealth)
    newState.enemyHealth += actualHeal
    newState.battleLog.push(`Enemy heals for ${actualHeal} health!`)
  } else {
    const isCrit = checkCritical(5) // Lower crit chance for enemies
    const damage = calculateDamage(enemy, character, 10, isCrit)
    newState.characterHealth -= damage

    newState.battleLog.push(
      `${isCrit ? '⚡ CRITICAL! ' : ''}Enemy attacks for ${damage} damage!`
    )
  }

  // Check if battle is over
  if (newState.characterHealth <= 0) {
    newState.isOver = true
    newState.winner = 'enemy'
    newState.battleLog.push('Defeat! Character has been defeated.')
    return newState
  }

  newState.turn = 'character'
  return newState
}

export function getAvailableActions(
  character: CharacterStats,
  spells: Spell[]
): Action[] {
  const actions: Action[] = [{ type: 'attack' }, { type: 'defend' }]

  for (const spell of spells) {
    if (character.mana >= spell.manaCost) {
      actions.push({
        type: 'spell',
        spellId: spell.id,
        spellName: spell.name,
        manaCost: spell.manaCost,
        power: spell.power,
        element: spell.element,
      })
    }
  }

  return actions
}
