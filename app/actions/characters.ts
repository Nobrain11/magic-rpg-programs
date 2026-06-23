'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { characters, characterSpells } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')
  return session.user.id
}

export async function createCharacter(name: string, selectedSpellIds: number[]) {
  const userId = await getUserId()
  
  // Create the character
  const result = await db
    .insert(characters)
    .values({
      userId,
      name,
      level: 1,
      experience: 0,
      health: 100,
      maxHealth: 100,
      mana: 50,
      maxMana: 50,
      attack: 10,
      defense: 5,
      speed: 8,
      critChance: 10,
    })
    .returning()
  
  const characterId = result[0].id
  
  // Assign selected spells to the character
  for (const spellId of selectedSpellIds) {
    await db
      .insert(characterSpells)
      .values({
        characterId,
        spellId,
      })
  }
  
  revalidatePath('/')
  return characterId
}

export async function getCharacters() {
  const userId = await getUserId()
  
  return db
    .select()
    .from(characters)
    .where(eq(characters.userId, userId))
}

export async function getCharacter(characterId: number) {
  const userId = await getUserId()
  
  const result = await db
    .select()
    .from(characters)
    .where(eq(characters.id, characterId))
  
  if (!result.length) throw new Error('Character not found')
  if (result[0].userId !== userId) throw new Error('Unauthorized')
  
  return result[0]
}
