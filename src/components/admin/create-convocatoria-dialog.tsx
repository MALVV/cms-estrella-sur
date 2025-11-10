'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { Upload, ImageIcon, X, File, Trash2 } from 'lucide-react';
import Image from 'next/image';

interface CreateConvocatoriaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function CreateConvocatoriaDialog({ open, onOpenChange, onSuccess }: CreateConvocatoriaDialogProps) {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingDocuments, setUploadingDocuments] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>('');
  const [selectedFiles, setSelectedFiles] = useState<Array<{ file: File; previewUrl?: string }>>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    fullDescription: '',
    requirements: '',
    imageUrl: '',
    imageAlt: '',
    startDate: '',
    endDate: '',
    status: 'DRAFT',
    isActive: true,
    isFeatured: false,
  });
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = async (file: File) => {
    try {
      const maxMb = Number(process.env.NEXT_PUBLIC_MAX_UPLOAD_MB || process.env.MAX_UPLOAD_MB || 20);
      const maxBytes = maxMb * 1024 * 1024;

      if (!file.type.startsWith('image/')) {
        throw new Error('Solo se permiten archivos de imagen');
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
        title: 'Imagen seleccionada',
        description: 'La imagen se subirá al bucket al crear la convocatoria',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Error al procesar la imagen',
        variant: 'destructive',
      });
    }
  };

  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const maxMb = Number(process.env.NEXT_PUBLIC_MAX_UPLOAD_MB || process.env.MAX_UPLOAD_MB || 100);
    const maxBytes = maxMb * 1024 * 1024;

    files.forEach(file => {
      if (file.size > maxBytes) {
        toast({
          title: 'Error',
          description: `El archivo ${file.name} es demasiado grande. Máximo ${maxMb}MB`,
          variant: 'destructive',
        });
        return;
      }

      // Crear preview URL para mostrar el nombre del archivo
      const fileObj = {
        file,
        previewUrl: undefined, // No necesitamos preview para documentos
      };

      setSelectedFiles(prev => [...prev, fileObj]);
      toast({
        title: 'Documento seleccionado',
        description: `El documento se subirá al bucket al crear la convocatoria`,
      });
    });
  };

  const removeDocument = (index: number) => {
    setSelectedFiles(prev => {
      const newFiles = prev.filter((_, i) => i !== index);
      return newFiles;
    });
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Convertir los requisitos de texto multilínea a array simple
      const requirementsArray = formData.requirements
        .split('\n')
        .filter(line => line.trim() !== '')
        .map(line => line.trim());
      
      let finalImageUrl = formData.imageUrl;
      let finalImageAlt = formData.imageAlt;

      // Si hay una imagen seleccionada, subirla al bucket primero
      if (selectedImageFile) {
        setUploading(true);
        try {
          const formDataToUpload = new FormData();
          formDataToUpload.append('file', selectedImageFile);

          const uploadResponse = await fetch('/api/admin/convocatorias/upload', {
            method: 'POST',
            body: formDataToUpload,
          });

          if (!uploadResponse.ok) {
            const error = await uploadResponse.json();
            throw new Error(error.error || 'Error al subir imagen');
          }

          const uploadData = await uploadResponse.json();
          finalImageUrl = uploadData.url;
          finalImageAlt = uploadData.alt || selectedImageFile.name;
        } catch (error) {
          console.error('Error uploading image:', error);
          toast({
            title: 'Error',
            description: error instanceof Error ? error.message : 'Error al subir la imagen',
            variant: 'destructive',
          });
          setUploading(false);
          setLoading(false);
          return;
        } finally {
          setUploading(false);
        }
      }

      // Subir documentos si hay archivos seleccionados
      const uploadedDocuments: Array<{ url: string; originalName: string }> = [];
      if (selectedFiles.length > 0) {
        setUploadingDocuments(true);
        try {
          for (const selectedFile of selectedFiles) {
            const formDataToUpload = new FormData();
            formDataToUpload.append('file', selectedFile.file);

            const uploadResponse = await fetch('/api/admin/convocatorias/upload-document', {
              method: 'POST',
              body: formDataToUpload,
            });

            if (!uploadResponse.ok) {
              const error = await uploadResponse.json();
              throw new Error(error.error || 'Error al subir documento');
            }

            const uploadData = await uploadResponse.json();
            uploadedDocuments.push({
              url: uploadData.url,
              originalName: uploadData.originalName || selectedFile.file.name,
            });
          }
        } catch (error) {
          console.error('Error uploading documents:', error);
          toast({
            title: 'Error',
            description: error instanceof Error ? error.message : 'Error al subir documentos',
            variant: 'destructive',
          });
          setUploadingDocuments(false);
          setLoading(false);
          return;
        } finally {
          setUploadingDocuments(false);
        }
      }
      
      const response = await fetch('/api/admin/convocatorias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          ...formData,
          imageUrl: finalImageUrl,
          imageAlt: finalImageAlt,
          requirements: requirementsArray,
          documents: uploadedDocuments,
        }),
      });

      if (!response.ok) {
        throw new Error('Error al crear convocatoria');
      }

      toast({
        title: 'Éxito',
        description: 'Convocatoria creada exitosamente',
      });
      setSelectedImageFile(null);
      setImagePreviewUrl('');
      setSelectedFiles([]);
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: 'Error',
        description: 'Error al crear convocatoria',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto overflow-x-hidden">
        <DialogHeader>
          <DialogTitle>Nueva Convocatoria</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 w-full min-w-0">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Título *</Label>
              <Input id="title" name="title" value={formData.title} onChange={handleInputChange} required />
            </div>
            <div>
              <Label htmlFor="status">Estado</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DRAFT">Borrador</SelectItem>
                  <SelectItem value="ACTIVE">Activa</SelectItem>
                  <SelectItem value="UPCOMING">Próxima</SelectItem>
                  <SelectItem value="CLOSED">Cerrada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="image">Imagen</Label>
            {!imagePreviewUrl ? (
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-primary transition-colors mt-2 w-full min-w-0">
                <ImageIcon className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                <div className="mt-4">
                  <label htmlFor="convocatoria-image-input" className="cursor-pointer">
                    <span className="mt-2 block text-base font-semibold text-gray-900 dark:text-gray-100 mb-1 underline">
                      Haz clic para subir imagen
                    </span>
                    <Input
                      id="convocatoria-image-input"
                      name="image-upload"
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(file);
                      }}
                      disabled={uploading || loading}
                    />
                  </label>
                  <p className="mt-2 text-sm text-gray-500">
                    JPG, PNG, WEBP, GIF hasta {String(Number(process.env.NEXT_PUBLIC_MAX_UPLOAD_MB || process.env.MAX_UPLOAD_MB || 20))}MB
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4 mt-2">
                <div className="relative w-full h-48 border rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                  <Image
                    src={imagePreviewUrl}
                    alt={formData.imageAlt || 'Preview'}
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
                        title: 'Imagen eliminada',
                        description: 'La imagen fue removida del formulario'
                      });
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="imageAlt">Texto alternativo</Label>
            <Input id="imageAlt" name="imageAlt" value={formData.imageAlt} onChange={handleInputChange} />
          </div>

          <div>
            <Label htmlFor="description">Descripción Corta *</Label>
            <Textarea id="description" name="description" value={formData.description} onChange={handleInputChange} required />
          </div>

          <div>
            <Label htmlFor="fullDescription">Descripción Completa</Label>
            <Textarea id="fullDescription" name="fullDescription" value={formData.fullDescription} onChange={handleInputChange} rows={4} />
          </div>

          <div>
            <Label htmlFor="requirements">Requisitos del Voluntariado/Pasantía (uno por línea)</Label>
            <Textarea id="requirements" name="requirements" value={formData.requirements} onChange={handleInputChange} rows={6} placeholder="Ejemplo:&#10;Experiencia mínima de 3 años en educación&#10;Disponibilidad de tiempo completo&#10;Licencia de conducir válida&#10;..." />
          </div>

          <div>
            <Label htmlFor="documents">Documentos</Label>
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 mt-2 w-full min-w-0">
              <div className="flex flex-col gap-4">
                {selectedFiles.length > 0 && (
                  <div className="space-y-2">
                    {selectedFiles.map((fileObj, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded border">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <File className="h-4 w-4 text-gray-500 flex-shrink-0" />
                          <span className="text-sm truncate">{fileObj.file.name}</span>
                          <span className="text-xs text-gray-500 flex-shrink-0">
                            ({(fileObj.file.size / 1024 / 1024).toFixed(2)} MB)
                          </span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeDocument(index)}
                          disabled={uploadingDocuments || loading}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
                <div>
                  <Input
                    id="convocatoria-documents-input"
                    name="documents-upload"
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                    className="sr-only"
                    onChange={handleDocumentChange}
                    disabled={uploadingDocuments || loading}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    disabled={uploadingDocuments || loading}
                    onClick={() => {
                      const input = document.getElementById('convocatoria-documents-input');
                      if (input) {
                        input.click();
                      }
                    }}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    {selectedFiles.length > 0 ? 'Agregar más documentos' : 'Agregar documentos'}
                  </Button>
                </div>
                <p className="text-xs text-gray-500 text-center">
                  PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX hasta {String(Number(process.env.NEXT_PUBLIC_MAX_UPLOAD_MB || process.env.MAX_UPLOAD_MB || 100))}MB cada uno
                </p>
                {uploadingDocuments && (
                  <p className="text-sm text-blue-600 text-center">
                    Subiendo documentos...
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startDate">Fecha de Inicio *</Label>
              <Input id="startDate" name="startDate" type="date" value={formData.startDate} onChange={handleInputChange} required />
            </div>
            <div>
              <Label htmlFor="endDate">Fecha de Fin *</Label>
              <Input id="endDate" name="endDate" type="date" value={formData.endDate} onChange={handleInputChange} required />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
              />
              <span className="text-sm">Activa</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isFeatured}
                onChange={(e) => setFormData(prev => ({ ...prev, isFeatured: e.target.checked }))}
              />
              <span className="text-sm">Destacada</span>
            </label>
          </div>

          <Button type="submit" disabled={loading || uploading || uploadingDocuments}>
            {loading || uploading || uploadingDocuments ? (uploadingDocuments ? 'Subiendo documentos...' : 'Creando...') : 'Crear Convocatoria'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

