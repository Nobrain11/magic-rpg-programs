'use client'

import { useState } from 'react'
import { createCharacter } from '@/app/actions/characters'
import { useRouter } from 'next/navigation'

interface Spell {
  id: number
  name: string
  description: string | null
  type: string
  manaCost: number
  power: number
  element: string
}

interface CharacterCreationProps {
  spells: Spell[]
}

export function CharacterCreation({ spells }: CharacterCreationProps) {
  const router = useRouter()
  const [name, setName] = useState('')
  const [selectedSpells, setSelectedSpells] = useState<number[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const maxSpells = 4

  const toggleSpell = (spellId: number) => {
    setSelectedSpells((prev) => {
      if (prev.includes(spellId)) {
        return prev.filter((id) => id !== spellId)
      }
      if (prev.length < maxSpells) {
        return [...prev, spellId]
      }
      return prev
    })
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      setError('Please enter a character name')
      return
    }
    if (selectedSpells.length === 0) {
      setError('Please select at least one spell')
      return
    }

    setLoading(true)
    try {
      const characterId = await createCharacter(name, selectedSpells)
      router.push(`/game/${characterId}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create character')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <div className="card w-full max-w-2xl">
        <h1 className="text-3xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
          Create Your Character
        </h1>
        <p className="text-muted mb-8">Choose a name and select up to 4 spells for your magical journey</p>

        <form onSubmit={handleCreate} className="space-y-6">
          {/* Character Name Input */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2">
              Character Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                setError('')
              }}
              placeholder="Enter your character's name"
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              disabled={loading}
            />
          </div>

          {/* Spell Selection */}
          <div>
            <label className="block text-sm font-medium mb-3">
              Select Spells ({selectedSpells.length}/{maxSpells})
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {spells.map((spell) => (
                <button
                  key={spell.id}
                  type="button"
                  onClick={() => toggleSpell(spell.id)}
                  disabled={loading}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    selectedSpells.includes(spell.id)
                      ? 'border-primary bg-primary/10'
                      : 'border-slate-600 bg-slate-700 hover:border-slate-500'
                  }`}
                >
                  <div className="font-medium text-sm">{spell.name}</div>
                  <div className="text-xs text-muted mt-1">
                    {spell.type} • {spell.element} • {spell.manaCost} mana
                  </div>
                  {spell.description && (
                    <div className="text-xs text-slate-400 mt-2">{spell.description}</div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-sm">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !name.trim() || selectedSpells.length === 0}
            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating Character...' : 'Create Character'}
          </button>
        </form>
      </div>
    </div>
  )
}
