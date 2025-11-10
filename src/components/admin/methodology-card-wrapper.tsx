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
  sectors: ('SALUD' | 'EDUCACION' | 'MEDIOS_DE_VIDA' | 'PROTECCION' | 'SOSTENIBILIDAD' | 'DESARROLLO_INFANTIL_TEMPRANO' | 'NINEZ_EN_CRISIS')[];
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

  // Función para convertir sectores del formato enum al formato español
  const mapSectorsToSpanish = (sectors: string[]): ('SALUD' | 'EDUCACION' | 'MEDIOS_DE_VIDA' | 'PROTECCION' | 'SOSTENIBILIDAD' | 'DESARROLLO_INFANTIL_TEMPRANO' | 'NINEZ_EN_CRISIS')[] => {
    const enumToSpanishMap: Record<string, 'SALUD' | 'EDUCACION' | 'MEDIOS_DE_VIDA' | 'PROTECCION' | 'SOSTENIBILIDAD' | 'DESARROLLO_INFANTIL_TEMPRANO' | 'NINEZ_EN_CRISIS'> = {
      'HEALTH': 'SALUD',
      'EDUCATION': 'EDUCACION',
      'LIVELIHOODS': 'MEDIOS_DE_VIDA',
      'PROTECTION': 'PROTECCION',
      'SUSTAINABILITY': 'SOSTENIBILIDAD',
      'EARLY_CHILD_DEVELOPMENT': 'DESARROLLO_INFANTIL_TEMPRANO',
      'CHILDREN_IN_CRISIS': 'NINEZ_EN_CRISIS',
    };
    const validSpanishSectors = ['SALUD', 'EDUCACION', 'MEDIOS_DE_VIDA', 'PROTECCION', 'SOSTENIBILIDAD', 'DESARROLLO_INFANTIL_TEMPRANO', 'NINEZ_EN_CRISIS'] as const;
    type SpanishSector = typeof validSpanishSectors[number];
    
    return sectors
      .map((sector): SpanishSector | undefined => {
        if (validSpanishSectors.includes(sector as SpanishSector)) {
          return sector as SpanishSector;
        }
        return enumToSpanishMap[sector];
      })
      .filter((sector): sector is SpanishSector => sector !== undefined);
  };

  // Función para convertir sectores del formato español al formato enum
  const mapSectorsToEnum = (sectors: ('SALUD' | 'EDUCACION' | 'MEDIOS_DE_VIDA' | 'PROTECCION' | 'SOSTENIBILIDAD' | 'DESARROLLO_INFANTIL_TEMPRANO' | 'NINEZ_EN_CRISIS')[]): string[] => {
    const spanishToEnumMap: Record<string, string> = {
      'SALUD': 'HEALTH',
      'EDUCACION': 'EDUCATION',
      'MEDIOS_DE_VIDA': 'LIVELIHOODS',
      'PROTECCION': 'PROTECTION',
      'SOSTENIBILIDAD': 'SUSTAINABILITY',
      'DESARROLLO_INFANTIL_TEMPRANO': 'EARLY_CHILD_DEVELOPMENT',
      'NINEZ_EN_CRISIS': 'CHILDREN_IN_CRISIS',
    };
    const validEnums = ['HEALTH', 'EDUCATION', 'LIVELIHOODS', 'PROTECTION', 'SUSTAINABILITY', 'EARLY_CHILD_DEVELOPMENT', 'CHILDREN_IN_CRISIS'];
    
    return sectors
      .map(sector => {
        if (validEnums.includes(sector)) {
          return sector;
        }
        return spanishToEnumMap[sector] || sector;
      })
      .filter(s => s !== undefined) as string[];
  };

  // Convertir methodology al formato esperado por EditMethodologyDialog
  const methodologyForEdit = {
    ...methodology,
    sectors: mapSectorsToEnum(methodology.sectors),
  };

  // Wrapper para convertir el methodology antes de pasarlo a onMethodologyUpdated
  const handleMethodologyUpdated = (updatedMethodology: { sectors: string[] } & Omit<Methodology, 'sectors'>) => {
    onMethodologyUpdated({
      ...updatedMethodology,
      sectors: mapSectorsToSpanish(updatedMethodology.sectors || []),
    });
  };

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
        sectors={methodology.sectors}
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
          methodology={methodologyForEdit}
          onMethodologyUpdated={handleMethodologyUpdated}
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
