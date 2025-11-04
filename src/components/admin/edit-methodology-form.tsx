'use client'

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Loader2, Save, X, Upload, ImageIcon } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import Image from 'next/image';

interface Methodology {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  imageUrl?: string;
  imageAlt?: string;
  ageGroup: string;
  sectors: ('SALUD' | 'EDUCACION' | 'MEDIOS_DE_VIDA' | 'PROTECCION' | 'SOSTENIBILIDAD' | 'DESARROLLO_INFANTIL_TEMPRANO' | 'NINEZ_EN_CRISIS')[];
  targetAudience: string;
  objectives: string;
  implementation: string;
  results: string;
  methodology?: string;
  resources?: string;
  evaluation?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface EditMethodologyFormProps {
  methodology: Methodology;
  onSuccess?: () => void;
  onCancel?: () => void;
}

interface MethodologyFormData {
  title: string;
  description: string;
  shortDescription: string;
  imageUrl: string;
  imageAlt: string;
  ageGroup: string;
  sectors: ('SALUD' | 'EDUCACION' | 'MEDIOS_DE_VIDA' | 'PROTECCION' | 'SOSTENIBILIDAD' | 'DESARROLLO_INFANTIL_TEMPRANO' | 'NINEZ_EN_CRISIS')[];
  targetAudience: string;
  objectives: string;
  implementation: string;
  results: string;
  methodology: string;
  resources: string;
  evaluation: string;
}

export function EditMethodologyForm({ methodology, onSuccess, onCancel }: EditMethodologyFormProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<MethodologyFormData>({
    title: methodology.title,
    description: methodology.description,
    shortDescription: methodology.shortDescription,
    imageUrl: methodology.imageUrl || '',
    imageAlt: methodology.imageAlt || '',
    ageGroup: methodology.ageGroup,
    sectors: methodology.sectors || [],
    targetAudience: methodology.targetAudience,
    objectives: methodology.objectives,
    implementation: methodology.implementation,
    results: methodology.results,
    methodology: methodology.methodology || '',
    resources: methodology.resources || '',
    evaluation: methodology.evaluation || '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageMarkedForDeletion, setImageMarkedForDeletion] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>('');

  const handleInputChange = (field: keyof MethodologyFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSectorChange = (sector: 'SALUD' | 'EDUCACION' | 'MEDIOS_DE_VIDA' | 'PROTECCION' | 'SOSTENIBILIDAD' | 'DESARROLLO_INFANTIL_TEMPRANO' | 'NINEZ_EN_CRISIS', checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      sectors: checked 
        ? [...prev.sectors, sector]
        : prev.sectors.filter(s => s !== sector)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast({
        title: 'Error',
        description: 'El título es requerido',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.description.trim()) {
      toast({
        title: 'Error',
        description: 'La descripción es requerida',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.shortDescription.trim()) {
      toast({
        title: 'Error',
        description: 'La descripción corta es requerida',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.ageGroup.trim()) {
      toast({
        title: 'Error',
        description: 'El grupo de edad es requerido',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.targetAudience.trim()) {
      toast({
        title: 'Error',
        description: 'El público objetivo es requerido',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.objectives.trim()) {
      toast({
        title: 'Error',
        description: 'Los objetivos son requeridos',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.implementation.trim()) {
      toast({
        title: 'Error',
        description: 'La implementación es requerida',
        variant: 'destructive',
      });
      return;
    }

    if (formData.sectors.length === 0) {
      toast({
        title: 'Error',
        description: 'Debe seleccionar al menos un sector programático',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      // Si hay una imagen seleccionada, subirla al bucket primero
      let finalImageUrl: string | null = formData.imageUrl || null;
      let finalImageAlt: string | null = formData.imageAlt || null;
      
      if (selectedImageFile) {
        setUploading(true);
        try {
          const maxMb = Number(process.env.NEXT_PUBLIC_MAX_UPLOAD_MB || process.env.MAX_UPLOAD_MB || 20);
          const maxBytes = maxMb * 1024 * 1024;
          const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

          if (!allowed.includes(selectedImageFile.type)) {
            throw new Error('Formato no permitido. Usa JPG, PNG, WEBP o GIF');
          }
          if (selectedImageFile.size > maxBytes) {
            throw new Error(`El archivo es demasiado grande. Máximo ${maxMb}MB`);
          }

          // Eliminar la imagen anterior del bucket si existe
          const originalImageUrl = methodology.imageUrl;
          if (originalImageUrl && originalImageUrl !== '/placeholder-news.jpg') {
            try {
              const controller = new AbortController();
              const timer = setTimeout(() => controller.abort(), 15000);
              await fetch('/api/spaces/delete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: originalImageUrl }),
                signal: controller.signal,
              });
              clearTimeout(timer);
            } catch (err) {
              console.warn('No se pudo eliminar imagen anterior del bucket:', err);
            }
          }

          // Subir la nueva imagen
          const formDataToUpload = new FormData();
          formDataToUpload.append('file', selectedImageFile);

          const uploadResponse = await fetch('/api/public/methodologies/upload', {
            method: 'POST',
            credentials: 'include',
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
          console.error('Error uploading file:', error);
          toast({
            title: 'Error',
            description: error instanceof Error ? error.message : 'Error al subir la imagen',
            variant: 'destructive',
          });
          setUploading(false);
          setIsLoading(false);
          return;
        } finally {
          setUploading(false);
        }
      } else if (imageMarkedForDeletion) {
        // Si se marcó para eliminar, eliminar del bucket antes de actualizar
        const originalImageUrl = methodology.imageUrl;
        if (originalImageUrl && originalImageUrl !== '/placeholder-news.jpg') {
          try {
            const controller = new AbortController();
            const timer = setTimeout(() => controller.abort(), 15000);
            await fetch('/api/spaces/delete', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ url: originalImageUrl }),
              signal: controller.signal,
            });
            clearTimeout(timer);
          } catch (err) {
            console.warn('No se pudo eliminar imagen anterior del bucket:', err);
          }
        }
        finalImageUrl = null;
        finalImageAlt = null;
      }

      const sectorMap: Record<string, string> = {
        'SALUD': 'HEALTH',
        'EDUCACION': 'EDUCATION',
        'MEDIOS_DE_VIDA': 'LIVELIHOODS',
        'PROTECCION': 'PROTECTION',
        'SOSTENIBILIDAD': 'SUSTAINABILITY',
        'DESARROLLO_INFANTIL_TEMPRANO': 'EARLY_CHILD_DEVELOPMENT',
        'NINEZ_EN_CRISIS': 'CHILDREN_IN_CRISIS',
      };
      const payload = {
        ...formData,
        imageUrl: finalImageUrl || null,
        imageAlt: finalImageAlt || null,
        sectors: formData.sectors.map(s => sectorMap[s] || s),
      };

      const response = await fetch(`/api/public/methodologies/${methodology.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al actualizar iniciativa');
      }

      toast({
        title: 'Éxito',
        description: 'Iniciativa actualizada exitosamente',
      });
      setImageMarkedForDeletion(false);
      setSelectedImageFile(null);
      setImagePreviewUrl('');
      onSuccess?.();
    } catch (error) {
      console.error('Error updating methodology:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Error al actualizar iniciativa',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
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
        setImageMarkedForDeletion(false); // Si se selecciona una nueva imagen, ya no está marcada para eliminar
      };
      reader.readAsDataURL(file);

      toast({
        title: 'Imagen seleccionada',
        description: 'La imagen se subirá al bucket al guardar los cambios',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Error al procesar la imagen',
        variant: 'destructive',
      });
    }
  };

  const getSectorColor = (sector: string) => {
    switch (sector) {
      case 'SALUD':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'EDUCACION':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'MEDIOS_DE_VIDA':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'PROTECCION':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'SOSTENIBILIDAD':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200';
      case 'DESARROLLO_INFANTIL_TEMPRANO':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'NINEZ_EN_CRISIS':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Save className="h-5 w-5" />
          Editar Iniciativa
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Editando: {methodology.title}
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información Básica */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Información Básica</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Título de la iniciativa"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sectors">Sector Programático *</Label>
                <div className="grid grid-cols-2 gap-3 p-4 border rounded-lg">
                  {[
                    { value: 'SALUD', label: 'Salud' },
                    { value: 'EDUCACION', label: 'Educación' },
                    { value: 'MEDIOS_DE_VIDA', label: 'Medios de Vida' },
                    { value: 'PROTECCION', label: 'Protección' },
                    { value: 'SOSTENIBILIDAD', label: 'Sostenibilidad' },
                    { value: 'DESARROLLO_INFANTIL_TEMPRANO', label: 'Desarrollo Infantil Temprano' },
                    { value: 'NINEZ_EN_CRISIS', label: 'Niñez en Crisis' }
                  ].map((sector) => (
                    <div key={sector.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={sector.value}
                        checked={formData.sectors.includes(sector.value as any)}
                        onCheckedChange={(checked) => handleSectorChange(sector.value as any, checked as boolean)}
                      />
                      <Label htmlFor={sector.value} className="text-sm font-normal">
                        {sector.label}
                      </Label>
                    </div>
                  ))}
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {formData.sectors.map((sector) => (
                    <Badge key={sector} className={getSectorColor(sector)}>
                      {sector.replace(/_/g, ' ')}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="shortDescription">Descripción Corta *</Label>
              <Textarea
                id="shortDescription"
                value={formData.shortDescription}
                onChange={(e) => handleInputChange('shortDescription', e.target.value)}
                placeholder="Descripción breve de la iniciativa"
                rows={2}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción Completa *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Descripción detallada de la iniciativa"
                rows={4}
                required
              />
            </div>
          </div>

          {/* Información del Público */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Público Objetivo</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ageGroup">Grupo de Edad *</Label>
                <Input
                  id="ageGroup"
                  value={formData.ageGroup}
                  onChange={(e) => handleInputChange('ageGroup', e.target.value)}
                  placeholder="Ej: 6-12 años, Adultos, Todas las edades"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="targetAudience">Público Objetivo *</Label>
                <Input
                  id="targetAudience"
                  value={formData.targetAudience}
                  onChange={(e) => handleInputChange('targetAudience', e.target.value)}
                  placeholder="Ej: Estudiantes de primaria, Comunidades rurales"
                  required
                />
              </div>
            </div>
          </div>

          {/* Contenido de la Iniciativa */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contenido de la Iniciativa</h3>
            
            <div className="space-y-2">
              <Label htmlFor="objectives">Objetivos *</Label>
              <Textarea
                id="objectives"
                value={formData.objectives}
                onChange={(e) => handleInputChange('objectives', e.target.value)}
                placeholder="Objetivos específicos de la iniciativa"
                rows={3}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="implementation">Implementación *</Label>
              <Textarea
                id="implementation"
                value={formData.implementation}
                onChange={(e) => handleInputChange('implementation', e.target.value)}
                placeholder="Cómo se implementa la iniciativa"
                rows={3}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="results">Resultados Esperados *</Label>
              <Textarea
                id="results"
                value={formData.results}
                onChange={(e) => handleInputChange('results', e.target.value)}
                placeholder="Resultados esperados de la iniciativa"
                rows={3}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="methodology">Iniciativa Detallada</Label>
              <Textarea
                id="methodology"
                value={formData.methodology}
                onChange={(e) => handleInputChange('methodology', e.target.value)}
                placeholder="Descripción detallada de la iniciativa (opcional)"
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="resources">Recursos Necesarios</Label>
              <Textarea
                id="resources"
                value={formData.resources}
                onChange={(e) => handleInputChange('resources', e.target.value)}
                placeholder="Recursos necesarios para implementar la iniciativa (opcional)"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="evaluation">Sistema de Evaluación</Label>
              <Textarea
                id="evaluation"
                value={formData.evaluation}
                onChange={(e) => handleInputChange('evaluation', e.target.value)}
                placeholder="Cómo se evalúa la iniciativa (opcional)"
                rows={3}
              />
            </div>
          </div>

          {/* Imagen */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Imagen</h3>
            {!imagePreviewUrl && !formData.imageUrl ? (
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-primary transition-colors">
                <ImageIcon className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                <div className="mt-4">
                  <label htmlFor="file-upload-methodology-edit" className="cursor-pointer">
                    <span className="mt-2 block text-base font-semibold text-gray-900 dark:text-gray-100 mb-1 underline">
                      {uploading ? 'Subiendo imagen...' : 'Haz clic para subir imagen'}
                    </span>
                    <input
                      id="file-upload-methodology-edit"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(file);
                      }}
                      disabled={uploading || isLoading}
                    />
                  </label>
                  <p className="mt-2 text-sm text-gray-500">
                    PNG, JPG, WEBP o GIF hasta {String(Number(process.env.NEXT_PUBLIC_MAX_UPLOAD_MB || process.env.MAX_UPLOAD_MB || 20))}MB
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative w-full h-64 border rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                  <Image
                    src={imagePreviewUrl || formData.imageUrl || ''}
                    alt={formData.imageAlt || 'Vista previa'}
                    fill
                    className="object-cover"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => {
                      // Solo marcar para eliminar, no eliminar del bucket todavía
                      setSelectedImageFile(null);
                      setImagePreviewUrl('');
                      setFormData(prev => ({ ...prev, imageUrl: '', imageAlt: '' }));
                      setImageMarkedForDeletion(true);
                      toast({
                        title: 'Imagen marcada para eliminar',
                        description: 'Se eliminará del bucket al guardar los cambios',
                      });
                    }}
                  >
                    Eliminar
                  </Button>
                </div>
                <label htmlFor="file-upload-methodology-replace-edit" className="cursor-pointer">
                  <Button type="button" variant="outline" className="w-full" disabled={uploading || isLoading}>
                    <Upload className="mr-2 h-4 w-4" />
                    {uploading ? 'Subiendo...' : 'Cambiar imagen'}
                  </Button>
                  <input
                    id="file-upload-methodology-replace-edit"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file);
                    }}
                    disabled={uploading || isLoading}
                  />
                </label>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="imageAlt">Texto Alternativo</Label>
              <Input id="imageAlt" value={formData.imageAlt} onChange={(e) => handleInputChange('imageAlt', e.target.value)} placeholder="Descripción de la imagen" />
            </div>
          </div>

          {/* Botones */}
          <div className="flex flex-col sm:flex-row gap-4 justify-end pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
            >
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading || uploading}>
              {isLoading || uploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Procesando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Actualizar Iniciativa
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
