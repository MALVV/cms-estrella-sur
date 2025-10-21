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
  Video,
  FileText,
  ExternalLink,
  Clock,
  ArrowRight
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { SiteHeader } from '@/components/layout/site-header';
import { SiteFooter } from '@/components/layout/site-footer';

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
  const [activeTab, setActiveTab] = useState<'videos' | 'casos'>('videos');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch stories and videos in parallel
      const [storiesResponse, videosResponse] = await Promise.all([
        fetch('/api/public/stories'),
        fetch('/api/public/video-testimonials')
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

  // Filtrar contenido por término de búsqueda y fecha
  const filteredStories = stories.filter(story => {
    const storyDate = new Date(story.createdAt);
    const matchesSearch = story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (story.summary && story.summary.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (story.content && story.content.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesMonth = !selectedMonth || storyDate.getMonth() + 1 === parseInt(selectedMonth);
    const matchesYear = !selectedYear || storyDate.getFullYear() === parseInt(selectedYear);
    
    return matchesSearch && matchesMonth && matchesYear;
  });

  const filteredVideos = videos.filter(video => {
    const videoDate = new Date(video.createdAt);
    const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesMonth = !selectedMonth || videoDate.getMonth() + 1 === parseInt(selectedMonth);
    const matchesYear = !selectedYear || videoDate.getFullYear() === parseInt(selectedYear);
    
    return matchesSearch && matchesMonth && matchesYear;
  });

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
                <div key={i} className="bg-card-light dark:bg-card-dark rounded-lg shadow-md overflow-hidden animate-pulse">
                  <div className="h-64 bg-gray-300 dark:bg-gray-600"></div>
                  <div className="p-6">
                    <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-4"></div>
                    <div className="h-10 bg-gray-300 dark:bg-gray-600 rounded"></div>
                  </div>
                </div>
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
      
      {/* Hero Section - Estilo Convergente */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-12">
          <div className="flex flex-col gap-6">
            <div>
              <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-md">HISTORIAS E IMPACTO</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold font-display uppercase tracking-tight text-gray-900 dark:text-white">
              Historias que transforman comunidades
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Cada historia que compartimos es una ventana a las vidas que hemos tocado, los sueños que hemos ayudado a cumplir y las comunidades que hemos fortalecido.
            </p>
            {/* Estadísticas actualizadas */}
            <div className="grid grid-cols-3 gap-4 pt-6">
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
                Explora nuestras historias organizadas por categorías: videos testimoniales e historias de éxito documentadas.
              </p>
            </div>
          </div>
          
          {/* Hero Image */}
          <div className="relative h-[500px]">
            <img 
              alt="Voluntarios distribuyendo ayuda comunitaria" 
              className="w-full h-full object-cover object-center rounded-xl shadow-lg" 
              src="/static-images/heroes/hero-historias.jpg"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-xl"></div>
          </div>
        </div>
      </div>

      {/* Grid Section */}
      <section className="py-8 bg-background-light dark:bg-background-dark">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-text-light dark:text-text-dark mb-6 md:mb-0">
              {activeTab === 'videos' ? 'VIDEOS TESTIMONIALES' : 'HISTORIAS DE EXITO'}
            </h2>
            <div className="flex space-x-2 md:space-x-4">
              {/* Selector de pestañas */}
              <button 
                className={`px-4 py-2 text-sm font-medium rounded-md ${activeTab === 'videos' ? 'bg-brand text-brand-foreground' : 'text-subtext-light dark:text-subtext-dark hover:text-primary dark:hover:text-primary'}`}
                onClick={() => setActiveTab('videos')}
              >
                VIDEOS TESTIMONIALES
              </button>
              <button 
                className={`px-4 py-2 text-sm font-medium rounded-md ${activeTab === 'casos' ? 'bg-brand text-brand-foreground' : 'text-subtext-light dark:text-subtext-dark hover:text-primary dark:hover:text-primary'}`}
                onClick={() => setActiveTab('casos')}
              >
                HISTORIAS DE EXITO
              </button>
            </div>
          </div>

          {/* Searchbar y Filtros - Estilo similar a news-events */}
          <div className="mb-8 space-y-4">
            {/* Barra de búsqueda */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <div className="flex-1">
                  <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary-light dark:text-text-secondary-dark h-4 w-4" />
                    <input
                      type="text"
                    placeholder={`Buscar ${activeTab === 'videos' ? 'videos testimoniales' : 'historias de éxito'}...`}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-border-light dark:border-border-dark rounded-lg bg-card-light dark:bg-card-dark text-text-light dark:text-text-dark focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div className="flex gap-2">
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="px-3 py-2 border border-border-light dark:border-border-dark rounded-lg bg-card-light dark:bg-card-dark text-text-light dark:text-text-dark focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">Mes</option>
                  <option value="1">Enero</option>
                  <option value="2">Febrero</option>
                  <option value="3">Marzo</option>
                  <option value="4">Abril</option>
                  <option value="5">Mayo</option>
                  <option value="6">Junio</option>
                  <option value="7">Julio</option>
                  <option value="8">Agosto</option>
                  <option value="9">Septiembre</option>
                  <option value="10">Octubre</option>
                  <option value="11">Noviembre</option>
                  <option value="12">Diciembre</option>
                </select>
                
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="px-3 py-2 border border-border-light dark:border-border-dark rounded-lg bg-card-light dark:bg-card-dark text-text-light dark:text-text-dark focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">Año</option>
                  <option value="2024">2024</option>
                  <option value="2023">2023</option>
                  <option value="2022">2022</option>
                  <option value="2021">2021</option>
                  <option value="2020">2020</option>
                </select>
              </div>
              
            </div>

            {/* Contador de resultados */}
            <div className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
              Mostrando {activeTab === 'videos' ? filteredVideos.length : filteredStories.length} {activeTab === 'videos' ? 'videos testimoniales' : 'historias de éxito'}
              {searchTerm && ` para "${searchTerm}"`}
            </div>
          </div>
          
          {/* Videos Testimoniales Tab */}
          {activeTab === 'videos' && (
            <div>

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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredVideos.map((video) => {
                    const thumbnailUrl = video.thumbnailUrl || getYouTubeThumbnail(video.youtubeUrl);
                    
                    return (
                      <div key={video.id} className="bg-card-light dark:bg-card-dark rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col">
                          <div className="relative">
                            {thumbnailUrl ? (
                              <img
                                src={thumbnailUrl}
                                alt={video.title}
                                className="w-full h-48 object-cover"
                              />
                            ) : (
                            <div className="w-full h-48 bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 dark:from-emerald-900/20 dark:via-blue-900/20 dark:to-purple-900/20 flex items-center justify-center">
                              <Video className="h-12 w-12 text-primary" />
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
                          
                        <div className="p-6 flex flex-col flex-grow">
                          <div className="text-sm mb-2">
                            <span className="bg-brand/10 text-brand text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">
                              Video
                            </span>
                            <span className="text-subtext-light dark:text-subtext-dark">{formatDate(video.createdAt)}</span>
                          </div>
                          <h3 className="text-lg font-bold text-text-light dark:text-text-dark mb-2 line-clamp-2">
                              {video.title}
                        </h3>
                          <p className="text-sm text-subtext-light dark:text-subtext-dark line-clamp-3 flex-grow">
                              {video.description}
                            </p>
                          <div className="mt-3 flex justify-end">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => window.open(video.youtubeUrl, '_blank')}
                              className="text-primary hover:opacity-80"
                              >
                                Ver en YouTube
                              <ArrowRight className="ml-1 h-3 w-3" />
                              </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Casos de Éxito Tab */}
          {activeTab === 'casos' && (
            <div>

              {filteredStories.length === 0 ? (
                <div className="text-center py-16">
                  <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-text-light dark:text-text-dark mb-2">
                    {searchTerm ? 'No se encontraron historias' : 'No hay historias de éxito disponibles'}
                  </h3>
                  <p className="text-text-secondary-light dark:text-text-secondary-dark">
                    {searchTerm ? 'Intenta con otros términos de búsqueda.' : 'Estamos documentando historias de éxito para compartir contigo.'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredStories.map((story) => (
                    <Link key={story.id} href={`/historias/${story.id}`}>
                      <div className="bg-card-light dark:bg-card-dark rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col">
                          <div className="relative h-48">
                        <Image
                          src={story.imageUrl}
                          alt={story.imageAlt || story.title}
                          fill
                          className="object-cover"
                        />
                          </div>
                        <div className="p-6 flex flex-col flex-grow">
                          <div className="text-sm mb-2">
                            <span className="bg-brand/10 text-brand text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">
                              Historia de Éxito
                            </span>
                            <span className="text-subtext-light dark:text-subtext-dark">{formatDate(story.createdAt)}</span>
                          </div>
                          <h3 className="text-lg font-bold text-text-light dark:text-text-dark mb-2 line-clamp-2">
                              {story.title}
                            </h3>
                          <p className="text-sm text-subtext-light dark:text-subtext-dark line-clamp-3 flex-grow">
                              {story.summary || 'No hay resumen disponible.'}
                            </p>
                          <div className="mt-3 flex justify-end">
                              <Button
                                variant="ghost"
                                size="sm"
                              className="text-primary hover:opacity-80"
                              >
                                Leer más
                              <ArrowRight className="ml-1 h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </section>
      
      <SiteFooter />
    </div>
  );
}