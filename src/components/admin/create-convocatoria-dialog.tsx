'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface CreateConvocatoriaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function CreateConvocatoriaDialog({ open, onOpenChange, onSuccess }: CreateConvocatoriaDialogProps) {
  const [loading, setLoading] = useState(false);
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
      
      const response = await fetch('/api/admin/convocatorias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          ...formData,
          objectives: [],
          responsibilities: [],
          qualifications: [],
          benefits: [],
          requirements: requirementsArray,
          documents: [],
        }),
      });

      if (!response.ok) {
        throw new Error('Error al crear convocatoria');
      }

      toast.success('Convocatoria creada exitosamente');
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al crear convocatoria');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nueva Convocatoria</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="imageUrl">URL de Imagen</Label>
              <Input id="imageUrl" name="imageUrl" value={formData.imageUrl} onChange={handleInputChange} />
            </div>
            <div>
              <Label htmlFor="imageAlt">Texto alternativo</Label>
              <Input id="imageAlt" name="imageAlt" value={formData.imageAlt} onChange={handleInputChange} />
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

          <Button type="submit" disabled={loading}>
            {loading ? 'Creando...' : 'Crear Convocatoria'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

