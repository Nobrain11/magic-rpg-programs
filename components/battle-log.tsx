'use client'

import { useEffect, useRef } from 'react'

interface BattleLogProps {
  messages: string[]
}

export function BattleLog({ messages }: BattleLogProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className="card h-32 overflow-y-auto space-y-1">
      {messages.length === 0 ? (
        <p className="text-slate-400 text-sm">Battle log will appear here...</p>
      ) : (
        messages.map((message, index) => (
          <div
            key={index}
            className={`text-sm py-1 px-2 rounded ${
              message.includes('Character')
                ? 'text-green-300 bg-green-500/10'
                : message.includes('Victory')
                  ? 'text-green-400 bg-green-500/20 font-semibold'
                  : message.includes('Defeat')
                    ? 'text-red-400 bg-red-500/20 font-semibold'
                    : message.includes('Enemy')
                      ? 'text-red-300 bg-red-500/10'
                      : 'text-slate-300'
            }`}
          >
            {message}
          </div>
        ))
      )}
      <div ref={messagesEndRef} />
    </div>
  )
}
