"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog'
import { toast } from 'sonner'
import { CheckCircle, XCircle, Trash2 } from 'lucide-react'

interface Donation {
  id: string
  donorName: string
  amount: number
  donationProject?: {
    title: string
  }
}

interface ConfirmDonationActionDialogProps {
  donation: Donation
  action: 'approve' | 'reject' | 'delete' | 'unapprove'
  onActionConfirmed: (donationId: string) => void
  children: React.ReactNode
}

export function ConfirmDonationActionDialog({ 
  donation, 
  action, 
  onActionConfirmed, 
  children 
}: ConfirmDonationActionDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [bankTransferImageUrl, setBankTransferImageUrl] = useState<string>('')

  const isApprove = action === 'approve'
  const isDelete = action === 'delete'
  const isUnapprove = action === 'unapprove'
  const actionText = isApprove ? 'aprobar' : (isDelete ? 'eliminar' : (isUnapprove ? 'desaprobar' : 'rechazar'))
  const actionTextCapitalized = isApprove ? 'Aprobar' : (isDelete ? 'Eliminar' : (isUnapprove ? 'Desaprobar' : 'Rechazar'))
  const actionColor = isApprove ? 'text-green-600' : 'text-red-600'
  const actionBgColor = isApprove ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'

  const handleConfirm = async () => {
    try {
      setLoading(true)
      
      if (isApprove) {
        // Para aprobación, hacer la llamada con URL
        const response = await fetch(`/api/donations/${donation.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            donationId: donation.id,
            status: 'APPROVED',
            bankTransferImage: bankTransferImageUrl || null,
            bankTransferImageAlt: bankTransferImageUrl ? 'Comprobante de transferencia' : null
          })
        });

        if (response.ok) {
          toast.success('Donación aprobada exitosamente');
          onActionConfirmed(donation.id);
          setOpen(false);
          setBankTransferImageUrl('');
        } else {
          const error = await response.json();
          toast.error(error.error || 'Error al aprobar donación');
        }
      } else if (isDelete) {
        // Para eliminación, usar DELETE
        const response = await fetch(`/api/donations/${donation.id}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          toast.success('Donación eliminada exitosamente');
          onActionConfirmed(donation.id);
          setOpen(false);
        } else {
          const error = await response.json();
          toast.error(error.error || 'Error al eliminar donación');
        }
      } else if (isUnapprove) {
        // Para desaprobación, cambiar a PENDING
        const response = await fetch(`/api/donations/${donation.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            donationId: donation.id,
            status: 'PENDING'
          })
        });

        if (response.ok) {
          toast.success('Donación desaprobada exitosamente');
          onActionConfirmed(donation.id);
          setOpen(false);
        } else {
          const error = await response.json();
          toast.error(error.error || 'Error al desaprobar donación');
        }
      } else {
        // Para rechazo, usar la función original
        onActionConfirmed(donation.id)
        setOpen(false)
      }
    } catch (error) {
      toast.error("Error al procesar la acción", {
        description: "Hubo un problema al procesar la solicitud.",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isApprove ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : isDelete ? (
              <Trash2 className="h-5 w-5 text-red-600" />
            ) : isUnapprove ? (
              <XCircle className="h-5 w-5 text-orange-600" />
            ) : (
              <XCircle className="h-5 w-5 text-red-600" />
            )}
            {actionTextCapitalized} Donación
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            ¿Estás seguro de que quieres {actionText} la donación de{' '}
            <strong className="text-gray-900 dark:text-white">"{donation.donorName}"</strong>?
          </p>
          {donation.donationProject && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Proyecto: <strong>"{donation.donationProject.title}"</strong>
            </p>
          )}
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Monto: <strong>Bs. {donation.amount.toLocaleString('es-BO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
          </p>
          
          {isApprove && (
            <div className="mt-4 space-y-2">
              <Label htmlFor="bankTransferImageUrl">URL del comprobante de transferencia *</Label>
              <Input
                id="bankTransferImageUrl"
                type="url"
                placeholder="https://ejemplo.com/comprobante.jpg"
                value={bankTransferImageUrl}
                onChange={(e) => setBankTransferImageUrl(e.target.value)}
                required
              />
              <p className="text-xs text-gray-500">
                Ingresa la URL de la imagen del comprobante de transferencia bancaria
              </p>
            </div>
          )}
          
          {isApprove ? (
            <p className="text-sm text-green-600 dark:text-green-400 mt-2">
              La donación será marcada como aprobada y se sumará al total recaudado.
            </p>
          ) : isDelete ? (
            <p className="text-sm text-red-600 dark:text-red-400 mt-2">
              <strong>ATENCIÓN:</strong> Esta acción no se puede deshacer. La donación será eliminada permanentemente del sistema. Si la donación está aprobada y está asociada a un proyecto, el monto será revertido.
            </p>
          ) : isUnapprove ? (
            <p className="text-sm text-orange-600 dark:text-orange-400 mt-2">
              La donación será marcada como pendiente. El monto será revertido del total recaudado y del proyecto asociado.
            </p>
          ) : (
            <p className="text-sm text-red-600 dark:text-red-400 mt-2">
              La donación será marcada como rechazada y no se sumará al total recaudado.
            </p>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => {
            setOpen(false);
            setBankTransferImageUrl('');
          }} disabled={loading}>
            Cancelar
          </Button>
          <Button 
            className={isDelete ? 'bg-red-600 hover:bg-red-700 text-white' : isUnapprove ? 'bg-orange-600 hover:bg-orange-700 text-white' : `${actionBgColor} text-white`}
            onClick={handleConfirm}
            disabled={loading || (isApprove && !bankTransferImageUrl.trim())}
          >
            {loading ? 'Procesando...' : actionTextCapitalized}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
