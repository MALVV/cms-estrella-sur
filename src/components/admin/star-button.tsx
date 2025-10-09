'use client'

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Star, StarOff } from 'lucide-react';
import { toast } from 'sonner';

interface StarButtonProps {
  isFeatured: boolean;
  onToggle: (isFeatured: boolean) => Promise<void>;
  itemName: string;
  size?: 'sm' | 'default' | 'lg';
  className?: string;
  disabled?: boolean;
}

export function StarButton({ 
  isFeatured, 
  onToggle, 
  itemName, 
  size = 'sm',
  className = '',
  disabled = false
}: StarButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async () => {
    if (disabled) {
      toast.error(`Límite de destacados alcanzado (3/3). Desmarca otro aliado destacado primero.`);
      return;
    }
    
    setIsLoading(true);
    try {
      await onToggle(!isFeatured);
      toast.success(
        `${itemName} ${!isFeatured ? 'destacado' : 'removido de destacados'} exitosamente`
      );
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      
      // Manejar específicamente el error de límite de destacados
      if (errorMessage.includes('más de 3 aliados destacados')) {
        toast.error(`Límite de destacados alcanzado (3/3). Desmarca otro aliado destacado primero.`);
      } else {
        toast.error(`Error al ${!isFeatured ? 'destacar' : 'remover'} ${itemName}: ${errorMessage}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size={size}
      onClick={handleToggle}
      disabled={isLoading || disabled}
      className={`h-8 w-8 p-0 ${className}`}
      title={
        disabled && !isFeatured 
          ? `Límite de destacados alcanzado (3/3)` 
          : isFeatured 
            ? `Remover ${itemName} de destacados` 
            : `Destacar ${itemName}`
      }
    >
      {isFeatured ? (
        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
      ) : (
        <StarOff className="h-4 w-4 text-gray-400 hover:text-yellow-400" />
      )}
    </Button>
  );
}
