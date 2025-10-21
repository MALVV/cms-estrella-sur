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
  ArrowRight,
  PartyPopper
} from 'lucide-react'
import Image from 'next/image'
import { SiteHeader } from '@/components/layout/site-header'
import { SiteFooter } from '@/components/layout/site-footer'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

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
                EVENTO
              </Badge>
              <div className="flex items-center gap-2">
                <PartyPopper className="h-6 w-6 text-blue-500" />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-black text-text-light dark:text-text-dark leading-tight mb-6">
              {event.title}
            </h1>

            {/* Metadatos */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-text-secondary-light dark:text-text-secondary-dark mb-6">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Fecha: {formatDate(event.eventDate)}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{formatTime(event.eventDate)}</span>
              </div>
              
              {event.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{event.location}</span>
                </div>
              )}
              
              {event.organizer && (
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>Por {event.organizer.name}</span>
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

          {/* CTA Section */}
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <div className="bg-gradient-to-r from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/20 rounded-lg p-8 text-center">
              <h3 className="text-2xl font-bold text-text-light dark:text-text-dark mb-4">
                ¿Te interesa participar en nuestros eventos?
              </h3>
              <p className="text-lg text-text-secondary-light dark:text-text-secondary-dark mb-6 max-w-2xl mx-auto">
                Únete a nuestra comunidad y participa en eventos que generan impacto social positivo en las comunidades más vulnerables.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button 
                  asChild
                  className="bg-black hover:bg-gray-800 text-white px-8 py-3 text-lg font-semibold"
                >
                  <Link href="/news-events">
                    Ver todos los eventos
                    <CalendarDays className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => window.history.back()}
                  className="px-6 py-3"
                >
                  Explorar más contenido
                </Button>
              </div>
            </div>
          </div>

        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
