'use client'

import React, { useState, useEffect, use } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Calendar,
  User,
  Share2,
  Heart,
  Clock,
  ExternalLink
} from 'lucide-react'
import { SiteHeader } from '@/components/layout/site-header'
import { useRouter } from 'next/navigation'

interface NewsDetail {
  id: string
  title: string
  content: string
  excerpt?: string
  imageUrl?: string
  imageAlt?: string
  category: string
  isFeatured: boolean
  publishedAt: string
  createdAt: string
  updatedAt: string
  author?: {
    id: string
    name: string
    email: string
    role: string
  }
}

interface NewsDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export default function NewsDetailPage({ params }: NewsDetailPageProps) {
  const router = useRouter()
  const resolvedParams = use(params)
  const [news, setNews] = useState<NewsDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchNews()
  }, [resolvedParams.id])

  const fetchNews = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/public/news/${resolvedParams.id}`)
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Noticia no encontrada')
        }
        throw new Error('Error al cargar la noticia')
      }
      
      const data = await response.json()
      setNews(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido al cargar la noticia.')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleShare = async () => {
    if (navigator.share && news) {
      try {
        await navigator.share({
          title: news.title,
          text: news.excerpt || news.content.substring(0, 200),
          url: window.location.href,
        })
      } catch (err) {
        console.log('Error al compartir:', err)
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark">
        <SiteHeader />
        <main className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-border-light dark:bg-border-dark rounded w-3/4 mx-auto"></div>
            <div className="h-64 bg-border-light dark:bg-border-dark rounded"></div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-4">
                <div className="h-4 bg-border-light dark:bg-border-dark rounded w-full"></div>
                <div className="h-4 bg-border-light dark:bg-border-dark rounded w-5/6"></div>
                <div className="h-4 bg-border-light dark:bg-border-dark rounded w-full"></div>
                <div className="h-4 bg-border-light dark:bg-border-dark rounded w-2/3"></div>
              </div>
              <div className="md:col-span-1 space-y-4">
                <div className="h-32 bg-border-light dark:bg-border-dark rounded"></div>
                <div className="h-24 bg-border-light dark:bg-border-dark rounded"></div>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark">
        <SiteHeader />
        <main className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-3xl font-bold text-destructive dark:text-destructive mb-4">
            Error
          </h1>
          <p className="text-lg text-text-secondary-light dark:text-text-secondary-dark mb-8">
            {error}
          </p>
          <div className="flex gap-4 justify-center">
            <Button variant="outline" onClick={() => router.push('/news-events')}>
              Ver todas las noticias
            </Button>
          </div>
        </main>
      </div>
    )
  }

  if (!news) {
    return null
  }

  // Debug: verificar imagen
  console.log('Noticia cargada:', {
    title: news.title,
    hasImageUrl: !!news.imageUrl,
    imageUrl: news.imageUrl,
    imageAlt: news.imageAlt
  });

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <SiteHeader />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header de la noticia */}
          <header className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Badge className="bg-primary text-white px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-sm">
                {news.category}
              </Badge>
              {news.isFeatured && (
                <Badge variant="outline" className="border-yellow-500 text-yellow-600">
                  Destacada
                </Badge>
              )}
            </div>
            
            <h1 className="text-4xl md:text-5xl font-black text-text-light dark:text-text-dark leading-tight mb-6">
              {news.title}
            </h1>

            {/* Metadatos */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-text-secondary-light dark:text-text-secondary-dark mb-6">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(news.publishedAt)}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{formatTime(news.publishedAt)}</span>
              </div>
              
              {news.author && (
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>Por {news.author.name}</span>
                </div>
              )}
            </div>

            {/* Botones de acción */}
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleShare}
              >
                <Share2 className="mr-2 h-4 w-4" />
                Compartir
              </Button>
            </div>
          </header>

          {/* Imagen principal */}
          {news.imageUrl && (
            <div className="mb-8">
              <div className="relative rounded-lg overflow-hidden shadow-lg">
                <img
                  src={news.imageUrl}
                  alt={news.imageAlt || news.title}
                  className="w-full h-auto object-cover"
                  style={{ maxHeight: '400px' }}
                  onError={(e) => {
                    console.error('Error cargando imagen:', news.imageUrl);
                    e.currentTarget.style.display = 'none';
                  }}
                  onLoad={() => {
                    console.log('Imagen cargada exitosamente:', news.imageUrl);
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
            </div>
          )}

          {/* Contenido principal */}
          <article className="prose prose-lg max-w-none">
            <div className="space-y-8">
              {/* Resumen */}
              {news.excerpt && (
                <div className="bg-card-light dark:bg-card-dark rounded-lg p-8 shadow-sm border-l-4 border-primary">
                  <h2 className="text-2xl font-bold mb-4 text-text-light dark:text-text-dark">
                    Resumen
                  </h2>
                  <div className="text-lg leading-relaxed text-text-secondary-light dark:text-text-secondary-dark">
                    {news.excerpt.split('\n').map((paragraph, index) => (
                      <p key={index} className="mb-4 last:mb-0">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {/* Contenido completo */}
              <div className="bg-card-light dark:bg-card-dark rounded-lg p-8 shadow-sm">
                <h2 className="text-2xl font-bold mb-6 text-text-light dark:text-text-dark">
                  Contenido Completo
                </h2>
                <div className="text-lg leading-relaxed text-text-secondary-light dark:text-text-secondary-dark">
                  {news.content.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-4 last:mb-0">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </article>

          {/* Información adicional */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Información de la noticia */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Heart className="h-5 w-5 text-primary" />
                  Información de la Noticia
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-text-secondary-light dark:text-text-secondary-dark">ID:</span>
                    <span className="font-mono text-xs">{news.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary-light dark:text-text-secondary-dark">Categoría:</span>
                    <span>{news.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary-light dark:text-text-secondary-dark">Publicada:</span>
                    <span>{formatDate(news.publishedAt)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary-light dark:text-text-secondary-dark">Actualizada:</span>
                    <span>{formatDate(news.updatedAt)}</span>
                  </div>
                  {news.author && (
                    <div className="flex justify-between">
                      <span className="text-text-secondary-light dark:text-text-secondary-dark">Autor:</span>
                      <span>{news.author.name}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Acciones relacionadas */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <ExternalLink className="h-5 w-5 text-primary" />
                  Contenido Relacionado
                </h3>
                <div className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => router.push('/news-events')}
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Ver todas las noticias
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => router.push('/historias-impacto')}
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Ver historias de impacto
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Footer de navegación */}
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-end">
              <Button 
                onClick={() => router.push('/news-events')}
              >
                Ver más noticias
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
