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
  MapPin,
  CalendarDays,
  BookOpen,
  ArrowRight
} from 'lucide-react'
import Image from 'next/image'
import { SiteHeader } from '@/components/layout/site-header'
import { useRouter } from 'next/navigation'

interface EventDetail {
  id: string
  title: string
  description: string
  content?: string
  imageUrl?: string
  imageAlt?: string
  eventDate: string
  location?: string
  isFeatured: boolean
  createdAt: string
  updatedAt: string
  organizer?: {
    id: string
    name: string
    email: string
    role: string
  }
}

interface EventDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export default function EventDetailPage({ params }: EventDetailPageProps) {
  const router = useRouter()
  const resolvedParams = use(params)
  const [event, setEvent] = useState<EventDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchEvent()
  }, [resolvedParams.id])

  const fetchEvent = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/public/events/${resolvedParams.id}`)
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Evento no encontrado')
        }
        throw new Error('Error al cargar el evento')
      }
      
      const data = await response.json()
      setEvent(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido al cargar el evento.')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  }

  const handleShare = async () => {
    if (navigator.share && event) {
      try {
        await navigator.share({
          title: event.title,
          text: event.description,
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
              Ver todos los eventos
            </Button>
          </div>
        </main>
      </div>
    )
  }

  if (!event) {
    return null
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <SiteHeader />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header del evento */}
          <header className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Badge className="bg-primary text-white px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-sm">
                Evento
              </Badge>
              {event.isFeatured && (
                <Badge variant="outline" className="border-yellow-500 text-yellow-600">
                  Destacado
                </Badge>
              )}
            </div>
            
            <h1 className="text-4xl md:text-5xl font-black text-text-light dark:text-text-dark leading-tight mb-6">
              {event.title}
            </h1>

            {/* Metadatos adicionales */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-text-secondary-light dark:text-text-secondary-dark mb-6">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Publicado el {formatDate(event.createdAt)}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{formatTime(event.createdAt)}</span>
              </div>
              
              {event.organizer && (
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>Organizado por {event.organizer.name}</span>
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
          {event.imageUrl && (
            <div className="mb-8">
              <div className="relative rounded-lg overflow-hidden shadow-lg">
                <Image
                  src={event.imageUrl}
                  alt={event.imageAlt || event.title}
                  width={800}
                  height={400}
                  className="w-full h-auto object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
            </div>
          )}

          {/* Información destacada del evento */}
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-6 mb-8 border border-primary/20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Fecha y hora */}
              <div className="flex items-center gap-3">
                <div className="bg-primary/20 p-3 rounded-full">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">
                    Fecha del Evento
                  </p>
                  <p className="text-lg font-semibold text-text-light dark:text-text-dark">
                    {formatDate(event.eventDate)}
                  </p>
                  <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                    {formatTime(event.eventDate)}
                  </p>
                </div>
              </div>

              {/* Ubicación */}
              {event.location && (
                <div className="flex items-center gap-3">
                  <div className="bg-primary/20 p-3 rounded-full">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">
                      Ubicación
                    </p>
                    <p className="text-lg font-semibold text-text-light dark:text-text-dark">
                      {event.location}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Contenido principal */}
          <article className="prose prose-lg max-w-none">
            <div className="space-y-8">
              {/* Descripción */}
              <div className="bg-card-light dark:bg-card-dark rounded-lg p-8 shadow-sm border-l-4 border-primary">
                <h2 className="text-2xl font-bold mb-4 text-text-light dark:text-text-dark">
                  Descripción del Evento
                </h2>
                <div className="text-lg leading-relaxed text-text-secondary-light dark:text-text-secondary-dark">
                  {event.description.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-4 last:mb-0">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>

              {/* Contenido completo */}
              {event.content && (
                <div className="bg-card-light dark:bg-card-dark rounded-lg p-8 shadow-sm">
                  <h2 className="text-2xl font-bold mb-6 text-text-light dark:text-text-dark">
                    Información Adicional
                  </h2>
                  <div className="text-lg leading-relaxed text-text-secondary-light dark:text-text-secondary-dark">
                    {event.content.split('\n').map((paragraph, index) => (
                      <p key={index} className="mb-4 last:mb-0">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </article>

          {/* Información adicional */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Información del evento */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Heart className="h-5 w-5 text-primary" />
                  Información del Evento
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-text-secondary-light dark:text-text-secondary-dark">Fecha:</span>
                    <span>{formatDate(event.eventDate)}</span>
                  </div>
                  {event.location && (
                    <div className="flex justify-between">
                      <span className="text-text-secondary-light dark:text-text-secondary-dark">Ubicación:</span>
                      <span>{event.location}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-text-secondary-light dark:text-text-secondary-dark">Creado:</span>
                    <span>{formatDate(event.createdAt)}</span>
                  </div>
                  {event.organizer && (
                    <div className="flex justify-between">
                      <span className="text-text-secondary-light dark:text-text-secondary-dark">Organizador:</span>
                      <span>{event.organizer.name}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Acciones relacionadas */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Heart className="h-5 w-5 text-primary" />
                  Contenido Relacionado
                </h3>
                <div className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => router.push('/news-events')}
                  >
                    <CalendarDays className="mr-2 h-4 w-4" />
                    Ver todos los eventos
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => router.push('/historias-impacto')}
                  >
                    <BookOpen className="mr-2 h-4 w-4" />
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
                Ver más eventos
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
