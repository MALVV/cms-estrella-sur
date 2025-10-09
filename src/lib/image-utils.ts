/**
 * Utilidades para validación de URLs de imágenes
 */

/**
 * Valida si una URL es válida para mostrar como imagen
 * @param url - URL a validar
 * @returns true si la URL es válida para imágenes
 */
export const isValidImageUrl = (url: string | null | undefined): boolean => {
  if (!url || typeof url !== 'string') return false;
  
  try {
    const urlObj = new URL(url);
    
    // Verificar que sea HTTP o HTTPS
    if (!['http:', 'https:'].includes(urlObj.protocol)) return false;
    
    // Verificar que tenga una extensión de imagen común
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp', '.tiff'];
    const hasImageExtension = imageExtensions.some(ext => 
      urlObj.pathname.toLowerCase().includes(ext)
    );
    
    // Servicios conocidos de imágenes
    const knownImageServices = [
      'images.unsplash.com',
      'images.pexels.com',
      'picsum.photos',
      'via.placeholder.com',
      'lh3.googleusercontent.com',
      'cdn.pixabay.com',
      'source.unsplash.com',
      'picsum.photos',
      'placehold.co',
      'placeholder.com'
    ];
    
    const isKnownService = knownImageServices.some(service => 
      urlObj.hostname.includes(service)
    );
    
    // URLs base64 (data:image/...)
    const isBase64Image = url.startsWith('data:image/');
    
    return hasImageExtension || isKnownService || isBase64Image;
  } catch {
    return false;
  }
};

/**
 * Genera datos para un placeholder de imágenes inválidas o faltantes
 * @param type - Tipo de contenido ('news', 'event', 'story', etc.)
 * @param hasInvalidUrl - Si tiene una URL inválida
 * @returns Objeto con datos del placeholder
 */
export const getImagePlaceholderData = (type: string = 'content', hasInvalidUrl: boolean = false) => {
  const icons = {
    news: 'article',
    event: 'event',
    story: 'auto_stories',
    project: 'work',
    methodology: 'science',
    ally: 'handshake',
    content: 'image'
  };
  
  const icon = icons[type as keyof typeof icons] || 'image';
  
  return {
    icon,
    message: hasInvalidUrl ? 'URL inválida' : 'Sin imagen',
    className: 'w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center'
  };
};

/**
 * Maneja errores de carga de imágenes
 * @param e - Evento de error
 * @param itemId - ID del elemento
 * @param imageUrl - URL de la imagen
 */
export const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>, itemId: string, imageUrl: string) => {
  console.warn(`Error cargando imagen para ${itemId}:`, imageUrl);
  // Fallback a placeholder si la imagen falla
  e.currentTarget.style.display = 'none';
};
