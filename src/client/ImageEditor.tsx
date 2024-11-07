'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Eraser, Upload, Download } from 'lucide-react'

export default function ImageEditor() {
  const [originalImage, setOriginalImage] = useState<string | null>(null)
  const [displayedImage, setDisplayedImage] = useState<string | null>(null)
  const [generatedImages, setGeneratedImages] = useState<string[]>([])
  const [prompt, setPrompt] = useState('')
  const [isErasing, setIsErasing] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const contextRef = useRef<CanvasRenderingContext2D | null>(null)
  const imageRef = useRef<HTMLImageElement | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (displayedImage) {
      const img = new Image()
      img.onload = () => {
        imageRef.current = img
        initCanvas()
      }
      img.src = displayedImage
    }
  }, [displayedImage])

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const imageDataUrl = e.target?.result as string
        setOriginalImage(imageDataUrl)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleUploadClick = () => {
    if (originalImage) {
      setDisplayedImage(originalImage)
    }
  }

  const initCanvas = () => {
    if (canvasRef.current && imageRef.current) {
      const canvas = canvasRef.current
      const context = canvas.getContext('2d')
      if (context) {
        const img = imageRef.current
        canvas.width = img.width
        canvas.height = img.height
        context.drawImage(img, 0, 0, img.width, img.height)
        contextRef.current = context
      }
    }
  }

  const handlePromptSubmit = async () => {
    if (!displayedImage || !prompt) return

    try {
      // Simulating API call for demonstration purposes
      await new Promise(resolve => setTimeout(resolve, 2000))
      const mockGeneratedImages = [
        'https://picsum.photos/seed/1/300/200',
        'https://picsum.photos/seed/2/300/200',
        'https://picsum.photos/seed/3/300/200'
      ]
      setGeneratedImages(mockGeneratedImages)
    } catch (error) {
      console.error('Error generating images:', error)
    }
  }

  const handleDownload = (imageUrl: string) => {
    const link = document.createElement('a')
    link.href = imageUrl
    link.download = 'generated-image.png'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const startErasing = () => {
    setIsErasing(true)
    if (contextRef.current) {
      contextRef.current.strokeStyle = 'rgba(255,255,255,1)'
      contextRef.current.lineWidth = 20
      contextRef.current.lineCap = 'round'
    }
  }

  const stopErasing = () => {
    setIsErasing(false)
  }

  const erase = (event: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isErasing || !contextRef.current || !canvasRef.current) return

    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height

    let x, y

    if ('touches' in event) {
      // Touch event
      x = (event.touches[0].clientX - rect.left) * scaleX
      y = (event.touches[0].clientY - rect.top) * scaleY
    } else {
      // Mouse event
      x = (event.clientX - rect.left) * scaleX
      y = (event.clientY - rect.top) * scaleY
    }

    contextRef.current.beginPath()
    contextRef.current.moveTo(x, y)
    contextRef.current.lineTo(x, y)
    contextRef.current.stroke()
  }

  return (
    <div className="container mx-auto p-4">
      <motion.h1 
        className="text-2xl font-bold mb-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        AI Image Editor
      </motion.h1>
      
      <motion.div 
        className="mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <Label htmlFor="image-upload">Upload Image</Label>
        <div className="flex items-center gap-2">
          <Input 
            id="image-upload" 
            type="file" 
            accept="image/*" 
            onChange={handleImageUpload}
            ref={fileInputRef}
          />
          <Button onClick={handleUploadClick} disabled={!originalImage}>
            <Upload className="mr-2 h-4 w-4" /> Upload
          </Button>
        </div>
      </motion.div>

      {displayedImage && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="mb-4">
            <CardContent>
              <div className="relative">
                <canvas
                  ref={canvasRef}
                  onMouseDown={startErasing}
                  onMouseUp={stopErasing}
                  onMouseMove={erase}
                  onTouchStart={startErasing}
                  onTouchEnd={stopErasing}
                  onTouchMove={erase}
                  className="border border-gray-300 w-full h-auto touch-none"
                  style={{ maxWidth: '100%', maxHeight: '600px' }}
                />
                <div className="absolute top-2 right-2 space-x-2">
                  <Button onClick={initCanvas} size="sm">Reset</Button>
                  <Button onClick={startErasing} size="sm">
                    <Eraser className="mr-2 h-4 w-4" /> Erase
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <motion.div 
        className="mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <Label htmlFor="prompt">Prompt</Label>
        <Textarea
          id="prompt"
          placeholder="Enter your prompt here"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <Button onClick={handlePromptSubmit} disabled={!displayedImage || !prompt}>
          Generate Images
        </Button>
      </motion.div>

      {generatedImages.length > 0 && (
        <motion.div 
          className="mt-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <ScrollArea className="w-full whitespace-nowrap rounded-md border">
            <div className="flex w-max space-x-4 p-4">
              {generatedImages.map((imageUrl, index) => (
                <Card key={index} className="w-[250px] shrink-0">
                  <CardContent className="p-4">
                    <img src={imageUrl} alt={`Generated ${index + 1}`} className="w-full h-auto rounded-md" />
                    <Button onClick={() => handleDownload(imageUrl)} className="mt-2 w-full">
                      <Download className="mr-2 h-4 w-4" /> Download
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </motion.div>
      )}
    </div>
  )
}