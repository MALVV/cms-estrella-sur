'use client'

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Mail, MapPin, Phone, Clock, AlertTriangle, Send, ArrowRight, Check, Users, Shield, Heart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { SiteHeader } from '@/components/layout/site-header';
import { SiteFooter } from '@/components/layout/site-footer';
import InteractiveMap from '@/components/maps/interactive-map';

export default function ContactoPage() {
  const [activeTab, setActiveTab] = useState<'contact' | 'complaint'>('contact');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const [complaintData, setComplaintData] = useState({
    complaintType: '',
    description: '',
    incidentDate: '',
    incidentLocation: '',
    peopleInvolved: '',
    evidence: '',
    contactName: '',
    contactEmail: ''
  });

  // Detectar parámetro de URL para abrir automáticamente la pestaña de denuncia
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const tab = urlParams.get('tab');
      const hash = window.location.hash;
      console.log('Tab parameter from URL:', tab); // Debug log
      console.log('Hash from URL:', hash); // Debug log
      
      if (tab === 'complaint' || hash === '#formularios') {
        console.log('Setting active tab to complaint'); // Debug log
        setActiveTab('complaint');
      }
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleComplaintChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setComplaintData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Formulario enviado:', formData);
    alert('Mensaje enviado correctamente. Te contactaremos pronto.');
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  const handleComplaintSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Denuncia enviada:', complaintData);
    alert('Tu denuncia ha sido enviada de forma segura. Nuestro equipo de salvaguarda la revisará siguiendo nuestros protocolos establecidos.');
    setComplaintData({
      complaintType: '',
      description: '',
      incidentDate: '',
      incidentLocation: '',
      peopleInvolved: '',
      evidence: '',
      contactName: '',
      contactEmail: ''
    });
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <SiteHeader />
      
      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center bg-hero">
        <div className="absolute inset-0 bg-black opacity-40 dark:opacity-60"></div>
        <main className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 flex justify-center">
          <div className="max-w-4xl text-white text-center">
            <motion.div 
              className="mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.5, delay: 0.3 }}
            >
              <span className="inline-block bg-orange-400 text-gray-900 text-sm font-bold uppercase px-4 py-2 tracking-wider rounded">
                CONTACTO DIRECTO
              </span>
            </motion.div>
            <motion.h1 
              className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-tight text-white mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 2, delay: 0.6 }}
            >
              ESTAMOS AQUÍ<br/>
              PARA ESCUCHARTE<br/>
              Y AYUDARTE
            </motion.h1>
            <motion.p 
              className="text-lg md:text-xl text-gray-200 max-w-3xl mx-auto mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.5, delay: 0.9 }}
            >
              Tu voz es importante para nosotros. Ponte en contacto con nosotros a través de nuestras oficinas, 
              formularios de contacto o nuestro canal de denuncias seguro.
            </motion.p>
            <motion.div 
              className="mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.5, delay: 1.2 }}
            >
              <a className="inline-flex items-center bg-primary text-white px-6 py-3 rounded-lg text-base font-bold hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl font-condensed" href="#oficinas">
                CONOCE NUESTRAS OFICINAS
                <svg className="h-5 w-5 ml-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path clipRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" fillRule="evenodd"></path>
                </svg>
              </a>
            </motion.div>
          </div>
        </main>
      </div>
      
      {/* Oficinas Section */}
      <section id="oficinas" className="py-12 bg-background-light dark:bg-background-dark">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-12">
            <motion.span 
              className="inline-block bg-primary text-white text-xs font-semibold px-3 py-1 rounded mb-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              NUESTRAS OFICINAS
            </motion.span>
            <motion.h2 
              className="text-3xl md:text-4xl font-bold text-text-light dark:text-text-dark leading-tight"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              VISÍTANOS EN CUALQUIERA DE NUESTRAS UBICACIONES
            </motion.h2>
            <motion.p 
              className="text-lg text-text-secondary-light dark:text-text-secondary-dark mt-4 max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
            >
              Contamos con oficinas estratégicamente ubicadas en diferentes zonas de Oruro para brindarte atención personalizada.
            </motion.p>
          </div>

        {/* Tarjetas de información de contacto */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            viewport={{ once: true }}
          >
          {/* Oficina de Quirquincho */}
            <motion.div 
              className="bg-card-light dark:bg-card-dark p-6 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 h-full flex flex-col"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">1</div>
              <h2 className="text-lg font-semibold text-text-light dark:text-text-dark">Oficina de Quirquincho</h2>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-start">
                <MapPin className="text-primary mr-2 h-4 w-4 mt-0.5 flex-shrink-0" />
                <span className="text-text-secondary-light dark:text-text-secondary-dark">
                  Prolongación Adolfo Mier esq. Juan Mendoza (Barrio San Miguel)
                </span>
              </div>
              <div className="flex items-start">
                <Phone className="text-primary mr-2 h-4 w-4 mt-0.5 flex-shrink-0" />
                <span className="text-text-secondary-light dark:text-text-secondary-dark">52-65173</span>
              </div>
              <div className="flex items-start">
                <Clock className="text-primary mr-2 h-4 w-4 mt-0.5 flex-shrink-0" />
                <span className="text-text-secondary-light dark:text-text-secondary-dark">
                  Lunes a Viernes 08:30 - 12:30 | 14:30 - 18:30
                </span>
              </div>
            </div>
            </motion.div>

          {/* Oficina de CEPROK */}
            <motion.div 
              className="bg-card-light dark:bg-card-dark p-6 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 h-full flex flex-col"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">2</div>
              <h2 className="text-lg font-semibold text-text-light dark:text-text-dark">Oficina de CEPROK</h2>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-start">
                <MapPin className="text-primary mr-2 h-4 w-4 mt-0.5 flex-shrink-0" />
                <span className="text-text-secondary-light dark:text-text-secondary-dark">
                  Calle 7 entre C y D sector Kantuta
                </span>
              </div>
              <div className="flex items-start">
                <Phone className="text-primary mr-2 h-4 w-4 mt-0.5 flex-shrink-0" />
                <span className="text-text-secondary-light dark:text-text-secondary-dark">52-53384</span>
              </div>
              <div className="flex items-start">
                <Clock className="text-primary mr-2 h-4 w-4 mt-0.5 flex-shrink-0" />
                <span className="text-text-secondary-light dark:text-text-secondary-dark">
                  Lunes a Viernes 08:30 - 12:30 | 14:30 - 18:30
                </span>
              </div>
            </div>
            </motion.div>

          {/* Oficina de Villa Challacollo */}
            <motion.div 
              className="bg-card-light dark:bg-card-dark p-6 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 h-full flex flex-col"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">3</div>
              <h2 className="text-lg font-semibold text-text-light dark:text-text-dark">Oficina de Villa Challacollo</h2>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-start">
                <MapPin className="text-primary mr-2 h-4 w-4 mt-0.5 flex-shrink-0" />
                <span className="text-text-secondary-light dark:text-text-secondary-dark">
                  Daniel Calvo #990 esquina Aguirre (Villa challacollo)
                </span>
              </div>
              <div className="flex items-start">
                <Phone className="text-primary mr-2 h-4 w-4 mt-0.5 flex-shrink-0" />
                <span className="text-text-secondary-light dark:text-text-secondary-dark">52-64381</span>
              </div>
              <div className="flex items-start">
                <Clock className="text-primary mr-2 h-4 w-4 mt-0.5 flex-shrink-0" />
                <span className="text-text-secondary-light dark:text-text-secondary-dark">
                  Lunes a Viernes 08:30 - 12:30 | 14:30 - 18:30
                </span>
              </div>
            </div>
            </motion.div>

          {/* Oficina de San Benito - Pumas */}
            <motion.div 
              className="bg-card-light dark:bg-card-dark p-6 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 h-full flex flex-col"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">4</div>
              <h2 className="text-lg font-semibold text-text-light dark:text-text-dark">Oficina de San Benito - Pumas</h2>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-start">
                <MapPin className="text-primary mr-2 h-4 w-4 mt-0.5 flex-shrink-0" />
                <span className="text-text-secondary-light dark:text-text-secondary-dark">
                  Mercado Pumas Andinos
                </span>
              </div>
              <div className="flex items-start">
                <Phone className="text-primary mr-2 h-4 w-4 mt-0.5 flex-shrink-0" />
                <span className="text-text-secondary-light dark:text-text-secondary-dark">69832703</span>
              </div>
              <div className="flex items-start">
                <Clock className="text-primary mr-2 h-4 w-4 mt-0.5 flex-shrink-0" />
                <span className="text-text-secondary-light dark:text-text-secondary-dark">
                  Lunes, Miércoles y Viernes 08:30 - 12:30 | 14:30 - 18:30
                </span>
              </div>
            </div>
            </motion.div>

          {/* Oficina de Vinto */}
            <motion.div 
              className="bg-card-light dark:bg-card-dark p-6 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 h-full flex flex-col"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              viewport={{ once: true }}
            >
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">5</div>
              <h2 className="text-lg font-semibold text-text-light dark:text-text-dark">Oficina de Vinto</h2>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-start">
                <MapPin className="text-primary mr-2 h-4 w-4 mt-0.5 flex-shrink-0" />
                <span className="text-text-secondary-light dark:text-text-secondary-dark">
                  A. Arce entre C. 6 de Agosto
                </span>
              </div>
              <div className="flex items-start">
                <Phone className="text-primary mr-2 h-4 w-4 mt-0.5 flex-shrink-0" />
                <span className="text-text-secondary-light dark:text-text-secondary-dark">69832702</span>
              </div>
              <div className="flex items-start">
                <Clock className="text-primary mr-2 h-4 w-4 mt-0.5 flex-shrink-0" />
                <span className="text-text-secondary-light dark:text-text-secondary-dark">
                  Martes y Jueves 08:30 - 12:30 | 14:30 - 18:30
                </span>
              </div>
            </div>
            </motion.div>

          {/* Oficina de Villa Dorina */}
            <motion.div 
              className="bg-card-light dark:bg-card-dark p-6 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 h-full flex flex-col"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
            >
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">6</div>
              <h2 className="text-lg font-semibold text-text-light dark:text-text-dark">Oficina de Villa Dorina</h2>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-start">
                <MapPin className="text-primary mr-2 h-4 w-4 mt-0.5 flex-shrink-0" />
                <span className="text-text-secondary-light dark:text-text-secondary-dark">
                  Urbanización Villa Dorina cerca a la Carretera Oruro-Cochabamba
                </span>
              </div>
              <div className="flex items-start">
                <Phone className="text-primary mr-2 h-4 w-4 mt-0.5 flex-shrink-0" />
                <span className="text-text-secondary-light dark:text-text-secondary-dark">69832702</span>
              </div>
              <div className="flex items-start">
                <Clock className="text-primary mr-2 h-4 w-4 mt-0.5 flex-shrink-0" />
                <span className="text-text-secondary-light dark:text-text-secondary-dark">
                  Martes, Miércoles y Jueves 08:30 - 12:30 | 14:30 - 18:30
                </span>
              </div>
            </div>
            </motion.div>
          </motion.div>
          </div>
      </section>

      {/* Mapa Interactivo Section */}
      <section className="py-12 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <motion.span 
              className="inline-block bg-primary text-white text-xs font-semibold px-3 py-1 rounded mb-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              MAPA INTERACTIVO
            </motion.span>
            <motion.h2 
              className="text-3xl md:text-4xl font-bold text-text-light dark:text-text-dark leading-tight"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              ENCUENTRA NUESTRAS OFICINAS
            </motion.h2>
            <motion.p 
              className="text-lg text-text-secondary-light dark:text-text-secondary-dark mt-4 max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
            >
              Explora nuestras ubicaciones en el mapa interactivo y encuentra la oficina más cercana a ti.
            </motion.p>
        </div>

          <motion.div 
            className="relative"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            viewport={{ once: true }}
          >
          <InteractiveMap />
          </motion.div>
        </div>
      </section>

        {/* Sección de Formularios con Pestañas */}
      <section id="formularios" className="py-12 bg-background-light dark:bg-background-dark">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-12">
            <motion.span 
              className="inline-block bg-primary text-white text-xs font-semibold px-3 py-1 rounded mb-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              CONTACTO DIRECTO
            </motion.span>
            <motion.h2 
              className="text-3xl md:text-4xl font-bold text-text-light dark:text-text-dark leading-tight"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              ESCRIBENOS O REPORTANOS
            </motion.h2>
            <motion.p 
              className="text-lg text-text-secondary-light dark:text-text-secondary-dark mt-4 max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
            >
              Utiliza nuestros formularios para contactarnos directamente o reportar cualquier situación que requiera nuestra atención.
            </motion.p>
          </div>

        <div className="max-w-6xl mx-auto">
            <motion.div 
              className="bg-card-light dark:bg-card-dark rounded-lg shadow-sm overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              viewport={{ once: true }}
            >
            {/* Selector de Pestañas */}
            <div className="flex border-b border-gray-200 dark:border-gray-600">
              <button
                onClick={() => setActiveTab('contact')}
                className={`flex-1 py-4 px-6 text-center font-semibold transition-colors ${
                  activeTab === 'contact'
                    ? 'bg-primary text-white border-b-2 border-primary'
                    : 'text-text-secondary-light dark:text-text-secondary-dark hover:text-text-light dark:hover:text-text-dark hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <Mail className="inline-block mr-2 h-5 w-5" />
                DEJA UN MENSAJE
              </button>
              <button
                onClick={() => setActiveTab('complaint')}
                className={`flex-1 py-4 px-6 text-center font-semibold transition-colors ${
                  activeTab === 'complaint'
                    ? 'bg-red-500 text-white border-b-2 border-red-500'
                    : 'text-text-secondary-light dark:text-text-secondary-dark hover:text-text-light dark:hover:text-text-dark hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <AlertTriangle className="inline-block mr-2 h-5 w-5" />
                CANAL DE DENUNCIAS
              </button>
            </div>

            {/* Contenido de las Pestañas */}
            <div className="p-8">
              {activeTab === 'contact' && (
                <div>
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-text-light dark:text-text-dark">QUEREMOS ESCUCHARTE</h2>
                    <p className="text-text-secondary-light dark:text-text-secondary-dark mt-2">
                      ¡Nos encantaría saber de ti! Por favor completa el formulario a continuación para ponerte en contacto.
                    </p>
                  </div>
                  
                  <div className="flex flex-col lg:flex-row gap-8 lg:items-stretch">
                    {/* Grid Izquierdo - Campos Principales */}
                    <div className="space-y-6 lg:flex-1">
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-2">
                            Tu Nombre *
                          </label>
                      <input 
                        className="w-full p-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-text-light dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary" 
                        placeholder="Tu nombre" 
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-2">
                            Email *
                          </label>
                      <input 
                        className="w-full p-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-text-light dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary" 
                            placeholder="tu@email.com" 
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-2">
                            Número de Teléfono
                          </label>
                      <input 
                        className="w-full p-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-text-light dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary" 
                        placeholder="Número de teléfono" 
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                      />
                        </div>
                      </form>
                    </div>
                    
                    {/* Grid Derecho - Mensaje y Envío */}
                    <div className="space-y-6 lg:flex-1">
                      <div className="flex flex-col h-full">
                        <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-2">
                          Mensaje *
                        </label>
                        <div className="relative flex-1">
                      <textarea 
                            className="w-full h-full p-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-text-light dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary resize-none" 
                            placeholder="Escribe tu mensaje aquí..." 
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                      />
                      <Send className="absolute bottom-3 right-3 text-text-secondary-light dark:text-text-secondary-dark" />
                        </div>
                      </div>
                    </div>
                    </div>
                    
                  {/* Botón de Envío - Ancho Completo */}
                  <div className="mt-8">
                      <button 
                      onClick={handleSubmit}
                      className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 px-6 rounded-md flex items-center justify-center space-x-2 transition-colors text-lg" 
                      type="button"
                      >
                      <span>ENVIAR MENSAJE</span>
                        <ArrowRight className="h-5 w-5" />
                      </button>
                    </div>
                </div>
              )}

              {activeTab === 'complaint' && (
                <div>
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-text-light dark:text-text-dark">SI VE ALGO DI ALGO</h2>
                    <p className="text-text-light dark:text-text-dark mt-2">
                      Completa el formulario con la mayor cantidad de detalles posible. Los campos marcados con <span className="text-red-600 dark:text-red-400">* son obligatorios.</span>
                    </p>
                  </div>

                  <div className="flex flex-col lg:flex-row gap-8 lg:items-stretch">
                    {/* Grid Izquierdo - Campos Principales */}
                    <div className="space-y-6 lg:flex-1">
                      <form onSubmit={handleComplaintSubmit} className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-red-600 dark:text-red-400 mb-2">
                            Tipo de Denuncia *
                          </label>
                          <select 
                            name="complaintType"
                            value={complaintData.complaintType}
                            onChange={handleComplaintChange}
                            className="w-full p-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-text-light dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-red-500"
                            required
                          >
                            <option value="">Selecciona el tipo de denuncia</option>
                            <option value="maltrato">Maltrato o abuso</option>
                            <option value="corrupcion">Corrupción o malversación</option>
                            <option value="discriminacion">Discriminación</option>
                            <option value="acoso">Acoso o intimidación</option>
                            <option value="negligencia">Negligencia en el servicio</option>
                            <option value="violencia">Violencia</option>
                            <option value="otro">Otro</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-2">
                            Descripción Detallada del Incidente *
                          </label>
                          <textarea 
                            name="description"
                            value={complaintData.description}
                            onChange={handleComplaintChange}
                            className="w-full p-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-text-light dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                            rows={6}
                            placeholder="Describe lo sucedido con el mayor detalle posible: qué ocurrió, cómo, cuándo..."
                            required
                          />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-red-600 dark:text-red-400 mb-2">
                              Fecha del Incidente (aproximada)
                            </label>
                            <input 
                              name="incidentDate"
                              value={complaintData.incidentDate}
                              onChange={handleComplaintChange}
                              className="w-full p-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-text-light dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-red-500"
                              type="date"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-red-600 dark:text-red-400 mb-2">
                              Lugar del Incidente
                            </label>
                            <input 
                              name="incidentLocation"
                              value={complaintData.incidentLocation}
                              onChange={handleComplaintChange}
                              className="w-full p-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-text-light dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-red-500"
                              placeholder="Ubicación o contexto"
                              type="text"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-2">
                            Personas Involucradas
                          </label>
                          <textarea 
                            name="peopleInvolved"
                            value={complaintData.peopleInvolved}
                            onChange={handleComplaintChange}
                            className="w-full p-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-text-light dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                            rows={5}
                            placeholder="Nombres, roles o descripción de las personas involucradas (si los conoces)"
                          />
                        </div>
                        
                      </form>
                    </div>

                    {/* Grid Derecho - Información de Contacto y Envío */}
                    <div className="space-y-6 lg:flex-1">
                      {/* Evidencias o Información Adicional */}
                      <div>
                        <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-2">
                          Evidencias o Información Adicional
                        </label>
                        <textarea 
                          name="evidence"
                          value={complaintData.evidence}
                          onChange={handleComplaintChange}
                          className="w-full p-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-text-light dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                          rows={5}
                          placeholder="¿Hay testigos? ¿Existe documentación? Cualquier información adicional relevante..."
                        />
                      </div>

                      {/* Información de Contacto Opcional */}
                      <div>
                        <div className="flex items-center mb-4">
                          <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">
                            ℹ
                          </div>
                          <h3 className="text-lg font-semibold text-red-600 dark:text-red-400">
                            Información de Contacto (Opcional)
                          </h3>
                        </div>
                        <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-4">
                          Si deseas que te contactemos para seguimiento, proporciona tus datos. Esto es completamente opcional y no afecta el proceso de investigación.
                        </p>
                        
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-red-600 dark:text-red-400 mb-2">
                              Nombre o Alias (opcional)
                            </label>
                            <input 
                              name="contactName"
                              value={complaintData.contactName}
                              onChange={handleComplaintChange}
                              className="w-full p-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-text-light dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-red-500"
                              placeholder="Tu nombre o un alias"
                              type="text"
                            />
                          </div>
                            
                          <div>
                            <label className="block text-sm font-medium text-red-600 dark:text-red-400 mb-2">
                              Email de Contacto (opcional)
                            </label>
                            <input 
                              name="contactEmail"
                              value={complaintData.contactEmail}
                              onChange={handleComplaintChange}
                              className="w-full p-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-text-light dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-red-500"
                              placeholder="tu@email.com"
                              type="email"
                            />
                          </div>
                          </div>
                        </div>
                        
                      {/* Mensaje de Seguridad */}
                      <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
                        <div className="flex items-center mb-2">
                          <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">
                            🛡
                          </div>
                          <h4 className="font-semibold text-red-800 dark:text-red-200 text-base">
                            Tu denuncia es importante
                          </h4>
                        </div>
                        <p className="text-sm text-red-700 dark:text-red-300">
                          Al enviar este formulario, tu reporte será recibido de forma segura y confidencial por nuestro equipo de salvaguarda, quienes iniciarán una investigación siguiendo nuestros protocolos establecidos.
                          </p>
                      </div>

                    </div>
                        </div>
                        
                  {/* Botón de Envío - Ancho Completo */}
                  <div className="mt-8">
                        <button 
                      onClick={handleComplaintSubmit}
                      className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-4 px-6 rounded-md flex items-center justify-center space-x-2 transition-colors text-lg" 
                      type="button"
                        >
                      <span>ENVIAR DENUNCIA DE FORMA SEGURA</span>
                          <AlertTriangle className="h-5 w-5" />
                        </button>
                    </div>

                  {/* Sección de Información */}
                  <div className="mt-12">
                    <h3 className="text-xl font-bold text-text-light dark:text-text-dark mb-6">
                      ¿POR QUÉ ES IMPORTANTE REPORTAR?
                    </h3>
                    
                      {/* Imagen de la sección */}
                      <div className="mb-6">
                        <img 
                          src="/static-images/sections/seccion-childfund.jpg" 
                          alt="Importancia de reportar irregularidades"
                          className="w-full h-64 object-cover rounded-lg shadow-md"
                        />
                      </div>
                      
                      {/* Texto motivacional */}
                    <div className="mb-8">
                      <p className="text-text-light dark:text-text-dark italic text-center text-lg">
                          "Tu voz es fundamental para mantener la integración y transparencia en nuestra organización. 
                          Cada denuncia nos ayuda a mejorar y proteger a quienes más lo necesitan."
                        </p>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex items-start">
                          <Check className="text-red-500 mr-3 h-5 w-5 mt-0.5 flex-shrink-0" />
                          <span className="text-text-secondary-light dark:text-text-secondary-dark">
                            Protege a los beneficiarios y personal de situaciones inapropiadas.
                          </span>
                        </div>
                        <div className="flex items-start">
                          <Check className="text-red-500 mr-3 h-5 w-5 mt-0.5 flex-shrink-0" />
                          <span className="text-text-secondary-light dark:text-text-secondary-dark">
                            Mantiene la transparencia y la confianza en nuestra organización.
                          </span>
                        </div>
                        <div className="flex items-start">
                          <Check className="text-red-500 mr-3 h-5 w-5 mt-0.5 flex-shrink-0" />
                          <span className="text-text-secondary-light dark:text-text-secondary-dark">
                            Contribuye a mejorar nuestros procesos y políticas internas.
                          </span>
                        </div>
                        <div className="flex items-start">
                          <Check className="text-red-500 mr-3 h-5 w-5 mt-0.5 flex-shrink-0" />
                          <span className="text-text-secondary-light dark:text-text-secondary-dark">
                            Garantiza que nuestros recursos se utilicen correctamente.
                          </span>
                        </div>
                        <div className="flex items-start">
                          <Check className="text-red-500 mr-3 h-5 w-5 mt-0.5 flex-shrink-0" />
                          <span className="text-text-secondary-light dark:text-text-secondary-dark">
                            Tu identidad será protegida y puedes reportar de forma anónima.
                          </span>
                        </div>
                      </div>
                    </div>

                </div>
              )}
            </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-orange-500 dark:bg-orange-600 text-white dark:text-white relative overflow-hidden">
        {/* Fondo decorativo */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-32 h-32 bg-white rounded-full blur-3xl"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-yellow-200 rounded-full blur-2xl"></div>
          <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-orange-200 rounded-full blur-3xl"></div>
      </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <motion.span 
              className="inline-block bg-orange-200 text-orange-800 dark:bg-orange-300 dark:text-orange-900 text-xs font-semibold px-3 py-1 rounded-full mb-4 font-condensed"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              TU VOZ ES IMPORTANTE
            </motion.span>
            <motion.h2 
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white dark:text-white leading-tight font-condensed"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              ¿TIENES ALGO QUE DECIR?
            </motion.h2>
            <motion.p 
              className="text-xl text-white dark:text-white max-w-3xl mx-auto mt-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
            >
              Tu opinión, sugerencias y reportes son fundamentales para mejorar nuestros servicios y mantener la transparencia en nuestra organización.
            </motion.p>
          </div>

          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            viewport={{ once: true }}
          >
            <Button size="lg" className="bg-white text-orange-600 hover:bg-orange-50 font-bold font-condensed" asChild>
              <a href="#oficinas">
                VISITA NUESTRAS OFICINAS
                <MapPin className="ml-2 h-5 w-5" />
              </a>
            </Button>
            <Button size="lg" className="bg-black text-white hover:bg-gray-800 font-bold font-condensed" asChild>
              <a href="#formularios">
                ESCRIBENOS UN MENSAJE
                <Mail className="ml-2 h-5 w-5" />
              </a>
            </Button>
          </motion.div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
