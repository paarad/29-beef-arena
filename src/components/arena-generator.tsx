'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Upload, Zap, Download, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Progress } from '@/components/ui/progress'
import { OPPONENTS, FIGHT_TEMPLATES } from '@/lib/constants'
import { FileUpload } from '@/components/file-upload'
import { FightPreview } from '@/components/fight-preview'
import { OpponentSelector } from '@/components/opponent-selector'
import { StyleSelector } from '@/components/style-selector'

interface GenerationState {
  selfieFile: File | null
  selfieUrl: string | null
  selectedOpponent: string
  selectedStyle: string
  watermarkEnabled: boolean
  isGenerating: boolean
  progress: number
  resultUrl: string | null
  captions: string[]
}

export function ArenaGenerator() {
  const [state, setState] = useState<GenerationState>({
    selfieFile: null,
    selfieUrl: null,
    selectedOpponent: '',
    selectedStyle: '',
    watermarkEnabled: true,
    isGenerating: false,
    progress: 0,
    resultUrl: null,
    captions: []
  })

  const handleFileUpload = (file: File) => {
    const url = URL.createObjectURL(file)
    setState(prev => ({
      ...prev,
      selfieFile: file,
      selfieUrl: url
    }))
  }

  const handleGenerate = async () => {
    if (!state.selfieFile || !state.selectedOpponent || !state.selectedStyle) {
      return
    }

    setState(prev => ({ ...prev, isGenerating: true, progress: 0 }))

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setState(prev => ({
          ...prev,
          progress: Math.min(prev.progress + Math.random() * 20, 90)
        }))
      }, 500)

      // TODO: Implement actual API call
      await new Promise(resolve => setTimeout(resolve, 3000))

      clearInterval(progressInterval)
      
      setState(prev => ({
        ...prev,
        isGenerating: false,
        progress: 100,
        resultUrl: '/placeholder-fight-result.jpg',
        captions: [
          'When algorithms meet attitude 🔥',
          'He came for the clout, not the crown',
          'This beef is well done 🥩',
          'One tweet changed everything'
        ]
      }))
    } catch (error) {
      console.error('Generation failed:', error)
      setState(prev => ({ ...prev, isGenerating: false, progress: 0 }))
    }
  }

  const handleRemix = () => {
    setState(prev => ({
      ...prev,
      resultUrl: null,
      captions: [],
      progress: 0
    }))
  }

  const canGenerate = state.selfieFile && state.selectedOpponent && state.selectedStyle && !state.isGenerating

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* VS Layout */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="grid md:grid-cols-3 gap-8 items-center"
      >
        {/* Blue Corner - User */}
        <Card className="bg-blue-900/20 border-blue-500/30 p-6">
          <div className="text-center">
            <div className="text-blue-400 font-bold text-sm mb-2">BLUE CORNER</div>
            <div className="text-white text-xl font-bold mb-4">YOU</div>
            <FileUpload onFileSelect={handleFileUpload} currentFile={state.selfieUrl} />
          </div>
        </Card>

        {/* VS Center */}
        <div className="text-center">
          <motion.div
            animate={{ 
              scale: state.isGenerating ? [1, 1.1, 1] : 1,
              rotate: state.isGenerating ? [0, 5, -5, 0] : 0
            }}
            transition={{ 
              duration: 0.5, 
              repeat: state.isGenerating ? Infinity : 0 
            }}
            className="text-6xl md:text-8xl font-black text-white mb-4"
            style={{
              background: 'linear-gradient(45deg, #ff6b6b, #ffd93d)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 0 20px rgba(255, 107, 107, 0.5))'
            }}
          >
            VS
          </motion.div>
        </div>

        {/* Red Corner - Opponent */}
        <Card className="bg-red-900/20 border-red-500/30 p-6">
          <div className="text-center">
            <div className="text-red-400 font-bold text-sm mb-2">RED CORNER</div>
            <div className="text-white text-xl font-bold mb-4">OPPONENT</div>
            <OpponentSelector 
              selectedOpponent={state.selectedOpponent}
              onSelect={(opponent) => setState(prev => ({ ...prev, selectedOpponent: opponent }))}
            />
          </div>
        </Card>
      </motion.div>

      {/* Style Selector */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <StyleSelector
          selectedStyle={state.selectedStyle}
          onSelect={(style) => setState(prev => ({ ...prev, selectedStyle: style }))}
        />
      </motion.div>

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-4"
      >
        {/* Watermark Toggle */}
        <div className="flex items-center justify-center gap-4">
          <label className="text-white font-medium">Parody Watermark</label>
          <Switch
            checked={state.watermarkEnabled}
            onCheckedChange={(checked) => setState(prev => ({ ...prev, watermarkEnabled: checked }))}
          />
        </div>

        {/* Generate Button */}
        <div className="text-center">
          <Button
            onClick={handleGenerate}
            disabled={!canGenerate}
            size="lg"
            className="bg-gradient-to-r from-red-600 to-blue-600 hover:from-red-700 hover:to-blue-700 text-white font-bold px-12 py-6 text-xl rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {state.isGenerating ? (
              <>
                <Zap className="w-6 h-6 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Zap className="w-6 h-6 mr-2" />
                SETTLE THE BEEF
              </>
            )}
          </Button>
        </div>

        {/* Progress Bar */}
        {state.isGenerating && (
          <div className="max-w-md mx-auto">
            <Progress value={state.progress} className="h-3" />
            <p className="text-center text-gray-400 mt-2">
              {state.progress < 30 ? 'Analyzing faces...' : 
               state.progress < 60 ? 'Preparing the arena...' :
               state.progress < 90 ? 'Settling the beef...' : 'Almost ready...'}
            </p>
          </div>
        )}
      </motion.div>

      {/* Fight Preview */}
      {state.resultUrl && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', damping: 20 }}
        >
          <FightPreview
            resultUrl={state.resultUrl}
            captions={state.captions}
            onDownload={() => {
              // TODO: Implement download
              console.log('Download fight poster')
            }}
            onRemix={handleRemix}
          />
        </motion.div>
      )}
    </div>
  )
} 