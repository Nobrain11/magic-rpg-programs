'use server'

import {
  initiateCombat,
  executeCharacterAction,
  CombatState,
  Action,
  CharacterStats,
  EnemyStats,
} from '@/lib/combat'

const mockCharacterStats: CharacterStats = {
  health: 100,
  maxHealth: 100,
  mana: 50,
  maxMana: 50,
  attack: 10,
  defense: 5,
  speed: 8,
  critChance: 10,
}

const mockEnemyStats: Record<number, EnemyStats> = {
  1: {
    health: 30,
    maxHealth: 30,
    mana: 10,
    maxMana: 10,
    attack: 5,
    defense: 2,
    speed: 7,
    spellIds: [1],
  },
  2: {
    health: 50,
    maxHealth: 50,
    mana: 15,
    maxMana: 15,
    attack: 12,
    defense: 4,
    speed: 5,
    spellIds: [1, 2],
  },
}

export async function mockStartBattle(characterId: number, enemyId: number) {
  const enemyStats = mockEnemyStats[enemyId] || mockEnemyStats[1]
  const initialState = initiateCombat(mockCharacterStats, enemyStats)

  return {
    characterId,
    enemyId,
    state: initialState,
  }
}

export async function mockPerformBattleAction(
  characterId: number,
  enemyId: number,
  currentState: CombatState,
  action: Action
) {
  const enemyStats = mockEnemyStats[enemyId] || mockEnemyStats[1]
  const newState = executeCharacterAction(
    currentState,
    mockCharacterStats,
    enemyStats,
    action
  )

  return newState
}

export async function mockFinalizeBattle(
  userId: string,
  characterId: number,
  enemyId: number,
  finalState: CombatState
) {
  // Mock finalize - just return success
  return {
    success: true,
    message: 'Battle finalized',
  }
}
