'use client'

import React, { useState, useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { useSession } from 'next-auth/react';
import { usePermissions } from '@/hooks/use-permissions';
import { Search, Plus } from 'lucide-react';
import { CreateProjectForm } from '@/components/admin/create-project-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProjectCardWrapper } from '@/components/admin/project-card-wrapper';

interface ProjectItem {
  id: string;
  title: string;
  executionStart: string;
  executionEnd: string;
  context: string;
  objectives: string;
  content: string;
  strategicAllies?: string;
  financing?: string;
  imageUrl?: string;
  imageAlt?: string;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  creator?: {
    name?: string;
    email: string;
  };
}

export const ProjectsManagement: React.FC = () => {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'title' | 'executionStart' | 'executionEnd' | 'createdAt'>('executionStart');
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

      const response = await fetch(`/api/projects?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Error al cargar proyectos');
      }
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error('Error al cargar proyectos:', error);
      toast({
        title: 'Error',
        description: 'Error al cargar los proyectos',
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

  const filteredProjects = projects;
  const activeProjects = projects.filter(item => item.isActive);
  const inactiveProjects = projects.filter(item => !item.isActive);

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
      const response = await fetch('/api/projects/bulk-toggle-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.customToken}`,
        },
        body: JSON.stringify({
          projectIds: selectedItems,
          isActive
        }),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar estado');
      }

      const result = await response.json();

      setProjects(prev => prev.map(item =>
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
        description: 'Error al cambiar el estado de los proyectos',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      // Verificar que tenemos un token válido
      if (!session?.customToken) {
        throw new Error('No hay token de autenticación disponible. Por favor, inicia sesión nuevamente.');
      }

      console.log('🗑️ Eliminando proyecto:', id);
      console.log('🎫 Token disponible:', session.customToken ? 'Sí' : 'No');
      
      const response = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.customToken}`,
        },
      });

      console.log('📊 Respuesta del servidor:', response.status, response.statusText);

      if (!response.ok) {
        let errorMessage = `Error al eliminar proyecto: ${response.status} ${response.statusText}`;
        
        try {
          const errorData = await response.json();
          console.log('🔍 Datos de error recibidos:', errorData);
          console.log('🔍 Tipo de datos:', typeof errorData);
          console.log('🔍 Claves del objeto:', Object.keys(errorData));
          console.log('🔍 JSON stringificado:', JSON.stringify(errorData));
          
          // Verificar si el objeto tiene contenido útil
          const hasError = errorData.error && errorData.error.trim() !== '';
          const hasMessage = errorData.message && errorData.message.trim() !== '';
          
          if (errorData && (hasError || hasMessage)) {
            errorMessage = errorData.error || errorData.message;
            // Solo mostrar en consola si no es un error conocido del servidor
            if (!errorMessage.includes('Proyecto no encontrado') && 
                !errorMessage.includes('No autorizado') &&
                !errorMessage.includes('Error interno del servidor')) {
              console.error('❌ Error del servidor:', errorMessage);
            } else {
              console.log('ℹ️ Error conocido del servidor:', errorMessage);
            }
          } else if (errorData && Object.keys(errorData).length === 0) {
            // Objeto vacío - no mostrar en consola para evitar ruido
            console.warn('⚠️ Respuesta del servidor vacía:', response.status, response.statusText);
          } else if (errorData && Object.keys(errorData).length > 0) {
            // Objeto con propiedades pero sin contenido útil - mostrar como warning
            console.warn('⚠️ Respuesta del servidor sin contenido útil:', response.status, response.statusText);
            console.warn('⚠️ Propiedades encontradas:', Object.keys(errorData));
          } else {
            console.error('❌ Error del servidor (sin detalles):', response.status, response.statusText);
          }
        } catch (parseError) {
          console.error('❌ Error del servidor (respuesta no válida):', response.status, response.statusText);
        }
        
        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log('✅ Proyecto eliminado exitosamente:', result);

      setProjects(prev => prev.filter(item => item.id !== id));
      toast({
        title: 'Éxito',
        description: 'Proyecto eliminado exitosamente',
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al eliminar el proyecto';
      
      // Solo mostrar en consola si no es un error conocido del servidor
      if (!errorMessage.includes('Proyecto no encontrado') && 
          !errorMessage.includes('Error al eliminar proyecto:')) {
        console.error('Error inesperado al eliminar proyecto:', error);
      }
      
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  const handleProjectUpdated = (updatedProject: ProjectItem) => {
    setProjects(prev => prev.map(item => 
      item.id === updatedProject.id ? updatedProject : item
    ));
  };

  const handleStatusChanged = (projectId: string, newStatus: boolean) => {
    setProjects(prev => prev.map(item =>
      item.id === projectId ? { ...item, isActive: newStatus } : item
    ));
  };

  const handleToggleFeatured = async (projectId: string, isFeatured: boolean) => {
    try {
      const response = await fetch(`/api/projects/${projectId}/toggle-featured`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isFeatured }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al cambiar estado destacado');
      }

      // Actualizar la lista local
      setProjects(prev => 
        prev.map(p => 
          p.id === projectId 
            ? { ...p, isFeatured }
            : p
        )
      );
    } catch (error) {
      console.error('Error toggling featured status:', error);
      throw error;
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
          <h1 className="text-3xl font-bold">Gestión de Proyectos</h1>
          <p className="text-muted-foreground">
            No tienes permisos para gestionar proyectos.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Proyectos</h1>
          <p className="text-muted-foreground">
            Administra los proyectos y actividades de la organización
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <CreateProjectForm onProjectCreated={fetchData} />
        </div>
      </div>

      {/* Filtros y búsqueda */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar por título, contexto u objetivos..."
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
              <SelectItem value="executionStart">Fecha inicio</SelectItem>
              <SelectItem value="executionEnd">Fecha fin</SelectItem>
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
            <TabsTrigger value="all">Todos ({filteredProjects.length})</TabsTrigger>
            <TabsTrigger value="active">Activos ({activeProjects.length})</TabsTrigger>
            <TabsTrigger value="inactive">Inactivos ({inactiveProjects.length})</TabsTrigger>
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
          <ProjectsList 
            projects={filteredProjects}
            loading={loading}
            selectedItems={selectedItems}
            onSelectItem={handleSelectItem}
            onClearSelection={handleClearSelection}
            onDelete={handleDelete}
            onProjectUpdated={handleProjectUpdated}
            onStatusChanged={handleStatusChanged}
            onToggleFeatured={handleToggleFeatured}
            getStatusBadgeVariant={getStatusBadgeVariant}
            formatDate={formatDate}
          />
        </TabsContent>

        <TabsContent value="active">
          <ProjectsList 
            projects={activeProjects}
            loading={loading}
            selectedItems={selectedItems}
            onSelectItem={handleSelectItem}
            onClearSelection={handleClearSelection}
            onDelete={handleDelete}
            onProjectUpdated={handleProjectUpdated}
            onStatusChanged={handleStatusChanged}
            onToggleFeatured={handleToggleFeatured}
            getStatusBadgeVariant={getStatusBadgeVariant}
            formatDate={formatDate}
          />
        </TabsContent>

        <TabsContent value="inactive">
          <ProjectsList 
            projects={inactiveProjects}
            loading={loading}
            selectedItems={selectedItems}
            onSelectItem={handleSelectItem}
            onClearSelection={handleClearSelection}
            onDelete={handleDelete}
            onProjectUpdated={handleProjectUpdated}
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

// Componente para mostrar la lista de proyectos
interface ProjectsListProps {
  projects: ProjectItem[];
  loading: boolean;
  selectedItems: string[];
  onSelectItem: (itemId: string) => void;
  onClearSelection: () => void;
  onDelete: (id: string) => void;
  onProjectUpdated: (updatedProject: ProjectItem) => void;
  onStatusChanged: (projectId: string, newStatus: boolean) => void;
  onToggleFeatured: (projectId: string, isFeatured: boolean) => Promise<void>;
  getStatusBadgeVariant: (isActive: boolean) => "default" | "secondary";
  formatDate: (dateString: string) => string;
}

function ProjectsList({
  projects,
  loading,
  selectedItems,
  onSelectItem,
  onClearSelection,
  onDelete,
  onProjectUpdated,
  onStatusChanged,
  onToggleFeatured,
  getStatusBadgeVariant,
  formatDate
}: ProjectsListProps) {
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

  if (projects.length === 0) {
    return (
      <div className="text-center py-12">
        <Plus className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No hay proyectos</h3>
        <p className="mt-1 text-sm text-gray-500">
          Comienza creando tu primer proyecto.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((item) => (
        <ProjectCardWrapper
          key={item.id}
          project={item}
          selectedItems={selectedItems}
          onSelectItem={onSelectItem}
          onProjectUpdated={onProjectUpdated}
          onStatusChanged={onStatusChanged}
          onDelete={onDelete}
          getStatusBadgeVariant={getStatusBadgeVariant}
          formatDate={formatDate}
        />
      ))}
    </div>
  );
}
