'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Download, ExternalLink, Calendar, User } from 'lucide-react';

interface ImageLibraryItem {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  imageAlt?: string;
  fileName?: string;
  fileSize?: number;
  fileType?: string;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
  creator: {
    id: string;
    name: string;
    email: string;
  };
  programa?: {
    id: string;
    sectorName: string;
  };
}

interface ImageLibraryViewProps {
  image: ImageLibraryItem;
  onClose: () => void;
}

export function ImageLibraryView({ image, onClose }: ImageLibraryViewProps) {
  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Desconocido';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = image.imageUrl;
    link.download = image.fileName || image.title;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{image.title}</h1>
        <Button variant="outline" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Imagen Principal */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Vista de la Imagen
                <div className="flex gap-2">
                  {image.isFeatured && (
                    <Badge variant="secondary">Destacada</Badge>
                  )}
                  <Badge variant={image.isActive ? 'default' : 'secondary'}>
                    {image.isActive ? 'Activa' : 'Inactiva'}
                  </Badge>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={image.imageUrl}
                    alt={image.imageAlt || image.title}
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleDownload} className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Descargar
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => window.open(image.imageUrl, '_blank')}
                    className="flex items-center gap-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Abrir en Nueva Pestaña
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Descripción */}
          {image.description && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Descripción</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 whitespace-pre-wrap">{image.description}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Información del Archivo */}
          <Card>
            <CardHeader>
              <CardTitle>Información del Archivo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Nombre:</span>
                <span className="text-sm font-medium">{image.fileName || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Tamaño:</span>
                <span className="text-sm font-medium">{formatFileSize(image.fileSize)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Tipo:</span>
                <span className="text-sm font-medium">{image.fileType || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Texto Alt:</span>
                <span className="text-sm font-medium">{image.imageAlt || 'N/A'}</span>
              </div>
            </CardContent>
          </Card>

          {/* Información del Creador */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Información del Creador
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <span className="text-sm text-gray-600">Nombre:</span>
                <p className="text-sm font-medium">{image.creator.name}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Email:</span>
                <p className="text-sm font-medium">{image.creator.email}</p>
              </div>
            </CardContent>
          </Card>

          {/* Fechas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Fechas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <span className="text-sm text-gray-600">Creado:</span>
                <p className="text-sm font-medium">
                  {new Date(image.createdAt).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Actualizado:</span>
                <p className="text-sm font-medium">
                  {new Date(image.updatedAt).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Programa Relacionado */}
          {image.programa && (
            <Card>
              <CardHeader>
                <CardTitle>Programa Relacionado</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="font-medium text-blue-900">{image.programa.sectorName}</p>
                  <p className="text-sm text-blue-700">Esta imagen está asociada a este programa</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* URL de la Imagen */}
          <Card>
            <CardHeader>
              <CardTitle>URL de la Imagen</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600 break-all">{image.imageUrl}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

