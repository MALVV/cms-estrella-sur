'use client'

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { useSession } from 'next-auth/react';
import { usePermissions } from '@/hooks/use-permissions';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  Search, 
  RefreshCw, 
  Plus, 
  FileText,
  Download,
  Star,
  StarOff,
  PlayCircle,
  Video,
  Music,
  BookOpen,
  Library,
  FileDown,
  Book,
  Clock,
  Monitor
} from 'lucide-react';

interface Resource {
  id: string;
  title: string;
  description?: string;
  fileName: string;
  fileUrl: string;
  fileSize?: number;
  fileType?: string;
  category: 'MULTIMEDIA_CENTER' | 'PUBLICATIONS';
  subcategory?: 'VIDEOS' | 'AUDIOS' | 'DIGITAL_LIBRARY' | 'DOWNLOADABLE_GUIDES' | 'MANUALS' | 'none';
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
    icon: PlayCircle,
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    subcategories: {
      VIDEOS: { title: 'Videos', icon: Video },
      AUDIOS: { title: 'Audios', icon: Music }
    }
  },
  PUBLICATIONS: {
    title: 'Publicaciones',
    icon: BookOpen,
    color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    subcategories: {
      DIGITAL_LIBRARY: { title: 'Biblioteca Digital', icon: Library },
      DOWNLOADABLE_GUIDES: { title: 'Guías Descargables', icon: FileDown },
      MANUALS: { title: 'Manuales', icon: Book }
    }
  }
};

export const ResourcesManagement: React.FC = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [subcategoryFilter, setSubcategoryFilter] = useState('ALL');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'title' | 'category' | 'downloadCount' | 'createdAt'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [deletingResource, setDeletingResource] = useState<Resource | null>(null);
  const { toast } = useToast();
  const { data: session } = useSession();
  const { canManageContent } = usePermissions();

  const fetchData = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (statusFilter !== 'ALL') {
        params.append('isActive', statusFilter === 'ACTIVE' ? 'true' : 'false');
      }
      if (categoryFilter !== 'ALL') {
        params.append('category', categoryFilter);
      }
      if (subcategoryFilter !== 'ALL') {
        params.append('subcategory', subcategoryFilter);
      }
      if (searchTerm) {
        params.append('search', searchTerm);
      }
      params.append('sortBy', sortBy);
      params.append('sortOrder', sortOrder);

      const response = await fetch(`/api/resources?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Error al cargar recursos');
      }
      const data = await response.json();
      setResources(data);
    } catch (error) {
      console.error('Error al cargar recursos:', error);
      toast({
        title: 'Error',
        description: 'Error al cargar los recursos',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchData();
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [statusFilter, categoryFilter, subcategoryFilter, searchTerm, sortBy, sortOrder]);

  const filteredResources = resources;
  const activeResources = resources.filter(item => item.isActive);
  const featuredResources = resources.filter(item => item.isFeatured);

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/resources/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isActive: !currentStatus,
        }),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el estado');
      }

      toast({
        title: 'Éxito',
        description: `Recurso ${!currentStatus ? 'activado' : 'desactivado'} exitosamente`,
      });

      fetchData();
    } catch (error) {
      console.error('Error al actualizar estado:', error);
      toast({
        title: 'Error',
        description: 'Error al actualizar el estado del recurso',
        variant: 'destructive',
      });
    }
  };

  const handleToggleFeatured = async (id: string) => {
    try {
      const response = await fetch(`/api/resources/${id}/toggle-featured`, {
        method: 'PUT',
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el estado destacado');
      }

      toast({
        title: 'Éxito',
        description: 'Estado destacado actualizado exitosamente',
      });

      fetchData();
    } catch (error) {
      console.error('Error al actualizar estado destacado:', error);
      toast({
        title: 'Error',
        description: 'Error al actualizar el estado destacado',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/resources/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al eliminar el recurso');
      }

      toast({
        title: 'Éxito',
        description: 'Recurso eliminado exitosamente',
      });

      setDeletingResource(null);
      fetchData();
    } catch (error) {
      console.error('Error al eliminar recurso:', error);
      toast({
        title: 'Error',
        description: 'Error al eliminar el recurso',
        variant: 'destructive',
      });
    }
  };

  const handleBulkStatusChange = async (isActive: boolean) => {
    try {
      const response = await fetch('/api/resources/bulk-toggle-status', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ids: selectedItems,
          isActive,
        }),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el estado');
      }

      toast({
        title: 'Éxito',
        description: `${selectedItems.length} recursos actualizados exitosamente`,
      });

      setSelectedItems([]);
      fetchData();
    } catch (error) {
      console.error('Error al actualizar estado:', error);
      toast({
        title: 'Error',
        description: 'Error al actualizar el estado de los recursos',
        variant: 'destructive',
      });
    }
  };

  const handleSelectAll = () => {
    if (selectedItems.length === filteredResources.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredResources.map(item => item.id));
    }
  };

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!canManageContent) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">Acceso Denegado</h2>
              <p className="text-gray-600">No tienes permisos para gestionar recursos multimedia.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-light dark:text-text-dark">Gestión de Recursos</h1>
          <p className="text-text-secondary-light dark:text-text-secondary-dark">
            Administra el centro multimedia y las publicaciones digitales
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Recurso
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Recurso</DialogTitle>
            </DialogHeader>
            <CreateResourceForm 
              onSuccess={() => {
                setIsCreateDialogOpen(false);
                fetchData();
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">
                  Total Recursos
                </p>
                <p className="text-2xl font-bold text-text-light dark:text-text-dark">
                  {resources.length}
                </p>
              </div>
              <PlayCircle className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">
                  Activos
                </p>
                <p className="text-2xl font-bold text-text-light dark:text-text-dark">
                  {activeResources.length}
                </p>
              </div>
              <Eye className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">
                  Destacados
                </p>
                <p className="text-2xl font-bold text-text-light dark:text-text-dark">
                  {featuredResources.length}
                </p>
              </div>
              <Star className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">
                  Descargas
                </p>
                <p className="text-2xl font-bold text-text-light dark:text-text-dark">
                  {resources.reduce((sum, r) => sum + r.downloadCount, 0)}
                </p>
              </div>
              <Download className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar recursos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Todos los estados</SelectItem>
                <SelectItem value="ACTIVE">Activos</SelectItem>
                <SelectItem value="INACTIVE">Inactivos</SelectItem>
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={(value) => {
              setCategoryFilter(value);
              setSubcategoryFilter('ALL'); // Reset subcategory when category changes
            }}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Todas las categorías</SelectItem>
                {Object.entries(categoryInfo).map(([key, info]) => (
                  <SelectItem key={key} value={key}>{info.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={subcategoryFilter} onValueChange={setSubcategoryFilter}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Subcategoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Todas las subcategorías</SelectItem>
                {categoryFilter !== 'ALL' && Object.entries(categoryInfo[categoryFilter as keyof typeof categoryInfo].subcategories).map(([key, info]) => (
                  <SelectItem key={key} value={key}>{info.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="title">Título</SelectItem>
                <SelectItem value="category">Categoría</SelectItem>
                <SelectItem value="downloadCount">Descargas</SelectItem>
                <SelectItem value="createdAt">Fecha de creación</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </Button>

            <Button variant="outline" onClick={fetchData}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedItems.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                {selectedItems.length} recurso(s) seleccionado(s)
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkStatusChange(true)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Activar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkStatusChange(false)}
                >
                  <EyeOff className="h-4 w-4 mr-2" />
                  Desactivar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Resources List */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6">
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    <div className="space-y-2 flex-1">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/4" />
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-border-light dark:border-border-dark">
                  <tr>
                    <th className="p-4 text-left">
                      <Checkbox
                        checked={selectedItems.length === filteredResources.length && filteredResources.length > 0}
                        onCheckedChange={handleSelectAll}
                      />
                    </th>
                    <th className="p-4 text-left text-sm font-medium text-text-light dark:text-text-dark">
                      Recurso
                    </th>
                    <th className="p-4 text-left text-sm font-medium text-text-light dark:text-text-dark">
                      Categoría
                    </th>
                    <th className="p-4 text-left text-sm font-medium text-text-light dark:text-text-dark">
                      Estado
                    </th>
                    <th className="p-4 text-left text-sm font-medium text-text-light dark:text-text-dark">
                      Descargas
                    </th>
                    <th className="p-4 text-left text-sm font-medium text-text-light dark:text-text-dark">
                      Creado
                    </th>
                    <th className="p-4 text-left text-sm font-medium text-text-light dark:text-text-dark">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredResources.map((resource) => (
                    <tr key={resource.id} className="border-b border-border-light dark:border-border-dark hover:bg-muted/50">
                      <td className="p-4">
                        <Checkbox
                          checked={selectedItems.includes(resource.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedItems([...selectedItems, resource.id]);
                            } else {
                              setSelectedItems(selectedItems.filter(id => id !== resource.id));
                            }
                          }}
                        />
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          {resource.subcategory === 'VIDEOS' ? (
                            <Video className="h-5 w-5 text-primary" />
                          ) : resource.subcategory === 'AUDIOS' ? (
                            <Music className="h-5 w-5 text-primary" />
                          ) : (
                            <FileText className="h-5 w-5 text-primary" />
                          )}
                          <div>
                            <div className="font-medium text-text-light dark:text-text-dark">
                              {resource.title}
                            </div>
                            <div className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                              {resource.fileName}
                            </div>
                            {resource.fileSize && (
                              <div className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                                {formatFileSize(resource.fileSize)}
                              </div>
                            )}
                            {resource.duration && (
                              <div className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                                <Clock className="h-3 w-3 inline mr-1" />
                                {formatDuration(resource.duration)}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="space-y-1">
                          <Badge className={categoryInfo[resource.category].color}>
                            {categoryInfo[resource.category].title}
                          </Badge>
                          {resource.subcategory && resource.subcategory !== 'none' && (() => {
                            const category = categoryInfo[resource.category as keyof typeof categoryInfo];
                            if (category?.subcategories) {
                              const subcategory = (category.subcategories as any)[resource.subcategory];
                              if (subcategory) {
                                return (
                                  <div className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                                    {subcategory.title}
                                  </div>
                                );
                              }
                            }
                            return null;
                          })()}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Badge variant={resource.isActive ? 'default' : 'secondary'}>
                            {resource.isActive ? 'Activo' : 'Inactivo'}
                          </Badge>
                          {resource.isFeatured && (
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-text-light dark:text-text-dark">
                        {resource.downloadCount}
                      </td>
                      <td className="p-4 text-text-secondary-light dark:text-text-secondary-dark">
                        {formatDate(resource.createdAt)}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleFeatured(resource.id)}
                          >
                            {resource.isFeatured ? (
                              <StarOff className="h-4 w-4" />
                            ) : (
                              <Star className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleStatus(resource.id, resource.isActive)}
                          >
                            {resource.isActive ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingResource(resource)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeletingResource(resource)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      {editingResource && (
        <Dialog open={!!editingResource} onOpenChange={() => setEditingResource(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Editar Recurso</DialogTitle>
            </DialogHeader>
            <EditResourceForm
              resource={editingResource}
              onSuccess={() => {
                setEditingResource(null);
                fetchData();
              }}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Dialog */}
      {deletingResource && (
        <Dialog open={!!deletingResource} onOpenChange={() => setDeletingResource(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Eliminar Recurso</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p>¿Estás seguro de que quieres eliminar el recurso "{deletingResource.title}"?</p>
              <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                Esta acción no se puede deshacer.
              </p>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setDeletingResource(null)}>
                  Cancelar
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(deletingResource.id)}
                >
                  Eliminar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

// Componente para crear nuevo recurso
const CreateResourceForm: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    fileName: '',
    fileUrl: '',
    fileSize: '',
    fileType: '',
    category: '',
    subcategory: 'none',
    thumbnailUrl: '',
    duration: '',
    isFeatured: false,
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/resources', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          fileSize: formData.fileSize ? parseInt(formData.fileSize) : undefined,
          duration: formData.duration ? parseInt(formData.duration) : undefined,
          subcategory: formData.subcategory === 'none' ? undefined : formData.subcategory,
        }),
      });

      if (!response.ok) {
        throw new Error('Error al crear el recurso');
      }

      toast({
        title: 'Éxito',
        description: 'Recurso creado exitosamente',
      });

      onSuccess();
    } catch (error) {
      console.error('Error al crear recurso:', error);
      toast({
        title: 'Error',
        description: 'Error al crear el recurso',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Título *</label>
        <Input
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Descripción</label>
        <Textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Nombre del archivo *</label>
          <Input
            value={formData.fileName}
            onChange={(e) => setFormData({ ...formData, fileName: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">URL del archivo *</label>
          <Input
            value={formData.fileUrl}
            onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Tamaño (bytes)</label>
          <Input
            type="number"
            value={formData.fileSize}
            onChange={(e) => setFormData({ ...formData, fileSize: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Tipo MIME</label>
          <Input
            value={formData.fileType}
            onChange={(e) => setFormData({ ...formData, fileType: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Duración (segundos)</label>
          <Input
            type="number"
            value={formData.duration}
            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Categoría *</label>
          <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value as 'MULTIMEDIA_CENTER' | 'PUBLICATIONS', subcategory: 'none' })}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar categoría" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(categoryInfo).map(([key, info]) => (
                <SelectItem key={key} value={key}>{info.title}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Subcategoría</label>
          <Select value={formData.subcategory} onValueChange={(value) => setFormData({ ...formData, subcategory: value as any })}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar subcategoría" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Sin subcategoría</SelectItem>
              {formData.category && categoryInfo[formData.category as keyof typeof categoryInfo]?.subcategories ? (
                Object.entries(categoryInfo[formData.category as keyof typeof categoryInfo].subcategories).map(([key, info]) => (
                  <SelectItem key={key} value={key}>{info.title}</SelectItem>
                ))
              ) : !formData.category ? (
                <SelectItem value="select-category" disabled>
                  Selecciona una categoría primero
                </SelectItem>
              ) : null}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">URL de miniatura</label>
        <Input
          value={formData.thumbnailUrl}
          onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="isFeatured"
          checked={formData.isFeatured}
          onCheckedChange={(checked) => setFormData({ ...formData, isFeatured: !!checked })}
        />
        <label htmlFor="isFeatured" className="text-sm font-medium">
          Destacar recurso
        </label>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={loading}>
          {loading ? 'Creando...' : 'Crear Recurso'}
        </Button>
      </div>
    </form>
  );
};

// Componente para editar recurso
const EditResourceForm: React.FC<{ 
  resource: Resource; 
  onSuccess: () => void 
}> = ({ resource, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: resource.title,
    description: resource.description || '',
    fileName: resource.fileName,
    fileUrl: resource.fileUrl,
    fileSize: resource.fileSize?.toString() || '',
    fileType: resource.fileType || '',
    category: resource.category,
    subcategory: resource.subcategory || 'none',
    thumbnailUrl: resource.thumbnailUrl || '',
    duration: resource.duration?.toString() || '',
    isActive: resource.isActive,
    isFeatured: resource.isFeatured,
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`/api/resources/${resource.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          fileSize: formData.fileSize ? parseInt(formData.fileSize) : undefined,
          duration: formData.duration ? parseInt(formData.duration) : undefined,
          subcategory: formData.subcategory === 'none' ? undefined : formData.subcategory,
        }),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el recurso');
      }

      toast({
        title: 'Éxito',
        description: 'Recurso actualizado exitosamente',
      });

      onSuccess();
    } catch (error) {
      console.error('Error al actualizar recurso:', error);
      toast({
        title: 'Error',
        description: 'Error al actualizar el recurso',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Título *</label>
        <Input
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Descripción</label>
        <Textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Nombre del archivo *</label>
          <Input
            value={formData.fileName}
            onChange={(e) => setFormData({ ...formData, fileName: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">URL del archivo *</label>
          <Input
            value={formData.fileUrl}
            onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Tamaño (bytes)</label>
          <Input
            type="number"
            value={formData.fileSize}
            onChange={(e) => setFormData({ ...formData, fileSize: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Tipo MIME</label>
          <Input
            value={formData.fileType}
            onChange={(e) => setFormData({ ...formData, fileType: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Duración (segundos)</label>
          <Input
            type="number"
            value={formData.duration}
            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Categoría *</label>
          <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value as 'MULTIMEDIA_CENTER' | 'PUBLICATIONS', subcategory: 'none' })}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar categoría" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(categoryInfo).map(([key, info]) => (
                <SelectItem key={key} value={key}>{info.title}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Subcategoría</label>
          <Select value={formData.subcategory} onValueChange={(value) => setFormData({ ...formData, subcategory: value as any })}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar subcategoría" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Sin subcategoría</SelectItem>
              {formData.category && categoryInfo[formData.category as keyof typeof categoryInfo]?.subcategories ? (
                Object.entries(categoryInfo[formData.category as keyof typeof categoryInfo].subcategories).map(([key, info]) => (
                  <SelectItem key={key} value={key}>{info.title}</SelectItem>
                ))
              ) : !formData.category ? (
                <SelectItem value="select-category" disabled>
                  Selecciona una categoría primero
                </SelectItem>
              ) : null}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">URL de miniatura</label>
        <Input
          value={formData.thumbnailUrl}
          onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
        />
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="isActive"
            checked={formData.isActive}
            onCheckedChange={(checked) => setFormData({ ...formData, isActive: !!checked })}
          />
          <label htmlFor="isActive" className="text-sm font-medium">
            Activo
          </label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="isFeatured"
            checked={formData.isFeatured}
            onCheckedChange={(checked) => setFormData({ ...formData, isFeatured: !!checked })}
          />
          <label htmlFor="isFeatured" className="text-sm font-medium">
            Destacar recurso
          </label>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={loading}>
          {loading ? 'Actualizando...' : 'Actualizar Recurso'}
        </Button>
      </div>
    </form>
  );
};
