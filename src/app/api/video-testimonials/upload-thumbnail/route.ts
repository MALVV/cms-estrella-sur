import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { storageService } from '@/lib/storage-service';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    if (!file) return NextResponse.json({ error: 'No se proporcionó ningún archivo' }, { status: 400 });
    if (!file.type.startsWith('image/')) return NextResponse.json({ error: 'Solo imágenes' }, { status: 400 });

    const maxMb = Number(process.env.MAX_UPLOAD_MB || 20);
    const maxSize = maxMb * 1024 * 1024;
    if (file.size > maxSize) return NextResponse.json({ error: `El archivo es demasiado grande. Máximo ${maxMb}MB` }, { status: 400 });

    const buffer = Buffer.from(await file.arrayBuffer());
    const upload = await storageService.uploadFile(buffer, file.name, {
      bucket: process.env.AWS_S3_BUCKET || process.env.AWS_BUCKET,
      isPublic: true,
      contentType: file.type,
      prefix: 'video-testimonials-thumbnails/'
    });

    return NextResponse.json({ 
      success: true, 
      url: upload.url, 
      filename: upload.filename, 
      originalName: upload.originalName, 
      size: upload.size, 
      alt: file.name 
    });
  } catch (error) {
    console.error('Error al subir miniatura de video testimonial:', error);
    return NextResponse.json({ error: 'Error interno del servidor al subir archivo' }, { status: 500 });
  }
}


