'use client'

import { motion } from 'framer-motion'
import { OPPONENTS } from '@/lib/constants'
import { Card } from '@/components/ui/card'

interface OpponentSelectorProps {
  selectedOpponent: string
  onSelect: (opponentSlug: string) => void
}

export function OpponentSelector({ selectedOpponent, onSelect }: OpponentSelectorProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto">
        {OPPONENTS.map((opponent, index) => (
          <motion.div
            key={opponent.slug}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card
              className={`p-3 cursor-pointer transition-all ${
                selectedOpponent === opponent.slug
                  ? 'bg-red-600 border-red-500 text-white'
                  : 'bg-gray-800/50 border-gray-700 text-gray-300 hover:bg-gray-700/50'
              }`}
              onClick={() => onSelect(opponent.slug)}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white font-bold text-lg">
                  {opponent.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm truncate">{opponent.name}</div>
                  <div className="text-xs opacity-75 truncate">{opponent.nickname}</div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
      
      {selectedOpponent && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="text-red-400 font-bold text-lg">
            {OPPONENTS.find(o => o.slug === selectedOpponent)?.nickname}
          </div>
        </motion.div>
      )}
    </div>
  )
} 