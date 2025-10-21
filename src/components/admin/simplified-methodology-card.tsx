'use client'

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Edit, Trash2, Eye, EyeOff, Calendar, User } from 'lucide-react';
import Image from 'next/image';
import { isValidImageUrl, getImagePlaceholderData, handleImageError } from '@/lib/image-utils';

interface SimplifiedMethodologyCardProps {
  id: string;
  title: string;
  shortDescription: string;
  imageUrl?: string;
  imageAlt?: string;
  sectors: ('SALUD' | 'EDUCACION' | 'MEDIOS_DE_VIDA' | 'PROTECCION' | 'SOSTENIBILIDAD' | 'DESARROLLO_INFANTIL_TEMPRANO' | 'NINEZ_EN_CRISIS')[];
  isActive: boolean;
  createdAt: string;
  creator?: {
    name?: string;
    email: string;
  };
  selectedItems: string[];
  onSelectItem: (id: string) => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onToggleStatus?: () => void;
  getStatusBadgeVariant: (isActive: boolean) => 'default' | 'secondary' | 'destructive' | 'outline';
  formatDate: (dateString: string) => string;
}

const categoryLabels = {
  EDUCACION: 'Educación',
  SALUD: 'Salud',
  MEDIOS_DE_VIDA: 'Medios de Vida',
  PROTECCION: 'Protección',
  SOSTENIBILIDAD: 'Sostenibilidad',
  DESARROLLO_INFANTIL_TEMPRANO: 'Desarrollo Infantil Temprano',
  NINEZ_EN_CRISIS: 'Niñez en Crisis'
};

const categoryColors = {
  EDUCACION: 'bg-blue-100 text-blue-800 dark:bg-blue-200 dark:text-blue-900',
  SALUD: 'bg-red-100 text-red-800 dark:bg-red-200 dark:text-red-900',
  MEDIOS_DE_VIDA: 'bg-purple-100 text-purple-800 dark:bg-purple-200 dark:text-purple-900',
  PROTECCION: 'bg-orange-100 text-orange-800 dark:bg-orange-200 dark:text-orange-900',
  SOSTENIBILIDAD: 'bg-green-100 text-green-800 dark:bg-green-200 dark:text-green-900',
  DESARROLLO_INFANTIL_TEMPRANO: 'bg-pink-100 text-pink-800 dark:bg-pink-200 dark:text-pink-900',
  NINEZ_EN_CRISIS: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-200 dark:text-yellow-900'
};

export const SimplifiedMethodologyCard: React.FC<SimplifiedMethodologyCardProps> = ({
  id,
  title,
  shortDescription,
  imageUrl,
  imageAlt,
  sectors,
  isActive,
  createdAt,
  creator,
  selectedItems,
  onSelectItem,
  onEdit,
  onDelete,
  onToggleStatus,
  getStatusBadgeVariant,
  formatDate
}) => {
  return (
    <Card className="overflow-hidden min-h-[400px] flex flex-col hover:shadow-lg transition-shadow">
      {/* Imagen */}
      <div className="relative h-48 flex-shrink-0">
        {imageUrl && isValidImageUrl(imageUrl) ? (
          <Image
            src={imageUrl}
            alt={imageAlt || title}
            fill
            className="object-cover"
            onError={(e) => handleImageError(e, id, imageUrl)}
          />
        ) : (
          (() => {
            const placeholderData = getImagePlaceholderData('story', !!imageUrl);
            return (
              <div className={placeholderData.className}>
                <div className="text-center">
                  <span className="material-symbols-outlined text-4xl text-gray-400 mb-2 block">
                    {placeholderData.icon}
                  </span>
                  <span className="text-sm text-gray-500">
                    {placeholderData.message}
                  </span>
                </div>
              </div>
            );
          })()
        )}
        <div className="absolute top-2 right-2">
          <Checkbox
            checked={selectedItems.includes(id)}
            onCheckedChange={() => onSelectItem(id)}
            className="bg-white/90 backdrop-blur-sm"
          />
        </div>
      </div>

      {/* Contenido */}
      <CardContent className="p-4 flex-1 flex flex-col">
        {/* Tipo y Estado */}
        <div className="flex justify-between items-center mb-3">
          <div className="flex flex-wrap gap-1">
            {sectors.map((sector) => (
              <span key={sector} className={`${categoryColors[sector]} text-xs font-semibold px-2.5 py-0.5 rounded`}>
                {categoryLabels[sector]}
              </span>
            ))}
          </div>
          <Badge variant={getStatusBadgeVariant(isActive)}>
            {isActive ? 'Activo' : 'Inactivo'}
          </Badge>
        </div>
        
        {/* Título */}
        <h3 className="font-semibold text-lg mb-2 line-clamp-2 leading-tight">
          {title}
        </h3>
        
        {/* Descripción corta */}
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-3 flex-grow">
          {shortDescription}
        </p>
        
        {/* Metadatos */}
        <div className="space-y-1 mb-3">
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Calendar className="h-3 w-3" />
            {formatDate(createdAt)}
          </div>
          
          {creator && (
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <User className="h-3 w-3" />
              <span>{creator.name || creator.email}</span>
            </div>
          )}
        </div>
        
        {/* Botones de acción */}
        <div className="flex items-center justify-end gap-1 mt-auto">
          {onEdit && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-gray-500 hover:text-blue-600 hover:bg-blue-50"
              title="Editar"
              onClick={onEdit}
            >
              <Edit className="h-4 w-4" />
            </Button>
          )}
          
          {onToggleStatus && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-gray-500 hover:text-orange-600 hover:bg-orange-50"
              title={isActive ? 'Desactivar' : 'Activar'}
              onClick={onToggleStatus}
            >
              {isActive ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          )}
          
          {onDelete && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-gray-500 hover:text-red-600 hover:bg-red-50"
              title="Eliminar"
              onClick={onDelete}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
