'use client'

import { motion } from 'framer-motion'
import { FIGHT_TEMPLATES } from '@/lib/constants'
import { Card } from '@/components/ui/card'

interface StyleSelectorProps {
  selectedStyle: string
  onSelect: (styleSlug: string) => void
}

export function StyleSelector({ selectedStyle, onSelect }: StyleSelectorProps) {
  return (
    <Card className="bg-gray-900/50 border-gray-700 p-6">
      <h3 className="text-white font-bold text-xl mb-6 text-center">Choose Your Arena</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {FIGHT_TEMPLATES.map((template, index) => (
          <motion.div
            key={template.slug}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card
              className={`p-4 cursor-pointer transition-all aspect-square flex flex-col items-center justify-center text-center ${
                selectedStyle === template.slug
                  ? 'bg-yellow-600 border-yellow-500 text-white scale-105'
                  : 'bg-gray-800/50 border-gray-600 text-gray-300 hover:bg-gray-700/50 hover:scale-102'
              }`}
              onClick={() => onSelect(template.slug)}
            >
              <div className="text-3xl mb-2">
                {template.slug === 'staredown' && '🥊'}
                {template.slug === 'weighin' && '💪'}
                {template.slug === 'press' && '⚖️'}
                {template.slug === 'anime' && '⚡'}
                {template.slug === 'street' && '📸'}
              </div>
              <div className="font-bold text-sm mb-1">{template.name}</div>
              <div className="text-xs opacity-75">{template.description}</div>
            </Card>
          </motion.div>
        ))}
      </div>
    </Card>
  )
} 