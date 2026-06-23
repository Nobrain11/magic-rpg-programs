import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getAllSpells } from '@/app/actions/spells'
import { CharacterCreation } from '@/components/character-creation'

export default async function CreateCharacterPage() {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session?.user) {
    redirect('/sign-in')
  }

  const spells = await getAllSpells()

  return <CharacterCreation spells={spells} />
}
