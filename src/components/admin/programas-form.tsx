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
  sectorName: string;
  description: string;
  imageUrl?: string;
  imageAlt?: string;
  presentationVideo?: string;
  odsAlignment?: string;
  resultsAreas?: string;
  resultados?: string;
  targetGroups?: string;
  contentTopics?: string;
  moreInfoLink?: string;
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
    sectorName: '',
    description: '',
    imageUrl: '',
    imageAlt: '',
    presentationVideo: '',
    odsAlignment: '',
    resultsAreas: '',
    resultados: '',
    targetGroups: '',
    contentTopics: '',
    moreInfoLink: '',
    isFeatured: false,
  });
  const [loading, setLoading] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [createdPrograma, setCreatedPrograma] = useState<any>(null);

  useEffect(() => {
    if (programa) {
      setFormData({
        sectorName: programa.sectorName,
        description: programa.description,
        imageUrl: programa.imageUrl || '',
        imageAlt: programa.imageAlt || '',
        presentationVideo: programa.presentationVideo || '',
        odsAlignment: programa.odsAlignment || '',
        resultsAreas: programa.resultsAreas || '',
        resultados: programa.resultados || '',
        targetGroups: programa.targetGroups || '',
        contentTopics: programa.contentTopics || '',
        moreInfoLink: programa.moreInfoLink || '',
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
          sectorName: '', 
          description: '', 
          imageUrl: '',
          imageAlt: '',
          presentationVideo: '', 
          odsAlignment: '', 
          resultsAreas: '', 
          resultados: '', 
          targetGroups: '', 
          contentTopics: '', 
          moreInfoLink: '', 
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
      sectorName: 150,
      description: 2000,
      imageUrl: 200,
      imageAlt: 100,
      presentationVideo: 200,
      odsAlignment: 1000,
      resultsAreas: 1000,
      resultados: 1000,
      targetGroups: 1000,
      contentTopics: 1000,
      moreInfoLink: 200
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
                  <Label htmlFor="sectorName">
                    Nombre del Sector * <span className="text-xs text-gray-500">({formData.sectorName.length}/150)</span>
                  </Label>
                  <Input
                    id="sectorName"
                    value={formData.sectorName}
                    onChange={(e) => handleInputChange('sectorName', e.target.value)}
                    required
                    maxLength={150}
                    placeholder="Ej: Educación, Salud, Desarrollo Social"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">
                    Descripción * <span className="text-xs text-gray-500">({formData.description.length}/2000)</span>
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
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
                    <Label htmlFor="presentationVideo">
                      Video de Presentación (YouTube) <span className="text-xs text-gray-500">({formData.presentationVideo.length}/200)</span>
                    </Label>
                    <Input
                      id="presentationVideo"
                      value={formData.presentationVideo}
                      onChange={(e) => handleInputChange('presentationVideo', e.target.value)}
                      maxLength={200}
                      placeholder="https://www.youtube.com/watch?v=..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="moreInfoLink">
                      Enlace para Más Información <span className="text-xs text-gray-500">({formData.moreInfoLink.length}/200)</span>
                    </Label>
                    <Input
                      id="moreInfoLink"
                      value={formData.moreInfoLink}
                      onChange={(e) => handleInputChange('moreInfoLink', e.target.value)}
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
                  <Label htmlFor="odsAlignment">
                    Alineación a ODS <span className="text-xs text-gray-500">({formData.odsAlignment.length}/1000)</span>
                  </Label>
                  <Textarea
                    id="odsAlignment"
                    value={formData.odsAlignment}
                    onChange={(e) => handleInputChange('odsAlignment', e.target.value)}
                    maxLength={1000}
                    rows={3}
                    placeholder="Información sobre los Objetivos de Desarrollo Sostenible relacionados..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="resultsAreas">
                    Subáreas de Resultados / Subsectores <span className="text-xs text-gray-500">({formData.resultsAreas.length}/1000)</span>
                  </Label>
                  <Textarea
                    id="resultsAreas"
                    value={formData.resultsAreas}
                    onChange={(e) => handleInputChange('resultsAreas', e.target.value)}
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
                  <Label htmlFor="targetGroups">
                    Grupos de Atención <span className="text-xs text-gray-500">({formData.targetGroups.length}/1000)</span>
                  </Label>
                  <Textarea
                    id="targetGroups"
                    value={formData.targetGroups}
                    onChange={(e) => handleInputChange('targetGroups', e.target.value)}
                    maxLength={1000}
                    rows={3}
                    placeholder="Población objetivo del programa..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contentTopics">
                    Contenidos/Temas <span className="text-xs text-gray-500">({formData.contentTopics.length}/1000)</span>
                  </Label>
                  <Textarea
                    id="contentTopics"
                    value={formData.contentTopics}
                    onChange={(e) => handleInputChange('contentTopics', e.target.value)}
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
                <p><strong>Nombre:</strong> {createdPrograma?.sectorName}</p>
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

