'use client'

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { useSession } from 'next-auth/react';
import { Plus, Upload, ImageIcon } from 'lucide-react';
import Image from 'next/image';

interface CreateNewsFormProps {
  onNewsCreated: () => void;
}

interface Programa {
  id: string;
  sectorName: string;
}

interface Project {
  id: string;
  title: string;
}

interface Methodology {
  id: string;
  title: string;
}

export const CreateNewsForm: React.FC<CreateNewsFormProps> = ({ onNewsCreated }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>('');
  const [programas, setProgramas] = useState<Programa[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [methodologies, setMethodologies] = useState<Methodology[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    imageUrl: '',
    imageAlt: '',
    isActive: true,
    isFeatured: false,
    programId: 'none',
    projectId: 'none',
    methodologyId: 'none',
  });
  const { toast } = useToast();
  const { data: session } = useSession();

  // Cargar datos para los selects
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Cargar programas
        const programasResponse = await fetch('/api/admin/programas?limit=100', {
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        });
        if (programasResponse.ok) {
          const programasData = await programasResponse.json();
          const programasArray = programasData.programas || [];
          // Eliminar duplicados por ID
          const uniqueProgramas = Array.from(new Map(programasArray.map((p: any) => [p.id, p])).values()) as Programa[];
          setProgramas(uniqueProgramas);
        }

        // Cargar proyectos
        const projectsResponse = await fetch('/api/admin/projects?limit=100', {
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        });
        if (projectsResponse.ok) {
          const projectsData = await projectsResponse.json();
          const projectsArray = projectsData.projects || [];
          // Eliminar duplicados por ID
          const uniqueProjects = Array.from(new Map(projectsArray.map((p: any) => [p.id, p])).values()) as Project[];
          setProjects(uniqueProjects);
        }

        // Cargar iniciativas
        const methodologiesResponse = await fetch('/api/admin/methodologies?limit=100', {
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        });
        if (methodologiesResponse.ok) {
          const methodologiesData = await methodologiesResponse.json();
          const methodologiesArray = methodologiesData.methodologies || [];
          // Eliminar duplicados por ID
          const uniqueMethodologies = Array.from(new Map(methodologiesArray.map((m: any) => [m.id, m])).values()) as Methodology[];
          setMethodologies(uniqueMethodologies);
        }
      } catch (error) {
        console.error('Error cargando datos:', error);
      }
    };

    if (isOpen) {
      // Limpiar estados antes de cargar nuevos datos
      setProgramas([]);
      setProjects([]);
      setMethodologies([]);
      fetchData();
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim()) {
      toast({
        title: 'Error',
        description: 'El título y contenido son obligatorios',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);
      
      // Si hay una imagen seleccionada, subirla al bucket primero
      let finalImageUrl = formData.imageUrl;
      let finalImageAlt = formData.imageAlt;
      
      if (selectedImageFile) {
        console.log('[CreateNewsForm] handleSubmit - Iniciando subida de imagen al bucket (usuario presionó "Crear")');
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

          const formDataToUpload = new FormData();
          formDataToUpload.append('file', selectedImageFile);

          const uploadResponse = await fetch('/api/news/upload', {
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
          setLoading(false);
          return;
        } finally {
          setUploading(false);
        }
      }
      
      const response = await fetch('/api/news', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.customToken}`,
        },
        body: JSON.stringify({
          ...formData,
          imageUrl: finalImageUrl || null,
          imageAlt: finalImageAlt || null,
          publishedAt: new Date().toISOString(),
          programId: formData.programId === 'none' ? null : formData.programId,
          projectId: formData.projectId === 'none' ? null : formData.projectId,
          methodologyId: formData.methodologyId === 'none' ? null : formData.methodologyId,
        }),
      });

      if (!response.ok) {
        throw new Error('Error al crear noticia');
      }

      toast({
        title: 'Éxito',
        description: 'Noticia creada exitosamente',
      });

      // Reset form
      setFormData({
        title: '',
        content: '',
        imageUrl: '',
        imageAlt: '',
        isActive: true,
        isFeatured: false,
        programId: 'none',
        projectId: 'none',
        methodologyId: 'none',
      });
      setSelectedImageFile(null);
      setImagePreviewUrl('');

      setIsOpen(false);
      onNewsCreated();
    } catch (error) {
      console.error('Error al crear noticia:', error);
      toast({
        title: 'Error',
        description: 'Error al crear la noticia',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileUpload = async (file: File) => {
    console.log('[CreateNewsForm] handleFileUpload llamado - Solo creando preview local, NO subiendo al bucket');
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
        console.log('[CreateNewsForm] Preview local creado - Archivo guardado para subir después');
      };
      reader.readAsDataURL(file);

      toast({
        title: 'Imagen seleccionada',
        description: 'La imagen se subirá al bucket al crear la noticia',
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

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      setIsOpen(open);
      if (!open) {
        // Si se cierra sin guardar, resetear el estado
        setSelectedImageFile(null);
        setImagePreviewUrl('');
        setFormData({
          title: '',
          content: '',
          imageUrl: '',
          imageAlt: '',
          isActive: true,
          isFeatured: false,
          programId: 'none',
          projectId: 'none',
          methodologyId: 'none',
        });
      }
    }}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nueva Noticia
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Crear Nueva Noticia</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Título *</label>
            <Input
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Título de la noticia"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">Contenido *</label>
            <Textarea
              value={formData.content}
              onChange={(e) => handleChange('content', e.target.value)}
              placeholder="Contenido completo de la noticia"
              rows={6}
              required
            />
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Imagen</label>
              {!imagePreviewUrl && !formData.imageUrl ? (
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-primary transition-colors mt-2">
                  <ImageIcon className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                  <div className="mt-4">
                    <label htmlFor="file-upload-news" className="cursor-pointer">
                      <span className="mt-2 block text-base font-semibold text-gray-900 dark:text-gray-100 mb-1 underline">
                        {uploading ? 'Subiendo imagen...' : 'Haz clic para subir imagen'}
                      </span>
                      <input
                        id="file-upload-news"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload(file);
                        }}
                        disabled={uploading || loading}
                      />
                    </label>
                    <p className="mt-2 text-sm text-gray-500">
                      PNG, JPG, WEBP o GIF hasta {String(Number(process.env.NEXT_PUBLIC_MAX_UPLOAD_MB || process.env.MAX_UPLOAD_MB || 20))}MB
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 mt-2">
                  <div className="relative w-full h-64 border rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                    <Image
                      src={imagePreviewUrl || formData.imageUrl}
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
                        // Solo limpiar el estado local, no eliminar del bucket (aún no se ha subido)
                        setSelectedImageFile(null);
                        setImagePreviewUrl('');
                        handleChange('imageUrl', '');
                        handleChange('imageAlt', '');
                        toast({ 
                          title: 'Imagen eliminada', 
                          description: 'La imagen fue removida del formulario' 
                        });
                      }}
                    >
                      Eliminar
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="text-sm font-medium">Texto alternativo (alt)</label>
              <Input
                value={formData.imageAlt}
                onChange={(e) => handleChange('imageAlt', e.target.value)}
                placeholder="Descripción de la imagen para accesibilidad"
              />
            </div>
          </div>


          {/* Relaciones */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Relaciones (Opcional)</h3>
            
            <div>
              <label className="text-sm font-medium">Programa</label>
              <Select value={formData.programId} onValueChange={(value) => handleChange('programId', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar programa" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Sin programa</SelectItem>
                  {programas.map((programa) => (
                    <SelectItem key={programa.id} value={programa.id}>
                      {programa.sectorName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Proyecto</label>
              <Select value={formData.projectId} onValueChange={(value) => handleChange('projectId', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar proyecto" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Sin proyecto</SelectItem>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Iniciativa</label>
              <Select value={formData.methodologyId} onValueChange={(value) => handleChange('methodologyId', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar iniciativa" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Sin iniciativa</SelectItem>
                  {methodologies.map((methodology) => (
                    <SelectItem key={methodology.id} value={methodology.id}>
                      {methodology.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => handleChange('isActive', e.target.checked)}
                className="rounded"
              />
              <span className="text-sm font-medium">Activa</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.isFeatured}
                onChange={(e) => handleChange('isFeatured', e.target.checked)}
                className="rounded"
              />
              <span className="text-sm font-medium">Destacada</span>
            </label>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading || uploading}>
              {loading || uploading ? 'Procesando...' : 'Crear Noticia'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
