'use client'

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Download, 
  Search,
  Eye,
  Volume2,
  FileText,
  BookOpen,
  Video,
  Music,
  Monitor,
  Library,
  FileDown,
  Book,
  ArrowRight,
  Star,
  Clock,
  PlayCircle
} from 'lucide-react';
import { SiteHeader } from '@/components/layout/site-header';

interface Resource {
  id: string;
  title: string;
  description?: string;
  fileName: string;
  fileUrl: string;
  fileSize?: number;
  fileType?: string;
  category: 'CENTRO_MULTIMEDIA' | 'PUBLICACIONES';
  subcategory?: 'VIDEOS' | 'AUDIOS' | 'REPRODUCTOR_INTEGRADO' | 'BIBLIOTECA_DIGITAL' | 'GUIAS_DESCARGABLES' | 'MANUALES';
  thumbnailUrl?: string;
  duration?: number;
  isActive: boolean;
  isFeatured: boolean;
  downloadCount: number;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  creator?: {
    name?: string;
    email: string;
  };
}

const categoryInfo = {
  CENTRO_MULTIMEDIA: {
    title: 'Centro Multimedia',
    description: 'Videos, audios y contenido multimedia interactivo',
    icon: PlayCircle,
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    bgColor: 'bg-blue-50 dark:bg-blue-950',
    subcategories: {
      VIDEOS: { title: 'Videos', icon: Video, color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' },
      AUDIOS: { title: 'Audios', icon: Music, color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
      REPRODUCTOR_INTEGRADO: { title: 'Reproductor Integrado', icon: Monitor, color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' }
    }
  },
  PUBLICACIONES: {
    title: 'Publicaciones',
    description: 'Biblioteca digital, guías y manuales descargables',
    icon: BookOpen,
    color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    bgColor: 'bg-orange-50 dark:bg-orange-950',
    subcategories: {
      BIBLIOTECA_DIGITAL: { title: 'Biblioteca Digital', icon: Library, color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200' },
      GUIAS_DESCARGABLES: { title: 'Guías Descargables', icon: FileDown, color: 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200' },
      MANUALES: { title: 'Manuales', icon: Book, color: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200' }
    }
  }
};

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchResources = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedCategory) params.append('category', selectedCategory);
      if (selectedSubcategory) params.append('subcategory', selectedSubcategory);
      if (searchTerm) params.append('search', searchTerm);
      
      const response = await fetch(`/api/public/resources?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Error al cargar recursos');
      }
      const data = await response.json();
      setResources(data);
    } catch (error) {
      console.error('Error al cargar recursos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, [selectedCategory, selectedSubcategory, searchTerm]);

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return '';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getFileIcon = (fileType?: string, subcategory?: string) => {
    if (subcategory === 'VIDEOS') return Video;
    if (subcategory === 'AUDIOS') return Music;
    if (fileType?.includes('pdf')) return FileText;
    if (fileType?.includes('word') || fileType?.includes('document')) return FileText;
    if (fileType?.includes('excel') || fileType?.includes('spreadsheet')) return FileText;
    return FileText;
  };

  const groupedResources = resources.reduce((acc, resource) => {
    if (!acc[resource.category]) {
      acc[resource.category] = [];
    }
    acc[resource.category].push(resource);
    return acc;
  }, {} as Record<string, Resource[]>);

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <SiteHeader />
      
      {/* Hero Section */}
      <main className="relative min-h-[80vh] flex items-center justify-center bg-cover bg-center" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDxj7aF9-tpq6_zWnwVuojHHQc6bgc0eYuTVzXoE54LfjueardQbB6d3EFqZK3uv57oPTiHleVgH-Yi34c27AzoP75Qy1KG7aX02vlCFgOrykyPM-7ngRDNctmwl-uvyGeoidjSDqXHYXwBToi1ZuwUrOC0WEgjGrmw6E2n9SWGVuA-jl7O9o8Jpy99P817v_9-SFCIO7Y4FJ-vvLo2jZnXag1G1XwpbZuRBQKvKBtEKeA195mYIaDVYeWR_qsqQvyMmN5lHxaP-Q4')"}}>
        <div className="absolute inset-0 bg-white/80 dark:bg-black/70"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="relative p-4">
              <div className="absolute inset-0 -z-10">
                <img 
                  alt="Recursos multimedia" 
                  className="w-full h-full object-contain opacity-60" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuD6OIceM-_FT9G0DLEA6WqHqXlzlJU-VaRCRGc9YmiIowGpPowBftussI75QEvZB9_--dBx4PzUuEEy0IcDa2c_UceyI_2xYkO_HVTFssrxGoPHIw0omP5gMXjqYTSnA_3dvjAM7Lb8_71gI8ZwulPak0-RTUB6qMvKe9x6m10z9cuTF0uFGMHTQssgmxQqn0wX99_XKgOj86JVeNCaD1e0wfnzKVk4cA5Eww2nGD1KmW7CVDBSXCZjOxdgaJwWkcVw931k71FPm98"
                />
              </div>
              <div className="relative transform -rotate-6 max-w-sm mx-auto">
                <img 
                  alt="Centro multimedia" 
                  className="rounded-lg shadow-2xl w-full" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuB0DKGKMYw36YxwT9YsJXl1eVtdB-GCWJZ_4WjzDxUdML2vGmj6xbZ9_DwGHVQvh1D0lRny2Gki7pbHQWxUau_Inz0RHWtE6GevDh5_mykpglJ_LQSgxeGtCVCdHkXj_urWqkI8DkcmEH4EBrDXR-5153a4nN5xOuPvOr4Vs2y0Ii2HOYhPTuOpXEheDFlaSvA3XCpWfhe04uSO1aOu70z8qif64ppIm4lQWU2hWjlhHF-fSMDaXrbvE9MC_5dHxtbxBKygXs0JoO0"
                />
              </div>
              <div className="relative transform rotate-3 mt-[-15%] ml-[20%] max-w-xs">
                <img 
                  alt="Biblioteca digital" 
                  className="rounded-lg shadow-2xl w-full" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCcojMb_tNeqCrnNo1DH8v1vKFm2shH7i9X_UrDGDxoSUU6JdshPCdQy99xuAfZp_78sh87ME9W706dQ75iClppApHElnQaU0Svwngv46AOmz3-ke1ulDNpRN02F5Iujger72_L06XMRQBNEq3zPIXy7Jw7GPUm4rKpHEUBemS2jq5vmMKX_KQ3c7R0qRF0B2ZWlgIBFoMbn6UOXdsCepwN_iRMrzWpzQGLKhhitD8rxMKlOOlgf2mz6zhwgpXJV_NXcrTDU92VGkE"
                />
              </div>
            </div>
            <div className="text-left">
              <span className="inline-block bg-orange-400 text-gray-800 px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-sm mb-4">
                Recursos
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-text-light dark:text-text-dark leading-tight">
                CENTRO DE<br/>
                RECURSOS<br/>
                MULTIMEDIA
              </h1>
              <p className="mt-6 text-base text-text-light dark:text-text-dark/80 max-w-xl">
                Accede a nuestro centro multimedia con videos educativos, audios, biblioteca digital 
                y recursos descargables que enriquecen el aprendizaje y la formación.
              </p>
              <p className="mt-4 text-base text-text-light dark:text-text-dark/80 max-w-xl">
                Explora nuestra colección de publicaciones, guías prácticas y manuales 
                diseñados para apoyar el desarrollo comunitario.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Filtros y Búsqueda */}
      <section className="py-8 bg-background-light dark:bg-background-dark">
        <div className="container mx-auto px-4">
          <div className="bg-card-light dark:bg-card-dark rounded-lg p-6 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Búsqueda */}
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar recursos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-border-light dark:border-border-dark rounded-lg bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Filtro por categoría */}
              <div>
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setSelectedSubcategory(''); // Reset subcategory when category changes
                  }}
                  className="w-full px-3 py-2 border border-border-light dark:border-border-dark rounded-lg bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Todas las categorías</option>
                  {Object.entries(categoryInfo).map(([key, info]) => (
                    <option key={key} value={key}>{info.title}</option>
                  ))}
                </select>
              </div>

              {/* Filtro por subcategoría */}
              <div>
                <select
                  value={selectedSubcategory}
                  onChange={(e) => setSelectedSubcategory(e.target.value)}
                  className="w-full px-3 py-2 border border-border-light dark:border-border-dark rounded-lg bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary"
                  disabled={!selectedCategory}
                >
                  <option value="">Todas las subcategorías</option>
                  {selectedCategory && Object.entries(categoryInfo[selectedCategory as keyof typeof categoryInfo].subcategories).map(([key, info]) => (
                    <option key={key} value={key}>{info.title}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recursos por Categoría */}
      <section className="py-8 bg-background-light dark:bg-background-dark">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="bg-card-light dark:bg-card-dark">
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-2/3" />
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : selectedCategory ? (
            // Mostrar recursos de una categoría específica
            <div>
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-3 rounded-lg ${categoryInfo[selectedCategory as keyof typeof categoryInfo].bgColor}`}>
                    {React.createElement(categoryInfo[selectedCategory as keyof typeof categoryInfo].icon, { className: "h-6 w-6 text-primary" })}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-text-light dark:text-text-dark">
                      {categoryInfo[selectedCategory as keyof typeof categoryInfo].title}
                    </h2>
                    <p className="text-text-secondary-light dark:text-text-secondary-dark">
                      {categoryInfo[selectedCategory as keyof typeof categoryInfo].description}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {groupedResources[selectedCategory]?.map((resource) => {
                  const FileIcon = getFileIcon(resource.fileType, resource.subcategory);
                  return (
                    <Card key={resource.id} className="bg-card-light dark:bg-card-dark hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <FileIcon className="h-5 w-5 text-primary" />
                            {resource.subcategory && (() => {
                              const category = categoryInfo[resource.category as keyof typeof categoryInfo];
                              if (category?.subcategories) {
                                const subcategory = (category.subcategories as any)[resource.subcategory];
                                if (subcategory) {
                                  return (
                                    <Badge className={subcategory.color || 'bg-gray-100 text-gray-800'}>
                                      {subcategory.title}
                                    </Badge>
                                  );
                                }
                              }
                              return null;
                            })()}
                          </div>
                          {resource.isFeatured && (
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          )}
                        </div>

                        <h3 className="text-lg font-semibold text-text-light dark:text-text-dark mb-2 line-clamp-2">
                          {resource.title}
                        </h3>

                        {resource.description && (
                          <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm mb-4 line-clamp-3">
                            {resource.description}
                          </p>
                        )}

                        <div className="space-y-2 text-sm text-text-secondary-light dark:text-text-secondary-dark mb-4">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            <span>{resource.fileName}</span>
                          </div>
                          {resource.fileSize && (
                            <div className="flex items-center gap-2">
                              <Download className="h-4 w-4" />
                              <span>{formatFileSize(resource.fileSize)}</span>
                            </div>
                          )}
                          {resource.duration && (
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              <span>{formatDuration(resource.duration)}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <Eye className="h-4 w-4" />
                            <span>{resource.downloadCount} descargas</span>
                          </div>
                        </div>

                        <Button 
                          className="w-full" 
                          asChild
                        >
                          <a href={resource.fileUrl} target="_blank" rel="noopener noreferrer">
                            {resource.subcategory === 'VIDEOS' ? (
                              <>
                                <Play className="h-4 w-4 mr-2" />
                                Reproducir
                              </>
                            ) : resource.subcategory === 'AUDIOS' ? (
                              <>
                                <Volume2 className="h-4 w-4 mr-2" />
                                Escuchar
                              </>
                            ) : (
                              <>
                                <Download className="h-4 w-4 mr-2" />
                                Descargar
                              </>
                            )}
                          </a>
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          ) : (
            // Mostrar todas las categorías
            <div className="space-y-12">
              {Object.entries(categoryInfo).map(([categoryKey, categoryData]) => {
                const categoryResources = groupedResources[categoryKey] || [];
                if (categoryResources.length === 0) return null;

                return (
                  <div key={categoryKey}>
                    <div className="flex items-center gap-3 mb-6">
                      <div className={`p-3 rounded-lg ${categoryData.bgColor}`}>
                        {React.createElement(categoryData.icon, { className: "h-6 w-6 text-primary" })}
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-text-light dark:text-text-dark">
                          {categoryData.title}
                        </h2>
                        <p className="text-text-secondary-light dark:text-text-secondary-dark">
                          {categoryData.description}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {categoryResources.slice(0, 3).map((resource) => {
                        const FileIcon = getFileIcon(resource.fileType, resource.subcategory);
                        return (
                          <Card key={resource.id} className="bg-card-light dark:bg-card-dark hover:shadow-lg transition-shadow">
                            <CardContent className="p-6">
                              <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-2">
                                  <FileIcon className="h-5 w-5 text-primary" />
                                </div>
                                {resource.isFeatured && (
                                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                )}
                              </div>

                              <h3 className="text-lg font-semibold text-text-light dark:text-text-dark mb-2 line-clamp-2">
                                {resource.title}
                              </h3>

                              {resource.description && (
                                <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm mb-4 line-clamp-3">
                                  {resource.description}
                                </p>
                              )}

                              <div className="space-y-2 text-sm text-text-secondary-light dark:text-text-secondary-dark mb-4">
                                {resource.duration && (
                                  <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4" />
                                    <span>{formatDuration(resource.duration)}</span>
                                  </div>
                                )}
                                <div className="flex items-center gap-2">
                                  <Eye className="h-4 w-4" />
                                  <span>{resource.downloadCount} descargas</span>
                                </div>
                              </div>

                              <Button 
                                className="w-full" 
                                asChild
                              >
                                <a href={resource.fileUrl} target="_blank" rel="noopener noreferrer">
                                  {resource.subcategory === 'VIDEOS' ? (
                                    <>
                                      <Play className="h-4 w-4 mr-2" />
                                      Reproducir
                                    </>
                                  ) : resource.subcategory === 'AUDIOS' ? (
                                    <>
                                      <Volume2 className="h-4 w-4 mr-2" />
                                      Escuchar
                                    </>
                                  ) : (
                                    <>
                                      <Download className="h-4 w-4 mr-2" />
                                      Descargar
                                    </>
                                  )}
                                </a>
                              </Button>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>

                    {categoryResources.length > 3 && (
                      <div className="text-center mt-6">
                        <Button 
                          variant="outline" 
                          onClick={() => setSelectedCategory(categoryKey)}
                        >
                          Ver todos los recursos ({categoryResources.length})
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {!loading && resources.length === 0 && (
            <div className="text-center py-12">
              <PlayCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-text-light dark:text-text-dark mb-2">
                No se encontraron recursos
              </h3>
              <p className="text-text-secondary-light dark:text-text-secondary-dark">
                Intenta ajustar los filtros de búsqueda o vuelve más tarde.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Compromiso con los Recursos */}
      <section className="py-20 bg-orange-500 dark:bg-orange-600 text-white dark:text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-32 h-32 bg-white rounded-full blur-3xl"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-yellow-200 rounded-full blur-2xl"></div>
          <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-orange-200 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <span className="inline-block bg-orange-200 text-orange-800 dark:bg-orange-300 dark:text-orange-900 text-xs font-semibold px-3 py-1 rounded-full mb-4 font-condensed">
              RECURSOS EDUCATIVOS
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white dark:text-white leading-tight font-condensed">
              APRENDIZAJE MULTIMEDIA PARA TODOS
            </h2>
            <p className="text-xl text-white dark:text-white max-w-3xl mx-auto mt-4">
              Nuestro centro de recursos multimedia ofrece contenido educativo diverso 
              y accesible para enriquecer el aprendizaje y la formación comunitaria.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-white/20 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <Video className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white dark:text-white mb-2">Videos</h3>
              <p className="text-white dark:text-white">Contenido audiovisual educativo</p>
            </div>
            <div className="text-center">
              <div className="bg-white/20 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <Music className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white dark:text-white mb-2">Audios</h3>
              <p className="text-white dark:text-white">Podcasts y contenido sonoro</p>
            </div>
            <div className="text-center">
              <div className="bg-white/20 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <Library className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white dark:text-white mb-2">Biblioteca</h3>
              <p className="text-white dark:text-white">Recursos digitales completos</p>
            </div>
            <div className="text-center">
              <div className="bg-white/20 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <Book className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white dark:text-white mb-2">Manuales</h3>
              <p className="text-white dark:text-white">Guías prácticas descargables</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
