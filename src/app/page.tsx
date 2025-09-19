'use client'

import { ArenaGenerator } from '@/components/arena-generator'
import { motion } from 'framer-motion'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-8 px-4"
      >
        <motion.h1 
          className="text-6xl md:text-8xl font-black text-white mb-4"
          style={{
            background: 'linear-gradient(45deg, #ff6b6b, #ffd93d, #6bcf7f)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 0 30px rgba(255, 107, 107, 0.3)'
          }}
        >
          BEEF ARENA
        </motion.h1>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-xl md:text-2xl text-gray-300 space-y-2"
        >
          <p>🥩 Start your beef.</p>
          <p>💥 Settle it in the ring.</p>
          <p>📸 Share the chaos.</p>
        </motion.div>
      </motion.header>

      {/* Main Arena Generator */}
      <div className="container mx-auto px-4 pb-12">
        <ArenaGenerator />
      </div>

      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-32 h-32 bg-red-500/10 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-blue-500/10 rounded-full blur-xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-yellow-500/5 rounded-full blur-2xl animate-pulse delay-500" />
      </div>
    </main>
  )
}
