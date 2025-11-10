'use client';

import { useState, useEffect, use } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Play, Image as ImageIcon, Target, Users, BookOpen, Award, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SiteHeader } from '@/components/layout/site-header';
import { SiteFooter } from '@/components/layout/site-footer';
import { RelatedNewsCarousel } from '@/components/sections/related-news-carousel';

interface Programa {
  id: string;
  sectorName: string;
  description: string;
  imageUrl?: string;
  imageAlt?: string;
  presentationVideo?: string;
  targetGroups?: string;
  contentTopics?: string;
  results?: string;
  resultsAreas?: string;
  odsAlignment?: string;
  moreInfoLink?: string;
  isFeatured: boolean;
  news: Array<{
    id: string;
    title: string;
    content: string;
    publishedAt: string;
  }>;
  imageLibrary: Array<{
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    imageAlt: string;
  }>;
  _count: {
    news: number;
    imageLibrary: number;
  };
}

// Función para extraer el ID de YouTube de una URL
function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  
  // Patrones comunes de URLs de YouTube
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([^&\n?#]+)/,
    /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  
  return null;
}

export default function ProgramaDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [programa, setPrograma] = useState<Programa | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isVideoDialogOpen, setIsVideoDialogOpen] = useState(false);

  useEffect(() => {
    const fetchPrograma = async () => {
      try {
        const response = await fetch(`/api/public/programas/${id}`);
        if (!response.ok) {
          if (response.status === 404) {
            notFound();
          }
          throw new Error('Error al cargar el programa');
        }
        const data = await response.json();
        setPrograma(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchPrograma();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark">
        <SiteHeader />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-8"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            </div>
          </div>
        </div>
        <SiteFooter />
      </div>
    );
  }

  if (error || !programa) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark">
        <SiteHeader />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-2xl font-bold text-text-light dark:text-text-dark mb-4">
              Error al cargar el programa
            </h1>
            <p className="text-text-secondary-light dark:text-text-secondary-dark mb-8">
              {error || 'No se pudo cargar la información del programa.'}
            </p>
            <Button asChild>
              <Link href="/programas">Volver a Programas</Link>
            </Button>
          </div>
        </div>
        <SiteFooter />
      </div>
    );
  }

  const youtubeId = programa.presentationVideo ? extractYouTubeId(programa.presentationVideo) : null;

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <SiteHeader />
      
      {/* Hero Section */}
      <div 
        className="relative min-h-[60vh] flex items-center bg-cover bg-center" 
        style={{
          backgroundImage: programa.imageUrl 
            ? `url('${programa.imageUrl}')` 
            : "url('https://lh3.googleusercontent.com/aida-public/AB6AXuA5c7sgQH1Lc7mtyahGIQYWnnAo2tgVe7SqX7oZBhzKOsF6WT7-tG0K5qhw0bSScIu-DTQJ0XZs_C6nC-0D7DA8RySqIaXkg42tnBW4RdRPnCig5Rj0K_IjHGpt2auGQ1NNfTEso6LHX9rv0CnrRch126cPinPzvkfbhRK_OPE0zN3WMAXo4rjHiy0dj_vbqNfIEgRSIeYTNtdGRDHrVr1YxQTsDXV1IOhOYsnFw07qZXOSsZF5YjszrXliB3LtVb-yTqcQXDVizYQ')"
        }}
      >
        <div className="absolute inset-0 bg-black opacity-50 dark:opacity-70"></div>
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            {/* Botón de regreso */}
            <div className="mb-6">
              <Link href="/programas">
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-white hover:text-white hover:bg-white/20 backdrop-blur-sm"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Volver a Programas
                </Button>
              </Link>
            </div>
            
            <div className="text-white">
              <div className="mb-4">
                <span className="inline-block bg-orange-400 text-gray-900 text-xs font-bold uppercase px-3 py-1 tracking-wider">
                  Programas de Impacto
                </span>
                  </div>
              <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-6">
                {programa.sectorName}
              </h1>
              <p className="text-lg md:text-xl text-gray-200 max-w-3xl">
                    {programa.description}
                  </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Video y Sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Video de Presentación */}
            <div className="lg:col-span-2 space-y-6">
              {programa.presentationVideo ? (
                <Card className="bg-card-light dark:bg-card-dark shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-text-light dark:text-text-dark">
                      <Play className="h-5 w-5 text-primary" />
                      Video de Presentación
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {youtubeId ? (
                      <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                        <button
                          onClick={() => setIsVideoDialogOpen(true)}
                          className="block relative group w-full h-full cursor-pointer"
                        >
                          <img
                            src={`https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`}
                            alt={`Video de ${programa.sectorName}`}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/50 transition-colors">
                            <div className="bg-red-600 text-white rounded-full p-4 group-hover:bg-red-700 transition-colors">
                              <Play className="h-12 w-12" />
                            </div>
                          </div>
                        </button>
                      </div>
                    ) : (
                      <Button 
                        className="w-full" 
                        variant="default"
                        onClick={() => setIsVideoDialogOpen(true)}
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Ver Video de Presentación
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <Card className="bg-card-light dark:bg-card-dark shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-text-light dark:text-text-dark">
                      Información del Programa
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-text-secondary-light dark:text-text-secondary-dark">
                      {programa.description}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
            {/* Galería de Imágenes */}
            {programa.imageLibrary.length > 0 && (
                <Card className="bg-card-light dark:bg-card-dark shadow-lg">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-text-light dark:text-text-dark">
                      <ImageIcon className="h-5 w-5 text-primary" />
                    Galería de Imágenes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 gap-3">
                      {programa.imageLibrary.slice(0, 6).map((image) => (
                        <div key={image.id} className="group cursor-pointer">
                          <div className="aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden relative">
                            <img
                              src={image.imageUrl}
                              alt={image.imageAlt || image.title || `Imagen del programa ${programa.sectorName}`}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                            />
                            {/* Overlay con título */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                              <div className="absolute bottom-2 left-2 right-2">
                                <p className="text-white text-xs font-medium line-clamp-2">
                                  {image.title}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Botón para acceder a la galería completa */}
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <Button variant="outline" size="sm" className="w-full" asChild>
                        <Link href={`/programas/${programa.id}/galeria`}>
                          <ImageIcon className="h-4 w-4 mr-2" />
                          Ver Galería Completa ({programa.imageLibrary.length} imagen{programa.imageLibrary.length !== 1 ? 'es' : ''})
                        </Link>
                      </Button>
                    </div>
                </CardContent>
              </Card>
            )}
            </div>
          </div>

          {/* Información del Programa - Ancho completo */}
          <div className="space-y-8 mt-8">
            {/* Información del Programa - Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Grupos de Atención */}
              {programa.targetGroups && (
                <Card className="bg-card-light dark:bg-card-dark shadow-lg">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-3 text-text-light dark:text-text-dark text-lg">
                      <Users className="h-6 w-6 text-primary" />
                      Grupos de Atención
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="prose max-w-none">
                      <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed">
                        {programa.targetGroups}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Contenidos/Temas */}
              {programa.contentTopics && (
                <Card className="bg-card-light dark:bg-card-dark shadow-lg">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-3 text-text-light dark:text-text-dark text-lg">
                      <BookOpen className="h-6 w-6 text-primary" />
                      Contenidos y Temas
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="prose max-w-none">
                      <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed">
                        {programa.contentTopics}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Resultados - Sección destacada */}
            {programa.results && (
              <Card className="bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 shadow-lg border-orange-200 dark:border-orange-800">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-text-light dark:text-text-dark text-xl">
                    <Award className="h-7 w-7 text-primary" />
                    Resultados del Programa
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="prose max-w-none">
                    <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed text-base">
                      {programa.results}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Subareas de Resultados */}
            {programa.resultsAreas && (
              <Card className="bg-card-light dark:bg-card-dark shadow-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-text-light dark:text-text-dark text-lg">
                    <Target className="h-6 w-6 text-primary" />
                    Subareas de Resultados
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="prose max-w-none">
                    <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed">
                      {programa.resultsAreas}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Alineación ODS */}
            {programa.odsAlignment && (
              <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 shadow-lg border-blue-200 dark:border-blue-800">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-text-light dark:text-text-dark text-lg">
                    <Award className="h-6 w-6 text-blue-600" />
                    Alineación con ODS
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="prose max-w-none">
                    <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed">
                      {programa.odsAlignment}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
          </div>

        {/* Carrusel de Noticias Relacionadas */}
        <div className="mt-8">
        <RelatedNewsCarousel 
          programId={programa.id}
          title={`Noticias sobre ${programa.sectorName}`}
          limit={6}
        />
        </div>
      </div>

      {/* Dialog para reproducir video de YouTube */}
      {programa.presentationVideo && (
        <Dialog open={isVideoDialogOpen} onOpenChange={setIsVideoDialogOpen}>
          <DialogContent className="max-w-5xl max-h-[90vh] p-0 overflow-hidden">
            <DialogHeader className="px-6 pt-6 pb-1">
              <DialogTitle className="text-2xl">Video de Presentación - {programa.sectorName}</DialogTitle>
            </DialogHeader>
            {(() => {
              const videoId = extractYouTubeId(programa.presentationVideo!);
              if (!videoId) {
                return (
                  <div className="px-6 pb-6">
                    <p className="text-center text-muted-foreground py-8">
                      URL de video no válida. Por favor, verifica que sea una URL de YouTube.
                    </p>
                  </div>
                );
              }
              return (
                <div className="px-6 pt-2 pb-12 mb-4">
                  <div className="relative w-full bg-black rounded-lg overflow-hidden shadow-lg" style={{ paddingBottom: '56.25%' }}>
                    <iframe
                      className="absolute top-0 left-0 w-full h-full"
                      src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                      title={`Video de ${programa.sectorName}`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
              );
            })()}
          </DialogContent>
        </Dialog>
      )}

      <SiteFooter />
    </div>
  );
}