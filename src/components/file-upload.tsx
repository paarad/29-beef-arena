'use client'

import { useRef } from 'react'
import { Upload, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'

interface FileUploadProps {
  onFileSelect: (file: File) => void
  currentFile: string | null
}

export function FileUpload({ onFileSelect, currentFile }: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type.startsWith('image/')) {
      onFileSelect(file)
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      
      {currentFile ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative"
        >
          <img
            src={currentFile}
            alt="Your selfie"
            className="w-32 h-32 rounded-full object-cover border-4 border-blue-500 mx-auto"
          />
          <Button
            onClick={triggerFileInput}
            size="sm"
            variant="outline"
            className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-blue-600 hover:bg-blue-700 text-white border-blue-500"
          >
            Change
          </Button>
        </motion.div>
      ) : (
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={triggerFileInput}
          className="w-32 h-32 border-2 border-dashed border-blue-500 rounded-full flex items-center justify-center cursor-pointer hover:border-blue-400 transition-colors mx-auto"
        >
          <div className="text-center">
            <User className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <div className="text-xs text-blue-400">Upload Selfie</div>
          </div>
        </motion.div>
      )}
    </div>
  )
} 