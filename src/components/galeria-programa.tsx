'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SiteHeader } from '@/components/layout/site-header';
import { SiteFooter } from '@/components/layout/site-footer';
import { 
  ArrowLeft, 
  Calendar, 
  Image as ImageIcon,
  ExternalLink,
  Download,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface Programa {
  id: string;
  sectorName: string;
  description: string;
  imageUrl?: string;
  imageAlt?: string;
}

interface ImageItem {
  id: string;
  title: string;
  imageUrl: string;
  imageAlt?: string;
  createdAt: string;
}

interface GaleriaProgramaProps {
  programId: string;
}

export function GaleriaPrograma({ programId }: GaleriaProgramaProps) {
  const [programa, setPrograma] = useState<Programa | null>(null);
  const [images, setImages] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  useEffect(() => {
    fetchGaleria();
  }, [programId]);

  const fetchGaleria = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/programas/${programId}/galeria`);
      
      if (!response.ok) {
        if (response.status === 404) {
          setError('Programa no encontrado');
        } else {
          setError('Error al cargar la galería');
        }
        return;
      }

      const data = await response.json();
      setPrograma(data.programa);
      setImages(data.images);
    } catch (error) {
      console.error('Error fetching galeria:', error);
      setError('Error al cargar la galería');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (index: number) => {
    setSelectedImageIndex(index);
  };

  const closeModal = () => {
    setSelectedImageIndex(null);
  };

  const goToPrevious = () => {
    if (selectedImageIndex !== null && selectedImageIndex > 0) {
      setSelectedImageIndex(selectedImageIndex - 1);
    }
  };

  const goToNext = () => {
    if (selectedImageIndex !== null && selectedImageIndex < images.length - 1) {
      setSelectedImageIndex(selectedImageIndex + 1);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      closeModal();
    } else if (e.key === 'ArrowLeft') {
      goToPrevious();
    } else if (e.key === 'ArrowRight') {
      goToNext();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark">
        <SiteHeader />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Cargando galería...</p>
            </div>
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  if (error || !programa) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark">
        <SiteHeader />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {error || 'Programa no encontrado'}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                No se pudo cargar la galería de imágenes.
              </p>
              <Link href="/programas">
                <Button variant="outline">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Volver a Programas
                </Button>
              </Link>
            </div>
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <SiteHeader />
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/programas">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver a Programas
              </Button>
            </Link>
          </div>

          {/* Título del programa */}
          <div className="mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {programa.sectorName}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed">
              {programa.description}
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-500 mt-4">
              <ImageIcon className="h-4 w-4" />
              <span>{images.length} imagen{images.length !== 1 ? 'es' : ''} en la galería</span>
            </div>
          </div>

          {/* Galería de imágenes en grid */}
          {images.length > 0 ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Galería de Imágenes
                </h2>
                <Badge variant="outline">
                  {images.length} imagen{images.length !== 1 ? 'es' : ''}
                </Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {images.map((image, index) => (
                  <Card key={image.id} className="overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer" onClick={() => openModal(index)}>
                    <div 
                      className="aspect-video bg-gray-100 dark:bg-gray-800 relative overflow-hidden"
                      title={image.imageAlt || ''}
                    >
                      <Image
                        src={image.imageUrl}
                        alt={image.imageAlt || image.title || 'Imagen del programa'}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-200"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                      
                      {/* Overlay con información */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <div className="absolute bottom-2 left-2 right-2">
                          {image.imageAlt && (
                            <p className="text-white/80 text-xs font-normal line-clamp-4 leading-relaxed">
                              {image.imageAlt}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Botón Ver todas las fotos */}
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <Button
                          size="sm"
                          className="bg-black/50 hover:bg-black/70 text-white text-xs px-2 py-1 h-auto"
                          onClick={(e) => {
                            e.stopPropagation();
                            openModal(index);
                          }}
                        >
                          Ver todas las fotos
                        </Button>
                      </div>
                    </div>
                    
                    <CardContent className="p-3">
                      <h3 className="font-medium text-gray-900 dark:text-white text-sm line-clamp-2 mb-1">
                        {image.title}
                      </h3>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Calendar className="h-3 w-3" />
                        {new Date(image.createdAt).toLocaleDateString()}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <Card className="h-full">
              <CardContent className="p-12 text-center h-full flex flex-col justify-center">
                <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  No hay imágenes disponibles
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Este programa aún no tiene imágenes en su galería.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <SiteFooter />

      {/* Modal de imagen */}
      {selectedImageIndex !== null && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={closeModal}
          onKeyDown={handleKeyDown}
          tabIndex={-1}
        >
          <div className="relative max-w-7xl max-h-full w-full h-full flex items-center justify-center">
            {/* Imagen principal */}
            <div 
              className="relative max-w-full max-h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={images[selectedImageIndex].imageUrl}
                alt={images[selectedImageIndex].imageAlt || images[selectedImageIndex].title || 'Imagen del programa'}
                width={1200}
                height={800}
                className="max-w-full max-h-full object-contain rounded-lg"
                priority
              />

              {/* Botón cerrar */}
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white"
                onClick={closeModal}
              >
                <X className="h-6 w-6" />
              </Button>

              {/* Botón anterior */}
              {selectedImageIndex > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    goToPrevious();
                  }}
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
              )}

              {/* Botón siguiente */}
              {selectedImageIndex < images.length - 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    goToNext();
                  }}
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              )}
            </div>

            {/* Información de la imagen */}
            <div className="absolute bottom-4 left-4 right-4 bg-black/70 backdrop-blur-sm rounded-lg p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold mb-1">
                    {images[selectedImageIndex].title}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <Calendar className="h-4 w-4" />
                    {new Date(images[selectedImageIndex].createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="text-sm text-gray-300">
                  {selectedImageIndex + 1} de {images.length}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
