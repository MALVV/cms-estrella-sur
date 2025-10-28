'use client'

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Mail, 
  Phone, 
  User, 
  Calendar, 
  Eye, 
  Trash2, 
  CheckCircle, 
  Clock,
  MessageSquare,
  Search,
  AlertTriangle
} from 'lucide-react';
import { toast } from 'sonner';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  isRead: boolean;
  readAt: string | null;
  createdAt: string;
}

export function ContactMessagesManagement() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [allMessages, setAllMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [deletingMessage, setDeletingMessage] = useState<ContactMessage | null>(null);
  const [updatingMessage, setUpdatingMessage] = useState<ContactMessage | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'read' | 'unread'>('all');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');

  // Debounce para la búsqueda
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchInput);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    fetchMessages();
  }, [filter, month, year]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filter !== 'all') {
        params.append('isRead', filter === 'read' ? 'true' : 'false');
      }
      if (month) params.append('month', month);
      if (year) params.append('year', year);
      
      const response = await fetch(`/api/admin/contact-messages?${params}`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages);
        setAllMessages(data.messages);
      }
    } catch (error) {
      console.error('Error al cargar mensajes:', error);
      toast.error('Error al cargar mensajes');
    } finally {
      setLoading(false);
    }
  };

  const handleClearSearch = () => {
    setSearchInput('');
    setSearchTerm('');
  };

  const handleTabChange = (value: string) => {
    const filterMap: Record<string, 'all' | 'read' | 'unread'> = {
      'all': 'all',
      'unread': 'unread',
      'read': 'read'
    };
    setFilter(filterMap[value] || 'all');
  };

  const handleMarkAsRead = async (messageId: string) => {
    try {
      const response = await fetch(`/api/admin/contact-messages/${messageId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isRead: true })
      });

      if (response.ok) {
        toast.success('Mensaje marcado como leído');
        fetchMessages();
      } else {
        throw new Error('Error al marcar mensaje');
      }
    } catch (error) {
      console.error('Error al marcar mensaje:', error);
      toast.error('Error al marcar mensaje');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingMessage) return;
    
    try {
      const response = await fetch(`/api/admin/contact-messages/${deletingMessage.id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        toast.success('Mensaje eliminado correctamente');
        fetchMessages();
        setDeletingMessage(null);
      } else {
        throw new Error('Error al eliminar mensaje');
      }
    } catch (error) {
      console.error('Error al eliminar mensaje:', error);
      toast.error('Error al eliminar mensaje');
    }
  };

  const handleMarkAsReadConfirm = async () => {
    if (!updatingMessage) return;
    
    try {
      const response = await fetch(`/api/admin/contact-messages/${updatingMessage.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isRead: true })
      });

      if (response.ok) {
        toast.success('Mensaje marcado como leído');
        fetchMessages();
        setUpdatingMessage(null);
      } else {
        throw new Error('Error al marcar mensaje');
      }
    } catch (error) {
      console.error('Error al marcar mensaje:', error);
      toast.error('Error al marcar mensaje');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredMessages = messages.filter(message => 
    message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const unreadCount = allMessages.filter(m => !m.isRead).length;
  const totalCount = allMessages.length;
  const readCount = totalCount - unreadCount;

  // Contador de resultados de búsqueda
  const searchResultsCount = filteredMessages.length;

  // Meses del año
  const months = [
    { value: '01', label: 'Enero' },
    { value: '02', label: 'Febrero' },
    { value: '03', label: 'Marzo' },
    { value: '04', label: 'Abril' },
    { value: '05', label: 'Mayo' },
    { value: '06', label: 'Junio' },
    { value: '07', label: 'Julio' },
    { value: '08', label: 'Agosto' },
    { value: '09', label: 'Septiembre' },
    { value: '10', label: 'Octubre' },
    { value: '11', label: 'Noviembre' },
    { value: '12', label: 'Diciembre' },
  ];

  // Generar años disponibles (últimos 5 años)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i).map(year => year.toString());

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar por nombre, email o mensaje..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-8"
              />
            </div>
            <div className="flex gap-2 items-center">
              {searchTerm && (
                <span className="text-sm text-muted-foreground">
                  {searchResultsCount} resultado{searchResultsCount !== 1 ? 's' : ''}
                </span>
              )}
              <Button variant="outline" onClick={handleClearSearch} disabled={!searchInput}>
                Limpiar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filtros de Fecha */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros por Fecha</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Mes</label>
                <Select value={month || "all"} onValueChange={(value) => setMonth(value === "all" ? "" : value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos los meses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    {months.map((month) => (
                      <SelectItem key={month.value} value={month.value}>{month.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Año</label>
                <Select value={year || "all"} onValueChange={(value) => setYear(value === "all" ? "" : value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos los años" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    {years.map((year) => (
                      <SelectItem key={year} value={year}>{year}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="all" onValueChange={handleTabChange}>
        <TabsList>
          <TabsTrigger value="all">Todos ({totalCount})</TabsTrigger>
          <TabsTrigger value="unread">No Leídos ({unreadCount})</TabsTrigger>
          <TabsTrigger value="read">Leídos ({readCount})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
            {loading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Cargando mensajes...</p>
              </div>
            ) : filteredMessages.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  {searchTerm ? `No se encontraron mensajes para "${searchTerm}"` : 'No se encontraron mensajes'}
                </p>
              </div>
            ) : (
            <div className="grid gap-4">
              {filteredMessages.map((message) => (
              <Card key={message.id} className="border-l-4 border-l-blue-500 bg-blue-50 dark:bg-blue-900/10">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                      <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold">
                        {message.name}
                      </h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="w-4 h-4" />
                        {message.email}
                        {message.phone && (
                          <>
                            <span>•</span>
                            <Phone className="w-4 h-4" />
                            {message.phone}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!message.isRead && (
                        <Badge variant="outline" className="bg-blue-100 text-blue-800">
                        <Clock className="w-3 h-3 mr-1" />
                        Nuevo
                      </Badge>
                    )}
                    {message.isRead && (
                        <Badge variant="outline" className="bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Leído
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="mb-4">
                    <div className="flex items-start gap-2 text-muted-foreground">
                    <MessageSquare className="w-4 h-4 mt-0.5" />
                    <p className="text-sm">{message.message}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    {formatDate(message.createdAt)}
                  </div>
                  <div className="flex gap-2">
                    {!message.isRead && (
                      <Button
                        size="sm"
                        variant="outline"
                          onClick={() => setUpdatingMessage(message)}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Marcar como leído
                      </Button>
                    )}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setSelectedMessage(message)}>
                          <Eye className="w-4 h-4 mr-2" />
                          Ver detalles
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Detalles del Mensaje</DialogTitle>
                        </DialogHeader>
                        {selectedMessage && (
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-sm font-medium">Nombre</label>
                                  <p className="text-sm text-muted-foreground">{selectedMessage.name}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium">Email</label>
                                  <p className="text-sm text-muted-foreground">{selectedMessage.email}</p>
                              </div>
                              {selectedMessage.phone && (
                                <div>
                                  <label className="text-sm font-medium">Teléfono</label>
                                    <p className="text-sm text-muted-foreground">{selectedMessage.phone}</p>
                                </div>
                              )}
                              <div>
                                <label className="text-sm font-medium">Fecha</label>
                                  <p className="text-sm text-muted-foreground">{formatDate(selectedMessage.createdAt)}</p>
                              </div>
                            </div>
                            <div>
                              <label className="text-sm font-medium">Mensaje</label>
                                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{selectedMessage.message}</p>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setDeletingMessage(message)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Eliminar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
              ))}
            </div>
            )}
        </TabsContent>

        <TabsContent value="unread" className="space-y-4">
            {loading ? (
              <div className="text-center py-12">
              <p className="text-muted-foreground">Cargando mensajes...</p>
              </div>
            ) : filteredMessages.filter(m => !m.isRead).length === 0 ? (
              <div className="text-center py-12">
              <p className="text-muted-foreground">No hay mensajes sin leer</p>
              </div>
            ) : (
            <div className="grid gap-4">
              {filteredMessages.filter(m => !m.isRead).map((message) => (
              <Card key={message.id} className="border-l-4 border-l-blue-500 bg-blue-50 dark:bg-blue-900/10">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                        <h3 className="text-lg font-semibold">
                          {message.name}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Mail className="w-4 h-4" />
                            {message.email}
                            {message.phone && (
                              <>
                                <span>•</span>
                                <Phone className="w-4 h-4" />
                                {message.phone}
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    <Badge variant="outline" className="bg-blue-100 text-blue-800">
                      <Clock className="w-3 h-3 mr-1" />
                      No leído
                    </Badge>
                    </div>

                    <div className="mb-4">
                    <div className="flex items-start gap-2 text-muted-foreground">
                        <MessageSquare className="w-4 h-4 mt-0.5" />
                        <p className="text-sm">{message.message}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        {formatDate(message.createdAt)}
                      </div>
                      <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setUpdatingMessage(message)}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Marcar como leído
                      </Button>
                      <Dialog>
                        <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setSelectedMessage(message)}>
                          <Eye className="w-4 h-4 mr-2" />
                          Ver detalles
                        </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Detalles del Mensaje</DialogTitle>
                          </DialogHeader>
                          {selectedMessage && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="text-sm font-medium">Nombre</label>
                                  <p className="text-sm text-muted-foreground">{selectedMessage.name}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Email</label>
                                  <p className="text-sm text-muted-foreground">{selectedMessage.email}</p>
                                </div>
                                {selectedMessage.phone && (
                                  <div>
                                    <label className="text-sm font-medium">Teléfono</label>
                                    <p className="text-sm text-muted-foreground">{selectedMessage.phone}</p>
                                  </div>
                                )}
                                <div>
                                  <label className="text-sm font-medium">Fecha</label>
                                  <p className="text-sm text-muted-foreground">{formatDate(selectedMessage.createdAt)}</p>
                                </div>
                              </div>
                              <div>
                                <label className="text-sm font-medium">Mensaje</label>
                                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{selectedMessage.message}</p>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setDeletingMessage(message)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Eliminar
                      </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            )}
        </TabsContent>

        <TabsContent value="read" className="space-y-4">
            {loading ? (
              <div className="text-center py-12">
              <p className="text-muted-foreground">Cargando mensajes...</p>
              </div>
            ) : filteredMessages.filter(m => m.isRead).length === 0 ? (
              <div className="text-center py-12">
              <p className="text-muted-foreground">No hay mensajes leídos</p>
              </div>
            ) : (
            <div className="grid gap-4">
              {filteredMessages.filter(m => m.isRead).map((message) => (
              <Card key={message.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                        <h3 className="text-lg font-semibold">
                          {message.name}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Mail className="w-4 h-4" />
                            {message.email}
                            {message.phone && (
                              <>
                                <span>•</span>
                                <Phone className="w-4 h-4" />
                                {message.phone}
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    <Badge variant="outline" className="bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Leído
                      </Badge>
                    </div>

                    <div className="mb-4">
                    <div className="flex items-start gap-2 text-muted-foreground">
                        <MessageSquare className="w-4 h-4 mt-0.5" />
                        <p className="text-sm">{message.message}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        {formatDate(message.createdAt)}
                      </div>
                      <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setSelectedMessage(message)}>
                          <Eye className="w-4 h-4 mr-2" />
                          Ver detalles
                        </Button>
                        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalles del Mensaje</DialogTitle>
          </DialogHeader>
          {selectedMessage && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Nombre</label>
                                  <p className="text-sm text-muted-foreground">{selectedMessage.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Email</label>
                                  <p className="text-sm text-muted-foreground">{selectedMessage.email}</p>
                </div>
                {selectedMessage.phone && (
                  <div>
                    <label className="text-sm font-medium">Teléfono</label>
                                    <p className="text-sm text-muted-foreground">{selectedMessage.phone}</p>
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium">Fecha</label>
                                  <p className="text-sm text-muted-foreground">{formatDate(selectedMessage.createdAt)}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Mensaje</label>
                                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{selectedMessage.message}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setDeletingMessage(message)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Eliminar
                      </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Dialog de Eliminar Mensaje */}
      {deletingMessage && (
        <Dialog open={!!deletingMessage} onOpenChange={() => setDeletingMessage(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Eliminar Mensaje</DialogTitle>
            </DialogHeader>
            
            <div className="py-4">
              <p className="text-sm text-gray-600">
                ¿Estás seguro de que quieres eliminar el mensaje de 
                <strong> "{deletingMessage.name}"</strong> ({deletingMessage.email})?
              </p>
              <p className="text-sm text-red-600 mt-2 font-medium">
                Esta acción no se puede deshacer.
              </p>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setDeletingMessage(null)}>
                Cancelar
              </Button>
              <Button variant="destructive" onClick={handleDeleteConfirm}>
                Eliminar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Dialog de Marcar como Leído */}
      {updatingMessage && (
        <Dialog open={!!updatingMessage} onOpenChange={() => setUpdatingMessage(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Marcar como Leído</DialogTitle>
            </DialogHeader>
            
            <div className="py-4">
              <p className="text-sm text-gray-600">
                ¿Estás seguro de que quieres marcar como leído el mensaje de 
                <strong> "{updatingMessage.name}"</strong> ({updatingMessage.email})?
              </p>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setUpdatingMessage(null)}>
                Cancelar
              </Button>
              <Button onClick={handleMarkAsReadConfirm}>
                Marcar como Leído
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

