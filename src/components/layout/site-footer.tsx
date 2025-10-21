import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Heart, Users, Target } from 'lucide-react';

export function SiteFooter() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Información de la organización */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Estrella del Sur</h3>
            <p className="text-gray-300 text-sm">
              Trabajamos para cambiar vidas y crear un futuro mejor para los niños y sus comunidades.
            </p>
            <div className="flex space-x-4">
              <Button size="sm" variant="outline" className="border-white text-primary hover:bg-primary hover:text-primary-foreground">
                <Heart className="h-4 w-4 mr-2" />
                Donar
              </Button>
            </div>
          </div>

          {/* Enlaces principales */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Navegación</h4>
            <div className="space-y-2">
              <Link href="/" className="block text-gray-300 hover:text-white transition-colors">
                Inicio
              </Link>
              <Link href="/nosotros" className="block text-gray-300 hover:text-white transition-colors">
                Nosotros
              </Link>
              <Link href="/impacto" className="block text-gray-300 hover:text-white transition-colors">
                Impacto
              </Link>
              <Link href="/historias-impacto" className="block text-gray-300 hover:text-white transition-colors">
                Historias de Impacto
              </Link>
              <Link href="/participar" className="block text-gray-300 hover:text-white transition-colors">
                Participar
              </Link>
            </div>
          </div>

          {/* Impacto destacado */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Nuestro Impacto</h4>
            <div className="space-y-2">
              <Link href="/impacto" className="block text-gray-300 hover:text-white transition-colors">
                <Target className="inline h-4 w-4 mr-2" />
                Educación Infantil
              </Link>
              <Link href="/impacto" className="block text-gray-300 hover:text-white transition-colors">
                <Users className="inline h-4 w-4 mr-2" />
                Salud Comunitaria
              </Link>
              <Link href="/impacto" className="block text-gray-300 hover:text-white transition-colors">
                <Heart className="inline h-4 w-4 mr-2" />
                Protección Infantil
              </Link>
              <Link href="/impacto" className="block text-gray-300 hover:text-white transition-colors">
                <ArrowRight className="inline h-4 w-4 mr-2" />
                Ver Todo el Impacto
              </Link>
            </div>
          </div>

          {/* Información de contacto */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Contacto</h4>
            <div className="space-y-2 text-gray-300 text-sm">
              <p>📧 info@estrelladelsur.org</p>
              <p>📞 +1 (555) 123-4567</p>
              <p>📍 Ciudad, País</p>
            </div>
            <div className="space-y-2">
              <Link href="/transparencia" className="block text-gray-300 hover:text-white transition-colors">
                Transparencia
              </Link>
              <Link href="/recursos" className="block text-gray-300 hover:text-white transition-colors">
                Recursos
              </Link>
            </div>
          </div>
        </div>

        {/* Línea divisoria y copyright */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 Estrella del Sur. Todos los derechos reservados.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">
                Política de Privacidad
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">
                Términos de Uso
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
