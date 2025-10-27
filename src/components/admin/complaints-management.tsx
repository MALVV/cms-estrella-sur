'use client'

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  AlertTriangle, 
  Calendar, 
  Eye, 
  Trash2, 
  MapPin,
  User,
  Search,
  Filter,
  CheckCircle,
  Clock,
  Mail
} from 'lucide-react';
import { toast } from 'sonner';

interface Complaint {
  id: string;
  complaintType: string;
  description: string;
  incidentDate: string | null;
  incidentLocation: string | null;
  peopleInvolved: string | null;
  evidence: string | null;
  contactName: string | null;
  contactEmail: string | null;
  status: string;
  reviewedAt: string | null;
  reviewedBy: string | null;
  createdAt: string;
  reviewer?: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export function ComplaintsManagement() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'PENDING' | 'UNDER_REVIEW' | 'RESOLVED' | 'CLOSED'>('all');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');

  useEffect(() => {
    fetchComplaints();
  }, [statusFilter, month, year]);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter !== 'all') {
        params.append('status', statusFilter);
      }
      if (month) params.append('month', month);
      if (year) params.append('year', year);
      
      const response = await fetch(`/api/admin/complaints?${params}`);
      if (response.ok) {
        const data = await response.json();
        setComplaints(data.complaints);
      }
    } catch (error) {
      console.error('Error al cargar denuncias:', error);
      toast.error('Error al cargar denuncias');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (complaintId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/complaints/${complaintId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        toast.success('Estado de denuncia actualizado');
        fetchComplaints();
      } else {
        throw new Error('Error al actualizar denuncia');
      }
    } catch (error) {
      console.error('Error al actualizar denuncia:', error);
      toast.error('Error al actualizar denuncia');
    }
  };

  const handleDelete = async (complaintId: string) => {
    try {
      const response = await fetch(`/api/admin/complaints/${complaintId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        toast.success('Denuncia eliminada correctamente');
        fetchComplaints();
      } else {
        throw new Error('Error al eliminar denuncia');
      }
    } catch (error) {
      console.error('Error al eliminar denuncia:', error);
      toast.error('Error al eliminar denuncia');
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

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, text: 'Pendiente' },
      UNDER_REVIEW: { color: 'bg-blue-100 text-blue-800', icon: Eye, text: 'En revisión' },
      RESOLVED: { color: 'bg-green-100 text-green-800', icon: CheckCircle, text: 'Resuelta' },
      CLOSED: { color: 'bg-gray-100 text-gray-800', icon: CheckCircle, text: 'Cerrada' }
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config.icon;

    return (
      <Badge className={config.color}>
        <Icon className="w-3 h-3 mr-1" />
        {config.text}
      </Badge>
    );
  };

  const getComplaintTypeText = (type: string) => {
    const types: Record<string, string> = {
      maltrato: 'Maltrato o abuso',
      corrupcion: 'Corrupción o malversación',
      discriminacion: 'Discriminación',
      acoso: 'Acoso o intimidación',
      negligencia: 'Negligencia en el servicio',
      violencia: 'Violencia',
      otro: 'Otro'
    };
    return types[type] || type;
  };

  const filteredComplaints = complaints.filter(complaint => 
    complaint.complaintType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    complaint.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (complaint.contactName && complaint.contactName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const pendingCount = complaints.filter(c => c.status === 'PENDING').length;
  const totalCount = complaints.length;

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
                  placeholder="Buscar por tipo, descripción o nombre..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
                className="px-4 py-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              >
                <option value="all">Todos ({totalCount})</option>
                <option value="PENDING">Pendientes ({pendingCount})</option>
                <option value="UNDER_REVIEW">En revisión</option>
                <option value="RESOLVED">Resueltas</option>
                <option value="CLOSED">Cerradas</option>
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

      {/* Lista de denuncias */}
      <div className="grid gap-6">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">Cargando denuncias...</p>
          </div>
        ) : filteredComplaints.length === 0 ? (
          <div className="text-center py-12">
            <AlertTriangle className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-4 text-gray-600 dark:text-gray-400">No hay denuncias</p>
          </div>
        ) : (
          filteredComplaints.map((complaint) => (
            <Card key={complaint.id} className={`hover:shadow-lg transition-shadow ${complaint.status === 'PENDING' ? 'border-l-4 border-l-red-500 bg-red-50 dark:bg-red-900/10' : ''}`}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                      <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {getComplaintTypeText(complaint.complaintType)}
                      </h3>
                      {complaint.contactName && (
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <User className="w-4 h-4" />
                          {complaint.contactName}
                          {complaint.contactEmail && (
                            <>
                              <span>•</span>
                              <Mail className="w-4 h-4" />
                              {complaint.contactEmail}
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(complaint.status)}
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                    <AlertTriangle className="w-4 h-4 mt-0.5 text-red-600 dark:text-red-400" />
                    <p className="text-sm">{complaint.description.substring(0, 200)}{complaint.description.length > 200 ? '...' : ''}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {complaint.incidentDate && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Calendar className="w-4 h-4" />
                      Fecha: {complaint.incidentDate}
                    </div>
                  )}
                  {complaint.incidentLocation && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <MapPin className="w-4 h-4" />
                      {complaint.incidentLocation}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                    <Calendar className="w-4 h-4" />
                    {formatDate(complaint.createdAt)}
                  </div>
                  <div className="flex gap-2">
                    <Select
                      value={complaint.status}
                      onValueChange={(value) => handleStatusChange(complaint.id, value)}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PENDING">Pendiente</SelectItem>
                        <SelectItem value="UNDER_REVIEW">En revisión</SelectItem>
                        <SelectItem value="RESOLVED">Resuelta</SelectItem>
                        <SelectItem value="CLOSED">Cerrada</SelectItem>
                      </SelectContent>
                    </Select>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setSelectedComplaint(complaint)}>
                          <Eye className="w-4 h-4 mr-2" />
                          Ver detalles
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Detalles de la Denuncia</DialogTitle>
                        </DialogHeader>
                        {selectedComplaint && (
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-sm font-medium">Tipo de Denuncia</label>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{getComplaintTypeText(selectedComplaint.complaintType)}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium">Estado</label>
                                <div className="text-sm">{getStatusBadge(selectedComplaint.status)}</div>
                              </div>
                              {selectedComplaint.incidentDate && (
                                <div>
                                  <label className="text-sm font-medium">Fecha del Incidente</label>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">{selectedComplaint.incidentDate}</p>
                                </div>
                              )}
                              {selectedComplaint.incidentLocation && (
                                <div>
                                  <label className="text-sm font-medium">Lugar del Incidente</label>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">{selectedComplaint.incidentLocation}</p>
                                </div>
                              )}
                              {selectedComplaint.contactName && (
                                <div>
                                  <label className="text-sm font-medium">Nombre de Contacto</label>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">{selectedComplaint.contactName}</p>
                                </div>
                              )}
                              {selectedComplaint.contactEmail && (
                                <div>
                                  <label className="text-sm font-medium">Email de Contacto</label>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">{selectedComplaint.contactEmail}</p>
                                </div>
                              )}
                            </div>
                            <div>
                              <label className="text-sm font-medium">Descripción</label>
                              <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{selectedComplaint.description}</p>
                            </div>
                            {selectedComplaint.peopleInvolved && (
                              <div>
                                <label className="text-sm font-medium">Personas Involucradas</label>
                                <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{selectedComplaint.peopleInvolved}</p>
                              </div>
                            )}
                            {selectedComplaint.evidence && (
                              <div>
                                <label className="text-sm font-medium">Evidencias</label>
                                <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{selectedComplaint.evidence}</p>
                              </div>
                            )}
                            {selectedComplaint.reviewer && (
                              <div>
                                <label className="text-sm font-medium">Revisado por</label>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  {selectedComplaint.reviewer.name} ({selectedComplaint.reviewer.email})
                                </p>
                              </div>
                            )}
                            {selectedComplaint.reviewedAt && (
                              <div>
                                <label className="text-sm font-medium">Fecha de Revisión</label>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{formatDate(selectedComplaint.reviewedAt)}</p>
                              </div>
                            )}
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        if (confirm('¿Estás seguro de que deseas eliminar esta denuncia?')) {
                          handleDelete(complaint.id);
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

