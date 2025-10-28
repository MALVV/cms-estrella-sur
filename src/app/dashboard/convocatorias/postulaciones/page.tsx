'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Mail, Phone, ExternalLink, CheckCircle, XCircle, Clock, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

interface Application {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  experience: string;
  driveLink: string | null;
  status: 'PENDING' | 'REVIEWING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  convocatoria: {
    id: string;
    title: string;
  };
}

export default function PostulacionesPage() {
  const { data: session, status } = useSession();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedConvocatoria, setSelectedConvocatoria] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedMonth, setSelectedMonth] = useState<string>('all');
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [statusChangeDialog, setStatusChangeDialog] = useState<{application: Application, newStatus: string} | null>(null);
  const [convocatorias, setConvocatorias] = useState<Array<{ id: string; title: string }>>([]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      redirect('/login');
    }
  }, [status]);

  useEffect(() => {
    fetchApplications();
    fetchConvocatorias();
  }, [selectedStatus, selectedConvocatoria, selectedYear, selectedMonth]);

  const fetchConvocatorias = async () => {
    try {
      const response = await fetch('/api/admin/convocatorias?limit=100');
      if (response.ok) {
        const data = await response.json();
        setConvocatorias(data.convocatorias || []);
      }
    } catch (error) {
      console.error('Error fetching convocatorias:', error);
    }
  };

  const fetchApplications = async () => {
    setLoading(true);
    try {
      let url = '/api/admin/convocatorias/applications?limit=50';
      if (selectedStatus !== 'all') {
        url += `&status=${selectedStatus}`;
      }
      if (selectedConvocatoria !== 'all') {
        url += `&convocatoriaId=${selectedConvocatoria}`;
      }
      if (selectedYear !== 'all') {
        url += `&year=${selectedYear}`;
      }
      if (selectedMonth !== 'all') {
        url += `&month=${selectedMonth}`;
      }
      
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setApplications(data.applications || []);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Error al cargar postulaciones');
    } finally {
      setLoading(false);
    }
  };

  const updateApplicationStatus = async (applicationId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/convocatorias/applications/${applicationId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        toast.success('Estado actualizado exitosamente');
        fetchApplications();
        setDialogOpen(false);
        setStatusChangeDialog(null);
      } else {
        toast.error('Error al actualizar el estado');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Error al actualizar el estado');
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING': return 'Pendiente';
      case 'REVIEWING': return 'En Revisión';
      case 'APPROVED': return 'Aprobada';
      case 'REJECTED': return 'Rechazada';
      default: return status;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Pendiente</Badge>;
      case 'REVIEWING':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">En Revisión</Badge>;
      case 'APPROVED':
        return <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Aprobada</Badge>;
      case 'REJECTED':
        return <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">Rechazada</Badge>;
      default:
        return null;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="h-4 w-4" />;
      case 'REVIEWING':
        return <Eye className="h-4 w-4" />;
      case 'APPROVED':
        return <CheckCircle className="h-4 w-4" />;
      case 'REJECTED':
        return <XCircle className="h-4 w-4" />;
      default:
        return null;
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

  // Generar años disponibles (últimos 5 años)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i).map(year => year.toString());

  // Meses del año
  const months = [
    { value: '1', label: 'Enero' },
    { value: '2', label: 'Febrero' },
    { value: '3', label: 'Marzo' },
    { value: '4', label: 'Abril' },
    { value: '5', label: 'Mayo' },
    { value: '6', label: 'Junio' },
    { value: '7', label: 'Julio' },
    { value: '8', label: 'Agosto' },
    { value: '9', label: 'Septiembre' },
    { value: '10', label: 'Octubre' },
    { value: '11', label: 'Noviembre' },
    { value: '12', label: 'Diciembre' },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 animate-pulse"></div>
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Postulaciones de Convocatorias</h1>
          <p className="text-text-secondary-light dark:text-text-secondary-dark mt-2">
            Gestiona las postulaciones recibidas para las convocatorias
          </p>
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Estado</label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los estados" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="PENDING">Pendiente</SelectItem>
                  <SelectItem value="REVIEWING">En Revisión</SelectItem>
                  <SelectItem value="APPROVED">Aprobada</SelectItem>
                  <SelectItem value="REJECTED">Rechazada</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Convocatoria</label>
              <Select value={selectedConvocatoria} onValueChange={setSelectedConvocatoria}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas las convocatorias" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  {convocatorias.map((conv) => (
                    <SelectItem key={conv.id} value={conv.id}>{conv.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Año</label>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
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

            <div>
              <label className="block text-sm font-medium mb-2">Mes</label>
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
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
          </div>
        </CardContent>
      </Card>

      {/* Lista de Postulaciones */}
      <div className="space-y-4">
        {applications.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-text-secondary-light dark:text-text-secondary-dark">
                No hay postulaciones para mostrar
              </p>
            </CardContent>
          </Card>
        ) : (
          applications.map((application) => (
            <Card key={application.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-xl font-semibold">{application.fullName}</h3>
                      {getStatusBadge(application.status)}
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <span>{application.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <span>{application.phone}</span>
                      </div>
                      <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mt-2">
                        Convocatoria: {application.convocatoria.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        Postulado: {formatDate(application.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Select
                      value={application.status}
                      onValueChange={(value) => setStatusChangeDialog({application, newStatus: value})}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PENDING">Pendiente</SelectItem>
                        <SelectItem value="REVIEWING">En Revisión</SelectItem>
                        <SelectItem value="APPROVED">Aprobada</SelectItem>
                        <SelectItem value="REJECTED">Rechazada</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedApplication(application);
                        setDialogOpen(true);
                      }}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Ver Detalles
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Dialog de Detalles */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalles de la Postulación</DialogTitle>
            <DialogDescription>
              Información completa de la postulación
            </DialogDescription>
          </DialogHeader>
          
          {selectedApplication && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Nombre Completo</label>
                  <p className="text-sm p-2 bg-muted rounded-md">{selectedApplication.fullName}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <p className="text-sm p-2 bg-muted rounded-md flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    {selectedApplication.email}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Teléfono</label>
                  <p className="text-sm p-2 bg-muted rounded-md flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    {selectedApplication.phone}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Estado</label>
                  {getStatusBadge(selectedApplication.status)}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Convocatoria</label>
                  <p className="text-sm p-2 bg-muted rounded-md">{selectedApplication.convocatoria.title}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Experiencia</label>
                <p className="text-sm p-2 bg-muted rounded-md min-h-[80px] whitespace-pre-wrap">
                  {selectedApplication.experience}
                </p>
              </div>

              {selectedApplication.driveLink && (
                <div>
                  <label className="block text-sm font-medium mb-1">Enlace de Google Drive</label>
                  <a
                    href={selectedApplication.driveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline flex items-center gap-2"
                  >
                    {selectedApplication.driveLink}
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-1">Fecha de Postulación</label>
                <p className="text-sm">{formatDate(selectedApplication.createdAt)}</p>
              </div>

            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog de Cambiar Estado */}
      {statusChangeDialog && (
        <Dialog open={!!statusChangeDialog} onOpenChange={() => setStatusChangeDialog(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cambiar Estado de Postulación</DialogTitle>
            </DialogHeader>
            
            <div className="py-4">
              <p className="text-sm text-gray-600">
                ¿Estás seguro de que quieres cambiar el estado de la postulación de 
                <strong> "{statusChangeDialog.application.fullName}"</strong>?
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Estado actual: <strong>{getStatusText(statusChangeDialog.application.status)}</strong>
              </p>
              <p className="text-sm text-gray-500">
                Nuevo estado: <strong>{getStatusText(statusChangeDialog.newStatus)}</strong>
              </p>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setStatusChangeDialog(null)}>
                Cancelar
              </Button>
              <Button onClick={() => updateApplicationStatus(statusChangeDialog.application.id, statusChangeDialog.newStatus)}>
                Confirmar Cambio
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

