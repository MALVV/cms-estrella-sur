'use client'

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { useSession } from 'next-auth/react';
import { usePermissions } from '@/hooks/use-permissions';
import { Search, Plus } from 'lucide-react';
import { CreateEventForm } from '@/components/admin/create-event-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EventCardWrapper } from '@/components/admin/event-card-wrapper';

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
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  organizer?: {
    name?: string;
    email: string;
  };
}

export const EventsManagement: React.FC = () => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'title' | 'eventDate' | 'createdAt'>('eventDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const { toast } = useToast();
  const { data: session } = useSession();
  const { canManageContent } = usePermissions();

  const fetchData = useCallback(async () => {
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

      const response = await fetch(`/api/events?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Error al cargar eventos');
      }
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error('Error al cargar eventos:', error);
      toast({
        title: 'Error',
        description: 'Error al cargar los eventos',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [statusFilter, searchTerm, sortBy, sortOrder, toast]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchData();
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [fetchData]);

  const filteredEvents = events;
  const activeEvents = events.filter(item => item.isActive);
  const inactiveEvents = events.filter(item => !item.isActive);

  const handleSelectItem = (itemId: string) => {
    setSelectedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === filteredEvents.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredEvents.map(item => item.id));
    }
  };

  const handleBulkToggleStatus = async (isActive: boolean) => {
    try {
      const response = await fetch('/api/events/bulk-toggle-status', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.customToken}`,
        },
        body: JSON.stringify({
          eventIds: selectedItems,
          isActive
        }),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar estado');
      }

      const result = await response.json();

      setEvents(prev => prev.map(item =>
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
        description: 'Error al cambiar el estado de los eventos',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/events/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.customToken}`,
        },
      });

      if (!response.ok) {
        // Tratar 404 como éxito (ya no existe); otros códigos muestran toast y salen sin lanzar excepción
        if (response.status !== 404) {
          const errorText = await response.text().catch(() => '');
          toast({
            title: 'Error',
            description: `Error al eliminar evento: ${response.status} ${response.statusText}`,
            variant: 'destructive',
          });
          return;
        }
      }

      setEvents(prev => prev.filter(item => item.id !== id));
      toast({
        title: 'Éxito',
        description: 'Evento eliminado exitosamente',
      });
    } catch (error) {
      // Evitar lanzar excepción al usuario; ya gestionamos el toast arriba
      console.warn('Error al eliminar evento (gestionado):', error);
    }
  };

  const handleEventUpdated = (updatedEvent: EventItem) => {
    setEvents(prev => prev.map(item => 
      item.id === updatedEvent.id ? updatedEvent : item
    ));
  };

  const handleStatusChanged = (eventId: string, newStatus: boolean) => {
    setEvents(prev => prev.map(item =>
      item.id === eventId ? { ...item, isActive: newStatus } : item
    ));
  };

  const handleToggleFeatured = async (eventId: string, isFeatured: boolean) => {
    try {
      const response = await fetch(`/api/events/${eventId}/toggle-featured`, {
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

      setEvents(prev => prev.map(item =>
        item.id === eventId ? { ...item, isFeatured } : item
      ));
    } catch (error) {
      console.error('Error al cambiar estado destacado:', error);
      toast({
        title: 'Error',
        description: 'Error al cambiar el estado destacado del evento',
        variant: 'destructive',
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadgeVariant = (isActive: boolean) => {
    return isActive ? 'default' : 'secondary';
  };

  if (!canManageContent()) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Eventos</h1>
          <p className="text-muted-foreground">
            No tienes permisos para gestionar eventos.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Eventos</h1>
          <p className="text-muted-foreground">
            Administra los eventos y actividades del blog
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <CreateEventForm onEventCreated={fetchData} />
          <Button variant="outline" size="sm" onClick={fetchData}>
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
              placeholder="Buscar por título o descripción..."
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
          <Select value={sortBy} onValueChange={(value: 'title' | 'eventDate' | 'createdAt') => setSortBy(value)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="title">Título</SelectItem>
              <SelectItem value="eventDate">Fecha evento</SelectItem>
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

      {/* Acciones en lote */}
      {selectedItems.length > 0 && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-blue-900">
              {selectedItems.length} evento(s) seleccionado(s)
            </span>
            <div className="flex items-center space-x-2">
              <Button size="sm" variant="outline" onClick={() => handleBulkToggleStatus(true)}>
                Activar
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleBulkToggleStatus(false)}>
                Desactivar
              </Button>
              <Button size="sm" variant="outline" onClick={() => setSelectedItems([])}>
                Limpiar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Pestañas */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">Todos ({filteredEvents.length})</TabsTrigger>
          <TabsTrigger value="active">Activos ({activeEvents.length})</TabsTrigger>
          <TabsTrigger value="inactive">Inactivos ({inactiveEvents.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <EventsList 
            events={filteredEvents}
            loading={loading}
            selectedItems={selectedItems}
            onSelectItem={handleSelectItem}
            onSelectAll={handleSelectAll}
            onDelete={handleDelete}
            onEventUpdated={handleEventUpdated}
            onStatusChanged={handleStatusChanged}
            onToggleFeatured={handleToggleFeatured}
            getStatusBadgeVariant={getStatusBadgeVariant}
            formatDate={formatDate}
          />
        </TabsContent>

        <TabsContent value="active">
          <EventsList 
            events={activeEvents}
            loading={loading}
            selectedItems={selectedItems}
            onSelectItem={handleSelectItem}
            onSelectAll={handleSelectAll}
            onDelete={handleDelete}
            onEventUpdated={handleEventUpdated}
            onStatusChanged={handleStatusChanged}
            onToggleFeatured={handleToggleFeatured}
            getStatusBadgeVariant={getStatusBadgeVariant}
            formatDate={formatDate}
          />
        </TabsContent>

        <TabsContent value="inactive">
          <EventsList 
            events={inactiveEvents}
            loading={loading}
            selectedItems={selectedItems}
            onSelectItem={handleSelectItem}
            onSelectAll={handleSelectAll}
            onDelete={handleDelete}
            onEventUpdated={handleEventUpdated}
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

// Componente para mostrar la lista de eventos
interface EventsListProps {
  events: EventItem[];
  loading: boolean;
  selectedItems: string[];
  onSelectItem: (itemId: string) => void;
  onSelectAll: () => void;
  onDelete: (id: string) => void;
  onEventUpdated: (updatedEvent: EventItem) => void;
  onStatusChanged: (eventId: string, newStatus: boolean) => void;
  onToggleFeatured: (eventId: string, isFeatured: boolean) => Promise<void>;
  getStatusBadgeVariant: (isActive: boolean) => "default" | "secondary";
  formatDate: (dateString: string) => string;
}

function EventsList({
  events,
  loading,
  selectedItems,
  onSelectItem,
  onSelectAll,
  onDelete,
  onEventUpdated,
  onStatusChanged,
  onToggleFeatured,
  getStatusBadgeVariant,
  formatDate
}: EventsListProps) {
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

  if (events.length === 0) {
    return (
      <div className="text-center py-12">
        <Plus className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No hay eventos</h3>
        <p className="mt-1 text-sm text-gray-500">
          Comienza creando tu primer evento.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((item) => (
        <EventCardWrapper
          key={item.id}
          event={item}
          selectedItems={selectedItems}
          onSelectItem={onSelectItem}
          onEventUpdated={onEventUpdated}
          onStatusChanged={onStatusChanged}
          onDelete={onDelete}
          getStatusBadgeVariant={getStatusBadgeVariant}
          formatDate={formatDate}
        />
      ))}
    </div>
  );
}
