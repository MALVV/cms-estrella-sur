"use client"

import React, { useState, useEffect } from 'react'
import { SiteHeader } from '@/components/layout/site-header'
import { SiteFooter } from '@/components/layout/site-footer'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowRight, Calendar, User } from 'lucide-react'

interface Story {
  id: string
  title: string
  summary: string
  content: string
  imageUrl: string
  imageAlt?: string
  status: 'ACTIVE' | 'INACTIVE'
  createdAt: string
  updatedAt: string
  createdBy: string
  creator?: {
    name?: string
    email: string
    role: string
  }
}

export default function HistoriasPage() {
  const [stories, setStories] = useState<Story[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchStories()
  }, [])

  const fetchStories = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/public/stories')
      
      if (!response.ok) {
        throw new Error('Error al cargar las historias')
      }

      const data = await response.json()
      setStories(data)
    } catch (err) {
      console.error('Error fetching stories:', err)
      setError('No se pudieron cargar las historias')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark">
        <SiteHeader />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-text-light dark:text-text-dark">Cargando historias...</p>
          </div>
        </div>
        <SiteFooter />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark">
        <SiteHeader />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-text-light dark:text-text-dark mb-4">
              Error al cargar las historias
            </h1>
            <p className="text-muted-foreground mb-8">{error}</p>
            <Button onClick={fetchStories}>
              Intentar de nuevo
            </Button>
          </div>
        </div>
        <SiteFooter />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <SiteHeader />
      
      <main className="container mx-auto px-4 py-16">
        {/* Header de la página */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-text-light dark:text-text-dark mb-8 font-condensed">
            HISTORIAS DE IMPACTO
          </h1>
          <p className="text-lg text-muted-foreground max-w-4xl mx-auto">
            Descubre las historias reales de transformación y esperanza que hemos vivido junto a las comunidades que servimos.
          </p>
        </div>

        {/* Grid de historias */}
        {stories.length === 0 ? (
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold text-text-light dark:text-text-dark mb-4">
              No hay historias disponibles
            </h2>
            <p className="text-muted-foreground">
              Pronto compartiremos más historias inspiradoras.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {stories.map((story) => (
              <Card key={story.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video overflow-hidden">
                  <img
                    src={story.imageUrl}
                    alt={story.imageAlt || story.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-text-light dark:text-text-dark line-clamp-2">
                    {story.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4 line-clamp-3">
                    {story.summary}
                  </p>
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {new Date(story.createdAt).toLocaleDateString('es-ES')}
                    </div>
                    {story.creator && (
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        {story.creator.name || 'Autor'}
                      </div>
                    )}
                  </div>
                  <Button asChild className="w-full">
                    <Link href={`/historias/${story.id}`}>
                      Leer Historia
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Call to action */}
        <div className="text-center mt-16">
          <h2 className="text-2xl font-bold text-text-light dark:text-text-dark mb-4">
            ¿Tienes una historia que compartir?
          </h2>
          <p className="text-muted-foreground mb-8">
            Únete a nuestra comunidad y ayúdanos a crear más historias de impacto.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/participar">
                Participar
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/contacto">
                Contactar
              </Link>
            </Button>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
