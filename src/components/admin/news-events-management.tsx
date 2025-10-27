'use client';

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
import { Edit, Trash2, Eye, EyeOff, Calendar, User } from 'lucide-react';
import Image from 'next/image';

interface NewsItem {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  imageUrl?: string;
  imageAlt?: string;
  isActive: boolean;
  isFeatured: boolean;
  publishedAt: string;
  author?: {
    name?: string;
    email: string;
  };
}

interface EventItem {
  id: string;
  title: string;
  description: string;
  content?: string;
  imageUrl?: string;
  imageAlt?: string;
  eventDate: string;
  location?: string;
  isActive: boolean;
  isFeatured: boolean;
  organizer?: {
    name?: string;
    email: string;
  };
}


interface NewsEventsManagementProps {
  defaultTab?: 'news' | 'events';
}

export const NewsEventsManagement: React.FC<NewsEventsManagementProps> = ({ defaultTab = 'news' }) => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'news' | 'events'>(defaultTab);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<NewsItem | EventItem | null>(null);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const { toast } = useToast();
  const { data: session } = useSession();
  const { isAdmin, canManageContent } = usePermissions();

  // Form states
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    imageUrl: '',
    imageAlt: '',
    isFeatured: false,
    isActive: true,
    // Event specific
    description: '',
    eventDate: '',
    location: '',
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [newsResponse, eventsResponse] = await Promise.all([
        fetch('/api/news'),
        fetch('/api/events'),
      ]);

      if (newsResponse.ok) {
        const newsData = await newsResponse.json();
        setNews(newsData);
      }

      if (eventsResponse.ok) {
        const eventsData = await eventsResponse.json();
        setEvents(eventsData);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Error al cargar los datos',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      excerpt: '',
      imageUrl: '',
      imageAlt: '',
      isFeatured: false,
      isActive: true,
      description: '',
      eventDate: '',
      location: '',
    });
  };

  const handleCreate = async () => {
    try {
      const url = activeTab === 'news' ? '/api/news' : '/api/events';
      const payload = activeTab === 'news' 
        ? {
            title: formData.title,
            content: formData.content,
            excerpt: formData.excerpt,
            imageUrl: formData.imageUrl,
            imageAlt: formData.imageAlt,
            isFeatured: formData.isFeatured,
          }
        : {
            title: formData.title,
            description: formData.description,
            imageUrl: formData.imageUrl,
            imageAlt: formData.imageAlt,
            eventDate: formData.eventDate,
            location: formData.location,
            isFeatured: formData.isFeatured,
          };

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast({
          title: 'Éxito',
          description: `${activeTab === 'news' ? 'Noticia' : 'Evento'} creado exitosamente`,
        });
        setIsCreateDialogOpen(false);
        resetForm();
        fetchData();
      } else {
        throw new Error('Error al crear');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Error al crear el elemento',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = async () => {
    if (!editingItem) return;

    try {
      const url = activeTab === 'news' ? `/api/news/${editingItem.id}` : `/api/events/${editingItem.id}`;
      const payload = activeTab === 'news' 
        ? {
            title: formData.title,
            content: formData.content,
            excerpt: formData.excerpt,
            imageUrl: formData.imageUrl,
            imageAlt: formData.imageAlt,
            isFeatured: formData.isFeatured,
            isActive: formData.isActive,
          }
        : {
            title: formData.title,
            description: formData.description,
            imageUrl: formData.imageUrl,
            imageAlt: formData.imageAlt,
            eventDate: formData.eventDate,
            location: formData.location,
            isFeatured: formData.isFeatured,
            isActive: formData.isActive,
          };

      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast({
          title: 'Éxito',
          description: `${activeTab === 'news' ? 'Noticia' : 'Evento'} actualizado exitosamente`,
        });
        setIsEditDialogOpen(false);
        setEditingItem(null);
        resetForm();
        fetchData();
      } else {
        throw new Error('Error al actualizar');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Error al actualizar el elemento',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este elemento?')) return;

    try {
      const url = activeTab === 'news' ? `/api/news/${id}` : `/api/events/${id}`;
      const response = await fetch(url, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast({
          title: 'Éxito',
          description: `${activeTab === 'news' ? 'Noticia' : 'Evento'} eliminado exitosamente`,
        });
        fetchData();
      } else {
        throw new Error('Error al eliminar');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Error al eliminar el elemento',
        variant: 'destructive',
      });
    }
  };

  const handleSelectItem = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleSelectAll = () => {
    const currentItems = activeTab === 'news' ? news : events;
    if (selectedItems.length === currentItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(currentItems.map(item => item.id));
    }
  };

  const getStatusBadgeVariant = (isActive: boolean) => {
    return isActive ? 'default' : 'secondary';
  };

  const handleBulkToggleStatus = async (isActive: boolean) => {
    try {
      const endpoint = activeTab === 'news' 
        ? '/api/news/bulk-toggle-status' 
        : '/api/events/bulk-toggle-status';
      
      const body = activeTab === 'news' 
        ? { newsIds: selectedItems, isActive }
        : { eventIds: selectedItems, isActive };

      const response = await fetch(endpoint, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar estado');
      }

      const result = await response.json();
      
      // Actualizar el estado local
      if (activeTab === 'news') {
        setNews(prev => prev.map(item => 
          selectedItems.includes(item.id)
            ? { ...item, isActive }
            : item
        ));
      } else {
        setEvents(prev => prev.map(item => 
          selectedItems.includes(item.id)
            ? { ...item, isActive }
            : item
        ));
      }

      setSelectedItems([]);
      
      toast({
        title: 'Éxito',
        description: result.message,
      });
    } catch (error) {
      console.error('Error al cambiar estado en lote:', error);
      toast({
        title: 'Error',
        description: 'Error al cambiar el estado de los elementos',
        variant: 'destructive',
      });
    }
  };

  const openEditDialog = (item: NewsItem | EventItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      content: 'content' in item ? item.content || '' : '',
      excerpt: 'excerpt' in item ? item.excerpt || '' : '',
      description: 'description' in item ? item.description : '',
      imageUrl: item.imageUrl || '',
      imageAlt: item.imageAlt || '',
      isFeatured: item.isFeatured,
      isActive: item.isActive,
      eventDate: 'eventDate' in item ? item.eventDate.split('T')[0] : '',
      location: 'location' in item ? item.location || '' : '',
    });
    setIsEditDialogOpen(true);
  };

  // Verificar permisos
  if (!canManageContent) {
    return (
      <div className="p-6">
        <Card className="p-8 text-center">
          <div className="text-red-500 mb-4">
            <span className="material-symbols-outlined text-6xl">block</span>
          </div>
          <h2 className="text-2xl font-bold mb-2">Acceso Denegado</h2>
          <p className="text-muted-foreground">
            No tienes permisos para gestionar noticias y eventos.
          </p>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <span className="material-symbols-outlined text-4xl text-primary mb-2">loading</span>
            <p>Cargando...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-text-light dark:text-text-dark font-condensed">
          Gestión de Noticias y Eventos
        </h1>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <span className="material-symbols-outlined mr-2">add</span>
              Crear {activeTab === 'news' ? 'Noticia' : 'Evento'}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Crear {activeTab === 'news' ? 'Noticia' : 'Evento'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Título</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ingresa el título"
                />
              </div>
              
              {activeTab === 'news' ? (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-2">Contenido</label>
                    <Textarea
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      placeholder="Contenido de la noticia"
                      rows={6}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Resumen</label>
                    <Textarea
                      value={formData.excerpt}
                      onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                      placeholder="Resumen breve"
                      rows={3}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-2">Descripción</label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Descripción del evento"
                      rows={4}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Fecha del evento</label>
                      <Input
                        type="date"
                        value={formData.eventDate}
                        onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Ubicación</label>
                      <Input
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        placeholder="Ubicación del evento"
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">URL de imagen</label>
                  <Input
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="URL de la imagen"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Texto alternativo</label>
                  <Input
                    value={formData.imageAlt}
                    onChange={(e) => setFormData({ ...formData, imageAlt: e.target.value })}
                    placeholder="Texto alternativo"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="mr-2"
                  />
                  Destacado
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="mr-2"
                  />
                  Activo
                </label>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleCreate}>
                  Crear
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tabs */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-1">
          <Button
            variant={activeTab === 'news' ? 'default' : 'outline'}
            onClick={() => setActiveTab('news')}
          >
            Noticias ({news.length})
          </Button>
          <Button
            variant={activeTab === 'events' ? 'default' : 'outline'}
            onClick={() => setActiveTab('events')}
          >
            Eventos ({events.length})
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSelectAll}
            disabled={loading}
          >
            {selectedItems.length === (activeTab === 'news' ? news : events).length ? 'Deseleccionar todos' : 'Seleccionar todos'}
          </Button>
          <Button
            variant="default"
            onClick={() => setIsCreateDialogOpen(true)}
            disabled={loading}
          >
            <span className="material-symbols-outlined mr-2">add</span>
            Crear {activeTab === 'news' ? 'Noticia' : 'Evento'}
          </Button>
        </div>
      </div>

      {/* Acciones en lote */}
      {selectedItems.length > 0 && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-blue-900">
              {selectedItems.length} {activeTab === 'news' ? 'noticia(s)' : 'evento(s)'} seleccionado(s)
            </span>
            <div className="flex items-center space-x-2">
              <Button size="sm" variant="outline" onClick={() => handleBulkToggleStatus(true)}>
                <Eye className="mr-1 h-3 w-3" />
                Activar
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleBulkToggleStatus(false)}>
                <EyeOff className="mr-1 h-3 w-3" />
                Desactivar
              </Button>
              <Button size="sm" variant="outline" onClick={() => setSelectedItems([])}>
                Limpiar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(activeTab === 'news' ? news : events).map((item) => (
          <Card key={item.id} className="overflow-hidden">
            <div className="relative h-48">
              {item.imageUrl ? (
                <Image
                  src={item.imageUrl}
                  alt={item.imageAlt || item.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <span className="text-gray-400">Sin imagen</span>
                </div>
              )}
              <div className="absolute top-2 right-2">
                <Checkbox
                  checked={selectedItems.includes(item.id)}
                  onCheckedChange={() => handleSelectItem(item.id)}
                />
              </div>
            </div>
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold line-clamp-1">{item.title}</h3>
                <div className="flex gap-1">
                  <Badge variant={getStatusBadgeVariant(item.isActive)}>
                    {item.isActive ? 'Activo' : 'Inactivo'}
                  </Badge>
                  {item.isFeatured && (
                    <Badge className="bg-yellow-400 text-black">Destacado</Badge>
                  )}
                </div>
              </div>
              <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                {'excerpt' in item ? item.excerpt : 'description' in item ? item.description : ''}
              </p>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {activeTab === 'news' 
                    ? new Date((item as NewsItem).publishedAt).toLocaleDateString('es-ES')
                    : new Date((item as EventItem).eventDate).toLocaleDateString('es-ES')
                  }
                </div>
                {(activeTab === 'news' ? (item as NewsItem).author : (item as EventItem).organizer) && (
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {activeTab === 'news' 
                      ? (item as NewsItem).author?.name
                      : (item as EventItem).organizer?.name
                    }
                  </div>
                )}
              </div>
              <div className="flex items-center justify-end gap-2 mt-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => openEditDialog(item)}
                  title="Editar"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(item.id)}
                  className="text-destructive"
                  title="Eliminar"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar {activeTab === 'news' ? 'Noticia' : 'Evento'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Título</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Ingresa el título"
              />
            </div>
            
            {activeTab === 'news' ? (
              <>
                <div>
                  <label className="block text-sm font-medium mb-2">Contenido</label>
                  <Textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Contenido de la noticia"
                    rows={6}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Resumen</label>
                  <Textarea
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    placeholder="Resumen breve"
                    rows={3}
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium mb-2">Descripción</label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Descripción del evento"
                    rows={4}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Fecha del evento</label>
                    <Input
                      type="date"
                      value={formData.eventDate}
                      onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Ubicación</label>
                    <Input
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="Ubicación del evento"
                    />
                  </div>
                </div>
              </>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">URL de imagen</label>
                <Input
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="URL de la imagen"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Texto alternativo</label>
                <Input
                  value={formData.imageAlt}
                  onChange={(e) => setFormData({ ...formData, imageAlt: e.target.value })}
                  placeholder="Texto alternativo"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  className="mr-2"
                />
                Destacado
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="mr-2"
                />
                Activo
              </label>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleEdit}>
                Actualizar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
