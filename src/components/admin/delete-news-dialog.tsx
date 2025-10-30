'use client'

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { useSession } from 'next-auth/react';

interface DeleteNewsDialogProps {
  news: {
    id: string;
    title: string;
    content: string;
  };
  onNewsDeleted: (newsId: string) => void;
  children: React.ReactNode;
}

export function DeleteNewsDialog({ news, onNewsDeleted, children }: DeleteNewsDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { data: session } = useSession();

  const handleDelete = async () => {
    try {
      setLoading(true);
      
      console.log('🗑️ Eliminando noticia:', {
        newsId: news.id,
        newsTitle: news.title,
        sessionExists: !!session,
        customTokenExists: !!session?.customToken
      });

      const response = await fetch(`/api/news/${news.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.customToken}`,
        },
      });

      console.log('📡 Respuesta del servidor:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error || `Error ${response.status}: ${response.statusText}`;
        console.error('❌ Error del servidor:', errorMessage);
        throw new Error(errorMessage);
      }

      console.log('✅ Noticia eliminada exitosamente');

      // Llamar callback para actualizar el estado local
      onNewsDeleted(news.id);

      toast({
        title: "Noticia eliminada exitosamente",
        description: `"${news.title}" ha sido eliminada permanentemente.`,
      });

      setOpen(false);
    } catch (error) {
      console.error('❌ Error en handleDelete:', error);
      toast({
        title: "Error al eliminar noticia",
        description: error instanceof Error ? error.message : "Hubo un problema al eliminar la noticia.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Eliminar Noticia</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <p className="text-sm text-gray-600">
            ¿Estás seguro de que quieres eliminar la noticia 
            <strong> "{news.title}"</strong>?
          </p>
          <p className="text-sm text-red-600 mt-2 font-medium">
            Esta acción no se puede deshacer.
          </p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={loading}>
            {loading ? 'Eliminando...' : 'Eliminar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
