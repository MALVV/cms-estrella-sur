import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { MinIOService } from '@/lib/minioService';

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

    // Validar tamaño del archivo (máximo 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'El archivo es demasiado grande. Máximo 10MB' },
        { status: 400 }
      );
    }

    // Convertir archivo a buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Subir archivo usando MinIO
    const minioService = MinIOService.getInstance();
    const uploadResult = await minioService.uploadFile(
      buffer,
      file.name,
      {
        bucket: 'donation-proofs',
        isPublic: true,
        contentType: file.type
      }
    );

    return NextResponse.json({
      success: true,
      url: uploadResult.url,
      filename: uploadResult.filename,
      originalName: uploadResult.originalName,
      size: uploadResult.size,
      alt: file.name
    });

  } catch (error) {
    console.error('Error al subir archivo:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor al subir archivo' },
      { status: 500 }
    );
  }
}
