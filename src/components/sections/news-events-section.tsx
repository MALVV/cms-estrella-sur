'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin, ArrowRight, Search, Filter, Grid3X3, List, Star } from 'lucide-react';

interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  content?: string;
  imageUrl?: string;
  imageAlt?: string;
  category: 'NOTICIAS' | 'FUNDRAISING' | 'COMPAÑIA' | 'SIN_CATEGORIA';
  publishedAt: string;
  author?: string;
  isFeatured?: boolean;
}

interface EventItem {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  imageAlt?: string;
  eventDate: string;
  location?: string;
  isFeatured?: boolean;
}

interface NewsEventsSectionProps {
  featuredNews?: NewsItem;
  newsItems?: NewsItem[];
  eventItems?: EventItem[];
}

const categoryLabels = {
  NOTICIAS: 'Noticias',
  FUNDRAISING: 'Fundraising',
  COMPAÑIA: 'Compañía',
  SIN_CATEGORIA: 'Sin Categoría'
};

const categoryColors = {
  NOTICIAS: 'bg-blue-100 text-blue-800 dark:bg-blue-200 dark:text-blue-800',
  FUNDRAISING: 'bg-orange-100 text-orange-800 dark:bg-orange-200 dark:text-orange-900',
  COMPAÑIA: 'bg-green-100 text-green-800 dark:bg-green-200 dark:text-green-900',
  SIN_CATEGORIA: 'bg-gray-100 text-gray-800 dark:bg-gray-200 dark:text-gray-900'
};

export const NewsEventsSection: React.FC<NewsEventsSectionProps> = ({
  featuredNews,
  newsItems = [],
  eventItems = []
}) => {
  const [activeTab, setActiveTab] = useState<'news' | 'events'>('news');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeFilter, setActiveFilter] = useState<'all' | 'featured'>('all');
  const itemsPerPage = 9;

  // Filtrar elementos según búsqueda y filtros
  const filteredItems = React.useMemo(() => {
    let items = activeTab === 'news' ? newsItems : eventItems;
    
    // Filtrar por término de búsqueda
    if (searchTerm) {
      if (activeTab === 'news') {
        items = (items as NewsItem[]).filter(item => 
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (item.excerpt && item.excerpt.toLowerCase().includes(searchTerm.toLowerCase()))
        );
      } else {
        items = (items as EventItem[]).filter(item => 
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()))
        );
      }
    }
    
    // Filtrar por destacados
    if (activeFilter === 'featured') {
      if (activeTab === 'news') {
        items = (items as NewsItem[]).filter(item => item.isFeatured);
      } else {
        items = (items as EventItem[]).filter(item => item.isFeatured);
      }
    }
    
    return items;
  }, [activeTab, newsItems, eventItems, searchTerm, activeFilter]);

  // Calcular elementos para la página actual
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedItems = filteredItems.slice(startIndex, endIndex);

  // Resetear página cuando cambie la pestaña, búsqueda o filtros
  React.useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchTerm, activeFilter]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <>
      {/* Hero Section - Estilo Historias e Impacto */}
      <section className="py-16 bg-background-light dark:bg-background-dark">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            
            {/* Lado izquierdo - Imagen principal */}
            <div className="rounded-lg overflow-hidden shadow-lg">
              {featuredNews?.imageUrl ? (
                <img 
                  alt={featuredNews.imageAlt || featuredNews.title} 
                  className="w-full h-full object-cover" 
                    src={featuredNews.imageUrl}
                  />
                ) : (
                <img 
                  alt="Noticias e información actualizada" 
                  className="w-full h-full object-cover" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCSWrkgWeHL0vlHIirIGgCNz9iP7vshmaXQ82M0Fqdfr-GPDzM0oVSKDiJOAQjmDDWwEeZlwbBzEf4hVam5I4hzy_wbPGYc7bXszrV5y7Bsp5bzKtXHEEc_4py6_U2kEopOC9lr4ExAR8VMfbcQr5qhmxkrizRCbkmrNyS0scB0fGazr_rD7_cA3FdAswlN9HUlB6JXcMpIhEmmbk9P6dUemCGC8AGBRa5fwRClXh5Mw4dFC9sMQM4ja0c_PvoFJDBd1V9eDWgtG04"
                />
              )}
            </div>
            
            {/* Lado derecho - Contenido */}
            <div className="space-y-6">
              {/* Badge */}
              <div className="inline-block bg-primary text-white px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-sm">
                Noticias e información
                  </div>
              
              {/* Título principal */}
              <h1 className="text-4xl md:text-5xl font-black text-text-light dark:text-text-dark leading-tight">
                MANTENTE<br/>
                INFORMADO<br/>
                CON NUESTRAS NOTICIAS
              </h1>
              
              {/* Descripción enfocada en noticias */}
              <div className="space-y-4">
                <p className="text-lg text-text-secondary-light dark:text-text-secondary-dark leading-relaxed">
                  Descubre las últimas noticias, eventos y actualizaciones de nuestros programas. Mantente al día con el impacto que estamos generando en las comunidades.
                </p>
                <p className="text-base text-text-secondary-light dark:text-text-secondary-dark leading-relaxed">
                  Desde historias de éxito hasta eventos especiales, nuestras noticias te conectan con el trabajo que realizamos día a día.
                </p>
              </div>

              {/* Estadísticas enfocadas en contenido */}
              <div className="grid grid-cols-3 gap-4 pt-4">
                <div className="text-center p-3 bg-card-light dark:bg-card-dark rounded-lg shadow-sm">
                  <div className="text-2xl font-bold text-primary mb-1">{newsItems.length}</div>
                  <div className="text-xs text-text-secondary-light dark:text-text-secondary-dark">Noticias</div>
                </div>
                <div className="text-center p-3 bg-card-light dark:bg-card-dark rounded-lg shadow-sm">
                  <div className="text-2xl font-bold text-primary mb-1">{eventItems.length}</div>
                  <div className="text-xs text-text-secondary-light dark:text-text-secondary-dark">Eventos</div>
                </div>
                <div className="text-center p-3 bg-card-light dark:bg-card-dark rounded-lg shadow-sm">
                  <div className="text-2xl font-bold text-primary mb-1">{newsItems.filter(n => n.isFeatured).length + eventItems.filter(e => e.isFeatured).length}</div>
                  <div className="text-xs text-text-secondary-light dark:text-text-secondary-dark">Destacados</div>
                </div>
              </div>

              {/* Información adicional sobre noticias */}
              <div className="pt-4">
                <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                  Explora nuestras noticias organizadas por categorías y mantente informado sobre nuestros programas y eventos.
                </p>
              </div>
              </div>
            </div>
          </div>
        </section>

      {/* Grid Section */}
      <section className="py-16 bg-background-light dark:bg-background-dark">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-text-light dark:text-text-dark mb-6 md:mb-0">
              {activeTab === 'news' ? 'ÚLTIMAS NOTICIAS' : 'PRÓXIMOS EVENTOS'}
            </h1>
            <div className="flex space-x-2 md:space-x-4">
              {/* Selector de pestañas */}
              <button 
                className={`px-4 py-2 text-sm font-medium rounded-md ${activeTab === 'news' ? 'bg-brand text-brand-foreground' : 'text-subtext-light dark:text-subtext-dark hover:text-primary dark:hover:text-primary'}`}
                onClick={() => setActiveTab('news')}
              >
                NOTICIAS
              </button>
              <button 
                className={`px-4 py-2 text-sm font-medium rounded-md ${activeTab === 'events' ? 'bg-brand text-brand-foreground' : 'text-subtext-light dark:text-subtext-dark hover:text-primary dark:hover:text-primary'}`}
                onClick={() => setActiveTab('events')}
              >
                EVENTOS
              </button>
              
            </div>
          </div>

          {/* Searchbar y Filtros - Estilo similar a historias-impacto */}
          <div className="mb-8 space-y-4">
            {/* Barra de búsqueda */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary-light dark:text-text-secondary-dark h-4 w-4" />
                  <input
                    type="text"
                    placeholder={`Buscar ${activeTab === 'news' ? 'noticias' : 'eventos'}...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-border-light dark:border-border-dark rounded-lg bg-card-light dark:bg-card-dark text-text-light dark:text-text-dark focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant={activeFilter === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveFilter('all')}
                >
                  Todos
                </Button>
                <Button
                  variant={activeFilter === 'featured' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveFilter('featured')}
                >
                  <Star className="mr-1 h-4 w-4" />
                  Destacados
                </Button>
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Contador de resultados */}
            <div className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
              Mostrando {paginatedItems.length} de {filteredItems.length} {activeTab === 'news' ? 'noticias' : 'eventos'}
              {searchTerm && ` para "${searchTerm}"`}
            </div>
          </div>

          {/* Grid de contenido */}
          {paginatedItems.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-text-secondary-light dark:text-text-secondary-dark mb-4">
                <Search className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-text-light dark:text-text-dark mb-2">
                No se encontraron {activeTab === 'news' ? 'noticias' : 'eventos'}
              </h3>
              <p className="text-text-secondary-light dark:text-text-secondary-dark mb-4">
                {searchTerm 
                  ? `No hay resultados para "${searchTerm}". Intenta con otros términos de búsqueda.`
                  : activeFilter === 'featured' 
                    ? 'No hay elementos destacados disponibles.'
                    : 'No hay contenido disponible en este momento.'
                }
              </p>
              {(searchTerm || activeFilter !== 'all') && (
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchTerm('');
                    setActiveFilter('all');
                  }}
                >
                  Limpiar filtros
                </Button>
              )}
            </div>
          ) : (
            <div className={`grid gap-8 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                : 'grid-cols-1'
            }`}>
            {activeTab === 'news' ? (
              // Mostrar noticias paginadas
              paginatedItems.map((item) => {
                const newsItem = item as NewsItem;
                return (
                  <Link key={newsItem.id} href={`/news/${newsItem.id}`}>
                    <div className="bg-card-light dark:bg-card-dark rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col">
                      {newsItem.imageUrl ? (
                        <Image
                          src={newsItem.imageUrl}
                          alt={newsItem.imageAlt || newsItem.title}
                          width={400}
                          height={250}
                          className="w-full h-48 object-cover"
                        />
                      ) : (
                        <div className="w-full h-48 bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 dark:from-emerald-900/20 dark:via-blue-900/20 dark:to-purple-900/20 flex items-center justify-center">
                          <span className="material-symbols-outlined text-4xl text-primary">
                            article
                          </span>
                        </div>
                      )}
                      <div className="p-6 flex flex-col flex-grow">
                        <div className="text-sm mb-2">
                          <span className={`${categoryColors[newsItem.category]} text-xs font-semibold mr-2 px-2.5 py-0.5 rounded`}>
                            {categoryLabels[newsItem.category]}
                          </span>
                          <span className="text-subtext-light dark:text-subtext-dark">{formatDate(newsItem.publishedAt)}</span>
                        </div>
                        <h3 className="text-lg font-bold text-text-light dark:text-text-dark mb-2 line-clamp-2">
                          {newsItem.title}
                        </h3>
                        <p className="text-sm text-subtext-light dark:text-subtext-dark line-clamp-3 flex-grow">
                          {newsItem.excerpt}
                        </p>
                        <div className="mt-3 flex justify-end">
                          <Button variant="ghost" size="sm" className="text-primary hover:opacity-80">
                            Leer más
                            <ArrowRight className="ml-1 h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })
            ) : (
              // Mostrar eventos paginados
              paginatedItems.map((item) => {
                const eventItem = item as EventItem;
                return (
                  <Link key={eventItem.id} href={`/events/${eventItem.id}`}>
                    <div className="bg-card-light dark:bg-card-dark rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col">
                    {eventItem.imageUrl ? (
                      <Image
                        src={eventItem.imageUrl}
                        alt={eventItem.imageAlt || eventItem.title}
                        width={400}
                        height={250}
                        className="w-full h-48 object-cover"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 dark:from-emerald-900/20 dark:via-blue-900/20 dark:to-purple-900/20 flex items-center justify-center">
                        <span className="material-symbols-outlined text-4xl text-primary">
                          event
                        </span>
                      </div>
                    )}
                    <div className="p-6 flex flex-col flex-grow">
                      <div className="text-sm mb-2">
                        <span className="bg-brand/10 text-brand text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">
                          Evento
                        </span>
                        <span className="text-subtext-light dark:text-subtext-dark">{formatDate(eventItem.eventDate)}</span>
                      </div>
                      {eventItem.location && (
                        <div className="mb-2">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-text-secondary-light dark:text-text-secondary-dark" />
                            <span className="text-sm text-text-light dark:text-text-dark">
                              {eventItem.location}
                            </span>
                          </div>
                        </div>
                      )}
                      <h3 className="text-lg font-bold text-text-light dark:text-text-dark mb-2 line-clamp-2">
                        {eventItem.title}
                      </h3>
                      <p className="text-sm text-subtext-light dark:text-subtext-dark line-clamp-3 flex-grow">
                        {eventItem.description}
                      </p>
                      <div className="mt-3 flex justify-end">
                        <Button variant="ghost" size="sm" className="text-primary hover:opacity-80">
                          Leer más
                          <ArrowRight className="ml-1 h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    </div>
                  </Link>
                );
              })
            )}
            </div>
          )}

          {/* Controles de paginación */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-12 space-x-2">
              {/* Botón Anterior */}
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  currentPage === 1
                    ? 'bg-muted text-muted-foreground cursor-not-allowed'
                    : 'bg-card-light text-text-light hover:bg-background-light border border-border-light dark:bg-card-dark dark:text-text-dark dark:border-border-dark dark:hover:bg-background-dark'
                }`}
              >
                Anterior
              </button>

              {/* Números de página */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                // Mostrar solo páginas cercanas a la actual
                const showPage = 
                  page === 1 || 
                  page === totalPages || 
                  (page >= currentPage - 1 && page <= currentPage + 1);

                if (!showPage) {
                  // Mostrar puntos suspensivos
                  if (page === currentPage - 2 || page === currentPage + 2) {
                    return (
                      <span key={`dots-${page}`} className="px-3 py-2 text-sm text-gray-500">
                        ...
                      </span>
                    );
                  }
                  return null;
                }

                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-2 text-sm font-medium rounded-md ${
                      currentPage === page
                        ? 'bg-brand text-brand-foreground'
                        : 'bg-card-light text-text-light hover:bg-background-light border border-border-light dark:bg-card-dark dark:text-text-dark dark:border-border-dark dark:hover:bg-background-dark'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}

              {/* Botón Siguiente */}
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  currentPage === totalPages
                    ? 'bg-muted text-muted-foreground cursor-not-allowed'
                    : 'bg-card-light text-text-light hover:bg-background-light border border-border-light dark:bg-card-dark dark:text-text-dark dark:border-border-dark dark:hover:bg-background-dark'
                }`}
              >
                Siguiente
              </button>
            </div>
          )}

          {/* Información de paginación */}
          <div className="text-center mt-6 text-sm text-subtext-light dark:text-subtext-dark">
            Mostrando {startIndex + 1}-{Math.min(endIndex, filteredItems.length)} de {filteredItems.length} {activeTab === 'news' ? 'noticias' : 'eventos'}
          </div>
        </div>
      </section>
    </>
  );
};
