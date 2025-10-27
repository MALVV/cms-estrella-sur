'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface Programa {
  id: string;
  sectorName: string;
  description: string;
  imageUrl?: string;
  imageAlt?: string;
  presentationVideo?: string;
  odsAlignment?: string;
  resultsAreas?: string;
  resultados?: string;
  targetGroups?: string;
  contentTopics?: string;
  moreInfoLink?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  creator: {
    id: string;
    name: string;
    email: string;
  };
  _count?: {
    news: number;
    imageLibrary: number;
  };
}

interface EditProgramaDialogProps {
  programa: Programa;
  onSuccess?: () => void;
  children: React.ReactNode;
}

export const EditProgramaDialog: React.FC<EditProgramaDialogProps> = ({ programa, onSuccess, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Inicializar el estado con los valores del programa desde el inicio
  const [formData, setFormData] = useState({
    sectorName: programa?.sectorName || '',
    description: programa?.description || '',
    imageUrl: programa?.imageUrl || '',
    imageAlt: programa?.imageAlt || '',
    presentationVideo: programa?.presentationVideo || '',
    odsAlignment: programa?.odsAlignment || '',
    resultsAreas: programa?.resultsAreas || '',
    resultados: programa?.resultados || '',
    targetGroups: programa?.targetGroups || '',
    contentTopics: programa?.contentTopics || '',
    moreInfoLink: programa?.moreInfoLink || '',
  });

  useEffect(() => {
    if (programa) {
      setFormData({
        sectorName: programa.sectorName || '',
        description: programa.description || '',
        imageUrl: programa.imageUrl || '',
        imageAlt: programa.imageAlt || '',
        presentationVideo: programa.presentationVideo || '',
        odsAlignment: programa.odsAlignment || '',
        resultsAreas: programa.resultsAreas || '',
        resultados: programa.resultados || '',
        targetGroups: programa.targetGroups || '',
        contentTopics: programa.contentTopics || '',
        moreInfoLink: programa.moreInfoLink || '',
      });
    }
  }, [programa]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`/api/admin/programas/${programa.id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al actualizar programa');
      }

      toast.success('Programa actualizado exitosamente');
      setIsOpen(false);
      onSuccess?.();
    } catch (error) {
      console.error('Error updating programa:', error);
      toast.error(error instanceof Error ? error.message : 'Error al actualizar programa');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Programa</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información Básica */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Información Básica</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="sectorName">Nombre del Sector *</Label>
                <Input
                  id="sectorName"
                  value={formData.sectorName}
                  onChange={(e) => setFormData({ ...formData, sectorName: e.target.value })}
                  required
                  placeholder="Ej: Educación Primaria"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Descripción *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                placeholder="Descripción detallada del programa..."
                rows={4}
              />
            </div>
          </div>

          {/* Multimedia */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Multimedia</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="imageUrl">URL de Imagen</Label>
                <Input
                  id="imageUrl"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://ejemplo.com/imagen.jpg"
                />
              </div>
              
              <div>
                <Label htmlFor="imageAlt">Texto Alternativo de Imagen</Label>
                <Input
                  id="imageAlt"
                  value={formData.imageAlt}
                  onChange={(e) => setFormData({ ...formData, imageAlt: e.target.value })}
                  placeholder="Descripción de la imagen"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="presentationVideo">URL del Video de Presentación</Label>
              <Input
                id="presentationVideo"
                value={formData.presentationVideo}
                onChange={(e) => setFormData({ ...formData, presentationVideo: e.target.value })}
                placeholder="https://youtube.com/watch?v=..."
              />
            </div>
          </div>

          {/* Detalles del Programa */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Detalles del Programa</h3>
            
            <div>
              <Label htmlFor="odsAlignment">Alineación a ODS</Label>
              <Textarea
                id="odsAlignment"
                value={formData.odsAlignment}
                onChange={(e) => setFormData({ ...formData, odsAlignment: e.target.value })}
                placeholder="Cómo se alinea con los Objetivos de Desarrollo Sostenible..."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="resultsAreas">Subáreas de Resultados</Label>
              <Textarea
                id="resultsAreas"
                value={formData.resultsAreas}
                onChange={(e) => setFormData({ ...formData, resultsAreas: e.target.value })}
                placeholder="Subáreas específicas de resultados..."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="resultados">Resultados</Label>
              <Textarea
                id="resultados"
                value={formData.resultados}
                onChange={(e) => setFormData({ ...formData, resultados: e.target.value })}
                placeholder="Resultados esperados del programa..."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="targetGroups">Grupos de Atención</Label>
              <Textarea
                id="targetGroups"
                value={formData.targetGroups}
                onChange={(e) => setFormData({ ...formData, targetGroups: e.target.value })}
                placeholder="Grupos objetivo del programa..."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="contentTopics">Contenidos/Temas</Label>
              <Textarea
                id="contentTopics"
                value={formData.contentTopics}
                onChange={(e) => setFormData({ ...formData, contentTopics: e.target.value })}
                placeholder="Contenidos y temas del programa..."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="moreInfoLink">Enlace para Más Información</Label>
              <Input
                id="moreInfoLink"
                value={formData.moreInfoLink}
                onChange={(e) => setFormData({ ...formData, moreInfoLink: e.target.value })}
                placeholder="https://ejemplo.com/mas-informacion"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)} disabled={isLoading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Guardando...
                </>
              ) : (
                'Guardar Cambios'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

