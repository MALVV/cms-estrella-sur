'use client'

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Edit, Trash2, Eye, EyeOff, Calendar, User } from 'lucide-react';
import Image from 'next/image';
import { isValidImageUrl, getImagePlaceholderData, handleImageError } from '@/lib/image-utils';

interface UnifiedCardProps {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  imageAlt?: string;
  isActive: boolean;
  isFeatured?: boolean;
  createdAt: string;
  creator?: {
    name?: string;
    email: string;
  };
  category?: string;
  categoryLabel?: string;
  categoryColor?: string;
  type: 'project' | 'news' | 'program' | 'event' | 'ally' | 'story';
  selectedItems: string[];
  onSelectItem: (id: string) => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onToggleStatus?: () => void;
  onToggleFeatured?: () => void;
  getStatusBadgeVariant: (isActive: boolean) => 'default' | 'secondary' | 'destructive' | 'outline';
  formatDate: (dateString: string) => string;
  relations?: Array<{
    type: string;
    label: string;
    icon?: string;
  }>;
}

export const UnifiedCard: React.FC<UnifiedCardProps> = ({
  id,
  title,
  description,
  imageUrl,
  imageAlt,
  isActive,
  isFeatured,
  createdAt,
  creator,
  category,
  categoryLabel,
  categoryColor,
  type,
  selectedItems,
  onSelectItem,
  onEdit,
  onDelete,
  onToggleStatus,
  onToggleFeatured,
  getStatusBadgeVariant,
  formatDate,
  relations
}) => {
  const typeLabels = {
    project: 'Proyecto',
    news: 'Noticia',
    program: 'Programa',
    event: 'Evento',
    ally: 'Aliado',
    story: 'Historia'
  };

  const typeColors = {
    project: 'bg-blue-100 text-blue-800 dark:bg-blue-200 dark:text-blue-900',
    news: 'bg-green-100 text-green-800 dark:bg-green-200 dark:text-green-900',
    program: 'bg-purple-100 text-purple-800 dark:bg-purple-200 dark:text-purple-900',
    event: 'bg-orange-100 text-orange-800 dark:bg-orange-200 dark:text-orange-900',
    ally: 'bg-pink-100 text-pink-800 dark:bg-pink-200 dark:text-pink-900',
    story: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-200 dark:text-indigo-900'
  };

  return (
    <Card className="overflow-hidden min-h-[400px] flex flex-col">
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
            const placeholderData = getImagePlaceholderData(type, !!imageUrl);
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
      <CardContent className="p-4 flex-1 flex flex-col">
        <div className="text-sm mb-2 flex justify-between items-center">
          <span className={`${typeColors[type]} text-xs font-semibold px-2.5 py-0.5 rounded`}>
            {typeLabels[type]}
          </span>
          <Badge variant={getStatusBadgeVariant(isActive)}>
            {isActive ? 'Activo' : 'Inactivo'}
          </Badge>
        </div>
        
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">
          {title}
        </h3>
        
        {description && (
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-3">
            {description}
          </p>
        )}
        
        {/* Categoría específica */}
        {category && categoryLabel && (
          <div className="text-sm mb-2">
            <span className={`${categoryColor || 'bg-gray-100 text-gray-800'} text-xs font-semibold mr-2 px-2.5 py-0.5 rounded`}>
              {categoryLabel}
            </span>
          </div>
        )}
        
        {/* Relaciones */}
        {relations && relations.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {relations.map((relation, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {relation.label}
              </Badge>
            ))}
          </div>
        )}
        
        <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
          <Calendar className="h-3 w-3" />
          {formatDate(createdAt)}
        </div>
        
        {creator && (
          <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
            <User className="h-3 w-3" />
            <span>{creator.name || creator.email}</span>
          </div>
        )}
        
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
