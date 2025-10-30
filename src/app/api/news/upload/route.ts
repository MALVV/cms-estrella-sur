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

    if (!file) {
      return NextResponse.json(
        { error: 'No se proporcionó ningún archivo' },
        { status: 400 }
      );
    }

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Solo se permiten archivos de imagen' },
        { status: 400 }
      );
    }

    // Validar tamaño del archivo (configurable por ENV, por defecto 20MB)
    const maxMb = Number(process.env.MAX_UPLOAD_MB || 20);
    const maxSize = maxMb * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: `El archivo es demasiado grande. Máximo ${maxMb}MB` },
        { status: 400 }
      );
    }

    // Convertir archivo a buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Subir archivo usando el servicio de almacenamiento
    console.log(`[News][UPLOAD] Subiendo imagen: ${file.name} (${(file.size / (1024 * 1024)).toFixed(2)} MB)`);

    const uploadResult = await storageService.uploadFile(
      buffer,
      file.name,
      {
        bucket: process.env.AWS_S3_BUCKET || process.env.AWS_BUCKET,
        isPublic: true,
        contentType: file.type,
        prefix: 'news-images/'
      }
    );

    console.log(`[News][UPLOAD] Imagen subida: ${uploadResult.url}`);

    return NextResponse.json({
      success: true,
      url: uploadResult.url,
      filename: uploadResult.filename,
      originalName: uploadResult.originalName,
      size: uploadResult.size,
      alt: file.name
    });

  } catch (error) {
    console.error('Error al subir imagen de noticia:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor al subir archivo' },
      { status: 500 }
    );
  }
}

