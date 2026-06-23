import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getCharacters } from '@/app/actions/characters'
import { getAllSpells } from '@/app/actions/spells'
import { CharacterSelection } from '@/components/character-selection'
import { CharacterCreation } from '@/components/character-creation'

export default async function Home() {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session?.user) {
    redirect('/sign-in')
  }

  const characters = await getCharacters()
  const spells = await getAllSpells()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      {characters.length > 0 ? (
        <CharacterSelection characters={characters} />
      ) : (
        <CharacterCreation spells={spells} />
      )}
    </div>
  )
}
