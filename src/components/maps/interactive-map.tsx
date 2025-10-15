'use client'

import React, { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { MapPin, Users, Heart, BookOpen } from 'lucide-react';

// Importar dinámicamente para evitar problemas de SSR
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);

const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);

const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);

const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);

// Importar Leaflet dinámicamente
let L: any = null;

interface LocationData {
  id: string;
  name: string;
  description: string;
  coordinates: [number, number];
  type: 'program' | 'project' | 'community' | 'office';
  programs: string[];
  beneficiaries: number;
  icon: React.ReactNode;
  color: string;
  address: string;
  contact: string;
  schedule: string;
  number: number;
}

const locations: LocationData[] = [
  {
    id: '1',
    name: 'Oficina de Quirquincho',
    description: 'Oficina principal ubicada en el Barrio San Miguel, brindando servicios integrales a la comunidad.',
    coordinates: [-17.9760202, -67.0897769],
    type: 'office',
    programs: ['Atención Integral', 'Coordinación Regional', 'Servicios Comunitarios'],
    beneficiaries: 0,
    icon: <MapPin className="h-4 w-4" />,
    color: 'bg-blue-500',
    address: 'Prolongación Adolfo Mier esq. Juan Mendoza (Barrio San Miguel)',
    contact: '52-65173',
    schedule: 'Lunes a Viernes 08:30 - 12:30 | 14:30 - 18:30',
    number: 1
  },
  {
    id: '2',
    name: 'Oficina de CEPROK',
    description: 'Centro de desarrollo comunitario ubicado en el sector Kantuta.',
    coordinates: [-17.9481736, -67.1016477],
    type: 'office',
    programs: ['Desarrollo Comunitario', 'Capacitación', 'Apoyo Social'],
    beneficiaries: 0,
    icon: <MapPin className="h-4 w-4" />,
    color: 'bg-red-500',
    address: 'Calle 7 entre C y D sector Kantuta',
    contact: '52-53384',
    schedule: 'Lunes a Viernes 08:30 - 12:30 | 14:30 - 18:30',
    number: 2
  },
  {
    id: '3',
    name: 'Oficina de Villa Challacollo',
    description: 'Oficina de atención comunitaria en Villa Challacollo.',
    coordinates: [-17.9986445, -67.1385181],
    type: 'office',
    programs: ['Atención Comunitaria', 'Servicios Sociales', 'Apoyo Familiar'],
    beneficiaries: 0,
    icon: <MapPin className="h-4 w-4" />,
    color: 'bg-green-500',
    address: 'Daniel Calvo #990 esquina Aguirre (Villa challacollo)',
    contact: '52-64381',
    schedule: 'Lunes a Viernes 08:30 - 12:30 | 14:30 - 18:30',
    number: 3
  },
  {
    id: '4',
    name: 'Oficina de San Benito - Pumas',
    description: 'Oficina ubicada en el Mercado Pumas Andinos, brindando servicios especializados.',
    coordinates: [-17.99495, -67.06797],
    type: 'office',
    programs: ['Servicios Especializados', 'Atención de Mercado', 'Apoyo Comercial'],
    beneficiaries: 0,
    icon: <MapPin className="h-4 w-4" />,
    color: 'bg-purple-500',
    address: 'Mercado Pumas Andinos',
    contact: '69832703',
    schedule: 'Lunes, Miércoles y Viernes 08:30 - 12:30 | 14:30 - 18:30',
    number: 4
  },
  {
    id: '5',
    name: 'Oficina de Vinto',
    description: 'Oficina de atención en Vinto, proporcionando servicios comunitarios.',
    coordinates: [-17.977845021337828, -67.05317770715818],
    type: 'office',
    programs: ['Servicios Comunitarios', 'Atención Local', 'Desarrollo Social'],
    beneficiaries: 0,
    icon: <MapPin className="h-4 w-4" />,
    color: 'bg-orange-500',
    address: 'A. Arce entre C. 6 de Agosto',
    contact: '69832702',
    schedule: 'Martes y Jueves 08:30 - 12:30 | 14:30 - 18:30',
    number: 5
  },
  {
    id: '6',
    name: 'Oficina de Villa Dorina',
    description: 'Oficina estratégicamente ubicada cerca de la Carretera Oruro-Cochabamba.',
    coordinates: [-17.935245212211523, -67.09675865414872],
    type: 'office',
    programs: ['Servicios Regionales', 'Atención de Tránsito', 'Apoyo Logístico'],
    beneficiaries: 0,
    icon: <MapPin className="h-4 w-4" />,
    color: 'bg-pink-500',
    address: 'Urbanización Villa Dorina cerca a la Carretera Oruro-Cochabamba',
    contact: '69832702',
    schedule: 'Martes, Miércoles y Jueves 08:30 - 12:30 | 14:30 - 18:30',
    number: 6
  }
];

const InteractiveMap: React.FC = () => {
  const [isLeafletReady, setIsLeafletReady] = React.useState(false);

  useEffect(() => {
    // Importar CSS de Leaflet dinámicamente
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
    link.crossOrigin = '';
    document.head.appendChild(link);

    // Importar Leaflet dinámicamente
    import('leaflet').then((leaflet) => {
      L = leaflet.default;
      setIsLeafletReady(true);
    });

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  const getMarkerIcon = (color: string, number: number) => {
    if (!L) return null;
    
    return L.divIcon({
      className: 'custom-marker',
      html: `<div class="w-8 h-8 ${color} rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white text-sm font-bold">${number}</div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });
  };

  return (
    <div className="w-full h-[500px] rounded-lg overflow-hidden shadow-xl border border-gray-200 dark:border-gray-700 relative">
      {!isLeafletReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-gray-600 dark:text-gray-300 text-sm">Cargando mapa...</p>
          </div>
        </div>
      )}
      <MapContainer
        center={[-17.9760202, -67.0897769]} // Centro en Oruro, Bolivia
        zoom={11}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
        scrollWheelZoom={false}
        doubleClickZoom={false}
        zoomControl={true}
        dragging={true}
        touchZoom={false}
        boxZoom={false}
        keyboard={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {isLeafletReady && locations.map((location) => {
          const icon = getMarkerIcon(location.color, location.number);
          return (
            <Marker
              key={location.id}
              position={location.coordinates}
              icon={icon}
            >
            <Popup className="custom-popup">
              <div className="p-3 max-w-72">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-6 h-6 ${location.color} rounded-full flex items-center justify-center text-white text-sm font-bold`}>
                    {location.number}
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-gray-900 dark:text-gray-100">
                      {location.name}
                    </h3>
                  </div>
                </div>
                
                <p className="text-gray-600 dark:text-gray-300 mb-3 text-xs">
                  {location.description}
                </p>
                
                <div className="space-y-2 text-xs">
                  <div>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">📍 </span>
                    <span className="text-gray-600 dark:text-gray-300">{location.address}</span>
                  </div>
                  
                  <div>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">📞 </span>
                    <span className="text-gray-600 dark:text-gray-300">{location.contact}</span>
                  </div>
                  
                  <div>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">🕒 </span>
                    <span className="text-gray-600 dark:text-gray-300">{location.schedule}</span>
                  </div>
                </div>
                
                <div className="mt-3">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1 text-xs">
                    Servicios:
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {location.programs.map((program, index) => (
                      <span
                        key={index}
                        className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded"
                      >
                        {program}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
          );
        })}
      </MapContainer>
      
      <style jsx global>{`
        .custom-popup .leaflet-popup-content-wrapper {
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
        }
        
        .custom-popup .leaflet-popup-content {
          margin: 0;
          padding: 0;
        }
        
        .custom-popup .leaflet-popup-tip {
          background: white;
        }
        
        .dark .custom-popup .leaflet-popup-tip {
          background: #1f2937;
        }
        
        .dark .custom-popup .leaflet-popup-content-wrapper {
          background: #1f2937;
          color: white;
        }
      `}</style>
    </div>
  );
};

export default InteractiveMap;
