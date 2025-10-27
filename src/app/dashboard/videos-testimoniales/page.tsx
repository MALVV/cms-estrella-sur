"use client"

import { useState, useEffect, useCallback } from 'react'
import { usePermissions } from '@/hooks/use-permissions'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Checkbox } from '@/components/ui/checkbox'
import { Video, Search, Edit, Trash2, Eye, EyeOff, Download, RefreshCw, Calendar, User, Star, Clock } from 'lucide-react'
import { CreateVideoTestimonialForm } from '@/components/admin/create-video-testimonial-form'
import { ToggleVideoTestimonialStatusDialog } from '@/components/admin/toggle-video-testimonial-status-dialog'
import { DeleteVideoTestimonialDialog } from '@/components/admin/delete-video-testimonial-dialog'
import { EditVideoTestimonialForm } from '@/components/admin/edit-video-testimonial-form'

interface VideoTestimonial {
  id: string
  title: string
  description: string
  youtubeUrl: string
  thumbnailUrl?: string
  duration?: number
  isActive: boolean
  isFeatured: boolean
  createdAt: string
  updatedAt: string
  createdBy?: string
  creator?: {
    id: string
    name: string
    email: string
    role: string
  }
}

export default function VideoTestimonialsPage() {
  const { canManageVideoTestimonials, canCreateVideoTestimonials, canEditVideoTestimonials, canDeleteVideoTestimonials } = usePermissions()
  const [videos, setVideos] = useState<VideoTestimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [selectedVideos, setSelectedVideos] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<'title' | 'createdAt' | 'updatedAt'>('createdAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const fetchVideos = useCallback(async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      
      if (statusFilter !== 'ALL') params.append('status', statusFilter === 'ACTIVE' ? 'active' : 'inactive')
      if (searchTerm) params.append('search', searchTerm)
      params.append('sortBy', sortBy)
      params.append('sortOrder', sortOrder)

      const response = await fetch(`/api/video-testimonials?${params.toString()}`)
      
      if (!response.ok) {
        throw new Error('Error al cargar videos testimoniales')
      }

      const data = await response.json()
      setVideos(data.videos || [])
    } catch (error) {
      console.error('Error al cargar videos testimoniales:', error)
      setVideos([])
    } finally {
      setLoading(false)
    }
  }, [statusFilter, searchTerm, sortBy, sortOrder])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchVideos()
    }, 300) // Debounce
    return () => clearTimeout(timeoutId)
  }, [statusFilter, searchTerm, sortBy, sortOrder, fetchVideos])

  const filteredVideos = videos // Data is now filtered/sorted by API
  const activeVideos = videos.filter(video => video.isActive)
  const inactiveVideos = videos.filter(video => !video.isActive)

  const handleVideoStatusChanged = (videoId: string, newStatus: boolean) => {
    setVideos(prev => prev.map(v => 
      v.id === videoId 
        ? { ...v, isActive: newStatus }
        : v
    ))
  }

  const handleVideoFeaturedChanged = (videoId: string, newFeatured: boolean) => {
    setVideos(prev => prev.map(v => 
      v.id === videoId 
        ? { ...v, isFeatured: newFeatured }
        : v
    ))
  }

  const handleVideoDeleted = (videoId: string) => {
    setVideos(prev => prev.filter(v => v.id !== videoId))
  }

  const handleVideoUpdated = (updatedVideo: any) => {
    setVideos(prev => prev.map(v => 
      v.id === updatedVideo.id 
        ? updatedVideo
        : v
    ))
  }

  const handleBulkToggleStatus = async (isActive: boolean) => {
    try {
      const response = await fetch('/api/video-testimonials/bulk-toggle-status', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ids: selectedVideos,
          isActive 
        }),
      })

      if (!response.ok) {
        throw new Error('Error al actualizar estado de videos')
      }

      const result = await response.json()
      
      // Actualizar el estado local
      setVideos(prev => prev.map(v => 
        selectedVideos.includes(v.id)
          ? { ...v, isActive }
          : v
      ))

      setSelectedVideos([])
      
      // Mostrar notificación de éxito
      console.log(result.message)
    } catch (error) {
      console.error('Error al cambiar estado de videos en lote:', error)
    }
  }

  const handleSelectVideo = (videoId: string) => {
    setSelectedVideos(prev => 
      prev.includes(videoId) 
        ? prev.filter(id => id !== videoId)
        : [...prev, videoId]
    )
  }

  const handleSelectAll = () => {
    if (selectedVideos.length === filteredVideos.length) {
      setSelectedVideos([])
    } else {
      setSelectedVideos(filteredVideos.map(video => video.id))
    }
  }

  const handleBulkAction = (action: string) => {
    switch (action) {
      case 'activate':
        handleBulkToggleStatus(true)
        break
      case 'deactivate':
        handleBulkToggleStatus(false)
        break
      case 'export':
        console.log('Exportando videos:', selectedVideos)
        // Implementar exportación
        setSelectedVideos([])
        break
      default:
        console.log(`Acción no reconocida: ${action}`)
    }
  }

  const getStatusBadgeVariant = (isActive: boolean) => {
    return isActive ? 'default' : 'secondary'
  }

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

  if (!canManageVideoTestimonials()) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Videos Testimoniales</h1>
          <p className="text-muted-foreground">
            No tienes permisos para gestionar videos testimoniales.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Videos Testimoniales</h1>
          <p className="text-muted-foreground">
            Administra los videos testimoniales y casos de impacto
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {canCreateVideoTestimonials() && (
            <CreateVideoTestimonialForm onVideoCreated={fetchVideos} />
          )}
          <Button variant="outline" size="sm" onClick={fetchVideos}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Actualizar
          </Button>
        </div>
      </div>

      {/* Filtros y búsqueda */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar por título o descripción..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Todos</SelectItem>
              <SelectItem value="ACTIVE">Activos</SelectItem>
              <SelectItem value="INACTIVE">Inactivos</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="title">Título</SelectItem>
              <SelectItem value="createdAt">Fecha creación</SelectItem>
              <SelectItem value="updatedAt">Fecha actualización</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </Button>
        </div>
      </div>

      {/* Acciones en lote */}
      {selectedVideos.length > 0 && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-blue-900">
              {selectedVideos.length} video(s) seleccionado(s)
            </span>
            <div className="flex items-center space-x-2">
              <Button size="sm" variant="outline" onClick={() => handleBulkAction('activate')}>
                <Eye className="mr-1 h-3 w-3" />
                Activar
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleBulkAction('deactivate')}>
                <EyeOff className="mr-1 h-3 w-3" />
                Desactivar
              </Button>
              <Button size="sm" variant="outline" onClick={() => setSelectedVideos([])}>
                Limpiar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Pestañas */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">Todas ({filteredVideos.length})</TabsTrigger>
          <TabsTrigger value="active">Activas ({activeVideos.length})</TabsTrigger>
          <TabsTrigger value="inactive">Inactivas ({inactiveVideos.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <VideoList 
            videos={filteredVideos}
            loading={loading}
            selectedVideos={selectedVideos}
            onSelectVideo={handleSelectVideo}
            onSelectAll={handleSelectAll}
            onToggleStatus={handleVideoStatusChanged}
            onToggleFeatured={handleVideoFeaturedChanged}
            onVideoDeleted={handleVideoDeleted}
            onVideoUpdated={handleVideoUpdated}
            canEditVideoTestimonials={canEditVideoTestimonials}
            canDeleteVideoTestimonials={canDeleteVideoTestimonials}
            getStatusBadgeVariant={getStatusBadgeVariant}
            viewMode="grid"
            getYouTubeThumbnail={getYouTubeThumbnail}
            formatDuration={formatDuration}
          />
        </TabsContent>

        <TabsContent value="active">
          <VideoList 
            videos={activeVideos}
            loading={loading}
            selectedVideos={selectedVideos}
            onSelectVideo={handleSelectVideo}
            onSelectAll={handleSelectAll}
            onToggleStatus={handleVideoStatusChanged}
            onToggleFeatured={handleVideoFeaturedChanged}
            onVideoDeleted={handleVideoDeleted}
            onVideoUpdated={handleVideoUpdated}
            canEditVideoTestimonials={canEditVideoTestimonials}
            canDeleteVideoTestimonials={canDeleteVideoTestimonials}
            getStatusBadgeVariant={getStatusBadgeVariant}
            viewMode="grid"
            getYouTubeThumbnail={getYouTubeThumbnail}
            formatDuration={formatDuration}
          />
        </TabsContent>

        <TabsContent value="inactive">
          <VideoList 
            videos={inactiveVideos}
            loading={loading}
            selectedVideos={selectedVideos}
            onSelectVideo={handleSelectVideo}
            onSelectAll={handleSelectAll}
            onToggleStatus={handleVideoStatusChanged}
            onToggleFeatured={handleVideoFeaturedChanged}
            onVideoDeleted={handleVideoDeleted}
            onVideoUpdated={handleVideoUpdated}
            canEditVideoTestimonials={canEditVideoTestimonials}
            canDeleteVideoTestimonials={canDeleteVideoTestimonials}
            getStatusBadgeVariant={getStatusBadgeVariant}
            viewMode="grid"
            getYouTubeThumbnail={getYouTubeThumbnail}
            formatDuration={formatDuration}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Componente para mostrar la lista de videos
interface VideoListProps {
  videos: VideoTestimonial[]
  loading: boolean
  selectedVideos: string[]
  onSelectVideo: (videoId: string) => void
  onSelectAll: () => void
  onToggleStatus: (videoId: string, newStatus: boolean) => void
  onToggleFeatured: (videoId: string, newFeatured: boolean) => void
  onVideoDeleted: (videoId: string) => void
  onVideoUpdated: (updatedVideo: any) => void
  canEditVideoTestimonials: () => boolean
  canDeleteVideoTestimonials: () => boolean
  getStatusBadgeVariant: (isActive: boolean) => "default" | "secondary"
  viewMode: 'grid' | 'list'
  getYouTubeThumbnail: (url: string) => string | null
  formatDuration: (seconds?: number) => string
}

function VideoList({
  videos,
  loading,
  selectedVideos,
  onSelectVideo,
  onSelectAll,
  onToggleStatus,
  onToggleFeatured,
  onVideoDeleted,
  onVideoUpdated,
  canEditVideoTestimonials,
  canDeleteVideoTestimonials,
  getStatusBadgeVariant,
  viewMode,
  getYouTubeThumbnail,
  formatDuration
}: VideoListProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg">
            <div className="w-20 h-16 bg-gray-200 rounded animate-pulse" />
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-gray-200 rounded animate-pulse w-1/4" />
              <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (videos.length === 0) {
    return (
      <div className="text-center py-12">
        <Video className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No hay videos testimoniales</h3>
        <p className="mt-1 text-sm text-gray-500">
          Comienza creando tu primer video testimonial.
        </p>
      </div>
    )
  }

  if (viewMode === 'grid') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video) => {
          const thumbnailUrl = video.thumbnailUrl || getYouTubeThumbnail(video.youtubeUrl);
          
          return (
            <Card key={video.id} className="overflow-hidden">
              <div className="relative h-48">
                {thumbnailUrl ? (
                  <img
                    src={thumbnailUrl}
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <Video className="h-12 w-12 text-gray-400" />
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <Checkbox
                    checked={selectedVideos.includes(video.id)}
                    onCheckedChange={() => onSelectVideo(video.id)}
                  />
                </div>
                {video.isFeatured && (
                  <div className="absolute top-2 left-2">
                    <Badge className="bg-yellow-500 text-white">
                      <Star className="mr-1 h-3 w-3" />
                      Destacado
                    </Badge>
                  </div>
                )}
                {video.duration && (
                  <div className="absolute bottom-2 right-2">
                    <Badge variant="secondary" className="bg-black bg-opacity-70 text-white">
                      <Clock className="mr-1 h-3 w-3" />
                      {formatDuration(video.duration)}
                    </Badge>
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold line-clamp-1">{video.title}</h3>
                  <Badge variant={getStatusBadgeVariant(video.isActive)}>
                    {video.isActive ? 'Activo' : 'Inactivo'}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                  {video.description}
                </p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(video.createdAt).toLocaleDateString()}
                  </div>
                  {video.creator && (
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {video.creator.name}
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-end gap-2 mt-3">
                  {canEditVideoTestimonials() && (
                    <EditVideoTestimonialForm
                      video={video}
                      onVideoUpdated={onVideoUpdated}
                    >
                      <Button variant="ghost" size="sm" title="Editar video">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </EditVideoTestimonialForm>
                  )}
                  <ToggleVideoTestimonialStatusDialog
                    video={video}
                    onVideoUpdated={onVideoUpdated}
                  >
                    <Button 
                      variant="ghost" 
                      size="sm"
                      title={video.isActive ? 'Desactivar' : 'Activar'}
                    >
                      {video.isActive ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </ToggleVideoTestimonialStatusDialog>
                  {canDeleteVideoTestimonials() && (
                    <DeleteVideoTestimonialDialog
                      video={video}
                      onVideoDeleted={onVideoDeleted}
                    >
                      <Button variant="ghost" size="sm" className="text-destructive" title="Eliminar video">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </DeleteVideoTestimonialDialog>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 p-4 border rounded-lg bg-gray-50">
        <Checkbox
          checked={selectedVideos.length === videos.length && videos.length > 0}
          onCheckedChange={onSelectAll}
        />
        <span className="text-sm font-medium">Seleccionar todos</span>
      </div>
      
      {videos.map((video) => {
        const thumbnailUrl = video.thumbnailUrl || getYouTubeThumbnail(video.youtubeUrl);
        
        return (
          <Card key={video.id}>
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <div className="relative w-20 h-16 flex-shrink-0">
                  <Checkbox
                    checked={selectedVideos.includes(video.id)}
                    onCheckedChange={() => onSelectVideo(video.id)}
                    className="absolute top-1 right-1 z-10"
                  />
                  {thumbnailUrl ? (
                    <img
                      src={thumbnailUrl}
                      alt={video.title}
                      className="w-full h-full object-cover rounded"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center">
                      <Video className="h-6 w-6 text-gray-400" />
                    </div>
                  )}
                  {video.isFeatured && (
                    <Badge className="absolute bottom-1 left-1 bg-yellow-500 text-white text-xs">
                      <Star className="mr-1 h-2 w-2" />
                    </Badge>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="font-semibold text-lg truncate">{video.title}</h3>
                    <div className="flex items-center gap-2 ml-2">
                      <Badge variant={getStatusBadgeVariant(video.isActive)}>
                        {video.isActive ? 'Activo' : 'Inactivo'}
                      </Badge>
                      {video.duration && (
                        <Badge variant="outline" className="text-xs">
                          <Clock className="mr-1 h-3 w-3" />
                          {formatDuration(video.duration)}
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                    {video.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(video.createdAt).toLocaleDateString()}
                      </div>
                      {video.creator && (
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {video.creator.name}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {canEditVideoTestimonials() && (
                        <EditVideoTestimonialForm
                          video={video}
                          onVideoUpdated={onVideoUpdated}
                        >
                          <Button variant="ghost" size="sm" title="Editar video">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </EditVideoTestimonialForm>
                      )}
                      <ToggleVideoTestimonialStatusDialog
                        video={video}
                        onVideoUpdated={onVideoUpdated}
                      >
                        <Button 
                          variant="ghost" 
                          size="sm"
                          title={video.isActive ? 'Desactivar' : 'Activar'}
                        >
                          {video.isActive ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </ToggleVideoTestimonialStatusDialog>
                      {canDeleteVideoTestimonials() && (
                        <DeleteVideoTestimonialDialog
                          video={video}
                          onVideoDeleted={onVideoDeleted}
                        >
                          <Button variant="ghost" size="sm" className="text-destructive" title="Eliminar video">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </DeleteVideoTestimonialDialog>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  )
}