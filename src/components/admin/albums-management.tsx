'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  Search, 
  Plus, 
  Upload,
  ImageIcon,
  X,
  Star,
  StarOff
} from 'lucide-react';
import Image from 'next/image';
import { Checkbox as UICheckbox } from '@/components/ui/checkbox';

interface Album {
  id: string;
  title: string;
  description?: string;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  creator?: {
    id: string;
    name?: string;
    email: string;
  };
  _count?: {
    images: number;
  };
  images?: GalleryImage[];
}

interface GalleryImage {
  id: string;
  imageUrl: string;
  caption?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  albumId: string;
}

interface ImageFile {
  file: File;
  previewUrl: string;
  uploadUrl?: string;
  caption: string;
}

export function AlbumsManagement() {
  const { toast } = useToast();
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddImagesDialogOpen, setIsAddImagesDialogOpen] = useState(false);
  const [isViewImagesDialogOpen, setIsViewImagesDialogOpen] = useState(false);
  const [editingAlbum, setEditingAlbum] = useState<Album | null>(null);
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [deletingAlbum, setDeletingAlbum] = useState<Album | null>(null);
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<ImageFile[]>([]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    isActive: true,
    isFeatured: false,
  });

  useEffect(() => {
    fetchAlbums();
  }, []);

  const fetchAlbums = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/albums');
      if (!response.ok) throw new Error('Error al cargar álbumes');
      const data = await response.json();
      setAlbums(data);
    } catch (error) {
      console.error('Error al cargar álbumes:', error);
      toast({
        title: 'Error',
        description: 'Error al cargar los álbumes',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const maxMb = Number(process.env.NEXT_PUBLIC_MAX_UPLOAD_MB || 20);
    const maxSize = maxMb * 1024 * 1024;

    const newFiles: ImageFile[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      if (!file.type.startsWith('image/')) {
        toast({
          title: 'Error',
          description: `${file.name} no es una imagen válida`,
          variant: 'destructive',
        });
        continue;
      }

      if (file.size > maxSize) {
        toast({
          title: 'Error',
          description: `${file.name} es demasiado grande. Máximo ${maxMb}MB`,
          variant: 'destructive',
        });
        continue;
      }

      const previewUrl = URL.createObjectURL(file);
      newFiles.push({
        file,
        previewUrl,
        caption: '',
      });
    }

    setSelectedFiles(prev => [...prev, ...newFiles]);
    e.target.value = ''; // Reset input
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => {
      const newFiles = [...prev];
      URL.revokeObjectURL(newFiles[index].previewUrl);
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const handleCreateAlbum = async () => {
    if (!formData.title.trim()) {
      toast({
        title: 'Error',
        description: 'El título es requerido',
        variant: 'destructive',
      });
      return;
    }

    try {
      const response = await fetch('/api/admin/albums', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error al crear álbum');
      }

      toast({
        title: 'Éxito',
        description: 'Álbum creado exitosamente',
      });

      setIsCreateDialogOpen(false);
      setFormData({ title: '', description: '', isActive: true, isFeatured: false });
      fetchAlbums();
    } catch (error) {
      console.error('Error al crear álbum:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Error al crear álbum',
        variant: 'destructive',
      });
    }
  };

  const handleEditAlbum = async () => {
    if (!editingAlbum || !formData.title.trim()) {
      toast({
        title: 'Error',
        description: 'El título es requerido',
        variant: 'destructive',
      });
      return;
    }

    try {
      const response = await fetch(`/api/admin/albums/${editingAlbum.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error al actualizar álbum');
      }

      toast({
        title: 'Éxito',
        description: 'Álbum actualizado exitosamente',
      });

      setIsEditDialogOpen(false);
      setEditingAlbum(null);
      setFormData({ title: '', description: '', isActive: true, isFeatured: false });
      fetchAlbums();
    } catch (error) {
      console.error('Error al actualizar álbum:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Error al actualizar álbum',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteAlbum = async () => {
    if (!deletingAlbum) return;

    try {
      const response = await fetch(`/api/admin/albums/${deletingAlbum.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error al eliminar álbum');
      }

      toast({
        title: 'Éxito',
        description: 'Álbum eliminado exitosamente',
      });

      setDeletingAlbum(null);
      fetchAlbums();
    } catch (error) {
      console.error('Error al eliminar álbum:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Error al eliminar álbum',
        variant: 'destructive',
      });
    }
  };

  const handleAddImages = async () => {
    if (!selectedAlbum || selectedFiles.length === 0) return;

    try {
      setUploading(true);

      // Subir todas las imágenes
      const uploadedImages = [];
      for (const imageFile of selectedFiles) {
        const formData = new FormData();
        formData.append('file', imageFile.file);

        const uploadResponse = await fetch('/api/admin/albums/upload', {
          method: 'POST',
          body: formData,
        });

        if (!uploadResponse.ok) {
          const error = await uploadResponse.json();
          throw new Error(error.error || 'Error al subir imagen');
        }

        const uploadData = await uploadResponse.json();
        uploadedImages.push({
          imageUrl: uploadData.url,
          caption: imageFile.caption.trim() || null,
        });
      }

      // Agregar imágenes al álbum
      const response = await fetch(`/api/admin/albums/${selectedAlbum.id}/images`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ images: uploadedImages }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error al agregar imágenes');
      }

      toast({
        title: 'Éxito',
        description: `${uploadedImages.length} imagen(es) agregada(s) exitosamente`,
      });

      setIsAddImagesDialogOpen(false);
      setSelectedAlbum(null);
      setSelectedFiles([]);
      fetchAlbums();
    } catch (error) {
      console.error('Error al agregar imágenes:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Error al agregar imágenes',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const openEditDialog = (album: Album) => {
    setEditingAlbum(album);
    setFormData({
      title: album.title,
      description: album.description || '',
      isActive: album.isActive,
      isFeatured: album.isFeatured,
    });
    setIsEditDialogOpen(true);
  };

  const openAddImagesDialog = (album: Album) => {
    setSelectedAlbum(album);
    setSelectedFiles([]);
    setIsAddImagesDialogOpen(true);
  };

  const openViewImagesDialog = async (album: Album) => {
    try {
      const response = await fetch(`/api/admin/albums/${album.id}?includeImages=true`);
      if (!response.ok) throw new Error('Error al cargar imágenes');
      const albumWithImages = await response.json();
      setSelectedAlbum(albumWithImages);
      setIsViewImagesDialogOpen(true);
    } catch (error) {
      console.error('Error al cargar imágenes:', error);
      toast({
        title: 'Error',
        description: 'Error al cargar las imágenes del álbum',
        variant: 'destructive',
      });
    }
  };

  const filteredAlbums = albums.filter(album =>
    album.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (album.description && album.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Galería de Imágenes</h1>
          <p className="text-muted-foreground mt-1">
            Gestiona álbumes y sus imágenes
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setFormData({ title: '', description: '', isActive: true, isFeatured: false })}>
              <Plus className="w-4 h-4 mr-2" />
              Crear Álbum
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Álbum</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <label className="text-sm font-medium">Título *</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Título del álbum"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Descripción</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descripción del álbum"
                  rows={4}
                />
              </div>
              <div className="flex items-center space-x-2">
                <UICheckbox
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked === true })}
                />
                <label htmlFor="isActive" className="text-sm font-medium cursor-pointer">
                  Activo
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <UICheckbox
                  id="isFeatured"
                  checked={formData.isFeatured}
                  onCheckedChange={(checked) => setFormData({ ...formData, isFeatured: checked === true })}
                />
                <label htmlFor="isFeatured" className="text-sm font-medium cursor-pointer">
                  Destacado
                </label>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateAlbum}>Crear</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar álbumes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Albums Grid */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Cargando álbumes...</p>
        </div>
      ) : filteredAlbums.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No se encontraron álbumes</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAlbums.map((album) => (
            <Card key={album.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{album.title}</CardTitle>
                  <div className="flex gap-1">
                    {album.isFeatured && (
                      <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                        <Star className="w-3 h-3 mr-1" />
                        Destacado
                      </Badge>
                    )}
                    {album.isActive ? (
                      <Badge variant="outline" className="bg-green-100 text-green-800">
                        <Eye className="w-3 h-3 mr-1" />
                        Activo
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-gray-100 text-gray-800">
                        <EyeOff className="w-3 h-3 mr-1" />
                        Inactivo
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {album.description && (
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {album.description}
                  </p>
                )}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-muted-foreground">
                    {album._count?.images || 0} imagen(es)
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openViewImagesDialog(album)}
                    className="flex-1"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Ver
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openAddImagesDialog(album)}
                    className="flex-1"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Agregar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditDialog(album)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDeletingAlbum(album)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Álbum</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium">Título *</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Título del álbum"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Descripción</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descripción del álbum"
                rows={4}
              />
            </div>
            <div className="flex items-center space-x-2">
              <UICheckbox
                id="editIsActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked === true })}
              />
              <label htmlFor="editIsActive" className="text-sm font-medium cursor-pointer">
                Activo
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <UICheckbox
                id="editIsFeatured"
                checked={formData.isFeatured}
                onCheckedChange={(checked) => setFormData({ ...formData, isFeatured: checked === true })}
              />
              <label htmlFor="editIsFeatured" className="text-sm font-medium cursor-pointer">
                Destacado
              </label>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleEditAlbum}>Guardar</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Images Dialog */}
      <Dialog open={isAddImagesDialogOpen} onOpenChange={setIsAddImagesDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto overflow-x-hidden">
          <DialogHeader>
            <DialogTitle>Agregar Imágenes a {selectedAlbum?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Seleccionar Imágenes (múltiples)
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="image-upload"
                disabled={uploading}
              />
              <label
                htmlFor="image-upload"
                className="flex items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="text-center">
                  <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Haz clic para seleccionar imágenes
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Máximo {process.env.NEXT_PUBLIC_MAX_UPLOAD_MB || 20}MB por imagen
                  </p>
                </div>
              </label>
            </div>

            {selectedFiles.length > 0 && (
              <div className="space-y-4">
                <p className="text-sm font-medium">
                  {selectedFiles.length} imagen(es) seleccionada(s)
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto">
                  {selectedFiles.map((imageFile, index) => (
                    <div key={index} className="border rounded-lg p-3 space-y-2">
                      <div className="relative w-full h-32 rounded overflow-hidden bg-gray-100 dark:bg-gray-800">
                        <Image
                          src={imageFile.previewUrl}
                          alt={`Preview ${index + 1}`}
                          fill
                          className="object-contain"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                        <Button
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={() => removeFile(index)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                      <Input
                        placeholder="Pie de foto (opcional)"
                        value={imageFile.caption}
                        onChange={(e) => {
                          const newFiles = [...selectedFiles];
                          newFiles[index].caption = e.target.value;
                          setSelectedFiles(newFiles);
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {uploading && (
              <div className="text-center py-4">
                <p className="text-sm text-muted-foreground">
                  Subiendo imágenes al servidor...
                </p>
              </div>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => {
              setIsAddImagesDialogOpen(false);
              setSelectedFiles([]);
            }}>
              Cancelar
            </Button>
            <Button onClick={handleAddImages} disabled={selectedFiles.length === 0 || uploading}>
              {uploading ? 'Subiendo...' : `Agregar ${selectedFiles.length} imagen(es)`}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Images Dialog */}
      <Dialog open={isViewImagesDialogOpen} onOpenChange={setIsViewImagesDialogOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto overflow-x-hidden">
          <DialogHeader>
            <DialogTitle>{selectedAlbum?.title}</DialogTitle>
          </DialogHeader>
          {selectedAlbum?.images && selectedAlbum.images.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-4">
              {selectedAlbum.images.map((image) => (
                <Card key={image.id}>
                  <CardContent className="p-0">
                    <div className="relative w-full h-48 rounded-t-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                      <Image
                        src={image.imageUrl}
                        alt={image.caption || 'Imagen de galería'}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </div>
                    {image.caption && (
                      <div className="p-3">
                        <p className="text-sm text-muted-foreground">{image.caption}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No hay imágenes en este álbum</p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      {deletingAlbum && (
        <Dialog open={!!deletingAlbum} onOpenChange={() => setDeletingAlbum(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Eliminar Álbum</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p className="text-sm text-gray-600">
                ¿Estás seguro de que quieres eliminar el álbum <strong>"{deletingAlbum.title}"</strong>?
              </p>
              <p className="text-sm text-red-600 mt-2 font-medium">
                Esta acción eliminará todas las imágenes asociadas y no se puede deshacer.
              </p>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDeletingAlbum(null)}>
                Cancelar
              </Button>
              <Button variant="destructive" onClick={handleDeleteAlbum}>
                Eliminar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

