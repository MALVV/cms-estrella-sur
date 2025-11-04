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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  DollarSign, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  MessageSquare,
  Eye,
  Upload,
  Calendar,
  Target,
  TrendingUp,
  Search,
  Filter,
  Download,
  Plus,
  FileImage,
  Trash2,
  Ban
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { ConfirmDonationActionDialog } from '@/components/admin/confirm-donation-action-dialog';
import { ComprobanteViewer } from '@/components/admin/comprobante-viewer';
import Image from 'next/image';
import { ImageIcon } from 'lucide-react';

interface Donation {
  id: string;
  donorName: string;
  donorEmail: string;
  donorAddress: string;
  donorPhone: string;
  amount: number;
  donationType: string;
  message?: string;
  status: string;
  createdAt: string;
  approvedAt?: string;
  bankTransferImage?: string;
  bankTransferImageAlt?: string;
  donationProject?: {
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
  };
  approver?: {
    id: string;
    name: string;
    email: string;
  };
}

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
  donations: Array<{
    amount: number;
    createdAt: string;
  }>;
}

export default function DonacionesDashboardPage() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [donationProjects, setDonationProjects] = useState<DonationProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [projectFilter, setProjectFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isApprovalDialogOpen, setIsApprovalDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>('');
  const { toast } = useToast();

  useEffect(() => {
    fetchDonations();
    fetchDonationProjects();
  }, [statusFilter, projectFilter]);

  const fetchDonations = async () => {
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') {
        params.append('status', statusFilter);
      }
      if (projectFilter !== 'all') {
        params.append('donationProjectId', projectFilter);
      }
      
      const response = await fetch(`/api/donations?${params}`);
      if (response.ok) {
        const data = await response.json();
        setDonations(data.donations);
      }
    } catch (error) {
      console.error('Error al cargar donaciones:', error);
      toast({
        title: 'Error',
        description: 'Error al cargar donaciones',
        variant: 'destructive',
      });
    }
  };

  const fetchDonationProjects = async () => {
    try {
      const response = await fetch('/api/donation-projects');
      if (response.ok) {
        const data = await response.json();
        setDonationProjects(data);
      }
    } catch (error) {
      console.error('Error al cargar proyectos de donación:', error);
    }
  };


  const handleFileUpload = async (file: File) => {
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
        setImagePreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
      setSelectedImageFile(file);
      toast({
        title: 'Comprobante seleccionado',
        description: 'El comprobante se subirá al bucket al aprobar la donación',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Error al procesar la imagen',
        variant: 'destructive',
      });
    }
  };

  const handleDonationStatusChange = async (donationId: string, status: string) => {
    try {
      let finalBankTransferImageUrl = '';
      let finalBankTransferImageAlt = 'Comprobante de transferencia';

      // Si es aprobación y hay una imagen seleccionada, subirla al bucket primero
      if (status === 'APPROVED' && selectedImageFile) {
        setUploading(true);
        try {
          const formDataToUpload = new FormData();
          formDataToUpload.append('file', selectedImageFile);

          const uploadResponse = await fetch('/api/donations/upload-proof', {
            method: 'POST',
            body: formDataToUpload,
          });

          if (!uploadResponse.ok) {
            const error = await uploadResponse.json();
            throw new Error(error.error || 'Error al subir comprobante');
          }

          const uploadData = await uploadResponse.json();
          finalBankTransferImageUrl = uploadData.url;
          finalBankTransferImageAlt = uploadData.alt || selectedImageFile.name;
        } catch (error) {
          console.error('Error uploading proof:', error);
          toast({
            title: 'Error',
            description: error instanceof Error ? error.message : 'Error al subir el comprobante',
            variant: 'destructive',
          });
          setUploading(false);
          return;
        } finally {
          setUploading(false);
        }
      } else if (status === 'APPROVED' && !selectedImageFile) {
        toast({
          title: 'Error',
          description: 'Debes subir un comprobante para aprobar la donación',
          variant: 'destructive',
        });
        return;
      }

      const response = await fetch(`/api/donations/${donationId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          donationId,
          status,
          bankTransferImage: status === 'APPROVED' ? finalBankTransferImageUrl : null,
          bankTransferImageAlt: status === 'APPROVED' ? finalBankTransferImageAlt : null
        })
      });

      if (response.ok) {
        toast({
          title: 'Éxito',
          description: `Donación ${status === 'APPROVED' ? 'aprobada' : 'rechazada'} exitosamente`,
        });
        fetchDonations();
        fetchDonationProjects();
        setIsApprovalDialogOpen(false);
        setSelectedImageFile(null);
        setImagePreviewUrl('');
      } else {
        const error = await response.json();
        toast({
          title: 'Error',
          description: error.error || 'Error al actualizar donación',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error al actualizar donación:', error);
      toast({
        title: 'Error',
        description: 'Error al actualizar donación',
        variant: 'destructive',
      });
    }
  };

  const handleQuickApprove = async (donationId: string) => {
    try {
      const response = await fetch(`/api/donations/${donationId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          donationId: donationId,
          status: 'APPROVED'
        })
      });

      if (response.ok) {
        toast({
          title: 'Éxito',
          description: 'Donación aprobada exitosamente',
        });
        fetchDonations();
        fetchDonationProjects();
      } else {
        const error = await response.json();
        toast({
          title: 'Error',
          description: error.error || 'Error al aprobar donación',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error al aprobar donación:', error);
      toast({
        title: 'Error',
        description: 'Error al aprobar donación',
        variant: 'destructive',
      });
    }
  };

  const handleQuickReject = async (donationId: string) => {
    try {
      const response = await fetch(`/api/donations/${donationId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          donationId: donationId,
          status: 'REJECTED'
        })
      });

      if (response.ok) {
        toast({
          title: 'Éxito',
          description: 'Donación rechazada exitosamente',
        });
        fetchDonations();
        fetchDonationProjects();
      } else {
        const error = await response.json();
        toast({
          title: 'Error',
          description: error.error || 'Error al rechazar donación',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error al rechazar donación:', error);
      toast({
        title: 'Error',
        description: 'Error al rechazar donación',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = () => {
    fetchDonations();
    fetchDonationProjects();
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, text: 'Pendiente' },
      APPROVED: { color: 'bg-green-100 text-green-800', icon: CheckCircle, text: 'Aprobada' },
      REJECTED: { color: 'bg-red-100 text-red-800', icon: XCircle, text: 'Rechazada' },
      CANCELLED: { color: 'bg-gray-100 text-gray-800', icon: XCircle, text: 'Cancelada' }
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

  const getDonationTypeText = (type: string) => {
    const types = {
      GENERAL: 'General',
      EMERGENCY: 'Emergencia',
      SPECIFIC_PROJECT: 'Proyecto Específico',
      MONTHLY: 'Mensual'
    };
    return types[type as keyof typeof types] || type;
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
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateProgress = (current: any, target?: any) => {
    if (!target) return 0;
    const currentNum = parseFloat(current.toString());
    const targetNum = parseFloat(target.toString());
    return Math.min((currentNum / targetNum) * 100, 100);
  };

  const filteredDonations = donations.filter(donation => 
    donation.donorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    donation.donorEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
    donation.donationProject?.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalDonations = donations.length;
  const pendingDonations = donations.filter(d => d.status === 'PENDING').length;
  const approvedDonations = donations.filter(d => d.status === 'APPROVED').length;
  // Calcular total recaudado: suma de currentAmount de proyectos
  const totalFromProjects = donationProjects.reduce((sum, project) => sum + Number(project.currentAmount), 0);
  const totalAmount = totalFromProjects;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Gestión de Donaciones
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Administra las donaciones recibidas y los proyectos de donación
          </p>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <DollarSign className="h-6 w-6 text-blue-600 dark:text-blue-400" />
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
                <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pendientes</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{pendingDonations}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Aprobadas</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{approvedDonations}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Recaudado</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(totalAmount)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="donations" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="donations">Donaciones por Proyecto</TabsTrigger>
          <TabsTrigger value="projects">Proyectos de Donación</TabsTrigger>
        </TabsList>

        <TabsContent value="donations" className="space-y-6">
          {/* Filtros y búsqueda */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Buscar por nombre, email o proyecto..."
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
                    <SelectItem value="PENDING">Pendientes</SelectItem>
                    <SelectItem value="APPROVED">Aprobadas</SelectItem>
                    <SelectItem value="REJECTED">Rechazadas</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={projectFilter} onValueChange={setProjectFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filtrar por proyecto" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los proyectos</SelectItem>
                    {donationProjects.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Lista de donaciones */}
          <div className="grid gap-6">
            {filteredDonations.map((donation) => (
              <Card key={donation.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {donation.donorName}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {formatCurrency(donation.amount)} • {getDonationTypeText(donation.donationType)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(donation.status)}
                      {(donation.status === 'PENDING' || donation.status === 'REJECTED') && (
                        <div className="flex gap-2">
                          <ConfirmDonationActionDialog
                            donation={donation}
                            action="approve"
                            onActionConfirmed={() => {
                              fetchDonations();
                              fetchDonationProjects();
                            }}
                          >
                            <Button 
                              size="sm" 
                              variant="default"
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Aprobar
                            </Button>
                          </ConfirmDonationActionDialog>
                          {donation.status === 'PENDING' && (
                            <ConfirmDonationActionDialog
                              donation={donation}
                              action="reject"
                              onActionConfirmed={handleQuickReject}
                            >
                              <Button 
                                size="sm" 
                                variant="destructive"
                              >
                                <XCircle className="w-4 h-4 mr-2" />
                                Rechazar
                              </Button>
                            </ConfirmDonationActionDialog>
                          )}
                        </div>
                      )}
                      {donation.status === 'APPROVED' && (
                        <ConfirmDonationActionDialog
                          donation={donation}
                          action="unapprove"
                          onActionConfirmed={() => {
                            fetchDonations();
                            fetchDonationProjects();
                          }}
                        >
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="bg-orange-600 hover:bg-orange-700 text-white border-orange-600"
                          >
                            <Ban className="w-4 h-4 mr-2" />
                            Desaprobar
                          </Button>
                        </ConfirmDonationActionDialog>
                      )}
                      <ConfirmDonationActionDialog
                        donation={donation}
                        action="delete"
                        onActionConfirmed={handleDelete}
                      >
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Eliminar
                        </Button>
                      </ConfirmDonationActionDialog>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-2" />
                            Ver detalles
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Detalles de la Donación</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label className="text-sm font-medium">Donante</Label>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{donation.donorName}</p>
                              </div>
                              <div>
                                <Label className="text-sm font-medium">Monto</Label>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{formatCurrency(donation.amount)}</p>
                              </div>
                              <div>
                                <Label className="text-sm font-medium">Email</Label>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{donation.donorEmail}</p>
                              </div>
                              <div>
                                <Label className="text-sm font-medium">Teléfono</Label>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{donation.donorPhone}</p>
                              </div>
                              <div className="col-span-2">
                                <Label className="text-sm font-medium">Dirección</Label>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{donation.donorAddress}</p>
                              </div>
                              {donation.message && (
                                <div className="col-span-2">
                                  <Label className="text-sm font-medium">Mensaje</Label>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">{donation.message}</p>
                                </div>
                              )}
                            </div>
                            
                            {/* Comprobante de pago */}
                            <div className="pt-4 border-t">
                              <Label className="text-sm font-medium">Comprobante de Pago</Label>
                              <div className="mt-2">
                                {donation.bankTransferImage ? (
                                  <div className="space-y-3">
                                    <div className="relative w-full h-48 bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden">
                                      <Image
                                        src={donation.bankTransferImage}
                                        alt={donation.bankTransferImageAlt || 'Comprobante de transferencia bancaria'}
                                        fill
                                        className="object-contain"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                      />
                                    </div>
                                    <div className="flex gap-2">
                                      <ComprobanteViewer
                                        bankTransferImage={donation.bankTransferImage}
                                        bankTransferImageAlt={donation.bankTransferImageAlt}
                                        donorName={donation.donorName}
                                        amount={donation.amount}
                                      />
                                      <Button asChild variant="outline" size="sm">
                                        <a 
                                          href={donation.bankTransferImage} 
                                          target="_blank" 
                                          rel="noopener noreferrer"
                                          className="gap-2"
                                        >
                                          <FileImage className="w-4 h-4" />
                                          Abrir en nueva pestaña
                                        </a>
                                      </Button>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                                    <FileImage className="w-4 h-4" />
                                    <span>Sin comprobante</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {formatDate(donation.createdAt)}
                    </div>
                    {donation.donationProject && (
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4" />
                        <span>{donation.donationProject.title}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="projects" className="space-y-6">
          {/* Lista de proyectos de donación */}
          <div className="grid gap-6">
            {donationProjects.map((project) => (
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
                    <div className="flex gap-2">
                      <Badge variant={project.isCompleted ? "default" : (project.isActive ? "default" : "secondary")}>
                        {project.isCompleted ? 'Completado' : (project.isActive ? 'Activo' : 'Inactivo')}
                      </Badge>
                      {project.isCompleted && (
                        <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                          Meta Alcanzada
                        </Badge>
                      )}
                    </div>
                  </div>

                  {project.targetAmount && (
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Progreso de recaudación</span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {formatCurrency(parseFloat(project.currentAmount.toString()))} / {formatCurrency(parseFloat(project.targetAmount.toString()))}
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
                      <TrendingUp className="w-4 h-4" />
                      {project.donations.length} donaciones
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      Total recaudado: {formatCurrency(parseFloat(project.currentAmount.toString()))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Dialog para aprobar/rechazar donación */}
      <Dialog open={isApprovalDialogOpen} onOpenChange={setIsApprovalDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Aprobar Donación</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              ¿Estás seguro de que deseas aprobar esta donación?
            </p>
            
            <div className="space-y-4">
              <div>
                <Label>Comprobante de Transferencia *</Label>
                {!imagePreviewUrl ? (
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-primary transition-colors mt-2 w-full min-w-0">
                    <ImageIcon className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                    <div className="mt-4">
                      <label htmlFor="proof-file-input" className="cursor-pointer">
                        <span className="mt-2 block text-base font-semibold text-gray-900 dark:text-gray-100 mb-1 underline">
                          {uploading ? 'Subiendo imagen...' : 'Haz clic para subir comprobante'}
                        </span>
                        <Input
                          id="proof-file-input"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload(file);
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
                        src={imagePreviewUrl}
                        alt="Comprobante de transferencia"
                        fill
                        className="object-cover"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => {
                          setSelectedImageFile(null);
                          setImagePreviewUrl('');
                          toast({
                            title: 'Comprobante eliminado',
                            description: 'El comprobante fue removido del formulario'
                          });
                        }}
                      >
                        Eliminar
                      </Button>
                    </div>
                    <label htmlFor="proof-file-input-replace" className="cursor-pointer">
                      <Button type="button" variant="outline" className="w-full" disabled={uploading}>
                        <Upload className="mr-2 h-4 w-4" />
                        {uploading ? 'Subiendo...' : 'Cambiar comprobante'}
                      </Button>
                      <Input
                        id="proof-file-input-replace"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload(file);
                        }}
                        disabled={uploading}
                      />
                    </label>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                onClick={() => handleDonationStatusChange(selectedDonation?.id || '', 'APPROVED')}
                className="bg-green-600 hover:bg-green-700"
                disabled={!selectedImageFile || uploading}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                {uploading ? 'Subiendo...' : 'Aprobar Donación'}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsApprovalDialogOpen(false);
                  setSelectedImageFile(null);
                  setImagePreviewUrl('');
                }}
              >
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
