'use client'

import React from 'react';
import { SiteHeader } from '@/components/layout/site-header';
import { ArrowRight, Check } from 'lucide-react';
import Link from 'next/link';

export default function ParticiparPage() {
  return (
    <div className="min-h-screen bg-[#FDFBF8] dark:bg-[#1A202C] font-display text-[#1F2937] dark:text-[#E2E8F0]">
      <SiteHeader />

      <div className="container mx-auto px-4 py-16">
        {/* Header Section */}
        <div className="text-center mb-12">
          <span className="inline-block bg-[#D9534F] text-white text-xs font-bold px-3 py-1 rounded-md mb-4">
            NECESITAMOS TU AYUDA
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-[#1F2937] dark:text-[#E2E8F0]">
            ¿QUIERES INVOLUCRARTE?
          </h1>
        </div>

        {/* Three Cards Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-24">
          {/* Formulario Voluntariados Card */}
          <div className="bg-[#FDE68A] dark:bg-[#4A4528] p-8 rounded-lg text-center flex flex-col items-center">
            <img 
              alt="Individual volunteer holding books" 
              className="w-48 h-48 object-cover mb-6 rounded-lg" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDNoowQe1sA533prRb3qVjIH4HNB9OCrmnSUR2XzryNwkABDCTZ9LWo9OVo1lXpKph9XpF-wPcWrWoTNZqaONOkI37zRZ_hf0nldguKJ45KH1ekiarPbDLCLK2ASQBGo119zft00SZ5Ork0I5LSz8hpx6BMofowkZrogwSIl4TaXz1T3vyLRx56jqcwBAUU9fyWQ4yqtGOE2607InXbNTNFV5WsMSv0FWZsVScRaxcoMEf53Ynp-yOTccA-TENqZ_YXB0MbV3Qiyw"
            />
            <h2 className="text-2xl font-bold mb-4 text-[#1F2937] dark:text-[#E2E8F0]">
              CONVOCATORIAS
            </h2>
            <p className="mb-6 text-[#1F2937] dark:text-[#E2E8F0]/80">
              Explora nuestras convocatorias de trabajo y consultorías. Únete a nuestro equipo y contribuye al desarrollo social de Bolivia.
            </p>
            <Link 
              className="mt-auto bg-white dark:bg-gray-800 text-[#1F2937] dark:text-[#E2E8F0] font-bold py-3 px-6 rounded-lg inline-flex items-center transition-transform hover:scale-105" 
              href="/convocatorias"
            >
              VER CONVOCATORIAS
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>

          {/* Donar Card */}
          <div className="bg-[#A5F3FC] dark:bg-[#1E40AF] p-8 rounded-lg text-center flex flex-col items-center">
            <img 
              alt="Two people partnering on a project" 
              className="w-48 h-48 object-cover mb-6 rounded-lg" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuA0pGgRLmEmN3uyq8qS0lEiLd_PUulGAWf178KTggRIwuRJXUaMKHIAp2sY6vb6gXon-Boh5q4_HpABLTsxXnEOZV-neRH42ANRT-y9Pla1JKcdNCzu76Rs0X5nis-Yb5tw--_vepp-GXEGkDMcBaqX1ETbrS_leSN96BEkGR0CLyKpBLvynGon4uxbhJAIOD80rnPA1NJISFnQXQFxAYMzzIEu-ispCJWifoY2bYCI4oSDhdKPTgCQSNLX-81vAU1oF8O-5e0PqQ"
            />
            <h2 className="text-2xl font-bold mb-4 text-[#1F2937] dark:text-[#E2E8F0]">
              DONAR
            </h2>
            <p className="mb-6 text-[#1F2937] dark:text-[#E2E8F0]/80">
              Tu donación tiene el poder de transformar vidas. Contribuye con recursos económicos para apoyar nuestros programas y proyectos sociales.
            </p>
            <Link 
              className="mt-auto bg-white dark:bg-gray-800 text-[#1F2937] dark:text-[#E2E8F0] font-bold py-3 px-6 rounded-lg inline-flex items-center transition-transform hover:scale-105" 
              href="/donar"
            >
              HACER DONACIÓN
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>

          {/* Alianzas Corporativas Card */}
          <div className="bg-[#FBCFE8] dark:bg-[#501B34] p-8 rounded-lg text-center flex flex-col items-center">
            <img 
              alt="Person working on a project" 
              className="w-48 h-48 object-cover mb-6 rounded-lg" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCwubKoaz0rnyaviAG8NrwJC7nmDrzfksWo9dzxw_lVV6mVL3cUp8HeJKc6r7xF0Zk1HSa8hajdJsMfB85SMbUrRMqS6N67JRiZRIlG5eJeIWg-a3eqcvIIyIVZnJ8sSTKMiajzgTnvfwlvVSdOT2kOiizvJEYrUCvkQzZ5ML0B9p-OQN-JIOpPmmF1y6nOYxrocFUBPA1alY8Ui3C6xqPQ1dBuVvhewL_UoAmYS7X0i427dzwOeeS_WIcl2Ex3zmBNEVXDhWuXjQ"
            />
            <h2 className="text-2xl font-bold mb-4 text-[#1F2937] dark:text-[#E2E8F0]">
              VOLUNTARIADOS
            </h2>
            <p className="mb-6 text-[#1F2937] dark:text-[#E2E8F0]/80">
              Únete como voluntario y contribuye con tus habilidades ayudando en programas de liderazgo, eventos especiales y actividades recreativas.
            </p>
            <a 
              className="mt-auto bg-white dark:bg-gray-800 text-[#1F2937] dark:text-[#E2E8F0] font-bold py-3 px-6 rounded-lg inline-flex items-center transition-transform hover:scale-105" 
              href="#formulario"
            >
              COMPLETAR FORMULARIO
              <ArrowRight className="ml-2 h-5 w-5" />
            </a>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row gap-16 items-start">
          {/* Contact Form */}
          <div className="md:w-1/2 bg-white dark:bg-gray-800 p-8 md:p-12 rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold mb-2 text-[#1F2937] dark:text-[#E2E8F0]">
              ¡NECESITAMOS TU VOZ, ÚNETE A NOSOTROS!
                </h2>
            <p className="mb-8 text-gray-600 dark:text-gray-400">
              Por favor usa uno de los formularios enlazados abajo. Típicamente recibirás una respuesta dentro de seis días hábiles.
            </p>
            <form action="#" className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="name">
                  Tu Nombre*
                </label>
                <input 
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-[#D9534F] focus:ring-[#D9534F] bg-gray-100 dark:bg-gray-700 text-[#1F2937] dark:text-[#E2E8F0]" 
                  id="name" 
                  name="name" 
                  type="text"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="email">
                  Email*
                </label>
                <input 
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-[#D9534F] focus:ring-[#D9534F] bg-gray-100 dark:bg-gray-700 text-[#1F2937] dark:text-[#E2E8F0]" 
                  id="email" 
                  name="email" 
                  type="email"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="phone">
                    Número de Teléfono*
                  </label>
                  <input 
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-[#D9534F] focus:ring-[#D9534F] bg-gray-100 dark:bg-gray-700 text-[#1F2937] dark:text-[#E2E8F0]" 
                    id="phone" 
                    name="phone" 
                    type="tel"
                  />
                  </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="birth">
                    Fecha de Nacimiento*
                  </label>
                  <input 
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-[#D9534F] focus:ring-[#D9534F] bg-gray-100 dark:bg-gray-700 text-[#1F2937] dark:text-[#E2E8F0]" 
                    id="birth" 
                    name="birth" 
                    placeholder="dd/mm/yyyy" 
                    type="text"
                  />
            </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="address">
                  Dirección*
                </label>
                <input 
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-[#D9534F] focus:ring-[#D9534F] bg-gray-100 dark:bg-gray-700 text-[#1F2937] dark:text-[#E2E8F0]" 
                  id="address" 
                  name="address" 
                  type="text"
                />
                    </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="occupation">
                  Ocupación
                </label>
                <input 
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-[#D9534F] focus:ring-[#D9534F] bg-gray-100 dark:bg-gray-700 text-[#1F2937] dark:text-[#E2E8F0]" 
                  id="occupation" 
                  name="occupation" 
                  type="text"
                />
              </div>
              <div>
                <button 
                  className="bg-gray-800 dark:bg-gray-900 text-white font-bold py-3 px-6 rounded-lg inline-flex items-center transition-colors hover:bg-gray-700 dark:hover:bg-gray-700" 
                  type="submit"
                >
                  ENVIAR MENSAJE
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
              </div>
            </form>
        </div>

          {/* Why Volunteer Section */}
          <div className="md:w-1/2">
            <h2 className="text-3xl font-bold mb-6 text-[#1F2937] dark:text-[#E2E8F0]">
              POR QUÉ EL VOLUNTARIADO ES IMPORTANTE
            </h2>
            <img 
              alt="A smiling volunteer helping out" 
              className="rounded-lg mb-6 w-full h-64 object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDWTtASY645QhE5lhveyVgIeI9y8nwFpoAUc3vle_ZbxYPFB0_KLeeOqJ_MIB9WSXAKMpLug43wLXS9Blzt8JoOHboZ_m8Hr4zzMv3llS1UkSZNDtJlakFapwDEUl0DZnoSwNnyWDFILIib2kheqpo7JbAt7aARtZZDULpi0Uq0bf0dJMtUhIYmat7EZkjDwYJ4yK3vNmPBOiSGCvSsIQgvVCo7jTwejW7ZGnyqrQSpopCYGHm2wE-P3GDUFBJ52Iilg_LHx98xYg"
            />
            <p className="mb-6 text-gray-600 dark:text-gray-400">
              Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.
            </p>
            <ul className="space-y-4">
              <li className="flex items-start">
                <Check className="text-[#D9534F] mr-3 h-5 w-5 mt-0.5" />
                <span className="text-gray-600 dark:text-gray-400">
                  Conoce voluntarios profesionales con ideas afines de todo el mundo.
                </span>
              </li>
              <li className="flex items-start">
                <Check className="text-[#D9534F] mr-3 h-5 w-5 mt-0.5" />
                <span className="text-gray-600 dark:text-gray-400">
                  Ayuda a comunidades necesitadas a mejorar su calidad de vida.
                </span>
              </li>
              <li className="flex items-start">
                <Check className="text-[#D9534F] mr-3 h-5 w-5 mt-0.5" />
                <span className="text-gray-600 dark:text-gray-400">
                  Una oportunidad para ampliar tus habilidades y enriquecer tu carrera.
                </span>
              </li>
              <li className="flex items-start">
                <Check className="text-[#D9534F] mr-3 h-5 w-5 mt-0.5" />
                <span className="text-gray-600 dark:text-gray-400">
                  Sé parte de nuestro trabajo defendiendo los derechos de niños y jóvenes.
                </span>
              </li>
              <li className="flex items-start">
                <Check className="text-[#D9534F] mr-3 h-5 w-5 mt-0.5" />
                <span className="text-gray-600 dark:text-gray-400">
                  Voluptuer sint occaecat cupidatat non proident.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
