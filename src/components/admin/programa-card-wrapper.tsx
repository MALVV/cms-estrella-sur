'use client'

import React, { useRef } from 'react';
import { UnifiedCard } from '@/components/admin/unified-card';
import { EditProgramaDialog } from '@/components/admin/edit-programa-dialog';
import { ToggleProgramaStatusDialog } from '@/components/admin/toggle-programa-status-dialog';
import { DeleteProgramaDialog } from '@/components/admin/delete-programa-dialog';

interface Programa {
  id: string;
  nombreSector: string;
  descripcion: string;
  imageUrl?: string;
  imageAlt?: string;
  videoPresentacion?: string;
  alineacionODS?: string;
  subareasResultados?: string;
  resultados?: string;
  gruposAtencion?: string;
  contenidosTemas?: string;
  enlaceMasInformacion?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  creator: {
    id: string;
    name: string;
    email: string;
  };
  _count?: {
    news: number;
    imageLibrary: number;
  };
}

interface ProgramaCardWrapperProps {
  programa: Programa;
  selectedProgramas: string[];
  onSelectPrograma: (id: string) => void;
  onSuccess: () => void;
  onViewPrograma: (programa: Programa) => void;
}

export const ProgramaCardWrapper: React.FC<ProgramaCardWrapperProps> = ({
  programa,
  selectedProgramas,
  onSelectPrograma,
  onSuccess,
  onViewPrograma
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
        id={programa.id}
        title={programa.nombreSector}
        description={programa.descripcion}
        imageUrl={programa.imageUrl}
        imageAlt={programa.imageAlt}
        isActive={programa.isActive}
        createdAt={programa.createdAt}
        type="program"
        selectedItems={selectedProgramas}
        onSelectItem={onSelectPrograma}
        getStatusBadgeVariant={getStatusBadgeVariant}
        formatDate={formatDate}
        onEdit={() => editDialogRef.current?.click()}
        onToggleStatus={() => statusDialogRef.current?.click()}
        onDelete={() => deleteDialogRef.current?.click()}
      />
      
      {/* Diálogos ocultos */}
      <EditProgramaDialog
        programa={programa}
        onSuccess={onSuccess}
      >
        <button ref={editDialogRef} style={{ display: 'none' }} />
      </EditProgramaDialog>
      
      <ToggleProgramaStatusDialog
        programa={programa}
        onSuccess={onSuccess}
      >
        <button ref={statusDialogRef} style={{ display: 'none' }} />
      </ToggleProgramaStatusDialog>
      
      <DeleteProgramaDialog
        programa={programa}
        onSuccess={onSuccess}
      >
        <button ref={deleteDialogRef} style={{ display: 'none' }} />
      </DeleteProgramaDialog>
    </>
  );
};
