'use client'

import React, { useRef } from 'react';
import { SimplifiedMethodologyCard } from '@/components/admin/simplified-methodology-card';
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
      <SimplifiedMethodologyCard
        id={methodology.id}
        title={methodology.title}
        shortDescription={methodology.shortDescription || methodology.description}
        imageUrl={methodology.imageUrl}
        imageAlt={methodology.imageAlt}
        category={methodology.category}
        isActive={methodology.isActive}
        createdAt={methodology.createdAt}
        creator={methodology.creator}
        selectedItems={selectedItems}
        onSelectItem={onSelectItem}
        getStatusBadgeVariant={getStatusBadgeVariant}
        formatDate={formatDate}
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
