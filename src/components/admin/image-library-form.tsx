'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Save, Upload, Image as ImageIcon } from 'lucide-react';

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
  programId?: string;
}

interface Programa {
  id: string;
  sectorName: string;
}

interface ImageLibraryFormProps {
  image?: ImageLibraryItem | null;
  programas: Programa[];
  onClose: () => void;
}

export function ImageLibraryForm({ image, programas, onClose }: ImageLibraryFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    imageAlt: '',
    programId: '',
    isFeatured: false,
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (image) {
      setFormData({
        title: image.title,
        description: image.description || '',
        imageUrl: image.imageUrl,
        imageAlt: image.imageAlt || '',
        programId: image.programId || '',
        isFeatured: image.isFeatured,
      });
    }
  }, [image]);

  const handleFileUpload = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      if (!response.ok) throw new Error('Error al subir imagen');

      const data = await response.json();
      setFormData(prev => ({
        ...prev,
        imageUrl: data.url,
        imageAlt: data.alt || file.name,
      }));
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error al subir la imagen');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = image 
        ? `/api/admin/image-library/${image.id}`
        : '/api/admin/image-library';
      
      const method = image ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Error al guardar imagen');

      onClose();
    } catch (error) {
      console.error('Error saving image:', error);
      alert('Error al guardar la imagen');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">
          {image ? 'Editar Imagen' : 'Nueva Imagen'}
        </h1>
        <Button variant="outline" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Información de la Imagen</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Título *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                required
                placeholder="Título descriptivo de la imagen"
              />
            </div>

            <div>
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={3}
                placeholder="Descripción opcional de la imagen..."
              />
            </div>

            <div>
              <Label htmlFor="imageAlt">Texto Alternativo</Label>
              <Input
                id="imageAlt"
                value={formData.imageAlt}
                onChange={(e) => handleInputChange('imageAlt', e.target.value)}
                placeholder="Texto alternativo para accesibilidad"
              />
            </div>

            <div>
              <Label htmlFor="programId">Programa Relacionado</Label>
              <Select value={formData.programId} onValueChange={(value) => handleInputChange('programId', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar programa (opcional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Sin programa específico</SelectItem>
                  {programas.map((programa) => (
                    <SelectItem key={programa.id} value={programa.id}>
                      {programa.sectorName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isFeatured"
                checked={formData.isFeatured}
                onCheckedChange={(checked) => handleInputChange('isFeatured', checked)}
              />
              <Label htmlFor="isFeatured">Imagen Destacada</Label>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Imagen</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="imageUrl">URL de la Imagen *</Label>
              <Input
                id="imageUrl"
                value={formData.imageUrl}
                onChange={(e) => handleInputChange('imageUrl', e.target.value)}
                required
                placeholder="https://ejemplo.com/imagen.jpg"
              />
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
              <div className="mt-4">
                <Label htmlFor="file-upload" className="cursor-pointer">
                  <span className="mt-2 block text-sm font-medium text-gray-900">
                    {uploading ? 'Subiendo...' : 'Subir archivo'}
                  </span>
                  <input
                    id="file-upload"
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
                </Label>
                <p className="mt-1 text-xs text-gray-500">
                  PNG, JPG, GIF hasta 10MB
                </p>
              </div>
            </div>

            {formData.imageUrl && (
              <div className="mt-4">
                <Label>Vista Previa</Label>
                <div className="mt-2">
                  <img
                    src={formData.imageUrl}
                    alt={formData.imageAlt || formData.title}
                    className="max-w-full h-48 object-cover rounded-lg border"
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" disabled={loading || uploading}>
            <Save className="h-4 w-4 mr-2" />
            {loading ? 'Guardando...' : 'Guardar'}
          </Button>
        </div>
      </form>
    </div>
  );
}
