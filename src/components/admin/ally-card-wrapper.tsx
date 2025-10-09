'use client'

import React, { useRef } from 'react';
import { UnifiedCard } from '@/components/admin/unified-card';
import { EditAllyForm } from '@/components/admin/edit-ally-form';
import { ToggleAllyStatusDialog } from '@/components/admin/toggle-ally-status-dialog';
import { DeleteAllyDialog } from '@/components/admin/delete-ally-dialog';

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
