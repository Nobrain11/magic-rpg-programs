'use client'

import Link from 'next/link'
import { logout } from '@/app/actions/auth'

interface Character {
  id: number
  name: string
  level: number
  experience: number
  health: number
  maxHealth: number
  mana: number
  maxMana: number
}

interface CharacterSelectionProps {
  characters: Character[]
}

export function CharacterSelection({ characters }: CharacterSelectionProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              Magic RPG
            </h1>
            <p className="text-muted mt-2">Select a character to continue your adventure</p>
          </div>
          <button
            onClick={() => logout()}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm transition-colors"
          >
            Logout
          </button>
        </div>

        {/* Characters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {characters.map((character) => (
            <Link key={character.id} href={`/battle`}>
              <div className="card hover:border-primary/50 cursor-pointer transition-all transform hover:scale-105">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-white">{character.name}</h2>
                    <p className="text-primary font-semibold">Level {character.level}</p>
                  </div>
                  <div className="text-right text-sm text-muted">
                    <p>EXP: {character.experience}</p>
                  </div>
                </div>

                {/* Health Bar */}
                <div className="mb-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300">HP</span>
                    <span className="text-slate-400">
                      {character.health}/{character.maxHealth}
                    </span>
                  </div>
                  <div className="stat-bar">
                    <div
                      className="stat-bar-fill bg-gradient-to-r from-red-500 to-red-600"
                      style={{
                        width: `${(character.health / character.maxHealth) * 100}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Mana Bar */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300">Mana</span>
                    <span className="text-slate-400">
                      {character.mana}/{character.maxMana}
                    </span>
                  </div>
                  <div className="stat-bar">
                    <div
                      className="stat-bar-fill bg-gradient-to-r from-blue-500 to-blue-600"
                      style={{
                        width: `${(character.mana / character.maxMana) * 100}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-700">
                  <p className="text-sm text-primary font-medium">Play Now →</p>
                </div>
              </div>
            </Link>
          ))}

          {/* Create New Character Card */}
          <Link href="/create-character">
            <div className="card border-2 border-dashed border-slate-600 hover:border-primary/50 cursor-pointer transition-all flex items-center justify-center min-h-64">
              <div className="text-center">
                <div className="text-4xl mb-2">+</div>
                <p className="text-white font-semibold">Create New Character</p>
                <p className="text-sm text-muted mt-1">Start a new adventure</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
