'use client'

import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowLeft, Phone, Mail } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { SiteHeader } from '@/components/layout/site-header';
import { SiteFooter } from '@/components/layout/site-footer';

export default function EquipoPage() {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <SiteHeader />
      
      {/* Executive Team Section */}
      <section className="py-8 bg-background-light dark:bg-background-dark">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-text-light dark:text-text-dark">
              GERENCIA
            </h1>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-1 gap-8 justify-items-center mb-8">
            <div className="text-center">
              <img 
                alt="Portrait of Msc. Lic. Álvaro Waldo Vargas Martínez" 
                className="w-64 h-80 object-cover mx-auto" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD8VUB2xLHAWgBfe1XYO7-lIP6fZh6-5bCJm9bggcbxbdADdXEV1C3EE3I4U8BgYGluLzaHwczKf3j9I0nvKUTvIp2wAK3uyYcZp6Wo2M7E0KbjYXqRoAhFHswjy8YuveSJaSAv9d2jkqak5KNi375y_88sDomAcoEoFYvPsbEctymmtN3Y3TQW_EPczouNU9ASGpu5wDX7phIuy53C9qnv7A_pZUNhquGco3FZgtOB7x6dHv36aDpjFdk856fHI_c_BDZc-BsnwCGj"
              />
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-4">Gerente General</p>
              <h3 className="text-lg font-bold text-text-light dark:text-text-dark">MSC. LIC. ÁLVARO WALDO VARGAS MARTÍNEZ</h3>
              <div className="mt-1 space-y-1">
                <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-500">
                  <Phone className="h-3 w-3" />
                  <span>62221521</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-500">
                  <Mail className="h-3 w-3" />
                  <span>avargas@estrelladelsurbolivia.org</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Board Members Section */}
      <section className="py-4 bg-background-light dark:bg-background-dark">
        <div className="container mx-auto px-4 py-4">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-text-light dark:text-text-dark">
              COORDINACIÓN
            </h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 justify-items-center">
            <div className="text-center mb-8">
              <img 
                alt="Portrait of Lic. Lupe Rosario Lopez Gutierrez" 
                className="w-64 h-80 object-cover mx-auto" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAp0ry9_ZP9ivcpzNKaQqyjzd2w18W_aUhPuaHtQUpld7iT14q6c6wJYPG20Q2BIzDkeUSvgOAzb8qlLafbIcKcwO_UJwV8W4I0Rj33PMebZX7GiHB9zI_6nlVOPr5nhbslHgzCXt_VfCQFBSfgZZ834uYPrYUDGr-rqaFsESDNUkIo1yvj0-zLpfGDOKpc5x72CHIbXpHWw-2Z9U1fMknrm1ZAJsBaB-D0qHdPR5gJ2WgLoqAmvrf74kG0zrrwkKp_9hMcPDX7xrjE"
              />
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-4">Administradora Financiera</p>
              <h3 className="text-lg font-bold text-text-light dark:text-text-dark">LIC. LUPE ROSARIO LOPEZ GUTIERREZ</h3>
              <div className="mt-1 space-y-1">
                <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-500">
                  <Phone className="h-3 w-3" />
                  <span>62221520</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-500">
                  <Mail className="h-3 w-3" />
                  <span>llopez@estrelladelsurbolivia.org</span>
                </div>
              </div>
            </div>
            <div className="text-center mb-8">
              <img 
                alt="Portrait of Lic. Alexander Jessi Lopez Bustamante" 
                className="w-64 h-80 object-cover mx-auto" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA19DEMTbHYCUa6QHH2mehJ1Am9dnUFUCdp1kiUr7OXmJ4XXH2-fi2hjXHA-joladwXVLg_cF0qxt7cCNQmRaaY87vrQco6BS851hTf0jLP5BQaiO2E6BGw0oZ-CiCQdJvJUMJdyE46V4pNcas-t08yx4xaj3Zrp6kbexNyDEssNFutChKmIAuzS3Jh6pYUxEAO7_6ZRUPdGIWl0S_m3A-0gQlv_0tqJENGZv6aOrPNvw8MkD3WtBszHBrskFO9sM213jmJH39rjKNw"
              />
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-4">Coordinador de Programas y Proyectos</p>
              <h3 className="text-lg font-bold text-text-light dark:text-text-dark">LIC. ALEXANDER JESSI LOPEZ BUSTAMANTE</h3>
              <div className="mt-1 space-y-1">
                <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-500">
                  <Phone className="h-3 w-3" />
                  <span>62221522</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-500">
                  <Mail className="h-3 w-3" />
                  <span>alopez@estrelladelsurbolivia.org</span>
                </div>
              </div>
            </div>
            <div className="text-center mb-8">
              <img 
                alt="Portrait of Lic. Lourdes Arias Mamani" 
                className="w-64 h-80 object-cover mx-auto" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDpg_Ju1FDIhle3KhH9ui7Xav_yg6WXsBDqRZRA7tep1T7LqLwRKoSvQ9sE8QJf-QlDZ3E8256QjU8YTnnDizPGtNvXHOGMU0F68G8Bub0cbMrukscaDTJ4kprS3Vxluzsvc4rXZCYC4FwUAy50Pg1Zy2mMVmwwLGvDtn4T6RecX9_D1BBi7ZhUwDLYEKsX4ue9gdhQpRnQDB76oJDbKjdGL9n81ZS7Pe5_6Hv2O5iJ8SjPsY-k73LwNRveEc84BTjf8Aptt2hiT6A_"
              />
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-4">Coordinadora de Patrocinio</p>
              <h3 className="text-lg font-bold text-text-light dark:text-text-dark">LIC. LOURDES ARIAS MAMANI</h3>
              <div className="mt-1 space-y-1">
                <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-500">
                  <Phone className="h-3 w-3" />
                  <span>62221525</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-500">
                  <Mail className="h-3 w-3" />
                  <span>larias@estrelladelsurbolivia.org</span>
                </div>
              </div>
            </div>
            <div className="text-center mb-8">
              <img 
                alt="Portrait of Lic. Nestor Maurice Cazorla Murillo" 
                className="w-64 h-80 object-cover mx-auto" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCWrC1vNm6qk4jWNI8G5zx0MDEqN11tuFGZpsn3XUEZt1zqR2d3Pov9FsVp4dCyT_P_tED9QYIHHLFgQOEGJqfPbeHQ0PW-kDUqI3gDLNpggLkncVgIFyqwJZKAud4jvNb8OCy1nBEVdRG_mEw2hvSWIGIKgHVD6OOokhtCpVlbbOqCgKF3VOANfipDkeTnSJFAuSALsiQLJii3lezkK6xLMe__wpgSowkaQTME0Gwf7eYxlUX1KYZyCjNKqr19ncQDH0k0FMK8oGxX"
              />
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-4">Coordinador De Incidencia y Recaudación De Fondos</p>
              <h3 className="text-lg font-bold text-text-light dark:text-text-dark">LIC. NESTOR MAURICE CAZORLA MURILLO</h3>
              <div className="mt-1 space-y-1">
                <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-500">
                  <Phone className="h-3 w-3" />
                  <span>76389058</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-500">
                  <Mail className="h-3 w-3" />
                  <span>mcazorla@estrelladelsurbolivia.org</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Specialists Section */}
      <section className="py-8 bg-background-light dark:bg-background-dark">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-text-light dark:text-text-dark">
              ESPECIALISTAS DE ÁREA
            </h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 justify-items-center mb-12">
            <div className="text-center">
              <img 
                alt="Portrait of Lic. Omar Mendieta Condori" 
                className="w-64 h-80 object-cover mx-auto" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD8VUB2xLHAWgBfe1XYO7-lIP6fZh6-5bCJm9bggcbxbdADdXEV1C3EE3I4U8BgYGluLzaHwczKf3j9I0nvKUTvIp2wAK3uyYcZp6Wo2M7E0KbjYXqRoAhFHswjy8YuveSJaSAv9d2jkqak5KNi375y_88sDomAcoEoFYvPsbEctymmtN3Y3TQW_EPczouNU9ASGpu5wDX7phIuy53C9qnv7A_pZUNhquGco3FZgtOB7x6dHv36aDpjFdk856fHI_c_BDZc-BsnwCGj"
              />
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-4">Especialista en Innovación y Medios De Vida Ciudadana</p>
              <h4 className="text-lg font-bold text-text-light dark:text-text-dark">LIC. OMAR MENDIETA CONDORI</h4>
              <div className="mt-1 space-y-1">
                <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-500">
                  <Phone className="h-3 w-3" />
                  <span>62221523</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-500">
                  <Mail className="h-3 w-3" />
                  <span>omendieta@estrelladelsurbolivia.org</span>
                </div>
              </div>
            </div>
            <div className="text-center">
              <img 
                alt="Portrait of Lic. Omar Claros Aranda" 
                className="w-64 h-80 object-cover mx-auto" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC62CPUR6sD9eH6myerjXANE7ArMXwiy1CIdC-QGJrVs7f-IV0rXcEWdGUGtDjiJjBrMCpGR9yUbpxEv4UrYKU7wNOi--JF66x9Dd0JrUz1ckq7RPV-CR_mNq46Zr3ERPOKRuww-dCcHc0cGiNtQ-UHKtYxSr6jB71p_A_VFu8dwpC9jIqYgiBEBlggJkP4k_lDIumYEZND4sMhyy014iiVAjQJ-GfDB49EG9AVVPbfg-G0GRCu0GuiGi_zju7TyVTrEA8y0l-a20Jc"
              />
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-4">Especialista De Sostenibilidad Y Respuesta Humanitaria</p>
              <h4 className="text-lg font-bold text-text-light dark:text-text-dark">LIC. OMAR CLAROS ARANDA</h4>
              <div className="mt-1 space-y-1">
                <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-500">
                  <Phone className="h-3 w-3" />
                  <span>62221524</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-500">
                  <Mail className="h-3 w-3" />
                  <span>oclaros@estrelladelsurbolivia.org</span>
                </div>
              </div>
            </div>
            <div className="text-center">
              <img 
                alt="Portrait of Lic. Groverth Condori Atto" 
                className="w-64 h-80 object-cover mx-auto" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB8TB9v5GnZIo_48i-bx0RwDPfHMCFaY1_iDigq0pVGbqIE2QsDZv6eoR2UQJCkAXcktSEfvyCCjtRYGXybdOEtHzYtGa-sxY14hfhDIHtljyhkLbV1cgTD0Ly7sHBXR_SZcWX_1XjcJeM0Zikkp2c8dPh495kWtG14Y114VcqfimHZShUkgGbgo5oGk1iHr3_es_fhzmRTi7C8ySjQiQC0o3mwz54uuSZUdnmwitCBnKZmyp2zTPmbU3d86pjPd8e3u78t8WTMLK0y"
              />
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-4">Especialista en Proteccion Integral</p>
              <h4 className="text-lg font-bold text-text-light dark:text-text-dark">LIC. GROVERTH CONDORI ATTO</h4>
              <div className="mt-1 space-y-1">
                <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-500">
                  <Phone className="h-3 w-3" />
                  <span>62221531</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-500">
                  <Mail className="h-3 w-3" />
                  <span>gcondori@estrelladelsurbolivia.org</span>
                </div>
              </div>
            </div>
            <div className="text-center">
              <img 
                alt="Portrait of Ing. Noelia Abril Choque Irahola" 
                className="w-64 h-80 object-cover mx-auto" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAp0ry9_ZP9ivcpzNKaQqyjzd2w18W_aUhPuaHtQUpld7iT14q6c6wJYPG20Q2BIzDkeUSvgOAzb8qlLafbIcKcwO_UJwV8W4I0Rj33PMebZX7GiHB9zI_6nlVOPr5nhbslHgzCXt_VfCQFBSfgZZ834uYPrYUDGr-rqaFsESDNUkIo1yvj0-zLpfGDOKpc5x72CHIbXpHWw-2Z9U1fMknrm1ZAJsBaB-D0qHdPR5gJ2WgLoqAmvrf74kG0zrrwkKp_9hMcPDX7xrjE"
              />
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-4">Especialista de Tecnologías y Monitoreo</p>
              <h4 className="text-lg font-bold text-text-light dark:text-text-dark">ING. NOELIA ABRIL CHOQUE IRAHOLA</h4>
              <div className="mt-1 space-y-1">
                <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-500">
                  <Phone className="h-3 w-3" />
                  <span>62221532</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-500">
                  <Mail className="h-3 w-3" />
                  <span>nchoque@estrelladelsurbolivia.org</span>
                </div>
              </div>
            </div>
            <div className="text-center">
              <img 
                alt="Portrait of Lic. Felix Oscar Chavez Condori" 
                className="w-64 h-80 object-cover mx-auto" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA19DEMTbHYCUa6QHH2mehJ1Am9dnUFUCdp1kiUr7OXmJ4XXH2-fi2hjXHA-joladwXVLg_cF0qxt7cCNQmRaaY87vrQco6BS851hTf0jLP5BQaiO2E6BGw0oZ-CiCQdJvJUMJdyE46V4pNcas-t08yx4xaj3Zrp6kbexNyDEssNFutChKmIAuzS3Jh6pYUxEAO7_6ZRUPdGIWl0S_m3A-0gQlv_0tqJENGZv6aOrPNvw8MkD3WtBszHBrskFO9sM213jmJH39rjKNw"
              />
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-4">Especialista de Comunicación</p>
              <h4 className="text-lg font-bold text-text-light dark:text-text-dark">LIC. FELIX OSCAR CHAVEZ CONDORI</h4>
              <div className="mt-1 space-y-1">
                <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-500">
                  <Phone className="h-3 w-3" />
                  <span>69961197</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-500">
                  <Mail className="h-3 w-3" />
                  <span>fchavez@estrelladelsurbolivia.org</span>
                </div>
              </div>
            </div>
          </div>

          {/* Área de Patrocinio */}
          <div className="mb-12">
            <div className="text-center mb-6">
              <h3 className="text-4xl font-bold text-text-light dark:text-text-dark mb-4">ÁREA DE PATROCINIO</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 justify-items-center">
              <div className="text-center">
                <img 
                  alt="Portrait of Lic. Jesus Alexander Huayta Alcon" 
                  className="w-64 h-80 object-cover mx-auto" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDpg_Ju1FDIhle3KhH9ui7Xav_yg6WXsBDqRZRA7tep1T7LqLwRKoSvQ9sE8QJf-QlDZ3E8256QjU8YTnnDizPGtNvXHOGMU0F68G8Bub0cbMrukscaDTJ4kprS3Vxluzsvc4rXZCYC4FwUAy50Pg1Zy2mMVmwwLGvDtn4T6RecX9_D1BBi7ZhUwDLYEKsX4ue9gdhQpRnQDB76oJDbKjdGL9n81ZS7Pe5_6Hv2O5iJ8SjPsY-k73LwNRveEc84BTjf8Aptt2hiT6A_"
                />
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-4">Facilitador de Patrocinio - Zona Sudeste</p>
                <h4 className="text-lg font-bold text-text-light dark:text-text-dark">LIC. JESUS ALEXANDER HUAYTA ALCON</h4>
                <div className="mt-1 space-y-1">
                  <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-500">
                    <Phone className="h-3 w-3" />
                    <span>76155264</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-500">
                    <Mail className="h-3 w-3" />
                    <span>jhuayta@estrelladelsurbolivia.org</span>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <img 
                  alt="Portrait of Lic. Sergio Lineo Veizaga" 
                  className="w-64 h-80 object-cover mx-auto" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCWrC1vNm6qk4jWNI8G5zx0MDEqN11tuFGZpsn3XUEZt1zqR2d3Pov9FsVp4dCyT_P_tED9QYIHHLFgQOEGJqfPbeHQ0PW-kDUqI3gDLNpggLkncVgIFyqwJZKAud4jvNb8OCy1nBEVdRG_mEw2hvSWIGIKgHVD6OOokhtCpVlbbOqCgKF3VOANfipDkeTnSJFAuSALsiQLJii3lezkK6xLMe__wpgSowkaQTME0Gwf7eYxlUX1KYZyCjNKqr19ncQDH0k0FMK8oGxX"
                />
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-4">Facilitador de Patrocinio - Zona Norte</p>
                <h4 className="text-lg font-bold text-text-light dark:text-text-dark">LIC. SERGIO LINEO VEIZAGA</h4>
                <div className="mt-1 space-y-1">
                  <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-500">
                    <Phone className="h-3 w-3" />
                    <span>69777145</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-500">
                    <Mail className="h-3 w-3" />
                    <span>slineo@estrelladelsurbolivia.org</span>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <img 
                  alt="Portrait of Ing. Litzy Jhanet Huanca Gutierrez" 
                  className="w-64 h-80 object-cover mx-auto" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDZLMPIPMrS8m2YRY3RLekYJC4DxxrJygmCO13VXBG9GB6y_NIjtrzclibffMYwHvy3h7lmlY7Ihms0uzxxKs1Ac4y0LzqCxF958HvBqAOsWA2qeuU7MPJcFIRK-NAjkGsBEueNpKs3xzQnGt0Ayurfj4qgVxUkcgWeeu4SDE_eiLaUo-x3d7wZWNjf4BPCQLWJD8A15ZlGFj-VG7Vsm2lC1_DTNGUP71Wqe3ql2L1xWoo_X84k38RytAvtWO-BFumPS8yncRY8cta4"
                />
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-4">Facilitadora de Patrocinio - Zona Este</p>
                <h4 className="text-lg font-bold text-text-light dark:text-text-dark">ING. LITZY JHANET HUANCA GUTIERREZ</h4>
                <div className="mt-1 space-y-1">
                  <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-500">
                    <Phone className="h-3 w-3" />
                    <span>62221530</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-500">
                    <Mail className="h-3 w-3" />
                    <span>lhuanca@estrelladelsurbolivia.org</span>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <img 
                  alt="Portrait of Ing. Roxana Colque Abasto" 
                  className="w-64 h-80 object-cover mx-auto" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCHd2voHFRIzhF8s1VCbLac4N1X_ibc98eUueoFTP4seI_q9IB4ZJjy3lp0f9I5Dwkf2LwJJWkImxLiYhHpdxpizKBE--cbby0QFAyr-yBSFak26IeqCiNrHLHmdVUc4_kIAWrN_VVXxgmIrHviwtnzi9XbmRUulsfUoDvD8T1kFeTpUvTg1rI_0KcT_efvyN6-p5VJvDSS4W-LiLF5E1DXuLtnvz0CosUoIl_P1crnMA5yUtptnyJM8-AXz1Imn6R8VwvLitmcGrIZ"
                />
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-4">Facilitador de Patrocinio - Zona San Benito y Vinto</p>
                <h4 className="text-lg font-bold text-text-light dark:text-text-dark">ING. ROXANA COLQUE ABASTO</h4>
                <div className="mt-1 space-y-1">
                  <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-500">
                    <Phone className="h-3 w-3" />
                    <span>69832702</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-500">
                    <Mail className="h-3 w-3" />
                    <span>rcolque@estrelladelsurbolivia.org</span>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <img 
                  alt="Portrait of Ing. Daniela Condori Massi" 
                  className="w-64 h-80 object-cover mx-auto" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDmllxdqHroC9H4k4RihMW73lARdeDqC2SHN-Pe9mJVZn0ns3qNbLracfSfHLnoEstAEtodMiXv0sLxKbaPDRlRzuMSZGkfykcVW-es8Wk2JK9j_BTfaT9KcY4mKUMeIQC9pL31OFxqHVDeUSCQis77l2Z5jq2xKue8vxvut6b4uLPWh4Pr1CTQe8YUnqn5cXC-a2JapQ2r8kqrbJk2I4w3GJNhyd0RnqJ-frXgGfjUg9yjYCGaCjub7w9STC-jvYdUJb_ntBN_rn6d"
                />
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-4">Facilitadora de Patrocinio - Zona Sud</p>
                <h4 className="text-lg font-bold text-text-light dark:text-text-dark">ING. DANIELA CONDORI MASSI</h4>
                <div className="mt-1 space-y-1">
                  <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-500">
                    <Phone className="h-3 w-3" />
                    <span>62967777</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-500">
                    <Mail className="h-3 w-3" />
                    <span>dcondori@estrelladelsurbolivia.org</span>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <img 
                  alt="Portrait of Ing. Lisbeth Johanna Arquipino Mamani" 
                  className="w-64 h-80 object-cover mx-auto" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCUf6KXUC1osomswpkFcKdj5fgURRL8XXtQidCu3vOccrR1QVBmWQE5wYtuxqKC3qvD1lNF7p1RFr3pz-yuS7TtPpfiULYnOivG0U1GiA_37un2J2LH5SD8HEGi-ixc11iUK8JqrYl2laODkHHyvmbDQU9CHmttxVMw5m6JyqrnRJuSE4o9nBjE6IPNvXcG6fMzDE5FszxV5DV6pf_Vi090uRLCP9wkh25FF5-THe_GrJaXDJZMoXRS0hloUquZxbOXRmr5DkSh_dFa"
                />
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-4">Asistente de Patrocinio</p>
                <h4 className="text-lg font-bold text-text-light dark:text-text-dark">ING. LISBETH JOHANNA ARQUIPINO MAMANI</h4>
                <div className="mt-1 space-y-1">
                  <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-500">
                    <Phone className="h-3 w-3" />
                    <span>69961194</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-500">
                    <Mail className="h-3 w-3" />
                    <span>larquipino@estrelladelsurbolivia.org</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Área de Programas */}
          <div className="mb-12">
            <div className="text-center mb-6">
              <h3 className="text-4xl font-bold text-text-light dark:text-text-dark mb-4">ÁREA DE PROGRAMAS</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 justify-items-center">
              <div className="text-center">
                <img 
                  alt="Portrait of Lic. Nuvia Mariana Vargas Morales" 
                  className="w-64 h-80 object-cover mx-auto" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuD8VUB2xLHAWgBfe1XYO7-lIP6fZh6-5bCJm9bggcbxbdADdXEV1C3EE3I4U8BgYGluLzaHwczKf3j9I0nvKUTvIp2wAK3uyYcZp6Wo2M7E0KbjYXqRoAhFHswjy8YuveSJaSAv9d2jkqak5KNi375y_88sDomAcoEoFYvPsbEctymmtN3Y3TQW_EPczouNU9ASGpu5wDX7phIuy53C9qnv7A_pZUNhquGco3FZgtOB7x6dHv36aDpjFdk856fHI_c_BDZc-BsnwCGj"
                />
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-4">Facilitadora de Programas - Zona Norte</p>
                <h4 className="text-lg font-bold text-text-light dark:text-text-dark">LIC. NUVIA MARIANA VARGAS MORALES</h4>
                <div className="mt-1 space-y-1">
                  <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-500">
                    <Phone className="h-3 w-3" />
                    <span>62221527</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-500">
                    <Mail className="h-3 w-3" />
                    <span>nvargas@estrelladelsurbolivia.org</span>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <img 
                  alt="Portrait of Lic. Deysi Ramirez Zuna" 
                  className="w-64 h-80 object-cover mx-auto" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuC62CPUR6sD9eH6myerjXANE7ArMXwiy1CIdC-QGJrVs7f-IV0rXcEWdGUGtDjiJjBrMCpGR9yUbpxEv4UrYKU7wNOi--JF66x9Dd0JrUz1ckq7RPV-CR_mNq46Zr3ERPOKRuww-dCcHc0cGiNtQ-UHKtYxSr6jB71p_A_VFu8dwpC9jIqYgiBEBlggJkP4k_lDIumYEZND4sMhyy014iiVAjQJ-GfDB49EG9AVVPbfg-G0GRCu0GuiGi_zju7TyVTrEA8y0l-a20Jc"
                />
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-4">Facilitadora de Programas - Zona Sud</p>
                <h4 className="text-lg font-bold text-text-light dark:text-text-dark">LIC. DEYSI RAMIREZ ZUNA</h4>
                <div className="mt-1 space-y-1">
                  <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-500">
                    <Phone className="h-3 w-3" />
                    <span>62221534</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-500">
                    <Mail className="h-3 w-3" />
                    <span>dramirez@estrelladelsurbolivia.org</span>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <img 
                  alt="Portrait of Lic. Rosali Amanda Rafael Ortiz" 
                  className="w-64 h-80 object-cover mx-auto" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuB8TB9v5GnZIo_48i-bx0RwDPfHMCFaY1_iDigq0pVGbqIE2QsDZv6eoR2UQJCkAXcktSEfvyCCjtRYGXybdOEtHzYtGa-sxY14hfhDIHtljyhkLbV1cgTD0Ly7sHBXR_SZcWX_1XjcJeM0Zikkp2c8dPh495kWtG14Y114VcqfimHZShUkgGbgo5oGk1iHr3_es_fhzmRTi7C8ySjQiQC0o3mwz54uuSZUdnmwitCBnKZmyp2zTPmbU3d86pjPd8e3u78t8WTMLK0y"
                />
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-4">Facilitador de Programas - Zona Sudeste</p>
                <h4 className="text-lg font-bold text-text-light dark:text-text-dark">LIC. ROSALI AMANDA RAFAEL ORTIZ</h4>
                <div className="mt-1 space-y-1">
                  <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-500">
                    <Phone className="h-3 w-3" />
                    <span>62221536</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-500">
                    <Mail className="h-3 w-3" />
                    <span>rrafael@estrelladelsurbolivia.org</span>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <img 
                  alt="Portrait of Lic. Marcelo Cristian Mamani Choque" 
                  className="w-64 h-80 object-cover mx-auto" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAp0ry9_ZP9ivcpzNKaQqyjzd2w18W_aUhPuaHtQUpld7iT14q6c6wJYPG20Q2BIzDkeUSvgOAzb8qlLafbIcKcwO_UJwV8W4I0Rj33PMebZX7GiHB9zI_6nlVOPr5nhbslHgzCXt_VfCQFBSfgZZ834uYPrYUDGr-rqaFsESDNUkIo1yvj0-zLpfGDOKpc5x72CHIbXpHWw-2Z9U1fMknrm1ZAJsBaB-D0qHdPR5gJ2WgLoqAmvrf74kG0zrrwkKp_9hMcPDX7xrjE"
                />
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-4">Facilitador de Programas - Zona Este</p>
                <h4 className="text-lg font-bold text-text-light dark:text-text-dark">LIC. MARCELO CRISTIAN MAMANI CHOQUE</h4>
                <div className="mt-1 space-y-1">
                  <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-500">
                    <Phone className="h-3 w-3" />
                    <span>62221533</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-500">
                    <Mail className="h-3 w-3" />
                    <span>mmamani@estrelladelsurbolivia.org</span>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <img 
                  alt="Portrait of Lic. Marcos Alberto Ortiz Barron" 
                  className="w-64 h-80 object-cover mx-auto" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuA19DEMTbHYCUa6QHH2mehJ1Am9dnUFUCdp1kiUr7OXmJ4XXH2-fi2hjXHA-joladwXVLg_cF0qxt7cCNQmRaaY87vrQco6BS851hTf0jLP5BQaiO2E6BGw0oZ-CiCQdJvJUMJdyE46V4pNcas-t08yx4xaj3Zrp6kbexNyDEssNFutChKmIAuzS3Jh6pYUxEAO7_6ZRUPdGIWl0S_m3A-0gQlv_0tqJENGZv6aOrPNvw8MkD3WtBszHBrskFO9sM213jmJH39rjKNw"
                />
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-4">Facilitador de Programas - Zona San Benito y Vinto</p>
                <h4 className="text-lg font-bold text-text-light dark:text-text-dark">LIC. MARCOS ALBERTO ORTIZ BARRON</h4>
                <div className="mt-1 space-y-1">
                  <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-500">
                    <Phone className="h-3 w-3" />
                    <span>69832703</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-500">
                    <Mail className="h-3 w-3" />
                    <span>mortiz@estrelladelsurbolivia.org</span>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <img 
                  alt="Portrait of Lic. Alison Gabriel Mier Torrico" 
                  className="w-64 h-80 object-cover mx-auto" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDpg_Ju1FDIhle3KhH9ui7Xav_yg6WXsBDqRZRA7tep1T7LqLwRKoSvQ9sE8QJf-QlDZ3E8256QjU8YTnnDizPGtNvXHOGMU0F68G8Bub0cbMrukscaDTJ4kprS3Vxluzsvc4rXZCYC4FwUAy50Pg1Zy2mMVmwwLGvDtn4T6RecX9_D1BBi7ZhUwDLYEKsX4ue9gdhQpRnQDB76oJDbKjdGL9n81ZS7Pe5_6Hv2O5iJ8SjPsY-k73LwNRveEc84BTjf8Aptt2hiT6A_"
                />
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-4">Facilitadora de Programas - Zona San Isidro y Huajara</p>
                <h4 className="text-lg font-bold text-text-light dark:text-text-dark">LIC. ALISON GABRIEL MIER TORRICO</h4>
                <div className="mt-1 space-y-1">
                  <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-500">
                    <Phone className="h-3 w-3" />
                    <span>77018671</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-500">
                    <Mail className="h-3 w-3" />
                    <span>atorrico@estrelladelsurbolivia.org</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Área de Finanzas */}
          <div className="mb-12">
            <div className="text-center mb-6">
              <h3 className="text-4xl font-bold text-text-light dark:text-text-dark mb-4">ÁREA DE FINANZAS</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 justify-items-center">
              <div className="text-center">
                <img 
                  alt="Portrait of Lic. Pablo Abner Tejada Calizaya" 
                  className="w-64 h-80 object-cover mx-auto" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCHd2voHFRIzhF8s1VCbLac4N1X_ibc98eUueoFTP4seI_q9IB4ZJjy3lp0f9I5Dwkf2LwJJWkImxLiYhHpdxpizKBE--cbby0QFAyr-yBSFak26IeqCiNrHLHmdVUc4_kIAWrN_VVXxgmIrHviwtnzi9XbmRUulsfUoDvD8T1kFeTpUvTg1rI_0KcT_efvyN6-p5VJvDSS4W-LiLF5E1DXuLtnvz0CosUoIl_P1crnMA5yUtptnyJM8-AXz1Imn6R8VwvLitmcGrIZ"
                />
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-4">Técnico Logistico Administrativo</p>
                <h4 className="text-lg font-bold text-text-light dark:text-text-dark">LIC. PABLO ABNER TEJADA CALIZAYA</h4>
                <div className="mt-1 space-y-1">
                  <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-500">
                    <Phone className="h-3 w-3" />
                    <span>62221528</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-500">
                    <Mail className="h-3 w-3" />
                    <span>ptejada@estrelladelsurbolivia.org</span>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <img 
                  alt="Portrait of Lic. Erica Tito Caceres" 
                  className="w-64 h-80 object-cover mx-auto" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDmllxdqHroC9H4k4RihMW73lARdeDqC2SHN-Pe9mJVZn0ns3qNbLracfSfHLnoEstAEtodMiXv0sLxKbaPDRlRzuMSZGkfykcVW-es8Wk2JK9j_BTfaT9KcY4mKUMeIQC9pL31OFxqHVDeUSCQis77l2Z5jq2xKue8vxvut6b4uLPWh4Pr1CTQe8YUnqn5cXC-a2JapQ2r8kqrbJk2I4w3GJNhyd0RnqJ-frXgGfjUg9yjYCGaCjub7w9STC-jvYdUJb_ntBN_rn6d"
                />
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-4">Contadora</p>
                <h4 className="text-lg font-bold text-text-light dark:text-text-dark">LIC. ERICA TITO CACERES</h4>
                <div className="mt-1 space-y-1">
                  <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-500">
                    <Phone className="h-3 w-3" />
                    <span>73803804</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-500">
                    <Mail className="h-3 w-3" />
                    <span>etito@estrelladelsurbolivia.org</span>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <img 
                  alt="Portrait of Roxana Luz Rosales Diego" 
                  className="w-64 h-80 object-cover mx-auto" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCUf6KXUC1osomswpkFcKdj5fgURRL8XXtQidCu3vOccrR1QVBmWQE5wYtuxqKC3qvD1lNF7p1RFr3pz-yuS7TtPpfiULYnOivG0U1GiA_37un2J2LH5SD8HEGi-ixc11iUK8JqrYl2laODkHHyvmbDQU9CHmttxVMw5m6JyqrnRJuSE4o9nBjE6IPNvXcG6fMzDE5FszxV5DV6pf_Vi090uRLCP9wkh25FF5-THe_GrJaXDJZMoXRS0hloUquZxbOXRmr5DkSh_dFa"
                />
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-4">Conserje - Portera</p>
                <h4 className="text-lg font-bold text-text-light dark:text-text-dark">ROXANA LUZ ROSALES DIEGO</h4>
                <div className="mt-1 space-y-1">
                  <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-500">
                    <Phone className="h-3 w-3" />
                    <span>N/A</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-500">
                    <Mail className="h-3 w-3" />
                    <span>N/A</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-12 bg-orange-500 dark:bg-orange-600 text-white dark:text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-32 h-32 bg-white rounded-full blur-3xl"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-yellow-200 rounded-full blur-2xl"></div>
          <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-orange-200 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-8">
            <span className="inline-block bg-orange-200 text-orange-800 dark:bg-orange-300 dark:text-orange-900 text-xs font-semibold px-3 py-1 rounded-full mb-4 font-condensed">
              ÚNETE A NUESTRO EQUIPO
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white dark:text-white leading-tight font-condensed">
              ¿QUIERES SER PARTE DEL CAMBIO?
            </h2>
            <p className="text-xl text-white dark:text-white max-w-3xl mx-auto mt-4">
              Si compartes nuestra pasión por el desarrollo social y quieres contribuir a transformar comunidades,
              te invitamos a conocer nuestras oportunidades de trabajo.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-orange-600 hover:bg-orange-50 font-bold font-condensed" asChild>
              <Link href="/participar">
                VER OPORTUNIDADES
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" className="bg-black text-white hover:bg-gray-800 font-bold font-condensed" asChild>
              <Link href="/nosotros">
                CONOCER MÁS SOBRE NOSOTROS
              </Link>
            </Button>
          </div>
        </div>
      </section>
      
      <SiteFooter />
    </div>
  );
}