'use server'

import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'

export async function logout() {
  await auth.api.signOut()
  redirect('/sign-in')
}
