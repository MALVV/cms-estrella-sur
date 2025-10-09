'use client'

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { useSession } from 'next-auth/react';
import { Eye, EyeOff } from 'lucide-react';

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
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { data: session } = useSession();

  const handleToggleStatus = async () => {
    try {
      setLoading(true);
      
      const response = await fetch(`/api/news/${news.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.customToken}`,
        },
        body: JSON.stringify({
          isActive: !news.isActive,
        }),
      });

      if (!response.ok) {
        throw new Error('Error al cambiar estado');
      }

      toast({
        title: 'Éxito',
        description: `Noticia ${!news.isActive ? 'activada' : 'desactivada'} exitosamente`,
      });

      setIsOpen(false);
      onStatusChanged(news.id, !news.isActive);
    } catch (error) {
      console.error('Error al cambiar estado:', error);
      toast({
        title: 'Error',
        description: 'Error al cambiar el estado de la noticia',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {news.isActive ? 'Desactivar Noticia' : 'Activar Noticia'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            ¿Estás seguro de que quieres {news.isActive ? 'desactivar' : 'activar'} la noticia 
            <strong> "{news.title}"</strong>?
          </p>
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleToggleStatus} 
              disabled={loading}
              variant={news.isActive ? 'destructive' : 'default'}
            >
              {loading ? 'Procesando...' : (news.isActive ? 'Desactivar' : 'Activar')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
