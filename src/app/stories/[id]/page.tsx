'use client'

import React, { useState, useEffect, use } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft,
  Calendar,
  User,
  Share2,
  Clock,
  ExternalLink,
  Heart
} from 'lucide-react';
import Image from 'next/image';
import { SiteHeader } from '@/components/layout/site-header';
import { useRouter } from 'next/navigation';

interface Story {
  id: string;
  title: string;
  content?: string;
  summary?: string;
  imageUrl: string;
  imageAlt: string;
  createdAt: string;
  updatedAt: string;
  author?: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

interface StoryDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function StoryDetailPage({ params }: StoryDetailPageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStory();
  }, [resolvedParams.id]);

  const fetchStory = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/public/stories/${resolvedParams.id}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Story no encontrada');
        }
        throw new Error('Error al cargar la story');
      }

      const data = await response.json();
      setStory(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleShare = async () => {
    if (navigator.share && story) {
      try {
        await navigator.share({
          title: story.title,
          text: story.summary || story.content || story.title,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error al compartir:', err);
      }
    } else {
      // Fallback: copiar URL al portapapeles
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark">
        <SiteHeader />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Loading skeleton */}
            <div className="animate-pulse">
              <div className="h-8 bg-border-light dark:bg-border-dark rounded w-32 mb-6"></div>
              <div className="h-12 bg-border-light dark:bg-border-dark rounded w-3/4 mb-4"></div>
              <div className="h-64 bg-border-light dark:bg-border-dark rounded mb-6"></div>
              <div className="space-y-3">
                <div className="h-4 bg-border-light dark:bg-border-dark rounded w-full"></div>
                <div className="h-4 bg-border-light dark:bg-border-dark rounded w-5/6"></div>
                <div className="h-4 bg-border-light dark:bg-border-dark rounded w-4/6"></div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark">
        <SiteHeader />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="py-16">
              <Heart className="h-16 w-16 text-text-secondary-light dark:text-text-secondary-dark mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-text-light dark:text-text-dark mb-4">
                {error}
              </h2>
              <p className="text-text-secondary-light dark:text-text-secondary-dark mb-8">
                La story que buscas no existe o ha sido removida.
              </p>
              <div className="flex gap-4 justify-center">
                <Button variant="outline" onClick={() => router.push('/historias-impacto')}>
                  Ver todas las stories
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!story) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <SiteHeader />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header de la story */}
          <header className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Badge className="bg-primary text-white px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-sm">
                Historia de Impacto
              </Badge>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-black text-text-light dark:text-text-dark leading-tight mb-6">
              {story.title}
            </h1>

            {/* Metadatos */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-text-secondary-light dark:text-text-secondary-dark mb-6">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(story.createdAt)}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{formatTime(story.createdAt)}</span>
              </div>
              
              {story.author && (
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>Por {story.author.name}</span>
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
          <div className="mb-8">
            <div className="relative rounded-lg overflow-hidden shadow-lg">
              <Image
                src={story.imageUrl}
                alt={story.imageAlt || story.title}
                width={800}
                height={400}
                className="w-full h-auto object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
          </div>

          {/* Contenido principal */}
          <article className="prose prose-lg max-w-none">
            <div className="space-y-8">
              {/* Resumen */}
              <div className="bg-card-light dark:bg-card-dark rounded-lg p-8 shadow-sm border-l-4 border-primary">
                <h2 className="text-2xl font-bold mb-4 text-text-light dark:text-text-dark">
                  Resumen
                </h2>
                <div className="text-lg leading-relaxed text-text-secondary-light dark:text-text-secondary-dark">
                  {story.summary ? (
                    (story.summary || '').split('\n').map((paragraph, index) => (
                      <p key={index} className="mb-4 last:mb-0">
                        {paragraph}
                      </p>
                    ))
                  ) : (
                    <p className="text-gray-500 italic">No hay resumen disponible para esta historia.</p>
                  )}
                </div>
              </div>

              {/* Contenido completo */}
              <div className="bg-card-light dark:bg-card-dark rounded-lg p-8 shadow-sm">
                <h2 className="text-2xl font-bold mb-6 text-text-light dark:text-text-dark">
                  Contenido Completo
                </h2>
                <div className="text-lg leading-relaxed text-text-secondary-light dark:text-text-secondary-dark">
                  {story.content ? (
                    (story.content || '').split('\n').map((paragraph, index) => (
                      <p key={index} className="mb-4 last:mb-0">
                        {paragraph}
                      </p>
                    ))
                  ) : (
                    <p className="text-gray-500 italic">No hay contenido disponible para esta historia.</p>
                  )}
                </div>
              </div>
            </div>
          </article>

          {/* Footer de navegación */}
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center">
              <Button 
                variant="outline"
                onClick={() => router.back()}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver
              </Button>
              <Button 
                onClick={() => router.push('/historias-impacto')}
              >
                Ver más historias
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
