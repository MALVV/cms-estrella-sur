'use client';

import Image from 'next/image';

export default function MetricsSection() {
  return (
    <div className="relative w-full bg-orange-200 dark:bg-orange-900 text-gray-800 dark:text-gray-200 overflow-hidden px-4 py-16 md:py-20">
      {/* Fondo del mapa mundial */}
      <div 
        className="absolute inset-0 opacity-15"
        style={{
          backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuCmkIwZ5NXu4XQH2Go2M4UQ80Nbe7p8fVryk4gHxOPg-WusYnLYKsq4JrLtCwHty3ajg-LZRvaWeALB-hytD4Wr7vKJ0T7BzlJhjvvPzRUGXiPyqK1pGZvh0irAm4x1kVctEDgp33gIfiARb6R3M77SHNFz3gIybnKtu1nuE3NmVP3tsIxp6tij429lZCJ5j9YDCAIF25FpzKfKMGznvM5b7aaYmYOXAuPN3i1Raus5scH5iuMZ3V-b7DSTgaQHu0PrALzwbf-U2L4')`,
          backgroundSize: '70%',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />

      {/* Imágenes de niños posicionadas */}
      <Image
        alt="Niña sonriente 1"
        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCmkIwZ5NXu4XQH2Go2M4UQ80Nbe7p8fVryk4gHxOPg-WusYnLYKsq4JrLtCwHty3ajg-LZRvaWeALB-hytD4Wr7vKJ0T7BzlJhjvvPzRUGXiPyqK1pGZvh0irAm4x1kVctEDgp33gIfiARb6R3M77SHNFz3gIybnKtu1nuE3NmVP3tsIxp6tij429lZCJ5j9YDCAIF25FpzKfKMGznvM5b7aaYmYOXAuPN3i1Raus5scH5iuMZ3V-b7DSTgaQHu0PrALzwbf-U2L4"
        width={80}
        height={80}
        className="absolute top-20 left-16 w-20 h-20 rounded-full object-cover shadow-lg"
      />
      
      <Image
        alt="Niña sonriente 2"
        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCmkIwZ5NXu4XQH2Go2M4UQ80Nbe7p8fVryk4gHxOPg-WusYnLYKsq4JrLtCwHty3ajg-LZRvaWeALB-hytD4Wr7vKJ0T7BzlJhjvvPzRUGXiPyqK1pGZvh0irAm4x1kVctEDgp33gIfiARb6R3M77SHNFz3gIybnKtu1nuE3NmVP3tsIxp6tij429lZCJ5j9YDCAIF25FpzKfKMGznvM5b7aaYmYOXAuPN3i1Raus5scH5iuMZ3V-b7DSTgaQHu0PrALzwbf-U2L4"
        width={80}
        height={80}
        className="absolute top-20 right-16 w-20 h-20 rounded-full object-cover shadow-lg"
      />
      
      <Image
        alt="Niño sonriente 3"
        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCmkIwZ5NXu4XQH2Go2M4UQ80Nbe7p8fVryk4gHxOPg-WusYnLYKsq4JrLtCwHty3ajg-LZRvaWeALB-hytD4Wr7vKJ0T7BzlJhjvvPzRUGXiPyqK1pGZvh0irAm4x1kVctEDgp33gIfiARb6R3M77SHNFz3gIybnKtu1nuE3NmVP3tsIxp6tij429lZCJ5j9YDCAIF25FpzKfKMGznvM5b7aaYmYOXAuPN3i1Raus5scH5iuMZ3V-b7DSTgaQHu0PrALzwbf-U2L4"
        width={80}
        height={80}
        className="absolute bottom-20 right-16 w-20 h-20 rounded-full object-cover shadow-lg"
      />

      <Image
        alt="Niña sonriente 4"
        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCmkIwZ5NXu4XQH2Go2M4UQ80Nbe7p8fVryk4gHxOPg-WusYnLYKsq4JrLtCwHty3ajg-LZRvaWeALB-hytD4Wr7vKJ0T7BzlJhjvvPzRUGXiPyqK1pGZvh0irAm4x1kVctEDgp33gIfiARb6R3M77SHNFz3gIybnKtu1nuE3NmVP3tsIxp6tij429lZCJ5j9YDCAIF25FpzKfKMGznvM5b7aaYmYOXAuPN3i1Raus5scH5iuMZ3V-b7DSTgaQHu0PrALzwbf-U2L4"
        width={80}
        height={80}
        className="absolute bottom-20 left-16 w-20 h-20 rounded-full object-cover shadow-lg"
      />

      {/* Contenido principal */}
      <div className="relative z-10 text-center w-full max-w-6xl mx-auto">
        {/* Badge */}
        <span className="inline-block text-gray-800 dark:text-gray-200 text-sm font-semibold mb-6">
          EL IMPACTO QUE GENERAMOS
        </span>

        {/* Título principal */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold max-w-4xl mx-auto leading-tight text-gray-800 dark:text-gray-200 mb-10">
          CONSTRUYENDO UN MUNDO DONDE TODOS LOS NIÑOS ESTÉN SEGUROS, FUERTES Y VALORADOS
        </h1>

        {/* Número principal */}
        <div className="my-10">
          <p className="text-6xl sm:text-7xl lg:text-8xl font-extrabold text-yellow-500 tracking-tighter">
            7,200+
          </p>
          <p className="text-lg font-semibold tracking-wider text-gray-800 dark:text-gray-200">
            NIÑAS, NIÑOS, ADOLESCENTES Y JÓVENES
          </p>
        </div>

        {/* Métricas secundarias */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="text-center">
            <p className="text-4xl font-extrabold text-gray-800 dark:text-gray-200">55,000+</p>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Estudiantes
            </p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-extrabold text-gray-800 dark:text-gray-200">5,700</p>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Familias
            </p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-extrabold text-gray-800 dark:text-gray-200">120</p>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Unidades Educativas
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
