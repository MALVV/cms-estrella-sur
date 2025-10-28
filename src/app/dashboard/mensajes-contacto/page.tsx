'use client'

import { ContactMessagesManagement } from '@/components/admin/contact-messages-management';

export default function MensajesContactoPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Mensajes de Contacto</h1>
        <p className="text-muted-foreground mt-2">
          Gestiona los mensajes recibidos desde el formulario de contacto
        </p>
      </div>

      <ContactMessagesManagement />
    </div>
  );
}

