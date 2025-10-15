"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { createPortal } from 'react-dom';

export const Navbar: React.FC = () => {
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isBlogOpen, setIsBlogOpen] = useState(false);
  const [isProgramasOpen, setIsProgramasOpen] = useState(false);
  const [isNosotrosOpen, setIsNosotrosOpen] = useState(false);
  const [isHistoriasOpen, setIsHistoriasOpen] = useState(false);
  const [isParticiparOpen, setIsParticiparOpen] = useState(false);
  const [isTransparenciaOpen, setIsTransparenciaOpen] = useState(false);
  const [isRecursosOpen, setIsRecursosOpen] = useState(false);
  
  const [blogButtonRef, setBlogButtonRef] = useState<HTMLButtonElement | null>(null);
  const [programasButtonRef, setProgramasButtonRef] = useState<HTMLButtonElement | null>(null);
  const [nosotrosButtonRef, setNosotrosButtonRef] = useState<HTMLButtonElement | null>(null);
  const [historiasButtonRef, setHistoriasButtonRef] = useState<HTMLButtonElement | null>(null);
  const [participarButtonRef, setParticiparButtonRef] = useState<HTMLButtonElement | null>(null);
  const [transparenciaButtonRef, setTransparenciaButtonRef] = useState<HTMLButtonElement | null>(null);
  const [recursosButtonRef, setRecursosButtonRef] = useState<HTMLButtonElement | null>(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-background-light dark:bg-background-dark relative z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Link href="/" className="text-xl sm:text-2xl font-bold text-text-light dark:text-text-dark">
              Estrella del Sur
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-6 font-condensed">
            <Link href="/" className="hover:text-primary dark:hover:text-primary font-bold uppercase text-sm">Inicio</Link>
            
            {/* Menú desplegable de Nosotros (hover) */}
            <div className="relative nosotros-dropdown">
              <button
                ref={setNosotrosButtonRef}
                onMouseEnter={() => setIsNosotrosOpen(true)}
                onMouseLeave={() => setIsNosotrosOpen(false)}
                onClick={() => {
                  setIsNosotrosOpen(false);
                  window.location.href = '/nosotros';
                }}
                className="hover:text-primary dark:hover:text-primary font-bold uppercase flex items-center text-sm"
              >
                Nosotros
                <span className={`ml-1 transition-transform duration-200 ${isNosotrosOpen ? 'rotate-45' : ''}`}>+</span>
              </button>
              
              {/* Dropdown con portal para evitar cortes */}
              {isNosotrosOpen && nosotrosButtonRef && typeof window !== 'undefined' && createPortal(
                <div 
                  className="fixed bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark rounded-md shadow-lg z-[9999] min-w-[160px]"
                  style={{
                    top: nosotrosButtonRef.getBoundingClientRect().bottom + 4,
                    left: nosotrosButtonRef.getBoundingClientRect().left + (nosotrosButtonRef.getBoundingClientRect().width / 2) - 80,
                  }}
                  onMouseEnter={() => setIsNosotrosOpen(true)}
                  onMouseLeave={() => setIsNosotrosOpen(false)}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="py-1">
                    <button 
                      className="block w-full text-left px-3 py-2 text-xs hover:text-primary dark:hover:text-primary font-bold uppercase transition-colors cursor-pointer"
                      onClick={() => {
                        setIsNosotrosOpen(false);
                        window.location.href = '/nosotros';
                      }}
                    >
                      Quiénes Somos
                    </button>
                    <button 
                      className="block w-full text-left px-3 py-2 text-xs hover:text-primary dark:hover:text-primary font-bold uppercase transition-colors cursor-pointer"
                      onClick={() => {
                        setIsNosotrosOpen(false);
                        window.location.href = '/equipo';
                      }}
                    >
                      Nuestro Equipo
                    </button>
                  </div>
                </div>,
                document.body
              )}
            </div>
            
            {/* Menú desplegable de Iniciativas (hover) */}
            <div className="relative iniciativas-dropdown">
              <button
                ref={setProgramasButtonRef}
                onMouseEnter={() => setIsProgramasOpen(true)}
                onMouseLeave={() => setIsProgramasOpen(false)}
                onClick={() => {
                  setIsProgramasOpen(false);
                  window.location.href = '/iniciativas';
                }}
                className="hover:text-primary dark:hover:text-primary font-bold uppercase flex items-center text-sm"
              >
                Iniciativas
                <span className={`ml-1 transition-transform duration-200 ${isProgramasOpen ? 'rotate-45' : ''}`}>+</span>
              </button>
              
              {/* Dropdown con portal para evitar cortes */}
              {isProgramasOpen && programasButtonRef && typeof window !== 'undefined' && createPortal(
                <div 
                  className="fixed bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark rounded-md shadow-lg z-[9999] min-w-[200px]"
                  style={{
                    top: programasButtonRef.getBoundingClientRect().bottom + 4,
                    left: programasButtonRef.getBoundingClientRect().left + (programasButtonRef.getBoundingClientRect().width / 2) - 100,
                  }}
                  onMouseEnter={() => setIsProgramasOpen(true)}
                  onMouseLeave={() => setIsProgramasOpen(false)}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="py-1">
                    <button 
                      className="block w-full text-left px-3 py-2 text-xs hover:text-primary dark:hover:text-primary font-bold uppercase transition-colors cursor-pointer"
                      onClick={() => {
                        setIsProgramasOpen(false);
                        window.location.href = '/iniciativas';
                      }}
                    >
                      Todas las Iniciativas
                    </button>
                    <button 
                      className="block w-full text-left px-3 py-2 text-xs hover:text-primary dark:hover:text-primary font-bold uppercase transition-colors cursor-pointer"
                      onClick={() => {
                        setIsProgramasOpen(false);
                        window.location.href = '/programas';
                      }}
                    >
                      Programas
                    </button>
                    <button 
                      className="block w-full text-left px-3 py-2 text-xs hover:text-primary dark:hover:text-primary font-bold uppercase transition-colors cursor-pointer"
                      onClick={() => {
                        setIsProgramasOpen(false);
                        window.location.href = '/proyectos';
                      }}
                    >
                      Proyectos
                    </button>
                    <button 
                      className="block w-full text-left px-3 py-2 text-xs hover:text-primary dark:hover:text-primary font-bold uppercase transition-colors cursor-pointer"
                      onClick={() => {
                        setIsProgramasOpen(false);
                        window.location.href = '/metodologias';
                      }}
                    >
                      Metodologías
                    </button>
                  </div>
                </div>,
                document.body
              )}
            </div>
            
            {/* Menú desplegable de Transparencia (hover) */}
            <div className="relative transparencia-dropdown">
              <button
                ref={setTransparenciaButtonRef}
                onMouseEnter={() => setIsTransparenciaOpen(true)}
                onMouseLeave={() => setIsTransparenciaOpen(false)}
                onClick={() => {
                  setIsTransparenciaOpen(false);
                  window.location.href = '/transparencia';
                }}
                className="hover:text-primary dark:hover:text-primary font-bold uppercase flex items-center text-sm"
              >
                Transparencia
                <span className={`ml-1 transition-transform duration-200 ${isTransparenciaOpen ? 'rotate-45' : ''}`}>+</span>
              </button>
              
              {/* Dropdown con portal para evitar cortes */}
              {isTransparenciaOpen && transparenciaButtonRef && typeof window !== 'undefined' && createPortal(
                <div 
                  className="fixed bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark rounded-md shadow-lg z-[9999] min-w-[180px]"
                  style={{
                    top: transparenciaButtonRef.getBoundingClientRect().bottom + 4,
                    left: transparenciaButtonRef.getBoundingClientRect().left + (transparenciaButtonRef.getBoundingClientRect().width / 2) - 90,
                  }}
                  onMouseEnter={() => setIsTransparenciaOpen(true)}
                  onMouseLeave={() => setIsTransparenciaOpen(false)}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="py-1">
                    <button 
                      className="block w-full text-left px-3 py-2 text-xs hover:text-primary dark:hover:text-primary font-bold uppercase transition-colors cursor-pointer"
                      onClick={() => {
                        setIsTransparenciaOpen(false);
                        window.location.href = '/transparencia';
                      }}
                    >
                      Información Institucional
                    </button>
                    <button 
                      className="block w-full text-left px-3 py-2 text-xs hover:text-primary dark:hover:text-primary font-bold uppercase transition-colors cursor-pointer"
                      onClick={() => {
                        setIsTransparenciaOpen(false);
                        window.location.href = '/recursos';
                      }}
                    >
                      Documentos
                    </button>
                  </div>
                </div>,
                document.body
              )}
            </div>
            
            {/* Menú desplegable de Recursos (hover) */}
            <div className="relative recursos-dropdown">
              <button
                ref={setRecursosButtonRef}
                onMouseEnter={() => setIsRecursosOpen(true)}
                onMouseLeave={() => setIsRecursosOpen(false)}
                onClick={() => {
                  setIsRecursosOpen(false);
                  window.location.href = '/recursos';
                }}
                className="hover:text-primary dark:hover:text-primary font-bold uppercase flex items-center text-sm"
              >
                Recursos
                <span className={`ml-1 transition-transform duration-200 ${isRecursosOpen ? 'rotate-45' : ''}`}>+</span>
              </button>
              
              {/* Dropdown con portal para evitar cortes */}
              {isRecursosOpen && recursosButtonRef && typeof window !== 'undefined' && createPortal(
                <div 
                  className="fixed bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark rounded-md shadow-lg z-[9999] min-w-[160px]"
                  style={{
                    top: recursosButtonRef.getBoundingClientRect().bottom + 4,
                    left: recursosButtonRef.getBoundingClientRect().left + (recursosButtonRef.getBoundingClientRect().width / 2) - 80,
                  }}
                  onMouseEnter={() => setIsRecursosOpen(true)}
                  onMouseLeave={() => setIsRecursosOpen(false)}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="py-1">
                    <button 
                      className="block w-full text-left px-3 py-2 text-xs hover:text-primary dark:hover:text-primary font-bold uppercase transition-colors cursor-pointer"
                      onClick={() => {
                        setIsRecursosOpen(false);
                        window.location.href = '/recursos';
                      }}
                    >
                      Biblioteca Digital
                    </button>
                    <button 
                      className="block w-full text-left px-3 py-2 text-xs hover:text-primary dark:hover:text-primary font-bold uppercase transition-colors cursor-pointer"
                      onClick={() => {
                        setIsRecursosOpen(false);
                        window.location.href = '/videos-testimoniales';
                      }}
                    >
                      Videos
                    </button>
                  </div>
                </div>,
                document.body
              )}
            </div>
            
            {/* Menú desplegable de Participar (hover) */}
            <div className="relative participar-dropdown">
              <button
                ref={setParticiparButtonRef}
                onMouseEnter={() => setIsParticiparOpen(true)}
                onMouseLeave={() => setIsParticiparOpen(false)}
                onClick={() => {
                  setIsParticiparOpen(false);
                  window.location.href = '/participar';
                }}
                className="hover:text-primary dark:hover:text-primary font-bold uppercase flex items-center text-sm"
              >
                Participar
                <span className={`ml-1 transition-transform duration-200 ${isParticiparOpen ? 'rotate-45' : ''}`}>+</span>
              </button>
              
              {/* Dropdown con portal para evitar cortes */}
              {isParticiparOpen && participarButtonRef && typeof window !== 'undefined' && createPortal(
                <div 
                  className="fixed bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark rounded-md shadow-lg z-[9999] min-w-[160px]"
                  style={{
                    top: participarButtonRef.getBoundingClientRect().bottom + 4,
                    left: participarButtonRef.getBoundingClientRect().left + (participarButtonRef.getBoundingClientRect().width / 2) - 80,
                  }}
                  onMouseEnter={() => setIsParticiparOpen(true)}
                  onMouseLeave={() => setIsParticiparOpen(false)}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="py-1">
                    <button 
                      className="block w-full text-left px-3 py-2 text-xs hover:text-primary dark:hover:text-primary font-bold uppercase transition-colors cursor-pointer"
                      onClick={() => {
                        setIsParticiparOpen(false);
                        window.location.href = '/participar';
                      }}
                    >
                      Cómo Participar
                    </button>
                    <button 
                      className="block w-full text-left px-3 py-2 text-xs hover:text-primary dark:hover:text-primary font-bold uppercase transition-colors cursor-pointer"
                      onClick={() => {
                        setIsParticiparOpen(false);
                        window.location.href = '/voluntariados';
                      }}
                    >
                      Voluntariados
                    </button>
                    <button 
                      className="block w-full text-left px-3 py-2 text-xs hover:text-primary dark:hover:text-primary font-bold uppercase transition-colors cursor-pointer"
                      onClick={() => {
                        setIsParticiparOpen(false);
                        window.location.href = '/convocatorias';
                      }}
                    >
                      Convocatorias
                    </button>
                  </div>
                </div>,
                document.body
              )}
            </div>
            
            {/* Menú desplegable de Historias (hover) */}
            <div className="relative historias-dropdown">
              <button
                ref={setHistoriasButtonRef}
                onMouseEnter={() => setIsHistoriasOpen(true)}
                onMouseLeave={() => setIsHistoriasOpen(false)}
                onClick={() => {
                  setIsHistoriasOpen(false);
                  window.location.href = '/historias-impacto';
                }}
                className="hover:text-primary dark:hover:text-primary font-bold uppercase flex items-center text-sm"
              >
                Historias
                <span className={`ml-1 transition-transform duration-200 ${isHistoriasOpen ? 'rotate-45' : ''}`}>+</span>
              </button>
              
              {/* Dropdown con portal para evitar cortes */}
              {isHistoriasOpen && historiasButtonRef && typeof window !== 'undefined' && createPortal(
                <div 
                  className="fixed bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark rounded-md shadow-lg z-[9999] min-w-[180px]"
                  style={{
                    top: historiasButtonRef.getBoundingClientRect().bottom + 4,
                    left: historiasButtonRef.getBoundingClientRect().left + (historiasButtonRef.getBoundingClientRect().width / 2) - 90,
                  }}
                  onMouseEnter={() => setIsHistoriasOpen(true)}
                  onMouseLeave={() => setIsHistoriasOpen(false)}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="py-1">
                    <button 
                      className="block w-full text-left px-3 py-2 text-xs hover:text-primary dark:hover:text-primary font-bold uppercase transition-colors cursor-pointer"
                      onClick={() => {
                        setIsHistoriasOpen(false);
                        window.location.href = '/historias-impacto';
                      }}
                    >
                      Historias de Impacto
                    </button>
                    <button 
                      className="block w-full text-left px-3 py-2 text-xs hover:text-primary dark:hover:text-primary font-bold uppercase transition-colors cursor-pointer"
                      onClick={() => {
                        setIsHistoriasOpen(false);
                        window.location.href = '/stories';
                      }}
                    >
                      Testimonios
                    </button>
                  </div>
                </div>,
                document.body
              )}
            </div>
            
            {/* Menú desplegable de Blog (hover) */}
            <div className="relative blog-dropdown">
              <button
                ref={setBlogButtonRef}
                onMouseEnter={() => setIsBlogOpen(true)}
                onMouseLeave={() => setIsBlogOpen(false)}
                onClick={() => {
                  setIsBlogOpen(false);
                  window.location.href = '/news-events';
                }}
                className="hover:text-primary dark:hover:text-primary font-bold uppercase flex items-center text-sm"
              >
                Blog
                <span className={`ml-1 transition-transform duration-200 ${isBlogOpen ? 'rotate-45' : ''}`}>+</span>
              </button>
              
              {/* Dropdown con portal para evitar cortes */}
              {isBlogOpen && blogButtonRef && typeof window !== 'undefined' && createPortal(
                <div 
                  className="fixed bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark rounded-md shadow-lg z-[9999] min-w-[160px]"
                  style={{
                    top: blogButtonRef.getBoundingClientRect().bottom + 4,
                    left: blogButtonRef.getBoundingClientRect().left + (blogButtonRef.getBoundingClientRect().width / 2) - 80,
                  }}
                  onMouseEnter={() => setIsBlogOpen(true)}
                  onMouseLeave={() => setIsBlogOpen(false)}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="py-1">
                    <button 
                      className="block w-full text-left px-3 py-2 text-xs hover:text-primary dark:hover:text-primary font-bold uppercase transition-colors cursor-pointer"
                      onClick={() => {
                        setIsBlogOpen(false);
                        window.location.href = '/news-events';
                      }}
                    >
                      Noticias
                    </button>
                    <button 
                      className="block w-full text-left px-3 py-2 text-xs hover:text-primary dark:hover:text-primary font-bold uppercase transition-colors cursor-pointer"
                      onClick={() => {
                        setIsBlogOpen(false);
                        window.location.href = '/news-events';
                      }}
                    >
                      Eventos
                    </button>
                  </div>
                </div>,
                document.body
              )}
            </div>
          </div>
          
          {/* Menú hamburguesa para móviles */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="flex flex-col space-y-1 p-2"
              aria-label="Toggle menu"
            >
              <div className={`w-6 h-0.5 bg-text-light dark:bg-text-dark transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></div>
              <div className={`w-6 h-0.5 bg-text-light dark:bg-text-dark transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></div>
              <div className={`w-6 h-0.5 bg-text-light dark:bg-text-dark transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></div>
            </button>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            {status === 'loading' ? (
              <div className="flex items-center text-text-light dark:text-text-dark px-4 py-2 rounded text-sm font-bold font-condensed uppercase">
                Cargando...
              </div>
            ) : session ? (
              <Link 
                href="/dashboard" 
                className="flex items-center text-text-light dark:text-text-dark px-4 py-2 rounded text-sm hover:text-primary dark:hover:text-primary font-bold font-condensed uppercase"
              >
                Panel de Control
              </Link>
            ) : (
              <Link 
                href="/sign-in" 
                className="flex items-center text-text-light dark:text-text-dark px-4 py-2 rounded text-sm hover:text-primary dark:hover:text-primary font-bold font-condensed uppercase"
              >
                Iniciar Sesión
              </Link>
            )}
            <a className="flex items-center bg-primary text-white px-4 py-2 rounded text-sm hover:bg-emerald-700 font-bold" href="/participar">
              Donar
              <span className="material-symbols-outlined ml-2 text-base">arrow_forward</span>
            </a>
          </div>
        </div>
        
        {/* Menú móvil desplegable */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark">
            <div className="px-4 py-4 space-y-4">
              {/* Enlaces de navegación */}
              <div className="space-y-3 font-condensed">
                <Link href="/" className="block hover:text-primary dark:hover:text-primary font-bold uppercase py-2" onClick={() => setIsMenuOpen(false)}>Inicio</Link>
                <Link href="/nosotros" className="block hover:text-primary dark:hover:text-primary font-bold uppercase py-2" onClick={() => setIsMenuOpen(false)}>Nosotros</Link>
                <Link href="/iniciativas" className="block hover:text-primary dark:hover:text-primary font-bold uppercase py-2" onClick={() => setIsMenuOpen(false)}>Iniciativas</Link>
                <Link href="/participar" className="block hover:text-primary dark:hover:text-primary font-bold uppercase py-2" onClick={() => setIsMenuOpen(false)}>Participar</Link>
                <Link href="/historias-impacto" className="block hover:text-primary dark:hover:text-primary font-bold uppercase py-2" onClick={() => setIsMenuOpen(false)}>Historias</Link>
                <Link href="/transparencia" className="block hover:text-primary dark:hover:text-primary font-bold uppercase py-2" onClick={() => setIsMenuOpen(false)}>Transparencia</Link>
                <Link href="/recursos" className="block hover:text-primary dark:hover:text-primary font-bold uppercase py-2" onClick={() => setIsMenuOpen(false)}>Recursos</Link>
                
                {/* Submenú de Blog en móvil (solo visual) */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold uppercase text-text-light dark:text-text-dark">Blog</span>
                    <span className="text-text-light dark:text-text-dark">+</span>
                  </div>
                  <div className="ml-4 space-y-2">
                    <Link 
                      href="/news-events" 
                      className="block hover:text-primary dark:hover:text-primary font-bold uppercase py-1 text-sm transition-colors" 
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Noticias
                    </Link>
                    <Link 
                      href="/news-events" 
                      className="block hover:text-primary dark:hover:text-primary font-bold uppercase py-1 text-sm transition-colors" 
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Eventos
                    </Link>
                  </div>
                </div>
              </div>
              
              {/* Separador */}
              <div className="border-t border-border-light dark:border-border-dark pt-4">
                {/* Botones de autenticación */}
                {status === 'loading' ? (
                  <div className="flex items-center text-text-light dark:text-text-dark px-4 py-2 rounded text-sm font-bold font-condensed uppercase">
                    Cargando...
                  </div>
                ) : session ? (
                  <Link 
                    href="/dashboard" 
                    className="flex items-center text-text-light dark:text-text-dark px-4 py-2 rounded text-sm hover:text-primary dark:hover:text-primary font-bold font-condensed uppercase"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Panel de Control
                  </Link>
                ) : (
                  <Link 
                    href="/sign-in" 
                    className="flex items-center text-text-light dark:text-text-dark px-4 py-2 rounded text-sm hover:text-primary dark:hover:text-primary font-bold font-condensed uppercase"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Iniciar Sesión
                  </Link>
                )}
                
                {/* Botones de acción */}
                <div className="space-y-3 mt-4">
                  <a 
                    className="flex items-center justify-center border border-text-light dark:border-text-dark px-4 py-2 rounded text-sm hover:bg-gray-100 dark:hover:bg-gray-700 font-bold" 
                    href="#"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Obtener Ayuda
                    <span className="material-symbols-outlined ml-2 text-base">arrow_forward</span>
                  </a>
                  <a 
                    className="flex items-center justify-center bg-primary text-white px-4 py-2 rounded text-sm hover:bg-emerald-700 font-bold" 
                    href="/participar"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Donar
                    <span className="material-symbols-outlined ml-2 text-base">arrow_forward</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
