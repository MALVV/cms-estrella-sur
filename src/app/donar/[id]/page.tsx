'use client'

import React, { useState, useEffect, use } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Heart, DollarSign, Calendar, Target, Users, ArrowLeft, QrCode, CreditCard, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';
import { SiteHeader } from '@/components/layout/site-header';
import { SiteFooter } from '@/components/layout/site-footer';
import { toast } from 'sonner';

interface DonationProject {
  id: string;
  title: string;
  description: string;
  context: string;
  objectives: string;
  executionStart: string;
  executionEnd: string;
  accountNumber: string;
  recipientName: string;
  qrImageUrl?: string;
  qrImageAlt?: string;
  referenceImageUrl?: string;
  referenceImageAlt?: string;
  targetAmount?: number;
  currentAmount: number;
  progressPercentage: number;
  isCompleted: boolean;
  isFeatured: boolean;
  donationCount: number;
}

interface DonationForm {
  donorName: string;
  donorEmail: string;
  donorAddress: string;
  donorPhone: string;
  amount: string;
  donationType: string;
  message: string;
}

export default function DonateToProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [donationProject, setDonationProject] = useState<DonationProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [donationSubmitted, setDonationSubmitted] = useState(false);
  const [formData, setFormData] = useState<DonationForm>({
    donorName: '',
    donorEmail: '',
    donorAddress: '',
    donorPhone: '',
    amount: '',
    donationType: 'SPECIFIC_PROJECT',
    message: ''
  });

  const donationAmounts = [50, 100, 200, 500, 1000, 2000];

  useEffect(() => {
    const fetchDonationProject = async () => {
      try {
        const response = await fetch(`/api/public/donation-projects?id=${resolvedParams.id}`);
        if (response.ok) {
          const data = await response.json();
          if (data.length > 0) {
            setDonationProject(data[0]);
          }
        }
      } catch (error) {
        console.error('Error al cargar proyecto de donación:', error);
        toast.error('Error al cargar el proyecto');
      } finally {
        setLoading(false);
      }
    };

    fetchDonationProject();
  }, [resolvedParams.id]);

  const handleInputChange = (field: keyof DonationForm, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowPaymentModal(true);
  };

  const handlePaymentConfirmation = async () => {
    setSubmitting(true);

    try {
      const response = await fetch('/api/public/donations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          donationProjectId: donationProject?.id
        }),
      });

      if (response.ok) {
        setDonationSubmitted(true);
        toast.success('¡Donación registrada exitosamente! Te contactaremos pronto para confirmar el pago.');
        // Reset form
        setFormData({
          donorName: '',
          donorEmail: '',
          donorAddress: '',
          donorPhone: '',
          amount: '',
          donationType: 'SPECIFIC_PROJECT',
          message: ''
        });
      } else {
        const error = await response.json();
        toast.error(error.error || 'Error al registrar la donación');
      }
    } catch (error) {
      console.error('Error al enviar donación:', error);
      toast.error('Error al registrar la donación');
    } finally {
      setSubmitting(false);
      setShowPaymentModal(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long'
    });
  };

  const formatCurrency = (amount: number | string) => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return `Bs. ${numAmount.toLocaleString('es-BO', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark">
        <SiteHeader />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-8"></div>
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
              <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>
        <SiteFooter />
      </div>
    );
  }

  if (!donationProject) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark">
        <SiteHeader />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Proyecto no encontrado
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            El proyecto que buscas no está disponible para donaciones.
          </p>
            <Button asChild>
            <Link href="/donar">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a Donaciones
            </Link>
            </Button>
        </div>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <SiteHeader />
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Información del Proyecto */}
          <div className="space-y-6">
            <div>
              <div className="flex gap-2 mb-4">
                <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-md">
                  PROYECTO ESPECÍFICO
                </span>
                {donationProject.isCompleted && (
                  <span className="bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-md">
                    COMPLETADO
                  </span>
                )}
              </div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {donationProject.title}
        </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                {donationProject.context}
              </p>
            </div>

            {donationProject.referenceImageUrl && donationProject.referenceImageUrl.trim() !== '' ? (
              <div className="relative h-64 rounded-lg overflow-hidden">
                <img
                  src={donationProject.referenceImageUrl}
                  alt={donationProject.referenceImageAlt || donationProject.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800';
                  }}
                  />
                </div>
            ) : (
              <div className="relative h-64 rounded-lg overflow-hidden bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center">
                <Heart className="h-16 w-16 text-primary/50" />
              </div>
              )}

            {/* Progreso del Proyecto */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Progreso de Recaudación
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Recaudado</span>
                    <span className="text-sm font-bold">{formatCurrency(donationProject.currentAmount)}</span>
              </div>

                  {donationProject.targetAmount && (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Meta</span>
                        <span className="text-sm font-bold">{formatCurrency(donationProject.targetAmount)}</span>
              </div>

                      <div className="relative w-full h-3">
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 absolute">
                          <div
                            className="bg-gradient-to-r from-primary to-primary/80 h-3 rounded-full transition-all duration-1000 ease-out"
                            style={{ width: `${donationProject.progressPercentage}%` }}
                          />
                        </div>
                        <div 
                          className="absolute top-0 h-3 flex items-center"
                          style={{ left: `${donationProject.progressPercentage}%` }}
                        >
                          <span className="ml-1 text-sm font-bold text-text-light dark:text-text-dark whitespace-nowrap">
                            {donationProject.progressPercentage.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </>
                  )}
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {donationProject.donationCount} donaciones
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {formatDate(donationProject.executionStart)} - {formatDate(donationProject.executionEnd)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Botón Volver a Donaciones */}
            <div className="flex justify-center">
              <Button variant="ghost" asChild className="underline">
                <Link href="/donar">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Volver a Donaciones
                </Link>
              </Button>
            </div>
          </div>

                {/* Formulario de Donación */}
          <div>
            {donationProject.isCompleted ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-green-500" />
                    Proyecto Completado
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <div className="mb-4">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full mb-4">
                        <Heart className="h-8 w-8 text-green-600 dark:text-green-400" />
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      ¡Meta Alcanzada!
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Este proyecto ha alcanzado su meta de recaudación. Gracias a todos los donantes que hicieron esto posible.
                    </p>
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                      <p className="text-sm text-green-800 dark:text-green-200">
                        <strong>Total recaudado:</strong> {formatCurrency(parseFloat(donationProject.currentAmount.toString()))}
                        {donationProject.targetAmount && (
                          <span> de {formatCurrency(parseFloat(donationProject.targetAmount.toString()))}</span>
                        )}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-red-500" />
                    Realizar Donación
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Información importante */}
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      <strong>Importante:</strong> Completa este formulario antes de proceder con el pago. 
                      Una vez recibida la transferencia, te contactaremos para enviarte tu recibo digital.
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="donorName">Nombre Completo *</Label>
                      <Input
                        id="donorName"
                        value={formData.donorName}
                        onChange={(e) => handleInputChange('donorName', e.target.value)}
                        placeholder="Tu nombre completo"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="donorEmail">Correo Electrónico *</Label>
                      <Input
                        id="donorEmail"
                        type="email"
                        value={formData.donorEmail}
                        onChange={(e) => handleInputChange('donorEmail', e.target.value)}
                        placeholder="tu@email.com"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="donorAddress">Domicilio *</Label>
                      <Input
                        id="donorAddress"
                        value={formData.donorAddress}
                        onChange={(e) => handleInputChange('donorAddress', e.target.value)}
                        placeholder="Tu dirección"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="donorPhone">Teléfono de Contacto *</Label>
                      <Input
                        id="donorPhone"
                        type="tel"
                        value={formData.donorPhone}
                        onChange={(e) => handleInputChange('donorPhone', e.target.value)}
                        placeholder="+591 ..."
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="amount">Monto de Donación (Bs.) *</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sm font-medium text-gray-400">Bs.</span>
                      <Input
                        id="amount"
                        type="number"
                        value={formData.amount}
                        onChange={(e) => handleInputChange('amount', e.target.value)}
                        placeholder="100"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  {/* Montos Sugeridos */}
                  <div>
                    <Label className="text-sm font-medium mb-3 block">Montos Sugeridos</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {donationAmounts.map((amount) => (
                        <Button
                          key={amount}
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleInputChange('amount', amount.toString())}
                        >
                          <span className="mr-1 text-xs font-medium">Bs.</span>
                          {amount}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="message">Mensaje (Opcional)</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      placeholder="Deja un mensaje de apoyo..."
                      rows={3}
                    />
                </div>

                  <Button 
                    type="submit" 
                    className="w-full text-lg py-6"
                    disabled={submitting}
                  >
                    <Heart className="mr-2 h-5 w-5" />
                    {submitting ? 'Procesando...' : 'Proceder con la Donación'}
                  </Button>
                  
                  <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                    Procesamiento seguro • Recibo fiscal disponible • Transparencia total
                  </p>
                </form>
              </CardContent>
            </Card>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Confirmación de Pago */}
      <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
        <DialogContent className="max-w-lg w-full mx-4">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Información de Pago
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-3">
            {/* Información de pago */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Destinatario:</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">{donationProject?.recipientName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Monto:</span>
                <span className="text-lg font-bold text-primary">{formatCurrency(parseFloat(formData.amount))}</span>
              </div>
              <div>
                <span className="text-sm font-medium">Número de Cuenta:</span>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-mono bg-gray-50 dark:bg-gray-800 p-2 rounded border mt-1">
                  {donationProject?.accountNumber}
                </p>
              </div>
            </div>

            {/* Código QR */}
            {donationProject?.qrImageUrl && donationProject.qrImageUrl.trim() !== '' ? (
              <div className="text-center space-y-2">
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                  Código QR para Pago
                </h3>
                <div className="inline-block p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm border">
                  <img
                    src={donationProject.qrImageUrl}
                    alt={donationProject.qrImageAlt || 'Código QR para pago'}
                    width={180}
                    height={180}
                    className="rounded"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Escanea el código QR con tu aplicación bancaria
                </p>
              </div>
            ) : null}

            {/* Instrucciones */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-2">
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-1 text-xs">Instrucciones:</h4>
              <ol className="text-xs text-blue-800 dark:text-blue-200 space-y-1 list-decimal list-inside">
                <li>Realiza la transferencia bancaria al número de cuenta mostrado</li>
                <li>O escanea el código QR con tu aplicación bancaria</li>
                <li>Una vez completado el pago, confirma haciendo clic en "Pago Realizado"</li>
                <li>Si tienes problemas con el pago, puedes cerrar esta ventana y intentar más tarde</li>
              </ol>
            </div>

            {/* Botones de confirmación */}
            <div className="pt-2">
              <Button
                onClick={handlePaymentConfirmation}
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={submitting}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Pago Realizado
              </Button>
            </div>

            <p className="text-center text-xs text-gray-500 dark:text-gray-400">
              Te contactaremos para confirmar el pago.
            </p>
          </div>
        </DialogContent>
      </Dialog>

      <SiteFooter />
    </div>
  );
}