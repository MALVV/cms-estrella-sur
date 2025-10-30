# Configuración de Amazon S3

Este documento explica cómo configurar el sistema para usar Amazon S3 como almacenamiento de imágenes.

## ¿Cómo funciona?

El sistema ahora soporta **tanto MinIO como AWS S3** de forma automática:

- **Si configuras las variables de AWS S3**, el sistema usará S3 automáticamente
- **Si no están configuradas**, usará MinIO (desarrollo local)

No necesitas cambiar ningún código, solo configurar las variables de entorno.

## Configuración de AWS S3

### 1. Crear un bucket en AWS S3

1. Ve a la [Consola de AWS S3](https://s3.console.aws.amazon.com/)
2. Crea un nuevo bucket con un nombre único (ej: `estrella-sur-images`)
3. Selecciona la región donde quieres almacenar las imágenes
4. Configura las políticas de acceso según tus necesidades:
   - **Público**: Si quieres que las imágenes sean accesibles públicamente
   - **Privado**: Si quieres usar URLs presignadas (recomendado para producción)

### 2. Crear credenciales de acceso

1. Ve a [IAM](https://console.aws.amazon.com/iam/)
2. Crea un usuario de IAM con políticas que permitan:
   - `s3:PutObject` - Subir archivos
   - `s3:GetObject` - Leer archivos
   - `s3:DeleteObject` - Eliminar archivos
   - `s3:ListBucket` - Listar archivos
   - `s3:CreateBucket` - Crear buckets (opcional, si quieres que se creen automáticamente)
   - `s3:HeadBucket` - Verificar existencia de buckets

3. Genera las credenciales de acceso (Access Key ID y Secret Access Key)

### 3. Configurar variables de entorno

Agrega las siguientes variables a tu archivo `.env`:

```env
# AWS S3 Configuration
AWS_S3_BUCKET="tu-bucket-name"
AWS_ACCESS_KEY_ID="tu-access-key-id"
AWS_SECRET_ACCESS_KEY="tu-secret-access-key"
AWS_REGION="us-east-1"  # La región donde creaste el bucket

# Opcional: URL pública personalizada (si usas CloudFront o dominio personalizado)
AWS_S3_PUBLIC_URL="https://cdn.tudominio.com"

# Opcional: Endpoint personalizado (solo si usas un servicio compatible con S3 que no sea AWS)
# Para AWS, déjalo vacío
AWS_S3_ENDPOINT=""
```

### 4. Configurar políticas del bucket (para archivos públicos)

Si quieres que las imágenes sean accesibles públicamente, agrega esta política al bucket:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::tu-bucket-name/*"
    }
  ]
}
```

**⚠️ Advertencia**: Solo usa esto si quieres que las imágenes sean públicas. Para archivos privados, el sistema generará URLs presignadas automáticamente.

## Configuración de CloudFront (Opcional pero Recomendado)

Para mejor rendimiento y costos, puedes configurar CloudFront como CDN:

1. Crea una distribución de CloudFront que apunte a tu bucket S3
2. Configura el dominio personalizado si lo deseas
3. Usa la URL de CloudFront en `AWS_S3_PUBLIC_URL`:

```env
AWS_S3_PUBLIC_URL="https://d1234567890abc.cloudfront.net"
# O si tienes dominio personalizado:
AWS_S3_PUBLIC_URL="https://cdn.tudominio.com"
```

## Migración desde MinIO

El código existente seguirá funcionando sin cambios. El sistema detectará automáticamente si usas S3 o MinIO según las variables de entorno configuradas.

### Migrar URLs existentes

Si ya tienes imágenes almacenadas en MinIO y quieres migrarlas a S3, necesitarás:

1. **Migrar los archivos físicos**: Usar herramientas como `aws s3 sync` o scripts personalizados
2. **Actualizar URLs en la base de datos**: Actualizar el campo `imageUrl` en las tablas correspondientes

## Ejemplo de uso

El servicio se usa exactamente igual que antes:

```typescript
import { MinIOService } from '@/lib/minioService'
// O directamente:
import { storageService } from '@/lib/storage-service'

const service = MinIOService.getInstance()

const result = await service.uploadFile(
  fileBuffer,
  'imagen.jpg',
  {
    bucket: 'tu-bucket',
    isPublic: true,
    contentType: 'image/jpeg'
  }
)

console.log(result.url) // URL de la imagen en S3
```

## Seguridad

### Credenciales

- **NUNCA** commits las credenciales en el repositorio
- Usa variables de entorno seguras
- En producción, usa IAM roles si es posible (en lugar de access keys)

### Políticas recomendadas

- Usa buckets privados con URLs presignadas para archivos sensibles
- Usa buckets públicos solo para contenido que realmente debe ser público
- Considera usar CloudFront con restricciones de acceso para mejor control

## Verificación

Para verificar que la configuración funciona:

1. Sube una imagen a través del sistema
2. Verifica que la URL generada sea de S3 (ej: `https://bucket-name.s3.region.amazonaws.com/...`)
3. Verifica que puedas acceder a la imagen en el navegador (si es pública)

## Troubleshooting

### Error: "No hay cliente de almacenamiento configurado"

Verifica que todas las variables de entorno de S3 estén configuradas correctamente.

### Error: "Access Denied"

- Verifica que las credenciales sean correctas
- Verifica que el usuario IAM tenga los permisos necesarios
- Verifica que el bucket exista y esté en la región correcta

### URLs no funcionan

- Si usas buckets públicos, verifica la política del bucket
- Si usas URLs presignadas, verifica que no hayan expirado (expiran en 1 hora por defecto)
- Si usas CloudFront, verifica que la distribución esté activa

