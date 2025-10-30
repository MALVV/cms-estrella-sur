import { NextResponse } from 'next/server';
import { storageService } from '@/lib/storage-service';

// POST { url: string }
export async function POST(req: Request) {
  try {
    const { url } = await req.json();
    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'url requerida' }, { status: 400 });
    }

    const extractBucketAndKey = (u: string): { bucket: string | null; key: string | null } => {
      try {
        const publicBase = (process.env.AWS_S3_PUBLIC_URL || process.env.AWS_URL || '').replace(/\/$/, '');
        const endpoint = (process.env.AWS_S3_ENDPOINT || process.env.AWS_ENDPOINT || '').replace(/\/$/, '');
        const envBucket = process.env.AWS_S3_BUCKET || process.env.AWS_BUCKET || '';

        // DigitalOcean Spaces virtual-hosted: https://<bucket>.<region>.digitaloceanspaces.com/<key>
        const vhMatch = u.match(/^https?:\/\/([^\.]+)\.[^\/]+digitaloceanspaces\.com\/(.+)$/);
        if (vhMatch) return { bucket: vhMatch[1], key: vhMatch[2] };

        // AWS virtual-hosted: https://<bucket>.s3.<region>.amazonaws.com/<key>
        const awsVhMatch = u.match(/^https?:\/\/([^\.]+)\.s3\.[^\/]+\.amazonaws\.com\/(.+)$/);
        if (awsVhMatch) return { bucket: awsVhMatch[1], key: awsVhMatch[2] };

        // Path-style con endpoint: https://endpoint/<bucket>/<key>
        if (endpoint && u.startsWith(endpoint + '/')) {
          const rest = u.substring((endpoint + '/').length);
          const idx = rest.indexOf('/');
          if (idx > 0) return { bucket: rest.substring(0, idx), key: rest.substring(idx + 1) };
        }

        // Base pública explícita: publicBase/key
        if (publicBase && u.startsWith(publicBase + '/')) {
          return { bucket: envBucket || null, key: u.substring((publicBase + '/').length) };
        }

        return { bucket: envBucket || null, key: null };
      } catch {
        return { bucket: null, key: null };
      }
    };

    const { bucket, key } = extractBucketAndKey(url);
    if (!bucket || !key) {
      console.warn(`[Spaces][DELETE] No se pudo determinar bucket/key de la URL: ${url}`);
      return NextResponse.json({ error: 'No se pudo determinar bucket/key de la URL', debug: { url, bucket, key } }, { status: 400 });
    }

    console.log(`[Spaces][DELETE] Eliminando imagen: ${url}`);

    try {
      await storageService.deleteFile(bucket, key);
      console.log(`[Spaces][DELETE] Imagen eliminada: ${url}`);
      return NextResponse.json({ success: true, bucket, key });
    } catch (err: any) {
      const message = String(err?.message || err);
      // Tratar NoSuchKey como éxito idempotente
      if (/NoSuchKey|NotFound|404/.test(message)) {
        console.warn('Delete Spaces: objeto no existe, considerar éxito', { bucket, key, message });
        return NextResponse.json({ success: true, bucket, key, note: 'NoSuchKey' });
      }
      console.error('Delete Spaces error:', { bucket, key, message });
      return NextResponse.json({ error: 'Error al eliminar', details: message, bucket, key }, { status: 500 });
    }
  } catch (error) {
    console.error('Error eliminando objeto:', error);
    return NextResponse.json({ error: 'Error interno al eliminar' }, { status: 500 });
  }
}


