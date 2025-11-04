'use client'

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Upload, Send, Users, Heart, Calendar, Clock, CheckCircle, XCircle, X, File, ImageIcon, Link as LinkIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { SiteHeader } from '@/components/layout/site-header';
import { SiteFooter } from '@/components/layout/site-footer';

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  age: string;
  occupation: string;
  areaOfInterest: string;
  availability: string;
  motivation: string;
  experience: string;
  documents: FileList | null;
  driveLink: string;
  acceptPolicies: boolean;
}

interface SelectedFile {
  file: File;
  previewUrl?: string;
  uploadUrl?: string;
}

const areasOfInterest = [
  {
    name: 'Educación y Desarrollo Infantil',
    description: 'Contribuye al desarrollo educativo de niños y niñas en comunidades vulnerables. Incluye apoyo escolar, actividades recreativas, desarrollo de habilidades y acompañamiento pedagógico.',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Salud Comunitaria',
    description: 'Participa en programas de promoción de la salud, prevención de enfermedades y atención básica en comunidades rurales y urbanas. Incluye campañas de salud, educación sanitaria y apoyo en centros de salud.',
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Desarrollo Rural y Medio Ambiente',
    description: 'Colabora en proyectos de desarrollo sostenible, conservación ambiental, agricultura familiar y fortalecimiento comunitario. Incluye reforestación, agricultura orgánica, gestión de recursos naturales y desarrollo de capacidades locales.',
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  }
];

const interventionAreas = [
  {
    name: 'Área de Patrocinio',
    description: 'Fortalece la conexión con beneficiarios y optimiza procesos internos.',
    careers: ['Secretariado', 'Sociología', 'Ingeniería de Sistemas'],
    activities: [
      'Digitalización y archivo de documentos',
      'Simplificación de procesos manuales',
      'Gestión de información en sistemas digitales'
    ],
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Protección Infantil',
    description: 'Garantizar que niños y adolescentes vivan libres de violencia y negligencia.',
    careers: ['Psicología', 'Sociología', 'Pedagogía'],
    activities: [
      'Facilitar talleres de gestión emocional y resiliencia',
      'Elaborar material psicoeducativo adaptado',
      'Aplicar protocolos de salvaguarda',
      'Realizar diagnósticos socioeconómicos'
    ],
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Medios de Vida',
    description: 'Fortalecer capacidades económicas para generación de ingresos sostenibles.',
    careers: ['Economía', 'Administración', 'Ingeniería Comercial/Industrial'],
    activities: [
      'Diseñar proyectos de innovación social',
      'Elaborar planes de negocio',
      'Fortalecer educación financiera comunitaria',
      'Promover emprendimientos sostenibles'
    ],
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Sostenibilidad Ambiental',
    description: 'Promover el cuidado del entorno y hábitos responsables.',
    careers: ['Agronomía', 'Medio Ambiente'],
    activities: [
      'Diseñar campañas de educación ambiental',
      'Ejecutar actividades de conservación',
      'Desarrollar huertos y compostas',
      'Gestión ambiental y medios de vida sostenibles'
    ],
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Área de Tecnologías',
    description: 'Desarrollar soluciones tecnológicas que mejoren el impacto social de la organización.',
    careers: ['Ingeniería de Sistemas', 'Técnicos en Sistemas', 'Computacionales y ramas afines'],
    activities: [
      'Apoyar en el desarrollo de aplicaciones web y móviles propias de la Organización',
      'Colaborar en la actualización de sistemas de gestión de datos y reportes',
      'Brindar soporte técnico a equipos operativos',
      'Crear o sugerir nuevas herramientas digitales para optimizar procesos'
    ],
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Área de Comunicaciones',
    description: 'Visibilizar el impacto social y fortalecer la imagen institucional de la organización.',
    careers: ['Comunicación Social', 'Marketing', 'Periodismo', 'Diseño Gráfico'],
    activities: [
      'Crear contenido para redes sociales y sitio web',
      'Elaborar materiales gráficos y audiovisuales',
      'Gestionar campañas de comunicación interna y externa',
      'Redactar notas de prensa y reportes de impacto'
    ],
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  }
];

const availabilityOptions = [
  'Tiempo completo (40+ horas/semana)',
  'Tiempo parcial (20-40 horas/semana)',
  'Fines de semana',
  'Vacaciones de verano',
  'Vacaciones de invierno',
  'Flexible según proyecto'
];

export default function VoluntariadosPage() {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    age: '',
    occupation: '',
    areaOfInterest: '',
    availability: '',
    motivation: '',
    experience: '',
    documents: null,
    driveLink: '',
    acceptPolicies: false
  });
  const [selectedFiles, setSelectedFiles] = useState<SelectedFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successDialog, setSuccessDialog] = useState(false);
  const [errorDialog, setErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newFiles: SelectedFile[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const maxMb = Number(process.env.NEXT_PUBLIC_MAX_UPLOAD_MB || 100);
      const maxBytes = maxMb * 1024 * 1024;

      if (file.size > maxBytes) {
        setErrorMessage(`El archivo ${file.name} es demasiado grande. Máximo ${maxMb}MB`);
        setErrorDialog(true);
        continue;
      }

      newFiles.push({
        file,
        previewUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined
      });
    }

    setSelectedFiles(prev => [...prev, ...newFiles]);
    setFormData(prev => ({
      ...prev,
      documents: files
    }));
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => {
      const newFiles = [...prev];
      if (newFiles[index].previewUrl) {
        URL.revokeObjectURL(newFiles[index].previewUrl);
      }
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Si hay archivos seleccionados, subirlos primero
      const uploadedDocumentUrls: string[] = [];
      
      if (selectedFiles.length > 0) {
        setUploading(true);
        try {
          for (const selectedFile of selectedFiles) {
            const formDataToUpload = new FormData();
            formDataToUpload.append('file', selectedFile.file);

            const uploadResponse = await fetch('/api/public/volunteer-applications/upload-document', {
              method: 'POST',
              body: formDataToUpload,
            });

            if (!uploadResponse.ok) {
              const error = await uploadResponse.json();
              throw new Error(error.error || 'Error al subir documento');
            }

            const uploadData = await uploadResponse.json();
            uploadedDocumentUrls.push(uploadData.url);
          }
        } catch (error) {
          console.error('Error uploading documents:', error);
          setErrorMessage(error instanceof Error ? error.message : 'Error al subir documentos. Por favor intenta nuevamente');
          setErrorDialog(true);
          setUploading(false);
          setIsSubmitting(false);
          return;
        } finally {
          setUploading(false);
        }
      }

      // Determinar qué usar: documentos subidos o driveLink
      const finalDocuments = uploadedDocumentUrls.length > 0 
        ? uploadedDocumentUrls.join(',') 
        : null;

      const formDataToSend = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        age: formData.age,
        occupation: formData.occupation,
        areaOfInterest: formData.areaOfInterest,
        availability: formData.availability,
        motivation: formData.motivation,
        experience: formData.experience,
        driveLink: formData.driveLink || null,
        documents: finalDocuments,
        documentUrls: uploadedDocumentUrls.length > 0 ? uploadedDocumentUrls : undefined,
      };

      const response = await fetch('/api/public/volunteer-applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formDataToSend),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.error || 'Error al enviar la solicitud');
        setErrorDialog(true);
        setIsSubmitting(false);
        return;
      }

      // Mostrar popup de éxito
      setSuccessDialog(true);
      
      // Resetear formulario
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        age: '',
        occupation: '',
        areaOfInterest: '',
        availability: '',
        motivation: '',
        experience: '',
        documents: null,
        driveLink: '',
        acceptPolicies: false
      });
      // Limpiar previews de archivos
      selectedFiles.forEach(file => {
        if (file.previewUrl) {
          URL.revokeObjectURL(file.previewUrl);
        }
      });
      setSelectedFiles([]);
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrorMessage('Error al enviar la solicitud. Por favor intenta de nuevo.');
      setErrorDialog(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <SiteHeader />
      
      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center bg-hero">
        <div className="absolute inset-0 bg-black opacity-40 dark:opacity-60"></div>
        <main className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 flex justify-center">
          <div className="max-w-4xl text-white text-center">
            <div className="mb-6">
              <span className="inline-block bg-orange-400 text-gray-900 text-sm font-bold uppercase px-4 py-2 tracking-wider rounded">
                Voluntariado
              </span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-tight text-white mb-6">
              ÚNETE COMO<br/>
              VOLUNTARIO<br/>
              O PASANTE
            </h1>
            <p className="text-lg md:text-xl text-gray-200 max-w-3xl mx-auto mb-8">
              Forma parte de nuestro equipo de voluntarios y pasantes que contribuye al desarrollo social de Bolivia. 
              Tu tiempo y dedicación pueden marcar la diferencia en las vidas de muchas personas.
            </p>
          </div>
        </main>
      </div>

      <main className="container mx-auto px-4 py-8">

        {/* Áreas de Intervención */}
        <section className="py-6 bg-background-light dark:bg-background-dark">
          <div className="container mx-auto px-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <span className="inline-block bg-primary text-white text-xs font-semibold px-3 py-1 rounded mb-4">
                  ÁREAS DE INTERVENCIÓN
                </span>
                <h1 className="text-4xl md:text-5xl font-bold text-text-light dark:text-text-dark leading-tight">
                  DONDE PUEDES CONTRIBUIR
                </h1>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-300 text-lg">
                  Oportunidades específicas para estudiantes y profesionales en áreas técnicas que buscan aplicar sus conocimientos en proyectos de impacto social.
                </p>
              </div>
          </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {interventionAreas.map((area, index) => (
                <div key={index} className="bg-card-light dark:bg-card-dark p-8 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300">
                  <div className="space-y-6">
                    <div className="relative h-48 rounded-lg overflow-hidden">
                      <Image
                        src={area.image}
                        alt={area.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-bold text-xl text-text-light dark:text-text-dark mb-3">
                          {area.name}
                        </h3>
                        <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed text-sm">
                          {area.description}
                        </p>
                      </div>

                      <div>
                        <h4 className="font-semibold text-base text-text-light dark:text-text-dark mb-2">
                          Carreras Requeridas:
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {area.careers.map((career, careerIndex) => (
                            <span 
                              key={careerIndex}
                              className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium"
                            >
                              {career}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-base text-text-light dark:text-text-dark mb-2">
                          Actividades Principales:
                        </h4>
                        <ul className="space-y-1">
                          {area.activities.map((activity, activityIndex) => (
                            <li key={activityIndex} className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                              <span className="text-text-secondary-light dark:text-text-secondary-dark text-sm">
                                {activity}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
            ))}
            </div>
          </div>
        </section>

        {/* Beneficios y Acompañamiento */}
        <section className="py-6 bg-background-light dark:bg-background-dark">
          <div className="container mx-auto px-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <span className="inline-block bg-primary text-white text-xs font-semibold px-3 py-1 rounded mb-4">
                  BENEFICIOS Y ACOMPAÑAMIENTO
                </span>
                <h1 className="text-4xl md:text-5xl font-bold text-text-light dark:text-text-dark leading-tight">
                  QUÉ OBTIENES COMO VOLUNTARIO/PASANTE
                </h1>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-300 text-lg">
                  Te ofrecemos un programa integral de desarrollo y apoyo durante tu experiencia como voluntario, con beneficios únicos que potencian tu crecimiento personal y profesional.
                </p>
              </div>
            </div>
          
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-card-light dark:bg-card-dark p-8 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-orange-100 dark:bg-orange-900 mb-6">
                  <Users className="h-8 w-8 text-orange-500" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-text-light dark:text-text-dark">SUPERVISIÓN</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Supervisión especializada y acompañamiento continuo por parte de nuestro equipo de profesionales experimentados.
                </p>
              </div>
              
              <div className="bg-card-light dark:bg-card-dark p-8 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900 mb-6">
                  <Calendar className="h-8 w-8 text-green-500" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-text-light dark:text-text-dark">CAPACITACIÓN</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Inducción institucional y capacitación completa en salvaguarda y protocolos institucionales.
                </p>
              </div>
              
              <div className="bg-card-light dark:bg-card-dark p-8 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-900 mb-6">
                  <Heart className="h-8 w-8 text-blue-500" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-text-light dark:text-text-dark">FORMACIÓN</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Formación continua para tu desarrollo profesional y personal a través de talleres y experiencias prácticas.
                </p>
              </div>
              
              <div className="bg-card-light dark:bg-card-dark p-8 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-purple-100 dark:bg-purple-900 mb-6">
                  <Clock className="h-8 w-8 text-purple-500" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-text-light dark:text-text-dark">OPORTUNIDADES</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Oportunidades remuneradas en consultorías de campaña y proyectos especiales con compensación económica.
                </p>
              </div>
              
              <div className="bg-card-light dark:bg-card-dark p-8 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-red-100 dark:bg-red-900 mb-6">
                  <Users className="h-8 w-8 text-red-500" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-text-light dark:text-text-dark">COLABORACIÓN</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Ambiente colaborativo y de apoyo mutuo con trabajo en equipo y respeto constante.
                </p>
              </div>
              
              <div className="bg-card-light dark:bg-card-dark p-8 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 dark:bg-yellow-900 mb-6">
                  <Heart className="h-8 w-8 text-yellow-500" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-text-light dark:text-text-dark">CERTIFICACIÓN</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Certificación y carta de referencia oficial al finalizar tu período de voluntariado o pasantía.
                </p>
              </div>
            </div>

            {/* Duración y Horarios */}
            <div className="mt-16">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div>
                  <span className="inline-block bg-primary text-white text-xs font-semibold px-3 py-1 rounded mb-4">
                    COMPROMISO REQUERIDO
                  </span>
                  <h2 className="text-4xl md:text-5xl font-bold text-text-light dark:text-text-dark leading-tight">
                    DURACIÓN Y HORARIOS
                  </h2>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-300 text-lg">
                    Un compromiso mínimo que te permitirá desarrollar habilidades significativas mientras contribuyes al cambio social.
                  </p>
                </div>
              </div>

              <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-8">
                <div className="bg-card-light dark:bg-card-dark p-8 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 text-center">
                  <div className="flex items-center justify-center h-16 w-16 rounded-full bg-orange-100 dark:bg-orange-900 mb-6 mx-auto">
                    <Calendar className="h-8 w-8 text-orange-500" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-text-light dark:text-text-dark">6 MESES</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Compromiso mínimo de participación para desarrollar habilidades significativas.
                  </p>
                </div>
                
                <div className="bg-card-light dark:bg-card-dark p-8 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 text-center">
                  <div className="flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900 mb-6 mx-auto">
                    <Clock className="h-8 w-8 text-green-500" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-text-light dark:text-text-dark">20-30 HORAS</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Por semana de dedicación, flexible según tu disponibilidad y proyecto asignado.
                  </p>
                </div>
                
                <div className="bg-card-light dark:bg-card-dark p-8 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 text-center">
                  <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-900 mb-6 mx-auto">
                    <Users className="h-8 w-8 text-blue-500" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-text-light dark:text-text-dark">PRESENCIAL</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Trabajo presencial en Oruro para una experiencia directa con las comunidades.
                  </p>
                </div>
              </div>
            </div>

            {/* Ubicación */}
            <div className="mt-16">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div>
                  <span className="inline-block bg-primary text-white text-xs font-semibold px-3 py-1 rounded mb-4">
                    UBICACIÓN DE TRABAJO
                  </span>
                  <h2 className="text-4xl md:text-5xl font-bold text-text-light dark:text-text-dark leading-tight">
                    NOS ENCUENTRAS EN
                  </h2>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-300 text-lg">
                    Trabajamos en múltiples ubicaciones estratégicas de la ciudad para maximizar nuestro impacto y llegar a más comunidades.
                  </p>
                </div>
              </div>

              <div className="mt-8">
                <div className="bg-card-light dark:bg-card-dark p-8 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 text-center">
                  <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/20 mb-6 mx-auto">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-text-light dark:text-text-dark">
                    DISTINTAS ZONAS DE LA CIUDAD
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Ubicaciones estratégicas que nos permiten llegar a más comunidades y maximizar nuestro impacto social.
                  </p>
                  <Link href="/nosotros#mapa-interactivo" className="inline-flex items-center gap-3 px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors cursor-pointer">
                    <Users className="h-5 w-5" />
                    Ver mapa de intervención
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Formulario de Solicitud */}
        <section className="py-6 bg-background-light dark:bg-background-dark">
          <div className="container mx-auto px-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-8">
              <div>
                <span className="inline-block bg-primary text-white text-xs font-semibold px-3 py-1 rounded mb-4">
                  FORMULARIO DE SOLICITUD
                </span>
                <h1 className="text-4xl md:text-5xl font-bold text-text-light dark:text-text-dark leading-tight">
                  APLICA COMO VOLUNTARIO/PASANTE
                </h1>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-300 text-lg">
                  Completa el formulario para iniciar tu proceso de voluntariado con nosotros y formar parte de nuestro equipo de cambio social.
                </p>
              </div>
            </div>

            <div className="bg-card-light dark:bg-card-dark p-8 rounded-lg shadow-sm">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Información Personal */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-text-light dark:text-text-dark border-b border-gray-200 dark:border-gray-700 pb-2">
                    Información Personal
                  </h3>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-2">
                        Nombre Completo *
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="Tu nombre completo"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-2">
                        Edad *
                      </label>
                      <input
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleInputChange}
                        placeholder="Tu edad"
                        min="16"
                        max="80"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-2">
                        Correo Electrónico *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="tu@email.com"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-2">
                        Teléfono de Contacto *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+591 ..."
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-2">
                      Ocupación/Profesión *
                    </label>
                    <input
                      type="text"
                      name="occupation"
                      value={formData.occupation}
                      onChange={handleInputChange}
                      placeholder="Estudiante, Profesional, Empleado, etc."
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                {/* Información de Voluntariado */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-text-light dark:text-text-dark border-b border-gray-200 dark:border-gray-700 pb-2">
                    Información de Voluntariado
                  </h3>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-2">
                        Área de Interés *
                      </label>
                      <select
                        name="areaOfInterest"
                        value={formData.areaOfInterest}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                      >
                        <option value="">Selecciona un área</option>
                        {interventionAreas.map((area, index) => (
                          <option key={index} value={area.name}>{area.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-2">
                        Disponibilidad *
                      </label>
                      <select
                        name="availability"
                        value={formData.availability}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                      >
                        <option value="">Selecciona tu disponibilidad</option>
                        {availabilityOptions.map((option, index) => (
                          <option key={index} value={option}>{option}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-2">
                      ¿Por qué quieres ser voluntario/a? *
                    </label>
                    <textarea
                      name="motivation"
                      value={formData.motivation}
                      onChange={handleInputChange}
                      placeholder="Cuéntanos qué te motiva a ser voluntario/a y qué esperas lograr..."
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-2">
                      Experiencia Relevante
                    </label>
                    <textarea
                      name="experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                      placeholder="Describe cualquier experiencia previa en voluntariado, trabajo social, o habilidades relevantes..."
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                    />
                  </div>
                </div>

                {/* Documentos */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-text-light dark:text-text-dark border-b border-gray-200 dark:border-gray-700 pb-2">
                    Documentos (Opcional)
                  </h3>

                  <div>
                    <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-2">
                      Adjuntar Documentos
                    </label>
                    {selectedFiles.length === 0 ? (
                      <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-primary transition-colors">
                        <ImageIcon className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                        <div className="mt-4">
                          <label htmlFor="file-upload" className="cursor-pointer">
                            <span className="mt-2 block text-base font-semibold text-gray-900 dark:text-gray-100 mb-1 underline">
                              {uploading ? 'Subiendo documentos...' : 'Haz clic para subir archivos'}
                            </span>
                            <input
                              type="file"
                              name="documents"
                              onChange={handleFileChange}
                              multiple
                              accept=".pdf,.doc,.docx,.xlsx,.xls,.jpg,.jpeg,.png,.rar,.zip"
                              className="hidden"
                              id="file-upload"
                              disabled={uploading || isSubmitting}
                            />
                          </label>
                          <p className="mt-2 text-sm text-gray-500">
                            PDF, DOC, DOCX, XLS, XLSX, RAR, ZIP, JPG, PNG hasta {String(Number(process.env.NEXT_PUBLIC_MAX_UPLOAD_MB || 100))}MB
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            CV, certificados, cartas de recomendación, etc.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 gap-3">
                          {selectedFiles.map((selectedFile, index) => (
                            <div key={index} className="relative border rounded-lg p-3 bg-gray-50 dark:bg-gray-800 flex items-center gap-3">
                              {selectedFile.previewUrl ? (
                                <div className="relative w-16 h-16 rounded overflow-hidden flex-shrink-0">
                                  <Image
                                    src={selectedFile.previewUrl}
                                    alt={selectedFile.file.name}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                              ) : (
                                <File className="h-16 w-16 text-gray-400 flex-shrink-0" />
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                                  {selectedFile.file.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {(selectedFile.file.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeFile(index)}
                                className="text-red-500 hover:text-red-700 p-2"
                                disabled={uploading || isSubmitting}
                              >
                                <X className="h-5 w-5" />
                              </button>
                            </div>
                          ))}
                        </div>
                        <label htmlFor="file-upload-add" className="cursor-pointer">
                          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center hover:border-primary transition-colors">
                            <Upload className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                            <span className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                              Agregar más archivos
                            </span>
                            <input
                              type="file"
                              name="documents"
                              onChange={handleFileChange}
                              multiple
                              accept=".pdf,.doc,.docx,.xlsx,.xls,.jpg,.jpeg,.png,.rar,.zip"
                              className="hidden"
                              id="file-upload-add"
                              disabled={uploading || isSubmitting}
                            />
                          </div>
                        </label>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-2">
                      Enlace de Google Drive (Opcional)
                    </label>
                    <div className="relative">
                      <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="url"
                        name="driveLink"
                        value={formData.driveLink}
                        onChange={handleInputChange}
                        placeholder="https://drive.google.com/..."
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Políticas */}
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      name="acceptPolicies"
                      checked={formData.acceptPolicies}
                      onChange={handleInputChange}
                      className="mt-1 h-4 w-4 text-primary focus:ring-primary border-gray-300 dark:border-gray-600 rounded"
                      required
                    />
                    <label className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                      Declaro que reconozco las políticas de voluntariado de la organización, 
                      incluyendo el código de conducta, políticas de confidencialidad y 
                      procedimientos de seguridad. Acepto participar de manera responsable 
                      y comprometida con los valores y objetivos de la institución. *
                    </label>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full py-3 text-lg" 
                  disabled={isSubmitting || uploading}
                >
                  {isSubmitting || uploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {uploading ? 'Subiendo documentos...' : 'Enviando Solicitud...'}
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-5 w-5" />
                      Enviar Solicitud de Voluntariado
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </section>

        {/* Información Adicional */}
        <section className="py-6 bg-background-light dark:bg-background-dark">
          <div className="container mx-auto px-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-8">
              <div>
                <span className="inline-block bg-primary text-white text-xs font-semibold px-3 py-1 rounded mb-4">
                  PROCESO DE SELECCIÓN
                </span>
                <h1 className="text-4xl md:text-5xl font-bold text-text-light dark:text-text-dark leading-tight">
                  QUÉ ESPERAR DESPUÉS
                </h1>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-300 text-lg">
                  Conoce el proceso que seguiremos después de recibir tu solicitud para integrarte a nuestro equipo de voluntarios.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6 items-center">
              <div className="bg-card-light dark:bg-card-dark p-6 rounded-lg shadow-sm text-center">
                <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold mx-auto mb-4">1</div>
                <h4 className="font-medium text-text-light dark:text-text-dark mb-2">Revisión de tu solicitud</h4>
                <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Evaluaremos tu perfil y motivación</p>
              </div>
              
              <div className="bg-card-light dark:bg-card-dark p-6 rounded-lg shadow-sm text-center">
                <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold mx-auto mb-4">2</div>
                <h4 className="font-medium text-text-light dark:text-text-dark mb-2">Entrevista personal</h4>
                <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Conoceremos mejor tus expectativas</p>
              </div>
              
              <div className="bg-card-light dark:bg-card-dark p-6 rounded-lg shadow-sm text-center">
                <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold mx-auto mb-4">3</div>
                <h4 className="font-medium text-text-light dark:text-text-dark mb-2">Inicio de actividades</h4>
                <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Te integraremos a nuestros proyectos</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Dialog de Éxito */}
      <Dialog open={successDialog} onOpenChange={setSuccessDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <DialogTitle className="text-2xl">¡Solicitud Enviada!</DialogTitle>
            </div>
          </DialogHeader>
          <div className="text-muted-foreground text-base py-4">
            <p className="mb-4">
              Tu solicitud de voluntariado ha sido enviada exitosamente. Nuestro equipo la revisará y te contactaremos pronto por correo electrónico para coordinar tu participación.
            </p>
            <p className="font-semibold text-primary">
              ¡Gracias por tu interés en ser parte de nuestro equipo!
            </p>
          </div>
          <DialogFooter>
            <Button 
              onClick={() => setSuccessDialog(false)}
              className="w-full"
            >
              Entendido
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de Error */}
      <Dialog open={errorDialog} onOpenChange={setErrorDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
                <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <DialogTitle className="text-2xl">Error al Enviar</DialogTitle>
            </div>
          </DialogHeader>
          <div className="text-muted-foreground text-base py-4">
            <p className="mb-4">
              {errorMessage}
            </p>
            <p className="text-sm text-muted-foreground">
              Por favor, intenta de nuevo. Si el problema persiste, contacta con nosotros.
            </p>
          </div>
          <DialogFooter>
            <Button 
              onClick={() => setErrorDialog(false)}
              variant="destructive"
              className="w-full"
            >
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <SiteFooter />
    </div>
  );
}
