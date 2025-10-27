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
import { SiteFooter } from '@/components/layout/site-footer';

interface Resource {
  id: string;
  title: string;
  description?: string;
  fileName: string;
  fileUrl: string;
  fileSize?: number;
  fileType?: string;
  category: 'MULTIMEDIA_CENTER' | 'PUBLICATIONS';
  subcategory?: 'VIDEOS' | 'AUDIOS' | 'DIGITAL_LIBRARY' | 'DOWNLOADABLE_GUIDES' | 'MANUALS';
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
  MULTIMEDIA_CENTER: {
    title: 'Centro Multimedia',
    description: 'Videos, audios y contenido multimedia interactivo',
    icon: PlayCircle,
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    bgColor: 'bg-blue-50 dark:bg-blue-950',
    subcategories: {
      VIDEOS: { title: 'Videos', icon: Video, color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' },
      AUDIOS: { title: 'Audios', icon: Music, color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' }
    }
  },
  PUBLICATIONS: {
    title: 'Publicaciones',
    description: 'Biblioteca digital, guías y manuales descargables',
    icon: BookOpen,
    color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    bgColor: 'bg-orange-50 dark:bg-orange-950',
    subcategories: {
      DIGITAL_LIBRARY: { title: 'Biblioteca Digital', icon: Library, color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200' },
      DOWNLOADABLE_GUIDES: { title: 'Guías Descargables', icon: FileDown, color: 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200' },
      MANUALS: { title: 'Manuales', icon: Book, color: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200' }
    }
  }
};

interface ImageGallery {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  imageAlt?: string;
  createdAt: string;
  program?: {
    id: string;
    sectorName: string;
  };
  project?: {
    id: string;
    title: string;
  };
  methodology?: {
    id: string;
    title: string;
  };
}

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [galleryImages, setGalleryImages] = useState<ImageGallery[]>([]);
  const [loading, setLoading] = useState(true);
  const [galleryLoading, setGalleryLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'multimedia' | 'publications' | 'gallery'>('multimedia');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchResources = async () => {
    try {
      setLoading(true);
      
      // No cargar recursos si estamos en el tab de galería
      if (activeTab === 'gallery') {
        setLoading(false);
        return;
      }
      
      const params = new URLSearchParams();
      
      // Aplicar filtro por categoría según el tab activo
      if (activeTab === 'multimedia') {
        params.append('category', 'MULTIMEDIA_CENTER');
      } else if (activeTab === 'publications') {
        params.append('category', 'PUBLICATIONS');
      }
      
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

  const fetchGalleryImages = async () => {
    try {
      setGalleryLoading(true);
      const response = await fetch('/api/public/image-library?limit=12');
      
      if (!response.ok) {
        throw new Error('Error al cargar imágenes');
      }
      
      const data = await response.json();
      setGalleryImages(data.images || []);
    } catch (error) {
      console.error('Error al cargar imágenes de galería:', error);
    } finally {
      setGalleryLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, [activeTab, selectedSubcategory, searchTerm]);

  useEffect(() => {
    fetchGalleryImages();
  }, []);

  // Reset subcategory when tab changes
  useEffect(() => {
    setSelectedSubcategory('');
  }, [activeTab]);

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
      <div className="relative min-h-screen flex items-center bg-hero">
        <div className="absolute inset-0 bg-black opacity-40 dark:opacity-60"></div>
        <main className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 flex justify-center">
          <div className="max-w-4xl text-white text-center">
            <div className="mb-6">
              <span className="inline-block bg-orange-400 text-gray-900 text-sm font-bold uppercase px-4 py-2 tracking-wider rounded">
                Centro de Recursos Multimedia
              </span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-tight text-white mb-6">
              CENTRO DE<br/>
              RECURSOS<br/>
              MULTIMEDIA
            </h1>
            <p className="text-lg md:text-xl text-gray-200 max-w-3xl mx-auto mb-8">
              Accede a nuestro centro multimedia con videos educativos, audios, biblioteca digital 
              y recursos descargables que enriquecen el aprendizaje y la formación comunitaria.
            </p>
            <div className="mt-8">
              <a className="inline-flex items-center bg-primary text-white px-6 py-3 rounded-lg text-base font-bold hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl font-condensed" href="#recursos">
                EXPLORAR RECURSOS
                <svg className="h-5 w-5 ml-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path clipRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" fillRule="evenodd"></path>
                </svg>
              </a>
            </div>
          </div>
        </main>
      </div>

      {/* Búsqueda y Tabs */}
      <section className="py-8 bg-background-light dark:bg-background-dark">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-text-light dark:text-text-dark mb-6 md:mb-0">
              RECURSOS
            </h2>
            {/* Tabs */}
            <div className="flex space-x-2 md:space-x-4">
              <button 
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                  activeTab === 'multimedia' 
                    ? 'bg-blue-600 text-white shadow-lg' 
                    : 'text-text-light dark:text-text-dark hover:bg-card-light dark:hover:bg-card-dark'
                }`}
                onClick={() => setActiveTab('multimedia')}
              >
                CENTRO MULTIMEDIA
              </button>
              <button 
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                  activeTab === 'publications' 
                    ? 'bg-orange-600 text-white shadow-lg' 
                    : 'text-text-light dark:text-text-dark hover:bg-card-light dark:hover:bg-card-dark'
                }`}
                onClick={() => setActiveTab('publications')}
              >
                PUBLICACIONES
              </button>
              <button 
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                  activeTab === 'gallery' 
                    ? 'bg-purple-600 text-white shadow-lg' 
                    : 'text-text-light dark:text-text-dark hover:bg-card-light dark:hover:bg-card-dark'
                }`}
                onClick={() => setActiveTab('gallery')}
              >
                GALERÍA
              </button>
            </div>
          </div>

          {/* Filtros */}
          <div className="bg-card-light dark:bg-card-dark rounded-lg p-6 shadow-sm mb-2">
            <div className={`grid grid-cols-1 ${activeTab === 'gallery' ? 'md:grid-cols-1' : 'md:grid-cols-2'} gap-4`}>
              {/* Búsqueda */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder={
                      activeTab === 'gallery' 
                        ? 'Buscar imágenes...' 
                        : activeTab === 'multimedia'
                        ? 'Buscar videos y audios...'
                        : 'Buscar publicaciones...'
                    }
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-border-light dark:border-border-dark rounded-lg bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary"
                  />
              </div>

              {/* Filtro por subcategoría */}
              {activeTab !== 'gallery' && (
              <div>
                <select
                  value={selectedSubcategory}
                  onChange={(e) => setSelectedSubcategory(e.target.value)}
                  className="w-full px-3 py-2 border border-border-light dark:border-border-dark rounded-lg bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">
                      {activeTab === 'multimedia' ? 'Todos los videos y audios' : 'Todas las publicaciones'}
                    </option>
                    {Object.entries(categoryInfo[activeTab === 'multimedia' ? 'MULTIMEDIA_CENTER' : 'PUBLICATIONS' as keyof typeof categoryInfo].subcategories).map(([key, info]) => (
                    <option key={key} value={key}>{info.title}</option>
                  ))}
                </select>
              </div>
              )}
            </div>
          </div>

          {/* Contador de resultados */}
          {(!loading && !galleryLoading) && (
            <div className="mt-4 mb-4">
              <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                {activeTab === 'gallery' ? (
                  <>Mostrando {galleryImages.length} {galleryImages.length === 1 ? 'imagen' : 'imágenes'}</>
                ) : (
                  <>Mostrando {resources.length} {resources.length === 1 ? 'recurso' : 'recursos'}</>
                )}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Secciones por Categoría */}
      <section className="pb-16 bg-background-light dark:bg-background-dark">
        <div className="container mx-auto px-4 pt-0">
          
          {/* Tab: Galería */}
          {activeTab === 'gallery' && (
            <>

              {galleryLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : galleryImages.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {galleryImages.map((image) => (
                    <div 
                      key={image.id} 
                      className="relative overflow-hidden rounded-lg aspect-square cursor-pointer group"
                    >
                      <img
                        src={image.imageUrl}
                        alt={image.imageAlt || image.title}
                        className="w-full h-full object-cover transition-all duration-300 group-hover:scale-110"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent">
                        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                          <h3 className="font-bold text-sm mb-1 line-clamp-1">
                            {image.title}
                          </h3>
                          {image.description && (
                            <p className="text-xs text-gray-200 line-clamp-2">
                              {image.description}
                            </p>
                          )}
                          <div className="flex flex-wrap gap-2 mt-2">
                            {image.methodology && (
                              <span className="text-xs bg-purple-500/80 px-2 py-1 rounded">
                                Iniciativa: {image.methodology.title}
                              </span>
                            )}
                            {image.program && (
                              <span className="text-xs bg-blue-500/80 px-2 py-1 rounded">
                                Programa: {image.program.sectorName}
                              </span>
                            )}
                            {image.project && (
                              <span className="text-xs bg-green-500/80 px-2 py-1 rounded">
                                Proyecto: {image.project.title}
                              </span>
                            )}
                            {!image.program && !image.project && !image.methodology && (
                              <span className="text-xs bg-gray-500/80 px-2 py-1 rounded">
                                Galería General
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <PlayCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-text-light dark:text-text-dark mb-2">
                    No hay imágenes disponibles
                  </h3>
                  <p className="text-text-secondary-light dark:text-text-secondary-dark">
                    Las imágenes de iniciativas, programas y proyectos aparecerán aquí cuando estén disponibles.
                  </p>
                </div>
              )}
            </>
          )}

          {/* Tab: Centro Multimedia */}
          {activeTab === 'multimedia' && (
            <>
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
          ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {resources.map((resource) => {
                  const FileIcon = getFileIcon(resource.fileType, resource.subcategory);
                  return (
                    <Card key={resource.id} className="bg-card-light dark:bg-card-dark hover:shadow-lg transition-shadow overflow-hidden">
                      {resource.thumbnailUrl ? (
                        <div className="relative w-full h-48 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
                          <img
                            src={resource.thumbnailUrl}
                            alt={resource.title}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                          <div className="absolute top-2 right-2">
                            {resource.isFeatured && (
                              <Star className="h-4 w-4 text-yellow-500 fill-current drop-shadow-md" />
                            )}
                          </div>
                          <div className="absolute top-2 left-2">
                            <div className="bg-card-light dark:bg-card-dark rounded-full p-2 shadow-md">
                              <FileIcon className="h-5 w-5 text-primary" />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="relative w-full h-48 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 flex items-center justify-center">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <FileIcon className="h-16 w-16 text-primary opacity-50" />
                          </div>
                          <div className="absolute top-2 right-2">
                            {resource.isFeatured && (
                              <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            )}
                          </div>
                        </div>
                      )}
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          {!resource.thumbnailUrl && (
                          <div className="flex items-center gap-2">
                            <FileIcon className="h-5 w-5 text-primary" />
                          </div>
                          )}
                          {!resource.thumbnailUrl && resource.isFeatured && (
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
                          <Button className="w-full" asChild>
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
              )}
            </>
          )}

          {/* Tab: Publicaciones */}
          {activeTab === 'publications' && (
            <>
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
              ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {resources.map((resource) => {
                        const FileIcon = getFileIcon(resource.fileType, resource.subcategory);
                        return (
                          <Card key={resource.id} className="bg-card-light dark:bg-card-dark hover:shadow-lg transition-shadow overflow-hidden">
                            {resource.thumbnailUrl ? (
                              <div className="relative w-full h-48 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950 dark:to-amber-950">
                                <img
                                  src={resource.thumbnailUrl}
                                  alt={resource.title}
                                  className="w-full h-full object-cover"
                                  loading="lazy"
                                />
                                <div className="absolute top-2 right-2">
                                  {resource.isFeatured && (
                                    <Star className="h-4 w-4 text-yellow-500 fill-current drop-shadow-md" />
                                  )}
                                </div>
                                <div className="absolute top-2 left-2">
                                  <div className="bg-card-light dark:bg-card-dark rounded-full p-2 shadow-md">
                                    <FileIcon className="h-5 w-5 text-primary" />
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="relative w-full h-48 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950 dark:to-amber-950 flex items-center justify-center">
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <FileIcon className="h-16 w-16 text-primary opacity-50" />
                                </div>
                                <div className="absolute top-2 right-2">
                                  {resource.isFeatured && (
                                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                  )}
                                </div>
                              </div>
                            )}
                            <CardContent className="p-6">
                              <div className="flex items-start justify-between mb-4">
                                {!resource.thumbnailUrl && (
                                <div className="flex items-center gap-2">
                                  <FileIcon className="h-5 w-5 text-primary" />
                                </div>
                                )}
                                {!resource.thumbnailUrl && resource.isFeatured && (
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
                          <Button className="w-full" asChild>
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
                    )}
            </>
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
      
      <SiteFooter />
    </div>
  );
}
