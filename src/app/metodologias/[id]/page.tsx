'use client'

import React, { useState, useEffect, use } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Target, Calendar, Lightbulb, Heart, Shield, CheckCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { SiteHeader } from '@/components/layout/site-header';
import { RelatedNewsCarousel } from '@/components/sections/related-news-carousel';
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
      const response = await fetch(`/api/public/methodologies/${resolvedParams.id}`);
      if (!response.ok) {
        throw new Error('Metodología no encontrada');
      }
      const data = await response.json();
      setMethodology(data);
    } catch (error) {
      console.error('Error al cargar metodología:', error);
      setError('Error al cargar la metodología');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMethodology();
  }, [resolvedParams.id]);

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
      
      {/* Header con gradiente del home */}
      <div className="relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full z-0">
          <div className="w-full h-full bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 dark:from-emerald-900/20 dark:via-blue-900/20 dark:to-purple-900/20"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-background-light/90 via-background-light/70 to-background-light dark:from-background-dark/90 dark:via-background-dark/70 dark:to-background-dark"></div>
        </div>
        
        <div className="relative z-10 container mx-auto px-4 py-8 sm:py-12 md:py-16">
          {/* Header de la metodología */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              {getCategoryIcon(methodology.category)}
              <Badge className={getCategoryColor(methodology.category)}>
                {methodology.category}
              </Badge>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-text-light dark:text-text-dark mb-4 font-condensed">
              {methodology.title}
            </h1>
            
            <p className="text-xl text-text-secondary-light dark:text-text-secondary-dark max-w-3xl mx-auto mb-6">
              {methodology.description}
            </p>

            <div className="flex flex-wrap justify-center gap-6 text-sm text-text-secondary-light dark:text-text-secondary-dark">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                <span>{methodology.ageGroup}</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-primary" />
                <span>{methodology.targetAudience}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido Principal */}
      <main className="container mx-auto px-4 py-8 sm:py-12 md:py-16">
        <div className="max-w-4xl mx-auto">
          {/* Imagen Principal */}
          {methodology.imageUrl && (
            <div className="mb-8">
              <div className="relative h-64 sm:h-80 md:h-96 rounded-lg overflow-hidden">
                <Image
                  src={methodology.imageUrl}
                  alt={methodology.imageAlt || methodology.title}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          )}

          {/* Información Detallada */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Objetivos */}
            <Card className="bg-card-light dark:bg-card-dark">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Target className="h-5 w-5 text-primary" />
                  <h3 className="text-xl font-bold text-text-light dark:text-text-dark font-condensed">Objetivos</h3>
                </div>
                <p className="text-text-secondary-light dark:text-text-secondary-dark">
                  {methodology.objectives}
                </p>
              </CardContent>
            </Card>

            {/* Implementación */}
            <Card className="bg-card-light dark:bg-card-dark">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="h-5 w-5 text-primary" />
                  <h3 className="text-xl font-bold text-text-light dark:text-text-dark font-condensed">Implementación</h3>
                </div>
                <p className="text-text-secondary-light dark:text-text-secondary-dark">
                  {methodology.implementation}
                </p>
              </CardContent>
            </Card>

            {/* Metodología */}
            <Card className="bg-card-light dark:bg-card-dark">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Lightbulb className="h-5 w-5 text-primary" />
                  <h3 className="text-xl font-bold text-text-light dark:text-text-dark font-condensed">Metodología</h3>
                </div>
                <p className="text-text-secondary-light dark:text-text-secondary-dark">
                  {methodology.methodology || 'Metodología detallada en desarrollo...'}
                </p>
              </CardContent>
            </Card>

            {/* Resultados */}
            <Card className="bg-card-light dark:bg-card-dark">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <h3 className="text-xl font-bold text-text-light dark:text-text-dark font-condensed">Resultados</h3>
                </div>
                <p className="text-text-secondary-light dark:text-text-secondary-dark">
                  {methodology.results}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Recursos y Evaluación */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Recursos */}
            <Card className="bg-card-light dark:bg-card-dark">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-text-light dark:text-text-dark mb-4 font-condensed">Recursos Necesarios</h3>
                <p className="text-text-secondary-light dark:text-text-secondary-dark">
                  {methodology.resources || 'Lista de recursos en desarrollo...'}
                </p>
              </CardContent>
            </Card>

            {/* Evaluación */}
            <Card className="bg-card-light dark:bg-card-dark">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-text-light dark:text-text-dark mb-4 font-condensed">Sistema de Evaluación</h3>
                <p className="text-text-secondary-light dark:text-text-secondary-dark">
                  {methodology.evaluation || 'Sistema de evaluación en desarrollo...'}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Galería de Fotos */}
          <Card className="bg-card-light dark:bg-card-dark mb-12">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-text-light dark:text-text-dark mb-6 font-condensed">Galería de Fotos</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Placeholder para fotos */}
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="relative h-48 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="material-symbols-outlined text-4xl text-gray-400">image</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Botones de Acción */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-white font-bold font-condensed" asChild>
              <Link href="/metodologias">Ver Otras Metodologías</Link>
            </Button>
            <Button size="lg" variant="outline" className="font-condensed">
              Contactar para Implementación
            </Button>
          </div>

          {/* Noticias Relacionadas */}
          <RelatedNewsCarousel 
            methodologyId={resolvedParams.id}
            title="Noticias Relacionadas con esta Metodología"
            limit={6}
          />
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
