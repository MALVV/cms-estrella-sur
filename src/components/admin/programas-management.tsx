'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Search, Edit, Trash2, Eye, EyeOff, X, Calendar } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';
import { CreateProgramaDialog } from './create-programa-dialog';
import { EditProgramaDialog } from './edit-programa-dialog';
import { DeleteProgramaDialog } from './delete-programa-dialog';
import { ToggleProgramaStatusDialog } from './toggle-programa-status-dialog';
import { ProgramasViewModal } from './programas-view-modal';
import { ProgramaCardWrapper } from './programa-card-wrapper';

interface Programa {
  id: string;
  sectorName: string;
  description: string;
  imageUrl?: string;
  imageAlt?: string;
  videoPresentacion?: string;
  alineacionODS?: string;
  subareasResultados?: string;
  resultados?: string;
  gruposAtencion?: string;
  contenidosTemas?: string;
  enlaceMasInformacion?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  creator: {
    id: string;
    name: string;
    email: string;
  };
  _count?: {
    news: number;
    imageLibrary: number;
  };
}

export function ProgramasManagement() {
  const [programas, setProgramas] = useState<Programa[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedProgramas, setSelectedProgramas] = useState<string[]>([]);
  const [viewingPrograma, setViewingPrograma] = useState<Programa | null>(null);

  // Debounce para la búsqueda
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchInput);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // Cargar programas
  useEffect(() => {
    fetchProgramas(1, searchTerm, statusFilter, sortBy, sortOrder);
  }, [searchTerm, statusFilter, sortBy, sortOrder]);

  const fetchProgramas = async (page: number = 1, search: string = '', status: string = 'ALL', sort: string = 'createdAt', order: string = 'desc') => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        ...(search && { search }),
        ...(status !== 'ALL' && { status }),
        ...(sort && { sortBy: sort }),
        ...(order && { sortOrder: order }),
      });

      const response = await fetch(`/api/admin/programas?${params}`, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Error al cargar programas');
      }

      const data = await response.json();
      setProgramas(data.programas || []);
    } catch (error) {
      console.error('Error fetching programas:', error);
      toast.error('Error al cargar programas');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearchInput(value);
  };

  const handleClearSearch = () => {
    setSearchInput('');
    setSearchTerm('');
  };

  const handleSuccess = () => {
    fetchProgramas(1, searchTerm, statusFilter, sortBy, sortOrder);
  };

  const handleBulkToggleStatus = async (isActive: boolean) => {
    if (selectedProgramas.length === 0) return;

    try {
      const promises = selectedProgramas.map(id => 
        fetch(`/api/admin/programas/${id}`, {
          method: 'PUT',
        credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ isActive })
        })
      );

      await Promise.all(promises);
      
      const action = isActive ? 'activados' : 'desactivados';
      const count = selectedProgramas.length;
      toast.success(`${count} programa${count !== 1 ? 's' : ''} ${action} exitosamente`);
      
      setSelectedProgramas([]);
      handleSuccess();
    } catch (error) {
      console.error('Error in bulk toggle:', error);
      toast.error('Error al cambiar el estado de los programas');
    }
  };

  const handleTabChange = (value: string) => {
    setStatusFilter(value === 'all' ? 'ALL' : value === 'active' ? 'ACTIVE' : 'INACTIVE');
    setSelectedProgramas([]); // Limpiar selección al cambiar tab
  };

  const handleClearSelection = () => {
    setSelectedProgramas([]);
    toast.info('Selección limpiada');
  };

  const handleViewPrograma = (programa: Programa) => {
    setViewingPrograma(programa);
  };

  const handleCloseView = () => {
    setViewingPrograma(null);
  };

  const handleSelectPrograma = (id: string) => {
    setSelectedProgramas(prev => 
      prev.includes(id) 
        ? prev.filter(pid => pid !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="space-y-6">
      {/* Header con título y botón de crear */}
      <div className="flex justify-between items-center">
        <div>
        <h1 className="text-3xl font-bold">Gestión de Programas</h1>
          <p className="text-muted-foreground">
            Administra los programas de la organización
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <CreateProgramaDialog onSuccess={handleSuccess}>
            <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nuevo Programa
        </Button>
          </CreateProgramaDialog>
        </div>
      </div>

      {/* Filtros y búsqueda */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
              placeholder="Buscar por nombre o descripción..."
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
          <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sectorName">Nombre</SelectItem>
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
            <TabsTrigger value="all">Todos ({programas.length})</TabsTrigger>
            <TabsTrigger value="active">Activos ({programas.filter(p => p.isActive).length})</TabsTrigger>
            <TabsTrigger value="inactive">Inactivos ({programas.filter(p => !p.isActive).length})</TabsTrigger>
          </TabsList>
          
          {/* Acciones en lote */}
          {selectedProgramas.length > 0 && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => handleBulkToggleStatus(true)}
              >
                Activar Seleccionados ({selectedProgramas.length})
              </Button>
              <Button
                variant="outline"
                onClick={() => handleBulkToggleStatus(false)}
              >
                Desactivar Seleccionados ({selectedProgramas.length})
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
        <ProgramasList
          programas={programas}
          loading={loading}
          selectedProgramas={selectedProgramas}
          onSelectPrograma={handleSelectPrograma}
          onSuccess={handleSuccess}
          onViewPrograma={handleViewPrograma}
          searchTerm={searchTerm}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onBulkToggleStatus={handleBulkToggleStatus}
          onClearSelection={handleClearSelection}
        />
        </TabsContent>

        <TabsContent value="active">
          <ProgramasList 
            programas={programas.filter(p => p.isActive)}
            loading={loading}
            selectedProgramas={selectedProgramas}
            onSelectPrograma={handleSelectPrograma}
            onSuccess={handleSuccess}
            onViewPrograma={handleViewPrograma}
            searchTerm={searchTerm}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onBulkToggleStatus={handleBulkToggleStatus}
            onClearSelection={handleClearSelection}
          />
        </TabsContent>

        <TabsContent value="inactive">
          <ProgramasList 
            programas={programas.filter(p => !p.isActive)}
            loading={loading}
            selectedProgramas={selectedProgramas}
            onSelectPrograma={handleSelectPrograma}
            onSuccess={handleSuccess}
            onViewPrograma={handleViewPrograma}
            searchTerm={searchTerm}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onBulkToggleStatus={handleBulkToggleStatus}
            onClearSelection={handleClearSelection}
          />
        </TabsContent>
      </Tabs>

      {/* Modal de vista detallada */}
      <ProgramasViewModal 
        programa={viewingPrograma} 
        isOpen={!!viewingPrograma} 
        onClose={handleCloseView} 
      />
    </div>
  );
}

// Componente para mostrar la lista de programas
interface ProgramasListProps {
  programas: Programa[];
  loading: boolean;
  selectedProgramas: string[];
  onSelectPrograma: (id: string) => void;
  onSuccess: (message?: string) => void;
  onViewPrograma: (programa: Programa) => void;
  searchTerm: string;
  sortBy: string;
  sortOrder: string;
  onBulkToggleStatus: (isActive: boolean) => void;
  onClearSelection: () => void;
}

function ProgramasList({ 
  programas, 
  loading, 
  selectedProgramas, 
  onSelectPrograma, 
  onSuccess, 
  onViewPrograma,
  searchTerm, 
  sortBy, 
  sortOrder,
  onBulkToggleStatus,
  onClearSelection
}: ProgramasListProps) {
  const [viewingPrograma, setViewingPrograma] = useState<Programa | null>(null);

  const handleView = (programa: Programa) => {
    setViewingPrograma(programa);
  };

  const handleViewClose = () => {
    setViewingPrograma(null);
  };

  return (
    <div className="space-y-4">
      {/* Información de resultados */}
      <div className="text-sm text-gray-600 dark:text-gray-400">
        {searchTerm ? (
          <span>
            {programas.length} programa{programas.length !== 1 ? 's' : ''} encontrado{programas.length !== 1 ? 's' : ''} para "{searchTerm}"
          </span>
        ) : (
          <span>
            {programas.length} programa{programas.length !== 1 ? 's' : ''} en total
          </span>
        )}
      </div>

      {/* Grid de programas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Indicador de carga */}
        {loading && searchTerm && (
          <div className="col-span-full flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Buscando programas...</p>
            </div>
          </div>
        )}

        {/* Mensaje cuando no hay programas */}
        {!loading && programas.length === 0 && (
          <div className="col-span-full text-center py-12">
            <div className="text-gray-500 mb-4">
              <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No se encontraron programas</h3>
              <p className="text-sm">
                {searchTerm 
                  ? `No hay programas que coincidan con "${searchTerm}"`
                  : 'No hay programas disponibles'
                }
              </p>
            </div>
          </div>
        )}

        {/* Tarjetas de programas */}
        {programas.map((programa) => (
          <ProgramaCardWrapper
            key={programa.id}
            programa={programa}
            selectedProgramas={selectedProgramas}
            onSelectPrograma={onSelectPrograma}
            onSuccess={onSuccess}
            onViewPrograma={onViewPrograma}
          />
        ))}
      </div>
    </div>
  );
}