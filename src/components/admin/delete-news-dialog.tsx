'use client'

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertTriangle, Trash2 } from 'lucide-react';
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
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Eliminar Noticia
          </DialogTitle>
          <DialogDescription>
            ¿Estás seguro de que quieres eliminar permanentemente la noticia <strong>"{news.title}"</strong>?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-3">
              <Trash2 className="h-8 w-8 text-red-500" />
              <div>
                <p className="font-medium text-red-900">{news.title}</p>
                <p className="text-sm text-red-700 line-clamp-2">{news.content}</p>
              </div>
            </div>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-800">
              <strong>Advertencia:</strong> Esta acción no se puede deshacer. La noticia será eliminada permanentemente del sistema.
            </p>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleDelete}
              disabled={loading}
              variant="destructive"
            >
              {loading ? 'Eliminando...' : 'Eliminar Permanentemente'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
