'use client'

import React, { useState, useEffect, use } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  CalendarDays, 
  User, 
  Users, 
  DollarSign, 
  Share2, 
  ExternalLink,
  Clock
} from 'lucide-react';
import Image from 'next/image';
import { SiteHeader } from '@/components/layout/site-header';
import { RelatedNewsCarousel } from '@/components/sections/related-news-carousel';
import { SiteFooter } from '@/components/layout/site-footer';
import { useRouter } from 'next/navigation';

interface Project {
  id: string;
  title: string;
  executionStart: string;
  executionEnd: string;
  context: string;
  objectives: string;
  content: string;
  strategicAllies?: string;
  financing?: string;
  imageUrl?: string;
  imageAlt?: string;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  creator?: {
    name?: string;
    email: string;
  };
}

interface ProjectDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProject();
  }, [resolvedParams.id]);

  const fetchProject = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/public/projects/${resolvedParams.id}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Proyecto no encontrado');
        }
        throw new Error('Error al cargar el proyecto');
      }
      
      const data = await response.json();
      setProject(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido al cargar el proyecto.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPeriod = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    
    const startMonth = startDate.toLocaleDateString('es-ES', { month: 'long' });
    const endMonth = endDate.toLocaleDateString('es-ES', { month: 'long' });
    
    return `${startMonth} ${startDate.getFullYear()} - ${endMonth} ${endDate.getFullYear()}`;
  };

  const handleShare = async () => {
    if (navigator.share && project) {
      try {
        await navigator.share({
          title: project.title,
          text: project.content.substring(0, 200),
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error al compartir:', err);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark">
        <SiteHeader />
        <main className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mx-auto"></div>
            <div className="h-64 bg-gray-300 dark:bg-gray-600 rounded"></div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-4">
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-full"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-5/6"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-full"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-2/3"></div>
              </div>
              <div className="md:col-span-1 space-y-4">
                <div className="h-32 bg-gray-300 dark:bg-gray-600 rounded"></div>
                <div className="h-24 bg-gray-300 dark:bg-gray-600 rounded"></div>
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
        <main className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-3xl font-bold text-red-600 dark:text-red-400 mb-4">
            Error
          </h1>
          <p className="text-lg text-text-secondary-light dark:text-text-secondary-dark mb-8">
            {error}
          </p>
          <div className="flex gap-4 justify-center">
            <Button variant="outline" onClick={() => router.push('/proyectos')}>
              Ver todos los proyectos
            </Button>
          </div>
        </main>
      </div>
    );
  }

  if (!project) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <SiteHeader />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header del proyecto */}
          <header className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Badge className="bg-primary text-white px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-sm">
                PROYECTO
              </Badge>
              {project.isFeatured && (
                <Badge variant="outline" className="border-yellow-500 text-yellow-600">
                  Destacado
                </Badge>
              )}
            </div>
            
            <h1 className="text-4xl md:text-5xl font-black text-text-light dark:text-text-dark leading-tight mb-6">
              {project.title}
            </h1>

            {/* Metadatos */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-text-secondary-light dark:text-text-secondary-dark mb-6">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Inicio: {formatDate(project.executionStart)}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4" />
                <span>Fin: {formatDate(project.executionEnd)}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>Período: {formatPeriod(project.executionStart, project.executionEnd)}</span>
              </div>
              
              {project.creator && (
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>Por {project.creator.name}</span>
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
          {project.imageUrl && (
            <div className="mb-8">
              <div className="relative rounded-lg overflow-hidden shadow-lg">
                <Image
                  src={project.imageUrl}
                  alt={project.imageAlt || project.title}
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
              {/* Contexto */}
              <div className="bg-card-light dark:bg-card-dark rounded-lg p-8 shadow-sm border-l-4 border-primary">
                <h2 className="text-2xl font-bold mb-4 text-text-light dark:text-text-dark">
                  Contexto del Proyecto
                </h2>
                <div className="text-lg leading-relaxed text-text-secondary-light dark:text-text-secondary-dark">
                  {project.context.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-4 last:mb-0">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>

              {/* Objetivos */}
              <div className="bg-card-light dark:bg-card-dark rounded-lg p-8 shadow-sm">
                <h2 className="text-2xl font-bold mb-6 text-text-light dark:text-text-dark">
                  Objetivos del Proyecto
                </h2>
                <div className="text-lg leading-relaxed text-text-secondary-light dark:text-text-secondary-dark">
                  {project.objectives.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-4 last:mb-0">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>

              {/* Contenido */}
              <div className="bg-card-light dark:bg-card-dark rounded-lg p-8 shadow-sm">
                <h2 className="text-2xl font-bold mb-6 text-text-light dark:text-text-dark">
                  Descripción del Proyecto
                </h2>
                <div className="text-lg leading-relaxed text-text-secondary-light dark:text-text-secondary-dark">
                  {project.content.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-4 last:mb-0">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </article>

          {/* Información específica del proyecto */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Aliados Estratégicos */}
            {project.strategicAllies && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    Aliados Estratégicos
                  </h3>
                  <div className="text-sm text-text-secondary-light dark:text-text-secondary-dark leading-relaxed">
                    {project.strategicAllies.split('\n').map((paragraph, index) => (
                      <p key={index} className="mb-3 last:mb-0">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Financiamiento */}
            {project.financing && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-primary" />
                    Financiamiento
                  </h3>
                  <div className="text-sm text-text-secondary-light dark:text-text-secondary-dark leading-relaxed">
                    {project.financing.split('\n').map((paragraph, index) => (
                      <p key={index} className="mb-3 last:mb-0">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Noticias Relacionadas */}
          <div className="mt-12">
            <RelatedNewsCarousel 
              projectId={resolvedParams.id}
              title="Noticias Relacionadas con este Proyecto"
              limit={6}
            />
          </div>

          {/* Footer de navegación */}
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-start">
              <Button 
                onClick={() => router.push('/proyectos')}
              >
                Ver más proyectos
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
