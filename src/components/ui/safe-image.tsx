'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { getSafeImageUrl, isValidImageUrl } from '@/lib/utils'

interface SafeImageProps {
  src: string | null | undefined
  alt: string
  fill?: boolean
  width?: number
  height?: number
  className?: string
  fallback?: React.ReactNode
  onError?: () => void
}

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt,
  fill = false,
  width,
  height,
  className = '',
  fallback,
  onError,
}) => {
  const [hasError, setHasError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Si no hay src o la URL no es válida, mostrar fallback
  if (!src || !isValidImageUrl(src) || hasError) {
    return (
      <div className={`bg-gray-200 dark:bg-gray-700 flex items-center justify-center ${className}`}>
        {fallback || (
          <span className="text-gray-400 text-sm">
            {src ? 'URL de imagen inválida' : 'Sin imagen'}
          </span>
        )}
      </div>
    )
  }

  const safeSrc = getSafeImageUrl(src)

  const handleError = () => {
    console.warn('Error cargando imagen:', src)
    setHasError(true)
    setIsLoading(false)
    onError?.()
  }

  const handleLoad = () => {
    setIsLoading(false)
  }

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 flex items-center justify-center z-10">
          <div className="animate-pulse text-gray-400 text-sm">Cargando...</div>
        </div>
      )}
      <Image
        src={safeSrc}
        alt={alt}
        fill={fill}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        className={`object-cover ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-200`}
        onError={handleError}
        onLoad={handleLoad}
      />
    </div>
  )
}
