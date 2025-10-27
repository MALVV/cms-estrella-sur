'use client'

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { usePermissions } from '@/hooks/use-permissions';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  Search, 
  RefreshCw, 
  Plus, 
  FileText,
  Star,
  StarOff,
  File,
  FolderOpen,
  BarChart3,
  Users
} from 'lucide-react';

interface TransparencyDocument {
  id: string;
  title: string;
  description?: string;
  fileName: string;
  fileUrl: string;
  fileSize?: number;
  fileType?: string;
  category: 'DOCUMENT_CENTER' | 'ACCOUNTABILITY' | 'FINANCIERS_AND_ALLIES' | 'ANNUAL_REPORTS';
  year?: number;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  creator?: {
    name?: string;
    email: string;
  };
}

const categoryInfo = {
  DOCUMENT_CENTER: {
    title: 'Centro de Documentos',
    icon: FolderOpen,
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
  },
  ACCOUNTABILITY: {
    title: 'Rendición de Cuentas',
    icon: BarChart3,
    color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
  },
  FINANCIERS_AND_ALLIES: {
    title: 'Financiadores y Aliados',
    icon: Users,
    color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
  },
  ANNUAL_REPORTS: {
    title: 'Informes Anuales',
    icon: FileText,
    color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
  }
};

export const TransparencyManagement: React.FC = () => {
  const [documents, setDocuments] = useState<TransparencyDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'title' | 'category' | 'year' | 'createdAt'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingDocument, setEditingDocument] = useState<TransparencyDocument | null>(null);
  const [deletingDocument, setDeletingDocument] = useState<TransparencyDocument | null>(null);
  const { toast } = useToast();
  const { canManageContent } = usePermissions();

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (statusFilter !== 'ALL') {
        params.append('isActive', statusFilter === 'ACTIVE' ? 'true' : 'false');
      }
      if (categoryFilter !== 'ALL') {
        params.append('category', categoryFilter);
      }
      if (searchTerm) {
        params.append('search', searchTerm);
      }
      params.append('sortBy', sortBy);
      params.append('sortOrder', sortOrder);

      const response = await fetch(`/api/transparency?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Error al cargar documentos');
      }
      const data = await response.json();
      setDocuments(data);
    } catch (error) {
      console.error('Error al cargar documentos:', error);
      toast({
        title: 'Error',
        description: 'Error al cargar los documentos',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [statusFilter, categoryFilter, searchTerm, sortBy, sortOrder, toast]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchData();
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [fetchData]);

  const filteredDocuments = documents;
  const activeDocuments = documents.filter(item => item.isActive);
  const featuredDocuments = documents.filter(item => item.isFeatured);

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/transparency/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isActive: !currentStatus,
        }),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el estado');
      }

      toast({
        title: 'Éxito',
        description: `Documento ${!currentStatus ? 'activado' : 'desactivado'} exitosamente`,
      });

      fetchData();
    } catch (error) {
      console.error('Error al actualizar estado:', error);
      toast({
        title: 'Error',
        description: 'Error al actualizar el estado del documento',
        variant: 'destructive',
      });
    }
  };

  const handleToggleFeatured = async (id: string) => {
    try {
      const response = await fetch(`/api/transparency/${id}/toggle-featured`, {
        method: 'PUT',
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el estado destacado');
      }

      toast({
        title: 'Éxito',
        description: 'Estado destacado actualizado exitosamente',
      });

      fetchData();
    } catch (error) {
      console.error('Error al actualizar estado destacado:', error);
      toast({
        title: 'Error',
        description: 'Error al actualizar el estado destacado',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/transparency/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al eliminar el documento');
      }

      toast({
        title: 'Éxito',
        description: 'Documento eliminado exitosamente',
      });

      setDeletingDocument(null);
      fetchData();
    } catch (error) {
      console.error('Error al eliminar documento:', error);
      toast({
        title: 'Error',
        description: 'Error al eliminar el documento',
        variant: 'destructive',
      });
    }
  };

  const handleBulkStatusChange = async (isActive: boolean) => {
    try {
      const response = await fetch('/api/transparency/bulk-toggle-status', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ids: selectedItems,
          isActive,
        }),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el estado');
      }

      toast({
        title: 'Éxito',
        description: `${selectedItems.length} documentos actualizados exitosamente`,
      });

      setSelectedItems([]);
      fetchData();
    } catch (error) {
      console.error('Error al actualizar estado:', error);
      toast({
        title: 'Error',
        description: 'Error al actualizar el estado de los documentos',
        variant: 'destructive',
      });
    }
  };

  const handleSelectAll = () => {
    if (selectedItems.length === filteredDocuments.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredDocuments.map(item => item.id));
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!canManageContent) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">Acceso Denegado</h2>
              <p className="text-gray-600">No tienes permisos para gestionar documentos de transparencia.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-light dark:text-text-dark">Gestión de Transparencia</h1>
          <p className="text-text-secondary-light dark:text-text-secondary-dark">
            Administra los documentos de transparencia y rendición de cuentas
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Documento
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Documento</DialogTitle>
            </DialogHeader>
            <CreateTransparencyDocumentForm 
              onSuccess={() => {
                setIsCreateDialogOpen(false);
                fetchData();
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">
                  Total Documentos
                </p>
                <p className="text-2xl font-bold text-text-light dark:text-text-dark">
                  {documents.length}
                </p>
              </div>
              <FileText className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">
                  Activos
                </p>
                <p className="text-2xl font-bold text-text-light dark:text-text-dark">
                  {activeDocuments.length}
                </p>
              </div>
              <Eye className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">
                  Destacados
                </p>
                <p className="text-2xl font-bold text-text-light dark:text-text-dark">
                  {featuredDocuments.length}
                </p>
              </div>
              <Star className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">
                  Categorías
                </p>
                <p className="text-2xl font-bold text-text-light dark:text-text-dark">
                  {Object.keys(categoryInfo).length}
                </p>
              </div>
              <FolderOpen className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar documentos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Todos los estados</SelectItem>
                <SelectItem value="ACTIVE">Activos</SelectItem>
                <SelectItem value="INACTIVE">Inactivos</SelectItem>
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Todas las categorías</SelectItem>
                {Object.entries(categoryInfo).map(([key, info]) => (
                  <SelectItem key={key} value={key}>{info.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={(value: 'title' | 'category' | 'year' | 'createdAt') => setSortBy(value)}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="title">Título</SelectItem>
                <SelectItem value="category">Categoría</SelectItem>
                <SelectItem value="year">Año</SelectItem>
                <SelectItem value="createdAt">Fecha de creación</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </Button>

            <Button variant="outline" onClick={fetchData}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedItems.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                {selectedItems.length} documento(s) seleccionado(s)
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkStatusChange(true)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Activar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkStatusChange(false)}
                >
                  <EyeOff className="h-4 w-4 mr-2" />
                  Desactivar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Documents List */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6">
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    <div className="space-y-2 flex-1">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/4" />
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-border-light dark:border-border-dark">
                  <tr>
                    <th className="p-4 text-left">
                      <Checkbox
                        checked={selectedItems.length === filteredDocuments.length && filteredDocuments.length > 0}
                        onCheckedChange={handleSelectAll}
                      />
                    </th>
                    <th className="p-4 text-left text-sm font-medium text-text-light dark:text-text-dark">
                      Documento
                    </th>
                    <th className="p-4 text-left text-sm font-medium text-text-light dark:text-text-dark">
                      Categoría
                    </th>
                    <th className="p-4 text-left text-sm font-medium text-text-light dark:text-text-dark">
                      Año
                    </th>
                    <th className="p-4 text-left text-sm font-medium text-text-light dark:text-text-dark">
                      Estado
                    </th>
                    <th className="p-4 text-left text-sm font-medium text-text-light dark:text-text-dark">
                      Creado
                    </th>
                    <th className="p-4 text-left text-sm font-medium text-text-light dark:text-text-dark">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDocuments.map((document) => (
                    <tr key={document.id} className="border-b border-border-light dark:border-border-dark hover:bg-muted/50">
                      <td className="p-4">
                        <Checkbox
                          checked={selectedItems.includes(document.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedItems([...selectedItems, document.id]);
                            } else {
                              setSelectedItems(selectedItems.filter(id => id !== document.id));
                            }
                          }}
                        />
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <File className="h-5 w-5 text-primary" />
                          <div>
                            <div className="font-medium text-text-light dark:text-text-dark">
                              {document.title}
                            </div>
                            <div className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                              {document.fileName}
                            </div>
                            {document.fileSize && (
                              <div className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                                {formatFileSize(document.fileSize)}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge className={categoryInfo[document.category].color}>
                          {categoryInfo[document.category].title}
                        </Badge>
                      </td>
                      <td className="p-4 text-text-light dark:text-text-dark">
                        {document.year || '-'}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Badge variant={document.isActive ? 'default' : 'secondary'}>
                            {document.isActive ? 'Activo' : 'Inactivo'}
                          </Badge>
                          {document.isFeatured && (
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-text-secondary-light dark:text-text-secondary-dark">
                        {formatDate(document.createdAt)}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleFeatured(document.id)}
                          >
                            {document.isFeatured ? (
                              <StarOff className="h-4 w-4" />
                            ) : (
                              <Star className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleStatus(document.id, document.isActive)}
                          >
                            {document.isActive ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingDocument(document)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeletingDocument(document)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      {editingDocument && (
        <Dialog open={!!editingDocument} onOpenChange={() => setEditingDocument(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Editar Documento</DialogTitle>
            </DialogHeader>
            <EditTransparencyDocumentForm
              document={editingDocument}
              onSuccess={() => {
                setEditingDocument(null);
                fetchData();
              }}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Dialog */}
      {deletingDocument && (
        <Dialog open={!!deletingDocument} onOpenChange={() => setDeletingDocument(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Eliminar Documento</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p>¿Estás seguro de que quieres eliminar el documento &quot;{deletingDocument.title}&quot;?</p>
              <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                Esta acción no se puede deshacer.
              </p>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setDeletingDocument(null)}>
                  Cancelar
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(deletingDocument.id)}
                >
                  Eliminar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

// Componente para crear nuevo documento
const CreateTransparencyDocumentForm: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    fileName: '',
    fileUrl: '',
    fileSize: '',
    fileType: '',
    category: '',
    year: '',
    isFeatured: false,
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/transparency', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          fileSize: formData.fileSize ? parseInt(formData.fileSize) : undefined,
          year: formData.year ? parseInt(formData.year) : undefined,
        }),
      });

      if (!response.ok) {
        throw new Error('Error al crear el documento');
      }

      toast({
        title: 'Éxito',
        description: 'Documento creado exitosamente',
      });

      onSuccess();
    } catch (error) {
      console.error('Error al crear documento:', error);
      toast({
        title: 'Error',
        description: 'Error al crear el documento',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Título *</label>
        <Input
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Descripción</label>
        <Textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Nombre del archivo *</label>
          <Input
            value={formData.fileName}
            onChange={(e) => setFormData({ ...formData, fileName: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">URL del archivo *</label>
          <Input
            value={formData.fileUrl}
            onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Tamaño (bytes)</label>
          <Input
            type="number"
            value={formData.fileSize}
            onChange={(e) => setFormData({ ...formData, fileSize: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Tipo MIME</label>
          <Input
            value={formData.fileType}
            onChange={(e) => setFormData({ ...formData, fileType: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Año</label>
          <Input
            type="number"
            value={formData.year}
            onChange={(e) => setFormData({ ...formData, year: e.target.value })}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Categoría *</label>
        <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value as 'DOCUMENT_CENTER' | 'ACCOUNTABILITY' | 'FINANCIERS_AND_ALLIES' | 'ANNUAL_REPORTS' })}>
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar categoría" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(categoryInfo).map(([key, info]) => (
              <SelectItem key={key} value={key}>{info.title}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="isFeatured"
          checked={formData.isFeatured}
          onCheckedChange={(checked) => setFormData({ ...formData, isFeatured: !!checked })}
        />
        <label htmlFor="isFeatured" className="text-sm font-medium">
          Destacar documento
        </label>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={loading}>
          {loading ? 'Creando...' : 'Crear Documento'}
        </Button>
      </div>
    </form>
  );
};

// Componente para editar documento
const EditTransparencyDocumentForm: React.FC<{ 
  document: TransparencyDocument; 
  onSuccess: () => void 
}> = ({ document, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: document.title,
    description: document.description || '',
    fileName: document.fileName,
    fileUrl: document.fileUrl,
    fileSize: document.fileSize?.toString() || '',
    fileType: document.fileType || '',
    category: document.category,
    year: document.year?.toString() || '',
    isActive: document.isActive,
    isFeatured: document.isFeatured,
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`/api/transparency/${document.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          fileSize: formData.fileSize ? parseInt(formData.fileSize) : undefined,
          year: formData.year ? parseInt(formData.year) : undefined,
        }),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el documento');
      }

      toast({
        title: 'Éxito',
        description: 'Documento actualizado exitosamente',
      });

      onSuccess();
    } catch (error) {
      console.error('Error al actualizar documento:', error);
      toast({
        title: 'Error',
        description: 'Error al actualizar el documento',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Título *</label>
        <Input
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Descripción</label>
        <Textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Nombre del archivo *</label>
          <Input
            value={formData.fileName}
            onChange={(e) => setFormData({ ...formData, fileName: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">URL del archivo *</label>
          <Input
            value={formData.fileUrl}
            onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Tamaño (bytes)</label>
          <Input
            type="number"
            value={formData.fileSize}
            onChange={(e) => setFormData({ ...formData, fileSize: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Tipo MIME</label>
          <Input
            value={formData.fileType}
            onChange={(e) => setFormData({ ...formData, fileType: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Año</label>
          <Input
            type="number"
            value={formData.year}
            onChange={(e) => setFormData({ ...formData, year: e.target.value })}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Categoría *</label>
        <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value as 'DOCUMENT_CENTER' | 'ACCOUNTABILITY' | 'FINANCIERS_AND_ALLIES' | 'ANNUAL_REPORTS' })}>
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar categoría" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(categoryInfo).map(([key, info]) => (
              <SelectItem key={key} value={key}>{info.title}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="isActive"
            checked={formData.isActive}
            onCheckedChange={(checked) => setFormData({ ...formData, isActive: !!checked })}
          />
          <label htmlFor="isActive" className="text-sm font-medium">
            Activo
          </label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="isFeatured"
            checked={formData.isFeatured}
            onCheckedChange={(checked) => setFormData({ ...formData, isFeatured: !!checked })}
          />
          <label htmlFor="isFeatured" className="text-sm font-medium">
            Destacar documento
          </label>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={loading}>
          {loading ? 'Actualizando...' : 'Actualizar Documento'}
        </Button>
      </div>
    </form>
  );
};
