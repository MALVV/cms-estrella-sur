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
import { useToast } from '@/components/ui/use-toast';
import { ToggleDonationProjectStatusDialog } from '@/components/admin/toggle-donation-project-status-dialog';
import { DeleteDonationProjectDialog } from '@/components/admin/delete-donation-project-dialog';
import Image from 'next/image';
import { Upload, X, ImageIcon } from 'lucide-react';

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
  const [uploading, setUploading] = useState(false);
  
  // Estados para QR
  const [selectedQrFile, setSelectedQrFile] = useState<File | null>(null);
  const [qrPreviewUrl, setQrPreviewUrl] = useState<string>('');
  const [qrMarkedForDeletion, setQrMarkedForDeletion] = useState(false);
  
  // Estados para imagen de referencia
  const [selectedReferenceFile, setSelectedReferenceFile] = useState<File | null>(null);
  const [referencePreviewUrl, setReferencePreviewUrl] = useState<string>('');
  const [referenceMarkedForDeletion, setReferenceMarkedForDeletion] = useState(false);
  
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
  
  const { toast } = useToast();

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
      toast({
        title: 'Error',
        description: 'Error al cargar proyectos de donación',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };


  const handleQrFileUpload = async (file: File) => {
    try {
      const maxMb = Number(process.env.NEXT_PUBLIC_MAX_UPLOAD_MB || process.env.MAX_UPLOAD_MB || 20);
      const maxBytes = maxMb * 1024 * 1024;
      const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

      if (!allowed.includes(file.type)) {
        throw new Error('Formato no permitido. Usa JPG, PNG, WEBP o GIF');
      }
      if (file.size > maxBytes) {
        throw new Error(`El archivo es demasiado grande. Máximo ${maxMb}MB`);
      }

    const reader = new FileReader();
    reader.onloadend = () => {
      setQrPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
    setSelectedQrFile(file);
      setQrMarkedForDeletion(false);
    toast({
      title: 'Imagen QR seleccionada',
        description: 'La imagen se subirá al bucket al guardar el proyecto',
    });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Error al procesar la imagen',
        variant: 'destructive',
      });
    }
  };

  const handleReferenceFileUpload = async (file: File) => {
    try {
      const maxMb = Number(process.env.NEXT_PUBLIC_MAX_UPLOAD_MB || process.env.MAX_UPLOAD_MB || 20);
      const maxBytes = maxMb * 1024 * 1024;
      const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

      if (!allowed.includes(file.type)) {
        throw new Error('Formato no permitido. Usa JPG, PNG, WEBP o GIF');
      }
      if (file.size > maxBytes) {
        throw new Error(`El archivo es demasiado grande. Máximo ${maxMb}MB`);
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setReferencePreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
    setSelectedReferenceFile(file);
      setReferenceMarkedForDeletion(false);
    toast({
      title: 'Imagen de referencia seleccionada',
        description: 'La imagen se subirá al bucket al guardar el proyecto',
    });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Error al procesar la imagen',
        variant: 'destructive',
      });
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(false);
    
    try {
      let finalQrImageUrl = formData.qrImageUrl;
      let finalQrImageAlt = formData.qrImageAlt;
      let finalReferenceImageUrl = formData.referenceImageUrl;
      let finalReferenceImageAlt = formData.referenceImageAlt;

      // Subir QR si se seleccionó uno
      if (selectedQrFile) {
        setUploading(true);
        try {
          const formDataToUpload = new FormData();
          formDataToUpload.append('file', selectedQrFile);

          const uploadResponse = await fetch('/api/donation-projects/upload-qr', {
            method: 'POST',
            body: formDataToUpload,
          });

          if (!uploadResponse.ok) {
            const error = await uploadResponse.json();
            throw new Error(error.error || 'Error al subir imagen QR');
          }

          const uploadData = await uploadResponse.json();
          finalQrImageUrl = uploadData.url;
          finalQrImageAlt = uploadData.alt || selectedQrFile.name;
        } catch (error) {
          console.error('Error uploading QR:', error);
          toast({
            title: 'Error',
            description: error instanceof Error ? error.message : 'Error al subir la imagen QR',
            variant: 'destructive',
          });
          setUploading(false);
          return;
        } finally {
          setUploading(false);
        }
      }

      // Subir imagen de referencia si se seleccionó una
      if (selectedReferenceFile) {
        setUploading(true);
        try {
          const formDataToUpload = new FormData();
          formDataToUpload.append('file', selectedReferenceFile);

          const uploadResponse = await fetch('/api/donation-projects/upload-reference', {
            method: 'POST',
            body: formDataToUpload,
          });

          if (!uploadResponse.ok) {
            const error = await uploadResponse.json();
            throw new Error(error.error || 'Error al subir imagen de referencia');
          }

          const uploadData = await uploadResponse.json();
          finalReferenceImageUrl = uploadData.url;
          finalReferenceImageAlt = uploadData.alt || selectedReferenceFile.name;
        } catch (error) {
          console.error('Error uploading reference image:', error);
          toast({
            title: 'Error',
            description: error instanceof Error ? error.message : 'Error al subir la imagen de referencia',
            variant: 'destructive',
          });
          setUploading(false);
          return;
        } finally {
          setUploading(false);
        }
      }

      // Crear el proyecto de donación
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
          qrImageUrl: finalQrImageUrl || null,
          qrImageAlt: finalQrImageAlt || null,
          referenceImageUrl: finalReferenceImageUrl || null,
          referenceImageAlt: finalReferenceImageAlt || null,
          targetAmount: formData.targetAmount ? parseFloat(formData.targetAmount) : null,
          isActive: formData.isActive
        }),
      });

      if (donationProjectResponse.ok) {
        toast({
          title: 'Éxito',
          description: 'Proyecto de donación creado exitosamente',
        });
        fetchDonationProjects();
        setIsCreateDialogOpen(false);
        resetForm();
      } else {
        const error = await donationProjectResponse.json();
        toast({
          title: 'Error',
          description: error.error || 'Error al crear proyecto de donación',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error al crear proyecto:', error);
      toast({
        title: 'Error',
        description: 'Error al crear proyecto de donación',
        variant: 'destructive',
      });
    }
  };

  const handleEditProject = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedProject) return;

    setUploading(false);

    try {
      let finalQrImageUrl = formData.qrImageUrl;
      let finalQrImageAlt = formData.qrImageAlt;
      let finalReferenceImageUrl = formData.referenceImageUrl;
      let finalReferenceImageAlt = formData.referenceImageAlt;

      // Subir QR si se seleccionó uno nuevo
      if (selectedQrFile) {
        setUploading(true);
        try {
          const formDataToUpload = new FormData();
          formDataToUpload.append('file', selectedQrFile);

          const uploadResponse = await fetch('/api/donation-projects/upload-qr', {
            method: 'POST',
            body: formDataToUpload,
          });

          if (!uploadResponse.ok) {
            const error = await uploadResponse.json();
            throw new Error(error.error || 'Error al subir imagen QR');
          }

          const uploadData = await uploadResponse.json();
          finalQrImageUrl = uploadData.url;
          finalQrImageAlt = uploadData.alt || selectedQrFile.name;
        } catch (error) {
          console.error('Error uploading QR:', error);
          toast({
            title: 'Error',
            description: error instanceof Error ? error.message : 'Error al subir la imagen QR',
            variant: 'destructive',
          });
          setUploading(false);
          return;
        } finally {
          setUploading(false);
        }
      } else if (qrMarkedForDeletion) {
        // Si se marcó para eliminar, establecer como null
        finalQrImageUrl = null as any;
        finalQrImageAlt = null as any;
      }

      // Subir imagen de referencia si se seleccionó una nueva
      if (selectedReferenceFile) {
        setUploading(true);
        try {
          const formDataToUpload = new FormData();
          formDataToUpload.append('file', selectedReferenceFile);

          const uploadResponse = await fetch('/api/donation-projects/upload-reference', {
            method: 'POST',
            body: formDataToUpload,
          });

          if (!uploadResponse.ok) {
            const error = await uploadResponse.json();
            throw new Error(error.error || 'Error al subir imagen de referencia');
          }

          const uploadData = await uploadResponse.json();
          finalReferenceImageUrl = uploadData.url;
          finalReferenceImageAlt = uploadData.alt || selectedReferenceFile.name;
        } catch (error) {
          console.error('Error uploading reference image:', error);
          toast({
            title: 'Error',
            description: error instanceof Error ? error.message : 'Error al subir la imagen de referencia',
            variant: 'destructive',
          });
          setUploading(false);
          return;
        } finally {
          setUploading(false);
        }
      } else if (referenceMarkedForDeletion) {
        // Si se marcó para eliminar, establecer como null
        finalReferenceImageUrl = null as any;
        finalReferenceImageAlt = null as any;
      }

      // Actualizar el proyecto de donación
      const response = await fetch(`/api/donation-projects/${selectedProject.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accountNumber: formData.accountNumber,
          recipientName: formData.recipientName,
          qrImageUrl: finalQrImageUrl,
          qrImageAlt: finalQrImageAlt,
          referenceImageUrl: finalReferenceImageUrl,
          referenceImageAlt: finalReferenceImageAlt,
          targetAmount: formData.targetAmount ? parseFloat(formData.targetAmount) : null,
          isActive: formData.isActive
        }),
      });

      if (response.ok) {
        toast({
          title: 'Éxito',
          description: 'Proyecto de donación actualizado exitosamente',
        });
        fetchDonationProjects();
        setIsEditDialogOpen(false);
        resetForm();
      } else {
        const error = await response.json();
        toast({
          title: 'Error',
          description: error.error || 'Error al actualizar proyecto de donación',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error al actualizar proyecto:', error);
      toast({
        title: 'Error',
        description: 'Error al actualizar proyecto de donación',
        variant: 'destructive',
      });
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
    setSelectedQrFile(null);
    setQrPreviewUrl('');
    setQrMarkedForDeletion(false);
    setSelectedReferenceFile(null);
    setReferencePreviewUrl('');
    setReferenceMarkedForDeletion(false);
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
    setSelectedQrFile(null);
    setQrPreviewUrl('');
    setQrMarkedForDeletion(false);
    setSelectedReferenceFile(null);
    setReferencePreviewUrl('');
    setReferenceMarkedForDeletion(false);
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
          <Dialog open={isCreateDialogOpen} onOpenChange={(open) => {
            setIsCreateDialogOpen(open);
            if (!open) {
              resetForm();
            }
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Nuevo Proyecto
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto overflow-x-hidden">
              <DialogHeader>
                <DialogTitle>Crear Proyecto de Donación</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateProject} className="space-y-4 w-full min-w-0">
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

                <div className="space-y-4">
                  <div>
                    <Label>Imagen QR</Label>
                    {!qrPreviewUrl && !formData.qrImageUrl ? (
                      <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-primary transition-colors mt-2 w-full min-w-0">
                        <ImageIcon className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                        <div className="mt-4">
                          <label htmlFor="create-qr-file-input" className="cursor-pointer">
                            <span className="mt-2 block text-base font-semibold text-gray-900 dark:text-gray-100 mb-1 underline">
                              {uploading ? 'Subiendo imagen...' : 'Haz clic para subir imagen QR'}
                            </span>
                    <Input
                              id="create-qr-file-input"
                              name="file-upload"
                              type="file"
                              className="sr-only"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleQrFileUpload(file);
                              }}
                              disabled={uploading}
                            />
                          </label>
                          <p className="mt-2 text-sm text-gray-500">
                            PNG, JPG, WEBP o GIF hasta {String(Number(process.env.NEXT_PUBLIC_MAX_UPLOAD_MB || process.env.MAX_UPLOAD_MB || 20))}MB
                          </p>
                  </div>
                      </div>
                    ) : (
                      <div className="space-y-4 mt-2">
                        <div className="relative w-full h-64 border rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                          <Image
                            src={qrPreviewUrl || formData.qrImageUrl || ''}
                            alt={formData.qrImageAlt || 'QR'}
                            fill
                            className="object-cover"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={() => {
                              setSelectedQrFile(null);
                              setQrPreviewUrl('');
                              setFormData(prev => ({ ...prev, qrImageUrl: '', qrImageAlt: '' }));
                              toast({
                                title: 'Imagen QR eliminada',
                                description: 'La imagen fue removida del formulario'
                              });
                            }}
                          >
                            Eliminar
                          </Button>
                        </div>
                        <label htmlFor="create-qr-file-input-replace" className="cursor-pointer">
                          <Button type="button" variant="outline" className="w-full" disabled={uploading}>
                            <Upload className="mr-2 h-4 w-4" />
                            {uploading ? 'Subiendo...' : 'Cambiar imagen QR'}
                          </Button>
                          <Input
                            id="create-qr-file-input-replace"
                            name="file-upload"
                            type="file"
                            className="sr-only"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleQrFileUpload(file);
                            }}
                            disabled={uploading}
                          />
                        </label>
                      </div>
                    )}
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

                <div className="space-y-4">
                  <div>
                    <Label>Imagen de Referencia</Label>
                    {!referencePreviewUrl && !formData.referenceImageUrl ? (
                      <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-primary transition-colors mt-2 w-full min-w-0">
                        <ImageIcon className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                        <div className="mt-4">
                          <label htmlFor="create-reference-file-input" className="cursor-pointer">
                            <span className="mt-2 block text-base font-semibold text-gray-900 dark:text-gray-100 mb-1 underline">
                              {uploading ? 'Subiendo imagen...' : 'Haz clic para subir imagen de referencia'}
                            </span>
                    <Input
                              id="create-reference-file-input"
                              name="file-upload"
                              type="file"
                              className="sr-only"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleReferenceFileUpload(file);
                              }}
                              disabled={uploading}
                            />
                          </label>
                          <p className="mt-2 text-sm text-gray-500">
                            PNG, JPG, WEBP o GIF hasta {String(Number(process.env.NEXT_PUBLIC_MAX_UPLOAD_MB || process.env.MAX_UPLOAD_MB || 20))}MB
                          </p>
                  </div>
                      </div>
                    ) : (
                      <div className="space-y-4 mt-2">
                        <div className="relative w-full h-64 border rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                          <Image
                            src={referencePreviewUrl || formData.referenceImageUrl || ''}
                            alt={formData.referenceImageAlt || 'Referencia'}
                            fill
                            className="object-cover"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={() => {
                              setSelectedReferenceFile(null);
                              setReferencePreviewUrl('');
                              setFormData(prev => ({ ...prev, referenceImageUrl: '', referenceImageAlt: '' }));
                              toast({
                                title: 'Imagen de referencia eliminada',
                                description: 'La imagen fue removida del formulario'
                              });
                            }}
                          >
                            Eliminar
                          </Button>
                        </div>
                        <label htmlFor="create-reference-file-input-replace" className="cursor-pointer">
                          <Button type="button" variant="outline" className="w-full" disabled={uploading}>
                            <Upload className="mr-2 h-4 w-4" />
                            {uploading ? 'Subiendo...' : 'Cambiar imagen de referencia'}
                          </Button>
                          <Input
                            id="create-reference-file-input-replace"
                            name="file-upload"
                            type="file"
                            className="sr-only"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleReferenceFileUpload(file);
                            }}
                            disabled={uploading}
                          />
                        </label>
                      </div>
                    )}
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
                  <Button type="submit" disabled={uploading}>
                    {uploading ? 'Subiendo...' : 'Crear Proyecto'}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => {
                    setIsCreateDialogOpen(false);
                    resetForm();
                  }}>
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
      <Dialog open={isEditDialogOpen} onOpenChange={(open) => {
        setIsEditDialogOpen(open);
        if (!open) {
          resetForm();
        }
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto overflow-x-hidden">
          <DialogHeader>
            <DialogTitle>Editar Proyecto de Donación</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditProject} className="space-y-4 w-full min-w-0">
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

            <div className="space-y-4">
            <div>
              <Label>Imagen QR</Label>
                {!qrPreviewUrl && !formData.qrImageUrl ? (
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-primary transition-colors mt-2 w-full min-w-0">
                    <ImageIcon className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                    <div className="mt-4">
                      <label htmlFor="edit-qr-file-input" className="cursor-pointer">
                        <span className="mt-2 block text-base font-semibold text-gray-900 dark:text-gray-100 mb-1 underline">
                          {uploading ? 'Subiendo imagen...' : 'Haz clic para subir imagen QR'}
                        </span>
                        <Input
                          id="edit-qr-file-input"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              handleQrFileUpload(file);
                              setQrMarkedForDeletion(false);
                            }
                          }}
                          disabled={uploading}
                        />
                      </label>
                      <p className="mt-2 text-sm text-gray-500">
                        PNG, JPG, WEBP o GIF hasta {String(Number(process.env.NEXT_PUBLIC_MAX_UPLOAD_MB || process.env.MAX_UPLOAD_MB || 20))}MB
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 mt-2">
                    <div className="relative w-full h-64 border rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                    <Image
                      src={qrPreviewUrl || formData.qrImageUrl || ''}
                      alt={formData.qrImageAlt || 'QR'}
                      fill
                        className="object-cover"
                    />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => {
                          setQrMarkedForDeletion(true);
                          setSelectedQrFile(null);
                          setQrPreviewUrl('');
                          setFormData(prev => ({ ...prev, qrImageUrl: '', qrImageAlt: '' }));
                          toast({
                            title: 'Imagen QR marcada para eliminar',
                            description: 'Se eliminará del bucket al guardar los cambios',
                          });
                        }}
                      >
                        Eliminar
                      </Button>
                    {qrMarkedForDeletion && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <p className="text-white font-semibold">Se eliminará al guardar</p>
                      </div>
                    )}
                  </div>
                    {qrMarkedForDeletion && (
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                          setQrMarkedForDeletion(false);
                          setFormData(prev => ({ ...prev, qrImageUrl: selectedProject?.qrImageUrl || '', qrImageAlt: selectedProject?.qrImageAlt || '' }));
                        }}
                      >
                        Cancelar eliminación
                      </Button>
                    )}
                    <label htmlFor="edit-qr-file-input-replace" className="cursor-pointer">
                      <Button type="button" variant="outline" className="w-full" disabled={uploading}>
                        <Upload className="mr-2 h-4 w-4" />
                        {uploading ? 'Subiendo...' : 'Cambiar imagen QR'}
                      </Button>
                  <Input
                        id="edit-qr-file-input-replace"
                        name="file-upload"
                    type="file"
                        className="sr-only"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleQrFileUpload(file);
                        setQrMarkedForDeletion(false);
                      }
                    }}
                        disabled={uploading}
                      />
                    </label>
                  </div>
                  )}
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

            <div className="space-y-4">
            <div>
              <Label>Imagen de Referencia</Label>
                {!referencePreviewUrl && !formData.referenceImageUrl ? (
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-primary transition-colors mt-2">
                    <ImageIcon className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                    <div className="mt-4">
                      <label htmlFor="edit-reference-file-input" className="cursor-pointer">
                        <span className="mt-2 block text-base font-semibold text-gray-900 dark:text-gray-100 mb-1 underline">
                          {uploading ? 'Subiendo imagen...' : 'Haz clic para subir imagen de referencia'}
                        </span>
                        <Input
                          id="edit-reference-file-input"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              handleReferenceFileUpload(file);
                              setReferenceMarkedForDeletion(false);
                            }
                          }}
                          disabled={uploading}
                        />
                      </label>
                      <p className="mt-2 text-sm text-gray-500">
                        PNG, JPG, WEBP o GIF hasta {String(Number(process.env.NEXT_PUBLIC_MAX_UPLOAD_MB || process.env.MAX_UPLOAD_MB || 20))}MB
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 mt-2">
                    <div className="relative w-full h-64 border rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                    <Image
                      src={referencePreviewUrl || formData.referenceImageUrl || ''}
                      alt={formData.referenceImageAlt || 'Referencia'}
                      fill
                        className="object-cover"
                    />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => {
                          setReferenceMarkedForDeletion(true);
                          setSelectedReferenceFile(null);
                          setReferencePreviewUrl('');
                          setFormData(prev => ({ ...prev, referenceImageUrl: '', referenceImageAlt: '' }));
                          toast({
                            title: 'Imagen de referencia marcada para eliminar',
                            description: 'Se eliminará del bucket al guardar los cambios',
                          });
                        }}
                      >
                        Eliminar
                      </Button>
                    {referenceMarkedForDeletion && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <p className="text-white font-semibold">Se eliminará al guardar</p>
                      </div>
                    )}
                  </div>
                    {referenceMarkedForDeletion && (
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                          setReferenceMarkedForDeletion(false);
                          setFormData(prev => ({ ...prev, referenceImageUrl: selectedProject?.referenceImageUrl || '', referenceImageAlt: selectedProject?.referenceImageAlt || '' }));
                        }}
                      >
                        Cancelar eliminación
                      </Button>
                    )}
                    <label htmlFor="edit-reference-file-input-replace" className="cursor-pointer">
                      <Button type="button" variant="outline" className="w-full" disabled={uploading}>
                        <Upload className="mr-2 h-4 w-4" />
                        {uploading ? 'Subiendo...' : 'Cambiar imagen de referencia'}
                      </Button>
                  <Input
                        id="edit-reference-file-input-replace"
                        name="file-upload"
                    type="file"
                        className="sr-only"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleReferenceFileUpload(file);
                        setReferenceMarkedForDeletion(false);
                      }
                    }}
                        disabled={uploading}
                      />
                    </label>
                  </div>
                  )}
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
              <Button type="submit" disabled={uploading}>
                {uploading ? 'Subiendo...' : 'Actualizar Proyecto'}
              </Button>
              <Button type="button" variant="outline" onClick={() => {
                setIsEditDialogOpen(false);
                resetForm();
              }}>
                Cancelar
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
