'use client'

import React, { useRef } from 'react';
import { UnifiedCard } from '@/components/admin/unified-card';
import { EditNewsForm } from '@/components/admin/edit-news-form';
import { ToggleNewsStatusDialog } from '@/components/admin/toggle-news-status-dialog';
import { DeleteNewsDialog } from '@/components/admin/delete-news-dialog';

interface NewsItem {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  imageAlt?: string;
  category: 'NOTICIAS' | 'FUNDRAISING' | 'COMPAÑIA' | 'SIN_CATEGORIA';
  isActive: boolean;
  isFeatured: boolean;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  author?: {
    name?: string;
    email: string;
  };
  programa?: {
    id: string;
    sectorName: string;
  };
  project?: {
    id: string;
    title: string;
  };
  methodology?: {
    id: string;
    title: string;
  };
}

interface NewsCardWrapperProps {
  news: NewsItem;
  selectedItems: string[];
  onSelectItem: (id: string) => void;
  onNewsUpdated: (news: NewsItem) => void;
  onStatusChanged: (newsId: string, newStatus: boolean) => void;
  onDelete: (newsId: string) => void;
  getStatusBadgeVariant: (isActive: boolean) => 'default' | 'secondary' | 'destructive' | 'outline';
  formatDate: (dateString: string) => string;
}

const categoryLabels = {
  NOTICIAS: 'Noticias',
  FUNDRAISING: 'Fundraising',
  COMPAÑIA: 'Compañía',
  SIN_CATEGORIA: 'Sin Categoría'
};

const categoryColors = {
  NOTICIAS: 'bg-green-100 text-green-800 dark:bg-green-200 dark:text-green-900',
  FUNDRAISING: 'bg-blue-100 text-blue-800 dark:bg-blue-200 dark:text-blue-900',
  COMPAÑIA: 'bg-purple-100 text-purple-800 dark:bg-purple-200 dark:text-purple-900',
  SIN_CATEGORIA: 'bg-gray-100 text-gray-800 dark:bg-gray-200 dark:text-gray-900'
};

export const NewsCardWrapper: React.FC<NewsCardWrapperProps> = ({
  news,
  selectedItems,
  onSelectItem,
  onNewsUpdated,
  onStatusChanged,
  onDelete,
  getStatusBadgeVariant,
  formatDate
}) => {
  const editDialogRef = useRef<HTMLButtonElement>(null);
  const statusDialogRef = useRef<HTMLButtonElement>(null);
  const deleteDialogRef = useRef<HTMLButtonElement>(null);

  const relations = [];
  if (news.programa) {
    relations.push({
      type: 'programa',
      label: news.programa.sectorName
    });
  }
  if (news.project) {
    relations.push({
      type: 'project',
      label: news.project.title
    });
  }
  if (news.methodology) {
    relations.push({
      type: 'methodology',
      label: news.methodology.title
    });
  }

  return (
    <>
      <UnifiedCard
        id={news.id}
        title={news.title}
        description={news.content.length > 150 ? news.content.substring(0, 150) + '...' : news.content}
        imageUrl={news.imageUrl}
        imageAlt={news.imageAlt}
        isActive={news.isActive}
        isFeatured={news.isFeatured}
        createdAt={news.createdAt}
        creator={news.author}
        category={news.category}
        categoryLabel={categoryLabels[news.category]}
        categoryColor={categoryColors[news.category]}
        type="news"
        selectedItems={selectedItems}
        onSelectItem={onSelectItem}
        getStatusBadgeVariant={getStatusBadgeVariant}
        formatDate={formatDate}
        relations={relations}
        onEdit={() => editDialogRef.current?.click()}
        onToggleStatus={() => statusDialogRef.current?.click()}
        onDelete={() => deleteDialogRef.current?.click()}
      />
      
      {/* Diálogos ocultos */}
      <EditNewsForm
        news={news}
        onNewsUpdated={onNewsUpdated}
      >
        <button ref={editDialogRef} style={{ display: 'none' }} />
      </EditNewsForm>
      
      <ToggleNewsStatusDialog
        news={news}
        onStatusChanged={onStatusChanged}
      >
        <button ref={statusDialogRef} style={{ display: 'none' }} />
      </ToggleNewsStatusDialog>
      
      <DeleteNewsDialog
        news={news}
        onNewsDeleted={onDelete}
      >
        <button ref={deleteDialogRef} style={{ display: 'none' }} />
      </DeleteNewsDialog>
    </>
  );
};

