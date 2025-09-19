'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Zap, Download, RotateCcw, Loader2, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Progress } from '@/components/ui/progress'
import { OPPONENTS, FIGHT_TEMPLATES } from '@/lib/constants'

interface GenerationState {
  selectedFighter1: string
  selectedFighter2: string
  selectedStyle: string
  watermarkEnabled: boolean
  isGenerating: boolean
  progress: number
  resultUrl: string | null
  captions: string[]
}

// Inline OpponentSelector component
function OpponentSelector({ selectedOpponent, onSelect }: { selectedOpponent: string, onSelect: (opponent: string) => void }) {
  const currentOpponent = OPPONENTS.find(o => o.slug === selectedOpponent)
  
  return (
    <div className="space-y-4">
      {/* Show selected opponent prominently */}
      {currentOpponent ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center mb-4"
        >
          <div className={`w-24 h-24 rounded-full ${
            currentOpponent.slug === 'donald-trump' 
              ? 'bg-gradient-to-br from-yellow-500 to-orange-500 p-1' 
              : 'bg-gradient-to-br from-red-500 to-orange-500 p-1'
          } flex items-center justify-center text-white font-bold text-2xl mx-auto mb-3`}>
{(() => {
              const imageMap: Record<string, string> = {
                'elon-musk': '/icons-stars/musk.png',
                'taylor-swift': '/icons-stars/swift.png',
                'mrbeast': '/icons-stars/mrbeast.png',
                'drake': '/icons-stars/drake.png',
                'jeff-bezos': '/icons-stars/bezos.png',
                'the-rock': '/icons-stars/therock.png',
                'mark-zuckerberg': '/icons-stars/zuckerberg.png',
                'donald-trump': '/icons-stars/trump.png'
              }
              
              const imageSrc = imageMap[currentOpponent.slug]
              return imageSrc ? (
                <img 
                  src={imageSrc} 
                  alt={currentOpponent.name} 
                  className="w-20 h-20 rounded-full object-cover"
                />
              ) : (
                currentOpponent.name.split(' ').map(n => n[0]).join('')
              )
            })()}
          </div>
          <div className="text-white font-bold text-lg">{currentOpponent.name}</div>
          <div className="text-red-400 text-sm">{currentOpponent.nickname}</div>
        </motion.div>
      ) : (
        <div className="text-center mb-4">
          <div className="w-24 h-24 rounded-full border-2 border-dashed border-gray-500 flex items-center justify-center text-gray-500 mx-auto mb-3">
            <span className="text-2xl">?</span>
          </div>
          <div className="text-gray-400 text-sm">Select a fighter</div>
        </div>
      )}

      {/* Fighter selection list */}
      <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
        {OPPONENTS.map((opponent, index) => (
          <motion.div key={opponent.slug} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }}>
            <Card
              className={`p-2 cursor-pointer transition-all ${
                selectedOpponent === opponent.slug
                  ? 'bg-red-600 border-red-500 text-white'
                  : 'bg-gray-800/50 border-gray-700 text-gray-300 hover:bg-gray-700/50'
              }`}
              onClick={() => onSelect(opponent.slug)}
            >
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full ${
                  opponent.slug === 'donald-trump' 
                    ? 'bg-gradient-to-br from-yellow-500 to-orange-500 p-0.5' 
                    : 'bg-gradient-to-br from-red-500 to-orange-500 p-0.5'
                } flex items-center justify-center text-white font-bold text-xs`}>
{(() => {
                    const imageMap: Record<string, string> = {
                      'elon-musk': '/icons-stars/musk.png',
                      'taylor-swift': '/icons-stars/swift.png',
                      'mrbeast': '/icons-stars/mrbeast.png',
                      'drake': '/icons-stars/drake.png',
                      'jeff-bezos': '/icons-stars/bezos.png',
                      'the-rock': '/icons-stars/therock.png',
                      'mark-zuckerberg': '/icons-stars/zuckerberg.png',
                      'donald-trump': '/icons-stars/trump.png'
                    }
                    
                    const imageSrc = imageMap[opponent.slug]
                    return imageSrc ? (
                      <img 
                        src={imageSrc} 
                        alt={opponent.name} 
                        className="w-6 h-6 rounded-full object-cover"
                      />
                    ) : (
                      opponent.name.split(' ').map(n => n[0]).join('')
                    )
                  })()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-xs truncate">{opponent.name}</div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// Inline StyleSelector component  
function StyleSelector({ selectedStyle, onSelect }: { selectedStyle: string, onSelect: (style: string) => void }) {
  return (
    <Card className="bg-gray-900/50 border-gray-700 p-6">
      <h3 className="text-white font-bold text-xl mb-6 text-center">Choose Your Arena</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {FIGHT_TEMPLATES.map((template, index) => (
          <motion.div key={template.slug} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
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

// Inline FightPreview component
function FightPreview({ resultUrl, captions, onDownload, onRemix }: { 
  resultUrl: string, 
  captions: string[], 
  onDownload: () => void, 
  onRemix: () => void 
}) {
  return (
    <Card className="bg-gray-900/50 border-gray-700 p-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        <div className="text-center">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', damping: 15 }} className="relative inline-block">
            <img src={resultUrl} alt="Fight result" className="max-w-full h-auto rounded-lg shadow-2xl border-4 border-yellow-500" />
            <div className="absolute -top-4 -right-4 bg-yellow-500 text-black font-bold text-lg px-3 py-1 rounded-full">FIGHT!</div>
          </motion.div>
        </div>
        <div className="space-y-4">
          <h4 className="text-white font-bold text-lg text-center">Meme-Ready Captions</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {captions.map((caption, index) => (
              <motion.div key={index} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }}>
                <Card className="bg-gray-800/50 border-gray-600 p-3 hover:bg-gray-700/50 transition-colors cursor-pointer group">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 text-sm flex-1">{caption}</span>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap gap-4 justify-center">
          <Button onClick={onDownload} className="bg-green-600 hover:bg-green-700 text-white">
            <Download className="w-4 h-4 mr-2" /> Download Poster
          </Button>
          <Button onClick={onRemix} variant="outline" className="border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white">
            <RotateCcw className="w-4 h-4 mr-2" /> Remix
          </Button>
        </div>
      </motion.div>
    </Card>
  )
}

export function ArenaGenerator() {
  const [state, setState] = useState<GenerationState>({
    selectedFighter1: '',
    selectedFighter2: '',
    selectedStyle: '',
    watermarkEnabled: true,
    isGenerating: false,
    progress: 0,
    resultUrl: null,
    captions: []
  })

  const handleGenerate = async () => {
    if (!state.selectedFighter1 || !state.selectedFighter2 || !state.selectedStyle) {
      console.log('❌ Cannot generate: missing requirements', {
        hasFighter1: !!state.selectedFighter1,
        hasFighter2: !!state.selectedFighter2,
        hasStyle: !!state.selectedStyle
      })
      return
    }

    if (state.selectedFighter1 === state.selectedFighter2) {
      console.log('❌ Cannot generate: same fighter selected for both')
      return
    }

    console.log('🚀 Starting celebrity vs celebrity generation...')
    setState(prev => ({ ...prev, isGenerating: true, progress: 0 }))

    try {
      const progressInterval = setInterval(() => {
        setState(prev => ({
          ...prev,
          progress: Math.min(prev.progress + Math.random() * 15, 85)
        }))
      }, 800)

      console.log('📤 Sending request to API...', {
        fighter1: state.selectedFighter1,
        fighter2: state.selectedFighter2,
        styleSlug: state.selectedStyle,
        watermarkEnabled: state.watermarkEnabled
      })

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fighter1Slug: state.selectedFighter1,
          fighter2Slug: state.selectedFighter2,
          styleSlug: state.selectedStyle,
          watermarkEnabled: state.watermarkEnabled,
        }),
      })

      clearInterval(progressInterval)

      console.log('📥 API response received:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('❌ API error response:', errorData)
        throw new Error(errorData.error || 'Generation failed')
      }

      const result = await response.json()
      console.log('✅ Generation successful:', {
        hasResultUrl: !!result.resultUrl,
        captionsCount: result.captions?.length || 0,
        fighter1: result.fighter1,
        fighter2: result.fighter2,
        style: result.style,
        debug: result.debug
      })

      setState(prev => ({
        ...prev,
        isGenerating: false,
        progress: 100,
        resultUrl: result.resultUrl,
        captions: result.captions || []
      }))
    } catch (error) {
      console.error('💥 Generation failed:', error)
      setState(prev => ({
        ...prev,
        isGenerating: false,
        progress: 0,
        resultUrl: null,
        captions: ['Error: ' + (error instanceof Error ? error.message : 'Generation failed')]
      }))
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

  const canGenerate = state.selectedFighter1 && 
                     state.selectedFighter2 && 
                     state.selectedStyle && 
                     state.selectedFighter1 !== state.selectedFighter2 && 
                     !state.isGenerating

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* Fighter 1 Selection */}
        <Card className="bg-blue-900/30 border-blue-500 p-6">
          <div className="text-center">
            <div className="text-blue-400 font-bold text-sm mb-2">BLUE CORNER</div>
            <div className="text-white text-xl font-bold mb-4">FIGHTER 1</div>
            <OpponentSelector 
              selectedOpponent={state.selectedFighter1}
              onSelect={(opponent: string) => setState(prev => ({ ...prev, selectedFighter1: opponent }))}
            />
          </div>
        </Card>

        {/* VS Divider */}
        <div className="flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-20 h-20 rounded-full border-4 border-yellow-500 flex items-center justify-center bg-yellow-500/20"
          >
            <span className="text-yellow-400 font-black text-2xl">VS</span>
          </motion.div>
        </div>

        {/* Fighter 2 Selection */}
        <Card className="bg-red-900/30 border-red-500 p-6">
          <div className="text-center">
            <div className="text-red-400 font-bold text-sm mb-2">RED CORNER</div>
            <div className="text-white text-xl font-bold mb-4">FIGHTER 2</div>
            <OpponentSelector 
              selectedOpponent={state.selectedFighter2}
              onSelect={(opponent: string) => setState(prev => ({ ...prev, selectedFighter2: opponent }))}
            />
          </div>
        </Card>
      </motion.div>

      {/* Fight Style Selection */}
      <StyleSelector 
        selectedStyle={state.selectedStyle}
        onSelect={(style: string) => setState(prev => ({ ...prev, selectedStyle: style }))}
      />

      {/* Settings */}
      <Card className="bg-gray-900/50 border-gray-700 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Switch 
              checked={state.watermarkEnabled}
              onCheckedChange={(checked) => setState(prev => ({ ...prev, watermarkEnabled: checked }))}
            />
            <label className="text-gray-300 text-sm">Include &quot;BEEF ARENA&quot; watermark</label>
          </div>
        </div>
      </Card>

      {/* Generate Button */}
      <div className="text-center">
        <motion.div
          whileHover={{ scale: canGenerate ? 1.05 : 1 }}
          whileTap={{ scale: canGenerate ? 0.95 : 1 }}
        >
          <Button
            onClick={handleGenerate}
            disabled={!canGenerate}
            className={`text-2xl font-black py-8 px-12 rounded-xl transition-all duration-300 ${
              canGenerate
                ? 'bg-gradient-to-r from-red-600 via-yellow-500 to-red-600 hover:from-red-700 hover:via-yellow-400 hover:to-red-700 text-white shadow-lg hover:shadow-2xl'
                : 'bg-gray-700 text-gray-400 cursor-not-allowed'
            }`}
          >
            {state.isGenerating ? (
              <>
                <Loader2 className="w-6 h-6 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Zap className="w-6 h-6 mr-2" />
                SETTLE THE BEEF
              </>
            )}
          </Button>
        </motion.div>
        
        {state.isGenerating && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 space-y-2"
          >
            <Progress value={state.progress} className="w-full max-w-md mx-auto" />
            <p className="text-gray-400 text-sm">Creating epic showdown...</p>
          </motion.div>
        )}
        
        {!canGenerate && (
          <p className="text-gray-500 text-sm mt-4">
            {!state.selectedFighter1 || !state.selectedFighter2 
              ? "Select both fighters to continue"
              : state.selectedFighter1 === state.selectedFighter2
              ? "Choose different fighters"
              : "Choose a fight style"}
          </p>
        )}
      </div>

      {/* Results */}
      {state.resultUrl && (
        <FightPreview
          resultUrl={state.resultUrl}
          captions={state.captions}
          onDownload={() => {
            const link = document.createElement('a')
            link.href = state.resultUrl!
            link.download = 'beef-arena-fight.png'
            link.click()
          }}
          onRemix={handleRemix}
        />
      )}
    </div>
  )
} 