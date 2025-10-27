'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search, Edit, Trash2, Eye, EyeOff, Upload } from 'lucide-react';
import { ImageLibraryForm } from './image-library-form';
import { ImageLibraryView } from './image-library-view';

interface ImageLibraryItem {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  imageAlt?: string;
  fileName?: string;
  fileSize?: number;
  fileType?: string;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
  creator: {
    id: string;
    name: string;
    email: string;
  };
  programa?: {
    id: string;
    sectorName: string;
  };
}

interface Programa {
  id: string;
  sectorName: string;
}

export function ImageLibraryManagement() {
  const [images, setImages] = useState<ImageLibraryItem[]>([]);
  const [programas, setProgramas] = useState<Programa[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPrograma, setSelectedPrograma] = useState<string>('');
  const [showForm, setShowForm] = useState(false);
  const [editingImage, setEditingImage] = useState<ImageLibraryItem | null>(null);
  const [viewingImage, setViewingImage] = useState<ImageLibraryItem | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  });

  const fetchProgramas = async () => {
    try {
      const response = await fetch(`/api/admin/programas?limit=100`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error('Error al cargar programas');
      const data = await response.json();
      setProgramas(data.programas);
    } catch (error) {
      console.error('Error fetching programas:', error);
    }
  };

  const fetchImages = async (page = 1, search = '', programaId = '') => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
        ...(search && { search }),
        ...(programaId && { programaId })
      });

      const response = await fetch(`/api/admin/image-library?${params}`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error('Error al cargar imágenes');

      const data = await response.json();
      setImages(data.images);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgramas();
    fetchImages();
  }, []);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    fetchImages(1, value, selectedPrograma);
  };

  const handleProgramaFilter = (value: string) => {
    setSelectedPrograma(value);
    fetchImages(1, searchTerm, value);
  };

  const handleCreate = () => {
    setEditingImage(null);
    setShowForm(true);
  };

  const handleEdit = (image: ImageLibraryItem) => {
    setEditingImage(image);
    setShowForm(true);
  };

  const handleView = (image: ImageLibraryItem) => {
    setViewingImage(image);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta imagen?')) return;

    try {
      const response = await fetch(`/api/admin/image-library/${id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Error al eliminar imagen');

      await fetchImages(pagination.page, searchTerm, selectedPrograma);
    } catch (error) {
      console.error('Error deleting image:', error);
      alert('Error al eliminar la imagen');
    }
  };

  const handleToggleStatus = async (id: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/admin/image-library/${id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !isActive })
      });

      if (!response.ok) throw new Error('Error al cambiar estado');

      await fetchImages(pagination.page, searchTerm, selectedPrograma);
    } catch (error) {
      console.error('Error toggling status:', error);
      alert('Error al cambiar el estado de la imagen');
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingImage(null);
    fetchImages(pagination.page, searchTerm, selectedPrograma);
  };

  const handleViewClose = () => {
    setViewingImage(null);
  };

  if (showForm) {
    return (
      <ImageLibraryForm
        image={editingImage}
        programas={programas}
        onClose={handleFormClose}
      />
    );
  }

  if (viewingImage) {
    return (
      <ImageLibraryView
        image={viewingImage}
        onClose={handleViewClose}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Biblioteca de Imágenes</h1>
        <Button onClick={handleCreate} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nueva Imagen
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Imágenes</CardTitle>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar imágenes..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedPrograma} onValueChange={handleProgramaFilter}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Filtrar por programa" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos los programas</SelectItem>
                {programas.map((programa) => (
                  <SelectItem key={programa.id} value={programa.id}>
                    {programa.sectorName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Cargando...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {images.length === 0 ? (
                <div className="col-span-full text-center py-8 text-gray-500">
                  No se encontraron imágenes
                </div>
              ) : (
                images.map((image) => (
                  <div
                    key={image.id}
                    className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="aspect-square relative">
                      <img
                        src={image.imageUrl}
                        alt={image.imageAlt || image.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2 flex gap-1">
                        {image.isFeatured && (
                          <Badge variant="secondary" className="text-xs">Destacado</Badge>
                        )}
                        <Badge variant={image.isActive ? 'default' : 'secondary'} className="text-xs">
                          {image.isActive ? 'Activo' : 'Inactivo'}
                        </Badge>
                      </div>
                    </div>
                    <div className="p-3">
                      <h3 className="font-semibold text-sm mb-1 line-clamp-1">
                        {image.title}
                      </h3>
                      {image.programa && (
                        <p className="text-xs text-blue-600 mb-2">
                          {image.programa.sectorName}
                        </p>
                      )}
                      <div className="flex justify-between items-center">
                        <div className="flex gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleView(image)}
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(image)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleToggleStatus(image.id, image.isActive)}
                          >
                            {image.isActive ? (
                              <EyeOff className="h-3 w-3" />
                            ) : (
                              <Eye className="h-3 w-3" />
                            )}
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(image.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {pagination.pages > 1 && (
            <div className="flex justify-center mt-6">
              <div className="flex gap-2">
                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={page === pagination.page ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => fetchImages(page, searchTerm, selectedPrograma)}
                  >
                    {page}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

