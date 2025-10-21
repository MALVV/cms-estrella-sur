'use client'

import React, { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Star, StarOff } from 'lucide-react'
import { toast } from 'sonner'

interface Ally {
  id: string;
  name: string;
  role: string;
  description?: string;
  imageUrl: string;
  imageAlt: string;
  status: 'ACTIVE' | 'INACTIVE';
  isFeatured?: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  author?: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

interface ToggleAllyFeaturedDialogProps {
  ally: Ally
  onSuccess: () => void
  children: React.ReactNode
}

export function ToggleAllyFeaturedDialog({ ally, onSuccess, children }: ToggleAllyFeaturedDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleToggle = async () => {
    try {
      setLoading(true)

      const response = await fetch(`/api/allies/${ally.id}/toggle-featured`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isFeatured: !ally.isFeatured }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al cambiar el estado destacado del aliado')
      }

      if (onSuccess) {
        onSuccess()
      }

      toast.success(`El aliado '${ally.name}' ha sido ${!ally.isFeatured ? 'destacado' : 'removido de destacados'}.`)

      setOpen(false)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Hubo un problema al cambiar el estado destacado del aliado.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {ally.isFeatured ? (
              <>
                <StarOff className="h-5 w-5 text-yellow-500" />
                Remover de Destacados
              </>
            ) : (
              <>
                <Star className="h-5 w-5 text-yellow-500" />
                Destacar Aliado
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {ally.isFeatured 
              ? `¿Estás seguro de que quieres remover '${ally.name}' de los aliados destacados?`
              : `¿Estás seguro de que quieres destacar '${ally.name}'? Este aliado aparecerá en la sección de destacados.`
            }
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleToggle}
            disabled={loading}
            className={ally.isFeatured ? "bg-gray-600 hover:bg-gray-700" : "bg-yellow-600 hover:bg-yellow-700"}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Procesando...
              </>
            ) : (
              <>
                {ally.isFeatured ? (
                  <>
                    <StarOff className="h-4 w-4 mr-2" />
                    Remover de Destacados
                  </>
                ) : (
                  <>
                    <Star className="h-4 w-4 mr-2" />
                    Destacar Aliado
                  </>
                )}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
