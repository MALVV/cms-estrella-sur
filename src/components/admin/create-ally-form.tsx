'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface CreateAllyFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export const CreateAllyForm: React.FC<CreateAllyFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    description: '',
    imageUrl: '',
    imageAlt: '',
  });

  // Límites de caracteres para mantener estética en las tarjetas
  const CHARACTER_LIMITS = {
    name: 40,
    role: 25,
    description: 150,
    imageAlt: 60,
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  // Función para obtener el color del contador según el porcentaje usado
  const getCounterColor = (current: number, max: number) => {
    const percentage = (current / max) * 100;
    if (percentage >= 90) return 'text-red-500';
    if (percentage >= 75) return 'text-yellow-500';
    return 'text-gray-500';
  };

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Crear Nuevo Aliado</DialogTitle>
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

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit">
              Crear Aliado
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

