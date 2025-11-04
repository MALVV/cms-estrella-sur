'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Search, Edit, Trash2, Eye, EyeOff, Calendar, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { CreateConvocatoriaDialog } from './create-convocatoria-dialog';
import { EditConvocatoriaDialog } from './edit-convocatoria-dialog';
import { DeleteConvocatoriaDialog } from './delete-convocatoria-dialog';

interface Convocatoria {
  id: string;
  title: string;
  description: string;
  fullDescription: string;
  imageUrl: string;
  imageAlt?: string;
  startDate: string;
  endDate: string;
  requirements: any[];
  documents: any[];
  status: 'DRAFT' | 'ACTIVE' | 'UPCOMING' | 'CLOSED';
  isActive: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
  creator?: {
    id: string;
    name: string;
    email: string;
  };
  _count?: {
    applications: number;
  };
}

export function ConvocatoriasManagement() {
  const [convocatorias, setConvocatorias] = useState<Convocatoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedConvocatorias, setSelectedConvocatorias] = useState<string[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingConvocatoria, setEditingConvocatoria] = useState<Convocatoria | null>(null);
  const [deletingConvocatoria, setDeletingConvocatoria] = useState<Convocatoria | null>(null);
  const [changingStatus, setChangingStatus] = useState<{convocatoria: Convocatoria, newStatus: string} | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Debounce para la búsqueda
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchInput);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // Cargar convocatorias
  useEffect(() => {
    fetchConvocatorias(1, searchTerm, statusFilter, sortBy, sortOrder);
  }, [searchTerm, statusFilter, sortBy, sortOrder]);

  const fetchConvocatorias = async (page: number = 1, search: string = '', status: string = 'ALL', sort: string = 'createdAt', order: string = 'desc') => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...(search && { search }),
        ...(status !== 'ALL' && { status }),
        ...(sort && { sortBy: sort }),
        ...(order && { sortOrder: order }),
      });

      const response = await fetch(`/api/admin/convocatorias?${params}`, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Error al cargar convocatorias');
      }

      const data = await response.json();
      setConvocatorias(data.convocatorias || []);
      setCurrentPage(data.pagination?.page || 1);
      setTotalPages(data.pagination?.pages || 1);
    } catch (error) {
      console.error('Error fetching convocatorias:', error);
      toast.error('Error al cargar convocatorias');
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
    fetchConvocatorias(currentPage, searchTerm, statusFilter, sortBy, sortOrder);
    setEditingConvocatoria(null);
    setDeletingConvocatoria(null);
  };

  const handleTabChange = (value: string) => {
    const statusMap: Record<string, string> = {
      'all': 'ALL',
      'active': 'ACTIVE',
      'closed': 'CLOSED',
      'upcoming': 'UPCOMING',
      'draft': 'DRAFT'
    };
    setStatusFilter(statusMap[value] || 'ALL');
    setSelectedConvocatorias([]);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <Badge className="bg-green-500 text-white">Activa</Badge>;
      case 'UPCOMING':
        return <Badge className="bg-blue-500 text-white">Próxima</Badge>;
      case 'CLOSED':
        return <Badge className="bg-gray-500 text-white">Cerrada</Badge>;
      case 'DRAFT':
        return <Badge className="bg-yellow-500 text-white">Borrador</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'Activa';
      case 'UPCOMING': return 'Próxima';
      case 'CLOSED': return 'Cerrada';
      case 'DRAFT': return 'Borrador';
      default: return status;
    }
  };

  const updateConvocatoriaStatus = async () => {
    if (!changingStatus) return;

    try {
      const response = await fetch(`/api/admin/convocatorias/${changingStatus.convocatoria.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: changingStatus.newStatus }),
      });

      if (response.ok) {
        toast.success('Estado actualizado exitosamente');
        fetchConvocatorias(currentPage, searchTerm, statusFilter, sortBy, sortOrder);
        setChangingStatus(null);
      } else {
        toast.error('Error al actualizar el estado');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Error al actualizar el estado');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Convocatorias</h1>
          <p className="text-muted-foreground">Administra las convocatorias de trabajo</p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nueva Convocatoria
        </Button>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar convocatorias..."
                value={searchInput}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-8"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleClearSearch}>
                Limpiar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="all" onValueChange={handleTabChange}>
        <TabsList>
          <TabsTrigger value="all">Todas</TabsTrigger>
          <TabsTrigger value="active">Activas</TabsTrigger>
          <TabsTrigger value="upcoming">Próximas</TabsTrigger>
          <TabsTrigger value="closed">Cerradas</TabsTrigger>
          <TabsTrigger value="draft">Borradores</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Cargando convocatorias...</p>
            </div>
          ) : convocatorias.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No se encontraron convocatorias</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {convocatorias.map((convocatoria) => (
                <Card key={convocatoria.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <CardTitle className="text-xl">{convocatoria.title}</CardTitle>
                          {getStatusBadge(convocatoria.status)}
                          {convocatoria.isFeatured && (
                            <Badge variant="outline" className="border-primary text-primary">
                              Destacada
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {convocatoria.description}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Select
                          value={convocatoria.status}
                          onValueChange={(value) => setChangingStatus({convocatoria, newStatus: value})}
                        >
                          <SelectTrigger className="w-36">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="DRAFT">Borrador</SelectItem>
                            <SelectItem value="UPCOMING">Próxima</SelectItem>
                            <SelectItem value="ACTIVE">Activa</SelectItem>
                            <SelectItem value="CLOSED">Cerrada</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setEditingConvocatoria(convocatoria)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeletingConvocatoria(convocatoria)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>Inicio: {formatDate(convocatoria.startDate)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>Fin: {formatDate(convocatoria.endDate)}</span>
                      </div>
                      <div className="text-muted-foreground">
                        Aplicaciones: {convocatoria._count?.applications || 0}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 pt-4">
              <Button
                variant="outline"
                disabled={currentPage === 1}
                onClick={() => fetchConvocatorias(currentPage - 1, searchTerm, statusFilter, sortBy, sortOrder)}
              >
                Anterior
              </Button>
              <span className="flex items-center px-4">
                Página {currentPage} de {totalPages}
              </span>
              <Button
                variant="outline"
                disabled={currentPage === totalPages}
                onClick={() => fetchConvocatorias(currentPage + 1, searchTerm, statusFilter, sortBy, sortOrder)}
              >
                Siguiente
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      {isCreateOpen && (
        <CreateConvocatoriaDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} onSuccess={handleSuccess} />
      )}
      {editingConvocatoria && (
        <EditConvocatoriaDialog
          convocatoria={editingConvocatoria}
          open={!!editingConvocatoria}
          onOpenChange={(open) => !open && setEditingConvocatoria(null)}
          onSuccess={handleSuccess}
        />
      )}
      {deletingConvocatoria && (
        <DeleteConvocatoriaDialog
          convocatoria={deletingConvocatoria}
          open={!!deletingConvocatoria}
          onOpenChange={(open) => !open && setDeletingConvocatoria(null)}
          onSuccess={handleSuccess}
        />
      )}

      {/* Dialog de Cambiar Estado */}
      {changingStatus && (
        <Dialog open={!!changingStatus} onOpenChange={() => setChangingStatus(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cambiar Estado de Convocatoria</DialogTitle>
            </DialogHeader>
            
            <div className="py-4">
              <p className="text-sm text-gray-600">
                ¿Estás seguro de que quieres cambiar el estado de 
                <strong> "{changingStatus.convocatoria.title}"</strong>?
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Estado actual: <strong>{getStatusText(changingStatus.convocatoria.status)}</strong>
              </p>
              <p className="text-sm text-gray-500">
                Nuevo estado: <strong>{getStatusText(changingStatus.newStatus)}</strong>
              </p>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setChangingStatus(null)}>
                Cancelar
              </Button>
              <Button onClick={updateConvocatoriaStatus}>
                Confirmar Cambio
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

