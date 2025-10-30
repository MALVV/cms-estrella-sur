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

    // Create news-images bucket
    const newsBucketName = 'news-images'
    const newsExists = await minioClient.bucketExists(newsBucketName)
    
    if (!newsExists) {
      await minioClient.makeBucket(newsBucketName, 'us-east-1')
      console.log(`✅ Bucket '${newsBucketName}' created successfully`)
    } else {
      console.log(`ℹ️  Bucket '${newsBucketName}' already exists`)
    }

    // Create events-images bucket
    const eventsBucketName = 'events-images'
    const eventsExists = await minioClient.bucketExists(eventsBucketName)
    
    if (!eventsExists) {
      await minioClient.makeBucket(eventsBucketName, 'us-east-1')
      console.log(`✅ Bucket '${eventsBucketName}' created successfully`)
    } else {
      console.log(`ℹ️  Bucket '${eventsBucketName}' already exists`)
    }

    // Create donation-proofs bucket (if not exists)
    const donationBucketName = 'donation-proofs'
    const donationExists = await minioClient.bucketExists(donationBucketName)
    
    if (!donationExists) {
      await minioClient.makeBucket(donationBucketName, 'us-east-1')
      console.log(`✅ Bucket '${donationBucketName}' created successfully`)
    } else {
      console.log(`ℹ️  Bucket '${donationBucketName}' already exists`)
    }

    // Create projects-images bucket
    const projectsBucketName = 'projects-images'
    const projectsExists = await minioClient.bucketExists(projectsBucketName)
    
    if (!projectsExists) {
      await minioClient.makeBucket(projectsBucketName, 'us-east-1')
      console.log(`✅ Bucket '${projectsBucketName}' created successfully`)
    } else {
      console.log(`ℹ️  Bucket '${projectsBucketName}' already exists`)
    }

    console.log('🎉 MinIO initialization completed successfully!')
  } catch (error) {
    console.error('❌ Error initializing MinIO:', error.message)
    process.exit(1)
  }
}

initializeMinIO()
