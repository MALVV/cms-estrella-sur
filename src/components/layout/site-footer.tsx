'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Heart, Mail, Users, MessageCircle } from 'lucide-react';

export function SiteFooter() {
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);

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
              <Button size="sm" variant="outline" className="border-white text-primary hover:bg-primary hover:text-primary-foreground" asChild>
                <Link href="/donar">
                  <Heart className="h-4 w-4 mr-2" />
                  Donar
                </Link>
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
              <Link href="/recursos" className="block text-gray-300 hover:text-white transition-colors">
                Recursos
              </Link>
              <Link href="/noticias" className="block text-gray-300 hover:text-white transition-colors">
                Blog
              </Link>
              <Link href="/transparencia" className="block text-gray-300 hover:text-white transition-colors">
                Transparencia
              </Link>
            </div>
          </div>

          {/* Impacto destacado */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Nuestro Impacto</h4>
            <div className="space-y-2">
              <Link href="/programas" className="block text-gray-300 hover:text-white transition-colors">
                Programas
              </Link>
              <Link href="/proyectos" className="block text-gray-300 hover:text-white transition-colors">
                Proyectos
              </Link>
              <Link href="/iniciativas" className="block text-gray-300 hover:text-white transition-colors">
                Iniciativas
              </Link>
            </div>
          </div>

          {/* Información de contacto */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Contacto</h4>
            <div className="space-y-2 text-gray-300 text-sm">
              <p className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                contacto@estrelladelsurbolivia.org
              </p>
            </div>
            <div className="space-y-2">
              <Link href="/contacto" className="block text-gray-300 hover:text-white transition-colors">
                <MessageCircle className="inline h-4 w-4 mr-2" />
                Escríbenos
              </Link>
              <Link href="/convocatorias" className="block text-gray-300 hover:text-white transition-colors">
                <Users className="inline h-4 w-4 mr-2" />
                Únete a nuestro equipo
              </Link>
            </div>
          </div>
        </div>

        {/* Línea divisoria y copyright */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 Estrella del Sur. Todos los derechos reservados.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <button
                onClick={() => setPrivacyOpen(true)}
                className="text-gray-400 hover:text-white text-sm transition-colors cursor-pointer"
              >
                Política de Privacidad
              </button>
              <button
                onClick={() => setTermsOpen(true)}
                className="text-gray-400 hover:text-white text-sm transition-colors cursor-pointer"
              >
                Términos de Uso
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Política de Privacidad */}
      <Dialog open={privacyOpen} onOpenChange={setPrivacyOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Política de Privacidad</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-gray-700 dark:text-gray-300">
            <p className="text-sm leading-relaxed">
              Toda la información que comparte la Organización Estrella del Sur se rige a las políticas de protección Infantil y Salvaguarda por lo que nos reservamos el derecho de preservar la identidad de los niños, niñas, adolescentes y sus familias que aparecen en nuestro contenido, salvo acuerdo parental. Las imágenes de las actividades son con fines institucionales, educativos y de difusión social.
            </p>
            
            <p className="text-sm leading-relaxed">
              El usuario que acceda al contenido del sitio Web y pueda compartir información cuando el sitio le solicite, valora la privacidad y seguridad de los datos personales de los participantes, miembros, donantes, voluntarios y personal de la organización, por lo que la información solicitada será estrictamente de uso de la organización evitando la divulgación por otros medios conforme a la ley N° 164 de Telecomunicaciones y Tecnología, información y Comunicación. De esta manera, posteriormente los datos podrán ser eliminados de los usuarios o convertirlos en anónimos de manera segura en los sistemas de almacenamiento de la organización. La organización no vende la información de los usuarios que acceden al sitio.
            </p>

            <p className="text-sm leading-relaxed">
              La Organización aplica medidas técnicas, administrativas y organizativas para proteger datos personales contra pérdida, acceso no autorizado, alteración o divulgación; eso incluye el uso de contraseñas seguras, acceso restringido, copias de seguridad y protocolos de confidencialidad del personal de la organización.
            </p>

            <p className="text-sm leading-relaxed">
              La Organización podrá actualizar las políticas en cualquier momento, las que serán publicadas por este sitio y los canales de comunicación oficiales, teniendo vigencia desde su publicación.
            </p>

            <p className="text-sm leading-relaxed">
              La Organización no garantiza la disponibilidad continua del sitio ni la ausencia de errores técnicos, tampoco será responsable por daños directos o indirectos que pudieran derivarse del uso del sitio o de la información contenida.
            </p>

            <p className="text-sm leading-relaxed">
              El uso del sitio Web se realiza bajo responsabilidad exclusiva del usuario.
            </p>

            <p className="text-sm leading-relaxed font-semibold">
              Para consultas: <a href="mailto:contacto@estrelladelsurbolivia.org" className="text-primary hover:underline">contacto@estrelladelsurbolivia.org</a>
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de Términos de Uso */}
      <Dialog open={termsOpen} onOpenChange={setTermsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Términos de Uso</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 text-gray-700 dark:text-gray-300">
            <p className="text-sm leading-relaxed">
              Al acceder o utilizar cualquiera de los servicios digitales del sitio web, el usuario acepta los términos de uso de estos servicios en su totalidad.
            </p>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">INFORMACIÓN GENERAL</h3>
              <p className="text-sm leading-relaxed">
                El sitio web de la organización tiene como propósito: Informar sobre los proyectos, programas y actividades de la organización, permite facilitar la participación y visualización de las mismas a voluntarios, participantes y donantes. Tiene por objetivo la transparencia institucional y la difusión de materiales educativos, sociales y/o culturales.
              </p>

              <p className="text-sm leading-relaxed font-semibold">
                El uso de la información del sitio web debe realizarse únicamente con fines lícitos, éticos y relacionados con las actividades de la organización; por tal sentido, el usuario que accede al sitio web se compromete a:
              </p>

              <ul className="list-disc list-inside space-y-2 text-sm leading-relaxed ml-4">
                <li>Utilizar el sitio, información y contenidos conforme a la ley, moral y orden público.</li>
                <li>No emplear el sitio para difundir información falsa, ofensiva o contraria a derechos de terceros.</li>
                <li>Queda prohibido el uso que vulnere las políticas de protección infantil de las Niñas, niños y adolescentes, sus familias y la comunidad.</li>
                <li>No se permite el uso de la información del sitio web para fines comerciales.</li>
                <li>Respetar los derechos de propiedad intelectual de la organización y de terceros conforme a la Ley de Derechos de Autor N° 1322.</li>
              </ul>

              <p className="text-sm leading-relaxed">
                El incumplimiento a estas condiciones puede dar lugar a la suspensión o restricción del acceso del usuario o las acciones legales que la organización considere necesario en caso de vulneración de la ley vigente.
              </p>

              <p className="text-sm leading-relaxed">
                En caso de que los usuarios en plataformas pudieran expresar su comentario, mensajes o material de contenido audiovisual en el sitio web o en redes sociales de la organización, se comprometen a que ese contenido no debe infringir derechos de autor, marca o privacidad de terceros; no debe contener lenguaje ofensivo, discriminatorio ni violento. La organización se reserva el derecho de eliminar cualquier tipo de contenido que incumpla estas normas.
              </p>

              <p className="text-sm leading-relaxed">
                Todos los contenidos del sitio: textos, logotipos, imágenes, videos, documentos software, artes gráficas, son propiedad exclusiva de la Organización Estrella del Sur y están protegidos por la Ley de Derechos de Autor N° 1322.
              </p>

              <p className="text-sm leading-relaxed">
                Queda prohibida la reproducción, distribución o modificación del contenido sin autorización previa o por escrito de la Organización.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">INFORMACIÓN DE DONANTES</h3>
              <p className="text-sm leading-relaxed">
                El sitio permite realizar donaciones a la Organización, el usuario acepta que podrá ser parte de esta liberalidad de manera voluntaria, la información será de uso exclusivo de la organización no divulgando los datos ni la información del donante salvo autorización expresa.
              </p>

              <p className="text-sm leading-relaxed">
                El donante debe suscribir un acuerdo previo con la organización para la donación, debiendo aclarar el origen de los fondos cuyo origen no debe ser de alguna actividad ilícita, debiendo registrar en los registros contables todo ingreso producto de donaciones individuales y/o empresariales.
              </p>

              <p className="text-sm leading-relaxed">
                La organización no publicará la información de los donantes, conforme a las normas de privacidad.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </footer>
  );
}
