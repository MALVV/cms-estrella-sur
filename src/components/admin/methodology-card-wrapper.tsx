'use client'

import React, { useRef } from 'react';
import { UnifiedCard } from '@/components/admin/unified-card';
import { EditMethodologyDialog } from '@/components/admin/edit-methodology-dialog';
import { ToggleMethodologyStatusDialog } from '@/components/admin/toggle-methodology-status-dialog';
import { DeleteMethodologyDialog } from '@/components/admin/delete-methodology-dialog';

interface Methodology {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  imageUrl?: string;
  imageAlt?: string;
  ageGroup: string;
  category: 'EDUCACION' | 'SALUD' | 'SOCIAL' | 'AMBIENTAL';
  targetAudience: string;
  objectives: string;
  implementation: string;
  results: string;
  methodology?: string;
  resources?: string;
  evaluation?: string;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  creator?: {
    name?: string;
    email: string;
  };
}

interface MethodologyCardWrapperProps {
  methodology: Methodology;
  selectedItems: string[];
  onSelectItem: (id: string) => void;
  onMethodologyUpdated: (methodology: Methodology) => void;
  onStatusChanged: (methodologyId: string, newStatus: boolean) => void;
  onDelete: (methodologyId: string) => void;
  getStatusBadgeVariant: (isActive: boolean) => 'default' | 'secondary' | 'destructive' | 'outline';
  formatDate: (dateString: string) => string;
}

const categoryLabels = {
  EDUCACION: 'Educación',
  SALUD: 'Salud',
  SOCIAL: 'Social',
  AMBIENTAL: 'Ambiental'
};

const categoryColors = {
  EDUCACION: 'bg-blue-100 text-blue-800 dark:bg-blue-200 dark:text-blue-900',
  SALUD: 'bg-red-100 text-red-800 dark:bg-red-200 dark:text-red-900',
  SOCIAL: 'bg-green-100 text-green-800 dark:bg-green-200 dark:text-green-900',
  AMBIENTAL: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-200 dark:text-emerald-900'
};

export const MethodologyCardWrapper: React.FC<MethodologyCardWrapperProps> = ({
  methodology,
  selectedItems,
  onSelectItem,
  onMethodologyUpdated,
  onStatusChanged,
  onDelete,
  getStatusBadgeVariant,
  formatDate
}) => {
  const editDialogRef = useRef<HTMLButtonElement>(null);

  const relations = [
    {
      type: 'ageGroup',
      label: methodology.ageGroup
    },
    {
      type: 'targetAudience',
      label: methodology.targetAudience
    }
  ];

  const handleToggleStatus = () => {
    // Abrir el diálogo de toggle status
    const toggleButton = document.querySelector(`[data-methodology-id="${methodology.id}"] [data-action="toggle"]`) as HTMLButtonElement;
    toggleButton?.click();
  };

  const handleDelete = () => {
    // Abrir el diálogo de delete
    const deleteButton = document.querySelector(`[data-methodology-id="${methodology.id}"] [data-action="delete"]`) as HTMLButtonElement;
    deleteButton?.click();
  };

  return (
    <>
      <UnifiedCard
        id={methodology.id}
        title={methodology.title}
        description={methodology.shortDescription || methodology.description}
        imageUrl={methodology.imageUrl}
        imageAlt={methodology.imageAlt}
        isActive={methodology.isActive}
        isFeatured={methodology.isFeatured}
        createdAt={methodology.createdAt}
        creator={methodology.creator}
        category={methodology.category}
        categoryLabel={categoryLabels[methodology.category]}
        categoryColor={categoryColors[methodology.category]}
        type="story" // Usamos 'story' como tipo ya que no tenemos 'methodology' en UnifiedCard
        selectedItems={selectedItems}
        onSelectItem={onSelectItem}
        getStatusBadgeVariant={getStatusBadgeVariant}
        formatDate={formatDate}
        relations={relations}
        onEdit={() => editDialogRef.current?.click()}
        onToggleStatus={handleToggleStatus}
        onDelete={handleDelete}
      />
      
      {/* Diálogos con botones ocultos */}
      <div data-methodology-id={methodology.id} style={{ display: 'none' }}>
        <EditMethodologyDialog
          methodology={methodology}
          onMethodologyUpdated={onMethodologyUpdated}
        >
          <button ref={editDialogRef} />
        </EditMethodologyDialog>
        
        <ToggleMethodologyStatusDialog
          methodology={methodology}
          onSuccess={() => {
            onStatusChanged(methodology.id, !methodology.isActive);
          }}
        >
          <button data-action="toggle" />
        </ToggleMethodologyStatusDialog>
        
        <DeleteMethodologyDialog
          methodology={methodology}
          onSuccess={() => {
            onDelete(methodology.id);
          }}
        >
          <button data-action="delete" />
        </DeleteMethodologyDialog>
      </div>
    </>
  );
};
