'use client'

import React, { useRef } from 'react';
import { UnifiedCard } from '@/components/admin/unified-card';
import { EditEventForm } from '@/components/admin/edit-event-form';
import { ToggleEventStatusDialog } from '@/components/admin/toggle-event-status-dialog';
import { DeleteEventDialog } from '@/components/admin/delete-event-dialog';

interface EventItem {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  imageAlt?: string;
  eventDate: string;
  eventTime?: string;
  location?: string;
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

interface EventCardWrapperProps {
  event: EventItem;
  selectedItems: string[];
  onSelectItem: (id: string) => void;
  onEventUpdated: (event: EventItem) => void;
  onStatusChanged: (eventId: string, newStatus: boolean) => void;
  onDelete: (eventId: string) => void;
  getStatusBadgeVariant: (isActive: boolean) => 'default' | 'secondary' | 'destructive' | 'outline';
  formatDate: (dateString: string) => string;
}

export const EventCardWrapper: React.FC<EventCardWrapperProps> = ({
  event,
  selectedItems,
  onSelectItem,
  onEventUpdated,
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
        id={event.id}
        title={event.title}
        description={event.content.length > 150 ? event.content.substring(0, 150) + '...' : event.content}
        imageUrl={event.imageUrl}
        imageAlt={event.imageAlt}
        isActive={event.isActive}
        isFeatured={event.isFeatured}
        createdAt={event.createdAt}
        creator={event.creator}
        type="event"
        selectedItems={selectedItems}
        onSelectItem={onSelectItem}
        getStatusBadgeVariant={getStatusBadgeVariant}
        formatDate={formatDate}
        onEdit={() => editDialogRef.current?.click()}
        onToggleStatus={() => statusDialogRef.current?.click()}
        onDelete={() => deleteDialogRef.current?.click()}
      />
      
      {/* Diálogos ocultos */}
      <EditEventForm
        event={event}
        onEventUpdated={onEventUpdated}
      >
        <button ref={editDialogRef} style={{ display: 'none' }} />
      </EditEventForm>
      
      <ToggleEventStatusDialog
        event={event}
        onStatusChanged={onStatusChanged}
      >
        <button ref={statusDialogRef} style={{ display: 'none' }} />
      </ToggleEventStatusDialog>
      
      <DeleteEventDialog
        event={event}
        onEventDeleted={onDelete}
      >
        <button ref={deleteDialogRef} style={{ display: 'none' }} />
      </DeleteEventDialog>
    </>
  );
};
