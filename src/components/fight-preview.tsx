'use client'

import { motion } from 'framer-motion'
import { Download, RotateCcw, Share2, Copy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface FightPreviewProps {
  resultUrl: string
  captions: string[]
  onDownload: () => void
  onRemix: () => void
}

export function FightPreview({ resultUrl, captions, onDownload, onRemix }: FightPreviewProps) {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Check out my Beef Arena fight!',
          text: 'I just settled some beef in the arena! 🥩💥',
          url: window.location.href
        })
      } catch (error) {
        console.log('Error sharing:', error)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
    }
  }

  const copyCaption = (caption: string) => {
    navigator.clipboard.writeText(caption)
  }

  return (
    <Card className="bg-gray-900/50 border-gray-700 p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6"
      >
        {/* Fight Result Image */}
        <div className="text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', damping: 15 }}
            className="relative inline-block"
          >
            <img
              src={resultUrl}
              alt="Fight result"
              className="max-w-full h-auto rounded-lg shadow-2xl border-4 border-yellow-500"
            />
            <div className="absolute -top-4 -right-4 bg-yellow-500 text-black font-bold text-lg px-3 py-1 rounded-full">
              FIGHT!
            </div>
          </motion.div>
        </div>

        {/* Meme Captions */}
        <div className="space-y-4">
          <h4 className="text-white font-bold text-lg text-center">Meme-Ready Captions</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {captions.map((caption, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-gray-800/50 border-gray-600 p-3 hover:bg-gray-700/50 transition-colors cursor-pointer group"
                      onClick={() => copyCaption(caption)}>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 text-sm flex-1">{caption}</span>
                    <Copy className="w-4 h-4 text-gray-500 group-hover:text-gray-300 transition-colors" />
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-center">
          <Button
            onClick={onDownload}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <Download className="w-4 h-4 mr-2" />
            Download Poster
          </Button>
          
          <Button
            onClick={handleShare}
            variant="outline"
            className="border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share Fight
          </Button>
          
          <Button
            onClick={onRemix}
            variant="outline"
            className="border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Remix
          </Button>
        </div>
      </motion.div>
    </Card>
  )
} 