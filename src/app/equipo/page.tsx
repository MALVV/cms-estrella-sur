'use client'

import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { SiteHeader } from '@/components/layout/site-header';

export default function EquipoPage() {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <SiteHeader />
      
      {/* Hero Section */}
      <main className="relative min-h-[60vh] flex items-center justify-center bg-cover bg-center" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDxj7aF9-tpq6_zWnwVuojHHQc6bgc0eYuTVzXoE54LfjueardQbB6d3EFqZK3uv57oPTiHleVgH-Yi34c27AzoP75Qy1KG7aX02vlCFgOrykyPM-7ngRDNctmwl-uvyGeoidjSDqXHYXwBToi1ZuwUrOC0WEgjGrmw6E2n9SWGVuA-jl7O9o8Jpy99P817v_9-SFCIO7Y4FJ-vvLo2jZnXag1G1XwpbZuRBQKvKBtEKeA195mYIaDVYeWR_qsqQvyMmN5lHxaP-Q4')"}}>
        <div className="absolute inset-0 bg-white/80 dark:bg-black/70"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative p-4">
              <div className="absolute inset-0 -z-10">
                <Image 
                  alt="Team collaboration" 
                  className="w-full h-full object-contain opacity-60" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuD6OIceM-_FT9G0DLEA6WqHqXlzlJU-VaRCRGc9YmiIowGpPowBftussI75QEvZB9_--dBx4PzUuEEy0IcDa2c_UceyI_2xYkO_HVTFssrxGoPHIw0omP5gMXjqYTSnA_3dvjAM7Lb8_71gI8ZwulPak0-RTUB6qMvKe9x6m10z9cuTF0uFGMHTQssgmxQqn0wX99_XKgOj86JVeNCaD1e0wfnzKVk4cA5Eww2nGD1KmW7CVDBSXCZjOxdgaJwWkcVw931k71FPm98"
                  width={400}
                  height={300}
                />
              </div>
              <div className="relative transform -rotate-6 max-w-sm mx-auto">
                <Image 
                  alt="Team meeting" 
                  className="rounded-lg shadow-2xl w-full" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuB0DKGKMYw36YxwT9YsJXl1eVtdB-GCWJZ_4WjzDxUdML2vGmj6xbZ9_DwGHVQvh1D0lRny2Gki7pbHQWxUau_Inz0RHWtE6GevDh5_mykpglJ_LQSgxeGtCVCdHkXj_urWqkI8DkcmEH4EBrDXR-5153a4nN5xOuPvOr4Vs2y0Ii2HOYhPTuOpXEheDFlaSvA3XCpWfhe04uSO1aOu70z8qif64ppIm4lQWU2hWjlhHF-fSMDaXrbvE9MC_5dHxtbxBKygXs0JoO0"
                  width={400}
                  height={300}
                />
              </div>
              <div className="relative transform rotate-3 mt-[-15%] ml-[20%] max-w-xs">
                <Image 
                  alt="Professional team" 
                  className="rounded-lg shadow-2xl w-full" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCcojMb_tNeqCrnNo1DH8v1vKFm2shH7i9X_UrDGDxoSUU6JdshPCdQy99xuAfZp_78sh87ME9W706dQ75iClppApHElnQaU0Svwngv46AOmz3-ke1ulDNpRN02F5Iujger72_L06XMRQBNEq3zPIXy7Jw7GPUm4rKpHEUBemS2jq5vmMKX_KQ3c7R0qRF0B2ZWlgIBFoMbn6UOXdsCepwN_iRMrzWpzQGLKhhitD8rxMKlOOlgf2mz6zhwgpXJV_NXcrTDU92VGkE"
                  width={300}
                  height={200}
                />
              </div>
            </div>
            <div className="text-left">
              <span className="inline-block bg-orange-400 text-gray-800 px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-sm mb-4">
                Nuestro equipo
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-text-light dark:text-text-dark leading-tight">
                PROFESIONALES<br/>
                COMPROMETIDOS<br/>
                CON EL CAMBIO
              </h1>
              <p className="mt-6 text-base text-text-light dark:text-text-dark/80 max-w-xl">
                Un equipo multidisciplinario de profesionales apasionados por el desarrollo social y la transformación comunitaria.
              </p>
              <p className="mt-4 text-base text-text-light dark:text-text-dark/80 max-w-xl">
                Cada miembro de nuestro equipo aporta experiencia única y compromiso genuino para crear un impacto positivo en las comunidades que servimos.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Executive Team Section */}
      <section className="py-12 bg-background-light dark:bg-background-dark">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <span className="inline-block bg-primary text-white text-xs font-bold px-3 py-1 rounded-sm mb-4">
              EQUIPO EJECUTIVO
            </span>
            <h1 className="text-4xl font-bold text-text-light dark:text-text-dark">
              ALIADOS ESTRATÉGICOS
            </h1>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-items-center mb-8">
            <div className="text-center">
              <img 
                alt="Portrait of María González" 
                className="w-64 h-80 object-cover mx-auto" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD8VUB2xLHAWgBfe1XYO7-lIP6fZh6-5bCJm9bggcbxbdADdXEV1C3EE3I4U8BgYGluLzaHwczKf3j9I0nvKUTvIp2wAK3uyYcZp6Wo2M7E0KbjYXqRoAhFHswjy8YuveSJaSAv9d2jkqak5KNi375y_88sDomAcoEoFYvPsbEctymmtN3Y3TQW_EPczouNU9ASGpu5wDX7phIuy53C9qnv7A_pZUNhquGco3FZgtOB7x6dHv36aDpjFdk856fHI_c_BDZc-BsnwCGj"
              />
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-4">Directora Ejecutiva</p>
              <h3 className="text-lg font-bold text-text-light dark:text-text-dark">MARÍA GONZÁLEZ</h3>
            </div>
            <div className="text-center">
              <img 
                alt="Portrait of Carlos Rodríguez" 
                className="w-64 h-80 object-cover mx-auto" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC62CPUR6sD9eH6myerjXANE7ArMXwiy1CIdC-QGJrVs7f-IV0rXcEWdGUGtDjiJjBrMCpGR9yUbpxEv4UrYKU7wNOi--JF66x9Dd0JrUz1ckq7RPV-CR_mNq46Zr3ERPOKRuww-dCcHc0cGiNtQ-UHKtYxSr6jB71p_A_VFu8dwpC9jIqYgiBEBlggJkP4k_lDIumYEZND4sMhyy014iiVAjQJ-GfDB49EG9AVVPbfg-G0GRCu0GuiGi_zju7TyVTrEA8y0l-a20Jc"
              />
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-4">Director de Programas</p>
              <h3 className="text-lg font-bold text-text-light dark:text-text-dark">CARLOS RODRÍGUEZ</h3>
            </div>
            <div className="text-center">
              <img 
                alt="Portrait of Ana Martínez" 
                className="w-64 h-80 object-cover mx-auto" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB8TB9v5GnZIo_48i-bx0RwDPfHMCFaY1_iDigq0pVGbqIE2QsDZv6eoR2UQJCkAXcktSEfvyCCjtRYGXybdOEtHzYtGa-sxY14hfhDIHtljyhkLbV1cgTD0Ly7sHBXR_SZcWX_1XjcJeM0Zikkp2c8dPh495kWtG14Y114VcqfimHZShUkgGbgo5oGk1iHr3_es_fhzmRTi7C8ySjQiQC0o3mwz54uuSZUdnmwitCBnKZmyp2zTPmbU3d86pjPd8e3u78t8WTMLK0y"
              />
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-4">Directora de Salud</p>
              <h3 className="text-lg font-bold text-text-light dark:text-text-dark">ANA MARTÍNEZ</h3>
            </div>
          </div>
        </div>
      </section>

      {/* Board Members Section */}
      <section className="py-8 bg-background-light dark:bg-background-dark">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <span className="inline-block bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-sm mb-4">
              NUESTROS VOLUNTARIOS
            </span>
            <h2 className="text-4xl font-bold text-text-light dark:text-text-dark">
              MIEMBROS DE LA JUNTA DIRECTIVA
            </h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 justify-items-center">
            <div className="text-center mb-8">
              <img 
                alt="Portrait of Roberto Silva" 
                className="w-64 h-80 object-cover mx-auto" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAp0ry9_ZP9ivcpzNKaQqyjzd2w18W_aUhPuaHtQUpld7iT14q6c6wJYPG20Q2BIzDkeUSvgOAzb8qlLafbIcKcwO_UJwV8W4I0Rj33PMebZX7GiHB9zI_6nlVOPr5nhbslHgzCXt_VfCQFBSfgZZ834uYPrYUDGr-rqaFsESDNUkIo1yvj0-zLpfGDOKpc5x72CHIbXpHWw-2Z9U1fMknrm1ZAJsBaB-D0qHdPR5gJ2WgLoqAmvrf74kG0zrrwkKp_9hMcPDX7xrjE"
              />
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-4">Miembro de la Junta</p>
              <h3 className="text-lg font-bold text-text-light dark:text-text-dark">ROBERTO SILVA</h3>
            </div>
            <div className="text-center mb-8">
              <img 
                alt="Portrait of Laura Fernández" 
                className="w-64 h-80 object-cover mx-auto" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA19DEMTbHYCUa6QHH2mehJ1Am9dnUFUCdp1kiUr7OXmJ4XXH2-fi2hjXHA-joladwXVLg_cF0qxt7cCNQmRaaY87vrQco6BS851hTf0jLP5BQaiO2E6BGw0oZ-CiCQdJvJUMJdyE46V4pNcas-t08yx4xaj3Zrp6kbexNyDEssNFutChKmIAuzS3Jh6pYUxEAO7_6ZRUPdGIWl0S_m3A-0gQlv_0tqJENGZv6aOrPNvw8MkD3WtBszHBrskFO9sM213jmJH39rjKNw"
              />
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-4">Miembro de la Junta</p>
              <h3 className="text-lg font-bold text-text-light dark:text-text-dark">LAURA FERNÁNDEZ</h3>
            </div>
            <div className="text-center mb-8">
              <img 
                alt="Portrait of Miguel Torres" 
                className="w-64 h-80 object-cover mx-auto" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDpg_Ju1FDIhle3KhH9ui7Xav_yg6WXsBDqRZRA7tep1T7LqLwRKoSvQ9sE8QJf-QlDZ3E8256QjU8YTnnDizPGtNvXHOGMU0F68G8Bub0cbMrukscaDTJ4kprS3Vxluzsvc4rXZCYC4FwUAy50Pg1Zy2mMVmwwLGvDtn4T6RecX9_D1BBi7ZhUwDLYEKsX4ue9gdhQpRnQDB76oJDbKjdGL9n81ZS7Pe5_6Hv2O5iJ8SjPsY-k73LwNRveEc84BTjf8Aptt2hiT6A_"
              />
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-4">Miembro de la Junta</p>
              <h3 className="text-lg font-bold text-text-light dark:text-text-dark">MIGUEL TORRES</h3>
            </div>
            <div className="text-center mb-8">
              <img 
                alt="Portrait of Diego Morales" 
                className="w-64 h-80 object-cover mx-auto" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCWrC1vNm6qk4jWNI8G5zx0MDEqN11tuFGZpsn3XUEZt1zqR2d3Pov9FsVp4dCyT_P_tED9QYIHHLFgQOEGJqfPbeHQ0PW-kDUqI3gDLNpggLkncVgIFyqwJZKAud4jvNb8OCy1nBEVdRG_mEw2hvSWIGIKgHVD6OOokhtCpVlbbOqCgKF3VOANfipDkeTnSJFAuSALsiQLJii3lezkK6xLMe__wpgSowkaQTME0Gwf7eYxlUX1KYZyCjNKqr19ncQDH0k0FMK8oGxX"
              />
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-4">Miembro de la Junta</p>
              <h3 className="text-lg font-bold text-text-light dark:text-text-dark">DIEGO MORALES</h3>
            </div>
            <div className="text-center mb-8">
              <img 
                alt="Portrait of Carmen Ruiz" 
                className="w-64 h-80 object-cover mx-auto" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDZLMPIPMrS8m2YRY3RLekYJC4DxxrJygmCO13VXBG9GB6y_NIjtrzclibffMYwHvy3h7lmlY7Ihms0uzxxKs1Ac4y0LzqCxF958HvBqAOsWA2qeuU7MPJcFIRK-NAjkGsBEueNpKs3xzQnGt0Ayurfj4qgVxUkcgWeeu4SDE_eiLaUo-x3d7wZWNjf4BPCQLWJD8A15ZlGFj-VG7Vsm2lC1_DTNGUP71Wqe3ql2L1xWoo_X84k38RytAvtWO-BFumPS8yncRY8cta4"
              />
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-4">Miembro de la Junta</p>
              <h3 className="text-lg font-bold text-text-light dark:text-text-dark">CARMEN RUIZ</h3>
            </div>
            <div className="text-center mb-8">
              <img 
                alt="Portrait of Alejandro Vargas" 
                className="w-64 h-80 object-cover mx-auto" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCHd2voHFRIzhF8s1VCbLac4N1X_ibc98eUueoFTP4seI_q9IB4ZJjy3lp0f9I5Dwkf2LwJJWkImxLiYhHpdxpizKBE--cbby0QFAyr-yBSFak26IeqCiNrHLHmdVUc4_kIAWrN_VVXxgmIrHviwtnzi9XbmRUulsfUoDvD8T1kFeTpUvTg1rI_0KcT_efvyN6-p5VJvDSS4W-LiLF5E1DXuLtnvz0CosUoIl_P1crnMA5yUtptnyJM8-AXz1Imn6R8VwvLitmcGrIZ"
              />
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-4">Miembro de la Junta</p>
              <h3 className="text-lg font-bold text-text-light dark:text-text-dark">ALEJANDRO VARGAS</h3>
            </div>
            <div className="text-center mb-8">
              <img 
                alt="Portrait of Patricia Herrera" 
                className="w-64 h-80 object-cover mx-auto" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDmllxdqHroC9H4k4RihMW73lARdeDqC2SHN-Pe9mJVZn0ns3qNbLracfSfHLnoEstAEtodMiXv0sLxKbaPDRlRzuMSZGkfykcVW-es8Wk2JK9j_BTfaT9KcY4mKUMeIQC9pL31OFxqHVDeUSCQis77l2Z5jq2xKue8vxvut6b4uLPWh4Pr1CTQe8YUnqn5cXC-a2JapQ2r8kqrbJk2I4w3GJNhyd0RnqJ-frXgGfjUg9yjYCGaCjub7w9STC-jvYdUJb_ntBN_rn6d"
              />
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-4">Miembro de la Junta</p>
              <h3 className="text-lg font-bold text-text-light dark:text-text-dark">PATRICIA HERRERA</h3>
            </div>
            <div className="text-center mb-8">
              <img 
                alt="Portrait of Fernando Castro" 
                className="w-64 h-80 object-cover mx-auto" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCUf6KXUC1osomswpkFcKdj5fgURRL8XXtQidCu3vOccrR1QVBmWQE5wYtuxqKC3qvD1lNF7p1RFr3pz-yuS7TtPpfiULYnOivG0U1GiA_37un2J2LH5SD8HEGi-ixc11iUK8JqrYl2laODkHHyvmbDQU9CHmttxVMw5m6JyqrnRJuSE4o9nBjE6IPNvXcG6fMzDE5FszxV5DV6pf_Vi090uRLCP9wkh25FF5-THe_GrJaXDJZMoXRS0hloUquZxbOXRmr5DkSh_dFa"
              />
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-4">Miembro de la Junta</p>
              <h3 className="text-lg font-bold text-text-light dark:text-text-dark">FERNANDO CASTRO</h3>
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
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-orange-600 font-bold font-condensed" asChild>
              <Link href="/nosotros">
                CONOCER MÁS SOBRE NOSOTROS
                <ArrowLeft className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}