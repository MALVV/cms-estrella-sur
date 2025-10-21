'use client'

import React, { useRef } from 'react';
import { UnifiedCard } from '@/components/admin/unified-card';
import { EditAllyForm } from '@/components/admin/edit-ally-form';
import { ToggleAllyStatusDialog } from '@/components/admin/toggle-ally-status-dialog';
import { DeleteAllyDialog } from '@/components/admin/delete-ally-dialog';
import { ToggleAllyFeaturedDialog } from '@/components/admin/toggle-ally-featured-dialog';
import { Button } from '@/components/ui/button';
import { Star, StarOff } from 'lucide-react';

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

interface AllyCardWrapperProps {
  ally: Ally;
  selectedAllies: string[];
  onSelectAlly: (id: string) => void;
  onSuccess: () => void;
  onViewAlly: (ally: Ally) => void;
}

export const AllyCardWrapper: React.FC<AllyCardWrapperProps> = ({
  ally,
  selectedAllies,
  onSelectAlly,
  onSuccess,
  onViewAlly
}) => {
  const editDialogRef = useRef<HTMLButtonElement>(null);
  const statusDialogRef = useRef<HTMLButtonElement>(null);
  const deleteDialogRef = useRef<HTMLButtonElement>(null);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadgeVariant = (isActive: boolean) => {
    return isActive ? 'default' : 'secondary';
  };

  return (
    <>
      <div className="relative">
        <UnifiedCard
          id={ally.id}
          title={ally.name}
          description={ally.description || ally.role}
          imageUrl={ally.imageUrl}
          imageAlt={ally.imageAlt}
          isActive={ally.status === 'ACTIVE'}
          isFeatured={ally.isFeatured}
          createdAt={ally.createdAt}
          creator={ally.author ? {
            name: ally.author.name,
            email: ally.author.email
          } : undefined}
          type="ally"
          selectedItems={selectedAllies}
          onSelectItem={onSelectAlly}
          getStatusBadgeVariant={getStatusBadgeVariant}
          formatDate={formatDate}
          onEdit={() => editDialogRef.current?.click()}
          onToggleStatus={() => statusDialogRef.current?.click()}
          onDelete={() => deleteDialogRef.current?.click()}
        />
        
        {/* Botón de destacar flotante */}
        <div className="absolute top-2 left-2">
          <ToggleAllyFeaturedDialog
            ally={ally}
            onSuccess={onSuccess}
          >
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 bg-white/90 backdrop-blur-sm hover:bg-white"
              title={ally.isFeatured ? 'Remover de destacados' : 'Destacar'}
            >
              {ally.isFeatured ? (
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              ) : (
                <StarOff className="h-4 w-4 text-gray-400 hover:text-yellow-400" />
              )}
            </Button>
          </ToggleAllyFeaturedDialog>
        </div>
      </div>
      
      {/* Diálogos ocultos */}
      <EditAllyForm
        ally={ally}
        onSuccess={onSuccess}
      >
        <button ref={editDialogRef} style={{ display: 'none' }} />
      </EditAllyForm>
      
      <ToggleAllyStatusDialog
        ally={ally}
        onSuccess={onSuccess}
      >
        <button ref={statusDialogRef} style={{ display: 'none' }} />
      </ToggleAllyStatusDialog>
      
      <DeleteAllyDialog
        ally={ally}
        onSuccess={onSuccess}
      >
        <button ref={deleteDialogRef} style={{ display: 'none' }} />
      </DeleteAllyDialog>
    </>
  );
};
