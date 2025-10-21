'use client'

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Search, 
  Plus, 
  Filter,
  Loader2,
  Power,
  PowerOff
} from 'lucide-react';
import { toast } from 'sonner';
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
  sectors: ('SALUD' | 'EDUCACION' | 'MEDIOS_DE_VIDA' | 'PROTECCION' | 'SOSTENIBILIDAD' | 'DESARROLLO_INFANTIL_TEMPRANO' | 'NINEZ_EN_CRISIS')[];
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
type FilterCategory = 'all' | 'EDUCACION' | 'SALUD' | 'SOCIAL' | 'AMBIENTAL';

export function MethodologiesManagement() {
  const [methodologies, setMethodologies] = useState<Methodology[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [editingMethodology, setEditingMethodology] = useState<Methodology | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  const [categoryFilter, setCategoryFilter] = useState<FilterCategory>('all');
  const [selectedMethodologies, setSelectedMethodologies] = useState<string[]>([]);

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

    try {
      const response = await fetch('/api/methodologies/bulk-toggle-status', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
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
    try {
      const response = await fetch(`/api/methodologies/${methodologyId}/toggle-featured`, {
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

  const handleSelectAll = () => {
    if (selectedMethodologies.length === filteredMethodologies.length) {
      setSelectedMethodologies([]);
    } else {
      setSelectedMethodologies(filteredMethodologies.map(m => m.id));
    }
  };

  const handleSelectMethodology = (methodologyId: string) => {
    setSelectedMethodologies(prev => 
      prev.includes(methodologyId) 
        ? prev.filter(id => id !== methodologyId)
        : [...prev, methodologyId]
    );
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

  const filteredMethodologies = (Array.isArray(methodologies) ? methodologies : []).filter(methodology => {
    const matchesSearch = methodology.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         methodology.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         methodology.ageGroup.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         methodology.targetAudience.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && methodology.isActive) ||
                         (statusFilter === 'inactive' && !methodology.isActive);
    
    const matchesCategory = categoryFilter === 'all' || methodology.sectors.includes(categoryFilter as any);
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  if (viewMode === 'create') {
    return <CreateMethodologyForm onSuccess={handleCreateSuccess} onCancel={handleCancel} />;
  }

  if (viewMode === 'edit' && editingMethodology) {
    return <EditMethodologyForm methodology={editingMethodology} onSuccess={handleEditSuccess} onCancel={handleCancel} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Iniciativas</h1>
          <p className="text-muted-foreground">
            Administra las iniciativas innovadoras del sistema
          </p>
        </div>
        <Button onClick={() => setViewMode('create')}>
          <Plus className="h-4 w-4 mr-2" />
          Nueva Iniciativa
        </Button>
      </div>

      {/* Filtros y Búsqueda */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros y Búsqueda
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar por título, descripción, grupo de edad o público objetivo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as FilterStatus)}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="active">Activas</SelectItem>
                <SelectItem value="inactive">Inactivas</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={(value) => setCategoryFilter(value as FilterCategory)}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las categorías</SelectItem>
                <SelectItem value="EDUCACION">Educación</SelectItem>
                <SelectItem value="SALUD">Salud</SelectItem>
                <SelectItem value="SOCIAL">Social</SelectItem>
                <SelectItem value="AMBIENTAL">Ambiental</SelectItem>
              </SelectContent>
            </Select>
          </div>

        </CardContent>
      </Card>

        {/* Lista de Iniciativas */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <Filter className="mr-2 h-4 w-4" />
                Iniciativas ({filteredMethodologies.length})
              </CardTitle>
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={selectedMethodologies.length === filteredMethodologies.length && filteredMethodologies.length > 0}
                  onCheckedChange={handleSelectAll}
                />
                <span className="text-sm text-muted-foreground">Seleccionar todos</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
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
            ) : filteredMethodologies.length === 0 ? (
              <div className="text-center py-8">
                <Search className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-2 text-sm font-medium">No se encontraron iniciativas</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Intenta ajustar los filtros de búsqueda.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMethodologies.map((methodology) => (
                  <MethodologyCardWrapper
                    key={methodology.id}
                    methodology={methodology}
                    selectedItems={selectedMethodologies}
                    onSelectItem={handleSelectMethodology}
                    onMethodologyUpdated={handleMethodologyUpdated}
                    onStatusChanged={handleStatusChanged}
                    onDelete={handleMethodologyDeleted}
                    getStatusBadgeVariant={getStatusBadgeVariant}
                    formatDate={formatDate}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
    </div>
  );
}
