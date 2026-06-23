'use client'

interface BattleCharacter {
  name: string
  health: number
  maxHealth: number
  mana: number
  maxMana: number
  level?: number
}

interface BattleDisplayProps {
  character: BattleCharacter
  enemy: BattleCharacter
  currentTurn: 'character' | 'enemy'
}

export function BattleDisplay({
  character,
  enemy,
  currentTurn,
}: BattleDisplayProps) {
  const healthPercent = (character.health / character.maxHealth) * 100
  const manaPercent = (character.mana / character.maxMana) * 100
  const enemyHealthPercent = (enemy.health / enemy.maxHealth) * 100
  const enemyManaPercent = (enemy.mana / enemy.maxMana) * 100

  return (
    <div className="space-y-6">
      {/* Enemy Display */}
      <div className="text-center">
        <div className={`transition-all ${currentTurn === 'enemy' ? 'ring-2 ring-yellow-400' : ''}`}>
          <h2 className="text-2xl font-bold text-red-400 mb-2">{enemy.name}</h2>
          <div className="space-y-2">
            {/* Enemy Health Bar */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300">Health</span>
                <span className="text-slate-400">
                  {Math.ceil(enemy.health)}/{enemy.maxHealth}
                </span>
              </div>
              <div className="stat-bar">
                <div
                  className="stat-bar-fill bg-gradient-to-r from-red-500 to-red-600"
                  style={{ width: `${Math.max(0, enemyHealthPercent)}%` }}
                />
              </div>
            </div>

            {/* Enemy Mana Bar */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300">Mana</span>
                <span className="text-slate-400">
                  {Math.ceil(enemy.mana)}/{enemy.maxMana}
                </span>
              </div>
              <div className="stat-bar">
                <div
                  className="stat-bar-fill bg-gradient-to-r from-blue-500 to-blue-600"
                  style={{ width: `${Math.max(0, enemyManaPercent)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Battle Arena Divider */}
      <div className="flex items-center gap-4">
        <div className="flex-1 h-px bg-slate-700"></div>
        <div className="text-slate-400 text-xs font-semibold">VS</div>
        <div className="flex-1 h-px bg-slate-700"></div>
      </div>

      {/* Character Display */}
      <div className="text-center">
        <div
          className={`transition-all ${currentTurn === 'character' ? 'ring-2 ring-green-400' : ''}`}
        >
          <h2 className="text-2xl font-bold text-green-400 mb-2">
            {character.name} {character.level && `(Lv. ${character.level})`}
          </h2>
          <div className="space-y-2">
            {/* Character Health Bar */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300">Health</span>
                <span className="text-slate-400">
                  {Math.ceil(character.health)}/{character.maxHealth}
                </span>
              </div>
              <div className="stat-bar">
                <div
                  className="stat-bar-fill bg-gradient-to-r from-green-500 to-emerald-600"
                  style={{ width: `${Math.max(0, healthPercent)}%` }}
                />
              </div>
            </div>

            {/* Character Mana Bar */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300">Mana</span>
                <span className="text-slate-400">
                  {Math.ceil(character.mana)}/{character.maxMana}
                </span>
              </div>
              <div className="stat-bar">
                <div
                  className="stat-bar-fill bg-gradient-to-r from-blue-500 to-blue-600"
                  style={{ width: `${Math.max(0, manaPercent)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
