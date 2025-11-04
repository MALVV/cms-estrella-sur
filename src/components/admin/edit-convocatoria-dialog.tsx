'use client';

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { Upload, ImageIcon, X, File, Trash2 } from 'lucide-react';
import Image from 'next/image';

interface Convocatoria {
  id: string;
  title: string;
  description: string;
  fullDescription: string;
  imageUrl: string;
  imageAlt?: string;
  startDate: string;
  endDate: string;
  requirements: any[];
  documents: any[];
  status: string;
  isActive: boolean;
  isFeatured: boolean;
}

interface EditConvocatoriaDialogProps {
  convocatoria: Convocatoria;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function EditConvocatoriaDialog({ convocatoria, open, onOpenChange, onSuccess }: EditConvocatoriaDialogProps) {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingDocuments, setUploadingDocuments] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>('');
  const [imageMarkedForDeletion, setImageMarkedForDeletion] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<Array<{ file: File; previewUrl?: string }>>([]);
  const [existingDocuments, setExistingDocuments] = useState<string[]>([]);
  const [documentsToDelete, setDocumentsToDelete] = useState<string[]>([]);
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

  useEffect(() => {
    if (convocatoria) {
      const startDate = convocatoria.startDate ? new Date(convocatoria.startDate).toISOString().split('T')[0] : '';
      const endDate = convocatoria.endDate ? new Date(convocatoria.endDate).toISOString().split('T')[0] : '';
      
      // Convertir el array de requisitos a texto multilínea
      const requirementsText = Array.isArray((convocatoria as any).requirements) 
        ? (convocatoria as any).requirements.map((req: any) => typeof req === 'string' ? req : (req.text || req)).join('\n')
        : '';
      
      setFormData({
        title: convocatoria.title || '',
        description: convocatoria.description || '',
        fullDescription: convocatoria.fullDescription || '',
        requirements: requirementsText,
        imageUrl: convocatoria.imageUrl || '',
        imageAlt: convocatoria.imageAlt || '',
        startDate: startDate,
        endDate: endDate,
        status: convocatoria.status || 'DRAFT',
        isActive: convocatoria.isActive ?? true,
        isFeatured: convocatoria.isFeatured ?? false,
      });
      setSelectedImageFile(null);
      setImagePreviewUrl('');
      setImageMarkedForDeletion(false);
      
      // Inicializar documentos existentes (mantener formato original para compatibilidad)
      const existingDocs = Array.isArray(convocatoria.documents) 
        ? convocatoria.documents
        : [];
      setExistingDocuments(existingDocs);
      setSelectedFiles([]);
      setDocumentsToDelete([]);
    }
  }, [convocatoria]);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
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
      setImageMarkedForDeletion(false);
      toast({
        title: 'Imagen seleccionada',
        description: 'La imagen se subirá al bucket al actualizar la convocatoria',
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

      const fileObj = {
        file,
        previewUrl: undefined,
      };

      setSelectedFiles(prev => [...prev, fileObj]);
      toast({
        title: 'Documento seleccionado',
        description: `El documento se subirá al bucket al actualizar la convocatoria`,
      });
    });
  };

  const removeDocument = (index: number) => {
    setSelectedFiles(prev => {
      const newFiles = prev.filter((_, i) => i !== index);
      return newFiles;
    });
  };

  const removeExistingDocument = (url: string) => {
    setExistingDocuments(prev => prev.filter(doc => doc !== url));
    setDocumentsToDelete(prev => [...prev, url]);
    toast({
      title: 'Documento marcado para eliminar',
      description: 'Se eliminará del bucket al guardar los cambios',
    });
  };

  const cancelDocumentDeletion = (url: string) => {
    setDocumentsToDelete(prev => prev.filter(doc => doc !== url));
    setExistingDocuments(prev => [...prev, url]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Convertir los requisitos de texto multilínea a array
      const requirementsArray = formData.requirements
        .split('\n')
        .filter(line => line.trim() !== '')
        .map(line => line.trim());
      
      let finalImageUrl: string | null = formData.imageUrl || null;
      let finalImageAlt: string | null = formData.imageAlt || null;

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
      } else if (imageMarkedForDeletion) {
        finalImageUrl = null as any;
      }

      // Subir nuevos documentos si hay archivos seleccionados
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

      // Normalizar documentos existentes (pueden ser strings o objetos)
      const normalizedExistingDocs = existingDocuments
        .filter(doc => !documentsToDelete.includes(doc))
        .map((doc: any) => {
          // Si es string (formato antiguo), mantenerlo como string para compatibilidad
          // Si es objeto, mantenerlo como objeto
          if (typeof doc === 'string') {
            return doc;
          }
          return {
            url: doc.url || doc,
            originalName: doc.originalName || (typeof doc === 'string' ? doc.split('/').pop() : 'Documento'),
          };
        });

      // Combinar documentos existentes (normalizados) con los nuevos
      const finalDocuments = [
        ...normalizedExistingDocs,
        ...uploadedDocuments
      ];
      
      const response = await fetch(`/api/admin/convocatorias/${convocatoria.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          ...formData,
          imageUrl: imageMarkedForDeletion ? null : (finalImageUrl !== undefined ? finalImageUrl : convocatoria.imageUrl),
          imageAlt: finalImageAlt || formData.imageAlt,
          requirements: requirementsArray,
          documents: finalDocuments,
          documentsToDelete: documentsToDelete, // Enviar documentos a eliminar
        }),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar convocatoria');
      }

      toast({
        title: 'Éxito',
        description: 'Convocatoria actualizada exitosamente',
      });
      setSelectedImageFile(null);
      setImagePreviewUrl('');
      setImageMarkedForDeletion(false);
      setSelectedFiles([]);
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: 'Error',
        description: 'Error al actualizar convocatoria',
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
          <DialogTitle>Editar Convocatoria</DialogTitle>
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
            <Label htmlFor="description">Descripción Corta *</Label>
            <Textarea id="description" name="description" value={formData.description} onChange={handleInputChange} required />
          </div>

          <div>
            <Label htmlFor="fullDescription">Descripción Completa</Label>
            <Textarea id="fullDescription" name="fullDescription" value={formData.fullDescription} onChange={handleInputChange} rows={4} />
          </div>

          <div>
            <Label htmlFor="requirements">Requisitos del Voluntariado (uno por línea)</Label>
            <Textarea id="requirements" name="requirements" value={formData.requirements} onChange={handleInputChange} rows={6} placeholder="Ejemplo:&#10;Experiencia mínima de 3 años en educación&#10;Disponibilidad de tiempo completo&#10;Licencia de conducir válida&#10;..." />
          </div>

          <div>
            <Label htmlFor="documents">Documentos</Label>
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 mt-2 w-full min-w-0">
              <div className="flex flex-col gap-4">
                {/* Documentos existentes */}
                {existingDocuments.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Documentos actuales:</p>
                    {existingDocuments.map((doc: any, index) => {
                      // Manejar tanto formato antiguo (string) como nuevo (objeto)
                      const docUrl = typeof doc === 'string' ? doc : (doc.url || doc);
                      const fileName = typeof doc === 'object' && doc.originalName 
                        ? doc.originalName 
                        : (typeof doc === 'string' ? doc.split('/').pop() : docUrl.split('/').pop() || `Documento ${index + 1}`);
                      
                      return (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded border">
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <File className="h-4 w-4 text-gray-500 flex-shrink-0" />
                            <a
                              href={docUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:underline truncate"
                            >
                              {fileName}
                            </a>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeExistingDocument(doc)}
                            disabled={uploadingDocuments || loading}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                )}
                {/* Documentos marcados para eliminar */}
                {documentsToDelete.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-red-600">Documentos que se eliminarán:</p>
                    {documentsToDelete.map((url, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-red-50 dark:bg-red-900/20 rounded border border-red-200">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <File className="h-4 w-4 text-red-500 flex-shrink-0" />
                          <span className="text-sm text-red-600 truncate line-through">
                            {url.split('/').pop() || `Documento ${index + 1}`}
                          </span>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => cancelDocumentDeletion(url)}
                          disabled={uploadingDocuments || loading}
                        >
                          Cancelar
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
                {/* Nuevos documentos seleccionados */}
                {selectedFiles.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-blue-600">Nuevos documentos:</p>
                    {selectedFiles.map((fileObj, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <File className="h-4 w-4 text-blue-500 flex-shrink-0" />
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
                    id="edit-convocatoria-documents-input"
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
                      const input = document.getElementById('edit-convocatoria-documents-input');
                      if (input) {
                        input.click();
                      }
                    }}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    {selectedFiles.length > 0 || existingDocuments.length > 0 ? 'Agregar más documentos' : 'Agregar documentos'}
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

          <div>
            <Label htmlFor="image">Imagen</Label>
            {!imagePreviewUrl && !formData.imageUrl && !imageMarkedForDeletion ? (
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-primary transition-colors mt-2 w-full min-w-0">
                <ImageIcon className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                <div className="mt-4">
                  <label htmlFor="edit-convocatoria-image-input" className="cursor-pointer">
                    <span className="mt-2 block text-base font-semibold text-gray-900 dark:text-gray-100 mb-1 underline">
                      Haz clic para subir imagen
                    </span>
                    <Input
                      id="edit-convocatoria-image-input"
                      name="image-upload"
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleFileUpload(file);
                          setImageMarkedForDeletion(false);
                        }
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
                  {imagePreviewUrl ? (
                    <Image
                      src={imagePreviewUrl}
                      alt={formData.imageAlt || 'Preview'}
                      fill
                      className="object-cover"
                    />
                  ) : formData.imageUrl && !imageMarkedForDeletion ? (
                    <Image
                      src={formData.imageUrl}
                      alt={formData.imageAlt || 'Imagen actual'}
                      fill
                      className="object-cover"
                    />
                  ) : null}
                  {imageMarkedForDeletion && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <p className="text-white font-semibold">Se eliminará al guardar</p>
                    </div>
                  )}
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => {
                      if (imagePreviewUrl || selectedImageFile) {
                        setSelectedImageFile(null);
                        setImagePreviewUrl('');
                        toast({
                          title: 'Imagen eliminada',
                          description: 'La imagen fue removida del formulario'
                        });
                      } else {
                        setImageMarkedForDeletion(true);
                        toast({
                          title: 'Imagen marcada para eliminar',
                          description: 'Se eliminará del bucket al guardar los cambios',
                        });
                      }
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                {imageMarkedForDeletion && (
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setImageMarkedForDeletion(false);
                    }}
                  >
                    Cancelar eliminación
                  </Button>
                )}
                <label htmlFor="edit-convocatoria-image-input-replace" className="cursor-pointer">
                  <Button type="button" variant="outline" className="w-full" disabled={uploading || loading}>
                    <Upload className="mr-2 h-4 w-4" />
                    Cambiar imagen
                  </Button>
                  <Input
                    id="edit-convocatoria-image-input-replace"
                    name="image-upload"
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleFileUpload(file);
                        setImageMarkedForDeletion(false);
                      }
                    }}
                    disabled={uploading || loading}
                  />
                </label>
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="imageAlt">Texto alternativo</Label>
            <Input id="imageAlt" name="imageAlt" value={formData.imageAlt} onChange={handleInputChange} />
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
                name="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
              />
              <span className="text-sm">Activa</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={(e) => setFormData(prev => ({ ...prev, isFeatured: e.target.checked }))}
              />
              <span className="text-sm">Destacada</span>
            </label>
          </div>

          <Button type="submit" disabled={loading || uploading || uploadingDocuments}>
            {loading || uploading || uploadingDocuments ? (uploadingDocuments ? 'Subiendo documentos...' : 'Actualizando...') : 'Actualizar Convocatoria'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

