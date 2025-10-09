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
  nombreSector: string;
  descripcion: string;
  imageUrl?: string;
  imageAlt?: string;
  videoPresentacion?: string;
  alineacionODS?: string;
  subareasResultados?: string;
  resultados?: string;
  gruposAtencion?: string;
  contenidosTemas?: string;
  enlaceMasInformacion?: string;
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
  const [formData, setFormData] = useState({
    nombreSector: '',
    descripcion: '',
    imageUrl: '',
    imageAlt: '',
    videoPresentacion: '',
    alineacionODS: '',
    subareasResultados: '',
    resultados: '',
    gruposAtencion: '',
    contenidosTemas: '',
    enlaceMasInformacion: '',
  });

  useEffect(() => {
    if (programa) {
      setFormData({
        nombreSector: programa.nombreSector,
        descripcion: programa.descripcion,
        imageUrl: programa.imageUrl || '',
        imageAlt: programa.imageAlt || '',
        videoPresentacion: programa.videoPresentacion || '',
        alineacionODS: programa.alineacionODS || '',
        subareasResultados: programa.subareasResultados || '',
        resultados: programa.resultados || '',
        gruposAtencion: programa.gruposAtencion || '',
        contenidosTemas: programa.contenidosTemas || '',
        enlaceMasInformacion: programa.enlaceMasInformacion || '',
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
                <Label htmlFor="nombreSector">Nombre del Sector *</Label>
                <Input
                  id="nombreSector"
                  value={formData.nombreSector}
                  onChange={(e) => setFormData({ ...formData, nombreSector: e.target.value })}
                  required
                  placeholder="Ej: Educación Primaria"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="descripcion">Descripción *</Label>
              <Textarea
                id="descripcion"
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
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
              <Label htmlFor="videoPresentacion">URL del Video de Presentación</Label>
              <Input
                id="videoPresentacion"
                value={formData.videoPresentacion}
                onChange={(e) => setFormData({ ...formData, videoPresentacion: e.target.value })}
                placeholder="https://youtube.com/watch?v=..."
              />
            </div>
          </div>

          {/* Detalles del Programa */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Detalles del Programa</h3>
            
            <div>
              <Label htmlFor="alineacionODS">Alineación a ODS</Label>
              <Textarea
                id="alineacionODS"
                value={formData.alineacionODS}
                onChange={(e) => setFormData({ ...formData, alineacionODS: e.target.value })}
                placeholder="Cómo se alinea con los Objetivos de Desarrollo Sostenible..."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="subareasResultados">Subáreas de Resultados</Label>
              <Textarea
                id="subareasResultados"
                value={formData.subareasResultados}
                onChange={(e) => setFormData({ ...formData, subareasResultados: e.target.value })}
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
              <Label htmlFor="gruposAtencion">Grupos de Atención</Label>
              <Textarea
                id="gruposAtencion"
                value={formData.gruposAtencion}
                onChange={(e) => setFormData({ ...formData, gruposAtencion: e.target.value })}
                placeholder="Grupos objetivo del programa..."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="contenidosTemas">Contenidos/Temas</Label>
              <Textarea
                id="contenidosTemas"
                value={formData.contenidosTemas}
                onChange={(e) => setFormData({ ...formData, contenidosTemas: e.target.value })}
                placeholder="Contenidos y temas del programa..."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="enlaceMasInformacion">Enlace para Más Información</Label>
              <Input
                id="enlaceMasInformacion"
                value={formData.enlaceMasInformacion}
                onChange={(e) => setFormData({ ...formData, enlaceMasInformacion: e.target.value })}
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
