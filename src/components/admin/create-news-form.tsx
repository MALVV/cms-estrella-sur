'use client'

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { useSession } from 'next-auth/react';
import { Plus } from 'lucide-react';

interface CreateNewsFormProps {
  onNewsCreated: () => void;
}

interface Programa {
  id: string;
  nombreSector: string;
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
  const [programas, setProgramas] = useState<Programa[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [methodologies, setMethodologies] = useState<Methodology[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    imageUrl: '',
    imageAlt: '',
    isActive: true,
    isFeatured: false,
    programaId: 'none',
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
      
      const response = await fetch('/api/news', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.customToken}`,
        },
        body: JSON.stringify({
          ...formData,
          publishedAt: new Date().toISOString(),
          programaId: formData.programaId === 'none' ? null : formData.programaId,
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
        excerpt: '',
        imageUrl: '',
        imageAlt: '',
        isActive: true,
        isFeatured: false,
        programaId: 'none',
        projectId: 'none',
        methodologyId: 'none',
      });

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

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
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

          <div>
            <label className="text-sm font-medium">Resumen</label>
            <Textarea
              value={formData.excerpt}
              onChange={(e) => handleChange('excerpt', e.target.value)}
              placeholder="Resumen breve de la noticia"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">URL de Imagen</label>
              <Input
                value={formData.imageUrl}
                onChange={(e) => handleChange('imageUrl', e.target.value)}
                placeholder="https://ejemplo.com/imagen.jpg"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Texto Alternativo</label>
              <Input
                value={formData.imageAlt}
                onChange={(e) => handleChange('imageAlt', e.target.value)}
                placeholder="Descripción de la imagen"
              />
            </div>
          </div>


          {/* Relaciones */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Relaciones (Opcional)</h3>
            
            <div>
              <label className="text-sm font-medium">Programa</label>
              <Select value={formData.programaId} onValueChange={(value) => handleChange('programaId', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar programa" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Sin programa</SelectItem>
                  {programas.map((programa) => (
                    <SelectItem key={programa.id} value={programa.id}>
                      {programa.nombreSector}
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
            <Button type="submit" disabled={loading}>
              {loading ? 'Creando...' : 'Crear Noticia'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
