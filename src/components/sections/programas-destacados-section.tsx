'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Play, ExternalLink, Newspaper, Image as ImageIcon, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface Programa {
  id: string;
  sectorName: string;
  description: string;
  presentationVideo?: string;
  moreInfoLink?: string;
  isFeatured: boolean;
  _count: {
    news: number;
    imageLibrary: number;
  };
}

export function ProgramasDestacadosSection() {
  const [programas, setProgramas] = useState<Programa[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgramas = async () => {
      try {
        const response = await fetch('/api/public/programas?featured=true&limit=3');
        if (!response.ok) throw new Error('Error al cargar programas');
        
        const data = await response.json();
        setProgramas(data.programas);
      } catch (error) {
        console.error('Error fetching programas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProgramas();
  }, []);

  const extractYouTubeId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/);
    return match ? match[1] : null;
  };

  if (loading) {
    return (
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Nuestros Programas</h2>
            <p className="text-gray-600 dark:text-gray-400">Cargando programas destacados...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Nuestros Programas Destacados
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Conoce los programas que desarrollamos para generar impacto positivo en las comunidades
          </p>
        </div>

        {programas.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">
              No hay programas destacados disponibles en este momento.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            {programas.map((programa) => {
              const youtubeId = programa.presentationVideo ? extractYouTubeId(programa.presentationVideo) : null;
              
              return (
                <Card key={programa.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between mb-2">
                      <CardTitle className="text-xl line-clamp-2">
                        {programa.sectorName}
                      </CardTitle>
                      <Badge variant="secondary" className="ml-2">Destacado</Badge>
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-400 line-clamp-3">
                      {programa.description}
                    </p>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Video Thumbnail */}
                    {youtubeId && (
                      <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden relative">
                        <img
                          src={`https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`}
                          alt={`Video de ${programa.sectorName}`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="bg-red-600 text-white rounded-full p-3 hover:bg-red-700 transition-colors cursor-pointer">
                            <Play className="h-6 w-6" />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Estadísticas */}
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <Newspaper className="h-4 w-4" />
                        <span>{programa._count.news} noticias</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ImageIcon className="h-4 w-4" />
                        <span>{programa._count.imageLibrary} imágenes</span>
                      </div>
                    </div>

                    {/* Botones de Acción */}
                    <div className="flex gap-2">
                      <Button asChild className="flex-1">
                        <Link href={`/programas/${programa.id}`}>
                          Ver Detalles
                        </Link>
                      </Button>
                      
                      {programa.moreInfoLink && (
                        <Button
                          variant="outline"
                          asChild
                          className="flex items-center gap-2"
                        >
                          <a
                            href={programa.moreInfoLink}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Botón para ver todos los programas */}
        <div className="text-center">
          <Button asChild size="lg" variant="outline">
            <Link href="/programas" className="flex items-center gap-2">
              Ver Todos los Programas
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
