'use client'

import { useEffect, useState } from 'react'
import { MockBattleArena } from '@/components/mock-battle-arena'
import Link from 'next/link'
import * as mockBattles from '@/app/actions/mock-battles'

interface Character {
  id: number
  name: string
  level: number
  health: number
  maxHealth: number
  mana: number
  maxMana: number
  attack: number
  defense: number
  speed: number
  critChance: number
}

interface Spell {
  id: number
  name: string
  type: 'attack' | 'heal' | 'buff' | 'debuff'
  manaCost: number
  power: number
  element: string
  description?: string
}

interface Enemy {
  id: number
  name: string
  level: number
  health: number
  maxHealth: number
  mana: number
  maxMana: number
  attack: number
  defense: number
  speed: number
  spellIds: number[]
  experienceReward: number
}

// Mock data for battle system
const mockCharacter: Character = {
  id: 1,
  name: 'Flame Mage',
  level: 1,
  health: 100,
  maxHealth: 100,
  mana: 50,
  maxMana: 50,
  attack: 10,
  defense: 5,
  speed: 8,
  critChance: 10,
}

const mockSpells: Spell[] = [
  {
    id: 1,
    name: 'Fireball',
    type: 'attack',
    manaCost: 20,
    power: 35,
    element: 'fire',
    description: 'Launches a ball of fire at the enemy',
  },
  {
    id: 2,
    name: 'Frostbolt',
    type: 'attack',
    manaCost: 18,
    power: 30,
    element: 'ice',
    description: 'Fires a bolt of ice',
  },
]

const mockEnemies: Enemy[] = [
  {
    id: 1,
    name: 'Goblin',
    level: 1,
    health: 30,
    maxHealth: 30,
    mana: 10,
    maxMana: 10,
    attack: 5,
    defense: 2,
    speed: 7,
    spellIds: [1],
    experienceReward: 50,
  },
  {
    id: 2,
    name: 'Skeleton Knight',
    level: 2,
    health: 50,
    maxHealth: 50,
    mana: 15,
    maxMana: 15,
    attack: 12,
    defense: 4,
    speed: 5,
    spellIds: [1, 2],
    experienceReward: 100,
  },
]

export default function BattlePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      <div className="max-w-5xl mx-auto">
        <MockBattleArena
          character={mockCharacter}
          enemies={mockEnemies}
          characterSpells={mockSpells}
          userId="demo-user"
        />
      </div>
    </div>
  )
}
