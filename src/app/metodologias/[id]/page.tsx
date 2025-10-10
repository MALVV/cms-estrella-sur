'use client'

import React, { useState, useEffect, use } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Target, Lightbulb, Heart, Shield, Share2, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { SiteHeader } from '@/components/layout/site-header';
import { SiteFooter } from '@/components/layout/site-footer';

interface Methodology {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  imageUrl?: string;
  imageAlt?: string;
  ageGroup: string;
  category: 'EDUCACION' | 'SALUD' | 'SOCIAL' | 'AMBIENTAL';
  targetAudience: string;
  objectives: string;
  implementation: string;
  results: string;
  methodology: string;
  resources: string;
  evaluation: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface MethodologyDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function MethodologyDetailPage({ params }: MethodologyDetailPageProps) {
  const resolvedParams = use(params);
  const [methodology, setMethodology] = useState<Methodology | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMethodology = async () => {
    try {
      setLoading(true);
      console.log('🔍 Buscando metodología con ID:', resolvedParams.id);
      const response = await fetch(`/api/public/methodologies/${resolvedParams.id}`);
      console.log('📡 Respuesta de la API:', response.status, response.statusText);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ Error de la API:', errorData);
        throw new Error(`Metodología no encontrada (${response.status})`);
      }
      const data = await response.json();
      console.log('✅ Metodología encontrada:', data.title);
      setMethodology(data);
    } catch (error) {
      console.error('❌ Error al cargar metodología:', error);
      setError(error instanceof Error ? error.message : 'Error al cargar la metodología');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMethodology();
  }, [resolvedParams.id]);

  const handleShare = async () => {
    if (navigator.share && methodology) {
      try {
        await navigator.share({
          title: methodology.title,
          text: methodology.description.substring(0, 200),
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error al compartir:', err);
      }
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'EDUCACION':
        return <Lightbulb className="h-6 w-6 text-blue-500" />;
      case 'SALUD':
        return <Heart className="h-6 w-6 text-red-500" />;
      case 'SOCIAL':
        return <Users className="h-6 w-6 text-green-500" />;
      case 'AMBIENTAL':
        return <Shield className="h-6 w-6 text-emerald-500" />;
      default:
        return <Target className="h-6 w-6 text-gray-500" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'EDUCACION':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'SALUD':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'SOCIAL':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'AMBIENTAL':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
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

  if (error || !methodology) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark">
        <SiteHeader />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-text-light dark:text-text-dark mb-4">Metodología no encontrada</h1>
            <p className="text-text-secondary-light dark:text-text-secondary-dark mb-8">{error}</p>
            <Button asChild>
              <Link href="/metodologias">Volver a Metodologías</Link>
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
          {/* Header de la metodología */}
          <header className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Badge className="bg-primary text-white px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-sm">
                METODOLOGÍA
              </Badge>
              <div className="flex items-center gap-2">
                {getCategoryIcon(methodology.category)}
                <Badge className={getCategoryColor(methodology.category)}>
                  {methodology.category}
                </Badge>
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-black text-text-light dark:text-text-dark leading-tight mb-6">
              {methodology.title}
            </h1>

            {/* Metadatos */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-text-secondary-light dark:text-text-secondary-dark mb-6">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>Grupo etario: {methodology.ageGroup}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                <span>Público objetivo: {methodology.targetAudience}</span>
              </div>
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
          {methodology.imageUrl && (
            <div className="mb-8">
              <div className="relative rounded-lg overflow-hidden shadow-lg">
                <Image
                  src={methodology.imageUrl}
                  alt={methodology.imageAlt || methodology.title}
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
                  Descripción de la Metodología
                </h2>
                <div className="text-lg leading-relaxed text-text-secondary-light dark:text-text-secondary-dark">
                  {methodology.description.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-4 last:mb-0">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>

              {/* Objetivos */}
              <div className="bg-card-light dark:bg-card-dark rounded-lg p-8 shadow-sm">
                <h2 className="text-2xl font-bold mb-6 text-text-light dark:text-text-dark">
                  Objetivos de la Metodología
                </h2>
                <div className="text-lg leading-relaxed text-text-secondary-light dark:text-text-secondary-dark">
                  {methodology.objectives.split('\n').map((paragraph, index) => (
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
                  {methodology.implementation.split('\n').map((paragraph, index) => (
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
                  {methodology.results.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-4 last:mb-0">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </article>

          {/* Footer de navegación */}
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-start">
              <Button 
                onClick={() => window.history.back()}
              >
                Ver más metodologías
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