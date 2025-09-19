'use client'

import { useRef, useState } from 'react'
import { Upload, User, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'

interface FileUploadProps {
  onFileSelect: (file: File) => void
  currentFile: string | null
}

export function FileUpload({ onFileSelect, currentFile }: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type.startsWith('image/')) {
      setIsUploading(true)
      onFileSelect(file)
      
      // Simulate upload delay
      setTimeout(() => {
        setIsUploading(false)
      }, 1000)
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
        disabled={isUploading}
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
            disabled={isUploading}
            className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-blue-600 hover:bg-blue-700 text-white border-blue-500"
          >
            {isUploading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              'Change'
            )}
          </Button>
        </motion.div>
      ) : (
        <motion.div
          whileHover={{ scale: isUploading ? 1 : 1.05 }}
          whileTap={{ scale: isUploading ? 1 : 0.95 }}
          onClick={isUploading ? undefined : triggerFileInput}
          className={`w-32 h-32 border-2 border-dashed border-blue-500 rounded-full flex items-center justify-center transition-colors mx-auto ${
            isUploading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:border-blue-400'
          }`}
        >
          <div className="text-center">
            {isUploading ? (
              <Loader2 className="w-8 h-8 text-blue-500 mx-auto mb-2 animate-spin" />
            ) : (
              <User className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            )}
            <div className="text-xs text-blue-400">
              {isUploading ? 'Uploading...' : 'Upload Selfie'}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
} 