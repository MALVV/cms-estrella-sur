'use client'

import React, { useRef } from 'react';
import { UnifiedCard } from '@/components/admin/unified-card';
import { EditProjectForm } from '@/components/admin/edit-project-form';
import { ToggleProjectStatusDialog } from '@/components/admin/toggle-project-status-dialog';
import { DeleteProjectDialog } from '@/components/admin/delete-project-dialog';

interface ProjectItem {
  id: string;
  title: string;
  executionStart: string;
  executionEnd: string;
  context: string;
  objectives: string;
  content: string;
  strategicAllies?: string;
  financing?: string;
  imageUrl?: string;
  imageAlt?: string;
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

interface ProjectCardWrapperProps {
  project: ProjectItem;
  selectedItems: string[];
  onSelectItem: (id: string) => void;
  onProjectUpdated: (project: ProjectItem) => void;
  onStatusChanged: (projectId: string, newStatus: boolean) => void;
  onDelete: (projectId: string) => void;
  getStatusBadgeVariant: (isActive: boolean) => 'default' | 'secondary' | 'destructive' | 'outline';
  formatDate: (dateString: string) => string;
}

export const ProjectCardWrapper: React.FC<ProjectCardWrapperProps> = ({
  project,
  selectedItems,
  onSelectItem,
  onProjectUpdated,
  onStatusChanged,
  onDelete,
  getStatusBadgeVariant,
  formatDate
}) => {
  const editDialogRef = useRef<HTMLButtonElement>(null);
  const statusDialogRef = useRef<HTMLButtonElement>(null);
  const deleteDialogRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      <UnifiedCard
        id={project.id}
        title={project.title}
        description={project.context}
        imageUrl={project.imageUrl}
        imageAlt={project.imageAlt}
        isActive={project.isActive}
        isFeatured={project.isFeatured}
        createdAt={project.createdAt}
        creator={project.creator}
        type="project"
        selectedItems={selectedItems}
        onSelectItem={onSelectItem}
        getStatusBadgeVariant={getStatusBadgeVariant}
        formatDate={formatDate}
        onEdit={() => editDialogRef.current?.click()}
        onToggleStatus={() => statusDialogRef.current?.click()}
        onDelete={() => deleteDialogRef.current?.click()}
      />
      
      {/* Diálogos ocultos */}
      <EditProjectForm
        project={project}
        onProjectUpdated={onProjectUpdated}
      >
        <button ref={editDialogRef} style={{ display: 'none' }} />
      </EditProjectForm>
      
      <ToggleProjectStatusDialog
        project={project}
        onStatusChanged={onStatusChanged}
      >
        <button ref={statusDialogRef} style={{ display: 'none' }} />
      </ToggleProjectStatusDialog>
      
      <DeleteProjectDialog
        project={project}
        onProjectDeleted={onDelete}
      >
        <button ref={deleteDialogRef} style={{ display: 'none' }} />
      </DeleteProjectDialog>
    </>
  );
};
