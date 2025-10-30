import { S3Client, PutObjectCommand, DeleteObjectCommand, ListObjectsV2Command, HeadBucketCommand, CreateBucketCommand, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

export interface UploadOptions {
  bucket?: string
  isPublic?: boolean
  contentType?: string
  prefix?: string // prefijo de carpeta dentro del bucket, por ejemplo: "news-images/"
}

export interface FileUploadResult {
  filename: string
  originalName: string
  mimeType: string
  size: number
  url: string
  bucket: string
  path: string
}

/**
 * Servicio unificado de almacenamiento que soporta AWS S3 y MinIO
 * Se determina automáticamente según las variables de entorno
 */
export class StorageService {
  private static instance: StorageService
  private s3Client?: S3Client
  private region: string
  private endpoint?: string

  constructor() {
    const AWS_S3_BUCKET = process.env.AWS_S3_BUCKET || process.env.AWS_BUCKET
    const AWS_REGION = process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION
    const AWS_S3_ENDPOINT = process.env.AWS_S3_ENDPOINT || process.env.AWS_ENDPOINT
    const AWS_S3_PUBLIC_URL = process.env.AWS_S3_PUBLIC_URL || process.env.AWS_URL

    this.region = AWS_REGION || 'us-east-1'

    this.s3Client = new S3Client({
      region: this.region,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
      ...(AWS_S3_ENDPOINT && {
        endpoint: AWS_S3_ENDPOINT,
        forcePathStyle: false,
      }),
    })
    this.endpoint = AWS_S3_ENDPOINT

    // Normalizar envs
    if (AWS_S3_BUCKET) process.env.AWS_S3_BUCKET = AWS_S3_BUCKET
    if (AWS_S3_ENDPOINT) process.env.AWS_S3_ENDPOINT = AWS_S3_ENDPOINT
    if (AWS_S3_PUBLIC_URL) process.env.AWS_S3_PUBLIC_URL = AWS_S3_PUBLIC_URL
  }

  static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService()
    }
    return StorageService.instance
  }

  /**
   * Obtiene el proveedor actual en uso
   */
  // Solo S3

  /**
   * Sube un archivo al almacenamiento
   */
  async uploadFile(
    file: Buffer | string,
    filename: string,
    options: UploadOptions = {}
  ): Promise<FileUploadResult> {
    const {
      bucket = process.env.AWS_S3_BUCKET || process.env.AWS_BUCKET || 'default',
      isPublic = false,
      contentType = 'application/octet-stream',
      prefix
    } = options

    try {
      // Asegurar que el bucket existe
      await this.ensureBucketExists(bucket)

      // Generar nombre único de archivo
      const timestamp = Date.now()
      const randomString = Math.random().toString(36).substring(2, 15)
      const fileExtension = filename.split('.').pop()
      const uniqueFilename = `${timestamp}-${randomString}.${fileExtension}`
      const normalizedPrefix = prefix
        ? prefix.endsWith('/') ? prefix : `${prefix}/`
        : ''
      const objectKey = `${normalizedPrefix}${uniqueFilename}`
      const path = `${bucket}/${objectKey}`

      const fileBuffer = Buffer.isBuffer(file) ? file : Buffer.from(file)

      // Subir archivo a S3/Spaces
      if (this.s3Client) {
        await this.s3Client.send(
          new PutObjectCommand({
            Bucket: bucket,
            Key: objectKey,
            Body: fileBuffer,
            ContentType: contentType,
            CacheControl: `${process.env.IMAGE_CACHE_MAX_AGE ? `public, max-age=${process.env.IMAGE_CACHE_MAX_AGE}` : 'public, max-age=3600'}, must-revalidate`,
            ...(isPublic && { ACL: 'public-read' }),
          })
        )

        // Generar URL
        let url: string
        if (isPublic) {
          // URL pública de S3
          if (process.env.AWS_S3_PUBLIC_URL) {
            // URL personalizada (CDN, dominio personalizado, etc.)
            url = `${process.env.AWS_S3_PUBLIC_URL.replace(/\/$/, '')}/${objectKey}`
          } else {
            // URL estándar de S3
            // Formato: https://bucket-name.s3.region.amazonaws.com/key
            // O https://s3.region.amazonaws.com/bucket-name/key si es path-style
            const endpoint = process.env.AWS_S3_ENDPOINT
            if (endpoint) {
              // Si hay endpoint personalizado, usar path-style
              const baseUrl = endpoint.replace(/\/$/, '')
              url = `${baseUrl}/${bucket}/${objectKey}`
            } else {
              url = `https://${bucket}.s3.${this.region}.amazonaws.com/${objectKey}`
            }
          }
        } else {
          // URL presignada
          const command = new GetObjectCommand({
            Bucket: bucket,
            Key: objectKey,
          })
          url = await getSignedUrl(this.s3Client, command, { expiresIn: 3600 })
        }

        const fileSizeMB = (fileBuffer.length / (1024 * 1024)).toFixed(2);
        console.log(`[StorageService][UPLOAD] Imagen subida: ${objectKey} (${fileSizeMB} MB) en bucket ${bucket}`);

        return {
          filename: objectKey,
          originalName: filename,
          mimeType: contentType,
          size: fileBuffer.length,
          url,
          bucket,
          path,
        }
      } else {
        throw new Error('No hay cliente de almacenamiento configurado')
      }
    } catch (error) {
      throw new Error(`Failed to upload file: ${error}`)
    }
  }

  /**
   * Elimina un archivo del almacenamiento
   */
  async deleteFile(bucket: string, filename: string): Promise<void> {
    try {
      if (this.s3Client) {
        console.log(`[StorageService][DELETE] Eliminando archivo: ${filename} del bucket ${bucket}`);

        const controller = new AbortController()
        const timeout = setTimeout(() => controller.abort(), 10000)
        try {
          await this.s3Client.send(
            new DeleteObjectCommand({
              Bucket: bucket,
              Key: filename,
            }),
            { abortSignal: controller.signal }
          )
          
          console.log(`[StorageService][DELETE] Archivo eliminado: ${filename}`);
        } catch (deleteError: any) {
          const errorMessage = String(deleteError?.message || deleteError);
          // Si es NoSuchKey, considerar éxito idempotente pero loguearlo
          if (/NoSuchKey|NotFound|404/.test(errorMessage)) {
            console.log(`[StorageService][DELETE] Archivo no encontrado (ya eliminado): ${filename}`);
            return; // Considerar éxito idempotente
          }
          throw deleteError;
        } finally {
          clearTimeout(timeout)
        }
      } else {
        throw new Error('No hay cliente de almacenamiento configurado')
      }
    } catch (error) {
      console.error(`[StorageService][DELETE] Error al eliminar: ${filename}`, error);
      throw new Error(`Failed to delete file: ${error}`)
    }
  }

  /**
   * Obtiene una URL presignada para un archivo
   */
  async getPresignedUrl(bucket: string, filename: string, expiry: number = 3600): Promise<string> {
    try {
      if (this.s3Client) {
        const command = new GetObjectCommand({
          Bucket: bucket,
          Key: filename,
        })
        return await getSignedUrl(this.s3Client, command, { expiresIn: expiry })
      } else {
        throw new Error('No hay cliente de almacenamiento configurado')
      }
    } catch (error) {
      throw new Error(`Failed to generate presigned URL: ${error}`)
    }
  }

  /**
   * Lista archivos en un bucket
   */
  async listFiles(bucket: string, prefix?: string): Promise<any[]> {
    try {
      if (this.s3Client) {
        const command = new ListObjectsV2Command({
          Bucket: bucket,
          Prefix: prefix,
        })
        const response = await this.s3Client.send(command)
        return response.Contents || []
      } else {
        throw new Error('No hay cliente de almacenamiento configurado')
      }
    } catch (error) {
      throw new Error(`Failed to list files: ${error}`)
    }
  }

  /**
   * Asegura que el bucket existe
   */
  private async ensureBucketExists(bucket: string): Promise<void> {
    try {
      // Para proveedores S3 administrados (p.ej. DigitalOcean Spaces), el bucket ya existe
      // y algunas operaciones como HeadBucket pueden fallar o no estar permitidas.
      // Permitir desactivar esta verificación vía ENV o por endpoint conocido.
      const skipEnsure = process.env.STORAGE_SKIP_ENSURE_BUCKET === 'true' ||
        (this.endpoint && /digitaloceanspaces\.com/i.test(this.endpoint));
      if (skipEnsure) {
        return;
      }

      if (this.s3Client) {
        try {
          // Verificar si el bucket existe
          await this.s3Client.send(
            new HeadBucketCommand({ Bucket: bucket })
          )
        } catch (error: any) {
          // Si el error es 404, el bucket no existe y hay que crearlo
          if (error.$metadata?.httpStatusCode === 404) {
            const createBucketParams: any = {
              Bucket: bucket,
            }
            
            // us-east-1 no requiere LocationConstraint
            if (this.region !== 'us-east-1') {
              createBucketParams.CreateBucketConfiguration = {
                LocationConstraint: this.region,
              }
            }
            
            await this.s3Client.send(new CreateBucketCommand(createBucketParams))
          } else {
            throw error
          }
        }
      }
    } catch (error) {
      throw new Error(`Failed to ensure bucket exists: ${error}`)
    }
  }
}

export const storageService = StorageService.getInstance()
