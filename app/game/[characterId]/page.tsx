import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getCharacter } from '@/app/actions/characters'
import { getCharacterSpells } from '@/app/actions/spells'
import { getAllEnemies } from '@/app/actions/enemies'
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

  const characterId = parseInt(params.characterId)
  if (isNaN(characterId)) {
    redirect('/')
  }

  try {
    const character = await getCharacter(characterId)
    const spells = await getCharacterSpells(characterId)
    const enemies = await getAllEnemies()

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4">
        <div className="max-w-5xl mx-auto">
          <BattleArena
            character={character as any}
            enemies={enemies as any}
            characterSpells={spells as any}
            userId={session.user.id}
          />
        </div>
      </div>
    )
  } catch (error) {
    console.error('Failed to load game:', error)
    redirect('/')
  }
}
