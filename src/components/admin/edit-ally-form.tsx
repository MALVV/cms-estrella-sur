'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface Ally {
  id: string;
  name: string;
  role: string;
  description?: string;
  imageUrl: string;
  imageAlt: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  author?: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

interface EditAllyFormProps {
  ally: Ally;
  onSuccess?: () => void;
  children: React.ReactNode;
}

export const EditAllyForm: React.FC<EditAllyFormProps> = ({ ally, onSuccess, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    description: '',
    imageUrl: '',
    imageAlt: '',
    isActive: true,
  });

  // Límites de caracteres para mantener estética en las tarjetas
  const CHARACTER_LIMITS = {
    name: 40,
    role: 25,
    description: 150,
    imageAlt: 60,
  };

  useEffect(() => {
    setFormData({
      name: ally.name,
      role: ally.role,
      description: ally.description || '',
      imageUrl: ally.imageUrl,
      imageAlt: ally.imageAlt,
      isActive: ally.status === 'ACTIVE',
    });
  }, [ally]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`/api/allies/${ally.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al actualizar el aliado');
      }

      toast.success('Aliado actualizado exitosamente');
      setIsOpen(false);
      onSuccess?.();
    } catch (error) {
      console.error('Error updating ally:', error);
      toast.error(error instanceof Error ? error.message : 'Error al actualizar el aliado');
    } finally {
      setIsLoading(false);
    }
  };

  // Función para obtener el color del contador según el porcentaje usado
  const getCounterColor = (current: number, max: number) => {
    const percentage = (current / max) * 100;
    if (percentage >= 90) return 'text-red-500';
    if (percentage >= 75) return 'text-yellow-500';
    return 'text-gray-500';
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Editar Aliado</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nombre *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                placeholder="Ej: FUNDACIÓN MUNDO FELIZ"
                maxLength={CHARACTER_LIMITS.name}
              />
              <div className={`text-xs mt-1 ${getCounterColor(formData.name.length, CHARACTER_LIMITS.name)}`}>
                {formData.name.length}/{CHARACTER_LIMITS.name} caracteres
              </div>
            </div>
            <div>
              <Label htmlFor="role">Rol *</Label>
              <Input
                id="role"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                required
                placeholder="Ej: Aliado Estratégico"
                maxLength={CHARACTER_LIMITS.role}
              />
              <div className={`text-xs mt-1 ${getCounterColor(formData.role.length, CHARACTER_LIMITS.role)}`}>
                {formData.role.length}/{CHARACTER_LIMITS.role} caracteres
              </div>
            </div>
          </div>
          
          <div>
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Descripción del aliado..."
              rows={3}
              maxLength={CHARACTER_LIMITS.description}
            />
            <div className={`text-xs mt-1 ${getCounterColor(formData.description.length, CHARACTER_LIMITS.description)}`}>
              {formData.description.length}/{CHARACTER_LIMITS.description} caracteres
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="imageUrl">URL de la Imagen *</Label>
              <Input
                id="imageUrl"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                required
                placeholder="https://ejemplo.com/imagen.jpg"
              />
            </div>
            <div>
              <Label htmlFor="imageAlt">Texto Alternativo de la Imagen *</Label>
              <Input
                id="imageAlt"
                value={formData.imageAlt}
                onChange={(e) => setFormData({ ...formData, imageAlt: e.target.value })}
                required
                placeholder="Descripción de la imagen"
                maxLength={CHARACTER_LIMITS.imageAlt}
              />
              <div className={`text-xs mt-1 ${getCounterColor(formData.imageAlt.length, CHARACTER_LIMITS.imageAlt)}`}>
                {formData.imageAlt.length}/{CHARACTER_LIMITS.imageAlt} caracteres
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="rounded"
            />
            <Label htmlFor="isActive">Aliado activo</Label>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)} disabled={isLoading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Actualizando...
                </>
              ) : (
                'Actualizar Aliado'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};