"use client"

import { useSession } from 'next-auth/react'
import { usePermissions } from '@/hooks/use-permissions'
import { useEffect, useState } from 'react'

export default function DebugPage() {
  const { data: session, status } = useSession()
  const { isAdmin } = usePermissions()
  const [cookies, setCookies] = useState<string>('')

  useEffect(() => {
    setCookies(document.cookie)
  }, [])

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold">Debug de Autenticación</h1>
      
      <div className="grid gap-4 md:grid-cols-2">
        {/* Estado de la sesión */}
        <div className="p-4 border rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Estado de la Sesión</h2>
          <div className="space-y-2 text-sm">
            <p><strong>Status:</strong> {status}</p>
            <p><strong>Session:</strong> {session ? 'Activa' : 'No activa'}</p>
            <p><strong>User ID:</strong> {session?.user?.id || 'No disponible'}</p>
            <p><strong>Email:</strong> {session?.user?.email || 'No disponible'}</p>
            <p><strong>Name:</strong> {session?.user?.name || 'No disponible'}</p>
            <p><strong>Role:</strong> {session?.user?.role || 'No disponible'}</p>
            <p><strong>Must Change Password:</strong> {session?.user?.mustChangePassword ? 'Sí' : 'No'}</p>
          </div>
        </div>

        {/* Permisos */}
        <div className="p-4 border rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Permisos</h2>
          <div className="space-y-2 text-sm">
            <p><strong>Es ADMINISTRATOR:</strong> {isAdmin() ? 'Sí' : 'No'}</p>
          </div>
        </div>

        {/* Cookies */}
        <div className="p-4 border rounded-lg md:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Cookies</h2>
          <div className="text-xs break-all">
            <pre className="whitespace-pre-wrap">{cookies}</pre>
          </div>
        </div>

        {/* Información completa de la sesión */}
        <div className="p-4 border rounded-lg md:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Información Completa de la Sesión</h2>
          <div className="text-xs">
            <pre className="whitespace-pre-wrap">{JSON.stringify(session, null, 2)}</pre>
          </div>
        </div>
      </div>

      {/* Enlaces de prueba */}
      <div className="p-4 border rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Enlaces de Prueba</h2>
        <div className="space-y-2">
          <a href="/dashboard" className="block text-blue-600 hover:text-blue-800">
            /dashboard
          </a>
          <a href="/dashboard/users" className="block text-blue-600 hover:text-blue-800">
            /dashboard/users
          </a>
        </div>
      </div>
    </div>
  )
}
