'use client'

import { ContactMessagesManagement } from '@/components/admin/contact-messages-management';

export default function MensajesContactoPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Mensajes de Contacto
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Gestiona los mensajes recibidos desde el formulario de contacto
        </p>
      </div>

      <ContactMessagesManagement />
    </div>
  );
}

