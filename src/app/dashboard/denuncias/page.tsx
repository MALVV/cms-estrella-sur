'use client'

import { ComplaintsManagement } from '@/components/admin/complaints-management';

export default function DenunciasPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Canal de Denuncias
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Gestiona las denuncias recibidas desde el canal de salvaguarda
        </p>
      </div>

      <ComplaintsManagement />
    </div>
  );
}

