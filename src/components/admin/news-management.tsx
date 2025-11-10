'use client'

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { useSession } from 'next-auth/react';
import { usePermissions } from '@/hooks/use-permissions';
import { Eye, EyeOff, Search, RefreshCw, Plus } from 'lucide-react';
import { CreateNewsForm } from '@/components/admin/create-news-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { NewsCardWrapper } from '@/components/admin/news-card-wrapper';

interface NewsItem {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  imageAlt?: string;
  category: 'NOTICIAS' | 'FUNDRAISING' | 'COMPAÑIA' | 'SIN_CATEGORIA';
  isActive: boolean;
  isFeatured: boolean;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  author?: {
    name?: string;
    email: string;
  };
  programa?: {
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

export const NewsManagement: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'title' | 'publishedAt' | 'createdAt'>('publishedAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
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
      if (searchTerm) {
        params.append('search', searchTerm);
      }
      params.append('sortBy', sortBy);
      params.append('sortOrder', sortOrder);

      const response = await fetch(`/api/news?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Error al cargar noticias');
      }
      const data = await response.json();
      setNews(data);
    } catch (error) {
      console.error('Error al cargar noticias:', error);
      toast({
        title: 'Error',
        description: 'Error al cargar las noticias',
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
  }, [statusFilter, searchTerm, sortBy, sortOrder]);

  const filteredNews = news;
  const activeNews = news.filter(item => item.isActive);
  const inactiveNews = news.filter(item => !item.isActive);

  const handleSelectItem = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleClearSelection = () => {
    setSelectedItems([]);
  };

  const handleBulkToggleStatus = async (isActive: boolean) => {
    try {
      const response = await fetch('/api/news/bulk-toggle-status', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.customToken}`,
        },
        body: JSON.stringify({
          newsIds: selectedItems,
          isActive
        }),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar estado');
      }

      const result = await response.json();

      setNews(prev => prev.map(item =>
        selectedItems.includes(item.id)
          ? { ...item, isActive }
          : item
      ));

      setSelectedItems([]);

      toast({
        title: 'Éxito',
        description: result.message,
      });
    } catch (error) {
      console.error('Error al cambiar estado en lote:', error);
      toast({
        title: 'Error',
        description: 'Error al cambiar el estado de las noticias',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      // Debug: Verificar estado de la sesión
      console.log('🔍 Debug eliminación noticia:', {
        sessionExists: !!session,
        customTokenExists: !!session?.customToken,
        userId: session?.user?.id,
        userEmail: session?.user?.email,
        newsId: id
      });

      // Verificar que tenemos el token de sesión
      if (!session?.customToken) {
        console.error('❌ Token de sesión no encontrado');
        toast({
          title: 'Error de autenticación',
          description: 'No se encontró el token de sesión. Por favor, inicia sesión nuevamente.',
          variant: 'destructive',
        });
        return;
      }

      const response = await fetch(`/api/news/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.customToken}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Error al eliminar noticia');
      }

      setNews(prev => prev.filter(item => item.id !== id));
      toast({
        title: 'Éxito',
        description: 'Noticia eliminada exitosamente',
      });
    } catch (error) {
      console.error('Error al eliminar noticia:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Error al eliminar la noticia',
        variant: 'destructive',
      });
    }
  };

  const handleNewsDeleted = (newsId: string) => {
    // Solo actualizar el estado local, sin manejar errores
    setNews(prev => prev.filter(item => item.id !== newsId));
  };

  const handleNewsUpdated = (updatedNews: NewsItem) => {
    setNews(prev => prev.map(item => 
      item.id === updatedNews.id ? updatedNews : item
    ));
  };

  const handleStatusChanged = (newsId: string, newStatus: boolean) => {
    setNews(prev => prev.map(item =>
      item.id === newsId ? { ...item, isActive: newStatus } : item
    ));
  };

  const handleToggleFeatured = async (newsId: string, isFeatured: boolean) => {
    try {
      const response = await fetch(`/api/news/${newsId}/toggle-featured`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.customToken}`,
        },
        body: JSON.stringify({ isFeatured }),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar estado destacado');
      }

      setNews(prev => prev.map(item =>
        item.id === newsId ? { ...item, isFeatured } : item
      ));
    } catch (error) {
      console.error('Error al cambiar estado destacado:', error);
      toast({
        title: 'Error',
        description: 'Error al cambiar el estado destacado de la noticia',
        variant: 'destructive',
      });
    }
  };

  const getStatusBadgeVariant = (isActive: boolean) => {
    return isActive ? 'default' : 'secondary';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };


  if (!canManageContent()) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Noticias</h1>
          <p className="text-muted-foreground">
            No tienes permisos para gestionar noticias.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Noticias</h1>
          <p className="text-muted-foreground">
            Administra las noticias y artículos del blog
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <CreateNewsForm onNewsCreated={fetchData} />
          <Button variant="outline" size="sm" onClick={fetchData}>
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
              placeholder="Buscar por título o contenido..."
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
              <SelectItem value="publishedAt">Fecha publicación</SelectItem>
              <SelectItem value="createdAt">Fecha creación</SelectItem>
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

      {/* Pestañas */}
      <Tabs defaultValue="all" className="space-y-4">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="all">Todas ({filteredNews.length})</TabsTrigger>
            <TabsTrigger value="active">Activas ({activeNews.length})</TabsTrigger>
            <TabsTrigger value="inactive">Inactivas ({inactiveNews.length})</TabsTrigger>
          </TabsList>
          
          {/* Acciones en lote */}
          {selectedItems.length > 0 && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => handleBulkToggleStatus(true)}
              >
                Activar Seleccionados ({selectedItems.length})
              </Button>
              <Button
                variant="outline"
                onClick={() => handleBulkToggleStatus(false)}
              >
                Desactivar Seleccionados ({selectedItems.length})
              </Button>
              <Button
                variant="ghost"
                onClick={handleClearSelection}
                className="text-gray-600 hover:text-gray-800"
              >
                Limpiar Selección
              </Button>
            </div>
          )}
        </div>

        <TabsContent value="all">
          <NewsList 
            news={filteredNews}
            loading={loading}
            selectedItems={selectedItems}
            onSelectItem={handleSelectItem}
            onClearSelection={handleClearSelection}
            onNewsDeleted={handleNewsDeleted}
            onNewsUpdated={handleNewsUpdated}
            onStatusChanged={handleStatusChanged}
            onToggleFeatured={handleToggleFeatured}
            getStatusBadgeVariant={getStatusBadgeVariant}
            formatDate={formatDate}
          />
        </TabsContent>

        <TabsContent value="active">
          <NewsList 
            news={activeNews}
            loading={loading}
            selectedItems={selectedItems}
            onSelectItem={handleSelectItem}
            onClearSelection={handleClearSelection}
            onNewsDeleted={handleNewsDeleted}
            onNewsUpdated={handleNewsUpdated}
            onStatusChanged={handleStatusChanged}
            onToggleFeatured={handleToggleFeatured}
            getStatusBadgeVariant={getStatusBadgeVariant}
            formatDate={formatDate}
          />
        </TabsContent>

        <TabsContent value="inactive">
          <NewsList 
            news={inactiveNews}
            loading={loading}
            selectedItems={selectedItems}
            onSelectItem={handleSelectItem}
            onClearSelection={handleClearSelection}
            onNewsDeleted={handleNewsDeleted}
            onNewsUpdated={handleNewsUpdated}
            onStatusChanged={handleStatusChanged}
            onToggleFeatured={handleToggleFeatured}
            getStatusBadgeVariant={getStatusBadgeVariant}
            formatDate={formatDate}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Componente para mostrar la lista de noticias
interface NewsListProps {
  news: NewsItem[];
  loading: boolean;
  selectedItems: string[];
  onSelectItem: (itemId: string) => void;
  onClearSelection: () => void;
  onNewsDeleted: (newsId: string) => void;
  onNewsUpdated: (updatedNews: NewsItem) => void;
  onStatusChanged: (newsId: string, newStatus: boolean) => void;
  onToggleFeatured: (newsId: string, isFeatured: boolean) => Promise<void>;
  getStatusBadgeVariant: (isActive: boolean) => "default" | "secondary";
  formatDate: (dateString: string) => string;
}

function NewsList({
  news,
  loading,
  selectedItems,
  onSelectItem,
  onClearSelection,
  onNewsDeleted,
  onNewsUpdated,
  onStatusChanged,
  onToggleFeatured,
  getStatusBadgeVariant,
  formatDate
}: NewsListProps) {
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
    );
  }

  if (news.length === 0) {
    return (
      <div className="text-center py-12">
        <Plus className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No hay noticias</h3>
        <p className="mt-1 text-sm text-gray-500">
          Comienza creando tu primera noticia.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {news.map((item) => (
        <NewsCardWrapper
          key={item.id}
          news={item}
          selectedItems={selectedItems}
          onSelectItem={onSelectItem}
          onNewsUpdated={onNewsUpdated}
          onStatusChanged={onStatusChanged}
          onDelete={onNewsDeleted}
          getStatusBadgeVariant={getStatusBadgeVariant}
          formatDate={formatDate}
        />
      ))}
    </div>
  );
}

