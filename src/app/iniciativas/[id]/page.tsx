'use client'

import React, { useState, useEffect, use } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Share2, ExternalLink, BookOpen, Users, Target, Image as ImageIcon, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { SiteHeader } from '@/components/layout/site-header';
import { SiteFooter } from '@/components/layout/site-footer';
import { RelatedNewsCarousel } from '@/components/sections/related-news-carousel';

interface Initiative {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  imageUrl?: string;
  imageAlt?: string;
  ageGroup: string;
  sectors: string[];
  targetAudience: string;
  objectives: string;
  implementation: string;
  results: string;
  methodology?: string;
  resources?: string;
  evaluation?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  imageLibrary?: Array<{
    id: string;
    title: string;
    description?: string;
    imageUrl: string;
    imageAlt?: string;
  }>;
}

interface InitiativeDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function InitiativeDetailPage({ params }: InitiativeDetailPageProps) {
  const resolvedParams = use(params);
  const [initiative, setInitiative] = useState<Initiative | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInitiative = async () => {
    try {
      setLoading(true);
      console.log('🔍 Buscando iniciativa con ID:', resolvedParams.id);
      const response = await fetch(`/api/public/methodologies/${resolvedParams.id}`);
      console.log('📡 Respuesta de la API:', response.status, response.statusText);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ Error de la API:', errorData);
        throw new Error(`Iniciativa no encontrada (${response.status})`);
      }
      const data = await response.json();
      console.log('✅ Iniciativa encontrada:', data.title);
      console.log('📊 Datos completos de la iniciativa:', data);
      setInitiative(data);
    } catch (error) {
      console.error('❌ Error al cargar iniciativa:', error);
      setError(error instanceof Error ? error.message : 'Error al cargar la iniciativa');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitiative();
  }, [resolvedParams.id]);

  const handleShare = async () => {
    if (navigator.share && initiative) {
      try {
        await navigator.share({
          title: initiative.title,
          text: initiative.description.substring(0, 200),
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error al compartir:', err);
      }
    }
  };


  const getCategoryColor = (sector: string) => {
    switch (sector) {
      case 'EDUCATION':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'HEALTH':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'PROTECTION':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'SUSTAINABILITY':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getInitiativeIcon = () => {
    return <BookOpen className="h-6 w-6 text-purple-500" />;
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark">
        <SiteHeader />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !initiative) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark">
        <SiteHeader />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-text-light dark:text-text-dark mb-4">Iniciativa no encontrada</h1>
            <p className="text-text-secondary-light dark:text-text-secondary-dark mb-8">{error}</p>
            <Button asChild>
              <Link href="/iniciativas">Volver a Iniciativas</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <SiteHeader />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header de la iniciativa */}
          <header className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Badge className="bg-primary text-white px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-sm">
                INICIATIVA
              </Badge>
              <div className="flex items-center gap-2">
                {getInitiativeIcon()}
                {initiative.sectors && initiative.sectors.length > 0 && (
                  <Badge className={getCategoryColor(initiative.sectors[0])}>
                    {initiative.sectors[0]}
                  </Badge>
                )}
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-black text-text-light dark:text-text-dark leading-tight mb-6">
              {initiative.title}
            </h1>

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
          {initiative.imageUrl && (
            <div className="mb-8">
              <div className="relative rounded-lg overflow-hidden shadow-lg">
                <Image
                  src={initiative.imageUrl}
                  alt={initiative.imageAlt || initiative.title}
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
                  Descripción de la Iniciativa
                </h2>
                <div className="text-lg leading-relaxed text-text-secondary-light dark:text-text-secondary-dark">
                  {initiative.description.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-4 last:mb-0">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>

              {/* Objetivos */}
              <div className="bg-card-light dark:bg-card-dark rounded-lg p-8 shadow-sm">
                <h2 className="text-2xl font-bold mb-6 text-text-light dark:text-text-dark">
                  Objetivos de la Iniciativa
                </h2>
                <div className="text-lg leading-relaxed text-text-secondary-light dark:text-text-secondary-dark">
                  {initiative.objectives.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-4 last:mb-0">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>

              {/* Implementación */}
              <div className="bg-card-light dark:bg-card-dark rounded-lg p-8 shadow-sm">
                <h2 className="text-2xl font-bold mb-6 text-text-light dark:text-text-dark">
                  Implementación
                </h2>
                <div className="text-lg leading-relaxed text-text-secondary-light dark:text-text-secondary-dark">
                  {initiative.implementation.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-4 last:mb-0">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>

              {/* Resultados */}
              <div className="bg-card-light dark:bg-card-dark rounded-lg p-8 shadow-sm">
                <h2 className="text-2xl font-bold mb-6 text-text-light dark:text-text-dark">
                  Resultados Esperados
                </h2>
                <div className="text-lg leading-relaxed text-text-secondary-light dark:text-text-secondary-dark">
                  {initiative.results.split('\n').map((paragraph, index) => (
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
            {/* Grupo Etario */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Grupo Etario
                </h3>
                <div className="text-sm text-text-secondary-light dark:text-text-secondary-dark leading-relaxed">
                  {initiative.ageGroup}
                </div>
              </CardContent>
            </Card>

            {/* Público Objetivo */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Público Objetivo
                </h3>
                <div className="text-sm text-text-secondary-light dark:text-text-secondary-dark leading-relaxed">
                  {initiative.targetAudience}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sectores */}
          {initiative.sectors && initiative.sectors.length > 0 && (
            <div className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    Sectores
                  </h3>
                  <div className="text-sm text-text-secondary-light dark:text-text-secondary-dark leading-relaxed">
                    {initiative.sectors.join(', ')}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Galería de Imágenes */}
          {initiative.imageLibrary && initiative.imageLibrary.length > 0 && (
            <div className="mt-12">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold flex items-center gap-2">
                  <ImageIcon className="h-6 w-6 text-primary" />
                  Galería de Imágenes
                </h3>
                <Button variant="outline" asChild>
                  <Link href={`/iniciativas/${resolvedParams.id}/galeria`} className="flex items-center gap-2">
                    Ver Todas
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </Button>
              </div>

              <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800">
                {initiative.imageLibrary.slice(0, 6).map((image) => (
                  <div key={image.id} className="flex-shrink-0 hover:shadow-lg transition-all duration-300 group rounded-lg" style={{ width: '390px' }}>
                    <div className="bg-gray-100 dark:bg-gray-800 overflow-hidden rounded-t-lg" style={{ width: '390px', height: '260px' }}>
                      <img
                        src={image.imageUrl}
                        alt={image.imageAlt || image.title || `Imagen de la iniciativa ${initiative.title}`}
                        style={{ 
                          width: '390px', 
                          height: '260px', 
                          objectFit: 'cover',
                          transition: 'transform 0.3s ease'
                        }}
                        className="group-hover:scale-105"
                      />
                    </div>
                    <div className="bg-card-light dark:bg-card-dark p-4 space-y-3 rounded-b-lg">
                      <h4 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
                        {image.title}
                      </h4>
                      {image.description && (
                        <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 leading-relaxed">
                          {image.description}
                        </p>
                      )}
                      <div className="pt-2">
                        <Button asChild className="w-full" variant="outline">
                          <Link href={`/iniciativas/${resolvedParams.id}/galeria`} className="flex items-center justify-center gap-2">
                            Ver Todas las Fotos
                            <ArrowRight className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Noticias Relacionadas */}
          <div className="mt-12">
            <RelatedNewsCarousel 
              methodologyId={resolvedParams.id}
              title="Noticias Relacionadas con esta Iniciativa"
              limit={6}
            />
          </div>

          {/* CTA Section */}
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <div className="bg-gradient-to-r from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/20 rounded-lg p-8 text-center">
              <h3 className="text-2xl font-bold text-text-light dark:text-text-dark mb-4">
                ¿Quieres implementar esta iniciativa?
              </h3>
              <p className="text-lg text-text-secondary-light dark:text-text-secondary-dark mb-6 max-w-2xl mx-auto">
                Descubre cómo aplicamos estas iniciativas en proyectos reales y aprende a implementarlas en tu comunidad para generar impacto social positivo.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button 
                  asChild
                  className="bg-black hover:bg-gray-800 text-white px-8 py-3 text-lg font-semibold"
                >
                  <Link href="/proyectos">
                    Ver proyectos implementados
                    <ExternalLink className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => window.history.back()}
                  className="px-6 py-3"
                >
                  Explorar más iniciativas
                </Button>
              </div>
            </div>
          </div>

        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

