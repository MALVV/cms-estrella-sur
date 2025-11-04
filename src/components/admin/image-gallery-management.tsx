'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Plus, 
  Search, 
  Filter, 
  Image as ImageIcon, 
  Edit, 
  Trash2, 
  Eye,
  Calendar,
  User,
  Upload,
  X
} from 'lucide-react';
import Image from 'next/image';
import { useToast } from '@/components/ui/use-toast';

interface ImageGalleryItem {
  id: string;
  imageUrl: string;
  imageAlt?: string;
  title?: string;
  programId?: string;
  projectId?: string;
  methodologyId?: string;
  program?: {
    id: string;
    sectorName: string;
  };
  project?: {
    id: string;
    title: string;
  };
  methodology?: {
    id: string;
    title: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface Programa {
  id: string;
  sectorName: string;
}

interface Proyecto {
  id: string;
  title: string;
}

interface Iniciativa {
  id: string;
  title: string;
}

export function ImageGalleryManagement() {
  const { toast } = useToast();
  const [images, setImages] = useState<ImageGalleryItem[]>([]);
  const [programas, setProgramas] = useState<Programa[]>([]);
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [iniciativas, setIniciativas] = useState<Iniciativa[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'program' | 'project' | 'methodology'>('all');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingImage, setEditingImage] = useState<ImageGalleryItem | null>(null);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [imageMarkedForDeletion, setImageMarkedForDeletion] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    imageUrl: '',
    imageAlt: '',
    title: '',
    programId: '',
    projectId: '',
    methodologyId: '',
    relationType: 'program' as 'program' | 'project' | 'methodology'
  });

  useEffect(() => {
    fetchImages();
    fetchProgramas();
    fetchProyectos();
    fetchIniciativas();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await fetch('/api/admin/image-gallery', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setImages(data);
      }
    } catch (error) {
      console.error('Error fetching images:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las imágenes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchProgramas = async () => {
    try {
      // Obtener todos los programas sin paginación
      const response = await fetch('/api/admin/programas?limit=1000', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        // La API devuelve { programas: [...], pagination: {...} }
        const programasArray = data.programas || [];
        console.log('Programas cargados:', programasArray.length, programasArray);
        setProgramas(programasArray);
      }
    } catch (error) {
      console.error('Error fetching programas:', error);
      // En caso de error, establecer array vacío
      setProgramas([]);
    }
  };

  const fetchProyectos = async () => {
    try {
      const response = await fetch('/api/admin/projects?limit=1000', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        const proyectosArray = data.projects || [];
        console.log('Proyectos cargados:', proyectosArray.length);
        setProyectos(proyectosArray);
      }
    } catch (error) {
      console.error('Error fetching proyectos:', error);
      setProyectos([]);
    }
  };

  const fetchIniciativas = async () => {
    try {
      const response = await fetch('/api/admin/methodologies?limit=1000', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        const iniciativasArray = data.methodologies || [];
        console.log('Iniciativas cargadas:', iniciativasArray.length);
        setIniciativas(iniciativasArray);
      }
    } catch (error) {
      console.error('Error fetching iniciativas:', error);
      setIniciativas([]);
    }
  };

  const handleFileUpload = async (file: File) => {
    try {
      const maxMb = Number(process.env.NEXT_PUBLIC_MAX_UPLOAD_MB || process.env.MAX_UPLOAD_MB || 20);
      const maxBytes = maxMb * 1024 * 1024;
      const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

      if (!allowed.includes(file.type)) {
        toast({
          title: 'Error',
          description: 'Formato no permitido. Usa JPG, PNG, WEBP o GIF',
          variant: 'destructive',
        });
        return;
      }

      if (file.size > maxBytes) {
        toast({
          title: 'Error',
          description: `El archivo es demasiado grande. Máximo ${maxMb}MB`,
          variant: 'destructive',
        });
        return;
      }

      // Crear preview local (no subir al bucket todavía)
      const reader = new FileReader();
      reader.onloadend = () => {
        const previewUrl = reader.result as string;
        setImagePreviewUrl(previewUrl);
        setSelectedImageFile(file);
        setFormData(prev => ({
          ...prev,
          imageAlt: file.name,
        }));
        setImageMarkedForDeletion(false);
      };
      reader.readAsDataURL(file);

      toast({
        title: 'Imagen seleccionada',
        description: 'La imagen se subirá al bucket al guardar los cambios',
      });
    } catch (error) {
      console.error('Error processing file:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Error al procesar la imagen',
        variant: 'destructive',
      });
    }
  };

  const handleAddImage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedImageFile && !formData.imageUrl.trim()) {
      toast({
        title: 'Error',
        description: 'Debes seleccionar una imagen o proporcionar una URL',
        variant: 'destructive',
      });
      return;
    }

    try {
      setUploading(true);
      let finalImageUrl = formData.imageUrl;

      // Si hay un archivo seleccionado, subirlo primero
      if (selectedImageFile) {
        const uploadFormData = new FormData();
        uploadFormData.append('file', selectedImageFile);

        const uploadResponse = await fetch('/api/admin/image-gallery/upload', {
          method: 'POST',
          body: uploadFormData,
        });

        if (!uploadResponse.ok) {
          const errorData = await uploadResponse.json();
          throw new Error(errorData.error || 'Error al subir imagen');
        }

        const uploadData = await uploadResponse.json();
        finalImageUrl = uploadData.url;
      }

      // Preparar payload según el tipo de relación
      const payload: any = {
        imageUrl: finalImageUrl,
        imageAlt: formData.imageAlt,
        title: formData.title
      };

      if (formData.relationType === 'program') {
        payload.programId = formData.programId;
      } else if (formData.relationType === 'project') {
        payload.projectId = formData.projectId;
      } else if (formData.relationType === 'methodology') {
        payload.methodologyId = formData.methodologyId;
      }

      const response = await fetch('/api/admin/image-gallery', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al agregar imagen');
      }

      toast({
        title: "Imagen agregada",
        description: "La imagen ha sido agregada exitosamente a la galería.",
      });
      
      setShowAddDialog(false);
      setFormData({ 
        imageUrl: '', 
        imageAlt: '', 
        title: '', 
        programId: '', 
        projectId: '', 
        methodologyId: '', 
        relationType: 'program' 
      });
      setSelectedImageFile(null);
      setImagePreviewUrl(null);
      fetchImages();
    } catch (error) {
      console.error('Error adding image:', error);
      toast({
        title: "Error al agregar imagen",
        description: error instanceof Error ? error.message : "Hubo un problema al agregar la imagen.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleEditImage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingImage) return;

    if (!selectedImageFile && !formData.imageUrl.trim() && imageMarkedForDeletion) {
      toast({
        title: 'Error',
        description: 'Debes seleccionar una nueva imagen o proporcionar una URL',
        variant: 'destructive',
      });
      return;
    }

    try {
      setUploading(true);
      let finalImageUrl = formData.imageUrl;

      // Si hay un archivo seleccionado, subirlo primero
      if (selectedImageFile) {
        const uploadFormData = new FormData();
        uploadFormData.append('file', selectedImageFile);

        const uploadResponse = await fetch('/api/admin/image-gallery/upload', {
          method: 'POST',
          body: uploadFormData,
        });

        if (!uploadResponse.ok) {
          const errorData = await uploadResponse.json();
          throw new Error(errorData.error || 'Error al subir imagen');
        }

        const uploadData = await uploadResponse.json();
        finalImageUrl = uploadData.url;
      }

      // Si se marca para eliminar, establecer null
      if (imageMarkedForDeletion && !selectedImageFile) {
        finalImageUrl = '';
      }

      // Preparar payload según el tipo de relación
      const payload: any = {
        imageUrl: finalImageUrl,
        imageAlt: formData.imageAlt,
        title: formData.title
      };

      if (formData.relationType === 'program') {
        payload.programId = formData.programId;
      } else if (formData.relationType === 'project') {
        payload.projectId = formData.projectId;
      } else if (formData.relationType === 'methodology') {
        payload.methodologyId = formData.methodologyId;
      }

      const response = await fetch(`/api/admin/image-gallery/${editingImage.id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al actualizar imagen');
      }

      toast({
        title: "Imagen actualizada",
        description: "La imagen ha sido actualizada exitosamente.",
      });
      
      setShowEditDialog(false);
      setEditingImage(null);
      setFormData({ 
        imageUrl: '', 
        imageAlt: '', 
        title: '', 
        programId: '', 
        projectId: '', 
        methodologyId: '', 
        relationType: 'program' 
      });
      setSelectedImageFile(null);
      setImagePreviewUrl(null);
      setImageMarkedForDeletion(false);
      fetchImages();
    } catch (error) {
      console.error('Error updating image:', error);
      toast({
        title: "Error al actualizar imagen",
        description: error instanceof Error ? error.message : "Hubo un problema al actualizar la imagen.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta imagen?')) return;

    try {
      const response = await fetch(`/api/admin/image-gallery/${imageId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al eliminar imagen');
      }

      toast({
        title: "Imagen eliminada",
        description: "La imagen ha sido eliminada exitosamente.",
      });
      
      fetchImages();
    } catch (error) {
      console.error('Error deleting image:', error);
      toast({
        title: "Error al eliminar imagen",
        description: error instanceof Error ? error.message : "Hubo un problema al eliminar la imagen.",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (image: ImageGalleryItem) => {
    setEditingImage(image);
    
    // Determinar el tipo de relación
    let relationType: 'program' | 'project' | 'methodology' = 'program';
    let programId = '';
    let projectId = '';
    let methodologyId = '';

    if (image.programId) {
      relationType = 'program';
      programId = image.programId;
    } else if (image.projectId) {
      relationType = 'project';
      projectId = image.projectId;
    } else if (image.methodologyId) {
      relationType = 'methodology';
      methodologyId = image.methodologyId;
    }

    setFormData({
      imageUrl: image.imageUrl,
      imageAlt: image.imageAlt || '',
      title: image.title || '',
      programId,
      projectId,
      methodologyId,
      relationType
    });
    setSelectedImageFile(null);
    setImagePreviewUrl(null);
    setImageMarkedForDeletion(false);
    setShowEditDialog(true);
  };

  const filteredImages = images.filter(image => {
    const matchesSearch = image.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         image.imageAlt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         image.program?.sectorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         image.project?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         image.methodology?.title.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesFilter = true;
    if (filterType === 'program') {
      matchesFilter = !!image.programId;
    } else if (filterType === 'project') {
      matchesFilter = !!image.projectId;
    } else if (filterType === 'methodology') {
      matchesFilter = !!image.methodologyId;
    }
    
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando galería de imágenes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Galería de Imágenes</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Gestiona las imágenes de programas, proyectos e iniciativas
          </p>
        </div>
        <Button onClick={() => setShowAddDialog(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Agregar Imagen
        </Button>
      </div>

      {/* Filtros y búsqueda */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Buscar por título, descripción, programa, proyecto o iniciativa..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="sm:w-64">
                <Select value={filterType} onValueChange={(value) => setFilterType(value as any)}>
                  <SelectTrigger>
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filtrar por tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las imágenes</SelectItem>
                    <SelectItem value="program">Solo Programas</SelectItem>
                    <SelectItem value="project">Solo Proyectos</SelectItem>
                    <SelectItem value="methodology">Solo Iniciativas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grid de imágenes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredImages.map((image) => (
          <Card key={image.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-video bg-gray-100 dark:bg-gray-800 relative">
              <img
                src={image.imageUrl}
                alt={image.imageAlt || image.title || 'Imagen de programa'}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
              <div className="hidden absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-700">
                <ImageIcon className="h-12 w-12 text-gray-400" />
              </div>
            </div>
            
            <CardContent className="p-4">
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2">
                    {image.title || 'Sin título'}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {image.imageAlt || 'Sin descripción'}
                  </p>
                </div>
                
                <div className="flex flex-wrap items-center gap-2">
                  {image.program && (
                    <Badge variant="secondary" className="text-xs">
                      📋 {image.program.sectorName}
                    </Badge>
                  )}
                  {image.project && (
                    <Badge variant="secondary" className="text-xs">
                      📁 {image.project.title}
                    </Badge>
                  )}
                  {image.methodology && (
                    <Badge variant="secondary" className="text-xs">
                      💡 {image.methodology.title}
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(image.createdAt).toLocaleDateString()}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditDialog(image)}
                    className="flex-1"
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteImage(image.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredImages.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No hay imágenes
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {searchTerm || filterType !== 'all' 
                ? 'No se encontraron imágenes con los filtros aplicados.'
                : 'Comienza agregando imágenes a la galería.'
              }
            </p>
            <Button onClick={() => setShowAddDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Agregar Primera Imagen
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Dialog para agregar imagen */}
      <Dialog open={showAddDialog} onOpenChange={(open) => {
        setShowAddDialog(open);
        if (!open) {
          setSelectedImageFile(null);
          setImagePreviewUrl(null);
          setFormData({ 
            imageUrl: '', 
            imageAlt: '', 
            title: '', 
            programId: '', 
            projectId: '', 
            methodologyId: '', 
            relationType: 'program' 
          });
        }
      }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Agregar Imagen a la Galería</DialogTitle>
            <DialogDescription>
              Completa los campos para agregar una nueva imagen a la galería
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleAddImage} className="space-y-6">
            {/* Información básica */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Información Básica</h3>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium">Tipo de Relación *</Label>
                <Select value={formData.relationType} onValueChange={(value) => setFormData({...formData, relationType: value as any})}>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Selecciona el tipo de relación" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="program">📋 Programa</SelectItem>
                    <SelectItem value="project">📁 Proyecto</SelectItem>
                    <SelectItem value="methodology">💡 Iniciativa</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {formData.relationType === 'program' && (
                  <div className="space-y-2">
                    <Label htmlFor="programId" className="text-sm font-medium">Programa *</Label>
                    <Select value={formData.programId} onValueChange={(value) => setFormData({...formData, programId: value})}>
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="Selecciona un programa" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.isArray(programas) && programas.length > 0 ? (
                          programas.map((programa) => (
                            <SelectItem key={programa.id} value={programa.id}>
                              {programa.sectorName}
                            </SelectItem>
                          ))
                        ) : (
                          <div className="px-2 py-1.5 text-sm text-muted-foreground">
                            No hay programas disponibles
                          </div>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {formData.relationType === 'project' && (
                  <div className="space-y-2">
                    <Label htmlFor="projectId" className="text-sm font-medium">Proyecto *</Label>
                    <Select value={formData.projectId} onValueChange={(value) => setFormData({...formData, projectId: value})}>
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="Selecciona un proyecto" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.isArray(proyectos) && proyectos.length > 0 ? (
                          proyectos.map((proyecto) => (
                            <SelectItem key={proyecto.id} value={proyecto.id}>
                              {proyecto.title}
                            </SelectItem>
                          ))
                        ) : (
                          <div className="px-2 py-1.5 text-sm text-muted-foreground">
                            No hay proyectos disponibles
                          </div>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {formData.relationType === 'methodology' && (
                  <div className="space-y-2">
                    <Label htmlFor="methodologyId" className="text-sm font-medium">Iniciativa *</Label>
                    <Select value={formData.methodologyId} onValueChange={(value) => setFormData({...formData, methodologyId: value})}>
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="Selecciona una iniciativa" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.isArray(iniciativas) && iniciativas.length > 0 ? (
                          iniciativas.map((iniciativa) => (
                            <SelectItem key={iniciativa.id} value={iniciativa.id}>
                              {iniciativa.title}
                            </SelectItem>
                          ))
                        ) : (
                          <div className="px-2 py-1.5 text-sm text-muted-foreground">
                            No hay iniciativas disponibles
                          </div>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                
                {formData.relationType && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Imagen *</Label>
                    <div className="w-full min-w-0">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload(file);
                          e.target.value = '';
                        }}
                        className="hidden"
                        id="image-upload-add"
                        disabled={uploading}
                      />
                      <label
                        htmlFor="image-upload-add"
                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        {imagePreviewUrl ? (
                          <div className="relative w-full h-full">
                            <Image
                              src={imagePreviewUrl}
                              alt="Preview"
                              fill
                              className="object-contain rounded-lg"
                              sizes="(max-width: 768px) 100vw, 50vw"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute top-2 right-2"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setSelectedImageFile(null);
                                setImagePreviewUrl(null);
                                if (imagePreviewUrl.startsWith('blob:')) {
                                  URL.revokeObjectURL(imagePreviewUrl);
                                }
                              }}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ) : (
                          <div className="text-center">
                            <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                            <p className="text-sm text-muted-foreground">
                              Haz clic para seleccionar imagen
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Máximo {process.env.NEXT_PUBLIC_MAX_UPLOAD_MB || 20}MB
                            </p>
                          </div>
                        )}
                      </label>
                      {formData.imageUrl && !imagePreviewUrl && (
                        <div className="mt-2">
                          <Label className="text-xs text-muted-foreground">O proporciona una URL:</Label>
                          <Input
                            value={formData.imageUrl}
                            onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                            placeholder="https://ejemplo.com/imagen.jpg"
                            className="h-9 mt-1"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-sm font-medium">Título de la Imagen</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="Título descriptivo de la imagen"
                    className="h-10"
                    maxLength={100}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="imageAlt" className="text-sm font-medium">Texto Alternativo</Label>
                  <Input
                    id="imageAlt"
                    value={formData.imageAlt}
                    onChange={(e) => setFormData({...formData, imageAlt: e.target.value})}
                    placeholder="Descripción para accesibilidad"
                    className="h-10"
                    maxLength={100}
                  />
                </div>
              </div>
            </div>

            {/* Botones */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setShowAddDialog(false);
                  setSelectedImageFile(null);
                  setImagePreviewUrl(null);
                  setFormData({ 
                    imageUrl: '', 
                    imageAlt: '', 
                    title: '', 
                    programId: '', 
                    projectId: '', 
                    methodologyId: '', 
                    relationType: 'program' 
                  });
                }}
              >
                Cancelar
              </Button>
              <Button type="submit" className="min-w-[120px]" disabled={uploading}>
                Agregar Imagen
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog para editar imagen */}
      <Dialog open={showEditDialog} onOpenChange={(open) => {
        setShowEditDialog(open);
        if (!open) {
          setEditingImage(null);
          setSelectedImageFile(null);
          setImagePreviewUrl(null);
          setImageMarkedForDeletion(false);
          setFormData({ 
            imageUrl: '', 
            imageAlt: '', 
            title: '', 
            programId: '', 
            projectId: '', 
            methodologyId: '', 
            relationType: 'program' 
          });
        }
      }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Editar Imagen</DialogTitle>
            <DialogDescription>
              Modifica los detalles de la imagen seleccionada
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleEditImage} className="space-y-6">
            {/* Información básica */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Información Básica</h3>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium">Tipo de Relación *</Label>
                <Select value={formData.relationType} onValueChange={(value) => setFormData({...formData, relationType: value as any})}>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Selecciona el tipo de relación" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="program">📋 Programa</SelectItem>
                    <SelectItem value="project">📁 Proyecto</SelectItem>
                    <SelectItem value="methodology">💡 Iniciativa</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {formData.relationType === 'program' && (
                  <div className="space-y-2">
                    <Label htmlFor="edit-programId" className="text-sm font-medium">Programa *</Label>
                    <Select value={formData.programId} onValueChange={(value) => setFormData({...formData, programId: value})}>
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="Selecciona un programa" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.isArray(programas) && programas.length > 0 ? (
                          programas.map((programa) => (
                            <SelectItem key={programa.id} value={programa.id}>
                              {programa.sectorName}
                            </SelectItem>
                          ))
                        ) : (
                          <div className="px-2 py-1.5 text-sm text-muted-foreground">
                            No hay programas disponibles
                          </div>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {formData.relationType === 'project' && (
                  <div className="space-y-2">
                    <Label htmlFor="edit-projectId" className="text-sm font-medium">Proyecto *</Label>
                    <Select value={formData.projectId} onValueChange={(value) => setFormData({...formData, projectId: value})}>
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="Selecciona un proyecto" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.isArray(proyectos) && proyectos.length > 0 ? (
                          proyectos.map((proyecto) => (
                            <SelectItem key={proyecto.id} value={proyecto.id}>
                              {proyecto.title}
                            </SelectItem>
                          ))
                        ) : (
                          <div className="px-2 py-1.5 text-sm text-muted-foreground">
                            No hay proyectos disponibles
                          </div>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {formData.relationType === 'methodology' && (
                  <div className="space-y-2">
                    <Label htmlFor="edit-methodologyId" className="text-sm font-medium">Iniciativa *</Label>
                    <Select value={formData.methodologyId} onValueChange={(value) => setFormData({...formData, methodologyId: value})}>
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="Selecciona una iniciativa" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.isArray(iniciativas) && iniciativas.length > 0 ? (
                          iniciativas.map((iniciativa) => (
                            <SelectItem key={iniciativa.id} value={iniciativa.id}>
                              {iniciativa.title}
                            </SelectItem>
                          ))
                        ) : (
                          <div className="px-2 py-1.5 text-sm text-muted-foreground">
                            No hay iniciativas disponibles
                          </div>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Imagen *</Label>
                  <div className="w-full min-w-0">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(file);
                        e.target.value = '';
                      }}
                      className="hidden"
                      id="image-upload-edit"
                      disabled={uploading}
                    />
                    <label
                      htmlFor="image-upload-edit"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      {imagePreviewUrl ? (
                        <div className="relative w-full h-full">
                          <Image
                            src={imagePreviewUrl}
                            alt="Preview"
                            fill
                            className="object-contain rounded-lg"
                            sizes="(max-width: 768px) 100vw, 50vw"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setSelectedImageFile(null);
                              setImagePreviewUrl(null);
                              if (imagePreviewUrl.startsWith('blob:')) {
                                URL.revokeObjectURL(imagePreviewUrl);
                              }
                            }}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : editingImage && !imageMarkedForDeletion ? (
                        <div className="relative w-full h-full">
                          <Image
                            src={editingImage.imageUrl}
                            alt={editingImage.imageAlt || editingImage.title || 'Imagen actual'}
                            fill
                            className="object-contain rounded-lg"
                            sizes="(max-width: 768px) 100vw, 50vw"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity">
                            <p className="text-white text-sm">Haz clic para cambiar</p>
                          </div>
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setImageMarkedForDeletion(true);
                              setFormData(prev => ({ ...prev, imageUrl: '' }));
                            }}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="text-center">
                          <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                          <p className="text-sm text-muted-foreground">
                            {imageMarkedForDeletion ? 'Imagen marcada para eliminar. Selecciona una nueva.' : 'Haz clic para seleccionar imagen'}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Máximo {process.env.NEXT_PUBLIC_MAX_UPLOAD_MB || 20}MB
                          </p>
                        </div>
                      )}
                    </label>
                    {imageMarkedForDeletion && !selectedImageFile && (
                      <div className="mt-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setImageMarkedForDeletion(false);
                            setFormData(prev => ({ ...prev, imageUrl: editingImage?.imageUrl || '' }));
                          }}
                        >
                          Cancelar eliminación
                        </Button>
                        <p className="text-xs text-orange-600 mt-1">Se eliminará al guardar</p>
                      </div>
                    )}
                    {formData.imageUrl && !imagePreviewUrl && !editingImage && (
                      <div className="mt-2">
                        <Label className="text-xs text-muted-foreground">O proporciona una URL:</Label>
                        <Input
                          value={formData.imageUrl}
                          onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                          placeholder="https://ejemplo.com/imagen.jpg"
                          className="h-9 mt-1"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-title" className="text-sm font-medium">Título de la Imagen</Label>
                  <Input
                    id="edit-title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="Título descriptivo de la imagen"
                    className="h-10"
                    maxLength={100}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-imageAlt" className="text-sm font-medium">Texto Alternativo</Label>
                  <Input
                    id="edit-imageAlt"
                    value={formData.imageAlt}
                    onChange={(e) => setFormData({...formData, imageAlt: e.target.value})}
                    placeholder="Descripción para accesibilidad"
                    className="h-10"
                    maxLength={100}
                  />
                </div>
              </div>
            </div>

            {/* Botones */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setShowEditDialog(false);
                  setEditingImage(null);
                  setSelectedImageFile(null);
                  setImagePreviewUrl(null);
                  setImageMarkedForDeletion(false);
                  setFormData({ 
                    imageUrl: '', 
                    imageAlt: '', 
                    title: '', 
                    programId: '', 
                    projectId: '', 
                    methodologyId: '', 
                    relationType: 'program' 
                  });
                }}
              >
                Cancelar
              </Button>
              <Button type="submit" className="min-w-[120px]" disabled={uploading}>
                {uploading ? 'Actualizando...' : 'Actualizar Imagen'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
