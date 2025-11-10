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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { FileText, Search, MoreHorizontal, Edit, Trash2, Eye, EyeOff, Download, RefreshCw, Calendar, User } from 'lucide-react'
import { isValidImageUrl, getImagePlaceholderData } from '@/lib/image-utils'
import { CreateStoryForm } from '@/components/admin/create-story-form'
import { ToggleStoryStatusDialog } from '@/components/admin/toggle-story-status-dialog'
import { DeleteStoryDialog } from '@/components/admin/delete-story-dialog'
import { EditStoryForm } from '@/components/admin/edit-story-form'
import Image from 'next/image'

interface Story {
  id: string
  title: string
  content?: string
  imageUrl: string | null
  imageAlt: string | null
  status: 'ACTIVE' | 'INACTIVE'
  createdAt: string
  updatedAt: string
  createdBy?: string
  author?: {
    id: string
    name: string
    email: string
    role: string
  }
}

export default function StoriesPage() {
  const { canManaMANAGERies, canCreateStories, canEditStories, canDeleteStories } = usePermissions()
  const [stories, setStories] = useState<Story[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [selectedStories, setSelectedStories] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<'title' | 'createdAt' | 'updatedAt'>('createdAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const fetchStories = useCallback(async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      
      if (statusFilter !== 'ALL') params.append('status', statusFilter)
      if (searchTerm) params.append('search', searchTerm)
      params.append('sortBy', sortBy)
      params.append('sortOrder', sortOrder)

      const response = await fetch(`/api/stories?${params.toString()}`)
      
      if (!response.ok) {
        throw new Error('Error al cargar historias')
      }

      const data = await response.json()
      setStories(data)
    } catch (error) {
      console.error('Error al cargar historias:', error)
      setStories([])
    } finally {
      setLoading(false)
    }
  }, [statusFilter, searchTerm, sortBy, sortOrder])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchStories()
    }, 300) // Debounce
    return () => clearTimeout(timeoutId)
  }, [statusFilter, searchTerm, sortBy, sortOrder, fetchStories])

  const filteredStories = stories // Data is now filtered/sorted by API
  const activeStories = stories.filter(story => story.status === 'ACTIVE')
  const inactiveStories = stories.filter(story => story.status === 'INACTIVE')

  const handleStoryStatusChanged = (storyId: string, newStatus: 'ACTIVE' | 'INACTIVE') => {
    setStories(prev => prev.map(s => 
      s.id === storyId 
        ? { ...s, status: newStatus }
        : s
    ))
  }

  const handleStoryDeleted = (storyId: string) => {
    setStories(prev => prev.filter(s => s.id !== storyId))
  }

  const handleStoryUpdated = (updatedStory: any) => {
    setStories(prev => prev.map(s => 
      s.id === updatedStory.id 
        ? updatedStory
        : s
    ))
  }

  const handleBulkToggleStatus = async (isActive: boolean) => {
    try {
      const response = await fetch('/api/stories/bulk-toggle-status', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          storyIds: selectedStories,
          isActive 
        }),
      })

      if (!response.ok) {
        throw new Error('Error al actualizar estado de stories')
      }

      const result = await response.json()
      
      // Actualizar el estado local
      setStories(prev => prev.map(s => 
        selectedStories.includes(s.id)
          ? { ...s, status: isActive ? 'ACTIVE' : 'INACTIVE' }
          : s
      ))

      setSelectedStories([])
      
      // Mostrar notificación de éxito
      console.log(result.message)
    } catch (error) {
      console.error('Error al cambiar estado de stories en lote:', error)
    }
  }

  const handleSelectStory = (storyId: string) => {
    setSelectedStories(prev => 
      prev.includes(storyId) 
        ? prev.filter(id => id !== storyId)
        : [...prev, storyId]
    )
  }

  const handleSelectAll = () => {
    if (selectedStories.length === filteredStories.length) {
      setSelectedStories([])
    } else {
      setSelectedStories(filteredStories.map(story => story.id))
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
        console.log('Exportando stories:', selectedStories)
        // Implementar exportación
        setSelectedStories([])
        break
      default:
        console.log(`Acción no reconocida: ${action}`)
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    return status === 'ACTIVE' ? 'default' : 'secondary'
  }

  if (!canManaMANAGERies()) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Stories</h1>
          <p className="text-muted-foreground">
            No tienes permisos para gestionar stories.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Historias de Impacto</h1>
          <p className="text-muted-foreground">
            Administra las historias de éxito y casos de impacto
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {canCreateStories() && (
            <CreateStoryForm onStoryCreated={fetchStories} />
          )}
          <Button variant="outline" size="sm" onClick={fetchStories}>
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
              placeholder="Buscar por título, contenido o resumen..."
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
      {selectedStories.length > 0 && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-blue-900">
              {selectedStories.length} historia(s) seleccionada(s)
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
              <Button size="sm" variant="outline" onClick={() => setSelectedStories([])}>
                Limpiar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Pestañas */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">Todas ({filteredStories.length})</TabsTrigger>
          <TabsTrigger value="active">Activas ({activeStories.length})</TabsTrigger>
          <TabsTrigger value="inactive">Inactivas ({inactiveStories.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <StoryList 
            stories={filteredStories}
            loading={loading}
            selectedStories={selectedStories}
            onSelectStory={handleSelectStory}
            onSelectAll={handleSelectAll}
            onToggleStatus={handleStoryStatusChanged}
            onStoryDeleted={handleStoryDeleted}
            onStoryUpdated={handleStoryUpdated}
            canEditStories={canEditStories}
            canDeleteStories={canDeleteStories}
            getStatusBadgeVariant={getStatusBadgeVariant}
            viewMode="grid"
          />
        </TabsContent>

        <TabsContent value="active">
          <StoryList 
            stories={activeStories}
            loading={loading}
            selectedStories={selectedStories}
            onSelectStory={handleSelectStory}
            onSelectAll={handleSelectAll}
            onToggleStatus={handleStoryStatusChanged}
            onStoryDeleted={handleStoryDeleted}
            onStoryUpdated={handleStoryUpdated}
            canEditStories={canEditStories}
            canDeleteStories={canDeleteStories}
            getStatusBadgeVariant={getStatusBadgeVariant}
            viewMode="grid"
          />
        </TabsContent>

        <TabsContent value="inactive">
          <StoryList 
            stories={inactiveStories}
            loading={loading}
            selectedStories={selectedStories}
            onSelectStory={handleSelectStory}
            onSelectAll={handleSelectAll}
            onToggleStatus={handleStoryStatusChanged}
            onStoryDeleted={handleStoryDeleted}
            onStoryUpdated={handleStoryUpdated}
            canEditStories={canEditStories}
            canDeleteStories={canDeleteStories}
            getStatusBadgeVariant={getStatusBadgeVariant}
            viewMode="grid"
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Componente para mostrar la lista de stories
interface StoryListProps {
  stories: Story[]
  loading: boolean
  selectedStories: string[]
  onSelectStory: (storyId: string) => void
  onSelectAll: () => void
  onToggleStatus: (storyId: string, newStatus: 'ACTIVE' | 'INACTIVE') => void
  onStoryDeleted: (storyId: string) => void
  onStoryUpdated: (updatedStory: any) => void
  canEditStories: () => boolean
  canDeleteStories: () => boolean
  getStatusBadgeVariant: (status: string) => "default" | "secondary"
  viewMode: 'grid' | 'list'
}

function StoryList({
  stories,
  loading,
  selectedStories,
  onSelectStory,
  onSelectAll,
  onToggleStatus,
  onStoryDeleted,
  onStoryUpdated,
  canEditStories,
  canDeleteStories,
  getStatusBadgeVariant,
  viewMode
}: StoryListProps) {
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

  if (stories.length === 0) {
    return (
        <div className="text-center py-12">
        <FileText className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No hay stories</h3>
        <p className="mt-1 text-sm text-gray-500">
          Comienza creando tu primera story de éxito.
        </p>
        </div>
    )
  }

  if (viewMode === 'grid') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stories.map((story) => (
          <Card key={story.id} className="overflow-hidden">
            <div className="relative h-48 flex-shrink-0">
              {(() => {
                const hasValidImage = story.imageUrl 
                  && typeof story.imageUrl === 'string' 
                  && story.imageUrl.trim() !== '' 
                  && story.imageUrl !== '/placeholder-story.jpg' 
                  && isValidImageUrl(story.imageUrl);
                
                if (hasValidImage) {
                  return (
                    <Image
                      src={story.imageUrl!}
                      alt={story.imageAlt || story.title}
                      fill
                      className="object-cover"
                    />
                  );
                }
                
                return (
                  <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
                    <div className="text-center">
                      <span className="material-symbols-outlined text-4xl text-gray-400 mb-2 block">
                        auto_stories
                      </span>
                      <span className="text-sm text-gray-500">
                        Sin imagen
                      </span>
                    </div>
                  </div>
                );
              })()}
              <div className="absolute top-2 right-2">
                <Checkbox
                  checked={selectedStories.includes(story.id)}
                  onCheckedChange={() => onSelectStory(story.id)}
                  className="bg-white/90 backdrop-blur-sm"
                />
              </div>
            </div>
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold line-clamp-1">{story.title}</h3>
                <Badge variant={getStatusBadgeVariant(story.status)}>
                  {story.status === 'ACTIVE' ? 'Activa' : 'Inactiva'}
                </Badge>
              </div>
              <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                {story.content ? (story.content.length > 150 ? story.content.substring(0, 150) + '...' : story.content) : 'No hay contenido disponible.'}
              </p>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {story.createdAt}
                </div>
                {story.author && (
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {story.author.name}
                  </div>
                )}
              </div>
              <div className="flex items-center justify-end gap-2 mt-3">
                {canEditStories() && (
                  <EditStoryForm
                    story={{
                      ...story,
                      content: story.content || '',
                      imageUrl: story.imageUrl || '',
                      imageAlt: story.imageAlt || ''
                    }}
                    onStoryUpdated={onStoryUpdated}
                  >
                    <Button variant="ghost" size="sm" title="Editar story">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </EditStoryForm>
                )}
                <ToggleStoryStatusDialog
                  story={{
                    id: story.id,
                    title: story.title,
                    description: story.content?.substring(0, 100) || '' || '',
                    status: story.status
                  }}
                  onStatusChanged={onToggleStatus}
                >
                  <Button 
                    variant="ghost" 
                    size="sm"
                    title={story.status === 'ACTIVE' ? 'Desactivar' : 'Activar'}
                  >
                    {story.status === 'ACTIVE' ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </ToggleStoryStatusDialog>
                {canDeleteStories() && (
                  <DeleteStoryDialog
                    story={{
                      id: story.id,
                      title: story.title,
                      description: story.content?.substring(0, 100) || '' || ''
                    }}
                    onStoryDeleted={onStoryDeleted}
                  >
                    <Button variant="ghost" size="sm" className="text-destructive" title="Eliminar story">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </DeleteStoryDialog>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 p-4 border rounded-lg bg-gray-50">
        <Checkbox
          checked={selectedStories.length === stories.length && stories.length > 0}
          onCheckedChange={onSelectAll}
        />
        <span className="text-sm text-muted-foreground">Seleccionar todos</span>
      </div>
      
      {stories.map((story) => (
        <Card key={story.id}>
          <CardContent className="p-4">
            <div className="flex items-start space-x-4">
              <div className="relative w-20 h-16 flex-shrink-0">
                {(() => {
                  const hasValidImage = story.imageUrl 
                    && typeof story.imageUrl === 'string' 
                    && story.imageUrl.trim() !== '' 
                    && story.imageUrl !== '/placeholder-story.jpg' 
                    && isValidImageUrl(story.imageUrl);
                  
                  if (hasValidImage) {
                    return (
                      <Image
                        src={story.imageUrl!}
                        alt={story.imageAlt || story.title}
                        fill
                        className="object-cover rounded"
                      />
                    );
                  }
                  
                  return (
                    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center rounded">
                      <span className="material-symbols-outlined text-xl text-gray-400">
                        auto_stories
                      </span>
                    </div>
                  );
                })()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <Checkbox
                        checked={selectedStories.includes(story.id)}
                        onCheckedChange={() => onSelectStory(story.id)}
                      />
                      <h3 className="font-semibold truncate">{story.title}</h3>
                      <Badge variant={getStatusBadgeVariant(story.status)}>
                        {story.status === 'ACTIVE' ? 'Activa' : 'Inactiva'}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-3 mb-2">
                      {story.content?.substring(0, 100) || '' || 'No hay resumen disponible.'}
                    </p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Creado: {story.createdAt}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Actualizado: {story.updatedAt}
                      </div>
                      {story.author && (
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {story.author.name}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 flex-shrink-0">
                    {canEditStories() && (
                      <EditStoryForm
                        story={{
                          ...story,
                          content: story.content || '',
                          imageUrl: story.imageUrl || '',
                          imageAlt: story.imageAlt || ''
                        }}
                        onStoryUpdated={onStoryUpdated}
                      >
                        <Button variant="ghost" size="sm" title="Editar story">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </EditStoryForm>
                    )}
                    <ToggleStoryStatusDialog
                      story={{
                        id: story.id,
                        title: story.title,
                        description: story.content?.substring(0, 100) || '' || '',
                        status: story.status
                      }}
                      onStatusChanged={onToggleStatus}
                    >
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            Ver detalles
                          </DropdownMenuItem>
                          {canEditStories() && (
                            <EditStoryForm
                              story={{
                                ...story,
                                content: story.content || '',
                                imageUrl: story.imageUrl || '',
                                imageAlt: story.imageAlt || ''
                              }}
                              onStoryUpdated={onStoryUpdated}
                            >
                              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                <Edit className="mr-2 h-4 w-4" />
                                Editar
                              </DropdownMenuItem>
                            </EditStoryForm>
                          )}
                          <ToggleStoryStatusDialog
                            story={{
                              id: story.id,
                              title: story.title,
                              description: story.content?.substring(0, 100) || '' || '',
                              status: story.status
                            }}
                            onStatusChanged={onToggleStatus}
                          >
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                              {story.status === 'ACTIVE' ? (
                                <>
                                  <EyeOff className="mr-2 h-4 w-4" />
                                  Desactivar
                                </>
                              ) : (
                                <>
                                  <Eye className="mr-2 h-4 w-4" />
                                  Activar
                                </>
                              )}
                            </DropdownMenuItem>
                          </ToggleStoryStatusDialog>
                          {canDeleteStories() && (
                            <DeleteStoryDialog
                              story={{
                                id: story.id,
                                title: story.title,
                                description: story.content?.substring(0, 100) || '' || ''
                              }}
                              onStoryDeleted={onStoryDeleted}
                            >
                              <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Eliminar
                              </DropdownMenuItem>
                            </DeleteStoryDialog>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </ToggleStoryStatusDialog>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
          ))}
    </div>
  )
}