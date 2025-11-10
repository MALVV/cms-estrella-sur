'use client'

import React, { useState, useEffect, useCallback } from 'react';
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
  PlayCircle,
  Images,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { VisuallyHidden } from '@/components/ui/visually-hidden';
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
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 hover:bg-blue-200 hover:text-blue-900 dark:hover:bg-blue-800 dark:hover:text-blue-100 transition-colors duration-200 cursor-default',
    bgColor: 'bg-blue-50 dark:bg-blue-950',
    subcategories: {
      VIDEOS: { title: 'Videos', icon: Video, color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 hover:bg-red-200 hover:text-red-900 dark:hover:bg-red-800 dark:hover:text-red-100 transition-colors duration-200 cursor-default' },
      AUDIOS: { title: 'Audios', icon: Music, color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 hover:bg-green-200 hover:text-green-900 dark:hover:bg-green-800 dark:hover:text-green-100 transition-colors duration-200 cursor-default' }
    }
  },
  PUBLICATIONS: {
    title: 'Publicaciones',
    description: 'Biblioteca digital, guías y manuales descargables',
    icon: BookOpen,
    color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 hover:bg-orange-200 hover:text-orange-900 dark:hover:bg-orange-800 dark:hover:text-orange-100 transition-colors duration-200 cursor-default',
    bgColor: 'bg-orange-50 dark:bg-orange-950',
    subcategories: {
      INVESTIGATIONS: { title: 'Investigaciones', icon: Library, color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 hover:bg-indigo-200 hover:text-indigo-900 dark:hover:bg-indigo-800 dark:hover:text-indigo-100 transition-colors duration-200 cursor-default' },
      METHODOLOGICAL_RESOURCES: { title: 'Recursos Metodológicos', icon: FileDown, color: 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200 hover:bg-teal-200 hover:text-teal-900 dark:hover:bg-teal-800 dark:hover:text-teal-100 transition-colors duration-200 cursor-default' },
      SYSTEMATIZATION_DOCUMENTS: { title: 'Documentos de Sistematización', icon: Book, color: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200 hover:bg-amber-200 hover:text-amber-900 dark:hover:bg-amber-800 dark:hover:text-amber-100 transition-colors duration-200 cursor-default' }
    }
  }
};

interface Album {
  id: string;
  title: string;
  description?: string;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: string;
  _count?: {
    images: number;
  };
  images?: GalleryImage[];
  thumbnailImage?: {
    id: string;
    imageUrl: string;
    imageAlt?: string;
  } | null;
}

interface GalleryImage {
  id: string;
  imageUrl: string;
  caption?: string;
  isActive: boolean;
  createdAt: string;
}

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [isAlbumDialogOpen, setIsAlbumDialogOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<Resource | null>(null);
  const [isVideoDialogOpen, setIsVideoDialogOpen] = useState(false);
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

  const fetchAlbums = async () => {
    try {
      setGalleryLoading(true);
      const response = await fetch('/api/public/albums');
      
      if (!response.ok) {
        throw new Error('Error al cargar álbumes');
      }
      
      const data = await response.json();
      setAlbums(data || []);
    } catch (error) {
      console.error('Error al cargar álbumes:', error);
    } finally {
      setGalleryLoading(false);
    }
  };

  const openAlbumDialog = async (album: Album) => {
    try {
      const response = await fetch(`/api/public/albums/${album.id}`);
      if (!response.ok) throw new Error('Error al cargar álbum');
      const albumWithImages = await response.json();
      setSelectedAlbum(albumWithImages);
      setIsAlbumDialogOpen(true);
    } catch (error) {
      console.error('Error al cargar álbum:', error);
    }
  };

  const openImageViewer = (imageIndex: number) => {
    setSelectedImageIndex(imageIndex);
    setIsImageViewerOpen(true);
  };

  const navigateImage = useCallback((direction: 'prev' | 'next') => {
    if (selectedImageIndex === null || !selectedAlbum?.images) return;
    
    const totalImages = selectedAlbum.images.length;
    if (direction === 'prev') {
      setSelectedImageIndex(selectedImageIndex > 0 ? selectedImageIndex - 1 : totalImages - 1);
    } else {
      setSelectedImageIndex(selectedImageIndex < totalImages - 1 ? selectedImageIndex + 1 : 0);
    }
  }, [selectedImageIndex, selectedAlbum]);

  useEffect(() => {
    fetchResources();
  }, [activeTab, selectedSubcategory, searchTerm]);

  useEffect(() => {
    if (activeTab === 'gallery') {
      fetchAlbums();
    }
  }, [activeTab]);

  // Reset subcategory when tab changes
  useEffect(() => {
    setSelectedSubcategory('');
  }, [activeTab]);

  // Navegación con teclado en el visor de imágenes
  useEffect(() => {
    if (!isImageViewerOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        navigateImage('prev');
      } else if (e.key === 'ArrowRight') {
        navigateImage('next');
      } else if (e.key === 'Escape') {
        setIsImageViewerOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isImageViewerOpen, navigateImage]);

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

  // Función para extraer el ID de YouTube de una URL
  const getYouTubeVideoId = (url: string): string | null => {
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
  };

  // Función para extraer el ID de archivo de Google Drive de una URL
  const getGoogleDriveFileId = (url: string): string | null => {
    if (!url) return null;
    
    // Patrones comunes de URLs de Google Drive
    const patterns = [
      /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/,
      /drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/,
      /docs\.google\.com\/.*\/d\/([a-zA-Z0-9_-]+)/,
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }
    
    return null;
  };

  // Función para detectar si es un video de Facebook
  const isFacebookVideo = (url: string): boolean => {
    if (!url) return false;
    
    // Patrones comunes de URLs de Facebook
    const patterns = [
      /facebook\.com\/.*\/videos\//,
      /facebook\.com\/watch/,
      /fb\.watch\//,
      /facebook\.com\/.*\/videos\/\d+/,
    ];
    
    return patterns.some(pattern => pattern.test(url));
  };

  // Función para detectar el tipo de enlace
  const getVideoType = (url: string): 'youtube' | 'googledrive' | 'facebook' | null => {
    if (getYouTubeVideoId(url)) return 'youtube';
    if (getGoogleDriveFileId(url)) return 'googledrive';
    if (isFacebookVideo(url)) return 'facebook';
    return null;
  };

  // Función para abrir el dialog de video
  const openVideoDialog = (resource: Resource) => {
    setSelectedVideo(resource);
    setIsVideoDialogOpen(true);
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
      <div 
        className="relative min-h-screen flex items-center"
        style={{
          backgroundImage: "url('/static-images/heroes/centro_multimedia_hero.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'top center'
        }}
      >
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
                  <>Mostrando {albums.filter(album =>
                    album.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    (album.description && album.description.toLowerCase().includes(searchTerm.toLowerCase()))
                  ).length} {albums.filter(album =>
                    album.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    (album.description && album.description.toLowerCase().includes(searchTerm.toLowerCase()))
                  ).length === 1 ? 'álbum' : 'álbumes'}</>
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <Card key={i} className="bg-card-light dark:bg-card-dark">
                      <CardContent className="p-6">
                        <div className="space-y-3">
                          <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-2/3" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (() => {
                const filteredAlbums = albums.filter(album =>
                  album.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  (album.description && album.description.toLowerCase().includes(searchTerm.toLowerCase()))
                );
                return filteredAlbums.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredAlbums.map((album) => (
                      <Card 
                        key={album.id} 
                        className="bg-card-light dark:bg-card-dark hover:shadow-lg transition-shadow cursor-pointer overflow-hidden"
                        onClick={() => openAlbumDialog(album)}
                      >
                        <CardContent className="p-0">
                          <div className="relative w-full h-64 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 overflow-hidden">
                            {album.thumbnailImage ? (
                              <>
                                <Image
                                  src={album.thumbnailImage.imageUrl}
                                  alt={album.thumbnailImage.imageAlt || album.title}
                                  fill
                                  className="object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                              </>
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Images className="h-16 w-16 text-purple-400 opacity-50" />
                              </div>
                            )}
                            {album._count && album._count.images > 0 && (
                              <div className="absolute top-2 right-2 bg-black/60 text-white px-2 py-1 rounded text-xs font-medium flex items-center gap-1 z-10">
                                <Images className="w-3 h-3" />
                                {album._count.images}
                              </div>
                            )}
                            {album.isFeatured && (
                              <div className="absolute top-2 left-2 z-10">
                                <Star className="w-5 h-5 text-yellow-500 fill-current drop-shadow-md" />
                              </div>
                            )}
                          </div>
                          <div className="p-6">
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="text-lg font-semibold text-text-light dark:text-text-dark line-clamp-2 flex-1">
                                {album.title}
                              </h3>
                            </div>
                            {album.description && (
                              <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm mb-4 line-clamp-2">
                                {album.description}
                              </p>
                            )}
                            <div className="flex items-center gap-2 text-sm text-text-secondary-light dark:text-text-secondary-dark">
                              <Images className="h-4 w-4" />
                              <span>{album._count?.images || 0} {album._count?.images === 1 ? 'imagen' : 'imágenes'}</span>
                            </div>
                            <Button className="w-full mt-4" variant="outline">
                              <Eye className="h-4 w-4 mr-2" />
                              Ver álbum
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Images className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-text-light dark:text-text-dark mb-2">
                      No hay álbumes disponibles
                    </h3>
                    <p className="text-text-secondary-light dark:text-text-secondary-dark">
                      Los álbumes de imágenes aparecerán aquí cuando estén disponibles.
                    </p>
                  </div>
                );
              })()}
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
                          {resource.subcategory === 'VIDEOS' ? (
                            <Button 
                              className="w-full" 
                              onClick={() => openVideoDialog(resource)}
                            >
                              <Play className="h-4 w-4 mr-2" />
                              Reproducir
                            </Button>
                          ) : resource.subcategory === 'AUDIOS' ? (
                            <Button className="w-full" asChild>
                              <a href={resource.fileUrl} target="_blank" rel="noopener noreferrer">
                                <Volume2 className="h-4 w-4 mr-2" />
                                Escuchar
                              </a>
                            </Button>
                          ) : (
                            <Button className="w-full" asChild>
                              <a href={resource.fileUrl} target="_blank" rel="noopener noreferrer">
                                <Download className="h-4 w-4 mr-2" />
                                Descargar
                              </a>
                            </Button>
                          )}
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
                          {resource.subcategory === 'VIDEOS' ? (
                            <Button 
                              className="w-full" 
                              onClick={() => openVideoDialog(resource)}
                            >
                              <Play className="h-4 w-4 mr-2" />
                              Reproducir
                            </Button>
                          ) : resource.subcategory === 'AUDIOS' ? (
                            <Button className="w-full" asChild>
                              <a href={resource.fileUrl} target="_blank" rel="noopener noreferrer">
                                <Volume2 className="h-4 w-4 mr-2" />
                                Escuchar
                              </a>
                            </Button>
                          ) : (
                            <Button className="w-full" asChild>
                              <a href={resource.fileUrl} target="_blank" rel="noopener noreferrer">
                                <Download className="h-4 w-4 mr-2" />
                                Descargar
                              </a>
                            </Button>
                          )}
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

      {/* Dialog para ver imágenes del álbum */}
      <Dialog open={isAlbumDialogOpen} onOpenChange={setIsAlbumDialogOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto overflow-x-hidden">
          <DialogHeader>
            <DialogTitle className="text-2xl">{selectedAlbum?.title}</DialogTitle>
            {selectedAlbum?.description && (
              <p className="text-sm text-muted-foreground mt-2">{selectedAlbum.description}</p>
            )}
          </DialogHeader>
          {selectedAlbum?.images && selectedAlbum.images.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 py-4">
              {selectedAlbum.images.map((image, index) => (
                <Card 
                  key={image.id} 
                  className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => openImageViewer(index)}
                >
                  <CardContent className="p-0">
                    <div className="relative w-full h-64 rounded-t-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                      <Image
                        src={image.imageUrl}
                        alt={image.caption || 'Imagen de galería'}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </div>
                    {image.caption && (
                      <div className="p-4">
                        <p className="text-sm text-muted-foreground">{image.caption}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No hay imágenes en este álbum</p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog para reproducir video de YouTube */}
      <Dialog open={isVideoDialogOpen} onOpenChange={(open) => {
        setIsVideoDialogOpen(open);
        if (!open) {
          setSelectedVideo(null);
        }
      }}>
        <DialogContent className="max-w-5xl max-h-[90vh] p-0 overflow-hidden">
          <DialogHeader className="px-6 pt-6 pb-1">
            <DialogTitle className="text-2xl">{selectedVideo?.title}</DialogTitle>
          </DialogHeader>
          {selectedVideo && (() => {
            const videoType = getVideoType(selectedVideo.fileUrl);
            
            if (!videoType) {
              return (
                <div className="px-6 pb-6">
                  <p className="text-center text-muted-foreground py-8">
                    URL de video no válida. Por favor, verifica que sea una URL de YouTube, Google Drive o Facebook.
                  </p>
                </div>
              );
            }

            if (videoType === 'youtube') {
              const videoId = getYouTubeVideoId(selectedVideo.fileUrl);
              if (!videoId) return null;
              
              return (
                <div className="px-6 pt-2 pb-12 mb-4">
                  <div className="relative w-full bg-black rounded-lg overflow-hidden shadow-lg" style={{ paddingBottom: '56.25%' }}>
                    <iframe
                      className="absolute top-0 left-0 w-full h-full"
                      src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                      title={selectedVideo.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
              );
            }

            if (videoType === 'googledrive') {
              const fileId = getGoogleDriveFileId(selectedVideo.fileUrl);
              if (!fileId) return null;
              
              return (
                <div className="px-6 pt-2 pb-12 mb-4">
                  <div className="relative w-full bg-black rounded-lg overflow-hidden shadow-lg" style={{ paddingBottom: '56.25%' }}>
                    <iframe
                      className="absolute top-0 left-0 w-full h-full"
                      src={`https://drive.google.com/file/d/${fileId}/preview`}
                      title={selectedVideo.title}
                      allow="autoplay"
                      allowFullScreen
                    />
                  </div>
                </div>
              );
            }

            if (videoType === 'facebook') {
              // Usar el plugin de Facebook para incrustar el video
              const encodedUrl = encodeURIComponent(selectedVideo.fileUrl);
              
              return (
                <div className="px-6 pt-2 pb-12 mb-4">
                  <div className="relative w-full bg-black rounded-lg overflow-hidden shadow-lg" style={{ paddingBottom: '56.25%' }}>
                    <iframe
                      className="absolute top-0 left-0 w-full h-full"
                      src={`https://www.facebook.com/plugins/video.php?href=${encodedUrl}&show_text=0&width=560&height=315`}
                      title={selectedVideo.title}
                      allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                      allowFullScreen
                      scrolling="no"
                      frameBorder="0"
                    />
                  </div>
                </div>
              );
            }

            return null;
          })()}
        </DialogContent>
      </Dialog>

      {/* Dialog para ver imagen en grande */}
      <Dialog open={isImageViewerOpen} onOpenChange={setIsImageViewerOpen}>
        <DialogContent className="max-w-7xl max-h-[95vh] p-0 overflow-hidden">
          <VisuallyHidden>
            <DialogTitle>
              {selectedAlbum?.title && selectedImageIndex !== null && selectedAlbum?.images?.[selectedImageIndex]
                ? `Imagen ${selectedImageIndex + 1} de ${selectedAlbum.images.length} - ${selectedAlbum.title}`
                : 'Visor de imágenes'}
            </DialogTitle>
          </VisuallyHidden>
          {selectedImageIndex !== null && selectedAlbum?.images && selectedAlbum.images[selectedImageIndex] && (
            <>
              <div className="relative w-full h-[85vh] bg-black flex items-center justify-center">
                {/* Botón cerrar */}
                <button
                  onClick={() => setIsImageViewerOpen(false)}
                  className="absolute top-4 right-4 z-50 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
                  aria-label="Cerrar"
                >
                  <X className="h-6 w-6" />
                </button>

                {/* Botón anterior */}
                {selectedAlbum.images.length > 1 && (
                  <button
                    onClick={() => navigateImage('prev')}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-50 bg-black/50 hover:bg-black/70 text-white rounded-full p-3 transition-colors"
                    aria-label="Imagen anterior"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                )}

                {/* Imagen */}
                <div className="relative w-full h-full flex items-center justify-center">
                  <Image
                    src={selectedAlbum.images[selectedImageIndex].imageUrl}
                    alt={selectedAlbum.images[selectedImageIndex].caption || 'Imagen de galería'}
                    fill
                    className="object-contain"
                    sizes="100vw"
                    priority
                  />
                </div>

                {/* Botón siguiente */}
                {selectedAlbum.images.length > 1 && (
                  <button
                    onClick={() => navigateImage('next')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-50 bg-black/50 hover:bg-black/70 text-white rounded-full p-3 transition-colors"
                    aria-label="Imagen siguiente"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                )}

                {/* Contador de imágenes */}
                {selectedAlbum.images.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 bg-black/50 text-white px-4 py-2 rounded-full text-sm">
                    {selectedImageIndex + 1} / {selectedAlbum.images.length}
                  </div>
                )}

                {/* Captión */}
                {selectedAlbum.images[selectedImageIndex].caption && (
                  <div className="absolute bottom-4 left-4 right-4 z-50 bg-black/70 text-white p-4 rounded-lg max-w-2xl mx-auto">
                    <p className="text-sm md:text-base">{selectedAlbum.images[selectedImageIndex].caption}</p>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
      
      <SiteFooter />
    </div>
  );
}
