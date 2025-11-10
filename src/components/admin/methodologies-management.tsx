'use client'

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Plus, 
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import { CreateMethodologyForm } from './create-methodology-form';
import { EditMethodologyForm } from './edit-methodology-form';
import { MethodologyCardWrapper } from './methodology-card-wrapper';

interface Methodology {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  imageUrl?: string;
  imageAlt?: string;
  ageGroup: string;
  sectors: string[]; // Puede venir en formato enum (HEALTH, EDUCATION) o español (SALUD, EDUCACION)
  targetAudience: string;
  objectives: string;
  implementation: string;
  results: string;
  methodology?: string;
  resources?: string;
  evaluation?: string;
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

type ViewMode = 'list' | 'create' | 'edit';
type FilterStatus = 'all' | 'active' | 'inactive';
type FilterCategory = 'all' | 'SALUD' | 'EDUCACION' | 'MEDIOS_DE_VIDA' | 'PROTECCION' | 'SOSTENIBILIDAD' | 'DESARROLLO_INFANTIL_TEMPRANO' | 'NINEZ_EN_CRISIS';

export function MethodologiesManagement() {
  const { data: session } = useSession();
  const [methodologies, setMethodologies] = useState<Methodology[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [editingMethodology, setEditingMethodology] = useState<Methodology | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  const [categoryFilter, setCategoryFilter] = useState<FilterCategory>('all');
  const [selectedMethodologies, setSelectedMethodologies] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'title' | 'createdAt' | 'updatedAt'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Función para convertir sectores del formato enum al formato español
  const mapSectorsToSpanish = (sectors: string[]): ('SALUD' | 'EDUCACION' | 'MEDIOS_DE_VIDA' | 'PROTECCION' | 'SOSTENIBILIDAD' | 'DESARROLLO_INFANTIL_TEMPRANO' | 'NINEZ_EN_CRISIS')[] => {
    const enumToSpanishMap: Record<string, 'SALUD' | 'EDUCACION' | 'MEDIOS_DE_VIDA' | 'PROTECCION' | 'SOSTENIBILIDAD' | 'DESARROLLO_INFANTIL_TEMPRANO' | 'NINEZ_EN_CRISIS'> = {
      'HEALTH': 'SALUD',
      'EDUCATION': 'EDUCACION',
      'LIVELIHOODS': 'MEDIOS_DE_VIDA',
      'PROTECTION': 'PROTECCION',
      'SUSTAINABILITY': 'SOSTENIBILIDAD',
      'EARLY_CHILD_DEVELOPMENT': 'DESARROLLO_INFANTIL_TEMPRANO',
      'CHILDREN_IN_CRISIS': 'NINEZ_EN_CRISIS',
    };
    const validSpanishSectors = ['SALUD', 'EDUCACION', 'MEDIOS_DE_VIDA', 'PROTECCION', 'SOSTENIBILIDAD', 'DESARROLLO_INFANTIL_TEMPRANO', 'NINEZ_EN_CRISIS'] as const;
    type SpanishSector = typeof validSpanishSectors[number];
    
    return sectors
      .map((sector): SpanishSector | undefined => {
        if (validSpanishSectors.includes(sector as SpanishSector)) {
          return sector as SpanishSector;
        }
        return enumToSpanishMap[sector];
      })
      .filter((sector): sector is SpanishSector => sector !== undefined);
  };

  // Función para convertir sectores del formato español al formato enum
  const mapSectorsToEnum = (sectors: ('SALUD' | 'EDUCACION' | 'MEDIOS_DE_VIDA' | 'PROTECCION' | 'SOSTENIBILIDAD' | 'DESARROLLO_INFANTIL_TEMPRANO' | 'NINEZ_EN_CRISIS')[]): string[] => {
    const spanishToEnumMap: Record<string, string> = {
      'SALUD': 'HEALTH',
      'EDUCACION': 'EDUCATION',
      'MEDIOS_DE_VIDA': 'LIVELIHOODS',
      'PROTECCION': 'PROTECTION',
      'SOSTENIBILIDAD': 'SUSTAINABILITY',
      'DESARROLLO_INFANTIL_TEMPRANO': 'EARLY_CHILD_DEVELOPMENT',
      'NINEZ_EN_CRISIS': 'CHILDREN_IN_CRISIS',
    };
    const validEnums = ['HEALTH', 'EDUCATION', 'LIVELIHOODS', 'PROTECTION', 'SUSTAINABILITY', 'EARLY_CHILD_DEVELOPMENT', 'CHILDREN_IN_CRISIS'];
    
    return sectors
      .map(sector => {
        // Si ya está en formato enum, mantenerlo
        if (validEnums.includes(sector)) {
          return sector;
        }
        // Si está en formato español, mapearlo al enum
        return spanishToEnumMap[sector] || sector;
      })
      .filter(s => s !== undefined) as string[];
  };

  // Función para convertir un Methodology al formato esperado por MethodologyCardWrapper
  const convertMethodologyForCard = (methodology: Methodology) => {
    return {
      ...methodology,
      sectors: mapSectorsToSpanish(methodology.sectors || []),
    };
  };

  // Función para convertir un Methodology del formato del card al formato interno
  const convertMethodologyFromCard = (methodology: { sectors: ('SALUD' | 'EDUCACION' | 'MEDIOS_DE_VIDA' | 'PROTECCION' | 'SOSTENIBILIDAD' | 'DESARROLLO_INFANTIL_TEMPRANO' | 'NINEZ_EN_CRISIS')[] } & Omit<Methodology, 'sectors'>): Methodology => {
    return {
      ...methodology,
      sectors: mapSectorsToEnum(methodology.sectors),
    };
  };

  const fetchMethodologies = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/methodologies');
      if (!response.ok) {
        throw new Error('Error al cargar iniciativas');
      }
      const data = await response.json();
      // Manejar la estructura de respuesta del API
      if (data.methodologies && Array.isArray(data.methodologies)) {
        setMethodologies(data.methodologies);
      } else if (Array.isArray(data)) {
        setMethodologies(data);
      } else {
        setMethodologies([]);
      }
    } catch (error) {
      console.error('Error fetching methodologies:', error);
      toast.error('Error al cargar iniciativas');
      setMethodologies([]); // Asegurar array vacío en caso de error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMethodologies();
  }, []);

  const handleCreateSuccess = () => {
    setViewMode('list');
    fetchMethodologies();
  };

  const handleEditSuccess = () => {
    setViewMode('list');
    setEditingMethodology(null);
    fetchMethodologies();
  };

  const handleCancel = () => {
    setViewMode('list');
    setEditingMethodology(null);
  };

  const handleBulkStatusToggle = async (isActive: boolean) => {
    if (selectedMethodologies.length === 0) {
      toast.error('Selecciona al menos una iniciativa');
      return;
    }

    if (!session?.customToken) {
      toast.error('No estás autenticado. Por favor inicia sesión.');
      return;
    }

    try {
      const response = await fetch('/api/methodologies/bulk-toggle-status', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.customToken}`,
        },
        body: JSON.stringify({
          methodologyIds: selectedMethodologies,
          isActive
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al cambiar estado de las iniciativas');
      }

      toast.success(
        `${selectedMethodologies.length} iniciativa(s) ${isActive ? 'activada(s)' : 'desactivada(s)'} exitosamente`
      );
      setSelectedMethodologies([]);
      fetchMethodologies();
    } catch (error) {
      console.error('Error bulk toggling methodologies:', error);
      toast.error(error instanceof Error ? error.message : 'Error al cambiar estado de las iniciativas');
    }
  };

  const handleToggleFeatured = async (methodologyId: string, isFeatured: boolean) => {
    if (!session?.customToken) {
      toast.error('No estás autenticado. Por favor inicia sesión.');
      return;
    }

    try {
      const response = await fetch(`/api/methodologies/${methodologyId}/toggle-featured`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.customToken}`,
        },
        body: JSON.stringify({ isFeatured }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al cambiar estado destacado');
      }

      // Actualizar la lista local
      setMethodologies(prev => 
        prev.map(m => 
          m.id === methodologyId 
            ? { ...m, isFeatured }
            : m
        )
      );
    } catch (error) {
      console.error('Error toggling featured status:', error);
      throw error;
    }
  };

  const handleMethodologyUpdated = (updatedMethodology: Methodology) => {
    setMethodologies(prev => 
      prev.map(m => m.id === updatedMethodology.id ? updatedMethodology : m)
    );
  };

  // Wrapper para convertir el methodology del formato del card al formato interno
  const handleMethodologyUpdatedWrapper = (updatedMethodology: { sectors: ('SALUD' | 'EDUCACION' | 'MEDIOS_DE_VIDA' | 'PROTECCION' | 'SOSTENIBILIDAD' | 'DESARROLLO_INFANTIL_TEMPRANO' | 'NINEZ_EN_CRISIS')[] } & Omit<Methodology, 'sectors'>) => {
    handleMethodologyUpdated(convertMethodologyFromCard(updatedMethodology));
  };

  const handleStatusChanged = (methodologyId: string, newStatus: boolean) => {
    setMethodologies(prev => 
      prev.map(m => m.id === methodologyId ? { ...m, isActive: newStatus } : m)
    );
  };

  const handleMethodologyDeleted = (methodologyId: string) => {
    setMethodologies(prev => prev.filter(m => m.id !== methodologyId));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadgeVariant = (isActive: boolean) => {
    return isActive ? 'default' : 'secondary';
  };

  const handleSelectMethodology = (methodologyId: string) => {
    setSelectedMethodologies(prev => 
      prev.includes(methodologyId) 
        ? prev.filter(id => id !== methodologyId)
        : [...prev, methodologyId]
    );
  };

  const handleClearSelection = () => {
    setSelectedMethodologies([]);
    toast.info('Selección limpiada');
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'EDUCACION':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'SALUD':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'SOCIAL':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'AMBIENTAL':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  // Mapeo de sectores enum a español para comparación
  const sectorMap: Record<string, string> = {
    'HEALTH': 'SALUD',
    'EDUCATION': 'EDUCACION',
    'LIVELIHOODS': 'MEDIOS_DE_VIDA',
    'PROTECTION': 'PROTECCION',
    'SUSTAINABILITY': 'SOSTENIBILIDAD',
    'EARLY_CHILD_DEVELOPMENT': 'DESARROLLO_INFANTIL_TEMPRANO',
    'CHILDREN_IN_CRISIS': 'NINEZ_EN_CRISIS',
  };

  const filteredMethodologies = (Array.isArray(methodologies) ? methodologies : []).filter(methodology => {
    const matchesSearch = methodology.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         methodology.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         methodology.ageGroup.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         methodology.targetAudience.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && methodology.isActive) ||
                         (statusFilter === 'inactive' && !methodology.isActive);
    
    // Normalizar sectores para comparación
    const normalizedSectors = (methodology.sectors || []).map(sector => {
      // Si viene en formato enum, mapearlo a español
      return sectorMap[sector] || sector;
    });
    
    const matchesCategory = categoryFilter === 'all' || 
                           normalizedSectors.includes(categoryFilter);
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Ordenar metodologías
  const sortedMethodologies = [...filteredMethodologies].sort((a, b) => {
    let comparison = 0;
    if (sortBy === 'title') {
      comparison = a.title.localeCompare(b.title);
    } else if (sortBy === 'createdAt') {
      comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    } else if (sortBy === 'updatedAt') {
      comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
    }
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const activeMethodologies = sortedMethodologies.filter(m => m.isActive);
  const inactiveMethodologies = sortedMethodologies.filter(m => !m.isActive);

  if (viewMode === 'create') {
    return <CreateMethodologyForm onSuccess={handleCreateSuccess} onCancel={handleCancel} />;
  }

  if (viewMode === 'edit' && editingMethodology) {
    return <EditMethodologyForm methodology={editingMethodology} onSuccess={handleEditSuccess} onCancel={handleCancel} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Iniciativas</h1>
          <p className="text-muted-foreground">
            Administra las iniciativas innovadoras del sistema
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={() => setViewMode('create')}>
            <Plus className="h-4 w-4 mr-2" />
            Nueva Iniciativa
          </Button>
        </div>
      </div>

      {/* Filtros y búsqueda */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar por título, descripción, grupo de edad o público objetivo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as FilterStatus)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="active">Activos</SelectItem>
              <SelectItem value="inactive">Inactivos</SelectItem>
            </SelectContent>
          </Select>
          <Select value={categoryFilter} onValueChange={(value) => setCategoryFilter(value as FilterCategory)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sector Programático" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los Sectores</SelectItem>
              <SelectItem value="SALUD">Salud</SelectItem>
              <SelectItem value="EDUCACION">Educación</SelectItem>
              <SelectItem value="MEDIOS_DE_VIDA">Medios de Vida</SelectItem>
              <SelectItem value="PROTECCION">Protección</SelectItem>
              <SelectItem value="SOSTENIBILIDAD">Sostenibilidad</SelectItem>
              <SelectItem value="DESARROLLO_INFANTIL_TEMPRANO">Desarrollo Infantil Temprano</SelectItem>
              <SelectItem value="NINEZ_EN_CRISIS">Niñez en Crisis</SelectItem>
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

      {/* Pestañas */}
      <Tabs defaultValue="all" className="space-y-4">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="all">Todos ({sortedMethodologies.length})</TabsTrigger>
            <TabsTrigger value="active">Activos ({activeMethodologies.length})</TabsTrigger>
            <TabsTrigger value="inactive">Inactivos ({inactiveMethodologies.length})</TabsTrigger>
          </TabsList>
          
          {/* Acciones en lote */}
          {selectedMethodologies.length > 0 && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => handleBulkStatusToggle(true)}
              >
                Activar Seleccionados ({selectedMethodologies.length})
              </Button>
              <Button
                variant="outline"
                onClick={() => handleBulkStatusToggle(false)}
              >
                Desactivar Seleccionados ({selectedMethodologies.length})
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
          <div className="space-y-4">
            <div className="flex items-center justify-end space-x-2">
              <Checkbox
                checked={selectedMethodologies.length === sortedMethodologies.length && sortedMethodologies.length > 0}
                onCheckedChange={() => {
                  if (selectedMethodologies.length === sortedMethodologies.length) {
                    setSelectedMethodologies([]);
                  } else {
                    setSelectedMethodologies(sortedMethodologies.map(m => m.id));
                  }
                }}
              />
              <span className="text-sm text-muted-foreground">Seleccionar todos</span>
            </div>
            {loading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg">
                    <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
                    <div className="space-y-2 flex-1">
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-1/4" />
                      <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : sortedMethodologies.length === 0 ? (
              <div className="text-center py-8">
                <Search className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-2 text-sm font-medium">No se encontraron iniciativas</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Intenta ajustar los filtros de búsqueda.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedMethodologies.map((methodology) => (
                  <MethodologyCardWrapper
                    key={methodology.id}
                    methodology={convertMethodologyForCard(methodology)}
                    selectedItems={selectedMethodologies}
                    onSelectItem={handleSelectMethodology}
                    onMethodologyUpdated={handleMethodologyUpdatedWrapper}
                    onStatusChanged={handleStatusChanged}
                    onDelete={handleMethodologyDeleted}
                    getStatusBadgeVariant={getStatusBadgeVariant}
                    formatDate={formatDate}
                  />
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="active">
          <div className="space-y-4">
            <div className="flex items-center justify-end space-x-2">
              <Checkbox
                checked={selectedMethodologies.length === activeMethodologies.length && activeMethodologies.length > 0}
                onCheckedChange={() => {
                  if (selectedMethodologies.length === activeMethodologies.length) {
                    setSelectedMethodologies([]);
                  } else {
                    setSelectedMethodologies(activeMethodologies.map(m => m.id));
                  }
                }}
              />
              <span className="text-sm text-muted-foreground">Seleccionar todos</span>
            </div>
            {loading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg">
                    <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
                    <div className="space-y-2 flex-1">
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-1/4" />
                      <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : activeMethodologies.length === 0 ? (
              <div className="text-center py-8">
                <Search className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-2 text-sm font-medium">No se encontraron iniciativas activas</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Intenta ajustar los filtros de búsqueda.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeMethodologies.map((methodology) => (
                  <MethodologyCardWrapper
                    key={methodology.id}
                    methodology={convertMethodologyForCard(methodology)}
                    selectedItems={selectedMethodologies}
                    onSelectItem={handleSelectMethodology}
                    onMethodologyUpdated={handleMethodologyUpdatedWrapper}
                    onStatusChanged={handleStatusChanged}
                    onDelete={handleMethodologyDeleted}
                    getStatusBadgeVariant={getStatusBadgeVariant}
                    formatDate={formatDate}
                  />
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="inactive">
          <div className="space-y-4">
            <div className="flex items-center justify-end space-x-2">
              <Checkbox
                checked={selectedMethodologies.length === inactiveMethodologies.length && inactiveMethodologies.length > 0}
                onCheckedChange={() => {
                  if (selectedMethodologies.length === inactiveMethodologies.length) {
                    setSelectedMethodologies([]);
                  } else {
                    setSelectedMethodologies(inactiveMethodologies.map(m => m.id));
                  }
                }}
              />
              <span className="text-sm text-muted-foreground">Seleccionar todos</span>
            </div>
            {loading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg">
                    <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
                    <div className="space-y-2 flex-1">
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-1/4" />
                      <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : inactiveMethodologies.length === 0 ? (
              <div className="text-center py-8">
                <Search className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-2 text-sm font-medium">No se encontraron iniciativas inactivas</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Intenta ajustar los filtros de búsqueda.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {inactiveMethodologies.map((methodology) => (
                  <MethodologyCardWrapper
                    key={methodology.id}
                    methodology={convertMethodologyForCard(methodology)}
                    selectedItems={selectedMethodologies}
                    onSelectItem={handleSelectMethodology}
                    onMethodologyUpdated={handleMethodologyUpdatedWrapper}
                    onStatusChanged={handleStatusChanged}
                    onDelete={handleMethodologyDeleted}
                    getStatusBadgeVariant={getStatusBadgeVariant}
                    formatDate={formatDate}
                  />
                ))}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
