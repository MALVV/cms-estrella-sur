'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export function AuthTestComponent() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <Card className="p-6 text-center">
        <div className="flex items-center justify-center">
          <span className="material-symbols-outlined animate-spin mr-2">refresh</span>
          Cargando sesión...
        </div>
      </Card>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <Card className="p-6 text-center">
        <h3 className="text-lg font-bold mb-4">No autenticado</h3>
        <Button onClick={() => signIn()}>
          Iniciar Sesión
        </Button>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-bold mb-4">Sesión Activa</h3>
      <div className="space-y-2 mb-4">
        <p><strong>Email:</strong> {session?.user?.email}</p>
        <p><strong>Nombre:</strong> {session?.user?.name || 'No especificado'}</p>
        <p><strong>Rol:</strong> {session?.user?.role || 'No especificado'}</p>
        <p><strong>ID:</strong> {session?.user?.id || 'No especificado'}</p>
      </div>
      <Button onClick={() => signOut()} variant="destructive">
        Cerrar Sesión
      </Button>
    </Card>
  );
}
