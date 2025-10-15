'use client'

import React from 'react';
import { SiteHeader } from '@/components/layout/site-header';
import { SiteFooter } from '@/components/layout/site-footer';
import { ArrowRight, Check } from 'lucide-react';
import Link from 'next/link';

export default function ParticiparPage() {
  return (
    <div className="min-h-screen bg-[#FDFBF8] dark:bg-[#1A202C] font-display text-[#1F2937] dark:text-[#E2E8F0]">
      <SiteHeader />

       <div className="container mx-auto px-4 py-8">
        {/* ¿Quieres involucrarte? Section */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-24">
          <div className="flex flex-col gap-6">
            <div>
              <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-md">¿QUIERES INVOLUCRARTE?</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold font-display uppercase tracking-tight text-gray-900 dark:text-white">
              Da una mano amiga a quienes más lo necesitan
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Estamos trabajando directamente en el terreno, en Bolivia y alrededor del mundo, entregando ayuda humanitaria esencial. Tu participación hoy ayuda a este trabajo que salva vidas.
            </p>
            <div className="mt-4">
              <a className="inline-flex items-center gap-2 bg-gray-800 text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-700 transition-colors" href="#contacto">
                CONTÁCTANOS
                <ArrowRight className="h-5 w-5" />
              </a>
            </div>
          </div>
          
           {/* Hero Image */}
           <div className="relative h-[500px]">
             <img 
               alt="Personas trabajando juntas en comunidad" 
               className="w-full h-full object-cover rounded-xl shadow-lg" 
               src="https://lh3.googleusercontent.com/aida-public/AB6AXuAIx1tx00heJil1bwsXkts_1o3J29jKe59-7Bxk31ZSa8eDKJgQczCR-5uQIamAhmQ4WDo1FIRFNjM4e2V3dJzjTiA4-6Jo0xip4JKYg7L2oT5VY-0rqXbgoRlXtGC2DvrL5nbGYpcYsoC7j64abKKLbMTT8SQ5AlMQ6JbXYBkACgX7MaWFxO9siMrFUw4F4_nVC489CAr16AiP5j-eLpVWZEGMR1pTl7vOz0lLUt7LI6DgbjVEBYUuFiTBrPdlOfEGs8R2scMhP2E"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-xl"></div>
           </div>
        </div>

        {/* Opciones de Participación */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 font-display">
            OPCIONES DE PARTICIPACIÓN
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Descubre las diferentes formas en las que puedes contribuir y ser parte del cambio positivo en nuestras comunidades.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-10 mb-24">
          {/* Voluntariados */}
          <div className="bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 rounded-xl shadow-lg p-10 relative overflow-hidden min-h-[500px]">
            <div className="absolute -top-6 -left-6 text-9xl font-black text-white/30 font-display">01</div>
            <div className="flex flex-col items-center text-center h-full justify-between">
              <div className="flex-1 flex flex-col justify-center">
                <img 
                  alt="Voluntario trabajando" 
                  className="rounded-lg w-full h-56 object-cover mb-6" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDNoowQe1sA533prRb3qVjIH4HNB9OCrmnSUR2XzryNwkABDCTZ9LWo9OVo1lXpKph9XpF-wPcWrWoTNZqaONOkI37zRZ_hf0nldguKJ45KH1ekiarPbDLCLK2ASQBGo119zft00SZ5Ork0I5LSz8hpx6BMofowkZrogwSIl4TaXz1T3vyLRx56jqcwBAUU9fyWQ4yqtGOE2607InXbNTNFV5WsMSv0FWZsVScRaxcoMEf53Ynp-yOTccA-TENqZ_YXB0MbV3Qiyw"
                />
                <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 uppercase font-display mb-4">VOLUNTARIADOS</h3>
                <p className="text-gray-700 dark:text-gray-300 text-base mb-6 leading-relaxed">Únete como voluntario y contribuye con tus habilidades ayudando en programas de liderazgo y actividades recreativas.</p>
              </div>
              <a className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-base hover:text-blue-800 dark:hover:text-blue-300" href="/voluntariados">
                VER VOLUNTARIADOS
                <ArrowRight className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Donar */}
          <div className="bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30 rounded-xl shadow-lg p-10 relative overflow-hidden min-h-[500px]">
            <div className="absolute -top-6 -left-6 text-9xl font-black text-white/30 font-display">02</div>
            <div className="flex flex-col items-center text-center h-full justify-between">
              <div className="flex-1 flex flex-col justify-center">
                <img 
                  alt="Personas trabajando juntas" 
                  className="rounded-lg w-full h-56 object-cover mb-6" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuA0pGgRLmEmN3uyq8qS0lEiLd_PUulGAWf178KTggRIwuRJXUaMKHIAp2sY6vb6gXon-Boh5q4_HpABLTsxXnEOZV-neRH42ANRT-y9Pla1JKcdNCzu76Rs0X5nis-Yb5tw--_vepp-GXEGkDMcBaqX1ETbrS_leSN96BEkGR0CLyKpBLvynGon4uxbhJAIOD80rnPA1NJISFnQXQFxAYMzzIEu-ispCJWifoY2bYCI4oSDhdKPTgCQSNLX-81vAU1oF8O-5e0PqQ"
                />
                <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 uppercase font-display mb-4">DONAR</h3>
                <p className="text-gray-700 dark:text-gray-300 text-base mb-6 leading-relaxed">Tu donación transforma vidas y comunidades. Contribuye con recursos económicos para apoyar nuestros programas.</p>
              </div>
              <a className="inline-flex items-center gap-2 text-green-600 dark:text-green-400 font-bold text-base hover:text-green-800 dark:hover:text-green-300" href="/donar">
                HACER DONACIÓN
                <ArrowRight className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Convocatorias */}
          <div className="bg-gradient-to-br from-pink-100 to-pink-200 dark:from-pink-900/30 dark:to-pink-800/30 rounded-xl shadow-lg p-10 relative overflow-hidden min-h-[500px]">
            <div className="absolute -top-6 -left-6 text-9xl font-black text-white/30 font-display">03</div>
            <div className="flex flex-col items-center text-center h-full justify-between">
              <div className="flex-1 flex flex-col justify-center">
                <img 
                  alt="Persona trabajando en proyecto" 
                  className="rounded-lg w-full h-56 object-cover mb-6" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCwubKoaz0rnyaviAG8NrwJC7nmDrzfksWo9dzxw_lVV6mVL3cUp8HeJKc6r7xF0Zk1HSa8hajdJsMfB85SMbUrRMqS6N67JRiZRIlG5eJeIWg-a3eqcvIIyIVZnJ8sSTKMiajzgTnvfwlvVSdOT2kOiizvJEYrUCvkQzZ5ML0B9p-OQN-JIOpPmmF1y6nOYxrocFUBPA1alY8Ui3C6xqPQ1dBuVvhewL_UoAmYS7X0i427dzwOeeS_WIcl2Ex3zmBNEVXDhWuXjQ"
                />
                <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 uppercase font-display mb-4">CONVOCATORIAS</h3>
                <p className="text-gray-700 dark:text-gray-300 text-base mb-6 leading-relaxed">Explora nuestras convocatorias de trabajo y consultorías. Únete a nuestro equipo y contribuye al desarrollo social de Bolivia.</p>
              </div>
              <a className="inline-flex items-center gap-2 text-pink-600 dark:text-pink-400 font-bold text-base hover:text-pink-800 dark:hover:text-pink-300" href="/convocatorias">
                VER CONVOCATORIAS
                <ArrowRight className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row gap-16 items-start">
          {/* Contact Form */}
          <div className="md:w-1/2 bg-white dark:bg-gray-800 p-8 md:p-12 rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold mb-2 text-[#1F2937] dark:text-[#E2E8F0]">
              Formulario de Denuncia
                </h2>
            <p className="mb-8 text-gray-600 dark:text-gray-400">
              Completa el formulario con la mayor cantidad de detalles posible. Los campos marcados con * son obligatorios.
            </p>
            <form action="#" className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="tipo-denuncia">
                  Tipo de Denuncia *
                </label>
                <select 
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-[#D9534F] focus:ring-[#D9534F] bg-gray-100 dark:bg-gray-700 text-[#1F2937] dark:text-[#E2E8F0]" 
                  id="tipo-denuncia" 
                  name="tipo-denuncia"
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
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="descripcion">
                  Descripción Detallada del Incidente *
                </label>
                <textarea 
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-[#D9534F] focus:ring-[#D9534F] bg-gray-100 dark:bg-gray-700 text-[#1F2937] dark:text-[#E2E8F0]" 
                  id="descripcion" 
                  name="descripcion" 
                  rows={6}
                  placeholder="Describe lo sucedido con el mayor detalle posible: qué ocurrió, cómo, cuándo..."
                  required
                />
              </div>
              
                <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="fecha">
                  Fecha del Incidente (aproximada)
                  </label>
                  <input 
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-[#D9534F] focus:ring-[#D9534F] bg-gray-100 dark:bg-gray-700 text-[#1F2937] dark:text-[#E2E8F0]" 
                  id="fecha" 
                  name="fecha" 
                  placeholder="mm/dd/yyyy" 
                    type="text"
                  />
                </div>
              
                <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="lugar">
                  Lugar del Incidente
                  </label>
                  <input 
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-[#D9534F] focus:ring-[#D9534F] bg-gray-100 dark:bg-gray-700 text-[#1F2937] dark:text-[#E2E8F0]" 
                  id="lugar" 
                  name="lugar" 
                  placeholder="Ubicación o contexto"
                    type="text"
                  />
                </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="personas">
                  Personas Involucradas
                </label>
                <textarea 
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-[#D9534F] focus:ring-[#D9534F] bg-gray-100 dark:bg-gray-700 text-[#1F2937] dark:text-[#E2E8F0]" 
                  id="personas" 
                  name="personas" 
                  rows={3}
                  placeholder="Nombres, roles o descripción de las personas involucradas (si los conoces)"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="evidencias">
                  Evidencias o Información Adicional
                </label>
                <textarea 
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-[#D9534F] focus:ring-[#D9534F] bg-gray-100 dark:bg-gray-700 text-[#1F2937] dark:text-[#E2E8F0]" 
                  id="evidencias" 
                  name="evidencias" 
                  rows={4}
                  placeholder="¿Hay testigos? ¿Existe documentación? Cualquier información adicional relevante..."
                />
              </div>
              
              <div className="border-t border-gray-200 dark:border-gray-600 pt-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                  Información de Contacto (Opcional)
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Si deseas que te contactemos para seguimiento, proporciona tus datos. Esto es completamente opcional y no afecta el proceso de investigación.
                </p>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="nombre-contacto">
                      Nombre o Alias (opcional)
                    </label>
                    <input 
                      className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-[#D9534F] focus:ring-[#D9534F] bg-gray-100 dark:bg-gray-700 text-[#1F2937] dark:text-[#E2E8F0]" 
                      id="nombre-contacto" 
                      name="nombre-contacto" 
                      placeholder="Tu nombre o un alias"
                      type="text"
                    />
                  </div>
                  
              <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="email-contacto">
                      Email de Contacto (opcional)
                </label>
                  <input 
                      className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-[#D9534F] focus:ring-[#D9534F] bg-gray-100 dark:bg-gray-700 text-[#1F2937] dark:text-[#E2E8F0]" 
                      id="email-contacto" 
                      name="email-contacto" 
                      placeholder="tu@email.com"
                      type="email"
                    />
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                  Tu denuncia es importante
                </h4>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Al enviar este formulario, tu reporte será recibido de forma segura y confidencial por nuestro equipo de salvaguarda, quienes iniciarán una investigación siguiendo nuestros protocolos establecidos.
                </p>
              </div>
              
              <div>
                <button 
                  className="bg-[#D9534F] hover:bg-[#C9302C] text-white font-bold py-3 px-6 rounded-lg inline-flex items-center transition-colors w-full justify-center" 
                  type="submit"
                >
                  Enviar Denuncia de Forma Segura
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
              </div>
            </form>
        </div>

          {/* Why Report Section */}
          <div className="md:w-1/2">
            <h2 className="text-3xl font-bold mb-6 text-[#1F2937] dark:text-[#E2E8F0]">
              POR QUÉ ES IMPORTANTE REPORTAR
            </h2>
            <img 
              alt="Personas trabajando juntas en transparencia" 
              className="rounded-lg mb-6 w-full h-64 object-cover" 
              src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            />
            <p className="mb-6 text-gray-600 dark:text-gray-400">
              Tu reporte es fundamental para mantener la integridad y transparencia en nuestra organización. Cada denuncia nos ayuda a mejorar y proteger a quienes más lo necesitan.
            </p>
            <ul className="space-y-4">
              <li className="flex items-start">
                <Check className="text-[#D9534F] mr-3 h-5 w-5 mt-0.5" />
                <span className="text-gray-600 dark:text-gray-400">
                  Protege a los beneficiarios y personal de situaciones inapropiadas.
                </span>
              </li>
              <li className="flex items-start">
                <Check className="text-[#D9534F] mr-3 h-5 w-5 mt-0.5" />
                <span className="text-gray-600 dark:text-gray-400">
                  Mantiene la transparencia y la confianza en nuestra organización.
                </span>
              </li>
              <li className="flex items-start">
                <Check className="text-[#D9534F] mr-3 h-5 w-5 mt-0.5" />
                <span className="text-gray-600 dark:text-gray-400">
                  Contribuye a mejorar nuestros procesos y políticas internas.
                </span>
              </li>
              <li className="flex items-start">
                <Check className="text-[#D9534F] mr-3 h-5 w-5 mt-0.5" />
                <span className="text-gray-600 dark:text-gray-400">
                  Garantiza que nuestros recursos se utilicen correctamente.
                </span>
              </li>
              <li className="flex items-start">
                <Check className="text-[#D9534F] mr-3 h-5 w-5 mt-0.5" />
                <span className="text-gray-600 dark:text-gray-400">
                  Tu identidad será protegida y puedes reportar de forma anónima.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      <SiteFooter />
    </div>
  );
}
