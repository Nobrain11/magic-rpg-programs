'use client'

import { Spell } from '@/lib/combat'

interface SpellSelectorProps {
  spells: Spell[]
  currentMana: number
  maxMana: number
  onSpellSelect: (spell: Spell) => void
  disabled?: boolean
}

export function SpellSelector({
  spells,
  currentMana,
  maxMana,
  onSpellSelect,
  disabled = false,
}: SpellSelectorProps) {
  const getSpellColor = (type: string): string => {
    switch (type) {
      case 'attack':
        return 'from-red-500 to-orange-600'
      case 'heal':
        return 'from-green-500 to-emerald-600'
      case 'buff':
        return 'from-blue-500 to-cyan-600'
      case 'debuff':
        return 'from-purple-500 to-violet-600'
      default:
        return 'from-slate-500 to-slate-600'
    }
  }

  const getElementIcon = (element: string): string => {
    switch (element) {
      case 'fire':
        return '🔥'
      case 'ice':
        return '❄️'
      case 'lightning':
        return '⚡'
      case 'nature':
        return '🌿'
      case 'holy':
        return '✨'
      case 'dark':
        return '🌑'
      default:
        return '✦'
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-semibold text-slate-300">Available Spells</h3>
        <div className="text-xs text-slate-400">
          Mana: {currentMana}/{maxMana}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
        {spells.map((spell) => {
          const canCast = currentMana >= spell.manaCost
          const colors = getSpellColor(spell.type)
          const icon = getElementIcon(spell.element)

          return (
            <button
              key={spell.id}
              onClick={() => onSpellSelect(spell)}
              disabled={disabled || !canCast}
              className={`p-3 rounded-lg border-2 transition-all text-left text-xs ${
                canCast
                  ? `border-slate-600 bg-gradient-to-br ${colors} hover:border-slate-400 cursor-pointer`
                  : 'border-slate-700 bg-slate-800 opacity-50 cursor-not-allowed'
              }`}
            >
              <div className="flex items-start justify-between mb-1">
                <span className="font-semibold text-white truncate">{spell.name}</span>
                <span className="text-lg">{icon}</span>
              </div>
              <div className="text-xs text-slate-200 mb-1">{spell.type}</div>
              <div className="text-xs text-slate-300">
                Cost: {spell.manaCost} | Power: {spell.power}
              </div>
            </button>
          )
        })}
      </div>

      {spells.length === 0 && (
        <div className="text-center py-6 text-slate-400 text-sm">
          No spells available
        </div>
      )}
    </div>
  )
}
