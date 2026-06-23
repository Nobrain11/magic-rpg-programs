'use server'

import { db } from '@/lib/db'
import { enemies } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function getAllEnemies() {
  return db.select().from(enemies)
}

export async function getEnemy(enemyId: number) {
  const result = await db
    .select()
    .from(enemies)
    .where(eq(enemies.id, enemyId))
  
  if (!result.length) throw new Error('Enemy not found')
  return result[0]
}

export async function getEnemiesByLevel(level: number) {
  return db
    .select()
    .from(enemies)
    .where(eq(enemies.level, level))
}
