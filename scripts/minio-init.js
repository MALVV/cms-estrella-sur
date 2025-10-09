const { Client } = require('minio')

const minioClient = new Client({
  endPoint: process.env.MINIO_ENDPOINT || 'localhost',
  port: parseInt(process.env.MINIO_PORT) || 9000,
  useSSL: process.env.MINIO_USE_SSL === 'true',
  accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
  secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin',
})

async function initializeMinIO() {
  try {
    // Create default bucket
    const bucketName = 'default'
    const exists = await minioClient.bucketExists(bucketName)
    
    if (!exists) {
      await minioClient.makeBucket(bucketName, 'us-east-1')
      console.log(`✅ Bucket '${bucketName}' created successfully`)
    } else {
      console.log(`ℹ️  Bucket '${bucketName}' already exists`)
    }

    // Create public bucket
    const publicBucketName = 'public'
    const publicExists = await minioClient.bucketExists(publicBucketName)
    
    if (!publicExists) {
      await minioClient.makeBucket(publicBucketName, 'us-east-1')
      console.log(`✅ Bucket '${publicBucketName}' created successfully`)
    } else {
      console.log(`ℹ️  Bucket '${publicBucketName}' already exists`)
    }

    console.log('🎉 MinIO initialization completed successfully!')
  } catch (error) {
    console.error('❌ Error initializing MinIO:', error.message)
    process.exit(1)
  }
}

initializeMinIO()
