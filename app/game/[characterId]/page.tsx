import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { characters, spells, characterSpells, enemies } from '@/lib/db/schema'
import { eq, inArray } from 'drizzle-orm'
import { BattleArena } from '@/components/battle-arena'

interface GamePageProps {
  params: {
    characterId: string
  }
}

export default async function GamePage({ params }: GamePageProps) {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session?.user) {
    redirect('/sign-in')
  }

  const characterId = parseInt(params.characterId, 10)
  if (isNaN(characterId)) {
    redirect('/')
  }

  try {
    // Get character
    const characterData = await db
      .select()
      .from(characters)
      .where(eq(characters.id, characterId))

    if (!characterData.length) {
      throw new Error(`Character ${characterId} not found`)
    }

    const character = characterData[0]

    if (character.userId !== session.user.id) {
      throw new Error('Unauthorized: Character does not belong to user')
    }

    // Get character spells
    const characterSpellData = await db
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

    // Get all enemies
    const enemyData = await db
      .select()
      .from(enemies)

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4">
        <div className="max-w-5xl mx-auto">
          <BattleArena
            character={character as any}
            enemies={enemyData as any}
            characterSpells={characterSpellData as any}
            userId={session.user.id}
          />
        </div>
      </div>
    )
  } catch (error) {
    console.error('[v0] Game page error:', error)
    redirect('/')
  }
}
