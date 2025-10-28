'use client'

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  AlertTriangle, 
  Calendar, 
  Eye, 
  Trash2, 
  MapPin,
  User,
  Search,
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
  const [allComplaints, setAllComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [deletingComplaint, setDeletingComplaint] = useState<Complaint | null>(null);
  const [changingStatus, setChangingStatus] = useState<{complaint: Complaint, newStatus: string} | null>(null);
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'PENDING' | 'UNDER_REVIEW' | 'RESOLVED' | 'CLOSED'>('all');
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
        setAllComplaints(data.complaints);
      }
    } catch (error) {
      console.error('Error al cargar denuncias:', error);
      toast.error('Error al cargar denuncias');
    } finally {
      setLoading(false);
    }
  };

  const handleClearSearch = () => {
    setSearchInput('');
    setSearchTerm('');
  };

  const handleTabChange = (value: string) => {
    const statusMap: Record<string, 'all' | 'PENDING' | 'UNDER_REVIEW' | 'RESOLVED' | 'CLOSED'> = {
      'all': 'all',
      'pending': 'PENDING',
      'reviewing': 'UNDER_REVIEW',
      'resolved': 'RESOLVED',
      'closed': 'CLOSED'
    };
    setStatusFilter(statusMap[value] || 'all');
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

  const handleDeleteConfirm = async () => {
    if (!deletingComplaint) return;
    
    try {
      const response = await fetch(`/api/admin/complaints/${deletingComplaint.id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        toast.success('Denuncia eliminada correctamente');
        fetchComplaints();
        setDeletingComplaint(null);
      } else {
        throw new Error('Error al eliminar denuncia');
      }
    } catch (error) {
      console.error('Error al eliminar denuncia:', error);
      toast.error('Error al eliminar denuncia');
    }
  };

  const handleStatusChangeConfirm = async () => {
    if (!changingStatus) return;
    
    try {
      const response = await fetch(`/api/admin/complaints/${changingStatus.complaint.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: changingStatus.newStatus })
      });

      if (response.ok) {
        toast.success('Estado de denuncia actualizado');
        fetchComplaints();
        setChangingStatus(null);
      } else {
        throw new Error('Error al actualizar denuncia');
      }
    } catch (error) {
      console.error('Error al actualizar denuncia:', error);
      toast.error('Error al actualizar denuncia');
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

  const pendingCount = allComplaints.filter(c => c.status === 'PENDING').length;
  const underReviewCount = allComplaints.filter(c => c.status === 'UNDER_REVIEW').length;
  const resolvedCount = allComplaints.filter(c => c.status === 'RESOLVED').length;
  const closedCount = allComplaints.filter(c => c.status === 'CLOSED').length;
  const totalCount = allComplaints.length;
  
  // Contador de resultados de búsqueda
  const searchResultsCount = filteredComplaints.length;

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
                placeholder="Buscar por tipo de denuncia, descripción o nombre de contacto..."
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
          <TabsTrigger value="all">Todas ({totalCount})</TabsTrigger>
          <TabsTrigger value="pending">Pendientes ({pendingCount})</TabsTrigger>
          <TabsTrigger value="reviewing">En Revisión ({underReviewCount})</TabsTrigger>
          <TabsTrigger value="resolved">Resueltas ({resolvedCount})</TabsTrigger>
          <TabsTrigger value="closed">Cerradas ({closedCount})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Cargando denuncias...</p>
            </div>
          ) : filteredComplaints.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {searchTerm ? `No se encontraron denuncias para "${searchTerm}"` : 'No se encontraron denuncias'}
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredComplaints.map((complaint) => (
              <Card key={complaint.id} className="border-l-4 border-l-red-500 bg-red-50 dark:bg-red-900/10">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                      <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold">
                        {getComplaintTypeText(complaint.complaintType)}
                      </h3>
                      {complaint.contactName && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
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
                    <div className="flex items-start gap-2 text-muted-foreground">
                    <AlertTriangle className="w-4 h-4 mt-0.5" />
                    <p className="text-sm">{complaint.description.substring(0, 200)}{complaint.description.length > 200 ? '...' : ''}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {complaint.incidentDate && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      Fecha: {complaint.incidentDate}
                    </div>
                  )}
                  {complaint.incidentLocation && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      {complaint.incidentLocation}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    {formatDate(complaint.createdAt)}
                  </div>
                  <div className="flex gap-2">
                    <Select
                      value={complaint.status}
                      onValueChange={(value) => setChangingStatus({complaint, newStatus: value})}
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
                      onClick={() => setDeletingComplaint(complaint)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
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
        
        <TabsContent value="pending" className="space-y-4">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Cargando denuncias...</p>
            </div>
          ) : filteredComplaints.filter(c => c.status === 'PENDING').length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No hay denuncias pendientes</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredComplaints.filter(c => c.status === 'PENDING').map((complaint) => (
                <Card key={complaint.id} className="border-l-4 border-l-red-500 bg-red-50 dark:bg-red-900/10">
                  {/* Same content as "all" tab */}
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="reviewing" className="space-y-4">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Cargando denuncias...</p>
            </div>
          ) : filteredComplaints.filter(c => c.status === 'UNDER_REVIEW').length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No hay denuncias en revisión</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredComplaints.filter(c => c.status === 'UNDER_REVIEW').map((complaint) => (
                <Card key={complaint.id}>
                  {/* Same content as "all" tab */}
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="resolved" className="space-y-4">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Cargando denuncias...</p>
            </div>
          ) : filteredComplaints.filter(c => c.status === 'RESOLVED').length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No hay denuncias resueltas</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredComplaints.filter(c => c.status === 'RESOLVED').map((complaint) => (
                <Card key={complaint.id}>
                  {/* Same content as "all" tab */}
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="closed" className="space-y-4">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Cargando denuncias...</p>
            </div>
          ) : filteredComplaints.filter(c => c.status === 'CLOSED').length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No hay denuncias cerradas</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredComplaints.filter(c => c.status === 'CLOSED').map((complaint) => (
                <Card key={complaint.id}>
                  {/* Same content as "all" tab */}
                </Card>
              ))}
      </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Dialog de Eliminar Denuncia */}
      {deletingComplaint && (
        <Dialog open={!!deletingComplaint} onOpenChange={() => setDeletingComplaint(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Eliminar Denuncia</DialogTitle>
            </DialogHeader>
            
            <div className="py-4">
              <p className="text-sm text-gray-600">
                ¿Estás seguro de que quieres eliminar la denuncia de tipo 
                <strong> "{getComplaintTypeText(deletingComplaint.complaintType)}"</strong>?
                {deletingComplaint.contactName && (
                  <> reportada por <strong> "{deletingComplaint.contactName}"</strong>?</>
                )}
              </p>
              <p className="text-sm text-red-600 mt-2 font-medium">
                Esta acción no se puede deshacer.
              </p>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setDeletingComplaint(null)}>
                Cancelar
              </Button>
              <Button variant="destructive" onClick={handleDeleteConfirm}>
                Eliminar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Dialog de Cambiar Estado */}
      {changingStatus && (
        <Dialog open={!!changingStatus} onOpenChange={() => setChangingStatus(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cambiar Estado de Denuncia</DialogTitle>
            </DialogHeader>
            
            <div className="py-4">
              <p className="text-sm text-gray-600">
                ¿Estás seguro de que quieres cambiar el estado de la denuncia de tipo 
                <strong> "{getComplaintTypeText(changingStatus.complaint.complaintType)}"</strong>?
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Estado actual: <strong>{getStatusBadge(changingStatus.complaint.status)}</strong>
              </p>
              <p className="text-sm text-gray-500">
                Nuevo estado: <strong>{changingStatus.newStatus}</strong>
              </p>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setChangingStatus(null)}>
                Cancelar
              </Button>
              <Button onClick={handleStatusChangeConfirm}>
                Confirmar Cambio
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

