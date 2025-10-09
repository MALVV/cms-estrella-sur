const { Client } = require('minio')

const minioClient = new Client({
  endPoint: process.env.MINIO_ENDPOINT || 'localhost',
  port: parseInt(process.env.MINIO_PORT) || 9000,
  useSSL: process.env.MINIO_USE_SSL === 'true',
  accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
  secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin',
})

async function testMinIOConnection() {
  try {
    console.log('🔍 Testing MinIO connection...')
    
    // List buckets
    const buckets = await minioClient.listBuckets()
    console.log('✅ Connection successful!')
    console.log('📦 Available buckets:', buckets.map(b => b.name))
    
    // Test bucket operations
    const testBucket = 'test-bucket'
    const exists = await minioClient.bucketExists(testBucket)
    
    if (!exists) {
      await minioClient.makeBucket(testBucket, 'us-east-1')
      console.log(`✅ Test bucket '${testBucket}' created`)
      
      // Clean up test bucket
      await minioClient.removeBucket(testBucket)
      console.log(`✅ Test bucket '${testBucket}' removed`)
    }
    
    console.log('🎉 MinIO connection test completed successfully!')
  } catch (error) {
    console.error('❌ MinIO connection test failed:', error.message)
    process.exit(1)
  }
}

testMinIOConnection()
