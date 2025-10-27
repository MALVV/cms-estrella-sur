'use client'

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Eye, FileImage } from 'lucide-react';
import Image from 'next/image';

interface ComprobanteViewerProps {
  bankTransferImage?: string;
  bankTransferImageAlt?: string;
  donorName: string;
  amount: number;
}

export function ComprobanteViewer({ 
  bankTransferImage, 
  bankTransferImageAlt, 
  donorName, 
  amount 
}: ComprobanteViewerProps) {
  if (!bankTransferImage) {
    return (
      <div className="flex items-center gap-2 text-gray-500 text-sm">
        <FileImage className="w-4 h-4" />
        <span>Sin comprobante</span>
      </div>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Eye className="w-4 h-4" />
          Ver Comprobante
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Comprobante de Pago</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Donante:</span>
                <p className="text-gray-600 dark:text-gray-400">{donorName}</p>
              </div>
              <div>
                <span className="font-medium">Monto:</span>
                <p className="text-gray-600 dark:text-gray-400">${amount.toLocaleString()}</p>
              </div>
            </div>
          </div>
          
          <div className="relative w-full h-96 bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden">
            <Image
              src={bankTransferImage}
              alt={bankTransferImageAlt || 'Comprobante de transferencia bancaria'}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          
          <div className="text-center">
            <Button asChild variant="outline">
              <a 
                href={bankTransferImage} 
                target="_blank" 
                rel="noopener noreferrer"
                className="gap-2"
              >
                <FileImage className="w-4 h-4" />
                Abrir en nueva pestaña
              </a>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
