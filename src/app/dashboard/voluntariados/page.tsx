'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Mail, Phone, ExternalLink, Briefcase, Calendar, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { redirect } from 'next/navigation';
import { useSession } from 'next-auth/react';

interface VolunteerApplication {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  age: string;
  occupation: string;
  areaOfInterest: string;
  availability: string;
  motivation: string;
  experience: string | null;
  driveLink: string | null;
  documents: string | null;
  status: 'PENDING' | 'REVIEWING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  updatedAt: string;
}

export default function VoluntariadosPage() {
  const { data: session, status } = useSession();
  const [applications, setApplications] = useState<VolunteerApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedMonth, setSelectedMonth] = useState<string>('all');
  const [selectedApplication, setSelectedApplication] = useState<VolunteerApplication | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [statusChangeDialog, setStatusChangeDialog] = useState<{application: VolunteerApplication, newStatus: string} | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      redirect('/login');
    }
  }, [status]);

  useEffect(() => {
    fetchApplications();
  }, [selectedStatus, selectedYear, selectedMonth]);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      let url = '/api/admin/volunteer-applications?take=100';
      if (selectedStatus !== 'all') {
        url += `&status=${selectedStatus}`;
      }
      
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setApplications(data.applications || []);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Error al cargar aplicaciones');
    } finally {
      setLoading(false);
    }
  };

  const updateApplicationStatus = async (applicationId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/volunteer-applications/${applicationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        toast.success('Estado actualizado correctamente');
        fetchApplications();
        setStatusChangeDialog(null);
      } else {
        toast.error('Error al actualizar el estado');
      }
    } catch (error) {
      console.error('Error updating application:', error);
      toast.error('Error al actualizar el estado');
    }
  };

  const deleteApplication = async (applicationId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta aplicación?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/volunteer-applications/${applicationId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Aplicación eliminada correctamente');
        fetchApplications();
      } else {
        toast.error('Error al eliminar la aplicación');
      }
    } catch (error) {
      console.error('Error deleting application:', error);
      toast.error('Error al eliminar la aplicación');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Pendiente</Badge>;
      case 'REVIEWING':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">En Revisión</Badge>;
      case 'APPROVED':
        return <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Aprobado</Badge>;
      case 'REJECTED':
        return <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">Rechazado</Badge>;
      default:
        return null;
    }
  };

  const getStatusText = (status: string) => {
    const statusMap = {
      PENDING: 'Pendiente',
      REVIEWING: 'Revisando',
      APPROVED: 'Aprobado',
      REJECTED: 'Rechazado',
    };
    return statusMap[status as keyof typeof statusMap] || status;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-BO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Generar años
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  // Generar meses
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

  const filteredApplications = applications.filter((app) => {
    if (selectedYear !== 'all' || selectedMonth !== 'all') {
      const createdDate = new Date(app.createdAt);
      const year = createdDate.getFullYear().toString();
      const month = (createdDate.getMonth() + 1).toString().padStart(2, '0');
      
      if (selectedYear !== 'all' && year !== selectedYear) return false;
      if (selectedMonth !== 'all' && month !== selectedMonth) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Aplicaciones de Voluntariados</h1>
          <p className="text-muted-foreground">
            Gestiona las aplicaciones de voluntarios y pasantes
          </p>
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Estado</label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los estados" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="PENDING">Pendiente</SelectItem>
                  <SelectItem value="REVIEWING">Revisando</SelectItem>
                  <SelectItem value="APPROVED">Aprobado</SelectItem>
                  <SelectItem value="REJECTED">Rechazado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Año</label>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los años" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los años</SelectItem>
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Mes</label>
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los meses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los meses</SelectItem>
                  {months.map((month) => (
                    <SelectItem key={month.value} value={month.value}>
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Aplicaciones */}
      <div className="space-y-4">
        {loading ? (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-text-secondary-light dark:text-text-secondary-dark">
                Cargando aplicaciones...
              </p>
            </CardContent>
          </Card>
        ) : filteredApplications.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-text-secondary-light dark:text-text-secondary-dark">
                No hay aplicaciones para mostrar
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredApplications.map((application) => (
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
                        Área de Interés: {application.areaOfInterest}
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

      {/* Dialog de detalles */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalles de la Aplicación</DialogTitle>
            <DialogDescription>
              Información completa de la aplicación de voluntariado
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
                  <label className="block text-sm font-medium mb-1">Edad</label>
                  <p className="text-sm p-2 bg-muted rounded-md">{selectedApplication.age} años</p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Ocupación</label>
                  <p className="text-sm p-2 bg-muted rounded-md flex items-center gap-2">
                    <Briefcase className="h-4 w-4" />
                    {selectedApplication.occupation}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Área de Interés</label>
                  <Badge variant="outline">{selectedApplication.areaOfInterest}</Badge>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Disponibilidad</label>
                  <p className="text-sm p-2 bg-muted rounded-md">{selectedApplication.availability}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Estado</label>
                  {getStatusBadge(selectedApplication.status)}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Motivación</label>
                <p className="text-sm p-2 bg-muted rounded-md min-h-[80px]">
                  {selectedApplication.motivation}
                </p>
              </div>

              {selectedApplication.experience && (
                <div>
                  <label className="block text-sm font-medium mb-1">Experiencia</label>
                  <p className="text-sm p-2 bg-muted rounded-md min-h-[80px]">
                    {selectedApplication.experience}
                  </p>
                </div>
              )}

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

              {selectedApplication.documents && (
                <div>
                  <label className="block text-sm font-medium mb-1">Documentos</label>
                  <p className="text-sm p-2 bg-muted rounded-md">{selectedApplication.documents}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Fecha de Aplicación</label>
                  <p className="text-sm">{formatDate(selectedApplication.createdAt)}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Última Actualización</label>
                  <p className="text-sm">{formatDate(selectedApplication.updatedAt)}</p>
                </div>
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
              <DialogTitle>Cambiar Estado de Aplicación</DialogTitle>
            </DialogHeader>
            
            <div className="py-4">
              <p className="text-sm text-gray-600">
                ¿Estás seguro de que quieres cambiar el estado de la aplicación de 
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

