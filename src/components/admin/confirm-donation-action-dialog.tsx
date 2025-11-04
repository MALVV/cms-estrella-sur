"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog'
import { useToast } from '@/components/ui/use-toast'
import { CheckCircle, XCircle, Trash2, Upload, ImageIcon } from 'lucide-react'
import Image from 'next/image'

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
  const [uploading, setUploading] = useState(false)
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null)
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>('')
  const { toast } = useToast()

  const isApprove = action === 'approve'
  const isDelete = action === 'delete'
  const isUnapprove = action === 'unapprove'
  const actionText = isApprove ? 'aprobar' : (isDelete ? 'eliminar' : (isUnapprove ? 'desaprobar' : 'rechazar'))
  const actionTextCapitalized = isApprove ? 'Aprobar' : (isDelete ? 'Eliminar' : (isUnapprove ? 'Desaprobar' : 'Rechazar'))
  const actionColor = isApprove ? 'text-green-600' : 'text-red-600'
  const actionBgColor = isApprove ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'

  const handleFileUpload = async (file: File) => {
    try {
      const maxMb = Number(process.env.NEXT_PUBLIC_MAX_UPLOAD_MB || process.env.MAX_UPLOAD_MB || 20);
      const maxBytes = maxMb * 1024 * 1024;
      const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

      if (!allowed.includes(file.type)) {
        throw new Error('Formato no permitido. Usa JPG, PNG, WEBP o GIF');
      }
      if (file.size > maxBytes) {
        throw new Error(`El archivo es demasiado grande. Máximo ${maxMb}MB`);
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
      setSelectedImageFile(file);
      toast({
        title: 'Comprobante seleccionado',
        description: 'El comprobante se subirá al bucket al aprobar la donación',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Error al procesar la imagen',
        variant: 'destructive',
      });
    }
  };

  const handleConfirm = async () => {
    try {
      setLoading(true)
      
      if (isApprove) {
        let finalBankTransferImageUrl = '';
        let finalBankTransferImageAlt = 'Comprobante de transferencia';

        // Si hay una imagen seleccionada, subirla al bucket primero
        if (selectedImageFile) {
          setUploading(true);
          try {
            const formDataToUpload = new FormData();
            formDataToUpload.append('file', selectedImageFile);

            const uploadResponse = await fetch('/api/donations/upload-proof', {
              method: 'POST',
              body: formDataToUpload,
            });

            if (!uploadResponse.ok) {
              const error = await uploadResponse.json();
              throw new Error(error.error || 'Error al subir comprobante');
            }

            const uploadData = await uploadResponse.json();
            finalBankTransferImageUrl = uploadData.url;
            finalBankTransferImageAlt = uploadData.alt || selectedImageFile.name;
          } catch (error) {
            console.error('Error uploading proof:', error);
            toast({
              title: 'Error',
              description: error instanceof Error ? error.message : 'Error al subir el comprobante',
              variant: 'destructive',
            });
            setUploading(false);
            setLoading(false);
            return;
          } finally {
            setUploading(false);
          }
        } else {
          toast({
            title: 'Error',
            description: 'Debes subir un comprobante para aprobar la donación',
            variant: 'destructive',
          });
          setLoading(false);
          return;
        }

        // Para aprobación, hacer la llamada con URL
        const response = await fetch(`/api/donations/${donation.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            donationId: donation.id,
            status: 'APPROVED',
            bankTransferImage: finalBankTransferImageUrl,
            bankTransferImageAlt: finalBankTransferImageAlt
          })
        });

        if (response.ok) {
          toast({
            title: 'Éxito',
            description: 'Donación aprobada exitosamente',
          });
          onActionConfirmed(donation.id);
          setOpen(false);
          setSelectedImageFile(null);
          setImagePreviewUrl('');
        } else {
          const error = await response.json();
          toast({
            title: 'Error',
            description: error.error || 'Error al aprobar donación',
            variant: 'destructive',
          });
        }
      } else if (isDelete) {
        // Para eliminación, usar DELETE
        const response = await fetch(`/api/donations/${donation.id}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          toast({
            title: 'Éxito',
            description: 'Donación eliminada exitosamente',
          });
          onActionConfirmed(donation.id);
          setOpen(false);
        } else {
          const error = await response.json();
          toast({
            title: 'Error',
            description: error.error || 'Error al eliminar donación',
            variant: 'destructive',
          });
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
          toast({
            title: 'Éxito',
            description: 'Donación desaprobada exitosamente',
          });
          onActionConfirmed(donation.id);
          setOpen(false);
        } else {
          const error = await response.json();
          toast({
            title: 'Error',
            description: error.error || 'Error al desaprobar donación',
            variant: 'destructive',
          });
        }
      } else {
        // Para rechazo, usar la función original
        onActionConfirmed(donation.id)
        setOpen(false)
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Hubo un problema al procesar la solicitud',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
      setUploading(false);
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
            <div className="mt-4 space-y-4">
              <div>
                <Label>Comprobante de Transferencia *</Label>
                {!imagePreviewUrl ? (
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-primary transition-colors mt-2 w-full min-w-0">
                    <ImageIcon className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                    <div className="mt-4">
                      <label htmlFor="proof-file-input" className="cursor-pointer">
                        <span className="mt-2 block text-base font-semibold text-gray-900 dark:text-gray-100 mb-1 underline">
                          {uploading ? 'Subiendo imagen...' : 'Haz clic para subir comprobante'}
                        </span>
                        <Input
                          id="proof-file-input"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload(file);
                          }}
                          disabled={uploading || loading}
                        />
                      </label>
                      <p className="mt-2 text-sm text-gray-500">
                        PNG, JPG, WEBP o GIF hasta {String(Number(process.env.NEXT_PUBLIC_MAX_UPLOAD_MB || process.env.MAX_UPLOAD_MB || 20))}MB
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 mt-2">
                    <div className="relative w-full h-64 border rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                      <Image
                        src={imagePreviewUrl}
                        alt="Comprobante de transferencia"
                        fill
                        className="object-cover"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => {
                          setSelectedImageFile(null);
                          setImagePreviewUrl('');
                          toast({
                            title: 'Comprobante eliminado',
                            description: 'El comprobante fue removido del formulario'
                          });
                        }}
                      >
                        Eliminar
                      </Button>
                    </div>
                    <label htmlFor="proof-file-input-replace" className="cursor-pointer">
                      <Button type="button" variant="outline" className="w-full" disabled={uploading || loading}>
                        <Upload className="mr-2 h-4 w-4" />
                        {uploading ? 'Subiendo...' : 'Cambiar comprobante'}
                      </Button>
                      <Input
                        id="proof-file-input-replace"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload(file);
                        }}
                        disabled={uploading || loading}
                      />
                    </label>
                  </div>
                )}
              </div>
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
            setSelectedImageFile(null);
            setImagePreviewUrl('');
          }} disabled={loading || uploading}>
            Cancelar
          </Button>
          <Button 
            className={isDelete ? 'bg-red-600 hover:bg-red-700 text-white' : isUnapprove ? 'bg-orange-600 hover:bg-orange-700 text-white' : `${actionBgColor} text-white`}
            onClick={handleConfirm}
            disabled={loading || uploading || (isApprove && !selectedImageFile)}
          >
            {loading || uploading ? 'Procesando...' : actionTextCapitalized}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
