import { AuthTestComponent } from '@/components/auth/auth-test';

export default function AuthTestPage() {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark p-8">
      <div className="container mx-auto max-w-2xl">
        <h1 className="text-3xl font-bold mb-8 text-center font-condensed">
          Prueba de Autenticación
        </h1>
        
        <div className="space-y-6">
          <AuthTestComponent />
          
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <h3 className="font-bold mb-2">Información de Debug:</h3>
            <ul className="text-sm space-y-1">
              <li>• Esta página prueba la funcionalidad de NextAuth</li>
              <li>• Si ves "Cargando sesión..." indefinidamente, hay un problema con la API</li>
              <li>• Si puedes iniciar sesión, la configuración está correcta</li>
              <li>• Revisa la consola del navegador para errores adicionales</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
