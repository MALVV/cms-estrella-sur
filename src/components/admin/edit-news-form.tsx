'use client'

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { useSession } from 'next-auth/react';
import { Edit, Upload, ImageIcon } from 'lucide-react';
import Image from 'next/image';

interface NewsItem {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  imageUrl?: string;
  imageAlt?: string;
  category: 'NOTICIAS' | 'FUNDRAISING' | 'COMPAÑIA' | 'SIN_CATEGORIA';
  isActive: boolean;
  isFeatured: boolean;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
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
}

interface EditNewsFormProps {
  news: NewsItem;
  onNewsUpdated: (updatedNews: NewsItem) => void;
  children: React.ReactNode;
}

export const EditNewsForm: React.FC<EditNewsFormProps> = ({ news, onNewsUpdated, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageMarkedForDeletion, setImageMarkedForDeletion] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>('');
  const [programas, setProgramas] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [methodologies, setMethodologies] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
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

  useEffect(() => {
    if (news) {
      setFormData({
        title: news.title,
        content: news.content,
        excerpt: news.excerpt || '',
        imageUrl: news.imageUrl || '',
        imageAlt: news.imageAlt || '',
        isActive: news.isActive,
        isFeatured: news.isFeatured,
        programId: news.program?.id || 'none',
        projectId: news.project?.id || 'none',
        methodologyId: news.methodology?.id || 'none',
      });
      setImageMarkedForDeletion(false);
      setSelectedImageFile(null);
      setImagePreviewUrl('');
    }
  }, [news]);

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
          setProgramas(programasData.programas || []);
        }

        // Cargar proyectos
        const projectsResponse = await fetch('/api/admin/projects?limit=100', {
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        });
        if (projectsResponse.ok) {
          const projectsData = await projectsResponse.json();
          setProjects(projectsData.projects || []);
        }

        // Cargar iniciativas
        const methodologiesResponse = await fetch('/api/admin/methodologies?limit=100', {
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        });
        if (methodologiesResponse.ok) {
          const methodologiesData = await methodologiesResponse.json();
          setMethodologies(methodologiesData.methodologies || []);
        }
      } catch (error) {
        console.error('Error cargando datos:', error);
      }
    };

    if (isOpen) {
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
      let finalImageUrl: string | null = formData.imageUrl || null;
      let finalImageAlt: string | null = formData.imageAlt || null;
      
      if (selectedImageFile) {
        console.log('[EditNewsForm] handleSubmit - Iniciando subida de imagen al bucket (usuario presionó "Actualizar")');
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
          const originalImageUrl = news.imageUrl;
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
      } else if (imageMarkedForDeletion) {
        // Si se marcó para eliminar, eliminar del bucket antes de actualizar
        const originalImageUrl = news.imageUrl;
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
      
      const response = await fetch(`/api/news/${news.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.customToken}`,
        },
        body: JSON.stringify({
          ...formData,
          imageUrl: finalImageUrl || null,
          imageAlt: finalImageAlt || null,
          programId: formData.programId === 'none' ? null : formData.programId,
          projectId: formData.projectId === 'none' ? null : formData.projectId,
          methodologyId: formData.methodologyId === 'none' ? null : formData.methodologyId,
        }),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar noticia');
      }

      const updatedNews = await response.json();

      toast({
        title: 'Éxito',
        description: 'Noticia actualizada exitosamente',
      });

      setIsOpen(false);
      setImageMarkedForDeletion(false);
      setSelectedImageFile(null);
      setImagePreviewUrl('');
      onNewsUpdated(updatedNews);
    } catch (error) {
      console.error('Error al actualizar noticia:', error);
      toast({
        title: 'Error',
        description: 'Error al actualizar la noticia',
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
    console.log('[EditNewsForm] handleFileUpload llamado - Solo creando preview local, NO subiendo al bucket');
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
        console.log('[EditNewsForm] Preview local creado - Archivo guardado para subir después');
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

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      setIsOpen(open);
      if (!open) {
        // Si se cierra sin guardar, resetear el estado
        setImageMarkedForDeletion(false);
        setSelectedImageFile(null);
        setImagePreviewUrl('');
        setFormData({
          title: news.title,
          content: news.content,
          excerpt: news.excerpt || '',
          imageUrl: news.imageUrl || '',
          imageAlt: news.imageAlt || '',
          isActive: news.isActive,
          isFeatured: news.isFeatured,
          programId: news.program?.id || 'none',
          projectId: news.project?.id || 'none',
          methodologyId: news.methodology?.id || 'none',
        });
      }
    }}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Noticia</DialogTitle>
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

          <div>
            <label className="text-sm font-medium">Resumen</label>
            <Textarea
              value={formData.excerpt}
              onChange={(e) => handleChange('excerpt', e.target.value)}
              placeholder="Resumen breve de la noticia"
              rows={3}
            />
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Imagen</label>
              {!imagePreviewUrl && !formData.imageUrl ? (
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-primary transition-colors mt-2">
                  <ImageIcon className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                  <div className="mt-4">
                    <label htmlFor="file-upload-edit-news" className="cursor-pointer">
                      <span className="mt-2 block text-base font-semibold text-gray-900 dark:text-gray-100 mb-1 underline">
                        {uploading ? 'Subiendo imagen...' : 'Haz clic para subir imagen'}
                      </span>
                      <input
                        id="file-upload-edit-news"
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
                        console.log('[EditNewsForm] Botón Eliminar presionado - Solo marcando para eliminar');
                        setSelectedImageFile(null);
                        setImagePreviewUrl('');
                        setFormData(prev => ({ ...prev, imageUrl: '', imageAlt: '' }));
                        setImageMarkedForDeletion(true);
                        toast({ 
                          title: 'Imagen marcada para eliminar', 
                          description: 'Se eliminará del bucket al guardar los cambios' 
                        });
                      }}
                    >
                      Eliminar
                    </Button>
                  </div>
                  <label htmlFor="file-upload-edit-news-replace" className="cursor-pointer">
                    <Button type="button" variant="outline" className="w-full" disabled={uploading || loading}>
                      <Upload className="mr-2 h-4 w-4" />
                      {uploading ? 'Subiendo...' : 'Cambiar imagen'}
                    </Button>
                    <input
                      id="file-upload-edit-news-replace"
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
            <Button type="button" variant="outline" onClick={() => {
              setIsOpen(false);
              setImageMarkedForDeletion(false);
              setSelectedImageFile(null);
              setImagePreviewUrl('');
              // Resetear a valores originales
              setFormData({
                title: news.title,
                content: news.content,
                excerpt: news.excerpt || '',
                imageUrl: news.imageUrl || '',
                imageAlt: news.imageAlt || '',
                isActive: news.isActive,
                isFeatured: news.isFeatured,
                programId: news.program?.id || 'none',
                projectId: news.project?.id || 'none',
                methodologyId: news.methodology?.id || 'none',
              });
            }}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading || uploading}>
              {loading || uploading ? 'Procesando...' : 'Actualizar Noticia'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
