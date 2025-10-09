'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { X, Save, Plus, FileText, Calendar, Target, Users, BookOpen, Award, Globe, Edit } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface Programa {
  id: string;
  nombreSector: string;
  descripcion: string;
  imageUrl?: string;
  imageAlt?: string;
  videoPresentacion?: string;
  alineacionODS?: string;
  subareasResultados?: string;
  resultados?: string;
  gruposAtencion?: string;
  contenidosTemas?: string;
  enlaceMasInformacion?: string;
  isActive: boolean;
  isFeatured: boolean;
}

interface ProgramasFormProps {
  programa?: Programa | null;
  onClose: () => void;
  onProgramaCreated?: (programa: any) => void;
}

export function ProgramasForm({ programa, onClose, onProgramaCreated }: ProgramasFormProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    nombreSector: '',
    descripcion: '',
    imageUrl: '',
    imageAlt: '',
    videoPresentacion: '',
    alineacionODS: '',
    subareasResultados: '',
    resultados: '',
    gruposAtencion: '',
    contenidosTemas: '',
    enlaceMasInformacion: '',
    isFeatured: false,
  });
  const [loading, setLoading] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [createdPrograma, setCreatedPrograma] = useState<any>(null);

  useEffect(() => {
    if (programa) {
      setFormData({
        nombreSector: programa.nombreSector,
        descripcion: programa.descripcion,
        imageUrl: programa.imageUrl || '',
        imageAlt: programa.imageAlt || '',
        videoPresentacion: programa.videoPresentacion || '',
        alineacionODS: programa.alineacionODS || '',
        subareasResultados: programa.subareasResultados || '',
        resultados: programa.resultados || '',
        gruposAtencion: programa.gruposAtencion || '',
        contenidosTemas: programa.contenidosTemas || '',
        enlaceMasInformacion: programa.enlaceMasInformacion || '',
        isFeatured: programa.isFeatured,
      });
    }
  }, [programa]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = programa 
        ? `/api/admin/programas/${programa.id}`
        : '/api/admin/programas';
      
      const method = programa ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al guardar programa');
      }

      const result = await response.json();
      
      if (!programa) {
        // Es una creación nueva
        setCreatedPrograma(result);
        if (onProgramaCreated) {
          onProgramaCreated(result);
        }
        // Cerrar el popup de creación y abrir el de éxito
        onClose();
        setShowSuccessDialog(true);
        setFormData({ 
          nombreSector: '', 
          descripcion: '', 
          imageUrl: '',
          imageAlt: '',
          videoPresentacion: '', 
          alineacionODS: '', 
          subareasResultados: '', 
          resultados: '', 
          gruposAtencion: '', 
          contenidosTemas: '', 
          enlaceMasInformacion: '', 
          isFeatured: false 
        });
      } else {
        // Es una edición
        toast({
          title: "Programa actualizado",
          description: "El programa ha sido actualizado exitosamente.",
        });
        onClose();
      }
    } catch (error) {
      console.error('Error saving programa:', error);
      toast({
        title: "Error al guardar programa",
        description: error instanceof Error ? error.message : "Hubo un problema al guardar el programa. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    // Definir límites de caracteres para campos de texto
    const limits = {
      nombreSector: 150,
      descripcion: 2000,
      imageUrl: 200,
      imageAlt: 100,
      videoPresentacion: 200,
      alineacionODS: 1000,
      subareasResultados: 1000,
      resultados: 1000,
      gruposAtencion: 1000,
      contenidosTemas: 1000,
      enlaceMasInformacion: 200
    };
    
    // Verificar si el valor excede el límite (solo para strings)
    if (typeof value === 'string' && limits[field as keyof typeof limits] && value.length > limits[field as keyof typeof limits]) {
      return; // No actualizar si excede el límite
    }
    
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <>
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {programa ? (
                <>
                  <Edit className="h-5 w-5" />
                  Editar Programa
                </>
              ) : (
                <>
                  <Plus className="h-5 w-5" />
                  Crear Nuevo Programa
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              {programa 
                ? 'Modifica la información del programa existente.' 
                : 'Completa la información para crear un nuevo programa estratégico.'
              }
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Información Básica */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Información Básica
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nombreSector">
                    Nombre del Sector * <span className="text-xs text-gray-500">({formData.nombreSector.length}/150)</span>
                  </Label>
                  <Input
                    id="nombreSector"
                    value={formData.nombreSector}
                    onChange={(e) => handleInputChange('nombreSector', e.target.value)}
                    required
                    maxLength={150}
                    placeholder="Ej: Educación, Salud, Desarrollo Social"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="descripcion">
                    Descripción * <span className="text-xs text-gray-500">({formData.descripcion.length}/2000)</span>
                  </Label>
                  <Textarea
                    id="descripcion"
                    value={formData.descripcion}
                    onChange={(e) => handleInputChange('descripcion', e.target.value)}
                    required
                    maxLength={2000}
                    rows={4}
                    placeholder="Descripción detallada del programa..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="imageUrl">
                      URL de Imagen Principal <span className="text-xs text-gray-500">({formData.imageUrl.length}/200)</span>
                    </Label>
                    <Input
                      id="imageUrl"
                      value={formData.imageUrl}
                      onChange={(e) => handleInputChange('imageUrl', e.target.value)}
                      maxLength={200}
                      placeholder="https://ejemplo.com/imagen-programa.jpg"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="imageAlt">
                      Texto Alternativo de Imagen <span className="text-xs text-gray-500">({formData.imageAlt.length}/100)</span>
                    </Label>
                    <Input
                      id="imageAlt"
                      value={formData.imageAlt}
                      onChange={(e) => handleInputChange('imageAlt', e.target.value)}
                      maxLength={100}
                      placeholder="Descripción de la imagen para accesibilidad"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="videoPresentacion">
                      Video de Presentación (YouTube) <span className="text-xs text-gray-500">({formData.videoPresentacion.length}/200)</span>
                    </Label>
                    <Input
                      id="videoPresentacion"
                      value={formData.videoPresentacion}
                      onChange={(e) => handleInputChange('videoPresentacion', e.target.value)}
                      maxLength={200}
                      placeholder="https://www.youtube.com/watch?v=..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="enlaceMasInformacion">
                      Enlace para Más Información <span className="text-xs text-gray-500">({formData.enlaceMasInformacion.length}/200)</span>
                    </Label>
                    <Input
                      id="enlaceMasInformacion"
                      value={formData.enlaceMasInformacion}
                      onChange={(e) => handleInputChange('enlaceMasInformacion', e.target.value)}
                      maxLength={200}
                      placeholder="https://childfund.org/programa..."
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="isFeatured"
                    checked={formData.isFeatured}
                    onCheckedChange={(checked) => handleInputChange('isFeatured', checked)}
                  />
                  <Label htmlFor="isFeatured">Programa Destacado</Label>
                </div>
              </CardContent>
            </Card>

            {/* Detalles del Programa */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Detalles del Programa
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="alineacionODS">
                    Alineación a ODS <span className="text-xs text-gray-500">({formData.alineacionODS.length}/1000)</span>
                  </Label>
                  <Textarea
                    id="alineacionODS"
                    value={formData.alineacionODS}
                    onChange={(e) => handleInputChange('alineacionODS', e.target.value)}
                    maxLength={1000}
                    rows={3}
                    placeholder="Información sobre los Objetivos de Desarrollo Sostenible relacionados..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subareasResultados">
                    Subáreas de Resultados / Subsectores <span className="text-xs text-gray-500">({formData.subareasResultados.length}/1000)</span>
                  </Label>
                  <Textarea
                    id="subareasResultados"
                    value={formData.subareasResultados}
                    onChange={(e) => handleInputChange('subareasResultados', e.target.value)}
                    maxLength={1000}
                    rows={3}
                    placeholder="Subáreas específicas del programa..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="resultados">
                    Resultados <span className="text-xs text-gray-500">({formData.resultados.length}/1000)</span>
                  </Label>
                  <Textarea
                    id="resultados"
                    value={formData.resultados}
                    onChange={(e) => handleInputChange('resultados', e.target.value)}
                    maxLength={1000}
                    rows={3}
                    placeholder="Resultados esperados y logrados..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gruposAtencion">
                    Grupos de Atención <span className="text-xs text-gray-500">({formData.gruposAtencion.length}/1000)</span>
                  </Label>
                  <Textarea
                    id="gruposAtencion"
                    value={formData.gruposAtencion}
                    onChange={(e) => handleInputChange('gruposAtencion', e.target.value)}
                    maxLength={1000}
                    rows={3}
                    placeholder="Población objetivo del programa..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contenidosTemas">
                    Contenidos/Temas <span className="text-xs text-gray-500">({formData.contenidosTemas.length}/1000)</span>
                  </Label>
                  <Textarea
                    id="contenidosTemas"
                    value={formData.contenidosTemas}
                    onChange={(e) => handleInputChange('contenidosTemas', e.target.value)}
                    maxLength={1000}
                    rows={3}
                    placeholder="Temas y contenidos abordados en el programa..."
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                <Save className="h-4 w-4 mr-2" />
                {loading ? 'Guardando...' : (programa ? 'Actualizar' : 'Crear Programa')}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Popup de éxito */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-green-600">
              <Award className="h-5 w-5" />
              ¡Programa Creado Exitosamente!
            </DialogTitle>
            <DialogDescription>
              El programa ha sido creado y está listo para ser publicado.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="text-green-700 border-green-300">
                  <Calendar className="mr-1 h-3 w-3" />
                  {createdPrograma?.createdAt}
                </Badge>
                {createdPrograma?.isFeatured && (
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                    Destacado
                  </Badge>
                )}
              </div>
              <div className="text-sm text-green-700">
                <p><strong>Nombre:</strong> {createdPrograma?.nombreSector}</p>
                <p><strong>ID:</strong> {createdPrograma?.id}</p>
                <p><strong>Estado:</strong> {createdPrograma?.isActive ? 'Activo' : 'Inactivo'}</p>
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button onClick={() => setShowSuccessDialog(false)}>
                Continuar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
