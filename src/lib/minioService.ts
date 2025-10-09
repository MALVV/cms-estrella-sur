import { Client } from 'minio'

const minioClient = new Client({
  endPoint: process.env.MINIO_ENDPOINT || 'localhost',
  port: parseInt(process.env.MINIO_PORT || '9000'),
  useSSL: process.env.MINIO_USE_SSL === 'true',
  accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
  secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin',
})

export interface UploadOptions {
  bucket?: string
  isPublic?: boolean
  contentType?: string
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

export class MinIOService {
  private static instance: MinIOService
  private client: Client

  constructor() {
    this.client = minioClient
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
    const {
      bucket = 'default',
      isPublic = false,
      contentType = 'application/octet-stream'
    } = options

    try {
      // Ensure bucket exists
      await this.ensureBucketExists(bucket)

      // Generate unique filename
      const timestamp = Date.now()
      const randomString = Math.random().toString(36).substring(2, 15)
      const fileExtension = filename.split('.').pop()
      const uniqueFilename = `${timestamp}-${randomString}.${fileExtension}`
      const path = `${bucket}/${uniqueFilename}`

      // Upload file
      await this.client.putObject(
        bucket,
        uniqueFilename,
        file
      )

      // Generate URL
      const url = isPublic
        ? `${process.env.MINIO_PUBLIC_URL}/${bucket}/${uniqueFilename}`
        : await this.getPresignedUrl(bucket, uniqueFilename)

      return {
        filename: uniqueFilename,
        originalName: filename,
        mimeType: contentType,
        size: Buffer.isBuffer(file) ? file.length : Buffer.byteLength(file),
        url,
        bucket,
        path,
      }
    } catch (error) {
      throw new Error(`Failed to upload file: ${error}`)
    }
  }

  async deleteFile(bucket: string, filename: string): Promise<void> {
    try {
      await this.client.removeObject(bucket, filename)
    } catch (error) {
      throw new Error(`Failed to delete file: ${error}`)
    }
  }

  async getPresignedUrl(bucket: string, filename: string, expiry: number = 3600): Promise<string> {
    try {
      return await this.client.presignedGetObject(bucket, filename, expiry)
    } catch (error) {
      throw new Error(`Failed to generate presigned URL: ${error}`)
    }
  }

  async listFiles(bucket: string, prefix?: string): Promise<any[]> {
    try {
      const objectsList: any[] = []
      const stream = this.client.listObjects(bucket, prefix, true)
      
      return new Promise((resolve, reject) => {
        stream.on('data', (obj) => objectsList.push(obj))
        stream.on('error', reject)
        stream.on('end', () => resolve(objectsList))
      })
    } catch (error) {
      throw new Error(`Failed to list files: ${error}`)
    }
  }

  private async ensureBucketExists(bucket: string): Promise<void> {
    try {
      const exists = await this.client.bucketExists(bucket)
      if (!exists) {
        await this.client.makeBucket(bucket, 'us-east-1')
      }
    } catch (error) {
      throw new Error(`Failed to ensure bucket exists: ${error}`)
    }
  }
}

export const minioService = MinIOService.getInstance()
