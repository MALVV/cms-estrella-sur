// Re-exportar tipos y mantener compatibilidad hacia atrás
import { StorageService, UploadOptions, FileUploadResult } from './storage-service'

/**
 * MinIOService - Mantiene compatibilidad hacia atrás
 * Ahora usa internamente StorageService que soporta tanto MinIO como AWS S3
 * 
 * @deprecated Considera usar StorageService directamente para mejor claridad
 */
export class MinIOService {
  private static instance: MinIOService
  private storageService: StorageService

  constructor() {
    this.storageService = StorageService.getInstance()
  }

  static getInstance(): MinIOService {
    if (!MinIOService.instance) {
      MinIOService.instance = new MinIOService()
    }
    return MinIOService.instance
  }

  async uploadFile(
    file: Buffer | string,
    filename: string,
    options: UploadOptions = {}
  ): Promise<FileUploadResult> {
    return this.storageService.uploadFile(file, filename, options)
  }

  async deleteFile(bucket: string, filename: string): Promise<void> {
    return this.storageService.deleteFile(bucket, filename)
  }

  async getPresignedUrl(bucket: string, filename: string, expiry: number = 3600): Promise<string> {
    return this.storageService.getPresignedUrl(bucket, filename, expiry)
  }

  async listFiles(bucket: string, prefix?: string): Promise<any[]> {
    return this.storageService.listFiles(bucket, prefix)
  }
}

// Re-exportar tipos para compatibilidad
export type { UploadOptions, FileUploadResult }

export const minioService = MinIOService.getInstance()
