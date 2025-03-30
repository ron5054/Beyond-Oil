'use client'

import type React from 'react'
import { useState, useRef } from 'react'
import Image from 'next/image'
import { X, ImagePlus } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function FoodImageUploader({
  foodSampleName,
  onImageChange,
}: {
  foodSampleName: string
  onImageChange: (data: {
    foodSampleName: string
    image: { url: string; name: string; file: File } | null
  }) => void
}) {
  const [image, setImage] = useState<{ url: string; name: string; file: File } | null>(null)

  // Only call onImageChange when the image state changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      const newImage = {
        url: URL.createObjectURL(file),
        name: file.name,
        file: file,
      }
      setImage(newImage)
      onImageChange({ foodSampleName, image: newImage })
    }
  }

  const removeImage = () => {
    setImage(null)
    onImageChange({ foodSampleName, image: null })
  }

  const fileInputRef = useRef<HTMLInputElement>(null)

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  return (
    <>
      {image ? (
        <div className="relative group">
          <div className="w-full h-[90px] relative rounded-lg overflow-hidden">
            <Image src={image.url} alt={image.name} fill className="object-cover" />
          </div>
          <button
            onClick={removeImage}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
            aria-label="Remove image"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleChange}
            className="hidden"
            accept="image/*"
          />
          <Button
            type="button"
            onClick={openFileDialog}
            className="w-full h-20 bg-gray-200 text-black flex items-center justify-center"
          >
            Upload Image
            <ImagePlus className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}
    </>
  )
}
