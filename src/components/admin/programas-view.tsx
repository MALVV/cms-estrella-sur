'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, ExternalLink, Play, Image as ImageIcon, Newspaper } from 'lucide-react';

interface Programa {
  id: string;
  nombreSector: string;
  descripcion: string;
  videoPresentacion?: string;
  alineacionODS?: string;
  subareasResultados?: string;
  resultados?: string;
  gruposAtencion?: string;
  contenidosTemas?: string;
  enlaceMasInformacion?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  creator: {
    id: string;
    name: string;
    email: string;
  };
  news?: Array<{
    id: string;
    title: string;
    excerpt: string;
    imageUrl: string;
    publishedAt: string;
    category: string;
  }>;
  imageLibrary?: Array<{
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    imageAlt: string;
    createdAt: string;
  }>;
  _count?: {
    news: number;
    imageLibrary: number;
  };
}

interface ProgramasViewProps {
  programa: Programa;
  onClose: () => void;
}

export function ProgramasView({ programa, onClose }: ProgramasViewProps) {
  const extractYouTubeId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/);
    return match ? match[1] : null;
  };

  const youtubeId = programa.videoPresentacion ? extractYouTubeId(programa.videoPresentacion) : null;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{programa.nombreSector}</h1>
        <Button variant="outline" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Información Principal */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Información del Programa
                <div className="flex gap-2">
                  <Badge variant={programa.isActive ? 'default' : 'secondary'}>
                    {programa.isActive ? 'Activo' : 'Inactivo'}
                  </Badge>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Descripción</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{programa.descripcion}</p>
              </div>

              {programa.subareasResultados && (
                <div>
                  <h3 className="font-semibold mb-2">Subáreas de Resultados</h3>
                  <p className="text-gray-700 whitespace-pre-wrap">{programa.subareasResultados}</p>
                </div>
              )}

              {programa.resultados && (
                <div>
                  <h3 className="font-semibold mb-2">Resultados</h3>
                  <p className="text-gray-700 whitespace-pre-wrap">{programa.resultados}</p>
                </div>
              )}

              {programa.gruposAtencion && (
                <div>
                  <h3 className="font-semibold mb-2">Grupos de Atención</h3>
                  <p className="text-gray-700 whitespace-pre-wrap">{programa.gruposAtencion}</p>
                </div>
              )}

              {programa.contenidosTemas && (
                <div>
                  <h3 className="font-semibold mb-2">Contenidos/Temas</h3>
                  <p className="text-gray-700 whitespace-pre-wrap">{programa.contenidosTemas}</p>
                </div>
              )}

              {programa.alineacionODS && (
                <div>
                  <h3 className="font-semibold mb-2">Alineación a ODS</h3>
                  <p className="text-gray-700 whitespace-pre-wrap">{programa.alineacionODS}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Video de Presentación */}
          {youtubeId && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Play className="h-5 w-5" />
                  Video de Presentación
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video">
                  <iframe
                    src={`https://www.youtube.com/embed/${youtubeId}`}
                    title="Video de presentación"
                    className="w-full h-full rounded-lg"
                    allowFullScreen
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Enlace Externo */}
          {programa.enlaceMasInformacion && (
            <Card>
              <CardContent className="pt-6">
                <Button
                  asChild
                  className="w-full"
                  variant="outline"
                >
                  <a
                    href={programa.enlaceMasInformacion}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Más Información
                  </a>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Información del Creador */}
          <Card>
            <CardHeader>
              <CardTitle>Información del Creador</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p><strong>Nombre:</strong> {programa.creator.name}</p>
                <p><strong>Email:</strong> {programa.creator.email}</p>
                <p><strong>Creado:</strong> {new Date(programa.createdAt).toLocaleDateString()}</p>
                <p><strong>Actualizado:</strong> {new Date(programa.updatedAt).toLocaleDateString()}</p>
              </div>
            </CardContent>
          </Card>

          {/* Estadísticas */}
          <Card>
            <CardHeader>
              <CardTitle>Estadísticas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Newspaper className="h-4 w-4 text-blue-500" />
                  <span>{programa._count?.news || programa.news?.length || 0} noticias relacionadas</span>
                </div>
                <div className="flex items-center gap-2">
                  <ImageIcon className="h-4 w-4 text-green-500" />
                  <span>{programa._count?.imageLibrary || programa.imageLibrary?.length || 0} imágenes en galería</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Noticias Relacionadas */}
          {(programa.news && programa.news.length > 0) && (
            <Card>
              <CardHeader>
                <CardTitle>Noticias Relacionadas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {programa.news.slice(0, 3).map((news) => (
                    <div key={news.id} className="border-l-2 border-blue-500 pl-3">
                      <h4 className="font-medium text-sm">{news.title}</h4>
                      <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                        {news.excerpt}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(news.publishedAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                  {programa.news.length > 3 && (
                    <p className="text-sm text-gray-500">
                      +{programa.news.length - 3} más noticias
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Galería de Imágenes */}
          {(programa.imageLibrary && programa.imageLibrary.length > 0) && (
            <Card>
              <CardHeader>
                <CardTitle>Galería de Imágenes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {programa.imageLibrary.slice(0, 4).map((image) => (
                    <div key={image.id} className="aspect-square">
                      <img
                        src={image.imageUrl}
                        alt={image.imageAlt || image.title}
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                  ))}
                </div>
                {programa.imageLibrary.length > 4 && (
                  <p className="text-sm text-gray-500 mt-2 text-center">
                    +{programa.imageLibrary.length - 4} más imágenes
                  </p>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
