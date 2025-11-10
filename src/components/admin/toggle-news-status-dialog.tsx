'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface NewsItem {
  id: string;
  title: string;
  isActive: boolean;
}

interface ToggleNewsStatusDialogProps {
  news: NewsItem;
  onStatusChanged: (newsId: string, newStatus: boolean) => void;
  children: React.ReactNode;
}

export const ToggleNewsStatusDialog: React.FC<ToggleNewsStatusDialogProps> = ({ 
  news, 
  onStatusChanged, 
  children 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const isActivating = !news.isActive;
  const action = isActivating ? 'activar' : 'desactivar';
  const actionCapitalized = isActivating ? 'Activar' : 'Desactivar';

  const handleToggleStatus = async () => {
    setIsLoading(true);

    try {
      const response = await fetch(`/api/news/${news.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isActive: !news.isActive,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al cambiar estado de la noticia');
      }

      toast.success(`Noticia ${action} exitosamente`);
      setIsOpen(false);
      onStatusChanged(news.id, !news.isActive);
    } catch (error) {
      console.error('Error toggling news status:', error);
      toast.error(error instanceof Error ? error.message : 'Error al cambiar estado de la noticia');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{actionCapitalized} Noticia</DialogTitle>
          <DialogDescription>
            ¿Estás seguro de que quieres {action} la noticia "{news.title}"?
            {isActivating 
              ? ' La noticia será visible en la página pública.' 
              : ' La noticia ya no será visible en la página pública.'
            }
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isLoading}>
            Cancelar
          </Button>
          <Button 
            variant={isActivating ? "default" : "destructive"}
            onClick={handleToggleStatus}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Procesando...
              </>
            ) : (
              actionCapitalized
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
