'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { battles, characters, enemies } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import {
  initiateCombat,
  executeCharacterAction,
  CombatState,
  Action,
  CharacterStats,
  EnemyStats,
} from '@/lib/combat'
import { getCharacterSpells } from './spells'

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')
  return session.user.id
}

export async function startBattle(characterId: number, enemyId: number) {
  const userId = await getUserId()

  // Verify character ownership
  const charResult = await db
    .select()
    .from(characters)
    .where(eq(characters.id, characterId))

  if (!charResult.length) throw new Error('Character not found')
  if (charResult[0].userId !== userId) throw new Error('Unauthorized')

  // Get enemy
  const enemyResult = await db
    .select()
    .from(enemies)
    .where(eq(enemies.id, enemyId))

  if (!enemyResult.length) throw new Error('Enemy not found')

  const character = charResult[0]
  const enemy = enemyResult[0]

  const characterStats: CharacterStats = {
    health: character.health,
    maxHealth: character.maxHealth,
    mana: character.mana,
    maxMana: character.maxMana,
    attack: character.attack,
    defense: character.defense,
    speed: character.speed,
    critChance: character.critChance,
  }

  const enemyStats: EnemyStats = {
    health: enemy.health,
    maxHealth: enemy.maxHealth,
    mana: enemy.mana,
    maxMana: enemy.maxMana,
    attack: enemy.attack,
    defense: enemy.defense,
    speed: enemy.speed,
    spellIds: (enemy.spellIds as number[]) || [],
  }

  const initialState = initiateCombat(characterStats, enemyStats)

  return {
    characterId,
    enemyId,
    state: initialState,
  }
}

export async function performBattleAction(
  characterId: number,
  enemyId: number,
  currentState: CombatState,
  action: Action
) {
  const userId = await getUserId()

  // Verify character ownership
  const charResult = await db
    .select()
    .from(characters)
    .where(eq(characters.id, characterId))

  if (!charResult.length) throw new Error('Character not found')
  if (charResult[0].userId !== userId) throw new Error('Unauthorized')

  const character = charResult[0]

  // Get enemy
  const enemyResult = await db
    .select()
    .from(enemies)
    .where(eq(enemies.id, enemyId))

  if (!enemyResult.length) throw new Error('Enemy not found')

  const enemy = enemyResult[0]

  const characterStats: CharacterStats = {
    health: character.health,
    maxHealth: character.maxHealth,
    mana: character.mana,
    maxMana: character.maxMana,
    attack: character.attack,
    defense: character.defense,
    speed: character.speed,
    critChance: character.critChance,
  }

  const enemyStats: EnemyStats = {
    health: enemy.health,
    maxHealth: enemy.maxHealth,
    mana: enemy.mana,
    maxMana: enemy.maxMana,
    attack: enemy.attack,
    defense: enemy.defense,
    speed: enemy.speed,
    spellIds: (enemy.spellIds as number[]) || [],
  }

  const newState = executeCharacterAction(
    currentState,
    characterStats,
    enemyStats,
    action
  )

  return newState
}

export async function finalizeBattle(
  userId: string,
  characterId: number,
  enemyId: number,
  finalState: CombatState
) {
  // Record the battle
  if (finalState.winner === 'character') {
    // Update character stats
    const character = await db
      .select()
      .from(characters)
      .where(eq(characters.id, characterId))

    if (character.length) {
      const char = character[0]
      const experienceGained = 50 + Math.random() * 50
      const newLevel = Math.floor(
        (char.experience + experienceGained) / 100
      ) + 1

      await db
        .update(characters)
        .set({
          experience: char.experience + Math.floor(experienceGained),
          level: newLevel,
          health: Math.min(char.maxHealth, char.health + 20),
        })
        .where(eq(characters.id, characterId))
    }
  }

  // Record battle in database
  await db.insert(battles).values({
    userId,
    characterId,
    enemyId,
    winner: finalState.winner || 'draw',
    characterFinalHealth: finalState.characterHealth,
    enemyFinalHealth: finalState.enemyHealth,
    experienceGained: finalState.winner === 'character' ? 50 : 0,
    battleLog: finalState.battleLog,
  })
}
