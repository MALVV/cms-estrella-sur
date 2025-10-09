'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CreateAllyForm } from '@/components/admin/create-ally-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Search } from 'lucide-react';
import { toast } from 'sonner';
import { AllyCardWrapper } from '@/components/admin/ally-card-wrapper';

interface Ally {
  id: string;
  name: string;
  role: string;
  description?: string;
  imageUrl: string;
  imageAlt: string;
  status: 'ACTIVE' | 'INACTIVE';
  isFeatured?: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  author?: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

interface CreateAllyData {
  name: string;
  role: string;
  description?: string;
  imageUrl: string;
  imageAlt: string;
  status: 'ACTIVE' | 'INACTIVE';
  isFeatured?: boolean;
}

export const AlliesManagementSystem: React.FC = () => {
  const { data: session, status } = useSession();
  const [allies, setAllies] = useState<Ally[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedAllies, setSelectedAllies] = useState<string[]>([]);
  const [featuredCount, setFeaturedCount] = useState(0);
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Debounce para la búsqueda
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchInput);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const fetchAllies = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        search: searchTerm,
        status: statusFilter,
        sortBy,
        sortOrder,
      });

      const response = await fetch(`/api/allies?${params}`);
      
      if (!response.ok) {
        throw new Error('Error al cargar los aliados');
      }

      const data = await response.json();
      setAllies(data);
      
      // Contar aliados destacados
      const featuredAllies = data.filter((ally: Ally) => ally.isFeatured);
      setFeaturedCount(featuredAllies.length);
    } catch (err) {
      console.error('Error fetching allies:', err);
      setError('No se pudieron cargar los aliados');
    } finally {
      setLoading(false);
    }
  }, [searchTerm, statusFilter, sortBy, sortOrder]);

  // Cargar aliados
  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      fetchAllies();
    }
  }, [status, session, fetchAllies]);

  const handleSearch = (value: string) => {
    setSearchInput(value);
  };

  const handleSuccess = () => {
    fetchAllies();
  };

  const handleBulkToggleStatus = async (isActive: boolean) => {
    if (selectedAllies.length === 0) return;

    try {
      const promises = selectedAllies.map(id => 
        fetch(`/api/allies/${id}/toggle-status`, {
          method: 'PUT',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ isActive })
        })
      );

      await Promise.all(promises);
      
      const action = isActive ? 'activados' : 'desactivados';
      const count = selectedAllies.length;
      toast.success(`${count} aliado${count !== 1 ? 's' : ''} ${action} exitosamente`);
      
      setSelectedAllies([]);
      handleSuccess();
    } catch (error) {
      console.error('Error in bulk toggle:', error);
      toast.error('Error al cambiar el estado de los aliados');
    }
  };

  const handleClearSelection = () => {
    setSelectedAllies([]);
    toast.info('Selección limpiada');
  };

  const handleSelectAlly = (id: string) => {
    setSelectedAllies(prev => 
      prev.includes(id) 
        ? prev.filter(pid => pid !== id)
        : [...prev, id]
    );
  };

  const handleCreateAlly = async (allyData: CreateAllyData) => {
    try {
      const response = await fetch('/api/allies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(allyData),
      });

      if (!response.ok) {
        throw new Error('Error al crear el aliado');
      }

      toast.success('Aliado creado exitosamente');
      setShowCreateForm(false);
      handleSuccess();
    } catch (error) {
      console.error('Error creating ally:', error);
      toast.error('Error al crear el aliado');
    }
  };

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Cargando...</p>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">Debes iniciar sesión para acceder a esta sección.</p>
        </div>
      </div>
    );
  }

    return (
    <div className="space-y-6">
      {/* Header con título y botón de crear */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Aliados Estratégicos</h1>
          <p className="text-muted-foreground">
            Administra los aliados estratégicos de la organización
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={() => setShowCreateForm(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Crear Aliado
          </Button>
        </div>
      </div>

      {/* Información de aliados destacados */}
      {!searchTerm && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant={featuredCount >= 3 ? "destructive" : "secondary"}>
                  Aliados Destacados: {featuredCount}/3
                </Badge>
                {featuredCount >= 3 && (
                  <span className="text-sm text-red-600 dark:text-red-400">
                    Límite alcanzado
                  </span>
                )}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Máximo 3 aliados destacados
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Notificación de errores */}
      {error && (
        <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <div className="text-red-600 dark:text-red-400">
                ⚠️ {error}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setError(null)}
                className="ml-auto text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
              >
                ✕
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filtros y búsqueda */}
          <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar por nombre, rol o descripción..."
                  value={searchInput}
              onChange={(e) => handleSearch(e.target.value)}
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
          <Select value={sortBy} onValueChange={(value: 'name' | 'role' | 'createdAt') => setSortBy(value)}>
            <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Nombre</SelectItem>
                <SelectItem value="role">Rol</SelectItem>
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
            <TabsTrigger value="all">Todos ({allies.length})</TabsTrigger>
            <TabsTrigger value="active">Activos ({allies.filter(a => a.status === 'ACTIVE').length})</TabsTrigger>
            <TabsTrigger value="inactive">Inactivos ({allies.filter(a => a.status === 'INACTIVE').length})</TabsTrigger>
          </TabsList>
          
          {/* Acciones en lote */}
          {selectedAllies.length > 0 && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => handleBulkToggleStatus(true)}
              >
                Activar Seleccionados ({selectedAllies.length})
              </Button>
              <Button
                variant="outline"
                onClick={() => handleBulkToggleStatus(false)}
              >
                Desactivar Seleccionados ({selectedAllies.length})
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
          <AlliesList 
            allies={allies}
            loading={loading}
            selectedAllies={selectedAllies}
            onSelectAlly={handleSelectAlly}
            onSuccess={handleSuccess}
            searchTerm={searchTerm}
          />
        </TabsContent>

        <TabsContent value="active">
          <AlliesList 
            allies={allies.filter(a => a.status === 'ACTIVE')}
            loading={loading}
            selectedAllies={selectedAllies}
            onSelectAlly={handleSelectAlly}
            onSuccess={handleSuccess}
            searchTerm={searchTerm}
          />
        </TabsContent>

        <TabsContent value="inactive">
          <AlliesList 
            allies={allies.filter(a => a.status === 'INACTIVE')}
            loading={loading}
            selectedAllies={selectedAllies}
            onSelectAlly={handleSelectAlly}
            onSuccess={handleSuccess}
            searchTerm={searchTerm}
          />
        </TabsContent>
      </Tabs>

      {/* Formulario de creación */}
      {showCreateForm && (
        <CreateAllyForm
          onSubmit={handleCreateAlly}
          onCancel={() => setShowCreateForm(false)}
        />
      )}
    </div>
  );
};

// Componente para mostrar la lista de aliados
interface AlliesListProps {
  allies: Ally[];
  loading: boolean;
  selectedAllies: string[];
  onSelectAlly: (id: string) => void;
  onSuccess: () => void;
  searchTerm: string;
}

function AlliesList({ 
  allies, 
  loading, 
  selectedAllies, 
  onSelectAlly, 
  onSuccess,
  searchTerm
}: AlliesListProps) {
  return (
    <div className="space-y-4">
      {/* Información de resultados */}
        <div className="text-sm text-gray-600 dark:text-gray-400">
        {searchTerm ? (
            <span>
            {allies.length} aliado{allies.length !== 1 ? 's' : ''} encontrado{allies.length !== 1 ? 's' : ''} para &quot;{searchTerm}&quot;
            </span>
          ) : (
            <span>
              {allies.length} aliado{allies.length !== 1 ? 's' : ''} en total
            </span>
          )}
      </div>

      {/* Lista de aliados */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Indicador de carga */}
        {loading && searchTerm && (
          <div className="col-span-full flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Buscando aliados...</p>
            </div>
          </div>
        )}

        {/* Mensaje cuando no hay aliados */}
        {!loading && allies.length === 0 && (
          <div className="col-span-full text-center py-12">
            <div className="text-gray-500 mb-4">
              <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No se encontraron aliados</h3>
              <p className="text-sm">
                {searchTerm 
                  ? `No hay aliados que coincidan con &quot;${searchTerm}&quot;`
                  : 'No hay aliados disponibles'
                }
              </p>
            </div>
          </div>
        )}
        
        {/* Tarjetas de aliados */}
        {allies.map((ally) => (
          <AllyCardWrapper
            key={ally.id}
            ally={ally}
            selectedAllies={selectedAllies}
            onSelectAlly={onSelectAlly}
            onSuccess={onSuccess}
            onViewAlly={() => {}}
          />
        ))}
      </div>

    </div>
  );
}