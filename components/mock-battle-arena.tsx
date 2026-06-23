'use client'

import { useState } from 'react'
import { mockStartBattle, mockPerformBattleAction, mockFinalizeBattle } from '@/app/actions/mock-battles'
import { BattleDisplay } from './battle-display'
import { BattleLog } from './battle-log'
import { SpellSelector } from './spell-selector'
import { CombatState, Action, Spell } from '@/lib/combat'
import Link from 'next/link'

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

interface MockBattleArenaProps {
  character: Character
  enemies: Enemy[]
  characterSpells: Spell[]
  userId: string
}

type BattlePhase = 'select' | 'fighting' | 'over'

export function MockBattleArena({
  character,
  enemies,
  characterSpells,
  userId,
}: MockBattleArenaProps) {
  const [phase, setPhase] = useState<BattlePhase>('select')
  const [selectedEnemy, setSelectedEnemy] = useState<Enemy | null>(null)
  const [battleState, setBattleState] = useState<CombatState | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSelectEnemy = async (enemy: Enemy) => {
    setLoading(true)
    try {
      const result = await mockStartBattle(character.id, enemy.id)
      setSelectedEnemy(enemy)
      setBattleState(result.state)
      setPhase('fighting')
    } catch (error) {
      console.error('[v0] Failed to start battle:', error)
      alert(`Failed to start battle: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  const handleAction = async (action: Action) => {
    if (!battleState || !selectedEnemy) return

    setLoading(true)
    try {
      const newState = await mockPerformBattleAction(character.id, selectedEnemy.id, battleState, action)
      setBattleState(newState)

      if (newState.isOver) {
        await mockFinalizeBattle(userId, character.id, selectedEnemy.id, newState)
        setPhase('over')
      }
    } catch (error) {
      console.error('[v0] Failed to perform action:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAttack = () => {
    handleAction({ type: 'attack' })
  }

  const handleDefend = () => {
    handleAction({ type: 'defend' })
  }

  const handleSpellCast = (spell: Spell) => {
    handleAction({
      type: 'spell',
      spellId: spell.id,
      spellName: spell.name,
      manaCost: spell.manaCost,
      power: spell.power,
      element: spell.element,
    })
  }

  if (phase === 'select') {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-2">
            Battle Arena
          </h1>
          <p className="text-slate-400">Select an enemy to challenge</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {enemies.map((enemy) => (
            <button
              key={enemy.id}
              onClick={() => handleSelectEnemy(enemy)}
              disabled={loading}
              className="card hover:border-primary/50 cursor-pointer transition-all text-left"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h2 className="text-xl font-bold text-white">{enemy.name}</h2>
                  <p className="text-primary font-semibold">Level {enemy.level}</p>
                </div>
                <div className="text-right text-sm text-muted">
                  <p>Reward: {enemy.experienceReward} XP</p>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-slate-300">
                  <span>HP: {enemy.health}/{enemy.maxHealth}</span>
                  <span>ATK: {enemy.attack}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>DEF: {enemy.defense}</span>
                  <span>SPD: {enemy.speed}</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-700">
                <p className="text-sm text-primary font-medium">Challenge →</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    )
  }

  if (phase === 'over' && battleState) {
    const isVictory = battleState.winner === 'character'
    return (
      <div className="space-y-6">
        <div className={`text-center p-6 rounded-lg ${isVictory ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
          <h1
            className={`text-3xl font-bold mb-2 ${
              isVictory ? 'text-green-400' : 'text-red-400'
            }`}
          >
            {isVictory ? 'Victory!' : 'Defeat...'}
          </h1>
          <p className="text-slate-300">
            {isVictory
              ? `You defeated ${selectedEnemy?.name}! Gained ${selectedEnemy?.experienceReward} XP`
              : `You were defeated by ${selectedEnemy?.name}.`}
          </p>
        </div>

        <BattleLog messages={battleState.battleLog} />

        <div className="flex gap-4">
          <button
            onClick={() => setPhase('select')}
            className="flex-1 btn-primary"
          >
            Return to Arena
          </button>
          <Link href="/" className="flex-1">
            <button className="w-full btn-secondary">Back to Home</button>
          </Link>
        </div>
      </div>
    )
  }

  if (phase === 'fighting' && battleState && selectedEnemy) {
    const displayCharacter = {
      name: character.name,
      health: battleState.characterHealth,
      maxHealth: character.maxHealth,
      mana: battleState.characterMana,
      maxMana: character.maxMana,
      level: character.level,
    }

    const displayEnemy = {
      name: selectedEnemy.name,
      health: battleState.enemyHealth,
      maxHealth: selectedEnemy.maxHealth,
      mana: battleState.enemyMana,
      maxMana: selectedEnemy.maxMana,
    }

    return (
      <div className="space-y-6">
        <BattleDisplay
          character={displayCharacter}
          enemy={displayEnemy}
          currentTurn={battleState.turn}
        />

        <BattleLog messages={battleState.battleLog} />

        {battleState.turn === 'character' && !battleState.isOver && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleAttack}
                disabled={loading}
                className="btn-primary disabled:opacity-50"
              >
                Attack
              </button>
              <button
                onClick={handleDefend}
                disabled={loading}
                className="btn-secondary disabled:opacity-50"
              >
                Defend
              </button>
            </div>

            <SpellSelector
              spells={characterSpells}
              currentMana={battleState.characterMana}
              maxMana={character.maxMana}
              onSpellSelect={handleSpellCast}
              disabled={loading}
            />
          </div>
        )}

        {battleState.turn === 'enemy' && !battleState.isOver && (
          <div className="text-center p-4 bg-slate-800 rounded-lg">
            <p className="text-slate-300 animate-pulse">Enemy's turn...</p>
          </div>
        )}
      </div>
    )
  }

  return null
}
