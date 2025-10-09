'use client';

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Calendar, User, ExternalLink } from 'lucide-react';

interface Ally {
  id: string;
  name: string;
  role: string;
  description?: string;
  imageUrl: string;
  imageAlt: string;
  status: 'ACTIVE' | 'INACTIVE';
  isFeatured?: boolean;
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

interface AllyViewModalProps {
  ally: Ally | null;
  isOpen: boolean;
  onClose: () => void;
}

export function AllyViewModal({ ally, isOpen, onClose }: AllyViewModalProps) {
  if (!ally) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold mb-2">
            {ally.name}
          </DialogTitle>
          <div className="flex gap-2">
            <Badge variant={ally.status === 'ACTIVE' ? 'default' : 'secondary'}>
              {ally.status === 'ACTIVE' ? 'Activo' : 'Inactivo'}
            </Badge>
            {ally.isFeatured && (
              <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                Destacado
              </Badge>
            )}
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Contenido Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Imagen del Aliado */}
            <Card>
              <CardContent className="p-6">
                <div className="aspect-video bg-gray-100 dark:bg-gray-800 relative rounded-lg overflow-hidden">
                  {ally.imageUrl ? (
                    <Image
                      src={ally.imageUrl}
                      alt={ally.imageAlt || ally.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                      </svg>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Información del Aliado */}
            <Card>
              <CardHeader>
                <CardTitle>Información del Aliado</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Rol</h3>
                  <p className="text-gray-700">{ally.role}</p>
                </div>

                {ally.description && (
                  <div>
                    <h3 className="font-semibold mb-2">Descripción</h3>
                    <p className="text-gray-700 whitespace-pre-wrap">{ally.description}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Información de Creación */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Información del Sistema</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>Creado: {formatDate(ally.createdAt)}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>Actualizado: {formatDate(ally.updatedAt)}</span>
                </div>

                {ally.author && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <User className="h-4 w-4" />
                    <span>Creado por: {ally.author.name}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Estado */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Estado</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Estado:</span>
                    <Badge variant={ally.status === 'ACTIVE' ? 'default' : 'secondary'}>
                      {ally.status === 'ACTIVE' ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </div>
                  
                  {ally.isFeatured && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Destacado:</span>
                      <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                        Sí
                      </Badge>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
