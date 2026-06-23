'use server'

import { db } from '@/lib/db'
import { spells, characterSpells } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function getAllSpells() {
  return db.select().from(spells)
}

export async function getCharacterSpells(characterId: number) {
  const result = await db
    .select({
      id: spells.id,
      name: spells.name,
      description: spells.description,
      type: spells.type,
      manaCost: spells.manaCost,
      power: spells.power,
      element: spells.element,
    })
    .from(characterSpells)
    .innerJoin(spells, eq(characterSpells.spellId, spells.id))
    .where(eq(characterSpells.characterId, characterId))
  
  return result
}
