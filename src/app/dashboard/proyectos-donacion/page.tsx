'use client'

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Plus,
  Edit,
  Trash2,
  Target,
  DollarSign,
  TrendingUp,
  Users,
  Calendar,
  CreditCard,
  QrCode,
  Eye,
  Search,
  Filter,
  Download,
  Power,
  PowerOff
} from 'lucide-react';
import { toast } from 'sonner';
import { ToggleDonationProjectStatusDialog } from '@/components/admin/toggle-donation-project-status-dialog';
import { DeleteDonationProjectDialog } from '@/components/admin/delete-donation-project-dialog';

interface DonationProject {
  id: string;
  title: string;
  description: string;
  context: string;
  objectives: string;
  executionStart: string;
  executionEnd: string;
  accountNumber: string;
  recipientName: string;
  qrImageUrl?: string;
  qrImageAlt?: string;
  referenceImageUrl?: string;
  referenceImageAlt?: string;
  targetAmount?: number;
  currentAmount: number;
  isActive: boolean;
  isCompleted: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
  donations: Array<{
    amount: number;
    createdAt: string;
  }>;
}

interface DonationProjectForm {
  projectTitle: string;
  projectDescription: string;
  accountNumber: string;
  recipientName: string;
  qrImageUrl: string;
  qrImageAlt: string;
  referenceImageUrl: string;
  referenceImageAlt: string;
  targetAmount: string;
  isActive: boolean;
}

export default function ProyectosDonacionDashboardPage() {
  const [donationProjects, setDonationProjects] = useState<DonationProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<DonationProject | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const [formData, setFormData] = useState<DonationProjectForm>({
    projectTitle: '',
    projectDescription: '',
    accountNumber: '',
    recipientName: '',
    qrImageUrl: '',
    qrImageAlt: '',
    referenceImageUrl: '',
    referenceImageAlt: '',
    targetAmount: '',
    isActive: true
  });

  useEffect(() => {
    fetchDonationProjects();
  }, []);

  const fetchDonationProjects = async () => {
    try {
      const response = await fetch('/api/donation-projects');
      if (response.ok) {
        const data = await response.json();
        setDonationProjects(data);
      }
    } catch (error) {
      console.error('Error al cargar proyectos de donación:', error);
      toast.error('Error al cargar proyectos de donación');
    } finally {
      setLoading(false);
    }
  };


  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Crear directamente el proyecto de donación
      const donationProjectResponse = await fetch('/api/donation-projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.projectTitle,
          description: formData.projectDescription,
          context: formData.projectDescription,
          objectives: 'Proyecto de donación',
          executionStart: new Date().toISOString(),
          executionEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 año desde ahora
          accountNumber: formData.accountNumber,
          recipientName: formData.recipientName,
          qrImageUrl: formData.qrImageUrl || null,
          qrImageAlt: formData.qrImageAlt || null,
          referenceImageUrl: formData.referenceImageUrl || null,
          referenceImageAlt: formData.referenceImageAlt || null,
          targetAmount: formData.targetAmount ? parseFloat(formData.targetAmount) : null,
          isActive: formData.isActive
        }),
      });

      if (donationProjectResponse.ok) {
        toast.success('Proyecto de donación creado exitosamente');
        fetchDonationProjects();
        setIsCreateDialogOpen(false);
        resetForm();
      } else {
        const error = await donationProjectResponse.json();
        toast.error(error.error || 'Error al crear proyecto de donación');
      }
    } catch (error) {
      console.error('Error al crear proyecto:', error);
      toast.error('Error al crear proyecto de donación');
    }
  };

  const handleEditProject = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedProject) return;

    try {
      const response = await fetch(`/api/donation-projects/${selectedProject.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          targetAmount: formData.targetAmount ? parseFloat(formData.targetAmount) : null
        }),
      });

      if (response.ok) {
        toast.success('Proyecto de donación actualizado exitosamente');
        fetchDonationProjects();
        setIsEditDialogOpen(false);
        resetForm();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Error al actualizar proyecto de donación');
      }
    } catch (error) {
      console.error('Error al actualizar proyecto:', error);
      toast.error('Error al actualizar proyecto de donación');
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    setDonationProjects(prev => prev.filter(p => p.id !== projectId));
  };


  const handleToggleStatus = async (projectId: string, newStatus: boolean) => {
    setDonationProjects(prev => 
      prev.map(p => p.id === projectId ? { ...p, isActive: newStatus } : p)
    );
  };


  const resetForm = () => {
    setFormData({
      projectTitle: '',
      projectDescription: '',
      accountNumber: '',
      recipientName: '',
      qrImageUrl: '',
      qrImageAlt: '',
      referenceImageUrl: '',
      referenceImageAlt: '',
      targetAmount: '',
      isActive: true
    });
  };

  const openEditDialog = (project: DonationProject) => {
    setSelectedProject(project);
    setFormData({
      projectTitle: project.title,
      projectDescription: project.context,
      accountNumber: project.accountNumber,
      recipientName: project.recipientName,
      qrImageUrl: project.qrImageUrl || '',
      qrImageAlt: project.qrImageAlt || '',
      referenceImageUrl: project.referenceImageUrl || '',
      referenceImageAlt: project.referenceImageAlt || '',
      targetAmount: project.targetAmount?.toString() || '',
      isActive: project.isActive
    });
    setIsEditDialogOpen(true);
  };

  const formatCurrency = (amount: number | string) => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return `Bs. ${numAmount.toLocaleString('es-BO', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateProgress = (current: number | string, target?: number | string) => {
    if (!target) return 0;
    const numCurrent = typeof current === 'string' ? parseFloat(current) : current;
    const numTarget = typeof target === 'string' ? parseFloat(target) : target;
    return Math.min((numCurrent / numTarget) * 100, 100);
  };

  const filteredProjects = donationProjects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.accountNumber.includes(searchTerm) ||
                         project.recipientName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && project.isActive) ||
                         (statusFilter === 'inactive' && !project.isActive);
    
    return matchesSearch && matchesStatus;
  });

  const totalProjects = donationProjects.length;
  const activeProjects = donationProjects.filter(p => p.isActive).length;
  const totalAmount = donationProjects.reduce((sum, p) => sum + Number(p.currentAmount), 0);
  const totalDonations = donationProjects.reduce((sum, p) => sum + p.donations.length, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Proyectos de Donación
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gestiona los proyectos que pueden recibir donaciones
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Nuevo Proyecto
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Crear Proyecto de Donación</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateProject} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="projectTitle">Título del Proyecto *</Label>
                    <Input
                      id="projectTitle"
                      value={formData.projectTitle}
                      onChange={(e) => setFormData(prev => ({ ...prev, projectTitle: e.target.value }))}
                      placeholder="Nombre del proyecto de donación"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="targetAmount">Meta de Recaudación (Bs.)</Label>
                    <Input
                      id="targetAmount"
                      type="number"
                      value={formData.targetAmount}
                      onChange={(e) => setFormData(prev => ({ ...prev, targetAmount: e.target.value }))}
                      placeholder="50000"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="projectDescription">Descripción del Proyecto *</Label>
                  <Textarea
                    id="projectDescription"
                    value={formData.projectDescription}
                    onChange={(e) => setFormData(prev => ({ ...prev, projectDescription: e.target.value }))}
                    placeholder="Describe el proyecto y su impacto..."
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="accountNumber">Número de Cuenta *</Label>
                  <Input
                    id="accountNumber"
                    value={formData.accountNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, accountNumber: e.target.value }))}
                    placeholder="1234567890123456"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="recipientName">Nombre del Destinatario *</Label>
                  <Input
                    id="recipientName"
                    value={formData.recipientName}
                    onChange={(e) => setFormData(prev => ({ ...prev, recipientName: e.target.value }))}
                    placeholder="Fundación Estrella del Sur"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="qrImageUrl">URL de Imagen QR</Label>
                    <Input
                      id="qrImageUrl"
                      value={formData.qrImageUrl}
                      onChange={(e) => setFormData(prev => ({ ...prev, qrImageUrl: e.target.value }))}
                      placeholder="https://ejemplo.com/qr.png"
                    />
                  </div>

                  <div>
                    <Label htmlFor="qrImageAlt">Alt Text de Imagen QR</Label>
                    <Input
                      id="qrImageAlt"
                      value={formData.qrImageAlt}
                      onChange={(e) => setFormData(prev => ({ ...prev, qrImageAlt: e.target.value }))}
                      placeholder="Código QR para pago"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="referenceImageUrl">URL de Imagen de Referencia</Label>
                    <Input
                      id="referenceImageUrl"
                      value={formData.referenceImageUrl}
                      onChange={(e) => setFormData(prev => ({ ...prev, referenceImageUrl: e.target.value }))}
                      placeholder="https://ejemplo.com/referencia.jpg"
                    />
                  </div>

                  <div>
                    <Label htmlFor="referenceImageAlt">Alt Text de Imagen de Referencia</Label>
                    <Input
                      id="referenceImageAlt"
                      value={formData.referenceImageAlt}
                      onChange={(e) => setFormData(prev => ({ ...prev, referenceImageAlt: e.target.value }))}
                      placeholder="Imagen de referencia del proyecto"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                    className="rounded"
                  />
                  <Label htmlFor="isActive">Proyecto activo</Label>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button type="submit">
                    Crear Proyecto
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancelar
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Target className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Proyectos</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalProjects}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Proyectos Activos</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{activeProjects}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Donaciones</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalDonations}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                <DollarSign className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Recaudado</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(totalAmount)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros y búsqueda */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por proyecto, cuenta o destinatario..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="active">Activos</SelectItem>
                <SelectItem value="inactive">Inactivos</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de proyectos */}
      <div className="grid gap-6">
        {filteredProjects.map((project) => (
          <Card key={project.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {project.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Cuenta: {project.accountNumber} • Destinatario: {project.recipientName}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={project.isActive ? "default" : "secondary"}>
                    {project.isActive ? 'Activo' : 'Inactivo'}
                  </Badge>
                  <div className="flex gap-1">
                    <ToggleDonationProjectStatusDialog
                      project={project}
                      onStatusChanged={handleToggleStatus}
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        className={project.isActive ? "text-orange-600 hover:text-orange-700" : "text-green-600 hover:text-green-700"}
                        title={project.isActive ? "Desactivar proyecto" : "Activar proyecto"}
                      >
                        {project.isActive ? <PowerOff className="w-4 h-4" /> : <Power className="w-4 h-4" />}
                      </Button>
                    </ToggleDonationProjectStatusDialog>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditDialog(project)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <DeleteDonationProjectDialog
                      project={project}
                      onProjectDeleted={handleDeleteProject}
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </DeleteDonationProjectDialog>
                  </div>
                </div>
              </div>

              {project.targetAmount && (
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Progreso de recaudación</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {formatCurrency(project.currentAmount)} / {formatCurrency(project.targetAmount)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${calculateProgress(project.currentAmount, project.targetAmount)}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    {Math.round(calculateProgress(project.currentAmount, project.targetAmount))}% completado
                  </p>
                </div>
              )}

              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-4 w-4" />
                  {project.donations.length} donaciones
                </div>
                <div className="flex items-center gap-1">
                  <DollarSign className="w-4 h-4" />
                  Total recaudado: {formatCurrency(project.currentAmount)}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Creado: {formatDate(project.createdAt)}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Dialog para editar proyecto */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Proyecto de Donación</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditProject} className="space-y-4">
            <div>
              <Label htmlFor="edit-targetAmount">Meta de Recaudación (Bs.)</Label>
              <Input
                id="edit-targetAmount"
                type="number"
                value={formData.targetAmount}
                onChange={(e) => setFormData(prev => ({ ...prev, targetAmount: e.target.value }))}
                placeholder="50000"
              />
            </div>

            <div>
              <Label htmlFor="edit-accountNumber">Número de Cuenta *</Label>
              <Input
                id="edit-accountNumber"
                value={formData.accountNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, accountNumber: e.target.value }))}
                placeholder="1234567890123456"
                required
              />
            </div>

            <div>
              <Label htmlFor="edit-recipientName">Nombre del Destinatario *</Label>
              <Input
                id="edit-recipientName"
                value={formData.recipientName}
                onChange={(e) => setFormData(prev => ({ ...prev, recipientName: e.target.value }))}
                placeholder="Fundación Estrella del Sur"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-qrImageUrl">URL de Imagen QR</Label>
                <Input
                  id="edit-qrImageUrl"
                  value={formData.qrImageUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, qrImageUrl: e.target.value }))}
                  placeholder="https://ejemplo.com/qr.png"
                />
              </div>

              <div>
                <Label htmlFor="edit-qrImageAlt">Alt Text de Imagen QR</Label>
                <Input
                  id="edit-qrImageAlt"
                  value={formData.qrImageAlt}
                  onChange={(e) => setFormData(prev => ({ ...prev, qrImageAlt: e.target.value }))}
                  placeholder="Código QR para pago"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-referenceImageUrl">URL de Imagen de Referencia</Label>
                <Input
                  id="edit-referenceImageUrl"
                  value={formData.referenceImageUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, referenceImageUrl: e.target.value }))}
                  placeholder="https://ejemplo.com/referencia.jpg"
                />
              </div>

              <div>
                <Label htmlFor="edit-referenceImageAlt">Alt Text de Imagen de Referencia</Label>
                <Input
                  id="edit-referenceImageAlt"
                  value={formData.referenceImageAlt}
                  onChange={(e) => setFormData(prev => ({ ...prev, referenceImageAlt: e.target.value }))}
                  placeholder="Imagen de referencia del proyecto"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="edit-isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                className="rounded"
              />
              <Label htmlFor="edit-isActive">Proyecto activo</Label>
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit">
                Actualizar Proyecto
              </Button>
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancelar
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
