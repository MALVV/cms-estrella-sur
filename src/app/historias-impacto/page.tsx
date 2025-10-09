'use client'

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Heart, 
  Star,
  Calendar,
  Search,
  Grid3X3,
  List,
  Video,
  Image as ImageIcon,
  FileText,
  ExternalLink,
  Clock
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { SiteHeader } from '@/components/layout/site-header';

interface Story {
  id: string;
  title: string;
  content?: string;
  summary?: string;
  imageUrl: string;
  imageAlt: string;
  createdAt: string;
  author?: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

interface VideoTestimonial {
  id: string;
  title: string;
  description: string;
  youtubeUrl: string;
  thumbnailUrl?: string;
  duration?: number;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function HistoriasImpactoPage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [videos, setVideos] = useState<VideoTestimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'videos' | 'casos' | 'galeria'>('videos');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'featured'>('all');

  useEffect(() => {
    fetchData();
  }, [activeFilter]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch stories and videos in parallel
      const [storiesResponse, videosResponse] = await Promise.all([
        fetch('/api/public/stories'),
        fetch(`/api/public/video-testimonials?${activeFilter !== 'all' ? `featured=${activeFilter}` : ''}`)
      ]);

      if (!storiesResponse.ok) {
        throw new Error('Error al cargar las historias');
      }

      if (!videosResponse.ok) {
        throw new Error('Error al cargar los videos testimoniales');
      }

      const storiesData = await storiesResponse.json();
      const videosData = await videosResponse.json();
      
      setStories(storiesData);
      setVideos(videosData.videos);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('No se pudieron cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Extraer ID del video de YouTube
  const getYouTubeVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  // Generar URL de miniatura de YouTube
  const getYouTubeThumbnail = (url: string) => {
    const videoId = getYouTubeVideoId(url);
    return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null;
  };

  // Formatear duración
  const formatDuration = (seconds?: number) => {
    if (!seconds) return '';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Filtrar contenido por término de búsqueda
  const filteredStories = stories.filter(story =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (story.summary && story.summary.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (story.content && story.content.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredVideos = videos.filter(video =>
    video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    video.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark">
        <SiteHeader />
        
        {/* Loading skeleton */}
        <main className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-64 mx-auto mb-4 animate-pulse"></div>
              <div className="h-12 bg-gray-300 dark:bg-gray-600 rounded w-96 mx-auto mb-4 animate-pulse"></div>
              <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-80 mx-auto animate-pulse"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="overflow-hidden animate-pulse">
                  <div className="h-64 bg-gray-300 dark:bg-gray-600"></div>
                  <CardContent className="p-6">
                    <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-4"></div>
                    <div className="h-10 bg-gray-300 dark:bg-gray-600 rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark">
        <SiteHeader />
        <main className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="text-red-600 dark:text-red-400 mb-4">
              <Heart className="h-16 w-16 mx-auto" />
            </div>
            <h2 className="text-2xl font-bold text-text-light dark:text-text-dark mb-4">
              Error al cargar los datos
            </h2>
            <p className="text-text-secondary-light dark:text-text-secondary-dark mb-8">
              {error}
            </p>
            <Button onClick={fetchData} className="bg-primary hover:bg-primary/90">
              Intentar de nuevo
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <SiteHeader />
      
      {/* Hero Section - Estilo Blog */}
      <section className="py-16 bg-background-light dark:bg-background-dark">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            
            {/* Lado izquierdo - Imagen principal */}
            <div className="rounded-lg overflow-hidden shadow-lg h-full">
              <img 
                alt="Voluntarios distribuyendo ayuda comunitaria" 
                className="w-full h-full object-cover" 
                src="https://images.pexels.com/photos/6646918/pexels-photo-6646918.jpeg"
              />
        </div>
        
            {/* Lado derecho - Contenido */}
            <div className="space-y-6">
          {/* Badge */}
              <div className="inline-block bg-primary text-white px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-sm">
                Historias e impacto
          </div>
          
              {/* Título principal */}
              <h1 className="text-4xl md:text-5xl font-black text-text-light dark:text-text-dark leading-tight">
                HISTORIAS<br/>
                QUE TRANSFORMAN<br/>
                COMUNIDADES
          </h1>
          
              {/* Descripción enfocada en historias */}
              <div className="space-y-4">
                <p className="text-lg text-text-secondary-light dark:text-text-secondary-dark leading-relaxed">
                  Cada historia que compartimos es una ventana a las vidas que hemos tocado, los sueños que hemos ayudado a cumplir y las comunidades que hemos fortalecido.
                </p>
                <p className="text-base text-text-secondary-light dark:text-text-secondary-dark leading-relaxed">
                  Desde testimonios en video hasta casos de éxito documentados, nuestras historias muestran el impacto real de la colaboración y el compromiso.
                </p>
              </div>

              {/* Estadísticas actualizadas */}
              <div className="grid grid-cols-3 gap-4 pt-4">
                <div className="text-center p-3 bg-card-light dark:bg-card-dark rounded-lg shadow-sm">
                  <div className="text-2xl font-bold text-primary mb-1">{stories.length}</div>
                  <div className="text-xs text-text-secondary-light dark:text-text-secondary-dark">Historias</div>
                </div>
                <div className="text-center p-3 bg-card-light dark:bg-card-dark rounded-lg shadow-sm">
                  <div className="text-2xl font-bold text-primary mb-1">{videos.length}</div>
                  <div className="text-xs text-text-secondary-light dark:text-text-secondary-dark">Videos</div>
                </div>
                <div className="text-center p-3 bg-card-light dark:bg-card-dark rounded-lg shadow-sm">
                  <div className="text-2xl font-bold text-primary mb-1">{videos.filter(v => v.isFeatured).length}</div>
                  <div className="text-xs text-text-secondary-light dark:text-text-secondary-dark">Destacados</div>
                </div>
              </div>

              {/* Información adicional sobre historias */}
              <div className="pt-4">
                <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                  Explora nuestras historias organizadas por categorías: videos testimoniales, casos de éxito documentados y galería multimedia.
                </p>
            </div>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Tabs - Estilo LATEST NEWS */}
      <section className="py-16 bg-background-light dark:bg-background-dark">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-text-light dark:text-text-dark mb-6 md:mb-0">
              {activeTab === 'videos' ? 'VIDEOS TESTIMONIALES' : 
               activeTab === 'casos' ? 'CASOS DE ÉXITO' : 
               'GALERÍA MULTIMEDIA'}
            </h1>
            <div className="flex space-x-2 md:space-x-4">
              {/* Selector de pestañas */}
              <button 
                className={`px-4 py-2 text-sm font-medium rounded-md ${activeTab === 'videos' ? 'bg-yellow-400 text-gray-800' : 'text-subtext-light dark:text-subtext-dark hover:text-primary dark:hover:text-primary'}`}
                onClick={() => setActiveTab('videos')}
              >
                VIDEOS
              </button>
              <button 
                className={`px-4 py-2 text-sm font-medium rounded-md ${activeTab === 'casos' ? 'bg-yellow-400 text-gray-800' : 'text-subtext-light dark:text-subtext-dark hover:text-primary dark:hover:text-primary'}`}
                onClick={() => setActiveTab('casos')}
              >
                CASOS
              </button>
              <button 
                className={`px-4 py-2 text-sm font-medium rounded-md ${activeTab === 'galeria' ? 'bg-yellow-400 text-gray-800' : 'text-subtext-light dark:text-subtext-dark hover:text-primary dark:hover:text-primary'}`}
                onClick={() => setActiveTab('galeria')}
              >
                GALERÍA
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="pt-0 pb-16 bg-background-light dark:bg-background-dark">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Videos Testimoniales Tab */}
          {activeTab === 'videos' && (
            <div>
              {/* Filtros y búsqueda para videos */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="text"
                      placeholder="Buscar videos testimoniales..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary focus:border-transparent"
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

              {filteredVideos.length === 0 ? (
                <div className="text-center py-16">
                  <Video className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-text-light dark:text-text-dark mb-2">
                    {searchTerm ? 'No se encontraron videos' : 'No hay videos testimoniales disponibles'}
                  </h3>
                  <p className="text-text-secondary-light dark:text-text-secondary-dark">
                    {searchTerm ? 'Intenta con otros términos de búsqueda.' : 'Estamos trabajando en crear contenido multimedia que muestre el impacto real de nuestro trabajo.'}
                  </p>
                </div>
              ) : (
                <div className={viewMode === 'grid' 
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
                  : 'space-y-4'
                }>
                  {filteredVideos.map((video) => {
                    const thumbnailUrl = video.thumbnailUrl || getYouTubeThumbnail(video.youtubeUrl);
                    
                    return (
                      <Card key={video.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                        <CardContent className="p-0">
                          <div className="relative">
                            {thumbnailUrl ? (
                              <img
                                src={thumbnailUrl}
                                alt={video.title}
                                className="w-full h-48 object-cover"
                              />
                            ) : (
                              <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                <Video className="h-12 w-12 text-gray-400" />
                              </div>
                            )}
                            
                            {/* Overlay con botón de play */}
                            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                              <Button
                                size="lg"
                                className="bg-red-600 hover:bg-red-700 text-white rounded-full p-4"
                                onClick={() => window.open(video.youtubeUrl, '_blank')}
                              >
                                <Play className="h-6 w-6" />
                              </Button>
                            </div>
                            
                            {/* Badge destacado */}
                            {video.isFeatured && (
                              <div className="absolute top-2 left-2">
                                <Badge className="bg-yellow-500 text-white">
                                  <Star className="mr-1 h-3 w-3" />
                                  Destacado
                                </Badge>
                              </div>
                            )}
                            
                            {/* Duración */}
                            {video.duration && (
                              <div className="absolute bottom-2 right-2">
                                <Badge variant="secondary" className="bg-black bg-opacity-70 text-white">
                                  <Clock className="mr-1 h-3 w-3" />
                                  {formatDuration(video.duration)}
                                </Badge>
                              </div>
                            )}
                          </div>
                          
                          <div className="p-4">
                            <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                              {video.title}
                        </h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-3">
                              {video.description}
                            </p>
                            
                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {formatDate(video.createdAt)}
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => window.open(video.youtubeUrl, '_blank')}
                                className="text-primary hover:text-primary-dark"
                              >
                                <ExternalLink className="mr-1 h-3 w-3" />
                                Ver en YouTube
                              </Button>
                        </div>
                      </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Casos de Éxito Tab */}
          {activeTab === 'casos' && (
            <div>
              {/* Filtros y búsqueda para casos */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="text"
                      placeholder="Buscar casos de éxito..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
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

              {filteredStories.length === 0 ? (
                <div className="text-center py-16">
                  <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-text-light dark:text-text-dark mb-2">
                    {searchTerm ? 'No se encontraron casos' : 'No hay casos de éxito disponibles'}
                  </h3>
                  <p className="text-text-secondary-light dark:text-text-secondary-dark">
                    {searchTerm ? 'Intenta con otros términos de búsqueda.' : 'Estamos documentando casos de éxito para compartir contigo.'}
                  </p>
                </div>
              ) : (
                <div className={viewMode === 'grid' 
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
                  : 'space-y-4'
                }>
                  {filteredStories.map((story) => (
                    <Link key={story.id} href={`/stories/${story.id}`}>
                      <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                        <CardContent className="p-0">
                          <div className="relative h-48">
                        <Image
                          src={story.imageUrl}
                          alt={story.imageAlt || story.title}
                          fill
                          className="object-cover"
                        />
                          </div>
                          <div className="p-4">
                            <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                              {story.title}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-3">
                              {story.summary || 'No hay resumen disponible.'}
                            </p>
                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {formatDate(story.createdAt)}
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-primary hover:text-primary-dark"
                              >
                                Leer más
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Galería Multimedia Tab */}
          {activeTab === 'galeria' && (
                <div className="text-center py-16">
                  <ImageIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-text-light dark:text-text-dark mb-2">
                Galería Multimedia
                  </h3>
                  <p className="text-text-secondary-light dark:text-text-secondary-dark">
                Próximamente tendremos una galería multimedia con fotos, videos y documentos que muestran nuestro trabajo.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}