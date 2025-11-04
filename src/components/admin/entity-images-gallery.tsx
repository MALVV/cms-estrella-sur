'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Upload,
  X,
  Image as ImageIcon
} from 'lucide-react';
import Image from 'next/image';
import { useToast } from '@/components/ui/use-toast';

interface ImageGalleryItem {
  id: string;
  imageUrl: string;
  imageAlt?: string;
  title?: string;
  createdAt: string;
  updatedAt: string;
}

interface EntityImagesGalleryProps {
  entityType: 'project' | 'program' | 'methodology';
  entityId: string;
  entityName: string;
}

export function EntityImagesGallery({ entityType, entityId, entityName }: EntityImagesGalleryProps) {
  const { toast } = useToast();
  const [images, setImages] = useState<ImageGalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [imageToDelete, setImageToDelete] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [editingImage, setEditingImage] = useState<ImageGalleryItem | null>(null);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [imageMarkedForDeletion, setImageMarkedForDeletion] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    imageUrl: '',
    imageAlt: '',
    title: ''
  });

  useEffect(() => {
    if (entityId) {
      fetchImages();
    }
  }, [entityId, entityType]);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/image-gallery', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const allImages = await response.json();
        // Filtrar imágenes por el tipo y ID de entidad
        const filteredImages = allImages.filter((img: any) => {
          if (entityType === 'project') {
            return img.projectId === entityId;
          } else if (entityType === 'program') {
            return img.programId === entityId;
          } else if (entityType === 'methodology') {
            return img.methodologyId === entityId;
          }
          return false;
        });
        setImages(filteredImages);
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

      // Crear preview local
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

      if (entityType === 'program') {
        payload.programId = entityId;
      } else if (entityType === 'project') {
        payload.projectId = entityId;
      } else if (entityType === 'methodology') {
        payload.methodologyId = entityId;
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
        description: "La imagen ha sido agregada exitosamente.",
      });
      
      setShowAddDialog(false);
      setFormData({ imageUrl: '', imageAlt: '', title: '' });
      setSelectedImageFile(null);
      setImagePreviewUrl(null);
      fetchImages();
    } catch (error) {
      console.error('Error adding image:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Error al agregar imagen',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleEditImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingImage) return;

    try {
      setUploading(true);
      let finalImageUrl = formData.imageUrl;

      // Si hay un nuevo archivo seleccionado, subirlo
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

      // Si se marcó para eliminar, enviar null
      if (imageMarkedForDeletion) {
        finalImageUrl = '';
      }

      const payload: any = {
        imageUrl: finalImageUrl || editingImage.imageUrl,
        imageAlt: formData.imageAlt,
        title: formData.title
      };

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
      setFormData({ imageUrl: '', imageAlt: '', title: '' });
      setSelectedImageFile(null);
      setImagePreviewUrl(null);
      setImageMarkedForDeletion(false);
      fetchImages();
    } catch (error) {
      console.error('Error updating image:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Error al actualizar imagen',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteClick = (id: string) => {
    setImageToDelete(id);
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (!imageToDelete) return;

    try {
      setDeleting(true);
      const response = await fetch(`/api/admin/image-gallery/${imageToDelete}`, {
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
      
      setShowDeleteDialog(false);
      setImageToDelete(null);
      fetchImages();
    } catch (error) {
      console.error('Error deleting image:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Error al eliminar imagen',
        variant: 'destructive',
      });
    } finally {
      setDeleting(false);
    }
  };

  const openEditDialog = (image: ImageGalleryItem) => {
    setEditingImage(image);
    setFormData({
      imageUrl: image.imageUrl,
      imageAlt: image.imageAlt || '',
      title: image.title || ''
    });
    setImagePreviewUrl(null);
    setSelectedImageFile(null);
    setImageMarkedForDeletion(false);
    setShowEditDialog(true);
  };

  const resetForm = () => {
    setFormData({ imageUrl: '', imageAlt: '', title: '' });
    setSelectedImageFile(null);
    setImagePreviewUrl(null);
    setImageMarkedForDeletion(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Galería de Imágenes</h3>
          <p className="text-sm text-muted-foreground">
            Gestiona las imágenes asociadas a {entityName}
          </p>
        </div>
        <Button onClick={() => {
          resetForm();
          setShowAddDialog(true);
        }}>
          <Plus className="h-4 w-4 mr-2" />
          Agregar Imagen
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="aspect-square bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      ) : images.length === 0 ? (
        <div className="text-center py-12 border rounded-lg">
          <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No hay imágenes</h3>
          <p className="mt-1 text-sm text-gray-500">
            Comienza agregando tu primera imagen.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image) => (
            <div key={image.id} className="group relative aspect-square rounded-lg overflow-hidden border bg-muted">
              <Image
                src={image.imageUrl}
                alt={image.imageAlt || image.title || 'Imagen de galería'}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => openEditDialog(image)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDeleteClick(image.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              {image.title && (
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-2 truncate">
                  {image.title}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Dialog para agregar imagen */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto overflow-x-hidden">
          <DialogHeader>
            <DialogTitle>Agregar Imagen</DialogTitle>
            <DialogDescription>
              Agrega una nueva imagen a la galería de {entityName}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddImage} className="space-y-4 w-full min-w-0">
            <div className="space-y-2">
              <Label>Imagen *</Label>
              {imagePreviewUrl ? (
                <div className="relative w-full h-64 rounded-lg overflow-hidden border">
                  <Image
                    src={imagePreviewUrl}
                    alt="Vista previa"
                    fill
                    className="object-contain"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => {
                      setSelectedImageFile(null);
                      setImagePreviewUrl(null);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed rounded-lg p-8 text-center">
                  <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <Label htmlFor="add-image-file" className="cursor-pointer">
                    <span className="text-sm font-medium text-primary">Haz clic para subir imagen</span>
                    <Input
                      id="add-image-file"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(file);
                      }}
                    />
                  </Label>
                  <p className="text-xs text-muted-foreground mt-2">
                    JPG, PNG, WEBP o GIF. Máximo {process.env.NEXT_PUBLIC_MAX_UPLOAD_MB || 20}MB
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="add-title">Título</Label>
              <Input
                id="add-title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Título de la imagen (opcional)"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="add-alt">Texto Alternativo</Label>
              <Input
                id="add-alt"
                value={formData.imageAlt}
                onChange={(e) => setFormData({ ...formData, imageAlt: e.target.value })}
                placeholder="Descripción de la imagen"
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowAddDialog(false);
                  resetForm();
                }}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={uploading || (!selectedImageFile && !formData.imageUrl.trim())}>
                {uploading ? 'Guardando...' : 'Agregar Imagen'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog para editar imagen */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto overflow-x-hidden">
          <DialogHeader>
            <DialogTitle>Editar Imagen</DialogTitle>
            <DialogDescription>
              Edita la información de la imagen
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditImage} className="space-y-4 w-full min-w-0">
            <div className="space-y-2">
              <Label>Imagen</Label>
              {imagePreviewUrl ? (
                <div className="relative w-full h-64 rounded-lg overflow-hidden border">
                  <Image
                    src={imagePreviewUrl}
                    alt="Vista previa"
                    fill
                    className="object-contain"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => {
                      setSelectedImageFile(null);
                      setImagePreviewUrl(null);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : editingImage && !imageMarkedForDeletion ? (
                <div className="relative w-full h-64 rounded-lg overflow-hidden border">
                  <Image
                    src={editingImage.imageUrl}
                    alt={editingImage.imageAlt || 'Imagen actual'}
                    fill
                    className="object-contain"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-2">
                    <Label htmlFor="edit-image-file" className="cursor-pointer">
                      <Button type="button" variant="secondary" size="sm">
                        <Upload className="h-4 w-4 mr-2" />
                        Cambiar Imagen
                      </Button>
                      <Input
                        id="edit-image-file"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload(file);
                        }}
                      />
                    </Label>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        setImageMarkedForDeletion(true);
                        setImagePreviewUrl(null);
                        setSelectedImageFile(null);
                        toast({
                          title: 'Imagen marcada para eliminar',
                          description: 'La imagen se eliminará del bucket al guardar los cambios',
                        });
                      }}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Eliminar
                    </Button>
                  </div>
                </div>
              ) : imageMarkedForDeletion ? (
                <div className="border-2 border-dashed border-destructive rounded-lg p-8 text-center">
                  <p className="text-sm text-destructive mb-4">Se eliminará al guardar</p>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setImageMarkedForDeletion(false);
                      setImagePreviewUrl(null);
                      setSelectedImageFile(null);
                    }}
                  >
                    Cancelar eliminación
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed rounded-lg p-8 text-center">
                  <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <Label htmlFor="edit-image-file-new" className="cursor-pointer">
                    <span className="text-sm font-medium text-primary">Haz clic para subir imagen</span>
                    <Input
                      id="edit-image-file-new"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(file);
                      }}
                    />
                  </Label>
                  <p className="text-xs text-muted-foreground mt-2">
                    JPG, PNG, WEBP o GIF. Máximo {process.env.NEXT_PUBLIC_MAX_UPLOAD_MB || 20}MB
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-title">Título</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Título de la imagen (opcional)"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-alt">Texto Alternativo</Label>
              <Input
                id="edit-alt"
                value={formData.imageAlt}
                onChange={(e) => setFormData({ ...formData, imageAlt: e.target.value })}
                placeholder="Descripción de la imagen"
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowEditDialog(false);
                  setEditingImage(null);
                  resetForm();
                }}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={uploading}>
                {uploading ? 'Guardando...' : 'Guardar Cambios'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog de confirmación para eliminar imagen */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Eliminar imagen?</DialogTitle>
            <DialogDescription>
              Esta acción no se puede deshacer. La imagen se eliminará permanentemente del sistema y del bucket de almacenamiento.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteDialog(false);
                setImageToDelete(null);
              }}
              disabled={deleting}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={deleting}
            >
              {deleting ? 'Eliminando...' : 'Eliminar'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

