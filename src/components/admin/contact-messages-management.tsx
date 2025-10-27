'use client'

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
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
  Filter
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
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'read' | 'unread'>('all');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');

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
      }
    } catch (error) {
      console.error('Error al cargar mensajes:', error);
      toast.error('Error al cargar mensajes');
    } finally {
      setLoading(false);
    }
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

  const handleDelete = async (messageId: string) => {
    try {
      const response = await fetch(`/api/admin/contact-messages/${messageId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        toast.success('Mensaje eliminado correctamente');
        fetchMessages();
      } else {
        throw new Error('Error al eliminar mensaje');
      }
    } catch (error) {
      console.error('Error al eliminar mensaje:', error);
      toast.error('Error al eliminar mensaje');
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

  const unreadCount = messages.filter(m => !m.isRead).length;
  const totalCount = messages.length;

  return (
    <div className="space-y-6">
      {/* Filtros y búsqueda */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por nombre, email o mensaje..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                />
              </div>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as 'all' | 'read' | 'unread')}
                className="px-4 py-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              >
                <option value="all">Todos ({totalCount})</option>
                <option value="unread">No leídos ({unreadCount})</option>
                <option value="read">Leídos ({totalCount - unreadCount})</option>
              </select>
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-2">Mes</label>
                <select
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                >
                  <option value="">Todos</option>
                  {['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'].map((m, i) => (
                    <option key={i} value={String(i + 1).padStart(2, '0')}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium mb-2">Año</label>
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                >
                  <option value="">Todos</option>
                  {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>
              {(month || year) && (
                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setMonth('');
                      setYear('');
                    }}
                    className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                  >
                    Limpiar filtros
                  </button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de mensajes */}
      <div className="grid gap-6">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">Cargando mensajes...</p>
          </div>
        ) : filteredMessages.length === 0 ? (
          <div className="text-center py-12">
            <Mail className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-4 text-gray-600 dark:text-gray-400">No hay mensajes</p>
          </div>
        ) : (
          filteredMessages.map((message) => (
            <Card key={message.id} className={`hover:shadow-lg transition-shadow ${!message.isRead ? 'border-l-4 border-l-blue-500 bg-blue-50 dark:bg-blue-900/10' : ''}`}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {message.name}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
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
                      <Badge className="bg-blue-100 text-blue-800">
                        <Clock className="w-3 h-3 mr-1" />
                        Nuevo
                      </Badge>
                    )}
                    {message.isRead && (
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Leído
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                    <MessageSquare className="w-4 h-4 mt-0.5" />
                    <p className="text-sm">{message.message}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                    <Calendar className="w-4 h-4" />
                    {formatDate(message.createdAt)}
                  </div>
                  <div className="flex gap-2">
                    {!message.isRead && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleMarkAsRead(message.id)}
                        className="bg-green-600 hover:bg-green-700 text-white border-green-600"
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
                                <p className="text-sm text-gray-600 dark:text-gray-400">{selectedMessage.name}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium">Email</label>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{selectedMessage.email}</p>
                              </div>
                              {selectedMessage.phone && (
                                <div>
                                  <label className="text-sm font-medium">Teléfono</label>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">{selectedMessage.phone}</p>
                                </div>
                              )}
                              <div>
                                <label className="text-sm font-medium">Fecha</label>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{formatDate(selectedMessage.createdAt)}</p>
                              </div>
                            </div>
                            <div>
                              <label className="text-sm font-medium">Mensaje</label>
                              <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{selectedMessage.message}</p>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        if (confirm('¿Estás seguro de que deseas eliminar este mensaje?')) {
                          handleDelete(message.id);
                        }
                      }}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Eliminar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

