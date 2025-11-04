'use client'

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, ArrowLeft, Upload, Link as LinkIcon, Send, X, File, ImageIcon, Download, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { SiteHeader } from '@/components/layout/site-header';
import { SiteFooter } from '@/components/layout/site-footer';
import { toast } from 'sonner';

interface Convocatoria {
  id: string;
  title: string;
  description: string;
  image: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'upcoming' | 'closed';
  requirements: any; // JSON field
  documents: Array<string | { url: string; originalName: string }>; // Puede ser string (formato antiguo) o objeto (formato nuevo)
  createdAt: string;
  fullDescription: string;
}

interface FormData {
  fullName: string;
  email: string;
  phone: string;
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

export default function ConvocatoriaDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [convocatoria, setConvocatoria] = useState<Convocatoria | null>(null);
  const [loading, setLoading] = useState(true);
  const [convocatoriaId, setConvocatoriaId] = useState<string>('');
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    experience: '',
    documents: null,
    driveLink: '',
    acceptPolicies: false
  });
  const [selectedFiles, setSelectedFiles] = useState<SelectedFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params;
      setConvocatoriaId(resolvedParams.id);
    };
    getParams();
  }, [params]);

  useEffect(() => {
    if (!convocatoriaId) return;
    
    const fetchConvocatoria = async () => {
      try {
        const response = await fetch(`/api/public/convocatorias/${convocatoriaId}`);
        if (response.ok) {
          const data = await response.json();
          setConvocatoria({
            id: data.id,
            title: data.title,
            description: data.description,
            image: data.imageUrl,
            startDate: data.startDate,
            endDate: data.endDate,
            status: data.status.toLowerCase() === 'active' ? 'active' : 
                   data.status.toLowerCase() === 'upcoming' ? 'upcoming' : 'closed',
            requirements: Array.isArray(data.requirements) ? data.requirements : [],
            documents: Array.isArray(data.documents) ? data.documents : [],
            createdAt: data.createdAt,
            fullDescription: data.fullDescription
          });
        } else {
          setConvocatoria(null);
        }
      } catch (error) {
        console.error('Error fetching convocatoria:', error);
        setConvocatoria(null);
      } finally {
        setLoading(false);
      }
    };

    fetchConvocatoria();
  }, [convocatoriaId]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Activa</Badge>;
      case 'upcoming':
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">Próxima</Badge>;
      case 'closed':
        return <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200">Cerrada</Badge>;
      default:
        return null;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
        toast.error(`El archivo ${file.name} es demasiado grande. Máximo ${maxMb}MB`);
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

            const uploadResponse = await fetch('/api/public/convocatorias/upload-document', {
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
          toast.error('Error al subir documentos', {
            description: error instanceof Error ? error.message : 'Por favor intenta nuevamente'
          });
          setUploading(false);
          setIsSubmitting(false);
          return;
        } finally {
          setUploading(false);
        }
      }

      // Determinar qué usar: documentos subidos o driveLink
      const finalDriveLink = uploadedDocumentUrls.length > 0 
        ? uploadedDocumentUrls.join(',') 
        : (formData.driveLink || null);

      const response = await fetch(`/api/public/convocatorias/${convocatoriaId}/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          experience: formData.experience,
          driveLink: finalDriveLink,
          documentUrls: uploadedDocumentUrls.length > 0 ? uploadedDocumentUrls : undefined,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('¡Postulación enviada exitosamente!', {
          description: 'Te contactaremos pronto para continuar con el proceso.'
        });
        // Reset form
        setFormData({
          fullName: '',
          email: '',
          phone: '',
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
      } else {
        toast.error('Error al enviar la postulación', {
          description: data.error || 'Por favor intenta nuevamente'
        });
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      toast.error('Error al enviar la postulación', {
        description: 'Por favor, intenta nuevamente.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark">
        <SiteHeader />
        <main className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                <div className="space-y-4">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                </div>
              </div>
              <div className="space-y-6">
                <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
              </div>
            </div>
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  if (!convocatoria) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark">
        <SiteHeader />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-text-light dark:text-text-dark mb-4">
              Convocatoria no encontrada
            </h1>
            <Link href="/convocatorias">
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver a Convocatorias
              </Button>
            </Link>
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <SiteHeader />
      
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link href="/convocatorias" className="text-primary hover:text-primary/80 flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Volver a Convocatorias
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contenido Principal */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h1 className="text-3xl md:text-4xl font-bold text-text-light dark:text-text-dark mb-4">
                    {convocatoria.title}
                  </h1>
                  <div className="flex items-center gap-4 text-sm text-text-secondary-light dark:text-text-secondary-dark">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>Publicado: {formatDate(convocatoria.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>Vigencia hasta: {formatDate(convocatoria.endDate)}</span>
                    </div>
                  </div>
                </div>
                <div>
                  {getStatusBadge(convocatoria.status)}
                </div>
              </div>
            </div>

            {/* Imagen */}
            <div className="relative h-64 md:h-80 rounded-lg overflow-hidden">
              <Image
                src={convocatoria.image}
                alt={convocatoria.title}
                fill
                className="object-cover"
              />
            </div>

            {/* Descripción Completa */}
            <Card>
              <CardHeader>
                <CardTitle>Descripción del Proyecto</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed">
                  {convocatoria.fullDescription}
                </p>
              </CardContent>
            </Card>

            {/* Requisitos del Voluntariado */}
            {Array.isArray(convocatoria.requirements) && convocatoria.requirements.length > 0 && (
            <Card>
              <CardHeader>
                  <CardTitle>Requisitos del Voluntariado</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                    {convocatoria.requirements.map((requirement: any, index: number) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-text-secondary-light dark:text-text-secondary-dark">
                          {typeof requirement === 'object' ? requirement.text : requirement}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            )}

            {/* Documentos Disponibles */}
            {Array.isArray(convocatoria.documents) && convocatoria.documents.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Documentos Relacionados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {convocatoria.documents.map((doc: any, index: number) => {
                    // Manejar tanto formato antiguo (string) como nuevo (objeto)
                    const docUrl = typeof doc === 'string' ? doc : (doc.url || doc);
                    const fileName = typeof doc === 'object' && doc.originalName 
                      ? doc.originalName 
                      : (typeof doc === 'string' ? doc.split('/').pop() : docUrl.split('/').pop() || `Documento ${index + 1}`);
                    const isPdf = docUrl.toLowerCase().includes('.pdf');
                    const isImage = docUrl.toLowerCase().match(/\.(jpg|jpeg|png|gif|webp)$/);
                    
                    return (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <File className="h-5 w-5 text-primary flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-text-light dark:text-text-dark truncate">
                              {fileName}
                            </p>
                            <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                              {isPdf ? 'PDF' : isImage ? 'Imagen' : 'Documento'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            asChild
                            className="flex-shrink-0"
                          >
                            <a
                              href={docUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2"
                            >
                              <ExternalLink className="h-4 w-4" />
                              Ver
                            </a>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            asChild
                            className="flex-shrink-0"
                          >
                            <a
                              href={docUrl}
                              download={fileName}
                              className="flex items-center gap-2"
                            >
                              <Download className="h-4 w-4" />
                            </a>
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Formulario de Postulación */}
            <Card>
              <CardHeader>
                <CardTitle>Formulario de Postulación</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
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

                  <div>
                    <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-2">
                      Breve Descripción de su Experiencia *
                    </label>
                    <textarea
                      name="experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                      placeholder="Describe tu experiencia relevante..."
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                      required
                    />
                  </div>

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
                              accept=".xlsx,.docx,.pdf,.rar,.zip,.jpg,.jpeg,.png"
                              className="hidden"
                              id="file-upload"
                              disabled={uploading || isSubmitting}
                            />
                          </label>
                          <p className="mt-2 text-sm text-gray-500">
                            PDF, DOC, DOCX, XLS, XLSX, RAR, ZIP, JPG, PNG hasta {String(Number(process.env.NEXT_PUBLIC_MAX_UPLOAD_MB || 100))}MB
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
                              accept=".xlsx,.docx,.pdf,.rar,.zip,.jpg,.jpeg,.png"
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
                      Declaro que reconozco las políticas de la organización, 
                      incluyendo el código de conducta, políticas de confidencialidad y 
                      procedimientos de seguridad. Acepto participar de manera responsable 
                      y comprometida con los valores y objetivos de la institución. *
                    </label>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isSubmitting || uploading}
                  >
                    {isSubmitting || uploading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        {uploading ? 'Subiendo documentos...' : 'Enviando...'}
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Enviar Postulación
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <SiteFooter />
    </div>
  );
}
