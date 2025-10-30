'use client'

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { Edit, Upload, ImageIcon } from 'lucide-react';
import { useSession } from 'next-auth/react';

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
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  creator?: {
    name?: string;
    email: string;
  };
}

interface EditMethodologyDialogProps {
  methodology: Methodology;
  onMethodologyUpdated: (methodology: Methodology) => void;
  children: React.ReactNode;
}

export function EditMethodologyDialog({ methodology, onMethodologyUpdated, children }: EditMethodologyDialogProps) {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  
  // Inicializar el estado con los valores del methodology desde el inicio
  const [formData, setFormData] = useState({
    title: methodology?.title || '',
    description: methodology?.description || '',
    shortDescription: methodology?.shortDescription || '',
    imageUrl: methodology?.imageUrl || '',
    imageAlt: methodology?.imageAlt || '',
    ageGroup: methodology?.ageGroup || '',
    sectors: (methodology?.sectors || []) as ('SALUD' | 'EDUCACION' | 'MEDIOS_DE_VIDA' | 'PROTECCION' | 'SOSTENIBILIDAD' | 'DESARROLLO_INFANTIL_TEMPRANO' | 'NINEZ_EN_CRISIS')[],
    targetAudience: methodology?.targetAudience || '',
    objectives: methodology?.objectives || '',
    implementation: methodology?.implementation || '',
    results: methodology?.results || '',
    methodology: methodology?.methodology || '',
    resources: methodology?.resources || '',
    evaluation: methodology?.evaluation || ''
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageMarkedForDeletion, setImageMarkedForDeletion] = useState(false);

  // Inicializar el formulario con los datos de la iniciativa
  useEffect(() => {
    if (methodology) {
      setFormData({
        title: methodology.title || '',
        description: methodology.description || '',
        shortDescription: methodology.shortDescription || '',
        imageUrl: methodology.imageUrl || '',
        imageAlt: methodology.imageAlt || '',
        ageGroup: methodology.ageGroup || '',
        sectors: methodology.sectors || [],
        targetAudience: methodology.targetAudience || '',
        objectives: methodology.objectives || '',
        implementation: methodology.implementation || '',
        results: methodology.results || '',
        methodology: methodology.methodology || '',
        resources: methodology.resources || '',
        evaluation: methodology.evaluation || ''
      });
    }
  }, [methodology]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = async (file: File) => {
    setUploading(true);
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

      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/public/methodologies/upload', {
        method: 'POST',
        credentials: 'include',
        body: fd,
      });
      if (!res.ok) {
        const e = await res.json().catch(() => ({}));
        throw new Error(e.error || 'Error al subir imagen');
      }
      const data = await res.json();
      setFormData(prev => ({ ...prev, imageUrl: data.url, imageAlt: data.alt || file.name }));
      setImageMarkedForDeletion(false); // Si se sube una nueva imagen, ya no está marcada para eliminar
      toast({ title: 'Éxito', description: 'Imagen subida correctamente' });
    } catch (error) {
      toast({ title: 'Error', description: error instanceof Error ? error.message : 'Error al subir la imagen', variant: 'destructive' });
    } finally {
      setUploading(false);
    }
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
    setLoading(true);

    // Verificar que tenemos el token de sesión
    if (!session?.customToken) {
      toast({
        title: "Error de autenticación",
        description: "No se encontró el token de sesión. Por favor, inicia sesión nuevamente.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/public/methodologies/${methodology.id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.customToken}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al actualizar la iniciativa');
      }

      const updatedMethodology = await response.json();
      
      if (onMethodologyUpdated) {
        onMethodologyUpdated(updatedMethodology);
      }

      toast({
        title: "Iniciativa actualizada exitosamente",
        description: "Los cambios han sido guardados correctamente.",
      });

      setIsOpen(false);
      
    } catch (error) {
      toast({
        title: "Error al actualizar iniciativa",
        description: error instanceof Error ? error.message : "Hubo un problema al actualizar la iniciativa. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Resetear el formulario a los valores originales
    setFormData({
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
      evaluation: methodology.evaluation || ''
    });
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            Editar Iniciativa
          </DialogTitle>
          <DialogDescription>
            Modifica la información de la iniciativa.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Título * <span className="text-xs text-gray-500">({formData.title.length}/100)</span>
              </label>
              <Input
                id="title"
                placeholder="Ingresa el título de la iniciativa"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                maxLength={100}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="shortDescription" className="text-sm font-medium">
                Descripción Corta * <span className="text-xs text-gray-500">({formData.shortDescription.length}/200)</span>
              </label>
              <Input
                id="shortDescription"
                placeholder="Descripción breve de la iniciativa"
                value={formData.shortDescription}
                onChange={(e) => handleInputChange('shortDescription', e.target.value)}
                maxLength={200}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Descripción Completa * <span className="text-xs text-gray-500">({formData.description.length}/500)</span>
              </label>
              <textarea
                id="description"
                placeholder="Describe la iniciativa en detalle..."
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                maxLength={500}
                className="w-full min-h-[100px] px-3 py-2 border border-input bg-background rounded-md text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="ageGroup" className="text-sm font-medium">
                  Grupo de Edad *
                </label>
                <Input
                  id="ageGroup"
                  placeholder="Ej: 12-18 años"
                  value={formData.ageGroup}
                  onChange={(e) => handleInputChange('ageGroup', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="sectors" className="text-sm font-medium">
                  Sector Programático *
                </label>
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
                      <label htmlFor={sector.value} className="text-sm font-normal">
                        {sector.label}
                      </label>
                    </div>
                  ))}
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {formData.sectors.map((sector) => (
                    <span key={sector} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {sector.replace(/_/g, ' ')}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="targetAudience" className="text-sm font-medium">
                Audiencia Objetivo *
              </label>
              <Input
                id="targetAudience"
                placeholder="Ej: Estudiantes de secundaria"
                value={formData.targetAudience}
                onChange={(e) => handleInputChange('targetAudience', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="objectives" className="text-sm font-medium">
                Objetivos *
              </label>
              <textarea
                id="objectives"
                placeholder="Describe los objetivos de la iniciativa..."
                value={formData.objectives}
                onChange={(e) => handleInputChange('objectives', e.target.value)}
                className="w-full min-h-[80px] px-3 py-2 border border-input bg-background rounded-md text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="implementation" className="text-sm font-medium">
                Implementación *
              </label>
              <textarea
                id="implementation"
                placeholder="Describe cómo implementar la iniciativa..."
                value={formData.implementation}
                onChange={(e) => handleInputChange('implementation', e.target.value)}
                className="w-full min-h-[80px] px-3 py-2 border border-input bg-background rounded-md text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="results" className="text-sm font-medium">
                Resultados *
              </label>
              <textarea
                id="results"
                placeholder="Describe los resultados esperados..."
                value={formData.results}
                onChange={(e) => handleInputChange('results', e.target.value)}
                className="w-full min-h-[80px] px-3 py-2 border border-input bg-background rounded-md text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
              />
            </div>

            <div className="space-y-4">
              <label className="text-sm font-medium">Imagen</label>
              {!formData.imageUrl ? (
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-primary transition-colors">
                  <ImageIcon className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                  <div className="mt-4">
                    <label htmlFor="file-upload-methodology" className="cursor-pointer">
                      <span className="mt-2 block text-base font-semibold text-gray-900 dark:text-gray-100 mb-1 underline">
                        {uploading ? 'Subiendo imagen...' : 'Haz clic para subir imagen'}
                      </span>
                      <input
                        id="file-upload-methodology"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) handleFileUpload(f);
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
                <div className="space-y-4">
                  <div className="relative w-full h-64 border rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                    <img src={formData.imageUrl} alt={formData.imageAlt || 'Vista previa'} className="w-full h-full object-cover" />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={async () => {
                        try {
                          if (formData.imageUrl) {
                            const controller = new AbortController();
                            const timer = setTimeout(() => controller.abort(), 15000);
                            const res = await fetch('/api/spaces/delete', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ url: formData.imageUrl }),
                              signal: controller.signal,
                            });
                            clearTimeout(timer);
                            if (!res.ok) {
                              const e = await res.json().catch(() => ({}));
                              throw new Error(e.error || 'No se pudo eliminar del bucket');
                            }
                          }
                          setFormData(prev => ({ ...prev, imageUrl: '', imageAlt: '' }));
                          try {
                            const saveRes = await fetch(`/api/public/methodologies/${methodology.id}`, {
                              method: 'PUT',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ ...formData, imageUrl: null, imageAlt: null }),
                            });
                            if (!saveRes.ok) {
                              console.warn('No se pudo persistir imageUrl=null para iniciativa');
                            }
                          } catch {}
                          toast({ title: 'Imagen eliminada', description: 'Se eliminó del bucket y se actualizó la iniciativa' });
                        } catch (err) {
                          toast({ title: 'Error', description: err instanceof Error ? err.message : 'No se pudo eliminar la imagen', variant: 'destructive' });
                        }
                      }}
                    >
                      Eliminar
                    </Button>
                  </div>
                  <label htmlFor="file-upload-methodology-replace" className="cursor-pointer">
                    <Button type="button" variant="outline" className="w-full" disabled={uploading}>
                      <Upload className="mr-2 h-4 w-4" />
                      {uploading ? 'Subiendo...' : 'Cambiar imagen'}
                    </Button>
                    <input
                      id="file-upload-methodology-replace"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      accept="image/*"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) handleFileUpload(f);
                      }}
                      disabled={uploading}
                    />
                  </label>
                </div>
              )}
              <div>
                <label htmlFor="imageAlt" className="text-sm font-medium">Texto Alternativo (alt)</label>
                <Input id="imageAlt" placeholder="Descripción de la imagen" value={formData.imageAlt} onChange={(e) => handleInputChange('imageAlt', e.target.value)} />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
