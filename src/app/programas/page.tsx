'use client';

import { useState, useEffect } from 'react';
import { Play, Newspaper, Image as ImageIcon, Target } from 'lucide-react';
import Link from 'next/link';
import { SiteHeader } from '@/components/layout/site-header';
import { SiteFooter } from '@/components/layout/site-footer';

interface Programa {
  id: string;
  nombreSector: string;
  descripcion: string;
  imageUrl?: string;
  imageAlt?: string;
  videoPresentacion?: string;
  alineacionODS?: string;
  subareasResultados?: string;
  resultados?: string;
  gruposAtencion?: string;
  contenidosTemas?: string;
  enlaceMasInformacion?: string;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
  imageLibrary: Array<{
    id: string;
    title: string;
    imageUrl: string;
    imageAlt: string;
  }>;
  _count: {
    news: number;
    imageLibrary: number;
  };
}


export default function ProgramasPage() {
  const [programas, setProgramas] = useState<Programa[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgramas = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/public/programas');
        if (!response.ok) {
          throw new Error('Error al cargar programas');
        }
        const data = await response.json();
        setProgramas(data.programas || []);
      } catch (error) {
        console.error('Error cargando programas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProgramas();
  }, []);


  if (loading) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark">
        <SiteHeader />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <SiteHeader />
      
      {/* Hero Section */}
      <div className="relative h-[calc(100vh-80px)] flex items-center bg-hero">
        <div className="absolute inset-0 bg-black opacity-40 dark:opacity-60"></div>
        <main className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 flex justify-center">
          <div className="max-w-2xl text-white text-center">
            <div className="mb-4">
              <span className="inline-block bg-orange-400 text-gray-900 text-xs font-bold uppercase px-3 py-1 tracking-wider">
                Nuestros Programas
              </span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight text-white">
              PROGRAMAS<br/>
              ESTRATÉGICOS<br/>
              DE IMPACTO
            </h1>
            <p className="mt-6 text-lg md:text-xl text-gray-200 max-w-3xl mx-auto">
              Descubre nuestros programas integrales de largo plazo que abordan las causas raíz de los problemas sociales, creando soluciones sostenibles y transformadoras.
            </p>
            <div className="mt-8">
              <a className="inline-flex items-center bg-primary text-white text-sm font-bold py-3 px-6 rounded-sm hover:bg-opacity-90 transition-colors duration-300" href="#programas">
                EXPLORA NUESTROS PROGRAMAS
                <svg className="h-5 w-5 ml-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path clipRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" fillRule="evenodd"></path>
                </svg>
              </a>
            </div>
          </div>
        </main>
      </div>

      <main className="container mx-auto px-4 py-8" id="programas">
        {/* Introducción */}
        <div className="text-center mb-12">
          <span className="inline-block bg-primary text-white text-xs font-semibold px-3 py-1 rounded mb-4">
            NUESTROS PROGRAMAS
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-text-light dark:text-text-dark leading-tight mb-6">
            Programas Estratégicos de Impacto
              </h2>
          <p className="text-lg text-text-secondary-light dark:text-text-secondary-dark max-w-4xl mx-auto">
            Descubre nuestros programas integrales diseñados para abordar desafíos sociales fundamentales. Cada programa está estructurado para generar impacto sostenible y transformador en las comunidades más vulnerables.
              </p>
            </div>

            {programas.length === 0 ? (
              <div className="text-center py-12">
                <Target className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-text-secondary-light dark:text-text-secondary-dark">
                  No hay programas disponibles en este momento.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
            {programas.map((programa, index) => {
              // Imágenes de fallback para programas sin imagen personalizada
              const fallbackImages = [
                "https://lh3.googleusercontent.com/aida-public/AB6AXuA5c7sgQH1Lc7mtyahGIQYWnnAo2tgVe7SqX7oZBhzKOsF6WT7-tG0K5qhw0bSScIu-DTQJ0XZs_C6nC-0D7DA8RySqIaXkg42tnBW4RdRPnCig5Rj0K_IjHGpt2auGQ1NNfTEso6LHX9rv0CnrRch126cPinPzvkfbhRK_OPE0zN3WMAXo4rjHiy0dj_vbqNfIEgRSIeYTNtdGRDHrVr1YxQTsDXV1IOhOYsnFw07qZXOSsZF5YjszrXliB3LtVb-yTqcQXDVizYQ",
                "https://lh3.googleusercontent.com/aida-public/AB6AXuBfcd1THX-kNBtPUO3yGHeTZXEqtXox42LyzhCfPYktbQc-RvgkPJDmPICrmGJITFvAvYfflo9F1p1wiRHLTKaJM4uAN-6ZyGpcAL0m7kTVJv1pZyM06QJgk84mx4R7V6EHYmEwrnRB0hm_ihJyOndWkRa49kJ_ssPoEMX-YvtfdRtREi24WNHjiaU-_w5EWlJRTO418v5NQDvbaVksG0069Vmang3LLhAxpzMegCdIfTaUvRbx60JgZk4XFmeb2dPcvEzwkKtIwyY",
                "https://lh3.googleusercontent.com/aida-public/AB6AXuD95Djd7grT7KPgWsCpRX9pQfnUKAc0pVGzScwfMjfDJLQHhQw3f-6KNWYCtfJlo62MocE_H3KOvqij7kjrUsJYo9DMMur2bojx8Y9zUc5hMHmqRCPuJt23tyazG2pB2yc0C9LB8KY8EWLh1U7lqFfCQolo_gqfzcWKPo98Rv5OGaRTuuSj849TklYSgMtxKnLmdsFKy7WszCtV7MXXhCD53uNijabU-Tm_gnlUleyJOOSM4OqhjVZ1kRO-wJB0CyGENPXyxvy5L64"
              ];
              
              // Lógica de prioridad para imágenes:
              // 1. Imagen personalizada del programa (imageUrl)
              // 2. Primera imagen de la biblioteca de imágenes
              // 3. Imagen de fallback basada en el índice
              const hasLibraryImage = programa.imageLibrary && programa.imageLibrary.length > 0;
              
              const currentImage = programa.imageUrl && programa.imageUrl.trim() !== ''
                ? programa.imageUrl
                : hasLibraryImage 
                  ? programa.imageLibrary[0].imageUrl
                  : fallbackImages[index % fallbackImages.length];
              
              const imageAlt = programa.imageUrl && programa.imageUrl.trim() !== ''
                ? (programa.imageAlt || programa.nombreSector)
                : hasLibraryImage 
                  ? (programa.imageLibrary[0].imageAlt || programa.nombreSector)
                  : programa.nombreSector;
              
              return (
                <div key={programa.id} className="bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm shadow-lg overflow-hidden hover:shadow-2xl hover:scale-105 transition-all duration-300 border border-white/20 dark:border-gray-600/20">
                  {/* Imagen del programa */}
                  <div className="relative h-48 sm:h-56">
                    <img
                      src={currentImage}
                      alt={imageAlt}
                      className="w-full h-full object-cover"
                    />
                    {/* Overlay con gradiente sutil */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                  </div>
                  
                  {/* Información del programa */}
                  <div className="p-2.5">
                    <div className="text-left">
                      {/* Título del programa */}
                      <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1.5">
                        {programa.nombreSector}
                      </h3>
                      
                      {/* Descripción del programa */}
                      <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed mb-1.5 line-clamp-2">
                        {programa.descripcion}
                      </p>
                      
                      {/* Metadatos */}
                      <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mb-2">
                        <div className="flex items-center gap-1">
                          <Newspaper className="h-3 w-3" />
                          <span>{programa._count.news} noticias</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <ImageIcon className="h-3 w-3" />
                          <span>{programa._count.imageLibrary} imágenes</span>
                        </div>
                      </div>

                      {/* Botones de acción */}
                      <div className="flex gap-2">
                        <Link 
                          href={`/programas/${programa.id}`}
                          className="flex-1 bg-primary text-white text-xs font-bold py-2 px-3 rounded hover:bg-opacity-90 transition-colors text-center"
                        >
                          Ver Detalles
                        </Link>
                        {programa._count.imageLibrary > 0 && (
                          <Link 
                            href={`/programas/${programa.id}/galeria`}
                            className="bg-white/60 dark:bg-gray-600/60 backdrop-blur-sm text-gray-700 dark:text-gray-200 text-xs font-medium py-2 px-3 rounded border border-white/30 dark:border-gray-500/30 hover:bg-opacity-80 transition-colors"
                            title="Ver galería de imágenes"
                          >
                            <ImageIcon className="h-3 w-3" />
                          </Link>
                        )}
                        {programa.videoPresentacion && (
                          <a 
                            href={programa.videoPresentacion} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="bg-white/60 dark:bg-gray-600/60 backdrop-blur-sm text-gray-700 dark:text-gray-200 text-xs font-medium py-2 px-3 rounded border border-white/30 dark:border-gray-500/30 hover:bg-opacity-80 transition-colors"
                            title="Ver video"
                          >
                            <Play className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
              </div>
            )}
      </main>

      <SiteFooter />
    </div>
  );
}