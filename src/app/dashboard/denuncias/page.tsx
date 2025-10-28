'use client'

import { ComplaintsManagement } from '@/components/admin/complaints-management';

export default function DenunciasPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Canal de Denuncias</h1>
        <p className="text-muted-foreground mt-2">
          Gestiona las denuncias recibidas desde el canal de salvaguarda
        </p>
      </div>

      <ComplaintsManagement />
    </div>
  );
}

